import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { Pagination } from 'react-bootstrap';
import { connect } from 'react-redux';
import { customers } from './setting';



const  UserPagination = (props)=>{
  /*********************ステート******************************** */
  const[group, setGroup] = useState(0);
    let localData = JSON.parse(localStorage.getItem('users'))
   
    let active = props.No +1;
    let items = [];



    if(localData){
      let paginationLength =  customers(localData).length;
      if(group === 0 &&  Math.round(paginationLength) > 5 && Math.round(paginationLength / 2) > 5 ){  /*初期のページネーション データ5以上 かつ表示ボタン5以下*/
        for (let number = 1; number <= 5; number++) {
          items.push(
            <Pagination.Item key={number} active={number === active} onClick={()=>sendNumber(number-1)}>
              {number}
            </Pagination.Item>,
          );
        }
        items.push(
          <Pagination.Last onClick={()=>groupPlus()}/>
        );
      }
      /********************************************************************************* */
      else if(group === 0 &&  Math.round(paginationLength) <5 || Math.round(paginationLength / 2) < 5 ){   /*初期のページネーション データ5以下 または表示ボタン5以下*/
        for (let number = 1; number <= Math.round(paginationLength /2); number++) {
          items.push(
            <Pagination.Item key={number} active={number === active} onClick={()=>sendNumber(number-1)}>
              {number}
            </Pagination.Item>,
          );
        }
      }
      /********************************************************************************* */
      else if(group >=1 && paginationLength > (group + 1) * 2 * 5 ){
        items.push(
          <Pagination.First onClick={()=>groupMinus()} />
        );
        for (let number = group * 5 + 1; number <=  (group + 1) * 5 ; number++) { /*次の５のばいすうこえる*/
          items.push(
            <Pagination.Item key={number} active={number === active} onClick={()=>sendNumber(number-1)}>
              {number}
            </Pagination.Item>,
          );
        }
        if(paginationLength > ( group + 1)*2 *5 ){ /*全体のレコード数からぜんかいの５の倍数をひいたかずよりつぎの５の倍数が上回るとき*/
         items.push(
            <Pagination.Last onClick={()=>groupPlus()} />
          );
         }
      }
      /******************************************************************************************* */
      else if(group >=1 && paginationLength  < (group + 1)*2 * 5 ){   /*次の５のばいすうこえない*/
        items.push(
          <Pagination.First onClick={()=>groupMinus()} />
        );
        for (let number = group * 5 + 1; number <=  Math.round(paginationLength /2)  ; number++) {
          items.push(
            <Pagination.Item key={number} active={number === active} onClick={()=>sendNumber(number-1)}>
              {number}
            </Pagination.Item>,
          );
        }
       /* if(Math.round(paginationLength /2) *group * 5 <= paginationLength ){ /*５の倍数で分けているため数字x5が実際のユーザー数より多ければ進む表示*/
         /* items.push(
            <Pagination.Last onClick={()=>groupPlus()} />
          );
        }*/
        
      }
    }
  /************************ページネーション処理**************************************** */
  const sendNumber =(num)=>{
      props.paginationSend(num);
  }
  /************************ページネーション戻るボタン処理**************************************** */
  const groupMinus = () =>{
    setGroup(group -1);
  }
   /************************ページネーション進むボタン処理**************************************** */
   const groupPlus = () =>{
    setGroup(group + 1);
  }
  return(
   <>
    <Pagination >{items}</Pagination>
   </>
  )
}
export default withRouter(connect((state)=>state)(UserPagination))