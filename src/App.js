import React, { useState } from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import "./App.css";
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Index from './users/Index';
import Login from './Login';
import userNew from './users/New'
import Edit from './users/Edit'
import { connect } from "react-redux";
import { logoutAction } from './store/Store';


 function App(props){
  const[state, setState] = useState({
    editId: 0,
    deleteId: 0,
    login: false
  })
  const userlogout = ()=>{
    let action = logoutAction();
    props.dispatch(action);
    setState({
      editId: state.editId,
      deleteId: state.deleteId,
      login: false
    })
  }
  const getEditId = (id)=>{

    setState({
      editId: id,
      deleteId: state.deleteId
    })
  }
  
  return(
    <BrowserRouter>
     <Navbar bg="dark">
        <Navbar.Brand href="#home"　className="text-white font-weight-bold">加工依頼アプリ</Navbar.Brand>
        <Nav className="mr-auto">
        <Nav.Item className="text-info">{props.userData.length >0  ?`${props.userData[0].name}さん`: ''}</Nav.Item>
          <Nav.Item><Link to="/" className="text-light p-3">HOME</Link></Nav.Item>
        </Nav>
        <Nav className="mr-right">
          {props.userData.length >0? 
           <Nav.Item>
             <button 
              className="logout"
              onClick={userlogout}
            >ログアウト</button>
           </Nav.Item>
          : 
          <Nav.Item><Link to="/login" className="text-light p-3">ログイン</Link></Nav.Item>
          }
         
        </Nav>
      </Navbar>
      <Route exact path="/" render={()=><Index editIdget={(id)=>getEditId(id)} Login={state.login} />} /> 
      <Route path="/login" render={()=><Login />} />
      <Route path="/users/new" component={userNew} />
      <Route path="/users/edit" render={ () => <Edit id={state.editId} />} />
    </BrowserRouter>
  )
}
export default connect((state)=>state)(App)



/*
componentDidMount() {
    const fetchInit = {
      method: "GET",
      headers: { "content-type": "application/json" }
    };

    fetch(new URL(process.env.REACT_APP_SERVER_URL), fetchInit)
      .then(response => response.json())
      .then(response => this.setState(response));
  }
*/