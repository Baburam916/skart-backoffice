import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { commongetrequest } from "../../../../AllServices/services";

// Create a context for login state
const LoginContext = createContext();

// Create a provider component to wrap your app
export const LoginProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const [franhiseedata,setFranchiseedata]=useState<any>([])
  const [oldstatedata, setOldstatedata] = useState<any>("");
  const [userdata, setUserdata] = useState("");
  const [permissionid, setpermissionsId] = useState<any>([]);
  const [statusdata,setStatusdata]=useState<any>([])
  const navigate = useNavigate();
 const getstatusdata=useCallback(async()=>{
  try{
const resdata=await commongetrequest('booking/enquiry_status')
if(resdata?.status==200){
  setStatusdata(resdata?.data?.data)
}else{
  setStatusdata([])
}
  }catch(err:any){
    console.log(err?.message)
  }
 },[])

  const login = async(data: any) => {
    // Perform your login logic here
    setIsLoggedIn(true);
    setUserdata(data);
    const newdata = data?.role_permission?.map(
      (item: any) => item?.read_permission == 1 && item?.p_id
    );
    setpermissionsId(newdata || []);
try{
  await getstatusdata()
const response=await commongetrequest(`admin/franchisee-settings${data?.type_id==6?`?sales_id=${data?.mapped_id}`:""}`)
if(response?.status==200){
 setFranchiseedata(response?.data?.data||[])
 localStorage.setItem("franchiseedata",JSON.stringify(response?.data?.data||[]))
}
}catch(err:any){
  console.log(err?.message,"error")
}
  };

  const logout = () => {
    // Perform your logout logic here
    setIsLoggedIn(false);
    setUserdata("");
    localStorage.removeItem("franchiseedata")
    // navigate("/")
  };
  const setstatedata = (data?: any) => {
    setOldstatedata(data);
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        userdata,
        setstatedata,
        oldstatedata,
        permissionid,
        franhiseedata,
        statusdata
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};
export const useLogin = () => useContext(LoginContext);
