import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../../commoncomponents/CommonModal/CommonModal";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import Button from "../../../../base-components/Button";
import { MdCancel, MdClose } from "react-icons/md";
import { FormInput, FormLabel } from "../../../../base-components/Form";
import { emailbodyfun } from "./emailbody";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../../AllServices/services";
import { indianFormat } from "../../../../utils";
import { useLogin } from "../../commoncomponents/LoginContextProvider/LoginContextProvider";
import PdfExport from "./TemplateContent";
import { Download } from "lucide-react";
import { CurrentformattedDate } from "../../commoncomponents/Commonfunctions/getcurrentdate";
const initialemaildata = {
  send_to_email: 0,
  email_cc: [],
  to: "credit.control1@skyways-group.com",
};
import html2pdf from "html2pdf.js";
import IsLoading from "../../commoncomponents/isLoading/isLoading";
export default function CommonemailModal({
  setEmailModal,
  emailModal,
  spotData,

  allfdata,
 
  exposureData,
  forwhat,
  setForwhat,

  branchdata,
  hubData,
}: any) {

  // const [exposureData,setExposureData]=useState<any>([])
 
  const inputRef = useRef<HTMLInputElement>(null);
  const [salespersondata, setSalesPersondata] = useState<any>([]);
  const [modalLoading, setModalLoading] = useState(false);

 
  const tableRef = useRef();
  const { userdata } = useLogin();

 

  
  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  useEffect(() => {
    getrequireddata();
  }, []);
  const getrequireddata = async () => {
    try {
      setModalLoading(true);
      const salesres = await commongetrequest("admin/sales-person");
      if (salesres?.status == 200) {
        const data = salesres?.data?.data || [];
        const singlesalespersondata = data.find(
          (item: any) => item?.id == userdata?.mapped_id
        );

        let salespersons = [];
        if (
          Object.keys(singlesalespersondata)?.length >= 1 &&
          singlesalespersondata?.manager?.length >= 1
        ) {
          salespersons = data
            ?.filter((item: any) =>
              singlesalespersondata?.manager?.includes(item?.id)
            )
            .map((item: any) => item?.sales_person);
          setSalesPersondata(salespersons);
        }
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setModalLoading(false);
    }
  };


  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendEmailDescription = (
    <>
      {modalLoading ? (
        <IsLoading />
      ) : (
        <div ref={tableRef} className="border border-gray-400 col-span-6">
          <PdfExport
            franchisee={
              allfdata?.find(
                (element: any) =>
                  element.franchisee_id == spotData.franchisee_id
              )?.franchisee_name || ""
            }
            franchiseeName={
              allfdata?.find(
                (element: any) =>
                  element.franchisee_id == spotData.franchisee_id
              )?.franchisee_name || ""
            }
            exposureData={exposureData}
            salespersondata={salespersondata}
            enquiryNumber={spotData?.booking_no}
            creditBalData={spotData}
            Request_credit_amount={spotData?.credit_limit}
            hubData={hubData}
            dataForm={spotData}
            branchname={
              branchdata?.find(
                (item: any) => item?.branch_id == spotData?.branch_id
              )?.branch_name || ""
            }
          />
          {/* {emailModal && (
         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-60 pointer-events-auto"></div>
       )} */}
        </div>
      )}
    </>
  );
  const downloadPDF = () => {
    const element = tableRef.current;
    const fileName = `Credit_Template_${CurrentformattedDate}.pdf`; // e.g., Credit_Template_2025-05-13.pdf

    html2pdf()
      .set({
        margin: 10,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  const sendemailfooter = (
    // (text == 'Approve') ? (storeformData(1);setOpenModal1(true);) : (storeformData(2);setOpenModal1(true);)
    <>
     
        <div className="flex justify-end gap-4">
          <Button
            className="p-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 ml-2"
            onClick={() => {
              setForwhat("");
              setEmailModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className="pp-2 rounded-lg bg-green-400 text-white hover:bg-green-500 ml-2"
            onClick={() => {
              downloadPDF();
            }}
          >
            <Download />
            Download
          </Button>
        </div>
   
    </>
  );
  const modaltitle = (
    <div className="flex justify-between w-full">
      <h1> TEMPLATE (Send Email / Request For Credit Limit)</h1>
      {/* {forwhat == "Template" && (
        <div className="flex">
          {" "}
          <Button
            className="bg-success p-2 text-white"
            onClick={() => downloadPDF()}
          >
            Download
          </Button>
          <MdClose
            className="mt-2 ml-4 size-5"
            onClick={() => {
              setForwhat("");
              setEmailModal(false);
            }}
          />
        </div>
      )} */}
    </div>
  );
  return (
    <div>
      <CommonModal
        open={emailModal}
        setOpen={setEmailModal}
        title={modaltitle}
        description={sendEmailDescription}
        footer={sendemailfooter}
        gridColumns={6}
        size={"2xl"}
      />
    </div>
  );
}
