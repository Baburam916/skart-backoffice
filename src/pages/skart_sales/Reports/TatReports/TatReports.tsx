import React, { useEffect, useState } from "react";

import { useAlert } from "../../../../ContextProvider/AlertContext";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../../../src/AllServices/services";

import Button from "../../../../base-components/Button";

import { Download, Search } from "lucide-react";

import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../../base-components/Form";
import { jsontocsv } from "../../commoncomponents/JsonToCsv/Jsontocsv";
import { tranfereddata } from "../../../../components/booking_summary_table/TransformKey";
import LoadingButtonCommon from "../../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import TomSelect from "../../../../base-components/TomSelect";
import MultiSelectCommon from "../../commoncomponents/CommonmultipleselectHeavyLoad/CommonMultipleselect";
import IsLoading from "../../commoncomponents/isLoading/isLoading";
import ReportCommonTable from "../../commoncomponents/CommonForReports/ReportscommonTable";
import Nodatafound from "../../commoncomponents/Nodatafound/Nodatafound";
import CommonPagination from "../../../../components/Pagination";
import { MdResetTv } from "react-icons/md";

const initialdata = {
  from_date: 0,
  to_date: "",
  courier_id: [],
  status: "",
  franchisee_type: "",
};

const TatReports: React.FC = () => {
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [type, setType] = useState<any>(0);
  const [maindata, setMaindata] = useState<any>([]);
  const [hubdata, setHubdata] = useState<any>([]);
  const [documentdata, setDocumentdata] = useState<any>([]);
  const [dataformultiselect, setDataformultiselect] = useState<any>([]);
  const [multiplevendor, setMultiplevendor] = useState<any>([]);
  const [multipledata, setMultipledata] = useState<any>([]);
  const [multipledata2, setMultipledata2] = useState<any>([]);
  const [parentvendordata, setParentvendordata] = useState<any>([]);
  const [allfranchisedata, setAllfranchisedata] = useState<any>([]);
  const [postisLoading, setPostisLoading] = useState<any>(false);
  const [initialdatatoget, setInitialdatatoget] = useState<any>(initialdata);
  const [salespersondata, setSalespersondata] = useState<any>([]);
  const [hit, setHit] = useState<any>(1);
  const [selectedId, setSelectedId] = useState<any>("");
  const [allcountrydata, setAllCountrydata] = useState<any>([]);
  const [datatoselect, setDatatoSelect] = useState<any>([]);
  const [selectedvalue, setSelectValue] = useState<any>(1);
  const [alfranchisetypedata, setAlllFranchisetypedata] = useState<any>([]);
  //   console.log(hubId,'hubId')
  const [franchisefiltereddata, setFranchisefiltereddata] = useState<any>([]);
  const [allconsigneedata, setAllConsigneedata] = useState<any>([]);
  const { showAlert } = useAlert();
  // const { allgetdata } = useFetch("track_shipment/report/tat-report");
  const [downloadisLoading, setDownloadisLoading] = useState<boolean>(false);
  const onPageChange = (page: number) => {
    setPage(page - 1);
    setHit(1);
  };
  const fun2 = (value?: any) => {
    setPage(0);
    setHit(3);
    setMaindata([]);
  };
  // console.log(multipledata,"multipledata")
  const findsalerperson = (id: any) => {
    // console.log(id,"id is coming")
    const data = franchisefiltereddata?.find((item: any) => item?.id == id);

    const salespersonId = data?.salesperson;

    const filteredsalespersondata = salespersondata?.find(
      (item: any) => item?.id == salespersonId
    );

    return filteredsalespersondata;
  };
  // const handlerefresh = () => {
  //   fetchData();
  // };

  useEffect(() => {
    const { from_date, to_date } = initialdatatoget;
    if (from_date && to_date) {
      handleSubmit(hit);
    }

    getfranchisees();
  }, [page]);
  useEffect(() => {
    getintdata();
  }, []);
  const getintdata = async () => {
    try {
      const res = await commongetrequest("master/entity?type=2");
      const res2 = await commongetrequest(`admin/franchisee-types`);
      if (res?.status == 200) {
        const data = res?.data?.data || [];
        const newdata = data?.map((item: any) => ({
          id: item?.party_id,
          name: item?.party_name,
        }));
        setParentvendordata(newdata || []);
      }
      if (res2?.status == 200) {
        setAlllFranchisetypedata(res2?.data?.data || []);
      } else {
        setParentvendordata([]);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const getfranchisees = async () => {
    try {
      const couriers = await commongetrequest("admin/courier-product");
      const response = await commongetrequest("admin/franchisee-settings");
      const response2 = await commongetrequest("admin/sales-person");
      const hubpud = await commongetrequest("admin/hub-pud");

      const country = await commongetrequest("admin/country");
      if (couriers?.status == 200) {
        const data = couriers?.data?.data;
        // console.log(data,"couriers")
        const newdata = data?.map((item: any) => ({
          id: item?.product_id,
          name: item?.product_name,
          vendor: item?.vendor,
          parent_vendor: item?.parent_vendor,
          is_import: item?.is_import
          //  salesperson: item?.sales_person,
          //  email_id: item?.email_id,
          //  contacts: item?.contacts[0]?.mobile_no,
        }));

        setDataformultiselect(newdata.filter((item: any)=>item?.is_import==1));
        setDatatoSelect(newdata || []);
      }
      if (response?.status == 200 || response?.status == 204) {
        const data = response?.data?.data;

        const newdata = data?.map((item: any) => ({
          id: item?.franchisee_id || "",
          name: item?.franchisee_name || "",
          salesperson: item?.field_sales || "",
          email_id: item?.email_id || "",
          contacts:
            item?.contacts?.length >= 1 ? item?.contacts[0]?.mobile_no : "",
        }));
        setFranchisefiltereddata(newdata || []);
      }
      if (response2?.status == 200) {
        setSalespersondata(response2?.data?.data || []);
      }
      if (hubpud?.status == 200) {
        setHubdata(hubpud?.data?.data || []);
      }
      if (country?.status == 200) {
        setAllCountrydata(country?.data?.data || []);
      } else {
        showAlert("Something going wrong!..", "error");
      }
    } catch (err: any) {
      console.log(err, "error");
    }
  };
  // console.log(dataformultiselect,"data couriers")
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setInitialdatatoget((pre: any) => ({ ...pre, [name]: value }));
    setPage(0);
    setHit(3);
    setMaindata([]);
  };

  function finddata(id: any, what: string, data?: any) {
    if (what == "franchise") {
      const singledata = franchisefiltereddata?.find(
        (item: any) => item?.id == id
      );

      return singledata;
    }
    if (what == "branch") {
      const singledata = hubdata.find((item: any) => item?.branch_id == id);

      return singledata;
    }
    if (what == "destination") {
      const singledata = allcountrydata?.find(
        (item: any) => item?.country_id == id
      );

      return singledata;
    }
    if (what == "document") {
      const singledata = data?.find((item: any) => item?.pickup_id == id);
      return singledata;
    }
    if (what == "shipper") {
      const singledata = data?.find((item: any) => item?.shipper_id == id);
      return singledata;
    }
    if (what == "con") {
      const singledata = data?.find((item: any) => item?.consignee_id == id);
      return singledata;
    }
  }
  function findmaindatatoload(
    data: any,
    documentdata?: any,
    allshipper?: any,
    allconsignee?: any
  ) {
    // console.log(data,"datattoload")
    const newdata = data.map((item: any) => {
      if (item?.franchisee_name || item?.branch || item?.destination) {
        // console.log(item?.franchisee_name,"franchisename")
        return {
          ...item,
          franchisee_name:
            finddata(item.franchisee_name, "franchise")?.name || "N.A",
          franchisee_type:
            alfranchisetypedata?.find(
              (item2: any) => item2?.ftype_id == item["franchisee_type"]
            )?.franchisee_type || "",
          branch: finddata(item?.branch, "branch")?.branch_name || "N.A",
          destination:
            finddata(item?.destination, "destination")?.country_name || "N.A",
          sales_person_name:
            findsalerperson(item?.franchisee_name)?.sales_person || "N.A",
          sales_person_contact_no:
            findsalerperson(item?.franchisee_name)?.contact || "N.A",
          franchisee_contact_no:
            finddata(item?.franchisee_name, "franchise")?.contacts || "N.A",
          franchisee_email_id:
            finddata(item?.franchisee_name, "franchise")?.email_id || "N.A",
          network: findvendor(item?.network)?.name,
          carrier: findvendor(item?.network)?.parent_vendor || "",
          "documents(shipper_inv,kyc1,kyc2)":
            finddata(
              item["documents(shipper_inv,kyc1,kyc2)"],
              "document",
              documentdata
            )?.docs || "No Documents ",
          shipper_name:
            finddata(item["shipper_name"], "shipper", allshipper)
              ?.shipper_name || " ",
          consignee_name:
            (finddata(item["consignee_name"], "con", allconsignee)
              ?.first_name &&
              finddata(item["consignee_name"], "con", allconsignee)
                ?.first_name) ||
            ("" +
              finddata(item["consignee_name"], "con", allconsignee)
                ?.last_name &&
              finddata(item["consignee_name"], "con", allconsignee)
                ?.last_name) ||
            "" ||
            " ",
          consignee_address:
            (finddata(item["consignee_address"], "con", allconsignee)
              ?.address1 &&
              finddata(item["consignee_address"], "con", allconsignee)
                ?.address1) ||
            ("" +
              "," +
              finddata(item["consignee_address"], "con", allconsignee)
                ?.address2 &&
              finddata(item["consignee_address"], "con", allconsignee)
                ?.address2) ||
            ("" +
              "," +
              finddata(item["consignee_address"], "con", allconsignee)?.state &&
              finddata(item["consignee_address"], "con", allconsignee)
                ?.state) ||
            ("" +
              "," +
              finddata(item["consignee_address"], "con", allconsignee)
                ?.international_zipcode &&
              finddata(item["consignee_address"], "con", allconsignee)
                ?.international_zipcode) ||
            "",

          // +
          //   finddata(item["consignee_address"], "con", allconsignee)?.state
          // ? `,${
          //     finddata(item["consignee_address"], "con", allconsignee)?.state
          //   }`
          // : "" +
          //   finddata(item["consignee_address"], "con", allconsignee)
          //     ?.international_zipcode
          // ? `,${
          //     finddata(item["consignee_address"], "con", allconsignee)
          //       ?.international_zipcode
          //   }`
          // : ""
          consignee_contact_no:
            finddata(item["consignee_contact_no"], "con", allconsignee)
              ?.mobile_no || " ",
          consignee_email_id:
            finddata(item["consignee_email_id"], "con", allconsignee)
              ?.email_id || " ",
        };
      }

      return item;
    });
    return newdata;
  }
  function findvendor(id: any) {
    // console.log(id,"network id is coming")
    const newdata = datatoselect?.find((item: any) => item?.id == id);
    return newdata;
  }

  const handledownload = async () => {
    const params: any = {};
    const { from_date, to_date, status, franchisee_id, franchisee_type } =
      initialdatatoget;
    if (from_date) {
      params.from_date = from_date;
    }
    if (to_date) {
      params.to_date = to_date;
    }
    if (status) {
      params.status = status;
    }
    let couriersIds: any = [];
    let vendorIds: any = [];
    if (multipledata.length >= 1) {
      couriersIds = multipledata?.map((item: any) => Number(item?.value));

      // params.courier_id=couriersIds
    }
    let franchiseeIds: any = [];
    let result: any = [];
    if (multipledata2?.length >= 1) {
      franchiseeIds = multipledata2?.map((item: any) => Number(item?.value));
      // console.log(franchiseeIds,"fran")
      result = datatoselect
        .filter((item: any) => franchiseeIds.includes(item.vendor))
        .map((item: any) => item.id);
    }

    try {
      setDownloadisLoading(true);
      const response: any = await commonpostrequest(
        `track_shipment/report/tat-report?${
          from_date && `&from_date=${from_date}`
        }${
          to_date &&
          `&to_date=${to_date}${
            Number(franchisee_type) ? `&franchisee_type=${franchisee_type}` : ""
          }`
        }${status && `&status=${status}`}`,
        {
          courier_id:
            selectedvalue == 2
              ? franchiseeIds?.length >= 1
                ? result
                : null
              : couriersIds?.length >= 1
              ? couriersIds
              : null,
        }
      );
      if (response?.status == 200 || response?.status == 204) {
        const maindata = response?.data?.data || [];
        const alldocuments = response?.data?.documents || [];
        const allshipper = response?.data?.shipper || [];
        const allconsignee = response?.data?.consignee || [];
        const maindatatoload = findmaindatatoload(
          maindata,
          alldocuments,
          allshipper,
          allconsignee
        );
        const newdata = maindatatoload?.map((item: any) => {
          delete item["documents(shipper_inv,kyc1,kyc2)"];

          return item;
        });

        jsontocsv(tranfereddata(newdata), "tat_reports_data");
      }
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setDownloadisLoading(false);
    }
  };
  const handleSubmit = async (value: any) => {
    const params: any = {
      offset: Number((page + 1 - 1) * 20),
      limit: 20,
      is_import:1,
    };
    const param2: any = {};
    const { from_date, to_date, franchisee_id, status, franchisee_type } =
      initialdatatoget;

    if (from_date) {
      params.from_date = from_date;
      param2.from_date = from_date;
    }
    if (to_date) {
      params.to_date = to_date;
      param2.to_date = to_date;
    }

    if (status) {
      params.status = status;
      param2.status = status;
    }
    if (franchisee_type) {
      params.franchisee_type = status;
      param2.franchisee_type = status;
    }
    let couriersIds: any = [];
    let franchiseeIds: any = [];
    let result: any = [];
    if (multipledata.length >= 1) {
      couriersIds = multipledata?.map((item: any) => Number(item?.value));
      // const result = mainArray
      //   .filter((item) => selectedIds.includes(item.vendor_id))
      //   .map((item) => item.parent_id);
      // params.courier_id=couriersIds
    }
    if (multipledata2?.length >= 1) {
      franchiseeIds = multipledata2?.map((item: any) => Number(item?.value));
      // console.log(franchiseeIds,"fran")
      result = datatoselect
        .filter((item: any) => franchiseeIds.includes(item.vendor))
        .map((item: any) => item.id);
      // params.courier_id=result
    }
    try {
      setPostisLoading(value);
      setType(value);
      const response = await commonpostrequest(
        `track_shipment/report/tat-report?offset=${Number(
          (page + 1 - 1) * 20
        )}&limit=20${from_date && `&from_date=${from_date}`}${
          to_date && `&to_date=${to_date}`
        }&is_import=1${
          Number(franchisee_type) ? `&franchisee_type=${franchisee_type}` : ""
        }${status && `&status=${status}`}`,
        {
          courier_id:
            selectedvalue == 2
              ? franchiseeIds?.length >= 1
                ? result
                : null
              : couriersIds?.length >= 1
              ? couriersIds
              : null,
        }
      );

      if (response?.status == 200 || response?.status == 204) {
        const maindata = response?.data?.data || [];
        const alldocuments = response?.data?.documents || [];
        const allshipper = response?.data?.shipper || [];
        const allconsignee = response?.data?.consignee || [];
        setDocumentdata(alldocuments);
        const maindatatoload = findmaindatatoload(
          maindata,
          alldocuments,
          allshipper,
          allconsignee
        );

        setMaindata(tranfereddata(maindatatoload));
      }

      if (response?.status == 200) {
        setTotalPages(response?.data?.count || 0);
      } else if (response?.response?.status == 400) {
        showAlert(response?.response?.data?.message, "error");
      } else {
        showAlert("Something going!..", "error");
      }
    } catch (err: any) {
      showAlert(err.message);
    } finally {
      setPostisLoading(false);
      setType(0);
    }
  };

  const fun1 = (a?: any) => {
    getallids(a?.value);
    setPage(0);
  };
  const getallids = async (id?: any) => {
    try {
      const res = await commongetrequest(`admin/courier-product/${id}`);
      if (res?.status == 200) {
        const data = res?.data?.data || [];
        const ids = data?.map((item: any) => item?.product_id);
        // console.log(ids,"ids coming")
        setInitialdatatoget((pre: any) => ({ ...pre, courier_id: ids }));
      } else {
        setInitialdatatoget((pre: any) => ({ ...pre, courier_id: [] }));
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  return (
    <div className="m-auto  rounded p-4 mt-2">
      <div className=" border-l border-gray-300  "></div>
      <div className="flex justify-between  border-b-2 mb-4 pb-2 ">
        <div className="flex items-centermb-2 w-full">
          <span className={`mr-auto text-2xl text-primary font-bold `}>
            TAT REPORT
          </span>
        </div>
        {maindata?.length >= 1 ? (
          <div>
            <Button
              onClick={handledownload}
              disabled={downloadisLoading}
              variant="success"
              className="p-2 text-white"
            >
              <Download />
              {downloadisLoading ? (
                <LoadingButtonCommon text={"Downloading"} />
              ) : (
                "Download"
              )}
            </Button>
            {/* <Commondownload
              data={maindata}
              forwhat={"tat_reports"}
              icon={true}
            /> */}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="w-full">
        <div className="bg-white rounded p-8 shadow-lg">
          {/* <div className=" flex justify-end">
          <FormCheck>
            <FormCheck.Input
              id="horizontal-form-3"
              type="checkbox"
              checked={selectedvalue == 1}
              value={selectedvalue}
              onChange={(e: any) => {
                setMultipledata([]);
                setInitialdatatoget((pre: any) => ({ ...pre, courier_id: [] }));
                setMultipledata2([]);
                setMaindata([]);
                setSelectedId("");
                setPage(0);
                if (e.target.checked) {
                  setSelectValue(1);
                } else {
                  setSelectValue(2);
                }
              }}
            />
            <FormCheck.Label className="mt-1" htmlFor="horizontal-form-3  ">
              PRODUCT WISE
            </FormCheck.Label>
          </FormCheck>
          </div> */}
          <div
            className={` w-full grid sm:grid-cols-1 lg:grid-cols-4 md:grid-cols-4 xl:grid-cols-4 gap-5 m-auto mt-2 `}
          >
            <div className="col-span-1">
              <div>
                <FormCheck.Label>SELECT CUSTOMER TYPE</FormCheck.Label>
              </div>
              <TomSelect
                name={"franchisee_type"}
                value={`${initialdatatoget?.franchisee_type}`}
                onChange={(e: any) => {
                  setInitialdatatoget((pre: any) => ({
                    ...pre,
                    franchisee_type: e,
                  }));
                  setPage(0);
                  setHit(3);
                  setMaindata([]);
                  // setError((pre: any) => ({ ...pre, franchisee_type: "" }));
                  // setDatatopost((pre: any) => ({ ...pre, franchisee_type: e }));
                  // setRequiredpath((pre) => ({ ...pre, type_id: "" }));
                }}
                options={{
                  placeholder: "Select",
                }}
                className=" z-[150] mt-2"
                // className={`${
                //   error.franchisee_type ? "border border-red-300" : ""
                // }`}
              >
                <option value={0}>All</option>
                {alfranchisetypedata &&
                  alfranchisetypedata?.length >= 1 &&
                  alfranchisetypedata?.map((item: any, index: number) => (
                    <option key={index} value={`${item.ftype_id}`}>
                      {item?.franchisee_type}
                    </option>
                  ))}
              </TomSelect>
            </div>
            <div className=" col-span-1">
              <div>
                <FormLabel>FROM DATE</FormLabel>
                <span className="text-red-400">*</span>

                <FormInput
                  type="date"
                  name="from_date"
                  value={initialdatatoget?.from_date}
                  onChange={handlechange}
                />
              </div>
            </div>

            <div className=" col-span-1">
              <div>
                <FormLabel>TO DATE</FormLabel>
                <span className="text-red-400">*</span>

                <FormInput
                  type="date"
                  name="to_date"
                  value={initialdatatoget?.to_date}
                  onChange={handlechange}
                />
              </div>
            </div>
            <div className=" col-span-1">
              <div>
                <FormLabel>STATUS</FormLabel>

                <FormSelect
                  name="status"
                  value={initialdatatoget?.status}
                  onChange={handlechange}
                >
                  <option value={""}>All</option>
                  <option value={1}>Open</option>
                  <option value={0}>Close</option>
                </FormSelect>
              </div>
            </div>
            {selectedvalue == 1 ? (
              <div
                className={`${"max-[468px]:col-span-1"} min-[468px]:col-span-2 `}
              >
                <div>
                  <FormLabel>SELECT TYPE</FormLabel>
                  <MultiSelectCommon
                    data={dataformultiselect}
                    multipledata={multipledata}
                    setmultipledata={setMultipledata}
                    fun2={fun2}
                  />
                </div>
              </div>
            ) : (
              <div className=" col-span-2">
                {/* <div>
                  <FormLabel>SELECT</FormLabel>
                
                  <div className="bg-white">
                    <SingleSelect
                      data={parentvendordata}
                      singlevalue={selectedId}
                      setSingleValue={setSelectedId}
                      fun1={fun1}
                    />
                  </div>
                </div> */}

                <div>
                  <FormLabel>SELECT VENDOR</FormLabel>
                  <MultiSelectCommon
                    data={parentvendordata}
                    multipledata={multipledata2}
                    setmultipledata={setMultipledata2}
                    fun2={fun2}
                  />
                </div>
              </div>
            )}

            <div className=" mt-6 grid-cols-2">
              <div>
                <Button
                  variant="mustard"
                  disabled={
                    postisLoading ||
                    !initialdatatoget?.from_date ||
                    !initialdatatoget?.to_date
                  }
                  onClick={() => handleSubmit(1)}
                  className=" mb-2 mr-1 p-2 w-full"
                >
                  <Search className="ml-2" />
                  {postisLoading && postisLoading == 1 ? (
                    <LoadingButtonCommon text={"Searching"} />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
            <div className=" mt-6 grid-cols-2">
              <div>
                <Button
                  variant="mustard"
                  disabled={
                    initialdatatoget?.from_date ||
                    initialdatatoget?.to_date ||
                    multipledata?.length >= 1 ||
                    selectedId?.value ||
                    initialdatatoget?.status
                      ? false
                      : true
                  }
                  onClick={() => {
                    setInitialdatatoget(initialdata);
                    setPage(0);
                    setMaindata([]);
                    setHit(3);
                    setSelectValue(1);
                    setMultipledata([]);
                  }}
                  className=" mb-2 mr-1 p-2 w-full"
                >
                  <MdResetTv className="ml-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {postisLoading ? (
          <IsLoading />
        ) : maindata && maindata?.length >= 1 ? (
          <ReportCommonTable
            columns={maindata[0]}
            row={maindata}
            loading={postisLoading}
            page={page}
            overflowvalue={true}
          />
        ) : (
          <Nodatafound />
        )}
      </div>
      {maindata?.length >= 1 && totalPages > 1 ? (
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
};

export default TatReports;
