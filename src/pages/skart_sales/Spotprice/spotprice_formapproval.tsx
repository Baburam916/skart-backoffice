import React, { useEffect, useState } from "react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import {
 commongetrequest,
  commonpostrequest,  
} from "../../../AllServices/services";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { ArrowLeft } from "lucide-react";
import "../../../components/Table/index.css";
import LoadingIcon from "../../../base-components/LoadingIcon";

const limitToThreeDecimals = (value: string): string => {
  const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const dotIdx = v.indexOf(".");
  if (dotIdx !== -1 && v.length - dotIdx - 1 > 3) {
    return v.slice(0, dotIdx + 4);
  }
  return v;
};

const onKeyDownDecimal = (e: any) => {
  const val = e.target.value;
  const dot = val.indexOf(".");
  if (dot !== -1 && /^[0-9]$/.test(e.key) && e.target.selectionStart === e.target.selectionEnd && e.target.selectionStart > dot && val.length - dot - 1 >= 3) {
    e.preventDefault();
  }
};

const Spot_pricing_approval_form = (data: any) => {
  const { pickDataforForm } = data;
  const { showAlert } = useAlert();
  const [getShipment, setgetShipment] = useState<Array<any>>([]);
  const [country, setCountry] = useState<Array<any>>([]);
  const [approvalTypedata, setApprovalTypedata] = useState<Array<any>>([]);
  const [approvedSelect, setApprovedSelect] = useState<any>(null);
  const [spinner, setSpinner] = useState<boolean>(false);

  const today = new Date().toISOString().split("T")[0];
  const currentDate: any = new Date();

  const submitForm = async () => {
    setSpinner(true);
    const response: any = await commonpostrequest(`hub/spot_pricing`,pickDataforForm);
    try {
      if (response?.status == 200) {
        showAlert(response?.data?.message);
        data.getspotlistdata();
        data.setShowForm(true);
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
      if (response.response.status == 406)
        showAlert(response.response.data.errors[0].msg, "warning");
      else showAlert(response.response.data.message, "error");
    } finally {
      setSpinner(false);
    }
  };

  const getShipmentdata = async () => {
    const response: any = await commongetrequest('admin/booking-shipment-type');
    try {
      if (response?.status == 200) {
        setgetShipment(response?.data?.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const getCountrydata = async () => {
    const response: any = await commongetrequest('admin/country');
    try {
      if (response?.status == 200) {
        setCountry(response?.data?.data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const approvalType = async () => {
    const response: any = await commongetrequest("/hub/spot_pricing/approval_type_list");
    try {
      if (response?.status == 200) {
        setApprovalTypedata(response?.data?.data);
      }else{
        setApprovalTypedata([])
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
  };

  useEffect(() => {
    getShipmentdata();
    getCountrydata();
    approvalType();
    data.formChangeBtn
      ? data.setPickDataforForm((prev: any) => ({
          ...prev,
        }))
      : "";
  }, []);

  return (
    <>
      <div
        style={{ maxHeight: "80vh" }}
        className="sm:flex sm:justify-between gap-4 tbl-overflow-x-auto"
      >
        <div
          style={{ height: "fit-content" }}
          className="sm:mx-auto mt-4 px-6 py-3 bg-white rounded-lg shadow-lg sm:w-1/2"
        >
          <div className=" flex mb-4">
            <div
              className="p-2 cursor-pointer rounded-full shadow-lg mr-4"
              onClick={() => {
                data.setShowForm(true);
                data.setPickDataforForm({});
                data.setFormChangeBtn(false);
              }}
            >
              <ArrowLeft className="w-5 h-4" />
            </div>

            <h1 className="font-bold text-lg">Serviceability</h1>
          </div>
          <hr />
          <div className="mt-2 mb-2">
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
              {data.formChangeBtn ? (
                <option value="6">Change Weight</option>
              ) : (
                <>
                  <option value="0">Select Approval Type</option>
                  {approvalTypedata?.map((item: any) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </>
              )}
            </FormSelect>
            {pickDataforForm.booking_status == 0 && (
              <span className="text-red-500 text-[12px]">
                Please select Approval type
              </span>
            )}
            {/* {pickDataforForm.booking_status == 0 && setErr()} */}
          </div>
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
                  )
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
              aria-label="Select approval type"
            >
              <option value="">Select Country</option>
              {country?.map(
                (item, index) =>
                  item?.is_active == 1 && (
                    <option value={item.country_id}>{item.country_name}</option>
                  )
              )}
            </FormSelect>
          </div>
          <div className="mb-2">
            <FormLabel>Destination Pincode</FormLabel>
            <span className="text-red-500 ml-2">*</span>
            <FormInput
              disabled
              value={pickDataforForm.dest_zip}
              name="address"
            />
          </div>
          <div className="mb-2">
            <FormLabel>Destination City</FormLabel>
            <span className="text-red-500 ml-2">*</span>
            <FormInput disabled value={pickDataforForm.dest_city} />
          </div>
        </div>
        <div
          style={{ height: "fit-content" }}
          className="sm:mx-auto mt-4 px-6 py-3 bg-white rounded-lg shadow-lg sm:w-1/2"
        >
          <h1 className="mb-2 text-center font-bold text-medium">
            Shipment Details
          </h1>
          <hr />
          <div className="mt-2 mb-2">
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
              {getShipment.map((item: any) => (
                <option value={item.booking_shipment_type_id}>
                  {item.shipment_type}
                </option>
              ))}
            </FormSelect>
          </div>
          <div className="mb-2">
            <FormLabel>Weight</FormLabel>
            <span className="text-red-500 ml-2">*</span>
            <div className="flex gap-4">
              <FormInput
                disabled
                name="address"
                value={pickDataforForm.weight}
                onChange={(e) =>
                  data.setPickDataforForm((prev: any) => ({
                    ...prev,
                    weight: e.target.value,
                  }))
                }
                className="w-4/5"
              />
              <FormSelect
                name="state"
                disabled
                aria-label="Select shipment type"
                className="w-1/5"
              >
                <option value="">kgs</option>
              </FormSelect>
            </div>
          </div>
          <div className="mb-2">
            <div className="flex gap-2">
              <div className="w-1/2">
                <FormLabel>Quoted by</FormLabel>
                <span className="text-red-500 ml-2">*</span>
                <FormInput
                  disabled
                  value={pickDataforForm.quoted_by}
                  name="address"
                />
              </div>
              <div className="w-1/2">
                <FormLabel>Vendor</FormLabel>
                <span className="text-red-500 ml-2">*</span>
                <br />
                <FormSelect
                  value={pickDataforForm.courier_id}
                  onChange={(e) =>
                    data.setPickDataforForm((prev: any) => ({
                      ...prev,
                      courier_id: e.target.value,
                    }))
                  }
                  disabled={
                    approvedSelect == 1 ||
                    (approvedSelect == 2 ? true : false) ||
                    pickDataforForm?.booking_status == 4
                  }
                  name="state"
                  aria-label="Select shipment type"
                >
                  <option value={pickDataforForm.shipment_type}>
                    Select Vendor
                  </option>
                  {data?.vendorData?.map((item: any) => (
                    <option value={item.product_id}>{item.product_name}</option>
                  ))}
                </FormSelect>
              </div>
            </div>
          </div>
          <div className="mt-2 mb-2">
            <div className="col-span-12 sm:col-span-6 flex item-center gap-10">
              <FormLabel
                htmlFor="modal-form-5"
                className="mt-2 flex gap-2 whitespace-nowrap"
              >
                {" "}
                Price type <span className="text-red-400">*</span>
              </FormLabel>
              <div className="flex flex-col sm:flex-row gap-10">
                <FormCheck>
                  <FormCheck.Input
                    id="radio-switch-4"
                    disabled={
                      (approvedSelect == 3 ? false : true) ||
                      pickDataforForm?.booking_status != 4
                    }
                    type="radio"
                    name="price_type_radio_button"
                    defaultChecked={pickDataforForm?.price_type == 1}
                  />
                  <FormCheck.Label htmlFor="radio-switch-4">
                    Absolute
                  </FormCheck.Label>
                </FormCheck>
                <FormCheck>
                  <FormCheck.Input
                    id="radio-switch-5"
                    disabled={approvedSelect == 3 ? false : true}
                    type="radio"
                    name="price_type_radio_button"
                    defaultChecked={pickDataforForm?.price_type == 2}
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
          </div>
          <div className="mb-2">
            <div className="flex gap-2">
              {(approvedSelect == 1 ||
                approvedSelect == 3 ||
                pickDataforForm?.booking_status == 4) && (
                <div className="w-1/2">
                  <FormLabel>Spot Price buy</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <FormInput
                    value={limitToThreeDecimals(String(pickDataforForm?.buy_price ?? ""))}
                    onChange={(e) =>
                      data.setPickDataforForm((prev: any) => ({
                        ...prev,
                        buy_price: limitToThreeDecimals(e.target.value),
                      }))
                    }
                    onKeyDown={onKeyDownDecimal}
                    name="address"
                  />
                </div>
              )}
              <div
                className={
                  approvedSelect == 1 || approvedSelect == 3
                    ? "w-1/2"
                    : "w-full"
                }
              >
                <FormLabel>Spot Price sell</FormLabel>
                <span className="text-red-500 ml-2">*</span>
                <FormInput
                  disabled={approvedSelect == 3 ? false : true}
                  value={limitToThreeDecimals(String(pickDataforForm?.spot_price ?? ""))}
                  onChange={(e) =>
                    data.setPickDataforForm((prev: any) => ({
                      ...prev,
                      spot_price: limitToThreeDecimals(e.target.value),
                    }))
                  }
                  onKeyDown={onKeyDownDecimal}
                  name="address"
                />
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex gap-2">
              {(approvedSelect == 1 ||
                approvedSelect == 3 ||
                pickDataforForm?.booking_status == 4) && (
                <div
                  className={
                    approvedSelect == 1 || approvedSelect == 3
                      ? "w-1/2"
                      : "w-full"
                  }
                >
                  <FormLabel>Rate Validity</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <FormInput
                    type="date"
                    value={pickDataforForm?.valid_till}
                    onChange={rateValidity}
                    min={today}
                  />
                </div>
              )}
              <div className="w-1/2">
                <FormLabel>Sell Freight Per kg</FormLabel>
                <span className="text-red-500 ml-2">*</span>
                <FormInput
                  value={pickDataforForm?.freight_price}
                  onChange={(e) =>
                    data.setPickDataforForm((prev: any) => ({
                      ...prev,
                      freight_price: "2000",
                    }))
                  }
                  disabled
                  type="text"
                  name="address"
                />
              </div>
            </div>
          </div>
          {(approvedSelect == 1 ||
            approvedSelect == 3 ||
            pickDataforForm?.booking_status == 4) && (
            <div className="mb-2">
              <div className="flex gap-2">
                <div className="w-1/2">
                  <FormLabel>Weight From</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <FormInput
                    type="text"
                    value={limitToThreeDecimals(String(pickDataforForm?.weight_from ?? ""))}
                    onChange={(e) =>
                      data.setPickDataforForm((prev: any) => ({
                        ...prev,
                        weight_from: limitToThreeDecimals(e.target.value),
                      }))
                    }
                    onKeyDown={onKeyDownDecimal}
                    name="address"
                  />
                </div>
                <div className="w-1/2">
                  <FormLabel>Weight To</FormLabel>
                  <span className="text-red-500 ml-2">*</span>
                  <FormInput
                    type="text"
                    value={limitToThreeDecimals(String(pickDataforForm?.weight_to ?? ""))}
                    name="address"
                    onChange={(e) =>
                      data.setPickDataforForm((prev: any) => ({
                        ...prev,
                        weight_to: limitToThreeDecimals(e.target.value),
                      }))
                    }
                    onKeyDown={onKeyDownDecimal}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mb-2">
            <FormLabel>Remarks</FormLabel>
            <FormTextarea
              name="address"
              className="px-4 py-3  max-h-20 min-h-16"
              autoComplete="off"
              value={pickDataforForm?.approve_remarks}
              onChange={(e) =>
                data.setPickDataforForm((prev: any) => ({
                  ...prev,
                  approve_remarks: e.target.value,
                }))
              }
            ></FormTextarea>
          </div>
          <div className="mt-4">
            <Button
              onClick={() => submitForm()}
              className="bg-mustard border-none py-2 px-4 text-white"
              disabled={
                pickDataforForm.booking_status == 0 ? true : false || spinner
              }
            >
              Submit {spinner && <LoadingIcon icon="puff" className="ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Spot_pricing_approval_form;
