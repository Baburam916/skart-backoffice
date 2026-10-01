import React, { useCallback, useEffect, useState,useRef } from "react";

import {
  Search,
  UserCog,
  ChevronDown,
  Trash2,
  Eye,
  ClipboardList,
  ChevronLeft,
  List,
  Edit2,
  Plus,
  Upload,
  Download,
  File,
  CalendarDays,
} from "lucide-react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from "../../../base-components/Form";

import Button from "../../../base-components/Button";

import Table from "../../../components/Table";

import { Menu } from "../../../base-components/Headless";
import {
  commongetrequest,
  commonpostrequest,
  commonputrequest,
  universalget,
} from "../../../AllServices/services";
import { useAlert } from "../../../ContextProvider/AlertContext";
import CommonModal from "../../skart_sales/commoncomponents/CommonModal/CommonModal";
import CustomerForm from "./customerForm";
import { formatIndianNumber } from "../../skart_sales/commoncomponents/CommonNumberConverter/CommonNumberconverter";
import LoadingButtonCommon from "../../skart_sales/commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import { formatDate } from "../../skart_sales/commoncomponents/commondateformat/datetoreqformat";
import { mapErrorsToErrorObject } from "../../skart_sales/commoncomponents/Handleerrorsfun/Maperrors";
import { Edit } from "lucide-react";
import { MdClose, MdEmail, MdUpdate } from "react-icons/md";
import CommonPagination from "../../../components/Pagination";
import { useDebounce } from "../../../components/Search";
import IsLoading from "../../skart_sales/commoncomponents/isLoading/isLoading";
import { Minus } from "lucide-react";
import CommonSearchableAll from "../../skart_sales/commoncomponents/CommonSearchableall/CommonSearchableall";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { jsontocsv } from "../../skart_sales/commoncomponents/JsonToCsv/Jsontocsv";
import { ClassicEditor } from "../../../base-components/Ckeditor";
import { convertUTCtoIST } from "../../../components/UtcToIst";
import { Mail } from "lucide-react";
import { Check } from "lucide-react";
import { X } from "lucide-react";
import Tippy from "../../../base-components/Tippy";
import ImportBookings from "./ImportBookings";
import Scan_events from "./addTrackEvents";
import { getCurrentDate } from "../../../utils";
// import "../Cs_dashboard/module.css";

// import FormSelect from "../../../base-components/form/FormSelect";
const intarrcharges2 = {
  charge_id: "",
  weight: 1,
  rate: 0,
  per_kg: 2,
  inr_amount: 0,
  currency: "24",
  job_id: "",
  ex_rate: "1",
  pp_cc: "1",
  party: "",
  party_name: "",
  sac_code: "",
};
const intarrcharges = {
  charge_id: "",
  weight: 1,
  rate: 0,
  per_kg: 2,
  inr_amount: 0,
  currency: "24",
  enquiry_id: "",
  ex_rate:1,
  sac_code: "",
};
const intexchangedata = [
  {
    id: "1",
    currency_id: "24",
    currency: "INR",
    ex_rate: "1",
  },
  {
    id: "2",
    currency_id: "",
    currency: "",
    ex_rate: "",
  },
  {
    id: "3",
    currency_id: "",
    currency: "",
    ex_rate: "",
  },
];
const intdata = {
  pickup_franchisee_id: "",
  chargeable_weight: "",
  master: "",
  job_id: "",
  contact_person_details: [
    {
      mobile_no: "",
      contact_person: "",
      email: "",
    },
  ],
  inco_term: "",
  remarks: "",
  updated_status: "",
  consignee_name: "",
  consignee_email: "",
  consignee_contact_number: "",
};
const intremarksdata = {
  job_id: "",
  mail_trigger: 0,
  cs_remarks: "",
  follow_up: 0,
  mail_subject: "",

  updated_status: "",
};
const interrors = {
  consignee_name: "",
  consignee_email: "",
  consignee_contact_number: "",
  inco_term: "",
};
const intfranchiseedata = {
  franchisee_name: "",
  franchisee_id: "",
};
const intfilterdata = {
  from_date: "",
  to_date: "",
  hub_id:""
};
 const intexchangedataSell = [
    {
      id: "1",
      currency_id: "24",
      currency: "INR",
      ex_rate: "1",
    },
    {
      id: "2",
      currency_id: "",
      currency: "",
      ex_rate: "",
    },
    {
      id: "3",
      currency_id: "",
      currency: "",
      ex_rate: "",
    },
  ];
