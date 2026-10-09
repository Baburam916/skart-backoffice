import { useEffect, useState } from "react";
import {
  UserCog,
  ChevronDown,
  X,
  Box,
  Briefcase,
  FileText,
} from "lucide-react";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useDebounce } from "../commoncomponents/JsonToCsv/useDebounce/useDebounce";
import { FormInput, FormLabel } from "../../../base-components/Form";
import { Menu } from "../../../base-components/Headless";
import Button from "../../../base-components/Button";
import CommonTable from "../commoncomponents/CommonTable/CommonTable";
import CommonPagination from "../../../components/Pagination";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import CommonSearchableAll from "../commoncomponents/CommonSearchableall/CommonSearchableall";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import IsLoading from "../commoncomponents/isLoading/isLoading";
import LoadingIcon from "../../../base-components/LoadingIcon";
import SellBuyForm from "../SpotEnquiry/SpotEnquiryModal/spotpriceChargeform";
import {
  commongetrequest,
  commonputrequest,
} from "../../../AllServices/services";
import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";
import { formatIndianNumber } from "../commoncomponents/CommonNumberConverter/CommonNumberconverter";

import AOS from "aos";
import "aos/dist/aos.css";

const intSelectedFranchisee = {
  franchisee_id: "",
  franchisee_name: "",
};

const intBuyCharge = {
  charge_id: "",
  weight: 1,
  rate: 0,
  per_kg: 2,
  inr_amount: 0,
  currency: "24",
  job_id: "",
  ex_rate: "1",
  pp_cc: "1",
  party: "",
  party_name: "",
  sac_code: "",
};

const intExchangeData = [
  { id: "1", currency_id: "24", currency: "INR", ex_rate: "1" },
  { id: "2", currency_id: "", currency: "", ex_rate: "" },
  { id: "3", currency_id: "", currency: "", ex_rate: "" },
];

