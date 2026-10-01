import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import Lucide from "../../../base-components/Lucide";
import Button from "../../../base-components/Button";

import { Tab } from "../../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import TomSelect from "../../../base-components/TomSelect";
import Table from "../../../base-components/Table";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import LoadingGif from "../../../assets/images/loading.gif";
import ErrorGif from "../../../assets/images/icons/error.gif";
// import OdaFinder from "./odaFinder";
import { indianFormat } from "../../../utils";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import CommonSearchableAll from "../commoncomponents/CommonSearchableall/CommonSearchableall";
import SearchableComp from "../commoncomponents/Commonsearchablebasedcom/commonsearchablecom";
const intselecteddata = {
  pincode_id: "",
  pincode: "",
};
const intselecteddata2 = {
  pincode_id: "",
  pincode: "",
};
const intselecteddata3 = {
  zipcode: "",
  city: "",
  city_area: "",
};
const intfranchiseedata = {
  franchisee_id: "",
  franchisee_name: "",
};
const intcountrydata = {
  country_id: "",
  country_name: "",
};
const intdestzipcode = {
  zipcode: "",
  city_area: "",
};
const RateCalculator = ({ forwhat }) => {
  const [toggleUI, setToggleUI] = useState(false);
  //   const { franchiseeId, isKavach } = useFranchisee();
  let countries = [];
  const [selecteddestzipcodedata, setSelecteddestzipcodedata] =
    useState<any>(intdestzipcode);
  const [pincodeAvailable, setPincodeAvailable] = useState(false);
  const [selectedcountrydata, setSelectedCountrydata] =
    useState<any>(intcountrydata);
  const [selecteddata, setSelecteddata] = useState<any>(intselecteddata);
  const [selecteddata2, setSelecteddata2] = useState<any>(intselecteddata2);
  const [selecteddata3, setSelecteddata3] = useState<any>(intselecteddata3);
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const initialState = {
    franchisee: "",
    booking_type: "2",
    origin_pincode: "",
    destination_country: "",
    destination_pincode: "",
    unit: { weight_unit: "kgs", length_unit: "cms", currency: "24" },
    shipment_type: "",
    weight: "",
    length: "",
    quantity: "",
  };
  const [ratesData, setRatesData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [pincodeCityData, setPincodeCityData] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentFaq, setCurrentFaq] = useState(1);
  const [error, setError] = useState({});
  const { showAlert } = useAlert();
  const [shipmentTypeData, setShipmentTypeData] = useState([]);

  const [rateFormData, setRateFormData] = useState<any>(initialState);
  const [isVendorLoading, setIsVendorLoading] = useState<boolean>(false);
  const [isVendorError, setIsVendorError] = useState<boolean>(false);
  const [clicked, setClicked] = useState("");
  const { userdata } = useLogin();
  const fun3 = (value: any) => {
    setError((prev) => ({
      ...prev,
      origin_pincode: "",
    }));
    setRateFormData((prev) => ({
      ...prev,
      origin_pincode: value?.pincode,
    }));
  };

  const handlintdata = (value: any) => {
    setError({});

    setPincodeAvailable(false);
    setSpinner(false);
    setRatesData([]);
    setIsVendorLoading(false);
    setSelecteddestzipcodedata(intdestzipcode);
    setCurrentFaq(1);
    setRateFormData((prev) => ({
      ...initialState,
      booking_type: value == 1 ? "2" : "1",
    }));

    setSelectedCountrydata(intcountrydata);
    setSelecteddata(intselecteddata);
    setSelecteddata2(intselecteddata2);
    setSelecteddata3(intselecteddata3);
    setSelectedfranchisedata(intfranchiseedata);
  };

  const funtoempty2 = () => {
    setSelecteddata(intselecteddata);
    setRateFormData((prev) => ({
      ...prev,
      origin_pincode: "",
    }));
  };
  const fun4 = (value: any) => {
    setError((prev) => ({
      ...prev,
      destination_pincode: "",
    }));
    setRateFormData((prev) => ({
      ...prev,
      destination_pincode: value?.pincode,
    }));
  };
  const funtoempty4 = () => {
    setSelecteddata2(intselecteddata2);
    setRateFormData((prev) => ({
      ...prev,
      destination_pincode: "",
    }));
  };

  const fun5 = (value: any) => {

    setError((prev) => ({
      ...prev,
      franchisee: "",
      is_kawach: "",
    }));
    setRateFormData((prev) => ({
      ...prev,
      franchisee: value?.franchisee_id,
      is_kawach: value?.is_kawach,
    }));
  };
  const fun5toempty = () => {
    setSelectedfranchisedata(intfranchiseedata);
    setRateFormData((pre: any) => ({ ...pre, franchisee: "", is_kawach: "" }));
  };
  const fun6 = (value: any) => {
    setError((prev) => ({ ...prev, destination_country: "" }));

    setPincodeAvailable(value?.pincode_avail ? true : false);

    localStorage.setItem("dccode", value?.country_code);

    setRateFormData((prev) => ({
      ...prev,
      destination_country: value?.country_id,
      destination_country_code: value?.country_code,
      destination_pincode: "",
      city: "",
    }));
    setSelecteddestzipcodedata(intdestzipcode);
    setSelecteddata3(intselecteddata3);
  };
  const fun6toempty = () => {
    setSelectedCountrydata(intcountrydata);
    setError((prev) => ({ ...prev, destination_country: "" }));
    setRateFormData((prev) => ({
      ...prev,
      destination_country: "",
      destination_country_code: "",
      destination_pincode: "",
      city: "",
    }));
    setSelecteddestzipcodedata(intdestzipcode);
    setSelecteddata3(intselecteddata3);

    setPincodeAvailable(false);
    localStorage.removeItem("dccode");
  };
  const fun7 = (value: any) => {
    setError((prev) => ({
      ...prev,
      destination_pincode: "",
    }));

    setRateFormData((pre) => ({
      ...pre,
      destination_pincode: value?.zipcode || "",
      city: value?.city_area || "",
      state: value?.state_code || "",
      state_name: value?.state || "",
    }));
    setSelecteddata3((pre) => ({
      ...pre,
      city_area: value?.city_area || "",
    }));
  };
  const funtoempty7 = () => {
    setError((prev) => ({ ...prev, destination_pincode: "" }));
    setRateFormData((prev) => ({
      ...prev,
      destination_pincode: "",
      city: "",
      state: "",
      state_name: "",
    }));
    setSelecteddestzipcodedata(intdestzipcode);
  };

  const fun8 = (value: any) => {
    setRateFormData((prev) => ({
      ...prev,
      city: value?.city_area || "",
      ...(value?.zipcode ? { destination_pincode: value.zipcode } : {}),
    }));
    if (value?.zipcode) {
      setSelecteddestzipcodedata((pre) => ({
        ...pre,
        zipcode: value.zipcode,
      }));
    }
  };
  const funtoempty8 = () => {
    setSelecteddata3(intselecteddata3);
    setRateFormData((prev) => ({
      ...prev,
      city: "",
    }));
  };

  const handleSubmit = async () => {

    const errors = {};
    
    Object.keys(rateFormData).forEach((item) => {
      if (!rateFormData[item] && item !== "is_kawach")
        errors[item] = "This field is required";
    });
    if (rateFormData?.booking_type == 1) {
      delete errors?.destination_pincode;
    }

    delete errors?.destination_country_code;
    delete errors?.length;
    delete errors?.quantity;
    if (rateFormData?.booking_type == 2) {
      delete errors?.destination_country;
    }
    // delete errors?.destination_country;
    delete errors?.state;
    delete errors?.city;
    delete errors?.state_name;
    delete errors?.origin_state;
    delete errors?.origin_state_name;
    setError(errors);


    if (Object.keys(errors).length > 0) {
      return false;
    }

    let data = {};

    if (rateFormData?.booking_type == 1) {
      if (rateFormData?.shipment_type == 2) {
        data = {
          city: rateFormData?.city || "",
          state: rateFormData?.state || "",
          state_name: rateFormData?.state_name || "",
          is_kawach: rateFormData?.is_kawach || 0,
          franchisee: rateFormData?.franchisee,
          booking_type: rateFormData?.booking_type,
          origin_pincode: rateFormData?.origin_pincode,
          destination_pincode: rateFormData?.destination_pincode
            ? rateFormData?.destination_pincode
            : "0000",
          destination_country: rateFormData?.destination_country,
          country_code: rateFormData?.destination_country_code || "",
          shipment_type: rateFormData?.shipment_type,
          unit: {
            weight_unit: "kgs",
            length_unit: "cms",
            currency: "24",
          },
          weight: rateFormData?.weight,
        };
      } else {
        data = {
          is_kawach: rateFormData?.is_kawach || 0,
          city: rateFormData?.city || "",
          state: rateFormData?.state || "",
          state_name: rateFormData?.state_name || "",
          franchisee: rateFormData?.franchisee,
          booking_type: rateFormData?.booking_type,
          origin_pincode: rateFormData?.origin_pincode,
          destination_pincode: rateFormData?.destination_pincode
            ? rateFormData?.destination_pincode
            : "0000",
          destination_country: rateFormData?.destination_country,
          country_code: rateFormData?.destination_country_code || "",
          shipment_type: rateFormData?.shipment_type,
          unit: {
            weight_unit: "kgs",
            length_unit: "cms",
            currency: "24",
          },
          shipment_dimensions: [
            {
              item_description: "Book",
              weight: rateFormData?.weight,
              value: "1",
              quantity: rateFormData?.quantity || "1",
              length: rateFormData?.length || "1",
              breadth: "1",
              height: "1",
              hsn_code: "49011010",
            },
          ],
        };
      }
    } else {
      if (rateFormData?.shipment_type == 2) {
        data = {
          is_kawach: rateFormData?.is_kawach || 0,
          franchisee: rateFormData?.franchisee,
          booking_type: rateFormData?.booking_type,
          origin_pincode: rateFormData?.origin_pincode,
          destination_pincode: rateFormData?.destination_pincode,
          destination_country: "97",
          unit: {
            weight_unit: "kgs",
            length_unit: "cms",
            currency: "24",
          },
          shipment_type: rateFormData?.shipment_type,
          weight: rateFormData?.weight,
        };
      } else {
        data = {
          is_kawach: rateFormData?.is_kawach || 0,
          //   franchisee: franchiseeId,
          franchisee: rateFormData?.franchisee,
          booking_type: rateFormData?.booking_type,
          origin_pincode: rateFormData?.origin_pincode,
          destination_pincode: rateFormData?.destination_pincode,
          destination_country: "97",
          unit: {
            weight_unit: "kgs",
            length_unit: "cms",
            currency: "24",
          },
          shipment_type: rateFormData?.shipment_type,
          shipment_dimensions: [
            {
              item_description: "Book",
              weight: rateFormData?.weight,
              value: "1",
              quantity: rateFormData?.quantity || "1",
              length: rateFormData?.length || "1",
              breadth: "1",
              height: "1",
              hsn_code: "49011010",
            },
          ],
        };
      }
    }

    setSpinner(true);
    setIsVendorLoading(true);

    try {
      const response: any = await commonpostrequest("admin/get-rates", data);
      // console.log(response?.data?.data);
      if (response?.status == 200) {
        setRatesData(response?.data?.data);
        setIsVendorLoading(false);
        setCurrentStep(2);
        setCurrentFaq(2);
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
    } catch (err: any) {
      showAlert(err?.message, "error");
      console.log(err);
      setIsVendorLoading(false);
      setIsVendorError(true);
    } finally {
      setSpinner(false);
    }
  };

  const getData = async () => {
    try {
      const response: any = await commongetrequest(
        `admin/booking-shipment-type`
      );
      // console.log(response, "response");
      if (response?.status == 200) {
        setShipmentTypeData(response?.data?.data);
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
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };

  const handleSetInitial = () => {
    setCurrentStep(1);
    setCurrentFaq(1);

    setPincodeAvailable(false);
    setSpinner(false);
    setRatesData([]);
    setIsVendorLoading(false);
    setError({});
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {toggleUI ? (
        // <OdaFinder setToggleUI={setToggleUI} />
        <h1>hello</h1>
      ) : (
        <div className="h-auto grid grid-cols-1 lg:grid-cols-2 gap-4 pb-8 mb-8">
          <Disclosure as="div" className=" mt-8 w-full">
            {({ open }) => (
              <div className="bg-white rounded-lg">
                <Disclosure.Button
                  onClick={() => {
                    handleSetInitial();
                    setClicked("");
                  }}
                  className="flex items-center w-full justify-between rounded-lg bg-white px-5 py-3 text-left text-sm font-medium"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[60%_40%] w-full">
                    <div className="w-full">
                      <h1 className="text-xl font-bold ">Rate Calculator</h1>
                    </div>
                    {/* <div className="flex justify-end">
                      <Button
                        rounded
                        className="bg-mustard text-white"
                        // onClick={() => {
                        //   setOpenModal(true);
                        // }}
                        onClick={() => {
                          setToggleUI(true);
                        }}
                      >
                        Click here to find ODA
                        <Lucide
                          icon="Search"
                          className="w-4 h-4 ml-2 stroke-2.5"
                        />
                      </Button>
                    </div> */}
                  </div>

                  {/* <Lucide
                    icon="ChevronUp"
                    onClick={() => {
                      handleSetInitial();
                      setClicked("");
                    }}
                    className={`w-1/3 ${
                      currentStep == 1 ? "" : "rotate-180 transform stroke-2.5"
                    } h-8 w-8 text-mustard`}
                  /> */}
                </Disclosure.Button>
                {currentStep >= 1 && (
                  <Disclosure.Panel
                    static={true}
                    className="px-8 pb-2 pt-4 text-sm text-gray-500 border-t w-full"
                  >
                    <Tab.Group className="w-full">
                      <Tab.List variant="boxed-tabs">
                        <Tab>
                          <Tab.Button
                            className={`w-full py-2 text-lg font-bold shadow-md ${
                              rateFormData?.booking_type == 2
                                ? "bg-mustard tex-white"
                                : ""
                            } `}
                            as="button"
                            // bg="mustard"
                            onClick={() => {
                              handlintdata(1);
                            }}
                          >
                            Domestic
                          </Tab.Button>
                        </Tab>
                        <Tab>
                          <Tab.Button
                            className={`w-full py-2 text-lg font-bold shadow-md  ${
                              rateFormData?.booking_type == 1
                                ? "bg-mustard tex-white"
                                : ""
                            }`}
                            as="button"
                            // bg="mustard"
                            onClick={() => {
                              handlintdata(2);
                            }}
                          >
                            International
                          </Tab.Button>
                        </Tab>
                      </Tab.List>
                      <Tab.Panels className="my-5">
                        <Tab.Panel className="leading-relaxed">
                          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 px-1">
                            <div className="grid col-span-1">
                              <div>
                                <FormLabel
                                  htmlFor="origin"
                                  className="text-sm pb-1 mt-0 text-black"
                                >
                                  CUSTOMER NAME
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <CommonSearchableAll
                                  apiEndpoint={`admin/franchisee-settings${
                                    forwhat == 1
                                      ? `?sales_id=${userdata?.mapped_id}`
                                      : ""
                                  }`}
                                  // ?sales_id=${userdata?.mapped_id}`}
                                  placeholder={"Search For  Customer"}
                                  selecteddata={selectedfranchisedata}
                                  setSelecteddata={setSelectedfranchisedata}
                                  fun1={fun5}
                                  comingselectedname={"franchisee_name"}
                                  comingselectedid={"franchisee_id"}
                                  funtoempty={fun5toempty}
                                  questionmark={forwhat == 1 ? true : false}
                                  key1={"key"}
                                  border={error?.franchisee ? true : false}
                                  zIndex={20}
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <FormLabel
                                htmlFor="origin"
                                className="text-sm mb-[-2] text-black"
                              >
                                ORIGIN PINCODE{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>

                              <CommonSearchableAll
                                apiEndpoint={`admin/domestic-pincode/`}
                                placeholder={"Search For  Pincode"}
                                selecteddata={selecteddata}
                                setSelecteddata={setSelecteddata}
                                fun1={fun3}
                                comingselectedname={"pincode"}
                                comingselectedid={"pincode_id"}
                                funtoempty={funtoempty2}
                                directapply={true}
                                border={error?.origin_pincode ? true : false}
                                zIndex={20}
                              />
                            </div>
                            <div className="grid gap-2">
                              <FormLabel
                                htmlFor="destination"
                                className="text-sm mb-[-2] text-black"
                              >
                                DESTINATION PINCODE{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <CommonSearchableAll
                                apiEndpoint={`admin/domestic-pincode/`}
                                placeholder={"Search For  Pincode"}
                                selecteddata={selecteddata2}
                                setSelecteddata={setSelecteddata2}
                                fun1={fun4}
                                comingselectedname={"pincode"}
                                comingselectedid={"pincode_id"}
                                funtoempty={funtoempty4}
                                directapply={true}
                                border={
                                  error?.destination_pincode ? true : false
                                }
                                zIndex={20}
                              />
                            </div>
                            <div className="grid gap-2">
                              <FormLabel
                                htmlFor="dimensions"
                                className="text-sm mb-[-2]  text-black"
                              >
                                SHIPMENT TYPE{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormSelect
                                className={`w-[100%] mb-1  sm:mr-2 p-1 ${
                                  error?.shipment_type ? "border-red-500" : ""
                                }`}
                                formSelectSize="lg"
                                value={rateFormData?.shipment_type}
                                onChange={(e) => {
                                  setError((prev) => ({
                                    ...prev,
                                    shipment_type: "",
                                  }));
                                  setRateFormData((prev) => ({
                                    ...prev,
                                    shipment_type: e.target.value,
                                  }));
                                }}
                              >
                                <option value="">Select Shipment Type</option>
                                {shipmentTypeData?.map(
                                  (type) =>
                                    type?.is_active == 1 &&
                                    type?.booking_shipment_type_id != 4 &&
                                    type?.booking_shipment_type_id != 5 && (
                                      <option
                                        key={type?.booking_shipment_type_id}
                                        value={type?.booking_shipment_type_id}
                                      >
                                        {type?.shipment_type}
                                      </option>
                                    )
                                )}
                              </FormSelect>
                            </div>
                            <div className="grid gap-2">
                              <FormLabel
                                htmlFor="weight"
                                className="text-sm mb-[-2] text-black"
                              >
                                WEIGHT (IN KGS){" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormInput
                                id="weight"
                                placeholder="Enter weight"
                                formInputSize="lg"
                                value={rateFormData?.weight}
                                className={`w-[100%] ${
                                  error?.weight ? "border-red-500" : ""
                                }`}
                                onChange={(e) => {
                                  setError((prev) => ({
                                    ...prev,
                                    weight: "",
                                  }));
                                  setRateFormData((prev) => ({
                                    ...prev,
                                    weight: e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ),
                                  }));
                                }}
                              />
                            </div>
                            {rateFormData?.shipment_type &&
                              rateFormData?.shipment_type != 2 && (
                                <>
                                  <div className="grid gap-2">
                                    <FormLabel
                                      htmlFor="length"
                                      className="text-sm mb-[-2] text-black"
                                    >
                                      MAX LENGTH (IN CMS){" "}
                                    </FormLabel>
                                    <FormInput
                                      id="length"
                                      placeholder="Enter Max Length"
                                      formInputSize="lg"
                                      value={rateFormData?.length}
                                      className="w-[100%]"
                                      onChange={(e) => {
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          length: e.target.value.replace(
                                            /[^0-9.]/g,
                                            ""
                                          ),
                                        }));
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <FormLabel
                                      htmlFor="quantity"
                                      className="text-sm mb-[-2] text-black"
                                    >
                                      QUANTITY (IN PCS)
                                    </FormLabel>
                                    <FormInput
                                      id="quantity"
                                      placeholder="Enter Quantity"
                                      formInputSize="lg"
                                      value={rateFormData?.quantity}
                                      className="w-[100%]"
                                      onChange={(e) => {
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          quantity: e.target.value.replace(
                                            /[^0-9.]/g,
                                            ""
                                          ),
                                        }));
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="w-full md:w-auto">
                              <Button
                                rounded
                                className="px-2 w-full md:w-24 mr-1 text-white bg-mustard  text-base font-bold p-2"
                                onClick={() => {
                                  setRateFormData(initialState);
                                  setCurrentStep(1);
                                  setCurrentFaq(1);
                                  setSelecteddata(intselecteddata);
                                  setSelecteddata2(intselecteddata2);
                                  setSelecteddata3(intselecteddata3);
                                  setSelectedfranchisedata(intfranchiseedata);
                                  setPincodeAvailable(false);
                                  setSpinner(false);
                                  setError({});
                                }}
                              >
                                Reset
                              </Button>
                            </div>
                            <div className="flex justify-end w-full md:w-auto">
                              <Button
                                rounded
                                className="p-2 w-full md:w-auto  mr-1 text-white bg-mustard  text-base font-bold"
                                onClick={handleSubmit}
                                disabled={spinner}
                              >
                                Get Quotation
                                {spinner && (
                                  <LoadingIcon
                                    icon="puff"
                                    color="white"
                                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                  />
                                )}
                              </Button>
                            </div>
                          </div>
                        </Tab.Panel>
                        <Tab.Panel className="leading-relaxed">
                          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 px-1">
                            <div className="grid col-span-1">
                              <div>
                                <FormLabel
                                  htmlFor="origin"
                                  className="text-sm mb-[-2] pb-2  text-black"
                                >
                                  CUSTOMER NAME
                                  <span className="text-red-500">*</span>
                                </FormLabel>
                                <CommonSearchableAll
                                  apiEndpoint={`admin/franchisee-settings${
                                    forwhat == 1
                                      ? `?sales_id=${userdata?.mapped_id}`
                                      : ""
                                  }`}
                                  placeholder={"Search For  Customer"}
                                  selecteddata={selectedfranchisedata}
                                  setSelecteddata={setSelectedfranchisedata}
                                  fun1={fun5}
                                  comingselectedname={"franchisee_name"}
                                  comingselectedid={"franchisee_id"}
                                  funtoempty={fun5toempty}
                                  questionmark={forwhat == 1 ? true : false}
                                  key1={"key"}
                                  border={error?.franchisee ? true : false}
                                  zIndex={20}
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <FormLabel
                                htmlFor="origin"
                                className="text-sm mb-[-2] text-black"
                              >
                                ORIGIN PINCODE{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>

                              <CommonSearchableAll
                                apiEndpoint={`admin/domestic-pincode/`}
                                placeholder={"Search For  Pincode"}
                                selecteddata={selecteddata}
                                setSelecteddata={setSelecteddata}
                                fun1={fun3}
                                comingselectedname={"pincode"}
                                comingselectedid={"pincode_id"}
                                funtoempty={funtoempty2}
                                directapply={true}
                                border={error?.origin_pincode ? true : false}
                                zIndex={20}
                              />
                            </div>
                            <div className="grid gap-2">
                              <FormLabel
                                htmlFor="destination"
                                className="text-sm mb-[-2] text-black"
                              >
                                DESTINATION COUNTRY{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>

                              <CommonSearchableAll
                                apiEndpoint={`admin/country`}
                                placeholder={"Search For Country"}
                                selecteddata={selectedcountrydata}
                                setSelecteddata={setSelectedCountrydata}
                                fun1={fun6}
                                comingselectedname={"country_name"}
                                comingselectedid={"country_id"}
                                funtoempty={fun6toempty}
                                key1={"country"}
                                border={
                                  error?.destination_country ? true : false
                                }
                              />
                            </div>
                            {pincodeAvailable && (
                              <div className="grid gap-2">
                                <FormLabel
                                  htmlFor="destination"
                                  className="text-sm mb-[-2] text-black"
                                >
                                  DESTINATION ZIPCODE{" "}
                                </FormLabel>
                                <CommonSearchableAll
                                  apiEndpoint={`admin/international-pincode?country_code=${rateFormData?.destination_country_code}`}
                                  placeholder={"Search For  zipcode"}
                                  questionmark={true}
                                  selecteddata={selecteddestzipcodedata}
                                  setSelecteddata={setSelecteddestzipcodedata}
                                  fun1={fun7}
                                  key1={"zipcode"}
                                  comingselectedname={"zipcode"}
                                  comingselectedid={"city_area"}
                                  funtoempty={funtoempty7}
                                  border={
                                    error?.destination_pincode ? true : false
                                  }
                                  zIndex={20}
                                  enableZipcodeLookup={true}
                                  countryName={selectedcountrydata?.country_name}
                                />
                              </div>
                            )}
                            {rateFormData?.destination_country && (
                              <div className="grid gap-2">
                                <FormLabel
                                  htmlFor="destinationCity"
                                  className="text-sm mb-[-2] text-black"
                                >
                                  DESTINATION CITY{" "}
                                </FormLabel>
                                <CommonSearchableAll
                                  apiEndpoint={`admin/international-pincode?country_code=${
                                    rateFormData?.destination_country_code || ""
                                  }`}
                                  placeholder={"Search For  City"}
                                  questionmark={true}
                                  selecteddata={selecteddata3}
                                  setSelecteddata={setSelecteddata3}
                                  fun1={fun8}
                                  key1={"city"}
                                  comingselectedname={"city_area"}
                                  comingselectedid={"city_area"}
                                  funtoempty={funtoempty8}
                                  zIndex={20}
                                  enableZipcodeLookup={true}
                                  lookupType="city"
                                  countryName={selectedcountrydata?.country_name}
                                  lookupZipcode={
                                    rateFormData?.destination_pincode || "0000"
                                  }
                                />
                              </div>
                            )}
                            <div className="grid gap-2">
                              <FormLabel
                                htmlFor="dimensions"
                                className="text-sm mb-[-2] text-black"
                              >
                                SHIPMENT TYPE{" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormSelect
                                // className="mt-2 sm:mr-2"
                                className={`w-[100%] mb-1  sm:mr-2 p-1 ${
                                  error?.shipment_type ? "border-red-500" : ""
                                }`}
                                formSelectSize="lg"
                                value={rateFormData?.shipment_type}
                                onChange={(e) => {
                                  setError((prev) => ({
                                    ...prev,
                                    shipment_type: "",
                                  }));
                                  setRateFormData((prev) => ({
                                    ...prev,
                                    shipment_type: e.target.value,
                                  }));
                                }}
                              >
                                <option value="">Select Shipment Type</option>
                                {shipmentTypeData?.map(
                                  (type) =>
                                    type?.is_active == 1 && (
                                      <option
                                        key={type?.booking_shipment_type_id}
                                        value={type?.booking_shipment_type_id}
                                      >
                                        {type?.shipment_type}
                                      </option>
                                    )
                                )}
                              </FormSelect>
                            </div>
                            <div className="grid gap-2">
                              <FormLabel
                                htmlFor="weight"
                                className="text-sm mb-[-2] text-black"
                              >
                                WEIGHT (IN KGS){" "}
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormInput
                                id="weight"
                                placeholder="Enter weight"
                                value={rateFormData?.weight}
                                formInputSize="lg"
                                className={`w-[100%] ${
                                  error?.weight ? "border-red-500" : ""
                                }`}
                                onChange={(e) => {
                                  setError((prev) => ({
                                    ...prev,
                                    weight: "",
                                  }));
                                  setRateFormData((prev) => ({
                                    ...prev,
                                    weight: e.target.value.replace(
                                      /[^0-9.]/g,
                                      ""
                                    ),
                                  }));
                                }}
                              />
                            </div>
                            {rateFormData?.shipment_type &&
                              rateFormData?.shipment_type != 2 && (
                                <>
                                  <div className="grid gap-2">
                                    <FormLabel
                                      htmlFor="length"
                                      className="text-sm mb-[-2] text-black"
                                    >
                                      MAX LENGTH (IN CMS){" "}
                                    </FormLabel>
                                    <FormInput
                                      id="weight"
                                      placeholder="Enter Max Length"
                                      formInputSize="lg"
                                      value={rateFormData?.length}
                                      className="w-[100%]"
                                      onChange={(e) => {
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          length: e.target.value.replace(
                                            /[^0-9.]/g,
                                            ""
                                          ),
                                        }));
                                      }}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <FormLabel
                                      htmlFor="quantity"
                                      className="text-sm mb-[-2] text-black"
                                    >
                                      QUANTITY (IN PCS)
                                    </FormLabel>
                                    <FormInput
                                      id="quantity"
                                      placeholder="Enter Quantity"
                                      formInputSize="lg"
                                      value={rateFormData?.quantity}
                                      className="w-[100%]"
                                      onChange={(e) => {
                                        setRateFormData((prev) => ({
                                          ...prev,
                                          quantity: e.target.value.replace(
                                            /[^0-9.]/g,
                                            ""
                                          ),
                                        }));
                                      }}
                                    />
                                  </div>
                                </>
                              )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="w-full md:w-auto">
                              <Button
                                rounded
                                className="px-2 w-full md:w-24  mr-1 text-white bg-mustard  text-base font-bold p-2"
                                onClick={() => {
                                  setRateFormData(initialState);
                                  setSelecteddestzipcodedata(intdestzipcode);
                                  setSelectedCountrydata(intcountrydata);
                                  setSelecteddata(intselecteddata);
                                  setSelecteddata3(intselecteddata3);
                                  setCurrentStep(1);
                                  setCurrentFaq(1);

                                  setPincodeAvailable(false);
                                  setSpinner(false);
                                  setError({});
                                }}
                              >
                                Reset
                              </Button>
                            </div>
                            <div className="flex justify-end w-full md:w-auto">
                              <Button
                                rounded
                                className="p-2  w-full md:w-auto mr-1 text-white bg-mustard  text-base font-bold"
                                onClick={handleSubmit}
                                disabled={spinner}
                              >
                                Get Quotation
                                {spinner && (
                                  <LoadingIcon
                                    icon="puff"
                                    color="white"
                                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                  />
                                )}
                              </Button>
                            </div>
                          </div>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </Disclosure.Panel>
                )}
              </div>
            )}
          </Disclosure>
          {currentFaq >= 2 ? (
            isVendorLoading ? (
              <div className="flex justify-center items-center">
                <img src={LoadingGif} alt="loading-gif" className="w-60 h-40" />
              </div>
            ) : isVendorError ? (
              <div className="flex justify-center">
                <img src={ErrorGif} alt="error-gif" className="w-48 h-24" />
              </div>
            ) : ratesData.length > 0 ? (
              <Disclosure as="div" className=" mt-8 w-full pb-4">
                {({ open }) => (
                  <div className="bg-white rounded-lg">
                    <Disclosure.Button
                      onClick={() => setCurrentStep(2)}
                      className="flex items-center w-full justify-between rounded-lg bg-white px-5 py-3 text-left text-sm font-medium "
                    >
                      <div>
                        <h1 className="text-xl font-bold">Rates</h1>
                        <h3 className="text-sm font-bold text-red-500">
                          * Excluding GST
                        </h3>
                      </div>

                      <Lucide
                        icon="ChevronUp"
                        onClick={() => setCurrentStep(2)}
                        className={`${
                          currentStep == 2
                            ? ""
                            : "rotate-180 transform stroke-2.5"
                        } h-8 w-8 text-mustard`}
                      />
                    </Disclosure.Button>
                    {currentStep == 2 && (
                      <Disclosure.Panel
                        static={true}
                        className="px-2 pb-2 py-4 text-sm text-gray-500 border-t mb-4"
                      >
                        <div className="overflow-x-auto mb-4">
                          <Table className="table mb-0 border">
                            <Table.Thead
                              variant="dark"
                              className="thead-primary table-sorting bg-mustard"
                            >
                              <Table.Tr className="text-center ">
                                <Table.Th className="whitespace-nowrap border">
                                  SR.No.
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  VENDOR
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  PRODUCT TYPE
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  COST (₹)
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  CHARGEABLE WEIGHT
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap border">
                                  TAT
                                </Table.Th>
                              </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                              {ratesData?.map((elem, index) => (
                                <>
                                  <Table.Tr
                                    key={index}
                                    className={`text-left cursor-pointer  ${
                                      index % 2 === 1 ? "bg-yellow-50" : ""
                                    } hover:bg-yellow-100`}
                                    onClick={() => setClicked(index)}
                                  >
                                    <Table.Td className="border text-right">
                                      {index + 1}.
                                    </Table.Td>
                                    <Table.Td className="border">
                                      {elem?.product_name}
                                    </Table.Td>
                                    <Table.Td className="border">
                                      {elem?.product_code}
                                    </Table.Td>
                                    <Table.Td className="border text-right">
                                      {indianFormat(
                                        Number(elem?.grand_total_without_gst)
                                      ) || "-"}
                                    </Table.Td>
                                    <Table.Td className="border text-right">
                                      {elem?.actual_weight} Kg
                                    </Table.Td>
                                    <Table.Td className="border text-right">
                                      {elem?.tat_days}
                                    </Table.Td>
                                  </Table.Tr>

                                  {clicked === index && (
                                    <>
                                      <Table.Tr className="text-xs">
                                        <Table.Th className="whitespace-nowrap border">
                                          SR.No.
                                        </Table.Th>
                                        <Table.Th
                                          colSpan={3}
                                          className="whitespace-nowrap border"
                                        >
                                          PARTICULARS
                                        </Table.Th>
                                        <Table.Th
                                          colSpan={2}
                                          className="whitespace-nowrap border text-right"
                                        >
                                          CHARGES
                                        </Table.Th>
                                      </Table.Tr>
                                      {elem?.selling_charges
                                        ?.filter(
                                          (item) => item?.charge_amount != 0
                                        )
                                        .map((item, index) => (
                                          <Table.Tr
                                            className="border p-1 text-xs text-left"
                                            key={index}
                                          >
                                            <Table.Td className="border text-right">
                                              {index + 1}.
                                            </Table.Td>
                                            <Table.Td
                                              colSpan={3}
                                              className="border"
                                            >
                                              {item?.charge_name}
                                            </Table.Td>
                                            <Table.Td
                                              colSpan={2}
                                              className="border text-right"
                                            >
                                              {indianFormat(
                                                Number(item?.charge_amount)
                                              ) || "-"}
                                            </Table.Td>
                                          </Table.Tr>
                                        ))}
                                      <Table.Tr className="border p-1 text-xs">
                                        <Table.Td className="border font-medium"></Table.Td>
                                        <Table.Td
                                          colSpan={3}
                                          className="border font-medium"
                                        >
                                          TOTAL
                                        </Table.Td>
                                        <Table.Td
                                          colSpan={2}
                                          className="border  font-medium text-right"
                                        >
                                          {indianFormat(
                                            Number(
                                              elem?.grand_total_without_gst
                                            )
                                          ) || "-"}
                                        </Table.Td>
                                      </Table.Tr>
                                    </>
                                  )}
                                </>
                              ))}
                            </Table.Tbody>
                          </Table>
                        </div>
                      </Disclosure.Panel>
                    )}
                  </div>
                )}
              </Disclosure>
            ) : (
              <div className="box mt-8 max-w-screen-md text-red-500 font-medium text-lg h-36 flex items-center justify-center">
                Vendor Not Available for this region !!
              </div>
            )
          ) : null}
        </div>
      )}
    </>
  );
};

export default RateCalculator;
