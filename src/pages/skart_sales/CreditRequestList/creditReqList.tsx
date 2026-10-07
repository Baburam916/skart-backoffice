import { useEffect, useState } from "react";
import { Search, FileText, StickyNote, X, CreditCard } from "lucide-react";
import Table from "../../../components/Table";
import CommonPagination from "../../../components/Pagination";
import { FormInput } from "../../../base-components/Form";
import { commongetrequest, universalget } from "../../../AllServices/services";
import { formatDate, indianFormat } from "../../../utils";
import { useDebounce } from "../commoncomponents/JsonToCsv/useDebounce/useDebounce";
import { useAlert } from "../../../ContextProvider/AlertContext";
import IsLoading from "../commoncomponents/isLoading/isLoading";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";
import { User } from "lucide-react";

import AOS from "aos";
import "aos/dist/aos.css";

const index = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [creditBalData, setCreditBalData] = useState<Array<any>>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [listLoading, setListLoading] = useState(false);
  const { showAlert } = useAlert();
  const { statusdata, franhiseedata, userdata } = useLogin();

  const [remarksModal, setRemarksModal] = useState<{
    open: boolean;
    text: string;
  }>({ open: false, text: "" });

  const [shipmentTypeData, setShipmentTypeData] = useState<any[]>([]);
  const [cargoTypeData, setCargoTypeData] = useState<any[]>([]);
  const [incotermData, setIncotermData] = useState<any[]>([]);
  const [serviceTypeData, setServiceTypeData] = useState<any[]>([]);
  const [currencyData, setCurrencyData] = useState<any[]>([]);
  const [courierData, setCourierData] = useState<any[]>([]);
  const [commodityData, setCommodityData] = useState<any[]>([]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const fetchLookups = async () => {
    try {
      const [shipment, cargo, incoterm, service, currency, courier, commodity] =
        await Promise.allSettled([
          commongetrequest("admin/booking-shipment-type"),
          commongetrequest("booking/cargo-type"),
          commongetrequest("booking/incoterm"),
          commongetrequest("booking/service_type_list"),
          commongetrequest("booking/currency"),
          commongetrequest("admin/courier-product"),
          commongetrequest("admin/commodity-type?offset=0"),
        ]);
      if (shipment.status === "fulfilled" && shipment.value?.status === 200)
        setShipmentTypeData(shipment.value?.data?.data || []);
      if (cargo.status === "fulfilled" && cargo.value?.status === 200)
        setCargoTypeData(cargo.value?.data?.data || []);
      if (incoterm.status === "fulfilled" && incoterm.value?.status === 200)
        setIncotermData(incoterm.value?.data?.data || []);
      if (service.status === "fulfilled" && service.value?.status === 200)
        setServiceTypeData(service.value?.data?.data || []);
      if (currency.status === "fulfilled" && currency.value?.status === 200)
        setCurrencyData(currency.value?.data?.data || []);
      if (courier.status === "fulfilled" && courier.value?.status === 200)
        setCourierData(courier.value?.data?.data || []);
      if (commodity.status === "fulfilled" && commodity.value?.status === 200)
        setCommodityData(commodity.value?.data?.data || []);
    } catch (err: any) {
      console.log(err);
    }
  };

  const listData = async () => {
    try {
      setListLoading(true);
      const response = await commongetrequest(
        `booking/credit-spot-union/list?limit=10&page=${page - 1}&key=${debouncedSearch}${(userdata as any)?.type_id == 6 ? `&sales_id=${(userdata as any)?.mapped_id}` : ""}`,
      );

      if (response?.status == 200) {
        setCreditBalData(response?.data?.data || []);
        setTotalPages(Number(response?.data?.totalPages));
        console.log("rersfsadfsafd", response?.data?.totalPages);
      } else if (response?.status == 204) {
        setCreditBalData([]);
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
        );
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setListLoading(false);
    }
  };

  const columns = [
    { field: "status", headerName: "Approved Status" },
    { field: "franchisee_name", headerName: "Franchisee" },
    { field: "created_date", headerName: "Date" },
    { field: "credit_request_date", headerName: "Requested Date" },
    { field: "booking_no", headerName: "Booking No" },
    { field: "weight", headerName: "Weight" },
    { field: "credit_days", headerName: "Requested Credit Days" },
    { field: "updated_credit_days", headerName: "Updated Credit Days" },
    { field: "credit_limit", headerName: "Request Credit Amount" },
    { field: "credit_approved", headerName: "Credit Approve" },
    { field: "action_date", headerName: "Approved Date" },
    { field: "credit_app1", headerName: "ApprovedBy1" },
    { field: "credit_app2", headerName: "ApprovedBy2" },
    { field: "email", headerName: "Email" },
    { field: "doc", headerName: "Document" },
    { field: "approve_remarks", headerName: "Approve Remarks" },
    { field: "franchisee_remarks", headerName: "Franchisee Remarks" },
    { field: "reject_remarks", headerName: "Reject Remarks" },
    { field: "credit_remarks", headerName: "Credit Remarks" },
  ];

  const formatVal = (val: any) =>
    val === null || val === undefined || val === "" ? "N/A" : String(val);

  const row: any = creditBalData?.map((item: any) => ({
    ...item,
    weight: item?.weight
      ? `${item.weight} ${item?.weight_unit ?? ""}`.trim()
      : "N/A",
    valid_till: item?.valid_till ? formatDate(item.valid_till) : "N/A",
    req_date: item?.req_date ? formatDate(item.req_date) : "N/A",
    collection_date: item?.collection_date
      ? formatDate(item.collection_date)
      : "N/A",
    action_date: item?.action_date ? formatDate(item.action_date) : "N/A",
    credit_request_date: item?.credit_request_date
      ? formatDate(item.credit_request_date)
      : "N/A",
    credit_expiry: item?.credit_expiry ? formatDate(item.credit_expiry) : "N/A",
    created_date: item?.created_date ? formatDate(item.created_date) : "N/A",
    updated_date: item?.updated_date ? formatDate(item.updated_date) : "N/A",
    spot_price:
      item?.spot_price != null ? indianFormat(Number(item.spot_price)) : "N/A",
    spot_price_foreign_currency:
      item?.spot_price_foreign_currency != null
        ? indianFormat(Number(item.spot_price_foreign_currency))
        : "N/A",
    buy_price:
      item?.buy_price != null ? indianFormat(Number(item.buy_price)) : "N/A",
    freight_price:
      item?.freight_price != null
        ? indianFormat(Number(item.freight_price))
        : "N/A",
    credit_limit:
      item?.credit_limit != null
        ? indianFormat(Number(item.credit_limit))
        : "N/A",
    credit_approved:
      item?.credit_approved != null
        ? indianFormat(Number(item.credit_approved))
        : "N/A",
    credit_used:
      item?.credit_used != null
        ? indianFormat(Number(item.credit_used))
        : "N/A",
    available_credit_limit:
      item?.available_credit_limit != null
        ? indianFormat(Number(item.available_credit_limit))
        : "N/A",
    margin: item?.margin != null ? indianFormat(Number(item.margin)) : "N/A",
    // Boolean fields
    is_edit: item?.is_edit === true || item?.is_edit == 1 ? "Yes" : "No",
    is_returnable: item?.is_returnable == 1 ? "Yes" : "No",
    pickup_required: item?.pickup_required == 1 ? "Yes" : "No",
    pdc_needed: item?.pdc_needed == 1 ? "Yes" : "No",
    is_settled: item?.is_settled == 1 ? "Yes" : "No",
    is_active: item?.is_active == 1 ? "Yes" : "No",
    is_draft: item?.is_draft == 1 ? "Yes" : "No",
    is_console: item?.is_console == 1 ? "Yes" : "No",
    is_import_reject_approve:
      item?.is_import_reject_approve == 1 ? "Yes" : "No",
    import_booking: item?.import_booking == 1 ? "Yes" : "No",
    status:
      item?.status === "accept" || item?.status == 1 ? (
        <p className="text-green-500">
          <strong>Approved</strong>
        </p>
      ) : item?.status === "reject" || item?.status == 2 ? (
        <p className="text-red-500">
          <strong>Rejected</strong>
        </p>
      ) : (
        <p className="text-gray-600">
          <strong>In Progress</strong>
        </p>
      ),
    // ID → label lookups
    booking_status:
      item?.booking_status == 15
        ? item?.is_checklist == 1
          ? "CheckList Done"
          : "CheckList Pending"
        : statusdata?.find((s: any) => s.status_code == item?.booking_status)
            ?.status_name || formatVal(item?.booking_status),
    shipment_type:
      shipmentTypeData?.find(
        (s: any) => s.booking_shipment_type_id == item?.shipment_type,
      )?.shipment_type || formatVal(item?.shipment_type),
    cargo_type:
      cargoTypeData?.find((s: any) => s.id == item?.cargo_type)?.name ||
      formatVal(item?.cargo_type),
    incoterm:
      incotermData?.find((s: any) => s.id == item?.incoterm)?.name ||
      formatVal(item?.incoterm),
    service_type:
      serviceTypeData?.find((s: any) => s.id == item?.service_type)
        ?.service_type || formatVal(item?.service_type),
    currency_id:
      currencyData?.find((s: any) => s.id == item?.currency_id)?.currency ||
      formatVal(item?.currency_id),
    courier_id:
      courierData?.find((s: any) => s.product_id == item?.courier_id)
        ?.product_name || formatVal(item?.courier_id),
    commodity:
      commodityData?.find((c: any) => c.commodity_id == item?.commodity)
        ?.commodity || formatVal(item?.commodity),
    price_type:
      item?.price_type == "1" || item?.price_type == 1
        ? "All-in"
        : item?.price_type == "2" || item?.price_type == 2
          ? "Per KG"
          : formatVal(item?.price_type),
    import_service_type:
      item?.import_service_type == 1 || item?.import_service_type == "1"
        ? "Economy"
        : item?.import_service_type == 2 || item?.import_service_type == "2"
          ? "Express (IP)"
          : formatVal(item?.import_service_type),
    email: item?.email_id ? item.email_id : "N/A",
    doc: item?.credit_attach ? (
      <div className="flex justify-center">
        <a href={item.credit_attach} target="_blank" rel="noreferrer">
          <FileText className="cursor-pointer w-5 h-5" />
        </a>
      </div>
    ) : (
      "N/A"
    ),
    updated_credit_days: item?.updated_credit_days ?? "N/A",
    credit_app1: item?.credit_app1 ? item.credit_app1 : "N/A",
    credit_app2: item?.credit_app2 ? item.credit_app2 : "N/A",
    // Nullable text fields
    email_id: formatVal(item?.email_id),
    franchisee_name:
      franhiseedata?.find((f: any) => f.franchisee_id == item?.franchisee_id)
        ?.franchisee_name || formatVal(item?.franchisee_name),
    dest_state: formatVal(item?.dest_state),
    reject_remarks: formatVal(item?.reject_remarks),
    franchisee_remarks:
      item?.franchisee_remarks && item.franchisee_remarks !== "" ? (
        <div className="flex justify-center">
          <button
            onClick={() =>
              setRemarksModal({ open: true, text: item.franchisee_remarks })
            }
            className="text-blue-500 hover:text-blue-700"
            title="View Remarks"
          >
            <StickyNote className="w-5 h-5" />
          </button>
        </div>
      ) : (
        "N.A."
      ),
    franchisee_action: formatVal(item?.franchisee_action),
    credit_remarks: formatVal(item?.credit_remarks),
    held_up_remark: formatVal(item?.held_up_remark),
    release_remark: formatVal(item?.release_remark),
    req_attach: formatVal(item?.req_attach),
    credit_attach: formatVal(item?.credit_attach),
    proforma_url: formatVal(item?.proforma_url),
    house_draft: formatVal(item?.house_draft),
    signed_house: formatVal(item?.signed_house),
    primary_overseas: formatVal(item?.primary_overseas),
    secondary_overseas: formatVal(item?.secondary_overseas),
    master: formatVal(item?.master),
    import_booking_type: formatVal(item?.import_booking_type),
    fedex_account_type: formatVal(item?.fedex_account_type),
    fair_data: formatVal(item?.fair_data),
    unique_id: formatVal(item?.unique_id),
    created_by: formatVal(item?.created_by),
    updated_by: formatVal(item?.updated_by),
    inactive: formatVal(item?.inactive),
    is_zipcode: formatVal(item?.is_zipcode),
    actioned_by: formatVal(item?.actioned_by),
    approve_remarks: formatVal(item?.approve_remarks),
  }));

  useEffect(() => {
    fetchLookups();
  }, []);

  useEffect(() => {
    listData();
  }, [page, debouncedSearch]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      {remarksModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-800">
                Franchisee Remarks
              </h3>
              <button
                onClick={() => setRemarksModal({ open: false, text: "" })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
              {remarksModal.text}
            </p>
          </div>
        </div>
      )}
      <>
        <div className="w-full mt-2 mb-4" data-aos="fade-up">
          <div className="mt-1 w-full bg-white rounded-[10px]  border border-white">
            <div className=" w-full py-2  px-3 border-b border-white commonGBackOffice  rounded-t-[10px]">
              <div className="flex-wrap lg:flex-nowrap flex gap-2 items-center justify-between w-full commonGBackOfficeInner">
                <div>
                  <div className="flex items-center gap-2" data-aos="fade-up">
                    <i className=" w-[25px] h-[25px]  rounded-lg flex items-center justify-center bg-mustard">
                      <CreditCard className="w-[16px]  text-[#fff] " />
                    </i>
                    <h4 className="text-[16px] font-medium text-white">
                      Credit Request List
                    </h4>
                  </div>
                </div>

                <div
                  className="flex items-center  w-full lg:w-auto"
                  data-aos="fade-up"
                >
                  <div className="relative w-full lg:w-[230px]">
                    <FormInput
                      id="vertical-form-1"
                      type="text"
                      placeholder="Search by booking no..."
                      className="border rounded-md px-3 py-2 w-full border-none h-[30px]"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value.replace(/\s/g, ""));
                        setPage(1);
                      }}
                    />
                    <button className="absolute top-[3px] right-2.5 text-gray-400 ">
                      <Search className="w-[16px]" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2  lg:p-6">
              <div className="w-full" data-aos="fade-up">
                {listLoading ? (
                  <IsLoading />
                ) : creditBalData?.length > 0 ? (
                  <div className=" block">
                    <div className="overflow-x-scroll scrollbar-hidden">
                      <Table
                        columns={columns}
                        row={row}
                        currentPage={page || 0}
                      />
                      <CommonPagination
                        onPageChange={handlePageChange}
                        page={Number(page)}
                        totalpages={Number(totalPages)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md  text-gray-500 text-center">
                    Data Not Found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default index;
