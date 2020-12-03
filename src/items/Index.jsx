import { useEffect, useState } from 'react';
import { Row, Col, Table, Button,Modal } from 'react-bootstrap';
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


 function Index(props){
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
  async function itemsCall(){
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
   useState(itemsCall());
  
/******************************ログイン/未ログイン切り替え********************************************************** */
    const loginUserCheck = ()=>{
      if(props.userData.length===0){
        props.history.push('/login');  
      }
    }
   useEffect(()=>{
     loginUserCheck();
   })
   const newPage = ()=>{
    props.history.push('/items_new')
   }
   /****************************編集**************************************** */
   const editPage = (id)=>{
    props.itemEditIdget(id);
    props.history.push("/items_edit");
  } 
  /************************************************************************** */
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
    <div className>
      <div className="text-center mt-5 mb-4">
        <h2 data-testid="itemstitle">商品一覧</h2>
      </div>
      <Row>
        <Col md={{ span: 8, offset: 2 }} className="p-5 bg-light shadow">
          <Button 
            variant="primary"
            onClick={newPage}
          >新規商品登録</Button>
         
          {itemData.length > 0 ?
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="text-center align-middle bg-dark text-white">商品名</th>
                  <th className="text-center align-middle bg-dark text-white">価格</th>
                  <th className="text-center align-middle bg-dark text-white">カテゴリー</th>
                  <th className="text-center align-middle bg-dark text-white"></th>
                </tr>
              </thead>
              <tbody>
                {itemData.map((item,i)=>(
                  <tr>
                    <td>
                      <button 
                         style={itemLink} 
                         onClick={(i)=>openModal(item)}
                       >{item.name}</button>
                    </td>
                    <td className="text-right text-danger">{item.price}</td>
                    <td>{item.category}</td>
                    <td>
                    <Button 
                        variant="primary"
                        onClick={(i)=>editPage(item.id)}
                        className="ml-3"
                      >編集</Button>
                    <Button 
                        variant="danger"
                        onClick={(i)=>deleteItem(item.id)}
                        className="ml-3"
                      >削除</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
               
            </Table>
            :
            <div className="text-center bg-info text-white font-weight-bold p-5 mt-3">
              データを表示できません。
            </div>
            }
        </Col>
      </Row>
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
export default withRouter(connect((state)=>state)(Index))