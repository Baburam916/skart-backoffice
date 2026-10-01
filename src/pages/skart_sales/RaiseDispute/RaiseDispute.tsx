import React, { useState, useEffect } from "react";
import Button from "../../../base-components/Button";
import {
  ArrowLeft,
  Edit,
  Eye,
  MessageCircle,
  Plus,
  PlusCircle,
  RefreshCcw,
  Search,
  Send,
} from "lucide-react";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import SingleSelect from "../commoncomponents/CommonsingleSelct/Commonsingleselect";
import Table from "../../../base-components/Table";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import CommonSearchableAll from "../commoncomponents/CommonSearchableall/CommonSearchableall";
import { Link, useLocation } from "react-router-dom";
import {
  commongetrequest,
  commonpatchrequest,
  commonpostrequest,
  commonputrequest,
} from "../../../AllServices/services";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import { FileText } from "lucide-react";
import IsLoading from "../commoncomponents/isLoading/isLoading";
import CommonPagination from "../../../components/Pagination";
import { Slideover } from "../../../base-components/Headless";
import "./dispute.css";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";
import { jsontocsv } from "../commoncomponents/JsonToCsv/Jsontocsv";
import { tranfereddata } from "../../../components/booking_summary_table/TransformKey";
import LoadingButtonCommon from "../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import { Download } from "lucide-react";
import { MinusCircle } from "lucide-react";
import { formatIndianNumber } from "../commoncomponents/CommonNumberConverter/CommonNumberconverter";
import TomSelect from "../../../base-components/TomSelect";
import closeIcon from "../../../assets/images/close_document.png";
import inProcessICON from "../../../assets/images/inprocess.png";
import totalQueryICON from "../../../assets/images/e-commerce_icon.png";
import openIcon from "../../../assets/images/new_bill.png"

const intfranchiseedata = {
  franchisee_id: "",
  franchisee_name: "",
};

const initialerrdata = {};
const initialerrdata1 = {};

const intmodaldata = {
  user_id: "",
  email: "",
};

