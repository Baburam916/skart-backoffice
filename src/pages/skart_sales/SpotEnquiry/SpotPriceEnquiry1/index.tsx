import React, { useEffect, useRef, useState } from "react";

import {
  FormCheck,
  FormInput,
  FormLabel,
} from "../../../../base-components/Form";
import Button from "../../../../base-components/Button";
import { useLocation, useNavigate } from "react-router-dom";
import franchiseeicon from "../../../../assets/images/icons/franchiselist.svg";
import weighticon from "../../../../assets/images/icons/weight.svg";
import axios from "axios";

import { useAlert } from "../../../../ContextProvider/AlertContext";

import exporticon from "../../../../assets/images/exporticon.png";
import importicon from "../../../../assets/images/importicon.png";

import {
  commongetrequest,
  commonpostrequest,
} from "../../../../AllServices/services";

import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";
import CommonModal from "../../commoncomponents/CommonModal/CommonModal";
import LoadingButtonCommon from "../../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import IsLoading from "../../commoncomponents/isLoading/isLoading";
import {
  Building2,
  Check,
  Copy,
  FilePlus2,
  Flag,
  Globe,
  MapPin,
  Plane,
  RotateCcw,
  Search,
  Send,
  Upload,
} from "lucide-react";
import DocumentUploadModal from "./DocumentUploadModal";

import AOS from "aos";
import "aos/dist/aos.css";

axios.defaults.withCredentials = true;

const fieldLabelCls =
  "block mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500";
const plainInputCls =
  "w-full border-0 shadow-none rounded-none bg-transparent py-2.5 focus:ring-0 disabled:bg-transparent";
const checkRowCls =
  "flex justify-start items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2.5";
const checkLabelCls =
  "text-[11px] font-bold uppercase tracking-wider text-slate-500";
const primaryBtnCls =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-mustard px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 sm:w-auto";
const secondaryBtnCls =
  "flex w-full items-center justify-center gap-2 rounded-lg bg-slate-400 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-500 disabled:opacity-50 sm:w-auto";

/** Input shell with a leading icon box — matches the searchable fields */
const IconField = ({ icon: Icon, disabled, children }: any) => (
  <div
    className={`flex items-stretch overflow-hidden rounded-lg border border-slate-200 transition focus-within:border-mustard focus-within:ring-2 focus-within:ring-mustard/20 ${
      disabled ? "bg-slate-50" : "bg-white"
    }`}
  >
    <span className="flex w-10 shrink-0 items-center justify-center border-r border-slate-200 bg-slate-50 text-slate-400">
      <Icon className="w-4 h-4" />
    </span>
    <div className="min-w-0 flex-1">{children}</div>
  </div>
);

const ENQUIRY_TABS = [
  { value: "2", label: "EXPORT", Icon: Send, iconCls: "", img: exporticon },
  {
    value: "1",
    label: "IMPORT",
    Icon: Plane,
    iconCls: "rotate-90",
    img: importicon,
  },
  { value: "3", label: "THIRD COUNTRY", Icon: Globe, iconCls: "", img: null },
];

