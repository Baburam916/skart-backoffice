import { useRef, useState } from "react";
import {
  X,
  Calendar,
  Plus,
  Minus,
  RotateCcw,
  Upload,
  Check,
  Truck,
  MapPin,
  UserCog,
  CalendarDays,
  CalendarClock,
  FolderOpen,
  Building2,
  MousePointerClick,
  Mail,
  ChevronRight,
  Trash2,
} from "lucide-react";

import {FormCheck, FormLabel, FormSelect} from "../../../base-components/Form";
import Litepicker from "../../../base-components/Litepicker";
import { FormInput } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Tippy from "../../../base-components/Tippy";
import Lucide from "../../../base-components/Lucide";
import { FaRegBookmark } from "react-icons/fa";
import { getCurrentDate } from "../../../utils";
import LoadingButtonCommon from "../../skart_sales/commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import { useAlert } from "../../../ContextProvider/AlertContext";

const defaultRow = {
  event: "Delivered",
  remarks: "Departed From Del",
  date: "30 Dec, 2025",
};

function Scan_events({
  requiredstatus,
  Attatchments,
  csvfiles,
  setCsvfiles,
  handlesave,
  rowdata,
  setRowData,
  forwhat,
  setForWhat,
  setOpenModal,
  openModal,
  setDataToPost,
  datatopost,
  remarksdata,
  setRemarksdata,
  statusdata,
  bccList,
  setBccList,
  editorData,
  setEditorData,
  countrydata,
  trackerData,
  postloading,
  fileInputRefs
}: any) {
  const [date, setDate] = useState<string>("");

  const [active, setActive] = useState(1);

  const [fileName, setFileName] = useState("");

function renderTemplate(template?:any, data = {}) {
  return template.replace(/{{(.*?)}}/g, (match, key) => {
    const value = data[key.trim()];
    return value !== undefined && value !== null ? value : "";
  });
}
const {showAlert}=useAlert()
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  ///

  const [rows, setRows] = useState([defaultRow]);

  // Add row at bottom
  const addRow = () => {
    setRowData((prev: any) => [...prev, { ...defaultRow }]);
  };

  // Remove row
  const removeRow = (index: number) => {
    const data = [...rowdata];
    data.splice(index, 1);
    setRowData(data);

    fileInputRefs.current.splice(index, 1);
  };


  const addChildRow = (parentIndex: number, item?: any) => {
    const data = [...rowdata];
 
    const filtered =
      requiredstatus?.filter((i: any) => {
        const code = Number(i.status_code);
        return (
          code > Number(item?.updated_status) &&
          code < Number(item?.updated_status) + 1
        );
      }) || [];

    const biggestStatus =
      filtered.length > 0
        ? filtered.reduce((a: any, b: any) =>
            Number(b.status_code) > Number(a.status_code) ? b : a
          )
        : null;
const nextStatus = biggestStatus
  ? Number(biggestStatus.status_code)
  : Number(item?.updated_status);
    data[parentIndex].children.push({
      id: crypto.randomUUID(),
      cs_remarks: "",
      job_id: datatopost?.job_id,
      hub_id: datatopost?.hub_id,
      event_date_time: getCurrentDate() || "",
      is_edit: false,
      status_code: Number((nextStatus + 0.1).toFixed(1)),
      type:"child"
    });

    setRowData(data);
    setDataToPost((pre:any)=>({...pre,type:"child"}))
  };

  return (
    <>
      <div className="box w-full py-4 pr-4  pl-5   rounded-lg bg-white mt-2">
        {/* START box Loop*/}
        {rowdata?.map((item: any, index: number) => (
          <div
            onClick={() => setActive(1)}
            className={
              trackerData?.data?.filter(
                (item2: any) =>
                  Number(item2?.status_code) == Number(item?.updated_status)
              )?.length >= 1
                ? "relative w-full border-l-[3px] border-[#efb847] pl-[30px] pb-[22px]"
                : "relative w-full border-l-[3px] border-[#E6E6E6] pl-[30px] pb-[22px]"
            }
          >
            <div className="absolute left-[-16px] top-[0px]  z-10">
              <div className=" bg-[#efb847] w-[30px] h-[30px] rounded-full p-[2px]  relative z-10 flex justify-center items-center">
                {trackerData?.data?.filter(
                  (item2: any) =>
                    Number(item2?.status_code) == Number(item?.updated_status)
                )?.length >= 1 ? (
                  <Check className="w-[20px] h-[20px] text-white stroke-1.5 " />
                ) : (
                  ""
                )}
              </div>
              <span
                onClick={() => setActive(1)}
                className={
                  trackerData?.data?.filter(
                    (item2: any) =>
                      Number(item2?.status_code) == Number(item?.updated_status)
                  )?.length >= 1
                    ? "absolute top-[4px] left-[3px] inline-flex h-[23px]  w-[23px] animate-ping rounded-full bg-[#efb847] opacity-85 [animation-duration:3s]"
                    : "absolute top-[4px]  left-[3px]  inline-flex h-[23px]  w-[23px] animate-ping rounded-full bg-[#08ec2f] opacity-75 [animation-duration:3s]"
                }
              ></span>
            </div>

            <div
              onClick={() => setActive(1)}
              className={
                trackerData?.data?.filter(
                  (item2: any) =>
                    Number(item2?.status_code) == Number(item?.updated_status)
                )?.length >= 1
                  ? "border border-[#f2d599] rounded-[10px] shadow-[0_0px_5px_#edf5ff] relative "
                  : "border border-[#E6E6E6] rounded-[10px] shadow-[0_0px_5px_#edf5ff] relative "
              }
            >
              <div
                className={
                  trackerData?.data?.filter(
                    (item2: any) =>
                      Number(item2?.status_code) == Number(item?.updated_status)
                  )?.length >= 1
                    ? "rounded-tl-[10px] rounded-tr-[10px] border-b border-[#f2d599] px-[12px] py-[10px]  bg-[#fff9ee]"
                    : "rounded-tl-[10px] rounded-tr-[10px] border-b border-[#E6E6E6] px-[12px] py-[10px]  bg-[#F8F8F8]"
                }
              >
                <div className="block  md:flex   md:justify-between items-center">
                  <div className="  flex      relative ">
                    <figure className="w-[27px] h-[27px]">
                      <FormCheck className=" justify-start checkedColor items-start">
                        <FormCheck.Input
                          id={`checkbox-switch-${index}`}
                          type="checkbox"
                          className="checkColor w-[26px] h-[26px]"
                          checked={item?.is_edit}
                          onChange={(e: any) => {
                            const checked = e.target.checked;

                            const newdata = rowdata.map(
                              (row: any, i: number) => ({
                                ...row,
                                is_edit: i === index ? checked : false, // 👈 SINGLE SELECT LOGIC
                              })
                            );

                            setRowData(newdata);

                            if (checked) {
                              const singledata = Attatchments?.find(
                                (item2: any) =>
                                  item2?.scan_event == item?.updated_status
                              );

                              if (singledata?.attachment) {
                                setDataToPost((pre: any) => ({
                                  ...pre,
                                  mail_attachments: singledata?.attachment,
                                  type: "parent",
                                  index: index,
                                }));
                              }
                            }
                          }}
                        />
                      </FormCheck>
                    </figure>
                    <aside className="ml-2 leading-[14px]">
                      <h2 className=" text-[11px] font-[500] uppercase text-[#585858]">
                        Scan Events
                      </h2>
                      <p className="text-[14px] font-medium leading-[15px] text-[#262525]">
                        {item?.event}
                      </p>
                    </aside>
                  </div>

                  <div className="flex justify-between mt-2 md:mt-0 ">
                    <div className="relative w-full">
                      <div className="relative w-[150px] ">
                        {/* <div className="absolute flex items-center justify-center w-10 h-full border rounded-l bg-[#fff] text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
                          <CalendarClock className="w-[20px]" />
                        </div> */}
                        <FormInput
                          type="date"
                          value={item?.event_date_time || getCurrentDate()}
                          disabled={!item?.is_edit}
                          onChange={(e: any) => {
                            const newdata = [...rowdata];
                            newdata[index]["event_date_time"] = e.target.value;
                            setRowData(newdata);
                          }}
                          className="pl-6 pr-0 h-[34px] text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" pt-[17px]  pb-[22px] px-[12px] m-auto">
                <div className=" grid grid-cols-12 gap-x-0 gap-y-3  relative">
                  <div className="col-span-12 md:col-span-6  lg:col-span-4  md:border-r  md:border-black-700/20 pr-2 items-center flex">
                    <div className="  flex  relative w-full ">
                      <div className="w-[10%] ">
                        <figure className="bg-[#FFF2D8] rounded-full p-2 w-[35px] h-[35px] mt-[25px]">
                          <FaRegBookmark className="w-[20px] h-[20px] text-[#AA7802]" />
                        </figure>
                      </div>
                      <div className="w-[80%]">
                        <div className="w-full">
                          <FormLabel className="  text-[11px] font-[500] uppercase ">
                            REMARKS <span className="text-red-400">*</span>
                          </FormLabel>

                          <FormInput
                            disabled={!item?.is_edit||datatopost?.type=="child"}
                            placeholder="Remarks"
                            onChange={(e: any) => {
                              const newdata = [...rowdata];
                              newdata[index]["cs_remarks"] = e.target.value;
                              setRowData(newdata);
                            }}
                            value={item?.cs_remarks}
                            className="w-[100%] "
                          />
                        </div>
                        {/* <p className="text-[14px] font-medium leading-[15px] text-[#262525]">
                        
                        </p> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-6  lg:col-span-2 lg:border-r  lg:border-black-700/20 px-2 items-center flex">
                    <div className="w-full flex justify-start  md:justify-center mt-7">
                      <div className="relative w-[120px] h-[35px] rounded-full overflow-hidden">
                        {/* ROTATING BORDER */}
                        <div
                          className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]
                     hover:[animation-play-state:paused]"
                        >
                          <div
                            className="h-full w-full
                       bg-[conic-gradient(#213,#efb847_5%,#112_60%,#000_95%)]
                       [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                       [mask-composite:exclude]
                       p-[5px] hover:bg- bg-[conic-gradient(#303030,#303030%,#303030_60%,#303030_95%)]"
                          />
                        </div>

                        {/* INNER CONTENT */}
                        <div
                          className="relative z-10 w-[118px] bg-[#FFF2D8] hover:bg-[#f1f5f9] rounded-full h-[33px] flex items-center justify-center m-[1px] cursor-pointer"
                          onClick={() => {
                            if (item?.is_edit && item?.cs_remarks) {
                              if (
                                datatopost?.extra_data?.cc_mail_ids?.length >= 1
                              ) {
                                setRemarksdata((pre: any) => ({
                                  ...pre,

                                  email_ids:
                                    datatopost?.extra_data?.cc_mail_ids || [],
                                }));

                                setBccList(
                                  datatopost?.extra_data?.cc_mail_ids || []
                                );
                              }
                              if (datatopost?.extra_data?.follow_up) {
                                setRemarksdata((pre: any) => ({
                                  ...pre,
                                  follow_up:
                                    datatopost?.extra_data?.follow_up || 0,
                                }));
                              }

                              if(!item?.email_content){
                              setEditorData(`
  <p>Dear,</p>
  <p>Greetings of the day!</p>

  <p>
    This is to inform you that your shipment is currently at the status:
    <strong>${
      statusdata?.find(
        (item2: any) => item2?.status_code == item?.updated_status
      )?.status || ""
    }</strong>
    for the spot enquiry <strong>${datatopost?.booking_no}</strong>.
  </p>

  <!-- NEW DETAILS ADDED BELOW -->
  <table width="100%" cellpadding="6" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px; margin: 10px 0; border: 1px solid #ddd;">
    <tbody>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>POL (Port of Loading):</strong> ${
          countrydata?.find(
            (item2: any) => item2?.country_id == datatopost?.org_country_id
          )?.country_name || "N/A"
        }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>POD (Port of Destination):</strong> ${
          datatopost?.port_of_dest || "N/A"
        }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>GW (Gross Weight):</strong> ${
          datatopost?.gross_weight || "N/A"
        }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>No. of Packages:</strong> ${
          datatopost?.packages || "N/A"
        }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>CW (Chargeable Weight):</strong> ${
          datatopost?.chargeable_weight || "N/A"
        }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>Departure Date:</strong> ${
          datatopost?.departure_date || "N/A"
        }</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 6px;"><strong>Arrival Date:</strong> ${
          datatopost?.arrival_date || "N/A"
        }</td>
        <td style="border: 1px solid #ddd; padding: 6px;"></td>
      </tr>
    </tbody>
  </table>
  <!-- END DETAILS -->

  <p>We will continue to keep you updated on any further progress or required action.</p>
  <p>For any queries, please feel free to reach out to us.</p>
  <p>Best regards,</p>
`)}else{
  const templateData: any = {
    AWB_NO: datatopost?.airwaybilno||"",
    ETD: item?.event_date_time,
    ETA: "",
    ARRIVAL_DATE: "",
    DELIVERY_DATE: "",
  };
 const finalContent = renderTemplate(item?.email_content?.body, templateData)

  setEditorData(finalContent)
}

                              setRemarksdata((pre: any) => ({
                                ...pre,
                                follow_up: datatopost?.follow_up || 0,
                                job_id: datatopost?.job_id,
                                cs_remarks: item?.cs_remarks,
                                updated_status: item?.updated_status,
                                booking_no: datatopost?.booking_no || "",
                                pickup_id: datatopost?.pickup_id || "",
                                charges_docs: datatopost?.charges_docs || [],
                                hub_id: datatopost?.hub_id || "",
                                mail_trigger: 1,
                                mail_subject:item?.email_content?item?.email_content?.subject:
                                  datatopost?.extra_data?.mail_subject ||
                                  `Shipment Update: ${
                                    datatopost?.booking_no
                                  }- ${datatopost?.airwaybilno || ""}${
                                    datatopost?.master
                                      ? `/${datatopost?.master}`
                                      : ""
                                  }`,
                                ...(datatopost?.mail_attachments
                                  ? {
                                      mail_attachments:
                                        datatopost?.mail_attachments,
                                    }
                                  : {}),
                              }));
                              setForWhat(5);
                              setOpenModal(true);
                            }else{
                              showAlert("Please provide the Remarks","warning")
                            }
                          }}
                        >
                          <Mail className="w-[17px] h-[17px] text-[#AA7802]" />{" "}
                          <p className="font-bold ml-[7px] text-[13px]">
                            Send Email
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12  md:col-span-6 lg:col-span-3  md:border-r  md:border-black-700/20 px-2 items-center flex">
                    <div className="w-full relative px-[0] md:px-[4%] mt-7">
                      {/* Browse button */}
                      <label className="flex items-center justify-center border  border-[#c0d2e4]  w-full rounded bg-[#f1f5f9] px-[4px] py-[5px] text-[12px] font-medium text-center text-[#000] hover:bg-[#fff5e0]  hover:text-[#a8750a] hover:border-[#ffcf6a]">
                        {/* <span className="flex items-center justify-center text-[13px] cursor-pointer">
                          <Upload className="w-[16px] mr-1" /> Upload file and
                          URL link
                        </span> */}

                        <FormInput
                          type="file"
                          disabled={!item?.is_edit}
                          ref={(el: any) => (fileInputRefs.current[index] = el)}
                          multiple
                          className="
                 border border-gray-400 w-[100%]"
                          onChange={(e: any) => {
                            if (item?.cs_remarks) {
                         
                              const data: any = [...rowdata];
                              data[index]["files"] = e.target.files;
                            } else {
                                    const data: any = [...rowdata];
                                
                                    data[index]["files"] = "";
                                    fileInputRefs.current[index]!.value = "";
                              showAlert("Please Provide Remarks ", "warning");
                        
                            }}}
                          // className="hidden"
                          // onChange={handleFileChange}
                        />
                      </label>

                      {/* Selected file */}
                    </div>
                  </div>

                  <div className="col-span-12  md:col-span-6 lg:col-span-3 mt-8">
                    <div className="flex  items-center justify-start  md:justify-center  gap-x-1 w-full ">
                      <Button
                        onClick={() => {
                          const { job_id, hub_id } = remarksdata;
                          let updatedata: any = {
                            ...item,
                            hub_id,
                            job_id,
                            mail_trigger: 0,
                            import_booking:datatopost?.import_booking||"",
                            event_date_time:item?.event_date_time||"",

                            follow_up: datatopost?.extra_data?.follow_up || 0,
                          };
                          if (
                            datatopost?.extra_data?.cc_mail_ids?.length >= 1
                          ) {
                            updatedata.email_ids =
                              datatopost?.extra_data?.cc_mail_ids;
                          }
                          if (datatopost?.extra_data?.mail_subject) {
                            updatedata.mail_subject =
                              datatopost?.extra_data?.mail_subject;
                          }
                          if (datatopost?.extra_data?.mail_content) {
                            updatedata.mail_content =
                              datatopost?.extra_data?.mail_content;
                          }
                          if (datatopost?.mail_attachments) {
                            updatedata.mail_attachments =
                              datatopost?.mail_attachments;
                          }
                          handlesave(5, "", updatedata,index);
                        }}
                        disabled={
                          !item?.is_edit ||
                          !item?.cs_remarks ||
                          !item?.event_date_time ||
                          postloading||datatopost?.type=="child"
                        }
                        className="flex items-center  h-[31px]  bg-mustard px-[20px] py-1 font-base  rounded-[7px] text-white font-bold  uppercase "
                      >
                        {postloading &&
                        datatopost?.type == "parent" &&
                        index == datatopost?.index ? (
                          <LoadingButtonCommon text="updating" />
                        ) : (
                          "Update"
                        )}
                      </Button>

                      <button
                        className="flex items-center h-[31px] bg-red-500 px-[17px] py-1 rounded-[7px] text-white font-bold uppercase"
                        onClick={() => {
                          const data = [...rowdata];

                          // reset file input of THIS row only
                          if (fileInputRefs.current[index]) {
                            fileInputRefs.current[index]!.value = "";
                          }

                          data[index]["files"] = "";
                          data[index]["cs_remarks"] = "";
                          data[index]["is_edit"] = false;
                          data[index].children=[];
setDataToPost((pre:any)=>({...pre,type:"parent"}))
                          setRowData(data);
                        }}
                      >
                        Reset
                      </button>

                      {/** 
              <button className="flex items-center  h-[31px]  bg-mustard px-[20px] py-1 font-base  rounded-[7px] text-white font-bold  uppercase hover:bg-[#777779]">
                      Save
                    </button>

 <button className="flex items-center  h-[31px]  bg-red-500 px-[17px] py-1 font-base  rounded-[7px] text-white font-bold  uppercase hover:bg-[#777779]">
                      Cancel
                    </button>


*/}
                    </div>
                  </div>
                </div>
              </div>

              <div className=" absolute bottom-[-9px] left-[0px] right-[0px] ">
                <button
                  disabled={!item?.is_edit}
                  onClick={(e) => {
                    e.stopPropagation(); // VERY IMPORTANT
                    addChildRow(index, item);
                  }}
                  className="z-50 relative flex items-center w-[20px] h-[20px] m-auto
             bg-mustard rounded-full text-white hover:bg-[#777779]"
                >
                  <Plus className="w-[18px] h-[18px] m-auto" />
                </button>

                <span className="absolute bottom-[0px] left-[0px] right-[0px] m-auto inline-flex h-[18px]  w-[18px] animate-ping rounded-full bg-mustard opacity-90 [animation-duration:3s]"></span>
              </div>
            </div>
            {/* CHILDREN OF THIS PARENT */}
            {item?.children?.map((child: any, childIndex: number) => (
              <div
                key={child.id || childIndex}
                className="ml-4 sm:ml-8 mt-3 border-l-2 border-dashed border-[#efb847] pl-4"
              >
                <div
                  className="
        bg-[#fffaf0] rounded-lg p-3
        grid grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-12
        gap-3
        items-end
      "
                >
                  {/* EVENT NAME */}
                  <div className="lg:col-span-3">
                    <FormLabel className="text-[10px] font-semibold uppercase mb-1">
                      Event Name <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormInput
                      disabled={!item?.is_edit}
                      placeholder="Event name"
                      value={child?.event_name || ""}
                      onChange={(e: any) => {
                        const data = [...rowdata];
                        data[index].children[childIndex].event_name =
                          e.target.value;
                        setRowData(data);
                      }}
                    />
                  </div>

                  {/* EVENT DATE */}
                  <div className="lg:col-span-2">
                    <FormLabel className="text-[10px] font-semibold uppercase mb-1">
                      Event Date
                    </FormLabel>
                    <FormInput
                      type="date"
                      disabled={!item?.is_edit}
                      value={child?.event_date_time || ""}
                      onChange={(e: any) => {
                        const data = [...rowdata];
                        data[index].children[childIndex].event_date_time =
                          e.target.value;
                        setRowData(data);
                      }}
                    />
                  </div>

                  {/* REMARKS */}
                  <div className="lg:col-span-3">
                    <FormLabel className="text-[10px] font-semibold uppercase mb-1">
                      Remarks <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormInput
                      disabled={!item?.is_edit}
                      placeholder="Remarks"
                      value={child?.cs_remarks || ""}
                      onChange={(e: any) => {
                        const data = [...rowdata];
                        data[index].children[childIndex].cs_remarks =
                          e.target.value;
                        setRowData(data);
                      }}
                    />
                  </div>

                  {/* FILE UPLOAD */}
                  <div className="lg:col-span-2">
                    <FormLabel className="text-[10px] font-semibold uppercase mb-1">
                      Upload
                    </FormLabel>
                    <input
                      type="file"
                      multiple
                      disabled={!item?.is_edit}
                      className="
            text-[11px] border rounded w-full bg-white
            file:mr-2 file:px-2 file:py-1 file:border-0
            file:bg-[#efb847] file:text-white file:text-xs
          "
                      onChange={(e: any) => {
                        const data = [...rowdata];
                        data[index].children[childIndex].files = e.target.files;
                        setRowData(data);
                      }}
                    />
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="lg:col-span-2 flex flex-wrap gap-2">
                    {/* SAVE */}
                    <button
                      disabled={
                        !item?.is_edit ||
                        !child?.event_name ||
                        !child?.event_date_time ||
                        !child?.cs_remarks||postloading
                      }
                      onClick={() => {
                        handlesave(5, "", {
                          ...child,
                          index: childIndex,
                          parent_event_id: item?.id,
                          mail_trigger: 0,
                          import_booking: datatopost?.import_booking || "",
                          updated_status: 0,
                          event_date_time: rowdata[index]?.event_date_time,
                        });
                      }}
                      className="
            h-[32px] px-3 bg-green-600 text-white rounded
            text-xs font-bold disabled:opacity-50 w-full sm:w-auto
          "
                    >
                      {postloading &&
                      datatopost?.type == "child" &&
                      datatopost?.index == childIndex
                        ? "Saving..."
                        : "Save"}
                    </button>

                    {/* RESET */}
                    <button
                      onClick={() => {
                        const data = [...rowdata];
                        data[index].children[childIndex] = {
                          ...data[index].children[childIndex],
                          event_name: "",
                          event_date_time: "",
                          cs_remarks: "",
                          files: "",
                        };
                        setRowData(data);
                      }}
                      className="
            h-[32px] px-3 bg-gray-400 text-white rounded
            text-xs font-bold w-full sm:w-auto
          "
                    >
                      Reset
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => {
                        const data = [...rowdata];
                      if(data[index]?.children?.length==1){
                        setDataToPost((pre:any)=>({...pre,type:"parent"}))
                      }
                        data[index].children.splice(childIndex, 1);
                        setRowData(data);
                      }}
                      className="
            h-[32px] w-full sm:w-[32px]
            flex items-center justify-center
            bg-red-500 text-white rounded
          "
                      title="Delete"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* END box Loop*/}

        {/* END box Loop*/}

        {/* END box Loop*/}

        <div className="w-full mt-5 flex justify-end">
          <button className="flex items-center  h-[32px]  bg-mustard px-[18px] py-1 font-base  rounded-[7px] text-white font-bold  uppercase hover:bg-[#777779]">
            Save
          </button>
        </div>
      </div>
    </>
  );
}

export default Scan_events;
