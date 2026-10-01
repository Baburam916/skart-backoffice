import React, { useState, useEffect } from "react";
import Table from "../../../../base-components/Table";
import { ChevronDown, Copy, Edit, Plus, Search, XCircle, PlusCircle } from "lucide-react";

import { useAlert } from "../../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import { useNavigate } from "react-router";
import { formatDate } from "../../commoncomponents/commondateformat/datetoreqformat";
import Button from "../../../../base-components/Button";
import Modal from "../../../../components/Modal";
import {
  FormInput,
  FormLabel,
  FormSelect,
} from "../../../../base-components/Form";
import CommonPagination from "../../commoncomponents/JsonToCsv/pagination";
import {
  commongetrequest,
  commonpostrequest,
  commonputrequest,
  universalpost,
} from "../../../../AllServices/services";
import { useDebounce } from "../../commoncomponents/JsonToCsv/useDebounce/useDebounce";
import { foreignFormat, indianFormat, validateEmail } from "../../../../utils";
import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";
import { useLogin } from "../../commoncomponents/LoginContextProvider/LoginContextProvider";
import Nodatafound from "../../commoncomponents/Nodatafound/Nodatafound";
import { jsontocsv } from "../../commoncomponents/JsonToCsv/Jsontocsv";
import { tranfereddata } from "../../../../components/booking_summary_table/TransformKey";
import LoadingButtonCommon from "../../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import { SpotpriceModal } from "../SpotEnquiryModal/SpotEnquiryModal";
import { Trash2 } from "lucide-react";
import CommonemailModal from "../SpotEnquiryModal/emailModal";
import { Menu } from "../../../../base-components/Headless";
import { UserCog } from "lucide-react";
import CommonModal from "../../commoncomponents/CommonModal/CommonModal";
import { ShipmentDimensions } from "../../commoncomponents/ShipmentDimensions/shipmentdimensions";
import SenderDetails from "../../Dashboards/isDashboard/senderDetails";
import ReceiverDetails from "../../Dashboards/isDashboard/receiverDetails";
import Tippy from "../../../../base-components/Tippy";
import { Eye } from "lucide-react";
import IsLoading from "../../commoncomponents/isLoading/isLoading";
const intfranchiseedata = {
  franchisee_name: "",
  franchisee_id: "",
};
const intgetdata = {
  from_date: "",
  to_date: "",
};

