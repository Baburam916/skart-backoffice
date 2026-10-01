import React from "react";
import dashimg from "../../assets/images/dashboardimg.png";
import { IsDashboard } from "../skart_sales/Dashboards/isDashboard";
import PricingDashboard from "./pricing_dashboard";
import { useLogin } from "../skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";
import CsDashboard from "../Dashboard/Cs_dashboard/cs_dashboard";
import ImportBookings from "./Cs_dashboard/ImportBookings";
import Executive_performance from "../skart_sales/fieldSales/Executive_performance";

const main = ({importbookingp,jobListingp}) => {
  const {userdata}=useLogin()
  // console.log(userdata,"userdata")
  return (
    <>
      {/* <div className="w-full max-w-6xl mx-auto mt-8 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
        <img src={dashimg} className="h-[50vh]" alt="skart_logo" />
      </div> */}
     {userdata?.type_id==8? (<PricingDashboard />)
     :userdata?.type_id==6? (<IsDashboard/>)
     :userdata?.type_id == 9 ? (<ImportBookings/>) : (<div className="w-full max-w-6xl mx-auto mt-8 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg flex items-center justify-center">
        <img src={dashimg} className="h-[50vh]" alt="skart_logo" />
      </div>) }
   
    </>
  );                                 
};

export default main;
