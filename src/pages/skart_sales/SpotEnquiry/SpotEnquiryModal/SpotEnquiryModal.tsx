import { useEffect, useRef, useState } from "react";
import Button from "../../../../base-components/Button";

import styles from "./spotenquiry.module.css";
import CommonModal from "../../commoncomponents/CommonModal/CommonModal";
import {
  commongetrequest,
  commonpostrequest,
  commonputrequest,
} from "../../../../AllServices/services";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import {
  ArrowLeft,
  Cross,
  Download,
  Mail,
  IndianRupee,
  CheckCircle,
  XCircle,
  Wallet,
  Coins,
  Database,
} from "lucide-react";

import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from "../../../../base-components/Form";
import { useLogin } from "../../commoncomponents/LoginContextProvider/LoginContextProvider";

import IsLoading from "../../commoncomponents/isLoading/isLoading";
import SellBuyForm from "./spotpriceChargeform";

import Tippy from "../../../../base-components/Tippy";
import { formatIndianNumber } from "../../commoncomponents/CommonNumberConverter/CommonNumberconverter";
import { X } from "lucide-react";
import { MdClose } from "react-icons/md";

import ConfirmationModal from "../../commoncomponents/CommonsurityModal/ConfimationModal";
import {
  checkallfiled,
  checkrequiredvalues,
  ShipmentDimensions,
} from "../../commoncomponents/ShipmentDimensions/shipmentdimensions";
import { emailbodyfun, getpropersalespersons } from "./emailbody";
import { indianFormat } from "../../../../utils";

import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";

import LoadingButtonCommon from "../../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import { formatDate } from "../../commoncomponents/commondateformat/datetoreqformat";
import CommonemailModal from "./emailModal";
import { Eye } from "lucide-react";
import { formatDateDDMMYYYY } from "../SpotPriceEnquiry2";
import { FileText } from "lucide-react";
import { Card } from "flowbite-react";
import { FaCircleXmark } from "react-icons/fa6";

const limitToThreeDecimals = (value: string): string => {
  const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const dotIdx = v.indexOf(".");
  if (dotIdx !== -1 && v.length - dotIdx - 1 > 3) {
    return v.slice(0, dotIdx + 4);
  }
  return v;
};

