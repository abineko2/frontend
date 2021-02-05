import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Table } from 'react-bootstrap';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,ResponsiveContainer } from 'recharts';

 function PcIndex(props){
  
  const datas = props.chartData;
  
/******************************ログイン/未ログイン切り替え********************************************************** */
    const loginUserCheck = ()=>{
      if(props.userData.length===0){
        props.history.push('/login');  
      }
    }
    useState(loginUserCheck()); 

  return(
    <div>
       <div className="text-center text-white mt-4">
        　<h1 className="font-weight-bold">売上速報</h1>
          <h3 className="font-weight-bold">【2月】</h3>
       </div>
       <ResponsiveContainer width="100%" height={300} className="bg-white">
            <BarChart  data={datas} margin={{ top: 5, right: 0, left: 10, bottom: 5, }}>
            　　 <CartesianGrid strokeDasharray="3 3" />
            　　　<XAxis dataKey="date" /><YAxis />
            　　　<Tooltip />
                <Legend />
                <Bar dataKey="total" fill="orange" />
            </BarChart>
        </ResponsiveContainer>

        <div className="text-center font-weight-bold text-white mt-4">
            <h1 className="font-weight-bold">【売上実績】</h1>
        </div>
        <div className="bg-white p-5 pt-2 pb-2">
          <Table bordered>
              <thead>
                  <tr>
                      <th rowSpan="2" className="bg-primary text-white font-weight-bold text-center align-middle">日付</th>
                      <th rowSpan="2" className="bg-primary text-white font-weight-bold text-center align-middle">曜日</th>
                      <th colSpan="3" className="bg-primary text-white font-weight-bold text-center">売上</th>
                  </tr>
                  <tr>
                    <th className="bg-primary text-white font-weight-bold text-center">販売数</th>
                    <th className="bg-primary text-white font-weight-bold text-center">売上金額</th>
                    <th className="bg-primary text-white font-weight-bold text-center">構成比</th>
                  </tr>
              </thead>
              <tbody>
                  {datas.map((data)=>(
                      <tr>
                        <td className="font-weight-bold text-center">{data.day}</td>
                        <td className="font-weight-bold text-center">{data.week}</td>
                        <td className="font-weight-bold text-center">{data.num}</td>
                        <td className="font-weight-bold text-center">{data.total}</td>
                        <td className="font-weight-bold text-center"></td>
                      </tr>
                  ))}
              </tbody>
          </Table>
        </div>
    </div>  
  )
}
export default withRouter(connect((state)=>state)(PcIndex))