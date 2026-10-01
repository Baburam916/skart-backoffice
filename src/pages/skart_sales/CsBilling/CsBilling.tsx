import { CreditCard, Download, Eye, File, Info, Search, Upload, Wallet } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Table from "../../../base-components/Table";
import { Pencil } from "lucide-react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import { Check } from "lucide-react";
import { Dialog } from "../../../base-components/Headless";
import Lucide from "../../../base-components/Lucide";
import { X } from "lucide-react";
import deactivateimg from "../../../assets/images/csimages/deactive.png";
import kawachimg from "../../../assets/images/csimages/kavach.png";
import CommonTable from "../commoncomponents/CommonTable/CommonTable";
import {
  commongetrequest, 
  commonpostrequest,
  commonputrequest,
} from "../../../AllServices/services";
import Button from "../../../base-components/Button";
import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";
import { formatIndianNumber } from "../commoncomponents/CommonNumberConverter/CommonNumberconverter";
import Tippy from "../../../base-components/Tippy";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import CommonSearchableAll from "../commoncomponents/CommonSearchableall/CommonSearchableall";
import { RxReset } from "react-icons/rx";
import { useDebounce } from "../../../components/Search";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import { unparse } from "papaparse";
import { useAlert } from "../../../ContextProvider/AlertContext";
import CommonPagination from "../commoncomponents/JsonToCsv/pagination";
import new_billICON from "../../../assets/images/csimages/new_bill.png";
import close_billedICON from "../../../assets/images/csimages/close_document.png";
import holdICON from "../../../assets/images/csimages/inprocess.png";
import billedICON from "../../../assets/images/csimages/billed_outstanding.png";
import "./cs.module.css";
import VendorBatchUpload from "./VendorBatchUpload";

const intfranchiseedata = {
  franchisee_name: "",
  franchisee_id: "",
};
const payData = {
  file: "",
  remarks: "",
  status: "",
  cs_bill_id: "",
};

