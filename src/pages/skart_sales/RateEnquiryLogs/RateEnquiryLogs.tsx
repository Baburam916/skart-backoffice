import React, { useEffect, useState } from "react";
import CommonTable from "../commoncomponents/CommonTable/CommonTable";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";

import { FormInput, FormLabel } from "../../../base-components/Form";
import { useDebounce } from "../commoncomponents/JsonToCsv/useDebounce/useDebounce";
import CommonPagination from "../commoncomponents/JsonToCsv/pagination";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import Button from "../../../base-components/Button";
import { unparse } from "papaparse";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";
import IsLoading from "../commoncomponents/isLoading/isLoading";

const EnquiryLogs = () => {
  const { showAlert } = useAlert();

  const [quotedata, setQuotedata] = useState<Array<any>>([]);
  const [country, setCountry] = useState<Array<any>>([]);
  const [shipmentType, setShipmentType] = useState<Array<any>>([]);
  const [searchvalue, setSearchvalue] = useState<any>("");
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const debouncedSearchTerm = useDebounce(searchvalue, 500);
  const [printCsvData, setPrintCsv] = useState<Array<any>>([]);
  const [csvSpinner, setCsvSpinner] = useState<boolean>(false);
  const [tableLoading, setTableLoading] = useState<boolean>(false);
  // const [toDate, setToDate] = useState<any>();
  // const [fromDate, setFromDate] = useState<any>();
  const [pickDataForEdit, setPickDataForEdit] = useState<Array<any>>([]);


  const handlePagechange = (e: number) => {
    setPage(e);
  
  };

  const columns = [
    { field: "number", headerName: "Mobile No" },
    { field: "created_date", headerName: "Created Date" },
    { field: "origin_pincode", headerName: "Origin Pincode" },
    { field: "destination_pincode", headerName: "Destination Pincode" },
    { field: "destination_country", headerName: "Destination Country" },
    { field: "quantity", headerName: "Quantity (in pcs)" },
    { field: "length", headerName: "Max Length (cms)" },
    { field: "weight", headerName: "Weight (kgs)" },
    { field: "shipment_type", headerName: "Shipment Type" },
    { field: "booking_type", headerName: "Booking Type" },
  ];
  const row: any = quotedata?.map((item: any) => {
    const originpincode = (
      <p>
        {item?.request_data?.origin_pincode
          ? item?.request_data?.origin_pincode
          : "N.A."}
      </p>
    );
    const destinationpincode = (
      <p>
        {item?.request_data?.destination_pincode
          ? item?.request_data?.destination_pincode
          : "N.A."}
      </p>
    );

    return {
      ...item,
      origin_pincode: originpincode,
      destination_pincode: destinationpincode,
      created_date: formatDate(item?.created_date),
      destination_country:
        country?.find(
          (elem: any) =>
            elem?.country_id == item?.request_data?.destination_country
        )?.country_name || "N.A.",
      shipment_type:
        shipmentType?.find(
          (elem: any) =>
            elem?.booking_shipment_type_id == item?.request_data?.shipment_type
        )?.shipment_type || "N.A.",
      booking_type:
        item?.request_data?.booking_type == 1 ? "International" : "Domestic",
      length: item?.request_data?.shipment_dimensions[0]?.length || "N.A.",
      weight: item?.request_data?.shipment_dimensions[0]?.weight || "N.A.",
      quantity: item?.request_data?.shipment_dimensions[0]?.quantity || "N.A.",
    };
  });

  const destCountry = async () => {
    const res = await commongetrequest("admin/country");
    setCountry(res?.data?.data);
  };
  const shipmentTypedata = async () => {
    const res = await commongetrequest("admin/booking-shipment-type");
    setShipmentType(res?.data?.data);
  };

  const getdata = async () => {
    // if(!pickDataForEdit?.from_date || !pickDataForEdit?.to_date){
    //   showAlert("From and To Date Required", "warning");
    //   return
    // }
    const data = {
      limit: 20,
      page: page - 1,
    };
    if (debouncedSearchTerm) {
      data.search = debouncedSearchTerm.trim();
    }
    if (pickDataForEdit?.from_date) {
      data.from_date = pickDataForEdit.from_date;
    }

    if (pickDataForEdit?.to_date) {
      data.to_date = pickDataForEdit.to_date;
    }
    try {
      setTableLoading(true);
      const res = await commonpostrequest(
        `admin/get_rates_enquiry_data_list`,
        data
        // {
        //   search: debouncedSearchTerm,
        //   limit: 20,
        //   to_date: pickDataForEdit?.to_date,
        //   from_date: pickDataForEdit?.from_date,
        //   page: page - 1,
        // }
      );
      if (res?.status == 200) {
        setQuotedata(res?.data?.result);
        setTotalPages(Math.ceil(res?.data?.count / 20));
      } else if (res?.status == 204) {
        setQuotedata([]);
        showAlert("No Data Found!", "warning");
      } else {
        showAlert("Server Problem", "error");
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setTableLoading(false);
    }
  };
  const csvDataForPrint = async () => {
    try {
      setCsvSpinner(true);
      const res: any = await commonpostrequest(
        `admin/get_rates_enquiry_data_list`,
        {
          to_date: pickDataForEdit?.to_date,
          from_date: pickDataForEdit?.from_date,
          search: debouncedSearchTerm,
        }
      );
      if (res?.status == 200) {
        setQuotedata(res?.data?.result);
        // setPrintCsv([])
      } else if (res?.status == 204) {
        setQuotedata([]);
      } else {
        showAlert("Something went wrong!", "error");
      }
    } catch (err: any) {
      console.error("Error fetching CSV data:", error);
    } finally {
      setCsvSpinner(false);
    }
  };
  const convertJSONtoCSV = async (data: any[] = [], fileName: string) => {
    // try {
    setCsvSpinner(true);
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
    setCsvSpinner(false);
    // }finally{
    //     setCsvSpinner(false);
    // }
  };

  const formatData = (data: any) => {
    if (!data?.length > 0) return [{ "No Data Found": "" }];
    return data?.map((item: any, index: number) => ({
      "Sr. No.": `${index + 1}.`,
      // "Created Date": item?.created_date,
      "Mobile No": item?.number,
      "Created Date": item?.created_date,
      "Origin Pincode": item?.request_data?.origin_pincode,
      "Destination Pincode": item?.request_data?.destination_pincode,
      "Destination Country":
        country?.find(
          (elem: any) =>
            elem?.country_id == item?.request_data?.destination_country
        )?.country_name || "N.A.",
      "Quantity (in pcs)":
        item?.request_data?.shipment_dimensions[0]?.quantity || "N.A.",
      "Length(cms)":
        item?.request_data?.shipment_dimensions[0]?.length || "N.A.",
      "Weight(kgs)":
        item?.request_data?.shipment_dimensions[0]?.weight || "N.A.",
      "Shipment Type":
        shipmentType?.find(
          (elem: any) =>
            elem?.booking_shipment_type_id == item?.request_data?.shipment_type
        )?.shipment_type || "N.A.",
      "Booking Type":
        item?.request_data?.booking_type == 1 ? "International" : "Domestic",
    }));
  };
  useEffect(() => {
    destCountry();
    shipmentTypedata();
  }, []);
  // useEffect(() => {
  //   setPickDataForEdit((prev:any) => ({
  //     ...prev,
  //     from_date: new Date().toISOString().split("T")[0],
  //   }));
  // }, [])
  useEffect(() => {
    // csvDataForPrint();
    if (pickDataForEdit?.to_date && pickDataForEdit?.from_date) {
      getdata();
    }
  }, [debouncedSearchTerm, page]);
  return (
    <>
      <div className=" flex-initial w-full flex items-center  ">
        <div className="border-b-2 w-full  md:flex lg:flex xl:flex mb-2 pb-2">
          <div className="w-full">
            <div className="flex justify-between md:flex lg:flex xl:flex items-end">
              <div>
                <h2 className="text-2xl align-middle font-bold  text-primary py-4 ">
                  Rate Enquiry Logs
                </h2>
              </div>
              <div className="flex">
                <div className="mt-5">
                  <FormInput
                    className=""
                    value={searchvalue}
                    onChange={(e: any) => {
                      setSearchvalue(e.target.value);
                      setPage(1);
                      // setHit(4);
                    }}
                    placeholder="Search by Mobile Number .."
                  />
                </div>
                {quotedata?.length > 0 ? (
                  <div className="mt-5">
                    <Button
                      className="w-full sm:w-auto pt-2 pb-2 pr-2 pl-2 text-white ml-2 bg-green-500"
                      disabled={csvSpinner}
                      onClick={() => {
                        convertJSONtoCSV(
                          formatData(quotedata),
                          "rate_enquiry.csv"
                        ),
                          csvDataForPrint();
                      }}
                    >
                      Download
                      {csvSpinner && <span className="ml-2 inline-block animate-spin rounded-full border-t-2 border-white h-4 w-4"></span>}
                    </Button>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="">
              <div className="flex">
                <div className="mr-2">
                  <FormLabel>From Date</FormLabel>
                  <FormInput
                    type="date"
                    value={pickDataForEdit?.from_date}
                    onChange={(e) =>
                      setPickDataForEdit((prev: any) => {
                        return {
                          ...prev,
                          from_date: e.target.value,
                        };
                      })
                    }
                    max={pickDataForEdit?.to_date}
                  />
                </div>
                <div className="mr-2">
                  <FormLabel>To Date</FormLabel>
                  <FormInput
                    type="date"
                    value={pickDataForEdit?.to_date}
                    min={pickDataForEdit?.from_date}
                    onChange={(e) =>
                      setPickDataForEdit((prev: any) => {
                        return {
                          ...prev,
                          to_date: e.target.value,
                        };
                      })
                    }
                  />
                </div>
                <Button
                  className="w-[100px]  pr-2 pl-2 text-white ml-2 bg-mustard h-[34px] mt-[30px]"
                  disabled={
                    !pickDataForEdit?.from_date || !pickDataForEdit?.to_date
                  }
                  onClick={() => {
                    getdata(), csvDataForPrint();
                  }}
                >
                  Search
                  {csvSpinner && <span className="ml-2 inline-block animate-spin rounded-full border-t-2 border-white h-4 w-4"></span>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white w-full shadow-lg rounded-md overflow-auto h-[100vh]">
        {tableLoading ? (
          <IsLoading />
        ) : quotedata?.length > 0 ? (
          <>
            <CommonTable columns={columns} row={row} currentPage={page || 0} />
            <CommonPagination
              totalpages={totalpages}
              onPageChange={handlePagechange}
              page={page}
            />{" "}
          </>
        ) : (
          <Nodatafound />
        )}
      </div>
    </>
  );
};

export default EnquiryLogs;
