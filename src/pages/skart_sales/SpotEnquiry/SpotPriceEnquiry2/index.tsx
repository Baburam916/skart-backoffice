import React, { useEffect, useRef, useState } from "react";
import {
  FormCheck,
  FormInline,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../../base-components/Form";
import Button from "../../../../base-components/Button";
import Table from "../../../../base-components/Table";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAlert } from "../../../../ContextProvider/AlertContext";
import LoadingGif from "../../../assets/images/icons/loading.gif";
import ErrorGif from "../../../../assets/images/icons/error.gif";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import Lucide from "../../../../base-components/Lucide";
import {
  commongetrequest,
  commonpostrequest,
  commonputrequest,
} from "../../../../AllServices/services";
import SearchableComp from "../../commoncomponents/Commonsearchablebasedcom/commonsearchablecom";
import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";
import { useLogin } from "../../commoncomponents/LoginContextProvider/LoginContextProvider";
import { Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import CommonModal from "../../commoncomponents/CommonModal/CommonModal";
import LoadingButtonCommon from "../../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import DimensionModal from "../SpotEnquiryModal/DimensionsModal";
import Tippy from "../../../../base-components/Tippy";
import {
  checkallfiled,
  ShipmentDimensions,
} from "../../commoncomponents/ShipmentDimensions/shipmentdimensions";
import { formatDate } from "../../commoncomponents/commondateformat/datetoreqformat";
import IsLoading from "../../commoncomponents/isLoading/isLoading";
const intfranchiseedata = {
  franchisee_id: "",
  franchisee_name: "",
};
const inttabledata = {
  additional_charge_id: "",
  additional_charge_unit: "",
  amount: 0,
  is_edit: false,
};
const initDimension = {
  item_description: "",
  weight: "",
  value: "",
  quantity: "",
  length: "",
  breadth: "",
  height: "",
  hsn_code: "",
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
export const formatDateDDMMYYYY = (dateString: any) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
const limitToThreeDecimals = (value: string): string => {
  const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const dotIdx = v.indexOf(".");
  if (dotIdx !== -1 && v.length - dotIdx - 1 > 3) {
    return v.slice(0, dotIdx + 4);
  }
  return v;
};
const SpotPricePart2 = () => {
  // const { franchiseeId, hubId, branchId } = useFranchisee();
  const [unitdata, setUnitData] = useState<any>([]);
  const [serviceTypedata, setServiceTypedata] = useState<any>([]);
  const [countrydata, setCountryData] = useState<any>([]);
  const [shipmentModal, setShipmentModal] = useState<boolean>(false);
  const [switchLogs, setSwitchLogs] = useState<any>("");
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [franchiseeInactive, setFranchiseeInactive] = useState(false);
  const [chargehead, setChargehead] = useState<Array<any>>([]);
  const [addchargeModal, setAddChargeModal] = useState<boolean>(false);

  const { state } = useLocation();
  const [currentStep, setCurrentStep] = useState(state?.booking?.step || 1);
  const [dimensionData, setDimensionData] = useState(
    state?.booking?.shipment_dimensions || [
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
  const [incotermType, setIncoterm] = useState([]);

  const [commoditytype, setCommodityType] = useState<any>([]);
  const [currencydata, setCurrencydata] = useState<any>([]);
  const [manageRatesTable, setManageRatesTable] = useState<any>([]);
  const [singletabledata, setSingletabledata] = useState<any>(inttabledata);
  const [isEditDimension, setIsEditDimension] = useState<boolean>(false);
  const [editDimensionData, setEditDimensionData] = useState<any>({});
  const [editIndex, setEditIndex] = useState<number>();
  const [fairlist, setFairlist] = useState<any>([]);
  const { userdata } = useLogin();

  const [products, setProducts] = useState<any>([]);
  const [spotData, setSpotData] = useState<any>({
    franchisee_id:
      state?.booking?.franchisee_id || selectedfranchisedata?.franchisee_id,
    hub_id: state?.booking?.hub_id || 0,
    forwhat: state?.booking?.forwhat || "",
    job_id: state?.booking?.job_id || "",
    commodity: state?.booking?.commodity || "",
    // credit_limit: "",
    currency_id: "24",
    branch_id: state?.booking?.branch_id || "",
    enquiry_from: 2,
    origin_country:
      state?.booking?.type == 1 || state?.booking?.type == 3
        ? state?.booking?.origin_country
        : "INDIA",
    origin_country_code:
      state?.booking?.type == 1 || state?.booking?.type == 3
        ? state?.booking?.origin_country_code
        : "IN",
    org_zip: state?.booking?.origin_pincode || "0000",
    org_city: state?.booking?.origin_city,
    org_country_id:
      state?.booking?.type == 1 || state?.booking?.type == 3
        ? state?.booking?.origin_country_id
        : "97",
    org_state:
      state?.booking?.origin_state?.trim() ||
      state?.booking?.origin_state_code?.trim() ||
      "",
    org_state_code: state?.booking?.origin_state_code || "",
    destination_country: state?.booking?.destination_country,
    destination_country_code: state?.booking?.destination_country_code,
    dest_country_id: state?.booking?.destination_country_id,
    dest_zip: state?.booking?.destination_pincode || "0000",
    dest_city: state?.booking?.city,
    dest_state_code: state?.booking?.state || "",
    state_name: state?.booking?.state_name || "",
    shipment_type: state?.booking?.shipment_type || "",
    weight: state?.booking?.weight || "",
    weight_unit: state?.booking?.weight_unit || "kgs",
    quoted_by: state?.booking?.quoted_by || "",
    // cargo_type: state?.booking?.cargo_type || "",
    clearence_type: state?.booking?.clearence_type || "",
    price_type:
      state?.booking?.type == 1 ? "" : state?.booking?.price_type || 1,
    spot_price: state?.booking?.spot_price || "",
    courier_id: state?.booking?.courier_id || "",
    courier_code: state?.booking?.courier_code || "",
    courier_name: state?.booking?.courier_name || "",
    courier_vendor_code: state?.booking?.courier_vendor_code || "",
    booking_status: 0,
    "last_scan_event (internal)": "",
    service_type: "",
    remarks: state?.booking?.remarks || "",
    incoterm: state?.booking?.incoterm || "",
    startPoint: state?.booking?.startPoint,
    ...(state?.booking?.startPoint == "listing"
      ? { booking_id: state?.booking?.booking_id }
      : {}),
    ...(state?.booking?.shipment_type == 8
      ? {
          fair_id: state?.booking?.fair_id,
          fair_venue: state?.booking?.fair_venue,
          fair_start_date: state?.booking?.fair_start_date,
          fair_end_date: state?.booking?.fair_end_date,
          is_returnable: state?.booking?.is_returnable || 0,
          mode: state?.booking?.mode,
          mode_value: state?.booking?.mode_value,
        }
      : {}),
    ...(state?.booking?.import_booking_type
      ? { import_booking_type: state?.booking?.import_booking_type }
      : {}),
    ...(state?.booking?.import_booking_type
      ? { import_booking_type: state?.booking?.import_booking_type }
      : {}),
    ...(state?.booking?.type != 2 && state?.booking?.type != 3
      ? {
          import_booking_type: state?.booking?.import_booking_type,
          import_service_type: state?.booking?.import_service_type,
        }
      : {}),
  });
  const [selectVendor, setSelectVendor] = useState<any>(
    state?.booking?.is_duplicate ? true : false,
  );
  const [weightData, setWeightData] = useState([]);
  const [saveloading, setSaveloading] = useState<boolean>(false);
  const [shipmentTypes, setShipmentTypes] = useState();
  const [checkcargo, setCheckCargo] = useState<any>("");
  const [clearanceType, setClearanceType] = useState();
  const [chargeId, setChargeId] = useState<any>("");
  const [cargoType, setCargoType] = useState();
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [vendorData, setVendorData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [editSpinner, setEditSpinner] = useState(false);
  const navigate = useNavigate();
  const [selectedFairdata, setSelectedFairdata] = useState<any>(intfairdata);
  const [selectedCommoditydata, setSelectedCommoditydata] =
    useState<any>(intcommoditydata);
  const boxRef = useRef(null);
  const fun1 = (a?: any) => {
    if (a?.is_active != 1) {
      showAlert("Franchisee is inactive. Cannot proceed with booking.", "warning");
      setSelectedfranchisedata(intfranchiseedata);
      setFranchiseeInactive(true);
      setSpotData((pre: any) => ({
        ...pre,
        branch_id: "",
        hub_id: 0,
        franchisee_id: "",
      }));
      return;
    }
    setFranchiseeInactive(false);
    setSpotData((pre: any) => ({
      ...pre,
      branch_id: a?.branch || "",
      hub_id: a?.hub || 0,
      franchisee_id: a?.franchisee_id || "",
    }));
  };
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
        countrydata?.find((item: any) => item?.country_id == a?.country)
          ?.country_name,
      ]
        .filter(Boolean)
        .join(", "),
      fair_start_date: a?.fair_start_date || "",
      fair_end_date: a?.fair_end_date || "",
    }));
  };

  const fairfuntoempty = (a?: any) => {
    //  setSelectedfranchisedata((pre:any)=>({}))

    setSpotData((pre: any) => ({
      ...pre,
      branch_id: a?.branch || "",
      hub_id: a?.hub || 0,
      franchisee_id: a?.franchisee_id || "",
    }));
  };

  const commodityfun1 = (a?: any) => {
    setSpotData((pre: any) => ({
      ...pre,
      commodity: a?.commodity_id,
    }));
    setCurrentStep(1);
  };

  const commodityfuntoempty = () => {
    setSpotData((pre: any) => ({
      ...pre,
      commodity: "",
    }));
  };
  const totalWeight = dimensionData?.reduce(
    (acc: any, item: any) => Number(acc) + Number(item.weight),
    0,
  );
  const getchweight = (value?: any) => {
    const total = value.reduce((acc, item) => {
      return (
        acc +
        Math.max(
          item?.weight,
          (Number(item?.height) *
            Number(item?.breadth) *
            Number(item?.length) *
            Number(item?.quantity)) /
            5000,
        )
      );
    }, 0);
    return total || 0;
  };

  useEffect(() => {
    if (dimensionData?.length >= 1 && dimensionData[0]?.item_description) {
      setSpotData((prev) => ({
        ...prev,
        weight: getchweight(dimensionData) || "",
      }));
    } else {
      setSpotData((prev) => ({
        ...prev,
        weight: state?.booking?.weight || "",
      }));
    }
  }, [JSON.stringify(dimensionData)]);

  const fun2 = () => {
    setSelectedfranchisedata(intfranchiseedata);
    setFranchiseeInactive(false);
    setSpotData((pre: any) => ({
      ...pre,
      branch_id: "",
      hub_id: 0,
      franchisee_id: "",
    }));
  };
  const getData = async () => {
    try {
      const results = await Promise.allSettled([
        commongetrequest(`booking/cargo-type`),
        commongetrequest("booking/weight-unit"),
        commongetrequest("booking/clearence-type"),
        commongetrequest("booking/weight-unit"),
        commongetrequest("admin/booking-shipment-type"),
        commongetrequest("booking/incoterm"),
        commongetrequest("admin/commodity-type"),
        commongetrequest("admin/charges?type=E"),
        commongetrequest("booking/currency"),
        commongetrequest("booking/service_type_list"),
        commongetrequest("admin/fair_exhibition/enquiry_dropdown"),
        commongetrequest("admin/country"),
        // commongetrequest("admin/courier-product")
      ]);

      const [
        getcargotypeRes,
        unitRes,
        getclearncetypeRes,
        getweightunitRes,
        getshipmenttypeRes,
        incodataRes,
        commodityRes,
        chargesRes,
        currencyRes,
        servicedataRes,
        fairresRes,
        countryres,
        // prodcutsRes
      ] = results;

      if (
        servicedataRes.status === "fulfilled" &&
        servicedataRes.value?.status === 200
      ) {
        setServiceTypedata(servicedataRes.value?.data?.data || []);
      }

      if (
        getcargotypeRes.status === "fulfilled" &&
        getcargotypeRes.value?.status === 200
      ) {
        setCargoType(getcargotypeRes.value?.data?.data);
      }

      if (
        getclearncetypeRes.status === "fulfilled" &&
        getclearncetypeRes.value?.status === 200
      ) {
        setClearanceType(getclearncetypeRes.value?.data?.data || []);
      }

      if (
        getweightunitRes.status === "fulfilled" &&
        getweightunitRes.value?.status === 200
      ) {
        setWeightData(getweightunitRes.value?.data?.data || []);
      }

      if (
        getshipmenttypeRes.status === "fulfilled" &&
        getshipmenttypeRes.value?.status === 200
      ) {
        setShipmentTypes(getshipmenttypeRes.value?.data?.data || []);
      }

      if (
        incodataRes.status === "fulfilled" &&
        incodataRes.value?.status === 200
      ) {
        setIncoterm(incodataRes.value?.data?.data || []);
      }

      if (
        commodityRes.status === "fulfilled" &&
        commodityRes.value?.status === 200
      ) {
        const data = commodityRes.value?.data?.data || [];
        setCommodityType(data);
        if (state?.booking?.commodity) {
          const singledata = data?.find(
            (item: any) => item?.commodity_id == state?.booking?.commodity,
          );
          if (singledata) {
            setSelectedCommoditydata({
              commodity_id: singledata?.commodity_id,
              commodity: singledata?.commodity,
            });
          }
        }
      }

      if (
        currencyRes.status === "fulfilled" &&
        currencyRes.value?.status === 200
      ) {
        setCurrencydata(currencyRes.value?.data?.data || []);
      }

      if (
        chargesRes.status === "fulfilled" &&
        chargesRes.value?.status === 200
      ) {
        setChargehead(chargesRes.value?.data?.data || []);
      }

      if (unitRes.status === "fulfilled" && unitRes.value?.status === 200) {
        setUnitData(unitRes.value?.data?.data || []);
      }

      if (
        fairresRes.status === "fulfilled" &&
        fairresRes.value?.status === 200
      ) {
        const data = fairresRes.value?.data?.data || [];
        setFairlist(data || "");
        if (state?.booking?.fair_id) {
          const singledata = data?.find(
            (item: any) => item?.fair_id == state?.booking?.fair_id,
          );
          setSelectedFairdata((pre: any) => ({
            ...pre,
            fair_id: singledata?.fair_id,
            fair_name: singledata?.fair_name,
          }));
        }
      }
      if (
        countryres.status === "fulfilled" &&
        countryres.value?.status === 200
      ) {
        const data = countryres.value?.data?.data || [];
        setCountryData(data || "");
      }

      // if (prodcutsRes.status === "fulfilled" && prodcutsRes.value?.status === 200) {
      //   setProducts(prodcutsRes.value?.data?.data || []);
      // }
    } catch (err: any) {
      console.log("Unexpected error:", err?.message);
    }
  };
  useEffect(() => {
    setVendorData([]);
    setProducts([]);
    if (!spotData?.courier_id) {
      setSelectVendor(false);
    }

    setSpotData((prev) => ({
      ...prev,
      courier_id: state?.booking?.courier_id || "",
      courier_code: state?.booking?.courier_code || "",
      courier_name: state?.booking?.courier_name || "",
      courier_vendor_code: state?.booking?.courier_vendor_code || "",
      price_type:
        state?.booking?.type == 1 ? "" : state?.booking?.price_type || 1,
      spot_price: state?.booking?.spot_price || "",
      shipment_charges: "",
      mode_value: "",
    }));
    setCurrentStep(1);
    setCheckCargo("");
  }, [
    JSON.stringify(dimensionData),
    spotData?.franchisee_id,
    spotData?.weight,
    spotData?.shipment_type,
    spotData?.weight_unit,
    spotData?.clearence_type,
    spotData?.quoted_by,
    spotData?.remarks,
    spotData?.incoterm,
    spotData?.currency_id,
    spotData?.import_booking_type,
  ]);
  const handleDelete = (e, index) => {
    e.stopPropagation();
    e.isPropagationStopped();
    let newData = [...dimensionData];
    if (newData?.length == 1) {
      newData = [
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
      ];
    } else {
      newData.splice(index, 1);
    }

    setDimensionData(newData);
  };
  const getvendordata = async (data: any) => {
    try {
      setIsLoading(true);
      const response: any = await commonpostrequest(`admin/get-rates`, data);

      if (response?.status == 200) {
        setVendorData(response?.data?.data);
      } else if (response?.message == "Network Error") {
        showAlert(response?.message, "error");
      } else if (response?.response?.status == 500) {
        showAlert("Internal Server Error", "error");
      } else if (response?.response?.status == 400) {
        showAlert(response?.response?.message, "error");
      } else if (response?.response?.status == 401) {
        showAlert("Unauthorized", "error");
      } else if (response?.response?.status == 404) {
        showAlert("Not Found", "error");
      } else if (response?.response?.status == 502) {
        showAlert("Bad GateWay", "error");
      } else {
        showAlert("Something went wrong", "error");
      }
      setIsLoading(false);
    } catch (err: any) {
      showAlert(err?.message, "error");
      setIsError(true);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
    setCheckCargo("");
    setCurrentStep(2);
  };
  //   const getcargocourierproduct = async (data?: any) => {
  //     const res = await commongetrequest(
  //       `admin/cargo-courier-product?shipment_type=${
  //         spotData?.shipment_type
  //       }&hub_id=${data?.hub_id || spotData?.hub_id || 0}&country_id=${
  //         data?.booking?.destination_country_id || spotData?.dest_country_id
  //       }`
  //     setIsLoading(false);
  //   } catch (err: any) {
  //     showAlert(err?.message, "error");
  //     setIsError(true);
  //     setIsLoading(false);
  //     // console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  //   setCheckCargo("");
  //   setCurrentStep(2);
  //  }

  const getcargocourierproduct = async (data?: any) => {
    const res = await commongetrequest(
      `admin/cargo-courier-product?shipment_type=${
        spotData?.shipment_type
      }&hub_id=${data?.hub_id || spotData?.hub_id || 0}&country_id=${
        data?.booking?.destination_country_id == 97 ||
        spotData?.dest_country_id == 97
          ? spotData?.org_country_id || data?.booking?.origin_country_id
          : data?.booking?.destination_country_id || spotData?.dest_country_id
      }&is_import=${state?.booking?.type == 1 ? 1 : 0}`,
    );
    if (res?.status == 200) {
      setCurrentStep(1);
      setCheckCargo(1);
      setProducts(res?.data?.data || []);

      boxRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (res?.status == 204) {
      setProducts([]);
      setCurrentStep(1);
      setCheckCargo(1);
    } else if (res?.response?.status == 400) {
      showAlert(
        res?.response?.data?.message ||
          "Something going wrong please try after some time!!",
        "error",
      );
    } else if (res?.status == 204) {
      setProducts([]);
      setCurrentStep(1);
      setCheckCargo(1);
    } else if (res?.response?.status == 400) {
      showAlert(
        res?.response?.data?.message ||
          "Something going wrong please try after some time!!",
        "error",
      );
    } else {
      showAlert("Something going wrong please try after some time!!", "error");
    }
  };
  useEffect(() => {
    if (state?.booking?.is_duplicate) {
      setSelectVendor(true);
      if (state?.booking?.courier_id) {
        setSelectVendor(true);
      }
      if (
        state?.booking?.shipment_type == 5 ||
        state?.booking?.shipment_type == 8 
      ) {
        getcargocourierproduct(state?.booking);
      } else {
        getvendordata(state?.booking);
      }
    }
  }, []);
  // console.log(spotData,"spotdata, coming ")
  const handleGetQuote = async () => {
    let empty = {
      shipment_type: spotData?.shipment_type,
      weight: spotData?.weight,
      weight_unit: spotData?.weight_unit,
      quoted_by: spotData?.quoted_by,
      ...(spotData?.shipment_type == 8
        ? {
            fair_id: spotData?.fair_id,
            fair_venue: spotData?.fair_venue,
            fair_start_date: spotData?.fair_start_date,
            fair_end_date: spotData?.fair_end_date,
            // fair_date: spotData?.fair_date,
          }
        : {}),
      commodity: spotData?.commodity,
      currency: spotData?.currency_id || "24",
      // service_type: spotData?.service_type,

      ...(spotData?.shipment_type == 4 ||
      spotData?.shipment_type == 6 ||
      spotData?.shipment_type == 5 ||
      spotData?.shipment_type == 8
        ? {
            // cargo_type: spotData?.cargo_type,
            clearence_type: spotData?.clearence_type,
            incoterm: spotData?.incoterm,
          }
        : {}),
      ...((spotData?.shipment_type == "4" || spotData?.shipment_type == "5") &&
      spotData?.dest_country_id == 97 &&
      spotData?.org_country_id != 97
        ? { import_booking_type: spotData?.import_booking_type }
        : {}),
      ...(state?.booking?.type != 2 && state?.booking?.type != 3
        ? { import_service_type: spotData?.import_service_type }
        : {}),
    };

    if (!selectedfranchisedata?.franchisee_id) {
      showAlert("Please Provide Franchisee", "warning");
      return;
    }

    for (let key in empty) {
      if (empty[key] == "" || empty[key] == undefined) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }
    const lastItem = dimensionData[dimensionData?.length - 1];

    const filledKeys = Object.entries(lastItem)
      .filter(([_, value]) => value?.toString().trim() !== "") // filter non-empty
      .map(([key]) => key);

    if (
      (dimensionData[dimensionData?.length - 1]?.item_description &&
        !checkallfiled(["box_no"], dimensionData)) ||
      (dimensionData?.length > 1 && !checkallfiled([], dimensionData)) ||
      (filledKeys?.length >= 1 &&
        filledKeys?.length < Object.keys(lastItem)?.length)
    ) {
      showAlert("Please provide dimensions or remove empty entries", "warning");
      return;
    }
    let data = {};

    if (spotData?.shipment_type == 1) {
      data = {
        franchisee:
          selectedfranchisedata?.franchisee_id || state?.booking?.franchisee_id,
        booking_type:
          spotData?.dest_country_id != spotData?.org_country_id ? 1 : 2,
        origin_pincode: spotData?.org_zip,
        destination_country: spotData?.dest_country_id,
        country_code: spotData?.destination_country_code || "",
        destination_pincode: spotData?.dest_zip,
        state_name: spotData?.state_name,
        unit: {
          weight_unit: spotData?.weight_unit,

          length_unit: "cms",
          currency: spotData?.currency_id || "24",
        },
        shipment_type: spotData?.shipment_type,
        weight: spotData?.weight,
        import_booking:
          state?.booking?.type == 1 ? 2 : state?.booking?.type == 3 ? 3 : 1,
        ...(state?.booking?.type == 1
          ? {
              origin_city: spotData?.org_city,
              origin_country: spotData?.org_country_id,
              origin_country_code: spotData?.origin_country_code,
              origin_pincode: spotData?.org_zip,
              origin_state: spotData?.org_state_code,
              origin_state_name: spotData?.org_state,
              org_state: spotData?.org_state || "",
              state: spotData?.dest_state_code,

              import_booking_type: state?.booking?.import_booking_type || "",
            }
          : {}),
      };
    } else if (
      spotData?.shipment_type == 4 ||
      spotData?.shipment_type == 6 ||
      spotData?.shipment_type == 7
    ) {
      data = {
        franchisee:
          selectedfranchisedata?.franchisee_id || state?.booking?.franchisee_id,
        booking_type:
          spotData?.dest_country_id != spotData?.org_country_id ? 1 : 2,
        origin_pincode: spotData?.org_zip,
        destination_country: spotData?.dest_country_id,
        country_code: spotData?.destination_country_code || "",
        destination_pincode: spotData?.dest_zip,
        state_name: spotData?.state_name,
        unit: {
          weight_unit: spotData?.weight_unit,
          length_unit: "cms",
          currency: spotData?.currency_id || "24",
        },
        shipment_type: spotData?.shipment_type,
        weight: spotData?.weight,
        // cargo_type: spotData?.cargo_type,
        clearance_type: spotData?.clearence_type,
        incoterm: spotData?.incoterm,
        import_booking:
          state?.booking?.type == 1 ? 2 : state?.booking?.type == 3 ? 3 : 1,
        ...(state?.booking?.type == 1
          ? {
              origin_city: spotData?.org_city,
              origin_country: spotData?.org_country_id,
              origin_country_code: spotData?.origin_country_code,
              origin_pincode: spotData?.org_zip,
              origin_state: spotData?.org_state_code,
              origin_state_name: spotData?.org_state,
              org_state: spotData?.org_state || "",
              state: spotData?.dest_state_code,
            }
          : {}),
      };
    }

    if (spotData?.shipment_type == 5 || spotData?.shipment_type == 8) {
      getcargocourierproduct(data);
    } else {
      getvendordata(data);
    }
  };

  const SpotBooking = async () => {
    const empty: any = {
      product_type: spotData?.courier_name || "",
    };

    if (!checkcargo && state?.booking?.type != 1) {
      empty["price_type"] = spotData?.price_type || "";
      empty["spot_price"] = spotData?.spot_price || "";
    }

    for (let key in empty) {
      if (empty[key] == "" || empty[key] == undefined) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }

    setSpinner(true);

    if (
      dimensionData?.length >= 1 &&
      dimensionData[0]?.item_description &&
      checkallfiled([], dimensionData)
    ) {
      spotData.shipment_dimensions = dimensionData;
    }

    const newdata = {
      ...spotData,
      import_booking:
        state?.booking?.type == 2 ? 1 : state?.booking?.type == 3 ? 3 : 2,
      booking_type:
        spotData?.dest_country_id != spotData?.org_country_id ? 1 : 2,
    };
    if (spotData?.shipment_type == 1) {
      // delete newdata["cargo_type"];
      delete newdata["incoterm"];
      delete newdata["clearence_type"];
    }
    if (spotData?.shipment_type != 8) {
      delete newdata["mode"];
      delete newdata["mode_value"];
      delete newdata["fair_data"];
    }
    if (!newdata?.remarks) {
      delete newdata["remarks"];
    }
    try {
      const response = await commonpostrequest(
        `booking/raise_spot_enquiry`,
        newdata,
      );
      if (response?.data?.status == 200) {
        showAlert(
          response?.data?.message || "Spot Enquiry Submitted Successfully",
          "success",
        );
        navigate("/backoffice/dashboard");
      } else if (response?.status == 400 || response?.status == 203) {
        showAlert(response?.data?.message || response?.data?.error, "warning");
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  const updateSpotBooking = async () => {
    const empty = {
      product_type: spotData?.courier_id || state?.booking?.courier_id || "",
      price_type: spotData?.price_type || state?.booking?.price_type || "",
      spot_price: spotData?.spot_price || state?.booking?.spot_price || "",
    };

    for (let key in empty) {
      if (empty[key] == "" || empty[key] == undefined) {
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }

    setEditSpinner(true);
    try {
      const response = await commonputrequest(
        `booking/raise_spot_enquiry`,
        spotData,
      );
      if (response?.data?.status == 200) {
        showAlert("Spot Enquiry Updated Successfully");
        navigate("/backoffice/sales_operations/spot_price_list");
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setEditSpinner(false);
    }
  };

  useEffect(() => {
    getData();
    setSelectedfranchisedata((pre: any) => ({
      ...pre,
      franchisee_id: state?.booking?.franchisee_id || "",
      franchisee_name: state?.booking?.franchisee_name || "",
    }));
  }, []);
  const handleweightupdate = async () => {
    try {
      setSaveloading(true);
      const res = await commonpostrequest("admin/weight-range", {
        range: manageRatesTable,
      });
      if (res?.status == 200) {
        showAlert(res?.data?.message);
        handleCancel();
      } else {
        showAlert("Something going wrong!! please try afer some time", "error");
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setSaveloading(false);
    }
  };

  const handleCancel = () => {
    setSingletabledata(inttabledata);
    setManageRatesTable([]);
    setAddChargeModal(false);
    // setIsManage(false);
    // getweightrange();
    // setBuyingfile("");
    // setSellingfile("");
    // setShipmentType("");
  };
  const handleaction = (
    forwhat: string,
    index?: any,
    name?: any,
    name2?: any,
    value?: any,
    value2?: any,
  ) => {
    if (forwhat == "add") {
      const newdata = [...manageRatesTable];
      const { additional_charge_id, amount, additional_charge_unit } =
        singletabledata;
      // const newdata2 = newdata.map((item: any) => ({ ...item, is_edit: false }));
      newdata.push({
        additional_charge_id,
        amount: amount || 0,
        additional_charge_unit,
      });
      setManageRatesTable(newdata);
      setSingletabledata(inttabledata);
    }
    //      else if (forwhat == "edit") {
    //       const newdata = [...manageRatesTable];
    //       // newdata[index].name=value
    //       const maindata = newdata?.map((item: any, indexvalue) =>
    //         indexvalue == index
    //           ? { ...item, is_edit: false }
    //           : { ...item, is_edit: true }
    //       );
    // newdata[index]=singletabledata
    //       setManageRatesTable(newdata || []);
    //     }
    else if (forwhat == "delete") {
      const newdata = [...manageRatesTable];
      newdata.splice(index, 1);
      setManageRatesTable(newdata);
    } else if (forwhat == "Edit") {
      const newdata = [...manageRatesTable];
      const newdata2 = newdata?.map((item: any) =>
        item?.is_edit
          ? {
              amount: singletabledata?.amount,
              additional_charge_id: singletabledata?.additional_charge_id,
              additional_charge_unit: singletabledata?.additional_charge_unit,
              is_edit: false,
            }
          : item,
      );

      // setSingletabledata((pre: any) => ({
      //   ...pre,

      //   additional_charge_id: value || 0,
      // }));

      // if (name == "to_weight" && index !== newdata?.length - 1) {
      //   const newdata = [...manageRatesTable];
      //   newdata[index + 1].from_weight = value || 0;
      // }

      setManageRatesTable(newdata2);
      setSingletabledata(inttabledata);
    }
  };

  const shipmentModalDescription = (
    <>
      <ShipmentDimensions
        dimensionData={dimensionData}
        setDimensionData={setDimensionData}
        setJobData={setSpotData}
        jobdata={spotData}
        currencyData={currencydata}
        currencyId={spotData?.currency_id}
        weightData={weightData}
        weightUnit={spotData?.weight_unit}
      />
    </>
  );
  const shipmentModalFooter = (
    <div className="">
      <div className="flex justify-end items-end">
        <Button
          className="p-2 bg-gray-200 w-[100px]"
          onClick={() => {
            if (
              dimensionData?.length > 1 &&
              !checkallfiled([], dimensionData)
            ) {
              showAlert("please remove empty entries or filed required fields");
            } else if (
              dimensionData?.length == 1 &&
              !checkallfiled([], dimensionData)
            ) {
              const newdata = [...dimensionData];
              setDimensionData([initDimension]);
              setShipmentModal(false);
            } else {
              setShipmentModal(false);
            }
          }}
        >
          Cancel
        </Button>
        <Button
          className="p-2 bg-success text-white ml-2 w-[100px]"
          onClick={() => {
            const excludedKeys: any = []; // Add keys you want to exclude

            const isAllFilled = dimensionData.every((item: any) =>
              Object.entries(item).every(([key, value]) =>
                excludedKeys.includes(key)
                  ? true
                  : value !== "" &&
                    value !== null &&
                    value !== undefined &&
                    value !== 0 &&
                    Number(value) !== 0,
              ),
            );
            if (isAllFilled) {
              setSpotData((pre: any) => ({
                ...pre,
                shipment_dimensions: dimensionData,
              }));
              setShipmentModal(false);
            } else {
              showAlert(
                "Please provide all required fields or  remove empty entries",
              );
            }
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
  const shipmentModalTitle = (
    <>
      <h1>Shipment Dimensions</h1>
    </>
  );
  const ModalFooter2 = (
    <>
      <Button
        type="button"
        onClick={() => {
          handleCancel();
        }}
        className="w-20 text-white mr-1  bg-gray-500 p-2"
      >
        Cancel
      </Button>
      {saveloading ? (
        <Button variant="mustard" className=" p-2 ml-2">
          <LoadingButtonCommon text={"Saving"} />
        </Button>
      ) : (
        <Button
          variant="mustard"
          disabled={
            manageRatesTable?.filter((item: any) => item?.is_edit)?.length >=
              1 ||
            !manageRatesTable[manageRatesTable?.length - 1]
              ?.additional_charge_id ||
            !manageRatesTable[manageRatesTable?.length - 1]
              ?.additional_charge_unit
          }
          onClick={() => setAddChargeModal(false)}
          className="ml-2 w-20 p-2"
        >
          SAVE
        </Button>
      )}
    </>
  );

  // Modal title
  const ModalTitle2 = (
    <>
      <h2 className="mr-auto text-base font-medium">Additional Charges</h2>
    </>
  );

  // Modal description
  const findparticulardata = (forwhat?: any, id?: any, data?: any) => {
    if (forwhat == "charge") {
      const singledata = data?.find((item: any) => item?.charge_id == id);

      return singledata;
    } else if (forwhat == "unit") {
      const singledata = unitdata?.find((item: any) => item?.id == id);

      return singledata;
    }
    return;
  };
  const ModalDescription2 = (
    <>
      <div className="col-span-12">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <FormLabel className={`flex items-center text-500 `}>
                  CHARGE HEAD
                </FormLabel>
                <FormSelect
                  value={singletabledata?.additional_charge_id}
                  onChange={(e) => {
                    setSingletabledata((pre: any) => ({
                      ...pre,
                      additional_charge_id: e.target.value,
                    }));
                  }}
                  name="chargehead"

                  //  className={`${allErrors?.chargehead ? "border-red-400" : ""}`}
                >
                  <option value="">Select Head</option>
                  {chargehead
                    .filter(
                      (item) =>
                        item.group_type == "E" && item.debit_note_charge == 0,
                    )
                    ?.map((item, key) => (
                      <option value={item.charge_id} key={key}>
                        {item.charge_name}
                      </option>
                    ))}
                </FormSelect>
              </div>
              <div className="col-span-3">
                <FormLabel className={`flex items-center text-500 `}>
                  UNIT
                  <span className="text-red-400">*</span>
                </FormLabel>
                <FormSelect
                  value={singletabledata?.additional_charge_unit}
                  onChange={(e) => {
                    setSingletabledata((pre: any) => ({
                      ...pre,
                      additional_charge_unit: e.target.value,
                    }));
                  }}
                  name="additional_charge_unit"

                  //  className={`${allErrors?.chargehead ? "border-red-400" : ""}`}
                >
                  <option value="">Select Unit</option>
                  {unitdata?.map((item: any, key: any) => (
                    <option value={item.id} key={key}>
                      {item.value}
                    </option>
                  ))}
                </FormSelect>
              </div>
              <div className="col-span-3">
                <FormLabel>Amount</FormLabel>
                <FormInput
                  value={singletabledata?.amount}
                  onChange={(e) => {
                    setSingletabledata((pre: any) => ({
                      ...pre,
                      amount: limitToThreeDecimals(e.target.value),
                    }));
                  }}
                  onBlur={(e: any) => {
                    const value = e.target.value;
                    if (value) {
                      if (Number(value) < 0) {
                        showAlert("Value Can't be Negative", "warning");
                        setSingletabledata((pre: any) => ({
                          ...pre,
                          amount: 0,
                        }));
                      }
                    }
                  }}
                  placeholder="Amount"
                  type="text"
                />
              </div>
              <div className="col-span-3 ">
                <Button
                  variant="mustard"
                  className="p-1.5 mt-7"
                  disabled={
                    !singletabledata?.additional_charge_id ||
                    !singletabledata?.additional_charge_unit
                  }
                  onClick={() => {
                    manageRatesTable?.filter((item: any) => item?.is_edit)
                      ?.length >= 1
                      ? handleaction("Edit")
                      : handleaction("add");
                  }}
                >
                  <Plus />{" "}
                  {manageRatesTable?.filter((item: any) => item?.is_edit)
                    ?.length >= 1
                    ? "EDIT"
                    : "ADD"}
                </Button>
              </div>
            </div>
          </div>
          {/* <div className="col-span-3">
             <FormLabel htmlFor="modal-form-1">
               Shipment Type<span className="text-red-400">*</span>
             </FormLabel>
             <FormSelect
               value={shipmenttype}
           

               onChange={(e: any) => {
                 setShipmentType(e.target.value);
                 const value = e.target.value;

                 if (value == 1 || value == 4) {
                   const newdata = initialratesdata.filter(
                     (item: any) => item?.shipment_type == 1
                   );
                   setManageRatesTable(newdata || []);
                   if (newdata?.length >= 1) {
                     setSingletabledata((pre: any) => ({
                       ...pre,
                       from_weight: newdata[newdata?.length - 1].to_weight,
                     }));
                   } else {
                     setSingletabledata(inttabledata);
                   }
                 } else {
                   const newdata = initialratesdata.filter(
                     (item: any) => item?.shipment_type == 2
                   );
                   setManageRatesTable(newdata || []);
                   if (newdata?.length >= 1) {
                     setSingletabledata((pre: any) => ({
                       ...pre,
                       from_weight: newdata[newdata?.length - 1].to_weight,
                     }));
                   } else {
                     setSingletabledata(inttabledata);
                   }
                 }
               }}
               // onChange={handleChange}
               // className={`${TO
               //   interrors.country_name ? "border border-red-400" : ""
               // }`}
             >
               <option value={""}>Select</option>
               <option value={1}>Non Document</option>
               <option value={2}>Document</option>
             </FormSelect>
           </div> */}
          {/* <div className="col-span-3">
             <FormLabel htmlFor="modal-form-1">
               FROM<span className="text-red-400">*</span>
             </FormLabel>
             <FormInput
               id="modal-form-1"
               type="number"
               name="from_weight"
               value={singletabledata?.from_weight || 0}
               disabled
               onChange={(e: any) =>
                 setSingletabledata((pre: any) => ({
                   ...pre,
                   from_weight: e.target.value,
                 }))
               }
               // value={intdatatopost?.country_name}
               //  value={currentpassword}
               placeholder="From"
               // onChange={handleChange}
               // className={`${
               //   interrors.country_name ? "border border-red-400" : ""
               // }`}
             />
           </div>
           <div className="col-span-3">
             <FormLabel htmlFor="modal-form-1">
               TO<span className="text-red-400">*</span>
             </FormLabel>
             <FormInput
               id="modal-form-1"
               type="number"
               name="to_weight"
               value={singletabledata?.to_weight}
               ref={ref}
               //  value={currentpassword}
               placeholder="TO"
               onBlur={(e: any) => {
                 if (
                   Number(e.target.value) &&
                   Number(singletabledata?.from_weight) > Number(e.target.value)
                 ) {
                   showAlert("From value can't be greater then To", "warning");
                   setSingletabledata((pre: any) => ({
                     ...pre,
                     to_weight: "",
                   }));
                 } else if (
                   Number(e.target.value) &&
                   Number(e.target.value) > rangelimit
                 ) {
                   showAlert(
                     `Value Can't be greater than ${rangelimit}Kg`,
                     "warning"
                   );
                   setSingletabledata((pre: any) => ({
                     ...pre,
                     to_weight: "",
                   }));
                 }
               }}
               onChange={(e: any) =>
                 setSingletabledata((pre: any) => ({
                   ...pre,
                   to_weight: e.target.value,
                 }))
               }
               // onChange={handleChange}
               // className={`${TO
               //   interrors.country_name ? "border border-red-400" : ""
               // }`}
             />
           </div> */}

          <div className="col-span-12 ">
            <div className="">
              <Table hover sm className="whitespace-nowrap ">
                {/* Table headers */}
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="px-1 py-1 text-center">
                      CHARGE NAME
                    </Table.Th>

                    <Table.Th className="px-1 py-1 text-center">UNIT</Table.Th>
                    <Table.Th className="px-1 py-1 text-center">
                      AMOUNT
                    </Table.Th>
                    <Table.Th className="px-1 py-1">ACTION</Table.Th>
                  </Table.Tr>
                </Table.Thead>

                {/* Table body */}
                <Table.Tbody>
                  {manageRatesTable.map((row: any, index: number) => (
                    <Table.Tr key={index}>
                      <Table.Td className="px-1 py-1">
                        <input
                          type="text"
                          value={
                            findparticulardata(
                              "charge",
                              row?.additional_charge_id || 0,
                              chargehead,
                            )?.charge_name || ""
                          }
                          disabled={true}
                          onChange={(e: any) =>
                            handleaction(
                              "editvalue",
                              index,
                              "additional_charge_id",
                              e.target.value,
                            )
                          }
                          onBlur={(e: any) => {
                            if (!e.target.value) {
                              showAlert("Please Provide the Value");
                              //  const newdata = [...manageRatesTable];

                              //  newdata[index].from_weight =
                              //    newdata[index - 1].to_weight;
                            } else {
                            }
                          }}
                          className={`w-full p-2 border border-gray-300
                        
                            rounded`}
                          //        ${
                          //    row?.is_edit ? "bg-gray-300" : "bg-white"
                          //  }
                        />
                      </Table.Td>
                      <Table.Td className="px-1 py-1">
                        <input
                          type="text"
                          value={
                            findparticulardata(
                              "unit",
                              row?.additional_charge_unit || 0,
                              unitdata,
                            )?.value || ""
                          }
                          disabled={true}
                          className={`w-full p-2 border border-gray-300
                        
                            rounded`}
                          //        ${
                          //    row?.is_edit ? "bg-gray-300" : "bg-white"
                          //  }
                        />
                      </Table.Td>
                      <Table.Td className="px-1 py-1">
                        <input
                          type="number"
                          value={row?.amount}
                          disabled={true}
                          onBlur={(e: any) => {
                            if (
                              Number(e.target.value) <
                              Number(manageRatesTable[index]?.from_weight)
                            ) {
                              showAlert(
                                "To (value) can't be less then from (value)",
                                "warning",
                              );
                              const newdata = [...manageRatesTable];
                              // if(newdata?.length>=1){

                              // }
                              newdata[index].to_weight = "";
                            }
                          }}
                          onChange={(e: any) =>
                            handleaction(
                              "editvalue",
                              index,
                              "to_weight",
                              e.target.value,
                            )
                          }
                          className={`w-full p-2 border border-gray-300   rounded`}
                          //  ${
                          //    row?.is_edit ? "bg-gray-300" : "bg-white"
                          //  }
                        />
                      </Table.Td>

                      <Table.Td className="px-1 py-1">
                        <div className="flex justify-center items-center">
                          <Button
                            // disabled={postloading}
                            onClick={() => handleaction("delete", index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            {/* <Minus className="w-4 h-4" />Minus */}
                            <Trash2 className="text-red-400" />
                          </Button>
                          <button
                            onClick={() => {
                              const newdata = [...manageRatesTable];
                              const newdata2 = newdata?.map((item, index2) => ({
                                ...item,
                                is_edit: index2 == index ? true : false,
                              }));
                              setManageRatesTable(newdata2);
                              setSingletabledata(manageRatesTable[index]);
                            }}
                            className="text-green-500 hover:text-green-700 ml-2"
                          >
                            <Pencil />
                          </button>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {/* <div className="flex justify-end mt-6">
              <Button
                variant="success"
                disabled={postloading}
                onClick={saveData}
                className=" text-white w-[150px] py-2 px-4 rounded "
              >
                {postloading ? <LoadingButtonCommon text="Saving" /> : "Save"}
              </Button>
            </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div
        className="p-2 my-2 cursor-pointer rounded-full shadow-lg mr-4 w-8  bg-white"
        onClick={() => navigate(-1)}
      >
        <Lucide icon="ArrowLeft" className="w-4 h-4 stroke-2.5 text-mustard" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="w-full md:w-[65%] ">
          <div className="box my-4">
            <div className="box w-full  px-4 py-2  intro-x font-medium cursor-pointer text-sm flex flex-row justify-between gap-4 rounded-lg bg-white h-auto">
              <div>
                <div>
                  <span className="mt-2 text-lg font-bold">ORIGIN </span>
                </div>

                <div className="flex gap-2 ">
                  <div className="text-center p-1 border-2 h-auto  sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
                    <img
                      src={`https://flagsapi.com/${spotData?.origin_country_code}/flat/32.png`}
                      alt="origin-flag"
                    />
                    <span className="text-sm block sm:hidden">
                      {" "}
                      {spotData?.org_zip || "0000"}
                    </span>
                    <span className="text-sm">
                      ({spotData?.origin_country_code})
                    </span>
                  </div>
                  <div className=" p-1 pt-2 h-14 min-w-28 border-2 rounded hidden sm:flex flex-col  justify-center">
                    <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {spotData?.origin_country}
                    </h1>
                    <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                      ({spotData?.org_zip})
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

              <div>
                <div>
                  <span className="mt-2 text-lg font-bold">DESTINATION</span>
                </div>

                <div className="flex gap-2 ">
                  <div className="text-center p-1 border-2 h-auto mx-6 sm:mx-0 sm:h-14 w-full  sm:w-10 rounded flex flex-col items-center">
                    <img
                      src={`https://flagsapi.com/${spotData?.destination_country_code}/flat/32.png`}
                      alt="destination-flag"
                    />
                    <span className="text-sm block sm:hidden">
                      {spotData?.dest_zip == "0000"
                        ? spotData?.dest_city
                        : spotData?.dest_zip}
                    </span>
                    <span className="text-sm">
                      ({spotData?.destination_country_code})
                    </span>
                  </div>
                  <div className=" p-1 pt-2 min-w-28 h-14 border-2 rounded hidden sm:flex flex-col  justify-center text-wrap">
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
          </div>
          <div className="box my-4" ref={boxRef}>
            <div className="flex justify-between  py-2 px-4 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
              <div>
                {" "}
                <h2 className="mr-auto text-xl font-medium">
                  Shipment Details
                </h2>
              </div>
            </div>

            <div className="space-y-4 px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="md:col-span-1 sm:col-span-2 max-[640px]:col-span-2">
                  <div>
                    <FormLabel className="text-base text-slate-500">
                      SELECT FRANCHISEE <span className="text-red-400">*</span>
                    </FormLabel>
                  </div>
                  {state?.booking?.franchisee_id &&
                  !state?.booking?.is_duplicate ? (
                    <FormInput
                      placeholder="Franchisee Name"
                      disabled
                      value={state.booking?.franchisee_name || ""}
                    />
                  ) : (
                    <CommonSearchableAll
                      apiEndpoint={`admin/franchisee-settings?sales_id=${userdata?.mapped_id}${state?.booking?.type==3?'&is_overseas=1':""}`}
                      placeholder={"Search For  Franchisee"}
                      selecteddata={selectedfranchisedata}
                      setSelecteddata={setSelectedfranchisedata}
                      fun1={fun1}
                      comingselectedname={"franchisee_name"}
                      comingselectedid={"franchisee_id"}
                      funtoempty={fun2}
                      questionmark={true}
                      key1={"key"}
                      id={state?.booking?.franchisee_id}
                      zIndex={50}
                      // border={error?.franchisee ? true : false}
                    />
                  )}
                  {franchiseeInactive && (
                    <p className="text-red-500 text-xs mt-0.5">This Franchisee is inactive.</p>
                  )}
                </div>
                <div className=" max-[640px]:col-span-2">
                  <FormLabel
                    htmlFor="origin-country"
                    className="text-base text-slate-500"
                  >
                    SHIPMENT TYPE <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormSelect
                    id="default"
                    disabled={state?.booking?.forwhat == "job" ? true : false}
                    value={spotData.shipment_type}
                    onChange={(e: any) => {
                      const value = e.target.value;
                      setSpotData((prev) => ({
                        ...prev,
                        shipment_type: e.target.value,
                      }));

                      if (value == 8) {
                        setSpotData((prev) => ({
                          ...prev,
                          is_returnable: 1,
                        }));
                      } else {
                        setSpotData((pre: any) => ({
                          ...pre,
                          fair_id: "",
                          fair_venue: "",
                          fair_start_date: "",
                          fair_end_date: "",
                          is_returnable: 0,
                          mode: "",
                          mode_value: "",
                        }));
                      }
                      setSelectedFairdata({
                        fair_id: "",
                        fair_name: "",
                        fair_venue: "",
                        fair_start_date: "",
                        fair_end_date: "",
                      });
                      if (e.target.value == "4" || e.target.value == "5") {
                        setSpotData((pre: any) => ({
                          ...pre,

                          import_booking_type: "",
                        }));
                      }
                      setCurrentStep(1);
                      setCheckCargo("");
                    }}
                  >
                    <option value="">Select Shipment Type</option>
                    {shipmentTypes
                      ?.filter((item) =>
                        state?.booking?.type == 1
                          ? item?.booking_shipment_type_id == 1 ||
                            item?.booking_shipment_type_id == 5||item?.booking_shipment_type_id == 8
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

                <div className=" max-[640px]:col-span-2">
                  <FormLabel
                    htmlFor="weight"
                    className="text-base text-slate-500"
                  >
                    CHARGEABLE WEIGHT <span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex items-center gap-2">
                    <div className=" w-full">
                      <FormInput
                        className="w-full pr-8"
                        id="weight"
                        type="text"
                        placeholder="Chargeable Weight"
                        value={spotData?.weight}
                        disabled={
                          dimensionData?.length > 0 &&
                          dimensionData[0]?.item_description
                        }
                        onChange={(e: any) => {
                          let newValue = limitToThreeDecimals(e.target.value);
                          // Prevent leading zeros
                          if (newValue.startsWith("0") && newValue.length > 1) {
                            newValue = newValue.replace(/^0+/, "");
                          }
                          setSpotData((prev) => ({
                            ...prev,
                            weight: newValue,
                          }));
                          setCurrentStep(1);
                        }}
                      />
                      {dimensionData?.length > 0 &&
                        dimensionData[0]?.item_description && (
                          <button
                            type="button"
                            title="Recalculate Chargeable Weight"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-mustard transition-colors"
                            onClick={() => {
                              setSpotData((prev: any) => ({
                                ...prev,
                                weight: getchweight(dimensionData) || "",
                              }));
                              setCurrentStep(1);
                            }}
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                        )}
                    </div>

                    <FormSelect
                      value={spotData?.weight_unit}
                      disabled={state?.booking?.forwhat == "job" ? true : false}
                      onChange={(e) => {
                        setSpotData((prev) => ({
                          ...prev,
                          weight_unit: e.target.value,
                        }));
                        setCurrentStep(1);
                      }}
                    >
                      {weightData &&
                        weightData?.map((data, index) => (
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

                <div className="flex justify-between  max-[640px]:col-span-2">
                  <div>
                    {" "}
                    <FormLabel
                      htmlFor="origin-city"
                      className="text-base text-slate-500"
                    >
                      QUOTED BY <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormInput
                      // className="w-full"
                      id="origin-city"
                      value={spotData?.quoted_by}
                      onChange={(e) => {
                        setSpotData((prev) => ({
                          ...prev,
                          quoted_by: e.target.value,
                        }));
                      }}
                    />
                  </div>
                  {spotData?.shipment_type == 8 ? (
                    <div className="ml-2">
                      <FormCheck className="mt-10">
                        <FormCheck.Input
                          id="vertical-form-3"
                          type="checkbox"
                          onChange={(e: any) => {
                            setSpotData((pre: any) => ({
                              ...pre,
                              is_returnable: e.target.checked ? 1 : 0,
                            }));
                          }}
                          checked={spotData?.is_returnable}
                        />
                        <FormCheck.Label htmlFor="vertical-form-3">
                          RETURNABLE
                        </FormCheck.Label>
                      </FormCheck>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                {spotData?.shipment_type == 8 ? (
                  <div className=" max-[640px]:col-span-2">
                    <div>
                      {" "}
                      <FormLabel
                        htmlFor="origin-city"
                        className="text-base text-slate-500"
                      >
                        FAIR NAME <span className="text-red-400">*</span>
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
                        id={state?.booking?.fair_id || spotData?.fair_id}
                        zIndex={50}
                        // border={error?.franchisee ? true : false}
                      />
                      {/* <FormSelect
                        value={spotData?.fair_id}
                        onChange={(e: any) => {
                          const singledata = fairlist?.find(
                            (item: any) => item?.fair_id == e.target.value
                          );

                          setSpotData((pre: any) => ({
                            ...pre,
                            fair_id: e.target.value,
                            fair_venue: [
                              singledata?.fair_ground_name,
                              singledata?.address_line_1,
                              singledata?.address_line_2,
                              singledata?.city,
                              singledata?.state,
                              singledata?.zipcode,
                              countrydata?.find(
                                (item: any) =>
                                  item?.country_id == singledata?.country
                              )?.country_name,
                            ]
                              .filter(Boolean)
                              .join(", "),
                            fair_start_date: singledata?.fair_start_date || "",
                            fair_end_date: singledata?.fair_end_date || "",
                          }));
                        }}
                      >
                        <option value="">Select</option>
                        {fairlist?.map((item: any) => (
                          <option value={item?.fair_id}>
                            {item?.fair_name}-({item?.fair_ground_name}) - (
                            {formatDateDDMMYYYY(item?.fair_start_date)}{" "}
                           to {formatDateDDMMYYYY(item?.fair_end_date)})
                          </option>
                        ))}
                      </FormSelect> */}
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
                        FAIR START DATE <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormInput
                        type={"text"}
                        onChange={(e: any) => {}}
                        value={
                          formatDateDDMMYYYY(state?.booking?.fair_start_date) ||
                          formatDateDDMMYYYY(spotData?.fair_start_date) ||
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
                        FAIR END DATE <span className="text-red-400">*</span>
                      </FormLabel>
                      <FormInput
                        value={
                          formatDateDDMMYYYY(state?.booking?.fair_end_date) ||
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
                  <div className="col-span-2">
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
                <div className="col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {" "}
                      <FormLabel
                        htmlFor="origin-city"
                        className="text-base text-slate-500"
                      >
                        COMMODITY TYPE <span className="text-red-400">*</span>
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
                        id={state?.booking?.commodity || spotData?.commodity}
                        zIndex={20}
                      />
                    </div>
                    <div>
                      {" "}
                      <FormLabel
                        htmlFor="origin-city"
                        className="text-base text-slate-500"
                      >
                        SHIPMENT CURRENCY
                      </FormLabel>
                      <FormSelect
                        value={spotData?.currency_id || "24"}
                        onChange={(e: any) => {
                          setSpotData((pre: any) => ({
                            ...pre,
                            currency_id: e.target.value || "24",
                          }));
                          setCurrentStep(1);
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
                </div>
              </div>

              {(spotData?.shipment_type == 4 ||
                spotData?.shipment_type == 6 ||
                spotData?.shipment_type == 5 ||
                spotData?.shipment_type == 8) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  {(spotData?.shipment_type == "4" ||
                    spotData?.shipment_type == "5") &&
                  spotData?.dest_country_id == 97 &&
                  spotData?.org_country_id != 97 ? (
                    <div>
                      <FormLabel
                        htmlFor="incoterm"
                        className="text-base text-slate-500"
                      >
                        BOOKING TYPE <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormSelect
                        id="import-booking-type"
                        value={spotData?.import_booking_type}
                        onChange={(e) => {
                          setSpotData((prev: any) => ({
                            ...prev,
                            import_booking_type: e.target.value,
                            clearence_type: e.target.value == 1 ? 3 : "",
                          }));
                          setCurrentStep(1);
                        }}
                        className=" text-sm"
                      >
                        <option value="">Select Import Booking Type</option>
                        <option value={1}>D2D Import Booking</option>
                        <option value={2}>D2P/ BSO Import Booking</option>
                      </FormSelect>
                    </div>
                  ) : null}
                  <div>
                    <FormLabel
                      htmlFor="clearence-type"
                      className="text-base text-slate-500"
                    >
                      CLEARANCE TYPE <span className="text-red-400">*</span>
                    </FormLabel>

                    <FormSelect
                      className="sm:mr-2"
                      value={spotData?.clearence_type}
                      onChange={(e) => {
                        const evalue = e.target.value;
                        // if (evalue !== 1) {
                        //   setSpotData((pre: any) => ({
                        //     ...pre,
                        //     custom_clearance_charge: "",
                        //   }));
                        // }
                        setSpotData((prev) => ({
                          ...prev,
                          clearence_type: e.target.value,
                        }));
                        setCurrentStep(1);
                      }}
                    >
                      <option value="">Select Clearance Type</option>
                      {clearanceType &&
                        clearanceType
                          ?.filter((item) => {
                            if (spotData?.shipment_type == 8 && item.id == 3) {
                              return false;
                            }
                            if (
                              state?.booking?.type != 2 &&
                              state?.booking?.type != 3
                            ) {
                              if (spotData?.import_booking_type == 1) {
                                return item.id == 3;
                              }

                              if (spotData?.import_booking_type == 2) {
                                return [1, 2].includes(item.id);
                              }
                            }

                            return true;
                          })
                          ?.map((ele, index) => (
                            <option key={index} value={ele.id}>
                              {ele.name}
                            </option>
                          ))}
                    </FormSelect>
                  </div>

                  <div
                    className={`${
                      (spotData?.shipment_type == "4" ||
                        spotData?.shipment_type == "5") &&
                      spotData?.dest_country_id == 97 &&
                      spotData?.org_country_id != 97
                        ? ""
                        : ""
                    }`}
                  >
                    <div>
                      <FormLabel
                        htmlFor="incoterm"
                        className="text-base text-slate-500"
                      >
                        INCOTERM <span className="text-red-400">*</span>
                      </FormLabel>

                      <FormSelect
                        id="incoterm"
                        className="sm:mr-2"
                        value={spotData?.incoterm}
                        onChange={(e) => {
                          setSpotData((prev) => ({
                            ...prev,
                            incoterm: e.target.value,
                          }));
                          setCurrentStep(1);
                        }}
                      >
                        <option value="">Select Incoterm</option>
                        {incotermType &&
                          incotermType
                            ?.filter((ele) => {
                              if (
                                state?.booking?.type == 2 ||
                                state?.booking?.type == 3
                              ) {
                                return [1, 2, 3, 4, 5].includes(ele?.id);
                              }
                              if (state?.booking?.type == 1) {
                                return [6, 7, 8].includes(ele?.id);
                              }
                              return true;
                            })
                            ?.map((ele, index) => (
                              <option key={index} value={ele?.id}>
                                {ele?.name}
                              </option>
                            ))}
                      </FormSelect>
                    </div>
                  </div>
                </div>
              )}
              {state?.booking?.type != 2 && state?.booking?.type != 3 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  <div>
                    {" "}
                    <FormLabel
                      htmlFor="origin-city"
                      className="text-base text-slate-500"
                    >
                      IMPORT SERVICE TYPE{" "}
                      <span className="text-red-400">*</span>
                    </FormLabel>
                    <FormSelect
                      value={spotData?.import_service_type}
                      onChange={(e: any) => {
                        setSpotData((pre: any) => ({
                          ...pre,
                          import_service_type: e.target.value,
                        }));
                        setCurrentStep(1);
                      }}
                    >
                      <option value="">Select</option>
                      <option value={1}>Economy</option>
                      <option value={2}>Express (IP)</option>
                    </FormSelect>
                  </div>
                </div>
              ) : null}
              <div className="mb-2">
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
                    currencyData={currencydata}
                    currencyId={spotData?.currency_id}
                    weightData={weightData}
                    weightUnit={spotData?.weight_unit}
                  />
                  {/* <div className=" p-2 w-full box cursor-pointer  border border-gray-200 flex justify-between items-end">
                      <div className=" flex flex-wrap gap-2 ">
                        {dimensionData &&
                          dimensionData?.length >= 0 &&
                          dimensionData[0]?.item_description &&
                          dimensionData.map(
                            (elem, index) =>
                              elem?.item_description && (
                                <div
                                  key={index}
                                  className=" flex  px-2 py-1 gap-4 mr-2 bg-slate-300 items-center justify-between  rounded-lg"
                                >
                                  <span
                                    className=" text-lg flex capitalize "
                                    onClick={(e) => {
                                  
                                     
                                        setShipmentModal(true)
                                      
                                    }}
                                  >
                                    {" "}
                                    {elem?.item_description}
                                  </span>

                                  <Tippy
                                    content="Delete Dimension"
                                    options={{
                                      placement: "top",
                                    }}
                                  >
                                    <Lucide
                                      icon="XCircle"
                                      className="    text-red-500 stroke-2.5 "
                                      onClick={(e) => {
                                        if (!spinner) {
                                          handleDelete(e, index);
                                        }
                                      }}
                                    />
                                  </Tippy>
                                </div>
                              )
                          )}
                      </div>

                      <Tippy
                        content="Add More Dimesions"
                        options={{ placement: "top" }}
                      >
                        <Lucide
                          icon="PlusCircle"
                          className="w-6 h-6 mr-2 mb-1 stroke-2.5 text-mustard"
                          onClick={(e) => {
                            // if (!spinner) {
                            //   e.stopPropagation();
                            //   e.isPropagationStopped();
                            //   setIsEditDimension(false);
                            //   setDimensionPreview(true);
                            // }
                            setShipmentModal(true);
                          }}
                        />
                      </Tippy>
                    </div> */}
                </div>

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
                  editDimensionData={
                    isEditDimension ? editDimensionData : undefined
                  }
                  showHsn={true}
                  isSpot={true}
                  currencyData={currencydata}
                  currencyId={spotData?.currency_id}
                  weightData={weightData}
                  weightUnit={spotData?.weight_unit}
                /> */}
                {shipmentModal && (
                  <CommonModal
                    open={shipmentModal}
                    setOpen={setShipmentModal}
                    title={shipmentModalTitle}
                    description={shipmentModalDescription}
                    footer={shipmentModalFooter}
                    size="2xl"
                    gridColumns={6}
                  />
                )}
              </div>
              <div className="flex gap-4 justify-end">
                {/* <Button
                  elevated
                  rounded
                  className="w-32 bg-success text-white p-2"
                  onClick={() => setAddChargeModal(true)}
                >
                  ADDITIONAL CHARGE
                </Button> */}
                <Button
                  elevated
                  rounded
                  className="w-32 bg-mustard text-white p-2"
                  onClick={handleGetQuote}
                  disabled={isLoading || franchiseeInactive}
                >
                  GET QUOTE{" "}
                  {isLoading && (
                    <LoadingIcon
                      icon="puff"
                      color="white"
                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                    />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
        {currentStep == 2 &&
          (isLoading ? (
            <div className="w-full md:w-[35%] h-72 my-4 md:my-8 flex justify-center items-center">
              <IsLoading />
            </div>
          ) : isError ? (
            <div className="flex justify-center w-full md:w-[35%]">
              <img src={ErrorGif} alt="error-gif" className="w-48 h-24" />
            </div>
          ) : vendorData?.length > 0 ? (
            <div className="box w-full md:w-[35%] h-[100%] my-2 md:my-4">
              <div className="flex flex-col items-center  py-2 px-4 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                <h2 className="mr-auto text-xl font-medium">
                  Product/Service Type
                </h2>
              </div>

              <div className="space-y-4 px-2 py-4 ">
                <Table className="border text-center">
                  <Table.Thead>
                    <Table.Tr className="border p-1 text-center space-y-1">
                      <Table.Th className="border p-1"></Table.Th>
                      <Table.Th className="border p-1">PRODUCT</Table.Th>
                      <Table.Th className="border p-1">PRODUCT TYPE</Table.Th>
                      <Table.Th className="border p-1">WEIGHT</Table.Th>
                      <Table.Th className="border p-1">TAT</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody className="p-0">
                    {vendorData &&
                      vendorData?.length >= 1 &&
                      vendorData?.map((elem, index) => (
                        <Table.Tr key={index} className="border p-1">
                          <Table.Td className="border p-1">
                            <FormCheck.Input
                              id="radio-switch-1"
                              type="radio"
                              name="radio_button"
                              checked={spotData?.courier_id == elem?.courier_id}
                              onChange={(e) => {
                                e.target.value == "on"
                                  ? setSelectVendor(true)
                                  : "";
                                setSpotData((prev) => ({
                                  ...prev,
                                  courier_id: elem?.courier_id,
                                  courier_code:
                                    elem?.special_code.toLowerCase(),
                                  courier_name: elem?.product_name,
                                  courier_vendor_code: elem?.product_code,
                                  shipment_charges: elem,
                                }));
                              }}
                            />
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {" "}
                            {elem?.parent_vendor}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {" "}
                            {elem?.product_name}
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {Number(elem?.actual_weight).toFixed(3)} kgs
                          </Table.Td>
                          <Table.Td className="border p-1">
                            {elem?.tat_days}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </div>
              {state?.booking?.type != 1 ? (
                <div className="col-span-12 sm:col-span-6 flex item-center gap-5  mx-4 ">
                  <FormLabel
                    htmlFor="modal-form-5"
                    className="mt-2 flex whitespace-nowrap"
                  >
                    {" "}
                    PRICE TYPE<span className="text-red-400">*</span>
                  </FormLabel>
                  <div className="flex flex-row gap-5">
                    <FormCheck>
                      <FormCheck.Input
                        id="radio-switch-4"
                        type="radio"
                        name="price_type_radio_button"
                        value={spotData?.price_type}
                        checked={spotData?.price_type == 1}
                        onClick={() =>
                          setSpotData((prev) => ({ ...prev, price_type: 1 }))
                        }
                      />
                      <FormCheck.Label htmlFor="radio-switch-4">
                        Absolute
                      </FormCheck.Label>
                    </FormCheck>
                    <FormCheck>
                      <FormCheck.Input
                        id="radio-switch-5"
                        type="radio"
                        name="price_type_radio_button"
                        value={spotData?.price_type}
                        checked={spotData?.price_type == 2}
                        onClick={() =>
                          setSpotData((prev) => ({ ...prev, price_type: 2 }))
                        }
                      />
                      <FormCheck.Label
                        htmlFor="radio-switch-5"
                        className="whitespace-nowrap"
                      >
                        Per Kg
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between mt-2">
                <FormInline className="grid grid-cols-2 gap-5 mx-4">
                  <FormLabel
                    htmlFor="horizontal-form-1"
                    className="sm:w-20 flex whitespace-nowrap"
                  >
                    SPOT PRICE (₹) <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormInput
                    id="horizontal-form-1"
                    type="text"
                    placeholder="Spot Price"
                    value={spotData?.spot_price}
                    onChange={(e: any) => {
                      let newValue = limitToThreeDecimals(e.target.value);
                      // Prevent leading zeros
                      if (newValue.startsWith("0") && newValue.length > 1) {
                        newValue = newValue.replace(/^0+/, "");
                      }
                      setSpotData((prev) => ({
                        ...prev,
                        spot_price: newValue,
                      }));
                    }}
                    // onChange={(e) =>
                    //   setSpotData((prev) => ({
                    //     ...prev,
                    //     spot_price: e.target.value,
                    //   }))
                    // }
                  />
                </FormInline>
              </div>
              <div className=" p-2">
                {spotData?.startPoint == "enquiry" ||
                state?.booking?.is_duplicate == 1 ? (
                  <div className="flex ">
                    <Button
                      className="p-2 bg-success w-[100px]  mr-2 text-white"
                      elevated
                      rounded
                      onClick={() => navigate("/backoffice/dashboard")}
                    >
                      Cancel
                    </Button>
                    <Button
                      elevated
                      rounded
                      disabled={!selectVendor || spinner}
                      className=" bg-mustard text-white p-2 w-[100px] "
                      onClick={SpotBooking}
                    >
                      Save{" "}
                      {spinner && (
                        <LoadingIcon
                          icon="puff"
                          color="white"
                          className="w-5 h-5 ml-2 stroke-2.5 text-white"
                        />
                      )}
                    </Button>
                  </div>
                ) : (
                  <Button
                    elevated
                    rounded
                    disabled={editSpinner}
                    className=" bg-mustard text-white p-2"
                    onClick={updateSpotBooking}
                  >
                    UPDATE{" "}
                    {editSpinner && (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="w-5 h-5 ml-2 stroke-2.5 text-white"
                      />
                    )}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="box text-red-500 font-medium text-lg w-full md:w-[35%] h-36 flex items-center justify-center px-2 my-2 md:my-4">
              Vendor Not Available for this region !!
            </div>
          ))}
        {checkcargo && (
          <div className="box w-full md:w-[35%] h-[100%] my-2 md:my-4">
            <div className="flex flex-col items-center  py-2 px-4 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
              <h2 className="mr-auto text-xl font-medium">
                Product/Service Type
              </h2>
            </div>
            <div
              className={`space-y-4 px-2 py-4 ${
                products?.length >= 13 ? "h-[600px]" : ""
              } overflow-auto`}
            >
              <Table className="border text-center">
                <Table.Thead>
                  <Table.Tr className="border p-1 text-center space-y-1">
                    <Table.Th className="border p-1"></Table.Th>
                    <Table.Th className="border p-1">PRODUCT</Table.Th>
                    <Table.Th className="border p-1">PRODUCT TYPE</Table.Th>
                    <Table.Th className="border p-1">WEIGHT</Table.Th>
                    {/* <Table.Th className="border p-1">TAT</Table.Th> */}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody className="p-0">
                  {products &&
                    products?.map((elem: any, index: any) => (
                      <Table.Tr key={index} className="border p-1">
                        <Table.Td className="border p-1">
                          <FormCheck.Input
                            id="radio-switch-1"
                            type="radio"
                            name="radio_button"
                            checked={spotData?.courier_id == elem?.product_id}
                            onChange={(e) => {
                              e.target.value == "on"
                                ? setSelectVendor(true)
                                : "";
                              setSpotData((prev) => ({
                                ...prev,
                                courier_id: elem?.product_id,
                                mode_value: "",
                                // courier_code:
                                //   elem?.special_code.toLowerCase(),

                                courier_name: elem?.product_name,
                                courier_vendor_code: elem?.product_code,
                                ...(spotData?.shipment_type == 8
                                  ? {
                                      mode: elem?.mode,
                                    }
                                  : {}),
                                // shipment_charges: elem,
                              }));
                            }}
                          />
                        </Table.Td>
                        <Table.Td className="border p-1">
                          {" "}
                          {elem?.parent_vendor}
                        </Table.Td>
                        <Table.Td className="border p-1">
                          {" "}
                          {elem?.product_name}
                        </Table.Td>
                        <Table.Td className="border p-1">
                          {/* {spotData?.weight_unit} */}
                          {/* {Number(spotData?.weight).toFixed(2)} */}
                          {spotData?.weight_unit == "kgs"
                            ? Number(spotData?.weight).toFixed(3)
                            : (Number(spotData?.weight) / 1000).toFixed(3)}{" "}
                          kgs
                        </Table.Td>
                      </Table.Tr>
                    ))}
                </Table.Tbody>
              </Table>
            </div>
            {spotData?.shipment_type == 8 && spotData?.mode == 2 ? (
              <div className="flex flex-col mt-2 sm:flex-row ml-6">
                <FormCheck className="mr-2">
                  <FormCheck.Input
                    // value={spotData?.mode_value}
                    id="radio-switch-4"
                    type="radio"
                    checked={spotData?.mode_value == "LCL"}
                    onChange={(e: any) => {
                      if (e.target.checked) {
                        setSpotData((pre: any) => ({
                          ...pre,
                          mode_value: "LCL",
                        }));
                        // setPage(0)
                        // setHit(4)
                        // setFiltersdata(intfiltersdata)
                      }
                    }}
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
                    checked={spotData?.mode_value == "FCL"}
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
            ) : spotData?.mode == 3 ? (
              <div className="flex flex-col mt-2 sm:flex-row ml-6">
                <FormCheck className="mr-2">
                  <FormCheck.Input
                    // value={spotData?.mode_value}
                    id="radio-switch-4"
                    type="radio"
                    checked={spotData?.mode_value == "LTL"}
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
                    checked={spotData?.mode_value == "FTL"}
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
            {!checkcargo ? (
              <div className="col-span-12 sm:col-span-6 flex item-center gap-5  mx-4 ">
                <FormLabel
                  htmlFor="modal-form-5"
                  className="mt-2 flex whitespace-nowrap"
                >
                  {" "}
                  PRICE TYPE<span className="text-red-400">*</span>
                </FormLabel>
                <div className="flex flex-row gap-5">
                  <FormCheck>
                    <FormCheck.Input
                      id="radio-switch-4"
                      type="radio"
                      name="price_type_radio_button"
                      value={spotData?.price_type}
                      checked={spotData?.price_type == 1}
                      onClick={() =>
                        setSpotData((prev) => ({ ...prev, price_type: 1 }))
                      }
                    />
                    <FormCheck.Label htmlFor="radio-switch-4">
                      Absolute
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck>
                    <FormCheck.Input
                      id="radio-switch-5"
                      type="radio"
                      name="price_type_radio_button"
                      value={spotData?.price_type}
                      checked={spotData?.price_type == 2}
                      onClick={() =>
                        setSpotData((prev) => ({ ...prev, price_type: 2 }))
                      }
                    />
                    <FormCheck.Label
                      htmlFor="radio-switch-5"
                      className="whitespace-nowrap"
                    >
                      Per Kg
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>
            ) : (
              ""
            )}
            {!checkcargo ? (
              <div className="flex items-center justify-between mt-2">
                <FormInline className="grid grid-cols-2 gap-5 mx-4">
                  <FormLabel
                    htmlFor="horizontal-form-1"
                    className="sm:w-20 flex whitespace-nowrap"
                  >
                    SPOT PRICE (₹) <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormInput
                    id="horizontal-form-1"
                    type="text"
                    placeholder="Spot Price"
                    value={spotData?.spot_price}
                    onChange={(e) => {
                      let newValue = limitToThreeDecimals(e.target.value);
                      if (newValue.startsWith("0") && newValue.length > 1) {
                        newValue = newValue.replace(/^0+/, "");
                      }
                      setSpotData((prev) => ({
                        ...prev,
                        spot_price: newValue,
                      }));
                    }}
                  />
                </FormInline>
              </div>
            ) : (
              ""
            )}
            <div className="flex justify-end p-2">
              {spotData?.startPoint == "enquiry" ||
              state?.booking?.is_duplicate == 1 ? (
                <div className="flex">
                  <Button
                    className="p-2 bg-success w-[100px] mr-2 text-white"
                    onClick={() => navigate("/backoffice/dashboard")}
                    elevated
                    rounded
                  >
                    Cancel
                  </Button>
                  <Button
                    elevated
                    rounded
                    disabled={!selectVendor || spinner}
                    className=" bg-mustard text-white p-2 w-[100px]"
                    onClick={SpotBooking}
                  >
                    Save{" "}
                    {spinner && (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="w-5 h-5 ml-2 stroke-2.5 text-white"
                      />
                    )}
                  </Button>
                </div>
              ) : (
                <Button
                  elevated
                  rounded
                  disabled={editSpinner}
                  className=" bg-mustard text-white p-2"
                  onClick={updateSpotBooking}
                >
                  UPDATE{" "}
                  {editSpinner && (
                    <LoadingIcon
                      icon="puff"
                      color="white"
                      className="w-5 h-5 ml-2 stroke-2.5 text-white"
                    />
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {addchargeModal && (
        <CommonModal
          open={addchargeModal}
          setOpen={setAddChargeModal}
          title={ModalTitle2}
          description={ModalDescription2}
          footer={ModalFooter2}
          sticky={false}
          size={`lg`}
        />
      )}
    </>
  );
};

export default SpotPricePart2;
