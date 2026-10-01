import { useEffect, useState } from "react";
import Button from "../../../base-components/Button";
import Table from "../../../components/Table";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { foreignFormat, formatDate } from "../../../utils";
import { FormInput } from "../../../base-components/Form";
import { Search } from "lucide-react";
import { useDebounce } from "../../../components/Search";
import CommonPagination from "../../../components/Pagination";
import { ApprovalModal } from "./ApprovalModal";
import IsLoading from "../commoncomponents/isLoading/isLoading";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";
import { useServiceSocket } from "../../../hooks/useServiceSocket";
const interrors = {
  valid_till: "",
  remarks: "",
  weight_from: "",
  weight_to: "",
  clearence_type: "",
  cargo_type: "",
  courier_id: "",
  incoterm: "",
  currency_id: "",
  quoted_by: "",
  commodity: "",
  fedex_account_type: "",
  fedex_services: "",
};
const SpotpriceApproval = ({ value, gettopdata }: any) => {
  const [getSpotList, setGetSpotList] = useState<Array<any>>([]);
  const [alltypedata, setAlltypedata] = useState<any>([]);
  const [errors, setErrors] = useState<any>(interrors);
  const [incotermList, setIncotermList] = useState<Array<any>>([]);
  const [openModal2, setOpenModal2] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [vendorData, setVendorData] = useState<any>(null);
  const [serviceTypeData, setServiceTypeData] = useState<any>(null);
  const [currencydata, SetCurrencyData] = useState<any>([]);
  const [franchiseeData, setFranchiseeData] = useState<any>([]);
  const [allvendordropdowndata, setAllvendordropdowndata] = useState<any>([]);
  const [commoditytype, setCommodityType] = useState<any>([]);
  const [pickDataforForm, setPickDataforForm] = useState<any>(null);
  const [countryData, setCountryData] = useState<Array<any>>([]);
  const [enquiryId, setEnquiryId] = useState<any>("");
  const [page, setPage] = useState<number>(1);
  const [allfdata, setAllFdata] = useState<any>([]);
  const [buyingcharges, setBuyingCharges] = useState<any>([]);
  const [sellingcharges, setSellingCharges] = useState<any>([]);
  const [chargesList, setChargesList] = useState<Array<any>>([]);
  const [totalpages, setTotalPages] = useState<number>(1);
  const [spotData, setSpotData] = useState<any>({});
  const [pricingdata, setPricingData] = useState<any>([]);
  const { showAlert } = useAlert();
  const debouncedSearchTerm = useDebounce<string>(enquiryId.trim(), 500);
  const [shipmentTypedata, setShipmentTypedata] = useState<any>([])
  const { userdata, statusdata } = useLogin();
  const handlePagechange = (e: number) => {
    setPage(e);
  };

  useEffect(() => {
    getVendor();
    getintdata();
    getServiceTypeList();
    getFranchisee();
    getCountry();
    getchargeslist();
    getIncotermdata();
  }, []);

  const getintdata = async () => {
    try {
      setLoading(true);

      const [res, commodityres, currencydatares, typedata, shipmenttype] =
        await Promise.allSettled([
          commongetrequest("admin/pricing_person"),
          commongetrequest("admin/commodity-type"),
          commongetrequest("booking/currency"),
          commongetrequest("master/customer-type-data_ac/2"),
          commongetrequest("admin/booking-shipment-type"),
        ]);

      // pricing_person
      if (res.status === "fulfilled" && res.value?.status === 200) {
        setPricingData(res.value?.data?.data?.result || []);
      } else {
        setPricingData([]);
      }

      // commodity-type
      if (
        commodityres.status === "fulfilled" &&
        commodityres.value?.status === 200
      ) {
        setCommodityType(commodityres.value?.data?.data || []);
      }

      // currency
      if (
        currencydatares.status === "fulfilled" &&
        currencydatares.value?.status === 200
      ) {
        SetCurrencyData(currencydatares.value?.data?.data || []);
      }

      // customer-type
      if (typedata.status === "fulfilled" && typedata.value?.status === 200) {
        setAlltypedata(typedata.value?.data?.data || []);
      }

      // shipment-type
      if (
        shipmenttype.status === "fulfilled" &&
        shipmenttype.value?.status === 200
      ) {
        setShipmentTypedata(shipmenttype.value?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setLoading(false);
    }
  };
  const updateInterrors = (mainObj: any, interrors: any) => {
    let updatedInterrors = { ...interrors };

    Object.keys(updatedInterrors).forEach((key) => {
      if (
        !mainObj[key] ||
        mainObj[key] === null ||
        mainObj[key] === undefined
      ) {
        updatedInterrors[key] = "This is required";
      }
    });
    setErrors({
      ...updatedInterrors,
      ...(pickDataforForm?.shipment_type == 8 && !pickDataforForm?.fair_id
        ? {
          fair_id: "This Is Required",
        }
        : {}),
    });
    return updatedInterrors;
  };

  useEffect(() => {
    if (pricingdata?.length >= 1) {
      getspotlistdata();
    }
  }, [page, debouncedSearchTerm, pricingdata.length, vendorData]);
  useServiceSocket("booking", "pricing_list_refresh", () => {
    getspotlistdata();
  }, () => {
    getspotlistdata();
  });
  useEffect(() => {
    const interval = setInterval(() => {
      if (!openModal2) {
        getspotlistdata();
        if (value == "limited") {
          gettopdata();
        }
      }
    }, 300000);

    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }, []);
  const handleerrors = (key) => {
    setErrors((pre: any) => ({ ...pre, [key]: "" }));
  };
  const getCountry = async () => {
    const res: any = await commongetrequest("admin/country");
    if (res?.status == 200) {
      setCountryData(res?.data?.data);
    } else {
      setCountryData([]);
    }
  };

  const getchargeslist = async () => {
    try {
      const res = await commongetrequest("admin/charges?type=E&is_cargo=1");

      if (res?.status == 200) {
        setChargesList(res?.data?.data);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const getIncotermdata = async () => {
    try {
      const getIncoterm = await commongetrequest(
        "admin/charges?type=E&is_cargo=1",
      );

      if (getIncoterm?.status == 200) {
        setIncotermList(getIncoterm?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  const getspotlistdata = async () => {
    const countriesId = pricingdata
      .filter((item: any) => item?.id == userdata.mapped_id)
      .flatMap((item: any) => item?.country_id);

    const params: any = {
      limit: 20,
      page: page - 1,
    };
    const storedfdata = JSON.parse(localStorage.getItem("franchiseedata"));
    const fids = storedfdata?.map((item: any) => item?.franchisee_id);
    if (debouncedSearchTerm) {
      params.key = debouncedSearchTerm;
    }
    const data: any = { country_id: countriesId };
    if (value == "limited") {
      data.booking_status = [7];
    }
    try {
      setLoading(true);
      const response = await commonpostrequest(
        `booking/get_spot_enquiry?limit=20&page=${page - 1}${debouncedSearchTerm ? `&key=${debouncedSearchTerm.trim()}` : ""
        }`,
        data,
      );
      if (response.status == 200) {
        setGetSpotList(response.data.data || []);
        setTotalPages(Math.ceil(response?.data?.total / 20));
      } else if (response?.response?.status === 204) {
        showAlert("No data found!", "warning");
        setGetSpotList([]);
      } else {
        showAlert(response.data.message, "error");
        setGetSpotList([]);
      }
    } catch (error) {
      setGetSpotList([]);
      console.log(error);
      showAlert("Something went wrong with status list!", "error");
    } finally {
      setLoading(false);
    }
  };

  const getVendor = async () => {
    const res: any = await commongetrequest(`admin/courier-product`);
    const res2: any = await commongetrequest(`admin/vendor-settings`);
    try {
      if (res?.status == 200) {
        setVendorData(res?.data?.data);
      }
      if (res2?.status == 200) {
        setAllvendordropdowndata(res2?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const getServiceTypeList = async () => {
    const res: any = await commongetrequest(`booking/service_type_list`);
    try {
      if (res?.status == 200) {
        setServiceTypeData(res?.data?.data);
      } else {
        setServiceTypeData([]);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const getFranchisee = async () => {
    const res: any = await commongetrequest("admin/franchisee-settings");
    try {
      if (res?.status == 200) {
        setFranchiseeData(res?.data?.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const columns = [
    { field: "action", headerName: "Action" },
    { field: "status", headerName: "Status", textalign: "left" },
    { field: "booking_no", headerName: "Enquiry No.", textalign: "left" },
    { field: "created_date", headerName: "Enquiry Date", textalign: "left" },
    { field: "franchisee", headerName: "Franchisee", textalign: "left" },
    { field: "org_city", headerName: "Origin", textalign: "left" },
    { field: "dest_city", headerName: "Destination", textalign: "left" },
    { field: "weight", headerName: "Weight", textalign: "right" },
    { field: "vendor", headerName: "Vendor", textalign: "left" },
    {
      field: "shipment_type",
      headerName: "Shipment Type",
      textalign: "left",
    },
    { field: "quoted_by", headerName: "Quoted By", textalign: "left" },
    {
      field: "buy_price",
      headerName: "Buy Price (₹)",
      textalign: "right",
    },
    {
      field: "spot_price",
      headerName: "Sell Price (₹)",
      textalign: "right",
    },
    {
      field: "overseas_price",
      headerName: "Overseas Currency Price",
      textalign: "right",
    },
    { field: "valid_till", headerName: "Rate Valid Till", textalign: "left" },
    { field: "airwaybilno", headerName: "AirwaybillNo", textalign: "left" },
    // { field: "weight_slab", headerName: "Weight Slab", textalign: "right" },
  ];

  const row: any = getSpotList?.map((item: any) => {
    const isStatus = (
      <Button
        className="bg-blue-600 border-none py-1 px-2 text-white"
        onClick={() => {
          setOpenModal2(true);
          let data = { ...item };
          if (data?.booking_status == 7) {
            data.forwhat = "pricing";
          }
          if (data?.shipment_type == 8) {
            let newdata = {
              ...data,
              ...(data?.shipment_type == 8
                ? {
                  fair_id: data?.fair_data?.fair_id,
                  fair_venue: data?.fair_data?.fair_venue,
                  fair_start_date: data?.fair_data?.fair_start_date,
                  fair_end_date: data?.fair_data?.fair_end_date,
                  // fair_data: datasingle?.fair_data,
                  is_returnable: data?.is_returnable || 0,
                  mode: data?.fair_data?.mode || "",
                  ...(data?.fair_data?.mode_value
                    ? { mode_value: data?.fair_data?.mode_value }
                    : {}),
                }
                : {}),
            };

            delete newdata["fair_data"];
            setPickDataforForm(newdata);
          } else if (
            (data?.shipment_type == "4" || data?.shipment_type == "5")
          ) {
            setPickDataforForm({
              ...data,
              ...(data?.enquiry_from == 4 && data?.import_booking == 1 ? { fedex_account_type: "" } : {}),
              fedex_services: "",
            });
          } else {
            setPickDataforForm({ ...data });
          }

          setErrors((pre: any) => ({
            ...pre,
            ...((data?.shipment_type == "4" || data?.shipment_type == "5") &&
              data?.import_booking == "2"
              ? { import_booking_type: "" }
              : {}),
          }));
        }}
      >
        Action
      </Button>
    );
    const bookingstatus = (
      <p
        className={`${item?.booking_status == 15 ? (item?.is_checklist == 1 ? "text-success-400" : "text-red-400") : statusdata?.find(
          (s: any) => s.status_code == item?.booking_status
        )?.css_class}`}
      >
        {item?.booking_status == 15 ? (item?.is_checklist == 1 ? "CheckList Done" : "CheckList Pending") : statusdata?.find(
          (s: any) => s.status_code == item?.booking_status
        )?.status_name}

      </p>
    );
    const forVendordata = (
      <p>
        {vendorData?.find((elem: any) => elem.product_id == item?.courier_id)
          ?.product_name || "-"}
      </p>
    );
    const forFranchiseedata = (
      <p>
        {franchiseeData?.find(
          (elem: any) => elem.franchisee_id == item?.franchisee_id,
        )?.franchisee_name || "-"}
      </p>
    );
    const weightSlabdata = (
      <p className="text-end">
        {item.weight_from}-{item.weight_to}
      </p>
    );
    const createddate = <p>{formatDate(item?.created_date)}</p>;
    const weightdata = (
      <p className="text-end">
        {Number(item?.weight).toFixed(3) || "-"}{" "}
        {item?.weight_unit ? `(${item.weight_unit})` : ""}
      </p>
    );
    const validtill = <p>{formatDate(item?.valid_till)}</p>;
    const airway = <p>{item?.airwaybilno || "N.A."}</p>;
    const buyprice = (
      <p className="text-end">
        {Number(item.buy_price)
          ? Number(item.buy_price).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
          : null}
        {item.buy_price && item?.price_type == "1"
          ? "(a)"
          : item.buy_price && item?.price_type == "2"
            ? "(k)"
            : "N.A."}
      </p>
    );
    const sellprice = (
      <p className="text-end">
        {Number(item.spot_price).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
        {item.spot_price && item?.price_type == "1"
          ? "(a)"
          : item.spot_price && item?.price_type == "2"
            ? "(k)"
            : ""}
      </p>
    );
    const destCity = (
      <p>
        {item?.org_country_id == "97" && item?.dest_country_id == "97"
          ? item?.dest_city
          : countryData?.find(
            (elem) => elem.country_id == item?.dest_country_id,
          )?.country_name ||
          item?.dest_city ||
          "N.A."}
      </p>
    );
    const overseasPrice = (
      <>
        {item?.franchisee_currency || ""}
        {"  "}
        {foreignFormat(item?.spot_price_foreign_currency) || "0.00"}
      </>
    );
    return {
      ...item,
      vendor: forVendordata,
      weight_slab: weightSlabdata,
      franchisee: forFranchiseedata,
      action: isStatus || "-",
      status: bookingstatus,
      shipment_type:
        shipmentTypedata?.find(
          (item2: any) =>
            item2?.booking_shipment_type_id == item?.shipment_type,
        )?.shipment_type || "-",
      shipment_type_id:
        item?.shipment_type || "-",
      created_date: createddate,
      weight: weightdata,
      valid_till: validtill,
      airwaybilno: airway,
      buy_price: buyprice,
      spot_price: sellprice,
      overseas_price: overseasPrice,
      dest_city: destCity,
      enquiry_from: item?.enquiry_from || null,
    };
  });

  return (
    <>
      <div>
        <div className="w-full max-w-8xl mx-auto mt-4 bg-white ">
          <div className="flex items-center justify-between py-2 px-2">
            <h2 className="text-sm font-medium sm:text-base">
              PENDING SPOT ENQUIRIES
            </h2>
            <div className="relative w-full sm:w-auto">
              <FormInput
                id="vertical-form-1"
                type="text"
                className="border rounded-md px-3 py-2 w-full sm:w-56"
                value={enquiryId}
                onChange={(e) => {
                  setEnquiryId(e.target.value.toUpperCase());
                  setPage(1);
                }}
                placeholder="Enter Enquiry No."
              />
              <button className="absolute top-2.5 right-2.5 text-gray-400">
                <Search />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 pb-2">
            <span
              className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold text-mustard"
              style={{ backgroundColor: "#FDF6B2" }}
            >
              Fedex - GTI / MASTER
            </span>
          </div>
        </div>
        <div className="">
          {loading ? (
            <IsLoading />
          ) : getSpotList?.length > 0 && !loading ? (
            <>
              <Table
                heightTable="45vh"
                columns={
                  value === "all"
                    ? columns
                    : columns.filter((_, index) => index !== 1)
                }
                row={row}
                margin="mt-0"
                currentPage={page}
                vendorData={vendorData}
              />
              <CommonPagination
                totalpages={totalpages}
                onPageChange={handlePagechange}
                page={page}
              />
            </>
          ) : (
            <>
              {" "}
              <Nodatafound />
            </>
          )}
        </div>
      </div>

      {openModal2 ? (
        <ApprovalModal
          setOpenModal={setOpenModal2}
          openmodal={openModal2}
          pickDataforForm={pickDataforForm}
          setPickDataforForm={setPickDataforForm}
          vendorData={vendorData}
          serviceTypeData={serviceTypeData}
          getspotlistdata={getspotlistdata}
          franchiseedata={franchiseeData}
          allvendordropdowndata={allvendordropdowndata}
          gettopdata={gettopdata}
          chargesList={chargesList}
          errors={errors}
          setErrors={setErrors}
          handleerrors={handleerrors}
          updateInterrors={updateInterrors}
          incotermList={incotermList}
          setIncotermList={setIncotermList}
          interrors={interrors}
          commoditytype={commoditytype}
          value={value}
          currencydata={currencydata}
          alltypedata={alltypedata}
        // addedbuyingcharges={buyingcharges}
        // addedsellingcharges={sellingcharges}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default SpotpriceApproval;