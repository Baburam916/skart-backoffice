import React, { useEffect, useRef, useState } from "react";

import {
  FolderOpen,
  ShieldAlert,
  ThumbsDown,
  Laptop,
  Clock8,
  UserPlus,
  Search,
  RefreshCcw,
  Download,
  XCircle,
} from "lucide-react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
} from "../../../../base-components/Form";

import Button from "../../../../base-components/Button";

import Table from "../../../../base-components/Table";

import { Menu } from "../../../../base-components/Headless";
import imgg1 from "../../../../assets/images/dashboardImages/initiated-job.png";
import imgg2 from "../../../../assets/images/dashboardImages/wallet.png";
import imgg3 from "../../../../assets/images/dashboardImages/searchbox.png";
import CommonPagination from "../../../../components/Pagination";
import {
  commongetrequest,
  commonpostrequest,
  commonputrequest,
  universalpost,
} from "../../../../AllServices/services";
import { useDebounce } from "../../commoncomponents/JsonToCsv/useDebounce/useDebounce";
import Nodatafound from "../../commoncomponents/Nodatafound/Nodatafound";
import {
  convertUTCtoIST,
  downloadAttachment,
  indianFormat,
  validateEmail,
} from "../../../../utils";
import { formatDate } from "../../commoncomponents/commondateformat/datetoreqformat";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import IsLoading from "../../commoncomponents/isLoading/isLoading";
import { useLocation, useNavigate } from "react-router";
import { useLogin } from "../../commoncomponents/LoginContextProvider/LoginContextProvider";
import { formatIndianNumber } from "../../commoncomponents/CommonNumberConverter/CommonNumberconverter";
import { store } from "../../../../stores/store";
import { SpotpriceModal } from "../../SpotEnquiry/SpotEnquiryModal/SpotEnquiryModal";
import { X } from "lucide-react";
import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";
import CommonModal from "../../commoncomponents/CommonModal/CommonModal";
import CommonemailModal from "../../SpotEnquiry/SpotEnquiryModal/emailModal";
import { getpropersalespersons } from "../../SpotEnquiry/SpotEnquiryModal/emailbody";
import Tippy from "../../../../base-components/Tippy";
import { UserCog } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { PlusCircle } from "lucide-react";
import SenderDetails from "./senderDetails";
import ReceiverDetails from "./receiverDetails";
import { set } from "lodash";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import { ShipmentDimensions } from "../../commoncomponents/ShipmentDimensions/shipmentdimensions";
import Spinner from "../../../../components/Spinner/Spinner";
import { FileText } from "lucide-react";
import SellBuyForm from "../../SpotEnquiry/SpotEnquiryModal/spotpriceChargeform";
import { useServiceSocket } from "../../../../hooks/useServiceSocket";
// import './style.css';

