import React, { useEffect, useState } from "react";
import Table from "../../../base-components/Table";
import Button from "../../../base-components/Button";

import {
  Edit,
  Plus,
  PlusSquare,
  Settings,
  Settings2,
  Delete,
  Pencil,
  Trash,
  XCircle,
  Cross,
  Eye,
  Download,
  Trash2,
  User,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  FormSwitch,
  FormLabel,
  FormInput,
  FormCheck,
  FormTextarea,
} from "../../../base-components/Form";
import { useAlert } from "../../../ContextProvider/AlertContext";

// import DeleteModal from "../../DeleteModal/DeleteModal";
import {
  commongetrequest,
  commonputrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import { BsPlus } from "react-icons/bs";
import Tippy from "../../../base-components/Tippy";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import CommonPagination from "../commoncomponents/JsonToCsv/pagination";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import { mapErrorsToErrorObject } from "../commoncomponents/Handleerrorsfun/Maperrors";
import { MdClose } from "react-icons/md";
import IsLoading from "../commoncomponents/isLoading/isLoading";

import TomSelect from "../../../base-components/TomSelect";
import { ClassicEditor } from "../../../base-components/Ckeditor";
import axios from "axios";
import Commondownload from "../commoncomponents/ComonDownload/Commondownload";
import useFetch from "../commoncomponents/GetCustomHook.tsx/GetCustomHook";
import MultiSelectCommon from "../commoncomponents/CommonmultipleselectHeavyLoad/CommonMultipleselect";
import DeleteModal from "../commoncomponents/DeleteModal/DeleteModal";

import AOS from "aos";
import "aos/dist/aos.css";
import { Megaphone } from "lucide-react";

const current_user = localStorage.getItem("current_user");
const emp_id = current_user ? JSON.parse(current_user).emp_id : null;
const sales_id = current_user ? JSON.parse(current_user).mapped_id : null;
const initialerrdata = {
  announcement_name: "",

  message_body: "",
  is_email: "",
  is_whatsapp: "",
  send_to: "",
  mail_subject: "",
  from_date: "",
  to_date: "",
  hub: "",
  franchisee: "",
  state: "",
};

const initialemaildata = { send_to_email: 0, email_cc: [] };
const initialeditData = {
  id: "",
  announcement_name: "",

  message_body: "",
  send_to: 0,
  franchisee: [],
  hub: [],
  state: [],
  mail_subject: "",
  is_email: 0,
  from_date: "",
  to_date: "",
};
const initialerrors = {
  franchisee_ids: "",
  courier_ids: "",
  franchisee: "",
  hub: "",
  state: "",
};

const Announcements = ({ pdata }: any) => {
  const [editorData, setEditorData] = useState("");
  const [allfranchiseedata, setAllfranchisedata] = useState<any>([]);
  const [intfranchisedata, setIntfranchisedata] = useState<Array<any>>([]);
  const [postfranchisedata, setPostfranchisedata] = useState<Array<any>>([]);
  const [initialhubdata, setinitialhubdata] = useState<Array<any>>([]);
  const [posthubdata, setPostHubdata] = useState<Array<any>>([]);
  const [initialstatedata, setInitialstatedata] = useState<Array<any>>([]);
  const [postStatedata, setPoststatedata] = useState<Array<any>>([]);
  const [emaildata, setEmaildata] = useState(initialemaildata);
  const [mailbody, setMailbody] = useState("");
  const [openmailbox, setOpenmailbox] = useState<any>(false);
  const [data_id, setData_id] = useState(0);

  const [data, setData] = useState<any>([]);
  const [posting, setPosting] = useState(false);
  const [selectMultiple, setSelectMultiple] = useState<any>([]);
  // console.log(selectMultiple,"selectmultiple")
  const [dataforannouncement, setDatatoannouncement] = useState<any>([]);
  const [byWhich, setBywhich] = useState<any>([]);
  const [count, setCount] = useState(0);
  const [type, setType] = useState("CREATE");
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);

  const [isLoading, setIsloading] = useState<boolean>(false);
  const [editdata, setEditdata] = useState(initialeditData);
  const [createEditData, setCreateEditData] = useState<boolean>();
  const [isError, setIsError] = useState<any>(initialerrdata);
  const [refresh, setRefresh] = useState(false);
  const [sendToIds, setSendtoids] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [franchiseeList, setFranchiseeList] = useState<any>([]);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [deleteid, setDeleteId] = useState(0);
  const [filedata, setFiledata] = useState<any>("");
  const [alldata, setAlldata] = useState<any>([]);

  const { allgetdata } = useFetch("admin/announcement-list");
  const [errors, setErrors] = useState<any>(initialerrors);
  const [selectMultipleFranchisee, setSelectMultipleFranchisee] = useState<any>(
    [],
  );

  const [selectMultiplecopy, setSelectMultipleCoppy] = useState<any>([]);
  const [filtereddata, setFilterddata] = useState<any>([]);

  const handleFileChange = (event: any) => {
    const file = event.target.files?.[0];

    if (!file) {
      showAlert("Please Select file To Upload");
      return;
    }
    setFiledata(file);

    // handleFileUpload(file, setUploadcsvdata, setCSVData);
  };
  const handlefranchiselist = (value: any) => {
    const data = value.map((item: any) => item?.value);
    // console.log(value,"value",data,'data')
    setSelectMultipleFranchisee(data);
    setIsError((pre: any) => ({ ...pre, franchisee: "" }));
  };
  //  const [errorsObject,setErrorsObject]=useState<any>({})
  const { alert_name, message_body, send_to_wa } = isError;
  const { showAlert } = useAlert();

  // console.log(editdata,"editdata")
  const [sendViaWhatsapp, setSendViaWhatsapp] = useState<boolean>(
    editdata?.is_whatsapp ? true : false,
  );
  // console.log(sendViaWhatsapp,"sendviawhatapp")

  const [sendViaEmail, setSendViaEmail] = useState<boolean>(
    editdata?.is_email ? true : false,
  );

  const [bccInput, setBccInput] = useState<string>("");
  const [bccList, setBccList] = useState<string[]>([]);

  const handleBccInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBccInput(event.target.value);
    setIsError((pre: any) => ({ ...pre, email_cc: "" }));
  };

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

        setEmaildata((pre: any) => ({
          ...pre,
          email_cc: [...bccList, bccInput.trim()],
        }));
        setBccInput("");
      } else {
        showAlert("Please Provide Valid value!..", "warning");
      }
    }
  };

  const handleBccInputKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && bccInput === "") {
      const updatedList = [...bccList];
      updatedList.pop();
      setBccList(updatedList);
      setEmaildata((pre: any) => ({ ...pre, email_cc: updatedList }));
    }
  };

  const handleBccChipDelete = async (index: number) => {
    const updatedList = [...bccList];
    updatedList.splice(index, 1);
    setBccList(updatedList);
    setEmaildata((pre: any) => ({ ...pre, email_cc: updatedList }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    //    console.log(byWhich, "bywhich");
    // console.log(sendToIds,selectMultiple,"sendtodata")

    if (
      editdata?.announcement_name &&
      editorData &&
      editdata?.from_date &&
      editdata?.to_date &&
      postfranchisedata?.length >= 1
    ) {
      const newformdata: any = new FormData();
      newformdata.append("announcement_name", editdata?.announcement_name);

      newformdata.append("file", filedata);
      newformdata.append("message_body", editorData);
      if (type == "CREATE") {
        newformdata.append("sales_id", sales_id);
      } else {
        newformdata.append("id", editdata?.id);
      }
      newformdata.append("from_date", editdata?.from_date);
      newformdata.append("to_date", editdata?.to_date);

      if (postfranchisedata?.length >= 1) {
        const newdata = postfranchisedata.map((item: any) => item?.value);

        newformdata.append("franchisee", JSON.stringify(newdata));
      }

      // console.log(allfranchiseedata,"franchisedata",allhubdata,"allhubdata",allstatedata,"allstatedata",postfranchisedata,"postfrans")
      setIsError(initialerrdata);
      try {
        setPosting(true);
        const response: any =
          type == "CREATE"
            ? await commonpostrequest("admin/announcement-list", newformdata)
            : await commonputrequest("admin/announcement-list", newformdata);

        if (response?.status == 200) {
          showAlert(response?.data.message);
          setOpen(false);
          setEditdata(initialeditData);
          setIsError(initialerrdata);
          handleRefresh();
          setType("CREATE");
          handleCancel();
        } else if (response?.message == "Network Error") {
          showAlert(response.message, "error");
        } else if (response?.response.status == 406) {
          showAlert("Failed to Create Alert!...", "error");
          const errors = response?.response?.data?.errors;
          setIsError(mapErrorsToErrorObject(errors));
        } else {
          showAlert("Something going wrong..", "error");
        }
      } catch (err: any) {
        showAlert(err.message, "error");
      } finally {
        setPosting(false);
      }
    } else {
      !editdata?.announcement_name &&
        setIsError((pre: any) => ({
          ...pre,
          announcement_name: "announcement name is required",
        }));
      !editorData &&
        setIsError((pre: any) => ({
          ...pre,
          message_body: "message body is required",
        }));

      if (postfranchisedata?.length < 1) {
        setIsError((pre: any) => ({
          ...pre,
          franchisee: "franchise data is required",
        }));
      }
    }
  };

  // console.log(isError, "isError");
  const handleaction = async (endpoint: string) => {
    try {
      // console.log(newobj,"newobj")
      const response = await commonputrequest(endpoint);

      if (response?.status == 200) {
        showAlert(response.data.message, "success");
      } else if (response?.response?.status == 406) {
        showAlert(response.response.data.errors[0].msg, "error");
      } else if (response?.response?.status == 400) {
        showAlert("Internal Error..", "error");
      } else if (response?.response?.status == 500) {
        showAlert("Service Error..", "error");
      }
    } catch (err: any) {
      showAlert(err.message, "error");
    }
  };
  const handlepageChange = (e: any) => {
    // console.log(e,"vali")
    // console.log(e)
    setPage(e);
    setOffset((e - 1) * 20);
  };
  const handleRefresh = () => {
    setRefresh(!refresh);
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setEditdata((pre: any) => ({ ...pre, [name]: value }));
    setIsError((pre: any) => ({ ...pre, [name]: "" }));
  };

  //   const handleTomSelect=async(e:any)=>{

  //       try {

  //         if(e.includes(`1`)){

  // const response = await commongetrequest(`admin/franchisee-settings?sales_id=${sales_id}`);
  // if(response?.status==200){
  //   setIntfranchisedata(response?.data?.data)
  //    setFranchiseeList(response.data?.data);
  //    const data = response?.data?.data?.map((item: any) => ({
  //      id: item?.franchisee_id,
  //      name: item?.franchisee_name,
  //    }));
  //    setFilterddata(data);

  // }else{
  //   showAlert("Something going wrong!..",'error')
  // }
  //         }if(e.includes('2')){
  //           const response= await commongetrequest("admin/hub")
  // if(response?.status==200){
  //   setinitialhubdata(response?.data?.data)
  // }else{
  //   showAlert("Something going wrong!..",'error')
  // }

  //         }if(e.includes('3')){
  // const response= await commongetrequest("master/state/99")
  // if(response?.status==200){
  //   setInitialstatedata(response?.data?.data)
  // }else{
  //   showAlert("Something going wrong!..",'error')
  // }
  //         }

  //       } catch (err: any) {
  //         showAlert(err.message, "error");
  //       }
  //   }
  // console.log(sendToIds,"setids")
  const handleCancel = () => {
    setOpen(false);
    setEditdata(initialeditData);

    setIsError(initialerrdata);
    setType("CREATE");

    setOpenmailbox(false);
    setDeleteId(0);
    setFiledata("");
    setEditorData("");
    setIsError(initialerrdata);
    setPostfranchisedata([]);
  };

  useEffect(() => {
    fetchData();
  }, [refresh, page]);
  useEffect(() => {
    getinitialdata();
  }, []);

  const getinitialdata = async () => {
    try {
      const response2 = await commongetrequest(
        `admin/franchisee-settings?sales_id=${sales_id}`,
      );
      if (response2?.status == 200) {
        const data = response2?.data?.data?.map((item: any) => ({
          id: item?.franchisee_id,
          name: item?.franchisee_name,
        }));
        setAllfranchisedata(data || []);
        setSelectMultipleFranchisee(data || []);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchData = async () => {
    try {
      setIsloading(true);
      const response: any = await commongetrequest(
        `admin/announcement-list?offset=${offset}&sales_id=${sales_id}`,
      );

      // console.log(response,"deleteresponse")
      if (response?.status == 200) {
        setData(response?.data?.data || []);
        setCount(response?.data?.count);
      } else if (response?.message == "Network Error") {
        showAlert(response.message, "error");
      } else {
        showAlert("Something going wrong..", "error");
      }
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setIsloading(false);
    }
  };

  // console.log(isError,"allrequried errors")
  const modalTilte = (
    <h2 className="mr-auto text-base font-medium text-white">{type}</h2>
  );
  const mailBodyModalTilte = (
    <h2 className="mr-auto text-base font-medium text-white">Mail Body</h2>
  );

  // console.log(sendViaEmail,"viaEmail",sendViaWhatsapp,"whatsappp")
  const formdata = (
    <div className="h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-12  gap-2  lg:gap-4">
        <div className="col-span-12 lg:col-span-12">
          <FormLabel
            htmlFor="alertName"
            className="block text-sm font-medium text-gray-700"
          >
            Announcement Name
            <span className="text-red-400">*</span>
          </FormLabel>

          <FormInput
            type="text"
            placeholder="Announcement Name"
            className={`${
              isError.announcement_name ? "border-red-400" : ""
            } mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-mustard focus:ring-mustard`}
            name="announcement_name"
            value={editdata.announcement_name}
            onChange={handleChange}
          />
          {isError.announcement_name ? (
            <span className="text-red-400">{isError.announcement_name}</span>
          ) : (
            ""
          )}
        </div>
        {/* <div className=" col-span-1">
          <FormLabel className="block text-sm font-medium  text-gray-700">
            Select Announcement
          </FormLabel>

          <TomSelect
            multiple
            value={byWhich}
            onChange={(e: any) => {
              if (e.length == 0) {
                setBywhich([]);
                setPostHubdata([]);
                setPostfranchisedata([]);
                setPoststatedata([]);
              }
              setBywhich(e);

              handleTomSelect(e);
            }}
            options={{
              placeholder: "Select Announcement",
            }}
            className={`bg-white p-0.5 z-[200] mt-1 ${
              isError.send_to ? "border-red-400" : ""
            }`}
          >
            <option value={"1"}>Franchise Wise</option>
            <option value={"2"}>Hub Wise</option>
            <option value={"3"}>State Wise</option>
          </TomSelect>
        
        </div> */}
        {/* {byWhich?.length >= 1 && byWhich.includes(`1`) ? ( */}
        <div className="col-span-12 lg:col-span-12">
          <FormLabel className="block text-sm font-medium  text-gray-700">
            Select Franchise
          </FormLabel>

          <MultiSelectCommon
            data={allfranchiseedata}
            multipledata={postfranchisedata}
            setmultipledata={setPostfranchisedata}
            errorvalue={errors.franchisee_ids}
            fun1={handlefranchiselist}
            fun2={setErrors}
          />
          {isError.franchisee ? (
            <h4 className="text-red-400 mt-1">
              {"Please select franchise also"}
            </h4>
          ) : (
            ""
          )}
        </div>
        {/* ) : (
          ""
        )} */}
        {byWhich?.length >= 1 && byWhich.includes(`2`) ? (
          <div className="col-span-12 lg:col-span-12">
            <FormLabel className="block text-sm font-medium  text-gray-700">
              Select Hub
              {/* <span className="text-red-400">*</span> */}
            </FormLabel>

            <div className=" grid  gap-6 w-full ">
              <div>
                <TomSelect
                  value={posthubdata}
                  onChange={(e: any) => {
                    if (posthubdata.includes(0) && e.includes(0)) {
                      setPostHubdata(["0"]);
                      setIsError((pre: any) => ({
                        ...pre,
                        send_to_ids: "",
                        hub: "",
                      }));
                    } else {
                      setPostHubdata(e);
                      setIsError((pre: any) => ({
                        ...pre,
                        send_to_ids: "",
                        hub: "",
                      }));
                    }
                    // setError((pre: any) => ({ ...pre, couriers: "" }));
                  }}
                  options={{
                    placeholder: "SELECT",
                  }}
                  className={`bg-white`}
                  multiple
                  name="hubdata"
                >
                  <option value={"0"}>
                    To All{" "}
                    {/* {byWhich == 1
                      ? "Franchise"
                      : byWhich == 2
                      ? "Hub"
                      :byWhich==3? "States":""} */}
                  </option>
                  {posthubdata.includes("0") == false &&
                    initialhubdata?.length >= 1 &&
                    initialhubdata.map((item: any, index: any) => (
                      <option value={item?.hub_id}>{item?.hub_name}</option>
                    ))}
                </TomSelect>
                {isError.hub ? (
                  <h4 className="text-red-400 mt-1">
                    {"Please select hub also"}
                  </h4>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {byWhich?.length >= 1 && byWhich.includes(`3`) ? (
          <div className="col-span-12 lg:col-span-12">
            <FormLabel className="block text-sm font-medium  text-gray-700">
              Select State
            </FormLabel>

            <div className=" grid  gap-6 w-full ">
              <div>
                <TomSelect
                  value={postStatedata}
                  onChange={(e: any) => {
                    if (postStatedata.includes(0) && e.includes(0)) {
                      setPoststatedata([]);
                      setIsError((pre: any) => ({
                        ...pre,
                        send_to_ids: "",
                        state: "",
                      }));
                    } else {
                      setPoststatedata(e);
                      setIsError((pre: any) => ({
                        ...pre,
                        send_to_ids: "",
                        state: "",
                      }));
                    }
                    // setError((pre: any) => ({ ...pre, couriers: "" }));
                  }}
                  options={{
                    placeholder: "SELECT",
                  }}
                  className={`bg-white`}
                  multiple
                  name="statedata"
                >
                  <option value={"0"}>
                    To All{" "}
                    {/* {byWhich == 1
                      ? "Franchise"
                      : byWhich == 2
                      ? "Hub"
                      :byWhich==3? "States":""} */}
                  </option>
                  {postStatedata.includes("0") == false &&
                    initialstatedata?.length >= 1 &&
                    initialstatedata.map((item: any, index: any) => (
                      <option value={item?.state_id}>{item?.state_name}</option>
                    ))}
                </TomSelect>
                {isError.state ? (
                  <h4 className="text-red-400 mt-1">
                    {"Please select states also"}
                  </h4>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className="  col-span-12 lg:col-span-12  ">
          <FormLabel
            htmlFor="bcc"
            className="block text-sm text-left font-medium text-gray-700"
          >
            Mail Body
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

            {isError?.message_body ? (
              <span className="text-red-400">{isError?.message_body}</span>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <FormLabel className="block text-sm font-medium text-gray-700 mb-0">
            Mail Attatchment
          </FormLabel>
          <FormInput
            type="file"
            className=" bg-[#f4f4f4] border border-[#ddd]"
            // accept=".csv"
            onChange={handleFileChange}
          />
          {isError?.file ? (
            <span className="text-red-400">{isError?.file}</span>
          ) : (
            ""
          )}
          {/* {!valid && rateCard == "" && (
         <p className="text-red-500 text-xs mt-1">Rate Card is required.</p>
       )} */}
        </div>
        <div className="col-span-12 lg:col-span-6">
          <FormLabel className="block text-sm font-medium text-gray-700 !mb-0">
            Select Date
            <span className="text-red-400">*</span>
          </FormLabel>
          {isError?.from_date || isError?.to_date ? (
            <p className="text-red-400">{"This field is Required"}</p>
          ) : (
            ""
          )}
          <div className=" flex">
            <div className="mr-2 block lg:flex gap-2  items-center">
              <FormLabel className="block text-sm font-medium text-gray-700 !mb-0">
                From
                <span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                id="from"
                name="send_to"
                type="date"
                value={editdata?.from_date}
                onChange={(e: any) => {
                  setEditdata((pre: any) => ({
                    ...pre,
                    from_date: e.target.value,
                  }));
                  setIsError((pre: any) => ({ ...pre, from_date: "" }));
                }}
              />
            </div>
            <div className=" block lg:flex gap-2 items-center">
              <FormLabel className="block text-sm font-medium text-gray-700 !mb-0">
                To
                <span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                id="to"
                name="to_date"
                type="date"
                value={editdata?.to_date}
                onChange={(e: any) => {
                  setEditdata((pre: any) => ({
                    ...pre,
                    to_date: e.target.value,
                  }));
                  setIsError((pre: any) => ({ ...pre, to_date: "" }));
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const mail_body_content = (
    <div className="    mt-0 col-span-6 h-[100] overflow-y-auto">
      <div className="w-full m-auto  rounded ">
        {/* {mailbody} */}
        <div>
          <ClassicEditor value={mailbody} onChange={setMailbody} />
        </div>
      </div>
    </div>
  );

  const modalFooter = (
    <>
      <Button
        type="button"
        variant="outline-secondary"
        onClick={handleCancel}
        className="w-20 mr-1 p-2"
      >
        Cancel
      </Button>
      {posting ? (
        <Button
          variant="mustard"
          type="button"
          className="w-20 p-2"

          // ref={sendButtonRef}
        >
          SAVING...
        </Button>
      ) : (
        <Button
          variant="mustard"
          type="button"
          className="w-20 p-2"
          onClick={handleSubmit}
          // ref={sendButtonRef}
        >
          SAVE
        </Button>
      )}
    </>
  );

  const mail_footer = (
    <>
      <Button
        type="button"
        variant="outline-secondary"
        onClick={handleCancel}
        className="w-20 mr-1 p-2"
      >
        Close
      </Button>
    </>
  );
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (isLoading) return;

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
  }, [isLoading]);

  if (isLoading) {
    return <IsLoading />;
  }

  return (
    <>
      <div className="w-full mt-2 mb-4">
        <div
          className="mt-1 w-full bg-white rounded-[10px]  border border-white"
          data-aos="fade-up"
        >
          <div className=" w-full py-2  px-3 border-b border-white commonGBackOffice  rounded-t-[10px]">
            <div className="flex-wrap lg:flex-nowrap flex gap-2 items-center justify-between w-full commonGBackOfficeInner">
              <div>
                <div className="flex items-center gap-2" data-aos="fade-up">
                  <i className=" w-[25px] h-[25px]  rounded-lg flex items-center justify-center bg-mustard">
                    <Megaphone className="w-[17px]  text-[#fff] " />
                  </i>
                  <h4 className="text-[16px] font-medium text-white">
                    SKART ANNOUNCEMENT
                  </h4>
                </div>
              </div>

              <div className="flex items-center" data-aos="fade-up">
                <div className="flex justify-between">
                  {pdata?.create_permission ? (
                    <Button
                      variant="mustard"
                      className="px-3 py-2 bg-blue-500 hover:bg-blue-600  rounded-md border-none"
                      onClick={() => {
                        setOpen(true);
                        setCreateEditData(true);
                      }}
                    >
                      <BsPlus className="text-white mr-[6px] w-[21px] h-[21px] " />{" "}
                      Create
                    </Button>
                  ) : (
                    ""
                  )}
                  <div>
                    {data >= 1 && (
                      <Commondownload
                        data={allgetdata}
                        forwhat={"announcements"}
                        icon={true}
                      />
                    )}
                  </div>
                  {/* <AddProductTypeModal handleRefresh={handleRefresh} /> */}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2  lg:p-6">
            <div>
              <div className=" w-full overflow-auto" data-aos="fade-up">
                <Table sm hover>
                  {/* Table headers */}
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="text-left">#</Table.Th>
                      <Table.Th className="text-left">
                        ANNOUNCEMENT NAME
                      </Table.Th>
                      {/* <Table.Th className="text-left">UPDATED AT </Table.Th> */}
                      <Table.Th className="text-center">BODY</Table.Th>

                      <Table.Th className="text-center">ATTATCHMENT</Table.Th>
                      {/* <Table.Th>DATE</Table.Th> */}
                      <Table.Th>ACTIVE/INACTIVE</Table.Th>
                      {pdata?.update_permission || pdata?.delete_permission ? (
                        <Table.Th>ACTION</Table.Th>
                      ) : (
                        ""
                      )}
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {data?.length >= 1 &&
                      data?.map((item: any, index: any) => (
                        <Table.Tr key={index} className="intro-x">
                          <Table.Td className="text-left">
                            {(page - 1) * 20 + index + 1}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {item?.announcement_name
                              ? item?.announcement_name
                              : "N.A"}
                          </Table.Td>

                          {/* <Table.Td className=" text-left">{item.updatedAt}</Table.Td> */}

                          <Table.Td className="p-0 text-center">
                            <div className="flex justify-center hover:text-mustard">
                              {" "}
                              <Eye
                                onClick={() => {
                                  if (item?.message_body) {
                                    setData_id(item.id);
                                    setOpenmailbox(true);
                                    setMailbody(item?.message_body);
                                  } else {
                                    showAlert("No Content To Show", "warning");
                                  }
                                }}
                                className="cursor-pointer"
                              />
                            </div>
                          </Table.Td>

                          <Table.Td className="text-center p-0">
                            <div className="flex justify-center">
                              {item?.file ? (
                                <a href={item?.file} target="_blank">
                                  View
                                </a>
                              ) : (
                                "N.A"
                              )}
                            </div>
                          </Table.Td>

                          {/* <Table.Td className="text-center p-0">{item?.DATE}</Table.Td> */}
                          <Table.Td className="p-0 text-center">
                            <FormSwitch className="grid justify-items-center w-full   sm:w-auto sm:ml-auto sm:mt-0">
                              <FormSwitch.Input
                                onChange={() =>
                                  handleaction(
                                    `admin/announcement-activate/${item.id}`,
                                  )
                                }
                                defaultChecked={
                                  item?.is_active == 1 ? true : false
                                }
                                type="checkbox"
                                className="p-0"
                              />
                            </FormSwitch>
                          </Table.Td>

                          {pdata?.update_permission ||
                          pdata?.delete_permission ? (
                            <Table.Td className="text-center p-0">
                              <div className="flex justify-center gap-4">
                                {pdata?.update_permission ? (
                                  <Tippy content="Edit">
                                    <Pencil
                                      // style={{marginRight:"20px"}}
                                      onClick={() => {
                                        // setEditdata(item);
                                        setCreateEditData(false);
                                        setEditdata(item);
                                        setEditorData(item?.message_body);
                                        // testdata?.is_email && setSendViaEmail(true);

                                        // testdata?.is_whatsapp && setSendViaWhatsapp(true);

                                        item?.is_whatsapp &&
                                          setSendViaWhatsapp(true);
                                        item?.is_email && setSendViaEmail(true);

                                        if (item?.franchisee?.length >= 1) {
                                          //  console.log(item?.franchisee,"editfranchise")
                                          const filteredArray =
                                            allfranchiseedata.filter(
                                              (itemmain: any) => {
                                                //  console.log(item,"value")
                                                // console.log(itemmain?.value)
                                                return item?.franchisee?.includes(
                                                  itemmain.id,
                                                );
                                              },
                                            );
                                          //  console.log(filteredArray,"filteedarray")
                                          const newdata = filteredArray?.map(
                                            (item: any) => {
                                              return {
                                                value: item?.id,
                                                label: item?.name,
                                              };
                                            },
                                          );
                                          setPostfranchisedata(newdata || []);
                                        }

                                        setFiledata(item?.file);
                                        setEditdata((pre: any) => ({
                                          ...pre,
                                          from_date: item?.from_date,
                                          to_date: item?.to_date,
                                        }));
                                        setType("EDIT");
                                        setOpen(true);
                                      }}
                                      className="text-success text-xl ml-2 "
                                    />
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                                {pdata?.delete_permission ? (
                                  <Tippy content="Delete">
                                    <i>
                                      <Trash2
                                        onClick={() => {
                                          setDeleteId(item.id);

                                          setOpenDeleteModel(true);
                                        }}
                                        className="text-red-500 "
                                      />{" "}
                                    </i>
                                  </Tippy>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Table.Td>
                          ) : (
                            ""
                          )}
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </div>
              {data?.length == 0 ? <Nodatafound /> : ""}
              {data?.length >= 1 ? (
                <CommonPagination
                  totalpages={+count}
                  onPageChange={handlepageChange}
                  page={page}
                />
              ) : (
                ""
              )}
              {open && (
                <CommonModal
                  open={open}
                  setOpen={setOpen}
                  title={modalTilte}
                  description={formdata}
                  footer={modalFooter}
                  size="xl"
                  gridColumns="6"
                />
              )}
              {data_id ? (
                <CommonModal
                  open={openmailbox}
                  setOpen={setOpenmailbox}
                  title={mailBodyModalTilte}
                  description={mail_body_content}
                  footer={mail_footer}
                  size="lg"
                  gridColumns="6"
                />
              ) : (
                ""
              )}
              {openDeleteModel ? (
                <DeleteModal
                  setOpenDeleteModel={setOpenDeleteModel}
                  openDeletModel={openDeleteModel}
                  id={deleteid}
                  handleRefresh={handleRefresh}
                  endpoint="admin/announcement-delete"
                />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Announcements;