const interrors = {
  commodity: "",
  weight: "",
  clearence_type: "",
  incoterm: "",
  import_service_type: "",
};
const intarrcharges = {
  charge_id: "",

  weight: 0,
  rate: 0,
  per_kg: 2,
  inr_amount: 0,
  currency: "",
  enquiry_id: "",
  ex_rate: "",
  sac_code: "",
};
const intexchangedata = [
  {
    id: "1",
    currency_id: "24",
    currency: "INR",
    ex_rate: "1",
  },
  {
    id: "2",
    currency_id: "",
    currency: "",
    ex_rate: "",
  },
  {
    id: "3",
    currency_id: "",
    currency: "",
    ex_rate: "",
  },
];
const buildExchangeData = (charges: any[], currencyList: any[]) => {
  const result: any[] = [
    { id: "1", currency_id: "24", currency: "INR", ex_rate: "1" },
  ];
  const seen = new Set<string>(["24"]);
  for (const item of charges) {
    const currId = String(item.currency || "24");
    if (seen.has(currId) || result.length >= 3) continue;
    seen.add(currId);
    result.push({
      id: String(result.length + 1),
      currency_id: currId,
      currency:
        currencyList?.find((c: any) => String(c.id) === currId)?.currency || "",
      ex_rate: String(item.ex_rate || ""),
    });
  }
  while (result.length < 3) {
    result.push({
      id: String(result.length + 1),
      currency_id: "",
      currency: "",
      ex_rate: "",
    });
  }
  return result;
};
export const functioncheckfilledkeys = (arr?: any) => {
  const lastItem = arr[arr?.length - 1];
  delete lastItem["box_no"];
  const filledKeys = Object.entries(lastItem)
    .filter(([_, value]) => value?.toString().trim() !== "") // filter non-empty
    .map(([key]) => key);
  return filledKeys;
};
const initialemaildata = {
  send_to_email: 0,
  email_cc: [
    "rahul.bhaggal@skyways-group.com",
    "rajiv.hariramani@skyways-group.com",
    "himanshu.chhabra@skyways-group.com",
  ],
  to: "creditrequest@skart-express.com",
};
const intfairdata = {
  fair_id: "",
  fair_name: "",
  fair_venue: "",
  fair_start_date: "",
  fair_end_date: "",
};
const intcommoditydata = {
  commodity_id: "",
  commodity: "",
};
export const SpotpriceModal = (data: any) => {
  const [toggle, setToggle] = useState<any>(1);
  const {
    openmodal,
    setOpenModal,
    spotData,
    setSpotData,
    allfdata,
    handleCancel,
    getchweight,
    chargehead,
    setEmailModal,
    exposureData,
    forwhat,
    setForwhat,
    setExposureData,

    branchdata,
    hubData,
    enquiryModal,
    setEnquiryModal,
    pdcModal,
    setPdcModal,
    pdcData,
    setPdcData,
    pdcLen,
    singlefranchiseedata,
  } = data;
  const [dimensionData, setDimensionData] = useState(
    spotData?.shipment_dimensions || [
      {
        item_description: "",
        weight: "",
        value: "",
        quantity: "",
        length: "",
        breadth: "",
        height: "",
        hsn_code: "",
      },
    ],
  );
  const [modal2, setModal2] = useState<boolean>(false);
  const [valuetopass, setValuetopass] = useState<string>("");
  const [exchangedata, setExchangedata] = useState<any>(intexchangedata);
  const [arrcharges, setArrayCharges] = useState<any>([
    {
      ...intarrcharges,
      weight: spotData?.weight || 0,
    },
  ]);
  const [outstandingamount, setOutstandingamount] = useState<any>(0);
  const [acl, setAcl] = useState<any>(0);
  const [gstStatus, setGstStatus] = useState<any>(0);
  const [totalsell, setTotalSell] = useState<any>(0);
  const [totalsellinramount, setTotalsellinrAmount] = useState<any>({
    amount: 0,
    gst: 0,
    total_amount: 0,
  });
  const [loadingdatas, setLoadingdatas] = useState<boolean>(false);
  const [serviceTypedata, setServiceTypedata] = useState<any>([]);
  const [incotermType, setIncoterm] = useState([]);

  const [pricingdata, setPricingdata] = useState<any>([]);
  const [salespersondata, setSalesPersondata] = useState<any>([]);
  const [loading, setloading] = useState<boolean>(false);

  const [clearanceType, setClearanceType] = useState();
  const [commoditytype, setCommodityType] = useState<any>([]);
  const [currencydata, setCurrencydata] = useState<any>([]);
  const [fairlist, setFairlist] = useState<any>([]);

  const [cargoType, setCargoType] = useState([]);
  // const [singletabledata, setSingletabledata] = useState<any>(inttabledata);
  const { userdata } = useLogin();
  const [check, setCheck] = useState("");
  const [computedWeight, setComputedWeight] = useState("");
  const [products, setProducts] = useState<any>([]);
  const [weightData, setWeightData] = useState([]);
  const [unitdata, setUnitData] = useState<any>([]);
  const [buyingCharges, setBuyingCharges] = useState<any>([]);
  //  const [chargehead, setChargehead] = useState<Array<any>>([]);
  const [bccList, setBccList] = useState<any>([
    "rahul.bhaggal@skyways-group.com",
    "rajiv.hariramani@skyways-group.com",
    "himanshu.chhabra@skyways-group.com",
  ]);
  const [bccInput, setBccInput] = useState<string>("");
  const [shipmentTypes, setShipmentTypes] = useState();
  const [selectedFairdata, setSelectedFairdata] = useState<any>(intfairdata);
  const [selectedCommoditydata, setSelectedCommoditydata] =
    useState<any>(intcommoditydata);

  const { showAlert } = useAlert();
  const [getShipment, setgetShipment] = useState<Array<any>>([]);
  const [franchiseedata, setFranchiseedata] = useState<any>([]);
  const [errors, setErrors] = useState<any>({
    ...interrors,
    ...((spotData?.shipment_type == "4" || spotData?.shipment_type == "5") &&
    spotData?.import_booking == 2
      ? { import_booking_type: "" }
      : {}),
  });
  const [country, setCountry] = useState<Array<any>>([]);
  const [timelyPaymentConfirmed, setTimelyPaymentConfirmed] = useState<
    boolean | null
  >(null);
  const [calculatedExposure, setCalculatedExposure] = useState<number>(0);
  const [spinner, setSpinner] = useState<boolean>(false);
  const fairfun1 = (a?: any) => {
    //  setSelectedfranchisedata((pre:any)=>({}))
    setSpotData((pre: any) => ({
      ...pre,
      fair_id: a?.fair_id,
      fair_venue: [
        a?.fair_ground_name,
        a?.address_line_1,
        a?.address_line_2,
        a?.city,
        a?.state,
        a?.zipcode,
        country?.find((item: any) => item?.country_id == a?.country)
          ?.country_name,
      ]
        .filter(Boolean)
        .join(", "),
      fair_start_date: a?.fair_start_date || "",
      fair_end_date: a?.fair_end_date || "",
    }));
  };

  const fairfuntoempty = (a?: any) => {
    setSpotData((pre: any) => ({
      ...pre,
      fair_id: "",
      fair_venue: "",
      fair_start_date: "",
      fair_end_date: "",
    }));
  };

  const commodityfun1 = (a?: any) => {
    setSpotData((pre: any) => ({
      ...pre,
      commodity: a?.commodity_id,
    }));
    handleerrors("commodity");
  };

  const commodityfuntoempty = () => {
    setSpotData((pre: any) => ({
      ...pre,
      commodity: "",
    }));
  };
  const [emaildata, setEmaildata] = useState(initialemaildata);
  useEffect(() => {
    const updateWeights = async () => {
      const newdata = [...arrcharges];

      let chargeableWeight = spotData?.weight;
      if (checkrequiredvalues(dimensionData)) {
        chargeableWeight = await getchweight(
          dimensionData,
          spotData?.courier_id,
        );
        setComputedWeight(chargeableWeight.toFixed(3));
        setSpotData((pre: any) => ({
          ...pre,
          weight: Number(chargeableWeight.toFixed(3)),
        }));
      }

      const newdata2 = newdata.map((item: any) => ({
        ...item,
        weight: chargeableWeight,
        // ex_rate: singlefranchiseedata?.exchange_rate || 1,
        // currency: singlefranchiseedata?.currency || 24,
      }));

      setArrayCharges(newdata2);
    };

    updateWeights();
  }, [spotData?.weight, JSON.stringify(dimensionData), spotData?.courier_id]);
  function calculateAmounts(data: any[], type?: string) {
    let amount = 0;
    let gst = 0;

    if (type === "sell") {
      data.forEach((item: any) => {
        const inr = parseFloat(item.inr_amount || "0");
        amount += inr;

        const isSellingWithExemptCharge = item.charge_id == 162;
        const isGSTApplicable = !isSellingWithExemptCharge;

        if (isGSTApplicable) {
          const chargeInfo = chargehead?.find(
            (c: any) => c.ref_sell_id == item.charge_id,
          );
          const igstRate =
            parseFloat(chargeInfo?.tax_breakup?.igst || "18") / 100;
          gst +=
            inr *
            (gstStatus == 4 ||
            spotData?.import_booking == 3 ||
            singlefranchiseedata?.is_overseas
              ? 0
              : igstRate);
        }
      });
    } else {
      data.forEach((item: any) => {
        const inr = parseFloat(item.inr_amount || "0");
        amount += inr;

        const isBuyingWithExemptCharge = item.charge_id == 163;
        const isGSTApplicable = !isBuyingWithExemptCharge;

        if (isGSTApplicable) {
          const chargeInfo = chargehead?.find(
            (c: any) => c.charge_id == item.charge_id,
          );
          const igstRate =
            parseFloat(chargeInfo?.tax_breakup?.igst || "18") / 100;
          gst +=
            inr *
            (gstStatus == 4 || singlefranchiseedata?.is_overseas
              ? 0
              : igstRate);
        }
      });
    }

    const total_amount = amount + gst;

    return {
      amount: amount.toFixed(3),
      gst: gst.toFixed(3),
      total_amount: total_amount.toFixed(3),
    };
  }

  // handling sell amount on arr changes
  useEffect(() => {
    setTotalsellinrAmount(calculateAmounts(arrcharges, "sell"));
  }, [
    JSON.stringify(arrcharges),
    JSON.stringify(buyingCharges),
    gstStatus,
    spotData?.import_booking,
    singlefranchiseedata?.is_overseas,
  ]);

  // handling gst calculation here
  useEffect(() => {
    setTotalSell(calculateAmounts(arrcharges, "sell")?.total_amount);
    setSpotData((pre: any) => ({
      ...pre,
      sell: calculateAmounts(arrcharges, "sell")?.total_amount,
      buy: calculateAmounts(buyingCharges, "buy")?.total_amount,
    }));
  }, [
    JSON.stringify(arrcharges),
    JSON.stringify(buyingCharges),
    gstStatus,
    spotData?.import_booking,
    singlefranchiseedata?.is_overseas,
  ]);
  //  handling selling charges on weight change

  useEffect(() => {
    if (arrcharges?.length >= 1) {
      const newdata = [...arrcharges];

      const newdata2 = newdata?.map((item: any) => ({
        ...item,
        weight: spotData?.weight,
        // ex_rate: singlefranchiseedata?.exchange_rate || 1,
        inr_amount:
          item?.per_kg && item?.per_kg == 1
            ? Number(item?.weight) * Number(item?.rate)
            : item?.rate,
        // currency: singlefranchiseedata?.currency || 24,
      }));
      setArrayCharges(newdata2);
    }
  }, [spotData?.weight]);

  const findcountryrelateddata = (id: any, data: any) => {
    const singledata = data?.find((item: any) => item.country_id == id);

    return singledata;
  };
  //  getting all initial data
  const getunbilled = async () => {
    try {
      const getunbilledamountres = await commongetrequest(
        `booking/unbuild-report/${spotData?.franchisee_id}`,
      );
      if (getunbilledamountres?.status == 200) {
        setSpotData((pre: any) => ({
          ...pre,
          unbilled: getunbilledamountres?.data?.total_amount_inr || 0,
        }));
      } else {
        setSpotData((pre: any) => ({ ...pre, unbilled: 0 }));
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const getintdata = async () => {
    try {
      setLoadingdatas(true);

      // Run independent requests in parallel
      const [
        countrydata,
        getcargotype,
        getoutstanding,
        servicedata,
        unit,
        getclearncetype,
        getweightunit,
        getshipmenttype,
        incodata,
        commodity,
        commoditybyid,
        currency,
        prodcuts,
        fdata,
        getpricingdata,
        getsalespersondata,
        fairres,
      ] = await Promise.allSettled([
        commongetrequest("admin/country"),
        commongetrequest("booking/cargo-type"),
        commongetrequest(
          `admin/report/consolidated-report-without-cr?franchisee_id=${
            spotData?.franchisee_id || ""
          }`,
        ),
        commongetrequest("booking/service_type_list"),
        commongetrequest("booking/weight-unit"),
        commongetrequest("booking/clearence-type"),
        commongetrequest("booking/weight-unit"),
        commongetrequest("admin/booking-shipment-type"),
        commongetrequest("booking/incoterm"),
        commongetrequest("admin/commodity-type"),
        spotData?.commodity
          ? commongetrequest(`admin/commodity-type/${spotData?.commodity}`)
          : Promise.resolve({ status: 0 }),
        commongetrequest("booking/currency"),
        spotData?.shipment_type == 5 || spotData?.shipment_type == 8
          ? commongetrequest(
              `admin/cargo-courier-product?shipment_type=${
                spotData?.shipment_type
              }&hub_id=${
                spotData?.hub_id || spotData?.hub_id || 0
              }&country_id=${
                spotData?.dest_country_id == 97
                  ? spotData?.org_country_id
                  : spotData?.dest_country_id
              }&is_import=${spotData?.import_booking == 2 ? 1 : 0}`,
            )
          : commongetrequest("admin/courier-product"),
        commongetrequest(
          `admin/franchisee-settings?sales_id=${userdata?.mapped_id}`,
        ),
        commongetrequest("admin/pricing_person"),
        commongetrequest("admin/sales-person"),
        commongetrequest("admin/fair_exhibition/enquiry_dropdown"),
      ]);

      // 🚀 handle dependent APIs separately (must wait for booking_status check)
      if (
        spotData?.booking_status == 0 ||
        spotData?.booking_status == 3 ||
        spotData?.booking_status == 16 ||
        spotData?.booking_status == 1 ||
        spotData?.booking_status == 14 ||
        spotData?.booking_status == 7 ||
        spotData?.booking_status == 10
      ) {
        const [getsellingcharges] = await Promise.all([
          commongetrequest(`booking/get-enquiry-buy-sell/${spotData?.id}`),
        ]);

        if (getsellingcharges?.status == 200) {
          const data = getsellingcharges?.data?.data || [];

          if (data?.length >= 1) {
            const newdata = data
              ?.filter((item: any) => item?.charge_type === 2)
              .map((item: any) => ({
                ...item,
                // ex_rate: singlefranchiseedata?.exchange_rate || 1,
                // currency: singlefranchiseedata?.currency || 24,
                sac_code:
                  chargehead?.find(
                    (item2: any) => item2?.ref_sell_id == item?.charge_id,
                  )?.hsn_code || "",
                weight: item?.per_kg == 2 ? 1 : item?.weight,
              }));
            const buydata = data?.filter((item: any) => item?.charge_type == 1);

            setBuyingCharges(buydata);
            setArrayCharges(newdata);
            const currencyList =
              currency.status === "fulfilled"
                ? currency.value?.data?.data || []
                : [];
            setExchangedata(buildExchangeData(data, currencyList));
          } else {
            setArrayCharges([
              {
                ...intarrcharges,
                weight: spotData?.weight || 0,
                // ex_rate: singlefranchiseedata?.exchange_rate || 1,
                // currency: singlefranchiseedata?.currency || 24,
              },
            ]);
            setBuyingCharges([]);
          }
        }
      }

      if (
        spotData?.booking_status == 3 ||
        spotData?.booking_status == 14 ||
        spotData?.booking_status == 1 ||
        spotData?.booking_status == 10
      ) {
        const gettotalsell = await commongetrequest(
          `booking/get-enquiry-sell/${spotData?.id}`,
        );
        if (gettotalsell?.status == 200) {
          setTotalSell(gettotalsell?.data?.data);
          setSpotData((pre: any) => ({
            ...pre,
            credit_limit: gettotalsell?.data?.data,
          }));
        }
      }

      // ✅ Now safely process allSettled results
      if (
        getoutstanding.status === "fulfilled" &&
        getoutstanding.value?.status == 200
      ) {
        const data = getoutstanding.value?.data?.data[0];
        setOutstandingamount(data?.total_amount || 0);
        setSpotData((pre: any) => ({
          ...pre,
          outstanding:
            getoutstanding.value?.data?.data?.length >= 1
              ? data?.total_amount
              : 0,
        }));
      }

      if (
        getcargotype.status === "fulfilled" &&
        getcargotype.value?.status == 200
      ) {
        setCargoType(getcargotype.value?.data?.data);
      }
      if (
        getclearncetype.status === "fulfilled" &&
        getclearncetype.value?.status == 200
      ) {
        setClearanceType(getclearncetype.value?.data?.data || []);
      }
      if (
        getweightunit.status === "fulfilled" &&
        getweightunit.value?.status == 200
      ) {
        setWeightData(getweightunit.value?.data?.data || []);
      }
      if (
        getshipmenttype.status === "fulfilled" &&
        getshipmenttype.value?.status == 200
      ) {
        setShipmentTypes(getshipmenttype.value?.data?.data || []);
        setgetShipment(getshipmenttype.value?.data?.data);
      }
      if (
        servicedata.status === "fulfilled" &&
        servicedata.value?.status == 200
      ) {
        setServiceTypedata(servicedata.value?.data?.data || []);
      }
      if (incodata.status === "fulfilled" && incodata.value?.status == 200) {
        setIncoterm(incodata.value?.data?.data || []);
      }
      if (commodity.status === "fulfilled" && commodity.value?.status == 200) {
        setCommodityType(commodity.value?.data?.data || []);
      }
      if (
        commoditybyid.status === "fulfilled" &&
        commoditybyid.value?.status == 200
      ) {
        const raw = commoditybyid.value?.data?.data;
        const singledata = Array.isArray(raw) ? raw[0] : raw;
        if (singledata) {
          setSelectedCommoditydata({
            commodity_id: singledata?.commodity_id,
            commodity: singledata?.commodity,
          });
        }
      }
      if (currency.status === "fulfilled" && currency.value?.status == 200) {
        setCurrencydata(currency.value?.data?.data || []);
      }
      if (unit.status === "fulfilled" && unit.value?.status == 200) {
        setUnitData(unit.value?.data?.data || []);
      }
      if (prodcuts.status === "fulfilled" && prodcuts.value?.status == 200) {
        setProducts(prodcuts.value?.data?.data || []);
      }
      if (
        countrydata.status === "fulfilled" &&
        countrydata.value?.status == 200
      ) {
        setCountry(countrydata.value?.data?.data);
      }
      if (
        getpricingdata.status === "fulfilled" &&
        getpricingdata.value?.status == 200
      ) {
        setPricingdata(getpricingdata.value?.data?.data?.result || []);
      }
      if (fdata.status === "fulfilled" && fdata.value?.status == 200) {
        setFranchiseedata(fdata.value?.data?.data || []);
        const data = fdata.value?.data?.data || [];
        const singledata = data?.find(
          (item: any) => item?.franchisee_id == spotData?.franchisee_id,
        );
        if (singledata) {
          setAcl(singledata?.available_credit_limit_show || 0);
          setGstStatus(singledata?.gst_status || 0);
        }
      }
      if (
        getsalespersondata.status === "fulfilled" &&
        getsalespersondata.value?.status == 200
      ) {
        setSalesPersondata(getsalespersondata.value?.data?.data || []);
        const fieldsalesids = getpropersalespersons(
          getsalespersondata.value?.data?.data || [],
          userdata,
          "email",
        );
        setEmaildata((pre: any) => ({
          ...pre,
          email_cc: [...(emaildata?.email_cc || []), ...fieldsalesids],
        }));
        setBccList([...(bccList || []), ...fieldsalesids]);
      }
      if (fairres.status === "fulfilled" && fairres.value?.status == 200) {
        const data = fairres.value?.data?.data || [];

        setFairlist(data || "");
        if (spotData?.fair_id) {
          setSelectedFairdata((pre: any) => ({
            ...pre,
            fair_id: spotData?.fair_id,
            fair_name: data?.find(
              (item: any) => item?.fair_id == spotData?.fair_id,
            )?.fair_name,
          }));
        }
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setLoadingdatas(false);
    }
  };

  const getparticulardata = (forwhat: any, id?: any, data?: any) => {
    if (forwhat == "franchisee") {
      const singledata = data?.find((item: any) => item?.franchisee_id == id);
      return singledata;
    }
  };

  const getValues = (obj: any, str: any) => {
    if (!obj || typeof obj !== "object") return null;
    for (const [key, value] of Object.entries(obj)) {
      if (key.includes(str)) return value;
    }
    return null;
  };

  const handleerrors = (name: any) => {
    setErrors((pre: any) => ({ ...pre, [name]: "" }));
  };
  // getting totals
  const gettotal = (forwhat?: any, data?: any) => {
    if (forwhat == "charge") {
      const totalWeight = data?.reduce(
        (acc: any, item: any) => Number(acc) + Number(item.inr_amount),
        0,
      );
      return totalWeight;
    } else if (forwhat == "inr_amount") {
      const total = data.reduce(
        (total, item) => total + Number(item[forwhat] || 0),
        0,
      );
      return total;
    }
  };

  useEffect(() => {
    getintdata();
    getunbilled();
  }, []);

  useEffect(() => {
    if (exposureData && exposureData.length > 0) {
      const grandTotal = exposureData.reduce((acc: number, dataItem: any) => {
        const below30 = Number(getValues(dataItem || {}, "(0-30)") || 0);
        const between30_60 = Number(getValues(dataItem || {}, "(31-60)") || 0);
        const between60_90 = Number(getValues(dataItem || {}, "(61-90)") || 0);
        const above90 =
          Number(getValues(dataItem || {}, "(91-120)") || 0) +
          Number(getValues(dataItem || {}, "(>120)") || 0);
        return acc + below30 + between30_60 + between60_90 + above90;
      }, 0);
      setCalculatedExposure(grandTotal);
    } else {
      setCalculatedExposure(0);
    }
  }, [JSON.stringify(exposureData)]);

  const generateTableHTML = (shipmentDimensions: any[]) => {
    if (shipmentDimensions.length === 0) return "";

    const tableHeaders = Object.keys(shipmentDimensions[0]) // Extract column names
      .map(
        (key) => `<th style="border:1px solid #ddd; padding:8px;">${key}</th>`,
      )
      .join("");

    const tableRows = shipmentDimensions
      .map(
        (item) =>
          `<tr>${Object.values(item)
            .map(
              (value) =>
                `<td style="border:1px solid #ddd; padding:8px;">${value}</td>`,
            )
            .join("")}</tr>`,
      )
      .join("");

    return `
    <table style="border-collapse:collapse; width:100%; font-family:Arial, sans-serif;">
      <thead>
        <tr style="background-color:#f2f2f2;">${tableHeaders}</tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;
  };

  const handlesendemailtoCC = async (value: any) => {
    const franchiseeName =
      allfdata?.find(
        (element: any) => element.franchisee_id == spotData.franchisee_id,
      )?.franchisee_name || "";
    const branchName =
      branchdata?.find((item: any) => item?.branch_id == spotData?.branch_id)
        ?.branch_name || "";

    const emailbody = emailbodyfun(
      hubData,
      branchName,
      spotData,
      exposureData,
      salespersondata,
      userdata,
      value,
    );

    try {
      setloading(true);
      const res = await commonpostrequest(`booking/send-credit-template`, {
        emailMessage: `<p>Dear Sir,</p>
    
    <p>
      I would like to request your approval for assigning a credit limit of <strong>Rs. ${
        indianFormat(Number(value) || 0)
        // creditBalData?.credit_limit
      }</strong> to 
      <strong>${
        franchiseeName || ""
      }</strong>. To support this request, I have attached the customer's current 
      outstanding details and agreed payment terms for your reference.
    </p>
    
    <p>
      Please review the attached documents and let me know if you require any additional information.
    </p>
    
    <p>
      Looking forward to your approval.
    </p>
    
     <p>
    Request Send By : <strong> ${userdata?.display_name}</strong>
    </p>`,
        from: userdata?.email || userdata?.email_id || "",
        toMail: [emaildata?.to],
        ccMail: [...emaildata?.email_cc, userdata?.email],
        emailSubject: `Request for Credit Limit Approval – ${
          allfdata?.find(
            (element: any) => element.franchisee_id == spotData.franchisee_id,
          )?.franchisee_name || ""
        }`,
        creditTemplate: emailbody,
        job_no: spotData?.booking_no,
        // attachments,
      });
      if (res?.status == 200) {
        // showAlert(
        //   res?.data?.message || res?.data?.msg || "Email Send Successfully"
        // );
        showAlert("Action Performed Successfully");
        handleCancel(3);
        handleCancel(4);
        setValuetopass("");
        setModal2(false);
      } else if (res?.response?.status == 400) {
        showAlert(
          res?.response?.data?.msg ||
            res?.response?.data?.message ||
            "Something going wrong!..please try after some time",
        );
      } else {
        showAlert(
          res?.response?.data?.message ||
            "Something going wrong!..please try after some time",
          "error",
        );
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setloading(false);
    }
  };
  const SpotBooking = async (forwhat?: any) => {
    let errors2: any = {};
    const newdata: any = { ...spotData };
    const excludedKeys = [
      "cgst_amount",

      "pp_cc",

      "party",
      "cgst_amount",
      "sgst_amount",
      "igst_amount",
      "party_type",
      "remarks",
      "is_duty",
    ]; // Replace with the keys you want to exclude

    const gettotal = (forwhat?: any, data?: any, key?: any) => {
      if (forwhat == "q" || forwhat == "g") {
        const total = data.reduce(
          (total: any, item: any) => total + Number(item[key] || 0),
          0,
        );
        return total;
      }
      if (forwhat == "v") {
        const total = data.reduce((acc: any, item: any) => {
          return (
            acc +
            (Number(item?.height) *
              Number(item?.breadth) *
              Number(item?.length) *
              Number(item?.quantity)) /
              5000
          );
        }, 0);
        return total || 0;
      }
    };
    const isAllFilled = arrcharges.every((item: any) =>
      Object.entries(item)
        .filter(([key]) => !excludedKeys.includes(key)) // Exclude specific keys
        .every(
          ([_, value]) =>
            value !== "" && value !== null && value !== undefined && value != 0,
        ),
    );
    if (
      !newdata?.shipment_dimensions ||
      newdata?.shipment_dimensions?.length == 0
    ) {
      delete newdata["shipment_dimensions"];
    }
    if (!newdata?.remarks) {
      delete newdata["remarks"];
    }
    if (spotData?.import_booking == 1 || spotData?.import_booking == 3) {
      delete spotData["import_booking_type"];
      delete spotData["import_service_type"];
      delete errors["import_service_type"];
    }

    Object.keys(errors).forEach((key) => {
      if (!newdata[key]) {
        errors2[key] = `${key} is required`;
      }
    });
    delete errors2["cargo_type"];
    delete newdata["cargo_type"];
    setErrors(errors2);
    const check = Object.values(errors2).every(
      (value) => value === "" || value === null || value === undefined,
    );

    if (checkallfiled(["box_no"], dimensionData)) {
      newdata.shipment_dimensions = dimensionData;
    } else {
      delete newdata["shipment_dimensions"];
    }
    if (!newdata["remarks"]) {
      delete newdata["remarks"];
    }

    if (
      newdata?.booking_status != 1 &&
      newdata?.booking_status != 10 &&
      newdata?.booking_status != 13 &&
      newdata?.booking_status != 14
    ) {
      delete newdata["credit_limit"];
      delete newdata["credit_days"];
    }

    if (newdata?.shipment_type != "4" && newdata?.shipment_type != "5") {
      delete newdata["import_booking_type"];
    }
    if (!check) {
      for (let key in errors2) {
        if (errors2[key]) {
          showAlert(`${key} is Required`, "warning");
          setModal2(false);
          return;
          return;
        }
      }

      //  errors2?.map((item:any)=>)
      //       showAlert("Please fill all the required fields", "warning");
    }

    if (!spotData?.courier_id) {
      showAlert("Vendor Name is required", "warning");
      return;
    }

    if (!spotData?.courier_id) {
      showAlert("Vendor Name is required", "warning");
      return;
    }

    const { destination_country_id } = spotData;

    const pricingemails = pricingdata
      .filter((item: any) =>
        item?.country_id.includes(Number(destination_country_id)),
      )
      .flatMap((item: any) => item?.email);

    const pricingemailswithname = pricingdata
      .filter((item: any) =>
        item?.country_id.includes(Number(destination_country_id)),
      )
      .flatMap((item: any) => `${item?.pricing_person} ${item?.email}`);
    const isemails = salespersondata.find(
      (item: any) => item?.id == userdata?.mapped_id,
    );
    let emailBody: any;
    // if(dimensionData?.length>=1){
    emailBody = `
     ${
       dimensionData?.length == 1 && !checkallfiled(["box_no"], dimensionData)
         ? `<p>CHARGEABLE WEIGHT: ${spotData?.weight || 0} </p>`
         : ""
     }
  ${
    dimensionData?.length >= 1 && checkallfiled(["box_no"], dimensionData)
      ? `<p>NO OF PCS: ${gettotal("q", dimensionData, "quantity") || 0}
</p>`
      : ""
  }
 ${
   dimensionData?.length >= 1 && checkallfiled(["box_no"], dimensionData)
     ? `<p>GR WGT: ${gettotal("g", dimensionData, "quantity") || 0}
</p>`
     : ""
 }
  ${
    dimensionData?.length >= 1 && checkallfiled(["box_no"], dimensionData)
      ? `<p>VOL WGT: ${gettotal("v", dimensionData) || 0}
</p>`
      : ""
  }
 <p>COMMODITY: ${
   commoditytype?.find((item: any) => item?.commodity_id == spotData?.commodity)
     ?.commodity || ""
 }
</p>
</p>
 <p>ADDRESS: ${`${spotData?.dest_city && spotData?.dest_city} ${
   spotData?.dest_city && `,${spotData?.dest_city}`
 } ${spotData?.dest_zip && `,${spotData?.dest_zip}`} ${
   spotData?.destination_country && `,${spotData?.destination_country}`
 } `}
   <p>ZIP CODE: ${spotData?.dest_zip}
</p>
  ${
    dimensionData?.length >= 1 && checkallfiled(["box_no"], dimensionData)
      ? `<p>DIMENSIONS:</p>
  ${generateTableHTML(dimensionData)}`
      : ""
  }
  <p>Thank you!</p>
`;
    // }

    if (
      forwhat == "pricing" &&
      (!arrcharges[arrcharges?.length - 1]?.charge_id ||
        !arrcharges[arrcharges?.length - 1]?.inr_amount ||
        !arrcharges[arrcharges?.length - 1]?.currency ||
        !arrcharges[arrcharges?.length - 1]?.ex_rate)
    ) {
      showAlert(
        "Please provide Charges Correctly Or Remove Empty Entries ",
        "warning",
      );
      return;
    }
    if (
      forwhat == "save" &&
      arrcharges[arrcharges?.length - 1]?.charge_id &&
      !isAllFilled
    ) {
      showAlert(
        "Please provide Charges Correctly Or Remove Empty Entries ",
        "warning",
      );
      return;
    }

    // Currency & ex_rate mandatory check — selling
    const sellMissingCurrency = arrcharges?.some(
      (item: any) => item?.charge_id && !item?.currency,
    );
    if (sellMissingCurrency) {
      showAlert("Please select currency for all selling charges", "warning");
      return;
    }
    const sellMissingExRate = arrcharges?.some(
      (item: any) =>
        item?.charge_id && (!item?.ex_rate || Number(item?.ex_rate) <= 0),
    );
    if (sellMissingExRate) {
      showAlert(
        "Please provide exchange rate for all selling charges",
        "warning",
      );
      return;
    }

    // Currency & ex_rate mandatory check — buying
    const buyMissingCurrency = buyingCharges?.some(
      (item: any) => item?.charge_id && !item?.currency,
    );
    if (buyMissingCurrency) {
      showAlert("Please select currency for all buying charges", "warning");
      return;
    }
    const buyMissingExRate = buyingCharges?.some(
      (item: any) =>
        item?.charge_id && (!item?.ex_rate || Number(item?.ex_rate) <= 0),
    );
    if (buyMissingExRate) {
      showAlert(
        "Please provide exchange rate for all buying charges",
        "warning",
      );
      return;
    }

    try {
      setCheck(forwhat);
      setloading(true);
      const response =
        forwhat == "save"
          ? await commonputrequest(`booking/raise_spot_enquiry`, {
              ...newdata,
              sell_charges: arrcharges,
              booking_status: 16,
            })
          : forwhat == "pricing"
            ? await commonputrequest(`booking/raise_spot_enquiry`, {
                ...newdata,
                sell_charges: arrcharges,
                booking_status: 7,
              })
            : // : forwhat == "ready"
              // ? await commonpostrequest("booking/update_spot_data", {
              //     booking_id: spotData?.id,
              //     booking_status: 4,
              //   })
              forwhat == "credit"
              ? await commonputrequest(`booking/raise_spot_enquiry`, {
                  ...newdata,
                  booking_status: 8,
                  timely_payment_confirmed: timelyPaymentConfirmed ? 1 : 0,
                })
              : forwhat == "customer"
                ? await commonputrequest(`booking/raise_spot_enquiry`, {
                    ...newdata,
                    booking_status: 1,
                  })
                : forwhat == "email"
                  ? await commonpostrequest(`admin/send-alert`, {
                      alert_type: "AL0",
                      // from: fromMail,
                      to: pricingemails,
                      cc: [isemails?.email || ""],
                      subject: `${spotData?.booking_no} // ${spotData?.franchisee_name} `,
                      message: emailBody,
                      // attachments,
                    })
                  : "";

      if (response?.status == 200) {
        if (forwhat != "email" && forwhat != "credit") {
          handleCancel(1);
          showAlert(response?.data?.message || "Action Performed Successfully");
          setValuetopass("");
          setModal2(false);
        }
        if (forwhat == "email") {
          showAlert(`Email sent to ${pricingemailswithname.join(", ")}`);
          setValuetopass("");
          setModal2(false);
        }
        // if(forwhat=="email"){

        // }
        if (forwhat == "credit") {
          handleCancel(3);
          handleCancel(4);
          // await handlesendemailtoCC(crlimit);
        }
        if (forwhat == "customer") {
          handleCancel(3);
          setValuetopass("");
          setModal2(false);
        }
        if (forwhat == "pricing" || forwhat == "save") {
          handleCancel(1);
          setValuetopass("");
          setModal2(false);
        }

        // navigate("/sales/sales_operations/spot_price_list");
      } else if (response?.response?.status == 400) {
        showAlert(
          response?.response?.data?.message ||
            "Something going wrong please try after some time",
          "error",
        );
      } else if (response?.response?.status == 406) {
        showAlert(
          response?.response?.data?.errors[0]?.msg ||
            "Something going wrong!..please try after some time",
          "warning",
        );
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setloading(false);
      setCheck("");
    }
  };

  const releaseShipment = async () => {
    try {
      setSpinner(true);
      const res = await commonputrequest(`booking/release-hub`, {
        enquiry_id: spotData?.id,
        remark: "Released",
      });
      if (res?.status == 200) {
        handleCancel(4);
        setOpenModal(false);
        showAlert(res?.data?.message);
      } else if (res?.response?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "warning");
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error",
        );
      }
    } catch (error) {
      console.log(error);
      showAlert(error?.message, "error");
    } finally {
      setSpinner(false);
    }
  };

  const ModalFooter2 = (
    <div>
      {!loadingdatas && (
        <p className={`text-red-400 mt-8 ${styles["animate-blink"]} mb-2 mr-7`}>
          {" "}
          {arrcharges?.map((item: any) => item?.charge_id)?.includes(162)
            ? "GST is not applicable on Duty Charges."
            : ""}
        </p>
      )}

      {!loadingdatas &&
      (spotData?.booking_status == 0 ||
        spotData?.booking_status == 16 ||
        spotData?.booking_status == 7 ||
        spotData?.booking_status == 1 ||
        spotData?.booking_status == 14 ||
        spotData?.booking_status == 10) ? (
        <div className="flex justify-end items-end mb-5 ">
          <div
            className={`text-right justify-end grid lg:grid-cols-${singlefranchiseedata?.is_overseas ? "3" : 3} gap-2`}
          >
            <div className="text-left ">
              <FormLabel>Sub-Total :</FormLabel>
              <FormInput
                disabled
                className="text-right"
                value={
                  toggle == 2
                    ? 0
                    : `₹${formatIndianNumber(totalsellinramount?.amount) || 0}`
                }
              />
            </div>
            <div className="text-left">
              <FormLabel>
                <span className="text-red-400">*</span>GST{" "}
                {gstStatus == 4 ||
                spotData?.import_booking == 3 ||
                singlefranchiseedata?.is_overseas
                  ? "(0%)"
                  : ""}{" "}
                :{" "}
              </FormLabel>
              <FormInput
                disabled
                className="text-right"
                value={
                  toggle == 2
                    ? `₹${formatIndianNumber(Number(0) * (gstStatus == 4 || spotData?.import_booking == 3 ? 0 : 0.18))}`
                    : `₹${
                        formatIndianNumber(Number(totalsellinramount?.gst)) || 0
                      }`
                }
              />
            </div>
            <div className="text-left">
              <FormLabel>Total Amt (INR): </FormLabel>
              <FormInput
                disabled
                className="text-right"
                value={
                  toggle == 2
                    ? `₹${formatIndianNumber(Number(0) + Number(0) * (gstStatus == 4 || spotData?.import_booking == 3 ? 0 : 0.18))}`
                    : `₹${
                        formatIndianNumber(
                          Number(totalsellinramount?.total_amount),
                        ) || 0
                      }`
                }
              />
            </div>

            {singlefranchiseedata?.currency &&
            singlefranchiseedata?.currency != 24 &&
            singlefranchiseedata?.is_overseas &&
            toggle == 1 ? (
              <div className="text-left">
                <FormLabel>
                  Total Amt (
                  {currencydata?.find(
                    (item: any) => item?.id == singlefranchiseedata?.currency,
                  )?.currency || ""}
                  ):{" "}
                </FormLabel>
                <FormInput
                  disabled
                  className="text-right"
                  value={`${
                    currencydata?.find(
                      (item: any) => item?.id == singlefranchiseedata?.currency,
                    )?.symbol || ""
                  }${
                    formatIndianNumber(
                      Number(totalsellinramount?.total_amount) /
                        Number(singlefranchiseedata?.exchange_rate || 1),
                    ) || 0
                  }`}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="flex-wrap lg:flex-nowrap flex gap-2 mb-3 justify-end">
        <Button
          type="button"
          onClick={() => {
            handleCancel();
          }}
          className=" text-white  bg-red-500 px-3 py-2 border-none"
        >
          Cancel
        </Button>

        {/* {(spotData?.booking_status == 1 ||
                        spotData?.booking_status == 14 ||
                        spotData?.booking_status == 10) && <Button
          type="button"
          onClick={() => {
             setPdcModal(true)
             setEnquiryModal(false)
             setPdcData({
              attachment: null,  // for files use null
              id: "",
              date_of_pdc: "",
              pdc_amount: "",
              cheque_no: "",
              bank: "",
              is_deposit: 0
             })
             setErrors([])
          }}
          className="w-20 text-white mr-1  bg-mustard p-2"
        >
          PDC
        </Button>} */}

        {spotData?.booking_status == 1 ||
        spotData?.booking_status == 14 ||
        spotData?.booking_status == 10 ? (
          <div className="mr-2">
            {" "}
            <Button
              className={`
                     px-3 py-2 border-none bg-mustard text-white`}
              disabled={loading || loadingdatas}
              onClick={() => {
                if (Number(spotData?.credit_limit)) {
                  setEmailModal(true);
                  setForwhat("Template");
                  // setOpenModal(false);
                  // } else {
                } else {
                  showAlert(
                    "Please provide Requested Credit Amount",
                    "warning",
                  );
                }
              }}
            >
              <Download className="w-[15px] mr-2" />
              Template
            </Button>
          </div>
        ) : (
          ""
        )}
        {spotData?.booking_status == 0 ||
        spotData?.booking_status == 7 ||
        spotData?.booking_status == 16 ? (
          <Button
            className="px-3 py-2 border-none bg-success text-white "
            disabled={loading || loadingdatas}
            onClick={() => {
              const lastItem = dimensionData[dimensionData?.length - 1];
              delete lastItem["box_no"];
              const filledKeys = Object.entries(lastItem)
                .filter(([_, value]) => value?.toString().trim() !== "") // filter non-empty
                .map(([key]) => key);
              if (
                (dimensionData[dimensionData?.length - 1]?.item_description &&
                  !checkallfiled(["box_no"], dimensionData)) ||
                (dimensionData?.length > 1 &&
                  !checkallfiled(["box_no"], dimensionData)) ||
                (filledKeys?.length >= 1 &&
                  filledKeys?.length < Object.keys(lastItem)?.length)
              ) {
                showAlert(
                  "Please provide dimensions or remove empty entries",
                  "warning",
                );
                return;
              }
              setValuetopass("save");
              setModal2(true);
              // SpotBooking("save");
            }}
          >
            Save
            {/* {loading && check == "save" ? (
              <LoadingButtonCommon text="Saving" />
            ) : (
              "Save"
            )} */}
          </Button>
        ) : (
          ""
        )}
        {spotData?.booking_status == 0 ||
        spotData?.booking_status == 7 ||
        spotData?.booking_status == 16 ? (
          <Button
            className="px-3 py-2 border-none bg-mustard text-white "
            disabled={loading || loadingdatas}
            onClick={() => {
              const lastItem = dimensionData[dimensionData?.length - 1];
              delete lastItem["box_no"];
              const filledKeys = Object.entries(lastItem)
                .filter(([_, value]) => value?.toString().trim() !== "") // filter non-empty
                .map(([key]) => key);
              if (
                (dimensionData[dimensionData?.length - 1]?.item_description &&
                  !checkallfiled(["box_no"], dimensionData)) ||
                (dimensionData?.length > 1 &&
                  !checkallfiled(["box_no"], dimensionData)) ||
                (filledKeys?.length >= 1 &&
                  filledKeys?.length < Object.keys(lastItem)?.length)
              ) {
                showAlert(
                  "Please provide dimensions or remove empty entries",
                  "warning",
                );
                return;
              }
              setValuetopass("email");
              setModal2(true);
              // SpotBooking("email");
            }}
          >
            Send Email
            {/* {loading && check == "email" ? (
              <LoadingButtonCommon text="Sending" />
            ) : (
              "Send Email"
            )} */}
          </Button>
        ) : (
          ""
        )}
        {spotData?.booking_status == 0 ||
        spotData?.booking_status == 7 ||
        spotData?.booking_status == 16 ? (
          <Button
            className="px-3 py-2 border-none bg-mustard text-white "
            disabled={loading || loadingdatas}
            onClick={() => {
              const lastItem = dimensionData[dimensionData?.length - 1];
              delete lastItem["box_no"];
              const filledKeys = Object.entries(lastItem)
                .filter(([_, value]) => value?.toString().trim() !== "") // filter non-empty
                .map(([key]) => key);
              if (
                (dimensionData[dimensionData?.length - 1]?.item_description &&
                  !checkallfiled(["box_no"], dimensionData)) ||
                (dimensionData?.length > 1 &&
                  !checkallfiled(["box_no"], dimensionData)) ||
                (filledKeys?.length >= 1 &&
                  filledKeys?.length < Object.keys(lastItem)?.length)
              ) {
                showAlert(
                  "Please provide dimensions or remove empty entries",
                  "warning",
                );
                return;
              }
              setModal2(true);
              setValuetopass("pricing");
            }}
          >
            Send To Pricing
            {/* {loading && check == "pricing" ? (
              <LoadingButtonCommon text="Sending" />
            ) : (
              "Send To Pricing"
            )} */}
          </Button>
        ) : (
          ""
        )}

        {(spotData?.booking_status == 1 ||
          spotData?.booking_status == 14 ||
          spotData?.booking_status == 10) && (
          // <Tippy content="Or Send Template To CC ">
          <Button
            className="px-3 py-2 border-none bg-green-400 text-white "
            disabled={loading || loadingdatas}
            onClick={() => {
              if (
                Number(spotData?.credit_limit) &&
                Number(spotData?.margin) &&
                Number(spotData?.weight)
                //  &&
                // emaildata?.to
              ) {
                // setValuetopass("credit");
                // setModal2(true);
                SpotBooking("credit");
              } else {
                if (!spotData?.weight) {
                  showAlert("Please provide Chargable Weight", "warning");
                } else if (!Number(spotData?.credit_limit)) {
                  showAlert(
                    "Please provide Requested Credit Amount",
                    "warning",
                  );
                } else if (!spotData?.margin) {
                  showAlert("Please provide Margin", "warning");
                } else if (!emaildata?.to) {
                  showAlert("Please provide Email", "warning");
                }
              }
            }}
          >
            {loading && check == "credit" ? (
              <LoadingButtonCommon text="Processing" />
            ) : (
              "Request For Credit Limit"
            )}
            {/* Request For Credit Limit */}
          </Button>
          // </Tippy>
        )}

        {spotData?.booking_status == 14 && (
          <Button
            className="px-3 py-2 border-none bg-blue-500 text-white "
            disabled={loading || loadingdatas || spinner}
            onClick={releaseShipment}
          >
            {spinner ? (
              <LoadingButtonCommon text="Processing" />
            ) : (
              "Release Shipment"
            )}
          </Button>
        )}

        {spotData?.booking_status == 3 && (
          <Button
            className="px-3 py-2 border-none bg-green-400 text-white "
            disabled={loading || loadingdatas}
            onClick={() => {
              // SpotBooking("customer");
              setModal2(true);
              setValuetopass("customer");
            }}
          >
            Customer Approval
            {/* {loading && check == "customer" ? (
              <LoadingButtonCommon text="Processing" />
            ) : (
              "Customer Approval"
            )} */}
          </Button>
        )}
      </div>
    </div>
  );

  // Modal title
  const ModalTitle2 = (
    <div className="lg:flex md:flex sm:flex justify-between w-full relative ">
      <div>
        <div className="flex w-full ">
          <figure className="w-[35px] flex items-center justify-center">
            <FileText className="w-[35px]  text-[#fff] " />
          </figure>
          <aside className="md:border-l md:border-[#eeba51] md:pl-2 w-[80%] leading-[18px]">
            <p className="text-[12px] uppercase text-[#fff] w-full">
              ENQUIRY No.
            </p>
            <h4 className="font-medium text-[14px] text-[#fff] w-full flex justify-between items-center">
              <span className="capitalize font-bold cursor-pointer text-[#fff]">
                {" "}
                {spotData?.booking_no}{" "}
              </span>
            </h4>
          </aside>
        </div>
      </div>

      {/* {spotData?.booking_status == 3 ||
      spotData?.booking_status == 14 ||
      spotData?.booking_status == 1 ? ( */}

      <div className="bOfficeClose absolute top-[50%] right-2 -translate-y-[50%]">
        <FaCircleXmark
          className="stroke-1.5 w-5 h-5 cursor-pointer text-red-500  hover:text-red-700 "
          onClick={handleCancel}
        />
      </div>
    </div>
  );
  const handleBccChipDelete = async (index: number) => {
    const updatedList = [...bccList];
    updatedList.splice(index, 1);
    setBccList(updatedList);

    setEmaildata((pre: any) => ({ ...pre, email_cc: updatedList }));
  };
  const handleBccInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBccInput(event.target.value);
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

  // console.log("functod",pdcData)
  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  // Modal description
  const ModalDescription2 = (
    <>
      <div className="col-span-12  ">
        {spotData?.booking_status == 3 ||
        spotData?.booking_status == 14 ||
        spotData?.booking_status == 10 ||
        spotData?.booking_status == 1 ? (
          <>
            {/* 

            <div className="bg-gray-200 rounded p-2">
              <span className="font-bold">AVAILABLE CREDIT LIMIT:{""}</span>
              <span>₹{formatIndianNumber(Number(acl))}</span>
            </div>

            <div className="bg-gray-200 rounded p-2">
              <span className="font-bold">OUTSTANDING AMOUNT:{""}</span>
              <span>₹{formatIndianNumber(Number(outstandingamount))}</span>
            </div>

            <div className="bg-gray-200 rounded p-2">
              <span className="font-bold">TOTAL SELL :{""}</span>
              <span>₹{formatIndianNumber(Number(totalsell))}</span>
            </div>
 */}

            <div className=" grid grid-cols-12 gap-2  w-full">
              <div className="col-span-12 lg:col-span-3  mb-1 lg:mb-3">
                <div className="bg-[#f2f7ff] rounded-lg p-[7px] flex w-full ">
                  <figure className="w-[35px] flex items-center justify-center">
                    <Wallet className="w-[35px]  text-[#3b7dd8] " />
                  </figure>
                  <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
                    <p className="text-[12px] uppercase text-[#757575] w-full">
                      AVAILABLE CREDIT LIMIT
                    </p>
                    <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                      <span className="capitalize font-bold cursor-pointer">
                        ₹{formatIndianNumber(Number(acl))}
                      </span>
                    </h4>
                  </aside>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-3  mb-1 lg:mb-3">
                <div className="bg-[#eafffa] rounded-lg p-[7px] flex  w-full">
                  <figure className="w-[35px] flex items-center justify-center">
                    <Database className="w-[30px]  text-[#18a080]  " />
                  </figure>
                  <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
                    <p className="text-[12px] uppercase text-[#757575] w-full">
                      OUTSTANDING AMOUNT
                    </p>
                    <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                      <span className="capitalize font-bold cursor-pointer">
                        ₹{formatIndianNumber(Number(outstandingamount))}
                      </span>
                    </h4>
                  </aside>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-3  mb-1 lg:mb-3">
                <div className="bg-[#faf5ff] rounded-lg p-[7px] flex  w-full">
                  <figure className="w-[35px] flex items-center justify-center">
                    <Wallet className="w-[30px]  text-[#9c51e7] " />
                  </figure>
                  <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
                    <p className="text-[12px] uppercase text-[#757575] w-full">
                      TOTAL SELL
                    </p>
                    <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                      <span className="capitalize font-bold cursor-pointer">
                        ₹{formatIndianNumber(Number(totalsell))}
                      </span>
                    </h4>
                  </aside>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        {/* 
         <div className="col-span-12 lg:col-span-3  ">  
<div className="bg-[#fff3dc] rounded-lg p-[7px] flex w-full ">
  <figure className="w-[35px] flex items-center justify-center">
    <FileText className="w-[35px]  text-[#ba9650] " />
  </figure>
  <aside className="md:border-l md:border-[#fbe9c7] md:pl-2 w-[80%] leading-[18px]">
    <p className="text-[12px] uppercase text-[#757575] w-full">ENQUIRY No.</p>
    <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
      <span className="capitalize font-bold cursor-pointer"> {spotData?.booking_no} </span>
    </h4>
  </aside>
</div>
</div> */}
      </div>
      <div className=" w-full">
        <div className=" mb-2 col-span-12  ">
          {!loadingdatas ? (
            <div className="bg-[linear-gradient(to_right,#fff9ed_0%,#f7fff6_100%)] col-span-12 border border-[#ffecca]  px-4 py-2  intro-x font-medium cursor-pointer text-sm flex flex-row justify-between gap-4 rounded-lg h-auto">
              <div>
                <div>
                  <span className="mt-2 text-lg font-bold">ORIGIN </span>
                </div>

                <div className="flex gap-2 ">
                  <div className="text-center p-1 border border-[#ffe7b2] h-auto  sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center bg-[#fff2d7]">
                    <img
                      src={`https://flagsapi.com/${
                        spotData?.origin_country_code
                          ? spotData?.origin_country_code
                          : "IN"
                      }/flat/32.png`}
                      alt="origin-flag"
                    />
                    <span className="text-sm block sm:hidden">
                      {" "}
                      {spotData?.org_zip || "0000"}
                    </span>
                    <span className="text-sm">
                      (
                      {`${
                        spotData?.origin_country_code
                          ? spotData?.origin_country_code
                          : "IN"
                      }`}
                      )
                    </span>
                  </div>
                  <div className=" p-1 pt-2 h-14 min-w-28 border border-[#ffe7b2] bg-[#fff2d7] rounded hidden sm:flex flex-col  justify-center">
                    <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {
                        findcountryrelateddata(
                          spotData?.org_country_id,
                          country,
                        )?.country_name
                      }
                    </h1>
                    <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      ( {spotData?.org_zip})
                    </p>
                  </div>
                </div>
              </div>

              <div className=" mt-11 flex ">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-25 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-50 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-75 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
                  className="w-5 h-5"
                  alt="plane-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-75 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-50 hidden lg:block"
                  alt="dot-icon"
                />
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7500/7500224.png"
                  className="w-5 h-5 opacity-25 hidden lg:block"
                  alt="dot-icon"
                />
              </div>

              {/* <div className="flex sm:hidden justify-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/61/61212.png"
                  className="w-6 h-6 md:hidden block"
                  alt="plane-icon"
                />
              </div> */}

              <div>
                <div>
                  <span className="mt-2 text-lg font-bold">DESTINATION</span>
                </div>

                <div className="flex gap-2 ">
                  <div className="text-center p-1 border border-[#a4df9f] h-auto mx-6 sm:mx-0 sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center bg-[#dfffdc]">
                    <img
                      src={`https://flagsapi.com/${
                        spotData?.destination_country_code
                          ? spotData?.destination_country_code
                          : "IN"
                      }/flat/32.png`}
                      alt="destination-flag"
                    />
                    <span className="text-sm block sm:hidden">
                      {spotData?.dest_zip == "0000"
                        ? spotData?.dest_city
                        : spotData?.dest_zip || "0000"}
                    </span>
                    <span className="text-sm">
                      ({spotData?.destination_country_code})
                    </span>
                  </div>
                  <div className=" p-1 pt-2 min-w-28 h-14 border border-[#a4df9f]  bg-[#dfffdc] rounded hidden sm:flex flex-col  justify-center text-wrap">
                    <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {spotData?.destination_country}
                    </h1>
                    <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      (
                      {spotData?.dest_zip == "0000"
                        ? spotData?.dest_city
                        : spotData?.dest_zip || "0000"}
                      )
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div
        className={`col-span-12 ${
          spotData?.booking_status == 3 ||
          spotData?.booking_status == 1 ||
          spotData?.booking_status == 14 ||
          spotData?.booking_status == 10
            ? "h-[30vh]"
            : "h-[30vh]"
        }
         overflow-auto `}
      >
        {loadingdatas ? (
          <IsLoading h={"h-[30vh]"} />
        ) : (
          <>
            <div className="box">
              <div className="space-y-4 px-2 py-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                  <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                    <div>
                      <FormLabel className="text-base text-slate-500">
                        FRANCHISEE <span className="text-red-400">*</span>
                      </FormLabel>
                    </div>
                    <FormInput
                      value={
                        getparticulardata(
                          "franchisee",
                          spotData?.franchisee_id,
                          allfdata,
                        )?.franchisee_name || ""
                      }
                      disabled
                    />
                  </div>
                  <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                    <FormLabel
                      htmlFor="origin-country"
                      className="text-base text-slate-500"
                    >
                      SHIPMENT TYPE <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormSelect
                      id="default"
                      value={spotData.shipment_type}
                      disabled
                      onChange={(e) => {
                        setSpotData((prev) => ({
                          ...prev,
                          shipment_type: e.target.value,
                        }));
                      }}
                    >
                      <option value="">Select Shipment Type</option>
                      {getShipment
                        ?.filter((item) =>
                          spotData?.import_booking == 2
                            ? item?.booking_shipment_type_id != 6 &&
                              item?.booking_shipment_type_id != 7
                            : item,
                        )
                        ?.map(
                          (type) =>
                            type?.booking_shipment_type_id !== 2 &&
                            type?.is_active == 1 && (
                              <option
                                key={type?.booking_shipment_type_id}
                                value={type?.booking_shipment_type_id}
                              >
                                {type?.shipment_type}
                              </option>
                            ),
                        )}
                    </FormSelect>
                  </div>
                  <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                    <FormLabel
                      htmlFor="origin-country"
                      className="text-base text-slate-500"
                    >
                      CHARGEABLE WEIGHT <span className="text-red-400">*</span>
                    </FormLabel>

                    <div className="flex items-center gap-2">
                      <FormInput
                        className={`w-full ${
                          errors?.weight ? "border border-red-400" : ""
                        }`}
                        id="weight"
                        type="text"
                        min="0"
                        onBlur={(e: any) => {
                          if (e.target.value) {
                            if (Number(e.target.value) <= 0) {
                              showAlert("Please provide valid weight");
                              setSpotData((pre: any) => ({
                                ...pre,
                                weight: "",
                              }));
                              handleerrors("weight");
                            } else {
                              setSpotData((pre: any) => ({
                                ...pre,
                                weight: e.target.value,
                              }));
                              handleerrors("weight");
                            }
                          }
                        }}
                        disabled={
                          checkrequiredvalues(dimensionData) ||
                          spotData?.booking_status == 14 ||
                          spotData?.booking_status == 3 ||
                          spotData?.booking_status == 1 ||
                          spotData?.booking_status == 10 ||
                          // spotData?.booking_status == 7 ||
                          spotData?.booking_status == 4 ||
                          spotData?.booking_status == 12
                        }
                        value={
                          checkrequiredvalues(dimensionData)
                            ? computedWeight
                            : spotData?.weight
                        }
                        onChange={(e) => {
                          handleerrors("weight");
                          const newValue = limitToThreeDecimals(e.target.value);
                          setSpotData((prev: any) => ({
                            ...prev,
                            weight: newValue,
                          }));
                        }}
                      />

                      <FormSelect
                        value={spotData?.weight_unit}
                        disabled
                        onChange={(e) => {
                          setSpotData((prev: any) => ({
                            ...prev,
                            weight_unit: e.target.value,
                          }));
                        }}
                      >
                        {weightData &&
                          weightData?.map((data: any, index: any) => (
                            <option
                              className="uppercase"
                              key={index}
                              value={data?.value}
                            >
                              {data?.value}
                            </option>
                          ))}
                      </FormSelect>
                    </div>
                  </div>
                  <div className={`col-span-3 md:col-span-3 lg:col-span-1`}>
                    {" "}
                    <FormLabel
                      htmlFor="origin-city"
                      className="text-base text-slate-500"
                    >
                      QUOTED BY <span className="text-red-400">*</span>
                    </FormLabel>
                    <div className="flex items-center gap-2 w-[100%]">
                      <FormInput
                        className="w-[100%]"
                        id="origin-city"
                        value={spotData?.quoted_by}
                        disabled={
                          spotData?.booking_status == 0 ||
                          spotData?.booking_status == 16 ||
                          spotData?.booking_status == 7
                            ? false
                            : true
                        }
                        onChange={(e) => {
                          setSpotData((prev: any) => ({
                            ...prev,
                            quoted_by: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                    {" "}
                    <FormLabel
                      htmlFor="origin-city"
                      className="text-base text-slate-500"
                    >
                      COMMODITY <span className="text-red-400">*</span>
                    </FormLabel>
                    <CommonSearchableAll
                      apiEndpoint={`admin/commodity-type`}
                      placeholder={"Search Commodity Type"}
                      selecteddata={selectedCommoditydata}
                      setSelecteddata={setSelectedCommoditydata}
                      fun1={commodityfun1}
                      comingselectedname={"commodity"}
                      comingselectedid={"commodity_id"}
                      funtoempty={commodityfuntoempty}
                      key1={"key"}
                      id={spotData?.commodity}
                      zIndex={20}
                      border={errors?.commodity ? true : false}
                      isDisabled={
                        spotData?.booking_status == 1 ||
                        spotData?.booking_status == 3 ||
                        spotData?.booking_status == 10 ||
                        spotData?.booking_status == 14 ||
                        // spotData?.booking_status == 7 ||
                        spotData?.booking_status == 4 ||
                        spotData?.booking_status == 12 ||
                        spotData?.booking_status == 8
                      }
                    />
                  </div>
                  <div>
                    <FormLabel
                      htmlFor="incoterm"
                      className="text-base text-slate-500"
                    >
                      INCOTERM <span className="text-red-400">*</span>
                    </FormLabel>

                    <FormSelect
                      id="incoterm"
                      className={`sm:mr-2 ${
                        errors?.incoterm ? "border border-red-400" : ""
                      }`}
                      value={spotData?.incoterm}
                      onChange={(e) => {
                        handleerrors("incoterm");
                        setSpotData((prev) => ({
                          ...prev,
                          incoterm: e.target.value,
                        }));
                      }}
                      disabled={
                        spotData?.booking_status == 1 ||
                        spotData?.booking_status == 3 ||
                        spotData?.booking_status == 14 ||
                        spotData?.booking_status == 10 ||
                        // spotData?.booking_status == 7 ||
                        spotData?.booking_status == 4 ||
                        spotData?.booking_status == 12 ||
                        spotData?.booking_status == 8
                      }
                    >
                      <option value="">Select Incoterm</option>
                      {incotermType &&
                        incotermType?.map((ele, index) => (
                          <option key={index} value={ele?.id}>
                            {ele?.name}
                          </option>
                        ))}
                    </FormSelect>
                  </div>

                  {(spotData?.shipment_type == 4 ||
                    spotData?.shipment_type == 5 ||
                    spotData?.shipment_type == 8) && (
                    <div className="col-span-3">
                      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-2 items-center">
                        <div>
                          <FormLabel
                            htmlFor="clearence-type"
                            className="text-base text-slate-500"
                          >
                            CLEARANCE TYPE{" "}
                            <span className="text-red-400">*</span>
                          </FormLabel>

                          <FormSelect
                            className={`sm:mr-2 ${
                              errors?.clearance_type
                                ? "border border-red-400"
                                : ""
                            }`}
                            disabled={
                              spotData?.booking_status == 1 ||
                              spotData?.booking_status == 3 ||
                              spotData?.booking_status == 14 ||
                              spotData?.booking_status == 10 ||
                              // spotData?.booking_status == 7 ||
                              spotData?.booking_status == 4 ||
                              spotData?.booking_status == 12 ||
                              spotData?.booking_status == 8
                            }
                            value={spotData?.clearence_type}
                            onChange={(e) => {
                              handleerrors("clearence_type");
                              const evalue = e.target.value;

                              if (evalue !== 1) {
                                setSpotData((pre: any) => ({
                                  ...pre,
                                  custom_clearance_charge: "",
                                }));
                              }
                              setSpotData((prev) => ({
                                ...prev,
                                clearence_type: e.target.value,
                              }));
                              setErrors((pre: any) => ({
                                ...pre,
                                clearence_type: "",
                              }));
                            }}
                          >
                            <option value="">Select Clearance Type</option>
                            {clearanceType &&
                              clearanceType
                                // .filter((item) =>
                                //   item.cargo_type.includes(spotData?.cargo_type)
                                // )
                                .map((ele, index) => (
                                  <option key={index} value={ele.id}>
                                    {ele.name}
                                  </option>
                                ))}
                          </FormSelect>
                        </div>

                        <div>
                          {" "}
                          <FormLabel
                            htmlFor="origin-city"
                            className="text-base text-slate-500"
                          >
                            SHIPMENT CURRENCY
                            {/* Shipment Currency */}
                          </FormLabel>
                          <FormSelect
                            disabled={
                              spotData?.booking_status == 1 ||
                              spotData?.booking_status == 3 ||
                              spotData?.booking_status == 14 ||
                              spotData?.booking_status == 10 ||
                              // spotData?.booking_status == 7 ||
                              spotData?.booking_status == 4 ||
                              spotData?.booking_status == 12 ||
                              spotData?.booking_status == 8
                            }
                            value={spotData?.currency_id || "24"}
                            onChange={(e: any) => {
                              setSpotData((pre: any) => ({
                                ...pre,
                                currency_id: e.target.value || "24",
                              }));
                            }}
                          >
                            <option value="">Select</option>
                            {currencydata?.length >= 1
                              ? currencydata?.map((item: any) => (
                                  <option value={item?.id}>
                                    {item?.currency}
                                  </option>
                                ))
                              : ""}
                          </FormSelect>
                        </div>
                        <div>
                          <div
                            className={`${
                              spotData?.shipment_type == 8 &&
                              (spotData?.mode == 2 || spotData?.mode == 3)
                                ? "flex"
                                : ""
                            }
                      `}
                          >
                            {" "}
                            <div>
                              <FormLabel className="text-base text-slate-500">
                                VENDOR NAME{" "}
                                <span className="text-red-400">*</span>
                                {/* Shipment Currency */}
                              </FormLabel>
                              <FormSelect
                                disabled={
                                  spotData?.booking_status == 1 ||
                                  spotData?.booking_status == 3 ||
                                  spotData?.booking_status == 14 ||
                                  spotData?.booking_status == 10 ||
                                  // spotData?.booking_status == 7 ||
                                  spotData?.booking_status == 4 ||
                                  spotData?.booking_status == 12 ||
                                  spotData?.booking_status == 8
                                }
                                value={spotData?.courier_id}
                                onChange={(e: any) => {
                                  const singledata = products?.find(
                                    (item: any) =>
                                      item?.product_id == e.target.value,
                                  );

                                  setSpotData((pre: any) => ({
                                    ...pre,
                                    courier_id: e.target.value,
                                    ...(spotData?.shipment_type == 8
                                      ? {
                                          mode_value: "",
                                          mode:
                                            singledata?.product_name?.toLowerCase() ==
                                            "air"
                                              ? 1
                                              : singledata?.product_name?.toLowerCase() ==
                                                  "ocean"
                                                ? 2
                                                : singledata?.product_name?.toLowerCase() ==
                                                    "road/surface"
                                                  ? 3
                                                  : "",
                                        }
                                      : {}),
                                  }));
                                }}
                              >
                                <option value="">Select</option>
                                {products?.length >= 1
                                  ? products?.map((item: any) => (
                                      <option value={item?.product_id}>
                                        {item?.product_name}
                                      </option>
                                    ))
                                  : ""}
                              </FormSelect>
                            </div>
                            {spotData?.shipment_type == 8 &&
                            spotData?.mode == 2 ? (
                              <div className="flex flex-col mt-10 sm:flex-row ml-6">
                                <FormCheck className="mr-2">
                                  <FormCheck.Input
                                    // value={spotData?.mode_value}
                                    id="radio-switch-4"
                                    type="radio"
                                    defaultChecked={
                                      spotData?.mode_value == "LCL"
                                    }
                                    onChange={(e: any) => {
                                      if (e.target.checked) {
                                        setSpotData((pre: any) => ({
                                          ...pre,
                                          mode_value: "LCL",
                                        }));
                                      }
                                    }}
                                    disabled={
                                      spotData?.booking_status == 1 ||
                                      spotData?.booking_status == 3 ||
                                      spotData?.booking_status == 14 ||
                                      spotData?.booking_status == 10 ||
                                      // spotData?.booking_status == 7 ||
                                      spotData?.booking_status == 4 ||
                                      spotData?.booking_status == 12 ||
                                      spotData?.booking_status == 8
                                    }
                                    name="horizontal_radio_button"
                                  />
                                  <FormCheck.Label htmlFor="radio-switch-4">
                                    {"LCL"}
                                  </FormCheck.Label>
                                </FormCheck>
                                <FormCheck className="mt-2 mr-2 sm:mt-0">
                                  <FormCheck.Input
                                    // value={switchLogs}
                                    id="radio-switch-5"
                                    type="radio"
                                    disabled={
                                      spotData?.booking_status == 1 ||
                                      spotData?.booking_status == 3 ||
                                      spotData?.booking_status == 14 ||
                                      spotData?.booking_status == 10 ||
                                      // spotData?.booking_status == 7 ||
                                      spotData?.booking_status == 4 ||
                                      spotData?.booking_status == 12 ||
                                      spotData?.booking_status == 8
                                    }
                                    defaultChecked={
                                      spotData?.mode_value == "FCL"
                                    }
                                    onChange={(e: any) => {
                                      if (e.target.checked) {
                                        setSpotData((pre: any) => ({
                                          ...pre,
                                          mode_value: "FCL",
                                        }));
                                        // setPage(0)
                                        // setHit(4)
                                        // setFiltersdata(intfiltersdata)
                                      }
                                    }}
                                    name="horizontal_radio_button"
                                  />
                                  <FormCheck.Label htmlFor="radio-switch-5">
                                    FCL
                                  </FormCheck.Label>
                                </FormCheck>
                              </div>
                            ) : spotData?.shipment_type == 8 &&
                              spotData?.mode == 3 ? (
                              <div className="flex flex-col mt-10 sm:flex-row ml-6">
                                <FormCheck className="mr-2">
                                  <FormCheck.Input
                                    // value={spotData?.mode_value}
                                    id="radio-switch-4"
                                    type="radio"
                                    disabled={
                                      spotData?.booking_status == 1 ||
                                      spotData?.booking_status == 3 ||
                                      spotData?.booking_status == 14 ||
                                      spotData?.booking_status == 10 ||
                                      // spotData?.booking_status == 7 ||
                                      spotData?.booking_status == 4 ||
                                      spotData?.booking_status == 12 ||
                                      spotData?.booking_status == 8
                                    }
                                    defaultChecked={
                                      spotData?.mode_value == "LTL"
                                    }
                                    onChange={(e: any) => {
                                      if (e.target.checked) {
                                        setSpotData((pre: any) => ({
                                          ...pre,
                                          mode_value: "LTL",
                                        }));
                                        // setPage(0)
                                        // setHit(4)
                                        // setFiltersdata(intfiltersdata)
                                      }
                                    }}
                                    name="horizontal_radio_button"
                                  />
                                  <FormCheck.Label htmlFor="radio-switch-4">
                                    {"LTL"}
                                  </FormCheck.Label>
                                </FormCheck>
                                <FormCheck className="mt-2 mr-2 sm:mt-0">
                                  <FormCheck.Input
                                    // value={switchLogs}
                                    id="radio-switch-5"
                                    type="radio"
                                    defaultChecked={
                                      spotData?.mode_value == "FTL"
                                    }
                                    disabled={
                                      spotData?.booking_status == 1 ||
                                      spotData?.booking_status == 3 ||
                                      spotData?.booking_status == 14 ||
                                      spotData?.booking_status == 10 ||
                                      // spotData?.booking_status == 7 ||
                                      spotData?.booking_status == 4 ||
                                      spotData?.booking_status == 12 ||
                                      spotData?.booking_status == 8
                                    }
                                    onChange={(e: any) => {
                                      if (e.target.checked) {
                                        setSpotData((pre: any) => ({
                                          ...pre,
                                          mode_value: "FTL",
                                        }));
                                        // setPage(0)
                                        // setHit(4)
                                        // setFiltersdata(intfiltersdata)
                                      }
                                    }}
                                    name="horizontal_radio_button"
                                  />
                                  <FormCheck.Label htmlFor="radio-switch-5">
                                    FTL
                                  </FormCheck.Label>
                                </FormCheck>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                        {(spotData?.shipment_type == "4" ||
                          spotData?.shipment_type == "5") &&
                        spotData?.dest_country_id == 97 &&
                        spotData?.org_country_id != 97 ? (
                          <div>
                            <FormLabel
                              htmlFor="incoterm"
                              className="text-base text-slate-500"
                            >
                              IMPORT BOOKING TYPE{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormSelect
                              id="import-booking-type"
                              value={spotData?.import_booking_type}
                              onChange={(e) => {
                                handleerrors("import_booking_type");
                                setSpotData((prev: any) => ({
                                  ...prev,
                                  import_booking_type: e.target.value,
                                }));
                                setErrors((pre: any) => ({
                                  ...pre,
                                  import_booking_type: "",
                                }));
                              }}
                              className={`sm:mr-2 ${
                                errors?.import_booking_type
                                  ? "border border-red-400"
                                  : ""
                              }`}
                            >
                              <option value="">
                                Select Import Booking Type
                              </option>
                              <option value={1}>D2D Import Booking</option>
                              <option value={2}>D2P/ BSO Import Booking</option>
                            </FormSelect>
                          </div>
                        ) : null}
                        {spotData?.shipment_type == 8 ? (
                          <div className="min-[484px]:flex">
                            <div className="w-[70%]">
                              {" "}
                              <FormLabel
                                htmlFor="origin-city"
                                className="text-base text-slate-500"
                              >
                                FAIR NAME{" "}
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <CommonSearchableAll
                                apiEndpoint={`admin/fair_exhibition/enquiry_dropdown`}
                                placeholder={"Search Fair Name"}
                                selecteddata={selectedFairdata}
                                setSelecteddata={setSelectedFairdata}
                                fun1={fairfun1}
                                comingselectedname={"fair_name"}
                                comingselectedid={"fair_id"}
                                funtoempty={fairfuntoempty}
                                key1={"fair_name"}
                                addcomingname2={"fair_ground_name"}
                                addcomingname3={"fair_start_date"}
                                addcomingname4={"fair_end_date"}
                                formatdatekey={true}
                                id={spotData?.fair_id}
                                zIndex={50}
                                isDisabled={
                                  spotData?.booking_status == 1 ||
                                  spotData?.booking_status == 3 ||
                                  spotData?.booking_status == 14 ||
                                  spotData?.booking_status == 10 ||
                                  // spotData?.booking_status == 7 ||
                                  spotData?.booking_status == 4 ||
                                  spotData?.booking_status == 12 ||
                                  spotData?.booking_status == 8
                                }
                              />
                            </div>
                            <div className="ml-2">
                              <FormCheck className="mt-10">
                                <FormCheck.Input
                                  id="vertical-form-3"
                                  type="checkbox"
                                  disabled={
                                    spotData?.booking_status == 1 ||
                                    spotData?.booking_status == 3 ||
                                    spotData?.booking_status == 10 ||
                                    spotData?.booking_status == 14 ||
                                    // spotData?.booking_status == 7 ||
                                    spotData?.booking_status == 4 ||
                                    spotData?.booking_status == 12 ||
                                    spotData?.booking_status == 8
                                  }
                                  onChange={(e: any) => {
                                    if (e.target.checked) {
                                      setSpotData((pre: any) => ({
                                        ...pre,
                                        is_returnable: 1,
                                      }));
                                    } else {
                                      setSpotData((pre: any) => ({
                                        ...pre,
                                        is_returnable: 0,
                                      }));
                                    }
                                  }}
                                  checked={spotData?.is_returnable}
                                />
                                <FormCheck.Label htmlFor="vertical-form-3">
                                  RETURNABLE
                                </FormCheck.Label>
                              </FormCheck>
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {spotData?.shipment_type == 8 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {" "}
                            <div>
                              {" "}
                              <FormLabel
                                htmlFor="origin-city"
                                className="text-base text-slate-500"
                              >
                                FAIR START DATE{" "}
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormInput
                                type={"text"}
                                value={
                                  formatDateDDMMYYYY(
                                    spotData?.fair_start_date,
                                  ) || ""
                                }
                                readOnly
                              />
                            </div>
                            <div>
                              {" "}
                              <FormLabel
                                htmlFor="origin-city"
                                className="text-base text-slate-500"
                              >
                                FAIR END DATE{" "}
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormInput
                                value={
                                  formatDateDDMMYYYY(spotData?.fair_end_date) ||
                                  ""
                                }
                                readOnly
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        {spotData?.shipment_type == 8 ? (
                          <div className="col-span-1">
                            {" "}
                            <FormLabel
                              htmlFor="origin-city"
                              className="text-base text-slate-500"
                            >
                              FAIR VENUE <span className="text-red-400">*</span>
                            </FormLabel>
                            <FormInput value={spotData?.fair_venue} readOnly />
                          </div>
                        ) : (
                          ""
                        )}

                        {spotData?.import_booking == 2 ? (
                          <div className="col-span-1">
                            <FormLabel
                              htmlFor="origin-city"
                              className="text-base text-slate-500"
                            >
                              IMPORT SERVICE TYPE{" "}
                              <span className="text-red-400">*</span>
                            </FormLabel>
                            <FormSelect
                              value={spotData?.import_service_type}
                              className={`sm:mr-2 ${
                                errors?.import_service_type
                                  ? "border border-red-400"
                                  : ""
                              }`}
                              onChange={(e: any) => {
                                setSpotData((pre: any) => ({
                                  ...pre,
                                  import_service_type: e.target.value,
                                }));
                                setErrors((pre: any) => ({
                                  ...pre,
                                  import_service_type: "",
                                }));
                              }}
                            >
                              <option value="">Select</option>
                              <option value={1}>Economy</option>
                              <option value={2}>Express (IP)</option>
                            </FormSelect>
                          </div>
                        ) : null}

                        {/* <div className="col-span-3 md:col-span-3 lg:col-span-1">
                            <FormLabel>Attachment</FormLabel>
                            <FormInput
                              type="file"
                              onChange={(e) =>
                                setPdcData((pre: any) => ({
                                  ...pre,
                                  attachment: e.target.value,
                                }))
                              }
                            />
                          </div> */}

                        {/* {[1, 14, 10].includes(
                        Number(spotData?.booking_status)
                      ) && (
                        <div className="col-span-3 mt-2">
                          <h1 className="font-bold size-md">
                            SEND TEMPLATE TO CREDIT CONTROL
                          </h1>
                        </div>
                      )} */}
                        {/* {[1, 14, 10].includes(
                        Number(spotData?.booking_status)
                      ) ? (
                        <div className="col-span-3 border border-gray-200 rounded shadow-lg p-4">
                          <div className="ml-2 w-[50%] ">
                            <FormLabel>
                              To <span className="text-red-400">*</span> :
                            </FormLabel>
                         
                            <FormInput
                              placeholder="To"
                              className="mb-2"
                              type="email"
                              onChange={(e: any) => {
                                handleChange(e);
                              }}
                              name="to"
                              value={emaildata?.to}
                           
                            />
                          </div>

                          <div className="ml-2 ">
                            <FormLabel>CC</FormLabel>
            
                            <div className="flex flex-wrap items-center border ">
                              {bccList?.map((email, index) => (
                                <div
                                  key={index}
                                  className="flex items-center bg-gray-100 text-gray-800 rounded-full px-2 py-1 mr-1 mt-1"
                                >
                                  <span>{email}</span>
                                  <button
                                    type="button"
                                    className="ml-1 focus:outline-none"
                                    onClick={() => handleBccChipDelete(index)}
                                  >
                                    <MdClose className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <input
                                type="text"
                                id="bcc"
                                className="border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 m-2"
                                placeholder="Write Email and Press Enter"
                                value={bccInput}
                                onChange={handleBccInputChange}
                                onKeyPress={handleBccInputKeyPress}
                                onKeyDown={handleBccInputKeyDown}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )} */}
                      </div>
                    </div>
                  )}
                  {/* {[1, 3, 10, 14].includes(
                    Number(spotData?.booking_status),
                  ) && (
                    <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                      <FormLabel>
                        REQUEST FOR CREDIT LIMIT{" "}
                        <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormInput
                        placeholder="CREDIT LIMIT"
                        type="number"
                        disabled={
                          spotData?.booking_status == 3
                          // ||
                          // spotData?.booking_status == 10
                        }
                        value={spotData?.credit_limit}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          // if (value > 1000000) {
                          //   showAlert(
                          //     "Credit Limit cannot exceed ₹10,00,000",
                          //     "warning"
                          //   );
                          //   return;
                          // }
                          setSpotData((pre: any) => ({
                            ...pre,
                            // credit_limit: e.target.value,
                            credit_limit: value,
                          }));
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value) {
                            if (Number(e.target.value) < 0) {
                              showAlert("Credit Limit Can't be negative");
                              setSpotData((pre: any) => ({
                                ...pre,
                                credit_limit: 0,
                              }));
                            }
                          }
                        }}
                      />
                    </div>
                  )} */}

                  {/* {[1, 10, 14].includes(Number(spotData?.booking_status)) && (
                    <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                      <FormLabel>Credit Days</FormLabel>
                      <FormSelect
                        value={spotData?.credit_days}
                        onChange={(e) => {
                          setSpotData((prev: any) => ({
                            ...prev,
                            credit_days: e.target.value,
                          }));
                        }}
                      >
                        <option value="">Select Days</option>
                        <option value="3">3 Days</option>
                        <option value="7">7 Days</option>
                        <option value="15">15 Days</option>
                        <option value="30">30 Days</option>
                      </FormSelect>
                    </div>
                  )}
                  {(spotData?.booking_status == 1 ||
                    spotData?.booking_status == 14 ||
                    spotData?.booking_status == 10) && (
                    <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                      <FormLabel>
                        Margin Per Kg <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormInput
                        placeholder="Margin Per kg"
                        type="text"
                        value={spotData?.margin}
                        onChange={(e) =>
                          setSpotData((pre: any) => ({
                            ...pre,
                            margin: e.target.value
                              .replace(/[^0-9.]/g, "")
                              .replace(/(\..*)\./g, "$1"),
                            bookfun: SpotBooking,
                          }))
                        }
                        onBlur={(e: any) => {
                          if (e.target.value) {
                            if (Number(e.target.value) < 0) {
                              showAlert("Credit Limit Can't be negative");
                              setSpotData((pre: any) => ({
                                ...pre,
                                credit_limit: 0,
                              }));
                            }
                          }
                        }}
                      />
                    </div>
                  )} */}

                  {(spotData?.booking_status == 1 ||
                    spotData?.booking_status == 14 ||
                    spotData?.booking_status == 10) &&
                    pdcLen?.length > 0 && (
                      <>
                        <div className="col-span-3 md:col-span-3 lg:col-span-1">
                          <FormLabel>Date of PDC</FormLabel>
                          <FormInput
                            type="date"
                            disabled
                            value={pdcData.date_of_pdc}
                          />
                        </div>

                        <div className="col-span-3 md:col-span-3 lg:col-span-1">
                          <FormLabel>PDC Amount</FormLabel>
                          <FormInput
                            type="text"
                            disabled
                            value={pdcData?.pdc_amount}
                          />
                        </div>

                        <div className="col-span-3 md:col-span-3 lg:col-span-1">
                          <FormLabel>Cheque No</FormLabel>
                          <FormInput
                            type="text"
                            disabled
                            value={pdcData?.cheque_no}
                          />
                        </div>

                        <div className="col-span-3 md:col-span-3 lg:col-span-1">
                          <FormLabel>Bank</FormLabel>
                          <FormInput
                            type="text"
                            disabled
                            value={pdcData?.bank}
                          />
                        </div>
                      </>
                    )}
                  {[1, 3, 10, 14].includes(
                    Number(spotData?.booking_status),
                  ) && (
                    <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                      <FormLabel>
                        REQUEST FOR CREDIT LIMIT{" "}
                        <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormInput
                        placeholder="CREDIT LIMIT"
                        type="number"
                        disabled={
                          spotData?.booking_status == 3
                          // ||
                          // spotData?.booking_status == 10
                        }
                        value={Number(spotData?.credit_limit).toFixed(3)}
                        onChange={(e) => {
                          const strVal = limitToThreeDecimals(e.target.value);
                          const value = Number(strVal);
                          // if (value > 1000000) {
                          //   showAlert(
                          //     "Credit Limit cannot exceed ₹10,00,000",
                          //     "warning"
                          //   );
                          //   return;
                          // }
                          setSpotData((pre: any) => ({
                            ...pre,
                            // credit_limit: e.target.value,
                            credit_limit: value,
                          }));
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value) {
                            if (Number(e.target.value) < 0) {
                              showAlert("Credit Limit Can't be negative");
                              setSpotData((pre: any) => ({
                                ...pre,
                                credit_limit: 0,
                              }));
                            }
                          }
                        }}
                      />
                    </div>
                  )}

                  {[1, 10, 14].includes(Number(spotData?.booking_status)) && (
                    <div className=" col-span-3 md:col-span-3 lg:col-span-1">
                      <FormLabel>Credit Days</FormLabel>
                      <FormSelect
                        value={spotData?.credit_days}
                        onChange={(e) => {
                          setSpotData((prev: any) => ({
                            ...prev,
                            credit_days: e.target.value,
                          }));
                        }}
                      >
                        <option value="">Select Days</option>
                        <option value="3">3 Days</option>
                        <option value="7">7 Days</option>
                        <option value="15">15 Days</option>
                        <option value="30">30 Days</option>
                      </FormSelect>
                    </div>
                  )}
                  {(spotData?.booking_status == 1 ||
                    spotData?.booking_status == 14 ||
                    spotData?.booking_status == 10) && (
                    <div className="col-span-3 md:col-span-3 lg:col-span-1">
                      <FormLabel>
                        Margin Per Kg <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormInput
                        placeholder="Margin Per kg"
                        type="text"
                        value={spotData?.margin}
                        onChange={(e) => {
                          const newValue = limitToThreeDecimals(e.target.value);
                          setSpotData((pre: any) => ({
                            ...pre,
                            margin: newValue,
                            bookfun: SpotBooking,
                          }));
                        }}
                        onBlur={(e: any) => {
                          if (e.target.value) {
                            if (Number(e.target.value) < 0) {
                              showAlert("Credit Limit Can't be negative");
                              setSpotData((pre: any) => ({
                                ...pre,
                                credit_limit: 0,
                              }));
                            }
                          }
                        }}
                      />
                    </div>
                  )}

                  {(spotData?.booking_status == 1 ||
                    spotData?.booking_status == 14 ||
                    spotData?.booking_status == 10) &&
                    pdcLen?.length > 0 && (
                      <>
                        <div className="col-span-3 md:col-span-3 lg:col-span-1">
                          <FormLabel>Date of PDC</FormLabel>
                          <FormInput
                            type="date"
                            disabled
                            value={pdcData.date_of_pdc}
                          />
                        </div>

                        <div className="col-span-3 md:col-span-3 lg:col-span-1">
                          <FormLabel>PDC Amount</FormLabel>
                          <FormInput
                            type="text"
                            disabled
                            value={pdcData?.pdc_amount}
                          />
                        </div>

                        <div className="col-span-3 md:col-span-3 lg:col-span-1">
                          <FormLabel>Cheque No</FormLabel>
                          <FormInput
                            type="text"
                            disabled
                            value={pdcData?.cheque_no}
                          />
                        </div>

                        <div className="col-span-3 md:col-span-3 lg:col-span-1">
                          <FormLabel>Bank</FormLabel>
                          <FormInput
                            type="text"
                            disabled
                            value={pdcData?.bank}
                          />
                        </div>
                      </>
                    )}
                  {(spotData?.booking_status == 1 ||
                    spotData?.booking_status == 14 ||
                    spotData?.booking_status == 10) && (
                    <>
                      <div className="col-span-3 mt-4">
                        <FormCheck className="!flex !justify-start">
                          <FormCheck.Input
                            checked={pdcModal}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPdcModal(true);
                                setOpenModal(false);
                                setErrors([]);
                              } else {
                                setPdcModal(false);
                                setOpenModal(true);
                              }
                            }}
                            type="checkbox"
                          />
                          <FormCheck.Label>
                            <p>Do you want to send Request with PDC ?</p>
                          </FormCheck.Label>
                        </FormCheck>
                      </div>
                      <div className="col-span-3 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* MIDDLE: Exposure table with new design */}
                          {exposureData && exposureData.length > 0 ? (
                            <div className="overflow-hidden border border-gray-200 rounded-lg">
                              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                                <thead className="bg-gray-50 text-gray-700 font-medium">
                                  <tr>
                                    <th className="px-4 py-3">Aging Period</th>
                                    <th className="px-4 py-3 text-right">
                                      Outstanding
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-600">
                                  <tr>
                                    <td className="px-4 py-3">{"< 30 days"}</td>
                                    <td className="px-4 py-3 text-right">
                                      &#8377;
                                      {formatIndianNumber(
                                        Number(
                                          getValues(
                                            exposureData[0] || {},
                                            "(0-30)",
                                          ),
                                        ),
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-3">30-60 days</td>
                                    <td className="px-4 py-3 text-right">
                                      &#8377;
                                      {formatIndianNumber(
                                        Number(
                                          getValues(
                                            exposureData[0] || {},
                                            "(31-60)",
                                          ),
                                        ),
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-3">60-90 days</td>
                                    <td className="px-4 py-3 text-right">
                                      &#8377;
                                      {formatIndianNumber(
                                        Number(
                                          getValues(
                                            exposureData[0] || {},
                                            "(61-90)",
                                          ),
                                        ),
                                      )}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="px-4 py-3">{"> 90 days"}</td>
                                    <td className="px-4 py-3 text-right">
                                      &#8377;
                                      {formatIndianNumber(
                                        Number(
                                          getValues(
                                            exposureData[0] || {},
                                            "(91-120)",
                                          ),
                                        ) +
                                          Number(
                                            getValues(
                                              exposureData[0] || {},
                                              "(>120)",
                                            ),
                                          ),
                                      )}
                                    </td>
                                  </tr>
                                  <tr className="bg-gray-50 border-t border-gray-200">
                                    <td
                                      colSpan={2}
                                      className="py-2 px-3 font-medium text-gray-700"
                                    >
                                      Unbilled Outstanding
                                    </td>
                                    <td className="py-2 px-3">
                                      <div className="flex items-center gap-1">
                                        <IndianRupee className="h-3.5 w-3.5 text-gray-500" />
                                        <span className="font-semibold text-gray-800">
                                          {formatIndianNumber(
                                            Number(
                                              spotData?.unbilled || 0,
                                            )?.toFixed(3),
                                          )}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr className="bg-yellow-50 border-t-2 border-yellow-300">
                                    <td
                                      colSpan={2}
                                      className="py-2 px-3 font-semibold text-gray-900"
                                    >
                                      Total Amount
                                    </td>
                                    <td className="py-2 px-3">
                                      <div className="flex items-center gap-1">
                                        <IndianRupee className="h-3.5 w-3.5 text-yellow-600" />
                                        <span className="font-bold text-yellow-700">
                                          {formatIndianNumber(
                                            (
                                              (Number(spotData?.unbilled) ||
                                                0) +
                                              (Number(calculatedExposure) || 0)
                                            )?.toFixed(3),
                                          )}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div />
                          )}

                          {/* RIGHT: Declaration box */}
                          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3">
                            <FormCheck>
                              <FormCheck.Input
                                checked={timelyPaymentConfirmed ?? false}
                                onChange={(e) => {
                                  setTimelyPaymentConfirmed(e.target.checked);
                                }}
                                type="checkbox"
                              />
                              <FormCheck.Label>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                  I hereby confirm that the customer has a
                                  consistent record of timely payments and has
                                  no significant outstanding dues at the time of
                                  this credit request. I take full
                                  responsibility for this declaration.
                                </p>
                              </FormCheck.Label>
                            </FormCheck>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="mb-2 col-span-3">
                    <FormLabel>
                      Remarks
                      {/* <span className="text-red-400">*</span> */}
                    </FormLabel>
                    <FormTextarea
                      name="address"
                      className="px-2 py-2 h-20"
                      autoComplete="off"
                      value={spotData?.remarks}
                      onChange={(e) =>
                        setSpotData((prev: any) => ({
                          ...prev,
                          remarks: e.target.value,
                        }))
                      }
                    ></FormTextarea>
                  </div>
                </div>
                <div className="mb-4">
                  <div>
                    <FormLabel
                      htmlFor="regular-form-1"
                      className="text-base font-medium text-gray-900"
                    >
                      {" "}
                      Shipment Dimension
                    </FormLabel>

                    <ShipmentDimensions
                      dimensionData={dimensionData}
                      setDimensionData={setDimensionData}
                      setJobData={setSpotData}
                      jobdata={spotData}
                      checkdisable={
                        spotData?.booking_status != 0 &&
                        spotData?.booking_status != 16 &&
                        spotData?.booking_status != 7
                          ? true
                          : false
                      }
                      currencyData={currencydata}
                      currencyId={spotData?.currency_id}
                      weightData={weightData}
                      weightUnit={spotData?.weight_unit}
                    />
                  </div>
                </div>
                {/* || spotData?.booking_status == 3 */}
                {(spotData?.booking_status == 0 ||
                  spotData?.booking_status == 1 ||
                  spotData?.booking_status == 7 ||
                  spotData?.booking_status == 10 ||
                  spotData?.booking_status == 14 ||
                  spotData?.booking_status == 16) && (
                  <SellBuyForm
                    chargesdata={chargehead}
                    spotData={spotData}
                    sellingcharges={arrcharges}
                    setSellingCharges={setArrayCharges}
                    totalSell={totalsell}
                    toggle={toggle}
                    setToggle={setToggle}
                    getchweight={getchweight}
                    exchangedataSell={exchangedata}
                    setExchangedataSell={setExchangedata}
                    importBookingType={spotData?.import_booking}
                    currencyname={
                      currencydata?.find(
                        (item: any) =>
                          item?.id == singlefranchiseedata?.currency,
                      )?.currency || ""
                    }
                    currencydata={currencydata}
                    singlefranchiseedata={singlefranchiseedata}
                    // hasUpdated={hasUpdated}
                    // setHasUpdated={setHasUpdated}
                  />
                )}
              </div>
            </div>
          </>
        )}
        {modal2 ? (
          <ConfirmationModal
            openModal={modal2}
            setOpenModal={setModal2}
            valuetopass={valuetopass}
            setValuetopass={setValuetopass}
            funtohit={SpotBooking}
            modalloading={loading}
            setModalLoading={setloading}
            handleCancel={handleCancel}
          />
        ) : (
          ""
        )}
      </div>

      <div></div>
    </>
  );
  function moveIdToFront(arr, id) {
    const index = arr.indexOf(id);
    if (index === -1) return arr; // id not found, return original array
    if (index === 0) return arr; // already at front

    // Remove the id from its current position
    arr.splice(index, 1);
    // Add it to the front
    arr.unshift(id);
    return arr;
  }

  useEffect(() => {
    getExposureData(spotData?.franchisee_id);
  }, [spotData?.franchisee_id]);

  const getExposureData = async (franchisee_id: any) => {
    try {
      let tempData: any[] = [];
      const res2 = await commongetrequest(
        `admin/report/consolidated-report-without-cr?franchisee_id=${franchisee_id}`,
      );
      if (res2?.status === 200) {
        const data2 = res2?.data?.data || [];
        if (data2?.length >= 1) {
          // hasExposureData = true;
          tempData = [{ ...data2[0], franchisee_id: franchisee_id }];
        }
      }
      //   }),
      // );

      const newdata3 = tempData?.reduce(
        (acc: any[], item: any, index: number) => {
          const matched = allfdata?.find(
            (f: any) => f.franchisee_id == item?.franchisee_id,
          );

          const wallet = Number(matched?.wallet || 0);
          const availableCredit = Number(matched?.available_credit_limit || 0);

          if (index === 0) {
            const first = { ...item };
            first.total_credit_assigned = wallet;
            first.acl = indianFormat(availableCredit);
            acc.push(first);
          } else {
            const summary = acc[1] || {};

            for (const key in item) {
              const value = item[key];
              if (!isNaN(Number(value))) {
                summary[key] = (summary[key] || 0) + Number(value);
              } else {
                if (!summary[key]) summary[key] = value;
              }
            }

            summary.total_credit_assigned =
              (summary.total_credit_assigned || 0) + wallet;

            const aclRaw = (summary._aclRaw || 0) + availableCredit;
            summary._aclRaw = aclRaw;
            summary.acl = indianFormat(aclRaw);

            acc[1] = summary;
          }

          return acc;
        },
        [],
      );

      // ✅ Fallback when no consolidated report data found
      if (newdata3?.length === 0) {
        const matched = allfdata?.find(
          (f: any) => f.franchisee_id == franchisee_id,
        );

        const fallback = {
          franchisee_name: matched?.franchisee_name,
          total_credit_assigned: Number(matched?.wallet || 0),
          acl: indianFormat(Number(matched?.available_credit_limit || 0)),
        };

        setExposureData([fallback]);
      } else {
        setExposureData(newdata3);
      }

      setOpenModal(true);
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setEmaildata((pre: any) => ({ ...pre, [name]: value }));
  };
  return (
    <>
      {openmodal && (
        <CommonModal
          open={openmodal}
          setOpen={setOpenModal}
          title={ModalTitle2}
          description={ModalDescription2}
          footer={ModalFooter2}
          gridColumns={6}
          size={"2xl"}
        />
      )}
    </>
  );
};
