import { Download } from 'lucide-react'
import React from 'react'
import { jsontocsv } from '../JsonToCsv/Jsontocsv'
import Button from '../../../../base-components/Button'

export default function Commondownload(props:any) {
    const {data,forwhat,icon}=props
    const handleDownload=()=>{

        jsontocsv(data,forwhat)
    }
  return (
    <div className=" ml-2 cursor-pointer">
      <Button
        onClick={handleDownload}
        className="p-2 px-3 bg-success  text-white"
      >
        <div className="flex">
          <div className='mr-1'>{icon?<Download/>:""}</div>

          <div >Download</div>
        </div>
      </Button>
    </div>
  );
 
}