export default function CsBilling({pdata}:any) {
  const navigate = useNavigate();
  const location = useLocation();
  const { batch_id, list_type, batch_number } = (location.state as { batch_id?: string; list_type?: string; batch_number?: string }) || {};
  const [listTypeFilter, setListTypeFilter] = useState<string>(list_type ?? "");
  const [buttonModalPreview, setButtonModalPreview] = useState<boolean>(false);
  const [chargesloading, setChargesloading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const [searchAll, setSearchAll] = useState<any>("");
  const debouncedSearchTerm = useDebounce<any>(searchAll, 500);
  const [page, setPage] = useState<any>(0);
  const [additionalchargeslist, setAdditionalchargeslist] = useState<any>([]);
  const [chargehead, setChargehead] = useState<Array<any>>([]);
  const [franchiseedata, setFranchiseedata] = useState<Array<any>>([]);
  const [vendorName, setVendorName] = useState<Array<any>>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [forWhat, setForWhat] = useState<any>();
  const [statusDropdown, setStatusDropdown] = useState<any>();
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [downloaddata, setDownlaoddata] = useState<any>([]);
  const { showAlert } = useAlert();
  const [franchiseeId, setFranchiseeId] = useState<any>("");
  const [chargeType, setChargeType] = useState<any>("");
  const [reset, setReset] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<any>();
  const [alertwarning, setAlertwarning] = useState<boolean>(false);
  const [payloadRemarks, setPayloadRemarks] = useState<any>(payData);
  const [openMailModal, setOpenMailModal] = useState<boolean>(false);
  const [franchiseeAwb, setFranchiseeAwb] = useState<any>();
  const [awbMailData, setAwbMailData] = useState<Array<any>>([])
  const [awbCharges, setAwbCharges] = useState<any[]>([]);
  const [checkedAwbs, setCheckedAwbs] = useState<number[]>([]);
  const [cardData, setCardData] = useState<any>()
  const uploadedFile = useRef<HTMLInputElement | null>(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [openDocModal, setOpenDocModal] = useState<boolean>(false);
  const [documentfullArr, setDocumentfullArr] = useState<Array<any>>([])

  console.log("awv charge", awbCharges)
  // const findrelateddata = async (data: any, forwhat: any) => {
  //   const ids = [];
  //   for (let key of data) {
  //     if (key["bill_id"]) {
  //       ids.push(key["bill_id"]);
  //     }

  //     // ids.push()
  //   }

  //   if (forwhat == 1) {
  //     if (ids?.length >= 1) {
  //       const res4 = await commonpostrequest("invoice/mother-bill-no", {
  //         bill_ids: ids,
  //       });
  //       // console.log(res4,"res4 cming")
  //       if (res4?.status == 200) {
  //         const data2 = res4?.data?.data || [];

  //         const updatedArray = data.map((item: any) => {
  //           const match = data2.find(
  //             (obj: any) => obj.bill_id === item.bill_id
  //           );
  //           return {
  //             ...item,
  //             mother_invoice_no: match ? match.bill_no : "Not Available",
  //           };
  //         });

  //         setAdditionalchargeslist(updatedArray || []);
  //       } else {
  //         const secondtype = data.map((obj: any) => ({
  //           ...obj,
  //           mother_invoice_no: "Not Available",
  //         }));
  //         setAdditionalchargeslist(secondtype);
  //       }
  //     } else {
  //       const secondtype = data.map((obj: any) => ({
  //         ...obj,
  //         mother_invoice_no: "Not Available",
  //       }));
  //       setAdditionalchargeslist(secondtype);
  //     }
  //   } else {
  //     if (ids?.length >= 1) {
  //       const res4 = await commonpostrequest("invoice/mother-bill-no", {
  //         bill_ids: ids,
  //       });
  //       if (res4?.status == 200) {
  //         const data2 = res4?.data?.data || [];
  //         const updatedArray = data.map((item: any) => {
  //           const match = data2.find(
  //             (obj: any) => obj.bill_id === item.bill_id
  //           );
  //           return {
  //             ...item,
  //             mother_invoice_no: match ? match.bill_no : "Not Available",
  //           };
  //         });

  //         return updatedArray;
  //       } else {
  //         const secondtype = data.map((obj: any) => ({
  //           ...obj,
  //           mother_invoice_no: "Not Available",
  //         }));
  //         return secondtype;
  //       }
  //     } else {
  //       const secondtype = data.map((obj: any) => ({
  //         ...obj,
  //         mother_invoice_no: "Not Available",
  //       }));
  //       return secondtype;
  //     }
  //   }
  // };
  const getaddcharg = async () => {
    try {
      setChargesloading(true);

      let response3 = await commongetrequest(
        `booking/cs-additional-billing/cs-billing-charges?limit=20&status=${
          statusDropdown ? statusDropdown : ""
        }&charge_type=${chargeType}&franchisee_id=${franchiseeId}&page=${
          page + 1
        }&airwaybill_no=${debouncedSearchTerm}&batch_id=${batch_id ?? ""}&list_type=${listTypeFilter}`
      );

      if (response3?.status == 200) {
        const data = response3?.data?.data || [];
        // findrelateddata(data, 1);
        setAdditionalchargeslist(data);
        setTotalPages(Math.ceil(response3?.data?.total / 20));
      } else if (response3?.status == 204) {
        setAdditionalchargeslist([]);
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setChargesloading(false);
    }
  };
  const getResetData = async () => {
    setStatusDropdown("");
    setChargeType("");
    setFranchiseeId("");
    setListTypeFilter("");
    navigate(location.pathname, { replace: true, state: {} });
    setSelectedfranchisedata({
      franchisee_id: "",
      franchisee_name: "",
    });
    setSearchAll("");
    try {
      let response3 = await commongetrequest(
        `booking/cs-additional-billing/cs-billing-charges?limit=20&status=${""}&charge_type=${""}&franchisee_id=&page=${1}&airwaybill_no=`
      );

      if (response3?.status == 200) {
        const data = response3?.data?.data || [];
        // findrelateddata(data, 1);
        setAdditionalchargeslist(data);
        setTotalPages(Math.ceil(response3?.data?.total / 20));
      } else if (response3?.status == 204) {
        setAdditionalchargeslist([]);
      }
    } catch (err: any) {
      console.log(err.message);
    } finally {
    }
  };
  const getCardData = async() => {
     const res:any = await commongetrequest(`booking/cs-additional-billing/cs-billing-charges-dashboard`)
     console.log(res)
     try {
      if(res?.status == 200) {
        setCardData(res?.data?.data)
      } else if(res?.status == 204) {
          setCardData('')
      } else {
          showAlert("Something went wrong!");
      }
     } catch (err:any) {
       console.log("err", err)
     }
  }
  const funcFranchiseeData = async () => {
    const res: any = await commongetrequest("admin/franchisee-settings");
    if (res?.status == 200) {
      setFranchiseedata(res?.data?.data);
    } else if (res?.status == 204) {
      setFranchiseedata([]);
    }
  };
  const chargeHead = async () => {
    const response: any = await commongetrequest("admin/charges?type=E&is_cargo=2");

    // console.log(response);
    if (response?.status == 200) {
      setChargehead(response?.data?.data || []);
    } else if (response?.status == 204) {
      setChargehead([]);
    }
  };
  const getVendor = async () => {
    const response: any = await commongetrequest("admin/courier-product");

    // console.log(response);
    if (response?.status == 200) {
      setVendorName(response?.data?.data || []);
    } else if (response?.status == 204) {
      setVendorName([]);
    }
  };
  // const funcHoldBill = (data:any, id:any) => {
  //    const payload = {
  //      remarks: remarks || '',
  //      status:  id,
  //      cs_bill_id: data?.cs_bill_id
  //    }
  //    console.log("abover", payload)
  //    setPayloadRemarks(payload)

  // }
  const handleSubmitRemarks = async () => {
    console.log("payload", payloadRemarks);
    let formdata = new FormData()
    formdata.append("cs_bill_id", payloadRemarks?.cs_bill_id|| "");
    // formdata.append("file", payloadRemarks?.uploadedFileData);
    formdata.append("remarks", payloadRemarks?.remarks || "");
    formdata.append("status", payloadRemarks?.status || "")
     if (uploadedFileData) {
    formdata.append("file", uploadedFileData || ""); // ✅ correct
  }
    if (payloadRemarks?.remarks) {
      try {
        setAlertwarning(true);
        const res = await commonputrequest(
          `booking/cs-additional-billing/updated-status-billing`,
          formdata
        );
        console.log("res data all", res);
        if (res?.status == 200) {
          showAlert("Data succesfully added!");
          setOpenModal(false);
          setPayloadRemarks({
            file: "",
            remarks: "",
            status: "",
            cs_bill_id: "",
          })
          setUploadedFileData(null)
          getaddcharg();
        } else if (res?.status == 406) {
          showAlert(res?.response?.data?.errors[0]?.msg);
        } else if (res?.status == 400) {
          showAlert(res?.response?.data?.message, "error");
        } else {
          showAlert("Something went wrong!", "error");
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        setAlertwarning(false);
      }
    } else {
      showAlert("Please fill the Remarks", "warning");
    }
  };
  const getMailAwbfunc = async(data:any) => {
    console.log("resdsa", data)
    const res:any = await commongetrequest(`booking/cs-additional-billing/cs-billing-charges-mail?franchisee_id=${data}`);
    try {
    if(res?.status == 200) {
       setAwbMailData(res?.data?.data)
    } else if(res?.status == 204) {
      setAwbMailData([])
    } else {
       showAlert("Something went wrong!", "error")
    } }
    catch(err:any) {
      console.log("err", err)
    }
  }
  const funDocumentfullArr = (data:any) => {
    setDocumentfullArr(data)
  }
  const columns = [
    {
      field: "vendor_inv",
      headerName: "Vendor Invoice Number",
      text: "text-left",
    },
    { field: "airwaybilno", headerName: "AWB No.", text: "text-left" },
    { field: "additioanalDebit", headerName: "Addititonal/ Debit Type", text: "text-left"},
    { field: "billing", headerName: "Billing Status", text: "text-left" },
    {field: "Charge Status", headerName: "Charge Status", text: "text-center"},
    { field: "mail_sent", headerName: "Mail Send", text: "text-left"},

    {
      field: "chargehead",
      headerName: "Charge Head",
      text: "text-left",
    },
    {
      field: "charge_amount",
      headerName: "Additional Charge amount",
      text: "text-right",
    },
    { field: "rts_awb", headerName: "RTS AWB No.", text: "text-left" },
    { field: "vendor", headerName: "Vendor Name", text: "text-left" },
    { field: "booking_date", headerName: "Ship Date", text: "text-left" },
    { field: "customer", headerName: "Customer Name", text: "text-left" },
    // { field: "", headerName: "Customer Type" },
    { field: "kavachStatus", headerName: "Kavach Status", text: "text-left" },
    { field: "billingInst", headerName: "Billing Instruction" },
    { field: "remarks", headerName: "Remarks", text: "text-left" },
  ];
  const fun1 = (a: any) => {
    setFranchiseeId(a?.franchisee_id);
  };
  const funtoempty = () => {};

  const row: any = additionalchargeslist?.map((item: any) => {
    const chargeData = chargehead?.find(
      (elem) => elem.ref_sell_id == (item.charge_id || 0)
    )?.charge_name || 'N.A.';
    const customerName = franchiseedata?.find(
      (elem) => elem?.franchisee_id == item?.pickup_franchisee_id
    )?.franchisee_name;
    const vendordata = vendorName?.find(
      (elem) => elem?.product_id == item?.courier_id
    )?.product_name;
    // const billingStatus = (
    //   <>
    //     {item?.status == 0 ? (
    //       <strong>
    //         <p className="flex whitespace-nowrap text-red-500">Not Billed </p>
    //       </strong>
    //     ) : item?.status == 1 ? (
    //       <strong>
    //         <p className="flex whitespace-nowrap text-green-600">Billed </p>
    //       </strong>
    //     ) : item?.status == 2 ? (
    //       <strong>
    //         <p className="flex whitespace-nowrap text-gray-500">Not Needed </p>
    //       </strong>
    //     ) : item?.status == 3 ? (
    //       <strong>
    //         <p className="flex whitespace-nowrap text-yellow-500">Hold </p>
    //       </strong>
    //     ) : (
    //       "N.A."
    //     )}
    //   </>
    // );
   const billingStatus = (
      <>
        {item?.inv_check == 1 ? (
          <p className="flex whitespace-nowrap text-green-600">Billed </p>
        ) : (
          <p className="flex whitespace-nowrap text-red-500">Not Billed </p>
        )}
        {/* {item?.status == 0 ? (
          <strong>
            <p className="flex whitespace-nowrap text-red-500">Not Billed </p>
          </strong>
        ) : item?.status == 1 ? (
          <strong>
            <p className="flex whitespace-nowrap text-green-600">Billed </p>
          </strong>
        ) : item?.status == 2 ? (
          <strong>
            <p className="flex whitespace-nowrap text-gray-500">Not Needed </p>
          </strong>
        ) : item?.status == 3 ? (
          <strong>
            <p className="flex whitespace-nowrap text-yellow-500">Hold </p>
          </strong>
        ) : (
          "N.A."
        )} */}
      </>
    );
    const kavachStatus = (
      <>
        {item?.is_kawach ? (
          <div className="flex text-center items-center ">
            <div className=" relative w-[25px] h-[25px] rounded-full border border-green-400 flex items-center justify-center bg-[#eaffed] ">
              <figure>
                <img alt="Avatar" className="w-[17px]" src={kawachimg} />
              </figure>
            </div>
            <p className="font-bold ml-[6px] text-green-500">Active</p>
          </div>
        ) : (
          <div className="flex text-center items-center ">
            <div className=" relative w-[25px] h-[25px] rounded-full border border-red-400 flex items-center justify-center bg-[#FFF3F3] ">
              <figure>
                <img alt="Avatar" className="w-[16px]" src={deactivateimg} />
              </figure>
            </div>
            <p className="font-bold ml-[6px] text-red-500">Inactive</p>
          </div>
        )}
      </>
    );
  
    const billingInst = !item.charge_id ?"Charge not selected":
  item?.is_kawach == 0 && item?.billed == 0 ? (
    item?.status == 0 ? (
      <>
        <div className="flex">
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2"
            onClick={() => {
              setOpenModal(true);
              setForWhat(1);
              setPayloadRemarks({
                remarks: remarks || "",
                status: 3,
                cs_bill_id: item?.cs_bill_id,
              });
            }}
          >
            Hold
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white p-2"
            onClick={() => {
              setOpenModal(true);
              setForWhat(2);
              setPayloadRemarks({
                remarks: remarks || "",
                status: 2,
                cs_bill_id: item?.cs_bill_id,
              });
            }}
          >
            No billing
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white p-2"
            onClick={() => {
              setOpenModal(true);
              setForWhat(3);
              setPayloadRemarks({
                remarks: remarks || "",
                status: 1,
                cs_bill_id: item?.cs_bill_id,
              });
            }}
          >
            Okay to bill
          </Button>
        </div>
      </>
    ) : item?.status == 1 ? (
      <span className="font-semibold text-green-600 whitespace-nowrap">
        Billed
      </span>
    ) : item?.status == 2 ? (
      <span className="font-semibold text-gray-500 whitespace-nowrap">
        Not Needed
      </span>
    ) : item?.status == 3 ? (
      <>
        <div className="flex items-center">
          <span className="font-semibold text-yellow-500 whitespace-nowrap p-2">
            Hold
          </span>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={() => {
              setOpenModal(true);
              setForWhat(2);
              setPayloadRemarks({
                remarks: remarks || "",
                status: 2,
                cs_bill_id: item?.cs_bill_id,
              });
            }}
          >
            No billing
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => {
              setOpenModal(true);
              setForWhat(3);
              setPayloadRemarks({
                remarks: remarks || "",
                status: 1,
                cs_bill_id: item?.cs_bill_id,
              });
            }}
          >
            Okay to bill
          </Button>
        </div>
      </>
    ) : (
      "N.A."
    )
  ) : (
    "Kavach/Billed"
  );
      
    // const result = item?.remarks?.map((elem) => elem);
    const remarks = item?.remarks?.length ? (
      <>
      <div className="flex justify-center">
      {item?.remark_file.length >0 ? <File className="mr-2 cursor-pointer" onClick= {() => {setOpenDocModal(true); funDocumentfullArr(item?.remark_file)}}/> : ''}
      <Tippy placement="top" content={item.remarks.join(" , ")}>
        <Info />
      </Tippy>
      </div>
      </>
    ) : null;
    return {
      ...item,
      kavachStatus: kavachStatus,
      additioanalDebit: item?.type == 2 ? "Additional" : item?.type == 3 ? "Debit" : "N.A.",
      // billingStatus: billingStatus,
      chargehead: chargeData,
      customer: customerName,
      vendor: vendordata,
      billing: billingStatus,
      billingInst: billingInst,
      booking_date: formatDate(item?.booking_date),
      charge_amount: formatIndianNumber(item?.charge_amount),
      rts_awb: item?.rts_awb ? item?.rts_awb : "N.A.",
      mail_sent: item?.mail_sent == 0 ? "No" : item?.mail_sent == 1 ? "Yes": "-",
      remarks: remarks,
      "Charge Status": item?.is_kawach == 1 ? "Kavach" : item?.billed == 1 ? "Billed" : "Additional Pending",
    };
  });
  const footer = (
    <>
      <Button
        type="button"
        variant="outline-secondary"
        // onClick={handleCancel}
        onClick={() => {
          setOpenModal(false);
          setPayloadRemarks("");
        }}
        className="w-20 mr-1 p-2"
      >
        Cancel
      </Button>

      <Button
        variant="mustard"
        type="button"
        className="w-20 p-2"
        onClick={() => handleSubmitRemarks()}
        disabled={alertwarning}
        // onClick={handleSubmit}
        // ref={sendButtonRef}
      >
        SAVE{" "}
        {alertwarning ? (
          <LoadingIcon icon="tail-spin" className="block m-auto w-[4%] " />
        ) : (
          ""
        )}
      </Button>
    </>
  );
  const funcMailCheckAwb = (checked: any, data:any) => {
    const charge_name =
    chargehead?.find((c: any) => c.ref_sell_id == data.charge_id)?.charge_name ||
    "";
    console.log("data", checked, data)
    const payload = {
    cs_bill_id: data.cs_bill_id,
    airwaybill_no: data.airwaybilno,
    charge_name: charge_name,
    charge_amount: data.charge_amount,
    invoice_no: data.vendor_inv
  };

  // setAwbCharges((prev) => {
  //   if (checked) {
  //     const exists = prev.some(
  //       (item) => item.cs_bill_id === data.cs_bill_id
  //     );
  //     return exists ? prev : [...prev, payload];
  //   } else {
  //     return prev.filter(
  //       (item) => item.cs_bill_id !== data.cs_bill_id
  //     );
  //   }
  // });
   setAwbCharges((prev) => {
    if (checked) {
      return prev.some((i) => i.cs_bill_id === data.cs_bill_id)
        ? prev
        : [...prev, payload];
    }
    return prev.filter((i) => i.cs_bill_id !== data.cs_bill_id);
  });

  // 👉 handle checkbox UI state
  setCheckedAwbs((prev) => {
    if (checked) {
      return [...prev, data.cs_bill_id];
    }
    return prev.filter((id) => id !== data.cs_bill_id);
  });
  }
   const mailcolumns =[
    { field: "action", headerName: "Action", text: "text-center" },
    { field: "airwaybilno", headerName: "Awb no", text: "text-left"},
    { field: "charge", headerName: "Charge Head", text: "text-left"},
    { field: "charge_amount", headerName: "Amount", text: "text-right"},
  ]
  const mailrow:any = awbMailData?.map((item:any) => {
    const chargeid = chargehead?.find((elem:any) => elem?.ref_sell_id == item?.charge_id)?.charge_name;
    const action =  <FormCheck className="mt-5 ml-5">
                  <FormCheck.Input
                    id="vertical-form-5"
                    type="checkbox"
                    checked={checkedAwbs.includes(item.cs_bill_id)}
                    onChange={(e:any)=> funcMailCheckAwb(e.target.checked, item) }
                  />
                  
                </FormCheck>
    return {
      ...item,
      charge: chargeid ?  chargeid : 'N.A.',
      action : action
    }
  })
  // Convert JSON data to CSV and trigger download
  const convertJSONtoCSV = async (data: any[] = [], fileName: string) => {
    // try {
    setChargesloading(true);
    const csv = unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove(); // Use remove() instead of removeChild
    // } catch (error: any) {
    // console.error("Error converting JSON to CSV:", error.message);
    setChargesloading(false);
    // }finally{
    //     setCsvSpinner(false);
    // }
  };
  const csvDataForPrint = async () => {
    try {
      setChargesloading(true);
      const res: any = await commongetrequest(
        `booking/cs-additional-billing/cs-billing-charges?status=${
          statusDropdown ? statusDropdown : ""
        }&charge_type=${chargeType}&franchisee_id=${franchiseeId}&airwaybill_no=${debouncedSearchTerm}&batch_id=${batch_id ?? ""}&list_type=${listTypeFilter}`
      );

      if (res?.status == 200) {
        setDownlaoddata(res?.data?.data);
        convertJSONtoCSV(formatData(res?.data?.data), "cs_billing.csv");
        // setPrintCsv([])
      } else if (res?.status == 204) {
        setDownlaoddata([]);
      } else {
        showAlert("Something went wrong!", "error");
      }
    } catch (err: any) {
      console.error("Error fetching CSV data:", err);
    } finally {
      setChargesloading(false);
    }
  };

  // Format data to be CSV-ready
  const formatData = (data: any[] = []) => {
    console.log("dajaysonu", data);

    if (!data.length) return [{ "No Data Found": "" }];

    return data.map((item: any, index: number) => {
      const chargeData =
        chargehead?.find((elem) => elem?.ref_sell_id == item?.charge_id)
          ?.charge_name || "N.A.";

      const vendordata =
        vendorName?.find((elem) => elem?.product_id == item?.courier_id)
          ?.product_name || "N.A.";

      const customerName =
        franchiseedata?.find(
          (elem) => elem?.franchisee_id == item?.pickup_franchisee_id
        )?.franchisee_name || "N.A.";

      const billingStatus =
        item?.status == 0
          ? "Not Billed"
          : item?.status == 1
          ? "Billed"
          : item?.status == 2
          ? "Not Needed"
          : item?.status == 3
          ? "Hold"
          : "N.A.";
      const billingInstruct =
      !item.charge_id?"Charge not selected":
        item?.status == 0
          ? "No Action"
          : item?.status == 1
          ? "Billed"
          : item?.status == 2
          ? "No Billing"
          : item?.status == 3
          ? "Hold"
          : "N.A.";
      return {
        "Sr. No.": `${index + 1}.`,
        "Vendor Invoice Number": item?.vendor_inv || "N.A.",
        "AWB NO": item?.airwaybilno || "N.A.",
        "Additional Charge Head": chargeData,
        "Additional Charge amount": item?.charge_amount || "N.A.",
        "RTS AWB No.": item?.rts_awb || "N.A.",
        "Vendor Name": vendordata,
        "Ship Date": formatDate(item?.booking_date),
        "Customer Name": customerName,
        "Billing Instruction": billingInstruct,
        "Kavach Status": item?.is_kawach ? "Active" : "Inactive",
        // "Billing Instruction": item?.weight_unit || "N.A.",
        Remarks: item?.remarks?.length ? item?.remarks.join(",") : "N.A.",
        // "Billing Status": billingStatus,
      };
    });
  };
  const handleReset = () => {
    getResetData();
  };
  const DocTitle = (
    <div className="flex justify-between w-[100%]">
      <div>
       <h1 className="font-bold text-2xl text-primary mt-2">Document</h1>
      </div>
      <div>
       <X className="cursor-pointer" onClick={() => setOpenDocModal(false)}/>
      </div>
    </div>
  )
  const modalDescription = (
    <>
      <p className="text-xl font-semibold text-gray-900 mb-2 text-center">
        Are you sure you want to select{" "}
        <strong className="text-mustard">
          {forWhat == 1
            ? "Hold"
            : forWhat == 2
            ? "No Billing"
            : forWhat == 3
            ? "Okay to bill"
            : ""}
        </strong>{" "}
        ?
      </p>
      <FormLabel>Document</FormLabel>
      <FormInput type="file"  ref={uploadedFile}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileData(e.target.files[0]); // ✅ REAL FILE OBJECT
    }
  }}/>
      <FormLabel>
        Remarks <span className="text-red-500 ml-2">*</span>
      </FormLabel>

      <FormTextarea
        name="reason_remarks"
        // value={payloadRemarks?.remarks || ''}
        onChange={(e) =>
          setPayloadRemarks((prev: any) => {
            return {
              ...prev,
              remarks: e.target.value,
            };
          })
        }
        className="min-h-16 max-h-20"
      />
    </>
  );
  const modalMailTitle = (
    <div className="flex justify-between w-[100%]">
      <div><h1 className="font-bold text-2xl text-primary mt-2">Send Mail</h1></div>
      <div><X className="cursor-pointer" onClick={()=> {setOpenMailModal(false); setAwbCharges([]);
        setCheckedAwbs([]); }} /></div>
    </div>
  )
  const modalMailDescription = ( 
    <>
    {awbMailData?.length > 0 ? <CommonTable columns={mailcolumns} row={mailrow}  height="300px" /> : <Nodatafound />}
    
    </>
  )
  const footerMail = (
      <>
          <Button
            type="button"
            onClick={() => {setOpenMailModal(false); setAwbCharges([]);
        setCheckedAwbs([]); }} 
            className="w-20 text-white mr-1  bg-gray-500 p-2"
          >
            Cancel
          </Button>
         
           {awbMailData?.length >0 ? <Button
              className="ml-2 w-20 bg-success p-2 text-white"
              onClick={() => funcSubmitAwbFooter(awbCharges, selectedfranchisedata?.franchisee_id)}
            >
              Send
            </Button> : ''}
         
        </>
  )

  const modalDocDescription = (
      <div className="flex flex-wrap gap-3">
    {documentfullArr?.length > 0 ? (
      documentfullArr.map((url: string, index: number) => (
        <Button
          key={index}
          variant="primary"
          onClick={() => window.open(url, "_blank")}
          className="w-fit p-2"
        >
          View Document {index + 1}
        </Button>
      ))
    ) : (
      <p>No documents available</p>
    )}
  </div>
  )
  const onPageChange = (page: number) => {
    setPage(page - 1);
    //  setHit(1);
  };
  
  const funcSubmitAwbFooter = async(data:any, id:any) => {
    let payload = {
      franchisee_id : id,
      charges: data
    }
    console.log("pureure", payload)
    try {
      const res:any = await commonpostrequest(`booking/cs-additional-billing/send-charges-mail`, payload);
      if(res?.status == 200) {
        showAlert("Mail successfully send!!");
        setAwbCharges([]);
        setCheckedAwbs([]); 
        setOpenMailModal(false)
      } else {
        showAlert("Something went wrong!", "error")
      }
    
    } catch (err:any) {
      console.log("err", err)
    }
  }
  useEffect(() => {
    getaddcharg();
  }, [debouncedSearchTerm, page]);
  useEffect(() => {
    getCardData();
    chargeHead();
    funcFranchiseeData();
    getVendor();
  }, []);
  // console.log("Har ajay",uploadedFileData)
  return (
    <div>
      <div className="mt-3  w-full py-8  px-5 bg-white rounded-lg shadow-lg">
        <div className="justify-between relative flex mb-2">
          <div className="relative flex items-center gap-3 font-bold text-lg">
            CS BILLING
            {batch_number && (
              <span className="text-sm font-medium text-white bg-primary px-3 py-1 rounded-full">
                Batch: {batch_number}
              </span>
            )}
          </div>

          <div className="justify-end relative flex md:ml-5 mt-3 md:mt-0">
            {pdata?.create_permission ? (
            <button
              onClick={() => navigate("/backoffice/vendor_batch_dashboard")}
              className="btnAnimation overflow-hidden duration-200 inline-flex items-center justify-center cursor-pointer bg-primary text-white text-base py-2 px-4 rounded-lg hover:bg-blue-700 transition uppercase mr-2"
            >
              Vendor Batch Dashboard
            </button>
             ) : (
            ""
          )}
            <div>
              <FormInput
                placeholder="Search by AWB..."
                value={searchAll}
                onChange={(e) => {
                  setSearchAll(e.target.value);
                  setPage(0);
                }}
              />
            </div>
            {additionalchargeslist?.length > 0 && (
              <button
                disabled={chargesloading}
                onClick={() => csvDataForPrint()}
                className="btnAnimation overflow-hidden  duration-200  inline-flex items-center justify-center cursor-pointer  bg-success text-white text-base py-2 px-4 rounded-lg hover:bg-yellow-250 transition uppercase ml-2"
              >
                <Download className="mr-2 w-[18px]" /> Download
              </button>
            )}
          </div>
        </div>
 <style>{`
        @keyframes morph {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                 
          }
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
          }
        }
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
      `}</style>
      <style>
        {`
@keyframes softBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
.soft-bounce {
  animation: softBounce 2.5s ease-in-out infinite;
}
`}</style>
        
        <div className="w-full mt-2">
        <h1 className="mr-auto text-xl text-primary font-bold ">
       Billed
        </h1>
      </div>
      <div className="w-full mt-2">
        <div className="grid grid-cols-12 gap-[9px] w-full">
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <div className="w-full relative overflow-hidden relative border-2  border-[#f6f6f6] rounded-lg p-2 mb-3  bg-[#fafafb]  group  hover:bg-gradient-to-l hover:from-[#fff] hover:via-[#fff] hover:to-[#fff5d4]  hover:border-[#fff]">
              <div className="  w-full flex px-1 pb-1 pt-[2px] items-center ">
                <figure className=" w-[55px] h-[50px] flex items-center justify-center  animate-morph transition-all duration-1000 z-[5] bg-[#fbf7be] group-hover:bg-[#fff]">
                  <img src={new_billICON} alt=""  className="w-[23px] "/>
                </figure>
                <aside className=" w-full pl-3">
                  <h2 className="text-[#696969] text-[13px] font-medium  uppercase leading-[20px] group-hover:text-[#c48d13]">
                 New
                  </h2>

                  <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                    {cardData?.new_charges ? cardData?.new_charges : "0"}
                  </div>
                </aside>
              </div>

           
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <div className="w-full  overflow-hidden relative border-2  border-[#f6f6f6]  rounded-lg p-2 mb-3  bg-[#fafafb] group  hover:bg-gradient-to-l hover:from-[#fff] hover:via-[#fff] hover:to-[#fff5d4]  hover:border-[#fff]">
              <div className="  w-full flex px-1 pb-1 pt-[2px] items-center ">
                <figure className=" w-[55px] h-[50px] flex items-center justify-center  animate-morph transition-all duration-1000 z-[5]  bg-[#F2DFB4] group-hover:bg-[#fff]">
                  <img src={close_billedICON} alt="" className="w-[23px] " />
                </figure>
                <aside className=" w-full pl-3">
                  <h2 className="text-[#696969] text-[13px] font-medium  uppercase leading-[20px] group-hover:text-[#c48d13]">
                  Not Needed
                  </h2>

                  <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                    {cardData?.not_billed ? cardData?.not_billed : "0"}
                  </div>
                </aside>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <div className="w-full  overflow-hidden relative border-2  border-[#f6f6f6]  rounded-lg p-2 mb-3 bg-[#fafafb] group  hover:bg-gradient-to-l hover:from-[#fff] hover:via-[#fff] hover:to-[#fff5d4]  hover:border-[#fff]">
              <div className="  w-full flex px-1 pb-1 pt-[2px] items-center ">
                <figure className=" w-[55px] h-[50px] flex items-center justify-center  animate-morph transition-all duration-1000 z-[5]  bg-[#D9E2FF] group-hover:bg-[#fff]">
                    <img src={billedICON} alt="" className="w-[27px] " />
                </figure>
                <aside className=" w-full pl-3">
                  <h2 className="text-[#696969] text-[13px] font-medium  uppercase leading-[20px] group-hover:text-[#c48d13]">
                   Billed
                  </h2>

                  <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                    {cardData?.billed ? cardData?.billed : "0"}
                  </div>
                </aside>
              </div>
            </div>
          </div>

      
  <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <div className="w-full  overflow-hidden relative border-2  border-[#f6f6f6]  rounded-lg p-2 mb-3  bg-[#fafafb] group  hover:bg-gradient-to-l hover:from-[#fff] hover:via-[#fff] hover:to-[#fff5d4]  hover:border-[#fff]">
              <div className="  w-full flex px-1 pb-1 pt-[2px] items-center ">
                <figure className=" w-[55px] h-[50px] flex items-center justify-center  animate-morph transition-all duration-1000 z-[5]  bg-[#fee] group-hover:bg-[#fff]">
                    <img src={holdICON} alt="" className="w-[27px] " />
                </figure>
                <aside className=" w-full pl-3">
                  <h2 className="text-[#696969] text-[13px] font-medium  uppercase leading-[20px] group-hover:text-[#c48d13]">
                   hold
                  </h2>

                  <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                    {cardData?.hold ? cardData?.hold : "0" }
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-2">
          <div>
            <FormLabel>Select Status</FormLabel>
            <FormSelect
              value={statusDropdown}
              onChange={(e) => setStatusDropdown(e.target.value)}
            >
              {/* <option value={''}>Select one</option> */}
              <option value={""}>All</option>
              <option value={1}>Billed</option>
              <option value={0}>New</option>
              <option value={3}>Hold</option>
              <option value={2}>Not Needed</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel>Charge Status</FormLabel>
            <FormSelect
              value={listTypeFilter}
              onChange={(e) => setListTypeFilter(e.target.value)}
            >
              <option value={""}>All</option>
              <option value={"kavach"}>Kavach</option>
              <option value={"billed"}>Billed</option>
              <option value={"additional_pending"}>Additional Pending</option>
            </FormSelect>
          </div>
          <div>
            <FormLabel>Franchisee</FormLabel>
            <CommonSearchableAll
              apiEndpoint={`admin/franchisee-settings`}
              placeholder={"Search By Franchisee"}
              selecteddata={selectedfranchisedata}
              setSelecteddata={setSelectedfranchisedata}
              fun1={fun1}
              comingselectedname={"franchisee_name"}
              comingselectedid={"franchisee_id"}
              funtoempty={funtoempty}
              key1={"key"}
              zIndex={20}
            />
          </div>
          <div>
            <FormLabel>Charge Head</FormLabel>
            <FormSelect
              value={chargeType}
              onChange={(e) => setChargeType(e.target.value)}
            >
              {/* <option value={''}>Select one</option> */}
              <option value={""}>All</option>
              <option value={2}>Additional</option>
              <option value={3}>Debit</option>
            </FormSelect>
          </div>

          <div className="flex flex-wrap items-end gap-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
            {/* <Button
              onClick={() => { getMailAwbfunc(selectedfranchisedata?.franchisee_id); setOpenMailModal(true); }}
              disabled={!selectedfranchisedata?.franchisee_id}
              className="flex-1 min-w-[130px] p-2 bg-blue-500 hover:bg-blue-700 text-white"
            >
              Send Email
            </Button> */}
            <Button
              variant="mustard"
              onClick={() => getaddcharg()}
              disabled={chargesloading}
              className="flex-1 min-w-[130px] p-2"
            >
              <Search className="mr-1" />
              Search
              {chargesloading ? (
                <LoadingIcon icon="tail-spin" className="block m-auto w-[4%]" />
              ) : (
                ""
              )}
            </Button>
            <Button
              onClick={() => handleReset()}
              className="flex-1 min-w-[130px] p-2.5 bg-red-400 text-white"
            >
              Reset <RxReset />
            </Button>
          </div>
        </div>
        <div className="w-full UPLOtABLE">
          <div className="overflow-x-auto pb-[20px]">
            {additionalchargeslist?.length > 0 ? (
              <CommonTable columns={columns} row={row} page={page || 0} />
            ) : (
              <Nodatafound />
            )}
          </div>
        </div>
      </div>
      {openModal && (
        <CommonModal
          open={openModal}
          // size={forwhat == 1 || forwhat == 3 ? "2xl" : "lg"}
          size="lg"
          title={
            forWhat == 1
              ? "Hold"
              : forWhat == 2
              ? "No billing"
              : forWhat == 3
              ? "Okay to bill"
              : ""
          }
          setOpen={setOpenModal}
          description={modalDescription}
          footer={footer}
        />
      )}
      <CommonModal
        open={openMailModal}
        // size={forwhat == 1 || forwhat == 3 ? "2xl" : "lg"}
        size="lg"
        title=  {modalMailTitle}
        setOpen={setOpenMailModal}
        description={modalMailDescription}
        footer={footerMail}
      />

       <CommonModal
        open={openDocModal}
        // size={forwhat == 1 || forwhat == 3 ? "2xl" : "lg"}
        size="lg"
        title=  {DocTitle}
        setOpen={setOpenDocModal}
        description={modalDocDescription}
        footer= ""
      />

      {additionalchargeslist?.length >= 1 ? (
        <CommonPagination
          onPageChange={onPageChange}
          page={Number(page + 1)}
          totalpages={Number(totalPages)}
        />
      ) : (
        ""
      )}
    </div>
  );
}