const Customer_service = ({ importbookingp }: any) => {
  const { showAlert } = useAlert();
   const [exchangedataSell, setExchangedataSell] = useState<any>(intexchangedataSell);
  const [mode, setMode] = useState<any>("edit");
  const [datatopost, setDataToPost] = useState<any>(intdata);
  const [filterdata, setFilterdata] = useState<any>(intfilterdata);
  const [allerrors, setAllerrors] = useState<any>(interrors);
  const [chargesList, setChargesList] = useState<Array<any>>([]);
  const [remarksdata, setRemarksdata] = useState<any>(intremarksdata);
  const [postloading, setPostloading] = useState<boolean>(false);
  const [agentdetails, setAgentDetails] = useState<any>([]);
  const [incoterm, setIncoterm] = useState<any>([]);
  const [forwhat, setForWhat] = useState<any>(1);
  const [hit, setHit] = useState<any>(1);
  const [page, setPage] = useState<any>(1);
  const [totalpages, setTotalPages] = useState<any>(1);
  const [loading, setLoading] = useState<any>(false);
  const [statusdata, setStatusdata] = useState<any>([]);
  const [totalbuy, setTotalBuy] = useState<any>(0);
  const [totalSell, setTotalsell] = useState<any>(0);
  const [alltypedata, setAlltypedata] = useState<any>([]);
  const [Attatchments, setAttatchments] = useState<any>([]);
  const [toggle, setToggle] = useState<any>(1);
  const [buycharges, setBuyCharges] = useState<any>([intarrcharges2]);
  const [singlefranchiseedata, setSinglefranchiseedata] = useState<any>({});
  const [sellingcharges, setSellingCharges] = useState<any>([
    {
      ...intarrcharges,
     
    },
  ]);
  const [buychargesadd, setBuyChargesadd] = useState<any>([intarrcharges2]);
  const [sellingchargesadd, setSellingChargesadd] = useState<any>([
    { ...intarrcharges },
  ]);
  const [toggleadd, setToggleadd] = useState<any>(1);
  const [exchangedata, setExchangedata] = useState<any>(intexchangedata);
  const [franchiseedata, setFranchiseedata] = useState<any>([]);
  const [gstStatus, setGstStatus] = useState<any>(0);
  const [allvendordropdowndata, setAllvendordropdowndata] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [mawb, setMawb] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const mawbdebounce = useDebounce(mawb, 500);
  const [currencydata, SetCurrencyData] = useState<any>([]);
  const [csData, setCsData] = useState<Array<any>>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModal2, setOpenModal2] = useState<boolean>(false);
  const [allstatus, setAllstatus] = useState<any>([]);

  const [csvfiles, setCsvfiles] = useState<any>("");
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [openModal1, setOpenModal1] = useState<any>(false);
  const [downloadSpinner, setDownloadSpinner] = useState(false);
  const [downloadData, setDownloadData] = useState<any>([]);
  const [searchCase, setSearchCase] = useState<any>("all");
  const [bccInput, setBccInput] = useState<string>("");

  const [bccList, setBccList] = useState<any>([]);
  const [openRemove, setOpenRemove] = useState<boolean>(true);

  const [docTypes, setDocTypes] = useState<Array<any>>([]);
  const [editorData, setEditorData] = useState("");
  const [trackerData, setTrackerData] = useState<any>({
    pickup_id: "",
    data: [],
  });
  const [isDirect, setIsDirect] = useState<boolean>(false);
  const [mailDocModal, setMailDocModal] = useState<boolean>(false);
  const [countrydata, setCountryData] = useState<any>([]);
  const [courierproduct, setCourierProduct] = useState<any>([]);
  const [rowData, setRowdata] = useState<any>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [hubdata,setHubdata]=useState([])
  useEffect(() => {
    getintdata();
  }, []);
  const getattachments = async (jobId?: any) => {
    try {
      const res = await commongetrequest(
        `booking/cs/job_scan_event_list/${jobId}`,
      );
      if (res?.status == 200) {
        setAttatchments(res?.data?.data || []);
      } else {
        setAttatchments([]);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  useEffect(() => {
    if (!openModal && !openModal2) {
      setBuyChargesadd([
        {
          charge_id: "",
          weight: 1,
          rate: 0,
          per_kg: 2,
          inr_amount: 0,
          currency: "24",
          job_id: "",
          ex_rate: "1",
          pp_cc: "1",
          party: "",
          party_name: "",
          sac_code: "",
        },
      ]);
      setSellingChargesadd([
        {
          charge_id: "",
          weight: 1,
          rate: 0,
          per_kg: 2,
          inr_amount: 0,
          currency: "24",
          enquiry_id: "",
          sac_code: "",
        },
      ]);
    }
  }, [openModal]);
  const fun1 = (value: any) => {
    // setFranchiseeId(value?.franchisee_id);
    setHit(3);
    setPage(1);
  };
  const funtoempty = () => {
    setSelectedfranchisedata(intfranchiseedata);
    setHit(3);
    // getJob(1, "empty");
    setPage(1);

    // setHit(3);
    // setFranchiseeId("");
  };
  const functiontoreset=useCallback(()=>{
     getJob(1, "","","reset");
       setSelectedfranchisedata(intfranchiseedata);
       setHit(1);
       setMawb("")
     
       setPage(1);
        setSearchCase('all');
        setOpenRemove(false);
        setSearch("");

        setFilterdata(intfilterdata);
        

  },[])

  const updateData = async (pickup_id: any, item?: any, forwhat?: any) => {
    try {
      const res = forwhat ? await commongetrequest(`track_shipment/track-shipment/${pickup_id}`) : await commongetrequest(
        `track_shipment/customer_service_events_list/${pickup_id}/${item?.airwaybilno}?is_import=${item?.import_booking || ""}`,
      );
      if (res?.status === 200 && Array.isArray(res?.data?.data)) {
        if (forwhat) {
          setTrackerData({
            pickup_id: res?.data?.data[0]?.pickup_id,
            data: res?.data?.data,
          });
        }
        else {
          const jsonData = res?.data?.data[0]?.json_data || [];
          const formattedData = jsonData.map((item: any) => ({
            status: item.status,
            mail_trigger: item.mail_trigger,
            date: item.date || "",
            status_code: item?.status_code || "",
            remarks: item?.remarks || "",
            email_content: item?.email_content || "",
          }));
          setTrackerData({
            pickup_id: res?.data?.data[0]?.pickup_id,
            data: formattedData,
          });
        }

      } else {

        setTrackerData({ pickup_id: "", data: [] })
      }
    } catch (error) {
      console.error("Error fetching tracker data:", error);
    }
  };

  const gettotal = (data?: any, key?: any) => {
    const total = data.reduce(
      (total, item) => total + Number(item[key] || 0),
      0,
    );
    return total;
  };
  const computeChargesGST = (charges: any[], type: "sell" | "buy", zeroCondition: boolean): number => {
    if (zeroCondition) return 0;
    return (charges || []).reduce((total: number, item: any) => {
      const inr = parseFloat(String(item.inr_amount || "0"));
      const isExempt = type === "sell" ? item.charge_id == 162 : item.charge_id == 163;
      if (isExempt) return total;
      const chargeInfo = type === "sell"
        ? chargesList?.find((c: any) => c.ref_sell_id == item.charge_id)
        : chargesList?.find((c: any) => c.charge_id == item.charge_id);
      const igstRate = parseFloat(chargeInfo?.tax_breakup?.igst || "18") / 100;
      return total + inr * igstRate;
    }, 0);
  };
  // get totalsumint
  useEffect(() => {
    setTotalBuy(gettotal([...buycharges, ...buychargesadd], "inr_amount"));
  }, [JSON.stringify(buycharges), JSON.stringify(buychargesadd)]);
  useEffect(() => {
    setTotalsell(
      gettotal([...sellingcharges, ...sellingchargesadd], "inr_amount"),
    );
  }, [JSON.stringify(sellingcharges), JSON.stringify(sellingchargesadd)]);
  const handledatatopost = (e: any) => {
    const { name, value } = e.target;
    setDataToPost((pre: any) => ({ ...pre, [name]: value }));
    setAllerrors((pre: any) => ({ ...pre, [name]: "" }));
  };
  const getsinglefdata = async (id?: any) => {
    try {
      const singlefdata = await commongetrequest(`admin/franchisee-settings?franchisee_id=${id}`)
      if (singlefdata?.status == 200) {
        const data = singlefdata?.data?.data[0]
        setSinglefranchiseedata(data)
        setSellingCharges([
          {
            ...intarrcharges,
       
          },
        ])
      } else {
        setSinglefranchiseedata({})
      }
    } catch (err: any) {
      console.log(err?.message)
    }
  }
  const getcustomerservicestatus = async (data?: any) => {
    try {
      const statusres = await commongetrequest(
        "track_shipment/customer_service_status/0",
      );
      if (statusres?.status == 200) {
        const data = statusres?.data?.data || [];
        const newdata = data?.map((item: any) => ({
          ...item,
          status_code: Number(item?.status_code),
        }));
        setStatusdata(newdata || []);
        //   job_id: item?.job_id,
        //   cs_remarks: item?.cs_remarks,
        //   updated_status: item?.updated_status,
        //   booking_no: item?.booking_no || "",
        //   pickup_id: item?.pickup_id || "",
        //   charges_docs:item?.charges_docs||[],
        //   hub_id:item?.hub_id||""
        setRowdata(
          data?.map((item: any) => ({
            id: crypto.randomUUID(),
            cs_remarks: "",
            event_date_time: getCurrentDate() || "",
            is_edit: false,
            event: item?.status,
            remarks: "",
            date: "",
            updated_status: item?.status_code,
            children: [],
            email_content: item?.email_content || ""
          }))
        );
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const getintdata = async () => {
    try {
      setLoading(true);
      getcustomerservicestatus();
      const typedata = await commongetrequest("master/customer-type-data_ac/2");
      const currency = await commongetrequest("booking/currency");
      const res = await commongetrequest("admin/charges?type=E&is_cargo=1");
      const franchiseedatares = await commongetrequest(
        "admin/franchisee-settings",
      );

      const incores = await commongetrequest("booking/incoterm");

      const vendorlistres = await commongetrequest("admin/vendor-settings");
      const allstatusres = await commongetrequest("track_shipment/all/status");
      const countryres = await commongetrequest("admin/country");
      const courierres = await commongetrequest("admin/courier-product");
const hubres=await commongetrequest("admin/hub")
      if (incores?.status == 200) {
        setIncoterm(incores?.data?.data || []);
      }

      if (typedata?.status == 200) {
        setAlltypedata(typedata?.data?.data || []);
      }
      if (res?.status == 200) {
        setChargesList(res?.data?.data);
      }
      if (currency?.status == 200) {
        SetCurrencyData(currency?.data?.data || []);
      }
      if (vendorlistres?.status == 200) {
        setAllvendordropdowndata(vendorlistres?.data?.data || []);
      }
      if (franchiseedatares?.status == 200) {
        setFranchiseedata(franchiseedatares?.data?.data || []);
      }
      if (allstatusres?.status == 200) {
        setAllstatus(allstatusres?.data?.data || []);
      }
      if (countryres?.status == 200) {
        setCountryData(countryres?.data?.data);
      }
      if (courierres?.status == 200) {
        setCourierProduct(courierres?.data?.data || []);
      }
      if(hubres?.status==200){
        setHubdata(hubres?.data?.data||[])
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpenModal(false);
    setDataToPost(intdata);
    setEditorData("");
    setBuyCharges([intarrcharges2]);
    setSellingCharges([intarrcharges]);
    getJob(1);
    setForWhat(1);
    setRemarksdata(intremarksdata);
    setCsvfiles("");
    setMode("edit");


    setSinglefranchiseedata({})
    setRowdata([])
    getcustomerservicestatus()
    setBccInput("")
    setBccList([])
    setExchangedataSell(intexchangedataSell)
    setExchangedata(intexchangedata)
    setSellingChargesadd([{ ...intarrcharges }])
    setBuyChargesadd([intarrcharges2])
    //  setToggle(1)
    //  setToggleadd(1)
  };

  //   const check=(forwhat?:any,buy?:any,sell?:any)=>{const isAllFieldsFilledExcept = (
  //     item: Record<string, any>,
  //     excludedKeys: string[]
  //   ): boolean => {
  //     if (!item) return false;

  //     for (const [key, value] of Object.entries(item)) {
  //       if (!excludedKeys.includes(key)) {
  //         const isEmpty =
  //           value == "" || value == null || value == undefined || value == 0;
  //         if (isEmpty) return false;
  //       }
  //     }

  //     return true;
  //   };
  // if(forwhat=="both"){
  //    if (
  //      !isAllFieldsFilledExcept(buy[buy.length - 1], [
  //        "ex_rate",
  //        "party",
  //        "pp_cc",
  //        "sgst_amount",
  //        "igst_amount",
  //        "cgst_amount",
  //        "enquiry_id",
  //        "sell_rate",
  //        "job_id",
  //      ]) &&
  //      forwhat == 2 &&
  //      !sell[sell?.length - 1]?.charge_id &&
  //      !sell[sell?.length - 1]?.inr_amount
  //    ) {
  //      showAlert(
  //        "No Additional Cost Added or Please provde all required data",
  //        "warning"
  //      );
  //      return;
  //    }
  // }
  //   }
  const funtouploadorupdated = async (
    data?: any,
    documentdata?: any,
    extradata?: any,
    index?: any,
  ) => {

    if (
      (remarksdata?.doc_remarks && csvfiles && !extradata) ||
      (extradata && extradata?.files)
    ) {
      try {
        setPostloading(true);
        const res = await commonputrequest(
          "booking/cs/upload_document",
          documentdata,
        );
        if (res?.status == 200) {
          const resdata = res?.data;
          const mailres = await commonpostrequest("booking/cs", {
            ...data,
            mail_attachments: extradata
              ? extradata?.mail_attachments || ""
              : resdata?.mail_attachments,
            ...{},
            ...extradata?.type == "child" ? { updated_status: 0 } : {}
          });
          if (mailres?.status == 200) {
            showAlert(res?.data?.message || "Action Performed Successfully");
            if (openModal2) {
              setRemarksdata(intremarksdata);
              setOpenModal2(false);
              setEditorData("");
              setForWhat(1);
              setBccInput("");
              setBccList([]);
            } else {
              if (forwhat == 5 || forwhat == 2) {
                setForWhat(2);
                setCsvfiles("");
                fileInputRefs.current[index]!.value = "";
                if (remarksdata?.doc_remarks) {
                  setRemarksdata((pre: any) => ({ ...pre, doc_remarks: "" }));
                }
                setDataToPost((pre: any) => ({ ...pre, index: 0 }));

                getJob(1, "", datatopost);
              } else {
                handleCancel();
              }
            }
          } else {
            showAlert(
              mailres?.response?.data?.message ||
              "Oops! something going wrong please try after some time!",
              "error",
            );
          }
        } else {
          showAlert(
            res?.response?.data?.message ||
            "Oops! something going wrong please try after some time!",
            "error",
          );
        }
      } catch (err: any) {
        console.log(err?.message);
      } finally {
        setPostloading(false);
        setIsDirect(false);
      }
    } else {
      try {
        setPostloading(true);
        const mailres = await commonpostrequest("booking/cs", data);
        if (mailres?.status == 200) {
          showAlert(mailres?.data?.message || "Action Performed Successfully");
          if (openModal2) {
            setRemarksdata(intremarksdata);
            setOpenModal2(false);
            setEditorData("");
            setForWhat(1);
            setBccInput("");
            setBccList([]);
          } else {
            if (forwhat == 5 || forwhat == 2) {
              setForWhat(2);
          
              getJob(1, "", datatopost);
            } else {
              handleCancel();
            }
          }
        } else {
          showAlert(
            mailres?.response?.data?.message ||
            "Oops! something going wrong please try after some time!",
            "error",
          );
        }
      } catch (err: any) {
        console.log(err?.message);
      } finally {
        setPostloading(false);
        setIsDirect(false);
      }
    }
  };
   
  const funcShowDoc = (data: any) => {
    setDocTypes(data);
    setOpenModal1(true);
  };

  const handlemailandsubject = (forwhat: any, status?: any, value?: any) => {
    if (forwhat == "subject") {
      return `Shipment Update: ${remarksdata?.booking_no}- ${datatopost?.airwaybilno || ""
        }${datatopost?.master ? `/${datatopost?.master}` : ""}`;
      //   ${
      //   status == 0
      //     ? value || remarksdata?.other || ""
      //     : statusdata?.find((item: any) => item?.status_code == status)
      //         ?.status || ""
      // } for enquiry ${remarksdata?.booking_no || ""}
    } else {
      setEditorData(`
  <p>Dear,</p>
  <p>Greetings of the day!</p>

  <p>
    This is to inform you that your shipment is currently at the status:
    <strong>${status == 0
          ? value || remarksdata?.other || ""
          : statusdata?.find((item: any) => item?.status_code == status)
            ?.status || ""
        }</strong>
    for the spot enquiry <strong>${remarksdata?.booking_no}</strong>.
  </p>

  <!-- NEW DETAILS ADDED BELOW -->
  <table width="100%" cellpadding="6" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; margin: 10px 0; border: 1px solid #ddd;">
    <tbody>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>POL (Port of Loading):</strong> ${countrydata?.find(
          (item: any) => item?.country_id == datatopost?.org_country_id,
        )?.country_name || "N/A"
        }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>POD (Port of Destination):</strong> ${datatopost?.port_of_dest || "N/A"
        }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>GW (Gross Weight):</strong> ${datatopost?.gross_weight || "N/A"
        }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>No. of Packages:</strong> ${datatopost?.packages || "N/A"
        }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>CW (Chargeable Weight):</strong> ${datatopost?.chargeable_weight || "N/A"
        }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>Departure Date:</strong> ${remarksdata?.departure_date || "N/A"
        }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>Arrival Date:</strong> ${remarksdata?.arrival_date || "N/A"
        }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"></td>
      </tr>
    </tbody>
  </table>
  <!-- END DETAILS -->

  <p>We will continue to keep you updated on any further progress or required action.</p>
  <p>For any queries, please feel free to reach out to us.</p>
  <p>Best regards,</p>
`);
    }
  };
  function renderTemplate(template?: any, data = {}) {
    return template.replace(/{{(.*?)}}/g, (match, key) => {
      const value = data[key.trim()];
      return value !== undefined && value !== null ? value : "";
    });
  }
  const handlesave = async (value?: any, direct?: any, extradata?: any, index?: any) => {
    // const lastItem = allbuycharges[allbuycharges.length - 1];
    
  const isAllFieldsFilledExcept = (item, excludedKeys) => {
  if (!item) return false;
// console.log(item,excludedKeys,'dataaaaa')
  for (const [key, value] of Object.entries(item)) {
    if (!excludedKeys.includes(key)) {
      const isEmpty =
        value === "" || value === null || value === undefined;

      if (isEmpty) {
        console.log("❌ Empty field found:", key, value);
        return false;
      }
    }
  }

  return true;
};
    const lastBuyCharge = buychargesadd[buychargesadd.length - 1];
    const lastSellCharge = sellingchargesadd[sellingchargesadd.length - 1];

    const isLastBuyChargeIncomplete = !isAllFieldsFilledExcept(lastBuyCharge, [
      "ex_rate",
      "party",
      "pp_cc",
      "sgst_amount",
      "igst_amount",
      "cgst_amount",
      "enquiry_id",
      "sell_rate",
      "job_id",
      'old_buy'
    ]);

    const isNoAdditionalCostAdded =
      !isAllFieldsFilledExcept(lastBuyCharge, [
        "ex_rate",
        "party",
        "pp_cc",
        "sgst_amount",
        "igst_amount",
        "cgst_amount",
        "enquiry_id",
        "sell_rate",
        "job_id",
      ]) &&
      (forwhat == 1 || direct) &&
      !lastSellCharge?.charge_id &&
      !lastSellCharge?.inr_amount;

  const isSellingChargeIncomplete =
  lastSellCharge?.charge_id &&
  (
    !lastSellCharge?.inr_amount ||
    !lastSellCharge?.currency ||
    !lastSellCharge?.ex_rate
  );
  

    if (isSellingChargeIncomplete && (forwhat == 1 || direct)) {
      showAlert("Please provide selling charges correctly", "warning");
      return;
    }

    if (
      lastBuyCharge?.charge_id &&
      isLastBuyChargeIncomplete &&
      (forwhat == 1 || direct)
    ) {
      showAlert("Please provide Buying Charges Correctly", "warning");
      return;
    }

    // Currency & ex_rate mandatory check — selling
    const sellMissingCurrency = sellingchargesadd?.some(
      (item: any) => item?.charge_id && !item?.currency
    );
    if (sellMissingCurrency) {
      showAlert("Please select currency for all selling charges", "warning");
      return;
    }
    const sellMissingExRate = sellingchargesadd?.some(
      (item: any) => item?.charge_id && (!item?.ex_rate || Number(item?.ex_rate) <= 0)
    );
   
    if (sellMissingExRate) {
      showAlert("Please provide exchange rate for all selling charges", "warning");
      return;
    }

    // Currency & ex_rate mandatory check — buying
    const buyMissingCurrency = buychargesadd?.some(
      (item: any) => item?.charge_id && !item?.currency
    );
    if (buyMissingCurrency) {
      showAlert("Please select currency for all buying charges", "warning");
      return;
    }
    const buyMissingExRate = buychargesadd?.some(
      (item: any) => item?.charge_id && (!item?.ex_rate || Number(item?.ex_rate) <= 0)
    );
    if (buyMissingExRate) {
      showAlert("Please provide exchange rate for all buying charges", "warning");
      return;
    }

    if (forwhat == 1 && !direct) {
      handleemailModal();
    }
    if (forwhat == 1 && !direct && !openModal2) {
      return;
    }

    //  if(isAllFilled){
    const latestselldata = sellingchargesadd?.map((item: any) => ({
      ...item,
      old_sell: 0,
    }));
    const latestbuydata = buychargesadd?.map((item: any) => ({
      ...item,
      old_buy: 0,
    }));



    let uploaddocumentdata = new FormData();

    if (forwhat == 4 || forwhat == 5 || forwhat == 2 || forwhat == 6) {
      if (forwhat == 4) {
        if (!remarksdata?.cs_remarks || !csvfiles) {
          showAlert("Please provide all required details", "warning");
          return;
        }
      }
      if (
        (forwhat == 5 || forwhat == 6) &&
        csvfiles &&
        !remarksdata?.doc_remarks
      ) {
        showAlert("Please provide doc. remarks", "warning");
        return;
      }

      if (csvfiles) {
        Array.from(csvfiles)?.forEach((file: any) => {
          uploaddocumentdata.append("files", file);
        });
      }
      if (!extradata) {
        uploaddocumentdata.append(
          "remark",
          forwhat == 4 ? remarksdata?.cs_remarks : remarksdata?.doc_remarks,
        );
        uploaddocumentdata.append("job_id", remarksdata?.job_id);
        uploaddocumentdata.append(
          "mail_trigger",
          remarksdata?.mail_trigger || 0,
        );
        uploaddocumentdata.append(
          "updated_status",
          remarksdata?.updated_status || 0,
        );
      }

      if (extradata && extradata?.files) {
        Array.from(extradata?.files)?.forEach((file: any) => {
          uploaddocumentdata.append("files", file);
        });
        uploaddocumentdata.append("remark", extradata?.cs_remarks);
        uploaddocumentdata.append(
          "event_date_time",
          extradata?.event_date_time,
        );
        uploaddocumentdata.append("job_id", extradata?.job_id);
        uploaddocumentdata.append(
          "mail_trigger",
          remarksdata?.mail_trigger || 0,
        );
        uploaddocumentdata.append(
          "updated_status",
          extradata?.updated_status || 0,
        );
        uploaddocumentdata.append("import_booking", extradata?.import_booking);
      }

      if (extradata?.status_code) {
        uploaddocumentdata.append("status_code", extradata?.status_code);
      }
      if (extradata?.index) {
        setDataToPost((pre: any) => ({ ...pre, index: extradata?.index }));
      }
    }
  
    const testfor2 = () => {
      if (
        (forwhat == 5 || forwhat == 6) &&
        (remarksdata?.updated_status || remarksdata?.updated_status == 0)
      ) {
        if (remarksdata?.updated_status == 0 && !remarksdata?.other) {
          showAlert("Please provide Other Status", "warning");
          return true;
        }
        if (remarksdata?.mail_trigger) {
          if (
            editorData &&
            remarksdata?.mail_subject &&
            (Number(remarksdata?.updated_status) ||
              (remarksdata?.updated_status == 0 && remarksdata?.other)) &&
            remarksdata?.cs_remarks
          ) {
            return false;
          } else {
            showAlert("Please provide All Required Details", "warning");
            return true;
          }
        }
      } else {
        return true;
      }
    };

    if ((forwhat == 5 || forwhat == 6) && testfor2()) {
      return;
    }

    const {
      job_id,
      mail_trigger,
      cs_remarks,
      follow_up,
      mail_subject,
      hub_id,
      updated_status,
      email_ids,
      mail_attachments,
      status_code,
      event_name,
      import_booking,
      event_date_time,
    } = extradata ? extradata : remarksdata;

    if (value == 5 || value == 6) {
      funtouploadorupdated(
        {
          job_id,
          mail_trigger,
          cs_remarks,
          follow_up,
          mail_subject,
          event_date_time,
          mail_content: extradata?.mail_content || editorData,
          updated_status,
          mail_attachments,
          hub_id,
          ...(email_ids?.length >= 1 ? { email_ids: email_ids } : {}),
          ...(mail_trigger ? { other: remarksdata?.other } : {}),
          ...(status_code
            ? { status_code: status_code, other: event_name }
            : {}),
          import_booking,
        },
        uploaddocumentdata,
        extradata,
        index,
      );
    } else {
      try {
        setPostloading(true);
        direct ? setIsDirect(true) : setIsDirect(false);
        const res =
          value == 1
            ? await commonputrequest("booking/cs", {
              ...datatopost,
              job_id: datatopost?.job_id,
              franchisee_id: datatopost?.pickup_franchisee_id,

              sell_charges: latestselldata[latestselldata?.length - 1]
                ?.charge_id
                ? [...sellingcharges.filter((item:any)=>!item.inv_id),...latestselldata]
                : sellingcharges,
              mail_subject: remarksdata?.mail_subject,
              mail_content: editorData,
              ...(remarksdata?.email_ids?.length >= 1
                ? { email_ids: remarksdata?.email_ids }
                : {}),
              ...(latestbuydata?.length >= 1 &&
                lastBuyCharge?.charge_id &&
                !isLastBuyChargeIncomplete
                  ? { buy_charges: latestbuydata }
                  : { buy_charges: buycharges }),
              })
            : (value == 5||value==6)
            ? funtouploadorupdated(
                {
                  job_id,
                  mail_trigger,
                  cs_remarks,
                  follow_up,
                  mail_subject,
                  event_date_time,
                  mail_attachments,
                  mail_content: extradata
                    ? extradata?.mail_content
                    : editorData,
                  updated_status,
                  ...(email_ids?.length >= 1 ? { email_ids: email_ids } : {}),
                  ...(extradata?.status_code
                    ? { status_code: extradata?.status_code }
                    : {}),
                  ...(remarksdata?.mail_trigger
                    ? { other: remarksdata?.other }
                    : {}),
                  ...(status_code
                    ? { status_code: status_code, other: event_name }
                    : {}),
                  import_booking,
                },
                uploaddocumentdata,
                extradata,
                index,
              )
              : value == 4
                ? await commonputrequest(
                  "booking/cs/upload_document",
                  uploaddocumentdata,
                )
                : await commonpostrequest("booking/accounts-charges", {
                  job_id: datatopost?.job_id,
                  airwaybilno: datatopost?.airwaybilno,
                  franchisee_id: datatopost?.pickup_franchisee_id,
                  buy_charges: isAllFieldsFilledExcept(
                    buychargesadd[buychargesadd.length - 1],
                    [
                      "ex_rate",
                      "party",
                      "pp_cc",
                      "sgst_amount",
                      "igst_amount",
                      "cgst_amount",
                      "enquiry_id",
                      "sell_rate",
                      "job_id",
                      'old_buy'
                    ],
                  )
                    ? buychargesadd
                    : [],

                  sell_charges:
                    sellingchargesadd[sellingchargesadd?.length - 1]
                      ?.charge_id &&
                      sellingchargesadd[sellingchargesadd?.length - 1]
                        ?.inr_amount
                      ? sellingchargesadd
                      : [],
                  import_booking,
                });

        if (res?.status == 200) {
          if (value == 5) {
            setForWhat(2);
            fileInputRefs.current[index]!.value = "";
            setOpenModal(true);
          } else {
            showAlert(res?.data?.message || "Action Performed Successfully");
            if (openModal2) {
              setRemarksdata(intremarksdata);
              setOpenModal2(false);
              setEditorData("");
              setForWhat(1);
              setBccInput("");
              setBccList([]);
            } else {
              handleCancel();
            }
          }
        } else if (res?.status == 203) {
          showAlert(res?.data?.message || "", "warning");
        } else if (res?.response?.status == 400) {
          showAlert(
            res?.response?.data?.message ||
            "Something went Wrong!..,Please try after some time",
            "error",
          );
        } else if (res?.response?.status == 406) {
          const errors = mapErrorsToErrorObject(res?.response?.data?.errors);
          showAlert("please provide all required details ", "warning");
          setAllerrors(errors);
        } else {
          showAlert(
            "Something went Wrong!..,Please try after some time",
            "error",
          );
        }
      } catch (err: any) {
        console.log(err?.message);
      } finally {
        setPostloading(false);
        setIsDirect(false);
      }
    }
  };

  useEffect(() => {
    if (!franchiseedata || !datatopost?.pickup_franchisee_id) return;

    const singledata =
      franchiseedata?.find(
        (item: any) => item?.franchisee_id == datatopost?.pickup_franchisee_id,
      ) || {};

    setGstStatus(singledata?.gst_status || 0);
  }, [franchiseedata, datatopost?.pickup_franchisee_id]);

  const getparticulardata = (forwhat?: any, id?: any, data?: any) => {
    if (forwhat == "f") {
      const singledata = franchiseedata?.find(
        (item: any) => item?.franchisee_id == id,
      );
      return singledata;
    } else if (forwhat == "status") {
      const singledata = data?.find((item: any) => item?.status_code == id);
      return singledata;
    }
  };
  const title = (
    <div className="w-full flex justify-between">
      {getparticulardata("f", datatopost?.pickup_franchisee_id, franchiseedata)
        ?.franchisee_name || ""}
      {forwhat == 4 ? <div className="">UPLOAD DOCUMENT</div> : ""}
      {forwhat == 2 && datatopost?.import_booking == 1 ? (
        <div className="flex rounded-lg overflow-hidden border w-fit">
          <button
            className={`px-4 py-2 text-sm font-medium transition
      ${mode === "edit"
                ? "bg-mustard text-white"
                : "bg-gray-400 text-white hover:bg-gray-500"
              }
    `}
            onClick={() => setMode("edit")}
          >
            Edit Tracking Events
          </button>

          <button
            className={`px-4 py-2 text-sm font-medium transition
      ${mode === "view"
                ? "bg-mustard text-white"
                : "bg-gray-400 text-white hover:bg-gray-500"
              }
    `}
            onClick={() => setMode("view")}
          >
            View Tracking Events
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
  const title2 = <div className="w-full">Send Email</div>;
  const title1 = (
    <>
      <div className="flex justify-between w-full">
        <p>Check File</p>
        <div>
          <X className="cursor-pointer" onClick={() => setOpenModal1(false)} />
        </div>
      </div>
    </>
  );
  const mailTitle = <div className="w-full">DOCUMENTS</div>;
// console.log(datatopost,"data to post")
  const mailDescription = (
    <div className="col-span-12 ">
      <div
        className={`
    grid grid-cols-3 gap-4
    max-h-[420px]
    ${datatopost?.charges_docs?.filter((item: any) =>
          datatopost?.doctype == 1
            ? item?.is_mail == 1 &&
            item?.updated_status == datatopost?.mail_status
            : item?.is_mail != 1 &&
            item?.updated_status == datatopost?.mail_status,
        )?.length >= 8
            ? "overflow-auto"
            : ""
          }
  `}
      >
        {datatopost?.charges_docs?.filter(
          (item: any) =>
            item?.is_mail == 1 &&
            item?.updated_status == datatopost?.updated_status,
        )?.length >= 1 ? (
          datatopost?.charges_docs
            ?.filter((item: any) =>
              datatopost?.doctype == 1
                ? item?.is_mail == 1 &&
                item?.updated_status == datatopost?.mail_status
                : item?.is_mail != 1 &&
                item?.updated_status == datatopost?.mail_status,
            )
            ?.map((item2: any, index: number) => {
              const fileUrl = item2?.doc;
              const isDownloadFile =
                fileUrl?.endsWith(".csv") ||
                fileUrl?.endsWith(".xlsx") ||
                fileUrl?.endsWith(".zip") ||
                fileUrl?.endsWith(".xls");

              return (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...(isDownloadFile ? { download: true } : {})}
                  key={index}
                >
                  <Button className="p-2 bg-mustard text-white w-full">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 break-words">
                      {item2?.remark || "N.A"}
                    </h3>
                  </Button>
                </a>
              );
            })
        ) : (
          <div className="w-full col-span-12">
            <p className="text-center">Oops... NO Attatcments</p>
          </div>
        )}
      </div>
    </div>
  );
  const mailFooter = (
    <>
      <div className="flex justify-end items-end mr-7">
        <Button
          type="button"
          className="w-20 mr-1 bg-gray-200 text-primary p-1"
          onClick={() => {
            setMailDocModal(false);
            //  setOpenModal2(true);
            setOpenModal(true);
          }}
        >
          Cancel
        </Button>
      </div>
    </>
  );
  const handleBccChipDelete = async (index: number) => {
    const updatedList = [...bccList];
    updatedList.splice(index, 1);
    setBccList(updatedList);

    setRemarksdata((pre: any) => ({ ...pre, email_ids: updatedList }));
  };
  const handleBccInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBccInput(event.target.value);
  };
  const handleBccInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isValidEmail(bccInput.trim())) {
        const data = bccList.find((item: any) => item == bccInput);
        if (data) {
          showAlert("Duplicate Entries Not Allowed!..", "warning");
          return;
        }
        setBccList([...bccList, bccInput.trim()]);

        setRemarksdata((pre: any) => ({
          ...pre,
          email_ids: [...bccList, bccInput.trim()],
        }));
        setBccInput("");
      } else {
        showAlert("Please Provide Valid value!..", "warning");
      }
    }
  };

  const findchargename = (charge_id: any) => {
    return (
      chargesList?.find((item2: any) => item2?.ref_sell_id == charge_id) || ""
    );
  };
  const htmlTableRows = sellingchargesadd
    ?.map(
      (item2: any, index: number) => `
      <tr>
        <td style="padding: 6px; border: 1px solid #ddd;">${index + 1}</td>
        <td style="padding: 6px; border: 1px solid #ddd;">${findchargename(item2?.charge_id)?.charge_name || "-"
        }</td>
        <td style="padding: 6px; border: 1px solid #ddd;">${item2?.remarks || "-"
        }</td>
        <td style="padding: 6px; border: 1px solid #ddd; text-align: right;">₹${formatIndianNumber(
          Number(item2?.inr_amount || 0),
        )}</td>
      </tr>
    `,
    )
    .join("");
  const handleemailModal = (index?: any, item?: any) => {
    setOpenModal(false);
    setForWhat("");
    const { charge_name } =
      chargesList?.find(
        (item2: any) => item2?.ref_sell_id == item?.charge_id,
      ) || "";

    setRemarksdata((pre: any) => ({
      ...pre,
      mail_subject: `Additional Charges`,
    }));

    setEditorData(`
    <p>Dear,</p>
    <p>Greetings of the day!</p>
    <p>
      This is to inform you that the following charge(s) have been applied or are pending in relation to your shipment:
    </p>

    <table width="100%" cellspacing="0" cellpadding="6" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; border: 1px solid #ddd;">
      <thead style="background-color: #f3f3f3;">
        <tr>
          <th style="text-align: left; border: 1px solid #ddd; padding: 6px;">S.No</th>
          <th style="text-align: left; border: 1px solid #ddd; padding: 6px;">Charge Name</th>
          <th style="text-align: left; border: 1px solid #ddd; padding: 6px;">Remarks</th>
          <th style="text-align: right; border: 1px solid #ddd; padding: 6px;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${htmlTableRows}
      </tbody>
    </table>

    <p><strong>Enquiry No:</strong> ${datatopost?.booking_no}</p>
    

    <p>
      We kindly request you to take the required action at your earliest convenience to avoid any delay in shipment processing or delivery.
    </p>
    <p>
      For further clarification or assistance, please feel free to contact us.
    </p>
    <p>Best regards,</p>
  `);
    // setForWhat(2)
    setOpenModal2(true);
  };
  const handleBccInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && bccInput === "") {
      const updatedList = [...bccList];
      updatedList.pop();
      setBccList(updatedList);
      setRemarksdata((pre: any) => ({ ...pre, email_ids: updatedList }));
    }
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const description = (
    <div
      className={`col-span-12 overflow-auto ${forwhat == 1
          ? "h-[64vh]"
          : forwhat == 3
            ? "h-[64vh]"
            : forwhat == 2
              ? "h-[64vh]"
              : ""
        }`}
    >
      {forwhat == 1 || forwhat == 3 ? (
        <CustomerForm
          franchiseCustomerFormdata={franchiseedata}
          allvendordropdowndata={allvendordropdowndata}
          forwhat={forwhat}
          intbuycharges={intarrcharges2}
          intsellingcharges={intarrcharges}
          incoterm={incoterm}
          statusdata={statusdata}
          fdata={franchiseedata}
          getparticulardata={getparticulardata}
          datatopost={datatopost}
          setDataToPost={setDataToPost}
          handledatatopost={handledatatopost}
          chargesList={chargesList}
          spotData={datatopost}
          singlefranchiseedata={getparticulardata("f", datatopost?.pickup_franchisee_id, franchiseedata)}
          sellingcharges={sellingcharges}
          setSellingCharges={setSellingCharges}
                      exchangedataSell={exchangedataSell}
            setExchangedataSell={setExchangedataSell}
          buycharges={buycharges}
          setBuyCharges={setBuyCharges}
          sellingchargesadd={sellingchargesadd}
          setSellingChargesadd={setSellingChargesadd}
          buychargesadd={buychargesadd}
          setBuyChargesadd={setBuyChargesadd}
          toggleadd={toggleadd}
          setToggleadd={setToggleadd}
          currencydata={currencydata}
          exchangedata={exchangedata}
          setExchangedata={setExchangedata}
          totalbuy={totalbuy}
          totalSell={totalSell}
          toggle={toggle}
          setToggle={setToggle}
          allerrors={allerrors}
          alltypedata={alltypedata}
          agentdetails={agentdetails}
          setAgentDetails={setAgentDetails}
          handleemailModal={handleemailModal}
          currencyname={
            currencydata?.find(
              (item: any) => item?.id == singlefranchiseedata?.currency,
            )?.currency || ""
          }
          singlefranchiseedata={singlefranchiseedata}
        />
      ) : forwhat == 4 ? (
        <div className="p-2 ">
          {/* {alldocuments?.map((item: any, index: number) => ( */}
          <div className="flex">
            <div className=" w-[100%]">
              {/* {index == 0 ? <FormLabel>Upload Document</FormLabel> : ""} */}
              <FormLabel>
                Select Document <span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                type="file"
                // accept=".csv"

                className="mt-2 border border-gray-400 w-[100%]"
                onChange={(e: any) => setCsvfiles(e.target.files)}
              />
            </div>
            {/* <Trash2
                className={`${index==0?"mt-14":"mt-6"} ml-2`}
                onClick={() => {
                  alldocuments?.length > 1 ? deletecsvfiledata(index) : "";
                }}
              /> */}
          </div>

          <div className="mt-2">
            <FormLabel>
              Remarks<span className="text-red-400">*</span>
            </FormLabel>
            <FormTextarea
              name="remarks"
              value={remarksdata?.cs_remarks || ""}
              onChange={(e: any) => {
                setRemarksdata((pre: any) => ({
                  ...pre,
                  cs_remarks: e.target.value,
                }));
              }}
              className="px-4 py-3 min-h-[10px] max-h-[100px] resize-y"
              autoComplete="off"
            ></FormTextarea>
          </div>
        </div>
      ) : forwhat == 2 ? (
        mode == "edit" ? (
          <Scan_events
            trackerData={trackerData}
            Attatchments={Attatchments}
            rowdata={rowData}
            setRowData={setRowdata}
            forwhat={forwhat}
            setForWhat={setForWhat}
            openModal={openModal}
            setOpenModal={setOpenModal}
            datatopost={datatopost}
            setDataToPost={setDataToPost}
            remarksdata={remarksdata}
            setRemarksdata={setRemarksdata}
            statusdata={allstatus}
            requiredstatus={statusdata}
            bccList={bccList}
            setBccList={setBccList}
            editorData={editorData}
            setEditorData={setEditorData}
            countrydata={countrydata}
            handlesave={handlesave}
            csvfiles={csvfiles}
            setCsvfiles={setCsvfiles}
            postloading={postloading}
            fileInputRefs={fileInputRefs}
          />
        ) : forwhat == 5 || forwhat == 6 ? (
          <div className="p-2 h-[60vh] overflow-auto">
            <div>
              <FormLabel htmlFor="vertical-form-1 mb-1">
                STATUS UPDATE <span className="text-red-400">*</span>
              </FormLabel>
              <FormSelect
                disabled
                value={remarksdata?.updated_status}
                onChange={(e: any) => {
                  setRemarksdata((pre: any) => ({
                    ...pre,

                    updated_status: e.target.value,
                    other: "",
                    mail_subject:
                      remarksdata?.mail_subject ||
                      handlemailandsubject("subject", e.target.value),
                  }));
                  handlemailandsubject("mail", e.target.value);
                }}
              >
                <option value="">Select</option>
                {statusdata?.map((item: any) => (
                  <option value={Number(item?.status_code)}>
                    {item?.status}
                  </option>
                ))}
              </FormSelect>
            </div>
            {/* {remarksdata?.updated_status == "0" ? (
            <div className="mt-4">
              <FormLabel>
                OTHER STATUS <span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                placeholder="Enter Status Name"
                value={remarksdata?.other}
                onChange={(e: any) => {
                  const value = e.target.value;

                  setRemarksdata((pre: any) => ({
                    ...pre,
                    other: e.target.value,
                    mail_subject:remarksdata?.mail_subject||handlemailandsubject(
                      "subject",
                      remarksdata.updated_status,
                      e.target.value
                    ),
                  }));
                  handlemailandsubject(
                    "mail",
                    remarksdata.updated_status,
                    e.target.value
                  );
                }}
              />{" "}
            </div>
          ) : (
            ""
          )} */}
            <div className="flex justify-start">
              <FormCheck className="mt-5 ml-5">
                <FormCheck.Input
                  id="vertical-form-5"
                  type="checkbox"
                  defaultChecked={remarksdata?.follow_up == 1}
                  onClick={(e: any) => {
                    if (e.target.checked) {
                      setRemarksdata((pre: any) => ({
                        ...pre,

                        follow_up: 1,
                      }));
                    } else {
                      setRemarksdata((pre: any) => ({
                        ...pre,
                        follow_up: 0,
                      }));
                    }
                  }}
                />
                <FormCheck.Label htmlFor="vertical-form-5">
                  Follow Up
                </FormCheck.Label>
              </FormCheck>
            </div>
            {remarksdata?.mail_trigger ? (
              <div>
                <div className="mt-4">
                  <FormLabel>
                    EMAIL SUBJECT <span className="text-red-400">*</span>{" "}
                    <span>
                      {"  "}{" "}
                      {!datatopost?.email_content
                        ? `(Shipment update: BookingNo. - MAWB/HAWB)`
                        : ""}{" "}
                    </span>
                  </FormLabel>
                  <FormTextarea
                    value={remarksdata?.mail_subject}
                    disabled={true}
                    onChange={(e: any) => {
                      const value = e.target.value;
                      setRemarksdata((pre: any) => ({
                        ...pre,
                        mail_subject: e.target.value,

                        // mail_subject:`Shipment Update:${remarksdata?.updated_status==0?remarksdata?.other:statusdata?.find((item:any)=>item?.status_code==e.target.value)?.status} for enquiry ${remarksdata?.booking_no||""}`
                      }));
                    }}
                    className=" "
                    autoComplete="off"
                  />
                </div>
                <div className="mt-4">
                  <FormLabel>EMAIL CC (Write and press Enter )</FormLabel>

                  <div className="flex flex-wrap items-center border ">
                    {bccList?.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 text-gray-800 rounded-full px-2 py-1 mr-1 mt-1"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          className="ml-1 focus:outline-none"
                          onClick={() => handleBccChipDelete(index)}
                        >
                          <MdClose className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <FormInput
                      type="text"
                      id="bcc"
                      // className="w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 m-2"
                      className="w-full"
                      placeholder="Write Email and Press Enter"
                      value={bccInput}
                      onChange={handleBccInputChange}
                      onKeyPress={handleBccInputKeyPress}
                      onKeyDown={handleBccInputKeyDown}
                    />
                  </div>
                </div>
                <div className="  col-span-2 mt-5 ">
                  <div>
                    <FormLabel
                      htmlFor="bcc"
                      className="block text-sm  font-medium text-gray-700"
                    >
                      EMAIL BODY <span className="text-red-400">*</span>
                    </FormLabel>

                    <div className="m-auto items-center border ">
                      {/* onChange={setEditorData} */}
                      <div>
                        <ClassicEditor
                          disabled={!!datatopost?.email_content?.body}
                          value={editorData}
                          onChange={setEditorData}
                        />
                      </div>

                      {/* {isError?.message_body ? (
                    <span className="text-red-400">
                      {isError?.message_body}
                    </span>
                  ) : (
                    ""
                  )} */}
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg shadow-lg grid lg:grid-cols-2 gap-4 p-2 mt-2">
                  <div className="">
                    <FormLabel>SELECT DOCUMENTS</FormLabel>

                    <FormInput
                      type="file"
                      // accept=".csv"
                      multiple
                      className="
                 border border-gray-400 w-[100%]"
                      onChange={(e: any) => setCsvfiles(e.target.files)}
                    />
                  </div>
                  <div>
                    {" "}
                    <FormLabel>DOC. REMARKS</FormLabel>
                    <FormInput
                      className="p-2.5"
                      onChange={(e: any) =>
                        setRemarksdata((pre: any) => ({
                          ...pre,

                          doc_remarks: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="mt-2">
              <FormLabel>
                REMARKS <span className="text-red-400">*</span>
              </FormLabel>
              <FormTextarea
                name="remarks"
                disabled
                value={remarksdata?.cs_remarks || ""}
                onChange={(e: any) => {
                  setRemarksdata((pre: any) => ({
                    ...pre,

                    cs_remarks: e.target.value,
                  }));
                }}
                className="px-4 py-3 min-h-[10px] max-h-[100px] resize-y"
                autoComplete="off"
              ></FormTextarea>
            </div>
          </div>
        ) : (
          <div className="w-full">

            {trackerData?.data?.length >= 1 ? (
              <div className="relative pl-0">
                {(mode == "view" && datatopost?.import_booking == 2
                  ? trackerData?.data?.filter((item: any) => item?.event_type == 2)
                  : trackerData?.data
                )?.map((item: any, index: number) => (
                  <div key={index} className="relative flex gap-3 mt-1 last:pb-0 pb-3">
                    <div className="flex flex-col items-center relative">
                      <div className=" bg-[#efb847] w-[25px] h-[25px] rounded-full p-[2px]  relative z-10 flex justify-center items-center">
                        <Check className="w-[20px] h-[20px] text-white stroke-1.5 " />
                      </div>

                      <span className="absolute top-[2px] left-[2px] inline-flex h-[20px] w-[20px] animate-ping rounded-full bg-[#efb847] opacity-85 [animation-duration:3s]"></span>

                      <div className="w-0.5 flex-1 bg-[#ffd37a] mt-1 h-16" />
                    </div>

                    <div className="bg-[#fff] w-full rounded-lg border-[2px] border-[#fff] shadow-[0_0_2px_#c4952c] lg:p-0 p-[0px]">

                      {/* 🔥 GRID FIXED HERE */}
                      <div
                        className={`grid ${mode == "view" && datatopost?.import_booking == 1
                            ? "grid-cols-12"
                            : "grid-cols-12"
                          } lg:gap-0 gap-1`}
                      >

                        {/* Status */}
                        <div className="col-span-12 lg:col-span-3">
                          <div className="w-full border border-[#f0eadd] lg:border-none rounded-lg">
                            <span className="uppercase font-bold text-[#978b6d] text-[11px] py-[4px] bg-[#F7F2E6] w-full block pl-2 rounded-tl-lg lg:rounded-tr-none rounded-tr-lg">
                              Status
                            </span>
                            <div className="p-2 lg:pt-[10px] lg:px-2">
                              <p className="text-[13px] lg:text-[14px] font-medium text-[#535353] leading-[14px]">
                                {item?.status || ""}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Date */}
                        <div className="col-span-12 lg:col-span-2">
                          <div className="w-full border border-[#f0eadd] lg:border-none rounded-lg">
                            <span className="uppercase font-bold text-[#978b6d] text-[11px] py-[4px] bg-[#F7F2E6] w-full block text-center">
                              Date and Time
                            </span>
                            <div className="flex items-center justify-center p-2 lg:pt-[10px]">
                              <i className="p-[5px] w-[28px] h-[28px] rounded-full bg-[#FFE8B3] flex items-center justify-center">
                                <CalendarDays className="w-[18px] h-[17px] text-[#AA7802]" />
                              </i>
                              {item?.date && (
                                <p className="text-xs text-gray-400 ml-[7px] leading-[14px]">
                                  {convertUTCtoIST(item.date || "")}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Mail Trigger */}
                        {mode == "view" && datatopost?.import_booking == 1 && (
                          <div className="col-span-6 lg:col-span-2">
                            <div className="w-full border border-[#f0eadd] lg:border-none rounded-lg">
                              <span className="uppercase font-bold text-[#978b6d] text-[11px] py-[4px] bg-[#F7F2E6] w-full block text-center">
                                Mail Trigger
                              </span>
                              <div className="flex items-center justify-center p-2 lg:pt-[10px]">
                                {item?.mail_trigger === 1 ? (
                                  <i className="p-[4px] w-[28px] h-[28px] rounded-full bg-green-200 flex items-center justify-center mx-[2px] hover:bg-green-500 group">
                                    <Check className="h-4 w-4 text-green-500 group-hover:text-white" />
                                  </i>
                                ) : (
                                  <i className="p-[4px] w-[28px] h-[28px] rounded-full bg-red-200 flex items-center justify-center mx-[2px] hover:bg-red-500 group cursor-pointer">
                                    <X className="h-4 w-4 text-red-500 group-hover:text-white" />
                                  </i>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* File Attached */}
                        {mode == "view" && datatopost?.import_booking == 1 && (
                          <div className="col-span-6 lg:col-span-2">
                            <div className="w-full border border-[#f0eadd] lg:border-none rounded-lg">
                              <span className="uppercase font-bold text-[#978b6d] text-[11px] py-[4px] bg-[#F7F2E6] w-full block text-center">
                                File Attached
                              </span>
                              <div className="flex items-center justify-center p-2 lg:pt-[10px]">
                                {datatopost?.charges_docs?.filter(
                                  (item2: any) =>
                                    item2?.is_mail != 1 &&
                                    item2?.updated_status == item?.status_code
                                )?.length >= 1 ? (
                                  <Tippy content="Attachments">
                                    <i className="p-[5px] w-[28px] h-[28px] rounded-full bg-[#FFE8B3] flex items-center justify-center group hover:bg-mustard">
                                      <File className="h-4 w-4 cursor-pointer text-gray-800 group-hover:text-white transition" />
                                    </i>
                                  </Tippy>
                                ) : (
                                  "No Attachments"
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 🔥 REMARK COLUMN FIXED */}
                        <div
                          className={`col-span-12 ${mode == "view" && datatopost?.import_booking == 1
                              ? "lg:col-span-3"
                              : "lg:col-span-7"
                            }`}
                        >
                          <div className="w-full border border-[#f0eadd] lg:border-none rounded-lg">
                            <span className="uppercase font-bold text-[#978b6d] text-[11px] py-[4px] bg-[#F7F2E6] w-full block pl-2">
                              Remark
                            </span>
                            <div className="p-2 lg:pt-[10px] lg:px-2">
                              <p className="leading-[14px] text-[13px] text-[#535353]">
                                {item?.remarks || "N.A"}
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <h1 className="text-primary text-sm font-medium">
                  OOps.. No update found!..
                </h1>
              </div>
            )}
          </div>
        )
      ) : forwhat == 5 || forwhat == 6 ? (
        <div className="p-2 h-[60vh] overflow-auto">
          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">
              STATUS UPDATE <span className="text-red-400">*</span>
            </FormLabel>
            <FormSelect
              disabled
              value={remarksdata?.updated_status}
              onChange={(e: any) => {
                setRemarksdata((pre: any) => ({
                  ...pre,

                  updated_status: e.target.value,
                  other: "",
                  mail_subject:
                    remarksdata?.mail_subject ||
                    handlemailandsubject("subject", e.target.value),
                }));
                handlemailandsubject("mail", e.target.value);
              }}
            >
              <option value="">Select</option>
              {statusdata?.map((item: any) => (
                <option value={Number(item?.status_code)}>
                  {item?.status}
                </option>
              ))}
            </FormSelect>
          </div>
          {/* {remarksdata?.updated_status == "0" ? (
            <div className="mt-4">
              <FormLabel>
                OTHER STATUS <span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                placeholder="Enter Status Name"
                value={remarksdata?.other}
                onChange={(e: any) => {
                  const value = e.target.value;

                  setRemarksdata((pre: any) => ({
                    ...pre,
                    other: e.target.value,
                    mail_subject:remarksdata?.mail_subject||handlemailandsubject(
                      "subject",
                      remarksdata.updated_status,
                      e.target.value
                    ),
                  }));
                  handlemailandsubject(
                    "mail",
                    remarksdata.updated_status,
                    e.target.value,
                  );
                }}
              />{" "}
            </div>
          ) : (
            ""
          )} */}
          <div className="flex justify-start">
            {/* <FormCheck className="mt-5">
              <FormCheck.Input
                id="vertical-form-3"
                type="checkbox"
                disabled={!remarksdata?.updated_status}
                checked={remarksdata?.mail_trigger}
                value=""
                onClick={(e: any) => {
               
                  if (e.target.checked) {
                    setRemarksdata((pre: any) => ({
                      ...pre,
                      mail_subject:remarksdata?.mail_subject||handlemailandsubject(
                        "subject",
                        remarksdata.updated_status
                      ),
                      mail_trigger: 1,
                    }));
                    handlemailandsubject("mail", remarksdata?.updated_status);
                  } else {
                    setRemarksdata((pre: any) => ({
                      ...pre,
                     
                      doc_remarks: "",
                      mail_trigger: 0,
                    }));
                    setEditorData("");
                    setCsvfiles("");
                       setBccInput("");

                  }
                }}
              />
              <FormCheck.Label htmlFor="vertical-form-3">
                Send Email
              </FormCheck.Label>
            </FormCheck> */}
            <FormCheck className="mt-5 ml-5">
              <FormCheck.Input
                id="vertical-form-5"
                type="checkbox"
                defaultChecked={remarksdata?.follow_up == 1}
                onClick={(e: any) => {
                  if (e.target.checked) {
                    setRemarksdata((pre: any) => ({
                      ...pre,

                      follow_up: 1,
                    }));
                  } else {
                    setRemarksdata((pre: any) => ({
                      ...pre,
                      follow_up: 0,
                    }));
                  }
                }}
              />
              <FormCheck.Label htmlFor="vertical-form-5">
                Follow Up
              </FormCheck.Label>
            </FormCheck>
          </div>
          {remarksdata?.mail_trigger ? (
            <div>
              <div className="mt-4">
                <FormLabel>
                  EMAIL SUBJECT <span className="text-red-400">*</span>{" "}
                  <span>{"  "} (Shipment update: BookingNo. - MAWB/HAWB) </span>
                </FormLabel>
                <FormTextarea
                  value={remarksdata?.mail_subject}
                  onChange={(e: any) => {
                    const value = e.target.value;
                    setRemarksdata((pre: any) => ({
                      ...pre,
                      mail_subject: e.target.value,

                      // mail_subject:`Shipment Update:${remarksdata?.updated_status==0?remarksdata?.other:statusdata?.find((item:any)=>item?.status_code==e.target.value)?.status} for enquiry ${remarksdata?.booking_no||""}`
                    }));
                  }}
                  className=" "
                  autoComplete="off"
                />
              </div>
              <div className="mt-4">
                <FormLabel>EMAIL CC (Write and press Enter )</FormLabel>

                <div className="flex flex-wrap items-center border ">
                  {bccList?.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 text-gray-800 rounded-full px-2 py-1 mr-1 mt-1"
                    >
                      <span>{email}</span>
                      <button
                        type="button"
                        className="ml-1 focus:outline-none"
                        onClick={() => handleBccChipDelete(index)}
                      >
                        <MdClose className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <FormInput
                    type="text"
                    id="bcc"
                    // className="w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 m-2"
                    className="w-full"
                    placeholder="Write Email and Press Enter"
                    value={bccInput}
                    onChange={handleBccInputChange}
                    onKeyPress={handleBccInputKeyPress}
                    onKeyDown={handleBccInputKeyDown}
                  />
                </div>
              </div>
              <div className="  col-span-2 mt-5 ">
                <div>
                  <FormLabel
                    htmlFor="bcc"
                    className="block text-sm  font-medium text-gray-700"
                  >
                    EMAIL BODY <span className="text-red-400">*</span>
                  </FormLabel>

                  <div className="m-auto items-center border ">
                    {/* onChange={setEditorData} */}
                    <div>
                      <ClassicEditor
                        // style={{width:'100%'}}
                        value={editorData}
                        onChange={setEditorData}
                      />
                    </div>

                    {/* {isError?.message_body ? (
                    <span className="text-red-400">
                      {isError?.message_body}
                    </span>
                  ) : (
                    ""
                  )} */}
                  </div>
                </div>
              </div>
              <div className="border rounded-lg shadow-lg grid lg:grid-cols-2 gap-4 p-2 mt-2">
                <div className="">
                  <FormLabel>SELECT DOCUMENTS</FormLabel>

                  <FormInput
                    type="file"
                    // accept=".csv"
                    multiple
                    className="
                 border border-gray-400 w-[100%]"
                    onChange={(e: any) => setCsvfiles(e.target.files)}
                  />
                </div>
                <div>
                  {" "}
                  <FormLabel>DOC. REMARKS</FormLabel>
                  <FormInput
                    className="p-2.5"
                    onChange={(e: any) =>
                      setRemarksdata((pre: any) => ({
                        ...pre,

                        doc_remarks: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          <div className="mt-2">
            <FormLabel>
              REMARKS <span className="text-red-400">*</span>
            </FormLabel>
            <FormTextarea
              name="remarks"
              disabled
              value={remarksdata?.cs_remarks || ""}
              onChange={(e: any) => {
                setRemarksdata((pre: any) => ({
                  ...pre,

                  cs_remarks: e.target.value,
                }));
              }}
              className="px-4 py-3 min-h-[10px] max-h-[100px] resize-y"
              autoComplete="off"
            ></FormTextarea>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );

  const description1 = (
    <>
      <div className="space-y-2  text-sm">
        <div className="space-y-2  text-sm">
          {/* Charge Docs */}
          <div>
            {docTypes?.charges_docs?.filter((item: any) => item?.is_mail != 1)
              ?.length > 0 && (
                <p className="font-semibold text-gray-700 mb-2">
                  Charge Documents
                </p>
              )}
            <div className="grid grid-cols-4 gap-2">
              {docTypes?.charges_docs
                ?.filter((item: any) => item?.is_mail != 1)
                ?.map((elem: any, index: number) => (
                  <a
                    href={elem?.doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={index}
                  >
                    <Button
                      variant="mustard"
                      type="button"
                      className="bg-mustard px-3 py-1 rounded shadow text-black hover:bg-yellow-400 transition w-full"
                    >
                      {elem?.remark || "N.A"}
                    </Button>
                  </a>
                ))}
            </div>
          </div>

          {docTypes?.charges_docs?.length > 0 && (
            <hr className="border-gray-300" />
          )}

          {/* Performa Doc – Only show if it exists */}
          {docTypes?.proforma_url && (
            <>
              <div>
                <p className="font-semibold text-gray-700 mb-2">
                  📄 Performa Document
                </p>
                <a
                  href={docTypes.proforma_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="mustard"
                    type="button"
                    className="bg-mustard px-3 py-1 rounded shadow text-black hover:bg-yellow-400 transition"
                  >
                    📥 Download Performa
                  </Button>
                </a>
              </div>
              <hr className="border-gray-300" />
            </>
          )}

          {/* House Doc – Only show if it exists */}
          {docTypes?.house_pdf && (
            <div>
              <p className="font-semibold text-gray-700 mb-2">
                🏠 House Document
              </p>
              <a
                href={docTypes.house_pdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="mustard"
                  type="button"
                  className="bg-mustard px-3 py-1 rounded shadow text-black hover:bg-yellow-400 transition"
                >
                  📥 Download House
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
  const description2 = (
    <div className=" overflow-auto h-[70vh] ">
      {/* {remarksdata?.mail_trigger ? ( */}
      <div>
        <div className="mt-4">
          <FormLabel>
            EMAIL SUBJECT <span className="text-red-400">*</span>
          </FormLabel>
          <FormTextarea
            value={remarksdata?.mail_subject}
            onChange={(e: any) => {
              const value = e.target.value;
              setRemarksdata((pre: any) => ({
                ...pre,
                mail_subject: e.target.value,

                // mail_subject:`Shipment Update:${remarksdata?.updated_status==0?remarksdata?.other:statusdata?.find((item:any)=>item?.status_code==e.target.value)?.status} for enquiry ${remarksdata?.booking_no||""}`
              }));
            }}
            className=" "
            autoComplete="off"
          />
        </div>
        <div className="mt-4">
          <FormLabel>EMAIL CC</FormLabel>

          <div className="flex flex-wrap items-center border ">
            {bccList?.map((email, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 text-gray-800 rounded-full px-2 py-1 mr-1 mt-1"
              >
                <span>{email}</span>
                <button
                  type="button"
                  className="ml-1 focus:outline-none"
                  onClick={() => handleBccChipDelete(index)}
                >
                  <MdClose className="w-4 h-4" />
                </button>
              </div>
            ))}
            <FormInput
              type="text"
              id="bcc"
              // className="w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 m-2"
              className="w-full"
              placeholder="Write Email and Press Enter"
              value={bccInput}
              onChange={handleBccInputChange}
              onKeyPress={handleBccInputKeyPress}
              onKeyDown={handleBccInputKeyDown}
            />
          </div>
        </div>
        <div className="  col-span-2 mt-5 ">
          <div>
            <FormLabel
              htmlFor="bcc"
              className="block text-sm  font-medium text-gray-700"
            >
              EMAIL BODY <span className="text-red-400">*</span>
            </FormLabel>

            <div className="m-auto items-center border ">
              {/* onChange={setEditorData} */}
              <div>
                <ClassicEditor
                  // style={{width:'100%'}}
                  value={editorData}
                  onChange={setEditorData}
                />
              </div>

              {/* {isError?.message_body ? (
                    <span className="text-red-400">
                      {isError?.message_body}
                    </span>
                  ) : (
                    ""
                  )} */}
            </div>
          </div>
        </div>
      </div>
      {/* ) : (
      ""
    )} */}
    </div>
  );
  const footer = (
    <>
      {forwhat == 1 ? (
        <div className="flex justify-end mr-7 mb-4">
          {(() => {
            const singlefranchiseedata = getparticulardata("f", datatopost?.pickup_franchisee_id, franchiseedata);
            const showForeignCol = singlefranchiseedata?.currency && singlefranchiseedata?.currency != 24 && singlefranchiseedata?.is_overseas && toggle == 1 && toggleadd != 2;
            const isOverseasSelling = singlefranchiseedata?.is_overseas && toggle == 1 && toggleadd != 2;
            return (
              <div className={`text-right min-[767px]:w-[50%] max-[767px]:mt-2 min-[417px]:grid grid-cols-${showForeignCol ? "4" : "3"} gap-2`}>
                <div className="text-left">
                  <FormLabel>Sub-Total (Rs.) : </FormLabel>
                  <FormInput
                    disabled
                    className="text-right"
                    value={
                      toggle == 2 || toggleadd == 2
                        ? formatIndianNumber(Number(totalbuy))
                        : formatIndianNumber(Number(totalSell))
                    }
                  />
                </div>
                <div className="text-left">
                  <FormLabel>GST {(toggle == 2 || toggleadd == 2) ? (gstStatus == 4 ? "(0%)" : "") : (gstStatus == 4 || isOverseasSelling || datatopost?.import_booking == 3 ? "(0%)" : "")} (Rs.): </FormLabel>
                  <FormInput
                    disabled
                    className="text-right"
                    value={
                      toggle == 2 || toggleadd == 2
                        ? formatIndianNumber(parseFloat(computeChargesGST([...buycharges, ...buychargesadd], "buy", gstStatus == 4).toFixed(3)))
                        : formatIndianNumber(parseFloat(computeChargesGST([...sellingcharges, ...sellingchargesadd], "sell", gstStatus == 4 || isOverseasSelling || datatopost?.import_booking == 3).toFixed(3)))
                    }
                  />
                </div>
                <div className="text-left">
                  <FormLabel>Total Amt (Rs.): </FormLabel>
                  <FormInput
                    disabled
                    className="text-right"
                    value={
                      toggle == 2 || toggleadd == 2
                        ? formatIndianNumber(parseFloat((Number(totalbuy) + computeChargesGST([...buycharges, ...buychargesadd], "buy", gstStatus == 4)).toFixed(3)))
                        : formatIndianNumber(parseFloat((Number(totalSell) + computeChargesGST([...sellingcharges, ...sellingchargesadd], "sell", gstStatus == 4 || isOverseasSelling || datatopost?.import_booking == 3)).toFixed(3)))
                    }
                  />
                </div>
                {showForeignCol ? (
                  <div className="text-left">
                    <FormLabel>
                      Total Amt ({currencydata?.find((c: any) => c.id == singlefranchiseedata?.currency)?.currency || ""}):
                    </FormLabel>
                    <FormInput
                      disabled
                      className="text-right"
                      value={`${currencydata?.find((c: any) => c.id == singlefranchiseedata?.currency)?.symbol || ""}${formatIndianNumber(Number(totalSell) / Number(singlefranchiseedata?.exchange_rate || 1))}`}
                    />
                  </div>
                ) : null}
              </div>
            );
          })()}
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-end items-end mr-7">
        <Button
          type="button"
          className="w-20 mr-1 bg-gray-200 text-primary p-1"
          onClick={() => {
            if (forwhat == 5) {
              setForWhat(2);

              setOpenModal(true);
            } else {
              handleCancel();
            }
          }}
        >
          Cancel
        </Button>
        {forwhat != 2 ? (
          <Button
            variant="mustard"
            disabled={
              (forwhat == 5 || forwhat == 6) &&
              (!remarksdata?.cs_remarks || !remarksdata?.updated_status)
            }
            className="ml-2 w-[150px] bg-mustard p-1"
            onClick={() => {
              handlesave(forwhat);
            }}
          >
            {postloading ? (
              <LoadingButtonCommon
                text={`${(forwhat == 5 || forwhat == 6) ? "Sending" : isDirect ? "Save" : "Saving"
                  }`}
              />
            ) : forwhat == 1 ? (
              "Save & Send Email"
            ) : remarksdata?.mail_trigger ? (
              "Send"
            ) : (
              "Save"
            )}
          </Button>
        ) : (
          ""
        )}
        {forwhat == 1 ? (
          <Button
            variant="success"
            disabled={
              forwhat == 2 &&
              (!remarksdata?.cs_remarks || !remarksdata?.updated_status)
            }
            className="ml-2 w-[150px] p-1 text-white"
            onClick={() => {
              handlesave(forwhat, "Direct");
            }}
          >
            {postloading && isDirect ? (
              <LoadingButtonCommon text={`Saving`} />
            ) : (
              "Save"
            )}
          </Button>
        ) : (
          ""
        )}
      </div>
    </>
  );
  const footer2 = (
    <>
      <div className="flex justify-end items-end mr-7">
        <Button
          type="button"
          className="w-20 mr-1 bg-gray-200 text-primary p-1"
          onClick={() => {
            setOpenModal2(false);

            setOpenModal(true)

            setForWhat(1);
            setBccInput("");
            setBccList([]);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="mustard"
          disabled={forwhat == 2 && (!editorData || !remarksdata?.mail_subject)}
          className="ml-2 w-[100px] bg-mustard p-1"
          onClick={() => handlesave(1)}
        >
          {postloading ? <LoadingButtonCommon text="Sending" /> : "Send"}
        </Button>
      </div>
    </>
  );

  const columns = [
    { field: "action", headerName: "Action" },
    { field: "name", headerName: "Customer Name", textalign: "left" },
    { field: "airwaybilno", headerName: "HAWB No", textalign: "left" },
    { field: "master", headerName: "MAWB No", textalign: "left" },
    { field: "courier", headerName: "Carrier", textalign: "left" },
    { field: "import_booking", headerName: "Booking Type", textalign: "left" },
    { field: "incoterm", headerName: "IncoTerms", textalign: "left" },
    { field: "poc", headerName: "Port Of Origin", textalign: "left" },
    { field: "pod", headerName: "Port Of Destination", textalign: "left" },
    { field: "last_status", headerName: "Last Status", textalign: "left" },
    { field: "cs_remarks", headerName: "CS Remarks", textalign: "left" },
    { field: "last_updated", headerName: "Last Updated", textalign: "left" },
    {
      field: "last_updated_sent",
      headerName: "Last Updated Sent",
      textalign: "left",
    },
    { field: "doc", headerName: "Doc", textalign: "left" },
  ];

  const row: any = csData?.map((item: any, index: any) => {
    const action = (
      <div className="flex justify-center items-center">
        <Menu>
          <Menu.Button
            as={Button}
            variant="primary"
            className="bg-blue-100 text-blue-500 border-blue-500"
          >
            <UserCog className="w-5 stroke-2.5" />
            <ChevronDown className="w-4 stroke-2.5 mt-1" />
          </Menu.Button>
          <Menu.Items
            className="w-48 z-50"
            placement={
              csData?.length > 3 && index !== 0 && index !== 1 && index !== 2
                ? "top"
                : "bottom"
            }
          >
            <Menu.Item
              onClick={() => {
                getsinglefdata(item?.pickup_franchisee_id);
                setOpenModal(true);
                setForWhat(1);
                const { contact_person_details } = item;
                if (contact_person_details?.length >= 1) {
                  setDataToPost({
                    ...item,
                    inco_term: item?.inco_terms || item?.inco_term,
                  });
                } else {
                  const contacts = getparticulardata(
                    "f",
                    item?.pickup_franchisee_id,
                    franchiseedata,
                  )?.contacts;

                  if (contacts?.length >= 1) {
                    const newdata = [
                      {
                        mobile_no: contacts[0]?.mobile_no || "",
                        contact_person: contacts[0]?.contact_person || "",
                        email:
                          getparticulardata(
                            "f",
                            item?.pickup_franchisee_id,
                            franchiseedata,
                          )?.email_id || "",
                      },
                    ];

                    setDataToPost((pre: any) => ({
                      ...item,
                      inco_term: item?.inco_terms || item?.inco_term,
                      contact_person_details: newdata,
                    }));
                  } else {
                    const newdata = [
                      {
                        mobile_no: "",
                        contact_person: "",
                        email: "",
                      },
                    ];
                    setDataToPost((pre: any) => ({
                      ...item,
                      inco_term: item?.inco_terms || item?.inco_term,
                      contact_person_details: newdata,
                    }));
                  }
                }

              }}
            >
              <Edit className="w-4 mr-2" /> Edit Form
            </Menu.Item>
            {/* <Menu.Item
              onClick={() => {
                setOpenModal(true);
                setForWhat(3);
              setDataToPost(item)

                // const newdata = [...buycharges];
                // const newdata2 = newdata?.map((item: any) => ({
                //   ...item,
             
                //   job_id: item?.job_id,
                // }));
                // setBuyCharges(newdata2);
              }}
            >
              <Plus className="w-4 mr-2" /> Charges
            </Menu.Item> */}
            {item?.import_booking == 1 ? (
              <Menu.Item
                onClick={() => {
                  setOpenModal(true);
                  setDataToPost(item);

                  setForWhat(2);
                  updateData(item?.pickup_id, item);
                  setRemarksdata((pre: any) => ({
                    ...pre,
                    job_id: item?.job_id,
                    hub_id: item?.hub_id || "",
                  }));
                  getattachments(item?.job_id);
                }}
              >
                <MdUpdate className="w-4 mr-2" /> Update Status
              </Menu.Item>
            ) : (
              <Menu.Item
                onClick={() => {
                  setMode("view");
                  setOpenModal(true);
                  setDataToPost(item);
                  setForWhat(2);
                  updateData(item?.airwaybilno, item, "import");
                  setRemarksdata((pre: any) => ({
                    ...pre,
                    job_id: item?.job_id,
                    hub_id: item?.hub_id || "",
                  }));
                }}
              >
                <Eye className="w-4 mr-2" /> Tracking Events
              </Menu.Item>
            )}
            {item?.import_booking == 2 ? (
              <Menu.Item
                onClick={() => {

                  if (item?.extra_data?.cc_mail_ids?.length >= 1) {
                    setRemarksdata((pre: any) => ({
                      ...pre,

                      email_ids: item?.extra_data?.cc_mail_ids || [],
                    }));

                    setBccList(item?.extra_data?.cc_mail_ids || []);
                  }
                  if (datatopost?.extra_data?.follow_up) {
                    setRemarksdata((pre: any) => ({
                      ...pre,
                      follow_up: item?.extra_data?.follow_up || 0,
                    }));
                  }

                  if (!item?.email_content) {
                    setEditorData(`
  <p>Dear,</p>
  <p>Greetings of the day!</p>

  <p>
    This is to inform you that your shipment is currently at the status:
    <strong>${statusdata?.find(
                      (item2: any) => item2?.status_code == item?.updated_status,
                    )?.status || ""
                      }</strong>
    for the spot enquiry <strong>${item?.booking_no}</strong>.
  </p>

  <!-- NEW DETAILS ADDED BELOW -->
  <table width="100%" cellpadding="6" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; margin: 10px 0; border: 1px solid #ddd;">
    <tbody>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>POL (Port of Loading):</strong> ${countrydata?.find(
                        (item2: any) => item2?.country_id == item?.org_country_id,
                      )?.country_name || "N/A"
                      }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>POD (Port of Destination):</strong> ${item?.port_of_dest || "N/A"
                      }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>GW (Gross Weight):</strong> ${item?.gross_weight || "N/A"
                      }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>No. of Packages:</strong> ${item?.packages || "N/A"
                      }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>CW (Chargeable Weight):</strong> ${item?.chargeable_weight || "N/A"
                      }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>Departure Date:</strong> ${item?.departure_date || "N/A"
                      }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>Arrival Date:</strong> ${item?.arrival_date || "N/A"
                      }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"></td>
      </tr>
    </tbody>
  </table>
  <!-- END DETAILS -->

  <p>We will continue to keep you updated on any further progress or required action.</p>
  <p>For any queries, please feel free to reach out to us.</p>
  <p>Best regards,</p>
`);
                  } else {
                    const templateData: any = {
                      AWB_NO: item?.airwaybilno || "",
                      ETD: item?.event_date_time,
                      ETA: "",
                      ARRIVAL_DATE: item?.arrival_date || "",
                      DELIVERY_DATE: item?.delivery_date || "",
                    };
                    const finalContent = renderTemplate(
                      item?.email_content?.body,
                      templateData,
                    );

                    setEditorData(finalContent);
                  }

                  setRemarksdata((pre: any) => ({
                    ...pre,
                    follow_up: item?.extra_data?.follow_up || 0,
                    job_id: item?.job_id,
                    cs_remarks: item?.cs_remarks,
                    updated_status: item?.updated_status,
                    booking_no: item?.booking_no || "",
                    pickup_id: item?.pickup_id || "",
                    charges_docs: item?.charges_docs || [],
                    hub_id: item?.hub_id || "",
                    mail_trigger: 1,
                    mail_subject: item?.email_content
                      ? item?.email_content?.subject
                      : item?.extra_data?.mail_subject ||
                      `Shipment Update: ${item?.booking_no
                      }- ${item?.airwaybilno || ""}${item?.master ? `/${item?.master}` : ""
                      }`,
                    ...(item?.extra_data?.mail_attachments
                      ? {
                        mail_attachments: item?.extra_data?.mail_attachments,
                      }
                      : {}),
                  }));
                  setForWhat(6);
                  setOpenModal(true);

                }}
              >
                <MdEmail className="w-4 mr-2" /> Send Email{" "}
              </Menu.Item>
            ) : (
              ""
            )}
            <Menu.Item
              onClick={() => {
                setOpenModal(true);
                setForWhat(4);
                setRemarksdata((pre: any) => ({
                  ...pre,
                  job_id: item?.job_id,
                }));
              }}
            >
              <Upload className="w-4 mr-2" /> Upload Document
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
    );
    const docs = (
      <File className="cursor-pointer" onClick={() => funcShowDoc(item)} />
    );
    let incoid = item?.inco_terms || item?.inco_term;
    return {
      ...item,
      name:
        getparticulardata("f", item?.pickup_franchisee_id, franchiseedata)
          ?.franchisee_name || "",
      import_booking:
        item?.import_booking == 1
          ? "Export"
          : item?.import_booking == 2
            ? "Import"
            : "N.A",
      last_status:
        item?.updated_status == "210"
          ? "Handed Over To Carrier"
          : getparticulardata("status", item?.updated_status, statusdata)
            ?.status || "",
      last_updated: formatDate(item?.updated_date) || "",
      incoterm:
        incoterm?.find((item2: any) => item2?.id == Number(incoid))?.name || "",
      pod: item?.port_of_dest,
      poc:
        countrydata?.find(
          (item2: any) => item2?.country_id == item?.org_country_id,
        )?.country_name || "N/A",
      action: action,
      doc: docs,
      courier:
        courierproduct?.find(
          (item2: any) => item2?.product_id == item?.courier_id,
        )?.product_name || "",
      last_updated_sent: formatDate(item?.last_updated_sent) || "",
      master: item?.master || "N.A",
      bso_status: item?.bso_status ? (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          String(item?.bso_status).toLowerCase() === "active"
            ? "bg-green-100 text-green-700"
            : String(item?.bso_status).toLowerCase() === "inactive"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {item?.bso_status}
        </span>
      ) : <span className="text-gray-400 text-xs">N/A</span>,
      bso_name: item?.bso_name || <span className="text-gray-400 text-xs">N/A</span>,
      bso_contact: (item?.bso_contact || item?.bso_email) ? (
        <div className="flex flex-col gap-0.5 text-sm">
          {item?.bso_contact && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500 text-xs">📞</span>
              <span>{item?.bso_contact}</span>
            </div>
          )}
          {item?.bso_email && (
            <div className="flex items-center gap-1">
              <span className="text-gray-500 text-xs">✉</span>
              <span className="text-blue-600 break-all">{item?.bso_email}</span>
            </div>
          )}
        </div>
      ) : <span className="text-gray-400 text-xs">N/A</span>,
      bso_address: item?.bso_address ? (
        <div className="text-sm leading-snug">
          {[
            item?.bso_address,
            item?.bso_city,
            item?.bso_state,
            item?.bso_pincode,
            item?.bso_country,
          ]
            .filter(Boolean)
            .join(", ")}
        </div>
      ) : <span className="text-gray-400 text-xs">N/A</span>,
    };
  });

  const buyingcolumns = [
    { field: "charge_id", headerName: "CHARGES", textalign: "left" },
    { field: "pp_cc", headerName: "PP/CC", textalign: "left" },
    { field: "rate", headerName: "RATE", textalign: "left" },
    { field: "weight", headerName: "WEIGHT", textalign: "left" },
    { field: "currency", headerName: "CURRENCY", textalign: "left" },
    { field: "ex_rate", headerName: "EX" },
  ];
  const sellingcolumns = [];

  const getJob = async (
    value: any,
    value2?: any,
    extradata?: any,
    value3?: any,
  ) => {
    setBuyChargesadd([intarrcharges2]);
    setSellingChargesadd([intarrcharges]);
    const params: any = { limit: 20, offset: page - 1 };
    const { from_date, to_date, hub_id } = filterdata;

    if (searchCase != 1) {
      params.key = searchCase;
    }
    if (debouncedSearch) {
      params.key = debouncedSearch;
    }
    if (mawbdebounce) {
      params.mawb = mawbdebounce;
      params.key = "all";
    }
    if (from_date) {
      params.from_date = from_date;
    }
    if (to_date) {
      params.to_date = to_date;
    }
    if (hub_id) {
      params.hub_id = hub_id;
    }
    if (selectedfranchisedata?.franchisee_id && !value2) {
      params.f_id = selectedfranchisedata?.franchisee_id;
    }
    if (value == 1 || value == 2)
      try {
        setLoading(true);
        const res = value3
          ? await commongetrequest("booking/cs", {
              params: { limit: 20, offset: 0, key: "all" },
            })
          : await commongetrequest("booking/cs", { params: params });
        if (res?.status == 200) {
          setCsData(res?.data?.data)      

          // setTotalPages(Number(res?.data?.count));
          setTotalPages(Math.ceil(Number(res?.data?.count / 20)));
       
          if (extradata) {
        
            getcustomerservicestatus();
            const singledata = res?.data?.data?.find(
              (item: any) => item?.pickup_id == extradata?.pickup_id,
            );
            setDataToPost(singledata);
            setForWhat(2);
            updateData(singledata?.pickup_id, singledata);
            setRemarksdata((pre: any) => ({
              ...pre,
              job_id: singledata?.job_id,
              hub_id: singledata?.hub_id || "",
            }));
            getattachments(singledata?.job_id);
          }
        } else if (res?.status == 204) {
          showAlert("Data not found!");
          setCsData([]);
          setTotalPages(0);
        } else {
          setCsData([]);
          setTotalPages(0);
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
  };

  const formatData = (data: any[]) => {
    if (!(data?.length > 0)) {
      showAlert("No data available for download", "warning");
      return;
    }

    return data.map((item: any, index: number) => {
      const franchiseeMatch = franchiseedata?.find(
        (f: any) => f.franchisee_id == item.pickup_franchisee_id,
      );

      return {
        "Sr. No.": `${index + 1}.`,
        "Customer Name": franchiseeMatch?.franchisee_name || "",
        "HAWB No": item?.airwaybilno,
        "MAWB NO.": item?.master || "N.A",
        Carrier:
          courierproduct?.find(
            (item2: any) => item2?.product_id == item?.courier_id,
          )?.product_name || "",
        "Booking Type":
          item?.import_booking == 1
            ? "Export"
            : item?.import_booking == 2
            ? "Import"
            : "N/A",
        incoterm:
          incoterm?.find((item2: any) =>
            item2?.id == item?.inco_terms ? item?.inco_terms : item?.inco_term,
          )?.name || "",
        pod: item?.port_of_dest || "N/A",
        poc:
          countrydata?.find(
            (item2: any) => item2?.country_id == item?.org_country_id,
          )?.country_name || "N/A",

        "Last status":
          item?.updated_status === "210"
            ? "Handed Over To Carrier"
            : getparticulardata("status", item?.updated_status, statusdata)
              ?.status || "",
        "CS Remarks": item?.cs_remarks,
        "Last update": formatDate(item?.updated_date),
        last_updated_sent: formatDate(item?.last_updated_sent) || "",
        "Performa Url": item?.performa_url || "N.A.",
        "House PDF": item?.house_pdf || "N.A.",
      };
    });
  };

  const downloadFunction = async () => {
    const { from_date, to_date,hub_id } = filterdata;
    // const params: any = {};
    const params: any = { key: "all" };

    if (searchCase != 1) {
      params.key = searchCase;
    }
    if (debouncedSearch) {
      params.key = debouncedSearch;
    }
    if (mawbdebounce) {
      params.mawb = mawbdebounce;
      params.key = "all";
    }
    if (from_date) {
      params.from_date = from_date;
    }
    if (to_date) {
      params.to_date = to_date;
    }
    if(hub_id){
      params.hub_id=hub_id
    }

    if (selectedfranchisedata?.franchisee_id) {
      params.f_id = selectedfranchisedata?.franchisee_id;
    }
    try {
      setDownloadSpinner(true);
      const res = await commongetrequest(`booking/cs`, { params: params });
      if (res?.status == 200 || res?.status == 204) {
        setDownloadData(res?.data?.data || []);
        jsontocsv(formatData(res?.data?.data) || [], "Job List");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      setDownloadSpinner(false);
    }
  };

  useEffect(() => {
    if (franchiseedata?.length >= 1) getJob(hit);
  }, [page, debouncedSearch, franchiseedata?.length, searchCase, mawbdebounce]);

  const handlePagechange = (e: number) => {
    setPage(e);
    setHit(1);
  };
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setFilterdata((pre: any) => ({ ...pre, [name]: value }));
    setHit(3)
  };

  return (
    <>
      <div className="grid grid-cols-12  sm:grid-cols-12 lg:gap-3 gap-2 mt-4 lg:p-4 p-2 isSearch bg-white rounded-md justify-between shadow-blue-900">
        <div className="col-span-12  lg:col-span-12 md:col-span-12 sm:col-span-12">
          <div className="lg:flex xl:flex justify-between items-center flex-wrap gap-4">
            {/* Left side: Heading */}
            <h2 className="text-lg font-bold">Job Listing</h2>

            {/* Right side: Search + Download */}
            <div className="min-[500px]:flex items-center gap-3">
              {/* Search Input with Icon */}
              <div className="relative  max-[489px]:mt-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <FormInput
                  type="text"
                  placeholder="Search by HAWB No."
                  value={search}
                  className="w-full pl-10"
                  onChange={(e) => {
                    setSearch(e.target.value.replace(/\s/g, ""));
                    setSearchCase("");
                    setHit(1);
                    setPage(1);
                  }}
                />
              </div>
              <div className="relative max-[489px]:mt-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <FormInput
                  type="text"
                  placeholder="Search by MAWB No."
                  value={mawb}
                  className="w-full pl-10"
                  onChange={(e) => {
                    setMawb(e.target.value.replace(/\s/g, ""));
                    setSearchCase("");
                    setHit(1);
                    setPage(1);
                  }}
                />
              </div>

              {/* Download Button (conditionally rendered) */}
              {csData?.length >= 1 && (
                <Button
                  variant="success"
                  className="text-white p-2 max-[489px]:mt-4"
                  disabled={downloadSpinner}
                  onClick={downloadFunction}
                >
                  Download
                  {downloadSpinner ? (
                    <LoadingIcon
                      icon="puff"
                      color="white"
                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                    />
                  ) : (
                    <Download className="ml-2" />
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between w-full mt-4">
            <div className="grid min-[876px]:grid-cols-5 min-[500px]:grid-cols-2 min-[500px]:grid-cols-1 gap-4 ">
              <div>
                <FormLabel>Cases</FormLabel>
                <FormSelect
                  value={searchCase}
                  onChange={(e) => {
                    setSearchCase(e.target.value);
                    setOpenRemove(false);
                    setSearch("");
                    setHit(3)
                  }}
                >
                  {/* <option value="">Select One</option> */}
                  <option value="all">All</option>
                  <option value="1">Open Case</option>
                  <option value="delivered">Close Case</option>
                </FormSelect>
              </div>
              <div>
                <FormLabel>
                  Search By Franchisee
                  {/* <span className="text-red-400">*</span> */}
                </FormLabel>
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
              <div className="w-full">
                <FormLabel htmlFor="modal-form-5">SELECT HUB</FormLabel>
                <FormSelect value={filterdata?.hub_id} name={"hub_id"} onChange={handlechange}>
                  <option value="">Select</option>
                  {hubdata?.map((item: any) => (
                    <option value={item?.hub_id}>{item?.hub_name}</option>
                  ))}
                </FormSelect>
              </div>
              <div className="w-full">
                <FormLabel htmlFor="modal-form-5">FROM DATE</FormLabel>
                <FormInput
                  id="modal-form-5"
                  type="date"
                  value={filterdata?.from_date}
                  max={filterdata?.to_date}
                  name="from_date"
                  onChange={handlechange}
                />
              </div>
              <div className="w-full">
                <FormLabel htmlFor="modal-form-5">TO DATE</FormLabel>
                <FormInput
                  id="modal-form-5"
                  type="date"
                  value={filterdata?.to_date}
                  min={filterdata?.from_date}
                  name="to_date"
                  onChange={handlechange}
                />
              </div>
              <div className="flex ">
                <div>
                  {" "}
                  <Button
                    className="bg-success p-2 text-white w-[120px] mt-7 "
                    onClick={() => getJob(2)}
                    // disabled={!selectedfranchisedata?.franchisee_id}
                  >
                    {loading && selectedfranchisedata?.franchisee_id ? (
                      <LoadingButtonCommon text="Searching" />
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
                <div className="ml-2">
                  <Button
                    className="bg-red-400 p-2 text-white w-[120px] mt-7 "
                    onClick={() => functiontoreset()}
                    // disabled={!selectedfranchisedata?.franchisee_id}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="customerTable">
            <div className="overflow-x-auto ">
              <div className="table-responsive ">
                {loading ? (
                  <IsLoading />
                ) : (
                <Table
                  columns={columns}
                  row={row}
                  heightTable="100vh"
                  height="h-[100vh]"
                  isLoading={loading}
                />
                )}

                {csData?.length > 0 && totalpages > 1 && (
                  <CommonPagination
                    totalpages={totalpages}
                    onPageChange={handlePagechange}
                    page={page}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openModal && (
        <CommonModal
          open={openModal}
          size={forwhat == 1 || forwhat == 3 || forwhat == 2 ? "2xl" : "lg"}
          title={title}
          setOpen={setOpenModal}
          description={description}
          footer={footer}
        />
      )}
      {openModal2 && (
        <CommonModal
          open={openModal2}
          size={"lg"}
          title={title2}
          setOpen={setOpenModal2}
          description={description2}
          footer={footer2}
        />
      )}

      <CommonModal
        open={openModal1}
        size={"md"}
        title={title1}
        setOpen={setOpenModal1}
        description={description1}
        footer=""
      />
      {mailDocModal && (
        <CommonModal
          open={mailDocModal}
          size={"md"}
          title={mailTitle}
          setOpen={setMailDocModal}
          description={mailDescription}
          footer={mailFooter}
        />
      )}
    </>
  );
};

export default Customer_service;

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