const initialState = {
  origin_country: "INDIA",
  origin_country_code: "IN",
  origin_pincode: "",
  origin_city: "",
  origin_state: "",
  origin_state_code: "",
  destination_country: "",
  destination_country_code: "",
  destination_country_id: "",
  destination_pincode: "",
  city: "",
  startPoint: "enquiry",
  city_available: 0,
  pincode_available: 0,
  is_zipcode: 0,
  forwhat: "enq",
};
const intoriginpincodedata = {
  pincode_id: "",
  pincode: "",
};
const intselecteddata = {
  country_name: "",
  country_id: "",
};
const intselecteddata2 = {
  zipcode: "",
  city: "",
};
const intselecteddata3 = {
  zipcode: "",
  city: "",
  city_area: "",
};
const intselectedthirdcountdata = {
  country_id: "",
  country_name: "",
};
const SpotEnquirymain = () => {
  const navigate = useNavigate();
  const [iszipcode, setIszipcode] = useState<any>(false);
  const [isthirdcountryzipcode, setIsthirdcountryzipcode] =
    useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedoriginpincodedata, setSelectedoriginpincodedata] =
    useState<any>(intoriginpincodedata);
  const [selecteddata, setSelecteddata] = useState<any>(intselecteddata);
  const [selecteddata2, setSelecteddata2] = useState<any>(intselecteddata2);
  const [selecteddata3, setSelecteddata3] = useState<any>(intselecteddata3);
  const [franchiseeInactive, setFranchiseeInactive] = useState(false);
  const [docUploadModalOpen, setDocUploadModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [enquiryNumber, setEnqiryNumber] = useState<string>("");
  const [allfdata, setAllfdata] = useState<any>([]);
  const [allproducts, setAllproducts] = useState<any>([]);
  const location = useLocation();
  const { state } = location;
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);
  const [currenydata, setCurrencyData] = useState([]);
  const [dimensionData, setDimensionData] = useState([
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
  ]);

  const [spotbooking, setSpotBooking] = useState(initialState);
  const [enquiryType, setEnquiryType] = useState<any>(2);
  const [thirdcountrydestdata, setThirdcountrydestdata] = useState<any>(
    intselectedthirdcountdata,
  );
  const [thirdcountrydestcitydata, setThirdcountrydestcitydata] =
    useState<any>(intselecteddata3);
  const [thirdcountrydestpincodedata, setThirdcountrydestpincodedata] =
    useState<any>(intselecteddata2);
  const { showAlert } = useAlert();
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

  const handleSubmit = () => {
    const destPincodeAvail =
      enquiryType == 3
        ? (spotbooking as any)?.dest_pincode_available
        : spotbooking?.pincode_available;
    const destCityAvail =
      enquiryType == 3
        ? (spotbooking as any)?.dest_city_available
        : spotbooking?.city_available;

    const errors = {
      ...(enquiryType == 1 || enquiryType == 3
        ? { origin_country_id: spotbooking?.origin_country_id || "" }
        : {}),
      origin_pincode: spotbooking?.origin_pincode || "",
      origin_city: spotbooking?.origin_city || "",
      destination_country: spotbooking?.destination_country || "",
      ...(destPincodeAvail == 1
        ? { destination_pincode: spotbooking?.destination_pincode || "N.A" }
        : { destination_pincode: "0000" }),
      ...(destCityAvail == 1
        ? { destination_city: spotbooking?.city || "" }
        : { destination_city: "" }),
    };

    if (destCityAvail == 0) {
      delete errors?.destination_city;
    }
    if (
      enquiryType == 2 &&
      (spotbooking?.pincode_available == 0 || iszipcode)
    ) {
      delete errors?.destination_pincode;
    }
    if (
      enquiryType == 3 &&
      ((spotbooking as any)?.dest_pincode_available == 0 ||
        isthirdcountryzipcode)
    ) {
      delete errors?.destination_pincode;
    }
    if (
      (enquiryType == 1 || enquiryType == 3) &&
      (spotbooking?.pincode_available == 0 || iszipcode)
    ) {
      delete errors?.origin_pincode;
    }

    const errorLabels: Record<string, string> = {
      origin_country_id: "Origin Country",
      origin_pincode: "Origin Pincode",
      origin_city: "Origin City",
      destination_country: "Destination Country",
      destination_pincode: "Destination Pincode",
      destination_city: "Destination City",
    };

    for (const [key, value] of Object.entries(errors)) {
      if (!value) {
        const label = errorLabels[key] || key.replaceAll("_", " ");
        showAlert(`${label} is required`, "warning");
        return;
      }
    }

    navigate("/backoffice/sales_operations/spot_price_enquiry/book_courier", {
      state: { booking: { ...spotbooking, type: enquiryType } },
    });
  };

  const fun1 = (a: any, forwhat?: any) => {
    if (enquiryType == 3 && a?.country_id == 97) {
      inputRef.current.value = null;
      showAlert("Selected country is not allowed", "warning");
      if (forwhat == 1) {
        setSelecteddata({
          country_name: "",
          country_id: "",
        });

        setSpotBooking((prev) => ({
          ...prev,
          origin_country: "",
          origin_country_code: "",
          origin_country_id: "",
          city_available: 0,
          pincode_available: 0,
          //  city_available: 0,
          //  pincode_available: 0,
        }));
        setSelecteddata(intselecteddata);
        setSelecteddata2(intselecteddata2);
        setSelecteddata3(intselecteddata3);
        setSpotBooking((pre: any) => ({ ...pre, origin_pincode: "" }));
      } else {
        if (a?.country_id == spotbooking?.origin_country_id) {
          showAlert("Origin and Destination Can not be same", "warning");
        }
        setSpotBooking((prev) => ({
          ...prev,
          destination_country: "",
          destination_country_code: "",
          destination_country_id: "",
          dest_city_available: 0,
          dest_pincode_available: 0,
          destination_pincode: "",
          city: "",
        }));
        setThirdcountrydestpincodedata(intselecteddata2);
        setThirdcountrydestdata(intselectedthirdcountdata);
        setThirdcountrydestcitydata(intselecteddata3);
        setIsthirdcountryzipcode(false);
        inputRef2.current.value = null;
      }

      localStorage.removeItem("code");

      return false;
    }

    if (enquiryType == 3) {
      if (
        forwhat == 1 &&
        a?.country_id &&
        a?.country_id == spotbooking?.destination_country_id
      ) {
        showAlert("Origin and Destination cannot be the same", "warning");
        setSpotBooking((prev) => ({
          ...prev,
          origin_country: "",
          origin_country_code: "",
          origin_country_id: "",
          city_available: 0,
          pincode_available: 0,
          origin_pincode: "",
          origin_city: "",
        }));
        setSelecteddata(intselecteddata);
        setSelecteddata2(intselecteddata2);
        setSelecteddata3(intselecteddata3);
        localStorage.removeItem("code");
        return false;
      }
      if (
        forwhat == 3 &&
        a?.country_id &&
        a?.country_id == (spotbooking as any)?.origin_country_id
      ) {
        showAlert("Origin and Destination cannot be the same", "warning");
        setSpotBooking((prev) => ({
          ...prev,
          destination_country: "",
          destination_country_code: "",
          destination_country_id: "",
          dest_city_available: 0,
          dest_pincode_available: 0,
          destination_pincode: "",
          city: "",
        }));
        setThirdcountrydestdata(intselectedthirdcountdata);
        setThirdcountrydestpincodedata(intselecteddata2);
        setThirdcountrydestcitydata(intselecteddata3);
        setIsthirdcountryzipcode(false);
        localStorage.removeItem("code");
        return false;
      }
    }

    // TODO: RE-ENABLE this block after testing — EXPORT: destination must not be same as origin (India)
    // if (enquiryType == 2 && forwhat == 2 && a?.country_id == 97) {
    //   showAlert("Destination Country cannot be India for Export", "warning");
    //   setSpotBooking((prev) => ({
    //     ...prev,
    //     destination_country: "",
    //     destination_country_code: "",
    //     destination_country_id: "",
    //     city_available: 0,
    //     pincode_available: 0,
    //     destination_pincode: "",
    //     city: "",
    //   }));
    //   setSelecteddata(intselecteddata);
    //   setSelecteddata2(intselecteddata2);
    //   setSelecteddata3(intselecteddata3);
    //   localStorage.removeItem("code");
    //   return false;
    // }

    // IMPORT: origin must not be India (destination is fixed as India)
    if (enquiryType == 1 && forwhat == 1 && a?.country_id == 97) {
      showAlert("Origin Country cannot be India for Import", "warning");
      setSpotBooking((prev) => ({
        ...prev,
        origin_country: "",
        origin_country_code: "",
        origin_country_id: "",
        city_available: 0,
        pincode_available: 0,
        origin_pincode: "",
        origin_city: "",
      }));
      setSelecteddata(intselecteddata);
      setSelecteddata2(intselecteddata2);
      setSelecteddata3(intselecteddata3);
      localStorage.removeItem("code");
      return false;
    }

    localStorage.setItem("code", a?.country_code);
    if (forwhat == 2 || forwhat == 3) {
      setSpotBooking((prev) => ({
        ...prev,
        destination_country: a?.country_name || "",
        destination_country_code: a?.country_code || "",
        destination_country_id: a?.country_id || "",
        ...(forwhat == 2
          ? {
              city_available: a?.city_avail == 1 ? 1 : 0,
              pincode_available: a?.pincode_avail == 1 ? 1 : 0,
            }
          : {
              dest_city_available: a?.city_avail == 1 ? 1 : 0,
              dest_pincode_available: a?.pincode_avail == 1 ? 1 : 0,
            }),
      }));
      if (a?.pincode_avail == 0) {
        setSpotBooking((pre: any) => ({ ...pre, destination_pincode: "0000" }));
      }
    } else {
      setSpotBooking((prev) => ({
        ...prev,
        origin_country: a?.country_name || "",
        origin_state: a?.country_code || "",
        origin_country_code: a?.country_code || "",
        origin_country_id: a?.country_id || "",
        city_available: a?.city_avail == 1 ? 1 : 0,
        pincode_available: a?.pincode_avail == 1 ? 1 : 0,
      }));
      if (a?.pincode_avail == 0) {
        setSpotBooking((pre: any) => ({ ...pre, origin_pincode: "0000" }));
      }
    }
  };

  const funtohandle = (forwhat?: any, value?: any, type?: any) => {
    if (forwhat == "zipcode") {
      if (type == 1) {
        setSpotBooking((pre: any) => ({
          ...pre,
          origin_pincode: value,
          origin_city: "",
          origin_state: "",
          origin_state_code: "",
        }));
      } else {
        setSpotBooking((pre: any) => ({
          ...pre,
          destination_pincode: value,
          city: "",
          city_area: "",
          state: localStorage.getItem("code"),
        }));
      }
    } else {
      if (type == 1) {
        setSpotBooking((pre: any) => ({
          ...pre,
          origin_city: value,
        }));
      } else if (type == 2 || type == 3) {
        setSpotBooking((pre: any) => ({
          ...pre,
          city: value,
        }));
      }
    }
  };

  const funtoempty1 = (forwhat?: any) => {
    if (forwhat == 2 || forwhat == 3) {
      setSpotBooking((prev) => ({
        ...prev,
        destination_country: "",
        destination_country_code: "",
        destination_country_id: "",
        ...(forwhat == 3
          ? {
              dest_city_available: 0,
              dest_pincode_available: 0,
              destination_pincode: "",
              city: "",
            }
          : { city_available: 0, pincode_available: 0 }),
      }));

      if (forwhat !== 3) {
        setSpotBooking((pre: any) => ({ ...pre, destination_pincode: "" }));
      }
    } else {
      setSpotBooking((prev) => ({
        ...prev,
        origin_country: "",
        origin_country_code: "",
        origin_country_id: "",
      }));

      setSpotBooking((pre: any) => ({ ...pre, origin_pincode: "" }));
    }

    localStorage.removeItem("code");

    if (forwhat == 2) {
      setSelecteddata(intselecteddata);
      setSelecteddata2(intselecteddata2);
      setSelecteddata3(intselecteddata3);
    } else if (forwhat == 3) {
      setThirdcountrydestdata(intselectedthirdcountdata);
      setThirdcountrydestpincodedata(intselecteddata2);
      setThirdcountrydestcitydata(intselecteddata3);
      setIsthirdcountryzipcode(false);
    } else {
      setSelecteddata(intselecteddata);
      setSelecteddata2(intselecteddata2);
      setSelecteddata3(intselecteddata3);
    }
  };
  const fun3 = (a: any, forwhat?: any, type?: any) => {
    if (type == 2 || type == 3) {
      setSpotBooking((prev: any) => ({
        ...prev,
        dest_zip: a?.zipcode,
        destination_pincode: a?.zipcode,
        city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        state:
          a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, "") ||
          localStorage.getItem("code"),
        state_name: a?.state?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
      }));
      if (type == 3) {
        setThirdcountrydestpincodedata({
          zipcode: a?.zipcode || "",
          city: a?.city_area || "",
        });
      } else {
        setSelecteddata3((pre: any) => ({ ...pre, city_area: a?.city_area }));
      }
    } else {
      setSpotBooking((prev) => ({
        ...prev,
        origin_pincode: a?.zipcode,
        origin_city: a?.city_area,
        origin_state:
          a?.state?.trim() ||
          a?.state_code?.trim() ||
          localStorage.getItem("code") ||
          "",
        origin_state_code: a?.state_code,
      }));
      setSelecteddata3({
        zipcode: a?.zipcode || "",
        city: a?.city_area || "",
        city_area: a?.city_area || "",
      });
    }
  };
  const fun4 = (a: any, forwhat?: any, type?: any) => {
    if (type == 1) {
      setSpotBooking((pre: any) => ({
        ...pre,
        origin_city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        ...(a?.is_lookup_result && a?.zipcode
          ? { origin_pincode: a.zipcode }
          : {}),
      }));
    } else {
      setSpotBooking((prev: any) => ({
        ...prev,
        // destination_pincode: data?.zipcode,

        city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        ...(a?.is_lookup_result && a?.zipcode
          ? { destination_pincode: a.zipcode }
          : {}),
      }));
    }
  };
  const funtoempty4 = (forwhat?: any, type?: any) => {
    if (type == 1) {
      setSpotBooking((pre: any) => ({
        ...pre,
        origin_city: "",
        origin_pincode: "",
      }));
    } else {
      setSpotBooking((prev: any) => ({
        ...prev,
        // destination_pincode: data?.zipcode,
        city: "",
      }));
    }
  };

  const fun5 = (a: any, forwhat?: any) => {
    if (forwhat == 2) {
      setSpotBooking((prev) => ({
        ...prev,
        origin_pincode: a?.pincode,
        origin_city: a?.city,
        origin_state: a?.state,
        origin_state_code: a?.state_code,
      }));
    } else {
      setSpotBooking((prev: any) => ({
        ...prev,
        destination_pincode: a?.pincode,
        city: a?.city || "",
        destination_country_code: "IN" || "",
        destination_country_id: 97,
        destination_country: "India",
        state: a?.state_code,
        state_name: a?.state || "",
      }));
      // setSelecteddata3((pre: any) => ({ ...pre, city_area: a?.city_area }));
      setSelectedoriginpincodedata({
        pincode: a?.pincode,
        pincode_id: a?.pincode_id || "",
      });
    }
  };
  const funtoempty5 = (forwhat?: any, type?: any) => {
    if (forwhat == 2) {
      setSpotBooking((prev) => ({
        ...prev,
        origin_pincode: "",
        origin_city: "",
        origin_state: "",
        origin_state_code: "",
      }));
    } else {
      setSpotBooking((prev: any) => ({
        ...prev,
        destination_pincode: "",
        city: "",
        destination_country_code: "IN" || "",
        destination_country_id: 97,
        destination_country: "India",
        state: "",
        state_name: "",
      }));
      // setSelecteddata3((pre: any) => ({ ...pre, city_area: a?.city_area }));
    }
    setSelectedoriginpincodedata(intoriginpincodedata);
  };
  const funtoempty2 = (forwhat?: any, type?: any) => {
    if (type == 2 || type == 3) {
      setSpotBooking((prev: any) => ({
        ...prev,
        destination_pincode: "",
        city: "",
        state: localStorage.getItem("code") || "",
        state_name: "",
      }));
      if (type == 3) {
        setThirdcountrydestpincodedata(intselecteddata2);
      } else {
        setSelecteddata3(intselecteddata3);
      }
    } else {
      setSpotBooking((prev) => ({
        ...prev,
        origin_pincode: "",
        origin_city: "",
        origin_state: "",
        origin_state_code: "",
      }));
      setSelecteddata3(intselecteddata3);
    }
  };

  useEffect(() => {
    getintdata();

    if (state) {
      setSpotBooking((Pre: any) => ({ ...Pre, ...state?.booking }));
    }
  }, []);
  useEffect(() => {
    if (state && state?.is_duplicate) {
      handlefind(state?.booking_no);
    }
  }, [allfdata?.length]);

  const getcurrencydata = async (currency?: any, spotprice?: any) => {
    const res = await commongetrequest("booking/currency");
    if (res?.status == 200) {
      const singledata = res?.data?.data?.find(
        (item: any) => item?.id == currency,
      );

      setSpotBooking((pre: any) => ({
        ...pre,
        ...(spotprice
          ? {
              spot_price:
                Number(spotprice) / (Number(singledata?.exchange_rate) || 1),
            }
          : {}),
      }));
    }
  };
  const getintdata = async () => {
    try {
      const res = await commongetrequest("admin/franchisee-settings");
      const res2 = await commongetrequest("admin/courier-product");
      setAllfdata(res?.data?.data || []);
      setAllproducts(res2?.data?.data || []);
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  const handlefind = async (number?: any) => {
    try {
      setLoading(true);
      const res = await commonpostrequest(
        `booking/get_spot_enquiry?key=${number || enquiryNumber}`,
      );
      if (res?.status == 200) {
        const datasingle = res?.data?.data[0];
        if (datasingle) {
          let chweight: any = "";
          let franchisee_data: any = "";
          if (datasingle?.courier_id) {
            chweight = await getchweight(dimensionData, datasingle?.courier_id);
            franchisee_data = await commongetrequest(
              `admin/franchisee-settings?franchisee_id=${datasingle?.franchisee_id}`,
            )
              .then((res) => {
                return res?.data?.data[0] || null;
              })
              .catch((err) => {
                return null;
              });
          }

          if (franchisee_data?.is_active != 0) {
            setFranchiseeInactive(false);

            if (datasingle?.import_booking == 3) {
              // THIRD COUNTRY: both origin and destination are international
              const resOriginCountry = await commongetrequest(
                `admin/country?id=${datasingle?.org_country_id}`,
              );
              const resDestCountry = await commongetrequest(
                `admin/country?id=${datasingle?.dest_country_id}`,
              );

              if (resOriginCountry?.status == 200) {
                const originCountryData = resOriginCountry?.data?.data[0];
                const originCountryCode = originCountryData?.country_code;

                fun1(originCountryData, 1);
                setSelecteddata({
                  country_id: originCountryData?.country_id || "",
                  country_name: originCountryData?.country_name,
                });

                const resOriginPincode = await commongetrequest(
                  `admin/international-pincode?country_code=${originCountryCode}&zipcode=${
                    datasingle?.org_zip != "0000" ? datasingle?.org_zip : ""
                  }`,
                );
                const resOriginCity = await commongetrequest(
                  `admin/international-pincode?country_code=${originCountryCode}&zipcode=${
                    datasingle?.org_zip != "0000" ? datasingle?.org_zip : ""
                  }&city=${datasingle?.org_city}`,
                );

                if (
                  resOriginPincode?.status == 200 &&
                  (resOriginPincode?.data?.data || []).length >= 1
                ) {
                  fun3(resOriginPincode?.data?.data[0], "", 1);
                  setSelecteddata2({
                    zipcode: resOriginPincode?.data?.data[0]?.zipcode || "",
                    city: resOriginPincode?.data?.data[0]?.city_area || "",
                  });
                }

                if (resOriginCity?.status == 200) {
                  fun4(resOriginCity?.data?.data[0], "", 1);
                }
              }

              if (resDestCountry?.status == 200) {
                const destCountryData = resDestCountry?.data?.data[0];
                const destCountryCode = destCountryData?.country_code;

                fun1(destCountryData, 3);
                setThirdcountrydestdata({
                  country_id: destCountryData?.country_id || "",
                  country_name: destCountryData?.country_name,
                });

                const resDestPincode = await commongetrequest(
                  `admin/international-pincode?country_code=${destCountryCode}&zipcode=${
                    datasingle?.dest_zip != "0000" ? datasingle?.dest_zip : ""
                  }`,
                );
                const resDestCity = await commongetrequest(
                  `admin/international-pincode?country_code=${destCountryCode}&zipcode=${
                    datasingle?.dest_zip != "0000" ? datasingle?.dest_zip : ""
                  }&city=${datasingle?.dest_city}`,
                );

                if (
                  resDestPincode?.status == 200 &&
                  (resDestPincode?.data?.data || []).length >= 1
                ) {
                  fun3(resDestPincode?.data?.data[0], "", 3);
                }

                if (
                  resDestCity?.status == 200 &&
                  resDestCity?.data?.data?.[0]
                ) {
                  fun4(resDestCity?.data?.data[0], "", 3);
                  setThirdcountrydestcitydata({
                    city_area: resDestCity?.data?.data[0]?.city_area || "",
                    city: resDestCity?.data?.data[0]?.city_area || "",
                  });
                }
              }

              if (datasingle?.dest_zip == "0000") {
                setIsthirdcountryzipcode(true);
                setThirdcountrydestcitydata({
                  city_area: datasingle?.dest_city || "",
                  city: datasingle?.dest_city || "",
                });
              }
            } else {
              // EXPORT (import_booking == 1) and IMPORT (import_booking == 2)
              const res2 = await commongetrequest(
                `admin/domestic-pincode/${
                  datasingle?.import_booking
                    ? datasingle?.import_booking == 2
                      ? datasingle?.dest_zip
                      : datasingle?.org_zip
                    : datasingle?.org_zip
                }`,
              );
              const res3 = await commongetrequest(
                `admin/country?id=${
                  datasingle?.import_booking
                    ? datasingle?.import_booking == 2
                      ? datasingle?.org_country_id
                      : datasingle?.dest_country_id
                    : datasingle?.dest_country_id
                }`,
              );
              if (res3?.status == 200) {
                const res4 =
                  datasingle?.import_booking == 2
                    ? await commongetrequest(
                        `admin/international-pincode?country_code=${res3?.data?.data[0]?.country_code}&zipcode=${datasingle?.org_zip}`,
                      )
                    : await commongetrequest(
                        `admin/international-pincode?country_code=${res3?.data?.data[0]?.country_code}&zipcode=${datasingle?.dest_zip}`,
                      );
                const res5 =
                  datasingle?.import_booking == 2
                    ? await commongetrequest(
                        `admin/international-pincode?country_code=${
                          res3?.data?.data[0]?.country_code
                        }&zipcode=${
                          datasingle?.org_zip != "0000"
                            ? datasingle?.org_zip
                            : ""
                        }&city=${datasingle?.org_city}`,
                      )
                    : await commongetrequest(
                        `admin/international-pincode?country_code=${res3?.data?.data[0]?.country_code}&zipcode=${datasingle?.dest_zip}&city=${datasingle?.dest_city}`,
                      );
                if (res4?.status == 200) {
                  const data = res4?.data?.data || [];
                  if (data?.length >= 1) {
                    fun3(
                      res4?.data?.data[0],
                      "",
                      datasingle?.import_booking == 1 ? 2 : 1,
                    );
                    setSelecteddata2({
                      zipcode: res4?.data?.data[0]?.zipcode || "",
                      city: res4?.data?.data[0]?.city_area || "",
                    });
                  }
                }

                if (res5?.status == 200) {
                  fun4(
                    res5?.data?.data[0],
                    "",
                    datasingle?.import_booking == 1 ? 2 : 1,
                  );
                }
                if (res3?.status == 200) {
                  fun1(
                    res3?.data?.data[0],
                    datasingle?.import_booking == 1 ? 2 : 1,
                  );
                  setSelecteddata({
                    country_id: res3?.data?.data[0]?.country_id || "",
                    country_name: res3?.data?.data[0]?.country_name,
                  });
                }
              }

              if (res2?.status == 200) {
                setSelectedoriginpincodedata({
                  pincode: res2?.data?.data[0]?.pincode,
                  pincode_id: res2?.data?.data[0]?.pincode_id,
                });
                fun5(
                  res2?.data?.data[0],
                  datasingle?.import_booking == 1 ? 2 : 1,
                );
              }
            }

            setSpotBooking((pre: any) => ({
              ...pre,
              is_duplicate: 1,
              franchisee_id: datasingle?.franchisee_id,
              franchisee: datasingle?.franchisee_id || "",
              franchisee_name:
                allfdata?.find(
                  (item: any) =>
                    item?.franchisee_id == datasingle?.franchisee_id,
                )?.franchisee_name || "",
              hub_id: datasingle?.hub_id || 0,

              commodity: datasingle?.commodity || "",
              // credit_limit: "",
              currency_id: datasingle?.currency_id || 24,
              branch_id: datasingle?.branch_id || "",

              shipment_type: datasingle?.shipment_type || "",
              weight: chweight || datasingle?.weight || "",
              weight_unit: datasingle?.weight_unit || "kgs",
              unit: datasingle?.weight_unit || "kgs",
              quoted_by: datasingle?.quoted_by || "",
              // cargo_type: state?.booking?.cargo_type || "",
              clearence_type: datasingle?.clearence_type || "",
              price_type: datasingle?.price_type,

              courier_id: datasingle?.courier_id || "",
              courier_code: datasingle?.courier_code || "",

              courier_vendor_code: datasingle?.courier_vendor_code || "",
              booking_status: 0,
              "last_scan_event (internal)": "",
              service_type: "",
              remarks: datasingle?.remarks || "",
              incoterm: datasingle?.incoterm || "",
              startPoint: datasingle?.startPoint,
              courier_name:
                allproducts.find(
                  (item: any) => item?.product_id == datasingle?.courier_id,
                )?.product_name || "",
              ...(state?.booking?.startPoint == "listing"
                ? { booking_id: state?.booking?.booking_id }
                : {}),
              ...(datasingle?.shipment_type == 8
                ? {
                    fair_id: datasingle?.fair_data?.fair_id,
                    fair_venue: datasingle?.fair_data?.fair_venue,
                    fair_start_date: datasingle?.fair_data?.fair_start_date,
                    fair_end_date: datasingle?.fair_data?.fair_end_date,
                    // fair_data: datasingle?.fair_data,
                    is_returnable: datasingle?.is_returnable || 0,
                    mode: datasingle?.fair_data?.mode || "",
                    mode_value: datasingle?.fair_data?.mode_value || "",
                  }
                : {}),
              ...(datasingle?.import_booking == 2
                ? { import_booking_type: datasingle?.import_booking_type }
                : {}),
              ...(datasingle?.import_booking == 2
                ? { import_booking_type: datasingle?.import_booking_type }
                : {}),
              ...(datasingle?.import_booking == 2
                ? {
                    import_booking_type: datasingle?.import_booking_type,
                    import_service_type: datasingle?.import_service_type,
                  }
                : {}),
              forwhat: "enq",
              ...(datasingle?.org_zip == "0000"
                ? { is_zipcode: true, org_zip: "0000" }
                : {}),
            }));
            if (datasingle?.org_zip == "0000") {
              setIszipcode(true);
              setSelecteddata3({ city_area: datasingle?.org_city });
            }
            setEnquiryType(
              datasingle?.import_booking == 1
                ? 2
                : datasingle?.import_booking == 3
                  ? 3
                  : 1,
            );
            if (datasingle?.shipment_dimensions?.length >= 1) {
              setSpotBooking((pre: any) => ({
                ...pre,
                shipment_dimensions: datasingle?.shipment_dimensions,
              }));
            }

            if (datasingle?.currency_id) {
              getcurrencydata(datasingle?.currency_id, datasingle?.spot_price);
            }
            setModal(false);
          } else {
            setFranchiseeInactive(true);
          }
        }
      } else if (res?.status == 204) {
        showAlert("No Data Exists!!..", "warning");
      } else {
        showAlert(
          res?.response?.data?.msg || res?.response?.data?.message,
          "error",
        );
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handlereset = (type?: any) => {
    setSelecteddata(intselecteddata);
    setSelecteddata2(intselecteddata2);
    setSelecteddata3(intselecteddata3);
    setThirdcountrydestcitydata(intselecteddata3);
    setThirdcountrydestdata(intselectedthirdcountdata);
    setThirdcountrydestpincodedata(intselecteddata2);
    setIsthirdcountryzipcode(false);
    setSelectedoriginpincodedata(intoriginpincodedata);
    if (state) {
      setSpotBooking((Pre: any) => ({ ...Pre, ...state?.booking }));
    } else {
      if (type == 1) {
        setSpotBooking({
          ...initialState,
          origin_country: "",
          origin_country_code: "",
          destination_country: "INDIA",
          destination_country_code: "IN",
          destination_country_id: 97,
          origin_country_id: "",
        });
      } else {
        setSpotBooking(initialState);
      }
    }
  };

  const handleCancel = () => {
    setModal(false);
    setSpotBooking(initialState);
    handlereset(enquiryType);
  };

  const handleEnquiryTypeChange = (value: string) => {
    setEnquiryType(value);
    setSelecteddata(intselecteddata);
    setSelecteddata2(intselecteddata2);
    setSelecteddata3(intselecteddata3);
    setSelectedoriginpincodedata(intoriginpincodedata);

    if (value == "1") {
      setSpotBooking({
        ...initialState,
        origin_country: "",
        origin_country_code: "",
        destination_country: "INDIA",
        destination_country_code: "IN",
        destination_country_id: 97,
        origin_country_id: "",
      } as any);
    } else if (value == "3") {
      setSpotBooking({
        ...initialState,
        origin_country: "",
        origin_country_code: "",
        destination_country: "",
        destination_country_code: "",
        destination_country_id: "",
        origin_country_id: "",
      } as any);
      setThirdcountrydestdata(intselectedthirdcountdata);
      setThirdcountrydestcitydata(intselecteddata3);
      setThirdcountrydestpincodedata(intselecteddata2);
      setIsthirdcountryzipcode(false);
    } else {
      setSpotBooking(initialState);
    }
  };

  const handleFormReset = () => {
    setSpotBooking(initialState);
    if (state?.booking?.forwhat == "job") {
      setSpotBooking(state?.booking);
    } else {
      handlereset(enquiryType);
    }
  };
  const ModalDescription2 = (
    <>
      <div className="col-span-12 w-full">
        <FormLabel>
          Enter Enquiry Number <span className="text-red-400">*</span>
        </FormLabel>
        <IconField icon={Search}>
          <FormInput
            placeholder="Enter Enquiry Number"
            className={plainInputCls}
            onChange={(e: any) => {
              const value = e.target.value.replace(/[^a-zA-Z0-9 ]/g, "");
              setEnqiryNumber(value);
            }}
          />
        </IconField>
        {franchiseeInactive && (
          <p className="text-red-500 text-xs mt-0.5">
            This Franchisee is inactive.
          </p>
        )}
      </div>
    </>
  );
  const ModalTitle2 = (
    <>
      <div className="text-white font-bold">Check For Existing </div>
    </>
  );

  const ModalFooter2 = (
    <>
      <div className="flex justify-end gap-2 ml-4 max-[528px]:mt-2">
        <Button
          type="button"
          onClick={() => {
            handleCancel();
          }}
          className="w-20 text-white mr-1 bg-gray-500 p-2"
        >
          Cancel
        </Button>

        <Button
          variant="mustard"
          disabled={loading || !enquiryNumber}
          onClick={() => {
            handlefind();
            // setModal2(true)
          }}
          className="ml-2 bg-mustard p-2 w-[100px]"
        >
          {loading ? <LoadingButtonCommon text="Searching" /> : "Search"}
        </Button>
      </div>
    </>
  );

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-2 py-6 sm:px-4">
      <DocumentUploadModal
        open={docUploadModalOpen}
        onClose={() => setDocUploadModalOpen(false)}
      />

      <div
        className="rounded-2xl border border-slate-100 bg-white shadow-lg"
        data-aos="fade-up"
      >
        {/* ── Header ── */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[#fdf9ef] px-4 py-4 sm:px-6"
          data-aos="fade-up"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mustard text-white shadow-sm">
              <Plane className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-extrabold tracking-wide text-slate-700 sm:text-xl">
              SERVICEABILITY
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                handleCancel();
                handlereset(enquiryType);
              }}
              className="flex items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-50"
            >
              <FilePlus2 className="h-4 w-4" />
              NEW
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-mustard px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              DUPLICATE
            </button>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6" data-aos="fade-up">
          {state?.booking?.destination_country_id ? (
            <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50/60 p-3 sm:p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex items-center">
                  <i className="mr-1 h-[35px] w-[35px] rounded-full border border-yellow-100 bg-[#fdf7e4] p-[5px] text-center">
                    <img
                      src={franchiseeicon}
                      className="inline-block w-[22px]"
                    />
                  </i>
                  <aside className="ml-2 leading-[16px]">
                    <h5 className="font-bold">Franchisee:</h5>
                    <small className="text-xs text-gray-700">
                      {state?.booking?.franchisee_name || ""}
                    </small>
                  </aside>
                </div>

                <div className="flex items-center">
                  <i className="mr-1 h-[35px] w-[35px] rounded-full border border-yellow-100 bg-[#fdf7e4] p-[5px] text-center">
                    <img src={weighticon} className="inline-block w-[22px]" />
                  </i>
                  <aside className="ml-2 leading-[16px]">
                    <h5 className="font-bold">Chargable weight:</h5>
                    <small className="text-xs text-gray-700">
                      {state?.booking?.weight || ""} kgs
                    </small>
                  </aside>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {/* ── Enquiry type tabs + document upload ── */}
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <div className="grid w-full grid-cols-2 gap-2 rounded-xl border border-slate-100 p-1 md:inline-flex md:w-auto md:flex-wrap md:items-center md:gap-1">
              {ENQUIRY_TABS.map(({ value, label, Icon, iconCls, img }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleEnquiryTypeChange(value)}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide transition md:w-auto md:flex-none md:px-4 ${
                    value === "3" ? "col-span-2" : ""
                  } ${
                    enquiryType == value
                      ? "bg-mustard text-white shadow "
                      : "text-slate-500 hover:bg-white hover:text-slate-700 bg-slate-100 "
                  }`}
                >
                  {img ? (
                    <img
                      src={img}
                      className={`h-[22px] w-[22px] shrink-0 object-contain ${
                        enquiryType == value
                          ? " group-hover:brightness-[5654%] brightness-[5654%]  "
                          : " "
                      }`}
                    />
                  ) : (
                    <Icon className={`h-4 w-4 shrink-0 ${iconCls}`} />
                  )}
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setDocUploadModalOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-mustard px-4 py-2 text-sm font-semibold text-mustard transition hover:bg-mustard/10 md:w-auto"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
          </div>

          <div className="my-5 border-t border-slate-100" />

          {loading ? (
            <IsLoading
              h={`${spotbooking?.is_zipcode ? `h-[30vh]` : "h-[50vh]"}`}
            />
          ) : enquiryType == 2 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <div>
                  <label className={fieldLabelCls} htmlFor="origin-country">
                    ORIGIN COUNTRY <span className="text-red-500">*</span>
                  </label>
                  <IconField icon={MapPin} disabled>
                    <FormInput
                      id="origin-country"
                      value={spotbooking.origin_country}
                      disabled
                      className={plainInputCls}
                    />
                  </IconField>
                </div>

                <div>
                  <label className={fieldLabelCls} htmlFor="origin-pincode">
                    ORIGIN PINCODE <span className="text-red-500">*</span>
                  </label>
                  <CommonSearchableAll
                    apiEndpoint={`admin/domestic-pincode/`}
                    placeholder={"Search Origin Pincode"}
                    selecteddata={selectedoriginpincodedata}
                    setSelecteddata={setSelectedoriginpincodedata}
                    fun1={fun5}
                    comingselectedname={"pincode"}
                    comingselectedid={"pincode_id"}
                    funtoempty={funtoempty5}
                    directapply={true}
                    zIndex={20}
                    id={selectedoriginpincodedata?.pincode}
                    forwhat={2}
                    leftIcon={<Search className="w-4 h-4" />}
                    // border={error?.origin_pincode ? true : false}
                  />
                </div>

                <div>
                  <label className={fieldLabelCls} htmlFor="origin-city">
                    ORIGIN CITY <span className="text-red-500">*</span>
                  </label>
                  <IconField icon={Flag} disabled>
                    <FormInput
                      id="origin-city"
                      value={
                        spotbooking?.origin_pincode
                          ? spotbooking?.origin_city
                          : ""
                      }
                      disabled
                      className={plainInputCls}
                    />
                  </IconField>
                </div>

                {state?.booking?.destination_country_id ? (
                  <div>
                    <label className={fieldLabelCls}>
                      DESTINATION COUNTRY{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <IconField icon={Globe} disabled>
                      <FormInput
                        placeholder="Destination Country"
                        disabled
                        value={state?.booking?.destination_country}
                        className={plainInputCls}
                      />
                    </IconField>
                  </div>
                ) : (
                  <div>
                    <label
                      className={fieldLabelCls}
                      htmlFor="destination-country"
                    >
                      DESTINATION COUNTRY{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <CommonSearchableAll
                      apiEndpoint={"admin/country"}
                      placeholder={"Search Destination Country"}
                      selecteddata={selecteddata}
                      setSelecteddata={setSelecteddata}
                      fun1={fun1}
                      key1={"country"}
                      comingselectedname={"country_name"}
                      comingselectedid={"country_id"}
                      funtoempty={funtoempty1}
                      zIndex={20}
                      id={selecteddata?.country_id}
                      forwhat={2}
                      type={2}
                      leftIcon={<Globe className="w-4 h-4" />}
                    />
                  </div>
                )}
              </div>

              {spotbooking?.destination_country ? (
                <FormCheck className={checkRowCls}>
                  <FormCheck.Input
                    id="horizontal-form-3"
                    type="checkbox"
                    value={spotbooking?.is_zipcode}
                    onChange={(e: any) => {
                      setIszipcode(e.target.checked);
                      if (e.target.checked) {
                        setSpotBooking((pre: any) => ({
                          ...pre,
                          is_zipcode: 1,
                        }));
                        setSelecteddata2(intselecteddata2);
                      } else {
                        setSpotBooking((pre: any) => ({
                          ...pre,
                          is_zipcode: 0,
                          destination_pincode: "",
                          city: "",
                        }));
                        setSelecteddata3(intselecteddata3);
                      }
                    }}
                  />
                  <FormCheck.Label
                    htmlFor="horizontal-form-3"
                    className={checkLabelCls}
                  >
                    DEST. ZIPCODE AVAILABLE OR NOT
                  </FormCheck.Label>
                </FormCheck>
              ) : (
                ""
              )}

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {spotbooking?.pincode_available == 1 && !iszipcode && (
                  <div>
                    <label
                      className={fieldLabelCls}
                      htmlFor="destinationZipcode"
                    >
                      DESTINATION PINCODE
                      {/* <span className="text-red-500">*</span> */}
                    </label>
                    <CommonSearchableAll
                      apiEndpoint={`admin/international-pincode?country_code=${
                        spotbooking?.destination_country_code || ""
                      }`}
                      placeholder={"Search Destination Pincode"}
                      selecteddata={selecteddata2}
                      setSelecteddata={setSelecteddata2}
                      fun1={fun3}
                      key1={"zipcode"}
                      comingselectedname={"zipcode"}
                      comingselectedid={"city"}
                      questionmark={true}
                      addcomingname2={"city_area"}
                      addcomingname3={"state"}
                      funtoempty={funtoempty2}
                      zIndex={20}
                      openhandedfun={funtohandle}
                      forwhat="zipcode"
                      id={selecteddata2?.zipcode}
                      type={2}
                      leftIcon={<Search className="w-4 h-4" />}
                      enableZipcodeLookup={true}
                      countryName={spotbooking?.destination_country}
                    />
                  </div>
                )}

                {spotbooking?.city_available == 1 && (
                  <div>
                    <label className={fieldLabelCls} htmlFor="destinationCity">
                      CITY <span className="text-red-500">*</span>
                    </label>
                    <CommonSearchableAll
                      apiEndpoint={`admin/international-pincode?country_code=${
                        spotbooking?.destination_country_code || ""
                      }&zipcode=${spotbooking?.destination_pincode || ""}`}
                      placeholder={"Search City"}
                      selecteddata={selecteddata3}
                      setSelecteddata={setSelecteddata3}
                      fun1={fun4}
                      key1={"city"}
                      comingselectedname={"city_area"}
                      comingselectedid={"city_area"}
                      questionmark={true}
                      funtoempty={funtoempty4}
                      openhandedfun={funtohandle}
                      forwhat="city"
                      id={selecteddata3?.city_area}
                      type={2}
                      leftIcon={<Building2 className="w-4 h-4" />}
                      enableZipcodeLookup={true}
                      lookupType="city"
                      countryName={spotbooking?.destination_country}
                      lookupZipcode={
                        spotbooking?.pincode_available == 1
                          ? spotbooking?.destination_pincode
                          : "0000"
                      }
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className={secondaryBtnCls}
                  onClick={handleFormReset}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="button"
                  className={primaryBtnCls}
                  onClick={handleSubmit}
                >
                  <Check className="h-4 w-4" />
                  Check
                </button>
              </div>
            </div>
          ) : enquiryType == 1 || enquiryType == 3 ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                <div>
                  <label className={fieldLabelCls}>
                    ORIGIN COUNTRY <span className="text-red-500">*</span>
                  </label>
                  <CommonSearchableAll
                    apiEndpoint={"admin/country"}
                    placeholder={"Search Origin Country"}
                    selecteddata={selecteddata}
                    setSelecteddata={setSelecteddata}
                    fun1={fun1}
                    key1={"country"}
                    comingselectedname={"country_name"}
                    comingselectedid={"country_id"}
                    funtoempty={funtoempty1}
                    zIndex={20}
                    id={selecteddata?.country_id}
                    forwhat={1}
                    type={1}
                    refvalue={inputRef}
                    leftIcon={<Globe className="w-4 h-4" />}
                  />
                </div>

                {spotbooking?.origin_country ? (
                  <div className="md:mt-[26px]">
                    <FormCheck className={checkRowCls}>
                      <FormCheck.Input
                        id="horizontal-form-3"
                        type="checkbox"
                        value={spotbooking?.is_zipcode}
                        onChange={(e: any) => {
                          setIszipcode(e.target.checked);
                          if (e.target.checked) {
                            setSpotBooking((pre: any) => ({
                              ...pre,
                              is_zipcode: 1,
                            }));
                            setSelecteddata2(intselecteddata2);
                          } else {
                            setSpotBooking((pre: any) => ({
                              ...pre,
                              is_zipcode: 0,
                              origin_pincode: "",
                              origin_city: "",
                            }));
                            setSelecteddata3(intselecteddata3);
                          }
                        }}
                        checked={!!spotbooking?.is_zipcode}
                      />
                      <FormCheck.Label
                        htmlFor="horizontal-form-3"
                        className={checkLabelCls}
                      >
                        ORIGIN ZIPCODE AVAILABLE OR NOT
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                ) : (
                  ""
                )}

                {spotbooking?.pincode_available == 1 && !iszipcode && (
                  <div>
                    <label className={fieldLabelCls}>
                      ORIGIN PINCODE <span className="text-red-500">*</span>
                    </label>
                    <CommonSearchableAll
                      apiEndpoint={`admin/international-pincode?country_code=${
                        spotbooking?.origin_country_code || ""
                      }`}
                      placeholder={"Search Origin Pincode"}
                      selecteddata={selecteddata2}
                      setSelecteddata={setSelecteddata2}
                      fun1={fun3}
                      key1={"zipcode"}
                      comingselectedname={"zipcode"}
                      comingselectedid={"city"}
                      questionmark={true}
                      addcomingname2={"city_area"}
                      addcomingname3={"state"}
                      funtoempty={funtoempty2}
                      zIndex={20}
                      openhandedfun={funtohandle}
                      forwhat="zipcode"
                      id={selecteddata2?.zipcode}
                      type={1}
                      leftIcon={<Search className="w-4 h-4" />}
                      enableZipcodeLookup={true}
                      countryName={spotbooking?.origin_country}
                    />
                  </div>
                )}

                {spotbooking?.city_available == 1 && (
                  <div>
                    <label className={fieldLabelCls} htmlFor="destinationCity">
                      ORIGIN CITY <span className="text-red-500">*</span>
                    </label>
                    <CommonSearchableAll
                      apiEndpoint={`admin/international-pincode?country_code=${
                        spotbooking?.origin_country_code || ""
                      }&zipcode=${spotbooking?.origin_pincode || ""}`}
                      placeholder={"Search City"}
                      selecteddata={selecteddata3}
                      setSelecteddata={setSelecteddata3}
                      fun1={fun4}
                      key1={"city"}
                      comingselectedname={"city_area"}
                      comingselectedid={"city_area"}
                      questionmark={true}
                      funtoempty={funtoempty4}
                      openhandedfun={funtohandle}
                      forwhat="city"
                      id={selecteddata3?.city || selecteddata3?.city_area}
                      type={1}
                      zIndex={20}
                      leftIcon={<Flag className="w-4 h-4" />}
                      enableZipcodeLookup={true}
                      lookupType="city"
                      countryName={spotbooking?.origin_country}
                      lookupZipcode={
                        spotbooking?.pincode_available == 1
                          ? spotbooking?.origin_pincode
                          : "0000"
                      }
                    />
                  </div>
                )}

                {enquiryType == 1 ? (
                  <div>
                    <label className={fieldLabelCls}>
                      DESTINATION COUNTRY{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <IconField icon={Globe} disabled>
                      <FormInput
                        placeholder="Destination Country"
                        disabled
                        value={"India"}
                        className={plainInputCls}
                      />
                    </IconField>
                  </div>
                ) : (
                  <div>
                    <label
                      className={fieldLabelCls}
                      htmlFor="destination-country"
                    >
                      DESTINATION COUNTRY{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <CommonSearchableAll
                      apiEndpoint={"admin/country"}
                      placeholder={"Search Destination Country"}
                      selecteddata={thirdcountrydestdata}
                      setSelecteddata={setThirdcountrydestdata}
                      fun1={fun1}
                      key1={"country"}
                      comingselectedname={"country_name"}
                      comingselectedid={"country_id"}
                      funtoempty={funtoempty1}
                      zIndex={20}
                      id={thirdcountrydestdata?.country_id}
                      forwhat={3}
                      type={3}
                      refvalue={inputRef2}
                      leftIcon={<Globe className="w-4 h-4" />}
                    />
                  </div>
                )}

                {enquiryType == 3 &&
                spotbooking?.destination_country &&
                (spotbooking as any)?.dest_pincode_available == 1 ? (
                  <div className="md:mt-[26px]">
                    <FormCheck className={checkRowCls}>
                      <FormCheck.Input
                        id="third-country-dest-zipcode"
                        type="checkbox"
                        onChange={(e: any) => {
                          setIsthirdcountryzipcode(e.target.checked);
                          if (e.target.checked) {
                            setSpotBooking((pre: any) => ({
                              ...pre,
                              destination_pincode: "0000",
                              city: "",
                            }));
                            setThirdcountrydestcitydata(intselecteddata3);
                          } else {
                            setSpotBooking((pre: any) => ({
                              ...pre,
                              destination_pincode: "",
                              city: "",
                            }));
                            setThirdcountrydestcitydata(intselecteddata3);
                          }
                        }}
                        checked={isthirdcountryzipcode}
                      />
                      <FormCheck.Label
                        htmlFor="third-country-dest-zipcode"
                        className={checkLabelCls}
                      >
                        DEST. ZIPCODE AVAILABLE OR NOT
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                ) : (
                  ""
                )}

                {(spotbooking as any)?.dest_pincode_available == 1 &&
                !isthirdcountryzipcode &&
                enquiryType == 3 ? (
                  <div>
                    <label className={fieldLabelCls}>DESTINATION PINCODE</label>
                    <CommonSearchableAll
                      apiEndpoint={`admin/international-pincode?country_code=${
                        spotbooking?.destination_country_code || ""
                      }`}
                      placeholder={"Search Destination Pincode"}
                      selecteddata={thirdcountrydestpincodedata}
                      setSelecteddata={setThirdcountrydestpincodedata}
                      fun1={fun3}
                      key1={"zipcode"}
                      comingselectedname={"zipcode"}
                      comingselectedid={"city"}
                      questionmark={true}
                      addcomingname2={"city_area"}
                      addcomingname3={"state"}
                      funtoempty={funtoempty2}
                      zIndex={20}
                      openhandedfun={funtohandle}
                      forwhat="zipcode"
                      id={thirdcountrydestpincodedata?.zipcode}
                      type={3}
                      leftIcon={<Search className="w-4 h-4" />}
                      enableZipcodeLookup={true}
                      countryName={spotbooking?.destination_country}
                    />
                  </div>
                ) : (
                  enquiryType == 1 && (
                    <div>
                      <label className={fieldLabelCls}>
                        DESTINATION PINCODE
                      </label>
                      <CommonSearchableAll
                        apiEndpoint={`admin/domestic-pincode/`}
                        placeholder={"Search Destination Pincode"}
                        selecteddata={selectedoriginpincodedata}
                        setSelecteddata={setSelectedoriginpincodedata}
                        fun1={fun5}
                        comingselectedname={"pincode"}
                        comingselectedid={"pincode_id"}
                        funtoempty={funtoempty5}
                        directapply={true}
                        zIndex={20}
                        id={selectedoriginpincodedata?.pincode}
                        forwhat={1}
                        leftIcon={<Search className="w-4 h-4" />}
                      />
                    </div>
                  )
                )}

                {(spotbooking as any)?.dest_city_available == 1 &&
                  enquiryType == 3 && (
                    <div>
                      <label className={fieldLabelCls}>
                        DESTINATION CITY <span className="text-red-500">*</span>
                      </label>
                      <CommonSearchableAll
                        apiEndpoint={`admin/international-pincode?country_code=${
                          spotbooking?.destination_country_code || ""
                        }&zipcode=${spotbooking?.destination_pincode || ""}`}
                        placeholder={"Search City"}
                        selecteddata={thirdcountrydestcitydata}
                        setSelecteddata={setThirdcountrydestcitydata}
                        fun1={fun4}
                        key1={"city"}
                        comingselectedname={"city_area"}
                        comingselectedid={"city_area"}
                        questionmark={true}
                        funtoempty={funtoempty4}
                        openhandedfun={funtohandle}
                        forwhat="city"
                        id={thirdcountrydestcitydata?.city_area}
                        type={3}
                        zIndex={20}
                        leftIcon={<Building2 className="w-4 h-4" />}
                        enableZipcodeLookup={true}
                        lookupType="city"
                        countryName={spotbooking?.destination_country}
                        lookupZipcode={
                          (spotbooking as any)?.dest_pincode_available == 1
                            ? spotbooking?.destination_pincode
                            : "0000"
                        }
                      />
                    </div>
                  )}

                {enquiryType == 1 && (
                  <div>
                    <label className={fieldLabelCls} htmlFor="destination-city">
                      DESTINATION CITY <span className="text-red-500">*</span>
                    </label>
                    <IconField icon={Building2} disabled>
                      <FormInput
                        id="destination-city"
                        value={
                          spotbooking?.destination_pincode
                            ? spotbooking?.city
                            : ""
                        }
                        disabled
                        className={plainInputCls}
                      />
                    </IconField>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className={secondaryBtnCls}
                  onClick={handleFormReset}
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="button"
                  className={primaryBtnCls}
                  onClick={handleSubmit}
                >
                  <Check className="h-4 w-4" />
                  Check
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      {modal && (
        <CommonModal
          open={modal}
          setOpen={setModal}
          title={ModalTitle2}
          description={ModalDescription2}
          footer={ModalFooter2}
          gridColumns={24}
          size={"md"}
        />
      )}
    </div>
  );
};

export default SpotEnquirymain;
