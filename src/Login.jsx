import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import './App.css'
import { withRouter } from 'react-router'
import axios from 'axios'
import { connect} from 'react-redux';
import { sendLoginData, searchSend, ordersSend, chartSend } from './store/Store';
import { circularLoading }  from '@yami-beta/react-circular-loading';


//プログレスステータス
const CircularLoading = circularLoading({
  num: 6,
  distance: 1,
  dotSize: 0.5,

});

const  Login = (props)=>{

  const[state, setState] = useState({
    email: '',
    password: '',
  })
  const[progress,setProgres] = useState(false)

  const newUserComponent = ()=>{
    props.history.push('/users/new');  
  }
  const accesslogin = (e)=>{
  
    e.preventDefault();
    setProgres(true);
    let data = {
      email: state.email,
      password: state.password,
    }
    axios.post('https://uematsu-backend.herokuapp.com/sessions', data)
      .then(function (response) {

        if(response.data.name){
            let action = sendLoginData(response.data);
            props.dispatch(action);
            /*railsからメッセージ*/
            alert('ログインしました'); 
            setState({
              name: '',
              email: '',
              password: '',
              confirmation: ''
            })
            let data2 = {
              user_id: response.data.id,
              num: 1
            }
            axios
                .get('https://uematsu-backend.herokuapp.com/users')
                .then((res)=>{
                    localStorage.setItem('users', JSON.stringify(res.data));
                    
                })
                .catch((error)=>{
                    console.log(error);
                })       
            axios.post('https://uematsu-backend.herokuapp.com/history/search', data2)
            .then(function (response) {
              let action = searchSend(response.data);
              props.dispatch(action);
            })
            .catch(function(){
              alert('error');
            })
             axios
            .get('https://uematsu-backend.herokuapp.com/users')
            .then((res)=>{
                localStorage.setItem('users', JSON.stringify(res.data));
                
            })
            .catch((error)=>{
                console.log(error);
            })
           axios
            .get('https://uematsu-backend.herokuapp.com/items')
            .then((res)=>{
              localStorage.removeItem('items');
              setState(res.data);
              localStorage.setItem('items', JSON.stringify(res.data));
            })
            .catch((error)=>{
              console.log(error);
            })
          
          axios
          .get('https://uematsu-backend.herokuapp.com/orders')
          .then((res)=>{
              localStorage.setItem('orders', JSON.stringify(res.data));
              let action = ordersSend(res.data);
              props.dispatch(action);
              if(localStorage.getItem('orders') && localStorage.getItem('users')){
                setProgres(false)
                response.data.admin === true? props.history.push('/orders') :  props.history.push('/users/show');
              }
             
          })
          .catch((error)=>{
              console.log(error);
          })
          axios
            .get('https://uematsu-backend.herokuapp.com/shoppings')
            .then((res)=>{
              localStorage.removeItem('shoppings');
              setState(res.data);
              localStorage.setItem('shoppings', JSON.stringify(res.data));
            })
            .catch((error)=>{
              console.log(error);
            })
          axios
            .get('https://uematsu-backend.herokuapp.com/sales')
            .then((res)=>{
                let action = chartSend(res.data);
                props.dispatch(action);
            })
            .catch((error)=>{
              console.log(error);
            })
       setState({
        
      })
        
          }
          else{
            setProgres(false)
            alert('ログイン失敗');
          }
      })
      .catch(function(err){
        alert(err);
      })
      
  }
  const inputText = (e)=>{
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setState({...state, [name]:value});
  }
  return(
   <>
    <div className="text-center mt-5 mb-4">
        <h2 className="text-secondary" data-testid="logintitle">ログイン</h2>
      </div>
       
      <Row>
        <Col md={{ span: 4, offset: 4 }} className="p-5 bg-light border shadow">
          {/* プログレス */}
     
          {progress ===true? 
            <div id="progress" className=" pl-2 pr-2  bg-white shodow">
              <p　className="mt-3 font-weight-bold">しばらくお待ちください。</p>
              <div className="text-center">
              <CircularLoading />
              </div>
            </div>
          : 
          ''
          }
          <Form onSubmit={accesslogin} data-testid="loginForm">
            <Form.Group>
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control 
                type="email" 
                name="email"
                placeholder="(例)sample@example.com" 
                className="h8" 
                onChange={inputText}
                required
                value={state.email}
                data-testid="ml"
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>パスワード</Form.Label>
              <Form.Control
                 type="password" 
                 name="password"
                 placeholder="(例)password" 
                 onChange={inputText}
                 required
                 value={state.password}
                 data-testid="ps"
              />
            </Form.Group>

              <Button 
                type="submit" 
                variant="primary" 
                className="btn-block mt-4">
                  送信
              </Button>

              <Button 
                variant="primary" 
                onClick={newUserComponent}
                className="btn-block mt-3">
                新規登録
              </Button>
          </Form>
          
        </Col>
      </Row>
   </>
  )
}
export default withRouter(connect((state)=>state)(Login))