const inteditdata = {
  franchisee_id: "",
  franchisee_name: "",
  booking_no: "",
  branch_id: "",
  booking_id: "",
  origin_pincode: "",
  origin_city: "",
  origin_state_code: "",
  destination_country: "",
  destination_country_code: "",
  destination_country_id: "",
  destination_pincode: "",
  state: "",
  city: "",
  startPoint: "",
  shipment_type: "",
  weight: "",
  weight_unit: "",
  quoted_by: "",
  price_type: "",
  spot_price: "",
  cargo_type: "",
  clearence_type: "",
  courier_id: "",
  courier_code: "",
  courier_name: "",
  courier_vendor_code: "",
};
const SpostenquiryList: React.FC = () => {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [chargesdata, setChargesdata] = useState<any>([]);
  const [partyTypeData, setPartyTypeData] = useState<Array<any>>([]);
  const [partyNameData, setPartyNameData] = useState<Array<any>>([]);

  const [enquiryModal, setEnquiryModal] = useState<boolean>(false);
  const [allfdata, setAllfdata] = useState<any>([]);
  const [spotData, setSpotData] = useState([]);
  const [editdata, setEditData] = useState<any>(inteditdata);
  const [pricingStatus, setPricingStatus] = useState<any>("");
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [allfranchiseedata, setAllfranchiseedata] = useState<any>([]);
  const [datatoget, setDatatoget] = useState<any>(intgetdata);
  const [downloadloading, setDownloadloading] = useState<boolean>(false);
  const [hit, setHit] = useState<any>(1);
  const [franchiseId, setFranchiseeId] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [productTypes, setProductTypes] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [open, setOpen] = useState(false);
  const [spotId, setSpotId] = useState(null);
  const currentDate = new Date();
  const [approveSpinner, setApproveSpinner] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState<number>(1);
  const [forwhat, setForwhat] = useState<any>("");
  const [totalpages, setTotalPages] = useState<number>(1);
  const [branchData, setBranchData] = useState<any>([]);
  const [hubdata, setHubdata] = useState<any>([]);
  const [emailModal, setEmailModal] = useState<boolean>(false);
  const [exposureData, setExposureData] = useState<any>([]);
  const [shipmentTypedata, setShipmentTypedata] = useState<any>([]);
  const [tagData, setTagData] = useState<any>({});
  const [mawbPresent, setMawbPresent] = useState<boolean>(false);
  const [tagOpen, setTagOpen] = useState<boolean>(false);
  const [tagSpinner, setTagSpinner] = useState<boolean>(false);
  const [dimensionData, setDimensionData] = useState<any>([{
    item_description: "", weight: "", value: "", quantity: "",
    length: "", breadth: "", height: "", hsn_code: "",
  }]);
  const [emailData, setEmailData] = useState<any>({ to_email: "", cc_email: [] });
  const [ccInput, setCcInput] = useState<string>("");
  const [errors, setErrors] = useState<any>({ to_email: "", cc_email: "" });
  const [importData, setImportData] = useState<any>(null);
  const [openImport, setOpenImport] = useState<boolean>(false);
  const [jobData, setJobData] = useState<any>({});
  const [bookingLoading, setBookingLoading] = useState<any>({ status: false, forWhat: "" });
  const [emailOpen, setEmailOpen] = useState<boolean>(false);
  const [senderOpen, setSenderOpen] = useState<boolean>(false);
  const [receiverOpen, setReceiverOpen] = useState<boolean>(false);
  const [counter, setCounter] = useState<any>(0);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [commoditytype, setCommodityType] = useState<any>([]);
  const [currencydata, setCurrencydata] = useState<any>([]);
  const [incotermType, setIncoterm] = useState<any>([]);
  const [clearanceType, setClearanceType] = useState<any>([]);
  const { userdata, franhiseedata, statusdata } = useLogin();
  const [open1, setOpen1] = useState<boolean>(false);
  const [open2, setOpen2] = useState<boolean>(false);
  const [rowData, setRowData] = useState<any>();
  const [toggle, setToggle] = useState<any>(1);
  const [chargesData, setChargesData] = useState<Array<any>>([]);
  const [tableData, setTableData] = useState<any>();
  const [currencyData, setCurrencyData] = useState<any>([]);

  const handlePagechange = (e: number) => {
    setPage(e);
    setHit(1);
  };

  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setDatatoget((pre: any) => ({ ...pre, [name]: value }));
    // if(name=="from_date"){
    //   setDatatoget((pre:any)=>({...pre,to_date:""}))
    // }
    setPage(1);
    setSpotData([]);
    setHit(3);
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
  const getProductData = async () => {
    try {
      const response: any = await commongetrequest(`admin/courier-product`);
      const shipmenttype = await commongetrequest(
        "admin/booking-shipment-type",
      );

      if (response?.status == 200) {
        setProductTypes(response?.data?.data);
      }
      if (shipmenttype?.status == 200) {
        setShipmentTypedata(shipmenttype?.data?.data || []);
      }
    } catch (err: any) {
      showAlert(err?.message, "error");
    }
  };
  const fun1 = (value: any) => {
    setFranchiseeId(value?.franchisee_id);
  };
  const funtoempty = () => {
    setSelectedfranchisedata(intfranchiseedata);
    setHit(3);
    setFranchiseeId("");
  };

  const getData = async (value: any) => {
    const storedfdata = JSON.parse(localStorage.getItem("franchiseedata"));
    const fids = storedfdata?.map((item: any) => item?.franchisee_id);
    setIsLoading(true);
    setHit(value);
    //  franchiseeId, debouncedSearch.trim(), 20, page - 1;
    const obj: any = {
      from_date: datatoget?.from_date || "",
      to_date: datatoget?.to_date || "",
    };
    if (franchiseId) {
      obj.franchisee_id = [franchiseId];
    }
    if (pricingStatus) {
      obj.booking_status = [pricingStatus];
    }
    if (value == 1 || value == 2) {
      try {
        const response = await commonpostrequest(
          `booking/get_spot_enquiry?sales_id=${userdata?.mapped_id
          }&limit=20&page=${page - 1}${debouncedSearch ? `&key=${debouncedSearch.trim()}` : ""
          }`,
          //  franchiseId?[franchiseId || ""]:fids
          obj,
        );

        if (response?.status == 200) {
          setSpotData(response?.data?.data);
          setTotalPages(Math.ceil(response?.data?.total / 20));
        } else if (response?.status == 204) {
          setSpotData([]);
        } else {
          showAlert("Something went wrong", "error");
        }
      } catch (error) {
        showAlert("Something went wrong", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };
  const getrelateddata = (forwhat: any, data: any, id?: any) => {
    if (forwhat == "franchisee") {
      const singledata = data?.find((item: any) => item.franchisee_id == id);
      return singledata || {};
    }
  };
  const getfiltereddata = (forwhat: string, data: any, id?: any) => {
    if (forwhat == "spot") {
      const newdata = data?.map((item: any) => {
        return {
          customer_name:
            getrelateddata("franchisee", allfranchiseedata, item?.franchisee_id)
              ?.franchisee_name || "",
          enquiry_id: item?.booking_no || "",
          enquiry_date: formatDate(item?.created_date) || "",
          origin: item?.org_city || "",
          destination:
            item?.org_country_id == "97" && item?.dest_country_id == "97"
              ? item?.dest_city
              : countryData?.find(
                (item2: any) => item2.country_id == item?.dest_country_id,
              )?.country_name ||
              item?.dest_city ||
              "N.A.",
          weight:
            Number(item?.weight) || "-" + item?.weight_unit
              ? `(${item.weight_unit})`
              : "",
          vendor:
            productTypes?.find(
              (item2: any) => item2.product_id == item?.courier_id,
            )?.product_name || "",
          shipment_type:
            shipmentTypedata?.find(
              (item2: any) =>
                item2?.booking_shipment_type_id == item?.shipment_type,
            )?.shipment_type || "-",
          quoted_by: item?.quoted_by || "",
          quoted_price:
            indianFormat(item?.spot_price) + item?.price_type == "1"
              ? "(a)"
              : item?.price_type == "2"
                ? "(k)"
                : "",
          rate_valid_till: formatDate(item?.valid_till) || "",

          airwaybill_no: item?.airwaybilno || "",
        };
      });
      return newdata;
    }
    return [];
  };
  const getdownloaddata = async () => {
    const storeddata = JSON.parse(localStorage.getItem("franchiseedata")) || [];
    const fids = storeddata?.map((item: any) => item?.franchisee_id);
    const obj: any = {
      from_date: datatoget?.from_date || "",
      to_date: datatoget?.to_date || "",
    };
    if (franchiseId) {
      obj.franchisee_id = [franchiseId];
    }
    if (pricingStatus) {
      obj.booking_status = [pricingStatus];
    }

    try {
      setDownloadloading(true);

      const response = await commonpostrequest(
        `booking/get_spot_enquiry
     ${debouncedSearch ? `?key=${debouncedSearch.trim()}` : ""}`,

        {
          franchisee_id: franchiseId ? [franchiseId || ""] : fids,
          from_date: datatoget?.from_date || "",
          to_date: datatoget?.to_date || "",
          booking_status: [pricingStatus == "0" ? 0 : Number(pricingStatus)],
        },
      );
      if (response?.status == 200) {
        const data = getfiltereddata("spot", response?.data?.data);

        jsontocsv(tranfereddata(data), "spot_enquiry_list");
      } else if (response?.status == 204) {
        setSpotData([]);
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      setDownloadloading(false);
    }
  };
  const getCountryData = async () => {
    try {
      const res = await commongetrequest("admin/country");
      const res2 = await commongetrequest("admin/franchisee-settings");
      const res3 = await commongetrequest(
        `admin/franchisee-settings?sales_id=${userdata?.mapped_id}`,
      );
      const charges: any = await commongetrequest(
        "admin/charges?type=E&is_cargo=1",
      );
      const hubres = await commongetrequest("admin/hub");
      const res5 = await commongetrequest("admin/hub-pud");
      if (res?.status == 200) {
        setCountryData(res?.data?.data);
      }
      if (res2?.status == 200) {
        setAllfranchiseedata(res2?.data?.data || []);
      }
      if (res3?.status == 200) {
        setAllfdata(res3?.data?.data || []);
      }
      if (charges?.status == 200) {
        setChargesdata(charges?.data?.data || []);
      }
      if (res5?.status == 200) {
        setBranchData(res5?.data?.data || []);
      }
      if (hubres?.status == 200) {
        setHubdata(hubres?.data?.data || []);
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    }
  };

  // Modal title

  // Modal description
  // const ModalDescription2 = (
  //   <>
  //     <div className="col-span-12">
  //       <div className="flex justify-between mt-4">
  //         <button
  //           onClick={addRow}
  //           className="text-green-500 hover:text-green-700"
  //         >
  //           <Button
  //             // disabled={postloading}
  //             variant="success"
  //             className="p-2 text-white mb-2 mr-2 "
  //           >
  //             {" "}
  //             <Plus className="w-4 h-4" />
  //             ADD
  //           </Button>
  //         </button>
  //       </div>
  //       <div className="border border-gray-200 p-2 shadow-lg rounded-lg bg-white  ">
  //         <Table>
  //           {/* Table headers */}
  //           <Table.Thead>
  //             <Table.Tr>
  //               <Table.Th className="px-1 py-1 text-center">
  //                 CHARGE<span className="text-red-600">*</span>
  //               </Table.Th>
  //               <Table.Th className="px-1 py-1 text-left">STATUS</Table.Th>
  //               <Table.Th className="px-1 py-1 text-left">LIMIT</Table.Th>
  //               <Table.Th className="px-1 py-1 text-left ">ABSOLUTE</Table.Th>
  //               <Table.Th className="px-1 py-1 text-left">PER KG</Table.Th>
  //               <Table.Th className="px-1 py-1 text-left">
  //                 MIN CHARGE WT.
  //               </Table.Th>
  //               <Table.Th className="px-1 py-1 text-center">ACTION</Table.Th>
  //             </Table.Tr>
  //           </Table.Thead>

  //           {/* Table body */}
  //           {/* <Table.Tbody>
  //            {girthcharge.map((row: any, index: number) => (
  //              <Table.Tr key={index}>
  //                <Table.Td className="px-1 py-1 w-[20%]">
  //                  {index == 0 ? (
  //                    <TomSelect
  //                      className="border w-full border-gray-300 bg-white rounded-lg z-50"
  //                      value={`${girthcharge[0]?.charge_id}`}
  //                      name="charge_id"
  //                      disabled={index !== 0 || row?.is_edit}
  //                      options={{
  //                        placeholder: "Search Search",
  //                      }}
  //                      onChange={(e: any) => {
  //                        const value = e;

  //                        if (value) {
  //                          handleSelectChange(index, "charge_id", e);
  //                        }
  //                      }}
  //                    >
  //                      <option value={0}>Select Charge</option>
  //                      {chargesdata.map((item: any) => (
  //                        <option
  //                          className="w-full"
  //                          key={item.charge_id}
  //                          value={item?.charge_id}
  //                        >
  //                          {item?.charge_name}
  //                        </option>
  //                      ))}
  //                    </TomSelect>
  //                  ) : (
  //                    <h1 className="text-center">
  //                      {
  //                        chargesdata?.find(
  //                          (item: any, index: number) =>
  //                            item?.charge_id == girthcharge[0]?.charge_id
  //                        )?.charge_name
  //                      }
  //                    </h1>
  //                  )}

  //                </Table.Td>

  //                <Table.Td className="px-1 py-1">
  //                  <FormInput
  //                    type="text"
  //                    value={row?.girth_limit}
  //                    name="girth_limit"
  //                    disabled={!Number(row?.charge_id) || row?.is_edit}
  //                    onChange={(e: any) => {
  //                      handleSelectChange(index, "girth_limit", e.target.value);
  //                    }}
  //                    className="w-full p-2 border border-gray-300  rounded"
  //                  />
  //                </Table.Td>
  //                <Table.Td className="px-1 py-1">
  //                  <FormInput
  //                    type="text"
  //                    disabled={!Number(row?.charge_id) || row?.is_edit}
  //                    onChange={(e: any) => {
  //                      handleSelectChange(index, "absolute", e.target.value);
  //                    }}
  //                    value={row?.absolute}
  //                    className="w-full p-2 border border-gray-300 rounded"
  //                  />
  //                </Table.Td>
  //                <Table.Td className="px-1 py-1">
  //                  <FormInput
  //                    type="text"
  //                    disabled={!Number(row?.charge_id) || row?.is_edit}
  //                    onChange={(e: any) => {
  //                      handleSelectChange(index, "per_kg", e.target.value);
  //                    }}
  //                    value={row?.per_kg}
  //                    className="w-full p-2 border border-gray-300 rounded"
  //                  />
  //                </Table.Td>
  //                <Table.Td className="px-1 py-1">
  //                  <FormInput
  //                    type="text"
  //                    value={row?.min_chrg_wt}
  //                    disabled={!Number(row?.charge_id) || row?.is_edit}
  //                    onChange={(e: any) => {
  //                      handleSelectChange(index, "min_chrg_wt", e.target.value);
  //                    }}
  //                    className="w-full p-2 border border-gray-300  rounded"
  //                  />
  //                </Table.Td>
  //                <Table.Td className="">
  //                  <div className="h-[100%] flex justify-center items-center">
  //                    <Button
  //                      disabled={row?.is_edit}
  //                      onClick={() => removeRow(index)}
  //                      className="text-red-500 hover:text-red-700"
  //                    >
  //                      <Trash2 className="text-red-400" />
  //                    </Button>
  //                  </div>
  //                  <button
  //                   onClick={() => handleInputChange(index)}
  //                   className="text-green-500 hover:text-green-700 ml-2"
  //                 >
  //                   <Pencil />
  //                 </button>
  //                </Table.Td>
  //              </Table.Tr>
  //            ))}
  //          </Table.Tbody> */}
  //         </Table>
  //       </div>
  //     </div>
  //   </>
  // );
  const handleEdit = async (data: any, value: any) => {
    const selectedCountry: any = countryData.find(
      (item: any) =>
        item.country_id ==
        (value == "job" ? data?.destination_country : data?.dest_country_id),
    );

    const booking = {
      ...data,
      franchisee_id: data?.franchisee_id,
      franchisee_name:
        getrelateddata("franchisee", allfdata, data?.franchisee_id)
          ?.franchisee_name || "",
      hub_id:
        getrelateddata("franchisee", allfdata, data?.franchisee_id)?.hub || "",

      booking_no: data?.booking_no || "",
      branch_id:
        value == "job"
          ? getrelateddata("franchisee", allfdata, data?.franchisee_id)
            ?.branch || ""
          : data?.branch_id || "",
      booking_id: data?.id || "",
      origin_pincode: data?.org_zip || "",
      origin_city: data?.org_city || "",
      origin_state_code: data?.org_state_code || "",
      destination_country: selectedCountry?.country_name || "",
      destination_country_code: selectedCountry?.country_code || "",
      destination_country_id:
        value == "job"
          ? data?.destination_country
          : data?.dest_country_id || "",
      destination_pincode:
        value == "job"
          ? selectedCountry?.pincode_avail == 0
            ? "0000"
            : ""
          : data?.dest_zip || "",
      state: data?.dest_state_code || "",
      city: data?.dest_city || "",
      city_available: selectedCountry?.city_avail == 1 ? 1 : 0,
      pincode_available: selectedCountry?.pincode_avail == 1 ? 1 : 0,
      // destination_pincode: selectedCountry?.pincode_avail == 0 ? "0000" : "",
      startPoint: "enquiry",
      shipment_type: value && value == "job" ? 5 : data?.shipment_type,
      weight:
        data?.shipment_dimensions && data?.shipment_dimensions?.length >= 1
          ? Number(getchweight(data?.shipment_dimensions)).toFixed(3)
          : Number(data?.weight).toFixed(3),
      weight_unit: data?.weight_unit || "",
      quoted_by: data?.quoted_by || "",
      price_type: data?.price_type || "",
      spot_price: data?.spot_price || "",
      cargo_type: data?.cargo_type || "",
      clearence_type: data?.clearence_type || "",
      courier_id: data?.courier_id || "",
      courier_code: data?.courier_code || "",
      courier_name: data?.courier_name || "",
      courier_vendor_code: data?.courier_vendor_code || "",
      forwhat: value || "",
      remarks: data?.franchisee_remarks || "",
      ...(data?.shipment_type == 8
        ? {
          fair_id: data?.fair_data?.fair_id,
          fair_venue: data?.fair_data?.fair_venue,
          fair_start_date: data?.fair_data?.fair_start_date,
          fair_end_date: data?.fair_data?.fair_end_date,
          mode: data?.fair_data?.mode || "",
          mode_value: data?.fair_data?.mode_value || "",
          // fair_date: spotData?.fair_date,
        }
        : {}),
    };
    if (data?.shipment_dimensions && data?.shipment_dimensions?.length >= 1) {
      booking.shipment_dimensions = data?.shipment_dimensions;
    }

    if (value == "job") {
      booking.job_id = data?.job_id;

      navigate("/backoffice/sales_operations/spot_price_enquiry", {
        state: { booking },
      });
    } else {
      setEditData(booking);

      setEnquiryModal(true);
    }
  };

  const today = new Date().toISOString().split("T")[0]; // Get today's date
  const handleApprove = async (id: string) => {
    setApproveSpinner(true);
    try {
      const response = await commonpostrequest("booking/update_spot_data", {
        booking_id: id,
        booking_status: 4,
      });
      if (response.status == 200) {
        showAlert(response?.data?.message);
        getData(hit);
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong", "error");
    } finally {
      setApproveSpinner(false);
    }
  };

  const description = (
    <p className="text-center">
      Are you sure you want to approve this spot pricing enquiry ?
    </p>
  );

  const footer = (
    <div className="flex justify-end gap-4">
      <Button
        className="px-4 py-1 rounded-lg bg-green-400 text-white hover:bg-green-500 ml-2"
        onClick={() => {
          handleApprove(spotId);
          setOpen(false);
        }}
      >
        Yes{" "}
        {approveSpinner && (
          <LoadingIcon
            icon="puff"
            color="white"
            className="w-5 h-5 ml-2 stroke-2.5 text-white"
          />
        )}
      </Button>
      <Button
        className="px-4 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 ml-2"
        onClick={() => setOpen(false)}
      >
        No
      </Button>
    </div>
  );
  const funcOpenDoc = (data) => {
    if (data) {
      window.open(data, "_blank", "noopener,noreferrer");
    } else {
      showAlert("This Doc is not available", "warning");
    }
  };

  const funcSetCharges = async (data) => {
    let res;
    if (data?.booking_status == 5) {
      res = await commongetrequest(`booking/booking-buy-sell/${data?.id}`);
    } else {
      res = await commongetrequest(`booking/get-enquiry-buy-sell/${data?.id}`);
    }

    setTableData(res?.data?.data);
  };

  const funcCharges = async () => {
    const response = await commongetrequest(`admin/charges`);
    if (response?.status == 200) {
      setChargesData(response?.data?.data);
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
  };

  const funcCurrency = async () => {
    const response = await commongetrequest(`booking/currency`);
    if (response?.status == 200) {
      setCurrencyData(response?.data?.data);
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
  };

  const funcPartyType = async () => {
    const response = await commongetrequest(`master/customer-type-data_ac/2`);
    if (response?.status == 200) {
      setPartyTypeData(response?.data?.data);
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
  };

  const funcPartyName = async () => {
    const response = await commongetrequest(`admin/franchisee-settings`);
    if (response?.status == 200) {
      setPartyNameData(response?.data?.data);
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
  };

  const description1 = (
    <>
      <div className="min-[767px]:flex justify-between mb-2">
        <div className="flex">
          <Button
            className={`p-2 mt-5 ${toggle == 1 ? "bg-mustard" : "bg-gray-400"
              }  text-white`}
            onClick={() => {
              setToggle(1);
            }}
          >
            {" "}
            Selling Charges
          </Button>

          <Button
            onClick={() => {
              setToggle(2);
              // setHasUpdated(true);
            }}
            className={`p-2 mt-5   ml-2 ${toggle == 2 ? "bg-mustard" : "bg-gray-400"
              }  text-white`}
          >
            {" "}
            Buying Charges{" "}
          </Button>
        </div>
      </div>

      <div className="max-[982px]:overflow-auto">
        {toggle == 1 ? (
          <div className="overflow-auto">
            <Table className="whitespace-nowrap ">
              {/* Table headers */}
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="px-2 py-2 text-center">
                    <div className="flex justify-center items-center">
                      SR.No.
                    </div>
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">CHARGES</Table.Th>
                  <Table.Th className="px-1 py-1 text-center">RATE</Table.Th>
                  <Table.Th className="px-1 py-1 text-center ">
                    RATE TYPE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    WEIGHT UNIT
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    CURRENCY
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    INR AMOUNT
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              {/* Table body */}

              {tableData
                ?.filter((row: any) => row.charge_type == 2)
                .map((row: any, index: number) => (
                  <Table.Tr key={index}>
                    <Table.Td className="px-1 py-1 w-[20%]">
                      {index + 1}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">
                      {chargesData?.find(
                        (elem) => elem?.ref_sell_id == row?.charge_id
                      )?.charge_name || "NA"}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">{row.rate}</Table.Td>
                    <Table.Td className="px-1 py-1">
                      {row?.per_kg == 1
                        ? "per kg/ pieces"
                        : row?.per_kg == 2
                          ? "Absolute"
                          : ""}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">{row.weight}</Table.Td>
                    <Table.Td className="px-1 py-1">
                      {currencyData?.find((elem) => elem?.id == row?.currency)
                        ?.currency || "NA"}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">{row.inr_amount}</Table.Td>
                  </Table.Tr>
                ))}
            </Table>
          </div>
        ) : (
          ""
        )}

        {toggle == 2 ? (
          <div className="overflow-auto">
            <Table className="whitespace-nowrap ">
              {/* Table headers */}
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="px-2 py-2 text-center">
                    <div className="flex justify-center items-center">
                      SR.No.
                    </div>
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">CHARGES</Table.Th>
                  <Table.Th className="px-1 py-1 text-center">PP/CC</Table.Th>
                  <Table.Th className="px-1 py-1 text-center">RATE</Table.Th>
                  <Table.Th className="px-1 py-1 text-center ">
                    RATE TYPE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    WEIGHT / UNIT
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    CURRENCY
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">EX RATE</Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    INR AMOUNT
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    PARTY TYPE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    PARTY NAME
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>

              {/* Table body */}

              {tableData
                ?.filter((row: any) => row.charge_type === 1)
                .map((row: any, index: number) => (
                  <Table.Tr key={index}>
                    <Table.Td className="px-1 py-1 w-[20%]">
                      {index + 1}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">
                      {chargesData?.find(
                        (elem) => elem?.charge_id == row?.charge_id
                      )?.charge_name || "NA"}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">{row.pp_cc}</Table.Td>
                    <Table.Td className="px-1 py-1">{row.rate}</Table.Td>
                    <Table.Td className="px-1 py-1">
                      {row?.per_kg == 1
                        ? "per kg/ pieces"
                        : row?.per_kg == 2
                          ? "Absolute"
                          : ""}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">{row.weight}</Table.Td>
                    <Table.Td className="px-1 py-1">
                      {currencyData?.find((elem) => elem?.id == row?.currency)
                        ?.currency || "NA"}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">{row.ex_rate}</Table.Td>
                    <Table.Td className="px-1 py-1">{row.inr_amount}</Table.Td>
                    <Table.Td className="px-1 py-1">
                      {partyTypeData?.find(
                        (elem) => elem?.ctd_id == row?.party_type
                      )?.ctype_name || "N.A."}
                    </Table.Td>
                    <Table.Td className="px-1 py-1">
                      {partyNameData?.find(
                        (elem) => elem?.franchisee_id == row?.party
                      )?.franchisee_name || "N.A."}
                    </Table.Td>
                  </Table.Tr>
                ))}
            </Table>
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );

  const description2 = (
    <div className="text-center ">
      {rowData?.proforma_url && (
        <Button
          className="mr-4 p-2 bg-mustard w-[120px] text-white"
          onClick={() => funcOpenDoc(rowData?.proforma_url)}
        >
          Performa
        </Button>
      )}
      {rowData?.house_draft && (
        <Button
          className="p-2 bg-mustard w-[120px] text-white"
          onClick={() => funcOpenDoc(rowData?.house_draft)}
        >
          House Draft
        </Button>
      )}
      {rowData?.house_pdf && (
        <Button
          className="ml-4 p-2 bg-mustard w-[120px] text-white"
          onClick={() => funcOpenDoc(rowData?.house_pdf)}
        >
          House Pdf
        </Button>
      )}
    </div>
  );
  useEffect(() => {
    getProductData();
    getCountryData();
    commongetrequest("admin/commodity-type")?.then((res: any) => {
      setCommodityType(res?.data?.data || []);
    });
    commongetrequest("booking/incoterm")?.then((res: any) => {
      setIncoterm(res?.data?.data || []);
    });
    commongetrequest("booking/clearence-type")?.then((res: any) => {
      setClearanceType(res?.data?.data || []);
    });
    commongetrequest("booking/currency")?.then((res: any) => {
      setCurrencydata(res?.data?.data || []);
    });
  }, []);

  useEffect(() => {
    getData(hit);
  }, [page, debouncedSearch.trim()]);
  const handleCancel = () => {
    setExposureData([]);
    setEmailModal(false);
    setForwhat("");
    setEnquiryModal(false);
    // data.setShowForm(true);
    setEditData(inteditdata);
    getData(hit);
  };
  const getparticulardata = (forwhat: any, id?: any, data?: any) => {
    if (forwhat === "franchisee") {
      return data?.find((item: any) => item?.franchisee_id === id);
    }
  };

  const getJobData = async (job_id: any) => {
    if (!job_id) return;
    try {
      const res = await commongetrequest(`booking/get-job-details/${job_id}`);
      if (res?.status == 200 || res?.status == 204) {
        setJobData(res?.data?.data || {});
      } else {
        setJobData({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImportLastMail = async (franchisee_id: any) => {
    try {
      const res = await commongetrequest(`booking/import-last-mail/${franchisee_id}`);
      if (res?.status == 200) {
        if (res?.data?.data?.to_mail) {
          setEmailData((prev: any) => ({ ...prev, to_email: res?.data?.data?.to_mail }));
        }
        if (res?.data?.data?.cc_mail) {
          setEmailData((prev: any) => ({ ...prev, cc_email: res?.data?.data?.cc_mail.split(",") }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTagHouseMaster = async () => {
    if (!tagData?.job_id) return showAlert("Job Id is required", "warning");
    if (!tagData?.hawb) return showAlert("House Number is required", "warning");
    setTagSpinner(true);
    try {
      const res = await commonputrequest(`booking/tag-house-master`, {
        job_id: tagData?.job_id,
        hawb: tagData?.hawb,
        mawb: tagData?.mawb,
      });
      if (res?.status == 200) {
        setTagData({ job_id: "", hawb: "", mawb: "" });
        setTagOpen(false);
        getData(hit);
        showAlert(res?.data?.message);
      } else {
        showAlert(res?.data?.message || res?.response?.data?.message || res?.message, "error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTagSpinner(false);
    }
  };

  const handleBooking = async (job_id: any, is_draft: any = 1) => {
    if (!job_id) return showAlert("Job Id is required", "warning");
    setBookingLoading({ status: true, forWhat: is_draft });
    try {
      const res = await commonpostrequest(`booking/generate-booking/${job_id}`, {
        is_draft,
        counter,
      });
      if (res?.status == 200) {
        setOpenImport(false);
        setCounter(0);
        getData(hit);
        showAlert(res?.data?.message);
      } else if (res?.status == 400) {
        showAlert(res?.data?.message || res?.response?.data?.message || res?.message, "error");
        setCounter(counter + 1);
        setOpenImport(false);
      } else {
        showAlert(res?.data?.message || res?.response?.data?.message || res?.message, "error");
        setCounter(counter + 1);
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
      setCounter(counter + 1);
    } finally {
      setBookingLoading({ status: false, forWhat: "" });
    }
  };

  const handleSubmit = async () => {
    if (!emailData?.to_email) return showAlert("To Email is required", "warning");
    if (!validateEmail(emailData?.to_email)) return showAlert("Invalid email format", "warning");
    if (!importData?.job_id) return showAlert("Job Id is required", "warning");
    if (!dimensionData || dimensionData?.length === 0)
      return showAlert("Please enter shipment dimensions", "warning");
    if (!jobData?.shipper_details || Object.keys(jobData.shipper_details).length === 0)
      return showAlert("Please enter sender details", "warning");
    if (!jobData?.consignee_details || Object.keys(jobData.consignee_details).length === 0)
      return showAlert("Please enter receiver details", "warning");
    setSaveLoading(true);
    try {
      const res = await commonpostrequest("booking/update-job", {
        franchisee_id: importData?.franchisee_id,
        job_id: importData?.job_id,
        import_booking: 2,
        shipment_dimensions: dimensionData || [],
        shipper_details: jobData?.shipper_details || {},
        consignee_details: jobData?.consignee_details || {},
        sell_charges: [],
        buy_charges: [],
        to: emailData?.to_email || "",
        cc: emailData?.cc_email.join(",") || "",
      });
      if (res?.status == 200) {
        setEmailOpen(false);
        setOpenImport(false);
        setEmailData({ to_email: "", cc_email: [] });
        getData(hit);
        showAlert(res?.data?.message);
      } else if (res?.status == 406) {
        showAlert(res?.response?.data?.errors[0]?.msg, "warning");
      } else {
        showAlert(res?.data?.message || res?.response?.data?.message || res?.message, "error");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSaveLoading(false);
    }
  };
  const tagDescription = (
    <>
      <div className="flex justify-between gap-4 mb-2">
        <div className="bg-gray-200 rounded p-2 max-w-1/2 overflow-hidden truncate">
          <b>ENQUIRY No: </b>{tagData?.booking_no}
        </div>
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate max-w-1/2">
          <b>FRANCHISEE : </b>
          {allfdata?.find((item: any) => item?.franchisee_id == tagData?.franchisee_id)?.franchisee_name}
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div>
          <FormLabel htmlFor="hawb-input">House Number <span className="text-red-500">*</span></FormLabel>
          <FormInput
            id="hawb-input"
            type="text"
            placeholder="Enter House Number"
            value={tagData?.hawb}
            disabled={mawbPresent}
            onChange={(e) => setTagData({ ...tagData, hawb: e.target.value })}
          />
        </div>
        <div>
          <FormLabel htmlFor="mawb-input">Master Number</FormLabel>
          <FormInput
            id="mawb-input"
            type="text"
            placeholder="Enter Master Number"
            value={tagData?.mawb}
            maxLength={11}
            disabled={mawbPresent}
            onChange={(e) => setTagData({ ...tagData, mawb: e.target.value.replace(/[^0-9.]/g, "") })}
          />
        </div>
      </div>
    </>
  );

  const tagFooter = (
    <div className="flex justify-end">
      <Button
        className="px-4 py-1 rounded-lg bg-mustard text-white ml-2"
        onClick={handleTagHouseMaster}
        disabled={tagSpinner}
      >
        Submit
        {tagSpinner && (
          <LoadingIcon icon="puff" color="white" className="w-5 h-5 ml-2 stroke-2.5 text-white" />
        )}
      </Button>
    </div>
  );

  const ImportDescription = (
    <>
      <div className="box col-span-12 px-4 py-2 intro-x font-medium cursor-pointer text-sm flex flex-row justify-between gap-4 rounded-lg bg-white h-auto">
        <div>
          <span className="mt-2 text-lg font-bold">ORIGIN</span>
          <div className="flex gap-2">
            <div className="text-center p-1 border-2 h-auto sm:h-14 w-full rounded flex flex-col items-center">
              <img
                src={`https://flagsapi.com/${importData?.origin_country_code ? importData?.origin_country_code : "IN"}/flat/32.png`}
                alt="origin-flag"
              />
              <span className="text-sm">({importData?.origin_country_code ? importData?.origin_country_code : "IN"})</span>
            </div>
            <div className="p-1 pt-2 h-14 min-w-28 border-2 rounded hidden sm:flex flex-col justify-center">
              <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">
                {countryData?.find((item: any) => item?.country_code == importData?.origin_country_code)?.country_name || "INDIA"}
              </h1>
              <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">({importData?.org_zip})</p>
            </div>
          </div>
        </div>
        {/* <div className="mt-11 flex">
          <img src="https://cdn-icons-png.flaticon.com/512/61/61212.png" className="w-5 h-5" alt="plane-icon" />
        </div> */}
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
          <span className="mt-2 text-lg font-bold">DESTINATION</span>
          <div className="flex gap-2">
            <div className="text-center p-1 border-2 h-auto mx-6 sm:mx-0 sm:h-14 w-full sm:w-10 rounded flex flex-col items-center">
              <img src="https://flagsapi.com/IN/flat/32.png" alt="destination-flag" />
              <span className="text-sm">(IN)</span>
            </div>
            <div className="p-1 pt-2 min-w-28 h-14 border-2 rounded hidden sm:flex flex-col justify-center">
              <h1 className="font-medium text-lg whitespace-nowrap overflow-hidden overflow-ellipsis">INDIA</h1>
              <p className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                ({importData?.dest_zip == "0000" ? importData?.dest_city : importData?.dest_zip || "0000"})
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="box col-span-12">
        <div className="space-y-4 px-2 py-1">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="col-span-3 md:col-span-3 lg:col-span-1">
              <FormLabel className="text-base text-slate-500">FRANCHISEE <span className="text-red-400">*</span></FormLabel>
              <FormInput value={getrelateddata("franchisee", allfranchiseedata, importData?.franchisee_id)?.franchisee_name || ""} disabled />
            </div>
            <div className="col-span-3 md:col-span-3 lg:col-span-1">
              <FormLabel className="text-base text-slate-500">SHIPMENT TYPE <span className="text-red-400">*</span></FormLabel>
              <FormSelect value={importData?.shipment_type} disabled>
                {shipmentTypedata?.map((type: any) =>
                  type?.is_active == 1 && (
                    <option key={type?.booking_shipment_type_id} value={type?.booking_shipment_type_id}>
                      {type?.shipment_type}
                    </option>
                  ),
                )}
              </FormSelect>
            </div>
            <div className="col-span-3 md:col-span-3 lg:col-span-1">
              <FormLabel className="text-base text-slate-500">QUOTED BY <span className="text-red-400">*</span></FormLabel>
              <FormInput value={importData?.quoted_by} disabled />
            </div>
            <div className="col-span-3 md:col-span-3 lg:col-span-1">
              <FormLabel className="text-base text-slate-500">COMMODITY <span className="text-red-400">*</span></FormLabel>
              <FormSelect disabled value={importData?.commodity}>
                <option value="">Select</option>
                {commoditytype?.filter((item: any) => item?.is_active == 1)?.map((item: any) => (
                  <option key={item?.commodity_id} value={item?.commodity_id}>{item?.commodity}</option>
                ))}
              </FormSelect>
            </div>
            <div>
              <FormLabel className="text-base text-slate-500">SHIPMENT CURRENCY</FormLabel>
              <FormSelect disabled value={importData?.currency_id || "24"}>
                <option value="">Select</option>
                {currencydata?.map((item: any) => (
                  <option key={item?.id} value={item?.id}>{item?.currency}</option>
                ))}
              </FormSelect>
            </div>
            <div className="col-span-3 md:col-span-3 lg:col-span-1">
              <FormLabel className="text-base text-slate-500">INCOTERM <span className="text-red-400">*</span></FormLabel>
              <FormSelect value={importData?.incoterm} disabled>
                <option value="">Select Incoterm</option>
                {incotermType?.map((ele: any) => (
                  <option key={ele?.id} value={ele?.id}>{ele?.name}</option>
                ))}
              </FormSelect>
            </div>
            {(importData?.shipment_type == 4 || importData?.shipment_type == 5) && (
              <>
                <div className="col-span-3 md:col-span-3 lg:col-span-1">
                  <FormLabel className="text-base text-slate-500">CLEARANCE TYPE <span className="text-red-400">*</span></FormLabel>
                  <FormSelect disabled value={importData?.clearence_type}>
                    <option value="">Select Clearance Type</option>
                    {clearanceType?.map((ele: any, index: number) => (
                      <option key={index} value={ele?.id}>{ele?.name}</option>
                    ))}
                  </FormSelect>
                </div>
                <div className="col-span-3 md:col-span-3 lg:col-span-1">
                  <FormLabel className="text-base text-slate-500">VENDOR NAME <span className="text-red-400">*</span></FormLabel>
                  <FormSelect disabled value={importData?.courier_id}>
                    {productTypes?.map((item: any) => (
                      <option key={item?.product_id} value={item?.product_id}>{item?.product_name}</option>
                    ))}
                  </FormSelect>
                </div>
                {importData?.import_booking == 2 && (
                  <div className="col-span-3 md:col-span-3 lg:col-span-1">
                    <FormLabel className="text-base text-slate-500">IMPORT SERVICE TYPE <span className="text-red-400">*</span></FormLabel>
                    <FormSelect disabled value={importData?.import_service_type}>
                      <option value="">Select</option>
                      <option value={1}>Economy</option>
                      <option value={2}>Express (IP)</option>
                    </FormSelect>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 col-span-12 overflow-x-auto">
        <FormLabel className="text-base font-medium text-gray-900">Shipment Dimension</FormLabel>
        <ShipmentDimensions
          dimensionData={dimensionData}
          setDimensionData={setDimensionData}
          setJobData={setJobData}
          jobdata={jobData}
          checkdisable={false}
          currencyData={currencydata}
          currencyId={importData?.currency_id}
          weightUnit={importData?.weight_unit}
        />
      </div>

      <div className="grid grid-cols-2 col-span-12 p-2">
        <div className="flex gap-4 items-center">
          <h1 className="font-bold text-sm md:text-lg whitespace-nowrap">Sender Details</h1>
          <Tippy content="Add Sender Details" options={{ placement: "right" }}>
            <PlusCircle className="w-6 h-6 cursor-pointer text-mustard" onClick={() => setSenderOpen(true)} />
          </Tippy>
          {senderOpen && (
            <SenderDetails
              open={senderOpen}
              onClose={() => setSenderOpen(false)}
              isEdit={true}
              booking={jobData}
              setJobData={setJobData}
              enquiryData={importData}
              countryData={countryData || []}
            />
          )}
        </div>
        <div className="flex gap-4 items-center">
          <h1 className="font-bold text-sm md:text-lg whitespace-nowrap">Receiver Details</h1>
          <Tippy content="Add Receiver Details" options={{ placement: "right" }}>
            <PlusCircle className="w-6 h-6 cursor-pointer text-mustard" onClick={() => setReceiverOpen(true)} />
          </Tippy>
          {receiverOpen && (
            <ReceiverDetails
              open={receiverOpen}
              onClose={() => setReceiverOpen(false)}
              isEdit={true}
              countryData={countryData || []}
              booking={jobData}
              setJobData={setJobData}
              dimensionData={dimensionData || []}
              enquiryData={importData}
            />
          )}
        </div>
        <div>
          <p className="font-semibold">{jobData?.shipper_details?.consigner_first_name}</p>
          <p className="font-semibold">{jobData?.shipper_details?.consigner_address_1}</p>
          <p className="font-semibold">{jobData?.shipper_details?.consigner_city}</p>
          <p className="font-semibold">{jobData?.shipper_details?.consigner_pincode}</p>
        </div>
        <div>
          <p className="font-semibold">{jobData?.consignee_details?.consignee_first_name}</p>
          <p className="font-semibold">{jobData?.consignee_details?.consignee_address_1}</p>
          <p className="font-semibold">{jobData?.consignee_details?.consignee_city}</p>
          <p className="font-semibold">{jobData?.consignee_details?.consignee_pincode}</p>
        </div>
      </div>
    </>
  );

  const ImportFooter = (
    <>
      <Button className="text-white bg-gray-500 p-2" onClick={() => { setOpenImport(false); setCounter(0); }}>
        CLOSE
      </Button>
      {importData?.booking_status == "1" ||
        importData?.booking_status == "8" ||
        importData?.booking_status == "9" ||
        importData?.booking_status == "10" ||
        importData?.booking_status == "19" ? (
        <Button
          className="text-white bg-mustard p-2 ml-4"
          onClick={() => {
            if (!importData?.job_id) return showAlert("Job Id is required", "warning");
            if (!dimensionData || dimensionData?.length == 0) return showAlert("Please enter shipment dimensions", "warning");
            if (!jobData?.shipper_details || Object.keys(jobData.shipper_details).length == 0) return showAlert("Please enter sender details", "warning");
            if (!jobData?.consignee_details || Object.keys(jobData.consignee_details).length == 0) return showAlert("Please enter receiver details", "warning");
            setOpenImport(false);
            setEmailOpen(true);
          }}
        >
          SAVE DETAILS
        </Button>
      ) : (
        <Button
          className="text-white bg-mustard p-2 ml-4"
          onClick={() => handleBooking(importData?.job_id, 0)}
          disabled={bookingLoading?.status}
        >
          FINAL BOOKING
          {bookingLoading?.status && bookingLoading?.forWhat == 0 && (
            <LoadingIcon icon="puff" color="white" className="w-5 h-5 ml-2 stroke-2.5 text-white" />
          )}
        </Button>
      )}
    </>
  );

  const emailDescription = (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-2">
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>ENQUIRY No: </b>{emailData?.booking_no}
        </div>
        <div className="bg-gray-200 rounded p-2 overflow-hidden truncate w-full min-w-0 sm:max-w-1/2">
          <b>FRANCHISEE : </b>
          {allfdata?.find((item: any) => item?.franchisee_id == emailData?.franchisee_id)?.franchisee_name}
        </div>
      </div>
      <div className="flex gap-4 flex-col">
        <div>
          <FormLabel>To Email <span className="text-red-500">*</span></FormLabel>
          <FormInput
            type="email"
            placeholder="Enter To Email"
            value={emailData?.to_email}
            onChange={(e) => {
              const value = e.target.value;
              setEmailData({ ...emailData, to_email: value });
              setErrors({
                ...errors,
                to_email: value && !validateEmail(value) ? "Please enter a valid email address" : "",
              });
            }}
          />
          {errors.to_email && <p className="text-red-500 text-sm mt-1">{errors.to_email}</p>}
        </div>
        <div>
          <FormLabel>CC Email</FormLabel>
          <div className="flex flex-wrap items-center gap-2 border border-[#efb847]/50 rounded-md px-2 py-1 focus-within:ring-1 focus-within:ring-[#efb847]">
            {emailData?.cc_email?.map((email: string, index: number) => (
              <span key={index} className="flex items-center gap-1 max-w-full bg-[#efb847]/10 text-[#efb847] px-3 py-1 rounded-full text-sm font-medium">
                <span className="truncate max-w-[45vw] sm:max-w-[200px]">{email}</span>
                <button
                  type="button"
                  className="ml-1 text-red-400 hover:text-red-500 transition font-bold"
                  onClick={() => setEmailData({ ...emailData, cc_email: emailData.cc_email.filter((_: any, i: number) => i !== index) })}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="email"
              placeholder="Enter CC Email & Press Enter"
              value={ccInput}
              onChange={(e) => setCcInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const value = ccInput.trim();
                  if (!value) return;
                  if (!validateEmail(value)) {
                    setErrors({ ...errors, cc_email: "Please enter a valid email address" });
                    return;
                  }
                  if (emailData.cc_email.includes(value)) { setCcInput(""); return; }
                  setEmailData({ ...emailData, cc_email: [...emailData.cc_email, value] });
                  setCcInput("");
                  setErrors({ ...errors, cc_email: "" });
                }
              }}
              className="flex-1 min-w-0 sm:min-w-[180px] w-full sm:w-auto p-1 bg-transparent outline-none focus:outline-none focus:ring-0 placeholder:text-gray-400"
            />
          </div>
          {errors.cc_email && <p className="text-red-500 text-sm mt-1">{errors.cc_email}</p>}
        </div>
      </div>
    </>
  );

  const emailFooter = (
    <>
      <Button className="text-white bg-gray-500 p-2" onClick={() => { setEmailOpen(false); setOpenImport(true); }}>
        CLOSE
      </Button>
      <Button className="text-white bg-mustard p-2 ml-4" onClick={handleSubmit} disabled={saveLoading}>
        SAVE DETAILS
        {saveLoading && <LoadingIcon icon="puff" color="white" className="w-5 h-5 ml-2 stroke-2.5 text-white" />}
      </Button>
    </>
  );

  return (
    <>
      <div className="w-full border-b-2 mt-6 min-[583px]:flex justify-between ">
        <div>
          {" "}
          <h1 className="text-2xl text-primary font-bold text-left whitespace-nowrap">
            SPOT PRICING ENQUIRY LIST{" "}
          </h1>
        </div>
        <div className="flex justify-between">
          <div className="relative pb-2">
            <Search
              className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <FormInput
              type="text"
              placeholder="Enter Enquiry ID"
              value={search}
              className="w-full pl-10" // Added left padding for icon space
              onChange={(e) => {
                setSearch(e.target.value.replace(/\s/g, ""));
                setPage(1);
              }}
            />
          </div>
          {spotData?.length >= 1 ? (
            <div className="ml-2">
              <Button
                className="p-2 bg-success w-[120px] text-white"
                onClick={() => getdownloaddata()}
              >
                {downloadloading ? (
                  <LoadingButtonCommon text="Downloading" />
                ) : (
                  "Download"
                )}
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg  mt-8 mb-16 z-[0] relative">
        <div className="flex justify-between w-full ">
          <div className="grid min-[876px]:grid-cols-5 min-[500px]:grid-cols-2  gap-4 ">
            <div>
              <FormLabel>
                SEARCH BY FRANCHISEE<span className="text-red-400">*</span>
              </FormLabel>
              <CommonSearchableAll
                apiEndpoint={`admin/franchisee-settings?sales_id=${userdata?.mapped_id}`}
                placeholder={"Search By Franchisee"}
                selecteddata={selectedfranchisedata}
                setSelecteddata={setSelectedfranchisedata}
                fun1={fun1}
                comingselectedname={"franchisee_name"}
                comingselectedid={"franchisee_id"}
                funtoempty={funtoempty}
                key1={"key"}
                questionmark={true}
              />
            </div>
            <div>
              <FormLabel>ENQUIRY DATE (From)</FormLabel>
              <FormInput
                name="from_date"
                onChange={handlechange}
                value={datatoget?.from_date}
                max={datatoget?.to_date}
                // min={today} // Prevent selecting past dates
                type="date"
              />
            </div>
            <div>
              <FormLabel>ENQUIRY DATE (To)</FormLabel>
              <FormInput
                value={datatoget?.to_date}
                onChange={handlechange}
                name="to_date"
                min={datatoget?.from_date} // Prevent selecting a date before "From Date"
                type="date"
              />
            </div>
            <div>
              <FormLabel>PRICING STATUS</FormLabel>
              <FormSelect
                name="booking_status"
                value={pricingStatus}
                onChange={(e: any) => {
                  setPricingStatus(e.target.value);
                  setPage(1);
                  setSpotData([]);
                  setHit(3);
                }}
              >
                <option value="">Select</option>
                {statusdata.map((s: any) => (
                  <option key={s.status_code} value={s.status_code}>
                    {s.status_name}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div>
              {" "}
              <Button
                className="bg-success p-2 text-white w-[120px] mt-7 "
                onClick={() => getData(2)}
                disabled={isLoading}
              >
                {isLoading && hit == 2 ? "Searcing.." : "Search"}
              </Button>
            </div>
            {/* <div className="ml-2">
              <Button
                className="bg-success p-2 text-white w-[120px] mt-7 "
                onClick={() => getData()}
                disabled={!franchiseId}
              >
                Search
              </Button>
            </div> */}
          </div>
        </div>

        <div className="flex justify-center w-full my-4 border-t border-slate-200 dark:border-darkmode-400"></div>

        {spotData?.length > 0 ? (
          <div className="overflow-x-auto">
            <Table sm className=" whitespace-nowrap">
              <Table.Thead className="thead-primary table-sorting bg-mustard">
                <Table.Tr className="text-center text-white">
                  <Table.Th className="whitespace-nowrap border text-right">
                    SR.NO.
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border">
                    ACTION
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    STATUS
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    MAWB
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    FRANCHISEE NAME
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    ENQUIRY ID
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    ENQUIRY DATE
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    ORIGIN
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    DESTINATION
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    WEIGHT
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    VENDOR
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    SHIPMENT TYPE
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    QUOTED BY
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-right">
                    QUOTED PRICE (₹)
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-right">
                    DOC
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-right">
                    OVERSEAS CURRENCY PRICE
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    RATE VALID TILL
                  </Table.Th>
                  <Table.Th className="whitespace-nowrap border text-left">
                    AIRWAYBILL NO.
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {spotData?.map((data: any, index: number) => (
                  <Table.Tr
                    key={index}
                  // className={`text-left ${
                  //   data?.booking_status == 7 ? "bg-green-200" : ""
                  // }`}
                  >
                    <Table.Td className="border whitespace-nowrap text-right">
                      {search ? index + 1 : (page - 1) * 20 + (index + 1)}.
                    </Table.Td>
                    <Table.Td>
                      {(data?.shipment_type == 5 ||
                        data?.shipment_type == 1) &&
                        data?.import_booking == 2 &&
                        data?.booking_status != 3 &&
                        data?.booking_status != 7 &&
                        data?.booking_status != 18 ? (
                        <Menu>
                          <Menu.Button className="bg-blue-100 text-blue-500 border-blue-500 flex p-1 rounded-md border-2">
                            <UserCog className="w-5 stroke-2.5" />
                            <ChevronDown className="w-4 stroke-2.5 mt-1" />
                          </Menu.Button>
                          <Menu.Items
                            className="w-44 mt-px border-2 border-slate-200"
                            placement="right-start"
                          >
                            <Menu.Item
                              className="hover:bg-mustard hover:text-white"
                              onClick={() => {
                                navigate(
                                  "/backoffice/sales_operations/spot_price_enquiry",
                                  {
                                    state: { ...data, is_duplicate: 1 },
                                  },
                                );
                              }}
                            >
                              <Copy className="w-4 mr-2" /> Duplicate
                            </Menu.Item>
                            {data?.booking_status == "1" && (
                              <Menu.Item
                                className="hover:bg-mustard hover:text-white"
                                onClick={() => {
                                  handleEdit(data, "credit");
                                }}
                              >
                                REQUEST CREDIT
                              </Menu.Item>
                            )}

                            {data?.booking_status == "5" &&
                              data?.airwaybilno ? (
                              <>
                                <Menu.Divider />
                                <Menu.Item
                                  className="hover:bg-mustard hover:text-white"
                                  onClick={() => {
                                    setTagData({
                                      job_id: data?.job_id,
                                      booking_no: data?.booking_no,
                                      franchisee_id: data?.franchisee_id,
                                      mawb: data?.master || "",
                                      hawb: data?.airwaybilno || "",
                                    });
                                    setMawbPresent(!!data?.master);
                                    setTagOpen(true);
                                  }}
                                >
                                  TAG HOUSE/MASTER
                                </Menu.Item>
                              </>
                            ) : (
                              <>
                                <Menu.Divider />
                                {((data?.booking_status == "1" ||
                                  data?.booking_status == "8" ||
                                  data?.booking_status == "9" ||
                                  data?.booking_status == "10" ||
                                  data?.booking_status == "19") &&
                                  data?.is_draft == null &&
                                  data?.is_import_reject_approve == 0) ||
                                  data?.booking_status == "15" ||
                                  (data?.booking_status == "18" &&
                                    data?.is_draft == null &&
                                    data?.is_import_reject_approve == 0) ||
                                  data?.booking_status == "15" ||
                                  (data?.booking_status == "18" &&
                                    data?.is_draft == 1 &&
                                    data?.is_import_reject_approve == 1) ? (
                                  <Menu.Item
                                    className="hover:bg-mustard hover:text-white"
                                    onClick={async () => {
                                      setDimensionData(
                                        data?.shipment_dimensions || [
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
                                      setEmailData({
                                        job_id: data?.job_id,
                                        booking_no: data?.booking_no,
                                        franchisee_id: data?.franchisee_id,
                                        cc_email: allfdata?.find(
                                          (item: any) =>
                                            item?.franchisee_id ==
                                            data?.franchisee_id,
                                        )?.email_id
                                          ? [
                                            allfdata.find(
                                              (item: any) =>
                                                item?.franchisee_id ==
                                                data?.franchisee_id,
                                            )!.email_id,
                                          ]
                                          : [],
                                      });
                                      setImportData(data);
                                      getJobData(data?.job_id);
                                      setOpenImport(true);
                                      handleImportLastMail(
                                        data?.franchisee_id,
                                      );
                                    }}
                                  >
                                    {data?.booking_status == "1" ||
                                      data?.booking_status == "8" ||
                                      data?.booking_status == "9" ||
                                      data?.booking_status == "10"
                                      ? "ADD DETAILS"
                                      : "COMPLETE BOOKING"}
                                  </Menu.Item>
                                ) : null}
                              </>
                            )}
                          </Menu.Items>
                        </Menu>
                      ) : (
                        <div className="flex justify-center items-center">
                          <Button
                            className="p-1 bg-mustard text-white"
                            onClick={() => {
                              handleEdit(data, "credit");
                            }}
                          >
                            Action
                          </Button>
                        </div>
                      )}
                    </Table.Td>
                    <Table.Td
                      className={`whitespace-nowrap ${data?.booking_status == 15
                          ? data?.import_booking == 2
                            ? "text-green-400"
                            : data?.is_checklist == 1
                              ? "text-green-400"
                              : "text-red-400"
                          : statusdata?.find(
                            (s: any) => s.status_code == data?.booking_status
                          )?.css_class
                        } px-8 text-left border`}
                    >
                      {data?.booking_status == 15
                        ? data?.import_booking == 2
                          ? "Customer Approval Pending"
                          : data?.is_checklist == 1
                            ? "CheckList Done"
                            : "CheckList Pending"
                        : statusdata?.find(
                          (s: any) => s.status_code == data?.booking_status
                        )?.status_name}
                    </Table.Td>
                    <Table.Td>{data?.master ? data?.master : "-"}</Table.Td>

                    <Table.Td>
                      {getrelateddata(
                        "franchisee",
                        allfranchiseedata,
                        data?.franchisee_id,
                      )?.franchisee_name || ""}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.booking_no || "-"}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {formatDate(data?.created_date) || "-"}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.org_city || "-"}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.org_country_id == "97" &&
                        data?.dest_country_id == "97"
                        ? data?.dest_city
                        : countryData?.find(
                          (item) => item.country_id == data?.dest_country_id,
                        )?.country_name ||
                        data?.dest_city ||
                        "N.A."}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap text-right">
                      {Number(data?.weight) || "-"}{" "}
                      {data?.weight_unit ? `(${data.weight_unit})` : ""}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {productTypes?.find(
                        (item) => item.product_id == data?.courier_id,
                      )?.product_name || "-"}
                    </Table.Td>
                    <Table.Td>
                      {shipmentTypedata?.find(
                        (item2: any) =>
                          item2?.booking_shipment_type_id ==
                          data?.shipment_type,
                      )?.shipment_type || "-"}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.quoted_by || "-"}
                    </Table.Td>

                    <Table.Td className="border whitespace-nowrap lowercase text-right">
                      {indianFormat(data?.spot_price) || "-"}{" "}
                      {data?.price_type == "1"
                        ? "(a)"
                        : data?.price_type == "2"
                          ? "(k)"
                          : ""}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.house_pdf ||
                        data?.house_draft ||
                        data?.proforma_url ? (
                        <Eye
                          className="cursor-pointer text-mustard stroke-2.5"
                          onClick={() => {
                            setRowData(data);
                            setOpen2(true);
                          }}
                        />
                      ) : (
                        "N.A."
                      )}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap lowercase text-right">
                      {data?.franchisee_currency || ""}
                      {"  "}
                      {foreignFormat(data?.spot_price_foreign_currency) ||
                        "0.00"}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {formatDate(data?.valid_till) || "N.A."}
                    </Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {data?.airwaybilno || "N.A."}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        ) : isLoading && hit == 1 ? (
          <IsLoading />
        ) : (
          <Nodatafound />
        )}

        {/* <Modal
          open={open}
          setOpen={setOpen}
          title="Confirm"
          size="md"
          description={description}
          footer={footer}
        /> */}

        <Modal
          open={open1}
          setOpen={setOpen1}
          title=""
          size="lg"
          description={description1}
          footer=""
        />

        <Modal
          open={open2}
          setOpen={setOpen2}
          title="Documents"
          size="md"
          description={description2}
        />

        {spotData?.length > 0 && (
          <CommonPagination
            totalpages={totalpages}
            onPageChange={handlePagechange}
            page={page}
          />
        )}
        {enquiryModal ? (
          <SpotpriceModal
            setOpenModal={setEnquiryModal}
            openmodal={enquiryModal}
            spotData={{
              ...editdata,
              ...(editdata?.shipment_type == 8
                ? {
                  fair_id: editdata?.fair_data?.fair_id,
                  fair_venue: editdata?.fair_data?.fair_venue,
                  fair_start_date: editdata?.fair_data?.fair_start_date,
                  fair_end_date: editdata?.fair_data?.fair_end_date,
                  // fair_date: spotData?.fair_date,
                }
                : {}),
            }}
            setSpotData={setEditData}
            allfdata={allfranchiseedata}
            handleCancel={handleCancel}
            getchweight={getchweight}
            chargehead={chargesdata}
            setChargehead={setChargesdata}
          />
        ) : (
          ""
        )}
        {emailModal && (
          <CommonemailModal
            setEmailModal={setEmailModal}
            emailModal={emailModal}
            spotData={editdata}
            setSpotData={setEditData}
            allfdata={allfdata}
            handleCancel={handleCancel}
            branchdata={branchData}
            hubData={hubdata}
            exposureData={exposureData}
            setExposureData={setExposureData}
            forwhat={forwhat}
            setForwhat={setForwhat}
          />
        )}

        {tagOpen && (
          <CommonModal
            open={tagOpen}
            setOpen={setTagOpen}
            title={
              <div className="flex justify-between w-full">
                <p className="text-base font-medium">TAG HOUSE / MASTER</p>
                <XCircle
                  className="w-5 h-5 cursor-pointer hover:text-red-500"
                  onClick={() => setTagOpen(false)}
                />
              </div>
            }
            description={tagDescription}
            footer={tagFooter}
            size="lg"
          />
        )}

        {openImport && (
          <CommonModal
            open={openImport}
            setOpen={setOpenImport}
            title={
              <div className="flex justify-between w-full">
                <p className="text-base font-medium">
                  {importData?.booking_status == "1" ||
                    importData?.booking_status == "8" ||
                    importData?.booking_status == "9" ||
                    importData?.booking_status == "19"
                    ? "ADD IMPORT DETAILS"
                    : "COMPLETE BOOKING"}
                </p>
                <div className="bg-gray-200 rounded p-2 ml-2">
                  <span className="font-bold">ENQUIRY No: </span>
                  <span>{importData?.booking_no}</span>
                </div>
                <XCircle
                  className="w-5 h-5 cursor-pointer hover:text-red-500"
                  onClick={() => setOpenImport(false)}
                />
              </div>
            }
            description={ImportDescription}
            footer={ImportFooter}
            size="2xl"
          />
        )}

        {emailOpen && (
          <CommonModal
            open={emailOpen}
            setOpen={setEmailOpen}
            title={
              <div className="flex justify-between w-full">
                <p className="text-base font-medium">Email Confirmation</p>
                <XCircle
                  className="w-5 h-5 cursor-pointer hover:text-red-500"
                  onClick={() => { setOpenImport(true); setEmailOpen(false); }}
                />
              </div>
            }
            description={emailDescription}
            footer={emailFooter}
            size="xl"
          />
        )}
      </div>
    </>
  );
};

export default SpostenquiryList;
