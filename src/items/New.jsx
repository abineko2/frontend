import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router';
import axios from 'axios';
import { connect } from 'react-redux';

const  New = (props)=>{

  const[show,setShow] =useState({
    display: 'none'
  })
  const[image, setImage] = useState({
    file: null
  })

  const[state, setState] = useState({
    name: '',
    price: '',
    category: '',
    info: ''
  })
  /******************************ログイン/未ログイン切り替え********************************************************** */
  const loginUserCheck = ()=>{
    if(props.userData.length===0){
      props.history.push('/login');  
    }
  }
 useState(loginUserCheck());

  const indexComponent = ()=>{
    props.history.push('/items')  
  }
  const updateFile = (e)=>{
    setImage({
      file: e.target.files[0]
    })
  }
  const itemInput = (e)=>{
   const target = e.target;
   const name = target.name;
   const value = target.value;
   setState({...state, [name]: value})
  }
  const sendItemParameter = (e)=>{
    e.preventDefault();
    if(state.category === ''){
      setShow({display: 'block'});
    }
    else{
      /* PHPへの送信 */
      const params = new FormData();
      params.append('file', image.file);
      params.append('name', state.name);
      axios.post('https://yukiabineko.sakura.ne.jp/send-react.php',
      　　　　　　　params,
                  {
                    headers:{
                      'content-type': 'multipart/form-data',
                    },
                  }
      ).then((res)=>{
          console.log(res.data);
      }).catch(()=>{
      })


      /* rails側への送信*/
      
      let data = {
        name: state.name,
        price: state.price,
        category: state.category,
        info: state.info
      }
      axios.post('https://uematsu-backend.herokuapp.com/items', data)
      .then(function (response) {

        /* 商品一覧更新*/
        axios
          .get('https://uematsu-backend.herokuapp.com/items')
          .then((res)=>{
            localStorage.removeItem('items');
            setState(res.data);
            localStorage.setItem('items', JSON.stringify(res.data));
            props.history.push('/items')
          })
          .catch((error)=>{
            console.log(error);
          })

        /*railsからメッセージ*/
        alert(response.data.message); 
        setState({
          name: '',
          price: '',
          category: '',
          info: ''
        })
      })
      .catch(function(){
        alert('error');
      })
      setShow({display: 'none'});
    }
    setImage({
      file: null
    })
  }
  return(
   <>
      <div className="text-center mt-5 mb-4">
        <h2 data-testid="userNewtitle">新規商品登録</h2>
      </div>
      <Row>
        <Col md={{ span: 4, offset: 4 }} className="pt-3 pl-5 pr-5 pb-4 bg-light shadow">
        <Button 
          variant="secondary" 
          onClick={indexComponent}
          className="mb-3"
        >
         戻る
        </Button>
          <Form onSubmit={sendItemParameter}>
            <Form.Group>
              <Form.File  label="商品画像" multiple accept="image/*" onChange={updateFile} />
            </Form.Group>
            <Form.Group>
              <Form.Label>商品名</Form.Label>
              <Form.Control type="text" name="name" placeholder="*必須です。" className="h8" required onChange={itemInput} value={state.name} />
            </Form.Group>

            <Form.Group>
              <Form.Label>価格</Form.Label>
              <Form.Control type="price" name="price" placeholder="*必須です。" required onChange={itemInput} value={state.price} />
            </Form.Group>

            <Form.Group>
              <Form.Label>カテゴリー</Form.Label>
              <div class="balloon1" style={show}>
                <p>選択してください。</p>
              </div>
                <Form.Control as="select" name="category" value={state.category} onChange={itemInput}>
                  <option value="">選択してください  </option>
                 {["青魚","白身魚","大型魚","いか、タコ","貝","その他"].map((value, i)=>
                   <option key={i} value={value}>{value}</option>
                 )}
                </Form.Control>
            </Form.Group>
               
            <Form.Group>
              <Form.Label>商品説明</Form.Label>
              <textarea 
                name="info" 
                cols="30" 
                rows="10" 
                value={state.info}
                onChange={itemInput}
                className="form-control">{state.info}</textarea>
            </Form.Group>

              <Button 
                type="submit" 
                variant="primary" 
                className="btn-block mt-4">
                  送信
              </Button>
          </Form>
          
        </Col>
      </Row>
   </>
  )
}
export default withRouter(connect(state=>state)(New));