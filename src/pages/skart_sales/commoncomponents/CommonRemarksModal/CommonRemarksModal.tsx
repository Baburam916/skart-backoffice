import React, { useState } from 'react'
import { FormInput } from '../../../../base-components/Form';
import Button from '../../../../base-components/Button';
import CommonModal from '../CommonModal/CommonModal';
import { commonpostrequest } from '../../../../AllServices/services';
import { useAlert } from '../../../../ContextProvider/AlertContext';

export default function CommonRemarksModal(props:any) {
    const {openRemarksmodal,setOpenRemarksmodal,handleRemarksmodal,billno}=props
    const [loading,setLoading]=useState<boolean>(false)
    const [remarks,setRemarks]=useState<string>("")
    const {showAlert}=useAlert()
    const handlecreate=async(number:any)=>{
        try{
            setLoading(true)
             const res=await commonpostrequest("invoice/crn-invoice", {bill_no:number,inv_remarks:remarks});
             if (res?.status == 200) {
               showAlert("Created Successfully");
               handleRemarksmodal()
               setOpenRemarksmodal(false)
             } else if (res?.status == 204) {
               showAlert("No data exists for this Invoice", "warning");
             } else if (res?.response?.status == 400) {
               showAlert(
                 res?.response?.data?.err ||
                   res?.response?.data?.error,
                 "error"
               );
             } else {
               showAlert(
                 "Oops..! Please try again after some time...",
                 "error"
               );
             }
        }catch(err:any){
            console.log(err?.message)
        }finally{
            setLoading(false)
        }
    }
   const Modaltitle = (
     <>
       <h2 className="mr-auto text-base font-medium">Add Remarks</h2>
     </>
   );
    const ModalDesciption = (
      <>
        <div className="col-span-12">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2 shadow-lg border p-4">
              <label>Remarks</label>
              <FormInput onKeyDown={(e:any)=>{
              
                if (e.key == "Enter"&&e.target.value) {
                    handlecreate(billno)
                }
              }} placeholder='Remarks' value={remarks} onChange={(e:any)=>setRemarks(e.target.value)} />
            </div>
          </div>
        </div>
      </>
    );
    const ModalFooter=(
      
   <>
     <Button
       type="button"
       onClick={() => {
       handleRemarksmodal()
       
       }}
       className="w-20 text-white mr-1  bg-gray-500 p-2"
     >
       Cancel
     </Button>
     {loading  ? (
       <Button
         variant="mustard"
        disabled
         className="ml-2  p-2 w-[100px]"
       >
         Creating..
       </Button>
     ) : (
       <Button
         variant="mustard"
         onClick={() => {
           handlecreate(billno);
         }}
         className="ml-2  p-2 w-[100px]"
       >
        Create
       </Button>
     )}
   </>
 );
    
  return (
    <CommonModal
      open={openRemarksmodal}
      setOpen={setOpenRemarksmodal}
      title={Modaltitle}
      description={ModalDesciption}
      footer={ModalFooter}
      size={"md"}
      gridColumns={6}
    />
  );
}
