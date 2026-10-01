import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import Lucide from "../../../../base-components/Lucide";
import { useEffect, useState } from "react";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import {
    commongetrequest,
    commonpostrequest,
} from "../../../../AllServices/services";
import {
    FormInput,
    FormLabel,
    FormSelect,
    InputGroup,
} from "../../../../base-components/Form";
import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";

interface SenderDetailsProps {
    open: boolean;
    onClose: () => void;
    isEdit?: boolean;
    booking?: any;
    setJobData?: (updater: any) => void;
    enquiryData: any;
    countryData: any;
}

const initialData = {
    zipcode: "",
    city: "",
    state: "",
};

const SenderDetails: React.FC<SenderDetailsProps> = ({
    open,
    onClose,
    isEdit = false,
    booking,
    setJobData,
    enquiryData,
    countryData,
}) => {
    const { showAlert } = useAlert();
    const [docCheck, setDocCheck] = useState(null);
    const [contactEdit, setContactEdit] = useState(
        !!booking?.shipper_details?.consigner_contact_verified
    );
    const [spinner, setSpinner] = useState(false);
    const [selectedData, setSelectedData] = useState(initialData);
    const [originCountryData, setOriginCountryData] = useState({});
    const [senderDetails, setSenderDetails] = useState({
        consigner_mobile_number:
            booking?.shipper_details?.consigner_mobile_number || "",
        consigner_email_id: booking?.shipper_details?.consigner_email_id || "",
        consigner_first_name: booking?.shipper_details?.consigner_first_name || "",
        consigner_company_name:
            booking?.shipper_details?.consigner_company_name || "",
        consigner_address_1: booking?.shipper_details?.consigner_address_1 || "",
        consigner_address_2: booking?.shipper_details?.consigner_address_2 || "",
        consigner_pincode: booking?.shipper_details?.consigner_pincode || booking?.org_zip || enquiryData?.org_zip || "0000",
        consigner_city: booking?.shipper_details?.consigner_city || booking?.org_city || enquiryData?.org_city || "",
        consigner_state: booking?.shipper_details?.consigner_state || booking?.org_state || enquiryData?.org_state || "",
        pickup_required: 2,
        kyc_details: booking?.shipper_details?.kyc_details || "",
        consigner_doc_type: booking?.shipper_details?.consigner_doc_type || "1",
        consigner_gst_number: booking?.shipper_details?.consigner_gst_number || "N.A.",
    });

    const shipment_value = booking?.shipment_dimensions?.reduce(
        (sum: number, item: any) => sum + (Number(item?.value) || 0),
        0
    );

    const handleDataReset = () => {
        setSenderDetails({
            consigner_mobile_number: "",
            consigner_email_id: "",
            consigner_first_name: "",
            consigner_company_name: "",
            consigner_address_1: "",
            consigner_address_2: "",
            consigner_pincode: booking?.org_zip || "0000",
            consigner_city: booking?.org_city || "",
            consigner_state: booking?.org_state || "",
            consigner_doc_type: "1",
            consigner_gst_number: "N.A.",
            pickup_required: 2,
            kyc_details: "",
        });
        setContactEdit(false);
    };

    const getConsignerData = async () => {
        if (spinner) {
            return;
        }
        if (!senderDetails?.consigner_mobile_number) {
            showAlert("Please enter mobile number", "error");
            return;
        }
        const mobile = senderDetails.consigner_mobile_number;
        const isSequential = mobile.split("").every((d: string, i: number, arr: string[]) => i === 0 || (parseInt(arr[i - 1]) + 1) % 10 === parseInt(d));
        if (isSequential) {
            showAlert("Please enter a valid mobile number", "warning");
            return;
        }
        setSpinner(true);
        try {
            const response: any = await commonpostrequest("book/get_consigner_data", {
                consigner_mobile_number: senderDetails?.consigner_mobile_number,
                import_booking: 2,
            });
            if (response?.data?.status == 200) {
                setContactEdit(true);
                setSenderDetails((prev) => ({ ...prev, ...response?.data?.data }));
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



    const handleClick = () => {
        if (!senderDetails?.consigner_mobile_number) {
            showAlert("Mobile number is required", "warning");
            return;
        }
        const mobile = senderDetails.consigner_mobile_number;
        const isSequential = mobile.split("").every((d: string, i: number, arr: string[]) => i === 0 || (parseInt(arr[i - 1]) + 1) % 10 === parseInt(d));
        if (isSequential) {
            showAlert("Please enter a valid mobile number", "warning");
            return;
        }
        for (const key in senderDetails) {
            if (
                key == "kyc_details" ||
                key == "consigner_mobile_number" ||
                key == "consigner_email_id" ||
                key == "consigner_company_name" ||
                key == "consigner_first_name" ||
                key == "consigner_doc_type" ||
                key == "consigner_gst_number"
            ) {
                continue;
            }
            if (
                senderDetails.hasOwnProperty(key) &&
                (senderDetails[key] == "" || !senderDetails[key])
            ) {
                showAlert(`${key.replaceAll("_", " ")} is required`, "warning");
                return;
            }
        }

        if (
            shipment_value > 2500 && enquiryData?.import_booking == "2" && enquiryData?.courier_name?.toLowerCase?.().includes("fedex") && Number(enquiryData?.currency_id) == 48
        ) {
            if (enquiryData?.origin_country_code == "US" && !senderDetails?.ei_number) {
                showAlert("ei number is required", "warning");
                return;
            }
            if (enquiryData?.origin_country_code == "CA" && !senderDetails?.cad_number) {
                showAlert("cad number is required", "warning");
                return;
            }
        }

        setJobData((prev) => ({
            ...prev,
            shipper_details: { ...senderDetails, consigner_contact_verified: contactEdit },
        }));
        onClose();
    };

    const fun = (a: any) => {
        setSenderDetails((prev: any) => ({
            ...prev,
            consigner_pincode: a?.zipcode || "0000",
            consigner_city: a?.city_area?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
            consigner_state: a?.state_code?.replaceAll(/[^a-zA-Z0-9 ]/g, ""),
        }));
        setSelectedData((pre: any) => ({ ...pre, city_area: a?.city_area }));
    };

    const funtoempty = () => {
        setSenderDetails((prev: any) => ({
            ...prev,
            consigner_pincode: "",
            consigner_city: "",
            consigner_state: "",
        }));
        setSelectedData(initialData);
    };


    useEffect(() => {
        setSelectedData({
            zipcode: booking?.shipper_details?.consigner_pincode || booking?.org_zip || enquiryData?.org_zip || "",
            city: booking?.shipper_details?.consigner_city || booking?.org_city || enquiryData?.org_city || "",
            state: booking?.shipper_details?.consigner_state || booking?.org_state || enquiryData?.org_state || "",
        })
        setSenderDetails({
            consigner_mobile_number:
                booking?.shipper_details?.consigner_mobile_number || "",
            consigner_email_id: booking?.shipper_details?.consigner_email_id || "",
            consigner_first_name:
                booking?.shipper_details?.consigner_first_name || "",
            consigner_company_name:
                booking?.shipper_details?.consigner_company_name || "",
            consigner_address_1: booking?.shipper_details?.consigner_address_1 || "",
            consigner_address_2: booking?.shipper_details?.consigner_address_2 || "",
            consigner_pincode: booking?.shipper_details?.consigner_pincode || booking?.org_zip || enquiryData?.org_zip || "0000",
            consigner_city: booking?.shipper_details?.consigner_city || booking?.org_city || enquiryData?.org_city || "",
            consigner_state: booking?.shipper_details?.consigner_state || booking?.org_state || enquiryData?.org_state || "",
            consigner_doc_type: booking?.shipper_details?.consigner_doc_type || "1",
            consigner_gst_number:
                booking?.shipper_details?.consigner_gst_number || "N.A.",
            pickup_required: 2,
            kyc_details: booking?.shipper_details?.kyc_details || "",
        });
        setContactEdit(!!booking?.shipper_details?.consigner_contact_verified);
    }, [booking]);

    useEffect(() => {
        const org_country_code = countryData?.find((country: any) => country?.country_id == enquiryData?.org_country_id) || {};
        setOriginCountryData(org_country_code);

        if (!isEdit) {
            setSenderDetails(booking);
        }

    }, []);

    return (
        <Dialog staticBackdrop open={open} size={"lg"} onClose={onClose}>
            <Dialog.Panel className={"mt-16"}>
                <Dialog.Title className="flex justify-between">
                    <h2 className="mr-auto text-base font-medium whitespace-nowrap">
                        Sender Details
                    </h2>
                    <Lucide
                        icon="XCircle"
                        className="w-5 h-5 cursor-pointer"
                        onClick={onClose}
                    />
                </Dialog.Title>
                <Dialog.Description className="overflow-y-auto h-[65vh]">
                    <div className="grid grid-cols-12 gap-6 gap-y-3 ">
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-1">MOBILE NO <span className="text-red-500">*</span></FormLabel>
                            <InputGroup>
                                <FormInput
                                    id="modal-form-1"
                                    type="text"
                                    placeholder="Mobile No."
                                    maxLength={10}
                                    value={senderDetails?.consigner_mobile_number}
                                    onChange={(e) =>
                                        setSenderDetails({
                                            ...senderDetails,
                                            consigner_mobile_number: e.target.value.replace(
                                                /[^0-9.]/g,
                                                ""
                                            ),
                                        })
                                    }
                                    disabled={contactEdit || !isEdit}
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
                                            onClick={getConsignerData}
                                        >
                                            CHECK{" "}
                                            {spinner && (
                                                <LoadingIcon
                                                    icon="puff"
                                                    color="white"
                                                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                                />
                                            )}
                                        </InputGroup.Text>
                                    ))}
                            </InputGroup>
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-4">EMAIL</FormLabel>
                            <FormInput
                                id="modal-form-4"
                                type="email"
                                placeholder="Email"
                                value={senderDetails?.consigner_email_id}
                                onChange={(e) =>
                                    setSenderDetails({
                                        ...senderDetails,
                                        consigner_email_id: e.target.value,
                                    })
                                }
                                disabled={!isEdit}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-3">FULL NAME</FormLabel>
                            <FormInput
                                id="modal-form-3"
                                type="text"
                                placeholder="Full Name"
                                value={senderDetails?.consigner_first_name}
                                onChange={(e) =>
                                    setSenderDetails({
                                        ...senderDetails,
                                        consigner_first_name: e.target.value,
                                    })
                                }
                                disabled={!isEdit}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-2">COMPANY NAME</FormLabel>
                            <FormInput
                                id="modal-form-2"
                                type="text"
                                placeholder="Company Name"
                                value={senderDetails?.consigner_company_name}
                                maxLength={50}
                                onChange={(e) =>
                                    setSenderDetails({
                                        ...senderDetails,
                                        consigner_company_name: e.target.value,
                                    })
                                }
                                disabled={!isEdit}
                            />
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-5">
                                FLAT/HOUSE NO. <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormInput
                                id="modal-form-5"
                                type="text"
                                placeholder=""
                                disabled={!isEdit}
                                value={senderDetails?.consigner_address_1}
                                maxLength={50}
                                onChange={(e) =>
                                    setSenderDetails({
                                        ...senderDetails,
                                        consigner_address_1: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-5">
                                STREET/LOCALITY <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormInput
                                id="modal-form-5"
                                type="text"
                                placeholder=""
                                disabled={!isEdit}
                                value={senderDetails?.consigner_address_2}
                                maxLength={50}
                                onChange={(e) =>
                                    setSenderDetails({
                                        ...senderDetails,
                                        consigner_address_2: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-5">
                                PINCODE <span className="text-red-500">*</span>
                            </FormLabel>

                            <CommonSearchableAll
                                apiEndpoint={`admin/international-pincode?country_code=${originCountryData?.country_code ||
                                    ""
                                    }`}
                                placeholder={
                                    "Search Origin Pincode"
                                }
                                selecteddata={selectedData}
                                setSelecteddata={setSelectedData}
                                fun1={fun}
                                key1={"zipcode"}
                                comingselectedname={"zipcode"}
                                comingselectedid={"city"}
                                questionmark={true}
                                addcomingname2={"city_area"}
                                addcomingname3={"state"}
                                funtoempty={funtoempty}
                                zIndex={20}
                                forwhat="zipcode"
                                disabled={!isEdit}
                                openhandedfun={(_forwhat: string, value: string) => {
                                    setSenderDetails((prev: any) => ({
                                        ...prev,
                                        consigner_pincode: value,
                                    }));
                                }}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-5">
                                CITY <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormInput
                                type="text"
                                value={senderDetails?.consigner_city}
                                disabled={!isEdit}
                                onChange={(e) =>
                                    setSenderDetails((prev) => ({
                                        ...prev,
                                        consigner_city: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-5">
                                STATE <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormInput
                                type="text"
                                value={senderDetails?.consigner_state}
                                disabled={!isEdit}
                                onChange={(e) =>
                                    setSenderDetails((prev) => ({
                                        ...prev,
                                        consigner_state: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="modal-form-5">
                                G.S.T Number
                            </FormLabel>

                            <FormInput
                                type="text"
                                value={senderDetails?.consigner_gst_number}
                                disabled={!isEdit}
                                onChange={(e) =>
                                    setSenderDetails((prev) => ({
                                        ...prev,
                                        consigner_gst_number: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {shipment_value > 2500 && enquiryData?.import_booking == "2" && enquiryData?.courier_name?.toLowerCase?.().includes("fedex") && Number(enquiryData?.currency_id) == 48 ? (
                            <>
                                {enquiryData?.origin_country_code == "US" ?
                                    <div className="col-span-12 sm:col-span-6">
                                        <FormLabel htmlFor="ei_number">EI NUMBER{" "}
                                            <span className="text-red-500">*</span>{" "}</FormLabel>
                                        <FormInput
                                            id="ei_number"
                                            type="text"
                                            placeholder="Enter EI NUMBER"
                                            value={senderDetails?.ei_number}
                                            onChange={(e) =>
                                                setSenderDetails((prev) => ({
                                                    ...prev,
                                                    ei_number: e.target.value,
                                                }))
                                            }
                                        />
                                    </div> : null}
                                {enquiryData?.origin_country_code == "CA" ?
                                    <div className="col-span-12 sm:col-span-6">
                                        <FormLabel htmlFor="cad_number">CAD NUMBER{" "}
                                            <span className="text-red-500">*</span>{" "}</FormLabel>
                                        <FormInput
                                            id="cad_number"
                                            type="text"
                                            placeholder="Enter CAD NUMBER"
                                            value={senderDetails?.cad_number}
                                            onChange={(e) =>
                                                setSenderDetails((prev) => ({
                                                    ...prev,
                                                    cad_number: e.target.value,
                                                }))
                                            }
                                        />
                                    </div> : null}
                            </>
                        ) : null}
                    </div>
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

export default SenderDetails;
