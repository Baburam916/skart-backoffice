import React, { useEffect, useState } from "react";
import Tracker from "./tracker";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { useAlert } from "../../../ContextProvider/AlertContext";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
// import CommonModal from "../Commoncomponents/CommonModal/CommonModal";
import Lucide from "../../../base-components/Lucide";
import LoadingIcon from "../../../base-components/LoadingIcon";
import IsLoading from "../commoncomponents/isLoading/isLoading";
import Table from "../../../base-components/Table";
// import { formatDate } from "../Commoncomponents/commondateformat/datetoreqformat";

// import Commondownload from "../Commoncomponents/ComonDownload/Commondownload";
import Tippy from "../../../base-components/Tippy";
import { Undo2 } from "lucide-react";

import trackingIcon from "../../../../../public/images/tracking.png";

import ageingbg from "../../../../public/images/ageingbg.gif";
import trackingIocn from "../../../../public/images/tracking.png";
import completed_icon from "../../../../public/images/completed_icon.png";
import tracking_scooter from "../../../../public/images/tracking_scooter.png";
import tracking_tyre from "../../../../public/images/tracking_tyre.png";
import Tracking_ekartline2 from "../../../../public/images/Tracking_ekartline2.gif";
import tracking_awb from "../../../../public/images/tracking_awb.jpg";

import tracking_status from "../../../../public/images/tracking_status.png";
import tweight1Icon from "../../../../public/images/tweight1.png";
import inchesTabIcon from "../../../../public/images/inchesTab.png";
import calendartrucking_new from "../../../../public/images/calendartrucking_new.png";
import aramex_weight_unit from "../../../../public/images/aramex_weight_unit.png";
import aramex_package_weight from "../../../../public/images/aramex_package_weight.png";





import { ClipboardList, Search } from "lucide-react";
import {
  Download,
  Layers,
  Scan,
  Box,
  Trash2,
  User,
  CalendarDays,
  Eye,
  ArrowLeft,
  Calendar,
  FileText,
  Boxes,
  Truck,
  Briefcase,
  Scroll,
  StickyNote,
  Phone,
  Mail,
  MapPin,
  Map,
  Building,
  Globe,
  Plane,
  X,
  Smartphone,
  ArrowRight,
  MessageSquare,
  Info,
} from "lucide-react";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import { formatDate } from "../../../utils";
import Commondownload from "../commoncomponents/ComonDownload/Commondownload";

