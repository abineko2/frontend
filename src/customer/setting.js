
/*買い物かごで同一商品が含まれているのかをチェック あればaddされない*/

import { data } from "jquery";

export const sameItemCheck = (datas, name, process)=>{
  let sameItemCount = 0;
  datas.map((data)=>{
    if((data.name === name) && (data.process === process)){
        sameItemCount ++ ;
    }
  });
  if(sameItemCount >0){
      return true;
  }
  else{
      return false;
  }
}

/*セレクト時商品選択されていないかチェック*/

export const selectItemCheck = (name)=>{
   if(name === '--加工法を選択してください--' || name === ''){
        return false
   }
   else{
       return true;
   }
}

/*セレクト時ローカルストレージ在庫更新*/

export const localstorageChange = (name,stock, datas)=>{
  
  datas.map((data)=>{
    if(data.name === name){
      data.stock = stock;
    }
  });
 return datas;
}

/*注文確認ボタンにて削除ボタン押し下時に大元propsの在庫反映*/

export const pushDeleteButtonTolocalData = (name,orderNumber,datas)=>{
  datas.map((data)=>{
    if(data.name === name){
      let localnum = Number(data.stock);
      localnum += Number(orderNumber);
      data.stock = localnum;
    }
  });
  
}
/* カートの時間のチェック*/
export const cartValidate = (datas)=>{
  let check = true;
  datas.map((data)=>{
    data.time == "" ? check = false : check = true;
  })
  return check;
}