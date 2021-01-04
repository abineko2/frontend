import React from 'react';

/*注文された商品中受け渡し済み以外申請中と加工済みの件数検知*/

export const ordercheck = (datas) =>{
   let count = 0;
   let date = null;
  if(datas){
    datas.forEach(data => {
        if(data.status === 0 || data.status === 1){
            count += 1;
            date = data.shopping_date;
        }
    });
    return {
        count:  count + '件注文',
        date: date
    }
  }
  else{
    return '履歴なし';
  }
}
/* 注文された商品の履歴状況分岐  */

export const orderHistoryStatus = (status) =>{
  switch (status) {
    case 0:
      return <div className="bg-info text-white">注文中</div>
    case 1:
      return <div className="bg-info text-white">注文中</div>
    case 2:
      return <div className="font-weight-bold">完了済み</div>
    default:
      break;
  }
}
/****************************************************************************************************** */
/*日付の表示設定*/
export const daySetting = (date)=>{
  let newDate = new Date(date);
  let year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  let day = newDate.getDate();
  return year + '年' + month + '月' +day +'日';
}
/***************************************************************************************************** */
/*当日日付のみのデータ抽出 */

export const customerTodayOrders = (allData)=>{
  let todayOrder = [];

  /*本日*/
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  /*全データから抽出*/
  allData.forEach((data)=>{
    /*注文データ*/
    const createDate = new Date(data.shopping_date);
    const c_year = createDate.getFullYear();
    const c_month = createDate.getMonth() + 1;
    const c_day = createDate.getDate();
    if( year === c_year && month === c_month && day === c_day){
      todayOrder.push(data);
    }
  })
  return todayOrder;
}