export default function CargoCommercialBookings() {
  const [page, setPage] = useState<number>(1);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState<any>(0);
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hawbSearch, setHawbSearch] = useState<string>("");
  const debouncedHawbSearch = useDebounce(hawbSearch, 500);
  const [selectedFranchisee, setSelectedFranchisee] = useState<any>(
    intSelectedFranchisee,
  );
  const [franchiseeData, setFranchiseeData] = useState<any[]>([]);
  const [courierData, setCourierData] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [chargesMasterData, setChargesMasterData] = useState<any[]>([]);
  const [currencyData, setCurrencyData] = useState<any[]>([]);
  const [partyTypeData, setPartyTypeData] = useState<any[]>([]);
  const [chargesModalOpen, setChargesModalOpen] = useState<boolean>(false);
  const [chargesLoading, setChargesLoading] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<any>({});
  const [buyCharges, setBuyCharges] = useState<any[]>([]);
  const [originalBuyCharges, setOriginalBuyCharges] = useState<any[]>([]);
  const [sellingCharges, setSellingCharges] = useState<any[]>([]);
  const [exchangeData, setExchangeData] = useState<any[]>(intExchangeData);
  const [chargesSubmitLoading, setChargesSubmitLoading] =
    useState<boolean>(false);
  const { showAlert } = useAlert();

  const handlePagechange = (e: number) => {
    setPage(e);
    setOffset(e - 1);
  };

  const funtoempty = () => {};
  const fun1 = () => {};

  const handleUpdateCharges = async (item: any) => {
    setSelectedBooking(item);
    setExchangeData(intExchangeData);
    setChargesModalOpen(true);
    setChargesLoading(true);
    try {
      const response: any = await commongetrequest(
        `booking/booking-buy-sell/${item?.pickup_id}`,
      );
      const buying = response?.data?.buying;
      const selling = response?.data?.selling;
      setSellingCharges(selling?.length ? selling : []);
      setOriginalBuyCharges(buying?.length ? buying : []);
      setBuyCharges(
        buying?.length
          ? buying
          : [
              {
                ...intBuyCharge,
                weight: item?.chargeable_weight || 1,
                job_id: item?.job_id,
              },
            ],
      );
    } catch (err: any) {
      console.log(err);
      setSellingCharges([]);
      setOriginalBuyCharges([]);
      setBuyCharges([
        {
          ...intBuyCharge,
          weight: item?.chargeable_weight || 1,
          job_id: item?.job_id,
        },
      ]);
    } finally {
      setChargesLoading(false);
    }
  };

  const buildBuyChargePayload = (item: any, isDeleted: number) => ({
    charge_id: item?.charge_id,
    weight: item?.weight || 1,
    old_buy: item?.old_buy ?? item?.rate ?? 0,
    rate: item?.rate || 0,
    per_kg: item?.per_kg,
    inr_amount: item?.inr_amount || 0,
    currency: item?.currency,
    ex_rate: item?.ex_rate || 1,
    pp_cc: item?.pp_cc,
    party: item?.party || null,
    party_name: item?.party_name || "",
    party_type: item?.party_type || null,
    is_deleted: isDeleted,
    sac_code: item?.sac_code || "",
    inv_id: item?.inv_id ?? null,
  });

  const handleSubmitCharges = async () => {
    const pickupId = selectedBooking?.pickup_id;
    if (!pickupId) {
      showAlert("Pickup Id is required", "warning");
      return;
    }

    const activeChargeIds = new Set(
      buyCharges
        ?.filter((item: any) => item?.charge_id)
        ?.map((item: any) => String(item.charge_id)),
    );

    const activeCharges =
      buyCharges
        ?.filter((item: any) => item?.charge_id)
        ?.map((item: any) => buildBuyChargePayload(item, 0)) || [];

    // charges that existed on the booking but are no longer in the table
    // (removed via the trash icon, or swapped for a different charge type)
    const removedCharges =
      originalBuyCharges
        ?.filter(
          (item: any) =>
            item?.charge_id && !activeChargeIds.has(String(item.charge_id)),
        )
        ?.map((item: any) => buildBuyChargePayload(item, 1)) || [];

    const payload = [...activeCharges, ...removedCharges];

    if (!payload.length) {
      showAlert("Please add at least one charge", "warning");
      return;
    }

    setChargesSubmitLoading(true);
    try {
      const response: any = await commonputrequest(
        `booking/pickup-buying-charges/${pickupId}`,
        { charges: payload },
      );
      if (response?.status == 200) {
        showAlert(
          response?.data?.message || "Buying charges updated successfully",
        );
        setChargesModalOpen(false);
      } else if (response?.status == 406) {
        showAlert(
          response?.response?.data?.errors?.[0]?.msg || "Validation failed",
          "error",
        );
      } else {
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message ||
            "Something went wrong",
          "error",
        );
      }
    } catch (err: any) {
      console.log(err);
      showAlert(err?.message || "Something went wrong", "error");
    } finally {
      setChargesSubmitLoading(false);
    }
  };

  const fetchFranchiseeData = async () => {
    try {
      const response: any = await commongetrequest("admin/franchisee-settings");
      if (response?.status == 200) {
        setFranchiseeData(response?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const fetchCourierData = async () => {
    try {
      const response: any = await commongetrequest("admin/courier-product");
      if (response?.status == 200) {
        setCourierData(response?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const fetchCountryData = async () => {
    try {
      const response: any = await commongetrequest("admin/country");
      if (response?.status == 200) {
        setCountryData(response?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const fetchChargesMasterData = async () => {
    try {
      const response: any = await commongetrequest(
        "admin/charges?type=E&is_cargo=1",
      );
      if (response?.status == 200) {
        setChargesMasterData(response?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const fetchCurrencyData = async () => {
    try {
      const response: any = await commongetrequest("booking/currency");
      if (response?.status == 200) {
        setCurrencyData(response?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const fetchPartyTypeData = async () => {
    try {
      const response: any = await commongetrequest(
        "master/customer-type-data_ac/2",
      );
      if (response?.status == 200) {
        setPartyTypeData(response?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const columns = [
    { field: "action", headerName: "Action" },
    { field: "booking_no", headerName: "Booking No", text: "text-left" },
    { field: "airwaybilno", headerName: "HAWB No.", text: "text-left" },
    {
      field: "franchisee_name",
      headerName: "Franchisee Name",
      text: "text-left",
    },
    { field: "vendor_name", headerName: "Vendor Name", text: "text-left" },
    {
      field: "destination_country_name",
      headerName: "Destination Country",
      text: "text-left",
    },
    { field: "shipper_name", headerName: "Shipper Name", text: "text-left" },
    { field: "gross_weight", headerName: "Gross Weight", text: "text-right" },
    {
      field: "chargeable_weight",
      headerName: "Chargeable Weight",
      text: "text-right",
    },
    { field: "td_weight", headerName: "TD Weight (KGS)", text: "text-right" },
  ];

  const row: any = data?.map((item: any) => ({
    ...item,
    action: (
      <Menu>
        <Menu.Button className="bg-blue-100 text-blue-500 border-blue-500 flex items-center p-1 rounded-lg border-2">
          <UserCog className="w-5 stroke-2.5" />
          <ChevronDown className="w-4 stroke-2.5" />
        </Menu.Button>
        <Menu.Items
          className="w-48 mt-px border-2 border-slate-200"
          placement="right-start"
        >
          <Menu.Item
            className="hover:bg-mustard hover:text-white"
            onClick={() => handleUpdateCharges(item)}
          >
            Update Charges
          </Menu.Item>
        </Menu.Items>
      </Menu>
    ),
    booking_date: item?.booking_date ? formatDate(item.booking_date) : "N/A",
    weight: item?.weight
      ? `${item.weight} ${item?.weight_unit ?? ""}`.trim()
      : "N/A",
    amount: item?.amount != null ? formatIndianNumber(item.amount) : "N/A",
    franchisee_name:
      franchiseeData?.find(
        (f: any) => f.franchisee_id == item?.pickup_franchisee_id,
      )?.franchisee_name || "N/A",
    vendor_name:
      courierData?.find((c: any) => c?.product_id == item?.courier_id)
        ?.product_name || "N/A",
    destination_country_name:
      countryData?.find((c: any) => c?.country_id == item?.destination_country)
        ?.country_name || "N/A",
    shipper_name: item?.shipper_name || "N/A",
    gross_weight:
      item?.shipment_dimensions?.reduce(
        (acc: any, curr: any) => Number(acc) + Number(curr?.weight),
        0,
      ) || "-",
    chargeable_weight: item?.chargeable_weight ?? "N/A",
    td_weight: item?.td_weight ?? "N/A",
    customer_name: item?.customer_name || "N/A",
    status: item?.status || "N/A",
  }));

  const fetchData = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 20,
        offset: offset ?? 0,
      };
      if (debouncedHawbSearch?.trim()) {
        params.key = debouncedHawbSearch.trim();
      }
      if (selectedFranchisee?.franchisee_id) {
        params.franchisee_id = selectedFranchisee.franchisee_id;
      }
      const response: any = await commongetrequest(
        "booking/booking-list-accounts-pending",
        { params },
      );

      if (response?.status == 200) {
        setCount(Number(response?.data?.count) || 0);
        setData(response?.data?.data || []);
      } else if (response?.status == 204) {
        setData([]);
        setCount(0);
      } else if (response?.message == "Network Error") {
        showAlert(response.message, "error");
      } else {
        setData([]);
        showAlert(
          response?.data?.message ||
            response?.response?.data?.message ||
            response?.message,
          "error",
        );
      }
    } catch (err: any) {
      showAlert(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchiseeData();
    fetchCourierData();
    fetchCountryData();
    fetchChargesMasterData();
    fetchCurrencyData();
    fetchPartyTypeData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [offset, debouncedHawbSearch, selectedFranchisee?.franchisee_id]);

  const buyChargesTotal =
    buyCharges?.reduce(
      (acc: number, curr: any) => acc + (Number(curr?.inr_amount) || 0),
      0,
    ) || 0;

  const buyGstTotal =
    buyCharges?.reduce((acc: number, curr: any) => {
      if (!curr?.charge_id || curr?.charge_id == 163) return acc;
      const chargeInfo = chargesMasterData?.find(
        (c: any) => c.charge_id == curr?.charge_id,
      );
      const igstRate = parseFloat(chargeInfo?.tax_breakup?.igst || "18") / 100;
      return acc + (Number(curr?.inr_amount) || 0) * igstRate;
    }, 0) || 0;

  const chargesModalTitle = (
    <div className="flex items-center justify-between w-full flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-lg text-white mr-2">Update Charges</h1>
      </div>
      <X
        className="cursor-pointer cursor-pointer text-red-700"
        onClick={() => setChargesModalOpen(false)}
      />
    </div>
  );

  const chargesModalDescription = (
    <div className="col-span-12">
      <div className="grid grid-cols-12  gap-2">
        <div className="mb-2 col-span-12 lg:col-span-4">
          <div className="bg-[#f2f7ff] rounded-lg p-[7px] flex w-full ">
            <figure className="w-[35px] flex items-center justify-center">
              <FileText className="w-[35px]  text-[#3b7dd8] " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                {" "}
                Booking No
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {selectedBooking?.booking_no || "N/A"}
                </span>
              </h4>
            </aside>
          </div>
        </div>

        <div className="mb-2 col-span-12 lg:col-span-4">
          <div className="bg-[#eafffa] rounded-lg p-[7px] flex  w-full">
            <figure className="w-[35px] flex items-center justify-center">
              <Box className="w-[30px]  text-[#18a080]  " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                AIRWAYBILL No
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {selectedBooking?.airwaybilno || "N/A"}
                </span>
              </h4>
            </aside>
          </div>
        </div>
        <div className="mb-2 col-span-12 lg:col-span-4">
          <div className="bg-[#faf5ff] rounded-lg p-[7px] flex  w-full ">
            <figure className="w-[35px] flex items-center justify-center">
              <Briefcase className="w-[30px]  text-[#9c51e7] " />
            </figure>
            <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
              <p className="text-[12px] uppercase text-[#757575] w-full">
                {" "}
                JOB No
              </p>
              <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                <span className="capitalize font-bold cursor-pointer">
                  {selectedBooking?.job_id || "N/A"}
                </span>
              </h4>
            </aside>
          </div>
        </div>
      </div>
      {/* <span className="bg-gray-100 text-white text-sm font-semibold px-3 py-1.5 rounded-md">
          Booking No: {selectedBooking?.booking_no || "N/A"}
        </span>
        <span className="bg-gray-100 text-white text-sm font-semibold px-3 py-1.5 rounded-md">
          AIRWAYBILL No: {selectedBooking?.airwaybilno || "N/A"}
        </span>
        <span className="bg-gray-100 text-white text-sm font-semibold px-3 py-1.5 rounded-md">
          JOB No.: {selectedBooking?.job_id || "N/A"}
        </span> */}

      {chargesLoading ? (
        <IsLoading />
      ) : (
        <SellBuyForm
          chargesdata={chargesMasterData}
          spotData={{
            forwhat: "pricing",
            booking_status: 0,
            id: selectedBooking?.job_id,
            weight: selectedBooking?.chargeable_weight || 1,
          }}
          sellingcharges={sellingCharges}
          setSellingCharges={setSellingCharges}
          buycharges={buyCharges}
          setBuyCharges={setBuyCharges}
          currencydata={currencyData}
          fun1={fun1}
          funtoempty={funtoempty}
          exchangedata={exchangeData}
          setExchangedata={setExchangeData}
          totalbuy={buyChargesTotal}
          totalSell={0}
          toggle={2}
          setToggle={() => {}}
          alltypedata={partyTypeData}
          forwhat={"pricing"}
          hideSelling={true}
          hideBuying={false}
          gstStatus={0}
          singlefranchiseedata={{}}
        />
      )}
    </div>
  );

  const chargesModalFooter = (
    <div className="w-full">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
        <div>
          <FormLabel>Sub-Total (₹):</FormLabel>
          <FormInput disabled value={formatIndianNumber(buyChargesTotal)} />
        </div>
        <div>
          <FormLabel>GST (₹):</FormLabel>
          <FormInput
            disabled
            value={formatIndianNumber(parseFloat(buyGstTotal.toFixed(3)))}
          />
        </div>
        <div>
          <FormLabel>Total Amt (INR):</FormLabel>
          <FormInput
            disabled
            value={formatIndianNumber(
              parseFloat((buyChargesTotal + buyGstTotal).toFixed(3)),
            )}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          disabled={chargesSubmitLoading}
          onClick={() => setChargesModalOpen(false)}
          className="w-24 p-2 bg-gray-500 text-white"
        >
          Close
        </Button>
        <Button
          type="button"
          variant="mustard"
          disabled={chargesSubmitLoading}
          onClick={handleSubmitCharges}
          className="w-24 p-2"
        >
          Submit{" "}
          {chargesSubmitLoading && (
            <LoadingIcon
              icon="tail-spin"
              className="inline-block w-4 h-4 ml-1"
            />
          )}
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

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
                    <Box className="w-[17px]  text-[#fff] " />
                  </i>
                  <h4 className="text-[16px] font-medium text-white">
                    Cargo Commercial Bookings
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full p-2 lg:p-3 border-b border-[#fffaef] bg-[#fffaef]">
            <div className="w-full" data-aos="fade-up">
              <div className="grid grid-cols-12  gap-2">
                <div className="mb-2 col-span-12 lg:col-span-4">
                  <div className="w-full]">
                    <FormLabel className="uppercase text-xs font-semibold !mb-0">
                      Search By Booking / HAWB :
                    </FormLabel>
                    <FormInput
                      placeholder="Enter Booking / HAWB No."
                      value={hawbSearch}
                      onChange={(e: any) => {
                        setHawbSearch(e.target.value);
                        setPage(1);
                        setOffset(0);
                      }}
                    />
                  </div>
                </div>

                <div className="mb-2 col-span-12 lg:col-span-4">
                  <div className="w-full]">
                    <FormLabel className="uppercase text-xs font-semibold !mb-0">
                      Search By Franchisee :
                    </FormLabel>
                    <CommonSearchableAll
                      apiEndpoint={"admin/franchisee-settings"}
                      placeholder={"Search Franchisee"}
                      selecteddata={selectedFranchisee}
                      setSelecteddata={setSelectedFranchisee}
                      fun1={fun1}
                      comingselectedname={"franchisee_name"}
                      comingselectedid={"franchisee_id"}
                      funtoempty={funtoempty}
                      key1={"key"}
                      zIndex={30}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2  lg:p-6">
            <div className="" data-aos="fade-up">
              <div className=" overflow-x-scroll">
                <CommonTable
                  columns={columns}
                  row={row}
                  loading={loading}
                  page={offset}
                  limit={20}
                />
                {!loading && data?.length !== 0 && (
                  <div>
                    <CommonPagination
                      totalpages={+count}
                      onPageChange={handlePagechange}
                      page={page}
                    />
                  </div>
                )}
                {!loading && data?.length == 0 && <Nodatafound />}
              </div>
              {chargesModalOpen && (
                <CommonModal
                  open={chargesModalOpen}
                  setOpen={setChargesModalOpen}
                  title={chargesModalTitle}
                  description={chargesModalDescription}
                  footer={chargesModalFooter}
                  size="xxl"
                  gridColumns={1}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
