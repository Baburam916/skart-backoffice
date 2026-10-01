import React, { useState, useRef } from "react";
import { Dialog } from "../../../../base-components/Headless";
import Lucide from "../../../../base-components/Lucide";
import { AiOutlineDelete } from "react-icons/ai";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import {commonDelete, commonDeleteRequest } from "../../../../AllServices/services";
import Spinner from "../../../../components/Spinner/Spinner";
import { Delete } from "lucide-react";
// import LoadingButtonCommon from "../Commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import Button from "../../../../base-components/Button";
import LoadingButtonCommon from "../LoadingButtonCommon/LoadingButtonCommon";
interface extradatatype {
  shipment_type?: string;
  product_type?: string;
  booking_shipment_type_id?: number;
  product_service_id?:number
  is_deleted?: number | null | undefined;
}
interface DeleteModalProps {
setOpenDeleteModel: React.Dispatch<React.SetStateAction<boolean>>;
  openDeletModel: boolean;
  id:number|string;
  handleRefresh: () => void;
  extradata:extradatatype|undefined;
  endpoint?:string|undefined


}

export default function DeleteModal(data: any) {
    // console.log("delteingid",id)
    const { setOpenDeleteModel, openDeletModel, id, handleRefresh, extradata, endpoint,type}=data
  const [deleteModalPreview, setDeleteModalPreview] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
const {showAlert}=useAlert()
const [isLoading,setIsLoading]=useState<boolean>(false)
const [error,setError]=useState<string>("")
const handledelete = async (id: string) => {
  try {
    setIsLoading(true)
  // console.log(extradata,endpoint,"extra data coming for delete")
    if(extradata&&endpoint){
      // console.log(endpoint,extradata,"checkfor update")
const response = await commonDeleteRequest(endpoint, extradata);
 if (response?.status == 200) {
   showAlert(response?.data.message);
   setOpenDeleteModel(false);
   handleRefresh();
   setIsLoading(false);
 } else if (response?.message == "Network Error") {
   setError(response?.message);
   setIsLoading(false);
   showAlert(response.message, "error");
 } else if (response?.response.data.status == 500) {
   setError("500");
   setIsLoading(false);
   showAlert("Internal Error is Going on..", "error");
 } else if (response?.response.data.status == 400) {
   showAlert("Bad Request", "error");
   setIsLoading(false);
 } else if (response?.response.data.status == 401) {
   showAlert("Unauthorized", "error");
   setIsLoading(false);
 } else if (response?.response.data.status == 404) {
   showAlert("Not Found", "error");
   setIsLoading(false);
 } else if (response?.response.data.status == 502) {
   showAlert("Bad GateWay", "error");
   setIsLoading(false);
 }else if(response?.response.data.status==406){
  showAlert("Failed to delete","error")
 }
    }else{
 const response: any = await commonDelete(endpoint,+id);
 // console.log(response,"deleteresponse")
//  console.log(response,"respnose")
 if (response?.status == 200) {

   showAlert(response?.data.message,"success");
   setOpenDeleteModel(false);
   handleRefresh();
   setIsLoading(false);
 } else if (response?.message == "Network Error") {
   setError(response?.message);
   setIsLoading(false);
   showAlert(response.message, "error");
 } else if (response?.response.data.status == 500) {
   setError("500");
   setIsLoading(false);
   showAlert("Internal Error is Going on..", "error");
 } else if (response?.response.data.status == 400) {
   showAlert("Bad Request", "error");
   setIsLoading(false);
 } else if (response?.response.data.status == 401) {
   showAlert("Unauthorized", "error");
   setIsLoading(false);
 } else if (response?.response.data.status == 404) {
   showAlert("Not Found", "error");
   setIsLoading(false);
 } else if (response?.response.data.status == 502) {
   showAlert("Bad GateWay", "error");
   setIsLoading(false);
 }
    }
   
  } catch (err: any) {
    showAlert(err.message);
    setIsLoading(false)
  }finally{
    setIsLoading(false)
  }
};
  return (
    <div>
      {/* BEGIN: Modal Toggle */}
      <div className="text-center "></div>
      {/* END: Modal Toggle */}
      {/* BEGIN: Modal Content */}
      <Dialog
        open={openDeletModel}
        onClose={() => {
          setOpenDeleteModel(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center mt-20">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => {
                setOpenDeleteModel(false);
              }}
              className="w-24 mr-4 p-2"
            >
              Cancel
            </Button>
            {isLoading ? (
              <Button
                type="button"
                variant="danger"
                className="w-24 p-2"
                ref={deleteButtonRef}
               
              >
          <LoadingButtonCommon text="Deleting"/>
              </Button>
            ) : (
              <Button
                type="button"
                variant="danger"
                className="w-24 p-2"
                ref={deleteButtonRef}
                onClick={() => {
                  handledelete(`${id}`);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Modal Content */}
    </div>
  );
}
