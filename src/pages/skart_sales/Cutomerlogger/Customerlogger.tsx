import React, { useEffect, useState } from "react";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import { useAlert } from "../../../ContextProvider/AlertContext";
import Table from "../../../base-components/Table";

import { Search } from "lucide-react";
import { FormInput,FormLabel, FormSelect } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";

import CommonPagination from "../../../components/Pagination";

import { jsontocsv } from "../commoncomponents/JsonToCsv/Jsontocsv";

import { Menu } from "../../../base-components/Headless";
import Lucide from "../../../base-components/Lucide";
import { exportToPDF } from "../commoncomponents/ConvertToPdf/convertopdf";
import { convertJSONtoXLSX } from "../commoncomponents/ConvertToXlsx/Converttoxlsx";
import IsLoading from "../commoncomponents/isLoading/isLoading";
import { tranfereddata } from "../../../components/booking_summary_table/TransformKey";
import SearchableComp from "../commoncomponents/Commonsearchablebasedcom/commonsearchablecom";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";
import CommonSearchableAll from "../commoncomponents/CommonSearchableall/CommonSearchableall";
import { formatIndianNumber } from "../commoncomponents/CommonNumberConverter/CommonNumberconverter";


const intfranchiseedata = {
  franchisee_id: "",
  franchisee_name: "",
};
const intalldata=[{
"id": 984662,
"franchise_id": 992,

"entry_type": "Airwaybill void",

"transaction_type": "Cr",

"airwaybilno": "3538919882",

"skyway_airwaybilno": "3538919882",

"random_ref_no": "",

"utrn": "",

"entry_amount": 15365.960000000001,

"opening_balance": 1.88,

"closing_balance": 15367.84,

"invoice_no": "",

"bank_ref_no": "",

"is_deleted": 0,

"is_active": 1,

"payment_type": "",

"bank_name": "",

"cheque_no": "",

"available_credit_balance": 15367.84,

"wallet_balance": 0,

"billed_under_invoice_no": "",

"type": 1,

"remarks": "Airwaybill void",

"entry_date": "2025-01-14T09:59:26.000Z"

},

]
export default function CustomerLogger() {
  const [count, setCount] = useState<any>(0);
  const [franchiseId, setFranchiseId] = useState<any>(0);
  const [franchises,setFranchises]=useState<any>([])
  const [fromdate, setFromDate] = useState("");
  const [todate, setTodate] = useState("");
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [hit, setHit] = useState<any>(1);

  const [page, setPage] = useState<number>(1);

  const { showAlert } = useAlert();
const {userdata}=useLogin()
  const [datfordownload, setDatafordownload] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [offset, setOffset] = useState(0);

  const [loading, setLoading] = useState<boolean>(false);

  const [franchiseName, setFranchiseName] = useState<any>("");
  const [franciseedata, setFranchiseedata] = useState<any>([]);

  //  const [selectedId,setSelectedId]=useState<any>("")

  // console.log(franciseedata,"franchiseedata")

  const fun1 = (a?: any) => {
    setFranchiseId(a?.franchisee_id);
    setFranchiseName(a?.franchisee_name)
    // setFranchiseName(a?.franchisee_name);
    setFranchiseedata([]);
    setPage(1);
  
    setHit(3);
    // if(a){
    //     const singledata=franchises?.find((item:any)=>item?.franchisee_id==a?.franchisee_id)
    //     setFranchiseName(singledata?.franchisee_name)
    // }
  };

  // console.log(error, "erros");

  const handleSearch = () => {
    fetchData(1);
    // setPage(0)
  };

  //  Modal footer

  //   useEffect(()=>{
  // getFranchisee()

  //   },[])
  const handlePagechange = (e: number) => {

    setPage(Number(e));
 
    setHit(1);
  
  };


  useEffect(() => {
    if (franchiseId && fromdate && todate) {
      fetchData(hit);
    }
  }, [page,hit]);
  useEffect(()=>{
getintdata()
  },[])
  const getintdata=async()=>{
    try{
const res = await commongetrequest(`admin/franchisee-settings?sales_id=${userdata?.mapped_id}`);
if(res?.status==200){
  const data=res?.data?.data||[]

    setFranchises(res?.data?.data||[])
}else{
    setFranchises([])
}
    }catch(err:any){
        console.log(err?.message)
    }
  }
  const fetchData = async (value: any) => {

    if (
      fromdate &&
      todate &&
     franchiseId &&
      value == 1
    ) {
    
      try {
        // ?limit=10&offset=1&value=123423412
        setLoading(true);
        const response = await commonpostrequest(
          `logger/list/${franchiseId}?limit=20&offset=${((page-1)*20)}`,
          {
            from_date: fromdate,
            to_date: todate,
          }
        );
        const response2 = await commonpostrequest(
          `logger/list/${franchiseId}`,
          {
            from_date: fromdate,
            to_date: todate,
          }
        );

        if (response?.status == 200) {
          const data = response?.data?.data?.result || [];
          const newdata = data?.map((item: any) => {
            // delete item["franchise_id"];
            // delete item["id"];
            return {
              franchiseName: franchiseName,
              ...item,
            };
          });
          setFranchiseedata(newdata || []);
          setRefresh(!refresh);
          setCount(Math.ceil(response?.data?.data?.count / 20));
        }
        if (response2?.status == 200) {
          const data = response2?.data?.data?.result || [];
          const newdata = data?.map((item: any, index: number) => {
            delete item["franchise_id"];
            delete item["id"];
            return {
              "Sr. No.": index + 1,
              "Franchise Name": franchiseName,
              Date: formatDate(item?.entry_date) || "-",
              "Transaction Type": item?.entry_type,
              "AWB No.": item?.airwaybilno,
              "Opening Balance": Number(item?.opening_balance)?.toFixed(3) || 0,
              "Dr.":
                item?.transaction_type.toLowerCase() == "dr"
                  ? item?.entry_amount
                  : "-",
              "Cr.":
                item?.transaction_type.toLowerCase() == "cr"
                  ? item?.entry_amount
                  : "-",
              "Closing Balance": Number(item?.closing_balance)?.toFixed(3) || 0,
              "UTR No/Chq No/NEFT":
                item?.utrn || item?.cheque_no || item?.bank_ref_no || "-",
              Remarks: item?.remarks,
              "Random Transaction No.": item?.random_ref_no
                ? item?.random_ref_no
                : "-",
            };
          });

          setDatafordownload(tranfereddata(newdata) || []);
        } else if (response?.status == 204) {
          setFranchiseedata([]);
        } else if (response?.message == "Network Error") {
          showAlert(response.message, "error");
        } else if (response?.response?.data?.status == 500) {
          showAlert("Internal Error is Going on..", "error");
        } else {
          showAlert("Something going wrong..", "error");
        }
      } catch (err: any) {
        showAlert(err.message, "error");
      } finally {
        setLoading(false);
      }
    } else {
      !franchiseId
        ? showAlert("Please provide franchise ", "warning")
        : !fromdate
        ? showAlert("Please Provide from date", "warning")
        : !todate
        ? showAlert("Please Provide to which date", "warning")
        : "";
    }
  };
  const fun2 = () => {
    handleint();
  };
  const handleint = () => {
    setFranchiseedata([]);
    setDatafordownload([]);
    setSelectedfranchisedata(intfranchiseedata)
    setHit(3);
    setPage(1);
    setOffset(0);
  };

  return (
    <>
      <div>
        {/* <BackButton/> */}
        <div>
          <h2 className="text-2xl mt-4 ml-2 font-bold border-b-2 text-primary ">
            CUSTOMER LOGGER
          </h2>
        </div>
        <div
          className={`${
            franciseedata?.length >= 1
              ? "sm:grid grid-cols-5"
              : "sm:grid grid-cols-4"
          }   gap-4 mt-5 mb-2 p-2 bg-white shadow-lg rounded-md`}
        >
          {" "}
          <div className="col-span-1">
            <FormLabel htmlFor="modal-form-1">
              FRANCHISEE NAME<span className="text-red-400">*</span>
            </FormLabel>
            <div className="grid col-span-1">
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
              {/* <div>
              <FormSelect onChange={(e)=>fun1(e.target.value)}>
                <option value="">Select</option>
                {franchises?.length>=1&&franchises?.map((item:any)=>
                <option value={item?.franchisee_id}>{item?.franchisee_name}</option>)}
              </FormSelect>
              </div> */}
            </div>
          </div>
        
          <div className="w-full">
            <FormLabel htmlFor="modal-form-5">
              FROM DATE <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="modal-form-5"
              type="date"
              value={fromdate}
            //   min={todate}
              max={todate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="w-full">
            <FormLabel htmlFor="modal-form-5">
              TO DATE <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="modal-form-5"
              type="date"
              value={todate}
              min={fromdate}
            
              onChange={(e) => setTodate(e.target.value)}
            />
          </div>
          {franciseedata?.length >= 1 && (
            <div>
              <FormLabel>EXPORT</FormLabel>
              <Menu className=" sm:w-auto z-[100] ">
                <Menu.Button
                  as={Button}
                  variant="outline-secondary"
                  className="w-full sm:w-auto p-2"
                >
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                  <Lucide
                    icon="ChevronDown"
                    className="w-4 h-4 ml-auto sm:ml-2"
                  />
                </Menu.Button>
                <Menu.Items className="w-40">
                  <Menu.Item
                    className={"flex "}
                    onClick={() => {
                      convertJSONtoXLSX(datfordownload, "Report.xlsx");
                    }}
                  >
                    <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                    XLSX
                  </Menu.Item>
                  <Menu.Item
                    className={"flex "}
                    onClick={() => jsontocsv(datfordownload, "CSV_download")}
                  >
                    <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                    CSV
                  </Menu.Item>
                  <Menu.Item
                    className={"flex "}
                    onClick={() => exportToPDF(datfordownload, franchiseName)}
                    // onClick={() => console.log(formatData(logData))}
                  >
                    <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                    PDF
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          )}
          <div className="w-full">
            {loading ? (
              <Button variant="mustard" className="p-2  mt-5">
                <Search /> SEARCHING..
              </Button>
            ) : (
              <Button
                variant="mustard"
                className="p-2  mt-5"
                onClick={()=>{handleSearch()
                setPage(1)}}
              >
                <Search /> SEARCH
              </Button>
            )}
          </div>
        </div>
        <div className="bg-white w-full shadow-lg rounded-md overflow-auto">
          {loading ? (
            <IsLoading />
          ) : franciseedata?.length>=1?(
            <Table hover sm className="w-[200%]">
              {/* Table headers */}
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="text-center">#</Table.Th>

                  <Table.Th className="text-left">FRANCHISE NAME</Table.Th>
                  <Table.Th className="text-left">DATE</Table.Th>
                  <Table.Th className="text-left">TRANSACTION TYPE</Table.Th>
                  <Table.Th className="text-left">AWB NO.</Table.Th>
                  <Table.Th className="text-left w-[10%]">
                    OPENING BALANCE
                  </Table.Th>
                  <Table.Th className="text-left">DR</Table.Th>
                  <Table.Th className="text-left">CR</Table.Th>
                  <Table.Th className="text-left w-[10%]">
                    CLOSING BALANCE
                  </Table.Th>
                  <Table.Th className="text-left w-[10%]">
                    {" "}
                    UTR No/ Chq No/NEFT
                  </Table.Th>
                  <Table.Th className="text-left"> REMARKS</Table.Th>

                  <Table.Th className="text-left">
                    {" "}
                    Random Transaction No.
                  </Table.Th>
                  {/* <Table.Th className="text-center">ACTION</Table.Th> */}
                </Table.Tr>
              </Table.Thead>

              {/* Table body */}
              <Table.Tbody>
                {franciseedata &&
                  franciseedata?.length >= 1 &&
                  franciseedata.map(
                    (data: any, index: number) =>
                      data?.is_active == "1" && (
                        <Table.Tr
                          key={index}
                          className={`text-center  intro-x`}
                        >
                          <Table.Td className="text-center">
                            {(page - 1) * 20 + index + 1}.
                          </Table.Td>
                          <Table.Td className="text-left">
                            {data?.franchiseName || "N.A"}
                          </Table.Td>
                          <Table.Td className="text-left sm:w-[40%]  md:w-[16%]   lg:w-[12%] xl:w-[12%]">
                            {formatDate(data?.entry_date)}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {data?.entry_type}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {data?.airwaybilno}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {formatIndianNumber(Number(data?.opening_balance||0))}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {data?.transaction_type?.toLowerCase() == "dr"
                              ? Number(data?.entry_amount)?.toFixed(3)
                              : "-"}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {data?.transaction_type?.toLowerCase() == "cr"
                              ? Number(data?.entry_amount||0)?.toFixed(3)
                              : "-"}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {Number(data?.closing_balance||0)?.toFixed(3)}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {data?.utrn
                              ? data?.utrn
                              : data?.cheque_no
                              ? data?.cheque_no
                              : data?.bank_ref_no
                              ? data?.bank_ref_no
                              : "-"}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {data?.remarks}
                          </Table.Td>
                          <Table.Td className="text-left">
                            {data?.random_ref_no ? data?.random_ref_no : "-"}
                          </Table.Td>
                        </Table.Tr>
                      )
                  )}
              </Table.Tbody>
            </Table>
          ): <Nodatafound />}
        </div>
        {franciseedata?.length !== 0 && (
          <div>
            <CommonPagination
              totalpages={+count}
              onPageChange={handlePagechange}
              page={page}
            />
          </div>
        )}
   
      </div>
    </>
  );
}
const formatDate = (dateString: any) => {
  if (!dateString) {
    return "-";
  }
  const options: any = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
};
