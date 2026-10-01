import { useEffect, useState } from "react";
import Spreadsheet from "react-spreadsheet";
import { commongetrequest, commonpostrequest } from "../../../../AllServices/services";

const DummySpread = () => {
    const [columns, setColumns] = useState([])
    const [rows, setRows] = useState([])
    async function fetch(){
        const result=await commongetrequest("admin/matrix-entry")
        
        setColumns(Object.keys(result.data.data[0]).map(item=>item))
        setRows(result.data.data.map((item)=>Object.values(item).map((item,i)=>({value:item, readOnly: i===0}))))
    }
    useEffect(()=>{
        fetch()
    },[])
  const data = [
    [{ value: "Vanilla" }, { value: "Chocolate", readOnly:true, className:"bg-red-400 text-white" }],
    [{ value: "Strawberry" }, { value: "Cookies", readOnly: true }],
  ];
  return (
  <div style={{overflowX:"auto"}}><Spreadsheet data={rows} columnLabels={columns} hideRowIndicators /></div>);
};
export default DummySpread