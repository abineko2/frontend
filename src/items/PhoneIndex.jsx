import { useState } from 'react';
import { Row, Col, Table, Button,Modal, Image } from 'react-bootstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const itemLink ={
  border: 'none',
  background: 'none',
  color: '#333399',
  outline: 'none',
  fontWeight: 'bold',
  textDecoration: 'underline',
  
}
const image={
  width: '80px',
  height: '80px'
}
const imageShow={
  width: '150px',
  height: '150px'
}
const buttonWidth={
  width: '31%'
}


 function PcIndex(props){
  let localData = JSON.parse(localStorage.getItem('items'))
  let modalData = [];


  /************************ステート*************************************** */
  const[itemData, setState] = useState(
    localData ? localData : []
  )
  /*--モーダル--*/
  const [show, setShow] = useState({
    status: false,
    data: []
  });

  const handleClose = () => setShow({status: false, data: show.data});
  
  /*************APIによるitem一覧**********************************/
  /*async function itemsCall(){
    await axios
      .get('https://uematsu-backend.herokuapp.com/items')
      .then((res)=>{
         localStorage.removeItem('items');
         setState(res.data);
         localStorage.setItem('items', JSON.stringify(res.data));
      })
      .catch((error)=>{
         console.log(error);
      })
     
   }
   useState(itemsCall());*/
  
/******************************ログイン/未ログイン切り替え********************************************************** */
    const loginUserCheck = ()=>{
      if(props.userData.length===0 && props.itemData === null){
        props.history.push('/login');  
      }
    }

  useState(loginUserCheck());
  
   const newPage = ()=>{
    props.history.push('/items_new')
   }
   /****************************編集**************************************** */
   const editPage = (item)=>{
    props.editPage(item);
    props.history.push("/items_edit");
  } 
  /*****************************削除********************************************* */
  const deleteItem = (i)=>{
    if(window.confirm('削除してよろしいですか？')){
      axios
       .delete(`https://uematsu-backend.herokuapp.com/items/${i}`)
       .then((response)=>{
         alert(response.data.message); 
       })
       .catch((error)=>{
          console.log(error);
       })
    
    }
  }
  /****************************ページ更新**************************************** */
  const updateItems = ()=>{
    alert('items');
   } 
  /*****************************加工ページ********************************************* */
  const processItem = (item)=>{
    props.processItem(item);
    props.history.push('/items_process');
  }
  /*****************************モーダル開く********************************************** */
  const openModal = (item)=>{
    modalData.splice(0);
    modalData.push(item);
  
    setShow({
      status: true,
      data: modalData
    })
  }
  return(
    <div className="w-100">
      <div className="text-center mt-5 mb-4">
        <h2 data-testid="itemstitle">商品一覧</h2>
      </div>
      <Button　
        variant="primary"
        className="mb-2"
        onClick={updateItems}
      >更新</Button>
<div class="bg-white p-2"></div>
      <div className="bg-white w-100">
          <Button 
            className="mb-1"
            variant="primary"
            onClick={newPage}
          >新規商品登録</Button>
          <p>【商品一覧】</p>
         
          {itemData.length > 0 ?
            <Table bordered hover>
              <tbody>
                {itemData.map((item,i)=>(
                  <tr>
                    <Table bordered>
                      <tbody>
                        <tr>
                          <td>
                            <Image src={`http://yukiabineko.sakura.ne.jp/react/${item.name}.jpg`} alt="表示できません" style={image} roundedCircle />
                          </td>

                          <td colSpan="4" className="align-middle">
                            <button 
                              style={itemLink} 
                              onClick={(i)=>openModal(item)}
                            >商品名:{item.name}</button>
                          </td>
                        </tr>

                        <tr>
                          <th className="text-center align-middle bg-dark text-white">価格</th>
                          <td className="text-right text-danger align-middle font-weight-bold">{item.price}</td>
                          <th className="text-center align-middle bg-dark text-white">分類</th>
                          <td className="align-middle">{item.category}</td>
                        </tr>

                        <tr>
                          <td colSpan="4" className="align-middle">
                            <Button 
                                style={buttonWidth}
                                variant="primary"
                                onClick={(i)=>editPage(item)}
                                
                              >編集</Button>

                            <Button 
                                style={buttonWidth}
                                variant="primary"
                                onClick={(i)=>processItem(item)}
                                className="ml-2 mr-2"
                              >加工法管理</Button>
                            
                            <Button 
                                style={buttonWidth}
                                variant="danger"
                                onClick={(i)=>deleteItem(item.id)}
                               
                              >削除</Button>
                          </td>
                        </tr>


                      </tbody>
                    </Table>
                   
                   
                  </tr>
                ))}
              </tbody>
               
            </Table>
            :
            <div className="text-center bg-info text-white font-weight-bold p-5 mt-3">
              データを表示できません。
            </div>
            }
      </div>
      <Modal
         show={show.status}
         onHide={handleClose}
         backdrop="static"
         keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="font-weight-bold">
             {show.data.length ===0? '' : `${show.data[0].name}詳細`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered>
           <tbody>  
             <tr>
               <td colSpan="2" className="text-center">
                <Image 
                  src={show.data.length ===0? '' : `http://yukiabineko.sakura.ne.jp/react/${show.data[0].name}.jpg`} 
                  alt="表示できません" 
                  style={imageShow} 
                  rounded 
                />
               </td>
             </tr>
             <tr>
               <th className="bg-primary text-white">商品名</th>
               <td className="text-center font-weight-bold">{show.data.length ===0? '' : show.data[0].name}</td>
             </tr>
             <tr>
               <th className="bg-primary text-white">価格</th>
               <td className="text-center font-weight-bold">{show.data.length ===0? '' : show.data[0].price}</td>
             </tr>
             <tr>
               <th className="bg-primary text-white">カテゴリー</th>
               <td className="text-center font-weight-bold">{show.data.length ===0? '' : show.data[0].category}</td>
             </tr>
             {show.data.length ===0? 
               '' 
                : 
               <tr>
                 <th className="bg-primary text-white align-middle">可能調理法</th>
                 <td>
                   {show.data[0].processes.map((process)=>(
                     <td>{process}</td>
                   ))}
                 </td>
               </tr>
             }
             <tr>
               <th colSpan="2" className="text-center bg-primary text-white">商品説明</th>
             </tr>
             <tr>
               <td colSpan="2">{show.data.length ===0? '' : show.data[0].info}</td>
             </tr>
           </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  )
}
export default withRouter(connect((state)=>state)(PcIndex))