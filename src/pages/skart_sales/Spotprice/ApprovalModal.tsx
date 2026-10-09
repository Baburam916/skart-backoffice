import { useEffect, useRef, useState } from "react";
import Button from "../../../base-components/Button";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import { useAlert } from "../../../ContextProvider/AlertContext";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import SellBuyForm from "../SpotEnquiry/SpotEnquiryModal/spotpriceChargeform";
import { formatIndianNumber } from "../commoncomponents/CommonNumberConverter/CommonNumberconverter";

import LoadingButtonCommon from "../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import { ClipboardList, CreditCard, FileText, X } from "lucide-react";

import {
  checkallfiled,
  ShipmentDimensions,
} from "../commoncomponents/ShipmentDimensions/shipmentdimensions";

import CommonSearchableAll from "../commoncomponents/CommonSearchableall/CommonSearchableall";
import { formatDateDDMMYYYY } from "../SpotEnquiry/SpotPriceEnquiry2";
import { MdTextFields } from "react-icons/md";

const limitToThreeDecimals = (value: string): string => {
  const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const dotIdx = v.indexOf(".");
  if (dotIdx !== -1 && v.length - dotIdx - 1 > 3) {
    return v.slice(0, dotIdx + 4);
  }
  return v;
};

const intsingledata = {
  acl: 0,
  wallet: 0,
  gst_status: 0,
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
export const ApprovalModal = (data: any) => {
  const {
    openmodal,
    setOpenModal,

    // chargesdata,
    pickDataforForm,
    // girthcharge,
    franchiseedata,
    setPickDataforForm,
    chargesList,
    setErrors,
    getspotlistdata,
    errors,
    handleerrors,
    updateInterrors,
    incotermList,
    alltypedata,
    setIncotermList,
    interrors,
    commoditytype,
    gettopdata,
    value,
    currencydata,
    allvendordropdowndata,

    // setGirthCharge,
  } = data;
  // console.log("abharat", setPickDataforForm)
  const intarrcharges = {
    charge_id: "",
    weight: 0,
    rate: 0,
    per_kg: 2,
    inr_amount: 0,
    currency: "24",
    enquiry_id: "",
    sac_code: "",
  };
  const intarrcharges2 = {
    charge_id: "",
    weight: 0,
    rate: 0,
    per_kg: 2,
    inr_amount: 0,
    currency: "",
    enquiry_id: "",
    ex_rate: "",
    pp_cc: "1",
    party: "",
    party_name: "",
    sac_code: "",
  };

  const intfdata = {
    franchisee_name: "",
    franchisee_id: "",
    is_prepaid: "",
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
  const intexchangedataSell = [
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
  const [hasUpdated, setHasUpdated] = useState<any>(false);
  const [addedbuyingcharges, setAddedBuyingCharges] = useState<any>([]);
  const [selectedFairdata, setSelectedFairdata] = useState<any>(intfairdata);
  const [selectedCommoditydata, setSelectedCommoditydata] =
    useState<any>(intcommoditydata);
  const [addedsellingcharges, setAddedsellingCharges] = useState<any>([]);
  const [getShipment, setgetShipment] = useState<Array<any>>([]);

  const [signlefdata, setSinglefdata] = useState<any>(intfdata);

  const [weightData, setWeightData] = useState([]);

  const [dimensionData, setDimensionData] = useState(
    pickDataforForm?.shipment_dimensions || [],
  );

  const [sellingcharges, setSellingCharges] = useState<any>([
    { ...intarrcharges, weight: pickDataforForm?.weight },
  ]);
  const [addedtotalbuy, setAddedtotalBuy] = useState<any>(0);
  const [addedtotalsell, setaddedtotalSell] = useState<any>(0);
  const [addedRawSellCharges, setAddedRawSellCharges] = useState<any[]>([]);
  const [addedRawBuyCharges, setAddedRawBuyCharges] = useState<any[]>([]);
  const [totalbuy, setTotalBuy] = useState<any>(0);
  const [totalSell, setTotalsell] = useState<any>(0);
  const [buycharges, setBuyCharges] = useState<any>([
    { ...intarrcharges2, weight: pickDataforForm?.weight },
  ]);
  const [selectedfranchisedata, setSelectedfranchisedata] = useState<any>([
    intfdata,
  ]);

  const { booking_status } = pickDataforForm;
  const [country, setCountry] = useState<Array<any>>([]);
  const [salesPersonsList, setSalesPersonsList] = useState<Array<any>>([]);
  const [cargoTypeList, setCargoTypeList] = useState<Array<any>>([]);
  const [clearanceTypeList, setClearanceTypeList] = useState<Array<any>>([]);
  const [aramexProductList, setAramexProductList] = useState<Array<any>>([]);

  const [approvalTypedata, setApprovalTypedata] = useState<Array<any>>([]);
  const [approvedSelect, setApprovedSelect] = useState<any>(null);
  const [spinner, setSpinner] = useState<boolean>(false);

  const [toggle, setToggle] = useState<any>(1);
  const [exchangedata, setExchangedata] = useState<any>(intexchangedata);
  const [exchangedataSell, setExchangedataSell] =
    useState<any>(intexchangedataSell);
  const buyExchangeInitialized = useRef(false);
  const today = new Date().toISOString().split("T")[0];
  const currentDate: any = new Date();
  const [dataloading, setDataloading] = useState<boolean>(false);
  const [dimensionPreview, setDimensionPreview] = useState(false);
  const [fedexAccountType, setFedexAccountType] = useState<string>("");
  const { showAlert } = useAlert();

  useEffect(() => {
    if (pickDataforForm?.import_booking == 1) {
      if (
        Number(pickDataforForm?.weight) >= 0.5 &&
        Number(pickDataforForm?.weight) <= 5.5
      ) {
        setFedexAccountType("LWP");
        data.setPickDataforForm((prev: any) => ({
          ...prev,
          fedex_account_type: 3,
        }));
      } else if (
        Number(pickDataforForm?.weight) > 5.5 &&
        Number(pickDataforForm?.weight) <= 70
      ) {
        setFedexAccountType("MASTER");
        data.setPickDataforForm((prev: any) => ({
          ...prev,
          fedex_account_type: 2,
        }));
      } else if (Number(pickDataforForm?.weight) > 70) {
        setFedexAccountType("GTI");
        data.setPickDataforForm((prev: any) => ({
          ...prev,
          fedex_account_type: 1,
        }));
      } else {
        setFedexAccountType("");
      }
    }
  }, [pickDataforForm?.weight]);

  const {
    valid_till,
    weight_from,
    weight_to,
    clearence_type,
    cargo_type,
    remarks,
    incoterm,
    custom_clearance_charge,

    commodity,

    service_type,
  } = errors;
  const handleCancel = () => {
    setOpenModal(false);
    setErrors(interrors);

    setToggle(1);
    setHasUpdated(false);
    setSellingCharges([
      {
        ...intarrcharges,
        weight: pickDataforForm?.weight,
      },
    ]);
    setTotalBuy(0);
    setTotalsell(0);
    setBuyCharges([{ ...intarrcharges2, weight: pickDataforForm?.weight }]);
    setSelectedfranchisedata(intfdata);
    data.setPickDataforForm({});
    setAddedBuyingCharges([]);
    setAddedsellingCharges([]);
    setExchangedata(intexchangedata);
    setExchangedataSell(intexchangedataSell);
    buyExchangeInitialized.current = false;
  };
  // const getchweight = (value?: any) => {
  //   const total = value.reduce((acc, item) => {
  //     return (
  //       acc +
  //       Math.max(
  //         item?.weight,
  //         (Number(item?.height) *
  //           Number(item?.breadth) *
  //           Number(item?.length) *
  //           Number(item?.quantity)) /
  //           5000
  //       )
  //     );
  //   }, 0);
  //   return total || 0;
  // };
  const getchweight = async (
    shipment_dimensions: any = [],
    courier_id: any = "",
  ) => {
    try {
      const courier_data = await commongetrequest(
        `admin/product-settings/${courier_id}`,
      );
      if (courier_data?.status == 200) {
        const data = courier_data?.data?.data || [];
        const bill_type = data[0]?.courier_wt_bill_type;
        let chargeable_weight = 0;
        if (bill_type == 1) {
          chargeable_weight = shipment_dimensions?.reduce(
            (acc: any, item: any) =>
              acc +
              Math.max(
                ((+item?.length || 0) *
                  (+item?.breadth || 0) *
                  (+item?.height || 0) *
                  (+item?.quantity || 0)) /
                  data[0]?.denom_fac,
                +item?.weight || 0,
              ),
            0,
          );
        } else {
          let gross_w = shipment_dimensions?.reduce(
            (acc: any, item: any) => acc + +item?.weight || 0,
            0,
          );
          let vol_w = shipment_dimensions?.reduce(
            (acc: any, item: any) =>
              acc +
              ((+item?.length || 0) *
                (+item?.breadth || 0) *
                (+item?.height || 0) *
                (+item?.quantity || 0)) /
                data[0]?.denom_fac,
            0,
          );
          chargeable_weight = Math.max(gross_w, vol_w);
        }
        return Number(chargeable_weight?.toFixed(3)) || 0;
      }
    } catch (error) {
      return 0;
    }
  };
  //  console.log(dimensionData,"dimensiondata")
  // managing weight here
  useEffect(() => {
    const updateWeight = async () => {
      if (dimensionData?.length >= 1 && checkallfiled([], dimensionData)) {
        const calculatedWeight = await getchweight(
          dimensionData,
          pickDataforForm?.courier_id,
        );
        setPickDataforForm((prev: any) => ({
          ...prev,
          weight: calculatedWeight?.toFixed(3) || "",
        }));
      } else {
        setPickDataforForm((prev: any) => ({
          ...prev,
          weight: prev?.weight || "",
        }));
      }
    };

    updateWeight();
  }, [
    JSON.stringify(dimensionData) || dimensionData?.length,
    pickDataforForm?.courier_id,
  ]);

  useEffect(() => {
    if (
      (pickDataforForm?.shipment_type == 4 ||
        pickDataforForm?.shipment_type == 5) &&
      pickDataforForm?.import_booking == 1 &&
      data?.vendorData
        ?.find((item: any) => item?.product_id == pickDataforForm?.courier_id)
        ?.product_name?.toLowerCase()
        ?.includes("aramex")
    ) {
      data.setPickDataforForm((prev: any) => ({
        ...prev,
        courier_vendor_code: "",
      }));
    }
  }, []);

  //  get total amount of buy sell
  const gettotal = (data?: any, key?: any) => {
    const total = data.reduce(
      (total, item) => total + Number(item[key] || 0),
      0,
    );
    return total;
  };
  const getgsttotal = (data?: any, key?: any) => {
    const total = data?.reduce((total: any, item: any) => {
      // Check if charge_id is 33, if so add 0, otherwise apply the GST calculation
      // console.log(item);

      if (item?.charge_id == 33 || item?.charge_id == 32) {
        return total + 0;
      } else {
        return (
          total +
          Number(item[key] || 0) *
            (pickDataforForm?.import_booking == 3 ? 0 : 0.18)
        );
      }
    }, 0);

    return total;
  };

  const computeChargesGST = (
    charges: any[],
    type: "sell" | "buy",
    zeroCondition: boolean,
  ): number => {
    if (zeroCondition) return 0;
    return (charges || []).reduce((total: number, item: any) => {
      const inr = parseFloat(String(item.inr_amount || "0"));
      const isExempt =
        type === "sell" ? item.charge_id == 162 : item.charge_id == 163;
      if (isExempt) return total;
      const chargeInfo =
        type === "sell"
          ? chargesList?.find((c: any) => c.ref_sell_id == item.charge_id)
          : chargesList?.find((c: any) => c.charge_id == item.charge_id);
      const igstRate = parseFloat(chargeInfo?.tax_breakup?.igst || "18") / 100;
      return total + inr * igstRate;
    }, 0);
  };

  useEffect(() => {
    if (toggle == 2 && !buyExchangeInitialized.current) {
      setExchangedata(exchangedataSell.map((item: any) => ({ ...item })));
      buyExchangeInitialized.current = true;
    }
  }, [toggle]);

  useEffect(() => {
    setTotalBuy(gettotal(buycharges, "inr_amount"));
  }, [JSON.stringify(buycharges)]);
  useEffect(() => {
    const newdata = [...buycharges];
  }, [JSON.stringify(exchangedata)]);
  useEffect(() => {
    setTotalsell(gettotal(sellingcharges, "inr_amount"));
  }, [JSON.stringify(sellingcharges)]);

  // handling buycharges on weight changes
  useEffect(() => {
    if (buycharges?.length >= 1) {
      const newdata = [...buycharges];
      const newdata2 = newdata?.map((item: any) => ({
        ...item,
        weight: pickDataforForm?.weight,
      }));
      setBuyCharges(newdata2);
    }
  }, [pickDataforForm?.weight]);

  useEffect(() => {
    if (pickDataforForm?.enquiry_from == 4) {
      data.setPickDataforForm((prev: any) => ({
        ...prev,
        booking_status: 1,
      }));
      setApprovedSelect(1);
      submitForm("check");
    }
  }, [pickDataforForm?.enquiry_from]);

  const getDropDownData = async () => {
    try {
      setDataloading(true);
      const getCargoType = await commongetrequest(`booking/cargo-type`);
      const getClearenceType = await commongetrequest("booking/clearence-type");
      const getIncoterm = await commongetrequest("booking/incoterm");
      const getSalesPerson = await commongetrequest("admin/sales-person");
      const getAramexProducts = await commongetrequest(
        "booking/get_aramex_product",
      );

      const getSellingCharges = await commongetrequest(
        `booking/get-enquiry-buy-sell/${pickDataforForm.id}`,
      );
      const fdatares = await commongetrequest(
        `admin/franchisee-settings?franchisee_id=${pickDataforForm?.franchisee_id}`,
      );

      const addeddata =
        booking_status == 5
          ? await commongetrequest(
              `booking/booking-buy-sell/${pickDataforForm?.id}`,
            )
          : await commongetrequest(
              `booking/get-enquiry-buy-sell/${pickDataforForm?.id}`,
            );
      // if (currency?.status == 200)
      //   SetCurrencyData(currency?.data?.data || []);
      // }
      // const typedata = await commongetrequest("master/customer-type-data");
      const getweightunit = await commongetrequest("booking/weight-unit");
      if (pickDataforForm?.shipment_type == 8) {
        const fairres = await commongetrequest(
          "admin/fair_exhibition/enquiry_dropdown",
        );
        if (fairres.status == 200) {
          const data = fairres?.data?.data || [];

          if (pickDataforForm?.fair_id) {
            setSelectedFairdata((pre: any) => ({
              ...pre,
              fair_id: pickDataforForm?.fair_id,
              fair_name: data?.find(
                (item: any) => item?.fair_id == pickDataforForm?.fair_id,
              )?.fair_name,
            }));
          }
        }
      }
      if (pickDataforForm?.commodity) {
        const singledata = commoditytype?.find(
          (item: any) => item?.commodity_id == pickDataforForm?.commodity,
        );
        if (singledata) {
          setSelectedCommoditydata({
            commodity_id: singledata?.commodity_id,
            commodity: singledata?.commodity,
          });
        }
      }
      if (getSellingCharges?.status === 200) {
        const data = getSellingCharges?.data?.data || [];

        if (data.length > 0) {
          // Create a Map for faster lookups
          const chargeMap = new Map(
            chargesList.map((item) => [item.ref_sell_id, item]),
          );

          // Process selling charges

          const newdata = data
            ?.filter((item2: any) => item2?.charge_type == 2)
            ?.map((item) => ({
              ...item,
              // ex_rate: signlefdata?.exchange_rate || 1,
              // currency: signlefdata?.currency || 24,
              weight: item?.per_kg == 2 ? 1 : item.weight || 0,
              sac_code: chargeMap.get(item.charge_id)?.hsn_code || "",
            }));

          // Process buying charges
          const buydata = data
            ?.filter((item2: any) => item2?.charge_type == 2)
            ?.map((item) => {
              const chargeItem = chargeMap.get(item.charge_id) || {};
              return {
                charge_id: chargeItem.charge_id || "",
                weight: item?.per_kg == 2 ? 1 : item.weight || 0,
                sac_code: chargeItem.hsn_code || "",
                per_kg: item.per_kg || 0,
                inr_amount: 0,
                currency: item.currency || "24",
                enquiry_id: pickDataforForm?.id,
                rate: "",
                sell_rate: item.rate || 0,
                ex_rate: item?.ex_rate || "1",
                pp_cc: "1",
                party: "",
                party_name: "",
              };
            });

          // Update state
          setSellingCharges(newdata);
          setBuyCharges(buydata);
          setExchangedataSell(buildExchangeData(data, currencydata));
          setHasUpdated(false);
        } else {
          setSellingCharges([
            {
              ...(intarrcharges ?? {}),
              weight: pickDataforForm?.weight,
              // ex_rate: signlefdata?.exchange_rate || 1,
              // currency: signlefdata?.currency || 24,
            },
          ]);
        }
      }
      if (getSellingCharges?.status == 204) {
        setSellingCharges([
          {
            ...intarrcharges,
            weight: pickDataforForm?.weight,
            // ex_rate: signlefdata?.exchange_rate || 1,
            // currency: signlefdata?.currency || 24,
          },
        ]);
      }

      if (getSalesPerson?.status == 200) {
        setSalesPersonsList(getSalesPerson?.data?.data || []);
      }

      if (getCargoType?.status == 200) {
        setCargoTypeList(getCargoType?.data?.data);
      }
      if (getClearenceType?.status == 200) {
        setClearanceTypeList(getClearenceType?.data?.data || []);
      }
      if (getIncoterm?.status == 200) {
        setIncotermList(getIncoterm?.data?.data || []);
      }
      if (getAramexProducts?.status == 200) {
        setAramexProductList(getAramexProducts?.data?.data || []);
      }
      if (addeddata?.status == 200) {
        if (booking_status == 5) {
          const buying = addeddata?.data?.buying || [];
          const selling = addeddata?.data?.selling || [];

          let newsellingcharges = selling.map((item: any) => ({
            charges: chargesList.find(
              (item2: any) => item2?.ref_sell_id == item?.charge_id,
            )?.charge_name,
            rate: Number(item?.rate) || "",
            rate_type:
              item?.per_kg == 2
                ? "Absolute"
                : item?.per_kg == 1
                  ? "Per kg/Piece"
                  : "",
            "weight/Unit": item?.per_kg == 2 ? 1 : Number(item?.weight),
            // currency: signlefdata?.currency || 24,
            // ex_rate: signlefdata?.exchange_rate || 1,
            "inr_amount  (Rs.)": Number(item?.inr_amount) || "",
          }));
          let newbuyingcharges = buying?.map((item: any) => ({
            charges: chargesList.find(
              (item2: any) => item2?.charge_id == item?.charge_id,
            )?.charge_name,
            "pp/cc": item?.pp_cc == 1 ? "PP" : item?.pp_cc == 2 ? "CC" : "",
            rate: Number(item?.rate) || "",
            rate_type:
              item?.per_kg == 2
                ? "Absolute"
                : item?.per_kg == 1
                  ? "Per kg/Piece"
                  : "",
            "weight/Unit": item?.per_kg == 2 ? 1 : Number(item?.weight),
            currency:
              currencydata?.find((item2?: any) => item2?.id == item?.currency)
                ?.currency || "",
            ex_rate: Number(item?.ex_rate) || "",
            "inr_amount  (Rs.)": Number(item?.inr_amount) || "",
            party_type:
              alltypedata.find(
                (item2: any) => item2?.ctd_id == item?.party_type,
              )?.ctype_name || "",
            party_name:
              allvendordropdowndata.find(
                (item2: any) => item2?.vendor_id == item?.party,
              )?.vendor_name || "",
          }));
          setAddedtotalBuy(gettotal(newbuyingcharges, "inr_amount  (Rs.)"));
          setaddedtotalSell(gettotal(newsellingcharges, "inr_amount  (Rs.)"));
          setAddedBuyingCharges(newbuyingcharges);
          setAddedsellingCharges(newsellingcharges);
          setAddedRawSellCharges(
            selling.map((item: any) => ({
              charge_id: item.charge_id,
              inr_amount: item.inr_amount,
            })),
          );
          setAddedRawBuyCharges(
            buying.map((item: any) => ({
              charge_id: item.charge_id,
              inr_amount: item.inr_amount,
            })),
          );
          if (buying?.length > 0) {
            setExchangedata(buildExchangeData(buying, currencydata));
            buyExchangeInitialized.current = true;
          }
          if (selling?.length > 0) {
            setExchangedataSell(buildExchangeData(selling, currencydata));
          }
        } else {
          const resdata = addeddata?.data?.data || [];

          let newsellingcharges = resdata
            ?.filter((item: any) => item?.charge_type == 2)
            .map((item: any) => ({
              charges: chargesList.find(
                (item2: any) => item2?.ref_sell_id == item?.charge_id,
              )?.charge_name,
              rate: item?.rate || "",
              rate_type:
                item?.per_kg == 2
                  ? "Absolute"
                  : item?.per_kg == 1
                    ? "Per kg/Piece"
                    : "",
              "weight/Unit": item?.per_kg == 2 ? 1 : item?.weight,
              // currency: signlefdata?.currency || 24,
              // ex_rate: signlefdata?.exchange_rate || 1,
              "inr_amount  (Rs.)": item?.inr_amount || "",
            }));

          let newbuyingcharges = resdata
            ?.filter((item: any) => item?.charge_type == 1)
            .map((item: any) => ({
              charges: chargesList.find(
                (item2: any) => item2?.charge_id == item?.charge_id,
              )?.charge_name,
              "pp/cc": item?.pp_cc == 1 ? "PP" : item?.pp_cc == 2 ? "CC" : "",
              rate: item?.rate || "",
              rate_type:
                item?.per_kg == 2
                  ? "Absolute"
                  : item?.per_kg == 1
                    ? "Per kg/Piece"
                    : "",
              "weight/Unit": item?.per_kg == 2 ? 1 : item?.weight,
              currency:
                currencydata?.find((item2?: any) => item2?.id == item?.currency)
                  ?.currency || "",
              ex_rate: item?.ex_rate || "",
              "inr_amount  (Rs.)": item?.inr_amount || "",
              party_type:
                alltypedata.find(
                  (item2: any) => item2?.ctd_id == item?.party_type,
                )?.ctype_name || "",
              party_name:
                allvendordropdowndata.find(
                  (item2: any) => item2?.vendor_id == item?.party,
                )?.vendor_name || "",
            }));
          setAddedtotalBuy(gettotal(newbuyingcharges, "inr_amount  (Rs.)"));
          setaddedtotalSell(gettotal(newsellingcharges, "inr_amount  (Rs.)"));
          setAddedBuyingCharges(newbuyingcharges);
          setAddedsellingCharges(newsellingcharges);
          setAddedRawSellCharges(
            resdata
              .filter((item: any) => item?.charge_type == 2)
              .map((item: any) => ({
                charge_id: item.charge_id,
                inr_amount: item.inr_amount,
              })),
          );
          setAddedRawBuyCharges(
            resdata
              .filter((item: any) => item?.charge_type == 1)
              .map((item: any) => ({
                charge_id: item.charge_id,
                inr_amount: item.inr_amount,
              })),
          );
          const rawBuyCharges = resdata?.filter(
            (item: any) => item?.charge_type == 1,
          );
          if (rawBuyCharges?.length > 0) {
            setExchangedata(buildExchangeData(rawBuyCharges, currencydata));
            buyExchangeInitialized.current = true;
          }
          const rawSellCharges = resdata?.filter(
            (item: any) => item?.charge_type == 2,
          );
          if (rawSellCharges?.length > 0) {
            setExchangedataSell(
              buildExchangeData(rawSellCharges, currencydata),
            );
          }
        }
      }
      if (fdatares?.status == 200) {
        const data = fdatares?.data?.data[0];

        setSinglefdata((pre: any) => ({
          acl: data?.available_credit_limit_show || 0,
          wallet: data?.credit_limit || 0,
          is_prepaid: data?.is_prepaid,
          gst_status: data?.gst_status || 0,
          currency: data?.currency || 24,
          exchange_rate: data?.exchange_rate || 1,
          is_overseas: data?.is_overseas,
        }));
      }
      if (getweightunit?.status == 200) {
        setWeightData(getweightunit?.data?.data || []);
      } else {
        setSinglefdata(intsingledata);
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setDataloading(false);
    }
  };

  const submitForm = async (checkapprove?: any) => {
    if (
      !pickDataforForm?.courier_vendor_code &&
      (pickDataforForm?.shipment_type == 4 ||
        pickDataforForm?.shipment_type == 5) &&
      pickDataforForm?.import_booking == 1 &&
      data?.vendorData
        ?.find((item: any) => item?.product_id == pickDataforForm?.courier_id)
        ?.product_name?.toLowerCase()
        ?.includes("aramex")
    ) {
      errors.courier_vendor_code = "Required";
      showAlert("Please select Aramex Product code", "warning");
      return;
    }
    const isAllFilled = buycharges?.every((item: any) =>
      Object.values(item).every(
        (value) => value !== "" && value !== null && value !== undefined,
      ),
    );
    const newdata = { ...pickDataforForm };
    const newerrors = { ...errors };
    if (dimensionData?.length == 0) {
      delete newdata["shipment_dimensions"];
    }
    const check = (obj: any) => {
      return Object.values(obj).every(
        (value) => !value || value === null || value === undefined,
      );
    };

    const isFedexFlow =
      (newdata?.shipment_type == 4 || newdata?.shipment_type == 5) &&
      newdata?.import_booking == 1 &&
      data?.vendorData
        ?.find((item: any) => item?.product_id == newdata?.courier_id)
        ?.product_name?.toLowerCase()
        ?.includes("fedex");

    if (isFedexFlow && newdata?.enquiry_from != 4) {
      if (Number(pickDataforForm?.weight) < 70) {
        delete newerrors["fedex_account_type"];
      }
      if (Number(pickDataforForm?.weight) < 0.5) {
        return showAlert(
          "Booking not allowed for weight less than 0.5 kg in fedex",
          "warning",
        );
      }
    }

    if (!isFedexFlow) {
      delete newdata["fedex_services"];
      delete newerrors["fedex_services"];
      delete newdata["fedex_account_type"];
      delete newerrors["fedex_account_type"];
    }
    const main = updateInterrors(newdata, newerrors);
    // console.log(newdata,newerrors,"testing")
    if (!check(main) && checkapprove) {
      return;
    }
    if (checkapprove) {
      return;
    }
    if (approvedSelect) {
      if (!check(main) && newdata?.booking_status != 2) {
        showAlert("Please provide all the required fields", "warning");
        return;
      }

      if (newdata?.booking_status == 2) {
        try {
          setSpinner(true);
          const response: any = await commonpostrequest(
            `booking/approval_spot_enquiry`,
            newdata,
          );
          if (response?.status == 200) {
            showAlert(
              response?.data?.message || "Action Performed Successfully",
            );
            getspotlistdata();
            if (value == "limited") {
              gettopdata();
            }

            data.setPickDataforForm({});
            setOpenModal(false);
          } else if (
            response?.response?.status == 400 ||
            response?.response?.data?.status == 400
          ) {
            showAlert(response?.response?.data?.message, "warning");
          } else if (response?.response?.status == 406) {
            showAlert(response?.response?.data?.errors[0]?.msg, "warning");
          } else {
            showAlert(response?.data?.message, "error");
          }
        } catch (err: any) {
          showAlert(err?.message, "error");
        } finally {
          setSpinner(false);
        }
      } else {
        // Currency & ex_rate mandatory check — selling
        const sellMissingCurrency = sellingcharges?.some(
          (item: any) => item?.charge_id && !item?.currency,
        );
        if (sellMissingCurrency) {
          showAlert(
            "Please select currency for all selling charges",
            "warning",
          );
          return;
        }
        const sellMissingExRate = sellingcharges?.some(
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
        const buyMissingCurrency = buycharges?.some(
          (item: any) => item?.charge_id && !item?.currency,
        );
        if (buyMissingCurrency) {
          showAlert("Please select currency for all buying charges", "warning");
          return;
        }
        const buyMissingExRate = buycharges?.some(
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

        // &&
        //   Number(totalSell) >= Number(totalbuy)
        if (
          sellingcharges[sellingcharges?.length - 1]?.charge_id &&
          sellingcharges[sellingcharges?.length - 1]?.inr_amount &&
          sellingcharges[sellingcharges?.length - 1]?.currency &&
          sellingcharges[sellingcharges?.length - 1]?.inr_amount &&
          sellingcharges[sellingcharges?.length - 1]?.ex_rate &&
          isAllFilled
        ) {
          try {
            setSpinner(true);
            const response: any = await commonpostrequest(
              `booking/approval_spot_enquiry`,
              {
                ...newdata,
                franchisee_id: pickDataforForm?.franchisee_id || "",
                buy_charges: buycharges,
                sell_charges: sellingcharges,
              },
            );
            if (response?.status == 200) {
              showAlert(
                response?.data?.message || "Action Performed Successfully",
              );
              data.getspotlistdata();

              if (value == "limited") {
                gettopdata();
              }
              setOpenModal(false);
              data.setPickDataforForm({});
            } else if (
              response?.response?.status == 400 ||
              response?.response?.data?.status == 400
            ) {
              showAlert(response?.response?.data?.message, "warning");
            } else if (response?.response?.status == 406) {
              showAlert(response?.response?.data?.errors[0]?.msg, "warning");
            } else {
              showAlert(response?.data?.message, "error");
            }
          } catch (err: any) {
            showAlert(err?.message, "error");
          } finally {
            setSpinner(false);
          }
        } else {
          if (!isAllFilled) {
            // console.log('hello')
            showAlert("Please Provide Buying Charges, Correctly!..", "warning");
          }
          if (
            !sellingcharges[sellingcharges?.length - 1]?.charge_id ||
            !sellingcharges[sellingcharges?.length - 1]?.inr_amount ||
            !sellingcharges[sellingcharges?.length - 1]?.currency ||
            !sellingcharges[sellingcharges?.length - 1]?.ex_rate
          ) {
            showAlert(
              "Please Provide Selling Charges, Correctly!..",
              "warning",
            );
          }
          // if (Number(totalSell) < Number(totalbuy)) {
          //   showAlert(
          //     "Total Sell Amount Can't Be less than Total Buy Amount",
          //     "warning"
          //   );
          // }
        }
      }
    } else {
      if (!approvedSelect) {
        showAlert("Please provide The approval type", "warning");
      }
    }
  };
  const fairfun1 = (a?: any) => {
    //  setSelectedfranchisedata((pre:any)=>({}))
    setPickDataforForm((pre: any) => ({
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
    setErrors({ ...errors, fair_id: "" });
  };

  const fairfuntoempty = (a?: any) => {
    //  setSelectedfranchisedata((pre:any)=>({}))

    setPickDataforForm((pre: any) => ({
      ...pre,
      fair_id: "",
      fair_venue: "",
      fair_start_date: "",
      fair_end_date: "",
    }));
  };

  const commodityfun1 = (a?: any) => {
    setPickDataforForm((pre: any) => ({
      ...pre,
      commodity: a?.commodity_id,
    }));
    handleerrors("commodity");
  };

  const commodityfuntoempty = () => {
    setPickDataforForm((pre: any) => ({
      ...pre,
      commodity: "",
    }));
  };
  // console.log("buy",buycharges,"sell",sellingcharges)
  const getShipmentdata = async () => {
    const response: any = await commongetrequest("admin/booking-shipment-type");
    try {
      if (response?.status == 200) {
        setgetShipment(response?.data?.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const getCountrydata = async () => {
    const response: any = await commongetrequest("admin/country");
    try {
      if (response?.status == 200) {
        setCountry(response?.data?.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const approvalType = async () => {
    const response: any = await commongetrequest(
      "hub/spot_pricing/approval_type_list",
    );
    try {
      if (response?.status == 200) {
        setApprovalTypedata(response?.data?.data);
      } else {
        setApprovalTypedata([]);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const rateValidity = (e: any) => {
    data?.setPickDataforForm((prev: any) => ({
      ...prev,
      valid_till: e.target.value,
    }));

    if (!e.target.value) return 0;
    const selected: any = new Date(e.target.value);
    const timeDifference = selected - currentDate;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    data?.setPickDataforForm((prev: any) => ({
      ...prev,
      rate_validity: daysDifference,
    }));
    handleerrors("valid_till");
  };

  useEffect(() => {
    getDropDownData();
    getShipmentdata();
    getCountrydata();
    approvalType();
  }, []);
  const fun1 = (value: any) => {};
  const funtoempty = () => {};
  const handleapprovaltype = () => {
    const check = (obj: any) => {
      return Object.values(obj).every(
        (value) => !value || value === null || value === undefined,
      );
    };
    const main = updateInterrors(pickDataforForm, errors);
    if (!check(main)) {
      return;
    }
  };
  // const columns = [
  //   {
  //     field: "charge",
  //     headerName: (
  //       <div className="flex justify-center items-center">
  //         <p>
  //           <Plus
  //             onClick={addRow}
  //             className="w-[24px] h-[24px] bg-green-400 text-white p-[3px] rounded-sm mr-1 cursor-pointer"
  //           />
  //           Charge
  //         </p>
  //       </div>
  //     ),
  //   },
  //   { field: "rate", headerName: "RATE" },
  //   { field: "weight", headerName: "WEIGHT" },
  //   { field: "per_kg", headerName: "PER KG" },
  //   { field: "currency", headerName: "CURRENCY" },
  //   { field: "amount", headerName: "INR AMOUNT" },
  //   { field: "action", headerName: "ACTION" },
  // ];

  // const rows: any = girthcharge?.map((row: any, index: number) => {
  //   const charge = (
  //     <FormSelect
  //       className="border w-full border-gray-300 rounded-lg"
  //       value={`${row?.charge_id}`}
  //       name="charge_id"
  //       onChange={(e) => {
  //         const value = e;
  //         if (value) handleSelectChange(index, "charge_id", e);
  //       }}
  //     >
  //       <option value={0}>Select Charge</option>
  //       {chargesList &&
  //         chargesList.map((item: any) => (
  //           <option
  //             className="w-full"
  //             key={item.charge_id}
  //             value={item?.charge_id}
  //           >
  //             {item?.charge_name}
  //           </option>
  //         ))}
  //     </FormSelect>
  //   );
  //   const rate = (
  //     <FormInput
  //       type="text"
  //       value={row?.rate}
  //       name="rate"
  //       disabled={!Number(row?.charge_id) || row?.is_edit}
  //       onChange={(e: any) => {
  //         handleSelectChange(index, "rate", e.target.value);
  //       }}
  //       className="w-full p-2 border border-gray-300  rounded"
  //     />
  //   );
  //   const weight = (
  //     <FormInput
  //       type="text"
  //       disabled={!Number(row?.charge_id) || row?.is_edit}
  //       onChange={(e: any) => {
  //         handleSelectChange(index, "weight", e.target.value);
  //       }}
  //       value={row?.weight}
  //       className="w-full p-2 border border-gray-300 rounded"
  //     />
  //   );
  //   const per_kg = (
  //     <FormSelect
  //       onChange={(e: any) => {
  //         handleSelectChange(index, "per_kg", e.target.value);
  //       }}
  //     >
  //       <option value="2">Absolute</option>
  //       <option value="1">Per Kg</option>
  //     </FormSelect>
  //   );
  //   const currency = (
  //     <FormInput
  //       type="text"
  //       value={row?.currency}
  //       disabled
  //       onChange={(e: any) => {
  //         handleSelectChange(index, "currency", e.target.value);
  //       }}
  //       className="w-full p-2 border border-gray-300  rounded"
  //     />
  //   );
  //   const amount = (
  //     <FormInput
  //       type="text"
  //       value={row?.inr_amount}
  //       disabled
  //       onChange={(e: any) => {
  //         handleSelectChange(index, "inr_amount", e.target.value);
  //       }}
  //       className="w-full p-2 border border-gray-300  rounded"
  //     />
  //   );
  //   const action = (
  //     <Button
  //       disabled={row?.is_edit}
  //       onClick={() => removeRow(index)}
  //       className="text-red-500 hover:text-red-700"
  //     >
  //       <Trash2 className="text-red-400" />
  //     </Button>
  //   );
  //   return {
  //     ...row,
  //     charge: charge,
  //     rate: rate,
  //     weight: weight,
  //     per_kg: per_kg,
  //     currency: currency,
  //     amount: amount,
  //     action: action,
  //   };
  // });

  const ModalFooter2 = (
    <div className="">
      <div className="flex justify-end mr-7 mb-4">
        <div
          className={`text-right min-[767px]:w-[50%] max-[767px]:mt-2 min-[417px]:grid grid-cols-${
            signlefdata?.currency && signlefdata?.currency != 24 && toggle == 1
              ? "4"
              : "3"
          } gap-2 `}
        >
          <div className="text-left">
            <FormLabel>Sub-Total : </FormLabel>
            <FormInput
              disabled
              className="text-right"
              value={
                // toggle == 2
                //   ? addedbuyingcharges?.length == 0 ||
                //     !checkstatus(booking_status)
                //     ? `₹${formatIndianNumber(Number(totalbuy))}`
                //     : `₹${formatIndianNumber(Number(addedtotalbuy))}`
                //   : addedbuyingcharges?.length == 0 ||
                //     !checkstatus(booking_status)
                //   ? `₹${formatIndianNumber(Number(totalSell))}`
                //   : `₹${formatIndianNumber(Number(addedtotalsell))}`
                toggle == 2
                  ? pickDataforForm?.forwhat == "pricing"
                    ? `₹${formatIndianNumber(parseFloat(Number(totalbuy).toFixed(3)))}`
                    : `₹${formatIndianNumber(parseFloat(Number(addedtotalbuy).toFixed(3)))}`
                  : pickDataforForm?.forwhat == "pricing"
                    ? `₹${formatIndianNumber(parseFloat(Number(totalSell).toFixed(3)))}`
                    : `₹${formatIndianNumber(parseFloat(Number(addedtotalsell).toFixed(3)))}`
              }
            />
          </div>
          <div className="text-left">
            <FormLabel>
              GST{" "}
              {(signlefdata?.gst_status == 4 && toggle == 2) ||
              (toggle == 1 &&
                (signlefdata?.is_overseas ||
                  pickDataforForm?.import_booking == 3))
                ? "(0%)"
                : ""}{" "}
              :{" "}
            </FormLabel>
            <FormInput
              disabled
              className="text-right"
              value={
                toggle == 2
                  ? pickDataforForm?.forwhat == "pricing"
                    ? `₹${formatIndianNumber(parseFloat(computeChargesGST(buycharges, "buy", signlefdata?.gst_status == 4).toFixed(3)))}`
                    : `₹${formatIndianNumber(parseFloat(computeChargesGST(addedRawBuyCharges, "buy", signlefdata?.gst_status == 4).toFixed(3)))}`
                  : pickDataforForm?.forwhat == "pricing"
                    ? `₹${formatIndianNumber(parseFloat(computeChargesGST(sellingcharges, "sell", signlefdata?.gst_status == 4 || signlefdata?.is_overseas || pickDataforForm?.import_booking == 3).toFixed(3)))}`
                    : `₹${formatIndianNumber(parseFloat(computeChargesGST(addedRawSellCharges, "sell", signlefdata?.gst_status == 4 || signlefdata?.is_overseas || pickDataforForm?.import_booking == 3).toFixed(3)))}`
              }
            />
          </div>
          <div className="text-left">
            <FormLabel>Total Amt (INR) : </FormLabel>
            <FormInput
              disabled
              className="text-right"
              value={
                toggle == 2
                  ? pickDataforForm?.forwhat == "pricing"
                    ? `₹${formatIndianNumber(parseFloat((Number(totalbuy) + computeChargesGST(buycharges, "buy", signlefdata?.gst_status == 4)).toFixed(3)))}`
                    : `₹${formatIndianNumber(parseFloat((Number(addedtotalbuy) + computeChargesGST(addedRawBuyCharges, "buy", signlefdata?.gst_status == 4)).toFixed(3)))}`
                  : pickDataforForm?.forwhat == "pricing"
                    ? `₹${formatIndianNumber(parseFloat((Number(totalSell) + computeChargesGST(sellingcharges, "sell", signlefdata?.gst_status == 4 || signlefdata?.is_overseas || pickDataforForm?.import_booking == 3)).toFixed(3)))}`
                    : `₹${formatIndianNumber(parseFloat((Number(addedtotalsell) + computeChargesGST(addedRawSellCharges, "sell", signlefdata?.gst_status == 4 || signlefdata?.is_overseas || pickDataforForm?.import_booking == 3)).toFixed(3)))}`
              }
            />
          </div>
          {signlefdata?.currency &&
          signlefdata?.currency != 24 &&
          toggle == 1 &&
          pickDataforForm?.forwhat == "pricing" ? (
            <div className="text-left">
              <FormLabel>
                Total Amt (
                {currencydata?.find(
                  (item: any) => item?.id == signlefdata?.currency,
                )?.currency || ""}
                ):{" "}
              </FormLabel>
              <FormInput
                disabled
                className="text-right"
                value={`${
                  currencydata?.find(
                    (item: any) => item?.id == signlefdata?.currency,
                  )?.symbol || ""
                }${formatIndianNumber(parseFloat((Number(totalSell) / Number(signlefdata?.exchange_rate || 1)).toFixed(3)))}`}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {!dataloading && (
        <div className="min-[534px]:flex justify-end items-end mr-7">
          {/* {addedbuyingcharges?.length == 0 || !checkstatus(booking_status) ? ( */}
          {pickDataforForm?.forwhat == "pricing" ? (
            <div className=" text-left">
              {/* {!approvedSelect && ( */}
              {pickDataforForm?.enquiry_from != 4 ? (
                <span className="text-red-500 text-[12px]">
                  Please select Approval type
                </span>
              ) : null}
              {/* )} */}
              <FormSelect
                value={pickDataforForm.booking_status}
                onChange={(e: any) => {
                  const value = Number(e.target.value);
                  data.setPickDataforForm((prev: any) => ({
                    ...prev,
                    booking_status: e.target.value,
                  }));
                  setApprovedSelect(e.target.value);
                  // setErrors(interrors)
                  submitForm("check");
                  // if(approvedSelect!=2){

                  // }
                  // handleapprovaltype()
                }}
                name="state"
                disabled={pickDataforForm.enquiry_from == 4}
              >
                <option value="0">Select Approval Type</option>
                {approvalTypedata?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </FormSelect>
            </div>
          ) : (
            ""
          )}
          <div className="flex gap-2 ml-4 max-[528px]:mt-2">
            <Button
              type="button"
              onClick={() => {
                handleCancel();
              }}
              className="w-20 text-white mr-1 bg-gray-500 p-2"
            >
              Cancel
            </Button>
            {/* {addedbuyingcharges?.length == 0 || !checkstatus(booking_status) ? ( */}
            {pickDataforForm?.forwhat == "pricing" ? (
              <Button
                variant="mustard"
                disabled={spinner}
                onClick={() => {
                  submitForm();
                  // setModal2(true)
                }}
                className="ml-2 bg-mustard p-2 w-[100px]"
              >
                {spinner ? <LoadingButtonCommon text="Loading" /> : "Submit"}
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );

  const ModalTitle2 = (
    <div className="flex justify-between w-full">
      <h2 className=" text-base font-medium text-white">UPDATE ENQUIRY</h2>

      <div className="">
        <X onClick={handleCancel} className="cursor-pointer text-red-700" />
      </div>
    </div>
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0; // Ensure scroll starts at the top
      }
    }, 0); // Allow time for modal rendering before scrolling
  }, []);

  //  console.log("check 123")
  const ModalDescription2 = (
    <>
      {dataloading ? (
        <LoadingButtonCommon />
      ) : (
        <>
          <div className="grid grid-cols-12 gap-2 lg:gap-4 mb-4">
            <div className="col-span-12  lg:col-span-4">
              <div className="bg-[#f2f7ff] rounded-lg p-[7px] flex w-full ">
                <figure className="w-[35px] flex items-center justify-center">
                  <ClipboardList className="w-[35px]  text-[#3b7dd8] " />
                </figure>
                <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
                  <p className="text-[12px] uppercase text-[#757575] w-full">
                    ACL
                  </p>
                  <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                    <span className="capitalize font-bold cursor-pointer">
                      {" "}
                      ₹{formatIndianNumber(signlefdata?.acl || 0)}
                    </span>
                  </h4>
                </aside>
              </div>
            </div>
            <div className="col-span-12  lg:col-span-4">
              <div className="bg-[#eafffa] rounded-lg p-[7px] flex  w-full ">
                <figure className="w-[35px] flex items-center justify-center">
                  <CreditCard className="w-[30px]  text-[#18a080]  " />
                </figure>
                <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
                  <p className="text-[12px] uppercase text-[#757575] w-full">
                    Wallet
                  </p>
                  <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                    <span className="capitalize font-bold cursor-pointer">
                      ₹{formatIndianNumber(signlefdata?.wallet || 0)}
                    </span>
                  </h4>
                </aside>
              </div>
            </div>

            <div className="col-span-12  lg:col-span-4">
              <div className="bg-[#faf5ff] rounded-lg p-[7px] flex  w-full ">
                <figure className="w-[35px] flex items-center justify-center">
                  <FileText className="w-[30px]  text-[#9c51e7] " />
                </figure>
                <aside className="md:border-l md:border-[#d8e7ff] md:pl-2 w-[80%] leading-[18px]">
                  <p className="text-[12px] uppercase text-[#757575] w-full">
                    {" "}
                    Enquiry No
                  </p>
                  <h4 className="font-medium text-[14px] text-[#383838] w-full flex justify-between items-center">
                    <span className="capitalize font-bold cursor-pointer">
                      {data?.pickDataforForm?.booking_no}
                    </span>
                  </h4>
                </aside>
              </div>
            </div>
          </div>
        </>
      )}

      <div
        ref={scrollRef}
        className="col-span-12 overflow-auto h-[56vh]"
        tabIndex={-1}
      >
        <div className="block lg:flex sm:justify-between gap-4 ">
          <div className="px-2 bg-white rounded-lg shadow-lg w-full lg:w-1/2 ">
            <div className="flex">
              <h1 className="font-bold text-lg">Serviceability</h1>
            </div>
            <hr />
            <div className="mb-2">
              <FormLabel>Customer Name</FormLabel>
              <span className="text-red-500 ml-2">*</span>
              <br />
              <FormInput
                disabled
                name="address"
                value={
                  data?.franchiseedata?.find(
                    (elem: any) =>
                      elem.franchisee_id ==
                      data?.pickDataforForm?.franchisee_id,
                  )?.franchisee_name || "-"
                }
              />
            </div>

            {/* <div className="mt-2 mb-2">
              <FormLabel>Approval Type</FormLabel>
              <span className="text-red-500 ml-2">*</span>
              <br />
              <FormSelect
                value={pickDataforForm.booking_status}
                onChange={(e: any) => {
                  data.setPickDataforForm((prev: any) => ({
                    ...prev,
                    booking_status: e.target.value,
                  }));
                  setApprovedSelect(e.target.value);
                }}
                name="state"
                aria-label="Select approval type"
              >
                <option value="0">Select Approval Type</option>
                {approvalTypedata?.map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </FormSelect>
          
            </div> */}
            <div className="mb-2">
              <FormLabel>Origin Country</FormLabel>
              <span className="text-red-500 ml-2">*</span>
              <br />
              <FormSelect
                disabled
                value={pickDataforForm.org_country_id}
                name="state"
                aria-label="Select Country"
              >
                <option value="">Select Country</option>
                {country?.map(
                  (item, index) =>
                    item?.is_active == 1 && (
                      <option key={index} value={item.country_id}>
                        {item.country_name}
                      </option>
                    ),
                )}
              </FormSelect>
            </div>
            <div className="mb-2">
              <FormLabel>Origin Pincode</FormLabel>
              <span className="text-red-500 ml-2">*</span>
              <FormInput
                disabled
                name="address"
                value={pickDataforForm.org_zip}
              />
            </div>
            <div className="mb-2">
              <FormLabel>Origin City</FormLabel>
              <span className="text-red-500 ml-2">*</span>
              <FormInput
                disabled
                name="address"
                value={pickDataforForm.org_city}
              />
            </div>
            <div className="mt-2 mb-2">
              <FormLabel>Destination Country</FormLabel>
              <span className="text-red-500 ml-2">*</span>
              <br />
              <FormSelect
                disabled
                value={pickDataforForm.dest_country_id}
                name="state"
                // aria-label="Select approval type"
              >
                <option value="">Select Country</option>
                {country?.map(
                  (item, index) =>
                    item?.is_active == 1 && (
                      <option value={item.country_id}>
                        {item.country_name}
                      </option>
                    ),
                )}
              </FormSelect>
            </div>
            <div className="mb-2">
              <FormLabel>Destination Pincode</FormLabel>
              <span className="text-red-500 ml-2">*</span>
              <FormInput
                disabled
                value={pickDataforForm.dest_zip || "0000"}
                name="address"
              />
            </div>
            <div className="mb-2">
              <FormLabel>Destination City</FormLabel>
              <span className="text-red-500 ml-2">*</span>
              <FormInput disabled value={pickDataforForm.dest_city} />
            </div>
          </div>
          <div className=" px-2 bg-white rounded-lg shadow-lg w-full lg:w-1/2 ">
            <h1 className="font-bold text-lg"></h1>
            <hr />
            <div className=" mb-2 mt-2">
              <div className="w-full">
                <FormLabel>Shipment Type</FormLabel>
                <span className="text-red-500 ml-2">*</span>
                <br />
                <FormSelect
                  disabled
                  value={pickDataforForm.shipment_type}
                  name="state"
                  aria-label="Select shipment type"
                >
                  <option value="">Select shipment Type</option>
                  {getShipment
                    ?.filter((item) =>
                      pickDataforForm?.import_booking == 2
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
            </div>
            <div className="flex gap-2">
              <div>
                {" "}
                <FormLabel
                  htmlFor="origin-city"
                  // className="text-base text-slate-500"
                >
                  Commodity Type <span className="text-red-400">*</span>
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
                  id={pickDataforForm?.commodity}
                  isDisabled={
                    approvedSelect != 3 && pickDataforForm.enquiry_from != 4
                  }
                  border={errors?.commodity ? true : false}
                />
              </div>

              <div className="w-[50%]">
                {" "}
                <FormLabel htmlFor="origin-city">Shipment Currency</FormLabel>
                <FormSelect
                  className={`sm:mr-2 ${
                    errors?.currency_id ? "border border-red-400" : ""
                  }`}
                  disabled={approvedSelect != 3}
                  value={pickDataforForm?.currency_id || "24"}
                  onChange={(e: any) => {
                    setPickDataforForm((pre: any) => ({
                      ...pre,
                      currency_id: e.target.value || "24",
                    }));
                    handleerrors("currency_id");
                  }}
                >
                  <option value="">Select</option>
                  {currencydata?.length >= 1
                    ? currencydata?.map((item: any) => (
                        <option value={item?.id}>{item?.currency}</option>
                      ))
                    : ""}
                </FormSelect>
              </div>
            </div>
            <div className=" mb-2 mt-2">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <FormLabel>Clearance Type</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <FormSelect
                    className={`sm:mr-2 ${
                      errors?.clearence_type ? "border border-red-400" : ""
                    }`}
                    disabled={approvedSelect != 3}
                    value={data.pickDataforForm?.clearence_type}
                    onChange={(e) => {
                      data.setPickDataforForm((prev: any) => {
                        return {
                          ...prev,
                          clearence_type: e.target.value,
                        };
                      });
                      handleerrors("clearence_type");
                    }}
                  >
                    <option value="">Select Clearance Type</option>
                    {clearanceTypeList &&
                      clearanceTypeList?.map((ele, index) => (
                        <option key={index} value={ele?.id}>
                          {ele?.name}
                        </option>
                      ))}
                  </FormSelect>
                </div>
                {data?.pickDataforForm?.import_booking == 2 ? (
                  <div className="w-1/2">
                    <FormLabel>Import Service Type</FormLabel>
                    <span className="text-red-500 ml-2">*</span>
                    <FormSelect
                      className={`sm:mr-2 ${
                        errors?.import_service_type
                          ? "border border-red-400"
                          : ""
                      }`}
                      disabled
                      value={data?.pickDataforForm?.import_service_type}
                      onChange={(e) => {
                        data.setPickDataforForm((prev: any) => {
                          return {
                            ...prev,
                            import_service_type: e.target.value,
                          };
                        });
                        handleerrors("import_service_type");
                      }}
                    >
                      <option value="">Select</option>
                      <option value={1}>Economy</option>
                      <option value={2}>Express (IP)</option>
                    </FormSelect>
                  </div>
                ) : null}

                {/* <div className="w-1/2">
                  <FormLabel>Service type</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <br />
                  <FormSelect
                    className={` ${
                      service_type ? "border border-red-400" : ""
                    }`}
                    value={pickDataforForm.service_type}
                    onChange={(e) => {
                      data.setPickDataforForm((prev: any) => ({
                        ...prev,
                        service_type: e.target.value,
                      }));
                      handleerrors("service_type");
                    }}
                    disabled={approvedSelect != 3}
                    name="state"
                    aria-label="Select service type"
                  >
                    <option value={""}>Select Service Type</option>
                    {data?.serviceTypeData?.map((item: any) => (
                      <option value={item.id}>{item.service_type}</option>
                    ))}
                  </FormSelect>
                </div> */}
                {(pickDataforForm?.shipment_type == "4" ||
                  pickDataforForm?.shipment_type == "5") &&
                pickDataforForm?.import_booking == "2" ? (
                  <div>
                    <FormLabel htmlFor="import-booking-type">
                      IMPORT BOOKING TYPE{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormSelect
                      id="import-booking-type"
                      className={`sm:mr-2 ${
                        errors?.import_booking_type
                          ? "border border-red-400"
                          : ""
                      }`}
                      value={pickDataforForm?.import_booking_type}
                      // disabled={approvedSelect != 3}
                      onChange={(e) => {
                        setPickDataforForm((prev: any) => ({
                          ...prev,
                          import_booking_type: e.target.value,
                        }));
                        setErrors((pre: any) => ({
                          ...pre,
                          import_booking_type: "",
                        }));
                      }}
                    >
                      <option value="">Select Import Booking Type</option>
                      <option value={1}>D2D Import Booking</option>
                      <option value={2}>D2P/ BSO Import Booking</option>
                    </FormSelect>
                  </div>
                ) : null}
              </div>
            </div>
            {/* <div className="mb-2">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <FormLabel>Cargo Type</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <FormSelect
                    className={`sm:mr-2 ${
                      cargo_type ? "border border-red-400" : ""
                    }`}
                    disabled={approvedSelect != 3}
                    value={data.pickDataforForm?.cargo_type}
                    onChange={(e) => {
                      data.setPickDataforForm((prev: any) => {
                        return {
                          ...prev,
                          cargo_type: e.target.value,
                        };
                      });
                      handleerrors("cargo_type");
                    }}
                  >
                    <option value="">Select Cargo Type</option>
                    {cargoTypeList &&
                      cargoTypeList?.map((ele, index) => (
                        <option key={index} value={ele?.id}>
                          {ele?.name}
                        </option>
                      ))}
                  </FormSelect>
                </div>
                <div className="w-1/2">
                  <FormLabel>Inco Term</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <FormSelect
                    className={`sm:mr-2 ${
                      incoterm ? "border border-red-400" : ""
                    }`}
                    disabled={approvedSelect != 3}
                    value={data.pickDataforForm?.incoterm}
                    onChange={(e) => {
                      data.setPickDataforForm((prev: any) => {
                        return {
                          ...prev,
                          incoterm: e.target.value,
                        };
                      });
                      handleerrors("incoterm");
                    }}
                  >
                    <option value="">Select Incoterm</option>
                    {incotermList &&
                      incotermList?.map((ele, index) => (
                        <option key={index} value={ele?.id}>
                          {ele?.name}
                        </option>
                      ))}
                  </FormSelect>
                </div>
              </div>
            </div> */}
            <div className="mb-2">
              <div
                className={
                  approvedSelect == 1 || approvedSelect == 3 ? "flex gap-2" : ""
                }
              >
                <div
                  className={
                    approvedSelect == 1 || approvedSelect == 3
                      ? "w-1/2"
                      : "w-full"
                  }
                >
                  <FormLabel>Chargeable Weight</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <div className="flex gap-2">
                    <FormInput
                      disabled
                      name="weight"
                      value={pickDataforForm.weight}
                      onChange={(e) =>
                        data.setPickDataforForm((prev: any) => ({
                          ...prev,
                          weight: e.target.value,
                        }))
                      }
                      className={
                        approvedSelect == 1 || approvedSelect == 3
                          ? "w-3/5"
                          : "w-4/5"
                      }
                    />
                    <FormSelect
                      name="state"
                      disabled
                      aria-label="Select shipment type"
                      className={
                        approvedSelect == 1 || approvedSelect == 3
                          ? "w-2/5"
                          : "w-1/2"
                      }
                    >
                      <option value="">kgs</option>
                    </FormSelect>
                  </div>
                </div>
                {(approvedSelect == 1 || approvedSelect == 3) && (
                  <div className="w-1/2">
                    <FormLabel>Valid Till</FormLabel>
                    <span className="text-red-500 ml-2">*</span>
                    <FormInput
                      type="date"
                      className={` ${
                        valid_till ? "border border-red-400" : ""
                      }`}
                      value={pickDataforForm?.valid_till}
                      onChange={rateValidity}
                      min={today}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-2">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <FormLabel>Quoted by</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <FormInput
                    className={`${
                      errors?.quoted_by ? "border border-red-400" : ""
                    }`}
                    disabled={pickDataforForm.enquiry_from != 4}
                    value={pickDataforForm.quoted_by}
                    name="address"
                    onChange={(e) => {
                      data.setPickDataforForm((prev: any) => ({
                        ...prev,
                        quoted_by: e.target.value,
                      }));
                      handleerrors("quoted_by");
                    }}
                  />
                </div>
                <div className="w-1/2">
                  <FormLabel>Vendor</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <br />
                  <FormSelect
                    className={`${
                      errors?.courier_id ? "border border-red-400" : ""
                    }`}
                    value={pickDataforForm.courier_id}
                    onChange={(e) => {
                      data.setPickDataforForm((prev: any) => ({
                        ...prev,
                        courier_id: e.target.value,
                      }));
                      handleerrors("courier_id");
                    }}
                    disabled={approvedSelect != 3}
                    name="state"
                    aria-label="Select shipment type"
                  >
                    <option value={""}>Select Vendor</option>
                    {data?.vendorData?.map((item: any) => (
                      <option value={item.product_id}>
                        {item.product_name}
                      </option>
                    ))}
                  </FormSelect>
                </div>
                {pickDataforForm?.shipment_type == 8 &&
                pickDataforForm?.mode == 2 ? (
                  <div className="flex flex-col mt-10 sm:flex-row ml-6">
                    <FormCheck className="mr-2">
                      <FormCheck.Input
                        // value={spotData?.mode_value}
                        id="radio-switch-4"
                        type="radio"
                        defaultChecked={pickDataforForm?.mode_value == "LCL"}
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            setPickDataforForm((pre: any) => ({
                              ...pre,
                              mode_value: "LCL",
                            }));
                          }
                        }}
                        disabled={approvedSelect != 3}
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
                        disabled={approvedSelect != 3}
                        defaultChecked={pickDataforForm?.mode_value == "FCL"}
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            setPickDataforForm((pre: any) => ({
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
                ) : pickDataforForm?.shipment_type == 8 &&
                  pickDataforForm?.mode == 3 ? (
                  <div className="flex flex-col mt-10 sm:flex-row ml-6">
                    <FormCheck className="mr-2">
                      <FormCheck.Input
                        // value={spotData?.mode_value}
                        id="radio-switch-4"
                        type="radio"
                        disabled={approvedSelect != 3}
                        defaultChecked={pickDataforForm?.mode_value == "LTL"}
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            setPickDataforForm((pre: any) => ({
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
                        defaultChecked={pickDataforForm?.mode_value == "FTL"}
                        disabled={approvedSelect != 3}
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            setPickDataforForm((pre: any) => ({
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
              {pickDataforForm?.shipment_type == 8 ? (
                <div className="flex ">
                  <div className="w-[70%] mt-2">
                    <div>
                      {" "}
                      <FormLabel
                        htmlFor="origin-city"
                        className="text-base text-slate-500"
                      >
                        Fair Name <span className="text-red-400">*</span>
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
                        id={pickDataforForm?.fair_id}
                        isDisabled={approvedSelect != 3}
                        border={errors?.fair_id ? true : false}
                      />
                    </div>
                  </div>
                  <div className="ml-2">
                    <FormCheck className="mt-12">
                      <FormCheck.Input
                        id="vertical-form-3"
                        type="checkbox"
                        disabled={approvedSelect != 3}
                        onChange={(e: any) => {
                          if (e.target.checked) {
                            setPickDataforForm((pre: any) => ({
                              ...pre,
                              is_returnable: 1,
                            }));
                          } else {
                            setPickDataforForm((pre: any) => ({
                              ...pre,
                              is_returnable: 0,
                            }));
                          }
                        }}
                        checked={pickDataforForm?.is_returnable}
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
              {pickDataforForm?.shipment_type == 8 ? (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {" "}
                  <div>
                    {" "}
                    <FormLabel
                      htmlFor="origin-city"
                      className="text-base text-slate-500"
                    >
                      Fair Start Date<span className="text-red-400">*</span>
                    </FormLabel>
                    <FormInput
                      className={`${
                        errors?.fair_id ? "border border-red-400" : ""
                      }`}
                      type={"text"}
                      onChange={(e: any) => {}}
                      value={
                        formatDateDDMMYYYY(
                          pickDataforForm?.booking?.fair_start_date,
                        ) ||
                        formatDateDDMMYYYY(pickDataforForm?.fair_start_date) ||
                        ""
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
                      Fair End Date <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormInput
                      value={
                        formatDateDDMMYYYY(
                          pickDataforForm?.booking?.fair_end_date,
                        ) ||
                        formatDateDDMMYYYY(pickDataforForm?.fair_end_date) ||
                        ""
                      }
                      readOnly
                      className={`${
                        errors?.fair_id ? "border border-red-400" : ""
                      }`}
                    />
                  </div>
                </div>
              ) : (
                ""
              )}
              {pickDataforForm?.shipment_type == 8 ? (
                <div className="col-span-2 mt-2">
                  {" "}
                  <FormLabel
                    htmlFor="origin-city"
                    className="text-base text-slate-500"
                  >
                    Fair Venue <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormInput
                    value={pickDataforForm?.fair_venue}
                    readOnly
                    className={`${
                      errors?.fair_id ? "border border-red-400" : ""
                    }`}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            {(approvedSelect == 1 || approvedSelect == 3) && (
              <div className="mb-2 p-2 border rounded-lg shadow-sm bg-white">
                <FormLabel className="text-sm text-primary font-semibold">
                  Weight Range
                </FormLabel>
                <span className="text-red-500 ml-2">*</span>

                <div className="flex gap-4 mt-2">
                  {/* Weight From */}
                  <div className="w-1/2">
                    <FormLabel>From</FormLabel>
                    <span className="text-red-500 ml-1">*</span>
                    <FormInput
                      type="text"
                      min="0"
                      className={`mt-1 w-full p-2 border rounded ${
                        weight_from ? "border border-red-400" : ""
                      }`}
                      value={limitToThreeDecimals(
                        String(pickDataforForm?.weight_from ?? ""),
                      )}
                      onBlur={(e: any) => {
                        const value = e.target.value;
                        handleerrors("weight_from");
                        if (
                          !(Number(value) <= Number(pickDataforForm?.weight))
                        ) {
                          showAlert(
                            "Weight Range Should be between Chargeable weight",
                            "warning",
                          );
                          data.setPickDataforForm((prev: any) => ({
                            ...prev,
                            weight_from: "",
                          }));
                        }
                      }}
                      onChange={(e) => {
                        data.setPickDataforForm((prev: any) => ({
                          ...prev,
                          weight_from: limitToThreeDecimals(e.target.value),
                        }));
                      }}
                      onKeyDown={(e: any) => {
                        const val = e.target.value;
                        const dot = val.indexOf(".");
                        if (
                          dot !== -1 &&
                          /^[0-9]$/.test(e.key) &&
                          e.target.selectionStart === e.target.selectionEnd &&
                          e.target.selectionStart > dot &&
                          val.length - dot - 1 >= 3
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>

                  {/* Weight To */}
                  <div className="w-1/2">
                    <FormLabel>To</FormLabel>
                    <span className="text-red-500 ml-1">*</span>
                    <FormInput
                      type="text"
                      min={pickDataforForm?.weight_from || 0}
                      className={`mt-1 w-full p-2 border rounded ${
                        weight_to ? "border border-red-400" : ""
                      }
                      `}
                      value={limitToThreeDecimals(
                        String(pickDataforForm?.weight_to ?? ""),
                      )}
                      onBlur={(e: any) => {
                        const value = e.target.value;
                        handleerrors("weight_to");
                        if (value) {
                          if (
                            Number(value) < pickDataforForm?.weight_from ||
                            Number(value) <= Number(pickDataforForm?.weight)
                          ) {
                            showAlert(
                              "Weight To Can't be less than  Chargeable weight or from ",
                              "warning",
                            );
                            setPickDataforForm((pre: any) => ({
                              ...pre,
                              weight_to: 0,
                            }));
                          }
                        }
                      }}
                      onChange={(e) => {
                        data.setPickDataforForm((prev: any) => ({
                          ...prev,
                          weight_to: limitToThreeDecimals(e.target.value),
                        }));
                      }}
                      onKeyDown={(e: any) => {
                        const val = e.target.value;
                        const dot = val.indexOf(".");
                        if (
                          dot !== -1 &&
                          /^[0-9]$/.test(e.key) &&
                          e.target.selectionStart === e.target.selectionEnd &&
                          e.target.selectionStart > dot &&
                          val.length - dot - 1 >= 3
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {(pickDataforForm?.shipment_type == 4 ||
              pickDataforForm?.shipment_type == 5) &&
            data?.vendorData
              ?.find(
                (item: any) => item?.product_id == pickDataforForm?.courier_id,
              )
              ?.product_name?.toLowerCase()
              ?.includes("fedex") ? (
              <>
                {pickDataforForm?.enquiry_from == 4 &&
                pickDataforForm?.import_booking == 1 ? (
                  <div className="flex gap-4 mb-2">
                    <div className="w-1/2">
                      <FormLabel>Fedex Account Type</FormLabel>
                      <span className="text-red-500 ml-2">*</span>
                      <br />
                      <FormSelect
                        className={`${
                          errors?.fedex_account_type
                            ? "border border-red-400"
                            : ""
                        }`}
                        value={pickDataforForm.fedex_account_type}
                        onChange={(e) => {
                          data.setPickDataforForm((prev: any) => ({
                            ...prev,
                            fedex_account_type: e.target.value,
                          }));
                          handleerrors("fedex_account_type");
                        }}
                        name="fedex_account_type"
                        aria-label="Select fedex account type"
                      >
                        <option value={""}>Select Fedex Account Type</option>
                        <option value={1}>GTI</option>
                        <option value={2}>Master</option>
                      </FormSelect>
                    </div>
                    <div className="w-1/2">
                      <FormLabel>Sales Person</FormLabel>
                      <span className="text-red-500 ml-2">*</span>
                      <br />
                      <FormSelect
                        value={pickDataforForm.sales_id}
                        onChange={(e: any) => {
                          data.setPickDataforForm((prev: any) => ({
                            ...prev,
                            sales_id: e.target.value,
                          }));
                        }}
                        name="sales_id"
                      >
                        {salesPersonsList?.map((item: any) => (
                          <option key={item.id} value={item.id}>
                            {item.sales_person}
                          </option>
                        ))}
                      </FormSelect>
                    </div>
                  </div>
                ) : fedexAccountType &&
                  fedexAccountType != "GTI" &&
                  pickDataforForm?.import_booking == 1 ? (
                  <div className="flex gap-4 mb-2">
                    <div className="w-1/2">
                      <FormLabel>Fedex Account Type</FormLabel>
                      <span className="text-red-500 ml-2">*</span>
                      <br />
                      <span className="block w-full rounded border border-gray-300 bg-gray-100 px-3 py-2">
                        {fedexAccountType}
                      </span>
                    </div>
                  </div>
                ) : fedexAccountType &&
                  fedexAccountType == "GTI" &&
                  pickDataforForm?.import_booking == 1 ? (
                  <div className="flex gap-4 mb-2">
                    <div className="w-1/2">
                      <FormLabel>Fedex Account Type</FormLabel>
                      <span className="text-red-500 ml-2">*</span>
                      <br />
                      <FormSelect
                        className={`${
                          errors?.fedex_account_type
                            ? "border border-red-400"
                            : ""
                        }`}
                        value={pickDataforForm.fedex_account_type}
                        onChange={(e) => {
                          data.setPickDataforForm((prev: any) => ({
                            ...prev,
                            fedex_account_type: e.target.value,
                          }));
                          handleerrors("fedex_account_type");
                        }}
                        name="fedex_account_type"
                        aria-label="Select fedex account type"
                      >
                        <option value={1}>GTI</option>
                        <option value={2}>Master</option>
                      </FormSelect>
                    </div>
                  </div>
                ) : null}
                <div className="flex gap-4 mb-2">
                  <div className="w-1/2">
                    <FormLabel>Fedex Services</FormLabel>
                    <span className="text-red-500 ml-2">*</span>
                    <br />
                    <FormSelect
                      className={`${
                        errors?.fedex_services ? "border border-red-400" : ""
                      }`}
                      value={pickDataforForm.fedex_services}
                      onChange={(e) => {
                        data.setPickDataforForm((prev: any) => ({
                          ...prev,
                          fedex_services: e.target.value,
                        }));
                        handleerrors("fedex_services");
                      }}
                      name="fedex_services"
                      aria-label="Select fedex services"
                    >
                      <option value={""}>Select fedex services</option>
                      <option value={1}>IPF</option>
                      <option value={2}>IEF</option>
                      <option value={3}>IP</option>
                    </FormSelect>
                  </div>
                </div>
              </>
            ) : null}

            {(pickDataforForm?.shipment_type == 4 ||
              pickDataforForm?.shipment_type == 5) &&
            pickDataforForm?.import_booking == 1 &&
            data?.vendorData
              ?.find(
                (item: any) => item?.product_id == pickDataforForm?.courier_id,
              )
              ?.product_name?.toLowerCase()
              ?.includes("aramex") ? (
              <div className="flex gap-4 mb-2">
                <div className="w-1/2">
                  <FormLabel>Aramex Product Code</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <br />
                  <FormSelect
                    className={`${
                      errors?.courier_vendor_code ? "border border-red-400" : ""
                    }`}
                    value={pickDataforForm.courier_vendor_code}
                    onChange={(e) => {
                      data.setPickDataforForm((prev: any) => ({
                        ...prev,
                        courier_vendor_code: e.target.value,
                      }));
                      handleerrors("courier_vendor_code");
                    }}
                    name="courier_vendor_code"
                    aria-label="Select courier_vendor_code"
                  >
                    <option value={""}>Select</option>
                    {aramexProductList.map(
                      (item: any) =>
                        item?.is_active == 1 && (
                          <option key={item.id} value={item.code}>
                            {item.code}
                          </option>
                        ),
                    )}
                  </FormSelect>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-12  gap-4 mt-4">
          {" "}
          <div className="mb-2 col-span-12 lg:col-span-6">
            <FormLabel>IS Remarks</FormLabel>
            <FormTextarea
              name="address"
              className="px-2 py-2 h-20"
              autoComplete="off"
              value={pickDataforForm?.franchisee_remarks || ""}
              disabled
              // onChange={(e) =>
              //   data.setPickDataforForm((prev: any) => ({
              //     ...prev,
              //     remarks: e.target.value,
              //   }))
              // }
            ></FormTextarea>
          </div>
          <div className="mb-2 col-span-12 lg:col-span-6">
            <FormLabel>
              Remarks <span className="text-red-400">*</span>
            </FormLabel>
            <FormTextarea
              name="remarks"
              // disabled={!approvedSelect}
              className={`px-2 py-2 h-20 ${
                remarks ? "border border-red-400" : ""
              }`}
              autoComplete="off"
              value={pickDataforForm?.remarks}
              onChange={(e) => {
                data.setPickDataforForm((prev: any) => ({
                  ...prev,
                  remarks: e.target.value,
                }));
                handleerrors("remarks");
              }}
            ></FormTextarea>
          </div>
        </div>
        <div className="mb-4 mt-4">
          {
            dimensionData.length > 0 && checkallfiled([], dimensionData) ? (
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
                  setJobData={setPickDataforForm}
                  jobdata={pickDataforForm}
                  checkdisable={true}
                  currencyData={currencydata}
                  currencyId={pickDataforForm?.currency_id}
                  weightData={weightData}
                  weightUnit={pickDataforForm?.weight_unit}
                />
              </div>
            ) : (
              ""
            )
            //  (
            //   <div>
            //     { dimensionData?.length == 0 ? (
            //       <Button
            //         className="bg-mustard text-white p-2"
            //         onClick={() => {
            //           setDimensionPreview(true);
            //           setIsEditDimension(false);
            //         }}
            //       >
            //         Add Dimension
            //       </Button>
            //     ) : (
            //       ""
            //     )}
            //   </div>
            // )
          }
          {/* <DimensionModal
            open={dimensionPreview}
            onClose={() => {
              setDimensionPreview(false);
              setIsEditDimension(false);
            }}
            dimensionData={dimensionData}
            setDimensionData={setDimensionData}
            isEditDimension={isEditDimension}
            editIndex={editIndex}
            editDimensionData={isEditDimension ? editDimensionData : undefined}
            showHsn={true}
            isSpot={true}
            checkdisable={true}
            weightUnit={pickDataforForm?.weight_unit}
            currencyData={currencydata}
            currencyId={pickDataforForm?.currency_id}
          /> */}
        </div>
        {approvedSelect != 2 && pickDataforForm?.enquiry_from != 4 ? (
          <SellBuyForm
            chargesdata={chargesList}
            spotData={pickDataforForm}
            sellingcharges={sellingcharges}
            setSellingCharges={setSellingCharges}
            buycharges={buycharges}
            setBuyCharges={setBuyCharges}
            franchiseedata={pickDataforForm?.franchiseedata || []}
            selectedfranchisedata={selectedfranchisedata}
            setSelectedfranchisedata={setSelectedfranchisedata}
            currencydata={currencydata}
            fun1={fun1}
            funtoempty={funtoempty}
            exchangedata={exchangedata}
            setExchangedata={setExchangedata}
            exchangedataSell={exchangedataSell}
            setExchangedataSell={setExchangedataSell}
            totalbuy={totalbuy}
            totalSell={totalSell}
            toggle={toggle}
            setToggle={setToggle}
            alltypedata={alltypedata}
            forwhat={"pricing"}
            hasUpdated={hasUpdated}
            setHasUpdated={setHasUpdated}
            addedbuyingcharges={addedbuyingcharges}
            addedsellingcharges={addedsellingcharges}
            importBookingType={pickDataforForm?.import_booking}
            currencyname={
              currencydata?.find(
                (item: any) => item?.id == signlefdata?.currency,
              )?.currency || ""
            }
            singlefranchiseedata={signlefdata}
          />
        ) : (
          ""
        )}
        {/* <div className="mt-2 p-2">
          <Table
            heightTable="45vh"
            columns={columns}
            row={rows}
            margin="mt-0"
            showSno={true}
          />
        </div> */}
      </div>
    </>
  );

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
