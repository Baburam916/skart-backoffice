import { useState } from "react";

import Button from "../../../base-components/Button";
import { FormInput, FormLabel} from "../../../base-components/Form";
import { Link2, PackageCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { commonpostrequest } from "../../../AllServices/services";
import LoadingButtonCommon from "../../skart_sales/commoncomponents/LoadingButtonCommon/LoadingButtonCommon";

export default function TagTransactionToAWB() {
  const [transactionId, setTransactionId] = useState("");
  const [loading,setLoading]=useState<boolean>(false)
  const [awb, setAwb] = useState("");
const {showAlert}=useAlert()
  const handleSubmit = async() => {
    if (!transactionId || !awb) {
      showAlert("Please enter both Transaction ID and AWB Number","warning");
      return;
    }

 try {
    setLoading(true)
    const res=await commonpostrequest(`booking/manual_tagging_import`,{
        awb,pickup_transaction_id:transactionId
    })
    if(res?.status==200||res?.status==201){
        showAlert(res?.data?.message||res?.data?.msg||"Action Performed Successfully")
        setTransactionId("")
        setAwb("")
    }else{
        showAlert(res?.response?.data?.msg||res?.response?.data?.message||"something going wrong please try after some time","error")
    }

 } catch (err: any) {
   console.log(err?.message);
 }finally{
    setLoading(false)
 }
  };
  

  return (
    <>
      <div className="min-[685px]:flex mt-2 justify-between p-2 border-b-2 rounded-md">
        <div>
          <h2 className="text-2xl mt-1 font-bold text-primary ">
 Tag Pickup Number
          </h2>
        </div>
      
      </div>
      <div className=" flex items-center justify-center bg-gradient-to-br mt-20 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl shadow-2xl border border-[#6b5e1f] bg-white backdrop-blur">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#d4af37]">
                  <Link2 className="text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Tag Pickup</h2>
              </div>

              <div className="space-y-2">
                <FormLabel className="text-sm uppercase">
                  Pickup Number <span className="text-red-400">*</span>
                </FormLabel>
                <FormInput
                  placeholder="Enter Pickup Number"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className=" focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-2">
                <FormLabel className="text-sm uppercase ">
                  AWB Number <span className="text-red-400">*</span>
                </FormLabel>
                <FormInput
                  placeholder="Enter AWB Number"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  className=" focus:border-[#d4af37]"
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="p-2 bg-mustard w-full rounded-xl  transition-all gap-2"
              >
                <PackageCheck className="w-4 h-4" />
                {loading ? (
                  <LoadingButtonCommon text="Processing" />
                ) : (
                  "Tag Pickup"
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