function RaiseDispute() {
  const { showAlert } = useAlert();
  const [openModal, setOpenModal] = useState(false);
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [spotData, setSpotData] = useState(intfranchiseedata);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [reopenDescription, setReopenDescription] = useState("");
  const [disputeRaisedForLookup, setDisputeRaisedForLookup] = useState([]);
  const [filedata, setFiledata] = useState<any>("");
  const [isError, setIsError] = useState<any>(initialerrdata);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [ticketNo, setTicketNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const [getDisputeall, setGetDisputeAll] = useState<any[]>([]);
  const [priorityType, setPriorityType] = useState("");
  const [selectPriority, setSelectPriority] = useState("");
  const [statusType, setStatusType] = useState("");
  // const [selectedRaisedFor, setSelectedRaisedFor] = useState("");
  const [disputeRaise, setDisputeRaise] = useState([]);
  const [disputePriority, setDisputePriority] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [chatdisputeId, setChatdisputeId] = useState<string | number | null>(
    null,
  );
  const [chatdisputeToken, setChatdisputeToken] = useState<
    string | number | null
  >(null);
  const [overlappingSlideoverPreview, setOverlappingSlideoverPreview] =
    useState(false);
  const [disputeCommentLoading, setDisputeCommentLoading] = useState(false);
  const [chatDescription, setChatDescription] = useState("");
  const [handleDisputeCommentLoading, setHandleDisputeCommentLoading] =
    useState(false);
  const [allDataDisputeComment, setAllDataDisputeComment] = useState<any[]>([]);
  const [closeModal, setCloseModal] = useState(false);
  const [selectedDisputeId, setSelectedDisputeId] = useState<
    string | number | null
  >(null);
  const [closeLoading, setCloseLoading] = useState(false);
  const [downloadisLoading, setDownloadisLoading] = useState(false);
  const [disputeStatus, setDisputeStatus] = useState<any[]>([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [label, setLabel] = useState("");
  const [uploaddata, setUploaddata] = useState<any>("");
  const [uploadError, setUploadError] = useState<any>(initialerrdata1);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploaddisputeId, setUploaddisputeId] = useState<
    string | number | null
  >(null);
  const [editdisputeId, setEditdisputeId] = useState<string | number | null>(
    null,
  );
  const [viewdisputeId, setViewdisputeId] = useState<string | number | null>(
    null,
  );
  const [rows, setRows] = useState([{ label: "", file: null }]);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [disputeCategory, setDisputeCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState("");
  const [selectUser, setSelectUser] = useState("");
  const [disputeAmount, setDisputeAmount] = useState<any>("");
  const [editModal, setEditModal] = useState(false);
  const [shipmentType, setShipmentType] = useState("");
  const [resetTrigger, setResetTrigger] = useState(0);
  const [editFormData, setEditFormData] = useState({
    franchisee_id: "",
    franchisee_name: "",
    raised_for_type_id: "",
    unique_string: "",
    description: "",
    priority_id: "",
    dispute_amount: "",
    category_id: "",
  });
  const [userData1, setUserdata1] = useState<any>([]);
  const [postdata, setPostdata] = useState<any>(intmodaldata);
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [dashbordLoading, setDashbordLoading] = useState(false);
  const [raisedForType, setRaisedForType] = useState("");
  const [amountMappingList, setAmountMappingList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const { userdata } = useLogin();
  const getRelevantType = (user: any) =>
    (user.type || []).find((t: any) => t.type_id === 1 || t.type_id === 9);
const getApproverByLevel = (level: number) => {
    if (!level || amountMappingList.length === 0) return null;
    const idx = amountMappingList.length - level;
    if (idx < 0 || idx >= amountMappingList.length) return null;
    const entry = amountMappingList[idx];
    if (!entry) return null;
    if (entry.user_id) {
      const u = usersList.find((u: any) => getRelevantType(u)?.emp_id === entry.user_id);
      return u
        ? `${u.name || u.user_name}${u.email ? ` (${u.email})` : ""}`
        : String(entry.user_id);
    }
    if (Array.isArray(entry.approval_mail)) {
      return entry.approval_mail.join(", ") || null;
    }
    return entry.approval_mail || null;
  };
  const fetchAmountMapping = async () => {
    try {
      const res = await commongetrequest("booking/disputes/dispute-amount-mapping");
      if (res?.status === 200 || res?.status === 204) {
        setAmountMappingList(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching amount mapping:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await commongetrequest("auth/user");
      if (res?.status === 200) {
        setUsersList(res?.data?.data?.result || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    getintdata();
    getDashboard();
    fetchAmountMapping();
    fetchUsers();
  }, []);

  const getintdata = async () => {
    try {
      const res = await commongetrequest("auth/user?type_id=1");
      const res2 = await commongetrequest("auth/user?type_id=9");
      const data1 = res?.status === 200 ? res?.data?.data?.result || [] : [];
      const data2 = res2?.status === 200 ? res2?.data?.data?.result || [] : [];
      setUserdata1([...data1, ...data2]);
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  const handleEditClick = async (item: any) => {
    try {
      setEditdisputeId(item?.dispute_id);

      const selectedUser = userData1.find((user: any) =>
        user?.type?.some((t: any) => t?.emp_id == item?.user_id)
      );

      setPostdata({
        user_id: item?.user_id || "",
        email: selectedUser?.email || item?.user_email || "",
      });

      setSelectedfranchisedata({
        franchisee_id: item?.franchisee_id || "",
        franchisee_name: item?.franchisee_name || "",
      });

      setSelectPriority(item?.priority_id?.toString() || "");
      setDisputeAmount(item?.dispute_amount || "");
      setSelectCategory(item?.category_id?.toString() || "");
      setInputDescription(item?.description || "");

      setRaisedForType(item?.raised_for_type_id?.toString() || "");

      setInvoiceNo(item?.unique_string || "");

      setEditModal(true);
    } catch (error) {
      console.error("Error setting edit data:", error);
      showAlert("Failed to load dispute data", "error");
    }
  };

  const fetchAdditionalDisputeData = async (disputeId: any) => {
    try {
      // If you need to fetch more detailed data from API
      const res = await commongetrequest(`booking/disputes/${disputeId}`);
      if (res?.status === 200 || res?.status === 204) {
        const detailedData = res?.data?.data;
      }
    } catch (error) {
      console.error("Error fetching additional dispute data:", error);
    }
  };

  const fetchDisputeData = async (disputeId: any) => {
    try {
      setLoading(true);
      const res = await commongetrequest(`booking/disputes/${disputeId}`);
      if (res?.status === 200 || res?.status === 204) {
        const disputeData = res?.data?.data;

        // Set the form data with the fetched dispute data
        setEditFormData({
          franchisee_id: disputeData?.franchisee_id || "",
          franchisee_name: disputeData?.franchisee_name || "",
          raised_for_type_id: disputeData?.raised_for_type_id?.toString() || "",
          unique_string: disputeData?.unique_string || "",
          description: disputeData?.description || "",
          priority_id: disputeData?.priority_id?.toString() || "",
          dispute_amount: disputeData?.dispute_amount || "",
          category_id: disputeData?.category_id?.toString() || "",
        });

        // Set the individual states for form fields
        setSelectPriority(disputeData?.priority_id?.toString() || "");
        setInvoiceNo(
          disputeData?.raised_for_type_id === "1"
            ? disputeData?.unique_string
            : "",
        );

        setDisputeAmount(disputeData?.dispute_amount || "");
        setSelectCategory(disputeData?.category_id?.toString() || "");
        setInputDescription(disputeData?.description || "");

        // Set franchisee data
        setSelectedfranchisedata({
          franchisee_id: disputeData?.franchisee_id || "",
          franchisee_name: disputeData?.franchisee_name || "",
        });

        setEditModal(true);
      }
    } catch (error) {
      console.error("Error fetching dispute data:", error);
      showAlert("Failed to load dispute data", "error");
    } finally {
      setLoading(false);
    }
  };

  const isFirstRowFilled = () => {
    const firstRow = rows[0];
    return firstRow.label?.trim() && firstRow.file;
  };

  const addRow = () => {
    if (rows.length === 0 || isFirstRowFilled()) {
      setRows([...rows, { label: "", file: null }]);
    } else {
      showAlert(
        "Please fill the first row before adding a new row.",
        "warning",
      );
    }
  };

  // --- Remove Row ---
  const removeRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  // --- Handle Label Change ---
  const handleLabelChange = (index: number, value: string) => {
    const updated = [...rows];
    updated[index].label = value;
    setRows(updated);
  };

  const disputeLooks = async () => {
    try {
      const res = await commongetrequest("booking/disputes/lookups");
      if (res?.status === 200 || res?.status === 204) {
        setDisputeRaisedForLookup(
          res?.data?.data?.dispute_raised_for_lookup || [],
        );
        setDisputePriority(res?.data?.data?.dispute_priority_lookup || []);
        setDisputeStatus(res?.data?.data?.dispute_status_lookup || []);
        setDisputeRaise(res?.data?.data?.dispute_raised_for_lookup || []);
        setDisputeCategory(res?.data?.data?.dispute_category_lookup || []);
      }
    } catch (error) {
      console.error("Error fetching dispute lookups:", error);
      setDisputeRaisedForLookup([]);
      setDisputePriority([]);
      setDisputeStatus([]);
      setDisputeRaise([]);
      setDisputeCategory([]);
    }
  };

  const getCategoryName = (id: number | string | null) => {
    if (!id) return "";
    const found = disputeCategory.find(
      (item: any) => Number(item.id) === Number(id),
    );
    return found?.name || "";
  };

  const postDispute = async () => {
    let errors: any = {};

    if (!selectedfranchisedata?.franchisee_id) {
      errors.franchisee = "Please select a Franchisee.";
    }

    if (!selectPriority) {
      errors.selectPriority = "Please select Priority.";
    }

    if (!invoiceNo.trim()) {
      errors.invoiceNo = "Invoice No is required.";
    }

    if (!disputeAmount.trim()) {
      errors.disputeAmount = "Query Amount is required.";
    }

    if (!selectCategory) {
      errors.selectCategory = "Category is required.";
    }

    if (!inputDescription.trim()) {
      errors.description = "Description is required.";
    }

    if (Object.keys(errors).length > 0) {
      setIsError(errors);
      showAlert("Please fill all required fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("franchisee_id", selectedfranchisedata?.franchisee_id);
    // formData.append("raised_for_type_id", "1");
    formData.append("unique_string", invoiceNo);

    formData.append("description", inputDescription);
    formData.append("attachment", filedata);
    formData.append("priority_id", selectPriority);
    formData.append("dispute_amount", disputeAmount);
    formData.append("category_id", selectCategory);
    formData.append("user_id", postdata?.user_id);
    formData.append("user_email", postdata?.email);

    try {
      setLoading(true);
      const res = await commonpostrequest("booking/disputes", formData);
      if (res?.status === 200 || res?.status === 201) {
        setOpenModal(false);
        setSelectPriority("");
        setInvoiceNo("");
        setDisputeAmount("");
        setSelectCategory("");
        setInputDescription("");
        setFiledata("");
        setSelectedfranchisedata(intfranchiseedata);
        setSpotData(intfranchiseedata);
        setIsError(initialerrdata);
        getDispute(page, limit);
        showAlert(res?.data?.message, "success");
      } else {
        showAlert(res?.response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error posting dispute:", error);
    } finally {
      setLoading(false);
    }
  };

  const editDispute = async () => {
    let errors: any = {};

    // Validation (same as postDispute)
    // if (!selectedfranchisedata?.franchisee_id) {
    //   errors.franchisee = "Please select a Franchisee.";
    // }
    // if (!shipmentType) {
    //   errors.shipmentType = "Please select Dispute Raised For.";
    // }
    // if (!selectPriority) {
    //   errors.selectPriority = "Please select Priority.";
    // }
    // if (shipmentType === "1" && !invoiceNo.trim()) {
    //   errors.invoiceNo = "Invoice No is required.";
    // }
    // if (shipmentType === "2" && !awbNo.trim()) {
    //   errors.awbNo = "Shipment AWB No is required.";
    // }
    if (!disputeAmount.trim()) {
      errors.disputeAmount = "Query Amount is required.";
    }
    if (!selectCategory) {
      errors.selectCategory = "Category is required.";
    }
    if (!inputDescription.trim()) {
      errors.description = "Description is required.";
    }

    if (Object.keys(errors).length > 0) {
      setIsError(errors);
      showAlert("Please fill all required fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("id", editdisputeId?.toString() || "");
    // formData.append("franchisee_id", selectedfranchisedata?.franchisee_id);
    // formData.append("raised_for_type_id", shipmentType);

    // if (shipmentType === "1") {
    //   formData.append("unique_string", invoiceNo);
    // } else if (shipmentType === "2") {
    //   formData.append("unique_string", awbNo);
    // }
    formData.append("franchisee_id", selectedfranchisedata?.franchisee_id);
    formData.append("priority_id", selectPriority);
    formData.append("description", inputDescription);
    formData.append("unique_string", invoiceNo);
    formData.append("dispute_amount", disputeAmount);
    formData.append("category_id", selectCategory);
    formData.append("user_id", postdata?.user_id);
    formData.append("user_email", postdata?.email);

    try {
      setLoading(true);
      const res = await commonputrequest(
        "booking/disputes/request-dispute-approval",
        formData,
      );
      if (res?.status === 200) {
        setEditModal(false);
        setEditdisputeId(null);
        resetForm();
        getDispute(page, limit);
        showAlert(res?.data?.message, "success");
      } else {
        showAlert(res?.response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error updating dispute:", error);
      showAlert("Failed to update dispute", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectPriority("");
    setInvoiceNo("");
    setDisputeAmount("");
    setSelectCategory("");
    setInputDescription("");
    setFiledata("");
    setPostdata(intmodaldata);
    setSelectedfranchisedata(intfranchiseedata);
    setSpotData(intfranchiseedata);
    setIsError(initialerrdata);
    setEditdisputeId(null);
  };

  const uploadDispute = async () => {
    let errors: any = {};

    rows.forEach((row, index) => {
      if (!row.label?.trim()) {
        errors[`label_${index}`] = `Label for row ${index + 1} is required`;
      }
      if (!row.file) {
        errors[`file_${index}`] = `File for row ${index + 1} is required`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setUploadError(errors);
      showAlert("Please fill all required fields.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("dispute_id", uploaddisputeId?.toString() || "");

    rows.map((row) => formData.append("labels", row.label));

    rows.forEach((row, index) => {
      if (row.file) {
        formData.append("files", row.file);
      }
    });

    try {
      setUploadLoading(true);
      const res = await commonpostrequest(
        "booking/disputes/dispute-docs",
        formData,
      );

      if (res?.status === 200 || res?.status === 201) {
        setUploadModal(false);
        setRows([{ label: "", file: null }]);
        setUploadError(initialerrdata1);
        showAlert(res?.data?.message, "success");
      } else {
        showAlert(res?.response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error uploading dispute documents:", error);
      showAlert("Failed to upload documents", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  const getUploadDoc = async (viewdisputeId: any) => {
    try {
      setViewLoading(true);
      const res = await commongetrequest(
        `booking/disputes/dispute-docs/${viewdisputeId}`,
      );
      if (res?.status === 200 || res?.status === 204) {
        setUploadedDocs(res?.data?.data || []);
        setViewModal(true);
      } else {
        showAlert("No documents found", "warning");
      }
    } catch (error) {
      console.error("Error fetching uploaded documents:", error);
      showAlert("Failed to load documents", "error");
    } finally {
      setViewLoading(false);
    }
  };

  const getUserName = (userId: number | string | null) => {
    if (!userId) return "";

    const user = userData1.find((u: any) =>
      u?.type?.some((t: any) => String(t?.emp_id) === String(userId))
    );

    return user?.user_name || userId;
  };

  const getDispute = async (page: number, limit: number) => {
    try {
      setAllLoading(true);
      const res = await commongetrequest(
        `booking/disputes?page=${page}&limit=${limit}&ticket_no=${ticketNo}&from_date=${startMonth}&to_date=${endMonth}&priority_id=${priorityType}&status_id=${statusType}`,
      );
      if (res?.status === 200 || res?.status === 204) {
        setGetDisputeAll(res?.data?.data?.data || []);
        setPage(res?.data?.data?.page || 1);
        setLimit(res?.data?.data?.limit || 10);
        setTotalPages(res?.data?.data?.totalPages || 0);
        setTotalRecords(res?.data?.data?.totalRecords || 0);
      }
    } catch (error) {
      console.error("Error fetching disputes:", error);
      setGetDisputeAll([]);
    } finally {
      setAllLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [statusType, priorityType, ticketNo, startMonth, endMonth]);

  useEffect(() => {
    disputeLooks();
  }, []);

  // useEffect(() => {
  //   getDispute(page, limit);
  // }, [
  //   page,
  //   limit,
  //   statusType,
  //   priorityType,
  //   ticketNo,
  //   startMonth,
  //   endMonth,
  // ]);

  useEffect(() => {
    getDispute(page, limit);
  }, [page, limit, resetTrigger]);

  const handleSearch = () => {
    setPage(1);
    getDispute(1, limit);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    getDispute(newPage, limit);
  };

  const getDownloadData = async () => {
    try {
      setDownloadisLoading(true);
      const res = await commongetrequest(
        `booking/disputes?ticket_no=${ticketNo}&from_date=${startMonth}&to_date=${endMonth}&priority_id=${priorityType}&status_id=${statusType}`,
      );
      if (res?.status === 200 || res?.status === 204) {
        const responseList = res?.data?.data?.data || [];
        const mappedData =
          responseList?.map((item: any) => ({
            franchisee_name: item?.franchisee_name || "",
            "invoice_no / AWB_no": item?.unique_string || "",
            query_amount: formatIndianNumber(item?.dispute_amount || ""),
            ticket_no: item?.ticket_no || "",
            raised_on: formatInputDate(item?.created_at || ""),
            category: getCategoryName(item?.category_id || ""),
            user: getUserName(item?.user_id || ""),
            description: item?.description || "",
            status: item?.status || "",
            priority: item?.priority || "",
            attachment: item?.attachment || "",
            credit_note: item?.credit_note || "",
          })) || [];
        handledownload(mappedData);
      }
    } catch (error) {
      console.error(error, "error in getDownloadData");
    } finally {
      setDownloadisLoading(false);
    }
  };

  const handledownload = (data: any) => {
    jsontocsv(tranfereddata(data), "raise_query");
  };

  const disputeComment = async () => {
    if (!chatDescription.trim()) {
      showAlert("Please Enter Comment", "warning");
      return;
    }
    try {
      setDisputeCommentLoading(true);
      const payload = {
        dispute_id: chatdisputeId,
        comment_text: chatDescription,
      };
      const res = await commonpostrequest("booking/dispute-comments", payload);
      if (res?.status === 201) {
        handleDisputeComment(chatdisputeId);
        setChatDescription("");
        // showAlert(res?.data?.message, "success");
      } else {
        showAlert(res?.response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error closing disputeComment:", error);
    } finally {
      setDisputeCommentLoading(false);
    }
  };

  const handleDisputeComment = async (dispute_id: any) => {
    try {
      setHandleDisputeCommentLoading(true);
      const res = await commongetrequest(
        `booking/dispute-comments/of/${dispute_id}`,
      );
      if (res?.status === 200 || res?.status === 204) {
        setAllDataDisputeComment(res?.data?.data || []);
        // showAlert(res?.data?.message,"success");
      } else {
        // showAlert("hello" ,"error");
      }
    } catch (error) {
      console.error("Error closing handleDisputeComment:", error);
    } finally {
      setHandleDisputeCommentLoading(false);
    }
  };

  const reOpenDispute = async () => {
    let errors: any = {};

    if (!reopenDescription.trim()) {
      errors.remarks = "Remarks are required.";
    }

    if (Object.keys(errors).length > 0) {
      setIsError(errors);
      showAlert("Please fill all required fields.", "error");
      return;
    }
    try {
      setCloseLoading(true);
      const payload = {
        remarks_5: reopenDescription,
      };
      const res = await commonpatchrequest(
        `booking/disputes/re-open/${selectedDisputeId}`,
        payload,
      );
      if (res?.status === 200) {
        showAlert(res?.data?.message, "success");
        setCloseModal(false);
        setReopenDescription("");
        setIsError(initialerrdata);
        getDispute(page, limit);
      } else {
        showAlert(res?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error closing dispute:", error);
    } finally {
      setCloseLoading(false);
    }
  };

  const getDashboard = async () => {
    setDashbordLoading(true);
    try {
      const res = await commongetrequest(`booking/disputes/get-dispute-dashboard`);
      if (res?.status === 200 || res?.status === 204) {
        setDashboardData(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching dispute dashboard data:", error);
      setDashboardData([]);
    } finally {
      setDashbordLoading(false);
    }
  }

  const fun1 = (a?: any) => {
    setSpotData((pre: any) => ({
      ...pre,
      branch_id: a?.branch || "",
      hub_id: a?.hub || 0,
      franchisee_id: a?.franchisee_id || "",
    }));
  };

  const fun2 = () => {
    setSelectedfranchisedata(intfranchiseedata);
    setSpotData((pre: any) => ({
      ...pre,
      franchisee_id: "",
    }));
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];

    if (!file) {
      showAlert("Please Select file To Upload", "warning");
      return;
    }
    setFiledata(file);

    // handleFileUpload(file, setUploadcsvdata, setCSVData);
  };

  const uploadFileChange = (event: any, index: number) => {
    const file = event.target.files?.[0];

    if (!file) {
      showAlert("Please Select file To Upload", "warning");
      return;
    }

    // Check if file is PDF
    // if (file.type !== "application/pdf") {
    //   showAlert("Only PDF files are allowed.", "error");
    //   return;
    // }

    const updated = [...rows];
    updated[index].file = file;
    setRows(updated);
    setUploadError((prev: any) => ({
      ...prev,
      [`file_${index}`]: "",
    }));
  };

  // const handleReset = () => {
  //   setTicketNo("");
  //   setStartMonth("");
  //   setEndMonth("");
  //   setPriorityType("");
  //   setStatusType("");
  //   // setSelectedRaisedFor("");
  //   setPage(1);
  //   getDispute(1, limit);
  // };

  const handleReset = () => {
    setTicketNo("");
    setStartMonth("");
    setEndMonth("");
    setPriorityType("");
    setStatusType("");
    setPage(1);
    getDispute(1, limit);

    setResetTrigger((prev) => prev + 1);
  };

  const Description = (
    <div className="overflow-y-auto max-h-[400px] min-h-[250px]">
      <div>
        <div className="grid grid-cols-4 gap-4 gap-y-3 p-3 rounded-md">
          <div className="col-span-1">
            <div>
              <FormLabel>
                SELECT FRANCHISEE <span className="text-red-400">*</span>
              </FormLabel>
            </div>

            <CommonSearchableAll
              apiEndpoint={`admin/franchisee-settings`}
              placeholder={"Search For  Franchisee"}
              selecteddata={selectedfranchisedata}
              // setSelecteddata={setSelectedfranchisedata}
              setSelecteddata={(val: any) => {
                setSelectedfranchisedata(val);
                setIsError((prev: any) => ({ ...prev, franchisee: "" }));
              }}
              fun1={fun1}
              comingselectedname={"franchisee_name"}
              comingselectedid={"franchisee_id"}
              funtoempty={fun2}
              key1={"key"}
            // id={state?.booking?.franchisee_id}
            />
            {isError?.franchisee && (
              <span className="text-red-400">{isError.franchisee}</span>
            )}
          </div>
          <div className="col-span-1">
            <FormLabel className="whitespace-nowrap">
              SELECT PRIORITY:
              <span className="text-red-400">*</span>
            </FormLabel>
            <FormSelect
              value={selectPriority}
              onChange={(e) => {
                setSelectPriority(e.target.value);
                setIsError((prev: any) => ({ ...prev, selectPriority: "" }));
              }}
            >
              <option value="">Select Priority</option>
              {disputePriority.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </FormSelect>
            {isError?.selectPriority && (
              <span className="text-red-400">{isError.selectPriority}</span>
            )}
          </div>

          <div className="col-span-2">
            <FormLabel>
              INVOICE NO / AWB NO:
              <span className="text-red-400">*</span>
            </FormLabel>
            <FormInput
              type="text"
              value={invoiceNo}
              onChange={(e) => {
                setInvoiceNo(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setIsError((prev: any) => ({ ...prev, invoiceNo: "" }));
                }
              }}
              placeholder="Enter Invoice No..."
            />
            {isError?.invoiceNo && (
              <span className="text-red-400">{isError.invoiceNo}</span>
            )}
          </div>

          <div className="col-span-1">
            <FormLabel>Query Amount:</FormLabel>
            <span className="text-red-500">*</span>
            <FormInput
              type="text"
              value={disputeAmount}
              placeholder="Enter Amount..."
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                  setDisputeAmount(value);
                  setIsError((prev: any) => ({ ...prev, disputeAmount: "" }));
                }
              }}
            />
            {isError?.disputeAmount && (
              <span className="text-red-400">{isError.disputeAmount}</span>
            )}
          </div>

          <div className="col-span-1">
            <FormLabel className="whitespace-nowrap">
              Select Category:
              <span className="text-red-400">*</span>
            </FormLabel>
            <FormSelect
              value={selectCategory}
              onChange={(e) => {
                setSelectCategory(e.target.value);
                setIsError((prev: any) => ({ ...prev, selectCategory: "" }));
              }}
            >
              <option value="">Select Category</option>
              {disputeCategory.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </FormSelect>
            {isError?.selectCategory && (
              <span className="text-red-400">{isError.selectCategory}</span>
            )}
          </div>
          <div className="col-span-4">
            <FormLabel>DESCRIPTION:</FormLabel>
            <span className="text-red-500">*</span>
            <FormTextarea
              name="text"
              placeholder="Enter Description..."
              value={inputDescription}
              onChange={(e) => {
                setInputDescription(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setIsError((prev: any) => ({ ...prev, description: "" }));
                }
              }}
            ></FormTextarea>
            {isError?.description && (
              <span className="text-red-400">{isError.description}</span>
            )}
          </div>
          <div className="col-span-4">
            <FormLabel className="block text-sm font-medium text-gray-700">
              ATTACHMENT:
            </FormLabel>
            <FormInput
              type="file"
              className="bg-white border-2 border-gray-700"
              // accept=".csv"
              onChange={handleFileChange}
            />
            {isError?.file ? (
              <span className="text-red-400">{isError?.file}</span>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const uploadDescription = (
    <div className="overflow-y-auto max-h-[300px] min-h-[100px]">
      <div>
        {rows.map((row, index) => (
          <div key={index} className="border p-4 rounded-md mb-3 relative">
            {/* Minus button */}
            {rows.length > 1 && (
              <button
                className="absolute top-2 right-2 text-red-600"
                onClick={() => removeRow(index)}
              >
                <MinusCircle size={22} />
              </button>
            )}
            <div className="grid grid-cols-4 gap-4 gap-y-3 p-3 rounded-md">
              <div className="col-span-2">
                <FormLabel className="block text-sm font-medium text-gray-700">
                  LABEL:
                  <span className="text-red-400">*</span>
                </FormLabel>
                <FormInput
                  type="text"
                  value={row.label}
                  onChange={(e) => {
                    handleLabelChange(index, e.target.value);
                    setUploadError((prev: any) => ({
                      ...prev,
                      [`label_${index}`]: "",
                    }));
                  }}
                  placeholder="Enter Label..."
                  className="p-3"
                />
                {uploadError[`label_${index}`] && (
                  <span className="text-red-400">
                    {uploadError[`label_${index}`]}
                  </span>
                )}
              </div>
              <div className="col-span-2">
                <FormLabel className="block text-sm font-medium text-gray-700">
                  ATTACHMENT:<span className="text-red-400">*</span>
                </FormLabel>
                <FormInput
                  type="file"
                  className="bg-white border-2 border-gray-700"
                  // accept=".pdf" // Only allow PDF files
                  onChange={(e) => uploadFileChange(e, index)}
                />
                {/* <p className="text-xs text-gray-500 mt-1">
                  Only PDF files are allowed
                </p> */}
                {uploadError[`file_${index}`] && (
                  <span className="text-red-400">
                    {uploadError[`file_${index}`]}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Row Button */}
        <button
          onClick={addRow}
          className={`flex items-center gap-2 font-medium mt-2 ${isFirstRowFilled()
            ? "text-blue-600 cursor-pointer"
            : "text-gray-400 cursor-not-allowed"
            }`}
          disabled={!isFirstRowFilled()}
        >
          <Plus size={22} /> Add More
        </button>
        {!isFirstRowFilled() && rows.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            Please fill the first row before adding a new row
          </p>
        )}
      </div>
    </div>
  );

  const getFileIcon = (fileName: string) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "🖼️";
      case "zip":
      case "rar":
        return "📦";
      default:
        return "📎";
    }
  };

  const getFileTypeClass = (fileName: string) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();

    switch (extension) {
      case "pdf":
        return "file-pdf";
      case "doc":
      case "docx":
        return "file-doc";
      case "xls":
      case "xlsx":
        return "file-xls";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "file-image";
      default:
        return "file-default";
    }
  };

  const viewDescription = (
    <div className="overflow-y-auto max-h-[400px] min-h-[200px]">
      {viewLoading ? (
        <div className="flex justify-center items-center h-32">
          <LoadingIcon icon="puff" color="#4F46E5" className="w-8 h-8" />
          <span className="ml-2">Loading documents...</span>
        </div>
      ) : uploadedDocs.length === 0 ? (
        <div className="flex justify-center items-center h-32 text-gray-500">
          No documents uploaded yet
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-2">
          {uploadedDocs.map((doc: any, index: number) => {
            const fileName = doc.doc_url?.split("/").pop() || "Document";
            const decodedFileName = decodeURIComponent(fileName);

            return (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`text-2xl ${getFileTypeClass(decodedFileName)}`}
                  >
                    {getFileIcon(decodedFileName)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {doc.label || "No Label"}
                    </p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {decodedFileName}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {doc.doc_url && (
                    <>
                      {/* <Link
                        to={doc.doc_url}
                        target="_blank"
                        download={decodedFileName}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Download"
                      >
                        <Download size={18} />
                      </Link> */}

                      <Button
                        className="p-2 text-green-600 hover:text-green-800 transition-colors"
                        onClick={() => {
                          if (doc.doc_url) {
                            window.open(doc.doc_url, "_blank");
                          }
                        }}
                        title="View"
                      >
                        <Eye size={18} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const EditDescription = (
    <div className="overflow-y-auto max-h-[400px] min-h-[250px]">
      <div>
        <div className="grid grid-cols-4 gap-4 gap-y-3 p-3 rounded-md">
          {/* <div className="col-span-1">
            <div>
              <FormLabel>
                SELECT FRANCHISEE <span className="text-red-400">*</span>
              </FormLabel>
            </div>
            <CommonSearchableAll
              apiEndpoint={`admin/franchisee-settings`}
              placeholder={"Search For Franchisee"}
              selecteddata={selectedfranchisedata}
              setSelecteddata={(val: any) => {
                setSelectedfranchisedata(val);
                setIsError((prev: any) => ({ ...prev, franchisee: "" }));
              }}
              fun1={fun1}
              comingselectedname={"franchisee_name"}
              comingselectedid={"franchisee_id"}
              funtoempty={fun2}
              key1={"key"}
              id={selectedfranchisedata?.franchisee_id}
              isDisabled={true}
            />
            {isError?.franchisee && (
              <span className="text-red-400">{isError.franchisee}</span>
            )}
          </div> */}

          <div className="col-span-1">
            <div>
              <FormLabel>
                SELECT FRANCHISEE <span className="text-red-400">*</span>
              </FormLabel>
            </div>
            {editModal ? (
              <FormInput
                type="text"
                value={selectedfranchisedata?.franchisee_name}
                disabled
              />
            ) : (
              <CommonSearchableAll
                apiEndpoint={`admin/franchisee-settings`}
                placeholder={"Search For Franchisee"}
                selecteddata={selectedfranchisedata}
                setSelecteddata={(val: any) => {
                  setSelectedfranchisedata(val);
                  setIsError((prev: any) => ({ ...prev, franchisee: "" }));
                }}
                fun1={fun1}
                comingselectedname={"franchisee_name"}
                comingselectedid={"franchisee_id"}
                funtoempty={fun2}
                key1={"key"}
              />
            )}
            {isError?.franchisee && (
              <span className="text-red-400">{isError.franchisee}</span>
            )}
          </div>

          <div className="col-span-1">
            <FormLabel className="whitespace-nowrap">
              SELECT PRIORITY:
              <span className="text-red-400">*</span>
            </FormLabel>
            <FormSelect
              value={selectPriority}
              onChange={(e) => {
                setSelectPriority(e.target.value);
                setIsError((prev: any) => ({ ...prev, selectPriority: "" }));
              }}
              disabled={true}
            >
              <option value="">Select Priority</option>
              {disputePriority.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </FormSelect>
            {isError?.selectPriority && (
              <span className="text-red-400">{isError.selectPriority}</span>
            )}
          </div>

          {/* <div className="col-span-2">
            <FormLabel>
              INVOICE NO / AWB NO:
              <span className="text-red-400">*</span>
            </FormLabel>
            <FormInput
              type="text"
              value={invoiceNo}
              onChange={(e) => {
                setInvoiceNo(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setIsError((prev: any) => ({ ...prev, invoiceNo: "" }));
                }
              }}
              disabled={true}
              placeholder="Enter Invoice No..."
            />
            {isError?.invoiceNo && (
              <span className="text-red-400">{isError.invoiceNo}</span>
            )}
          </div> */}

          <div className="col-span-2">
            <FormLabel>
              {raisedForType === "2" ? "AWB NO:" : "INVOICE NO:"}
              <span className="text-red-400">*</span>
            </FormLabel>

            <FormInput
              type="text"
              value={invoiceNo}
              disabled
              placeholder={
                raisedForType === "2"
                  ? "Enter AWB No..."
                  : "Enter Invoice No..."
              }
            />

            {isError?.invoiceNo && (
              <span className="text-red-400">{isError.invoiceNo}</span>
            )}
          </div>
          <div className="col-span-1">
            <FormLabel>Query Amount:</FormLabel>
            <span className="text-red-500">*</span>
            <FormInput
              type="text"
              value={disputeAmount}
              placeholder="Enter Amount..."
              onChange={(e) => {
                const value = e.target.value;
                if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                  setDisputeAmount(value);
                  setIsError((prev: any) => ({ ...prev, disputeAmount: "" }));
                }
              }}
            />
            {isError?.disputeAmount && (
              <span className="text-red-400">{isError.disputeAmount}</span>
            )}
          </div>

          <div className="col-span-1">
            <FormLabel className="whitespace-nowrap">
              Select Category:
              <span className="text-red-400">*</span>
            </FormLabel>
            <FormSelect
              value={selectCategory}
              onChange={(e) => {
                setSelectCategory(e.target.value);
                setIsError((prev: any) => ({ ...prev, selectCategory: "" }));
              }}
            >
              <option value="">Select Category</option>
              {disputeCategory.map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </FormSelect>
            {isError?.selectCategory && (
              <span className="text-red-400">{isError.selectCategory}</span>
            )}
          </div>

          <div className="col-span-4">
            <FormLabel>DESCRIPTION:</FormLabel>
            <span className="text-red-500">*</span>
            <FormTextarea
              name="text"
              placeholder="Enter Description..."
              value={inputDescription}
              onChange={(e) => {
                setInputDescription(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setIsError((prev: any) => ({ ...prev, description: "" }));
                }
              }}
            ></FormTextarea>
            {isError?.description && (
              <span className="text-red-400">{isError.description}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const EditFooter = (
    <div className="flex justify-end space-x-2">
      <Button
        className="bg-red-400 text-white px-4 py-2 rounded-md"
        onClick={() => {
          setEditModal(false);
          resetForm();
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={editDispute}
        className="bg-mustard text-white px-4 py-2 rounded-md"
        disabled={loading}
      >
        Update
        {loading && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </div>
  );

  const viewFooter = (
    <div className="flex justify-end space-x-2">
      <Button
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        onClick={() => {
          setViewModal(false);
        }}
      >
        Close
      </Button>
    </div>
  );

  const uploadFooter = (
    <div className="flex justify-end space-x-2">
      <Button
        className="bg-red-400 text-white px-4 py-2 rounded-md "
        onClick={() => {
          setUploadModal(false);
          setUploaddisputeId("");
          setRows([{ label: "", file: null }]);
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={uploadDispute}
        className="bg-mustard text-white px-4 py-2 rounded-md "
        disabled={uploadLoading}
      >
        Submit
        {uploadLoading && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </div>
  );

  const Footer = (
    <div className="flex justify-end space-x-2">
      <Button
        className="bg-red-400 text-white px-4 py-2 rounded-md "
        onClick={() => {
          setOpenModal(false);
          setSelectPriority("");
          setInvoiceNo("");
          setDisputeAmount("");
          setSelectCategory("");
          setInputDescription("");
          setFiledata("");
          setPostdata(intmodaldata);
          setSelectedfranchisedata(intfranchiseedata);
          setSpotData(intfranchiseedata);
          setIsError(initialerrdata);
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={postDispute}
        className="bg-mustard text-white px-4 py-2 rounded-md "
        disabled={loading}
      >
        Submit
        {loading && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </div>
  );

  const closeDescription = (
    <>
      <div className="overflow-y-auto max-h-[150px]">
        <p className="text-lg">
          Are you sure you want to Re-Open this dispute?
        </p>
      </div>

      <div className="col-span-4">
        <FormLabel>Remarks:</FormLabel>
        <span className="text-red-500">*</span>
        <FormTextarea
          name="text"
          placeholder="Enter Remarks..."
          value={reopenDescription}
          onChange={(e) => {
            setReopenDescription(e.target.value);
            if (e.target.value.trim().length > 0) {
              setIsError((prev: any) => ({ ...prev, remarks: "" }));
            }
          }}
        ></FormTextarea>
        {isError?.remarks && (
          <span className="text-red-400">{isError.remarks}</span>
        )}
      </div>
    </>
  );

  const closeFooter = (
    <div className="flex justify-end space-x-2">
      <Button
        className="bg-red-400 text-white px-4 py-2 rounded-md "
        onClick={() => {
          setCloseModal(false);
          setReopenDescription("");
          setIsError({ remarks: "" });
        }}
      >
        Cancel
      </Button>
      <Button
        onClick={reOpenDispute}
        className="bg-mustard text-white px-4 py-2 rounded-md "
        disabled={closeLoading}
      >
        Confirm
        {closeLoading && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
    </div>
  );

  const formatInputDate = (dateString: any) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <>
      <div>
        <div className="min-[685px]:flex justify-between p-2 border-b-2 rounded-md">
          <div>
            <h2 className="text-2xl mt-1 font-bold text-primary ">
              Raise Query
            </h2>
          </div>
          <div className="flex justify-end space-x-2">
            <div>
              <Button
                className="p-2 bg-success text-white"
                onClick={() => setOpenModal(true)}
              >
                <PlusCircle className="pr-1" /> Raise Query
              </Button>
            </div>
            <div>
              <Button
                className="  p-2 mr-1 text-white"
                variant="success"
                onClick={() => getDownloadData()}
              >
                <Download />
                {downloadisLoading ? (
                  <LoadingButtonCommon text="Downloading" />
                ) : (
                  "Download"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Same-page styles */}
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
        `}
        </style>
        <div className="w-full mt-3">
          <div className="grid grid-cols-12 gap-[9px] w-full">
            <div className="col-span-12 md:col-span-3 lg:col-span-3">
              <div className="w-full relative overflow-hidden  border-2 border-[#fff] rounded-lg p-2 mb-3  bg-white group  hover:bg-gradient-to-l hover:from-[#fff] hover:via-[#fff] hover:to-[#fff5d4]  hover:border-[#fff]">
                <div className="  w-full flex px-1 pb-1 pt-[2px] items-center ">
                  <figure className=" w-[55px] h-[50px] flex items-center justify-center  animate-morph transition-all duration-1000 z-[5] bg-[#cde5ce] group-hover:bg-[#fff]">
                    <img src={totalQueryICON} alt="" className="w-[26px] h-[28px]" />
                  </figure>
                  <aside className=" w-full pl-3">
                    <h2 className="text-[#696969] text-[13px] font-medium  uppercase leading-[20px] group-hover:text-[#c48d13]">
                      Total Queries
                    </h2>

                    <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                      {dashbordLoading ? (
                        <>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>{dashboardData?.total_queries || 0}</>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 lg:col-span-3">
              <div className="w-full relative overflow-hidden  border-2 border-[#fff] rounded-lg p-2 mb-3  bg-white group  hover:bg-gradient-to-l hover:from-[#fff] hover:via-[#fff] hover:to-[#fff5d4]  hover:border-[#fff]">
                <div className="  w-full flex px-1 pb-1 pt-[2px] items-center ">
                  <figure className=" w-[55px] h-[50px] flex items-center justify-center  animate-morph transition-all duration-1000 z-[5] bg-[#ddcde5] group-hover:bg-[#fff]">
                    <img src={openIcon} alt="" className="w-[23px]" />
                  </figure>
                  <aside className=" w-full pl-3">
                    <h2 className="text-[#696969] text-[13px] font-medium  uppercase leading-[20px] group-hover:text-[#c48d13]">
                      Open Queries
                    </h2>

                    <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                      {dashbordLoading ? (
                        <>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>{dashboardData?.open_queries || 0}</>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 lg:col-span-3">
              <div className="w-full  overflow-hidden relative border-2 border-[#fff] rounded-lg p-2 mb-3  bg-white group  hover:bg-gradient-to-l hover:from-[#fff] hover:via-[#fff] hover:to-[#fff5d4]  hover:border-[#fff]">
                <div className="  w-full flex px-1 pb-1 pt-[2px] items-center ">
                  <figure className=" w-[55px] h-[50px] flex items-center justify-center  animate-morph transition-all duration-1000 z-[5]  bg-[#F2DFB4] group-hover:bg-[#fff]">
                    <img src={inProcessICON} alt="" className="w-[30px] " />
                  </figure>
                  <aside className=" w-full pl-3">
                    <h2 className="text-[#696969] text-[13px] font-medium  uppercase leading-[20px] group-hover:text-[#c48d13]">
                      In Process
                    </h2>

                    <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                      {dashbordLoading ? (
                        <>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>{dashboardData?.in_process_queries || 0.00}</>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 lg:col-span-3">
              <div className="w-full  overflow-hidden relative border-2 border-[#fff] rounded-lg p-2 mb-3  bg-white group  hover:bg-gradient-to-l hover:from-[#fff] hover:via-[#fff] hover:to-[#fff5d4]  hover:border-[#fff]">
                <div className="  w-full flex px-1 pb-1 pt-[2px] items-center ">
                  <figure className=" w-[55px] h-[50px] flex items-center justify-center  animate-morph transition-all duration-1000 z-[5]  bg-[#D9E2FF] group-hover:bg-[#fff]">
                    <img src={closeIcon} alt="" className="w-[25px] " />
                  </figure>
                  <aside className=" w-full pl-3">
                    <h2 className="text-[#696969] text-[13px] font-medium  uppercase leading-[20px] group-hover:text-[#c48d13]">
                      Closed
                    </h2>

                    <div className="text-[#303030] text-[16px] font-bold  uppercase leading-[20px]">
                      {dashbordLoading ? (
                        <>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>{dashboardData?.closed_queries || 0.00}</>
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-lg mb-4 rounded-md">
          <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4  mt-1 mb-2 p-4  m-auto items-end">
            <div>
              <FormLabel className="whitespace-nowrap">STATUS:</FormLabel>
              <FormSelect
                value={statusType}
                onChange={(e) => setStatusType(e.target.value)}
              >
                <option value="">Select Status</option>
                {disputeStatus.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div>
              <FormLabel className="whitespace-nowrap">PRIORITY:</FormLabel>
              <FormSelect
                value={priorityType}
                onChange={(e) => setPriorityType(e.target.value)}
              >
                <option value="">Select Priority</option>
                {disputePriority.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </FormSelect>
            </div>
            {/* <div>
              <FormLabel className="whitespace-nowrap">Raised For:</FormLabel>
              <FormSelect
                value={selectedRaisedFor}
                onChange={(e) => setSelectedRaisedFor(e.target.value)}
              >
                <option value="">Select Raised For</option>
                {disputeRaisedForLookup.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </FormSelect>
            </div> */}
            <div>
              <FormLabel>TICKET NO.</FormLabel>
              <FormInput
                type="text"
                value={ticketNo}
                placeholder="Enter Ticket No..."
                onChange={(e) => setTicketNo(e.target.value)}
              />
            </div>
            <div>
              <FormLabel>START DATE:</FormLabel>
              <FormInput
                type="date"
                value={startMonth}
                max={new Date().toISOString().slice(0, 7)}
                onChange={(e) => setStartMonth(e.target.value)}
              />
            </div>
            <div>
              <FormLabel>END DATE:</FormLabel>
              <FormInput
                type="date"
                value={endMonth}
                min={startMonth || ""}
                max={new Date().toISOString().slice(0, 7)}
                onChange={(e) => setEndMonth(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-end">
              <Button
                className="bg-mustard text-white px-4 py-2 rounded-md "
                onClick={handleSearch}
              >
                <Search className="mr-2" /> Search
              </Button>
            </div>
            <div className="flex justify-between items-end">
              <Button
                className="bg-red-400 text-white px-4 py-2 rounded-md "
                onClick={handleReset}
              >
                <RefreshCcw className="mr-2" /> Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white w-full rounded-md shadow-lg overflow-auto">
          {allLoading ? (
            <IsLoading />
          ) : (
            <Table sm hover>
              {/* Table headers */}
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="text-right whitespace-nowrap">
                    S.NO.
                  </Table.Th>
                  <Table.Th className="text-center whitespace-nowrap">
                    EDIT
                  </Table.Th>
                  <Table.Th className="text-center whitespace-nowrap">
                    ACTION
                  </Table.Th>
                  <Table.Th className="text-center whitespace-nowrap">
                    VIEW
                  </Table.Th>
                  {/* <Table.Th className="text-center whitespace-nowrap">
                    COMMENT
                  </Table.Th> */}
                  <Table.Th className="text-left whitespace-nowrap">
                    FRANCHISEE NAME
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    INVOICE NO / AWB NO.
                  </Table.Th>
                  <Table.Th className="text-right whitespace-nowrap">
                    QUERY AMOUNT
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    TICKET NO
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    RAISED ON
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    CATEGORY
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    DESCRIPTION
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    STATUS
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    PRIORITY
                  </Table.Th>
                  <Table.Th className="text-center whitespace-nowrap">
                    ATTACHMENT
                  </Table.Th>
                  <Table.Th className="text-center whitespace-nowrap">
                    CREDIT NOTE
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              <Table.Tbody>
                {getDisputeall?.length >= 1 &&
                  getDisputeall?.map((item: any, index: any) => (
                    <Table.Tr key={index} className="intro-x">
                      <Table.Td className="text-right">
                        {(page - 1) * 10 + index + 1}
                      </Table.Td>
                      <Table.Td className="text-center">
                        {item?.level == 1 && (
                          <Button
                            className="border-none"
                            onClick={(event: React.MouseEvent) => {
                              event.preventDefault();
                              handleEditClick(item);
                            }}
                          >
                            <Edit className="w-5 h-5 text-blue-500" />
                          </Button>
                        )}
                      </Table.Td>
                      <Table.Td className="text-center">
                        <Button
                          onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setUploaddisputeId(item?.dispute_id);
                            setUploadModal(true);
                          }}
                          className="whitespace-nowrap p-1 text-white bg-mustard"
                        >
                          Upload Doc
                        </Button>
                      </Table.Td>
                      <Table.Td className="text-center">
                        <Button
                          className="border-none"
                          onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setViewdisputeId(item?.dispute_id);
                            getUploadDoc(item?.dispute_id);
                            setViewModal(true);
                          }}
                        >
                          <Eye />
                        </Button>
                      </Table.Td>
                      {/* <Table.Td className="text-center">
                        <Button
                          className="border-none"
                          onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setChatdisputeId(item?.dispute_id);
                            setChatdisputeToken(item?.ticket_no);
                            setOverlappingSlideoverPreview(true);
                            handleDisputeComment(item?.dispute_id);
                          }}
                        >
                          <MessageCircle />
                        </Button>
                      </Table.Td> */}
                      <Table.Td className="text-left whitespace-nowrap">
                        {item?.franchisee_name || ""}
                      </Table.Td>
                      <Table.Td className="text-left whitespace-nowrap">
                        {item?.unique_string || ""}
                      </Table.Td>
                      <Table.Td className="text-right whitespace-nowrap">
                        {formatIndianNumber(item?.dispute_amount || "")}
                      </Table.Td>
                      <Table.Td className="text-left whitespace-nowrap">
                        {item?.ticket_no || ""}
                      </Table.Td>
                      <Table.Td className="text-left whitespace-nowrap">
                        {formatInputDate(item?.created_at || "")}
                      </Table.Td>
                      <Table.Td className="text-left whitespace-nowrap">
                        {getCategoryName(item?.category_id || "")}
                      </Table.Td>
                      <Table.Td className="text-left whitespace-nowrap">
                        {item?.description || ""}
                      </Table.Td>
                      <Table.Td className="text-left whitespace-nowrap">
                        {item?.level && getApproverByLevel(item.level) && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            {item.status_id==4 ? "Closed" : item.status_id==6 ? "CRN Issued" : `Level ${item.level}: ${getApproverByLevel(item.level)}`}
                          </div>
                        )}
                        <div className="flex flex-row">
                          {item?.status === "Resolved" && (
                            <div className="flex">
                              <Button
                                className="p-[1px] pl-[12px] pr-[12px] bg-blue-500 text-white text-[12px] font-normal border-none"
                                onClick={() => {
                                  setSelectedDisputeId(item?.dispute_id);
                                  setCloseModal(true);
                                }}
                              >
                                Re-Open
                              </Button>
                            </div>
                          )}
                        </div>
                      </Table.Td>
                      <Table.Td className="text-left whitespace-nowrap">
                        {item?.priority || ""}
                      </Table.Td>

                      <Table.Td className="text-center whitespace-nowrap">
                        {item?.attachment ? (
                          <div className="flex justify-center">
                            <Link target="_blank" to={`${item?.attachment}`}>
                              <FileText className="text-mustard" />
                            </Link>
                          </div>
                        ) : (
                          ""
                        )}
                      </Table.Td>
                      <Table.Td className="text-center whitespace-nowrap">
                        {item?.credit_note ? (
                          <div className="flex justify-center">
                            <Link
                              target="_blank"
                              to={`${item?.credit_note}?${Math.random()}`}
                            >
                              <FileText className="text-mustard" />
                            </Link>
                          </div>
                        ) : (
                          ""
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
              </Table.Tbody>
            </Table>
          )}
        </div>
        {getDisputeall?.length == 0 ? <Nodatafound /> : ""}

        {totalPages > 1 && (
          <CommonPagination
            totalpages={totalPages}
            onPageChange={handlePageChange}
            page={page}
          />
        )}

        {openModal && (
          <CommonModal
            open={openModal}
            setOpen={setOpenModal}
            title={"Raise Query"}
            description={Description}
            footer={Footer}
            size={"xl"}
          />
        )}

        {editModal && (
          <CommonModal
            open={editModal}
            setOpen={setEditModal}
            title={"Edit Raise Query"}
            description={EditDescription}
            footer={EditFooter}
            size={"xl"}
          />
        )}

        {closeModal && (
          <CommonModal
            open={closeModal}
            setOpen={setCloseModal}
            title={"Re-Open Raise Query"}
            description={closeDescription}
            footer={closeFooter}
            size={"lg"}
          />
        )}

        {uploadModal && (
          <CommonModal
            open={uploadModal}
            setOpen={setUploadModal}
            title={"Upload Documnet"}
            description={uploadDescription}
            footer={uploadFooter}
            size={"xl"}
          />
        )}

        {viewModal && (
          <CommonModal
            open={viewModal}
            setOpen={setViewModal}
            title={"View Uploaded Documents"}
            description={viewDescription}
            footer={viewFooter}
            size={"lg"}
          />
        )}
      </div>

      <Slideover
        className="chatboxMain"
        open={overlappingSlideoverPreview}
        onClose={() => {
          setOverlappingSlideoverPreview(false);
          setChatDescription("");
        }}
      >
        <Slideover.Panel className="chatbox">
          <Slideover.Title className="p-2 flex items-center gap-3">
            {/* Back Arrow Button */}
            <button
              onClick={() => {
                setOverlappingSlideoverPreview(false);
                setChatDescription("");
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Title */}
            <h2 className="text-sm font-medium">{chatdisputeToken}</h2>
          </Slideover.Title>

          <Slideover.Description className="px-0 py-0 chatbox">
            {/* your message UI stays the same */}
            <div className="text-center">
              <div className="mb-5">
                <div>
                  {handleDisputeCommentLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <IsLoading />
                    </div>
                  ) : (
                    <div className="messageType p-3">
                      <div className="messageTypeTop">
                        <div className="messageScroll">
                          {allDataDisputeComment.length === 0 ? (
                            <div className=" flex justify-center items-center h-full">
                              <p className="text-gray-500 text-center">
                                No message available
                              </p>
                            </div>
                          ) : (
                            allDataDisputeComment.map((msg, index) => {
                              const isCurrentUser =
                                userdata?.emp_id === msg.user_id;

                              return (
                                <div
                                  key={msg.comment_id}
                                  className={`messageuserMain ${isCurrentUser ? "rightSideMessage" : ""
                                    }`}
                                >
                                  <div className="messageuserType">
                                    <div className="messageuserTypetext">
                                      <p className="break-all break-normal">
                                        {msg.comment_text}
                                      </p>
                                    </div>
                                    <h6>
                                      {isCurrentUser ? "You" : msg.user_name},{" "}
                                      {new Date(
                                        msg.created_date,
                                      ).toLocaleString()}
                                    </h6>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="messageTypebottom">
                    <div className="messageTypeBottinn flex items-center">
                      <div className="messagetextarea">
                        <textarea
                          className="messagetextareafield"
                          name="text"
                          placeholder="Enter Comment..."
                          value={chatDescription}
                          onChange={(e) => setChatDescription(e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => disputeComment()}
                        className="sendmessage"
                        disabled={disputeCommentLoading}
                      >
                        <Send />
                        {disputeCommentLoading && (
                          <LoadingIcon
                            icon="puff"
                            color="white"
                            className="w-5 h-5 ml-2 stroke-2.5 text-white"
                          />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Slideover.Description>
        </Slideover.Panel>
      </Slideover>
    </>
  );
}

export default RaiseDispute;
