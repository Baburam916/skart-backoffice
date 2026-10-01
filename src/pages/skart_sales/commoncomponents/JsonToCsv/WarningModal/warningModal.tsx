import React, { useState } from "react";
import Button from "../../../../../base-components/Button";
import Lucide from "../../../../../base-components/Lucide";
import { Dialog } from "../../../../../base-components/Headless";
import { useAlert } from "../../../../../ContextProvider/AlertContext";
import { ResetPassword, commongetrequest } from "../../../../../AllServices/services";
import { Loader, Lock } from "lucide-react";

interface modalprops {
  setOpenWarningModel?: React.Dispatch<React.SetStateAction<boolean>>|undefined;
  openWarningModel?: boolean;
  id?: number | string;
  handleRefresh?: () => void;
  handledata?: (password: string) => void;
 
  endpoint?: string | undefined;
  type?:string|undefined
}
const WarningModal:React.FC<any>=({ setOpenWarningModel, openWarningModel,id,handleRefresh,endpoint,type,handledata})=> {
const {showAlert}=useAlert()
const [isLoading, setIsLoading] = useState<boolean>(false);
const [error, setError] = useState<string>("");
const handleaction=async(id:number)=>{
if(type=="reset"){
try {
  setIsLoading(true);
  const response: any = await commongetrequest(`/auth/user/${id}`);
  // console.log(response,"deleteresponse")
  if (response?.status == 200) {

    showAlert(response?.data.message);

    setOpenWarningModel(false);


  } else if(response?.status==201){
 showAlert(response?.data.message);
handledata(response?.data.data.password)
    setOpenWarningModel(false);
  }
   else if (response?.message == "Network Error") {
    setError(response?.message);
    setIsLoading(false);

    showAlert(response.message, "error");
  }else if (response?.message == "Network Error") {
    setError(response?.message);
    setIsLoading(false);
    showAlert(response.message, "error");
  } else if (response?.response.status == 500) {
    setError("500");
    setIsLoading(false);
    showAlert("Internal Error is Going on..", "error");
  } else if (response?.response.status == 400) {
    showAlert("Bad Request", "error");
    setIsLoading(false);
  } else if (response?.response.status == 401) {
    showAlert("Unauthorized", "error");
    setIsLoading(false);
  } else if (response?.response.status == 404) {
    showAlert("Not Found", "error");
    setIsLoading(false);
  } else if (response?.response.status == 502) {
    showAlert("Bad GateWay", "error");
    setIsLoading(false);
  }
} catch (err: any) {
  showAlert(err.message);
  setIsLoading(false);
} finally {
  setIsLoading(false);
}


}
}

  return (
    <div>
      {/* END: Modal Toggle */}
      {/* BEGIN: Modal Content */}
      <Dialog
        open={openWarningModel}
        onClose={() => {
          setOpenWarningModel(false);
        }}
        // initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lock className="w-16 h-16 mx-auto mt-3 text-warning" />
            {/* <Lucide
              icon="lock"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            /> */}
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to Reset Password? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenWarningModel(false);
              }}
              className="w-24 mr-3 p-2"
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button type="button" variant="success" className="w-24 p-2 text-white">
                Reseting..
                <Loader />
              </Button>
            ) : (
              <Button
                type="button"
                variant="success"
                className="w-24 p-2 text-white"
                onClick={() => handleaction(id)}
              >
                Reset
              </Button>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
export default WarningModal;