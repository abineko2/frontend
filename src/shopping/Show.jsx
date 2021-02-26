import React, {useState } from 'react';
import { Row, Col, Button, Table } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faTruck, faClipboard } from "@fortawesome/free-solid-svg-icons";
import { chartSend } from '../store/Store';

const font ={
  fontSize: '24px'
}

const  Show = (props)=>{
/******************************ログイン/未ログイン切り替え********************************************************** */
    const loginUserCheck = ()=>{
      if(props.userData.length===0){
        props.history.push('/login');  
      }
    }
   useState(loginUserCheck);

    /*ステータスによる条件訳*/

    const statusLayout = ()=>{
      switch (props.show.status) {
        case 0:
          return <div className="bg-info text-white text-center">申請中</div>;
        case 1:
          return <div className="bg-warning text-white text-center">加工済み</div>;
        case 2:
          return <div className="bg-danger text-white text-center">受け渡し済み</div>;
        default:
          break;
      }
    }
    /* ステータス変更サーバー送信 */
    
    const sendStatusNumber = (num)=>{

       /* rails側への送信*/
      
       const params = {
        id: props.show.id,
        name: props.show.user_name,
        status: num
      }
      axios.patch(`https://uematsu-backend.herokuapp.com/shoppings/${props.show.id}`, params)
      .then(function (response) {
        /*処理後更新*/
         axios
            .get('https://uematsu-backend.herokuapp.com/shoppings')
            .then((res)=>{
              localStorage.removeItem('shoppings');
              localStorage.setItem('shoppings', JSON.stringify(res.data));
              props.history.push('/shoppings');
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
        /*railsからメッセージ*/
        alert(response.data.message); 
        
      })
      .catch(function(){
        alert('error');
      })
     
    }
    
  return(
   <>
    <div className="text-center mt-5">
      <h2 className="font-weight-bold">注文状況確認/変更</h2>
    </div>
    <Row>
      < Col md={{ span: 8, offset: 2 }} className="p-5 bg-light shadow">
        {props.show? 
          <div>
          {/*　注文情報 */ }

          <Table bordered>
            <tbody>
              <tr>
                <th className="bg-primary text-white">商品名</th>
                <td colSpan="3" className="font-weight-bold">{props.show.name}</td>
              </tr>
              <tr>
                <th className="bg-primary text-white">お客様名</th>
                <td colSpan="3" className="font-weight-bold">{`${props.show.user_name}様`}</td>
              </tr>
              <tr>
                <th className="bg-primary text-white">価格</th>
                <td className="font-weight-bold">{props.show.price}</td>
                <th className="bg-primary text-white">注文数</th>
                <td className="font-weight-bold">{props.show.num}</td>
              </tr>
              <tr>
                <th className="bg-primary text-white">合計金額</th>
                <td className="font-weight-bold">{Number(props.show.price) * Number(props.show.num)}</td>
                <th className="bg-primary text-white">注文状況</th>
                <td className="font-weight-bold">{statusLayout()}</td>
               
              </tr>
            </tbody>
          </Table>

          {/* 変更エリア */}
           <p className="font-weight-bold">現在の注文商品の状況を変更するには<br/>対応するボタンを押してください。</p>
           <fieldset className="bg-secondary p-2">
            {props.show.status === 0? 
              <>
                 <Button 
                    variant="warning"
                    className="btn-block p-4 font-weight-bold text-light "
                    onClick={()=>sendStatusNumber(1)}
                    style={font}
                  >
                  <FontAwesomeIcon icon={faUtensils } />&nbsp;
                   商品加工済み
                 </Button>
                 <Button 
                    variant="danger"
                    className="btn-block p-4 font-weight-bold text-white"
                    onClick={()=>sendStatusNumber(2)}
                    style={font}
                  >
                    <FontAwesomeIcon icon={faTruck } />&nbsp;
                   商品受け渡し済み
                 </Button>
              </>
              : 
              /* ステータス加工済み */
              
              props.show.status === 1 ? 
              <>
                 <Button 
                    variant="primary"
                    className="btn-block p-4 font-weight-bold text-white "
                    onClick={()=>sendStatusNumber(0)}
                    style={font}
                  >
                  <FontAwesomeIcon icon={ faClipboard  } />&nbsp;
                   申請中に変更
                 </Button>
                 <Button 
                    variant="danger"
                    className="btn-block p-4 font-weight-bold text-white"
                    onClick={()=>sendStatusNumber(2)}
                    style={font}
                  >
                    <FontAwesomeIcon icon={ faTruck } />&nbsp;
                   商品受け渡し済み
                 </Button>
              </>
              : 
               /* ステータス受け渡し済み */

               <>
               <Button 
                  variant="primary"
                  className="btn-block p-4 font-weight-bold text-white "
                  onClick={()=>sendStatusNumber(0)}
                  style={font}
                >
                <FontAwesomeIcon icon={ faClipboard  } />&nbsp;
                 申請中に変更
               </Button>
               <Button 
                    variant="warning"
                    className="btn-block p-4 font-weight-bold text-light "
                    onClick={()=>sendStatusNumber(1)}
                    style={font}
                  >
                  <FontAwesomeIcon icon={faUtensils } />&nbsp;
                   商品加工済み
                 </Button>
            </>

            }
           </fieldset>
          </div>
           : 
          ''
        }
      </Col>
      </Row>
   </>
  )
}
export default withRouter(connect((state)=>state)(Show))
