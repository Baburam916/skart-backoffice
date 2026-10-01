import React from 'react'
import nodataimage from "../../images/nodata.jpg"
export default function Nodatafound(props:any) {
  const {w,h}=props
  return (
    <div className={`flex items-center justify-center ${h?h:"h-screen"}`}>
      <img
        src={nodataimage}
        alt="No Data Found"
        className={`w-1/2 rounded-full opacity-50`}
      />
    </div>
  );
}
