import React, { useEffect, useState } from "react";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useDebounce } from "../commoncomponents/JsonToCsv/useDebounce/useDebounce";
import { FormCheck, FormInput, FormLabel } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { Download, Edit, Eye, Plus } from "lucide-react";
import Table from "../../../base-components/Table";
import { Pencil } from "lucide-react";
import CommonTable from "../commoncomponents/CommonTable/CommonTable";
import { commongetrequest, commonpostrequest } from "../../../AllServices/services";
import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";
import CommonPagination from "../../../components/Pagination";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import { formatIndianNumber } from "../commoncomponents/CommonNumberConverter/CommonNumberconverter";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import Tippy from "../../../base-components/Tippy";

export default function SalesMain() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [intdatatopost, setIntdatatopost] = useState<any>();
  // const [intpudata,setIntpudata]=useState<any>([])
  const [postpuddata, setPostpuddata] = useState<Array<any>>([]);
  const [count, setCount] = useState<any>(0);
  const [alldata, setAlldata] = useState<any>([]);
  const [type, setType] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [interrors, setInterrors] = useState<any>();
  const [error, setError] = useState<Array<any>>([]);
  const { showAlert } = useAlert();
  const [multipledata, setMultipledata] = useState<any>([]);
  //   const [editdata, setEditData] = useState<pudData>({});
  const [searchvalue, setSearchvalue] = useState<string>("");
  const debouncedSearchTerm = useDebounce<any>(searchvalue, 500);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [postisLoading, setPostisLoading] = useState<boolean>(false);
  const [forWhat, setForwhat] = useState<string>("");
  const [pdcData, setPdcData] = useState<any>({
    attachment: null,
    id: "",
    date_of_pdc: "",
    pdc_amount: "",
    cheque_no: "",
    bank: "",
    is_deposit: 0
  })


  //   console.log(editdata, "editdata");

  const handlePagechange = (e: number) => {
    setPage(e);
    setOffset((e - 1));
  };
  const funcItemEdit  = (data:any) => {
      console.log("Akahsya", data)
      const convertToInputDate = (dateStr) => {
        if (!dateStr) return "";
      
        const [day, month, year] = dateStr.split("-");
        return `${year}-${month}-${day}`; // yyyy-mm-dd
      };
      setPdcData({
        attachment: data?.attachment,
        id: data?.enquiry_id,
        date_of_pdc: data?.date_of_pdc
        ? convertToInputDate(data?.date_of_pdc)
        : '',
        pdc_amount: data?.pdc_amount,
        cheque_no: data?.cheque_no,
        bank: data?.bank,
        is_deposit: data?.is_deposit
      })
      setOpenModal(true)
  }
  const funcEye = (data) => {
    window.open(`${data}?${Math.random()}`, "_blank");
  };
  // const getReloadData = async(data) => {
  //   const res = await commongetrequest(`booking/get_enquiry_pdc_details`);
  //   let result = res?.data?.data?.filter((item:any) => item?.id == data)
  //   console.log(data,"resultAjay", result[0]?.attachment,result)
  //   if(res?.status == 200) {
    
  //     setPdcData({
  //       attachment: result[0]?.attachment|| "",
  //       id: result[0]?.id || "",
  //       date_of_pdc: result[0]?.date_of_pdc
  //         ? new Date(result[0]?.date_of_pdc).toISOString().split("T")[0]
  //         : "",
  //       pdc_amount: result[0]?.pdc_amount || "",
  //       cheque_no: result[0]?.cheque_no || "",
  //       bank: result[0]?.bank || "",
  //       is_deposit: result[0]?.is_deposit,
  //     });
  //     setOpenModal(true);
      
  //   }
  // }
  const columns = [
    { field: "action", headerName: "Action" },
    { field: "booking_no", headerName: "Enquiry No", text: 'text-left' },
    // { field: "", headerName: "Enquiry Date"},
    { field: "date_of_pdc", headerName: "Date of PDC", text: "text-left" },
    { field: "pdc_amount", headerName: "PDC Amount", text: "text-right" },
    { field: "cheque_no", headerName: "Cheque No", text: "text-right" },
    { field: "bank", headerName: "Bank", text: "text-left" },
    { field: "attach", headerName: "Attachment" },
    // { field: "", headerName: "Status"}
  ];
  const row: any = data?.map((item) => {
    const dataattach = (
      <div className="flex justify-center">
        {item?.attachment ? (
          <Eye
            className="text-mustard"
            onClick={() => funcEye(item?.attachment)}
          />
        ) : (
          "-"
        )}
      </div>
    );
    const action = (
      <div className="flex justify-center">
        
        <Edit className="cursor-pointer text-mustard" onClick={() => {funcItemEdit(item); setForwhat("UPDATE"); setError([])}} />
      </div>
    );
    
    return {
      ...item,
      date_of_pdc: item?.date_of_pdc,
      pdc_amount: formatIndianNumber(item?.pdc_amount),
      attach: dataattach,
      action: action
    };
  });

  useEffect(() => {
    fetchData();
  }, [refresh, offset, debouncedSearchTerm]);

  const funcPdcSave = async () => {
    const formdata = new FormData();
console.log(pdcData,"pdcdata")
    // Append all state fields to FormData
    Object.entries(pdcData).forEach(([key, value]) => {
      if (key === "attachment" && value) {
        formdata.append(key, value);
      } else if (key === "id") {
        // Use editdata.id if available, otherwise fallback to what's in pdcData
        formdata.append("id", key?.id || value || "");
      }
      else {
        formdata.append(key, value ?? "");
      }
    });
    formdata.append("booking_status", 8)
    // If you have enquiry_id from somewhere (e.g. newdata.enquiry_id)
    
    try {
      let res;
      if(forWhat == "CREATE"){
         res = await commonpostrequest("booking/update_enquiry_pdc", formdata);

      } else if(forWhat == "UPDATE") {
         res = await commonpostrequest("booking/update_enquiry_pdc", formdata)
      }
      if (res?.status == 200) {
        setOpenModal(false)
        setError([])
        setPdcData({
          attachment: "",
          id: "",
          date_of_pdc: "",
          pdc_amount: "",
          cheque_no: "",
          bank: "",
          is_deposit: 0
        })
        fetchData();
        showAlert("Data is successfully added");
      } else if(res?.status == 406) {
        //  setError()
        setError(res?.response?.data.errors)
      }
    } catch (err) {
      console.error("err", err);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 10,
        offset: offset ?? 0, // ensure value
      };

      if (debouncedSearchTerm) {
        params.id = debouncedSearchTerm.trim();
      }
      const response: any = await commongetrequest(
        `booking/get_enquiry_pdc_details`,
        { params }
      );

      //   console.log(response, "deleteresponse");
      if (response?.status == 200) {
        showAlert(response?.data.message);
        setCount(Math.ceil(Number(response?.data?.count) / 10));
        // console.log(response?.data.data);
        setData(response.data.data);
      } 
      else if(response?.status == 204) {
        setData([]);
      }
      else if (response?.message == "Network Error") {
        setError(response?.message);
        setLoading(false);
        showAlert(response.message, "error");
      } else if (response?.status == 500) {
        setLoading(false);
        showAlert(response?.response?.data?.message, 'error');
      } else if (response?.response.status == 400) {
        showAlert("Bad Request", "error");
        setLoading(false);
      } else if (response?.response.status == 401) {
        showAlert("Unauthorized", "error");
        setLoading(false);
      } else if (response?.response.status == 404) {
        showAlert("Not Found", "error");
        setLoading(false);
      } else if (response?.response.status == 502) {
        showAlert("Bad GateWay", "error");
        setLoading(false);
      }
    } catch (err: any) {
      showAlert(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  //   useEffect(()=>{
  // getdownloaddata()
  //   },[debouncedSearchTerm])

  //   const getdownloaddata=async()=>{
  //     const params:any={}
  //     if(debouncedSearchTerm){
  //       params.id=debouncedSearchTerm.trim()
  //     }
  //     try{
  // const response2: any = await commongetrequest("admin/sales-person",{params:params});
  // if (response2?.status == 200) {
  //   const data = response2?.data?.data || [];
  //   const newdata = data?.map((item?: any) => {
  //     return {
  //       ...item,
  //       name: item?.sales_person,
  //     };
  //   });

  //   setAlldata(newdata || []);
  // }else {
  //   setAlldata([])
  // }
  //     }catch(err:any){
  //       console.log(err?.message)
  //     }
  //   }
  const funcToOpen = (data) => {
    window.open(data, "_target");
  }
  const ModalTitle = (
    <div className="flex justify-between w-[100%]">
    <strong><p>PDC</p></strong>

    <div>

</div>
  </div>
  )
  const ModalDescription = (
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
                <span key={index}>{val.path === "date_of_pdc" ? val.msg : ""}</span>
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
                <span key={index}>{val.path === "pdc_amount" ? val.msg : ""}</span>
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
          <div className="flex justify-between">
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
        onClick={() => funcToOpen(pdcData?.attachment)}
        className="bg-mustard rounded-lg px-3 py-1 text-white cursor-pointer"
      >
        Download
        <Download className="text-white ml-1 cursor-pointer w-[18px]" />
      </Button>
    </Tippy>
  </div>
)}
          </div>
         
            <small style={{ color: "red" }}>
              {error?.map((val, index) => (
                <span key={index}>{val.path === "attachment" ? val.msg : ""}</span>
              ))}
            </small>
        </div>
        
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
    </>
  );

  const ModalFooter = (
    <div className="flex justify-end">
      <Button
        type="button"
        variant="outline-secondary"
        //   onClick={()=>handleCancel(2)}
        onClick={()=> {setOpenModal(false);setError([])}}

        className="w-20 mr-1 p-2"
      >
        Cancel
      </Button>
      <Button
        variant="mustard"
        type="button"
        className="w-20 p-2"
          onClick={()=> funcPdcSave()}
        // ref={sendButtonRef}
      >
        Save
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full border-t-4 border-blue-500 border-t-blue-500 h-12 w-12"></div>
      </div>
    );
  } else if (error && error == "Network Error") {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src={"/images/internetError.jpg"}
          alt="Internet Error"
          className="w-4/12 rounded-full opacity-50"
        />
      </div>
    );
  } else if (error && error == "500") {
    return (
      <div className="flex items-center justify-center h-screen">
        <img
          src={"/images/internalError.jpg"}
          alt="Internal Error Image"
          className="w-4/12 rounded-full opacity-50"
        />
      </div>
    );
  }
  return (
    <>
      <div>
        {/* <BackButton/> */}
        <div className="min-[600px]:flex justify-between mt-2 mb-1 p-2 border-b-2 rounded-md">
          {" "}
          <div>
            <h2 className="text-2xl font-bold text-primary">PDC List</h2>
          </div>
          <div className="min-[400px]:flex justify-normal">
            <div className="flex justify-between gap-2 ">
              <div className="col-span-12 mr-2">
                <FormInput
                  className="p-2.5"
                  value={searchvalue}
                  onChange={(e: any) => {
                    setSearchvalue(e.target.value);
                    setPage(1);
                    setOffset(0);
                    // setHit(4);
                  }}
                  placeholder="Search.."
                />
              </div>
            </div>
            {/* <div className="max-[400px]:mt-2">
              <Button
                variant="mustard"
                className="  p-2 mr-1"
                onClick={() => {
                  setOpenModal(true);
                  setType(1);
                  setForwhat("CREATE");
                }}
              >
                <Plus />
                Create
              </Button>
            </div> */}
            {/* <div className="max-[400px]:mt-2">
              {" "}
              {alldata?.length >= 1 ? (
                <Commondownload
                  data={alldata}
                  forwhat={"sales_person"}
                  icon={true}
                />
              ) : (
                ""
              )}
            </div> */}
          </div>
        </div>
        <div className="bg-white w-full shadow-lg rounded-md overflow-x-scroll">
          <CommonTable columns={columns} row={row} currentPage={page || 0} />
          {data?.length !== 0 && (
            <div>
              <CommonPagination
                totalpages={+count}
                onPageChange={handlePagechange}
                page={page}
              />
            </div>
          )}
          {data?.length == 0 && <Nodatafound />}
        </div>
        <CommonModal
          open={openModal}
          setOpen={setOpenModal}
          title= {ModalTitle}
          description={ModalDescription}
          footer={ModalFooter}
          size="lg"
        />
      </div>
    </>
  );
}
