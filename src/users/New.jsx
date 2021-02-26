import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import '../App.css';
import './users.css';
import { withRouter } from 'react-router';
import axios from 'axios';
import { sendLoginData } from '../store/Store';
import { connect } from 'react-redux';

const  New = (props)=>{

  const[show,setShow] =useState({
    display: 'none'
  })

  const[state, setState] = useState({
    name: '',
    email: '',
    password: '',
    confirmation: ''
  })
  

  const loginComponent = ()=>{
    props.history.push('/login')  
  }
  const userInput = (e)=>{
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setState({...state, [name]: value});
  }
  const sendUserParameter = (e)=>{
    e.preventDefault();
    if(state.password === state.confirmation){
      let data = {
        name: state.name,
        email: state.email,
        password: state.password,
        confirmation: state.confirmation
      }
      setShow({display: 'none'});
      axios.post('https://uematsu-backend.herokuapp.com/users', data)
      .then(function (response) {
        let action = sendLoginData(response.data.userData);
        props.dispatch(action);
        response.data.userData.admin === true? props.history.push('/orders') :  props.history.push('/users/show');

        /*railsからメッセージ*/
        alert("お知らせ】" +response.data.message); 
        
        setState({
          name: '',
          email: '',
          password: '',
          confirmation: ''
        })
      })
      .catch(function(){
        alert('error');
      })
    }
    /*password不一致警告解除*/
    else{
      setShow({display: 'block'});
    }


    /*自動ログイン状態*/
    let data = {
      name: state.name,
    }
    axios
    .post('https://uematsu-backend.herokuapp.com/users/user_show', data)
    .then((res)=>{
      
    })
    .catch((error)=>{
        console.log(error);
    })       
  }
  return(
   <>
      <div className="text-center mt-5 mb-4">
        <h2 data-testid="userNewtitle">新規会員登録</h2>
      </div>
      <Row>
        <Col md={{ span: 4, offset: 4 }} className="pt-3 pl-5 pr-5 pb-4 bg-light shadow">
        <Button 
          variant="secondary" 
          onClick={loginComponent}
          className="mb-3"
        >
         戻る
        </Button>
          <Form onSubmit={sendUserParameter}>
            <Form.Group>
              <Form.Label>お名前</Form.Label>
              <Form.Control type="text" name="name" placeholder="*必須です。" className="h8" required onChange={userInput} value={state.name} />
            </Form.Group>

            <Form.Group>
              <Form.Label>メールアドレス</Form.Label>
              <Form.Control type="email" name="email" placeholder="*必須です。" required onChange={userInput} value={state.email} />
            </Form.Group>

            <Form.Group>
              <Form.Label>パスワード</Form.Label><br/>
              <div class="balloon1" style={show}>
                <p>パスワードが一致してません。</p>
              </div>
              <Form.Control type="password" name="password" placeholder="*必須です。" required onChange={userInput} value={state.password} />
             
            </Form.Group>

            <Form.Group>
              <Form.Label>パスワード確認</Form.Label><br />
              <div class="balloon1" style={show}>
                <p>パスワードが一致してません。</p>
              </div>
              <Form.Control type="password" name="confirmation" placeholder="*もう一度入力ください。" required onChange={userInput}
                value={state.confirmation}
               />
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
export default withRouter(connect((state)=>state)(New))