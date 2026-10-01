import React, { useEffect, useState } from "react";
import Tracker from "./tracker";
import {
  FormInput,
  FormSelect,
  FormLabel,
  FormCheck,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { saveAs } from "file-saver";
import { useAlert } from "../../../ContextProvider/AlertContext";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import Lucide from "../../../base-components/Lucide";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Table from "../../../base-components/Table";
import { Info, Plus, Undo2 } from "lucide-react";

import LoadingButtonCommon from "../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import Commondownload from "../commoncomponents/ComonDownload/Commondownload";
import FloatingText from "../commoncomponents/Commonfloattext/floattext";
// import { tranfereddata } from "../../Reports/ReportCommonfunctions";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import ReportCommonTable from "../commoncomponents/CommonForReports/ReportscommonTable";
import { AiFillFilePdf } from "react-icons/ai";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";
import { jsontocsv } from "../commoncomponents/JsonToCsv/Jsontocsv";
import DateDot from "./Dotfun/dotfun";
import SingleSelect from "../commoncomponents/CommonsingleSelct/Commonsingleselect";
import TomSelect from "../../../base-components/TomSelect";
import Tippy from "../../../base-components/Tippy";
import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";
import IsLoading from "../commoncomponents/isLoading/isLoading";

const initialemaildata = { email_cc: [] };
const intarxdata = {
  weight: "",
  weight_unit: "",
};
const intpostremarkdata = {
  id: 16,
  remarks: "",
  airwaybill_no: "",
  email_sent: 0,
};
const initialerrdata = {
  airwaybillno: "",
  dispatch_status: "",
  remarks: "",
  update_date: "",
};
const intextradata = {
  franchisee: "",
  user: "",
};
const initialdatatoeddit = {
  airwaybillno: "",
  dispatch_status: "",
  remarks: "",
  update_date: "",
};
function CsTracker() {
  const [forWhat, setForwhat] = useState<number>(0);
  const [file, setFile] = useState<any>("");
  const [openRemarksModal, setOpenRemarksModal] = useState<boolean>(false);
  const [remarksfile, setRemarksFile] = useState<any>("");
  const [uploadisLoading, setUploadisLoading] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");
  const [extradata, setExtradata] = useState<any>(intextradata);
  const [currencydata, setAllCurrencydata] = useState<any>([]);
  const [orgdata, setOrgdata] = useState<any>([]);
  const [intdata, setIntdata] = useState<any>({
    delivered: "",
    is_open: "",
    pickup_id: "",
    remarks: "",
  });
  const [closeoropendata, setCloseorOpendata] = useState<any>({
    remarks: "",
    remarks2: "",
    what: "",
  });
  const [updateloading, setUpdateloading] = useState<boolean>(false);
  const [allCountrydata, setAllCountrydata] = useState<any>([]);
  const [statuscodedata, setStatusCode] = useState<any>([]);
  const [basalesperson, setBasalesPerson] = useState<any>("");
  const [allsalespersondata, setAllsalespersondata] = useState<any>([]);
  const [initialdata, setInitialdata] = useState<any>(initialdatatoeddit);
  const [errordata, setErrordata] = useState<any>(initialerrdata);
  const [documentdata, setDocumentdata] = useState<any>({
    "Dispatch Label": "",
    "Shipper Invoice": "",
    "Kyc Doc 1": "",
    "Kyc Doc 2": "",
  });
  const [modaltabledata, setModaltabledata] = useState<any>([]);
  const [postremarkdata, setPostRemarkdata] = useState<any>(intpostremarkdata);
  const [searchvalue, setSearchvalue] = useState<string>("");
  const [showRemarkstable, setShowRemarksTable] = useState<boolean>(false);
  const [intdropdowndata, setIntdropdowndata] = useState<any>([]);
  const [alldata, setAlldata] = useState<any>({});
  const [externalevents, setExternalevents] = useState<any>([]);
  const [remarksdata, setRemarksdata] = useState<any>([]);
  const [answer, setAnswer] = useState<string>("");
  const [arxdata, setArxdata] = useState<any>(intarxdata);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [maindata, setMaindata] = useState<any>([]);
  const [trackerdata, setTrackerdata] = useState<Array<any>>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [emaildata, setEmaildata] = useState(initialemaildata);
  const [salesperson, setSalesperson] = useState<any>("");
  const [bccList, setBccList] = useState<string[]>([]);
  const [remarksvalue, setRemarksvalue] = useState<string>("");
  const [courier_name, setCourer_name] = useState<any>("");
  const [franchisee_name, setFranchisee_name] = useState<string>("");
  const [franchiseetype, setFranchiseeType] = useState<any>("");
  const [baemail_id, setBaemail_id] = useState<any>("");
  const [bacontactsdata, setBaContactsdata] = useState<any>([]);
  const [cancelledData, setCancelledData] = useState<Array<any>>([]);
  const [franchiseetypes, setFranchisetypes] = useState<any>([]);
  const [shipmentType, setShipmentType] = useState<any>([]);
  const { showAlert } = useAlert();
  const { userdata } = useLogin();
  const [imagesdata, setImagesdata] = useState<any>([]);
  const [remarksloading, setRemarksloading] = useState<boolean>(false);
  const [remarksId, setRemarksId] = useState<any>("");
  const [livelocationloading, setLiveLocationloading] =
    useState<boolean>(false);
  useEffect(() => {
    setExtradata((pre: any) => ({ ...pre, user: userdata?.user_name || "" }));
    getdata();
  }, []);

  useEffect(() => {
    if (intdata?.pickup_id) {
      getintremarktabledata(intdata?.pickup_id);
    }
  }, [intdata?.pickup_id]);

  const findcurrency = (id: any, currencydata: any) => {
    const singledata = currencydata?.find((item: any) => item?.id == id);
    return singledata;
  };
  const getdata = async () => {
    try {
      const res = await commongetrequest("track_shipment/remark-dropdown");
      const response = await commongetrequest("track_shipment/statuses");
      const response3 = await commongetrequest("admin/sales-person");
      const res4 = await commongetrequest("booking/currency");
      const response5 = await commongetrequest("admin/country");
      const response6 = await commongetrequest("booking/get-orgnization-document");
      const res7 = await commongetrequest("admin/franchisee-types");
      const response8 = await commongetrequest("admin/booking-shipment-type");
      if (response?.status == 200 || response?.status == 204) {
        const data = response?.data?.data;
        setStatusCode(data || []);
      }
      if (res?.status == 200) {
        const data = res?.data?.data || [];
        const newdata = data?.map((item: any) => ({
          ...item,
          name: `${item?.remark} (${item?.id})`,
        }));
        setIntdropdowndata(newdata || []);
      }
      if (response3?.status == 200) {
        setAllsalespersondata(response3?.data?.data || []);
      }
      if (res4?.status == 200) {
        setAllCurrencydata(res4?.data?.data || []);
      }
      if (response5?.status == 200) {
        setAllCountrydata(response5?.data?.data || []);
      }

      if (response6?.status == 200) {
        setOrgdata(response6?.data?.data || []);
      }
      if (res7?.status == 200) {
        setFranchisetypes(res7?.data?.data || []);
      } else if (res?.status == 204) {
        setIntdropdowndata([]);
      } else {
        console.log("error to fetch data");
      }
      if (response8?.status == 200) {
        setShipmentType(response8?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  // const handleDownload = (url) => {
  //   saveAs(url);
  // };
  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];

    if (!file) {
      showAlert("Please Select file To Upload");
      return;
    }
    setFile(file);
  };
  const handleremarksfile = (e: any) => {
    const file2 = e.target.files?.[0];

    if (!file2) {
      showAlert("Please Select file To Upload");
      return;
    }
    setRemarksFile(file2);
  };
  const fetchData = async () => {
    if (searchvalue) {
      try {
        setSearchLoading(true);

        const response = await commongetrequest(
          `track_shipment/track-shipment/${searchvalue.trim()}`,
        );

        if (
          response?.status == 200 &&
          response?.data?.pickup_data?.courier_id
        ) {
          setAlldata(response?.data);
          const obj: any = {};
          const pickupdata = response?.data?.pickup_data;
          const shipperdata = response?.data?.shipper_data[0];
          const kycdata = response?.data?.kyc_docs;
          if (pickupdata?.booking_shipment_type_id) {
            const coomres = await commonpostrequest(
              "booking/enquiry-details-by-pickup",
              { pickup_id: pickupdata?.pickup_id },
            );
            if (coomres?.status == 200) {
              const commresdata = coomres?.data?.data || [];
              setAlldata((pre: any) => ({
                ...pre,
                master_number: commresdata[0]?.master,
                enquiry_number: commresdata[0]?.enquiry_no,
              }));
            }
          }
          setDocumentdata((pre: any) => ({
            ...pre,
            "Dispatch Label": pickupdata?.shipper_inv || "",
            "Shipper Invoice": pickupdata?.shipper_invoice || "",
          }));

          if (kycdata?.organization_id) {
            if (kycdata?.document_id_1) {
              const name =
                getparticulardatacommon(
                  "org1",
                  orgdata,
                  kycdata?.organization_id,
                  kycdata?.document_id_1,
                ) || "";

              if (name) {
                setDocumentdata((pre: any) => ({
                  ...pre,
                  [name]: kycdata?.document_path_1,
                }));
              }
            }
            if (kycdata?.document_id_2) {
              const name2 =
                getparticulardatacommon(
                  "org2",
                  orgdata,
                  kycdata?.organization_id,
                  kycdata?.document_id_2,
                ) || "";
              if (name2) {
                setDocumentdata((pre: any) => ({
                  ...pre,
                  [name2]: kycdata?.document_path_2,
                }));
              }
            }
          } else {
            setDocumentdata({
              "Dispatch Label": pickupdata?.shipper_inv || "",
              "Shipper Invoice": pickupdata?.shipper_invoice || "",
            });
          }

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

          // ✅ Promise.all for courier + franchisee + image + status
          // res3;
          const [courierdata, franchiseedata, response2, res3] =
            await Promise.all([
              commongetrequest(
                `admin/courier-product/0/${response?.data?.pickup_data?.courier_id}`,
              ),
              commongetrequest(
                `admin/franchisee-settings/${response?.data?.pickup_data?.pickup_franchisee_id}`,
              ),
              commonpostrequest(`admin/check`, {
                airwaybillno: searchvalue.trim(),
              }),
              commongetrequest(
                `hub/weight_dimension/scanned-images/${searchvalue}`,
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
              setFranchiseeType(data[0]?.franchisee_type || "");
              setExtradata((pre: any) => ({
                ...pre,
                franchisee: data[0]?.franchisee_name || "",
              }));
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
              setSalesperson("");
              setFranchiseeType("");
            }
          }

          if (response2?.status == 200 || response2?.status == 204) {
            const newdata = response?.data?.data || [];
            const statusdata = response2?.data || [];

            setIntdata((pre: any) => ({
              ...pre,
              delivered: statusdata?.delivered,
              is_open: statusdata?.is_open,
              pickup_id: statusdata?.pickup_id,
              remark: statusdata?.remark || "",
            }));
          }

          if (res3?.status == 200) {
            const data = res3?.data?.data || [];
            setImagesdata(data);
          } else {
            setImagesdata([]);
          }
        }

        if (
          response?.status == 204 ||
          !response?.data?.pickup_data?.courier_id
        ) {
          setAlldata({});
          showAlert("Data Not found", "warning");
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
          item["email_sent"] = item?.email_sent ? "True" : "false";
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
          airwaybill_no: postremarkdata?.airwaybill_no,
          email_sent: postremarkdata?.email_sent,
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

    return `${newdata?.remark || "N/A"} (${newdata?.id || ""})` || "";
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
    } else if (forwhat == "org1") {
      const name = data
        ?.find((elem: any) => elem?.organisation_id == id)
        ?.value?.find((item: any) => item?.id == id2)?.value;
      return name;
    } else if (forwhat == "org2") {
      const name = data
        ?.find((elem: any) => elem?.organisation_id == id)
        ?.value?.find((item: any) => item?.id == id2)?.value;
      return name;
    } else if (forwhat == "type") {
      const singledata = data?.find((item: any) => item?.ftype_id == id);
      return singledata;
    }
  };

  const getintremarktabledata = async (pickupid: any) => {
    try {
      const res2 = await commongetrequest(
        `track_shipment/open-close-remark?pickup_id=${pickupid}`,
      );
      if (res2?.status == 200 || res2?.status == 204) {
        setModaltabledata(res2?.data?.data || []);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };
  const handleSubmit = async () => {
    const newfile = new FormData();
    const remarksnewfile = new FormData();
    newfile.append("file", file);
    remarksnewfile.append("file", remarksfile);
    remarksnewfile.append("extra", JSON.stringify(extradata));
    newfile.append("extra", JSON.stringify(extradata));
    try {
      setUploadisLoading(true);
      const res = await commonpostrequest(
        `track_shipment/open-close-remark-csv`,
        newfile,
      );

      if (res?.status == 200) {
        const invaliddata = res?.data?.invalid || [];
        showAlert(res?.data?.message);
        handlecancel();
        if (invaliddata?.length >= 1) {
          jsontocsv(invaliddata, "Invalid_data");
        }
      } else if (res?.response.status == 400) {
        showAlert(
          res?.response?.data?.message || "Something going wrong",
          "error",
        );
      } else {
        showAlert("Something going wrong please try after some time", "error");
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setUploadisLoading(false);
    }
  };
  const handleBulkRemarks = async () => {
    const remarksnewfile = new FormData();

    remarksnewfile.append("file", remarksfile);
    remarksnewfile.append("extra", JSON.stringify(extradata));

    try {
      setUploadisLoading(true);
      const res = await commonpostrequest(
        `track_shipment/remark-csv`,
        remarksnewfile,
      );

      if (res?.status == 200) {
        const invaliddata = res?.data?.invalid || [];
        showAlert(res?.data?.message);
        handlecancel();
        if (invaliddata?.length >= 1) {
          jsontocsv(invaliddata, "Invalid_data");
        }
      } else if (res?.response.status == 400) {
        showAlert(
          res?.response?.data?.message || "Something going wrong",
          "error",
        );
      } else {
        showAlert("Something going wrong please try after some time", "error");
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setUploadisLoading(false);
    }
  };
  const fun1 = () => {};

  const handleDownload = () => {
    jsontocsv([{ airwaybill: "", remark: "" }], "close_shipments_format");
  };
  const ModalFooter =
    forWhat == 6 ? (
      <>
        <Button
          type="button"
          onClick={() => {
            handlecancel();
          }}
          className="w-20 text-white mr-1  bg-gray-500 p-2"
        >
          Cancel
        </Button>
        {updateloading ? (
          <Button variant="mustard" className=" p-2 ml-2">
            <LoadingButtonCommon text={"Saving"} />
          </Button>
        ) : (
          <Button
            variant="mustard"
            onClick={() => handleUpdate()}
            disabled={
              forWhat == 7 &&
              closeoropendata?.remarks &&
              closeoropendata?.remarks2
                ? true
                : false
            }
            className="ml-2 w-20 p-2"
          >
            SAVE
          </Button>
        )}
      </>
    ) : forWhat == 7 ? (
      <>
        <Button
          type="button"
          onClick={() => {
            handlecancel();
          }}
          className="w-20 text-white mr-1  bg-gray-500 p-2"
        >
          Cancel
        </Button>
        {updateloading ? (
          <Button variant="mustard" className=" p-2 ml-2">
            <LoadingButtonCommon text={"Saving"} />
          </Button>
        ) : (
          <Button
            variant="mustard"
            onClick={() => handleUpdate()}
            disabled={
              (forWhat == 7 &&
                closeoropendata?.what == 1 &&
                closeoropendata?.remarks) ||
              (closeoropendata?.what == 2 && closeoropendata?.remarks2)
                ? false
                : true
            }
            className="ml-2 w-20 p-2"
          >
            SAVE
          </Button>
        )}
      </>
    ) : forWhat == 9 ? (
      <>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => {
            handlecancel();
          }}
          className="w-20 p-2 ml-2"
        >
          Cancel
        </Button>
        {uploadisLoading ? (
          <Button variant="mustard" type="button" className="w-30 p-2 ml-2">
            Uploading...
          </Button>
        ) : (
          <Button
            variant="mustard"
            type="button"
            disabled={!file}
            onClick={handleSubmit}
            className="w-30 p-2 ml-2"
          >
            Upload
          </Button>
        )}
      </>
    ) : forWhat == 12 ? (
      <>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => {
            handlecancel();
          }}
          className="w-20 p-2 ml-2"
        >
          Cancel
        </Button>
        {uploadisLoading ? (
          <Button variant="mustard" type="button" className="w-30 p-2 ml-2">
            Uploading...
          </Button>
        ) : (
          <Button
            variant="mustard"
            type="button"
            disabled={!remarksfile}
            onClick={handleBulkRemarks}
            className="w-30 p-2 ml-2"
          >
            Upload
          </Button>
        )}
      </>
    ) : (
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
          ) : forWhat == 6 ? (
            "Update"
          ) : forWhat == 8 ? (
            "Kyc Documents"
          ) : forWhat == 9 ? (
            <div>
              <h2 className="mr-auto text-base font-medium">Upload CSV</h2>
            </div>
          ) : forWhat == 11 ? (
            <div>
              <h2 className="mr-auto text-base font-medium">
                Weighing Machine images
              </h2>
            </div>
          ) : forWhat == 12 ? (
            <div>
              <h2 className="mr-auto text-base font-medium">Upload CSV</h2>
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
      ) : forWhat == 9 ? (
        <div>
          <Button
            className="p-2 text-white"
            onClick={handleDownload}
            variant="success"
          >
            Download Format
          </Button>
        </div>
      ) : forWhat == 12 ? (
        <div>
          <Button
            className="p-2 text-white"
            onClick={() =>
              jsontocsv(
                [{ airwaybill_no: "", remark: "" }],
                "Remarks_In_Bulk_format",
              )
            }
            variant="success"
          >
            Download Format
          </Button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    // Add leading zeros if necessary
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${hours}:${minutes}:${seconds}`;
  }
  const handlecancel = () => {
    setOpenModal(false);
    setForwhat("");
    setOpenModal(false);
    setInitialdata(initialdatatoeddit);
    setErrordata(initialerrdata);
    setFile("");
    setOpenRemarksModal(false);
    setRemarksFile("");
    setCloseorOpendata({ remarks: "", what: "", remarks2: "" });
  };
  const handleUpdate = async () => {
    const { update_date, remarks, airwaybillno, dispatch_status } = initialdata;

    if (forWhat == 6) {
      if (
        update_date &&
        airwaybillno &&
        ((dispatch_status == "2020" && remarks) ||
          (dispatch_status !== "2020" && !remarks))
      ) {
        // console.log("running")

        try {
          setUpdateloading(true);
          const res = await commonpostrequest(`admin/insert_dispatch`, {
            ...initialdata,
            update_date: initialdata?.update_date + " " + getCurrentTime(),
          });
          if (res?.status == 200) {
            showAlert(res?.data?.data);
            handlecancel();
            fetchData();
            //   handleSubmit(1);
          } else if (res?.status == 204) {
            showAlert("Awb number don't exist / Invalid awb no", "error");
          }
        } catch (err: any) {
          console.log(err?.message, "error");
        } finally {
          setUpdateloading(false);
        }
      } else {
        const errors: any = {};
        for (let key in initialdata) {
          if (dispatch_status == "2020") {
            if (!initialdata[key]) {
              errors[key] = "This is required field";
            }
          } else {
            if (!initialdata[key] && key !== "remarks") {
              errors[key] = "This is required field";
            }
          }
        }
        setErrordata(errors);
      }
    } else {
      try {
        setUpdateloading(true);
        const res = await commonpostrequest(
          "track_shipment/open-close-remark",
          {
            remark:
              closeoropendata?.remarks == "other"
                ? closeoropendata?.remarks2
                : closeoropendata?.remarks,
            pickup_id: intdata.pickup_id,
            status: intdata?.is_open == 0 ? 1 : intdata?.is_open == 1 ? 0 : "",
            airwaybill_no: searchvalue || "",
            extra: extradata,
          },
        );
        if (res?.status == 200) {
          showAlert(res?.data?.message);
          // getintremarktabledata(intdata?.pickup_id);
          // handleSubmit(1);
          fetchData();
          handlecancel();
          getintremarktabledata(intdata?.pickup_id);
        } else if (res?.response?.status == 400) {
          showAlert(res?.response?.data?.message, "error");
        } else if (res?.response?.status == 406) {
          const errors = res?.response?.data?.errors;
          setErrordata(mapErrorsToErrorObject(errors));
        } else {
          showAlert(
            "Something going wrong ,please try after some time",
            "error",
          );
        }
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setUpdateloading(false);
      }
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setInitialdata((pre: any) => ({ ...pre, [name]: value }));
    if (name == "airwaybillno") {
      setInitialdata((pre: any) => ({ ...pre, airwaybillno: value.trim() }));
    }
    setErrordata((pre: any) => ({ ...pre, [name]: "" }));
  };
  function isObjectEmpty(obj: any) {
    // console.log(Object.keys(obj).length,"checktrueofrals")
    return Object.keys(obj).length === 0;
  }
  // console.log(documentdata,"documentdata")
  // Modal description
  const ModalDescription = (
    <>
      <div className="col-span-12 sm:col-span-6 ">
        {forWhat == 1 ? (
          <div className="grid grid-cols-2 gap-5">
            <div>
              {" "}
              <div className="font-bold">Name : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.consignee_data[0]?.first_name
                  ? alldata?.consignee_data[0]?.first_name
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Company Name : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.consignee_data[0]?.company_name
                  ? alldata?.consignee_data[0]?.company_name
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Contact No. : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.consignee_data[0]?.mobile_no
                  ? alldata?.consignee_data[0]?.mobile_no
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Email : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.consignee_data[0]?.email_id
                  ? alldata?.consignee_data[0]?.email_id
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Address 1 : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.consignee_data[0]?.address1
                  ? alldata?.consignee_data[0]?.address1
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Address 2 : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.consignee_data[0]?.address2
                  ? alldata?.consignee_data[0]?.address2
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">City : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 && alldata?.consignee_data[0]?.city
                  ? alldata?.consignee_data[0]?.city
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">State : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.consignee_data[0]?.state
                  ? alldata?.consignee_data[0]?.state
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Country : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.pickup_data &&
                alldata?.pickup_data?.delivery_country_id
                  ? getparticulardatacommon(
                      "country",
                      allCountrydata,
                      alldata?.pickup_data?.delivery_country_id,
                    )?.country_name
                  : "N.A."}
              </span>
            </div>
            {alldata?.consignee_data[0]?.domestic_pincode && (
              <div>
                {" "}
                <div className="font-bold">Domestic Pincode : </div>
                <span className="text-gray-400">
                  {isObjectEmpty(alldata) == 0 &&
                  alldata?.consignee_data[0]?.domestic_pincode
                    ? alldata?.consignee_data[0]?.domestic_pincode
                    : "N.A."}
                </span>
              </div>
            )}

            {alldata?.consignee_data[0]?.international_zipcode && (
              <div>
                {" "}
                <div className="font-bold">International Zipcode : </div>
                <span className="text-gray-400">
                  {isObjectEmpty(alldata) == 0 &&
                  alldata?.consignee_data[0]?.international_zipcode
                    ? alldata?.consignee_data[0]?.international_zipcode
                    : "N.A."}
                </span>
              </div>
            )}
          </div>
        ) : forWhat == 2 ? (
          <div className="grid grid-cols-2 gap-5">
            <div>
              {" "}
              <div className="font-bold">Name : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.shipper_name
                  ? alldata?.shipper_data[0]?.shipper_name
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Company Name : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.company_name
                  ? alldata?.shipper_data[0]?.company_name
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Contact No. : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.mobile_no
                  ? alldata?.shipper_data[0]?.mobile_no
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Email Id : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.email_id
                  ? alldata?.shipper_data[0]?.email_id
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">City : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.city_name
                  ? alldata?.shipper_data[0]?.city_name
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">State : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.state
                  ? alldata?.shipper_data[0]?.state
                  : "N.A."}
              </span>
            </div>

            <div>
              {" "}
              <div className="font-bold">GST Registered Address : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.gst_registered_address
                  ? alldata?.shipper_data[0]?.gst_registered_address
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">Address : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.street_address
                  ? alldata?.shipper_data[0]?.street_address
                  : "N.A."}
              </span>
            </div>

            <div>
              {" "}
              <div className="font-bold">Pincode : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.pincode
                  ? alldata?.shipper_data[0]?.pincode
                  : "N.A."}
              </span>
            </div>
            <div>
              {" "}
              <div className="font-bold">GSTIN : </div>
              <span className="text-gray-400">
                {isObjectEmpty(alldata) == 0 &&
                alldata?.shipper_data &&
                alldata?.shipper_data[0]?.gstin
                  ? alldata?.shipper_data[0]?.gstin
                  : "N.A."}
              </span>
            </div>
          </div>
        ) : forWhat == 3 ? (
          <div>
            {isObjectEmpty(alldata) == 0 &&
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
                        LENGTH (Cms)
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        BREADTH (Cms)
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        HEIGHT (Cms)
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        HSN CODE
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        QTY.
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        VALUE (
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
                    {isObjectEmpty(alldata) == 0 &&
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
            {isObjectEmpty(alldata) == 0 &&
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
                      <Table.Th className="text-center border whitespace-nowrap ">
                        Email Sent
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        Date
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  {/* Table body */}
                  <Table.Tbody>
                    {isObjectEmpty(alldata) == 0 &&
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
                          <Table.Td className="text-center capitalize border whitespace-nowrap">
                            {item?.email_sent ? "True" : "false"}
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
          <div className="flex justify-center items-center ">
            <div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  {" "}
                  <div className="font-bold">
                    {" "}
                    Business Associate / Direct Party :{" "}
                  </div>
                  <span className="text-gray-400">
                    {franchisee_name || "N.A."}
                  </span>
                </div>

                <div>
                  {" "}
                  <div className="font-bold">Email Id : </div>
                  <span className="text-gray-400 break-all">
                    {baemail_id || "N.A."}
                  </span>
                </div>
                <div>
                  {" "}
                  <div className="font-bold">Sales Person : </div>
                  <span className="text-gray-400">{salesperson || "N.A."}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5 mt-5">
                {bacontactsdata?.length >= 1
                  ? bacontactsdata?.map((item: any, index: number) => (
                      <div className="col-span-2 ">
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            {" "}
                            <div className="font-bold">
                              Contact No.{" "}
                              {bacontactsdata?.length >= 2
                                ? `(${index + 1})`
                                : ""}
                              :
                            </div>
                            <span className="text-gray-400">
                              {item?.contact_no || ""}
                            </span>
                          </div>
                          <div>
                            {" "}
                            <div className="font-bold">
                              Mobile No.
                              {bacontactsdata?.length >= 2
                                ? `(${index + 1})`
                                : ""}{" "}
                              :
                            </div>
                            <span className="text-gray-400">
                              {item?.mobile_no || ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
        ) : forWhat == 6 ? (
          <div className="grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <FormLabel>
                AIRWAYBILL NO.<span className="text-red-400">*</span>
              </FormLabel>
              <FormInput
                id="modal-form-1"
                className={`${
                  errordata?.airwaybillno ? "border border-red-400" : ""
                }`}
                value={initialdata?.airwaybillno}
                type="text"
                name="airwaybillno"
                onChange={handleChange}
              />
            </div>

            <div className="col-span-6 ">
              <FormLabel>
                DISPATCH STATUS CODE- SCAN EVENT
                <span className="text-red-400">*</span>{" "}
              </FormLabel>
              <FormSelect
                id="modal-form-2"
                value={`${initialdata?.dispatch_status}`}
                name="dispatch_status"
                className={`${
                  errordata?.dispatch_status ? "border border-red-400" : ""
                }`}
                onChange={handleChange}
              >
                <option value="">Select</option>
                {statuscodedata?.map((item: any, index: number) => (
                  <option key={index} value={item?.status_code}>
                    {item?.status}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div className="col-span-6 ">
              <FormLabel>
                LAST UPDATE DATE<span className="text-red-400">*</span>{" "}
              </FormLabel>
              <FormInput
                id="modal-form-2"
                type="date"
                className={`${
                  errordata?.update_date ? "border border-red-400" : ""
                }`}
                value={initialdata.update_date}
                name="update_date"
                onChange={handleChange}
              />
            </div>

            {initialdata?.dispatch_status == "2020" ? (
              <div className="col-span-6 ">
                <FormLabel>REMARKS</FormLabel>
                <FormInput
                  id="modal-form-2"
                  type="text"
                  name="remarks"
                  className={`${
                    errordata?.remarks ? "border border-red-400" : ""
                  }`}
                  value={initialdata.remarks}
                  //  value={newPassword}
                  placeholder="Remarks"
                  onChange={handleChange}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ) : forWhat == 7 ? (
          intdata?.is_open == 1 ? (
            <div
              className={`grid ${
                closeoropendata?.what == 2 ? "grid-cols-12" : "grid-cols-6"
              } gap-2`}
            >
              <div className="col-span-6">
                <FormLabel>
                  Remarks<span className="text-red-400">*</span>
                </FormLabel>
                <FormSelect
                  className={`${
                    errordata?.remark ? "border border-red-400" : ""
                  }`}
                  value={closeoropendata?.remarks}
                  name="remarks"
                  onChange={(e: any) => {
                    const value = e.target.value;

                    if (value == "other") {
                      setCloseorOpendata((pre: any) => ({
                        what: 2,
                        remarks: e.target.value,
                      }));
                      setErrordata((pre: any) => ({ ...pre, remark: "" }));
                    } else {
                      setCloseorOpendata((pre: any) => ({
                        what: 1,
                        remarks: e.target.value,
                      }));
                      setErrordata((pre: any) => ({ ...pre, remark: "" }));
                    }
                  }}
                >
                  <option value="">Select</option>
                  <option value="other">Other</option>
                  <option value="Already Delivered"> Already Delivered</option>
                  <option value="since no reply from Sender">
                    since no reply from Sender
                  </option>
                  <option value="since no reply from Consignee">
                    since no reply from Consignee
                  </option>
                  <option value="Declared lost">Declared lost</option>
                  <option value="Non-delivery compliant">
                    {" "}
                    Non-delivery compliant
                  </option>
                  <option value="Consignee asked to abandon the shipment to avoid">
                    {" "}
                    Consignee asked to abandon the shipment to avoid
                  </option>
                </FormSelect>
              </div>

              {closeoropendata?.what == 2 ? (
                <div className="col-span-6 ">
                  <FormLabel>REMARKS</FormLabel>
                  <FormInput
                    id="modal-form-2"
                    type="text"
                    name="remarks"
                    className={`${
                      errordata?.remark ? "border border-red-400" : ""
                    }`}
                    placeholder="Remarks"
                    onChange={(e: any) => {
                      setCloseorOpendata((pre: any) => ({
                        ...pre,
                        remarks2: e.target.value,
                      }));
                    }}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : intdata?.is_open == 0 ? (
            <div className="grid grid-cols-6 gap-2">
              <div className="col-span-6">
                <FormLabel>
                  Remarks.<span className="text-red-400">*</span>
                </FormLabel>
                <FormInput
                  className={`${
                    errordata?.remark ? "border border-red-400" : ""
                  }`}
                  value={closeoropendata?.remarks}
                  type="text"
                  name="remarks"
                  onChange={(e: any) => {
                    setCloseorOpendata((pre: any) => ({
                      ...pre,
                      remarks: e.target.value,
                    }));

                    setErrordata((pre: any) => ({ ...pre, remark: "" }));
                  }}
                />
              </div>

              {initialdata?.dispatch_status == "2020" ? (
                <div className="col-span-6 ">
                  <FormLabel>REMARKS</FormLabel>
                  <FormInput
                    id="modal-form-2"
                    type="text"
                    name="remarks"
                    className={`${
                      errordata?.remarks ? "border border-red-400" : ""
                    }`}
                    value={initialdata.remarks}
                    //  value={newPassword}
                    placeholder="Remarks"
                    onChange={handleChange}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )
        ) : forWhat == 8 ? (
          <div className="flex justify-center gap-2 shadow-lg p-4 rounded ">
            {Object.entries(documentdata).map(([key, docs_link], index) =>
              docs_link && docs_link !== "N/A" ? (
                <a href={docs_link} target="_blank">
                  <Button className="p-2 text-white" variant="success">
                    {key}
                  </Button>
                </a>
              ) : (
                ""
              ),
            )}
          </div>
        ) : forWhat == 9 ? (
          <div className="col-span-12 sm:col-span-12">
            <FormLabel>Upload CSV</FormLabel>
            <FormInput type="file" accept=".csv" onChange={handleFileChange} />
          </div>
        ) : forWhat == 10 ? (
          <div>
            {isObjectEmpty(alldata) == 0 && alldata?.pickup_data ? (
              <div className="overflow-auto w-full">
                <Table hover sm>
                  {/* Table headers */}
                  <Table.Thead className="bg-mustard text-white border">
                    <Table.Tr>
                      <Table.Th className="text-center border">Sr.No.</Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap ">
                        VALUE
                      </Table.Th>
                      <Table.Th className="text-center border whitespace-nowrap">
                        CURRENCY
                      </Table.Th>
                      {/* <Table.Th className="text-center border whitespace-nowrap">
                        INR VALUE
                      </Table.Th> */}
                    </Table.Tr>
                  </Table.Thead>

                  {/* Table body */}
                  <Table.Tbody>
                    {isObjectEmpty(alldata) == 0 && alldata?.pickup_data && (
                      <Table.Tr>
                        <Table.Td className="text-center border">{1}.</Table.Td>
                        <Table.Td className="text-center capitalize border whitespace-nowrap">
                          {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                            ? alldata?.pickup_data?.product_value || ""
                            : "N.A"}
                        </Table.Td>
                        <Table.Td className="text-center border whitespace-nowrap">
                          {findcurrency(
                            alldata?.pickup_data?.currency_id,
                            currencydata,
                          )?.currency || ""}
                        </Table.Td>
                        {/* <Table.Td className="text-center border whitespace-nowrap">
                          {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                            ? alldata?.pickup_data?.product_value
                            : "N.A"}
                        </Table.Td> */}
                      </Table.Tr>
                    )}
                  </Table.Tbody>
                </Table>
              </div>
            ) : (
              ""
            )}
          </div>
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
        ) : forWhat == 12 ? (
          <div className="col-span-12 sm:col-span-12">
            <FormLabel>Upload CSV</FormLabel>
            <FormInput type="file" accept=".csv" onChange={handleremarksfile} />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
  const RemarksModalDescription = (
    <>
      <div className=" overflow-auto h-[250px]">
        {modaltabledata?.length >= 1 ? (
          <ReportCommonTable
            columns={modaltabledata[0]}
            row={modaltabledata.map((item: any) => {
              delete item["extra"];
              return {
                ...item,
                created_date: new Date(item.created_date).toLocaleString(),
              };
            })}
            //  loading={postisLoading}
            page={0}
            overflow={false}
            // height={"250px"}
          />
        ) : (
          <Nodatafound />
        )}
      </div>
    </>
  );
  return (
    <>
      <div className="w-full max-w-6xl mx-auto mt-8  bg-white rounded-lg shadow-lg ">
        <div className="min-[493px]:flex justify-between">
          <div className="py-2 px-4">
            <h1 className="text-2xl font-bold text-primary "> CS TRACKING</h1>
          </div>
          <div className="flex justify-between">
            <div>
              <Button
                className="p-2 text-white mr-2 mt-2"
                onClick={() => {
                  setForwhat(9);
                  setOpenModal(true);
                }}
                variant="danger"
              >
                Close In Bulk
              </Button>
            </div>
            <div>
              <Button
                className="p-2 text-white mr-2 mt-2"
                onClick={() => {
                  setForwhat(12);
                  setOpenModal(true);
                }}
                variant="mustard"
              >
                Remarks In Bulk
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center w-full border-t border-slate-200 dark:border-darkmode-400"></div>
        <div className="min-[572px]:flex items-end  p-4 gap-4">
          <div>
            <FormLabel className="text-base">
              AIRWAYBILL NO <span className="text-red-500">*</span>
            </FormLabel>
            <FormInput
              id="airwaybill"
              placeholder="Enter Airwaybill No."
              required
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  fetchData();
                }
              }}
              value={searchvalue}
              onChange={(e) => setSearchvalue(e.target.value)}
            />
          </div>

          <div>
            <Button
              className="bg-mustard text-white p-2 w-[150px] "
              onClick={fetchData}
              disabled={searchLoading}
            >
              <Lucide icon="Search" className="w-4 h-4  stroke-2.5 mr-1" />{" "}
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
          {searchvalue && intdata?.pickup_id ? (
            <div className=" mt-8 grid-cols-2">
              <div>
                <Button
                  variant="mustard"
                  // disabled={postisLoading || !awbno}
                  onClick={() => {
                    setOpenModal(true);
                    setForwhat(6);
                    setInitialdata((pre: any) => ({
                      ...pre,
                      airwaybillno: searchvalue.trim(),
                    }));
                  }}
                  className="  mr-1 p-2 w-full mt-2"
                >
                  Update
                </Button>
              </div>
            </div>
          ) : (
            ""
          )}

          {intdata?.is_open !== "" ? (
            <div className=" mt-5 grid-cols-2">
              <div>
                <Button
                  variant={
                    intdata?.is_open == 0 || intdata?.is_open == 2
                      ? "success"
                      : intdata?.is_open == 1
                        ? "danger"
                        : "mustard"
                  }
                  disabled={intdata?.is_open == 2}
                  onClick={() => {
                    setOpenModal(true);
                    setForwhat(7);
                    setCloseorOpendata((pre: any) => ({ ...pre, what: 1 }));
                  }}
                  className=" mt-2 mr-1 p-2 w-full text-white"
                >
                  {intdata?.is_open == 0
                    ? "Open Shipment"
                    : intdata?.is_open == 1
                      ? "Close Shipment"
                      : intdata?.is_open == 2
                        ? " Pending Approvel"
                        : ""}
                </Button>
              </div>
            </div>
          ) : (
            ""
          )}

          {modaltabledata?.length >= 1 ? (
            <div className=" mt-5 grid-cols-2">
              <div className="mt-2 relative">
                <Info
                  onMouseEnter={() => setShowRemarksTable(true)}
                  onMouseLeave={() => setShowRemarksTable(false)}
                />

                {showRemarkstable && (
                  <div
                    className="absolute top-6 z-50 right-4 border border-gray-400 shadow-lg rounded bg-white"
                    onMouseEnter={() => setShowRemarksTable(true)}
                    onMouseLeave={() => setShowRemarksTable(false)}
                  >
                    {RemarksModalDescription}
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      {answer && !searchLoading && trackerdata?.length < 1 && (
        <div className=" mt-6 bg-white shadow-lg rounded">
          <p className="text-gray-400 text-center">No Data Found!</p>
        </div>
      )}
      {searchLoading ? (
        <IsLoading />
      ) : !isObjectEmpty(alldata) ? (
        <>
          <div className="w-full max-w-6xl mx-auto mt-8  bg-white rounded-lg shadow-lg ">
            <div className="flex justify-between">
              <div className="mt-8 px-4">
                <h1 className="text-2xl text-primary font-bold ">
                  SHIPMENT DETAILS
                </h1>
              </div>

              {imagesdata?.length >= 1 ? (
                <div className="mt-8 px-4 mb-2">
                  <div className=" ">
                    <Button
                      onClick={() => {
                        setForwhat(11);
                        setOpenModal(true);
                      }}
                      className="p-2 bg-success text-white"
                    >
                      Weighing Machine Images
                    </Button>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="flex justify-center w-full border-t border-slate-200 dark:border-darkmode-400 "></div>
            {/* min-[1029px]:flex */}
            <div className="justify-between gap-4 py-6 mx-6 ">
              {/*  */}
              <div
                className={`border  shadow-lg  rounded-lg  ${
                  alldata ? "min-[700px]:h-[auto]" : "min-[700px]:h-[auto]"
                }`}
              >
                <div className="flex justify-center items-center mt-4 ">
                  <h2 className="text-lg ">
                    <b>AWB No. : </b>
                    {isObjectEmpty(alldata) == 0 &&
                    alldata?.pickup_data &&
                    alldata?.pickup_data?.airwaybilno
                      ? alldata?.pickup_data &&
                        alldata?.pickup_data?.airwaybilno
                      : "N.A"}{" "}
                  </h2>
                  <div className=" ml-2 ">
                    <div className="w-full">
                      <span className="text-xs text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
                        {externalevents?.length >= 1
                          ? intdata?.is_open == 0
                            ? intdata?.remark || ""
                            : externalevents[0]?.status || ""
                          : intdata?.is_open == 0
                            ? intdata?.remark || ""
                            : trackerdata[0]?.status
                              ? trackerdata[0]?.status
                              : "N.A"}
                      </span>
                    </div>
                  </div>
                  {isObjectEmpty(alldata) == 0 &&
                  alldata?.pickup_data?.is_rto == "1" ? (
                    <Tippy content="RTO">
                      {" "}
                      <Undo2 className=" text-red-400  " />
                    </Tippy>
                  ) : (
                    ""
                  )}{" "}
                </div>
                <div className="grid min-[710px]:grid-cols-3 my-4 rounded ">
                  <div className="px-4 py-2 ">
                    <div>
                      {" "}
                      <div className="font-bold ">Skart AWB No. :</div>
                      <span className="font-normal text-primary cursor-pointer">
                        {isObjectEmpty(alldata) == 0 &&
                        alldata?.pickup_data?.skyway_airwaybilno
                          ? alldata?.pickup_data?.skyway_airwaybilno
                          : "N.A"}
                      </span>
                    </div>
                    <div className="mt-4">
                      {" "}
                      <span className="font-bold ">Consignee : </span>
                      <span
                        onClick={() => {
                          setOpenModal(true);

                          setForwhat(1);
                        }}
                        className="font-bold capitalize text-mustard underline underline-offset-4 cursor-pointer"
                      >
                        {isObjectEmpty(alldata) == 0 &&
                        alldata?.consignee_data[0]?.first_name
                          ? alldata?.consignee_data[0]?.first_name
                          : "N.A."}
                      </span>
                    </div>
                    <div>
                      <div className=" mt-4">
                        <span className="font-bold">Consignor : </span>
                        <span
                          onClick={() => {
                            setOpenModal(true);

                            setForwhat(2);
                          }}
                          className="font-bold capitalize text-mustard underline underline-offset-4 cursor-pointer"
                        >
                          {isObjectEmpty(alldata) == 0 &&
                          alldata?.shipper_data &&
                          alldata?.shipper_data[0]?.shipper_name
                            ? alldata?.shipper_data[0]?.shipper_name
                            : "N.A."}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="font-bold ">Sales Person : </span>
                      <span className="font-normal text-primary ">
                        {salesperson ? salesperson : "N.A"}
                      </span>
                    </div>
                    {alldata?.pickup_data?.booking_shipment_type_id == 5 ? (
                      <div className="mt-4">
                        <span className="font-bold ">Enquiry Number : </span>
                        <span className="font-normal text-primary ">
                          {isObjectEmpty(alldata) == 0 &&
                          alldata?.enquiry_number
                            ? alldata?.enquiry_number
                            : "N.A"}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="mt-4">
                      <span className="font-bold ">
                        Weight Consideration :{" "}
                      </span>
                      <span className="font-normal text-primary ">
                        {isObjectEmpty(alldata) == 0 &&
                        alldata?.pickup_data?.weight_consideration
                          ? alldata?.pickup_data?.weight_consideration == 1
                            ? "Skart "
                            : alldata?.pickup_data?.weight_consideration == 2
                              ? "Integrator"
                              : ""
                          : "N.A"}
                      </span>
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <div className=" ">
                      <div className="font-bold  ">Booking Date :</div>
                      <span className="font-normal text-primary ">
                        {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                          ? formatDate(alldata?.pickup_data?.booking_date)
                          : "N.A"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="font-bold ">Product Type : </span>
                      <span className="font-normal text-primary ">
                        {courier_name ? courier_name : "N.A"}
                      </span>
                    </div>
                    <div className="mt-4 ">
                      <span className="font-bold ">Weight : </span>
                      <span
                        className={`text-mustard capitalize font-bold   ${
                          alldata?.pickup_data?.booking_shipment_type_id == 2
                            ? ""
                            : "cursor-pointer underline underline-offset-4"
                        } `}
                        onClick={() => {
                          if (
                            alldata?.pickup_data?.booking_shipment_type_id != 2
                          ) {
                            setOpenModal(true);
                            setForwhat(3);
                          }
                        }}
                      >
                        {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                          ? alldata?.pickup_data?.chargeable_weight
                            ? alldata?.pickup_data?.chargeable_weight +
                              alldata?.pickup_data?.weight_unit
                            : "N.A"
                          : ""}{" "}
                        {alldata?.pickup_data?.booking_shipment_type_id == 2 &&
                        alldata.pickup_data.product_description
                          ? `(${alldata.pickup_data.product_description})`
                          : ""}
                      </span>
                    </div>
                    <div className="mt-4 ">
                      <span className="font-bold ">Invoice Value : </span>
                      <span
                        className={`text-mustard capitalize font-bold   cursor-pointer underline underline-offset-4
                        } `}
                        onClick={() => {
                          setOpenModal(true);
                          setForwhat(10);
                        }}
                      >
                        {isObjectEmpty(alldata) == 0 && alldata?.pickup_data
                          ? alldata?.pickup_data?.product_value +
                              " " +
                              findcurrency(
                                alldata?.pickup_data?.currency_id,
                                currencydata,
                              )?.currency || ""
                          : "N.A"}
                      </span>
                    </div>
                    {alldata?.pickup_data?.booking_shipment_type_id == 5 ? (
                      <div className="mt-4">
                        <span className="font-bold ">Master No. : </span>
                        <span className="font-normal text-primary ">
                          {isObjectEmpty(alldata) == 0 && alldata?.master_number
                            ? alldata?.master_number
                            : "N.A"}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="px-4 py-2">
                    <div className="">
                      <span className="font-bold">
                        {" "}
                        Business Associate / Direct Party :{" "}
                      </span>
                      <span
                        onClick={() => {
                          setOpenModal(true);

                          setForwhat(5);
                        }}
                        className="font-bold capitalize text-mustard underline underline-offset-4 cursor-pointer"
                      >
                        {franchisee_name || "N.A."}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="font-bold">Shipment Type : </span>
                      <span className="font-normal text-primary ">
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
                            alldata?.pickup_data?.booking_shipment_type_id,
                        )?.shipment_type || "N.A."}
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="font-bold">Kyc Documents : </span>
                      <span
                        onClick={() => {
                          setOpenModal(true);

                          setForwhat(8);
                        }}
                        className="font-bold capitalize text-mustard underline underline-offset-4 cursor-pointer"
                      >
                        See Documents
                      </span>
                    </div>
                    <div className="mt-4">
                      <span className="font-bold">Customer Type : </span>

                      <span className="text-sm text-yellow-500 bg-yellow-100 py-0.5 px-2 rounded-full">
                        {getparticulardatacommon(
                          "type",
                          franchiseetypes,
                          franchiseetype || "",
                        )?.franchisee_type || "N.A"}{" "}
                      </span>
                    </div>
                    {/* {alldata?.pickup_data?.booking_shipment_type_id == 5 ? (
                      <div className="mt-4">
                        <span className="font-bold">House Number : </span>

                        <span className="text-sm text-yellow-500 bg-yellow-100 py-0.5 px-2 rounded-full">
                          {isObjectEmpty(alldata) == 0 &&
                          alldata?.pickup_data?.house_no
                            ? alldata?.pickup_data?.house_no
                            : "N.A"}
                        </span>
                      </div>
                    ) : (
                      ""
                    )} */}
                    {courier_name.toLowerCase().includes("aramex") ? (
                      <div className="mt-4">
                        <span className="font-bold">Aramex Weight Unit : </span>
                        <span className="font-normal text-primary ">
                          {arxdata?.weight_unit}{" "}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}

                    {courier_name.toLowerCase().includes("aramex") ? (
                      <div className="mt-4">
                        <span className="font-bold">
                          Aramex Package Weight:{" "}
                        </span>
                        <span className="font-normal text-primary ">
                          {arxdata?.weight}
                          {arxdata?.weight_unit}
                        </span>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="grid min-[600px]:grid-cols-3">
                  <div className="m-4 mt-0 ">
                    <span className="font-bold">Current Status : </span>
                    <span className="text-sm text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
                      {externalevents?.length >= 1
                        ? intdata?.is_open == 0
                          ? intdata?.remark || ""
                          : externalevents[0]?.status || ""
                        : intdata?.is_open == 0
                          ? intdata?.remark || ""
                          : trackerdata[0]?.status
                            ? trackerdata[0]?.status
                            : "N.A"}
                    </span>
                  </div>
                  <div className="px-4">
                    <span className="font-bold">Exception : </span>
                    <span className="text-sm text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
                      {trackerdata?.find(
                        (item: any) =>
                          item?.status_code == "008" ||
                          item?.status_code == "007",
                      )?.remarks || "N.A"}
                    </span>
                  </div>
                  <div className="  px-4">
                    <span className="font-bold ">
                      Freight Deducted(gst incl.) :{" "}
                    </span>
                    <span className="font-normal text-primary ">
                      {(isObjectEmpty(alldata) == 0 &&
                        alldata?.pickup_data &&
                        Number(alldata?.pickup_data?.freight).toFixed(3)) +
                        " INR" || ""}
                    </span>
                  </div>
                  <div className="  px-4 flex ">
                    <span className="font-bold ">Tat Date : </span>
                    <span className="font-normal text-primary ">
                      {(isObjectEmpty(alldata) == 0 &&
                        alldata?.pickup_data?.tat_date &&
                        alldata?.pickup_data && (
                          <DateDot
                            tat_date={alldata?.pickup_data?.tat_date}
                            is_open={intdata?.is_open}
                          />
                        )) ||
                        ""}
                    </span>
                  </div>
                </div>

                <div>
                  {cancelledData && cancelledData?.length > 0 && (
                    <div>
                      <div className=" mx-4">
                        <span className="font-bold">Cancelled AWBs : </span>
                        <span className="font-bold text-red-500 ">
                          {cancelledData?.join(",")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="m-4 ">
                  <div className="flex">
                    <div>
                      {" "}
                      <label className="font-bold ">
                        Add Remarks :{" "}
                        {remarksdata?.length >= 1 ? (
                          <span
                            onClick={() => {
                              setForwhat(4);
                              setOpenModal(true);
                            }}
                            className="text-mustard capitalize font-bold cursor-pointer underline underline-offset-4"
                          >
                            See Remarks
                          </span>
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="grid min-[647px]:grid-cols-4  mt-1 ">
                    <div>
                      <label className="font-bold ">
                        Reason<span className="text-red-400">*</span>
                      </label>
                      {/* <FormSelect
                        className="p-2.5"
                        value={postremarkdata?.id}
                        onChange={(e: any) => {
                          const value = e.target.value;
                          setPostRemarkdata((pre: any) => ({
                            ...pre,
                            id: Number(value),
                          }));
                        }}
                      >
                        <option value="">Select</option>
                        {intdropdowndata?.length >= 1
                          ? intdropdowndata?.map((item: any) => (
                              <option key={item?.id} value={item?.id}>
                                {item?.remark || "N/A"}
                              </option>
                            ))
                          : ""}
                      </FormSelect> */}
                      <TomSelect
                        value={`${postremarkdata?.id}`}
                        onChange={(e: any) => {
                          // const value = e.target.value;
                          setPostRemarkdata((pre: any) => ({
                            ...pre,
                            id: Number(e),
                          }));
                        }}
                      >
                        <option>Select</option>
                        {intdropdowndata?.length >= 1
                          ? intdropdowndata?.map((item: any) => (
                              <option key={item?.id} value={item?.id}>
                                {item?.remark !== null
                                  ? item?.name
                                  : `N/A (${item?.id})`}
                              </option>
                            ))
                          : ""}
                      </TomSelect>
                    </div>{" "}
                    {postremarkdata?.id == 9 ? (
                      <div className="ml-2">
                        <label className="font-bold">Airwaybill No.</label>
                        <div>
                          {" "}
                          <input
                            type="text"
                            className={`border   border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                            placeholder="Airwaybill no"
                            value={postremarkdata.airwaybill_no}
                            onChange={(e: any) => {
                              setRemarks(e.target.value);
                              setPostRemarkdata((pre: any) => ({
                                ...pre,
                                airwaybill_no: e.target.value,
                              }));
                            }}
                            // onKeyPress={handleBccInputKeyPress}
                            // onKeyDown={handleBccInputKeyDown}
                          />
                        </div>{" "}
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="ml-2">
                      <label className="font-bold">Remarks</label>
                      <div>
                        {" "}
                        <input
                          type="text"
                          className={`border   border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                          placeholder="Remarks"
                          value={postremarkdata.remarks}
                          onChange={(e: any) => {
                            setRemarks(e.target.value);
                            setPostRemarkdata((pre: any) => ({
                              ...pre,
                              remarks: e.target.value,
                            }));
                          }}
                          // onKeyPress={handleBccInputKeyPress}
                          // onKeyDown={handleBccInputKeyDown}
                        />
                      </div>{" "}
                    </div>
                    {/* <div className="ml-4 mt-8">
                      {" "}
                      <FormCheck className="">
                        <FormCheck.Input
                          id="checkbox-switch-1"
                          type="checkbox"
                          value={postremarkdata?.email_sent}
                          onChange={(e: any) => {
                            if (e.target.checked) {
                              setPostRemarkdata((pre: any) => ({
                                ...pre,
                                email_sent: 1,
                              }));
                            } else {
                              setPostRemarkdata((pre: any) => ({
                                ...pre,
                                email_send: 0,
                              }));
                            }
                          }}
                          className="mr-1  hover:border-mustard"
                          defaultChecked={
                            postremarkdata?.email_sent ? true : false
                          }
                        />
                        <label
                          htmlFor="checkbox-switch-1"
                          className=" font-bold"
                        >
                          Email Send
                        </label>
                      </FormCheck>
                    </div> */}
                    {/* ) : (
                      ""
                    )} */}
                    <div className="  ">
                      <Button
                        className="p-2 w-[100px] ml-2 mt-5 "
                        disabled={remarksloading || !postremarkdata?.id}
                        onClick={() => {
                          handleremarks(alldata?.pickup_data?.pickup_id);
                        }}
                        variant="mustard"
                      >
                        <Plus className="ml-1" />
                        {remarksloading ? (
                          <LoadingButtonCommon text="Adding" />
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5   min-[1029px]:mt-0 ">
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
            forWhat == 3 ? "xl" : forWhat == 4 || forWhat == 11 ? "lg" : "md"
          }`}
          gridColumns={1}
        />
      )}
    </>
  );
}

export default CsTracker;
