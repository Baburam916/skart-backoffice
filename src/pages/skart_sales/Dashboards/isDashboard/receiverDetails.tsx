import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import Lucide from "../../../../base-components/Lucide";
import { useEffect, useState } from "react";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import {
  FormInput,
  FormLabel,
  FormSelect,
  InputGroup,
} from "../../../../base-components/Form";
import TomSelect from "../../../../base-components/TomSelect";
import { downloadAttachment, getCurrentDate, onlyNumbers } from "../../../../utils";
import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../../AllServices/services";
import KycModal from "./kycModal";

interface ReceiverDetailsProps {
  open: boolean;
  onClose: () => void;
  countryData: any;
  isEdit?: boolean;
  booking?: any;
  setJobData?: () => void;
  dimensionData?: any;
  enquiryData: any;
}

const intselecteddata2 = {
  id: "",
  fair_name: "",
};
const ReceiverDetails: React.FC<ReceiverDetailsProps> = ({
  open,
  onClose,
  countryData,
  isEdit = false,
  booking,
  setJobData,
  dimensionData,
  enquiryData,
}) => {
  const { showAlert } = useAlert();
  const [contactEdit, setContactEdit] = useState(
    !!booking?.consignee_details?.consignee_contact_verified
  );
  const [spinner, setSpinner] = useState(false);
  const [kycModalPreview, setKycModalPreview] = useState<boolean>(false);
  const [consigneeDocTypes, setConsigneeDocTypes] = useState([]);
  const [docCheck, setDocCheck] = useState<any>(null);
  const [gstApplicable, setGstApplicable] = useState([]);
  const [taxPaymentOption, setTaxPaymentOption] = useState([]);
  const [receiverDetails, setReceiverDetails] = useState({
    consignee_mobile_number:
      booking?.consignee_details?.consignee_mobile_number || "",
    consignee_email_id: booking?.consignee_details?.consignee_email_id || "",
    consignee_first_name:
      booking?.consignee_details?.consignee_first_name || "",
    consignee_company_name:
      booking?.consignee_details?.consignee_company_name || "",
    consignee_address_1: booking?.consignee_details?.consignee_address_1 || "",
    consignee_address_2: booking?.consignee_details?.consignee_address_2 || "",
    consignee_pincode: booking?.dest_zip || enquiryData?.dest_zip || "0000",
    consignee_city: booking?.dest_city || enquiryData?.dest_city || "",
    consignee_state:
      booking?.consignee_details?.consignee_state || booking?.dest_state_code || enquiryData?.dest_state_code || "",
    consignee_country:
      countryData?.find(
        (ele: any) =>
          ele?.country_id ==
          (booking?.dest_country_id || enquiryData?.dest_country_id || 97),
      )?.country_name || "INDIA",
    consignee_reference_no:
      booking?.consignee_details?.consignee_reference_no || "",
    booking_invoice_number:
      booking?.consignee_details?.booking_invoice_number || "",
    booking_invoice_date:
      booking?.consignee_details?.booking_invoice_date ||
      getCurrentDate() ||
      "",
    ...(booking?.shipment_type == 8
      ? {
          fair_id: "",
          fair_hall: "",
          fair_booth: "",
          fair_venue: "",
          mode: "",
        }
      : {}),
    consignee_doc_type: booking?.consignee_details?.consignee_doc_type || "1",
    consignee_gst_number:
      booking?.consignee_details?.consignee_gst_number || "N.A.",
    consignee_gst_applicable:
      booking?.consignee_details?.consignee_gst_applicable || "",
    consignee_tax_payment:
      booking?.consignee_details?.consignee_tax_payment || "",
    kyc_details: booking?.consignee_details?.kyc_details || "",
    ...(enquiryData?.import_booking == "2" && enquiryData?.import_booking_type == "2"
      ? {
        broker_address_1: booking?.consignee_details?.broker_address_1 || "",
        broker_address_2: booking?.consignee_details?.broker_address_2 || "",
        broker_city: booking?.consignee_details?.broker_city || "",
        broker_state: booking?.consignee_details?.broker_state || "",
        broker_pincode: booking?.consignee_details?.broker_pincode || "",
        broker_country_code: booking?.consignee_details?.broker_country_code || "IN",
        broker_name: booking?.consignee_details?.broker_name || "",
        broker_email: booking?.consignee_details?.broker_email || "",
        broker_phone_extension: booking?.consignee_details?.broker_phone_extension || "+91",
        broker_phone: booking?.consignee_details?.broker_phone || "",
        broker_company_name: booking?.consignee_details?.broker_company_name || "",
      } : {})
  });

  const [selecteddata2, setSelecteddata2] = useState<any>(intselecteddata2);
  const handleDataReset = () => {
    setReceiverDetails({
      consignee_mobile_number: "",
      consignee_email_id: "",
      consignee_first_name: "",
      consignee_company_name: "",
      consignee_address_1: "",
      consignee_address_2: "",
      consignee_pincode: booking?.dest_zip || "0000",
      consignee_city: booking?.dest_city || "",
      consignee_state: booking?.dest_state_code || "",
      consignee_country:
        countryData?.find(
          (ele: any) => ele?.country_id == booking?.dest_country_id,
        )?.country_name || "INDIA",
      consignee_reference_no: "",
      booking_invoice_number: "",
      booking_invoice_date: getCurrentDate() || "",
      consignee_gst_applicable: "",
      consignee_tax_payment: "",
    });
    setContactEdit(false);
  };

  const getConsigneeData = async () => {
    if (spinner) {
      return;
    }

    if (!receiverDetails?.consignee_mobile_number) {
      showAlert("Please enter mobile number", "error");
      return;
    }
    const mobile = receiverDetails.consignee_mobile_number;
    const isSequential = mobile.split("").every((d: string, i: number, arr: string[]) => i === 0 || (parseInt(arr[i - 1]) + 1) % 10 === parseInt(d));
    if (isSequential) {
      showAlert("Please enter a valid mobile number", "warning");
      return;
    }
    setSpinner(true);
    try {
      const response: any = await commonpostrequest("book/get_consignee_data", {
        consignee_mobile_number: receiverDetails?.consignee_mobile_number,
        import_booking: 2,
      });
      if (response?.data?.status == 200) {
        setContactEdit(true);

        setReceiverDetails((prev) => ({ ...prev, ...response?.data?.data }));
        showAlert("Receiver Details Found");
      } else if (response?.data?.status == 400) {
        showAlert(response?.data?.data[0]?.message, "error");
      } else {
        showAlert("Something Went Wrong", "error");
      }
    } catch (err: any) {
      showAlert("Something Went Wrong", "error");
    } finally {
      setSpinner(false);
    }
  };

  const handleValidate = (docNumber: string) => {
    if (docNumber == "") {
      setDocCheck(null);
      return;
    }
    if (receiverDetails?.consignee_doc_type == 1 && docNumber) {
      const gstRegex =
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
      const isValid = gstRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (receiverDetails?.consignee_doc_type == 2 && docNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      const isValid = panRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (receiverDetails?.consignee_doc_type == 3 && docNumber) {
      const passportRegex = /^[A-PR-WY-Z][1-9]\\d\\s?\\d{4}[1-9]$/;

      const isValid = passportRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (receiverDetails?.consignee_doc_type == 4 && docNumber) {
      const aadhaarRegex = /^\d{12}$/;

      const isValid = aadhaarRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else if (
      (receiverDetails?.consignee_doc_type == 5 ||
        receiverDetails?.consignee_doc_type == 6 ||
        receiverDetails?.consignee_doc_type == 7) &&
      docNumber
    ) {
      setDocCheck(true);
      return;
    } else if (receiverDetails?.consignee_doc_type == 8 && docNumber) {
      const tanRegex = /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/;
      const isValid = tanRegex.test(docNumber);
      isValid ? setDocCheck(true) : setDocCheck(false);
      return;
    } else {
      setDocCheck(null);
      return;
    }
  };

  const handleClick = () => {
    if (!receiverDetails?.consignee_mobile_number) {
      showAlert("Mobile number is required", "warning");
      return;
    }
    const mobile = receiverDetails.consignee_mobile_number;
    const isSequential = mobile.split("").every((d: string, i: number, arr: string[]) => i === 0 || (parseInt(arr[i - 1]) + 1) % 10 === parseInt(d));
    if (isSequential) {
      showAlert("Please enter a valid mobile number", "warning");
      return;
    }
    if (booking?.shipment_type == 8) {
      const requiredKeysForType8 = [
        "consignee_mobile_number",
        "consignee_email_id",
        "consignee_company_name",
        "consignee_first_name",
      ];

      for (const key of requiredKeysForType8) {
        if (!receiverDetails[key] || receiverDetails[key].trim() === "") {
          showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
          return;
        }
      }
    }

    for (const key in receiverDetails) {
      if (
        key == "consignee_mobile_number" ||
        key == "consignee_email_id" ||
        key == "consignee_company_name" ||
        key == "consignee_first_name" ||
        key == "consignee_address_1" ||
        key == "consignee_address_2" ||
        key == "consignee_pincode" ||
        key == "consignee_city" ||
        key == "consignee_state" ||
        key == "consignee_reference_no" ||
        key == "booking_invoice_number" ||
        key == "booking_invoice_date" ||
        key == "consignee_gst_number" ||
        key == "consignee_tax_payment" ||
        key == "consignee_gst_applicable"
      ) {
        continue;
      }
      if (receiverDetails.hasOwnProperty(key) && receiverDetails[key] === "") {
        if (key == "fair_id") {
          showAlert(`fair name is required`, "warning");
          return;
        }
        showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
        return;
      }
    }
    setJobData((prev) => ({
      ...prev,
      consignee_details: {
        ...receiverDetails,
        commercialData: {},
        consignee_contact_verified: contactEdit,
      },
    }));
    onClose();
  };
  useEffect(() => {
    setReceiverDetails({
      consignee_mobile_number:
        booking?.consignee_details?.consignee_mobile_number || "",
      consignee_email_id: booking?.consignee_details?.consignee_email_id || "",
      consignee_first_name:
        booking?.consignee_details?.consignee_first_name || "",
      consignee_company_name:
        booking?.consignee_details?.consignee_company_name || "",
      consignee_address_1:
        booking?.consignee_details?.consignee_address_1 || "",
      consignee_address_2:
        booking?.consignee_details?.consignee_address_2 || "",
      consignee_pincode: isEdit
        ? booking?.dest_zip
        : booking?.consignee_details?.consignee_pincode ||
          enquiryData?.dest_zip ||
          "",
      consignee_city: isEdit
        ? booking?.dest_city
        : booking?.consignee_details?.consignee_city ||
          enquiryData?.dest_city ||
          "",
      consignee_state:
        booking?.consignee_details?.consignee_state ||
        (isEdit ? booking?.dest_state_code : enquiryData?.dest_state_code) ||
        "",
      consignee_country: isEdit
        ? countryData?.find(
            (ele: any) =>
              ele?.country_id ==
              (booking?.dest_country_id || enquiryData?.dest_country_id || 97),
          )?.country_name
        : booking?.consignee_details?.consignee_country || "INDIA",
      consignee_reference_no:
        booking?.consignee_details?.consignee_reference_no || "",
      booking_invoice_number:
        booking?.consignee_details?.booking_invoice_number || "",
      booking_invoice_date:
        booking?.consignee_details?.booking_invoice_date ||
        getCurrentDate() ||
        "",
      ...(booking?.shipment_type == 8 || booking?.consignee_details?.fair_venue
        ? {
            fair_id: booking?.consignee_details?.fair_hall
              ? booking?.consignee_details?.fair_id
              : booking?.fair_data?.fair_id || "",
            fair_hall: booking?.consignee_details?.fair_hall
              ? booking?.consignee_details?.fair_hall
              : "",
            fair_booth: booking?.consignee_details?.fair_booth
              ? booking?.consignee_details?.fair_booth
              : "",
            fair_venue: booking?.consignee_details?.fair_hall
              ? booking?.consignee_details?.fair_venue
              : booking?.fair_data?.fair_venue || "",
            mode: booking?.fair_data?.mode || "",
          }
        : {}),
      consignee_doc_type: booking?.consignee_details?.consignee_doc_type || "1",
      consignee_gst_number:
        booking?.consignee_details?.consignee_gst_number || "N.A.",
      consignee_gst_applicable:
        booking?.consignee_details?.consignee_gst_applicable || "",
      consignee_tax_payment:
        booking?.consignee_details?.consignee_tax_payment || "",
      kyc_details: booking?.consignee_details?.kyc_details || "",
      ...(enquiryData?.import_booking == "2" && enquiryData?.import_booking_type == "2"
        ? {
          broker_address_1: booking?.consignee_details?.broker_address_1 || "",
          broker_address_2: booking?.consignee_details?.broker_address_2 || "",
          broker_city: booking?.consignee_details?.broker_city || "",
          broker_state: booking?.consignee_details?.broker_state || "",
          broker_pincode: booking?.consignee_details?.broker_pincode || "",
          broker_country_code: booking?.consignee_details?.broker_country_code || "IN",
          broker_name: booking?.consignee_details?.broker_name || "",
          broker_email: booking?.consignee_details?.broker_email || "",
          broker_phone_extension: booking?.consignee_details?.broker_phone_extension || "+91",
          broker_phone: booking?.consignee_details?.broker_phone || "",
          broker_company_name: booking?.consignee_details?.broker_company_name || "",
        } : {})
    });

    setReceiverDetails((prev) => ({
      ...prev,
      consignee_pincode: booking?.consignee_details?.consignee_pincode || booking?.dest_zip || enquiryData?.dest_zip || "0000",
      consignee_city: booking?.consignee_details?.consignee_city || booking?.dest_city || enquiryData?.dest_city || "",
      consignee_state: booking?.consignee_details?.consignee_state || booking?.dest_state_code || enquiryData?.dest_state_code || "",
    }));

    commongetrequest("admin/fair_exhibition/fair_list").then((res: any) => {
      const updatedFormat =
        res?.data?.data?.filter((item: any) => item?.is_active == 1) || [];
      setSelecteddata2(() => ({
        id: booking?.consignee_details?.fair_hall
          ? booking?.consignee_details?.fair_id
          : booking?.fair_data?.fair_id || "",
        fair_name:
          updatedFormat?.find(
            (fair: any) =>
              fair?.id ==
              (booking?.consignee_details?.fair_hall
                ? booking?.consignee_details?.fair_id
                : booking?.fair_data?.fair_id),
          )?.fair_name || "",
      }));
    });

    commongetrequest("booking/document-type").then((res) => {
      setConsigneeDocTypes(res?.data?.data || []);
    });

    commongetrequest("booking/gst-applicable").then((res) => {
      setGstApplicable(res?.data?.data);
    });

    commongetrequest("booking/tax-payment").then((res) => {
      setTaxPaymentOption(res?.data?.data);
    });

    if (!booking?.consignee_details?.consignee_reference_no) {
      commongetrequest("booking/getRefrenceNumber").then((res) => {
        setReceiverDetails((prev) => ({
          ...prev,
          consignee_reference_no: res?.data?.data || "",
        }));
      });
    }

    setContactEdit(!!booking?.consignee_details?.consignee_contact_verified);
  }, [booking]);

  const fun2 = (a: any) => {
    setReceiverDetails((prev) => ({
      ...prev,
      fair_id: a?.id || "",
    }));
    setSelecteddata2({ id: a?.id || "", fair_name: a?.fair_name || "" });
  };
  const funtoempty2 = (a: any) => {
    setReceiverDetails((prev) => ({
      ...prev,
      fair_id: "",
    }));
    setSelecteddata2({ id: "", fair_name: "" });
  };
  return (
    <Dialog staticBackdrop open={open} size={"lg"} onClose={onClose}>
      <Dialog.Panel className={"mt-16"}>
        <Dialog.Title className="flex justify-between">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            <h2 className="mr-auto text-base font-medium whitespace-nowrap">
              Receiver Details
            </h2>

            {receiverDetails?.kyc_details?.document_path_1 &&
            receiverDetails?.kyc_details?.document_path_2 ? (
              <>
                {receiverDetails?.kyc_details?.document_path_1 && (
                  <Button
                    className="text-white bg-mustard p-[2px] md:p-2"
                    size="sm"
                    onClick={() =>
                      downloadAttachment(
                        receiverDetails?.kyc_details?.document_path_1,
                        "document_1",
                      )
                    }
                  >
                    KYC Document 1
                  </Button>
                )}

                {receiverDetails?.kyc_details?.document_path_2 && (
                  <Button
                    className="text-white bg-mustard p-[2px] md:p-2"
                    size="sm"
                    onClick={() =>
                      downloadAttachment(
                        receiverDetails?.kyc_details?.document_path_2,
                        "document_2",
                      )
                    }
                  >
                    KYC Document 2
                  </Button>
                )}
                {isEdit && (
                  <Button
                    className="text-white bg-blue-500 p-[2px] md:p-2"
                    size="sm"
                    onClick={() => {
                      setKycModalPreview(true);
                    }}
                  >
                    <Lucide icon="Edit" className="w-4 h-4 mx-1 stroke-2.5" />
                    Edit KYC
                  </Button>
                )}
              </>
            ) : (
              <Button
                className="text-white bg-blue-500 "
                size="sm"
                onClick={() => {
                  setKycModalPreview(true);
                }}
              >
                <Lucide icon="Upload" className="w-4 h-4 mr-2 stroke-2.5" />
                UPLOAD KYC
              </Button>
            )}

            <KycModal
              open={kycModalPreview}
              setSenderDetails={setReceiverDetails}
              // setBooking={setJobData}
              onClose={() => setKycModalPreview(false)}
              booking={booking}
            />
          </div>
          <Lucide
            icon="XCircle"
            className="w-5 h-5 cursor-pointer"
            onClick={onClose}
          />
        </Dialog.Title>
        <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3 overflow-y-auto h-[65vh]">
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-1">
              MOBILE NO <span className="text-red-500">*</span>
            </FormLabel>
            <InputGroup>
              <FormInput
                id="modal-form-1"
                type="text"
                maxLength={15}
                disabled={contactEdit || !isEdit}
                value={receiverDetails?.consignee_mobile_number}
                onChange={(e) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    consignee_mobile_number: e.target.value.replace(
                      /[^0-9.]/g,
                      "",
                    ),
                  }))
                }
              />
              {isEdit &&
                (contactEdit ? (
                  <InputGroup.Text
                    id="input-group-price"
                    className="bg-red-500 text-white  cursor-pointer border-red-500 rounded-r-xl"
                    onClick={handleDataReset}
                  >
                    RESET
                  </InputGroup.Text>
                ) : (
                  <InputGroup.Text
                    id="input-group-price"
                    className="bg-blue-500 text-white  cursor-pointer border-blue-500 rounded-r-xl flex "
                    onClick={getConsigneeData}
                  >
                    CHECK
                    {spinner && (
                      <LoadingIcon
                        icon="puff"
                        color="white"
                        className="w-5 h-5 ml-2 stroke-2.5 text-white "
                      />
                    )}
                  </InputGroup.Text>
                ))}
            </InputGroup>
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-2">
              EMAIL{" "}
              {booking?.shipment_type == "8" ? (
                <span className="text-red-500">*</span>
              ) : null}
            </FormLabel>
            <FormInput
              id="modal-form-2"
              type="email"
              value={receiverDetails?.consignee_email_id}
              disabled={!isEdit}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_email_id: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-3">
              FULL NAME{" "}
              {booking?.shipment_type == "8" ? (
                <span className="text-red-500">*</span>
              ) : null}
            </FormLabel>
            <FormInput
              id="modal-form-3"
              type="text"
              value={receiverDetails?.consignee_first_name}
              disabled={!isEdit}
              maxLength={50}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_first_name: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-4">
              COMPANY NAME{" "}
              {booking?.shipment_type == "8" ? (
                <span className="text-red-500">*</span>
              ) : null}
            </FormLabel>
            <FormInput
              id="modal-form-4"
              type="text"
              value={receiverDetails?.consignee_company_name}
              disabled={!isEdit}
              maxLength={50}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_company_name: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-5">FLAT/HOUSE NO.</FormLabel>
            <FormInput
              id="modal-form-5"
              type="text"
              placeholder=""
              value={receiverDetails?.consignee_address_1}
              disabled={!isEdit}
              maxLength={50}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_address_1: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-6">STREET/LOCALITY</FormLabel>
            <FormInput
              id="modal-form-6"
              type="text"
              placeholder=""
              value={receiverDetails?.consignee_address_2}
              disabled={!isEdit}
              maxLength={50}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_address_2: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-7">PINCODE</FormLabel>
            <FormInput
              id="modal-form-7"
              type="text"
              value={receiverDetails?.consignee_pincode}
              disabled={!isEdit}
              onChange={(e: any) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_pincode: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-8">CITY</FormLabel>
            <FormInput
              id="modal-form-8"
              type="text"
              value={receiverDetails?.consignee_city}
              disabled={!isEdit}
              onChange={(e: any) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_city: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-9">STATE CODE</FormLabel>
            <FormInput
              id="modal-form-9"
              type="text"
              value={receiverDetails?.consignee_state}
              disabled={!isEdit}
              onChange={(e: any) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_state: e.target.value,
                }))
              }
            />
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-10">
              COUNTRY <span className="text-red-500">*</span>
            </FormLabel>

            <TomSelect
              id="modal-form-10"
              className={`w-[100%] `}
              disabled
              value={receiverDetails?.consignee_country || "INDIA"}
              options={{
                placeholder: "Select Country Name",
              }}
            >
              {countryData?.length &&
                countryData?.map(
                  (data: any, index: any) =>
                    data?.is_active == 1 && (
                      <option value={data?.country_name} key={index}>
                        {data?.country_name}
                      </option>
                    ),
                )}
            </TomSelect>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-11">REFERENCE NUMBER</FormLabel>

            <InputGroup>
              <FormInput
                id="modal-form-11"
                type="text"
                value={receiverDetails?.consignee_reference_no}
                disabled={!isEdit}
                onChange={(e) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    consignee_reference_no: e.target.value,
                  }))
                }
              />
              {/* <InputGroup.Text
                id="input-group-price"
                className="py-2 px-3 w-14"
              >
                {receiverDetails?.consignee_reference_no &&
                  uniqueReferenceNo == true && (
                    <Lucide
                      icon="Check"
                      className="text-green-500 stroke-2.5  h-5"
                    />
                  )}
                {receiverDetails?.consignee_reference_no &&
                  uniqueReferenceNo == false && (
                    <Lucide icon="X" className="text-red-500 stroke-2.5  h-5" />
                  )}
              </InputGroup.Text> */}
            </InputGroup>
          </div>

          {booking?.shipment_type == "8" ||
          (!isEdit && booking?.consignee_details?.fair_venue) ? (
            <>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="fair_name">
                  FAIR NAME <span className="text-red-500">*</span>
                </FormLabel>
                <CommonSearchableAll
                  apiEndpoint="admin/fair_exhibition/fair_list"
                  zIndex="20"
                  selecteddata={selecteddata2}
                  setSelecteddata={setSelecteddata2}
                  fun1={fun2}
                  funtoempty={funtoempty2}
                  key1={"fair_name"}
                  comingselectedname={"fair_name"}
                  comingselectedid={"id"}
                  id={receiverDetails?.fair_id}
                  isdisabled={!isEdit}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-24">
                  FAIR HALL NO <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-24"
                  type="text"
                  placeholder=""
                  disabled={!isEdit}
                  value={receiverDetails?.fair_hall}
                  onChange={(e) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      fair_hall: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-25">
                  FAIR BOOTH NO <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-25"
                  type="text"
                  placeholder=""
                  disabled={!isEdit}
                  value={receiverDetails?.fair_booth}
                  onChange={(e) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      fair_booth: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <FormLabel htmlFor="modal-form-26">
                  FAIR VENUE <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  id="modal-form-26"
                  type="text"
                  placeholder=""
                  disabled={!isEdit}
                  value={receiverDetails?.fair_venue}
                  onChange={(e) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      fair_venue: e.target.value,
                    }))
                  }
                />
              </div>
            </>
          ) : null}

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-6">DOCUMENT TYPE</FormLabel>
            <FormSelect
              id="modal-form-6"
              disabled={!isEdit}
              value={receiverDetails?.consignee_doc_type}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_doc_type: e.target.value,
                }))
              }
            >
              <option value="0">Select Document Type</option>
              {consigneeDocTypes &&
                consigneeDocTypes?.map((elem, index) => (
                  <option value={elem?.id} key={index}>
                    {elem?.value}
                  </option>
                ))}
            </FormSelect>
          </div>
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-5">
              {(consigneeDocTypes &&
                consigneeDocTypes?.find(
                  (elem: any) => elem.id == receiverDetails?.consignee_doc_type,
                )?.value) ||
                "Please select a document type"}
            </FormLabel>

            <InputGroup>
              <FormInput
                type="text"
                disabled={!isEdit}
                value={receiverDetails?.consignee_gst_number}
                maxLength={
                  receiverDetails?.consignee_doc_type == "1"
                    ? 15
                    : receiverDetails?.consignee_doc_type == "2"
                      ? 10
                      : receiverDetails?.consignee_doc_type == "3"
                        ? 9
                        : receiverDetails?.consignee_doc_type == "4"
                          ? 12
                          : receiverDetails?.consignee_doc_type == "8"
                            ? 10
                            : undefined
                }
                onChange={(e) =>
                  setReceiverDetails((prev: any) => ({
                    ...prev,
                    consignee_gst_number: e.target.value,
                  }))
                }
                onBlur={(e) => handleValidate(e.target.value)}
                className="uppercase"
              />
              <InputGroup.Text
                id="input-group-price"
                className="py-2 px-3 w-14"
              >
                {" "}
                {receiverDetails?.consignee_gst_number && docCheck == true && (
                  <Lucide
                    icon="Check"
                    className="text-green-500 stroke-2.5  h-5"
                  />
                )}
                {receiverDetails?.consignee_gst_number && docCheck == false && (
                  <Lucide icon="X" className="text-red-500 stroke-2.5  h-5" />
                )}
              </InputGroup.Text>
            </InputGroup>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-21">INVOICE NUMBER</FormLabel>
            <FormInput
              id="modal-form-21"
              type="text"
              placeholder=""
              disabled={!isEdit}
              value={receiverDetails?.booking_invoice_number}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  booking_invoice_number: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-22">INVOICE DATE</FormLabel>
            <FormInput
              id="modal-form-22"
              type="date"
              placeholder=""
              disabled={!isEdit}
              value={receiverDetails?.booking_invoice_date}
              //   max={getCurrentDate()}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  booking_invoice_date: e.target.value,
                }))
              }
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-6">
              GST APPLICABLE ON INVOICE{" "}
            </FormLabel>
            <FormSelect
              id="modal-form-6"
              value={receiverDetails?.consignee_gst_applicable}
              disabled={!isEdit}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consignee_gst_applicable: e.target.value,
                }))
              }
            >
              <option value="0"> Select</option>
              {gstApplicable &&
                gstApplicable.map((elem, index) => (
                  <option value={elem?.id} key={index}>
                    {elem?.value}
                  </option>
                ))}
            </FormSelect>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="modal-form-6">TAX PAYMENT OPTION</FormLabel>
            <FormSelect
              id="modal-form-6"
              value={receiverDetails?.consigner_tax_payment}
              disabled={!isEdit}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  consigner_tax_payment: e.target.value,
                }))
              }
            >
              <option value="0"> Select</option>
              {taxPaymentOption &&
                taxPaymentOption.map((elem, index) => (
                  <option value={elem?.id} key={index}>
                    {elem?.value}
                  </option>
                ))}
            </FormSelect>
          </div>

          {enquiryData?.import_booking == "2" && enquiryData?.import_booking_type == "2" ? (<>
            <div className="col-span-12 font-bold text-mustard underline underline-offset-2">
              BROKER DETAILS
            </div>

            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_address_1">
                BROKER ADDRESS 1<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                id="broker_address_1"
                value={receiverDetails?.broker_address_1}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_address_1: e.target.value,
                  }))
                }
              />
            </div>
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_address_2">
                BROKER ADDRESS 2<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                id="broker_address_2"
                value={receiverDetails?.broker_address_2}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_address_2: e.target.value,
                  }))
                }
              />
            </div>
            {/* BROKER CITY */}
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_city">
                BROKER CITY<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                id="broker_city"
                value={receiverDetails?.broker_city}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_city: e.target.value,
                  }))
                }
              />
            </div>

            {/* BROKER STATE */}
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_state">
                BROKER STATE<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                id="broker_state"
                value={receiverDetails?.broker_state}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_state: e.target.value,
                  }))
                }
              />
            </div>

            {/* BROKER PINCODE */}
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_pincode">
                BROKER PINCODE<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                id="broker_pincode"
                value={receiverDetails?.broker_pincode}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_pincode: e.target.value,
                  }))
                }
              />
            </div>

            {/* BROKER COUNTRY CODE */}
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_country_code">
                BROKER COUNTRY CODE<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                id="broker_country_code"
                value={receiverDetails?.broker_country_code}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_country_code: e.target.value,
                  }))
                }
              />
            </div>

            {/* BROKER NAME */}
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_name">
                BROKER NAME<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                id="broker_name"
                value={receiverDetails?.broker_name}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_name: e.target.value,
                  }))
                }
              />
            </div>

            {/* BROKER EMAIL */}
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_email">
                BROKER EMAIL<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="email"
                id="broker_email"
                value={receiverDetails?.broker_email}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_email: e.target.value,
                  }))
                }
              />
            </div>

            {/* BROKER PHONE WITH EXTENSION */}
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_phone">
                BROKER PHONE
                <span className="text-red-500">*</span>
              </FormLabel>

              <InputGroup>
                {/* EXTENSION DROPDOWN */}
                <FormSelect
                  id="broker_phone_extension"
                  value={receiverDetails?.broker_phone_extension}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_phone_extension: e.target.value,
                    }))
                  }
                  className="w-1/3 rounded-none rounded-l"
                >
                  <option value="">Select</option>
                  {countryData?.length &&
                    countryData?.map(
                      (data, index) =>
                        data?.is_active == 1 && (
                          <option value={`+${data?.isd_code}`} key={index}>
                            +{data?.isd_code}
                          </option>
                        )
                    )}
                </FormSelect>

                {/* PHONE NUMBER INPUT */}
                <FormInput
                  type="text"
                  placeholder="Phone Number"
                  id="broker_phone"
                  maxLength={15}
                  onKeyDown={(e) => onlyNumbers(e)}
                  aria-label="Phone Number"
                  value={receiverDetails?.broker_phone}
                  onChange={(e: any) =>
                    setReceiverDetails((prev) => ({
                      ...prev,
                      broker_phone: e.target.value,
                    }))
                  }
                  className="w-2/3"
                />
              </InputGroup>
            </div>


            {/* BROKER COMPANY NAME */}
            <div className="col-span-12 sm:col-span-6">
              <FormLabel htmlFor="broker_company_name">
                BROKER COMPANY NAME<span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="text"
                id="broker_company_name"
                value={receiverDetails?.broker_company_name}
                onChange={(e: any) =>
                  setReceiverDetails((prev) => ({
                    ...prev,
                    broker_company_name: e.target.value,
                  }))
                }
              />
            </div>
          </>) : null}
        </Dialog.Description>
        <Dialog.Footer>
          {isEdit && (
            <Button
              type="button"
              className="text-white bg-mustard border-none"
              size="sm"
              onClick={handleClick}
            >
              SAVE
            </Button>
          )}
        </Dialog.Footer>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ReceiverDetails;