const intdata = {
  search1: "",
  search2: "",
  search3: "",
  search4: "",
  totalpages1: 1,
  totalpages2: 1,
  totalpages3: 1,
  totalpages4: 1,
  page1: 1,
  page2: 1,
  page3: 1,
  page4: 1,
  loading1: false,
  loading2: false,
  loading3: false,
  loading4: false,
  spotdata1: [],
  spotdata2: [],
  spotdata3: [],
  spotdata4: [],
};
const inttopdata = {
  intjobs: 0,
  cancelled: 0,
  open: 0,
  requoted: 0,
  expired: 0,
  rejected: 0,
  approval_pending: 0,
  booked: 0,
};
const inteditdata = {
  franchisee_id: "",
  franchisee_name: "",
  booking_no: "",
  branch_id: "",
  booking_id: "",
  origin_pincode: "",
  origin_city: "",
  origin_state_code: "",
  destination_country: "",
  destination_country_code: "",
  destination_country_id: "",
  destination_pincode: "",
  state: "",
  city: "",
  startPoint: "",
  shipment_type: "",
  weight: "",
  weight_unit: "",
  quoted_by: "",
  price_type: "",
  spot_price: "",
  cargo_type: "",
  clearence_type: "",
  courier_id: "",
  courier_code: "",
  courier_name: "",
  courier_vendor_code: "",
};
const options = [
  { id: "Franchisee", label: "Franchisee" },
  { id: "Destination", label: "Destination" },
  { id: "Chargeable Weight", label: "Chargeable Weight" },
];
const intfranchiseedata = {
  franchisee_id: "",
  franchisee_name: "",
};
const intselecteddata = {
  country_name: "",
  country_id: "",
};
const intcommoditydata = {
  commodity_id: "",
  commodity: "",
};
export const IsDashboard = () => {
  const [isActive, setActive] = useState(false);
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [forwhat, setForwhat] = useState<any>("");
  const [hasUpdated, setHasUpdated] = useState<boolean>(false);
  const [selecteddata, setSelecteddata] = useState<any>(intselecteddata);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "Franchisee",
    "Destination",
    "Chargeable Weight",
  ]);
  const [counter, setCounter] = useState<any>(0)
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [enquiryModal, setEnquiryModal] = useState<boolean>(false);
  const [productTypes, setProductTypes] = useState([]);
  const [editdata, setEditData] = useState<any>(inteditdata);
  const [datatoget, setDatatoget] = useState<any>(intdata);
  const [allfdata, setAllfdata] = useState<any>([]);
  const [topdata, setTopData] = useState<any>(inttopdata);
  const [franchiseIds, setFranchiseIds] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [spotenquirydata, setSpotEnquirydata] = useState<any>([]);
  const [chargesdata, setChargesdata] = useState<any>([]);
  const [page, setPage] = useState<number>(1);

  const [totalpages, setTotalPages] = useState<number>(1);
  const [hit, setHit] = useState<any>(1);
  const [countryData, setCountryData] = useState([]);
  const [searchvalue, setSearchvalue] = useState<string>("");
  const debouncedSearch = useDebounce(datatoget.search1, 300);
  const debouncedSearch2 = useDebounce(datatoget.search2, 300);
  const debouncedSearch3 = useDebounce(datatoget.search3, 300);
  const debouncedSearch4 = useDebounce(datatoget.search4, 300);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [branchData, setBranchData] = useState<any>([]);
  const [hubdata, setHubdata] = useState<any>([]);
  const [emailModal, setEmailModal] = useState<boolean>(false);
  const [exposureData, setExposureData] = useState<any>([]);
  const [shipmentTypedata, setShipmentTypedata] = useState<any>([]);
  const [pdcModal, setPdcModal] = useState<boolean>(false);
  const [pdcLen, setPdclen] = useState<any>();
  const [singlefranchiseedata, setSingleFranchiseedata] = useState<any>({});
  const [pdcData, setPdcData] = useState({
    attachment: null, // for files use null
    id: "",
    date_of_pdc: "",
    pdc_amount: "",
    cheque_no: "",
    bank: "",
    is_deposit: 0,
  });
  const [error, setError] = useState<Array<any>>([]);
  const { showAlert } = useAlert();
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [importData, setImportData] = useState<any>([]);
  const [getShipment, setgetShipment] = useState<Array<any>>([]);
  const [selectedImportCommoditydata, setSelectedImportCommoditydata] =
    useState<any>(intcommoditydata);
  const [selectedEditCommoditydata, setSelectedEditCommoditydata] =
    useState<any>(intcommoditydata);
  const [incotermType, setIncoterm] = useState([]);
  const [clearanceType, setClearanceType] = useState([]);
  const [currencydata, setCurrencydata] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [senderOpen, setSenderOpen] = useState(false);
  const [receiverOpen, setReceiverOpen] = useState(false);
  const [jobData, setJobData] = useState<any>([]);
  const [dimensionData, setDimensionData] = useState([
    {
      item_description: "",
      weight: "",
      value: "",
      quantity: "",
      length: "",
      breadth: "",
      height: "",
      hsn_code: "",
    },
  ]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [shipperInvoiceFile, setShipperInvoiceFile] = useState<File | null>(null);
  const [shipperInvoiceUrl, setShipperInvoiceUrl] = useState<string>("");
  const [shipperInvoiceUploading, setShipperInvoiceUploading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState({
    status: false,
    forWhat: "",
  });
  const [scanData, setScanData] = useState({
    id: "",
    job_id: "",
    remarks: "",
    status_code: "",
    td_date: null,
    td_weight: null,
  });
  const [showBtn, setShowBtn] = useState(false);
  const [selfSpinner, setSelfSpinner] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanEvents, setScanEvents] = useState([]);
  const [scanSpinner, setScanSpinner] = useState(false);
  const [statusCodes, setStatusCodes] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [trackSpinner, setTrackSpinner] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const [tagData, setTagData] = useState({});
  const [mawbPresent, setMawbPresent] = useState(false);
  const [tagSpinner, setTagSpinner] = useState(false);
  const [bookingStatuses, setBookingStatuses] = useState<any[]>([]);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailData, setEmailData] = useState({
    to_email: "",
    cc_email: [],
  });
  const [ccInput, setCcInput] = useState("");

  const [errors, setErrors] = useState({ to_email: "", cc_email: "" });
  const [showEditBooking, setShowEditBooking] = useState(false);
  const [editBookingData, setEditBookingData] = useState({});
  const [editSpinner, setEditSpinner] = useState(false);
  const [bookSpinner, setBookSpinner] = useState(false);
  const [proformaOpen, setProformaOpen] = useState(false);
  const [proformaData, setProformaData] = useState<any>({});
  const [proformaLoading, setProformaLoading] = useState(false);

  const getChargeableWeight = (value?: any[]): number => {
    if (!Array.isArray(value) || value.length === 0) return 0;
    const total = value.reduce((acc: number, item: any) => {
      return (
        acc +
        Math.max(
          Number(item?.weight) || 0,
          (Number(item?.height) *
            Number(item?.breadth) *
            Number(item?.length) *
            Number(item?.quantity)) /
          5000,
        )
      );
    }, 0);
    return Number((total || 0).toFixed(3));
  };



  const bookingStatusColorMap: Record<number, string> = {
    1: "text-green-400",
    3: "text-yellow-300",
    5: "text-green-400",
    7: "text-orange-400",
    8: "text-red-400",
    9: "text-green-400",
    10: "text-red-400",
    15: "text-green-400",
    18: "text-orange-400",
    19: "text-red-400",
  };

  const getAllBookingStatus = async () => {
    try {
      const res = await commongetrequest("booking/enquiry_status");
      if (res?.status === 200) {
        setBookingStatuses(res?.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBookingStatus();
  }, []);

  const handleUpdateScanEvents = async () => {
    if (scanData?.id == 4 && !statusCodes?.includes("302")) {
      setScanSpinner(false);
      return showAlert("Please Add TD Received Events First", "warning");
    }
    if (scanData?.id == 5 && !statusCodes?.includes("300")) {
      setScanSpinner(false);
      return showAlert(
        "Please Add Shipment cleared Customs Events First",
        "warning",
      );
    }
    if (scanData?.id == 6 && !scanData?.remarks) {
      setScanSpinner(false);
      return showAlert("Please Enter Remarks", "warning");
    }
    if (scanData?.id != 6 && !scanData?.remarks) {
      setScanSpinner(false);
      return showAlert("Please Select Scan Events", "warning");
    }
    if (scanData?.id == 2 && !scanData?.td_weight) {
      setScanSpinner(false);
      return showAlert("Please Enter TD Weight", "warning");
    }
    if (scanData?.id == 2 && !scanData?.td_date) {
      setScanSpinner(false);
      return showAlert("Please Enter TD Date", "warning");
    }
    if (scanData?.id != 2) {
      delete scanData?.td_date;
      delete scanData?.td_weight;
    }

    try {
      const res = await commonpostrequest(`booking/add-scan-event`, scanData);
      if (res?.status == 200) {
        setScanData({
          id: "",
          job_id: "",
          remarks: "",
          status_code: "",
          td_date: null,
          td_weight: null,
        });
        handleCancel(1);
        setScanOpen(false);
        showAlert(res?.data?.message);
      } else if (res?.response?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "warning");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error);
      showAlert(error?.message, "error");
    } finally {
      setScanSpinner(false);
    }
  };

  const handleImportLastMail = async (franchisee_id: any) => {
    try {
      const res = await commongetrequest(
        `booking/import-last-mail/${franchisee_id}`,
      );
      if (res?.status == 200) {
        if (res?.data?.data?.to_mail) {
          setEmailData((prev) => ({
            ...prev,
            to_email: res?.data?.data?.to_mail,
          }));
        }
        if (res?.data?.data?.cc_mail) {
          setEmailData((prev) => ({
            ...prev,
            cc_email: res?.data?.data?.cc_mail.split(","),
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);
  const shipperInvoiceInputRef = useRef<HTMLInputElement>(null);
  const handleCheckboxChange = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleInputChange = (id: string, value: string) => {
    setInputs((prev) => ({ ...prev, weight: value }));
  };

  const handleSearch = () => {
    getspotenqdata(
      1,
      [0],
      inputs?.franchisee_id?.length >= 1 && inputs?.franchisee_id,
      inputs,
    );
    getspotenqdata(
      2,
      0,
      inputs?.franchisee_id?.length >= 1 && inputs?.franchisee_id,
      inputs,
    );
    getspotenqdata(
      3,
      [1, 3, 7, 8, 9, 10],
      inputs?.franchisee_id?.length >= 1 && inputs?.franchisee_id,
      inputs,
    );
    getspotenqdata(
      4,
      [14],
      inputs?.franchisee_id?.length >= 1 && inputs?.franchisee_id,
      inputs,
    );
  };
  const { userdata, franhiseedata, statusdata } = useLogin();
  const currentDate = new Date();
  const navigate = useNavigate();
  const ToggleClass = () => {
    setActive(!isActive);
  };
  const fun1 = (a?: any) => {
    //  setSelectedfranchisedata((pre:any)=>({}))

    setInputs((pre: any) => ({ ...pre, franchisee_id: [a?.franchisee_id] }));
  };
  const fun2 = () => {
    setSelectedfranchisedata(intfranchiseedata);

    setInputs((pre: any) => ({ ...pre, franchisee_id: "" }));
  };
  const fun3 = (a: any) => {
    setInputs((pre: any) => ({ ...pre, dest_country_id: a?.country_id }));
  };
  const fun3toempty = () => {
    setSelecteddata(intselecteddata);
    setInputs((pre: any) => ({ ...pre, dest_country_id: "" }));
  };

  const handleCancel = (value: any) => {
    setEnquiryModal(false);
    setHasUpdated(false);
    setExposureData([]);
    setEmailModal(false);
    setCounter(0)
    setForwhat("");
    setCounter(0)
    // data.setShowForm(true);
    setEditData(inteditdata);
    // getData(hit);
    if (value == 1) {
      getspotenqdata(1, [0, 16]);
      getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
      gettopdata();
    }

    if (value == 3) {
      getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
      gettopdata();
    }
    if (value == 4) {
      getspotenqdata(4, [14]);
      gettopdata();
    }
  };
  const handlePagechange = (e: number, value: any) => {
    if (value == 1) {
      setDatatoget((pre: any) => ({ ...pre, page1: e }));
    }
    if (value == 2) {
      handlealldatatoget("page2", e);
    }
    if (value == 3) {
      handlealldatatoget("page3", e);
    }
    if (value == 4) {
      handlealldatatoget("page4", e);
    }
    // setPage(e);
    // setHit(1);
  };
  // checking object is empty or not
  const checkisEmpty = (obj: any) => {
    return Object.values(obj).every(
      (value) =>
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" &&
          value !== null &&
          Object.keys(value).length === 0),
    );
  };
  const getReloadData = async (data) => {
    const res = await commongetrequest(
      `booking/get_enquiry_pdc_details?id=${data}`,
    );
    const result = res?.data?.data;
    // let result = res?.data?.data?.filter((item:any) => item?.enquiry_id == data)
    const convertToInputDate = (dateStr) => {
      if (!dateStr) return "";

      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`; // yyyy-mm-dd
    };
    if (result?.status == 200) {
      setPdcData({
        attachment: result[0]?.attachment || "",
        id: result[0]?.id || "",
        date_of_pdc: result[0]?.date_of_pdc
          ? convertToInputDate(result[0]?.date_of_pdc)
          : "",
        pdc_amount: result[0]?.pdc_amount || "",
        cheque_no: result[0]?.cheque_no || "",
        bank: result[0]?.bank || "",
        is_deposit: result[0]?.is_deposit,
      });
    }
  };
  const funcPdcSave = async () => {
    const formdata = new FormData();

    // Append all state fields to FormData
    Object.entries(pdcData).forEach(([key, value]) => {
      if (key === "attachment" && value) {
        formdata.append(key, value);
      } else if (key === "id") {
        // Use editdata.id if available, otherwise fallback to what's in pdcData
        formdata.append("id", editdata?.id || value || "");
      } else {
        formdata.append(key, value ?? "");
      }
    });
    formdata.append("booking_status", 8);
    // If you have enquiry_id from somewhere (e.g. newdata.enquiry_id)

    try {
      const res = await commonpostrequest(
        "booking/update_enquiry_pdc",
        formdata,
      );
      if (res?.status == 200) {
        getReloadData(editdata?.booking_no);
        setEnquiryModal(true);
        setPdcModal(false);
        setError([]);
      } else if (res?.status == 406) {
        setError(res?.response?.data.errors);
      }
    } catch (err) {
      console.error("err", err);
    }
  };
  useEffect(() => {
    getintdata();
    commongetrequest("admin/booking-shipment-type")?.then((res) => {
      setgetShipment(res?.data?.data || []);
    });
    commongetrequest("booking/incoterm")?.then((res) => {
      setIncoterm(res?.data?.data || []);
    });
    commongetrequest("booking/clearence-type")?.then((res) => {
      setClearanceType(res?.data?.data || []);
    });
    commongetrequest("booking/currency")?.then((res) => {
      setCurrencydata(res?.data?.data || []);
    });
    commongetrequest("admin/courier-product")?.then((res) => {
      setProducts(res?.data?.data || []);
    });
  }, []);
  useEffect(() => {
    if (!importData?.commodity) return;
    commongetrequest(`admin/commodity-type/${importData?.commodity}`)?.then(
      (res: any) => {
        if (res?.status == 200) {
          const raw = res?.data?.data;
          const singledata = Array.isArray(raw) ? raw[0] : raw;
          if (singledata) {
            setSelectedImportCommoditydata({
              commodity_id: singledata?.commodity_id,
              commodity: singledata?.commodity,
            });
          }
        }
      },
    );
  }, [importData?.commodity]);
  useEffect(() => {
    if (!editBookingData?.commodity) return;
    commongetrequest(
      `admin/commodity-type/${editBookingData?.commodity}`,
    )?.then((res: any) => {
      if (res?.status == 200) {
        const raw = res?.data?.data;
        const singledata = Array.isArray(raw) ? raw[0] : raw;
        if (singledata) {
          setSelectedEditCommoditydata({
            commodity_id: singledata?.commodity_id,
            commodity: singledata?.commodity,
          });
        }
      }
    });
  }, [editBookingData?.commodity]);
  useEffect(() => {
    getspotenqdata(1, [0, 16]);
  }, [datatoget.page1, debouncedSearch, selectedOptions?.length == 0]);
  useEffect(() => {
    getspotenqdata(2, 0);
  }, [datatoget.page2, debouncedSearch2, selectedOptions?.length == 0]);
  useEffect(() => {
    getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
  }, [datatoget.page3, debouncedSearch3, selectedOptions?.length == 0]);
  useEffect(() => {
    getspotenqdata(4, [14]);
  }, [datatoget.page4, debouncedSearch4, selectedOptions?.length == 0]);
  const handlealldatatoget = (name: any, value: any) => {
    setDatatoget((pre: any) => ({ ...pre, [name]: value }));
  };

  // handlereset here
  const handlereset = () => {
    setInputs({});
    getspotenqdata(1, [0, 16]);
    getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
    getspotenqdata(2, 0);
    getspotenqdata(4, [14]);
    setSelectedfranchisedata(intfranchiseedata);
    setSelectedOptions(["Franchisee", "Destination", "Chargeable Weight"]);
    setSelecteddata(intselecteddata);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!enquiryModal) {
        gettopdata();
        getspotenqdata(1, [0, 16]);
        getspotenqdata(2, 0);
        getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
        getspotenqdata(4, [14]);
      }
    }, 300000);

    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }, []);

  // real-time: refetch when any booking status changes from pricing or any other source
  useServiceSocket("booking", "booking_status_changed", () => {
    if (!enquiryModal) {
      gettopdata();
      getspotenqdata(1, [0, 16]);
      getspotenqdata(2, 0);
      getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
      getspotenqdata(4, [14]);
    }
  }, () => {
    if (!enquiryModal) {
      gettopdata();
      getspotenqdata(1, [0, 16]);
      getspotenqdata(2, 0);
      getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
      getspotenqdata(4, [14]);
    }
  });

  useEffect(() => {
    gettopdata();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const getspotenqdata = async (
    value: any,
    ids?: any,
    f?: any,
    inputs?: any,
  ) => {
    const storedfdata: any =
      JSON.parse(localStorage.getItem("franchiseedata")) || [];

    const fids = storedfdata?.map((item: any) => item?.franchisee_id);

    try {
      if (value == 1) {
        setDatatoget((pre: any) => ({ ...pre, loading1: true }));
      }
      if (value == 2) {
        setDatatoget((pre: any) => ({ ...pre, loading2: true }));
      }

      if (value == 3) {
        setDatatoget((pre: any) => ({ ...pre, loading3: true }));
      }
      if (value == 4) {
        setDatatoget((pre: any) => ({ ...pre, loading4: true }));
      }
      if (value == 1) {
        let obj1: any = {
          booking_status: ids,
        };
        if (f) {
          obj1.franchisee_id = f;
        }
        const response = await commonpostrequest(
          `booking/get_spot_enquiry?sales_id=${userdata?.mapped_id
          }&limit=5&page=${datatoget.page1 - 1}${debouncedSearch ? `&key=${debouncedSearch.trim()}` : ""
          }${inputs?.weight ? `&weight=${inputs.weight}` : ""}${inputs?.dest_country_id
            ? `&dest_country_id=${inputs?.dest_country_id}`
            : ""
          }`,
          obj1,
        );
        if (response?.status == 200) {
          setSpotEnquirydata(response?.data?.data || []);
          handlealldatatoget("spotdata1", response?.data?.data || []);
          setDatatoget((pre: any) => ({
            ...pre,
            totalpages1: Math.ceil(response?.data?.total / 5),
          }));
        } else {
          handlealldatatoget("spotdata1", []);
          setDatatoget((pre: any) => ({
            ...pre,
            totalpages1: 0,
          }));
          setTotalPages(Math.ceil(0));
        }
      }
      if (value == 2) {
        const response = await commongetrequest(
          `booking/job-list?status=${ids || 0}${debouncedSearch2 ? `&key=${debouncedSearch2.trim()}` : ""
          }&sales_id=${userdata?.mapped_id}&limit=5&page=${(datatoget.page2 - 1) * 5
          }${inputs?.weight ? `&weight=${inputs.weight}` : ""}${inputs?.dest_country_id
            ? `&destination_country=${inputs?.dest_country_id}`
            : ""
          }${inputs?.franchisee_id && inputs?.franchisee_id?.length >= 1
            ? `&franchisee_id=${inputs?.franchisee_id[0]}`
            : ""
          }`,
        );
        if (response?.status == 200) {
          handlealldatatoget("spotdata2", response?.data?.data || []);
          setDatatoget((pre: any) => ({
            ...pre,
            totalpages2: Number(response?.data?.count) || 0,
          }));
        } else {
          handlealldatatoget("spotdata2", []);
          setDatatoget((pre: any) => ({
            ...pre,
            totalpages2: 0,
          }));
        }
      }
      if (value == 3) {
        let obj3: any = {
          booking_status: ids,
        };
        if (f) {
          obj3.franchisee_id = f;
        }
        const response = await commonpostrequest(
          `booking/get_spot_enquiry?sales_id=${userdata?.mapped_id
          }&limit=5&page=${datatoget.page3 - 1}${debouncedSearch3 ? `&key=${debouncedSearch3.trim()}` : ""
          }${inputs?.weight ? `&weight=${inputs.weight}` : ""}${inputs?.dest_country_id
            ? `&dest_country_id=${inputs?.dest_country_id}`
            : ""
          }`,
          obj3,
        );
        if (response?.status == 200) {
          handlealldatatoget("spotdata3", response?.data?.data || []);
          setDatatoget((pre: any) => ({
            ...pre,
            totalpages3: Math.ceil(response?.data?.total / 5),
          }));
        } else {
          handlealldatatoget("spotdata3", []);
          setDatatoget((pre: any) => ({
            ...pre,
            totalpages3: 0,
          }));
        }
      }
      if (value == 4) {
        let obj4: any = {
          booking_status: ids,
        };
        if (f) {
          obj4.franchisee_id = f;
        }
        const response = await commonpostrequest(
          `booking/get_spot_enquiry?sales_id=${userdata?.mapped_id
          }&limit=5&page=${datatoget.page4 - 1}${debouncedSearch4 ? `&key=${debouncedSearch4.trim()}` : ""
          }${inputs?.weight ? `&weight=${inputs.weight}` : ""}${inputs?.dest_country_id
            ? `&dest_country_id=${inputs?.dest_country_id}`
            : ""
          }`,
          obj4,
        );
        if (response?.status == 200) {
          handlealldatatoget("spotdata4", response?.data?.data || []);
          setDatatoget((pre: any) => ({
            ...pre,
            totalpages4: Math.ceil(response?.data?.total / 5),
          }));
        } else {
          handlealldatatoget("spotdata4", []);
          setDatatoget((pre: any) => ({
            ...pre,
            totalpages4: 0,
          }));
        }
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setDatatoget((pre: any) => ({
        ...pre,
        loading1: false,
        loading2: false,
        loading3: false,
        loading4: false,
      }));
    }
  };

  const getintdata = async () => {
    try {
      const res = await commongetrequest(`admin/franchisee-settings`);

      // ?sales_id=${userdata?.mapped_id}
      const res3 = await commongetrequest("admin/courier-product");
      const res4 = await commongetrequest(`admin/country`);

      const charges: any = await commongetrequest(
        "admin/charges?type=E&is_cargo=1",
      );
      const hubres = await commongetrequest("admin/hub");
      const res5 = await commongetrequest("admin/hub-pud");
      const shipmenttype = await commongetrequest(
        "admin/booking-shipment-type",
      );

      const allEvents = await commongetrequest("track_shipment/cargo-events");

      if (res?.status == 200) {
        setAllfdata(res?.data?.data || []);
      }

      if (res3?.status == 200) {
        setProductTypes(res3?.data?.data || []);
      }
      if (res4?.status == 200) {
        setCountryData(res4?.data?.data || []);
      }
      if (charges?.status == 200) {
        setChargesdata(charges?.data?.data || []);
      }
      if (res5?.status == 200) {
        setBranchData(res5?.data?.data || []);
      }
      if (hubres?.status == 200) {
        setHubdata(hubres?.data?.data || []);
      }
      if (shipmenttype?.status == 200) {
        setShipmentTypedata(shipmenttype?.data?.data || []);
      }
      if (allEvents?.status == 200) {
        setScanEvents(allEvents?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const handletopdata = (name: string, value: any) => {
    setTopData((pre: any) => ({ ...pre, [name]: value }));
  };
  const gettopdata = async () => {
    try {
      const res = await commongetrequest(
        `booking/get-spot-enquiry-count?sales_id=${userdata?.mapped_id}`,
      );
      const res2 = await commongetrequest(
        `booking/job-count?sales_id=${userdata?.mapped_id}`,
      );
      if (res?.status == 200) {
        const data = res?.data?.data[0] || [];
        setTopData((pre: any) => ({ ...pre, ...data }));
      }
      if (res2?.status == 200) {
        const data = res2?.data?.data;
        handletopdata("intjobs", Number(data?.initiated) || 0);
        handletopdata("cancelled", Number(data?.cancelled) || 0);
      } else {
        setTopData(inttopdata);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  const getrelateddata = (forwhat: any, data: any, id?: any) => {
    if (forwhat == "franchisee") {
      const singledata = data?.find((item: any) => item.franchisee_id == id);
      return singledata || {};
    }
  };
  const gettotal = (data: any) => {
    const totalWeight = data?.reduce(
      (acc: any, item: any) => Number(acc) + Number(item.weight),
      0,
    );
    return totalWeight || 0;
  };
  // const getchweight=(value?:any)=>{
  //   const total=value.reduce((acc,item)=>{
  //     return acc+Math.max(item?.weight,((Number(item?.height)*Number(item?.breadth)*Number(item?.length))*Number(item?.quantity))/5000)
  //   },0
  //   )
  //   return total||0

  // }

  const getchweight = async (
    shipment_dimensions: any = [],
    courier_id: any = "",
  ) => {
    try {
      const courier_data = await commongetrequest(
        `admin/product-settings/${courier_id}`,
      );
      if (courier_data?.status == 200) {
        const data = courier_data?.data?.data || [];
        const bill_type = data[0]?.courier_wt_bill_type;
        let chargeable_weight = 0;
        if (bill_type == 1) {
          chargeable_weight = shipment_dimensions?.reduce(
            (acc: any, item: any) =>
              acc +
              Math.max(
                ((+item?.length || 0) *
                  (+item?.breadth || 0) *
                  (+item?.height || 0) *
                  (+item?.quantity || 0)) /
                data[0]?.denom_fac,
                +item?.weight || 0,
              ),
            0,
          );
        } else {
          let gross_w = shipment_dimensions?.reduce(
            (acc: any, item: any) => acc + +item?.weight || 0,
            0,
          );
          let vol_w = shipment_dimensions?.reduce(
            (acc: any, item: any) =>
              acc +
              ((+item?.length || 0) *
                (+item?.breadth || 0) *
                (+item?.height || 0) *
                (+item?.quantity || 0)) /
              data[0]?.denom_fac,
            0,
          );
          chargeable_weight = Math.max(gross_w, vol_w);
        }

        return Number(chargeable_weight?.toFixed(3)) || 0;
      }
    } catch (error) {
      return 0;
    }
  };
  const funcToOpenFile = (data) => {
    window.open(data, "_blank");
  };
  const modalTitle1 = (
    <div className="flex justify-between w-[100%]">
      <strong>
        <p>PDC</p>
      </strong>

      {/* <div>
        <div>
          <FormSwitch>
            <FormSwitch.Input
              id="checkbox-switch-7"
              value={pdcData?.is_deposit}
              onChange={(e) => {
                if (e.target.checked) {
                  setPdcData((prev) => {
                    return {
                      ...prev,
                      is_deposit: 1,
                    };
                  });
                } else {
                  setPdcData((prev) => {
                    return {
                      ...prev,
                      is_deposit: 0,
                    };
                  });
                }
              }}
              type="checkbox"
            />
            <FormSwitch.Label htmlFor="checkbox-switch-7">
              Deposit
            </FormSwitch.Label>
          </FormSwitch>
        </div>
      </div> */}
    </div>
  );
  const description1 = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date of PDC */}
        <div className="col-span-1">
          <FormLabel>Date of PDC</FormLabel>
          <FormInput
            type="date"
            value={pdcData.date_of_pdc}
            onChange={(e) =>
              setPdcData((prev) => ({ ...prev, date_of_pdc: e.target.value }))
            }
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>
                {val.path === "date_of_pdc" ? val.msg : ""}
              </span>
            ))}
          </small>
        </div>

        {/* PDC Amount */}
        <div className="col-span-1">
          <FormLabel>PDC Amount</FormLabel>
          <FormInput
            type="text"
            value={pdcData?.pdc_amount}
            onChange={(e) =>
              setPdcData((pre: any) => ({
                ...pre,
                pdc_amount: e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*)\./g, "$1"),
              }))
            }
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>
                {val.path === "pdc_amount" ? val.msg : ""}
              </span>
            ))}
          </small>
        </div>

        {/* Cheque No */}
        <div className="col-span-1">
          <FormLabel>Cheque No</FormLabel>
          <FormInput
            type="text"
            value={pdcData?.cheque_no}
            onChange={(e) =>
              setPdcData((pre: any) => ({
                ...pre,
                cheque_no: e.target.value,
              }))
            }
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path === "cheque_no" ? val.msg : ""}</span>
            ))}
          </small>
        </div>

        {/* Bank */}
        <div className="col-span-1">
          <FormLabel>Bank</FormLabel>
          <FormInput
            type="text"
            value={pdcData?.bank}
            onChange={(e) =>
              setPdcData((pre: any) => ({
                ...pre,
                bank: e.target.value,
              }))
            }
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path === "bank" ? val.msg : ""}</span>
            ))}
          </small>
        </div>

        {/* Attachment */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex">
            <div>
              <FormLabel>Attachment</FormLabel>
              <FormInput
                type="file"
                onChange={(e) =>
                  setPdcData((pre: any) => ({
                    ...pre,
                    attachment: e.target.files[0],
                  }))
                }
              />
            </div>
            {String(pdcData?.attachment || "").startsWith("https") && (
              <div className="flex items-center justify-end">
                <Tippy content={"Download Document"}>
                  <Button
                    onClick={() => funcToOpenFile(pdcData?.attachment)}
                    className="bg-mustard rounded-lg px-3 py-1 text-white cursor-pointer"
                  >
                    Download{" "}
                    <Download className="text-white ml-1 cursor-pointer w-[18px]" />
                  </Button>
                </Tippy>{" "}
              </div>
            )}
          </div>

          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>
                {val.path === "attachment" ? val.msg : ""}
              </span>
            ))}
          </small>
        </div>

        {pdcLen?.length > 0 ? (
          <div className="col-span-1 md:col-span-2">
            <div className="flex">
              Deposited
              <div>
                <FormCheck>
                  <FormCheck.Input
                    id="radio-switch-1"
                    type="radio"
                    className="ml-6"
                    checked={pdcData.is_deposit == 1}
                    onChange={() =>
                      setPdcData((prev) => ({
                        ...prev,
                        is_deposit: 1,
                      }))
                    }
                  />
                  <FormCheck.Label htmlFor="radio-switch-1">
                    <p>Yes</p>
                  </FormCheck.Label>
                </FormCheck>
              </div>
              <div>
                <FormCheck>
                  <FormCheck.Input
                    id="radio-switch-2"
                    type="radio"
                    className="ml-2"
                    checked={pdcData.is_deposit == 0}
                    onChange={() =>
                      setPdcData((prev) => ({
                        ...prev,
                        is_deposit: 0,
                      }))
                    }
                  />
                  <FormCheck.Label htmlFor="radio-switch-2">
                    <p>No</p>
                  </FormCheck.Label>
                </FormCheck>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
  const funcPdcform = async (id: any) => {
    const res = await commongetrequest(
      `booking/get_enquiry_pdc_details?id=${id}`,
    );
    setPdclen(res?.data?.data);
    setPdcData({
      attachment: res?.data?.data[0]?.attachment || "",
      id: res?.data?.data[0]?.id || "",
      date_of_pdc: res?.data?.data[0]?.date_of_pdc
        ? new Date(res?.data?.data[0]?.date_of_pdc).toISOString().split("T")[0]
        : "",
      pdc_amount: res?.data?.data[0]?.pdc_amount || "",
      cheque_no: res?.data?.data[0]?.cheque_no || "",
      bank: res?.data?.data[0]?.bank || "",
      is_deposit: res?.data?.data[0]?.is_deposit,
    });
  };
  const modalFooter1 = (
    <div className="flex">
      <Button
        type="button"
        className="w-20 text-white mr-1  bg-gray-500 p-2"
        onClick={() => {
          setPdcModal(false);
          setEnquiryModal(true);
          setError([]);
        }}
      >
        Cancel
      </Button>
      <Button
        type="button"
        className="bg-mustard text-white w-20"
        onClick={() => funcPdcSave()}
      >
        Save
      </Button>
    </div>
  );

  const getparticulardata = (forwhat: any, id?: any, data?: any) => {
    if (forwhat == "franchisee") {
      const singledata = data?.find((item: any) => item?.franchisee_id == id);
      return singledata;
    }
  };

  const handleShipperInvoiceUpload = async (file: File) => {
    setShipperInvoiceFile(file);
    setShipperInvoiceUrl("");
    setShipperInvoiceUploading(true);
    try {
      const formData = new FormData();
      formData.append("shipper_invoice", file);
      const response = await commonpostrequest("book/upload_shipper_invoice", formData);
      if (response?.data?.status == 200) {
        setShipperInvoiceUrl(response.data?.shipper_url || "");
        showAlert("Shipper invoice uploaded successfully");
      } else {
        setShipperInvoiceFile(null);
        setShipperInvoiceUrl("");
        showAlert(
          response?.data?.message || response?.response?.data?.message || "Upload failed",
          "error",
        );
      }
    } catch (error) {
      setShipperInvoiceFile(null);
      setShipperInvoiceUrl("");
      showAlert("Upload failed", "error");
    } finally {
      setShipperInvoiceUploading(false);
    }
  };

  const getJobData = async (job_id: any) => {
    if (!job_id) return;
    try {
      const res = await commongetrequest(`booking/get-job-details/${job_id}`);
      if (res?.status == 200 || 204) {
        setJobData(res?.data?.data || {});
      } else {
        setJobData({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!emailData?.to_email) {
      showAlert("To Email is required", "warning");
      return;
    }

    if (!validateEmail(emailData?.to_email)) {
      showAlert("Invalid email format", "warning");
      return;
    }

    if (!importData?.job_id) return showAlert("Job Id is required", "warning");
    if (!dimensionData || dimensionData?.length == 0)
      return showAlert("Please enter shipment dimensions", "warning");
    if (
      !jobData?.shipper_details ||
      Object.keys(jobData.shipper_details).length == 0
    )
      return showAlert("Please enter sender details", "warning");
    if (
      !jobData?.consignee_details ||
      Object.keys(jobData.consignee_details).length == 0
    )
      return showAlert("Please enter receiver details", "warning");

    setSaveLoading(true);
    try {
      const res = await commonpostrequest("booking/update-job", {
        franchisee_id: importData?.franchisee_id,
        job_id: importData?.job_id,
        import_booking: 2,
        shipment_dimensions: dimensionData || [],
        shipper_details: jobData?.shipper_details || {},
        consignee_details: jobData?.consignee_details || {},
        currency_id: importData?.currency_id || "24",
        sell_charges: [],
        buy_charges: [],
        to: emailData?.to_email || "",
        cc: emailData?.cc_email.join(",") || "",
      });
      if (res?.status == 200) {
        handleCancel(1);
        setEmailOpen(false);
        setOpenImport(false);
        setEmailData({
          to_email: "",
          cc_email: [],
        });
        setShipperInvoiceFile(null);
        setShipperInvoiceUrl("");
        showAlert(res?.data?.message);
      } else if (res?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "warning");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleBooking = async (job_id: any, is_draft: any = 1, self: any = 0) => {
    if (!job_id) return showAlert("Job Id is required", "warning");
    setBookingLoading({ status: true, forWhat: is_draft });
    try {
      const res = await commonpostrequest(
        `booking/generate-booking/${job_id}`,
        {
          is_draft,
          counter: self == 1 ? 4 : counter,
          ...(shipperInvoiceUrl ? { shipper_invoice: shipperInvoiceUrl } : {}),
        },
      );
      if (res?.status == 200) {
        handleCancel(1);
        setOpenImport(false);
        setCounter(0)
        showAlert(res?.data?.message);
        setCounter(0);
        setShipperInvoiceFile(null);
        setShipperInvoiceUrl("");
        if (shipperInvoiceInputRef.current) shipperInvoiceInputRef.current.value = "";
      } else if (res?.status == 400) {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
        setCounter(counter + 1)
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
        setCounter(counter + 1)
      }
    } catch (error) {
      if (error) showAlert("something went wrong", "error");
      setCounter(counter + 1);
    } finally {
      setShowBtn(true);
      setSelfSpinner(false);
      setBookingLoading({ status: false, forWhat: "" });
    }
  };

  const handleTagHouseMaster = async () => {
    if (!tagData?.job_id) return showAlert("Job Id is required", "warning");
    if (!tagData?.hawb) return showAlert("House Number is required", "warning");
    setTagSpinner(true);
    try {
      const res = await commonputrequest(`booking/tag-house-master`, {
        job_id: tagData?.job_id,
        hawb: tagData?.hawb,
        mawb: tagData?.mawb,
      });
      if (res?.status == 200) {
        setTagSpinner(false);
        setTagData({ job_id: "", hawb: "", mawb: "" });
        handleCancel(1);
        setTagOpen(false);
        showAlert(res?.data?.message);
      } else {
        setTagSpinner(false);
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTagSpinner(false);
    }
  };

  const handleBook = async () => {
    if (!editBookingData?.job_id) return showAlert("Job id is required", "warning");
    const chWeight = getChargeableWeight(dimensionData);
    setBookSpinner(true);
    const weightFrom = Number(editBookingData?.weight_from);
    const weightTo = Number(editBookingData?.weight_to);
    const isInWeightRange =
      !isNaN(weightFrom) &&
      !isNaN(weightTo) &&
      editBookingData?.weight_from != null &&
      editBookingData?.weight_to != null &&
      Number(chWeight) >= weightFrom &&
      Number(chWeight) <= weightTo;
    try {
      let res;
      if (isInWeightRange) {
        res = await commonpostrequest(`booking/generate-booking/${editBookingData?.job_id}`, {
          counter: counter || 0,
          airwaybill_no: editBookingData?.airwaybilno,
          flag: "edit_booking",
        });
      } else {
        res = await commonpostrequest(`/raise_spot_enquiry`, {
          ...editBookingData,
          booking_status: 7, weight: chWeight, chargeable_weight: chWeight
        });
      }
      if (res?.status == 200) {
        handleCancel(1);
        if (!isInWeightRange) {
          showAlert("Shipment is out of weight range, send to Pricing for Approval", "warning");
        } else {
          showAlert(res?.data?.message);
        }
        setShowEditBooking(false);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      showAlert("something went wrong", "error");
    } finally {
      setBookSpinner(false);
      setCounter((pre: any) => pre + 1);
    }
  };

  const handleEditDetails = async () => {
    const chWeight = getChargeableWeight(dimensionData);
    setEditSpinner(true);
    try {
      const res = await commonpostrequest("booking/update-job", {
        ...(jobData as any),
        franchisee_id: editBookingData?.franchisee_id,
        job_id: editBookingData?.job_id,
        import_booking: 2,
        clearance_type: editBookingData?.clearence_type || "",
        inco_term: editBookingData?.incoterm || "",
        commodity: editBookingData?.commodity || "",
        chargeable_weight: chWeight || 0,
        shipment_dimensions: dimensionData,
        buy_charges: [],
        sell_charges: [],
      });
      if (res?.status == 200) {
        await handleBook();
        setEditData({});
      } else if (res?.response?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "warning");
      } else {
        showAlert(res?.data?.message || res?.response?.data?.message || res?.message, "error");
      }
    } catch (error: any) {
      showAlert(error?.message || error?.msg, "error");
    } finally {
      setEditSpinner(false);
    }
  }

  const ImportDescription = (
    <>
      <div className="box col-span-12   px-4 py-2  intro-x font-medium cursor-pointer text-sm flex flex-row justify-between gap-4 rounded-lg bg-white h-auto">
        <div>
          <div>
            <span className="mt-2 text-lg font-bold">ORIGIN </span>
          </div>

          <div className="flex gap-2 ">
            <div className="text-center p-1 border-2 h-auto  sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
              <img
                src={`https://flagsapi.com/${importData?.origin_country_code
                  ? importData?.origin_country_code
                  : "IN"
                  }/flat/32.png`}
                alt="origin-flag"
              />
              <span className="text-sm block sm:hidden">
                {" "}
                {importData?.org_zip}
              </span>
              <span className="text-sm">
                (
                {importData?.origin_country_code
                  ? importData?.origin_country_code
                  : "IN"}
                )
              </span>
            </div>
            <div className=" p-1 pt-2 h-14 min-w-28 border-2 rounded hidden sm:flex flex-col  justify-center">
              <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                {countryData?.find(
                  (item: any) =>
                    item?.country_code == importData?.origin_country_code,
                )?.country_name || "INDIA"}
              </h1>
              <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                ( {importData?.org_zip})
              </p>
            </div>
          </div>
        </div>

        <div className=" mt-11 flex ">
          <img
            src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
            className="w-5 h-5 opacity-25 hidden lg:block"
            alt="dot-icon"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
            className="w-5 h-5 opacity-50 hidden lg:block"
            alt="dot-icon"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
            className="w-5 h-5 opacity-75 hidden lg:block"
            alt="dot-icon"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
            className="w-5 h-5 hidden lg:block"
            alt="dot-icon"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
            className="w-5 h-5"
            alt="plane-icon"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
            className="w-5 h-5 hidden lg:block"
            alt="dot-icon"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
            className="w-5 h-5 opacity-75 hidden lg:block"
            alt="dot-icon"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
            className="w-5 h-5 opacity-50 hidden lg:block"
            alt="dot-icon"
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
            className="w-5 h-5 opacity-25 hidden lg:block"
            alt="dot-icon"
          />
        </div>

        {/* <div className="flex sm:hidden justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
                  className="w-6 h-6 md:hidden block"
                  alt="plane-icon"
                />
              </div> */}

        <div>
          <div>
            <span className="mt-2 text-lg font-bold">DESTINATION</span>
          </div>

          <div className="flex gap-2 ">
            <div className="text-center p-1 border-2 h-auto mx-6 sm:mx-0 sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
              <img
                src={`https://flagsapi.com/IN/flat/32.png`}
                alt="destination-flag"
              />
              <span className="text-sm block sm:hidden">
                {importData?.dest_zip == "0000"
                  ? importData?.dest_city
                  : importData?.dest_zip || "0000"}
              </span>
              <span className="text-sm">(IN)</span>
            </div>
            <div className=" p-1 pt-2 min-w-28 h-14 border-2 rounded hidden sm:flex flex-col  justify-center text-wrap">
              <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                INDIA
              </h1>
              <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                (
                {importData?.dest_zip == "0000"
                  ? importData?.dest_city
                  : importData?.dest_zip || "0000"}
                )
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="box col-span-12">
        <div className="space-y-4 px-2 py-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
            <div className=" col-span-3 md:col-span-3 lg:col-span-1">
              <div>
                <FormLabel className="text-base text-slate-500">
                  FRANCHISEE <span className="text-red-400">*</span>
                </FormLabel>
              </div>
              <FormInput
                value={
                  getparticulardata(
                    "franchisee",
                    importData?.franchisee_id,
                    allfdata,
                  )?.franchisee_name || ""
                }
                disabled
              />
            </div>
            <div className=" col-span-3 md:col-span-3 lg:col-span-1">
              <FormLabel
                htmlFor="origin-country"
                className="text-base text-slate-500"
              >
                SHIPMENT TYPE <span className="text-red-400">*</span>
              </FormLabel>
              <FormSelect
                id="default"
                value={importData?.shipment_type}
                disabled
              >
                {getShipment?.map(
                  (type) =>
                    type?.booking_shipment_type_id !== 2 &&
                    type?.is_active == 1 && (
                      <option
                        key={type?.booking_shipment_type_id}
                        value={type?.booking_shipment_type_id}
                      >
                        {type?.shipment_type}
                      </option>
                    ),
                )}
              </FormSelect>
            </div>
            <div className=" col-span-3 md:col-span-3 lg:col-span-1">
              {" "}
              <FormLabel
                htmlFor="origin-city"
                className="text-base text-slate-500"
              >
                QUOTED BY <span className="text-red-400">*</span>
              </FormLabel>
              <div className="flex items-center gap-2 w-[100%]">
                <FormInput
                  className="w-[100%]"
                  id="origin-city"
                  value={importData?.quoted_by}
                  disabled
                />
              </div>
            </div>
            <div className=" col-span-3 md:col-span-3 lg:col-span-1">
              {" "}
              <FormLabel
                htmlFor="origin-city"
                className="text-base text-slate-500"
              >
                COMMODITY <span className="text-red-400">*</span>
              </FormLabel>
              <CommonSearchableAll
                apiEndpoint={`admin/commodity-type`}
                placeholder={"Search Commodity Type"}
                selecteddata={selectedImportCommoditydata}
                setSelecteddata={setSelectedImportCommoditydata}
                fun1={() => {}}
                comingselectedname={"commodity"}
                comingselectedid={"commodity_id"}
                funtoempty={() => {}}
                key1={"key"}
                id={importData?.commodity}
                zIndex={20}
                isDisabled
              />
            </div>

            <div>
              {" "}
              <FormLabel
                htmlFor="origin-city"
                className="text-base text-slate-500"
              >
                SHIPMENT CURRENCY
                {/* Shipment Currency */}
              </FormLabel>
              <FormSelect value={importData?.currency_id || "24"} onChange={(e) => {
                setImportData((prev: any) => ({
                  ...prev,
                  currency_id: Number(e.target.value) || "",
                }));
              }}>
                <option value="">Select</option>
                {currencydata?.length >= 1
                  ? currencydata?.map((item: any) => (
                    <option value={item?.id}>{item?.currency}</option>
                  ))
                  : ""}
              </FormSelect>
            </div>
            <div className=" col-span-3 md:col-span-3 lg:col-span-1">
              <FormLabel
                htmlFor="incoterm"
                className="text-base text-slate-500"
              >
                INCOTERM <span className="text-red-400">*</span>
              </FormLabel>

              <FormSelect
                id="incoterm"
                className={`sm:mr-2`}
                value={importData?.incoterm}
                disabled
              >
                <option value="">Select Incoterm</option>
                {incotermType &&
                  incotermType?.map((ele, index) => (
                    <option key={ele?.id} value={ele?.id}>
                      {ele?.name}
                    </option>
                  ))}
              </FormSelect>
            </div>
            {(importData?.shipment_type == 4 ||
              importData?.shipment_type == 5) && (
                <>
                  <div className="col-span-3 md:col-span-3 lg:col-span-1">
                    <FormLabel
                      htmlFor="clearence-type"
                      className="text-base text-slate-500"
                    >
                      CLEARANCE TYPE <span className="text-red-400">*</span>
                    </FormLabel>

                    <FormSelect
                      className={`sm:mr-2`}
                      disabled
                      value={importData?.clearence_type}
                    >
                      <option value="">Select Clearance Type</option>
                      {clearanceType &&
                        clearanceType?.map((ele, index) => (
                          <option key={index} value={ele?.id}>
                            {ele?.name}
                          </option>
                        ))}
                    </FormSelect>
                  </div>

                  <div className="col-span-3 md:col-span-3 lg:col-span-1">
                    {" "}
                    <FormLabel className="text-base text-slate-500">
                      VENDOR NAME <span className="text-red-400">*</span>
                      {/* Shipment Currency */}
                    </FormLabel>
                    <FormSelect disabled value={importData?.courier_id}>
                      {/* <option value="">Select</option> */}
                      {products?.length >= 1
                        ? products?.map((item: any) => (
                          <option value={item?.product_id}>
                            {item?.product_name}
                          </option>
                        ))
                        : ""}
                    </FormSelect>
                  </div>

                  {importData?.import_booking == 2 ? (
                    <div className="col-span-3 md:col-span-3 lg:col-span-1">
                      {" "}
                      <FormLabel className="text-base text-slate-500">
                        IMPORT SERVICE TYPE{" "}
                        <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormSelect
                        disabled
                        value={importData?.import_service_type}
                      >
                        {/* <option value="">Select</option> */}
                        <option value="">Select</option>
                        <option value={1}>Economy</option>
                        <option value={2}>Express (IP)</option>
                      </FormSelect>
                    </div>
                  ) : null}
                </>
              )}
          </div>
        </div>
      </div>

      <div className="mb-4 col-span-12 overflow-x-auto">
        <FormLabel
          htmlFor="regular-form-1"
          className="text-base font-medium text-gray-900"
        >
          {" "}
          Shipment Dimension
        </FormLabel>

        <ShipmentDimensions
          dimensionData={dimensionData}
          setDimensionData={setDimensionData}
          setJobData={setJobData}
          jobdata={jobData}
          checkdisable={false}
          currencyData={currencydata}
          currencyId={importData?.currency_id}
          weightUnit={importData?.weight_unit}
        />
      </div>

      {importData?.booking_status == "1" ||
        importData?.booking_status == "8" ||
        importData?.booking_status == "9" ||
        importData?.booking_status == "10" ? (
        <div className="col-span-12 p-2">
          <FormLabel className="block font-semibold text-sm mb-1">
            Shipper Invoice
          </FormLabel>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center cursor-pointer rounded border border-gray-300 overflow-hidden w-fit">
              <span className="bg-mustard text-white text-sm font-medium px-4 py-1.5 select-none">
                File
              </span>
              <span className="px-3 py-1.5 text-sm text-gray-500 bg-white">
                {shipperInvoiceFile ? shipperInvoiceFile.name : "No file chosen"}
              </span>
              <input
                ref={shipperInvoiceInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (shipperInvoiceInputRef.current) shipperInvoiceInputRef.current.value = "";
                  if (file) handleShipperInvoiceUpload(file);
                }}
              />
            </label>
            {shipperInvoiceUploading && <Spinner size="sm" />}
            {shipperInvoiceUrl && !shipperInvoiceUploading && (
              <span className="text-green-600 text-xs font-medium">Uploaded</span>
            )}
            {shipperInvoiceFile && !shipperInvoiceUploading && (
              <button
                type="button"
                className="text-gray-400 hover:text-red-500"
                onClick={() => {
                  setShipperInvoiceFile(null);
                  setShipperInvoiceUrl("");
                  if (shipperInvoiceInputRef.current) shipperInvoiceInputRef.current.value = "";
                }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 col-span-12 p-2">
        <div className="flex gap-4 items-center">
          {" "}
          <h1 className="font-bold text-sm md:text-lg whitespace-nowrap">
            Sender Details
          </h1>
          <Tippy content="Add Sender Details" options={{ placement: "right" }}>
            <PlusCircle
              className="w-6 h-6 cursor-pointer text-mustard"
              onClick={() => {
                setSenderOpen(true);
              }}
            />
          </Tippy>
          {senderOpen && (
            <SenderDetails
              open={senderOpen}
              onClose={() => {
                setSenderOpen(false);
              }}
              isEdit={true}
              booking={jobData}
              setJobData={setJobData}
              enquiryData={{ ...importData, courier_name: products?.find((item: any) => item?.product_id == importData?.courier_id)?.product_name || "N.A." }}
              countryData={countryData || []}
            />
          )}
        </div>
        <div className="flex gap-4 items-center">
          <h1 className="font-bold text-sm md:text-lg whitespace-nowrap">
            Receiver Details
          </h1>
          <Tippy
            content="Add Receiver Details"
            options={{ placement: "right" }}
          >
            <PlusCircle
              className="w-6 h-6 cursor-pointer text-mustard"
              onClick={() => {
                setReceiverOpen(true);
              }}
            />
          </Tippy>
          {receiverOpen && (
            <ReceiverDetails
              open={receiverOpen}
              onClose={() => {
                setReceiverOpen(false);
              }}
              isEdit={true}
              countryData={countryData || []}
              booking={jobData}
              setJobData={setJobData}
              dimensionData={dimensionData || []}
              enquiryData={importData}
            />
          )}
        </div>
        <div>
          <p className="font-semibold ">
            {jobData?.shipper_details?.consigner_first_name}
          </p>
          <p className="font-semibold ">
            {jobData?.shipper_details?.consigner_address_1}
          </p>
          <p className="font-semibold ">
            {jobData?.shipper_details?.consigner_city}
          </p>
          <p className="font-semibold ">
            {" "}
            {jobData?.shipper_details?.consigner_pincode}
          </p>
        </div>
        <div>
          <p className="font-semibold ">
            {jobData?.consignee_details?.consignee_first_name}
          </p>
          <p className="font-semibold ">
            {jobData?.consignee_details?.consignee_address_1}
          </p>
          <p className="font-semibold ">
            {jobData?.consignee_details?.consignee_city}
          </p>
          <p className="font-semibold ">
            {" "}
            {jobData?.consignee_details?.consignee_pincode}
          </p>
        </div>
      </div>
    </>
  );

  const ImportFooter = (
    <>
      <Button
        className="text-white bg-gray-500 p-2"
        onClick={() => {
          setOpenImport(false);
          setCounter(0)
        }}
      >
        CLOSE
      </Button>
      {importData?.booking_status == "1" ||
        importData?.booking_status == "8" ||
        importData?.booking_status == "9" ||
        importData?.booking_status == "10" ||
        importData?.booking_status == "19" ? (
        <Button
          className="text-white bg-mustard p-2 ml-4"
          onClick={() => {
            if (!importData?.job_id)
              return showAlert("Job Id is required", "warning");
            if (!dimensionData || dimensionData?.length == 0)
              return showAlert("Please enter shipment dimensions", "warning");
            if (
              !jobData?.shipper_details ||
              Object.keys(jobData.shipper_details).length == 0
            )
              return showAlert("Please enter sender details", "warning");
            if (
              !jobData?.consignee_details ||
              Object.keys(jobData.consignee_details).length == 0
            )
              return showAlert("Please enter receiver details", "warning");
            setOpenImport(false);
            setEmailOpen(true);
          }}
        >
          SAVE DETAILS
        </Button>
      ) : (
        <>
          {/* {importData?.is_draft != 1 ? (
            <Button
              className="text-white bg-mustard p-2 ml-4"
              onClick={() => handleBooking(importData?.job_id, 1)}
              disabled={bookingLoading?.status}
            >
              SAVE DRAFT
              {bookingLoading?.status && bookingLoading?.forWhat == 1 && (
                <LoadingIcon
                  icon="puff"
                  color="white"
                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                />
              )}
            </Button>
          ) : null} */}
          <Button
            className="text-white bg-mustard p-2 ml-4"
            onClick={() => handleBooking(importData?.job_id, 0, 0)}
            disabled={bookingLoading?.status || selfSpinner}
          >
            FINAL BOOKING
            {bookingLoading?.status && bookingLoading?.forWhat == 0 && !selfSpinner && (
              <LoadingIcon
                icon="puff"
                color="white"
                className="w-5 h-5 ml-2 stroke-2.5 text-white"
              />
            )}
          </Button>
          {showBtn && (<Button
            className="text-white bg-mustard p-2 ml-4"
            onClick={() => { handleBooking(importData?.job_id, 0, 1), setSelfSpinner(true) }}
            disabled={bookingLoading?.status || selfSpinner}
          >
            GENERATE SKART LABEL
            {selfSpinner && (
              <LoadingIcon
                icon="puff"
                color="white"
                className="w-5 h-5 ml-2 stroke-2.5 text-white"
              />
            )}
          </Button>)}
        </>
      )}
    </>
  );

  const EditBookingDescription = (<div className="max-h-[75vh] overflow-y-auto">
    <div className="box col-span-12   px-4 py-2  intro-x font-medium cursor-pointer text-sm flex flex-row justify-between gap-4 rounded-lg bg-white h-auto">
      <div>
        <div>
          <span className="mt-2 text-lg font-bold">ORIGIN </span>
        </div>

        <div className="flex gap-2 ">
          <div className="text-center p-1 border-2 h-auto  sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
            <img
              src={`https://flagsapi.com/${editBookingData?.origin_country_code
                ? editBookingData?.origin_country_code
                : "IN"
                }/flat/32.png`}
              alt="origin-flag"
            />
            <span className="text-sm block sm:hidden">
              {" "}
              {editBookingData?.org_zip}
            </span>
            <span className="text-sm">
              (
              {editBookingData?.origin_country_code
                ? editBookingData?.origin_country_code
                : "IN"}
              )
            </span>
          </div>
          <div className=" p-1 pt-2 h-14 min-w-28 border-2 rounded hidden sm:flex flex-col  justify-center">
            <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
              {countryData?.find(
                (item: any) =>
                  item?.country_code == editBookingData?.origin_country_code,
              )?.country_name || "INDIA"}
            </h1>
            <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
              ( {editBookingData?.org_zip})
            </p>
          </div>
        </div>
      </div>

      <div className=" mt-11 flex ">
        <img
          src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
          className="w-5 h-5 opacity-25 hidden lg:block"
          alt="dot-icon"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
          className="w-5 h-5 opacity-50 hidden lg:block"
          alt="dot-icon"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
          className="w-5 h-5 opacity-75 hidden lg:block"
          alt="dot-icon"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
          className="w-5 h-5 hidden lg:block"
          alt="dot-icon"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
          className="w-5 h-5"
          alt="plane-icon"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
          className="w-5 h-5 hidden lg:block"
          alt="dot-icon"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
          className="w-5 h-5 opacity-75 hidden lg:block"
          alt="dot-icon"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
          className="w-5 h-5 opacity-50 hidden lg:block"
          alt="dot-icon"
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
          className="w-5 h-5 opacity-25 hidden lg:block"
          alt="dot-icon"
        />
      </div>

      {/* <div className="flex sm:hidden justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
                  className="w-6 h-6 md:hidden block"
                  alt="plane-icon"
                />
              </div> */}

      <div>
        <div>
          <span className="mt-2 text-lg font-bold">DESTINATION</span>
        </div>

        <div className="flex gap-2 ">
          <div className="text-center p-1 border-2 h-auto mx-6 sm:mx-0 sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
            <img
              src={`https://flagsapi.com/IN/flat/32.png`}
              alt="destination-flag"
            />
            <span className="text-sm block sm:hidden">
              {editBookingData?.dest_zip == "0000"
                ? editBookingData?.dest_city
                : editBookingData?.dest_zip || "0000"}
            </span>
            <span className="text-sm">(IN)</span>
          </div>
          <div className=" p-1 pt-2 min-w-28 h-14 border-2 rounded hidden sm:flex flex-col  justify-center text-wrap">
            <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
              INDIA
            </h1>
            <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
              (
              {editBookingData?.dest_zip == "0000"
                ? editBookingData?.dest_city
                : editBookingData?.dest_zip || "0000"}
              )
            </p>
          </div>
        </div>
      </div>
    </div>

    <div className="box col-span-12">
      <div className="space-y-4 px-2 py-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          <div className=" col-span-3 md:col-span-3 lg:col-span-1">
            <div>
              <FormLabel className="text-base text-slate-500">
                FRANCHISEE <span className="text-red-400">*</span>
              </FormLabel>
            </div>
            <FormInput
              value={
                getparticulardata(
                  "franchisee",
                  editBookingData?.franchisee_id,
                  allfdata,
                )?.franchisee_name || ""
              }
              disabled
            />
          </div>
          <div className=" col-span-3 md:col-span-3 lg:col-span-1">
            <FormLabel
              htmlFor="origin-country"
              className="text-base text-slate-500"
            >
              SHIPMENT TYPE <span className="text-red-400">*</span>
            </FormLabel>
            <FormSelect
              id="default"
              value={editBookingData?.shipment_type}
              disabled
            >
              {getShipment?.map(
                (type) =>
                  type?.booking_shipment_type_id !== 2 &&
                  type?.is_active == 1 && (
                    <option
                      key={type?.booking_shipment_type_id}
                      value={type?.booking_shipment_type_id}
                    >
                      {type?.shipment_type}
                    </option>
                  ),
              )}
            </FormSelect>
          </div>
          <div className=" col-span-3 md:col-span-3 lg:col-span-1">
            {" "}
            <FormLabel
              htmlFor="origin-city"
              className="text-base text-slate-500"
            >
              QUOTED BY <span className="text-red-400">*</span>
            </FormLabel>
            <div className="flex items-center gap-2 w-[100%]">
              <FormInput
                className="w-[100%]"
                id="origin-city"
                value={editBookingData?.quoted_by}
                disabled
              />
            </div>
          </div>
          <div className=" col-span-3 md:col-span-3 lg:col-span-1">
            {" "}
            <FormLabel
              htmlFor="origin-city"
              className="text-base text-slate-500"
            >
              COMMODITY <span className="text-red-400">*</span>
            </FormLabel>
            <CommonSearchableAll
              apiEndpoint={`admin/commodity-type`}
              placeholder={"Search Commodity Type"}
              selecteddata={selectedEditCommoditydata}
              setSelecteddata={setSelectedEditCommoditydata}
              fun1={() => {}}
              comingselectedname={"commodity"}
              comingselectedid={"commodity_id"}
              funtoempty={() => {}}
              key1={"key"}
              id={editBookingData?.commodity}
              zIndex={20}
              isDisabled
            />
          </div>

          <div>
            {" "}
            <FormLabel
              htmlFor="origin-city"
              className="text-base text-slate-500"
            >
              SHIPMENT CURRENCY
              {/* Shipment Currency */}
            </FormLabel>
            <FormSelect disabled value={editBookingData?.currency_id || "24"}>
              <option value="">Select</option>
              {currencydata?.length >= 1
                ? currencydata?.map((item: any) => (
                  <option value={item?.id}>{item?.currency}</option>
                ))
                : ""}
            </FormSelect>
          </div>
          <div className=" col-span-3 md:col-span-3 lg:col-span-1">
            <FormLabel
              htmlFor="incoterm"
              className="text-base text-slate-500"
            >
              INCOTERM <span className="text-red-400">*</span>
            </FormLabel>

            <FormSelect
              id="incoterm"
              className={`sm:mr-2`}
              value={editBookingData?.incoterm}
              onChange={(e) =>
                setEditBookingData((prev) => ({
                  ...prev,
                  incoterm: e.target.value,
                }))
              }
            >
              <option value="">Select Incoterm</option>
              {incotermType &&
                incotermType?.map((ele, index) => (
                  <option key={ele?.id} value={ele?.id}>
                    {ele?.name}
                  </option>
                ))}
            </FormSelect>
          </div>
          {(editBookingData?.shipment_type == 4 ||
            editBookingData?.shipment_type == 5) && (
              <>
                <div className="col-span-3 md:col-span-3 lg:col-span-1">
                  <FormLabel
                    htmlFor="clearence-type"
                    className="text-base text-slate-500"
                  >
                    CLEARANCE TYPE <span className="text-red-400">*</span>
                  </FormLabel>

                  <FormSelect
                    className={`sm:mr-2`}
                    value={editBookingData?.clearence_type}
                    onChange={(e) =>
                      setEditBookingData((prev) => ({
                        ...prev,
                        clearence_type: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select Clearance Type</option>
                    {clearanceType &&
                      clearanceType?.map((ele, index) => (
                        <option key={index} value={ele?.id}>
                          {ele?.name}
                        </option>
                      ))}
                  </FormSelect>
                </div>

                <div className="col-span-3 md:col-span-3 lg:col-span-1">
                  {" "}
                  <FormLabel className="text-base text-slate-500">
                    VENDOR NAME <span className="text-red-400">*</span>
                    {/* Shipment Currency */}
                  </FormLabel>
                  <FormSelect disabled value={editBookingData?.courier_id}>
                    {/* <option value="">Select</option> */}
                    {products?.length >= 1
                      ? products?.map((item: any) => (
                        <option value={item?.product_id}>
                          {item?.product_name}
                        </option>
                      ))
                      : ""}
                  </FormSelect>
                </div>

                {editBookingData?.import_booking == 2 ? (
                  <div className="col-span-3 md:col-span-3 lg:col-span-1">
                    {" "}
                    <FormLabel className="text-base text-slate-500">
                      IMPORT SERVICE TYPE{" "}
                      <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormSelect
                      value={editBookingData?.import_service_type}
                      onChange={(e) =>
                        setEditBookingData((prev) => ({
                          ...prev,
                          import_service_type: e.target.value,
                        }))
                      }
                    >
                      {/* <option value="">Select</option> */}
                      <option value="">Select</option>
                      <option value={1}>Economy</option>
                      <option value={2}>Express (IP)</option>
                    </FormSelect>
                  </div>
                ) : null}

                <div className="col-span-3 md:col-span-3 lg:col-span-1">
                  <FormLabel className="text-base text-slate-500">
                    CURRENCY <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormSelect
                    value={editBookingData?.currency_id || ""}
                    onChange={(e) =>
                      setEditBookingData((prev) => ({
                        ...prev,
                        currency_id: e.target.value,
                      }))
                    }
                  >
                    {currencydata?.length >= 1
                      ? currencydata?.map((item: any) => (
                        <option key={item?.id} value={item?.id}>
                          {item?.currency}
                        </option>
                      ))
                      : ""}
                  </FormSelect>
                </div>
              </>
            )}
        </div>
      </div>
    </div>

    <div className="mb-4 col-span-12 overflow-x-auto">
      <FormLabel
        htmlFor="regular-form-1"
        className="text-base font-medium text-gray-900"
      >
        {" "}
        Shipment Dimension
      </FormLabel>

      <ShipmentDimensions
        dimensionData={dimensionData}
        setDimensionData={setDimensionData}
        setJobData={setJobData}
        jobdata={jobData}
        checkdisable={false}
        currencyData={currencydata}
        currencyId={editBookingData?.currency_id}
        weightUnit={editBookingData?.weight_unit}
      />
    </div>

    {/* {editBookingData?.booking_status != "1" &&
      editBookingData?.booking_status != "8" &&
      editBookingData?.booking_status != "9" &&
      editBookingData?.booking_status != "19" && (
        <div className="col-span-12 p-2">
          <FormLabel className="block font-semibold text-sm mb-1">
            Shipper Invoice
          </FormLabel>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center cursor-pointer rounded border border-gray-300 overflow-hidden w-fit">
              <span className="bg-mustard text-white text-sm font-medium px-4 py-1.5 select-none">
                File
              </span>
              <span className="px-3 py-1.5 text-sm text-gray-500 bg-white">
                {shipperInvoiceFile ? shipperInvoiceFile.name : "No file chosen"}
              </span>
              <input
                ref={shipperInvoiceInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (shipperInvoiceInputRef.current) shipperInvoiceInputRef.current.value = "";
                  if (file) handleShipperInvoiceUpload(file);
                }}
              />
            </label>
            {shipperInvoiceUploading && <Spinner size="sm" />}
            {shipperInvoiceUrl && !shipperInvoiceUploading && (
              <span className="text-green-600 text-xs font-medium">Uploaded</span>
            )}
            {shipperInvoiceFile && !shipperInvoiceUploading && (
              <button
                type="button"
                className="text-gray-400 hover:text-red-500"
                onClick={() => {
                  setShipperInvoiceFile(null);
                  setShipperInvoiceUrl("");
                  if (shipperInvoiceInputRef.current) shipperInvoiceInputRef.current.value = "";
                }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )} */}

    <div className="grid grid-cols-2 col-span-12 p-2">
      <div className="flex gap-4 items-center">
        {" "}
        <h1 className="font-bold text-sm md:text-lg whitespace-nowrap">
          Sender Details
        </h1>
        <Tippy content="Add Sender Details" options={{ placement: "right" }}>
          <PlusCircle
            className="w-6 h-6 cursor-pointer text-mustard"
            onClick={() => {
              setSenderOpen(true);
            }}
          />
        </Tippy>
        {senderOpen && (
          <SenderDetails
            open={senderOpen}
            onClose={() => {
              setSenderOpen(false);
            }}
            isEdit={true}
            booking={jobData}
            setJobData={setJobData}
            enquiryData={{ ...editBookingData, courier_name: products?.find((item: any) => item?.product_id == editBookingData?.courier_id)?.product_name || "N.A." }}
            countryData={countryData || []}
          />
        )}
      </div>
      <div className="flex gap-4 items-center">
        <h1 className="font-bold text-sm md:text-lg whitespace-nowrap">
          Receiver Details
        </h1>
        <Tippy
          content="Add Receiver Details"
          options={{ placement: "right" }}
        >
          <PlusCircle
            className="w-6 h-6 cursor-pointer text-mustard"
            onClick={() => {
              setReceiverOpen(true);
            }}
          />
        </Tippy>
        {receiverOpen && (
          <ReceiverDetails
            open={receiverOpen}
            onClose={() => {
              setReceiverOpen(false);
            }}
            isEdit={true}
            countryData={countryData || []}
            booking={jobData}
            setJobData={setJobData}
            dimensionData={dimensionData || []}
            enquiryData={editBookingData}
          />
        )}
      </div>
      <div>
        <p className="font-semibold ">
          {jobData?.shipper_details?.consigner_first_name}
        </p>
        <p className="font-semibold ">
          {jobData?.shipper_details?.consigner_address_1}
        </p>
        <p className="font-semibold ">
          {jobData?.shipper_details?.consigner_city}
        </p>
        <p className="font-semibold ">
          {" "}
          {jobData?.shipper_details?.consigner_pincode}
        </p>
      </div>
      <div>
        <p className="font-semibold ">
          {jobData?.consignee_details?.consignee_first_name}
        </p>
        <p className="font-semibold ">
          {jobData?.consignee_details?.consignee_address_1}
        </p>
        <p className="font-semibold ">
          {jobData?.consignee_details?.consignee_city}
        </p>
        <p className="font-semibold ">
          {" "}
          {jobData?.consignee_details?.consignee_pincode}
        </p>
      </div>
    </div>


  </div>);
  const EditBookingFooter = (<>
    <div className="flex justify-end gap-2">
      <Button
        variant="mustard"
        disabled={editSpinner || bookSpinner}
        onClick={handleEditDetails}
        className="ml-2 bg-mustard p-2 whitespace-nowrap"
      >
        Edit Booking
        {(editSpinner || bookSpinner) && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </div>

  </>);

  const handleProformaInvoice = async () => {
    setProformaLoading(true);
    try {
      const res = await commongetrequest(`booking/proforma-invoice/${proformaData?.job_id}`);
      if (res?.status === 200 && res?.data?.url) {
        window.open(res.data.url, "_blank");
        setProformaOpen(false);
      } else {
        showAlert("Failed to generate Proforma Invoice", "error");
      }
    } catch (error) {
      showAlert("Failed to generate Proforma Invoice", "error");
    } finally {
      setProformaLoading(false);
    }
  };

  const proformaTitle = (
    <>
      <div className="flex justify-between w-full items-center">
        <p className="text-base font-medium">Confirmation</p>
        <XCircle
          className="w-5 h-5 cursor-pointer hover:text-red-500"
          onClick={() => setProformaOpen(false)}
        />
      </div>
    </>
  );

  const proformaDescription = (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-4">
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>ENQUIRY No: </b>
          {proformaData?.booking_no}
        </div>
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>FRANCHISEE : </b>
          {allfdata?.find((item: any) => item?.franchisee_id == proformaData?.franchisee_id)?.franchisee_name || proformaData?.franchisee_id}
        </div>
      </div>
      <p className="text-center text-sm">Are you sure you want to Generate Proforma Invoice ?</p>
    </>
  );

  const proformaFooter = (
    <>
      <Button
        className="text-white bg-green-500 p-2"
        onClick={handleProformaInvoice}
        disabled={proformaLoading}
      >
        Yes
        {proformaLoading && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
      <Button
        className="text-white bg-red-500 p-2 ml-2"
        onClick={() => setProformaOpen(false)}
        disabled={proformaLoading}
      >
        No
      </Button>
    </>
  );

  const emailDescription = (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-2">
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>ENQUIRY No: </b>
          {emailData?.booking_no}
        </div>
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>FRANCHISEE : </b>
          {
            allfdata?.find(
              (item: any) => item?.franchisee_id == emailData?.franchisee_id,
            )?.franchisee_name
          }
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        {/* TO EMAIL */}
        <div>
          <FormLabel>
            To Email <span className="text-red-500">*</span>
          </FormLabel>

          <FormInput
            type="email"
            placeholder="Enter To Email"
            value={emailData?.to_email}
            onChange={(e) => {
              const value = e.target.value;
              setEmailData({ ...emailData, to_email: value });
              setErrors({
                ...errors,
                to_email:
                  value && !validateEmail(value)
                    ? "Please enter a valid email address"
                    : "",
              });
            }}
          />

          {errors.to_email && (
            <p className="text-red-500 text-sm mt-1">{errors.to_email}</p>
          )}
        </div>

        {/* CC EMAIL */}
        <div>
          <FormLabel>CC Email</FormLabel>

          <div className="flex flex-wrap items-center gap-2 border border-[#efb847]/50 rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-[#efb847]">
            {/* Chips */}
            {emailData?.cc_email?.map((email, index) => (
              <span
                key={index}
                className="flex items-center gap-1 max-w-full bg-[#efb847]/10 text-[#efb847] px-3 py-1 rounded-full text-sm font-medium"
              >
                <span className="truncate max-w-[45vw] sm:max-w-[200px]">{email}</span>
                <button
                  type="button"
                  className="ml-1 text-red-400 hover:text-red-500 transition font-bold"
                  onClick={() => {
                    setEmailData({
                      ...emailData,
                      cc_email: emailData.cc_email.filter(
                        (_, i) => i !== index,
                      ),
                    });
                  }}
                >
                  ✕
                </button>
              </span>
            ))}

            {/* Input */}
            <input
              type="email"
              placeholder="Enter CC Email & Press Enter"
              value={ccInput}
              onChange={(e) => setCcInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const value = ccInput.trim();

                  if (!value) return;

                  if (!validateEmail(value)) {
                    setErrors({
                      ...errors,
                      cc_email: "Please enter a valid email address",
                    });
                    return;
                  }

                  if (emailData.cc_email.includes(value)) {
                    setCcInput("");
                    return;
                  }

                  setEmailData({
                    ...emailData,
                    cc_email: [...emailData.cc_email, value],
                  });

                  setCcInput("");
                  setErrors({ ...errors, cc_email: "" });
                }
              }}
              className="
    flex-1 min-w-0 sm:min-w-[180px] w-full sm:w-auto p-1
    bg-transparent
    outline-none
    focus:outline-none
    focus:ring-0
    focus:border-black
    placeholder:text-gray-400
  "
            />
          </div>

          {errors.cc_email && (
            <p className="text-red-500 text-sm mt-1">{errors.cc_email}</p>
          )}
        </div>
      </div>
    </>
  );
  const emailFooter = (
    <>
      <Button
        className="text-white bg-gray-500 p-2"
        onClick={() => {
          setEmailOpen(false);
          setShowBtn(false);
          setOpenImport(true);
        }}
      >
        CLOSE
      </Button>

      <Button
        className="text-white bg-mustard p-2 ml-4"
        onClick={handleSubmit}
        disabled={saveLoading}
      >
        SAVE DETAILS
        {saveLoading && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </>
  );

  const scanDescription = (
    <>
      {trackSpinner ? (
        <div className="p-3 flex items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-2">
            <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
              <b>ENQUIRY No: </b>
              {scanData?.booking_no}
            </div>
            <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
              <b>FRANCHISEE : </b>
              {
                allfdata?.find(
                  (item: any) => item?.franchisee_id == scanData?.franchisee_id,
                )?.franchisee_name
              }
            </div>
          </div>
          <div className="flex gap-4 justify-between items-end w-full">
            <div className="w-full">
              <FormLabel htmlFor="regular-form-1">
                Scan Events <span className="text-red-500">*</span>
              </FormLabel>
              <FormSelect
                className=""
                aria-label="Default select example"
                value={scanData?.id}
                onChange={(e) => {
                  setScanData((pre) => ({
                    ...pre,
                    id: "",
                    remarks: "",
                    status_code: "",
                    td_date: null,
                    td_weight: null,
                  }));
                  const eventId = e.target.value;
                  const item = scanEvents?.find(
                    (item: any) => item?.id == eventId,
                  );
                  if (item?.id == 6) {
                    setScanData((pre) => ({
                      ...pre,
                      id: item?.id,
                      remarks: "",
                      status_code: item?.status_code,
                    }));
                  } else {
                    setScanData((pre) => ({
                      ...pre,
                      id: item?.id,
                      remarks: item?.event,
                      status_code: item?.status_code,
                    }));
                  }
                }}
              >
                <option>Select Scan Event</option>
                {scanEvents
                  ?.filter((ele) => !statusCodes?.includes(ele?.status_code))
                  ?.map(
                    (item: any, index: number) =>
                      item?.is_active == 1 && (
                        <option key={index} value={item?.id}>
                          {item?.event}
                        </option>
                      ),
                  )}
              </FormSelect>
            </div>
            {scanData?.id == 6 && (
              <div className="w-full">
                <FormLabel htmlFor="regular-form-1">
                  Remarks <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="regular-form-1"
                  type="text"
                  placeholder="Enter Remarks"
                  value={scanData?.remarks}
                  onChange={(e) => {
                    setScanData((pre) => ({
                      ...pre,
                      remarks: e.target.value,
                    }));
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex gap-4 justify-between items-end my-4">
            {scanData?.id == 2 && (
              <>
                <div>
                  <FormLabel htmlFor="regular-form-1">
                    TD Weight <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    id="regular-form-1"
                    type="text"
                    placeholder="Enter TD Weight"
                    value={scanData?.td_weight}
                    onChange={(e) => {
                      setScanData((pre) => ({
                        ...pre,
                        td_weight: e.target.value.replace(/[^0-9.]/g, ""),
                      }));
                    }}
                  />
                </div>
                <div>
                  <FormLabel htmlFor="regular-form-1">
                    TD Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormInput
                    id="regular-form-1"
                    type="date"
                    placeholder="Enter TD Date"
                    value={scanData?.td_date}
                    onChange={(e) => {
                      setScanData((pre) => ({
                        ...pre,
                        td_date: e.target.value,
                      }));
                    }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="overflow-y-auto max-h-48">
            {trackerData?.length >= 1 ? (
              trackerData?.map((item: any, index: number) => (
                <div className=" bg-white w-full " key={index}>
                  <div className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <CircleCheckIcon className="text-green-500 h-5 w-5" />
                      {index !== trackerData?.length - 1 && (
                        <div className="w-0.5 h-16 bg-green-500" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
                        {item?.status ? item?.status : "N.A"}
                      </span>
                      <p className="text-xs text-gray-500">
                        {" "}
                        {item?.date ? convertUTCtoIST(item?.date) : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center py-16 px-10">
                <h1 className="text-center text-primary">
                  OOps.. No data found!..
                </h1>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
  const scanFooter = (
    <div className="flex justify-end ">
      <Button
        className="px-4 py-1 rounded-lg bg-mustard text-white  ml-2"
        onClick={() => {
          setScanSpinner(true);
          handleUpdateScanEvents();
        }}
        disabled={scanSpinner}
      >
        Submit
        {scanSpinner && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </div>
  );
  const tagDescription = (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-2">
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>ENQUIRY No: </b>
          {tagData?.booking_no}
        </div>
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>FRANCHISEE : </b>
          {
            allfdata?.find(
              (item: any) => item?.franchisee_id == tagData?.franchisee_id,
            )?.franchisee_name
          }
        </div>
      </div>
      <div className=" flex gap-4 flex-col">
        <div>
          <FormLabel htmlFor="regular-form-1">
            House Number <span className="text-red-500">*</span>
          </FormLabel>
          <FormInput
            id="regular-form-1"
            type="text"
            placeholder="Enter House Number"
            value={tagData?.hawb}
            disabled={mawbPresent}
            onChange={(e) => {
              setTagData({ ...tagData, hawb: e.target.value });
            }}
          />
        </div>
        <div>
          <FormLabel htmlFor="regular-form-1">Master Number</FormLabel>
          <FormInput
            id="regular-form-1"
            type="text"
            placeholder="Enter Master Number"
            value={tagData?.mawb}
            maxLength={11}
            disabled={mawbPresent}
            onChange={(e) => {
              setTagData({
                ...tagData,
                mawb: e.target.value.replace(/[^0-9.]/g, ""),
              });
            }}
          />
        </div>
      </div>
    </>
  );
  const tagFooter = (
    <div className="flex justify-end ">
      <Button
        className="px-4 py-1 rounded-lg bg-mustard text-white  ml-2"
        onClick={handleTagHouseMaster}
        disabled={tagSpinner}
      >
        Submit
        {tagSpinner && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </div>
  );

  const getsinglefdata = async (id: any) => {
    try {
      const data = await commongetrequest(
        `admin/franchisee-settings?franchisee_id=${id}`,
      );
      if (data?.status == 200) {
        setSingleFranchiseedata(data?.data?.data[0]);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const handleEdit = async (data?: any, value?: any) => {
    await getsinglefdata(data?.franchisee_id);
    if (value == "credit") {
      funcPdcform(data?.booking_no);
    }
    const selectedCountry = countryData.find(
      (item) =>
        item.country_id ==
        (value == "job" ? data?.destination_country : data?.dest_country_id),
    );
    let weight: any = 0;
    if (data?.shipment_dimensions && data?.shipment_dimensions?.length >= 1) {
      weight = await getchweight(data?.shipment_dimensions, data?.courier_id);
    } else {
      weight = Number(data?.weight) || 0;
    }

    const booking = {
      ...data,
      franchisee_id: data?.franchisee_id,
      credit_days:
        getrelateddata("franchisee", allfdata, data?.franchisee_id)
          ?.credit_days || "",
      franchisee_name:
        getrelateddata("franchisee", allfdata, data?.franchisee_id)
          ?.franchisee_name || "",
      hub_id:
        data?.hub_id ||
        getrelateddata("franchisee", allfdata, data?.franchisee_id)?.hub ||
        "",

      booking_no: data?.booking_no || "",
      branch_id:
        value == "job"
          ? getrelateddata("franchisee", allfdata, data?.franchisee_id)
            ?.branch || ""
          : data?.branch_id || "",
      booking_id: data?.id || "",
      origin_pincode: data?.org_zip || "0000",
      origin_city: data?.org_city || "",
      origin_state_code: data?.org_state_code || "",
      origin_country_code: data?.origin_country_code || "IN",
      destination_country: selectedCountry?.country_name || "",
      destination_country_code: selectedCountry?.country_code || "",
      destination_country_id:
        value == "job"
          ? data?.destination_country
          : data?.dest_country_id || "",
      destination_pincode:
        value == "job"
          ? selectedCountry?.pincode_avail == 0
            ? "0000"
            : ""
          : data?.dest_zip || "",
      state: data?.dest_state_code || "",
      city: data?.dest_city || "",
      city_available: selectedCountry?.city_avail == 1 ? 1 : 0,
      pincode_available: selectedCountry?.pincode_avail == 1 ? 1 : 0,
      // destination_pincode: selectedCountry?.pincode_avail == 0 ? "0000" : "",
      startPoint: "enquiry",
      shipment_type: value && value == "job" ? 5 : data?.shipment_type,
      weight: weight,
      weight_unit: data?.weight_unit || "",
      quoted_by: data?.quoted_by || "",
      price_type: data?.price_type || "",
      spot_price: data?.spot_price || "",
      cargo_type: data?.cargo_type || "",
      clearence_type: data?.clearence_type || "",
      courier_id: data?.courier_id || "",
      courier_code: data?.courier_code || "",
      courier_name: data?.courier_name || "",
      courier_vendor_code: data?.courier_vendor_code || "",
      forwhat: value || "",
      remarks: data?.franchisee_remarks || "",
      ...(data?.shipment_type == 8
        ? {
          fair_id: data?.fair_data?.fair_id,
          fair_venue: data?.fair_data?.fair_venue,
          fair_start_date: data?.fair_data?.fair_start_date,
          fair_end_date: data?.fair_data?.fair_end_date,
          mode: data?.fair_data?.mode || "",
          mode_value: data?.fair_data?.mode_value || "",
          // fair_date: spotData?.fair_date,
        }
        : {}),
      ...(data?.import_booking == 2
        ? {
          import_booking: data?.import_booking,
          import_booking_type: data?.import_booking_type,
          import_service_type: data?.import_service_type,
        }
        : {}),
    };
    if (data?.shipment_dimensions && data?.shipment_dimensions?.length >= 1) {
      booking.shipment_dimensions = data?.shipment_dimensions;
    }

    if (value == "job") {
      booking.job_id = data?.job_id;

      navigate("/backoffice/sales_operations/spot_price_enquiry", {
        state: { booking },
      });
    } else {
      setEditData(booking);

      setEnquiryModal(true);
    }
  };

  return (
    <>
      {/* <h2 className=" text-lg font-medium my-5">IS DASHBOARD</h2> */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
        <div className="isBox  isBox2 flex  bg-white rounded-md p-3 justify-between shadow-blue-900 w-full ">
          <aside>
            <h2 className="text-sm">Initiated Jobs</h2>
            <p className="text-lg">{Number(topdata?.intjobs) || 0} </p>
          </aside>
          <figure className="pl-4">
            {" "}
            <img src={imgg1} className="max-w-auto" />
          </figure>
        </div>

        <div className="isBox isBox2 flex  bg-white rounded-md p-3 justify-between shadow-blue-900 w-full">
          <aside>
            <h2 className="text-sm">Request for Credit Balance</h2>
            <span className="text-lg">
              {Number(topdata?.credit_pending) || 0}{" "}
            </span>
          </aside>
          <figure className="pl-2">
            <img src={imgg2} className="max-w-max" />
          </figure>
        </div>

        <div className="isBox isBoxlast flex col-span-2 bg-white rounded-md justify-between shadow-blue-900 ">
          <div className="lg:flex md:flex  sm:block  dashboxxlast w-full">
            <div className="boxSpotLeft p-4  text-center sm:block w-full lg:w-24 md:w-24 mb-3 lg:mb-03 ms:mb-0  sm:mb-0 ">
              <i className="md:inline-block  hidden">
                <img src={imgg3} />
              </i>
              <h5 className="text-xl lg:text-sm  md:text-sm  sm:text-sm">
                Spot Enquires
              </h5>
            </div>

            <div className="boxSpotRightBox flex p-2 ">
              <ul className="flex flex-wrap lg:grid md:grid sm:grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3">
                <li className="flex text-sm w-1/2 lg:w-auto md:w-auto sm:w-auto mb-2 lg:mb-0 md:mb-0  sm:mb-0">
                  <FolderOpen className="w-6 p-1  text-green-500 bg-green-100 rounded-3xl" />
                  <p className="pl-2 text-sm ">
                    Open <b className="block">{Number(topdata?.open) || 0}</b>
                  </p>
                </li>

                <li className="flex w-1/2 mb-2 lg:w-auto md:w-auto sm:w-auto lg:mb-0 md:mb-0  sm:mb-0">
                  <ShieldAlert className="w-6 p-1  text-red-500 bg-red-100 rounded-3xl" />
                  <p className="pl-2">
                    Expired{" "}
                    <b className="block">{Number(topdata?.expired) || 0}</b>
                  </p>
                </li>

                <li className=" flex redColor w-1/2 lg:w-auto md:w-auto sm:w-auto mb-2 lg:mb-0 md:mb-0  sm:mb-0">
                  <ThumbsDown className="w-6 p-1  text-red-500 bg-red-100 rounded-3xl" />
                  <p className="pl-2">
                    Rejected{" "}
                    <b className="block">{Number(topdata?.rejected) || 0}</b>
                  </p>
                </li>

                <li className="flex yellowColor w-1/2 lg:w-auto md:w-auto sm:w-auto mb-2 lg:mb-0 md:mb-0  sm:mb-0">
                  <UserPlus className="w-6 p-1  text-yellow-500 bg-yellow-100 rounded-3xl" />
                  <p className="pl-2">
                    Requoted
                    <b className="block">{Number(topdata?.requoted) || 0}</b>
                  </p>
                </li>

                <li className="redColor flex w-1/2 lg:w-auto md:w-auto sm:w-auto mb-2 lg:mb-0 md:mb-0  sm:mb-0">
                  <Clock8 className="w-6 p-1  text-blue-500 bg-blue-100 rounded-3xl" />
                  <p className="pl-2">
                    Approval Pending{" "}
                    <b className="block">
                      {Number(topdata?.approval_pending) || 0}
                    </b>
                  </p>
                </li>

                <li className=" flex w-1/2 lg:w-auto md:w-auto sm:w-auto mb-2 lg:mb-0 md:mb-0  sm:mb-0">
                  <Laptop className="w-6 p-1  text-green-500 bg-green-100 rounded-3xl" />
                  <p className="pl-2">
                    Insufficient Balance{" "}
                    <b className="block">
                      {Number(topdata?.insufficient) || 0}
                    </b>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:flex items-center space-x-4 bg-white p-2 shadow-lg">
        {/* Dropdown Section */}
        <div
          className={`relative w-64 ${selectedOptions?.length >= 1 ? "mt-9" : ""
            }`}
          ref={dropdownRef}
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-gray-200 p-2 rounded-md"
          >
            Search By
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-full bg-white border rounded-md shadow-md z-30">
              {options.map((option) => (
                <div key={option.id} className="flex items-center p-2">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    // checked={(e: any) => {
                    //   selectedOptions.includes(option.id);

                    // }}
                    onChange={(e: any) => {
                      handleCheckboxChange(option.id);
                      if (!e.target.checked && option.id == "Franchisee") {
                        const newdata = { ...inputs };
                        delete newdata["franchisee_id"];
                        setInputs(newdata);
                        setSelectedfranchisedata(intfranchiseedata);
                      } else if (
                        !e.target.checked &&
                        option.id == "Destination"
                      ) {
                        const newdata = { ...inputs };
                        delete newdata["dest_country_id"];
                        setInputs(newdata);
                        setSelecteddata(intselecteddata);
                      } else if (
                        !e.target.checked &&
                        option.id == "Chargeable Weight"
                      ) {
                        const newdata = { ...inputs };
                        delete newdata["weight"];
                        setInputs(newdata);
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={option.id}>{option.label}</label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Fields Section (Right by Right) */}
        <div
          className={`min-[548px]:grid grid-cols-${selectedOptions?.length} gap-2  md:mt-2 sm:mt-2`}
        >
          {selectedOptions.map((optionId) => (
            <div key={optionId} className="flex flex-col">
              <FormLabel>{optionId}:</FormLabel>
              {optionId == "Franchisee" ? (
                <CommonSearchableAll
                  apiEndpoint={`admin/franchisee-settings?sales_id=${userdata?.mapped_id}`}
                  placeholder={"Search For  Franchisee"}
                  selecteddata={selectedfranchisedata}
                  setSelecteddata={setSelectedfranchisedata}
                  fun1={fun1}
                  comingselectedname={"franchisee_name"}
                  comingselectedid={"franchisee_id"}
                  funtoempty={fun2}
                  questionmark={true}
                  zIndex={20}
                  key1={"key"}
                // border={error?.franchisee ? true : false}
                />
              ) : optionId == "Destination" ? (
                <CommonSearchableAll
                  apiEndpoint={"admin/country"}
                  placeholder={"Search For Country"}
                  selecteddata={selecteddata}
                  setSelecteddata={setSelecteddata}
                  fun1={fun3}
                  key1={"country"}
                  comingselectedname={"country_name"}
                  comingselectedid={"country_id"}
                  funtoempty={fun3toempty}
                  zIndex={20}
                />
              ) : (
                <FormInput
                  type="number"
                  placeholder="Chargeable Weight"
                  value={inputs["weight"] || ""}
                  onChange={(e) =>
                    setInputs((pre: any) => ({
                      ...pre,
                      weight: e.target.value,
                    }))
                  }
                />
              )}
            </div>
          ))}
        </div>

        {/* Search Button */}
        {selectedOptions.length > 0 && (
          <div className="flex justify-between">
            <Button
              onClick={handleSearch}
              className="bg-mustard text-white px-4 py-2 rounded-md mt-9 mr-2"
            >
              <Search className="" /> Search
            </Button>
            <Button
              onClick={() => handlereset()}
              disabled={checkisEmpty(inputs) ? true : false}
              className="bg-red-400 text-white px-4 py-2 rounded-md mt-9"
            >
              <RefreshCcw className="mr-2" /> Reset
            </Button>
          </div>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-2  md:grid-cols-2   sm:grid-cols-2  gap-3 mt-4">
        <div className="lg:flex-none lg:flex-wrap grid-flow-col grid-rows-2">
          <div className="w-full mb-5 firstTable">
            <div className="">
              <div className="NewtableBox  bg-white rounded-md justify-between shadow-blue-900  ">
                <div className="tbaleTittle p-2 bg-gray-50 flex justify-between items-center ">
                  <h2 className="text-sm font-medium">
                    Pending Spot Enquiries
                  </h2>

                  <div className="tableSearch relative w-200">
                    <FormInput
                      id="vertical-form-1"
                      type="text"
                      placeholder="Search By Enquiry Id "
                      onChange={(e: any) => {
                        handlealldatatoget("page1", 1);
                        setDatatoget((pre: any) => ({
                          ...pre,
                          search1: e.target.value,
                        }));
                      }}
                    />

                    <button
                      onClick={() => {
                        if (searchvalue) {
                          getspotenqdata(1, [0, 16]);
                        }
                      }}
                      className="searchListTable absolute top-2 right-3 text-stone-300"
                    >
                      {" "}
                      <Search />
                    </button>
                  </div>
                </div>

                <div
                  className={`tablelist p-3 ${isActive ? "showtable" : "hideTable"
                    }`}
                >
                  <div
                    className={`overflow-x-auto  overflow-y-hidden ${"h-[60vh]"}`}
                  >
                    <div className="table-responsive ">
                      {datatoget?.spotdata1?.length >= 1 &&
                        !datatoget?.loading1 ? (
                        <Table
                          sm
                          className="table table-text-small mb-0 border whitespace-nowrap "
                        >
                          <Table.Thead className="thead-primary table-sorting bg-mustard">
                            <Table.Tr className="text-center text-white">
                              <Table.Th className="whitespace-nowrap border text-right">
                                SR.NO.
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-center">
                                ACTIONS
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                STATUS{" "}
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                CUSTOMER NAME
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ENQUIRY NO
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ENQUIRY DATE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ORIGIN
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                DESTINATION
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                WEIGHT
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                VENDOR
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                SHIPMENT TYPE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                QUOTED BY
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-right">
                                QUOTED PRICE (₹)
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                RATE VALID TILL
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                AIRWAYBILL NO.
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {datatoget?.spotdata1?.map(
                              (data: any, index: number) => (
                                <Table.Tr
                                  key={index}
                                  // ${
                                  //   data?.booking_status == 0
                                  //     ? "bg-yellow-200"
                                  //     : data?.booking_status == 1
                                  //     ? "bg-green-200"
                                  //     : data?.booking_status == 7
                                  //     ? "bg-blue-200"
                                  //     : "bg-orange-200"
                                  // }
                                  className={`text-left intro-x capitalize
                                
                                  
                                  `}
                                >
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {(datatoget?.page1 - 1) * 5 + (index + 1)}
                                  </Table.Td>
                                  <Table.Td>
                                    <div className="flex justify-center items-center">
                                      <Button
                                        className="p-1 bg-mustard text-white"
                                        onClick={() => {
                                          handleEdit(data, "enq");
                                        }}
                                      >
                                        Action
                                      </Button>
                                      {/* <Menu className="Ndropdown">
                                        <Menu.Button
                                          as={Button}
                                          variant="primary"
                                          className="bg-inherit text-blue-600 p-1 border-blue-600"
                                        >
                                          <UserCog className="size-[19px]" />{" "}
                                          <ChevronDown className="size-[15px]" />
                                        </Menu.Button>
                                        <Menu.Items
                                          className="w-48 bg-white "
                                          placement="bottom"
                                          // placement={`${index>3?"top":"bottom"}`}
                                        >
                                          <Menu.Item
                                            onClick={() => {
                                              handleEdit(data);
                                            }}
                                          >
                                            {" "}
                                            <Eye
                                              className="w-[24px] pr-2"
                                              onClick={() => {
                                                handleEdit(data);
                                              }}
                                            />{" "}
                                            View/Edit
                                          </Menu.Item>
                                          <Menu.Item>
                                            {" "}
                                            <Eye className="w-[24px] pr-2" />{" "}
                                           Send To Pricing
                                          </Menu.Item>
                                          <Menu.Item>
                                            {" "}
                                            <ClipboardList className="w-[24px] pr-2" />{" "}
                                          Ready To Process
                                          </Menu.Item>
                                        </Menu.Items>
                                      </Menu> */}
                                    </div>
                                  </Table.Td>
                                  <Table.Td>
                                    <div className="flex justify-left items-left">
                                      <span
                                        className={bookingStatusColorMap[Number(data?.booking_status)] || ""}
                                      >
                                        {bookingStatuses.find(
                                          (s) => s.status_code == data?.booking_status
                                        )?.status_name || ""}
                                      </span>
                                    </div>
                                  </Table.Td>
                                  <Table.Td>
                                    {getrelateddata(
                                      "franchisee",
                                      franhiseedata,
                                      data?.franchisee_id,
                                    )?.franchisee_name || ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.booking_no || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {formatDate(data?.created_date) || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.org_city || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.org_country_id == "97" &&
                                      data?.dest_country_id == "97"
                                      ? data?.dest_city
                                      : countryData?.find(
                                        (item: any) =>
                                          item.country_id ==
                                          data?.dest_country_id,
                                      )?.country_name ||
                                      data?.dest_city ||
                                      "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {Number(data?.weight) || "-"}{" "}
                                    {data?.weight_unit
                                      ? `(${data.weight_unit})`
                                      : ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {productTypes?.find(
                                      (item) =>
                                        item.product_id == data?.courier_id,
                                    )?.product_name || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {shipmentTypedata?.find(
                                      (item2: any) =>
                                        item2?.booking_shipment_type_id ==
                                        data?.shipment_type,
                                    )?.shipment_type || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.quoted_by || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap lowercase text-right">
                                    {indianFormat(data?.spot_price) || "-"}{" "}
                                    {data?.price_type == "1"
                                      ? "(a)"
                                      : data?.price_type == "2"
                                        ? "(k)"
                                        : ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {formatDate(data?.valid_till) || "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.airwaybilno || "N.A."}
                                  </Table.Td>
                                  {/* <Table.Td className="px-8 flex justify-center">
                                  {data?.valid_till &&
                                  curr > new Date(data?.valid_till) ? (
                                    <p className="text-base  text-gray-500 whitespace-nowrap">
                                      Rate Expired
                                    </p>
                                  ) : data?.booking_status == 1 ||
                                    data?.booking_status == 3 ||
                                    data?.booking_status == 6 ? (
                                    <Button
                                      rounded
                                      className="w-24 text-base  text-white bg-green-500"
                                      onClick={() => {
                                        setSpotId(data?.id);
                                        setOpen(true);
                                      }}
                                    >
                                      APPROVE
                                    </Button>
                                  ) : data?.booking_status == 2 ? (
                                    <p className="text-base   text-red-500">
                                      REJECTED
                                    </p>
                                  ) : data?.booking_status == 5 ? (
                                    <p className=" text-green-500 text-base ">
                                      BOOKED
                                    </p>
                                  ) : data?. ? (
                                    <Button
                                      rounded
                                      size="sm"
                                      className="w-20  text-base text-white bg-green-500"
                                      onClick={() => handleBooking(data)}
                                    >
                                      BOOK
                                    </Button>
                                  ) : data?.booking_status == 0 ? (
                                    <Edit
                                      className="cursor-pointer text-mustard stroke-2.5"
                                      onClick={() => handleEdit(data)}
                                    />
                                  ) : (
                                    "N.A."
                                  )}
                                </Table.Td> */}
                                </Table.Tr>
                              ),
                            )}
                          </Table.Tbody>
                        </Table>
                      ) : datatoget?.loading1 ? (
                        <IsLoading w={"w-[50vw]"} h={"h-[40vh]"} />
                      ) : (
                        <Nodatafound w={"w-[50vw]"} h={"h-[50vh]"} />
                      )}
                    </div>
                    {datatoget?.spotdata1?.length > 0 &&
                      datatoget?.totalpages1 > 1 && (
                        <CommonPagination
                          totalpages={datatoget?.totalpages1}
                          onPageChange={handlePagechange}
                          page={datatoget?.page1}
                          value={1}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-full mb-5">
            <div className=" tableMain ">
              <div className="NewtableBox  bg-white rounded-md justify-between shadow-blue-900  ">
                <div className="tbaleTittle p-2 bg-gray-50 flex justify-between items-center ">
                  <h2 className="text-sm font-medium">
                    Credit Balance Requests
                  </h2>
                  <div className="tableSearch relative w-200">
                    <FormInput
                      id="vertical-form-1"
                      type="text"
                      placeholder="Search By Enquiry No "
                      onChange={(e: any) => {
                        setDatatoget((pre: any) => ({ ...pre, page3: 1 }));
                        setDatatoget((pre: any) => ({
                          ...pre,
                          search3: e.target.value,
                        }));
                      }}
                    />

                    <button
                      onClick={() => {
                        if (datatoget.search3) {
                          getspotenqdata(3, [8]);
                        }
                      }}
                      className="searchListTable absolute top-2 right-3 text-stone-300"
                    >
                      {" "}
                      <Search />
                    </button>
                  </div>
                </div>

                <div
                  className={`tablelist p-3 ${
                    isActive ? "showtable" : "hideTable"
                  }`}
                >
                  <div className={`overflow-x-auto  ${"h-[56vh]"}`}>
                    <div className="table-responsive ">
                      {datatoget?.spotdata3?.length >= 1 &&
                      !datatoget?.loading3 ? (
                        <Table
                          sm
                          className="table table-text-small mb-0 border  "
                        >
                          <Table.Thead className="thead-primary table-sorting bg-mustard">
                            <Table.Tr className="text-center text-white">
                              <Table.Th className="whitespace-nowrap border text-right">
                                SR.NO.
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-center">
                                ACTIONS
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                CUSTOMER NAME
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ENQUIRY ID
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ENQUIRY DATE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ORIGIN
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                DESTINATION
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                WEIGHT
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                VENDOR
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                SHIPMENT TYPE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                QUOTED BY
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-right">
                                QUOTED PRICE (₹)
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                RATE VALID TILL
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                AIRWAYBILL NO.
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {datatoget?.spotdata3?.map(
                              (data: any, index: number) => (
                                <Table.Tr
                                  key={index}
                                  className={`text-left intro-x capitalize `}
                                >
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {(datatoget?.page3 - 1) * 5 + (index + 1)}
                                  </Table.Td>
                                  <Table.Td>
                                    <div className="flex justify-center items-center">
                                      <Menu className="Ndropdown">
                                        <Menu.Button
                                          as={Button}
                                          variant="primary"
                                          className="bg-inherit text-blue-600 p-1 border-blue-600"
                                        >
                                          <UserCog className="size-[19px]" />{" "}
                                          <ChevronDown className="size-[15px]" />
                                        </Menu.Button>
                                        <Menu.Items
                                          className="w-48 bg-white "
                                          placement="bottom"
                                          // placement={`${index>3?"top":"bottom"}`}
                                        >
                                          <Menu.Item
                                            onClick={() => {
                                              handleEdit(data);
                                            }}
                                          >
                                            {" "}
                                            <Eye
                                              className="w-[24px] pr-2"
                                              onClick={() => {
                                                handleEdit(data);
                                              }}
                                            />{" "}
                                            View/Edit
                                          </Menu.Item>
                                          <Menu.Item>
                                            {" "}
                                            <Eye className="w-[24px] pr-2" />{" "}
                                            VIEW SOB
                                          </Menu.Item>
                                          <Menu.Item>
                                            {" "}
                                            <ClipboardList className="w-[24px] pr-2" />{" "}
                                            STATUS REPORT{" "}
                                          </Menu.Item>
                                        </Menu.Items>
                                      </Menu>
                                    </div>
                                  </Table.Td>
                                  <Table.Td>
                                    {getrelateddata(
                                      "franchisee",
                                      franhiseedata,
                                      data?.franchisee_id
                                    )?.franchisee_name || ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.booking_no || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {formatDate(data?.created_date) || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.org_city || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.org_country_id == "97" &&
                                    data?.dest_country_id == "97"
                                      ? data?.dest_city
                                      : countryData?.find(
                                          (item: any) =>
                                            item.country_id ==
                                            data?.dest_country_id
                                        )?.country_name ||
                                        data?.dest_city ||
                                        "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {Number(data?.weight) || "-"}{" "}
                                    {data?.weight_unit
                                      ? `(${data.weight_unit})`
                                      : ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {productTypes?.find(
                                      (item) =>
                                        item.product_id == data?.courier_id
                                    )?.product_name || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.shipment_type == 1
                                      ? "Courier Non-Document"
                                      : data?.shipment_type == 2
                                      ? "Courier Document"
                                      : data?.shipment_type == 4
                                      ? "Courier Commercial"
                                      : data?.shipment_type == 5
                                      ? "Cargo Commercial"
                                      : "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.quoted_by || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap lowercase text-right">
                                    {indianFormat(data?.spot_price) || "-"}{" "}
                                    {data?.price_type == "1"
                                      ? "(a)"
                                      : data?.price_type == "2"
                                      ? "(k)"
                                      : ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {formatDate(data?.valid_till) || "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.airwaybilno || "N.A."}
                                  </Table.Td>
                                </Table.Tr>
                              )
                            )}
                          </Table.Tbody>
                        </Table>
                      ) : datatoget?.loading3 ? (
                        <IsLoading w={"w-[50vw]"} h={"h-[40vh]"} />
                      ) : (
                        <Nodatafound w={"w-[50vw]"} h={"h-[50vh]"} />
                      )}
                    </div>
                    {datatoget?.spotdata3?.length > 0 &&
                      datatoget?.totalpages3 > 1 && (
                        <CommonPagination
                          totalpages={datatoget?.totalpages3}
                          onPageChange={handlePagechange}
                          page={datatoget?.page3}
                          value={3}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <div className="w-full mb-5">
            <div className=" tableMain ">
              <div className="NewtableBox  bg-white rounded-md justify-between shadow-blue-900  ">
                <div className="tbaleTittle p-2 bg-gray-50 flex justify-between items-center ">
                  <h2 className="text-sm font-medium">
                    Approved/Pending/Rejected
                  </h2>

                  <div className="tableSearch relative w-200">
                    <FormInput
                      id="vertical-form-1"
                      type="text"
                      placeholder="Search By Enquiry No. "
                      onChange={(e: any) => {
                        setDatatoget((pre: any) => ({ ...pre, page3: 1 }));
                        setDatatoget((pre: any) => ({
                          ...pre,
                          search3: e.target.value,
                        }));
                      }}
                    />

                    <button
                      onClick={() => {
                        if (datatoget.search3) {
                          getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
                        }
                      }}
                      className="searchListTable absolute top-2 right-3 text-stone-300"
                    >
                      {" "}
                      <Search />
                    </button>
                  </div>
                </div>

                <div
                  className={`tablelist p-3 ${isActive ? "showtable" : "hideTable"
                    }`}
                >
                  <div
                    className={`overflow-x-auto overflow-y-hidden  ${"h-[60vh]"}`}
                  >
                    <div className="table-responsive ">
                      {datatoget?.spotdata3?.length >= 1 &&
                        !datatoget?.loading3 ? (
                        <Table
                          sm
                          className="table table-text-small mb-0 border whitespace-nowrap  "
                        >
                          <Table.Thead className="thead-primary table-sorting bg-mustard">
                            <Table.Tr className="text-center text-white">
                              <Table.Th className="whitespace-nowrap border text-right">
                                SR.NO.
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-center">
                                ACTIONS
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                STATUS
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                CUSTOMER NAME
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ENQUIRY NUMBER
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ENQUIRY DATE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ORIGIN
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                DESTINATION
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                WEIGHT
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                VENDOR
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                SHIPMENT TYPE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                QUOTED BY
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-right">
                                QUOTED PRICE (₹)
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                RATE VALID TILL
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                AIRWAYBILL NO.
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                DISPATCH LABEL
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {datatoget?.spotdata3?.map(
                              (data: any, index: number) => (
                                <Table.Tr
                                  key={index}
                                  className={`text-left intro-x capitalize `}
                                >
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {(datatoget?.page3 - 1) * 5 + (index + 1)}
                                  </Table.Td>
                                  <Table.Td>
                                    {(data?.shipment_type == 5 ||
                                      data?.shipment_type == 1 ||
                                      data?.shipment_type == 8) &&
                                      data?.import_booking == 2 &&
                                      data?.booking_status != 3 &&
                                      data?.booking_status != 7 &&
                                      data?.booking_status != 18 ? (
                                      <Menu>
                                        <Menu.Button className=" bg-blue-100 text-blue-500 border-blue-500 flex p-1 rounded-md border-2">
                                          <UserCog className="w-5 stroke-2.5" />
                                          <ChevronDown className="w-4 stroke-2.5 mt-1" />
                                        </Menu.Button>
                                        <Menu.Items
                                          className="w-44 mt-px border-2 border-slate-200"
                                          placement="right-start"
                                        >
                                          {/* <Menu.Divider  /> */}
                                          {data?.booking_status == "1" && (
                                            <Menu.Item
                                              className="hover:bg-mustard hover:text-white"
                                              onClick={() => {
                                                handleEdit(data, "credit");
                                              }}
                                            >
                                              REQUEST CREDIT
                                            </Menu.Item>
                                          )}

                                          {data?.booking_status == "5" &&
                                            data?.airwaybilno ? (
                                            <>
                                              {/* <Menu.Divider />
                                              <Menu.Item
                                                className="hover:bg-mustard hover:text-white"
                                                onClick={() => {
                                                  setEditBookingData(data);
                                                  setDimensionData(
                                                    data?.shipment_dimensions || [
                                                      {
                                                        item_description: "",
                                                        weight: "",
                                                        value: "",
                                                        quantity: "",
                                                        length: "",
                                                        breadth: "",
                                                        height: "",
                                                        hsn_code: "",
                                                      },
                                                    ],
                                                  );
                                                  getJobData(data?.job_id);
                                                  setShowEditBooking(true)
                                                }}
                                              >
                                                EDIT BOOKING
                                              </Menu.Item> */}
                                              <Menu.Divider />
                                              <Menu.Item
                                                className="hover:bg-mustard hover:text-white"
                                                onClick={() => {
                                                  setTagData({
                                                    job_id: data?.job_id,
                                                    booking_no:
                                                      data?.booking_no,
                                                    franchisee_id:
                                                      data?.franchisee_id,
                                                    mawb: data?.master || "",
                                                    hawb:
                                                      data?.airwaybilno || "",
                                                  });
                                                  setMawbPresent(
                                                    !!data?.master,
                                                  );
                                                  setTagOpen(true);
                                                }}
                                              >
                                                TAG HOUSE/MASTER
                                              </Menu.Item>
                                              {/* <Menu.Divider />
                                              <Menu.Item
                                                className="hover:bg-mustard hover:text-white"
                                                onClick={() => {
                                                  setScanData((pre) => ({
                                                    ...pre,
                                                    job_id: data?.job_id,
                                                    id: "",
                                                    remarks: "",
                                                    status_code: "",
                                                    td_date: null,
                                                    td_weight: null,
                                                    booking_no:
                                                      data?.booking_no,
                                                    franchisee_id:
                                                      data?.franchisee_id,
                                                  }));

                                                  handleTrack(
                                                    data?.airwaybilno,
                                                  );
                                                  setScanOpen(true);
                                                }}
                                              >
                                                UPDATE SCAN EVENTS
                                              </Menu.Item> */}
                                            </>
                                          ) : (
                                            <>
                                              <Menu.Divider />
                                              {((data?.booking_status == "1" ||
                                                data?.booking_status == "8" ||
                                                data?.booking_status == "9" ||
                                                data?.booking_status == "10" ||
                                                data?.booking_status == "19") &&
                                                data?.is_draft == null &&
                                                data?.is_import_reject_approve ==
                                                0) ||
                                                data?.booking_status == "15" ||
                                                (data?.booking_status == "18" &&
                                                  data?.is_draft == null &&
                                                  data?.is_import_reject_approve ==
                                                  0) ||
                                                data?.booking_status == "15" ||
                                                (data?.booking_status == "18" &&
                                                  data?.is_draft == 1 &&
                                                  data?.is_import_reject_approve ==
                                                  1) ? (
                                                <Menu.Item
                                                  className="hover:bg-mustard hover:text-white"
                                                  onClick={async () => {
                                                    setDimensionData(
                                                      data?.shipment_dimensions || [
                                                        {
                                                          item_description: "",
                                                          weight: "",
                                                          value: "",
                                                          quantity: "",
                                                          length: "",
                                                          breadth: "",
                                                          height: "",
                                                          hsn_code: "",
                                                        },
                                                      ],
                                                    );
                                                    setEmailData({
                                                      job_id: data?.job_id,
                                                      booking_no:
                                                        data?.booking_no,
                                                      franchisee_id:
                                                        data?.franchisee_id,
                                                      cc_email: allfdata?.find(
                                                        (item: any) =>
                                                          item?.franchisee_id ==
                                                          data?.franchisee_id,
                                                      )?.email_id
                                                        ? [
                                                          allfdata.find(
                                                            (item: any) =>
                                                              item?.franchisee_id ==
                                                              data?.franchisee_id,
                                                          )!.email_id,
                                                        ]
                                                        : [],
                                                    });
                                                    setImportData(data);
                                                    getJobData(data?.job_id);
                                                    setShowBtn(false);
                                                    setOpenImport(true);
                                                    handleImportLastMail(
                                                      data?.franchisee_id,
                                                    );
                                                  }}
                                                >
                                                  {data?.booking_status ==
                                                    "1" ||
                                                    data?.booking_status == "8" ||
                                                    data?.booking_status == "9" ||
                                                    data?.booking_status == "10"
                                                    ? "ADD DETAILS"
                                                    : "COMPLETE BOOKING"}
                                                </Menu.Item>
                                              ) : null}
                                              {(data?.booking_status == "1" ||
                                                data?.booking_status == "8" ||
                                                data?.booking_status == "9" ||
                                                data?.booking_status == "10" ||
                                                data?.booking_status == "19") && (
                                                <>
                                                <Menu.Divider />
                                                <Menu.Item
                                                  className="hover:bg-mustard hover:text-white"
                                                  onClick={() => {
                                                    setProformaData(data);
                                                    setProformaOpen(true);
                                                  }}
                                                >
                                                  PROFORMA INVOICE
                                                </Menu.Item>
                                                </>
                                              )}
                                            </>
                                          )}
                                        </Menu.Items>
                                      </Menu>
                                    ) : (
                                      <div className="flex justify-center items-center">
                                        <Button
                                          className="p-1 bg-mustard text-white"
                                          onClick={() => {
                                            handleEdit(data, "credit");
                                          }}
                                        >
                                          Action
                                        </Button>
                                      </div>
                                    )}
                                  </Table.Td>
                                  <Table.Td>
                                    <div className="text-left">
                                      <span
                                        className={
                                          data?.booking_status == 15
                                            ? data?.import_booking == 2
                                              ? "text-green-400"
                                              : data?.is_checklist == 1
                                                ? "text-green-400"
                                                : "text-red-400"
                                            : statusdata?.find(
                                              (s: any) => s.status_code == data?.booking_status
                                            )?.css_class
                                        }
                                      >
                                        {data?.booking_status == 15
                                          ? data?.import_booking == 2
                                            ? "Customer Approval Pending"
                                            : data?.is_checklist == 1
                                              ? "CheckList Done"
                                              : "CheckList Pending"
                                          : statusdata?.find(
                                            (s: any) => s.status_code == data?.booking_status
                                          )?.status_name}
                                      </span>
                                    </div>
                                  </Table.Td>
                                  <Table.Td>
                                    {getrelateddata(
                                      "franchisee",
                                      allfdata,
                                      data?.franchisee_id,
                                    )?.franchisee_name || ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.booking_no || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {formatDate(data?.created_date) || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.org_city || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.org_country_id == "97" &&
                                      data?.dest_country_id == "97"
                                      ? data?.dest_city
                                      : countryData?.find(
                                        (item: any) =>
                                          item.country_id ==
                                          data?.dest_country_id,
                                      )?.country_name ||
                                      data?.dest_city ||
                                      "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {Number(data?.weight) || "-"}{" "}
                                    {data?.weight_unit
                                      ? `(${data.weight_unit})`
                                      : ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {productTypes?.find(
                                      (item) =>
                                        item.product_id == data?.courier_id,
                                    )?.product_name || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {shipmentTypedata?.find(
                                      (item2: any) =>
                                        item2?.booking_shipment_type_id ==
                                        data?.shipment_type,
                                    )?.shipment_type || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.quoted_by || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap lowercase text-right">
                                    {indianFormat(data?.spot_price) || "-"}{" "}
                                    {data?.price_type == "1"
                                      ? "(a)"
                                      : data?.price_type == "2"
                                        ? "(k)"
                                        : ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {formatDate(data?.valid_till) || "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.airwaybilno || "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.house_pdf ? (
                                      <div className="items-center">
                                        <FileText
                                          className="cursor-pointer text-mustard stroke-2.5 m-auto"
                                          onClick={() =>
                                            downloadAttachment(
                                              data?.house_pdf.replace(
                                                "_mawb",
                                                "",
                                              ),
                                              "Dispatch Label",
                                            )
                                          }
                                        />
                                      </div>
                                    ) : (
                                      <div className="text-gray-400 text-center">
                                        Not Available
                                      </div>
                                    )}
                                  </Table.Td>
                                  {/* <Table.Td className="px-8 flex justify-center">
                                  {data?.valid_till &&
                                  curr > new Date(data?.valid_till) ? (
                                    <p className="text-base  text-gray-500 whitespace-nowrap">
                                      Rate Expired
                                    </p>
                                  ) : data?.booking_status == 1 ||
                                    data?.booking_status == 3 ||
                                    data?.booking_status == 6 ? (
                                    <Button
                                      rounded
                                      className="w-24 text-base  text-white bg-green-500"
                                      onClick={() => {
                                        setSpotId(data?.id);
                                        setOpen(true);
                                      }}
                                    >
                                      APPROVE
                                    </Button>
                                  ) : data?.booking_status == 2 ? (
                                    <p className="text-base   text-red-500">
                                      REJECTED
                                    </p>
                                  ) : data?.booking_status == 5 ? (
                                    <p className=" text-green-500 text-base ">
                                      BOOKED
                                    </p>
                                  ) : data?.booking_status == 4 ? (
                                    <Button
                                      rounded
                                      size="sm"
                                      className="w-20  text-base text-white bg-green-500"
                                      onClick={() => handleBooking(data)}
                                    >
                                      BOOK
                                    </Button>
                                  ) : data?.booking_status == 0 ? (
                                    <Edit
                                      className="cursor-pointer text-mustard stroke-2.5"
                                      onClick={() => handleEdit(data)}
                                    />
                                  ) : (
                                    "N.A."
                                  )}
                                </Table.Td> */}
                                </Table.Tr>
                              ),
                            )}
                          </Table.Tbody>
                        </Table>
                      ) : datatoget?.loading3 ? (
                        <IsLoading w={"w-[50vw]"} h={"h-[40vh]"} />
                      ) : (
                        <Nodatafound w={"w-[50vw]"} h={"h-[50vh]"} />
                      )}
                    </div>
                    {datatoget?.spotdata3?.length > 0 &&
                      datatoget?.totalpages3 > 1 && (
                        <CommonPagination
                          totalpages={datatoget?.totalpages3}
                          onPageChange={handlePagechange}
                          page={datatoget?.page3}
                          value={3}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:flex lg:flex-wrap grid-flow-col grid-rows-2 ">
          <div className="w-full mb-5">
            <div className=" tableMain ">
              <div className="NewtableBox  bg-white rounded-md justify-between shadow-blue-900  ">
                <div className="tbaleTittle p-2 bg-gray-50 flex justify-between items-center ">
                  <h2 className="text-sm font-medium">
                    Initiated Jobs by OPS Team
                  </h2>

                  <div className="tableSearch relative w-200">
                    <FormInput
                      id="vertical-form-1"
                      type="text"
                      placeholder="Search By Franchisee "
                      onChange={(e: any) => {
                        setDatatoget((pre: any) => ({ ...pre, page2: 1 }));
                        setDatatoget((pre: any) => ({
                          ...pre,
                          search2: e.target.value,
                        }));
                      }}
                    />

                    <button
                      onClick={() => {
                        if (datatoget.search2) {
                          getspotenqdata(2, 0);
                        }
                      }}
                      className="searchListTable absolute top-2 right-3 text-stone-300"
                    >
                      {" "}
                      <Search />
                    </button>
                  </div>
                </div>

                <div
                  className={`tablelist p-3 ${isActive ? "showtable" : "hideTable"
                    }`}
                >
                  <div
                    className={`overflow-x-auto overflow-y-hidden  ${"h-[60vh]"}`}
                  >
                    <div className="table-responsive ">
                      {datatoget?.spotdata2?.length >= 1 &&
                        !datatoget?.loading2 ? (
                        <Table
                          sm
                          className="table table-text-small mb-0 border whitespace-nowrap  "
                        >
                          <Table.Thead className="thead-primary table-sorting bg-mustard">
                            <Table.Tr className="text-center text-white">
                              <Table.Th className="whitespace-nowrap border text-right">
                                SR.NO.
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-center">
                                ACTIONS
                              </Table.Th>
                              {/* <Table.Th className="whitespace-nowrap border text-left">
                                JOB ID
                              </Table.Th> */}
                              {/* <Table.Th className="whitespace-nowrap border text-left">
                                STATUS
                              </Table.Th> */}
                              <Table.Th className="whitespace-nowrap border text-left">
                                FRANCHISEE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                CREATED DATE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                DESTINATION COUNTRY
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-right">
                                WEIGHT
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {datatoget?.spotdata2?.map(
                              (data: any, index: number) => (
                                <Table.Tr
                                  key={index}
                                  className={`text-left intro-x capitalize `}
                                >
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {(datatoget?.page2 - 1) * 5 + (index + 1)}
                                  </Table.Td>
                                  <Table.Td>

                                    <div className="flex justify-center items-center">
                                      <Button
                                        className="p-1 bg-mustard text-white"
                                        onClick={() => {
                                          handleEdit(data, "job");
                                        }}
                                      >
                                        Action
                                      </Button>
                                    </div>
                                  </Table.Td>
                                  {/* <Table.Td>{data?.job_id || ""}</Table.Td> */}
                                  <Table.Td>
                                    {getrelateddata(
                                      "franchisee",
                                      allfdata,
                                      data?.franchisee_id,
                                    )?.franchisee_name || ""}
                                  </Table.Td>
                                  <Table.Td>
                                    {formatDate(data?.created_date) || ""}
                                  </Table.Td>
                                  <Table.Td>
                                    {countryData?.find(
                                      (item: any) =>
                                        item.country_id ==
                                        data?.destination_country,
                                    )?.country_name || ""}
                                  </Table.Td>

                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {(data?.shipment_dimensions?.length >= 1 &&
                                      data?.shipment_dimensions?.reduce(
                                        (acc, item) => {
                                          return (
                                            acc + Number(item?.weight || 0)
                                          ); // Ensure `height` exists, else add 0
                                        },
                                        0,
                                      )) ||
                                      ""}
                                  </Table.Td>
                                  {/* <Table.Td className="border whitespace-nowrap text-right">
                                    {data?.status || ""}
                                  </Table.Td> */}
                                </Table.Tr>
                              ),
                            )}
                          </Table.Tbody>
                        </Table>
                      ) : datatoget?.loading2 ? (
                        <IsLoading w={"w-[50vw]"} h={"h-[40vh]"} />
                      ) : (
                        <Nodatafound w={"w-[50vw]"} h={"h-[50vh]"} />
                      )}
                    </div>
                    {datatoget?.spotdata2?.length > 0 &&
                      datatoget?.totalpages2 > 1 && (
                        <CommonPagination
                          totalpages={datatoget?.totalpages2}
                          onPageChange={handlePagechange}
                          page={datatoget?.page2}
                          value={2}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full mb-5">
            <div className=" tableMain ">
              <div className="NewtableBox  bg-white rounded-md justify-between shadow-blue-900  ">
                <div className="tbaleTittle p-2 bg-gray-50 flex justify-between items-center ">
                  <h2 className="text-sm font-medium">Insufficient Balance</h2>

                  <div className="tableSearch relative w-200">
                    <FormInput
                      id="vertical-form-1"
                      type="text"
                      placeholder="Search By Enquiry Id "
                      onChange={(e: any) => {
                        setDatatoget((pre: any) => ({ ...pre, page4: 1 }));
                        setDatatoget((pre: any) => ({
                          ...pre,
                          search4: e.target.value,
                        }));
                      }}
                    />

                    <button
                      onClick={() => {
                        if (datatoget.search4) {
                          getspotenqdata(4, [14]);
                        }
                      }}
                      className="searchListTable absolute top-2 right-3 text-stone-300"
                    >
                      {" "}
                      <Search />
                    </button>
                  </div>
                </div>

                <div
                  className={`tablelist p-3 ${isActive ? "showtable" : "hideTable"
                    }`}
                >
                  <div
                    className={`overflow-x-auto overflow-y-hidden ${"h-[60vh]"}`}
                  >
                    <div className="table-responsive ">
                      {datatoget?.spotdata4?.length >= 1 &&
                        !datatoget?.loading4 ? (
                        <Table
                          sm
                          className="table table-text-small mb-0 border  "
                        >
                          <Table.Thead className="thead-primary table-sorting bg-mustard">
                            <Table.Tr className="text-center text-white">
                              <Table.Th className="whitespace-nowrap border text-right">
                                SR.NO.
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-center">
                                ACTIONS
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                STATUS
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                CUSTOMER NAME
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ENQUIRY ID
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ENQUIRY DATE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                ORIGIN
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                DESTINATION
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                WEIGHT
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                VENDOR
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                SHIPMENT TYPE
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                QUOTED BY
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-right">
                                QUOTED PRICE (₹)
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                RATE VALID TILL
                              </Table.Th>
                              <Table.Th className="whitespace-nowrap border text-left">
                                AIRWAYBILL NO.
                              </Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {datatoget?.spotdata4?.map(
                              (data: any, index: number) => (
                                <Table.Tr
                                  key={index}
                                  className={`text-left intro-x capitalize `}
                                >
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {(datatoget?.page4 - 1) * 5 + (index + 1)}
                                  </Table.Td>
                                  <Table.Td>
                                    <div className="flex justify-center items-center">
                                      <Button
                                        className="p-1 bg-mustard text-white"
                                        onClick={() => {
                                          handleEdit(data, "credit");
                                        }}
                                      >
                                        Action
                                      </Button>
                                    </div>
                                  </Table.Td>
                                  <Table.Td>
                                    <div className="flex justify-center items-center">
                                      <span
                                        className={
                                          data?.booking_status == 15
                                            ? data?.import_booking == 2
                                              ? "text-green-400"
                                              : data?.is_checklist == 1
                                                ? "text-green-400"
                                                : "text-red-400"
                                            : statusdata?.find(
                                              (s: any) => s.status_code == data?.booking_status
                                            )?.css_class
                                        }
                                      >
                                        {data?.booking_status == 15
                                          ? data?.import_booking == 2
                                            ? "Customer Approval Pending"
                                            : data?.is_checklist == 1
                                              ? "CheckList Done"
                                              : "CheckList Pending"
                                          : statusdata?.find(
                                            (s: any) => s.status_code == data?.booking_status
                                          )?.status_name}
                                      </span>
                                    </div>
                                  </Table.Td>
                                  <Table.Td>
                                    {getrelateddata(
                                      "franchisee",
                                      allfdata,
                                      data?.franchisee_id,
                                    )?.franchisee_name || ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.booking_no || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {formatDate(data?.created_date) || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.org_city || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.org_country_id == "97" &&
                                      data?.dest_country_id == "97"
                                      ? data?.dest_city
                                      : countryData?.find(
                                        (item: any) =>
                                          item.country_id ==
                                          data?.dest_country_id,
                                      )?.country_name ||
                                      data?.dest_city ||
                                      "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap text-right">
                                    {Number(data?.weight) || "-"}{" "}
                                    {data?.weight_unit
                                      ? `(${data.weight_unit})`
                                      : ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {productTypes?.find(
                                      (item) =>
                                        item.product_id == data?.courier_id,
                                    )?.product_name || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {shipmentTypedata?.find(
                                      (item2: any) =>
                                        item2?.booking_shipment_type_id ==
                                        data?.shipment_type,
                                    )?.shipment_type || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.quoted_by || "-"}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap lowercase text-right">
                                    {indianFormat(data?.spot_price) || "-"}{" "}
                                    {data?.price_type == "1"
                                      ? "(a)"
                                      : data?.price_type == "2"
                                        ? "(k)"
                                        : ""}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {formatDate(data?.valid_till) || "N.A."}
                                  </Table.Td>
                                  <Table.Td className="border whitespace-nowrap">
                                    {data?.airwaybilno || "N.A."}
                                  </Table.Td>
                                  {/* <Table.Td className="px-8 flex justify-center">
                                  {data?.valid_till &&
                                  curr > new Date(data?.valid_till) ? (
                                    <p className="text-base  text-gray-500 whitespace-nowrap">
                                      Rate Expired
                                    </p>
                                  ) : data?.booking_status == 1 ||
                                    data?.booking_status == 3 ||
                                    data?.booking_status == 6 ? (
                                    <Button
                                      rounded
                                      className="w-24 text-base  text-white bg-green-500"
                                      onClick={() => {
                                        setSpotId(data?.id);
                                        setOpen(true);
                                      }}
                                    >
                                      APPROVE
                                    </Button>
                                  ) : data?.booking_status == 2 ? (
                                    <p className="text-base   text-red-500">
                                      REJECTED
                                    </p>
                                  ) : data?.booking_status == 5 ? (
                                    <p className=" text-green-500 text-base ">
                                      BOOKED
                                    </p>
                                  ) : data?.booking_status == 4 ? (
                                    <Button
                                      rounded
                                      size="sm"
                                      className="w-20  text-base text-white bg-green-500"
                                      onClick={() => handleBooking(data)}
                                    >
                                      BOOK
                                    </Button>
                                  ) : data?.booking_status == 0 ? (
                                    <Edit
                                      className="cursor-pointer text-mustard stroke-2.5"
                                      onClick={() => handleEdit(data)}
                                    />
                                  ) : (
                                    "N.A."
                                  )}
                                </Table.Td> */}
                                </Table.Tr>
                              ),
                            )}
                          </Table.Tbody>
                        </Table>
                      ) : datatoget?.loading4 ? (
                        <IsLoading w={"w-[50vw]"} h={"h-[40vh]"} />
                      ) : (
                        <Nodatafound w={"w-[50vw]"} h={"h-[50vh]"} />
                      )}
                    </div>
                    {datatoget?.spotdata4?.length > 0 &&
                      datatoget?.totalpages4 > 1 && (
                        <CommonPagination
                          totalpages={datatoget?.totalpages4}
                          onPageChange={handlePagechange}
                          page={datatoget?.page4}
                          value={4}
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {enquiryModal ? (
          <SpotpriceModal
            setOpenModal={setEnquiryModal}
            openmodal={enquiryModal}
            spotData={editdata}
            setSpotData={setEditData}
            allfdata={allfdata}
            handleCancel={handleCancel}
            getchweight={getchweight}
            chargehead={chargesdata}
            setChargehead={setChargesdata}
            hasUpdated={hasUpdated}
            setHasUpdated={setHasUpdated}
            branchdata={branchData}
            hubData={hubdata}
            setEmailModal={setEmailModal}
            emailModal={emailModal}
            exposureData={exposureData}
            forwhat={forwhat}
            setForwhat={setForwhat}
            setExposureData={setExposureData}
            enquiryModal={enquiryModal}
            setEnquiryModal={setEnquiryModal}
            pdcModal={pdcModal}
            setPdcModal={setPdcModal}
            pdcData={pdcData}
            setPdcData={setPdcData}
            pdcLen={pdcLen}
            singlefranchiseedata={singlefranchiseedata}
            setSingleFranchiseedata={setSingleFranchiseedata}
          />
        ) : (
          ""
        )}
        {emailModal && (
          <CommonemailModal
            setEmailModal={setEmailModal}
            emailModal={emailModal}
            spotData={editdata}
            setSpotData={setEditData}
            allfdata={allfdata}
            handleCancel={handleCancel}
            branchdata={branchData}
            hubData={hubdata}
            exposureData={exposureData}
            setExposureData={setExposureData}
            forwhat={forwhat}
            setForwhat={setForwhat}
          />
        )}
        {
          <CommonModal
            open={pdcModal}
            setOpen={setPdcModal}
            title={modalTitle1}
            description={description1}
            footer={modalFooter1}
            size="md"
          />
        }

        {openImport && (
          <CommonModal
            open={openImport}
            setOpen={setOpenImport}
            title={
              <>
                <div className="flex justify-flex justify-between w-full ">
                  <div>
                    <p className="text-base font-medium">
                      {importData?.booking_status == "1" ||
                        importData?.booking_status == "8" ||
                        importData?.booking_status == "9" ||
                        importData?.booking_status == "19"
                        ? "ADD IMPORT DETAILS"
                        : "COMPLETE BOOKING"}
                    </p>
                  </div>
                  <div className="bg-gray-200 rounded p-2 ml-2">
                    <span className="font-bold">ENQUIRY No: </span>
                    <span>{importData?.booking_no}</span>
                  </div>
                  <div>
                    <XCircle
                      className="w-5 h-5 cursor-pointer hover:text-red-500"
                      onClick={() => setOpenImport(false)}
                    />
                  </div>
                </div>
              </>
            }
            description={ImportDescription}
            footer={ImportFooter}
            size="2xl"
          />
        )}
        {showEditBooking && (
          <CommonModal
            open={showEditBooking}
            setOpen={setShowEditBooking}
            title={
              <>
                <div className="flex justify-flex justify-between w-full ">
                  <div>
                    <p className="text-base font-medium">
                      EDIT BOOKING
                    </p>
                  </div>
                  <div className="bg-gray-200 rounded p-2 ml-2">
                    <span className="font-bold">AWB No: </span>
                    <span>{editBookingData?.airwaybilno}</span>
                  </div>
                  <div>
                    <XCircle
                      className="w-5 h-5 cursor-pointer hover:text-red-500"
                      onClick={() => setShowEditBooking(false)}
                    />
                  </div>
                </div>
              </>
            }
            description={EditBookingDescription}
            footer={EditBookingFooter}
            size="2xl"
          />
        )}
        {scanOpen && (
          <CommonModal
            open={scanOpen}
            setOpen={setScanOpen}
            title={
              <>
                <div className="flex justify-flex justify-between w-full ">
                  <div>
                    <p className="text-base font-medium">UPDATE SCAN EVENTS</p>
                  </div>
                  <div>
                    <XCircle
                      className="w-5 h-5 cursor-pointer hover:text-red-500"
                      onClick={() => setScanOpen(false)}
                    />
                  </div>
                </div>
              </>
            }
            description={scanDescription}
            footer={scanFooter}
            size="lg"
          />
        )}
        {tagOpen && (
          <CommonModal
            open={tagOpen}
            setOpen={setTagOpen}
            title={
              <>
                <div className="flex justify-flex justify-between w-full ">
                  <div>
                    <p className="text-base font-medium">TAG HOUSE / MASTER</p>
                  </div>
                  <div>
                    <XCircle
                      className="w-5 h-5 cursor-pointer hover:text-red-500"
                      onClick={() => setTagOpen(false)}
                    />
                  </div>
                </div>
              </>
            }
            description={tagDescription}
            footer={tagFooter}
            size="lg"
          />
        )}

        {proformaOpen && (
          <CommonModal
            open={proformaOpen}
            setOpen={setProformaOpen}
            title={proformaTitle}
            description={proformaDescription}
            footer={proformaFooter}
            size="lg"
          />
        )}
        {emailOpen && (
          <CommonModal
            open={emailOpen}
            setOpen={setEmailOpen}
            title={
              <>
                <div className="flex justify-flex justify-between w-full ">
                  <div>
                    <p className="text-base font-medium">Email Confirmation</p>
                  </div>
                  <div>
                    <XCircle
                      className="w-5 h-5 cursor-pointer hover:text-red-500"
                      onClick={() => {
                        setShowBtn(false);
                        setOpenImport(true);
                        setEmailOpen(false);
                      }}
                    />
                  </div>
                </div>
              </>
            }
            description={emailDescription}
            footer={emailFooter}
            size="xl"
          />
        )}
      </div>
      <style>
        {`
          button[data-headlessui-state="open"] {
            border-color: #F0B646;
            color: #F0B646;
          }
        `}
      </style>
    </>
  );
};

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