import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { commongetrequest } from "../../../../AllServices/services";
import { useAlert } from "../../../../ContextProvider/AlertContext";

const useFetch = (url:any,params?:any) => {
  const [allgetdata, setAlldata] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
const navigate=useNavigate()
const {showAlert}=useAlert()
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response =params? await commongetrequest(url,params):await commongetrequest(url);
        if (response?.status == 200 || response?.status == 204) {
          setAlldata(response?.data?.data || []);
        }else if(response?.response?.status==401){
          navigate("/")
        } else {
          showAlert("Something going wrong!..", "error");
        }
      }catch (error:any) {
     showAlert(error.message,"error")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { allgetdata, loading};
};

export default useFetch;
