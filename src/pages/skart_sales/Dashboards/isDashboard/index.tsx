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
  Briefcase,
  Wallet,
  Loader,
  MessageCircle,
  Box,
  MapPin,
  ChevronRight,
  User,
  Calendar,
  Bookmark,
  Scroll,
  CreditCard,
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

import AOS from "aos";
import "aos/dist/aos.css";
import { Database } from "lucide-react";

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
  const [counter, setCounter] = useState<any>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [enquiryModal, setEnquiryModal] = useState<boolean>(false);
  const [viewCardModal, setViewCardModal] = useState<boolean>(false);
  const [viewApprovedModal, setViewApprovedModal] = useState<boolean>(false);
  const [ViewInsufficientModal, setViewInsufficientModal] =
    useState<boolean>(false);

  const [selectedCardData, setSelectedCardData] = useState<any>(null);
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
  const [shipperInvoiceFile, setShipperInvoiceFile] = useState<File | null>(
    null,
  );
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
    setCounter(0);
    setForwhat("");
    setCounter(0);
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
  useServiceSocket(
    "booking",
    "booking_status_changed",
    () => {
      if (!enquiryModal) {
        gettopdata();
        getspotenqdata(1, [0, 16]);
        getspotenqdata(2, 0);
        getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
        getspotenqdata(4, [14]);
      }
    },
    () => {
      if (!enquiryModal) {
        gettopdata();
        getspotenqdata(1, [0, 16]);
        getspotenqdata(2, 0);
        getspotenqdata(3, [1, 3, 7, 8, 9, 10]);
        getspotenqdata(4, [14]);
      }
    },
  );

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
          `booking/get_spot_enquiry?sales_id=${
            userdata?.mapped_id
          }&limit=4&page=${datatoget.page1 - 1}${
            debouncedSearch ? `&key=${debouncedSearch.trim()}` : ""
          }${inputs?.weight ? `&weight=${inputs.weight}` : ""}${
            inputs?.dest_country_id
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
          `booking/job-list?status=${ids || 0}${
            debouncedSearch2 ? `&key=${debouncedSearch2.trim()}` : ""
          }&sales_id=${userdata?.mapped_id}&limit=4&page=${
            (datatoget.page2 - 1) * 5
          }${inputs?.weight ? `&weight=${inputs.weight}` : ""}${
            inputs?.dest_country_id
              ? `&destination_country=${inputs?.dest_country_id}`
              : ""
          }${
            inputs?.franchisee_id && inputs?.franchisee_id?.length >= 1
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
          `booking/get_spot_enquiry?sales_id=${
            userdata?.mapped_id
          }&limit=4&page=${datatoget.page3 - 1}${
            debouncedSearch3 ? `&key=${debouncedSearch3.trim()}` : ""
          }${inputs?.weight ? `&weight=${inputs.weight}` : ""}${
            inputs?.dest_country_id
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
          `booking/get_spot_enquiry?sales_id=${
            userdata?.mapped_id
          }&limit=4&page=${datatoget.page4 - 1}${
            debouncedSearch4 ? `&key=${debouncedSearch4.trim()}` : ""
          }${inputs?.weight ? `&weight=${inputs.weight}` : ""}${
            inputs?.dest_country_id
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
      const response = await commonpostrequest(
        "book/upload_shipper_invoice",
        formData,
      );
      if (response?.data?.status == 200) {
        setShipperInvoiceUrl(response.data?.shipper_url || "");
        showAlert("Shipper invoice uploaded successfully");
      } else {
        setShipperInvoiceFile(null);
        setShipperInvoiceUrl("");
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            "Upload failed",
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

  const handleBooking = async (
    job_id: any,
    is_draft: any = 1,
    self: any = 0,
  ) => {
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
        setCounter(0);
        showAlert(res?.data?.message);
        setCounter(0);
        setShipperInvoiceFile(null);
        setShipperInvoiceUrl("");
        if (shipperInvoiceInputRef.current)
          shipperInvoiceInputRef.current.value = "";
      } else if (res?.status == 400) {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
        setCounter(counter + 1);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
        setCounter(counter + 1);
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
    if (!editBookingData?.job_id)
      return showAlert("Job id is required", "warning");
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
        res = await commonpostrequest(
          `booking/generate-booking/${editBookingData?.job_id}`,
          {
            counter: counter || 0,
            airwaybill_no: editBookingData?.airwaybilno,
            flag: "edit_booking",
          },
        );
      } else {
        res = await commonpostrequest(`/raise_spot_enquiry`, {
          ...editBookingData,
          booking_status: 7,
          weight: chWeight,
          chargeable_weight: chWeight,
        });
      }
      if (res?.status == 200) {
        handleCancel(1);
        if (!isInWeightRange) {
          showAlert(
            "Shipment is out of weight range, send to Pricing for Approval",
            "warning",
          );
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
    if (!editBookingData?.commodity)
      return showAlert("Commodity is required", "warning");
    if (!editBookingData?.incoterm)
      return showAlert("Incoterm is required", "warning");
    if (
      (editBookingData?.shipment_type == 4 ||
        editBookingData?.shipment_type == 5) &&
      !editBookingData?.clearence_type
    )
      return showAlert("Clearance Type is required", "warning");
    if (
      (editBookingData?.shipment_type == 4 ||
        editBookingData?.shipment_type == 5) &&
      editBookingData?.import_booking == 2 &&
      !editBookingData?.import_service_type
    )
      return showAlert("Import Service Type is required", "warning");
    if (
      (editBookingData?.shipment_type == 4 ||
        editBookingData?.shipment_type == 5) &&
      !editBookingData?.currency_id
    )
      return showAlert("Currency is required", "warning");
    if (!dimensionData?.length)
      return showAlert(
        "At least one shipment dimension is required",
        "warning",
      );

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
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error: any) {
      showAlert(error?.message || error?.msg, "error");
    } finally {
      setEditSpinner(false);
    }
  };

  const ImportDescription = (
    <>
      <div className=" grid grid-cols-12 gap-2  w-full">
        <div className="col-span-12 lg:col-span-3  mb-1 lg:mb-3">
          <div className="bg-[#f2f7ff] rounded-lg p-[7px] flex w-full ">
            <figure className="w-[35px] flex items-center justify-center">
              <FileText className="w-[35px]  text-[#3b7dd8] " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                ENQUIRY No
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {importData?.booking_no}
                </span>
              </h4>
            </aside>
          </div>
        </div>
      </div>

      <div className=" col-span-12 border border-[#ffecca]  px-4 py-2  intro-x font-medium cursor-pointer text-sm flex flex-row justify-between gap-4 rounded-lg bg-[#fffaf1] h-auto">
        <div>
          <div>
            <span className="mt-2 text-lg font-bold">ORIGIN </span>
          </div>

          <div className="flex gap-2 ">
            <div className="text-center p-1 border-2 h-auto  sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
              <img
                src={`https://flagsapi.com/${
                  importData?.origin_country_code
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
              <FormSelect
                value={importData?.currency_id || "24"}
                onChange={(e) => {
                  setImportData((prev: any) => ({
                    ...prev,
                    currency_id: Number(e.target.value) || "",
                  }));
                }}
              >
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
                {shipperInvoiceFile
                  ? shipperInvoiceFile.name
                  : "No file chosen"}
              </span>
              <input
                ref={shipperInvoiceInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (shipperInvoiceInputRef.current)
                    shipperInvoiceInputRef.current.value = "";
                  if (file) handleShipperInvoiceUpload(file);
                }}
              />
            </label>
            {shipperInvoiceUploading && <Spinner size="sm" />}
            {shipperInvoiceUrl && !shipperInvoiceUploading && (
              <span className="text-green-600 text-xs font-medium">
                Uploaded
              </span>
            )}
            {shipperInvoiceFile && !shipperInvoiceUploading && (
              <button
                type="button"
                className="text-gray-400 hover:text-red-500"
                onClick={() => {
                  setShipperInvoiceFile(null);
                  setShipperInvoiceUrl("");
                  if (shipperInvoiceInputRef.current)
                    shipperInvoiceInputRef.current.value = "";
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
              enquiryData={{
                ...importData,
                courier_name:
                  products?.find(
                    (item: any) => item?.product_id == importData?.courier_id,
                  )?.product_name || "N.A.",
              }}
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
        className="text-white bg-gray-500 p-2 border-none"
        onClick={() => {
          setOpenImport(false);
          setCounter(0);
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
          className="text-white bg-mustard p-2 ml-4 border-none"
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
            className="text-white bg-mustard py-2 px-3 ml-4"
            onClick={() => handleBooking(importData?.job_id, 0, 0)}
            disabled={bookingLoading?.status || selfSpinner}
          >
            FINAL BOOKING
            {bookingLoading?.status &&
              bookingLoading?.forWhat == 0 &&
              !selfSpinner && (
                <LoadingIcon
                  icon="puff"
                  color="white"
                  className="w-5 h-5 ml-2 stroke-2.5 text-white"
                />
              )}
          </Button>
          {showBtn && (
            <Button
              className="text-white bg-mustard p-2 ml-4"
              onClick={() => {
                (handleBooking(importData?.job_id, 0, 1), setSelfSpinner(true));
              }}
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
            </Button>
          )}
        </>
      )}
    </>
  );

  const EditBookingDescription = (
    <>
      {/* <div className="bg-gray-200 rounded p-2 ml-2">
                    <span className="font-bold">AWB No: </span>
                    <span>{editBookingData?.airwaybilno}</span>
                  </div> */}

      <div className=" grid grid-cols-12 gap-2  w-full mb-3">
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-[#eafffa] rounded-lg p-[7px] flex  w-full lg:w-[50%]">
            <figure className="w-[35px] flex items-center justify-center">
              <FileText className="w-[30px]  text-[#18a080]  " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                AWB No
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {editBookingData?.airwaybilno}
                </span>
              </h4>
            </aside>
          </div>
        </div>
      </div>

      <div className="max-h-[75vh] overflow-y-auto mb-3">
        <div className=" col-span-12 border border-[#ffecca]  px-4 py-2  intro-x font-medium cursor-pointer text-sm flex flex-row justify-between gap-4 rounded-lg bg-[#fffaf1] h-auto">
          <div>
            <div>
              <span className="mt-2 text-lg font-bold">ORIGIN </span>
            </div>

            <div className="flex gap-2 ">
              <div className="text-center p-1 border-2 h-auto  sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
                <img
                  src={`https://flagsapi.com/${
                    editBookingData?.origin_country_code
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
                      item?.country_code ==
                      editBookingData?.origin_country_code,
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
                  // isDisabled
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
                <FormSelect
                  // disabled
                  value={editBookingData?.currency_id || "24"}
                >
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
            <Tippy
              content="Add Sender Details"
              options={{ placement: "right" }}
            >
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
                enquiryData={{
                  ...editBookingData,
                  courier_name:
                    products?.find(
                      (item: any) =>
                        item?.product_id == editBookingData?.courier_id,
                    )?.product_name || "N.A.",
                }}
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
      </div>
    </>
  );
  const EditBookingFooter = (
    <>
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
    </>
  );

  const handleProformaInvoice = async () => {
    setProformaLoading(true);
    try {
      const res = await commongetrequest(
        `booking/proforma-invoice/${proformaData?.job_id}`,
      );
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
        <p className="text-base font-medium text-white">Confirmation</p>
        <XCircle
          className="stroke-1.5 w-5 h-5 cursor-pointer text-red-500  hover:text-red-700 "
          onClick={() => setProformaOpen(false)}
        />
      </div>
    </>
  );

  const proformaDescription = (
    <>
      <div className=" grid grid-cols-12 gap-2  w-full">
        <div className="col-span-12 lg:col-span-5  mb-1 lg:mb-3">
          <div className="bg-[#f2f7ff] rounded-lg p-[7px] flex w-full ">
            <figure className="w-[35px] flex items-center justify-center">
              <FileText className="w-[35px]  text-[#3b7dd8] " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                ENQUIRY No
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {proformaData?.booking_no}
                </span>
              </h4>
            </aside>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7  mb-1 lg:mb-3">
          <div className="bg-[#eafffa] rounded-lg p-[7px] flex  w-full">
            <figure className="w-[35px] flex items-center justify-center">
              <User className="w-[30px]  text-[#18a080]  " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                FRANCHISEE
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {allfdata?.find(
                    (item: any) =>
                      item?.franchisee_id == proformaData?.franchisee_id,
                  )?.franchisee_name || proformaData?.franchisee_id}
                </span>
              </h4>
            </aside>
          </div>
        </div>
      </div>

      {/* 
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-4">
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>ENQUIRY No: </b>
          {proformaData?.booking_no}
        </div>
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>FRANCHISEE : </b>
          {allfdata?.find(
            (item: any) => item?.franchisee_id == proformaData?.franchisee_id,
          )?.franchisee_name || proformaData?.franchisee_id}
        </div>
      </div> */}
      <p className="text-center text-lg font-semibold text-gray-700 mt-5">
        Are you sure you want to Generate Proforma Invoice ?
      </p>
    </>
  );

  const proformaFooter = (
    <>
      <Button
        className="text-white bg-green-500 p-2 border-none"
        onClick={handleProformaInvoice}
        disabled={proformaLoading}
      >
        Yes
        {proformaLoading && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white  border-none"
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
                <span className="truncate max-w-[45vw] sm:max-w-[200px]">
                  {email}
                </span>
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
      <div className=" grid grid-cols-12 gap-2  w-full">
        <div className="col-span-12 lg:col-span-5  mb-1 lg:mb-3">
          <div className="bg-[#f2f7ff] rounded-lg p-[7px] flex w-full ">
            <figure className="w-[35px] flex items-center justify-center">
              <FileText className="w-[35px]  text-[#3b7dd8] " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                ENQUIRY No
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {" "}
                  {tagData?.booking_no}
                </span>
              </h4>
            </aside>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7  mb-1 lg:mb-3">
          <div className="bg-[#eafffa] rounded-lg p-[7px] flex  w-full">
            <figure className="w-[35px] flex items-center justify-center">
              <User className="w-[30px]  text-[#18a080]  " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                FRANCHISEE
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {
                    allfdata?.find(
                      (item: any) =>
                        item?.franchisee_id == tagData?.franchisee_id,
                    )?.franchisee_name
                  }
                </span>
              </h4>
            </aside>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-2">
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
      </div> */}
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
        className="px-4 py-1 rounded-lg bg-mustard text-white  ml-2 border-none"
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

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    // The layout scrolls inside an inner container (not window), so AOS never
    // sees scroll events and lower boxes stay hidden. Trigger them ourselves.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("aos-animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 },
    );
    document
      .querySelectorAll("[data-aos]")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(
      ".job-reveal:not(.job-reveal-visible)",
    );
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              Number((a.target as HTMLElement).dataset.revealIndex) -
              Number((b.target as HTMLElement).dataset.revealIndex),
          )
          .forEach((entry, i) => {
            const el = entry.target as HTMLElement;
            el.style.transitionDelay = `${i * 300}ms`;

            el.classList.remove("opacity-0", "translate-y-6");
            el.classList.add(
              "opacity-100",
              "translate-y-0",
              "job-reveal-visible",
            );

            const onEnd = (e: TransitionEvent) => {
              if (e.propertyName === "transform") {
                el.classList.remove("translate-y-0");
                el.removeEventListener("transitionend", onEnd);
              }
            };

            el.addEventListener("transitionend", onEnd);
            observer.unobserve(entry.target);
          });
      },
      { threshold: 0.1 },
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [
    datatoget?.spotdata1,
    datatoget?.loading1,
    datatoget?.spotdata2,
    datatoget?.loading2,
    datatoget?.spotdata3,
    datatoget?.loading3,
    datatoget?.spotdata4,
    datatoget?.loading4,
  ]);

  return (
    <>
      {/* <h2 className=" text-lg font-medium my-5">IS DASHBOARD</h2> */}

      <div className="grid grid-cols-12  gap-2 my-5">
        <div className="col-span-5 lg:col-span-2 " data-aos="fade-up">
          <div className="relative  overflow-hidden bg-white rounded-[10px] p-3 w-full h-full text-center bg-gradient-to-t from-[#fff] via-[#FFF9EC] to-[#FFF9EC] border border-[#fff]">
            <figure className=" bg-[#ffc24b] rounded-full w-[45px] h-[45px] flex justify-center items-center m-auto">
              <Briefcase className="text-white w-[23px]" />
            </figure>

            <h2 className="text-sm text-[#4e4e4e] mb-[5px] mt-[12px]">
              {" "}
              Initiated Jobs
            </h2>
            <p className="text-[22px]">{Number(topdata?.intjobs) || 0} </p>

            <div className="absolute bottom-[-60px] left-0 right-0 w-[200%]  ">
              <img
                src="https://www.icegif.com/wp-content/uploads/2023/06/icegif-902.gif"
                className=" m-auto mt-2 [filter:sepia(2)_saturate(12)] opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="col-span-7 lg:col-span-3 " data-aos="fade-up">
          <div className="relative  overflow-hidden bg-white rounded-[10px] p-3 w-full h-full text-center  bg-gradient-to-t from-[#fff] via-[#fff] to-[#D1FFDC] border border-[#fff]">
            <figure className=" bg-[#48cd68] rounded-full w-[45px] h-[45px] flex justify-center items-center m-auto">
              {" "}
              <Wallet className="text-white  w-[25px]" />
            </figure>
            <h2 className="text-sm text-[#4e4e4e] mb-[5px] mt-[12px]">
              Request for Credit Balance
            </h2>
            <p className="text-[22px]">
              {Number(topdata?.credit_pending) || 0}{" "}
            </p>

            <div className="absolute bottom-[-60px] left-0 right-0 w-[200%]  ">
              <img
                src="https://www.icegif.com/wp-content/uploads/2023/06/icegif-902.gif"
                className=" m-auto mt-2 [filter:sepia(11111)_saturate(5)_hue-rotate(403deg)] opacity-50"
              />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-7 " data-aos="fade-up">
          <div className="bg-white rounded-[10px]   w-full h-full text-center bg-gradient-to-t from-[#fff] via-[#fff] to-[#ECECEC] border border-[#fff]">
            <div className=" block lg:flex justify-between items-center   px-[12px] py-[3px] rounded-t-[8px]  bg-gradient-to-r from-[#fff4da] via-[#FFE8E8] to-[#FFE8E8] ">
              <div
                className="   rounded-[5px] py-[3px]  flex justify-center items-center "
                data-aos="fade-up"
              >
                <i className="md:inline-block  hidden">
                  <Search className="w-[16px]" />
                </i>
                <h5 className="text-[15px] font-bold ml-[4px] uppercase">
                  Spot Enquires
                </h5>
              </div>

              <div className="flex gap-2 items-center justify-center lg:justify-end">
                <div className=" rounded-[10px] gap-2 flex justify-center items-center">
                  <div
                    className="flex border-r border-[#ffb0b0] pr-2"
                    data-aos="fade-up"
                  >
                    <figure className="">
                      <ShieldAlert className="w-[14px] h-[22px] text-[#f94141] " />
                    </figure>

                    <p className="pl-1 text-sm text-left flex text-[#f94141]">
                      Expired :{" "}
                      <b className="block">{Number(topdata?.expired) || 0}</b>
                    </p>
                  </div>

                  <div className="flex" data-aos="fade-up">
                    <figure className="">
                      <ThumbsDown className="w-[14px] h-[22px] text-[#f94141] " />
                    </figure>
                    <p className="pl-1 text-sm text-left flex text-[#f94141]">
                      Rejected :{" "}
                      <b className="block">{Number(topdata?.rejected) || 0}</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-12  gap-2 ">
                <div className="col-span-12 md:col-span-6 " data-aos="fade-up">
                  <div className="flex items-center">
                    <figure className=" bg-[#ccfbd7] rounded-full w-[29px] h-[29px] flex justify-center items-center">
                      <FolderOpen className="w-[15px]  text-green-500 " />
                    </figure>
                    <p className="pl-2 text-sm text-left flex">
                      Open :{" "}
                      <b className="block">{Number(topdata?.open) || 0}</b>
                    </p>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 " data-aos="fade-up">
                  <div className="flex items-center">
                    <figure className=" bg-[#ffedc3] rounded-full w-[29px] h-[29px] flex justify-center items-center">
                      <MessageCircle className="w-[18px]  text-[#c78c03]" />
                    </figure>

                    <p className="pl-2 text-sm text-left flex">
                      Requoted :{" "}
                      <b className="block">{Number(topdata?.requoted) || 0}</b>
                    </p>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 " data-aos="fade-up">
                  <div className="flex items-center">
                    <figure className=" bg-blue-100 rounded-full w-[29px] h-[29px] flex justify-center items-center">
                      <Loader className="w-[15px]  text-[#106acb]" />
                    </figure>

                    <p className="pl-2 text-sm text-left flex">
                      dgd Approval Pending :{" "}
                      <b className="block">
                        {Number(topdata?.approval_pending) || 0}
                      </b>
                    </p>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 " data-aos="fade-up">
                  <div className="flex items-center">
                    <figure className="  bg-[#ffd7d7] rounded-full w-[29px] h-[29px] flex justify-center items-center">
                      <Wallet className="w-[18px]  text-[#d21a1a]" />
                    </figure>

                    <p className="pl-2 text-sm text-left flex">
                      Insufficient Balance :{" "}
                      <b className="block">
                        {Number(topdata?.insufficient) || 0}
                      </b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-[40]  bg-white rounded-[10px] p-4 w-full  text-center   border border-[#fff]"
        data-aos="fade-up"
      >
        <div className="grid grid-cols-12  gap-2 ">
          <div className="col-span-12 lg:col-span-2" data-aos="fade-up">
            {/* Dropdown Section */}
            <div
              className={`relative ${
                selectedOptions?.length >= 1 ? "mt-[21px]" : ""
              }`}
              ref={dropdownRef}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full bg-[#efb847] text-white px-3 py-[7px] rounded-md font-medium text-[#303030] flex justify-between items-center uppercase"
              >
                Search By <ChevronDown className="w-[17px]" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-[160px] bg-white border rounded-md shadow-md z-30">
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
                        className="mr-1"
                      />
                      <label className="text-[13px] " htmlFor={option.id}>
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Fields Section (Right by Right) */}

          {selectedOptions.map((optionId) => (
            <React.Fragment key={optionId}>
              {optionId == "Franchisee" ? (
                <div className="col-span-12 lg:col-span-3">
                  <FormLabel className="text-left w-full  mb-[3px] text-[14px] text-[#4c4c4c]">
                    {optionId}:
                  </FormLabel>
                  <CommonSearchableAll
                    inputClassName="w-full border border-[#e6e9ec] bg-[#fafcff] !shadow-none !px-2"
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
                </div>
              ) : optionId == "Destination" ? (
                <div className="col-span-12 lg:col-span-3">
                  <FormLabel className="text-left w-full  mb-[3px] text-[14px] text-[#4c4c4c]">
                    {optionId}:
                  </FormLabel>
                  <CommonSearchableAll
                    inputClassName="w-full border border-[#e6e9ec] bg-[#fafcff] !shadow-none !px-2"
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
                </div>
              ) : (
                <div className="col-span-12 lg:col-span-2">
                  <FormLabel className="text-left w-full  mb-[3px] text-[14px] text-[#4c4c4c]">
                    {optionId}:
                  </FormLabel>
                  <FormInput
                    className="w-full border border-[#e6e9ec] bg-[#fafcff] !shadow-none !px-2"
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
                </div>
              )}
            </React.Fragment>
          ))}

          <div className="col-span-12 lg:col-span-2" data-aos="fade-up">
            {/* Search Button */}
            {selectedOptions.length > 0 && (
              <div className="flex justify-between mt-[24px]">
                <Button
                  onClick={handleSearch}
                  className="bg-mustard text-white px-4 py-2 rounded-md  mr-1 border-none w-full"
                >
                  {/* <Search className="" /> */} Search
                </Button>
                <Button
                  onClick={() => handlereset()}
                  disabled={checkisEmpty(inputs) ? true : false}
                  className="bg-red-400 text-white px-3 py-2 rounded-md  border-none w-full"
                >
                  {/* <RefreshCcw className="mr-2" /> */} Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12  gap-3 mt-4">
        <div className="col-span-12 lg:col-span-6" data-aos="fade-up">
          <div className="">
            <div className="NewtableBox min-h-auto lg:h-full bg-white rounded-md justify-between shadow-blue-900 border border-[#fff]  ">
              <div className="tbaleTittle p-2 bg-[#e9edf2] flex justify-between items-center rounded-t-md ">
                <h2 className="text-[15px] font-medium">
                  Pending Spot Enquiries
                </h2>

                <div className="tableSearch relative w-200">
                  <FormInput
                    className="h-[30px] !p-1 !px-2"
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
                    className="searchListTable absolute top-[6px] right-2 text-stone-300"
                  >
                    {" "}
                    <Search className="w-[17px] h-[17px]" />
                  </button>
                </div>
              </div>

              <div
                className={`tablelist p-3 ${
                  isActive ? "showtable" : "hideTable"
                }`}
              >
                {/* <div
                    className={`overflow-x-auto  overflow-y-hidden ${"h-[60vh]"}`}
                  > */}
                <div className="overflow-x-auto">
                  <div className="table-responsive ">
                    {datatoget?.spotdata1?.length >= 1 &&
                    !datatoget?.loading1 ? (
                      <div className="w-full">
                        {datatoget?.spotdata1?.map(
                          (data: any, index: number) => (
                            <div
                              key={index}
                              data-reveal-index={index}
                              className="relative job-reveal w-full border rounded-lg mb-3 group bg-[#fff] border-[#fff1d3] even:bg-[#fff] even:border-[#eaf1f6] hover:bg-[#fff] hover:border-[#E6E6E6] opacity-0 translate-y-6 transition-all duration-700 ease-out"
                            >
                              <div className="justify-between border-[#fff1d3] border-b w-full  block lg:flex pt-[5px] pb-[3px] px-2 items-center bg-[#fffbf2] group-even:bg-[#f6faff] rounded-t-lg group-even:border-[#eaf1f6] group-hover:bg-[#F8F8F8] group-hover:border-[#E6E6E6]">
                                <div className="flex relative mb-2 lg:mb-0">
                                  <figure className="bg-[#FFF0CE] group-even:bg-[#E8F2FF] rounded-full p-[2px] w-[30px] h-[30px] justify-between flex items-center group-hover:bg-[#e3e3e3]">
                                    <FileText className="w-[18px] h-[18px] text-[#B68F34] group-even:text-[#5A81B4] m-auto group-hover:text-[#303030]" />
                                  </figure>

                                  <aside className="ml-2 leading-[14px]">
                                    <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[14px] ">
                                      Shipment :{" "}
                                      {shipmentTypedata?.find(
                                        (item2: any) =>
                                          item2?.booking_shipment_type_id ==
                                          data?.shipment_type,
                                      )?.shipment_type || "-"}
                                    </h2>

                                    <h3 className="text-[12px] font-bold text-[#e1a722] rounded-[10px] ">
                                      ENQUIRY NO: {data?.booking_no || "N.A."}
                                    </h3>
                                  </aside>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <div className="text-left lg:text-right leading-[16px]">
                                    <h4 className="font-medium text-[13px]">
                                      {" "}
                                      WEIGHT :
                                      <span>
                                        {" "}
                                        {Number(data?.weight) || "-"}{" "}
                                        {data?.weight_unit
                                          ? `(${data.weight_unit})`
                                          : ""}
                                      </span>
                                    </h4>
                                    <p className="text-[13px] text-[#797979]">
                                      {formatDate(data?.created_date) || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="px-3 pt-3 pb-2">
                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-12 lg:col-span-8">
                                    <div className="w-full">
                                      <div className="w-full font-medium text-[14px]">
                                        {" "}
                                        Name :{" "}
                                        {getrelateddata(
                                          "franchisee",
                                          allfdata,
                                          data?.franchisee_id,
                                        )?.franchisee_name || "-"}
                                      </div>

                                      <div className="w-full block lg:flex gap-x-5 mt-1">
                                        <div className="leading-[16px] mb-2 lg:mb-0">
                                          <small className="text-[11px] text-[#797979] flex items-center">
                                            <i className="w-[5px] h-[5px] bg-green-500 group-even:bg-[#6EA8E0] rounded-full mr-1 inline-block group-hover:bg-[#a0a0a0]"></i>{" "}
                                            ORIGIN{" "}
                                          </small>
                                          <p className="text-[14px] text-[#303030]">
                                            {data?.org_city || "-"}
                                          </p>
                                        </div>

                                        <div className="leading-[16px]">
                                          <small className="text-[11px] text-[#797979] flex items-center">
                                            <i className="w-[5px] h-[5px] bg-[#efb847] group-even:bg-[#6EA8E0] rounded-full mr-1 inline-block group-hover:bg-[#a0a0a0]"></i>{" "}
                                            DESTINATION{" "}
                                          </small>
                                          <p className="text-[14px] text-[#303030]">
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
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-span-12 lg:col-span-4">
                                    <div className="flex relative gap-2 justify-start lg:justify-end">
                                      <Button
                                        className="text-[13px] bg-mustard text-white border-none px-3 py-[1px] hover:bg-[#d2d2d2] hover:text-[#303030]"
                                        onClick={() => {
                                          handleEdit(data, "enq");
                                        }}
                                      >
                                        Action
                                      </Button>

                                      <Button
                                        onClick={() => {
                                          setSelectedCardData(data);
                                          setViewCardModal(true);
                                        }}
                                        className="text-[13px] bg-mustard text-white border-none hover:bg-[#d2d2d2] hover:text-[#303030] rounded-md flex items-center pl-2 pr-1 py-[3px]"
                                      >
                                        View{" "}
                                        <ChevronRight className="w-[14px] h-[16px]" />
                                      </Button>
                                    </div>
                                    <div className="w-full text-[13px] mt-2 text-left lg:text-right">
                                      Price (₹) :{" "}
                                      <span>
                                        {indianFormat(data?.spot_price) || "-"}{" "}
                                        {data?.price_type == "1"
                                          ? "(a)"
                                          : data?.price_type == "2"
                                            ? "(k)"
                                            : ""}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-span-12 lg:col-span-12">
                                    <div className=" flex  w-full  border-t border-[#f2f2f2] px-[0] pt-[4px]">
                                      <h2 className="flex text-[#9099a2] text-[11px] font-medium  uppercase leading-[20px]  ">
                                        <i className="mr-1 bg-[#f1f5f9] border-none p-[2px] w-[18px] h-[18px] rounded-full flex justify-center items-center ">
                                          <User
                                            className="w-[12px] h-[12px]  text-[#959595]"
                                            strokeWidth={3}
                                          />
                                        </i>
                                        <span className="text-[#959595]">
                                          Status{" "}
                                        </span>
                                        &nbsp; : &nbsp;{" "}
                                        <span
                                          className={
                                            bookingStatusColorMap[
                                              Number(data?.booking_status)
                                            ] || ""
                                          }
                                        >
                                          {bookingStatuses.find(
                                            (s) =>
                                              s.status_code ==
                                              data?.booking_status,
                                          )?.status_name || "-"}
                                        </span>
                                      </h2>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
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

        <div className="col-span-12 lg:col-span-6 mb-5" data-aos="fade-up">
          <div className=" tableMain lg:h-full ">
            <div className="NewtableBox  min-h-auto lg:h-full  bg-white rounded-md justify-between shadow-blue-900 border border-[#fff]  ">
              <div className="tbaleTittle p-2 bg-[#e9edf2] flex justify-between items-center rounded-t-md ">
                <h2 className="text-[15px] font-medium">
                  Approved/Pending/Rejected
                </h2>

                <div className="tableSearch relative w-200">
                  <FormInput
                    className="h-[30px] !p-1 !px-2"
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
                    className="searchListTable absolute top-[6px] right-2 text-stone-300"
                  >
                    {" "}
                    <Search className="w-[17px] h-[17px]" />
                  </button>
                </div>
              </div>

              <div
                className={`tablelist p-3 ${
                  isActive ? "showtable" : "hideTable"
                }`}
              >
                <div className="w=full">
                  <div className="table-responsive ">
                    {datatoget?.spotdata3?.length >= 1 &&
                    !datatoget?.loading3 ? (
                      <div className="w-full ">
                        {datatoget?.spotdata3?.map(
                          (data: any, index: number) => (
                            <div
                              key={index}
                              data-reveal-index={index}
                              className="relative job-reveal w-full border rounded-lg mb-3 group bg-[#fff] border-[#fff1d3] even:bg-[#fff] even:border-[#eaf1f6] hover:bg-[#fff] hover:border-[#E6E6E6] opacity-0 translate-y-6 transition-all duration-700 ease-out"
                            >
                              <div className="justify-between border-[#fff1d3] border-b w-full  block lg:flex pt-[5px] pb-[3px] px-2 items-center bg-[#fffbf2] group-even:bg-[#f6faff] rounded-t-lg group-even:border-[#eaf1f6] group-hover:bg-[#F8F8F8] group-hover:border-[#E6E6E6]">
                                <div className="flex relative mb-2 lg:mb-0">
                                  <figure className="bg-[#FFF0CE] group-even:bg-[#E8F2FF] rounded-full p-[2px] w-[30px] h-[30px] justify-between flex items-center group-hover:bg-[#e3e3e3]">
                                    <FileText className="w-[18px] h-[18px] text-[#B68F34] group-even:text-[#5A81B4] m-auto group-hover:text-[#303030]" />
                                  </figure>

                                  <aside className="ml-2 leading-[14px]">
                                    <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[14px] ">
                                      Shipment :{" "}
                                      {shipmentTypedata?.find(
                                        (item2: any) =>
                                          item2?.booking_shipment_type_id ==
                                          data?.shipment_type,
                                      )?.shipment_type || "-"}
                                    </h2>

                                    <h3 className="text-[12px] font-bold text-[#e1a722] rounded-[10px] ">
                                      ENQUIRY NO: {data?.booking_no || "N.A."}
                                    </h3>
                                  </aside>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <div className="text-left lg:text-right leading-[16px]">
                                    <h4 className="font-medium text-[13px]">
                                      {" "}
                                      WEIGHT :
                                      <span>
                                        {Number(data?.weight) || "-"}{" "}
                                        {data?.weight_unit
                                          ? `(${data.weight_unit})`
                                          : ""}
                                      </span>
                                    </h4>
                                    <p className="text-[13px] text-[#797979]">
                                      {formatDate(data?.created_date) || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="px-3 pt-3 pb-2">
                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-12 lg:col-span-8">
                                    <div className="w-full">
                                      <div className="w-full font-medium text-[14px]">
                                        {" "}
                                        Name :{" "}
                                        {getrelateddata(
                                          "franchisee",
                                          allfdata,
                                          data?.franchisee_id,
                                        )?.franchisee_name || ""}
                                      </div>

                                      <div className="w-full block lg:flex gap-x-5 mt-1">
                                        <div className="leading-[16px] mb-2 lg:mb-0">
                                          <small className="text-[11px] text-[#797979] flex items-center">
                                            <i className="w-[5px] h-[5px] bg-green-500 group-even:bg-[#6EA8E0] rounded-full mr-1 inline-block group-hover:bg-[#a0a0a0]"></i>{" "}
                                            ORIGIN{" "}
                                          </small>
                                          <p className="text-[14px] text-[#303030]">
                                            {data?.org_city || "-"}
                                          </p>
                                        </div>

                                        <div className="leading-[16px]">
                                          <small className="text-[11px] text-[#797979] flex items-center">
                                            <i className="w-[5px] h-[5px] bg-[#efb847] group-even:bg-[#6EA8E0] rounded-full mr-1 inline-block group-hover:bg-[#a0a0a0]"></i>{" "}
                                            DESTINATION{" "}
                                          </small>
                                          <p className="text-[14px] text-[#303030]">
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
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-span-12 lg:col-span-4">
                                    <div className="flex relative gap-2 justify-start lg:justify-end">
                                      <div className="">
                                        {(data?.shipment_type == 5 ||
                                          data?.shipment_type == 1 ||
                                          data?.shipment_type == 8) &&
                                        data?.import_booking == 2 &&
                                        data?.booking_status != 3 &&
                                        data?.booking_status != 7 &&
                                        data?.booking_status != 18 ? (
                                          <Menu>
                                            <Menu.Button className=" bg-blue-100 text-blue-500 border-blue-300 flex py-[3px] px-2 rounded-md border h-[26px] ">
                                              <UserCog className="w-[17px] h-[17px] stroke-2.5" />
                                              <ChevronDown className="w-[16px] h-[16px]  stroke-2.5 mt-0 ml-2 relative top-[1px]" />
                                            </Menu.Button>
                                            <Menu.Items
                                              className="w-44 mt-px border-2 border-slate-200"
                                              placement="left-start"
                                            >
                                              {/* <Menu.Divider  /> */}
                                              {data?.booking_status == "1" && (
                                                <Menu.Item
                                                  className="hover:bg-mustard hover:text-white !px-[9px] !py-[4px]"
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
                                                  <Menu.Item
                                                    className="hover:bg-mustard hover:text-white !px-[9px] !py-[4px]"
                                                    onClick={() => {
                                                      setEditBookingData(data);
                                                      setDimensionData(
                                                        data?.shipment_dimensions || [
                                                          {
                                                            item_description:
                                                              "",
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
                                                      setShowEditBooking(true);
                                                    }}
                                                  >
                                                    EDIT BOOKING
                                                  </Menu.Item>

                                                  <Menu.Item
                                                    className="hover:bg-mustard hover:text-white !px-[9px] !py-[4px]"
                                                    onClick={() => {
                                                      setTagData({
                                                        job_id: data?.job_id,
                                                        booking_no:
                                                          data?.booking_no,
                                                        franchisee_id:
                                                          data?.franchisee_id,
                                                        mawb:
                                                          data?.master || "",
                                                        hawb:
                                                          data?.airwaybilno ||
                                                          "",
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
                                                className="hover:bg-mustard hover:text-white !p-0"
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
                                                  {((data?.booking_status ==
                                                    "1" ||
                                                    data?.booking_status ==
                                                      "8" ||
                                                    data?.booking_status ==
                                                      "9" ||
                                                    data?.booking_status ==
                                                      "10" ||
                                                    data?.booking_status ==
                                                      "19") &&
                                                    data?.is_draft == null &&
                                                    data?.is_import_reject_approve ==
                                                      0) ||
                                                  data?.booking_status ==
                                                    "15" ||
                                                  (data?.booking_status ==
                                                    "18" &&
                                                    data?.is_draft == null &&
                                                    data?.is_import_reject_approve ==
                                                      0) ||
                                                  data?.booking_status ==
                                                    "15" ||
                                                  (data?.booking_status ==
                                                    "18" &&
                                                    data?.is_draft == 1 &&
                                                    data?.is_import_reject_approve ==
                                                      1) ? (
                                                    <Menu.Item
                                                      className="hover:bg-mustard hover:text-white !p-0"
                                                      onClick={async () => {
                                                        setDimensionData(
                                                          data?.shipment_dimensions || [
                                                            {
                                                              item_description:
                                                                "",
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
                                                          cc_email:
                                                            allfdata?.find(
                                                              (item: any) =>
                                                                item?.franchisee_id ==
                                                                data?.franchisee_id,
                                                            )?.email_id
                                                              ? [
                                                                  allfdata.find(
                                                                    (
                                                                      item: any,
                                                                    ) =>
                                                                      item?.franchisee_id ==
                                                                      data?.franchisee_id,
                                                                  )!.email_id,
                                                                ]
                                                              : [],
                                                        });
                                                        setImportData(data);
                                                        getJobData(
                                                          data?.job_id,
                                                        );
                                                        setShowBtn(false);
                                                        setOpenImport(true);
                                                        handleImportLastMail(
                                                          data?.franchisee_id,
                                                        );
                                                      }}
                                                    >
                                                      {data?.booking_status ==
                                                        "1" ||
                                                      data?.booking_status ==
                                                        "8" ||
                                                      data?.booking_status ==
                                                        "9" ||
                                                      data?.booking_status ==
                                                        "10"
                                                        ? "ADD DETAILS"
                                                        : "COMPLETE BOOKING"}
                                                    </Menu.Item>
                                                  ) : null}
                                                  {(data?.booking_status ==
                                                    "1" ||
                                                    data?.booking_status ==
                                                      "8" ||
                                                    data?.booking_status ==
                                                      "9" ||
                                                    data?.booking_status ==
                                                      "10" ||
                                                    data?.booking_status ==
                                                      "19") && (
                                                    <>
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
                                              className="h-[26px] text-[13px] bg-mustard text-white border-none px-3 py-[1px] hover:bg-[#d2d2d2] hover:text-[#303030]"
                                              onClick={() => {
                                                handleEdit(data, "credit");
                                              }}
                                            >
                                              Action
                                            </Button>
                                          </div>
                                        )}
                                      </div>

                                      <Button
                                        onClick={() => {
                                          setSelectedCardData(data);
                                          setViewApprovedModal(true);
                                        }}
                                        className="text-[13px] bg-mustard text-white border-none hover:bg-[#d2d2d2] hover:text-[#303030] rounded-md flex items-center pl-2 pr-1 py-[3px]"
                                      >
                                        View{" "}
                                        <ChevronRight className="w-[14px] h-[16px]" />
                                      </Button>
                                    </div>
                                    <div className="w-full text-[13px] mt-2 text-left lg:text-right">
                                      Price (₹) :{" "}
                                      <span>
                                        {indianFormat(data?.spot_price) || "-"}{" "}
                                        {data?.price_type == "1"
                                          ? "(a)"
                                          : data?.price_type == "2"
                                            ? "(k)"
                                            : ""}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-span-12 lg:col-span-12">
                                    <div className=" flex  w-full  border-t border-[#f2f2f2] px-[0] pt-[4px]">
                                      <h2 className="flex text-[#9099a2] text-[11px] font-medium  uppercase leading-[20px]  ">
                                        <i className="mr-1 bg-[#f1f5f9] border-none p-[2px] w-[18px] h-[18px] rounded-full flex justify-center items-center ">
                                          <User
                                            className="w-[12px] h-[12px]  text-[#959595]"
                                            strokeWidth={3}
                                          />
                                        </i>
                                        <span className="text-[#959595]">
                                          Status{" "}
                                        </span>
                                        &nbsp; : &nbsp;
                                        <span
                                          className={
                                            data?.booking_status == 15
                                              ? data?.import_booking == 2
                                                ? "text-green-400"
                                                : data?.is_checklist == 1
                                                  ? "text-green-400"
                                                  : "text-red-400"
                                              : statusdata?.find(
                                                  (s: any) =>
                                                    s.status_code ==
                                                    data?.booking_status,
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
                                                (s: any) =>
                                                  s.status_code ==
                                                  data?.booking_status,
                                              )?.status_name}
                                        </span>
                                      </h2>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
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

        <div className="col-span-12 lg:col-span-6 mb-5" data-aos="fade-up">
          <div className=" tableMain lg:h-full ">
            <div className="NewtableBox min-h-auto lg:h-full  bg-white rounded-md justify-between shadow-blue-900 border border-[#fff]  ">
              <div className="tbaleTittle p-2 bg-[#e9edf2] flex justify-between items-center rounded-t-md ">
                <h2 className="text-[15px] font-medium">
                  Initiated Jobs by OPS Team
                </h2>

                <div className="tableSearch relative w-200">
                  <FormInput
                    className="h-[30px] !p-1 !px-2"
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
                    className="searchListTable absolute top-[6px] right-2 text-stone-300"
                  >
                    {" "}
                    <Search className="w-[17px] h-[17px]" />
                  </button>
                </div>
              </div>

              <div
                className={`tablelist p-3 ${
                  isActive ? "showtable" : "hideTable"
                }`}
              >
                <div className={`overflow-x-auto overflow-y-hidden  ${""}`}>
                  <div className="table-responsive ">
                    {datatoget?.spotdata2?.length >= 1 &&
                    !datatoget?.loading2 ? (
                      <div className="w-full  ">
                        {/* <Table.Tr className="text-center text-white">
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
                              </Table.Th> 
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
                          </Table.Thead> */}

                        {datatoget?.spotdata2?.map(
                          (data: any, index: number) => (
                            <div
                              className="relative job-reveal w-full border   rounded-lg mb-3   group bg-[#fff] border-[#fff1d3] even:bg-[#fff] even:border-[#eaf1f6]    hover:bg-[#fff]  hover:border-[#E6E6E6] opacity-0 translate-y-6 transition-all duration-700 ease-out"
                              key={index}
                              data-reveal-index={index}
                            >
                              <div
                                className=" justify-between border-[#fff1d3] border-b w-full flex pt-[5px] pb-[3px] px-2  items-center  
                                bg-[#fffbf2] group-even:bg-[#f6faff] rounded-t-lg   group-even:border-[#eaf1f6]  group-hover:bg-[#F8F8F8]  group-hover:border-[#E6E6E6]"
                              >
                                <div className="  flex      relative ">
                                  <figure className="bg-[#FFF0CE] group-even:bg-[#E8F2FF] rounded-full p-[2px] w-[30px] h-[30px] justify-between  flex   items-center   group-hover:bg-[#e3e3e3]">
                                    <MapPin className="w-[18px] h-[18px] text-[#B68F34] group-even:text-[#5A81B4] m-auto group-hover:text-[#303030]" />
                                  </figure>

                                  <aside className="ml-2 leading-[14px]">
                                    <small className="text-[12px] text-[#797979]">
                                      DESTINATION COUNTRY
                                    </small>
                                    <h2 className="text-[#515151] text-[15px] font-medium   leading-[20px]">
                                      {/* {(datatoget?.page2 - 1) * 5 + (index + 1)} */}

                                      {countryData?.find(
                                        (item: any) =>
                                          item.country_id ==
                                          data?.destination_country,
                                      )?.country_name || ""}
                                    </h2>
                                  </aside>
                                </div>

                                <div className="text-right leading-[16px]">
                                  <h4 className="font-medium">
                                    {" "}
                                    WEIGHT :
                                    <span>
                                      {" "}
                                      {(data?.shipment_dimensions?.length >=
                                        1 &&
                                        data?.shipment_dimensions?.reduce(
                                          (acc, item) => {
                                            return (
                                              acc + Number(item?.weight || 0)
                                            ); // Ensure `height` exists, else add 0
                                          },
                                          0,
                                        )) ||
                                        ""}
                                    </span>
                                  </h4>

                                  <p className="text-[13px] text-[#797979]">
                                    {formatDate(data?.created_date) || ""}
                                  </p>
                                </div>
                              </div>

                              <div className="px-3 pt-3 pb-2">
                                <div className=" justify-between  w-full flex  items-center ">
                                  <div className="        relative ">
                                    <h2 className=" text-sm mb-[2px] uppercase text-[#797979]">
                                      FRANCHISEE
                                    </h2>
                                    <p className="text-[13px] leading-[15px] text-[#262525] flex items-center">
                                      <i className="w-[7px] h-[7px] bg-[#efb847] group-even:bg-[#6EA8E0] rounded-full mr-2 inline-block group-hover:bg-[#a0a0a0]"></i>

                                      {getrelateddata(
                                        "franchisee",
                                        allfdata,
                                        data?.franchisee_id,
                                      )?.franchisee_name || ""}
                                    </p>
                                  </div>

                                  <div className="        relative ">
                                    <Button
                                      className="h-[26px]  p-1 bg-mustard text-white border-none px-4 py-1 hover:bg-[#d2d2d2] hover:text-[#303030]"
                                      onClick={() => {
                                        handleEdit(data, "job");
                                      }}
                                    >
                                      Action
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
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

        <div className="col-span-12 lg:col-span-6 mb-5" data-aos="fade-up">
          <div className=" tableMain lg:h-full ">
            <div className="NewtableBox min-h-auto lg:h-full  bg-white rounded-md justify-between shadow-blue-900 border border-[#fff]  ">
              <div className="tbaleTittle p-2 bg-[#e9edf2] flex justify-between items-center rounded-t-md ">
                <h2 className="text-[15px] font-medium">
                  Insufficient Balance
                </h2>

                <div className="tableSearch relative w-200">
                  <FormInput
                    className="h-[30px] !p-1 !px-2"
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
                    className="searchListTable absolute top-[6px] right-2 text-stone-300"
                  >
                    {" "}
                    <Search className="w-[17px] h-[17px]" />
                  </button>
                </div>
              </div>
              <div
                className={`tablelist p-3 ${
                  isActive ? "showtable" : "hideTable"
                }`}
              >
                <div className="w-full">
                  <div className="table-responsive ">
                    {datatoget?.spotdata4?.length >= 1 &&
                    !datatoget?.loading4 ? (
                      <div className="w-full  ">
                        {datatoget?.spotdata4?.map(
                          (data: any, index: number) => (
                            <div
                              key={index}
                              data-reveal-index={index}
                              className="relative job-reveal w-full border rounded-lg mb-3 group bg-[#fff] border-[#fff1d3] even:bg-[#fff] even:border-[#eaf1f6] hover:bg-[#fff] hover:border-[#E6E6E6] opacity-0 translate-y-6 transition-all duration-700 ease-out"
                            >
                              <div className="justify-between border-[#fff1d3] border-b w-full  block lg:flex pt-[5px] pb-[3px] px-2 items-center bg-[#fffbf2] group-even:bg-[#f6faff] rounded-t-lg group-even:border-[#eaf1f6] group-hover:bg-[#F8F8F8] group-hover:border-[#E6E6E6]">
                                <div className="flex relative mb-2 lg:mb-0">
                                  <figure className="bg-[#FFF0CE] group-even:bg-[#E8F2FF] rounded-full p-[2px] w-[30px] h-[30px] justify-between flex items-center group-hover:bg-[#e3e3e3]">
                                    <FileText className="w-[18px] h-[18px] text-[#B68F34] group-even:text-[#5A81B4] m-auto group-hover:text-[#303030]" />
                                  </figure>

                                  <aside className="ml-2 leading-[14px]">
                                    <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase  leading-[14px] ">
                                      Shipment :
                                      {shipmentTypedata?.find(
                                        (item2: any) =>
                                          item2?.booking_shipment_type_id ==
                                          data?.shipment_type,
                                      )?.shipment_type || "-"}
                                    </h2>

                                    <h3 className="text-[12px] font-bold text-[#e1a722] rounded-[10px]">
                                      ENQUIRY NO: {data?.booking_no || "N.A."}
                                    </h3>
                                  </aside>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <div className="text-left lg:text-right leading-[16px]">
                                    <h4 className="font-medium text-[13px]">
                                      {" "}
                                      WEIGHT :
                                      <span>
                                        {Number(data?.weight) || "-"}{" "}
                                        {data?.weight_unit
                                          ? `(${data.weight_unit})`
                                          : ""}
                                      </span>
                                    </h4>
                                    <p className="text-[13px] text-[#797979]">
                                      {formatDate(data?.created_date) || "-"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="px-3 pt-3 pb-2">
                                <div className="grid grid-cols-12 gap-2">
                                  <div className="col-span-12 lg:col-span-8">
                                    <div className="w-full">
                                      <div className="w-full font-medium text-[14px]">
                                        Name:
                                        {getrelateddata(
                                          "franchisee",
                                          allfdata,
                                          data?.franchisee_id,
                                        )?.franchisee_name || ""}
                                      </div>

                                      <div className="w-full block lg:flex gap-x-5 mt-1">
                                        <div className="leading-[16px] mb-2 lg:mb-0">
                                          <small className="text-[11px] text-[#797979] flex items-center">
                                            <i className="w-[5px] h-[5px] bg-green-500 group-even:bg-[#6EA8E0] rounded-full mr-1 inline-block group-hover:bg-[#a0a0a0]"></i>{" "}
                                            ORIGIN{" "}
                                          </small>
                                          <p className="text-[14px] text-[#303030]">
                                            {data?.org_city || "-"}
                                          </p>
                                        </div>

                                        <div className="leading-[16px]">
                                          <small className="text-[11px] text-[#797979] flex items-center">
                                            <i className="w-[5px] h-[5px] bg-[#efb847] group-even:bg-[#6EA8E0] rounded-full mr-1 inline-block group-hover:bg-[#a0a0a0]"></i>{" "}
                                            DESTINATION{" "}
                                          </small>
                                          <p className="text-[14px] text-[#303030]">
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
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-span-12 lg:col-span-4">
                                    <div className="flex relative gap-2 justify-start lg:justify-end">
                                      <div className="">
                                        <Button
                                          className="h-[26px]  text-[13px] bg-mustard text-white border-none hover:bg-[#d2d2d2] hover:text-[#303030] rounded-md flex items-center pl-2 pr-1 py-[3px]"
                                          onClick={() => {
                                            handleEdit(data, "credit");
                                          }}
                                        >
                                          Action
                                        </Button>
                                      </div>

                                      <Button
                                        onClick={() => {
                                          setSelectedCardData(data);
                                          setViewInsufficientModal(true);
                                        }}
                                        className="text-[13px] bg-mustard text-white border-none hover:bg-[#d2d2d2] ghover:text-[#303030] rounded-md flex items-center pl-2 pr-1 py-[3px]"
                                      >
                                        View{" "}
                                        <ChevronRight className="w-[14px] h-[16px]" />
                                      </Button>
                                    </div>
                                    <div className="w-full text-[13px] mt-2 text-left lg:text-right">
                                      Price (₹) :{" "}
                                      <span>
                                        {indianFormat(data?.spot_price) || "-"}{" "}
                                        {data?.price_type == "1"
                                          ? "(a)"
                                          : data?.price_type == "2"
                                            ? "(k)"
                                            : ""}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="col-span-12 lg:col-span-12">
                                    <div className=" flex  w-full  border-t border-[#f2f2f2] px-[0] pt-[4px]">
                                      <h2 className="flex text-[#9099a2] text-[11px] font-medium  uppercase leading-[20px]  ">
                                        <i className="mr-1 bg-[#f1f5f9] border-none p-[2px] w-[18px] h-[18px] rounded-full flex justify-center items-center ">
                                          <User
                                            className="w-[12px] h-[12px]  text-[#959595]"
                                            strokeWidth={3}
                                          />
                                        </i>
                                        <span className="text-[#959595]">
                                          Status{" "}
                                        </span>
                                        &nbsp; : &nbsp;
                                        <span
                                          className={
                                            data?.booking_status == 15
                                              ? data?.import_booking == 2
                                                ? "text-green-400"
                                                : data?.is_checklist == 1
                                                  ? "text-green-400"
                                                  : "text-red-400"
                                              : statusdata?.find(
                                                  (s: any) =>
                                                    s.status_code ==
                                                    data?.booking_status,
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
                                                (s: any) =>
                                                  s.status_code ==
                                                  data?.booking_status,
                                              )?.status_name}
                                        </span>
                                      </h2>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
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
        {viewCardModal ? (
          <CommonModal
            className="!p-0"
            open={viewCardModal}
            setOpen={setViewCardModal}
            title={
              <div className="flex items-center p-0  w-full ">
                <figure className="flex items-center justify-center  relative mr-1   bg-[linear-gradient(to_bottom,#ffd675_0%,#f9cf51_50%,#f2be42_100%)] rounded-full border border-[#cda329] w-[35px] h-[35px] ">
                  <User className="w-[20px] h-[20px] text-[#8a6a0c]" />
                </figure>

                <div className=" w-full  pl-2 gap-0">
                  <h2 className="text-[#fff] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                    Name
                  </h2>

                  <p className="text-[#fff] text-[14px] font-medium  uppercase leading-[20px] ">
                    {getrelateddata(
                      "franchisee",
                      allfdata,
                      selectedCardData?.franchisee_id,
                    )?.franchisee_name || "-"}
                  </p>
                </div>
              </div>
            }
            titleClassName="bg-[#fff6e2] rounded-t-md"
            size="lg"
            gridColumns={0}
            description={
              <>
                <div className="w-full mt-4 mb-3">
                  <div className=" grid grid-cols-12 gap-x-2 ">
                    <div className=" col-span-12  md:col-span-6 mb-2 ">
                      <div className=" flex justify-center w-full  mb-1">
                        <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                          <FileText className="w-[21px]  text-[#949DA6] " />
                        </figure>
                        <div className=" w-full  pl-2">
                          <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                            ENQUIRY No
                          </h2>
                          <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                            {" "}
                            {selectedCardData?.booking_no || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" col-span-12  md:col-span-6 mb-2 ">
                      <div className=" flex justify-center w-full  mb-1">
                        <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                          <User className="w-[21px]  text-[#949DA6] " />
                        </figure>
                        <div className=" w-full  pl-2">
                          <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                            Quoted By
                          </h2>
                          <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                            {selectedCardData?.quoted_by || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" col-span-12  md:col-span-6 mb-2 ">
                      <div className=" flex justify-center w-full  mb-1">
                        <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                          <Calendar className="w-[21px]  text-[#949DA6] " />
                        </figure>
                        <div className=" w-full  pl-2">
                          <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                            Rate Valid Till
                          </h2>
                          <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                            {formatDate(selectedCardData?.valid_till) || "N.A."}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" col-span-12  md:col-span-6 mb-2 ">
                      <div className=" flex justify-center w-full  mb-1">
                        <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                          <User className="w-[21px]  text-[#949DA6] " />
                        </figure>
                        <div className=" w-full  pl-2">
                          <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                            Vendor
                          </h2>
                          <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                            {productTypes?.find(
                              (item: any) =>
                                item.product_id == selectedCardData?.courier_id,
                            )?.product_name || "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" col-span-12  md:col-span-6 mb-2 ">
                      <div className=" flex justify-center w-full  mb-1">
                        <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                          <FileText className="w-[21px]  text-[#949DA6] " />
                        </figure>
                        <div className=" w-full  pl-2">
                          <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                            FRANCHISEE
                          </h2>
                          <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                            {getrelateddata(
                              "franchisee",
                              allfdata,
                              selectedCardData?.franchisee_id,
                            )?.franchisee_name || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
            footer={
              <Button
                onClick={() => {
                  setViewCardModal(false);
                  setSelectedCardData(null);
                }}
                className="bg-mustard text-white border-none px-3 py-1 rounded-md"
              >
                Close
              </Button>
            }
          />
        ) : null}

        {viewApprovedModal ? (
          <CommonModal
            className="!p-0"
            open={viewApprovedModal}
            setOpen={setViewApprovedModal}
            title={
              <div className="flex items-center p-0  w-full ">
                <figure className="flex items-center justify-center  relative mr-1   bg-[linear-gradient(to_bottom,#ffd675_0%,#f9cf51_50%,#f2be42_100%)] rounded-full border border-[#cda329] w-[35px] h-[35px] ">
                  <User className="w-[20px] h-[20px] text-[#8a6a0c]" />
                </figure>

                <div className=" w-full  pl-2 gap-0">
                  <h2 className="text-[#fff] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                    Name
                  </h2>

                  <p className="text-[#fff] text-[14px] font-medium  uppercase leading-[20px] ">
                    {getrelateddata(
                      "franchisee",
                      allfdata,
                      selectedCardData?.franchisee_id,
                    )?.franchisee_name || "-"}
                  </p>
                </div>
              </div>
            }
            titleClassName="bg-[#fff6e2] rounded-t-md"
            size="lg"
            gridColumns={0}
            description={
              <div className="w-full mt-4 mb-3">
                <div className=" grid grid-cols-12 gap-x-2 ">
                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <Scroll className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          ENQUIRY No
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {selectedCardData?.booking_no || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <Box className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          Shipment Type
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {shipmentTypedata?.find(
                            (item2: any) =>
                              item2?.booking_shipment_type_id ==
                              selectedCardData?.shipment_type,
                          )?.shipment_type || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <User className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          Vendor
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {productTypes?.find(
                            (item) =>
                              item.product_id == selectedCardData?.courier_id,
                          )?.product_name || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <User className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          Quoted By
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {selectedCardData?.quoted_by || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <Calendar className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          Rate Valid Till
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {formatDate(selectedCardData?.valid_till) || "N.A."}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <Bookmark className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          Dispatch Label
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {selectedCardData?.house_pdf ? (
                            <div
                              onClick={() =>
                                downloadAttachment(
                                  selectedCardData?.house_pdf.replace(
                                    "_mawb",
                                    "",
                                  ),
                                  "Dispatch Label",
                                )
                              }
                              className="w-[60px] group bg-[#fff1ce] cursor-pointer hover:bg-[#f1bf59] hover:text-white py-[2px] rounded-md items-center flex items-center justify-center gap-1"
                            >
                              <FileText className="group-hover:text-white  text-mustard stroke-2.5 w-[15px] h-[15px]" />
                              <p className="text-[11px] text-[#b68013] group-hover:text-white">
                                {" "}
                                View
                              </p>
                            </div>
                          ) : (
                            <div className="text-red-400 text-left ">
                              Not Available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
              </div>
            }
            footer={
              <Button
                onClick={() => {
                  setViewApprovedModal(false);
                  setSelectedCardData(null);
                }}
                className="bg-mustard text-white border-none px-3 py-1 rounded-md"
              >
                Close
              </Button>
            }
          />
        ) : null}

        {ViewInsufficientModal ? (
          <CommonModal
            className="!p-0"
            open={ViewInsufficientModal}
            setOpen={setViewInsufficientModal}
            title={
              <div className="flex items-center p-0 !gap-0 w-[130%] lg:w-[120%] bg-[#fff1ce] mx-[-28px] my-[-16px] px-[20px] py-[5px] rounded-t-md">
                <figure className="flex items-center justify-center  relative mr-1  block bg-[linear-gradient(to_bottom,#ffd675_0%,#f9cf51_50%,#f2be42_100%)] rounded-full border border-[#cda329] w-[35px] h-[35px] ">
                  <User className="w-[20px] h-[20px] text-[#8a6a0c]" />
                </figure>

                <div className=" w-full  pl-2 gap-0">
                  <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                    Name
                  </h2>

                  <p className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                    {getrelateddata(
                      "franchisee",
                      allfdata,
                      selectedCardData?.franchisee_id,
                    )?.franchisee_name || "-"}
                  </p>
                </div>
              </div>
            }
            titleClassName="bg-[#fff6e2] rounded-t-md"
            size="lg"
            gridColumns={0}
            description={
              <div className="w-full mt-4 mb-3">
                <div className="grid grid-cols-12 gap-2">
                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <FileText className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          ENQUIRY No
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {selectedCardData?.booking_no || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <FileText className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          Vendor
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {productTypes?.find(
                            (item: any) =>
                              item.product_id == selectedCardData?.courier_id,
                          )?.product_name || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <User className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          Quoted By
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {selectedCardData?.quoted_by || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className=" col-span-12  md:col-span-6 mb-2 ">
                    <div className=" flex justify-center w-full  mb-1">
                      <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                        <FileText className="w-[21px]  text-[#949DA6] " />
                      </figure>
                      <div className=" w-full  pl-2">
                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                          Rate Valid Till
                        </h2>
                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                          {formatDate(selectedCardData?.valid_till) || "N.A."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
            footer={
              <Button
                onClick={() => {
                  setViewInsufficientModal(false);
                  setSelectedCardData(null);
                }}
                className="bg-mustard text-white border-none px-3 py-1 rounded-md"
              >
                Close
              </Button>
            }
          />
        ) : null}

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
                    <p className="text-base font-medium text-white">
                      {importData?.booking_status == "1" ||
                      importData?.booking_status == "8" ||
                      importData?.booking_status == "9" ||
                      importData?.booking_status == "19"
                        ? "ADD IMPORT DETAILS"
                        : "COMPLETE BOOKING"}
                    </p>
                  </div>

                  <div className="bOfficeClose absolute top-[50%] right-2 -translate-y-[50%]">
                    <XCircle
                      className="stroke-1.5 w-5 h-5 cursor-pointer text-red-500  hover:text-red-700 "
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
                    <p className="text-base font-medium text-white ">
                      EDIT BOOKING
                    </p>
                  </div>

                  <div className="bOfficeClose absolute top-[50%] right-2 -translate-y-[50%]">
                    <XCircle
                      className="stroke-1.5 w-5 h-5 cursor-pointer text-red-500  hover:text-red-700 "
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
                <div className="flex justify-flex justify-between w-full relative">
                  <div>
                    <p className="text-base text-white font-medium">
                      TAG HOUSE / MASTER
                    </p>
                  </div>
                  <div className="bOfficeClose absolute top-[50%] right-2 -translate-y-[50%]">
                    <XCircle
                      className="stroke-1.5 w-5 h-5 cursor-pointer text-red-500  hover:text-red-700 "
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
