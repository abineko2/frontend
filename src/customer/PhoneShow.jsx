import React, { useState } from 'react';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { cartsAdd } from '../store/Store';
import { sameItemCheck,  selectItemCheck } from './setting';

const table ={
  width: '100%',
  border: '1px solid #c0c0c0'
}
const select={
  width:'30%',
  height:'40px'
}

/**************************************************************************************** */

const  Show = (props)=>{
  const[state, setState] = useState({
    number: null,
    process: '',
    time: null,
    total: props.itemData? props.itemData.price : 0
  })
  const stockOption = ()=>{
    let array = []
    for(let i=0; i<=Number(props.itemData.stock); i++){
       array.push(i)
    }
    return array
  }
  /******************************ログイン/未ログイン切り替え********************************************************** */
const loginUserCheck = ()=>{
  if(props.userData.length===0){
    props.history.push('/login');  
  }
}
useState(loginUserCheck());
 /********************************カテゴリーの配列化************************************************** */
 const categoryArray = ()=>{
   return  props.itemData.process.split(',')
 }
 /********************************注文数変更************************************************** */
 const numberChange = (e)=>{
   setState({
     number: e.target.value,
     process: state.process, 
     time: state.time,
     total:  Number(props.itemData.price) * Number(e.target.value)
   })
}
/********************************加工方法変更************************************************** */
const processChange = (e)=>{
  setState({
    number: state.number,
    process: e.target.value,
    time: state.time,
    total:  state.total
  })
}
/********************************受け取り時間************************************************** */
const timeChange = (e)=>{
  setState({
    number: state.number,
    process: state.process,
    time: e.target.value,
    total:  state.total
  })
}
/********************************サブミット************************************************** */

  const doSubmit = (e)=>{
    e.preventDefault();
    let propData = props.itemData;
    
    let check = sameItemCheck(props.buyCarts, propData.name, state.process);
    let stock = Number(props.itemData.stock);
    let minusNumber = Number(state.number);
    if(minusNumber > 0 &&  selectItemCheck(state.process)){
      if(!check){
        stock -= minusNumber;
        propData.stock = stock;
        props.changeItemData(propData);
        let action = cartsAdd({name: propData.name, num: state.number, price: propData.price, process:　state.process, time: state.time});
        props.dispatch(action);
        props.history.push('/customor/index');
      }
      else{
        alert('すでに注文しています。');
      }
    }
    else if(minusNumber ===0){
      alert('数量を入力してください。');
    }
    else if(! selectItemCheck(state.process)){
      alert('加工法を選択してください。');
    }
    else{
      alert('数量もしくは加工法が未入力です。');
    }
  }

/********************************************************************************************************************************** */
  return(
   <div className="w-100">
   {props.itemData? 
     <>
      <div className="text-center mt-5 mb-4  font-weight-bold">
        <h2 className="font-weight-bold text-info">{props.itemData.name}注文</h2>
      </div>
      <div className="w-100 bg-white">
            <form onSubmit={doSubmit} className="W-100">
             <Table  style={table}>
               <tbody>
                 <tr>
                   <Table bordered style={table}>
                     <tbody>
                      <tr>
                        <th className="bg-dark text-center text-white">商品名</th>
                        <td className="font-weight-bold text-center align-middle">{props.itemData.name}</td>
                      </tr>

                      <tr>
                        <th className="bg-dark text-center text-white">価格</th>
                        <td className="font-weight-bold text-center align-middle text-danger">{props.itemData.price}</td>
                      </tr>

                      <tr>
                        <th className="bg-dark text-center text-white">買い上げ数</th>
                        <td className="font-weight-bold text-center">
                          <select className="form-control" onChange={numberChange}>
                            {stockOption().map((num)=>(
                              <option>{num}</option>
                            ))}
                          </select>
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-dark text-center text-white">加工法</th>
                        <td className="font-weight-bold text-center align-middle">
                          <select className="form-control" onChange={processChange}>
                              <option value="">--加工法を選択してください--</option>
                              {categoryArray().map((process)=>(
                                <option>{process}</option>
                              ))}
                            </select>
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-dark text-center text-white">受け取り時間</th>
                        <td>
                          <input 
                              type="time" 
                              value={state.time}  
                              min="10:00" max="19:00"
                               required
                              className="form-control"
                              onChange={timeChange}
                          />
                        </td>
                      </tr>

                      <tr>
                        <th className="bg-dark text-center text-white">合計金額</th>
                        <td className="font-weight-bold text-center align-middle text-danger">{state.total}</td>
                      </tr>
                     
                     </tbody>
                   </Table>
                 </tr>
               </tbody>
             </Table>
              <div className="text-left">
                <input type="submit" value="追加"　className="btn btn-primary btn-lg btn-block" />
              </div>
             </form>
      </div>
     </>
     : 
     ''
     }
      
   </div>
  )
}
export default withRouter(connect((state)=>state)(Show))