const initialemaildata = { email_cc: [] };
const intarxdata = {
  weight: "",
  weight_unit: "",
};
const intpostremarkdata = {
  id: "",
  remarks: "",
};
function Main() {
   const [forWhat, setForwhat] = useState<number>(0);
  const [remarks, setRemarks] = useState<string>("");
  const [salesperson, setSalesperson] = useState<any>("");
  const [postremarkdata, setPostRemarkdata] = useState<any>(intpostremarkdata);
  const [searchvalue, setSearchvalue] = useState<string>("");
  const [intdropdowndata, setIntdropdowndata] = useState<any>([]);
  const [allsalespersondata, setAllsalespersondata] = useState<any>([]);
  const [alldata, setAlldata] = useState<any>({});
  const [externalevents, setExternalevents] = useState<any>([]);
  const [remarksdata, setRemarksdata] = useState<any>([]);
  const [answer, setAnswer] = useState<string>("");
  const [arxdata, setArxdata] = useState<any>(intarxdata);
  const [allCountrydata, setAllCountrydata] = useState<any>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [trackerdata, setTrackerdata] = useState<Array<any>>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [imagesdata, setImagesdata] = useState<any>([]);
  const [intdata, setIntdata] = useState<any>({
    delivered: "",
    is_open: "",
    pickup_id: "",
  });
  const [bccList, setBccList] = useState<string[]>([]);
  const [shipmentType, setShipmentType] = useState<any>([]);
  const [courier_name, setCourer_name] = useState<any>("");
  const [franchisee_name, setFranchisee_name] = useState<string>("");
  const [baemail_id, setBaemail_id] = useState<any>("");
  const [bacontactsdata, setBaContactsdata] = useState<any>([]);
  const [cancelledData, setCancelledData] = useState<Array<any>>([]);
  const { showAlert } = useAlert();
  const [currencydata, setAllCurrencydata] = useState<any>([]);
  const [remarksloading, setRemarksloading] = useState<boolean>(false);
  const [livelocationloading, setLiveLocationloading] =
    useState<boolean>(false);

  useEffect(() => {
    getdata();
  }, []);

  const findcurrency = (id: any, currencydata: any) => {
    const singledata = currencydata?.find((item: any) => item?.id == id);
    return singledata;
  };
  const getdata = async () => {
    try {
      const res = await commongetrequest("track_shipment/remark-dropdown");
      const res4 = await commongetrequest("booking/currency");
      const response3 = await commongetrequest("admin/sales-person");
      const response5 = await commongetrequest("admin/country");
      const response6 = await commongetrequest("admin/booking-shipment-type");

      if (res?.status == 200) {
        setIntdropdowndata(res?.data?.data || []);
      }

      if (res4?.status == 200) {
        setAllCurrencydata(res4?.data?.data);
      } else if (res?.status == 204) {
        setIntdropdowndata([]);
      }

      if (response3?.status == 200) {
        setAllsalespersondata(response3?.data?.data || []);
      }

      if (response5?.status == 200) {
        setAllCountrydata(response5?.data?.data || []);
      } else {
        console.log("error to fetch data");
      }

      if (response6?.status == 200) {
        setShipmentType(response6?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  const fetchData = async () => {
    if (searchvalue) {
      try {
        setSearchLoading(true);

        const [response, response2, res3] = await Promise.all([
          commongetrequest(
            `track_shipment/track-shipment/${searchvalue.trim()}`,
          ),
          commonpostrequest(`admin/check`, {
            airwaybillno: searchvalue.trim(),
          }),
          commongetrequest(
            `hub/weight_dimension/scanned-images/${searchvalue}`,
          ),
        ]);

        if (res3?.status == 200) {
          const data = res3?.data?.data || [];
          setImagesdata(data);
        } else {
          setImagesdata([]);
        }

        if (
          response?.status == 200 &&
          response?.data?.pickup_data?.courier_id
        ) {
          setAlldata(response?.data);
          const newData =
            response?.data?.airwaybills &&
            response?.data?.airwaybills
              ?.split(",")
              ?.filter(
                (ele) =>
                  !ele?.includes(response?.data?.pickup_data?.airwaybilno),
              );
          setCancelledData(newData || []);

          if (Array.isArray(response?.data?.data)) {
            const sorteddata = response?.data?.data?.sort(
              (a, b) => new Date(a?.date) - new Date(b?.date),
            );

            let intev = [];
            let extev = [];
            if (sorteddata?.length >= 1) {
              for (let i = 0; i < sorteddata?.length; i++) {
                if (
                  sorteddata[i] &&
                  sorteddata[i].hasOwnProperty("event_type")
                ) {
                  if (sorteddata[i]["event_type"] == 2) {
                    extev.push(sorteddata[i]);
                  } else {
                    intev.push(sorteddata[i]);
                  }
                } else {
                  intev.push(sorteddata[i]);
                }
              }
            }

            setTrackerdata(intev.reverse() || []);
            setExternalevents(extev.reverse() || []);
            if (extev?.length >= 1) {
              const data = extev?.find((item: any) => item?.event_type == 2);
              setArxdata((pre: any) => ({
                ...pre,
                weight: data?.package_weight,
                weight_unit: data?.weight_unit,
              }));
            }

            setAnswer("");
          } else {
            setTrackerdata([]);
            setExternalevents([]);
            setArxdata(intarxdata);
          }

          const [courierdata, franchiseedata] = await Promise.all([
            commongetrequest(
              `admin/courier-product/0/${response?.data?.pickup_data?.courier_id}`,
            ),
            commongetrequest(
              `admin/franchisee-settings/${response?.data?.pickup_data?.pickup_franchisee_id}`,
            ),
          ]);

          getremarksdata(response?.data?.pickup_data?.pickup_id || 0);

          if (courierdata?.status == 200) {
            setCourer_name(courierdata?.data?.data[0]?.product_name || "");
          }

          if (franchiseedata?.status == 200) {
            const data = franchiseedata?.data?.data || [];
            if (data?.length >= 1) {
              setFranchisee_name(data[0]?.franchisee_name || "");
              setBaContactsdata(data[0]?.contacts || []);
              setBaemail_id(data[0]?.email_id || "");
              if (data[0]?.field_sales) {
                const singlesalespersondata = allsalespersondata?.find(
                  (item: any) => item?.id == data[0]?.field_sales,
                );
                setSalesperson(singlesalespersondata?.sales_person || "");
              }
            } else {
              setFranchisee_name("");
              setBaContactsdata([]);
              setBaemail_id("");
            }
          }
        }

        if (
          response?.status == 204 ||
          !response?.data?.pickup_data?.courier_id
        ) {
          setAlldata({});
          showAlert("Data Not found", "warning");
        }

        if (response2?.status == 200 || response2?.status == 204) {
          const statusdata = response2?.data || [];

          setIntdata((pre: any) => ({
            ...pre,
            delivered: statusdata?.delivered,
            is_open: statusdata?.is_open,
            pickup_id: statusdata?.pickup_id,
            remark: statusdata?.remark || "",
          }));
        } else {
          setIntdata({
            delivered: "",
            is_open: "",
            pickup_id: "",
            remarks: "",
          });
        }
      } catch (err: any) {
        showAlert(err.message, "error");
      } finally {
        setSearchLoading(false);
      }
    } else {
      showAlert("Please provide Awb No.", "warning");
    }
  };

  const getparticulardatacommon = (
    forwhat: string,
    data: any,
    id: any,
    id2?: any,
  ) => {
    if (forwhat == "country") {
      const singledata = data?.find((item: any) => item?.country_id == id);
      return singledata;
    }
    // else if (forwhat == "org1") {
    //   const name = data
    //     ?.find((elem: any) => elem?.organisation_id == id)
    //     ?.value?.find((item: any) => item?.id == id2)?.value;
    //   return name;
    // } else if (forwhat == "org2") {
    //   const name = data
    //     ?.find((elem: any) => elem?.organisation_id == id)
    //     ?.value?.find((item: any) => item?.id == id2)?.value;
    //   return name;
    // }
  };
  const getremarksdata = async (id: any) => {
    try {
      const remdata = await commongetrequest(
        `track_shipment/remark?pickup_id=${id || 0}`,
      );
      if (remdata?.status == 200 || remdata?.status == 204) {
        const data = remdata?.data?.data || [];

        const newdata = data?.map((item: any) => {
          item["reason"] = findparticulardata(item?.dropdown_id) || "";
          item["created_date"] = formatDate(item?.created_date) || "";
          delete item["dropdown_id"];

          return item;
        });

        setRemarksdata(newdata || []);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // console.log(remarksdata,"allremarksdata")
  const handleremarks = async (id?: any) => {
    if (id) {
      try {
        setRemarksloading(true);
        const res = await commonpostrequest("track_shipment/remark", {
          pickup_id: id,
          remark: postremarkdata?.remarks,
          dropdown_id: postremarkdata?.id,
        });
        if (res?.status == 200) {
          showAlert(res?.data?.message);
          setRemarks("");
          setPostRemarkdata(intpostremarkdata);
          getremarksdata(id);
        } else if (res?.response?.status == 400) {
          showAlert(res?.response?.data?.message, "error");
        } else {
          showAlert("Something going wrong!..", "error");
        }
      } catch (err: any) {
        showAlert(err?.message, "error");
      } finally {
        setRemarksloading(false);
      }
    } else {
      showAlert("Please Provide Pickup Id", "warning");
    }
  };

  const findparticulardata = (id: any) => {
    const newdata = intdropdowndata?.find((item: any) => item.id == id);

    return newdata?.remark || "";
  };

  const ModalFooter = (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setOpenModal(false);
          setForwhat(0);
        }}
        className="ml-2 w-20 p-2"
      >
        Close
      </Button>
    </>
  );
  // Modal title
  // console.log(openModal,"openmodal")
  const ModalTitle = (
    <div className=" flex justify-between w-full">
      <div>
        {" "}
        <h2 className="mr-auto text-base font-medium">
          {forWhat == 1 ? (
            "Consignee Details"
          ) : forWhat == 2 ? (
            "Consignor Details"
          ) : forWhat == 3 ? (
            "Shipment Details"
          ) : forWhat == 4 ? (
            "Remarks"
          ) : forWhat == 11 ? (
            <div>
              <h2 className="mr-auto text-base font-medium">
                Weighing Machine images
              </h2>
            </div>
          ) : (
            ""
          )}
        </h2>
      </div>
      {forWhat == 4 ? (
        <div>
          <Commondownload
            data={remarksdata}
            forwhat={"Remarks_data"}
            icon={true}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );

  function isObjectEmpty(obj: any) {
    // console.log(Object.keys(obj).length,"checktrueofrals")
    return Object.keys(obj).length === 0;
  }
  // Modal description
  const ModalDescription = (
    <>
      <div className="col-span-12 sm:col-span-6 ">
        {forWhat == 1 ? (
          <>
            <div className="border border-[#ffdf5a] relative overflow-hidden rounded-[9px] pl-3 pr-4 py-2 bg-gradient-to-r from-[#FFF5E1] via-[#FDFDFD] to-[#FFF3D8]    hover:bg-gradient-to-r hover:from-[#fffaef] hover:via-[#fffaef] hover:to-[#fffaef]">
              <div className="flex items-center p-1 ">
                <figure className="flex items-center justify-center  relative mr-1  block bg-[linear-gradient(to_bottom,#ffd675_0%,#f9cf51_50%,#f2be42_100%)] rounded-full border border-[#cda329] w-[50px] h-[50px] ">
                  <User className="w-[30px] h-[30px] text-[#8a6a0c]" />
                </figure>
                <aside className="ml-2">
                  <h2 className="text-[#DAB15A] text-[16px] font-medium   leading-[20px] ">
                    Name :{" "}
                    <span className="">
                      {!isObjectEmpty(alldata) &&
                      alldata?.consignee_data[0]?.first_name
                        ? alldata?.consignee_data[0]?.first_name
                        : "N.A."}
                    </span>
                  </h2>
                  <h3 className="text-[#808080] text-[14px]   leading-[20px] ">
                    <span>
                      {!isObjectEmpty(alldata) &&
                      alldata?.consignee_data[0]?.company_name
                        ? alldata?.consignee_data[0]?.company_name
                        : "N.A."}
                    </span>
                  </h3>
                </aside>
              </div>

              <i className="absolute  left-[90px] rotate-[-9deg] opacity-60 bottom-[-31px] md:bottom-[-36px] lg:bottom-[-36px] xl:bottom-[-36px] 2xl:bottom-[-38px] right-[-43px] xl:right-[-42px]">
                <img
                  alt="Avatar"
                  className=" w-full h-[60px]  filter  hue-rotate-[225deg] brightness-[2] saturate-[6] contrast-[12]"
                  src={ageingbg}
                />
              </i>
            </div>

            <div className="w-full mt-4 mb-3">
              <div className=" grid grid-cols-12 gap-x-2 ">
                <div className=" col-span-12  md:col-span-12 mb-2 ">
                  <div className="flex items-center mb-1">
                    <i className="mr-1 ">
                      <ClipboardList className="w-[18px]  text-[#DD9F0F] " />
                    </i>
                    <p className="text-[14px] font-medium uppercase text-[#383838] ">
                      Contact Details
                    </p>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-4 mb-1 ">
                  <div className=" flex justify-center w-full  mb-3">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2] ">
                      <Phone className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Contact No.
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.consignee_data[0]?.mobile_no
                          ? alldata?.consignee_data[0]?.mobile_no
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-8 mb-1 ">
                  <div className=" flex justify-center w-full  mb-3">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Mail className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Email
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.consignee_data[0]?.email_id
                          ? alldata?.consignee_data[0]?.email_id
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mt-4 mb-3">
              <div className=" grid grid-cols-12 gap-x-2 ">
                <div className=" col-span-12  md:col-span-12 mb-2 ">
                  <div className="flex items-center mb-1">
                    <i className="mr-1 ">
                      <User className="w-[18px]  text-[#DD9F0F] " />
                    </i>
                    <p className="text-[14px] font-medium uppercase text-[#383838] ">
                      Consignee Address
                    </p>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-2 ">
                  <div className=" flex justify-center w-full  mb-1">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Map className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Address 1
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.consignee_data[0]?.address1
                          ? alldata?.consignee_data[0]?.address1
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-2 ">
                  <div className=" flex justify-center w-full  mb-1">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <MapPin className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Address 2
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.consignee_data[0]?.address2
                          ? alldata?.consignee_data[0]?.address2
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-2 ">
                  <div className=" flex justify-center w-full  mb-1">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Building className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        City
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.consignee_data[0]?.city
                          ? alldata?.consignee_data[0]?.city
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-1 ">
                  <div className=" flex justify-center w-full  mb-2">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Globe className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        State
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.consignee_data[0]?.state
                          ? alldata?.consignee_data[0]?.state
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-1 ">
                  <div className=" flex justify-center w-full  mb-2">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Globe className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Country
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.pickup_data &&
                        alldata?.pickup_data?.delivery_country_id
                          ? getparticulardatacommon(
                              "country",
                              allCountrydata,
                              alldata?.pickup_data?.delivery_country_id,
                            )?.country_name
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                {alldata?.consignee_data[0]?.domestic_pincode && (
                  <>
                    <div className=" col-span-12  md:col-span-6 mb-1 ">
                      <div className=" flex justify-center w-full  mb-2">
                        <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                          <Plane className="w-[21px]  text-[#949DA6] " />
                        </figure>

                        <div className=" w-full  pl-2">
                          <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                            Domestic Pincode
                          </h2>

                          <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                            {!isObjectEmpty(alldata) &&
                            alldata?.consignee_data[0]?.domestic_pincode
                              ? alldata?.consignee_data[0]?.domestic_pincode
                              : "N.A."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {alldata?.consignee_data[0]?.international_zipcode && (
                  <>
                    <div className=" col-span-12  md:col-span-6 mb-1 ">
                      <div className=" flex justify-center w-full  mb-2">
                        <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                          <Plane className="w-[21px]  text-[#949DA6] " />
                        </figure>

                        <div className=" w-full  pl-2">
                          <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                            International Zipcode
                          </h2>

                          <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                            {!isObjectEmpty(alldata) &&
                            alldata?.consignee_data[0]?.international_zipcode
                              ? alldata?.consignee_data[0]
                                  ?.international_zipcode
                              : "N.A."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        ) : forWhat == 2 ? (
          <>
            <div className="border border-[#ffdf5a] relative overflow-hidden  rounded-[9px] pl-3 pr-4 py-2 bg-gradient-to-r from-[#FFF5E1] via-[#FDFDFD] to-[#FFF3D8]    hover:bg-gradient-to-r hover:from-[#fffaef] hover:via-[#fffaef] hover:to-[#fffaef]">
              <div className="flex items-center p-1 ">
                <figure className="flex items-center justify-center  relative mr-1  block bg-[linear-gradient(to_bottom,#ffd675_0%,#f9cf51_50%,#f2be42_100%)] rounded-full border border-[#cda329] w-[50px] h-[50px] ">
                  <User className="w-[30px] h-[30px] text-[#8a6a0c]" />
                </figure>
                <aside className="ml-2">
                  <h2 className="text-[#DAB15A] text-[16px] font-medium   leading-[20px] ">
                    {" "}
                    Name :{" "}
                    <span className="">
                      {!isObjectEmpty(alldata) &&
                      alldata?.shipper_data &&
                      alldata?.shipper_data[0]?.shipper_name
                        ? alldata?.shipper_data[0]?.shipper_name
                        : "N.A."}
                    </span>
                  </h2>
                  <h3 className="text-[#808080] text-[14px]   leading-[20px] ">
                    {!isObjectEmpty(alldata) &&
                    alldata?.shipper_data &&
                    alldata?.shipper_data[0]?.company_name
                      ? alldata?.shipper_data[0]?.company_name
                      : "N.A."}
                  </h3>
                </aside>
              </div>

              <i className="absolute  left-[90px] rotate-[-9deg] opacity-60 bottom-[-31px] md:bottom-[-36px] lg:bottom-[-36px] xl:bottom-[-36px] 2xl:bottom-[-38px] right-[-43px] xl:right-[-42px]">
                <img
                  alt="Avatar"
                  className=" w-full h-[60px]  filter  hue-rotate-[225deg] brightness-[2] saturate-[6] contrast-[12]"
                  src={ageingbg}
                />
              </i>
            </div>

            <div className="w-full mt-4 mb-3">
              <div className=" grid grid-cols-12 gap-x-2 ">
                <div className=" col-span-12  md:col-span-12 mb-2 ">
                  <div className="flex items-center mb-1">
                    <i className="mr-1 ">
                      <ClipboardList className="w-[18px]  text-[#DD9F0F] " />
                    </i>
                    <p className="text-[14px] font-medium uppercase text-[#383838] ">
                      Contact Details
                    </p>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-4 mb-1 ">
                  <div className=" flex justify-center w-full  mb-3">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2] ">
                      <Phone className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Contact No.
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.shipper_data &&
                        alldata?.shipper_data[0]?.mobile_no
                          ? alldata?.shipper_data[0]?.mobile_no
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-8 mb-1 ">
                  <div className=" flex justify-center w-full  mb-3">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Mail className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Email id
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.shipper_data &&
                        alldata?.shipper_data[0]?.email_id
                          ? alldata?.shipper_data[0]?.email_id
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mt-4 mb-3">
              <div className=" grid grid-cols-12 gap-x-2 ">
                <div className=" col-span-12  md:col-span-12 mb-2 ">
                  <div className="flex items-center mb-1">
                    <i className="mr-1 ">
                      <User className="w-[18px]  text-[#DD9F0F] " />
                    </i>
                    <p className="text-[14px] font-medium uppercase text-[#383838] ">
                      Consignor Address
                    </p>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-2 ">
                  <div className=" flex justify-center w-full  mb-1">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Map className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Address
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.shipper_data &&
                        alldata?.shipper_data[0]?.street_address
                          ? alldata?.shipper_data[0]?.street_address
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-2 ">
                  <div className=" flex justify-center w-full  mb-1">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Building className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        City
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.shipper_data &&
                        alldata?.shipper_data[0]?.city_name
                          ? alldata?.shipper_data[0]?.city_name
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-1 ">
                  <div className=" flex justify-center w-full  mb-2">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Globe className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        State
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.shipper_data &&
                        alldata?.shipper_data[0]?.state
                          ? alldata?.shipper_data[0]?.state
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-1 ">
                  <div className=" flex justify-center w-full  mb-2">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Plane className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Pincode
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.shipper_data &&
                        alldata?.shipper_data[0]?.pincode
                          ? alldata?.shipper_data[0]?.pincode
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-1 ">
                  <div className=" flex justify-center w-full  mb-2">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <FileText className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        GST Registered Address
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.shipper_data &&
                        alldata?.shipper_data[0]?.gst_registered_address
                          ? alldata?.shipper_data[0]?.gst_registered_address
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-1 ">
                  <div className=" flex justify-center w-full  mb-2">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Scroll className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        GSTIN
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {!isObjectEmpty(alldata) &&
                        alldata?.shipper_data &&
                        alldata?.shipper_data[0]?.gstin
                          ? alldata?.shipper_data[0]?.gstin
                          : "N.A."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : forWhat == 3 ? (
          <div>
            {!isObjectEmpty(alldata) &&
            alldata?.pickup_data &&
            alldata?.pickup_data &&
            (alldata?.pickup_data?.booking_shipment_type_id == 1 ||
              alldata?.pickup_data?.booking_shipment_type_id == 4 ||
              alldata?.pickup_data?.booking_shipment_type_id == 5) ? (
              <div className="overflow-auto w-full">
                <Table hover sm>
                  {/* Table headers */}
                  <Table.Thead className="bg-mustard text-white border">
                    <Table.Tr>
                      <Table.Th className="text-center border">Sr.No.</Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap ">
                        DESCRIPTION
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        WEIGHT (Unit)
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        LENGTH
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        BREADTH
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        HEIGHT
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        HSN CODE
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        QTY.
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        VALUE(
                        {findcurrency(
                          alldata?.pickup_data?.currency_id,
                          currencydata,
                        )?.currency || ""}
                        )
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  {/* Table body */}
                  <Table.Tbody>
                    {!isObjectEmpty(alldata) &&
                      alldata?.pickup_item &&
                      alldata?.pickup_item?.map((item: any, index: number) => (
                        <Table.Tr key={index}>
                          <Table.Td className="text-center border">
                            {index + 1}.
                          </Table.Td>
                          <Table.Td className="text-center capitalize border whitespace-nowrap">
                            {item?.product_description}
                          </Table.Td>
                          <Table.Td className="text-center border whitespace-nowrap">
                            {Number(item?.weight)?.toFixed(3)} ({" "}
                            {alldata?.pickup_data?.weight_unit})
                          </Table.Td>
                          <Table.Td className="text-center border whitespace-nowrap">
                            {item?.length}
                          </Table.Td>
                          <Table.Td className="text-center border whitespace-nowrap">
                            {item?.breadth}
                          </Table.Td>
                          <Table.Td className="text-center border whitespace-nowrap">
                            {item?.height}
                          </Table.Td>
                          <Table.Td className="text-center border whitespace-nowrap">
                            {item?.hsn_code}
                          </Table.Td>
                          <Table.Td className="text-center border whitespace-nowrap">
                            {item?.quantity}
                          </Table.Td>
                          <Table.Td className="text-center border whitespace-nowrap">
                            {item?.value}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : forWhat == 4 ? (
          <div>
            {!isObjectEmpty(alldata) &&
            alldata?.pickup_data &&
            alldata?.pickup_data?.pickup_id &&
            remarksdata?.length >= 1 ? (
              <div
                className={`overflow-auto w-full ${
                  remarksdata?.length >= 5 ? "h-[300px]" : "h-[auto]"
                }`}
              >
                <Table hover sm>
                  {/* Table headers */}
                  <Table.Thead className="bg-mustard text-white border">
                    <Table.Tr>
                      <Table.Th className="text-center border">Sr.No.</Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap ">
                        Reason
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap ">
                        Remarks
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        Date
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  {/* Table body */}
                  <Table.Tbody>
                    {!isObjectEmpty(alldata) &&
                      remarksdata?.map((item: any, index: number) => (
                        <Table.Tr key={index}>
                          <Table.Td className="text-center border">
                            {index + 1}.
                          </Table.Td>
                          <Table.Td className="text-center capitalize border whitespace-nowrap">
                            {item?.reason || ""}
                          </Table.Td>
                          <Table.Td className="text-center capitalize border whitespace-nowrap">
                            {item?.remark}
                          </Table.Td>
                          <Table.Td className="text-center border whitespace-nowrap">
                            {formatDate(item?.created_date)}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                  </Table.Tbody>
                </Table>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : forWhat == 5 ? (
          <>
            <div className="border border-[#ffdf5a] relative overflow-hidden  rounded-[9px] pl-3 pr-4 py-2 bg-gradient-to-r from-[#FFF5E1] via-[#FDFDFD] to-[#FFF3D8]    hover:bg-gradient-to-r hover:from-[#fffaef] hover:via-[#fffaef] hover:to-[#fffaef]">
              <div className="flex items-center p-1 ">
                <figure className="flex items-center justify-center  relative mr-1  block bg-[linear-gradient(to_bottom,#ffd675_0%,#f9cf51_50%,#f2be42_100%)] rounded-full border border-[#cda329] w-[50px] h-[50px] ">
                  <User className="w-[30px] h-[30px] text-[#8a6a0c]" />
                </figure>
                <aside className="ml-2">
                  <h2 className="text-[#DAB15A] text-[16px] font-medium   leading-[20px] ">
                    Sales Person
                  </h2>
                  <span className="">{salesperson || "N.A."}</span>
                </aside>
              </div>

              <i className="absolute  left-[90px] rotate-[-9deg] opacity-60 bottom-[-31px] md:bottom-[-36px] lg:bottom-[-36px] xl:bottom-[-36px] 2xl:bottom-[-38px] right-[-43px] xl:right-[-42px]">
                <img
                  alt="Avatar"
                  className=" w-full h-[60px]  filter  hue-rotate-[225deg] brightness-[2] saturate-[6] contrast-[12]"
                  src={ageingbg}
                />
              </i>
            </div>

            <div className="w-full mt-4 mb-3">
              <div className=" grid grid-cols-12 gap-x-2 ">
                <div className=" col-span-12  md:col-span-12 mb-2 ">
                  <div className="flex items-center mb-1">
                    <i className="mr-1 ">
                      <ClipboardList className="w-[18px]  text-[#DD9F0F] " />
                    </i>
                    <p className="text-[14px] font-medium uppercase text-[#383838] ">
                      Contact Details
                    </p>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-1 ">
                  <div className=" flex justify-center w-full  mb-3">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2] ">
                      <User className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Business Associate / Direct Party
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {franchisee_name || "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-1 ">
                  <div className=" flex justify-center w-full  mb-3">
                    <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                      <Mail className="w-[21px]  text-[#949DA6] " />
                    </figure>

                    <div className=" w-full  pl-2">
                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                        Email id
                      </h2>

                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                        {baemail_id || "N.A."}
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-12 mb-1 ">
                  <div className="grid grid-cols-12 gap-y-3 gap-x-2">
                    {bacontactsdata?.length >= 1
                      ? bacontactsdata?.map((item: any, index: number) => (
                          <>
                            <div className=" col-span-12  md:col-span-6  ">
                              <div className=" col-span-12  md:col-span-4 mb-1 ">
                                <div className=" flex justify-center w-full  mb-3">
                                  <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2] ">
                                    <Phone className="w-[21px]  text-[#949DA6] " />
                                  </figure>

                                  <div className=" w-full  pl-2">
                                    <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                      Contact No.{" "}
                                      {bacontactsdata?.length >= 2
                                        ? `(${index + 1})`
                                        : ""}
                                    </h2>

                                    <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                                      {item?.contact_no || ""}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className=" col-span-12  md:col-span-6  ">
                              <div className=" col-span-12  md:col-span-4 mb-1 ">
                                <div className=" flex justify-center w-full  mb-3">
                                  <figure className=" w-[50px] h-[42px]  rounded-lg flex items-center justify-center bg-[#f2f2f2] ">
                                    <Phone className="w-[21px]  text-[#949DA6] " />
                                  </figure>

                                  <div className=" w-full  pl-2">
                                    <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                      Mobile No.
                                      {bacontactsdata?.length >= 2
                                        ? `(${index + 1})`
                                        : ""}{" "}
                                    </h2>

                                    <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                                      {item?.mobile_no || ""}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ))
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : forWhat == 11 ? (
          <div>
            {imagesdata?.length >= 1 ? (
              <div
                className={`overflow-auto w-full ${
                  imagesdata?.length > 1
                    ? "grid grid-cols-3"
                    : "flex justify-center items-center"
                } gap-4 ${imagesdata?.length > 3 ? "h-[50vh]" : ""} `}
              >
                {imagesdata?.length > 1 ? (
                  imagesdata?.map((item: any) => (
                    <a
                      className=" hover:cursor-pointer"
                      href={item?.image}
                      target="_blank"
                    >
                      {" "}
                      <div
                        className={`${
                          imagesdata?.length > 1 ? "h-[full] w-[full]" : ""
                        } shadow-lg border border-success col-span-1 ${
                          imagesdata?.length == 1
                            ? "flex justify-center items-center"
                            : ""
                        }`}
                      >
                        <img
                          className={`h-[full] w-[full]`}
                          src={item?.image}
                          alt={item?.image}
                        />{" "}
                      </div>{" "}
                    </a>
                  ))
                ) : (
                  <a
                    className=" hover:cursor-pointer"
                    href={imagesdata[0]?.image}
                    target="_blank"
                  >
                    {" "}
                    <div
                      className={` shadow-lg border border-success col-span-1`}
                    >
                      <img
                        className={`h-[50vh] w-[full]`}
                        src={imagesdata[0]?.image}
                        alt={imagesdata[0]?.image}
                      />{" "}
                    </div>{" "}
                  </a>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );

  return (
    <>
      <div className="w-full lg:w-[810px] xl:w-[100%] 2xl:w-[970px]  m-auto ">
        <div className="mt-3  w-full p-3 lg:p-6 bg-white rounded-lg shadow-lg ">
          <div className="w-full">
            <div className="w-full scan bg-[#FFFAEE] border border-[#EEE3C9] rounded-lg py-3 px-3 md:py-3 md:px-5  min-h-[113px] ">
              <div className="flex">
                <figure className="hidden lg:flex items-center justify-center  relative top-[5px] mr-1  block bg-[#fff] rounded-full border border-[#F8E0AA] w-[80px] h-[80px] ">
                  <img src={trackingIocn} alt="" className="w-[42px] " />
                </figure>

                <div className="md:border-l md:border-yellow-200 md:pl-3 md:ml-4 mb-2 md:mb-0 w-full lg:w-[90%]">
                  <h2 className="text-xl font-medium mb-2"> AIRWAYBILL NO</h2>
                  <div className="scanBox md:flex block">
                    <div className="scanBoxInput relative p-[1px] overflow-hidden w-full rounded rounded-[10px]">
                      <div className="inputIcon relative">
                        <FormInput
                          id="airwaybill"
                          placeholder="Enter Airwaybill No."
                          required
                          value={searchvalue}
                          onChange={(e) => setSearchvalue(e.target.value)}
                          className="rounded rounded-[10px] w-full z-4 relative border border-[#DECDA3] h-[49px] pl-[54px] text-[17px]"
                        />

                        <i className="absolute top-[0px] left-[0px] bottom-[-1px] flex items-center w-[42px] h-[49px] border-r border-[#E8E8E8] justify-center">
                          <ClipboardList className="text-[#BFAB7A]" />
                        </i>
                      </div>
                    </div>

                    <div className="scanBoxbutton relative flex md:ml-5 mt-3 md:mt-0">
                      <Button
                        className="btnAnimation overflow-hidden  duration-200  inline-flex items-center justify-center cursor-pointer  bg-yellow-300 text-white  text-xl py-2 px-7 rounded-lg hover:bg-yellow-250 transition uppercase"
                        onClick={fetchData}
                        disabled={searchLoading}
                      >
                        <Lucide
                          icon="Search"
                          className="w-4 h-4  stroke-2.5 mr-1"
                        />{" "}
                        {searchLoading ? "Tracking" : "Track"}
                        {searchLoading ? (
                          <LoadingIcon
                            icon="three-dots"
                            color="white"
                            className="block m-auto ml-2 w-[20%] "
                          />
                        ) : (
                          ""
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>




{searchLoading ? (
  <IsLoading />
) : isObjectEmpty(alldata) ? (
  <div className="w-full flex justify-center">
    <div className="waeNodata m-auto lg:mt-[80px] mb-[60px] mt-[80px]">
      <h3 className="lg:text-[16px] text-[15px] text-[#888888] mb-6 text-center">Enter your Airwaybill No. above to search</h3>
      <figure className="opacity-30 w-full flex justify-center"><img src={tracking_awb} alt="No Data" /></figure>
    </div>
  </div>
) : null}






        </div>
      </div>









      {answer && !searchLoading && trackerdata?.length < 1 && (
        <div className=" mt-6 bg-white shadow-lg rounded">
          <p className="text-gray-400 text-center">No Data Found!</p>
        </div>
      )}
      {!searchLoading && !isObjectEmpty(alldata) ? (
        <>
          <div className="w-full lg:w-[810px] xl:w-[100%] 2xl:w-[970px]  m-auto ">
            <div className="w-full ">
              <div className=" grid grid-cols-12 gap-x-3 ">
                <div className=" col-span-12  md:col-span-3 mb-2 ">
                  <div className="w-full shipmentAccount bg-[#F8FBFE] border border-[#D4E6F8] rounded-lg p-2 mt-3">
                    <div className="sacountboxx relative  flex items-center  ">
                      <i className="shadow-[0_0_2px_#a4c6e7] rounded-full bg-[#fff] w-[52px] h-[52px] flex items-center justify-center">
                        <img
                          src={`https://flagsapi.com/${alldata?.pickup_data?.extra_data?.origin_country_code || "IN"}/flat/32.png`}
                          alt="origin-flag"
                        />
                      </i>

                      <aside className="ml-2 text-left leading-[8px]">
                        <span className="w-full font-bold text-[12px] text-[#647484]">
                          ORIGIN
                        </span>
                        <p className="text-[13px] font-medium mt-1 leading-[15px] uppercase ">
                          {allCountrydata?.find((c: any) => c?.country_code === (alldata?.pickup_data?.extra_data?.origin_country_code || "IN"))?.country_name || "INDIA"}
                        </p>
                      </aside>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-6 mb-2 ">
                  <div className="w-full shipmentAccount bg-[#F8FBFE] border border-[#D4E6F8] rounded-lg pt-2 px-2 lg:pt-1 lg:px-2 mt-3">
                    <div className="shipmentAccountBoxinn flex justify-between items-center">
                      <div className="shipmentAccountBox w-full flex items-center relative">
                        <div className=" w-full overflow-hidden z-[1]  trackingbg">
                          <div className="scooteranimate ">
                            <div id="homer" className="transform scale-[0.26] ">
                              <img
                                className="scooter "
                                src={tracking_scooter}
                              />
                              <i className="tyre wheel">
                                <img src={tracking_tyre} />
                              </i>
                              <i className="tyre2 wheel">
                                <img src={tracking_tyre} />
                              </i>
                              <i className="ekartline">
                                <img src={Tracking_ekartline2} />
                              </i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className=" col-span-12  md:col-span-3 mb-2 ">
                  <div className="w-full shipmentAccount bg-[#F8FBFE] border border-[#D4E6F8] rounded-lg p-2 mt-3">
                    <div className="sacountboxx relative  flex items-center  ">
                      <i className="shadow-[0_0_2px_#a4c6e7] rounded-full bg-[#fff] w-[52px] h-[52px] flex items-center justify-center">
                        <img
                          src={`https://flagsapi.com/${getparticulardatacommon("country", allCountrydata, alldata?.pickup_data?.delivery_country_id)?.country_code || "IN"}/flat/32.png`}
                          alt="destination-flag"
                          className="w-[32px]  "
                        />
                      </i>

                      <aside className="ml-2 text-left leading-[8px]">
                        <span className="w-full font-bold text-[12px] text-[#647484]">
                          DESTINATION
                        </span>
                        <p className="text-[13px] font-medium mt-1 leading-[15px] uppercase ">
                          {getparticulardatacommon("country", allCountrydata, alldata?.pickup_data?.delivery_country_id)?.country_name || "N.A."}
                        </p>
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[810px] xl:w-[100%] 2xl:w-[970px]  m-auto ">
            <div className="w-full bg-white  rounded-[10px] overflow-hidden relative p-[1px] border border-[#d8def0] mb-3">
              <div className="w-full bg-[#f7f8fb] border-b border-[#d8def0] rounded-t-[10px] p-[10px] flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase text-left text-[#303030] ml-2">
                  {" "}
                  SHIPMENT DETAILS
                </h2>

                {imagesdata?.length >= 1 ? (
                  <>
                    <div className="  inline-block  relative  ">
                      <div className="ml-auto  w-full leading-[14px] bg-[#ecd58a]  relative p-[1px] overflow-hidden rounded-[80px] border border-[#ecb913] before:content-[''] before:z-0 before:absolute before:top-1/2 before:left-1/2 before:w-[99999px] before:h-[99999px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)] before:bg-no-repeat before:bg-[0_0] before:animate-[rotate_4s_linear_infinite] after:content-[''] after:absolute after:z-[-1] after:left-[3px] after:top-[3px] after:w-[calc(100%-6px)] after:h-[calc(100%-6px)] after:bg-white after:rounded-[57px] hover:bg-[#e8e8e8] hover:border-[#d0d0d0] hover:before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]">
                        <button
                          onClick={() => {
                            setForwhat(11);
                            setOpenModal(true);
                          }}
                          className="w-full bg-[linear-gradient(0deg,#fbd479_0%,#a06f00_100%)] border-[1px] border-[#bb9414] relative z-10 duration-200 inline-flex items-center justify-center cursor-pointer text-[#fff] text-[15px] py-[6px] px-[26px] rounded-[80px] transition  hover:bg-[linear-gradient(0deg,#fdfdfd_0%,#a6a6a6_100%)] hover:text-[#303030] hover:border-[#c2c2c2]"
                        >
                          Weighing Machine Images
                          <ArrowRight className="w-[20px] h-[20px] ml-2" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>

              <div className="bg-white  rounded-[20px] overflow-hidden relative">
                <div className=" p-[6px] lg:p-[20px] w-full">
                  <div className="w-full max-w-6xl mx-auto  ">
                    <div className=" grid grid-cols-12 gap-x-[14px]  lg:gap-x-[24px]">
                      <div className="col-span-12  md:col-span-6  lg:col-span-8 mb-2">
                        <div className="relative mb-[0px]   rounded-[10px] border border-[#E7EEF4] lg:px-[15px] lg:py-[14px] p-[5px] bg-[#fdfdfd]">
                          <div className="w-full">
                            <div className="  justify-between rounded-lg bg-[#DFFEF3] px-3 py-2  items-center border border-[#ADEED8] mb-5">
                              <h4 className="text-[15px] text-[#00704A] flex items-center">
                                <Box className="w-[16px] h-[22px] mr-1 font-medium hidden" />
                                <img
                                  src={completed_icon}
                                  alt=""
                                  className="w-[32px]"
                                />
                                <span className="font-medium">
                                  Current Status :
                                </span>
                                <span>
                                  {externalevents?.length >= 1
                                    ? intdata?.is_open == 0
                                      ? intdata?.remark || ""
                                      : externalevents[0]?.status || ""
                                    : intdata?.is_open == 0
                                      ? intdata?.remark || ""
                                      : trackerdata[0]?.status}
                                </span>
                              </h4>
                            </div>

                            <div className="w-full">
                              <div className=" grid 2xl:grid-cols-12 gap-x-2 ">
                                <div className=" col-span-12  md:col-span-6 mb-2 ">
                                  <div className="flex items-center mb-3">
                                    <i className="mr-1 ">
                                      <Info className="w-[18px]  text-[#DD9F0F] " />
                                    </i>
                                    <p className="text-[12px] font-medium uppercase text-[#383838] ">
                                      Shipment Details
                                    </p>
                                  </div>

                                  <div className=" flex justify-center w-full  mb-2">
                                    <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                                      <User className="w-[21px]  text-[#949DA6] " />
                                    </figure>

                                    <div className=" w-full  pl-2 relative">
                                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                        Consignee
                                      </h2>
                                      <div className="w-full flex">
                                        <div className="inline-block text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                                          <span className="font-bold capitalize text-mustard underline underline-offset-4 cursor-pointer">
                                            {!isObjectEmpty(alldata) &&
                                            alldata?.consignee_data[0]
                                              ?.first_name
                                              ? alldata?.consignee_data[0]
                                                  ?.first_name
                                              : "N.A."}
                                          </span>
                                        </div>

                                        <div className="  inline-block ml-2 relative mt-[-5px] ">
                                          <div className="ml-auto inline-block mt-1  leading-[14px] bg-[#ecd58a]  relative p-[1px] overflow-hidden rounded-[80px] border border-[#ecb913] before:content-[''] before:z-0 before:absolute before:top-1/2 before:left-1/2 before:w-[99999px] before:h-[99999px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)] before:bg-no-repeat before:bg-[0_0] before:animate-[rotate_4s_linear_infinite] after:content-[''] after:absolute after:z-[-1] after:left-[3px] after:top-[3px] after:w-[calc(100%-6px)] after:h-[calc(100%-6px)] after:bg-white after:rounded-[57px] hover:bg-[#e8e8e8] hover:border-[#d0d0d0] hover:before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]">
                                            <button
                                              onClick={() => {
                                                setOpenModal(true);

                                                setForwhat(1);
                                              }}
                                              className=" bg-[linear-gradient(0deg,#fbd479_0%,#a06f00_100%)] border-[1px] border-[#bb9414] relative z-10 duration-200 inline-flex items-center justify-center cursor-pointer text-[#fff] text-[10px] font-bold py-[0px] px-[6px] rounded-[80px] transition uppercase hover:bg-[linear-gradient(0deg,#fdfdfd_0%,#a6a6a6_100%)] hover:text-[#303030] hover:border-[#c2c2c2]"
                                            >
                                              Details
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className=" flex justify-center w-full  mb-2">
                                    <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                                      <User className="w-[21px]  text-[#949DA6] " />
                                    </figure>

                                    <div className=" w-full  pl-2 relative">
                                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                        Consignor
                                      </h2>
                                      <div className="w-full flex">
                                        <div className="inline-block text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                                          <span className="font-bold capitalize text-mustard underline underline-offset-4 cursor-pointer">
                                            {!isObjectEmpty(alldata) &&
                                            alldata?.shipper_data &&
                                            alldata?.shipper_data[0]
                                              ?.shipper_name
                                              ? alldata?.shipper_data[0]
                                                  ?.shipper_name
                                              : "N.A."}
                                          </span>
                                        </div>

                                        <div className="  inline-block ml-2 relative mt-[-5px] ">
                                          <div className="ml-auto inline-block mt-1  leading-[14px] bg-[#ecd58a]  relative p-[1px] overflow-hidden rounded-[80px] border border-[#ecb913] before:content-[''] before:z-0 before:absolute before:top-1/2 before:left-1/2 before:w-[99999px] before:h-[99999px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)] before:bg-no-repeat before:bg-[0_0] before:animate-[rotate_4s_linear_infinite] after:content-[''] after:absolute after:z-[-1] after:left-[3px] after:top-[3px] after:w-[calc(100%-6px)] after:h-[calc(100%-6px)] after:bg-white after:rounded-[57px] hover:bg-[#e8e8e8] hover:border-[#d0d0d0] hover:before:bg-[conic-gradient(rgba(0,0,0,0),_#805a0c,_rgba(255,228,11,0)_25%)]">
                                            <button
                                              onClick={() => {
                                                setOpenModal(true);

                                                setForwhat(2);
                                              }}
                                              className=" bg-[linear-gradient(0deg,#fbd479_0%,#a06f00_100%)] border-[1px] border-[#bb9414] relative z-10 duration-200 inline-flex items-center justify-center cursor-pointer text-[#fff] text-[10px] font-bold py-[0px] px-[6px] rounded-[80px] transition uppercase hover:bg-[linear-gradient(0deg,#fdfdfd_0%,#a6a6a6_100%)] hover:text-[#303030] hover:border-[#c2c2c2]"
                                            >
                                              Details
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className=" flex justify-center w-full  mb-3">
                                    <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                                      <Box className="w-[21px]  text-[#949DA6] " />
                                    </figure>

                                    <div className=" w-full  pl-2 ">
                                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                        AWB No.
                                      </h2>

                                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                                        <span className=" cursor-pointer">
                                          {!isObjectEmpty(alldata) &&
                                          alldata?.pickup_data &&
                                          alldata?.pickup_data?.airwaybilno
                                            ? alldata?.pickup_data &&
                                              alldata?.pickup_data?.airwaybilno
                                            : "N.A"}{" "}
                                        </span>

                                        <div className="w-full ">
                                          <div className="w-full ">
                                            <div className="w-full">
                                              <span className="text-xs text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
                                                {externalevents?.length >= 1
                                                  ? intdata?.is_open == 0
                                                    ? intdata?.remark || ""
                                                    : externalevents[0]
                                                        ?.status || ""
                                                  : intdata?.is_open == 0
                                                    ? intdata?.remark || ""
                                                    : trackerdata[0]?.status
                                                      ? trackerdata[0]?.status
                                                      : "N.A"}
                                              </span>
                                            </div>
                                          </div>
                                          {!isObjectEmpty(alldata) &&
                                          alldata?.pickup_data?.is_rto ==
                                            "1" ? (
                                            <Tippy content="RTO">
                                              {" "}
                                              <Undo2 className=" text-red-400  " />
                                            </Tippy>
                                          ) : (
                                            ""
                                          )}{" "}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className=" flex justify-center w-full  mb-3">
                                    <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                                      <Truck className="w-[21px]  text-[#949DA6] " />
                                    </figure>

                                    <div className=" w-full  pl-2 ">
                                      <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                        Skart AWB No.
                                      </h2>

                                      <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                                        {!isObjectEmpty(alldata) &&
                                        alldata?.pickup_data?.skyway_airwaybilno
                                          ? alldata?.pickup_data
                                              ?.skyway_airwaybilno
                                          : "N.A"}
                                      </div>
                                    </div>
                                  </div>

                                  <div className=" w-full ">
                                    {cancelledData &&
                                      cancelledData?.length > 0 && (
                                        <>
                                          <div className=" flex justify-center w-full  mb-3">
                                            <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-red-100">
                                              <X className="w-[21px]  text-red-800 " />
                                            </figure>

                                            <div className=" w-full  pl-2">
                                              <h2 className="text-red-700 text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                                Cancelled AWBs
                                              </h2>

                                              <div className="text-[#303030] text-[14px]   leading-[20px] ">
                                                {cancelledData?.join(",")}
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                  </div>
                                </div>

                                <div className=" col-span-12  md:col-span-6 mb-2 ">
                                  <div className="w-full">
                                    <div className="flex items-center mb-3 w-full">
                                      <i className="mr-1 ">
                                        <Boxes className="w-[18px]  text-[#DD9F0F] " />
                                      </i>
                                      <p className="text-[12px] font-medium uppercase text-[#383838] ">
                                        Parties Details
                                      </p>
                                    </div>
                                  </div>

                                  <div className="w-full">
                                    <div className=" flex justify-center w-full  mb-3">
                                      <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                                        <StickyNote className="w-[21px]  text-[#949DA6] " />
                                      </figure>

                                      <div className=" w-full  pl-2">
                                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                          Product Type
                                        </h2>

                                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                                          {courier_name ? courier_name : "N.A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="w-full">
                                    <div className=" flex justify-center w-full  mb-3">
                                      <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                                        <Scroll className="w-[21px]  text-[#949DA6] " />
                                      </figure>

                                      <div className=" w-full  pl-2">
                                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                          Shipment Type
                                        </h2>

                                        <div className="text-[#303030] text-[14px] font-medium  uppercase leading-[20px] ">
                                          {/* {alldata?.pickup_data?.booking_shipment_type_id == 1
                          ? "Non-Document"
                          : alldata?.pickup_data?.booking_shipment_type_id == 2
                          ? "Document"
                          : alldata?.pickup_data?.booking_shipment_type_id == 4
                          ? "Commercial"
                          : alldata?.pickup_data?.booking_shipment_type_id == 5
                          ? "Cargo Commercial"
                          : "N.A."} */}

                                          {shipmentType?.find(
                                            (item: any) =>
                                              item?.booking_shipment_type_id ==
                                              alldata?.pickup_data
                                                ?.booking_shipment_type_id,
                                          )?.shipment_type || "N.A."}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className=" w-full ">
                                    <div className=" flex justify-center w-full  mb-3">
                                      <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                                        <Briefcase className="w-[21px]  text-[#949DA6] " />
                                      </figure>

                                      <div className=" w-full  pl-2">
                                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                          Business Associate / Direct Party
                                        </h2>

                                        <div className="font-medium text-[15px] text-[#383838] w-full flex items-center  ">
                                          <p className="text-[14px] capitalize text-mustard ">
                                            {franchisee_name || "N.A."}
                                          </p>

                                          <span
                                            onClick={() => {
                                              setOpenModal(true);

                                              setForwhat(5);
                                            }}
                                            className="uppercase font-bold ml-[10px] text-[10px] cursor-pointer bg-[#fff9ec] px-2 py-[0px] rounded-[20px] border border-[#ddc875] text-[#a99e00] hover:text-mustard leading-[18px]  "
                                          >
                                            Details
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="w-full ">
                                    <div className=" flex justify-center w-full  mb-3">
                                      <figure className=" w-[35px] h-[35px]  rounded-lg flex items-center justify-center bg-[#f2f2f2]">
                                        <FileText className="w-[21px]  text-[#949DA6] " />
                                      </figure>

                                      <div className=" w-full  pl-2">
                                        <h2 className="text-[#9099a2] text-[12px] font-medium  uppercase leading-[20px] group-hover:text-[#f75656] ">
                                          Exception
                                        </h2>

                                        <div className="text-[#303030] text-[14px]   leading-[20px] ">
                                          {trackerdata?.find(
                                            (item: any) =>
                                              item?.status_code == "008" ||
                                              item?.status_code == "007",
                                          )?.remarks || "N.A"}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>{" "}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className=" col-span-12  md:col-span-6 lg:col-span-4 mb-2 ">
                        <div className="flex items-center mb-3">
                          <i className="mr-1 ">
                            <Boxes className="w-[18px]  text-[#DD9F0F] " />
                          </i>
                          <p className="text-[12px] font-medium uppercase text-[#383838] ">
                            Package Details
                          </p>
                        </div>

                        <div className="w-full mb-3">
                          <div className=" bg-[#F3F3F3] rounded-lg p-[8px] flex min-h-[57px]">
                            <figure className=" w-[35px]  flex items-center justify-center">
                              <img
                                src={calendartrucking_new}
                                alt=""
                                className=" w-[19px] soft-bounce  opacity-70"
                              />
                            </figure>
                            <aside className="md:border-l md:border-[#e9e9e9] md:pl-3 ">
                              <p className="text-[12px]  uppercase text-[#757575] w-full ">
                                Booking Date
                              </p>
                              <h4 className="font-medium text-[15px] text-[#383838] w-full ">
                                <span className=" ">
                                  {!isObjectEmpty(alldata) &&
                                  alldata?.pickup_data
                                    ? formatDate(
                                        alldata?.pickup_data?.booking_date,
                                      )
                                    : "N.A"}
                                </span>
                              </h4>
                            </aside>
                          </div>{" "}
                        </div>

                        <div className="w-full mb-3">
                          <div className=" bg-[#F3F3F3] rounded-lg p-[8px] flex min-h-[57px]">
                            <figure className=" w-[35px]  flex items-center justify-center">
                              <img
                                src={tweight1Icon}
                                alt=""
                                className=" w-[21px] soft-bounce filter grayscale-[12]"
                              />
                            </figure>
                            <aside className="md:border-l md:border-[#e9e9e9] md:pl-3  w-[80%]">
                              <p className="text-[12px]  uppercase text-[#757575] w-full ">
                                Weight
                              </p>
                              <h4 className="font-medium text-[15px] text-[#383838] w-full flex justify-between items-center ">
                                <span
                                  className={`text-mustard capitalize font-bold   ${
                                    alldata?.pickup_data
                                      ?.booking_shipment_type_id == 2
                                      ? ""
                                      : "cursor-pointer underline underline-offset-4"
                                  } `}
                                >
                                  {!isObjectEmpty(alldata) &&
                                  alldata?.pickup_data
                                    ? alldata?.pickup_data?.chargeable_weight
                                      ? alldata?.pickup_data
                                          ?.chargeable_weight +
                                        alldata?.pickup_data?.weight_unit
                                      : "N.A"
                                    : ""}{" "}
                                  {alldata?.pickup_data
                                    ?.booking_shipment_type_id == 2 &&
                                  alldata.pickup_data.product_description
                                    ? `(${alldata.pickup_data.product_description})`
                                    : ""}
                                </span>

                                <div
                                  className="uppercase font-bold text-[11px] cursor-pointer bg-[#fff9ec] px-2 py-0 rounded-[10px] border border-[#ddc875] text-[#a99e00] hover:text-mustard  "
                                  onClick={() => {
                                    if (
                                      alldata?.pickup_data
                                        ?.booking_shipment_type_id != 2
                                    ) {
                                      setOpenModal(true);
                                      setForwhat(3);
                                    }
                                  }}
                                >
                                  Details
                                </div>
                              </h4>
                            </aside>
                          </div>
                        </div>

                        <div className="w-full mb-3">
                          <div className=" bg-[#F3F3F3] rounded-lg p-[8px] flex min-h-[57px]">
                            <figure className=" w-[35px]  flex items-center justify-center">
                              <img
                                src={inchesTabIcon}
                                alt=""
                                className=" w-[19px] soft-bounce filter grayscale-[12] opacity-30"
                              />
                            </figure>
                            <aside className="md:border-l md:border-[#e9e9e9] md:pl-3 ">
                              <p className="text-[12px]  uppercase text-[#757575] w-full ">
                                Weight Consideration
                              </p>
                              <h4 className="font-medium text-[15px] text-[#383838] w-full ">
                                <span className=" ">
                                  {!isObjectEmpty(alldata) &&
                                  alldata?.pickup_data?.weight_consideration
                                    ? alldata?.pickup_data
                                        ?.weight_consideration == 1
                                      ? "Skart "
                                      : alldata?.pickup_data
                                            ?.weight_consideration == 2
                                        ? "Integrator"
                                        : ""
                                    : "N.A"}
                                </span>
                              </h4>
                            </aside>
                          </div>{" "}
                        </div>

                        {courier_name.toLowerCase().includes("aramex") ? (
                          <>
                            <div className="w-full mb-3">
                              <div className=" bg-[#F3F3F3] rounded-lg p-[8px] flex min-h-[57px]">
                                <figure className=" w-[35px]  flex items-center justify-center">
                                  <img
                                    src={aramex_weight_unit}
                                    alt=""
                                    className=" w-[21px] soft-bounce filter grayscale-[12] opacity-50"
                                  />
                                </figure>
                                <aside className="md:border-l md:border-[#e9e9e9] md:pl-3 ">
                                  <p className="text-[12px]  uppercase text-[#757575] w-full ">
                                    Aramex Weight Unit
                                  </p>
                                  <h4 className="font-medium text-[15px] text-[#383838] w-full ">
                                    {arxdata?.weight_unit}
                                  </h4>
                                </aside>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}

                        {courier_name.toLowerCase().includes("aramex") ? (
                          <>
                            <div className="w-full mb-3">
                              <div className=" bg-[#F3F3F3] rounded-lg p-[8px] flex min-h-[57px]">
                                <figure className=" w-[35px]  flex items-center justify-center">
                                  <img
                                    src={aramex_package_weight}
                                    alt=""
                                    className=" w-[22px] soft-bounce filter grayscale-[12] opacity-40"
                                  />
                                </figure>
                                <aside className="md:border-l md:border-[#e9e9e9] md:pl-3 ">
                                  <p className="text-[12px]  uppercase text-[#757575] w-full ">
                                    Aramex Package Weight
                                  </p>
                                  <h4 className="font-medium text-[15px] text-[#383838] w-full ">
                                    {arxdata?.weight}
                                    {arxdata?.weight_unit}
                                  </h4>
                                </aside>
                              </div>
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[810px] xl:w-[100%] 2xl:w-[970px]  m-auto ">
            <div className="w-full bg-white  rounded-[10px] overflow-hidden relative p-[1px] border border-[#d8def0] mb-3">
              <div className="w-full bg-[#f7f8fb] border-b border-[#d8def0] rounded-t-[10px] p-[10px] flex items-center justify-between">
                <h2 className="text-lg font-bold uppercase text-left text-[#303030] ml-2">
                  Scanning Events
                </h2>
              </div>

              <div className="bg-white  rounded-[20px] overflow-hidden relative">
                <div className=" p-[10px] lg:p-[20px]">
                  <Tracker
                    data={trackerdata}
                    livelocationloading={livelocationloading}
                    length={bccList.length}
                    externalevents={externalevents}
                    courierName={courier_name}
                    intdata={intdata}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
      {openModal && (
        <CommonModal
          open={openModal}
          setOpen={setOpenModal}
          title={ModalTitle}
          description={ModalDescription}
          footer={ModalFooter}
          size={`${
            forWhat == 3 ? "xl" : forWhat == 4 || forWhat == 11 ? "lg" : "lg"
          }`}
          gridColumns={1}
        />
      )}
    </>
  );
}

export default Main;
