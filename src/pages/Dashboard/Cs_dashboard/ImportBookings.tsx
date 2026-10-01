import { Check, Building2, PackageCheck, Timer, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import CounterAnimator from "../../skart_sales/commoncomponents/CounterAnimator/CounterAnimator";
import pickupdimpage from "../../../assets/images/csimages/pickup.png";
import notpickupimg from "../../../assets/images/csimages/not_pickup.png";
import bgimg from "../../../assets/images/csimages/ageingbg.gif";
import resetimg from "../../../assets/images/csimages/reset.png";
import transitimg from "../../../assets/images/csimages/intransit.png";
import deleveredimg from "../../../assets/images/csimages/delivered.png";
import CommonPagination from "../../../components/Pagination";
import IsLoading from "../../skart_sales/commoncomponents/isLoading/isLoading";
import { FormInput, FormLabel, FormSelect } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import Table from "../../../base-components/Table";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useLogin } from "../../skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import Nodatafound from "../../skart_sales/commoncomponents/Nodatafound/Nodatafound";
import CommonSearchableAll from "../../skart_sales/commoncomponents/CommonSearchableall/CommonSearchableall";
// import bgimg from "../../../assets/images/csimages/ageingbg.gif";
const intdatatoget = {
  from_date: "",

  to_date: "",

  airwaybill_no: "",

  franchisee_id: "",
  hub_id:""
};
const intpincodedata = {
  city: "",
  state: "",
  pickup_id: "",
};
const intfranchiseedata = {
  franchisee_id: "",
  franchisee_name: "",
};
const intbuttondata = [
  { id: 7, imgurl: pickupdimpage, name: "All" },
  { id: 0, imgurl: notpickupimg, name: "Not Pick Up" },
  { id: 1, imgurl: pickupdimpage, name: "Pick Up" },
  { id: 3, imgurl: null, icon: Building2, name: "Held at Origin" },
  { id: 2, imgurl: transitimg, name: "In Transit" },
  { id: 4, imgurl: null, icon: PackageCheck, name: "Arrived at Destination" },
  { id: 5, imgurl: null, icon: Timer, name: "Held at Destination" },
  { id: 6, imgurl: deleveredimg, name: "Delivered" },
];
export default function ImportBookings({ importbookingp }: any) {
  const [active, setActive] = useState<any>([]);
  const [pickupdata, setPickupdata] = useState<any>({});
  const [pincodedata, setPincodedata] = useState<any>(intpincodedata);
  const [tippystate, setTippyState] = useState<boolean>(false);
  const [buttondata, setButtonData] = useState<any>(intbuttondata);
  const [alldata, setAllData] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [totalpages, setTotalPages] = useState<number>(1);
  const { showAlert } = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const { userdata } = useLogin();
  const [franchiseeData, setFranchiseeData] = useState<Array<any>>([]);
  const [datatoget, setDatatoget] = useState<any>({
    ...intdatatoget,
    // franchisee_id: userdata?.mapped_id,
  });
    const [hubdata, setHubdata] = useState([]);
  const handlechange = (e: any) => {
    const { name, value } = e.target;
    setDatatoget((pre: any) => ({ ...pre, [name]: value }));
    setAllData([]);
    setTotalPages(1);
    setPage(1);
  };
  const fun1 = (a?: any) => {
    setDatatoget((pre: any) => ({
      ...pre,
      franchisee_id: a?.franchisee_id,
    }));
    setAllData([]);

    setPage(1);
  };
  const funtoempty = () => {
    setDatatoget((pre: any) => ({
      ...pre,
      franchisee_id: "",
    }));
    setAllData([]);

    setPage(1);

    setSelectedfranchisedata(intfranchiseedata);
  };
  const getData = async () => {
    try {
      setIsLoading(true);
      const updatedActive = [
        ...new Set(active.map((item: number) => (item === 5 ? 7 : item))),
      ];

      const payload:any = {
        airwaybill_no: datatoget?.airwaybill_no,
        from_date: datatoget?.from_date,
        to_date: datatoget?.to_date,
        franchisee_id: selectedfranchisedata?.franchisee_id,
        event_type: updatedActive,
      };
      if(datatoget?.hub_id){
        payload.hub_id=datatoget?.hub_id
      }
      if (payload?.event_type?.length > 0) {
        const response: any = await commonpostrequest(
          `booking/get_booking_import?page=${page - 1}&limit=20`,
          payload
        );
        if (response?.status == 200) {
          setAllData(response?.data?.data || []);

          setTotalPages(Math.ceil(Number(response?.data?.total) / 20) || 1);
        } else if (response?.status == 204) {
          showAlert("No Data Found!", "warning");
          setAllData([]);
        } else {
          setAllData([]);
          setTotalPages(1);
        }
      } else {
        setAllData([]);
        showAlert("Please select shipment status card", "warning");
      }
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadData = async () => {
    try {
      setIsDownloading(true);
      const updatedActive = [
        ...new Set(active.map((item: number) => (item === 5 ? 7 : item))),
      ];
      const payload: any = {
        airwaybill_no: datatoget?.airwaybill_no,
        from_date: datatoget?.from_date,
        to_date: datatoget?.to_date,
        franchisee_id: selectedfranchisedata?.franchisee_id,
        event_type: updatedActive,
      };
      if (datatoget?.hub_id) {
        payload.hub_id = datatoget?.hub_id;
      }
      if (payload?.event_type?.length === 0) {
        showAlert("Please select shipment status card", "warning");
        return;
      }
      const response: any = await commonpostrequest(
        "booking/get_booking_import",
        payload
      );
      if (response?.status !== 200 || !response?.data?.data?.length) {
        showAlert("No Data Found!", "warning");
        return;
      }
      const rows: any[] = response.data.data;
      const headers = [
        "SR.NO.",
        "AIRWAYBILL NO.",
        "CUSTOMER NAME",
        "PICKUP NO.",
        "ORIGIN COUNTRY",
        "DESTINATION PINCODE",
        "HUB NAME",
        "COMMODITY",
        "SCHEDULED PICK-UP",
        "DAYS PENDING",
        "SHIPPER NAME",
        "CHARGEABLE WEIGHT",
        "NO. OF PIECES",
        "BSO SHIPMENT",
        "BSO STATUS",
        "BSO NAME",
        "BSO CONTACT DETAILS",
        "BSO ADDRESS",
      ];
      const csvRows = [
        headers.join(","),
        ...rows.map((data: any, index: number) => {
          const franchiseeName =
            franchiseeData?.find(
              (elem: any) => elem?.franchisee_id == data?.pickup_franchisee_id
            )?.franchisee_name || "";
          const hubName =
            (hubdata as any[])?.find(
              (item2: any) => item2?.hub_id == data?.hub_id
            )?.hub_name || "N.A";
          const commodity ="N.A";
          const daysPending =
            data?.extra_data?.tat_days || "N.A";
          return [
            index + 1,
            data?.airwaybilno || "",
            `"${franchiseeName}"`,
            data?.pickup_transaction_id || "N.A",
            data?.extra_data?.origin_country || "-",
            data?.extra_data?.["destination_pincode"] || "",
            `"${hubName}"`,
            `"${commodity}"`,
            data?.pickup_date || "",
            daysPending,
            `"${data?.shipper_name || ""}"`,
            `${data?.chargeable_weight || ""} ${data?.["weight_unit"] || ""}`.trim(),
            data?.["number_of_pieces"] || "",
            data?.is_bso ? "Yes" : "No",
            data?.bso_status == 2 ? "BSO" : "Non BSO",
            `"${data?.bso_name || ""}"`,
            `"${[data?.bso_contact, data?.bso_email].filter(Boolean).join(" | ") || ""}"`,
            `"${[data?.bso_address, data?.bso_city, data?.bso_state, data?.bso_pincode].filter(Boolean).join(", ") || ""}"`,
          ].join(",");
        }),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `import_bookings_${datatoget?.from_date}_${datatoget?.to_date}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      showAlert("Something went wrong", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  //  useEffect(() => {

  //       if(datatoget?.from_date && datatoget?.to_date){
  //         getData();
  //       }
  //  },[active])
  const handleCancel = () => {};
  const handlereset = () => {
    setDatatoget({ ...intdatatoget, franchisee_id: userdata?.mapped_id });
    setTotalPages(1);
    setAllData([]);
    setPage(1);
    funtoempty()
  };
  const handlePagechange = (e: number) => {
    setPage(e);
  };
  const getpincodedata = async (value: any) => {
    try {
      const res = await commongetrequest(
        `admin/domestic-pincode/${value?.extra_data["destination_pincode"]}`
      );
      if (res?.status == 200) {
        const data = res?.data?.data[0];
        setPincodedata({
          pickup_id: value?.pickup_id,
          state: data?.state || "",
          city: data?.city,
        });
      } else {
        setPincodedata({ ...intpincodedata, pickup_id: value["pickup_id"] });
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  // const handleClick = (itemId: number) => {
  //   if (itemId == 1) {
  //     const allIds = buttondata.map((item) => item.id);
  //     console.log("allids", allIds);
  //     setActive(allIds);
  //     return;
  //   }

  //   if (itemId == 5) {
  //     setActive([1]);
  //   }


  //   let newActive = [...active];

  //   // Remove "All" if any other button is clicked
  //   newActive = newActive.filter((id) => id !== 1);

  //   if (newActive.includes(itemId)) {
  //     newActive = newActive.filter((id) => id !== itemId);
  //   } else {
  //     newActive.push(itemId);
  //   }

  //   setActive(newActive);
  // };
  
  const handleClick = (itemId: number) => {
  // ALL button
  if (itemId === 7) {
    // If All is already active → unselect everything
    if (active.includes(7)) {
      setActive([]);
    } else {
      // Select all buttons
      setActive(buttondata.map((item) => item.id));
    }
    return;
  }

  let newActive = [...active];

  // Remove "All" when clicking any other button
  newActive = newActive.filter((id) => id !== 7);

  // Toggle clicked button
  if (newActive.includes(itemId)) {
    newActive = newActive.filter((id) => id !== itemId);
  } else {
    newActive.push(itemId);
  }

  setActive(newActive);
};
  const funcFranchisee = async () => {
    const res: any = await commongetrequest("admin/franchisee-settings");
     const hubres = await commongetrequest("admin/hub");
    if (res?.status == 200) {
      setFranchiseeData(res?.data?.data);
    }
     if (hubres?.status == 200) {
       setHubdata(hubres?.data?.data || []);
     }
  };

  useEffect(() => {
    setDatatoget((prev) => ({
      ...prev,
      event_type: active,
    }));
    if (datatoget?.from_date && datatoget?.to_date) {
      getData();
    }
  }, [page, active]);
  useEffect(() => {
    funcFranchisee();
  }, []);

  return (
    <div className="mt-3  w-full p-2 md:py-5  md:px-5 bg-white rounded-lg shadow-lg">
      <div>
        {/* TAB BUTTONS */}

        {/* <div className="w-full mb-2">
          <h2 className="font-bold text-lg">Filter Ageing Dashboard </h2>
        </div> */}
        <div className="">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-4 w-full">
            {buttondata?.map((item: any) => (
              <button
                className={`p-[1px] rounded-[10px] w-full ${
                  active.includes(item.id)
                    ? "bg-gradient-to-r from-[#FBD06B] to-[#FBD06B]"
                    : "bg-gradient-to-r from-[#cbd4dd] to-[#FFECC0]"
                }`}
              >
                <div
                  onClick={() => handleClick(item.id)}
                  className={
                    active.includes(item?.id)
                      ? "relative overflow-hidden rounded-[9px] px-2 py-2 bg-[linear-gradient(90deg,rgb(255,250,228)_0%,rgb(255,255,255)_100%)] h-full"
                      : "relative overflow-hidden rounded-[9px] px-2 py-2 bg-gradient-to-r from-[#FDFDFD] via-[#FDFDFD] to-[#FFF9EB] hover:from-[#fffaef] hover:via-[#fffaef] hover:to-[#fffaef] h-full"
                  }
                >
                  <div className="flex flex-col items-center gap-1">
                    <figure className="flex-shrink-0 flex items-center justify-center w-[34px] h-[32px]">
                      {item?.icon ? (
                        <item.icon className="w-[28px] h-[28px] text-[#7a6030]" strokeWidth={1.5} />
                      ) : (
                        <img
                          alt={item?.name}
                          className="w-[34px] h-[32px] object-contain"
                          src={item?.imgurl}
                        />
                      )}
                    </figure>
                    <aside className="text-center">
                      <p className="uppercase text-[11px] font-medium text-[#565656] leading-tight">
                        {item?.name}
                      </p>
                    </aside>
                  </div>
                  <i
                    onClick={() => {
                      let newdata = [...active];
                      if (newdata.includes(item.id)) {
                        newdata = newdata?.filter(
                          (item2: any) => item2 != item?.id,
                        );
                      } else {
                        newdata.push(item?.id);
                      }
                      setActive(newdata);
                    }}
                    className={
                      active.includes(item?.id)
                        ? "absolute rotate-[-9deg] opacity-50 bottom-[-8px] right-[-10px]"
                        : "hidden"
                    }
                  >
                    <img
                      alt=""
                      className="w-[120px] h-[24px] filter hue-rotate-[225deg] brightness-[2] saturate-[6] contrast-[12]"
                      src={bgimg}
                    />
                  </i>

                  <span
                    onClick={() => {
                      let newdata = [...active];
                      if (newdata.includes(item.id)) {
                        newdata = newdata?.filter(
                          (item2: any) => item2 != item?.id,
                        );
                      } else {
                        newdata.push(item?.id);
                      }
                      setActive(newdata);
                    }}
                    className={
                      active.includes(item?.id)
                        ? " absolute top-[6px] right-[5px] bg-[#ffcb3f] rounded-full p-[2px] w-[20px] h-[20px]"
                        : "hidden absolute top-[6px] right-[5px] bg-[#ffcb3f] rounded-full p-[2px] w-[20px] h-[20px]"
                    }
                  >
                    <Check className="w-[15px] h-[15px] stroke-2.5 text-[#715710]" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <>
        <div className="w-full max-w-8xl p-6 px-10 bg-white rounded-lg shadow-lg  mt-2 mb-2 z-[0] relative">
          <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5  xl:grid-cols-5  items-end gap-8">
            <div>
              <FormLabel>
                FRANCHISEE NAME:
              </FormLabel>
              <div className="bg-white">
                {/* <SingleSelect
                  data={frenhdata}
                  singlevalue={selectvalue}
                  setSingleValue={setSelectvalue}
                  fun1={fun1}
                /> */}
                <CommonSearchableAll
                  apiEndpoint="
admin/franchisee-settings"
                  placeholder="Search items..."
                  zIndex="50"
                  comingselectedname="franchisee_name"
                  comingselectedid={"franchisee_id"}
                  key1={"key"}
                  selecteddata={selectedfranchisedata}
                  setSelecteddata={setSelectedfranchisedata}
                  fun1={fun1}
                  fun2={funtoempty}
                />
              </div>
            </div>
            <div className="w-full">
              <FormLabel htmlFor="modal-form-5">SELECT HUB</FormLabel>
              <FormSelect
                value={datatoget?.hub_id}
                name={"hub_id"}
                onChange={handlechange}
              >
                <option value="">Select</option>
                {hubdata?.map((item: any) => (
                  <option value={item?.hub_id}>{item?.hub_name}</option>
                ))}
              </FormSelect>
            </div>
            <div className="">
              <FormLabel>
                FROM DATE <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="date"
                value={datatoget?.from_date}
                max={datatoget?.to_date}
                name="from_date"
                onChange={handlechange}
              />
            </div>
            <div className="">
              <FormLabel>
                TO DATE <span className="text-red-500">*</span>
              </FormLabel>
              <FormInput
                type="date"
                name="to_date"
                value={datatoget?.to_date}
                min={datatoget?.from_date}
                onChange={handlechange}
              />
            </div>
            <div className="">
              <FormLabel>AIRWAYBILL NO.</FormLabel>
              <FormInput
                name="airwaybill_no"
                placeholder={"Enter AWB No."}
                value={datatoget?.airwaybill_no}
                onChange={handlechange}
              />
            </div>
            <div className="flex ">
              <Button
                className=" bg-success text-white ml-4 p-2"
                disabled={
                  !datatoget?.from_date ||
                  !datatoget?.to_date ||
                  isLoading
                }
                onClick={() => {
                  getData();
                }}
              >
                SEARCH
              </Button>
              <Button
                className=" rounded-lg bg-red-500 hover:bg-red-600 text-white ml-4 p-2"
                onClick={() => {
                  handlereset();
                }}
              >
                RESET
              </Button>
              <Button
                className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white ml-4 p-2 flex items-center gap-1"
                disabled={
                  !datatoget?.from_date ||
                  !datatoget?.to_date ||
                  isDownloading
                }
                onClick={downloadData}
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "..." : "DOWNLOAD"}
              </Button>
            </div>
          </div>
        </div>
        <div className=" rounded-lg shadow-lg bg-white ">
          {alldata?.length > 0 && !isLoading ? (
            <div className="overflow-x-auto h-[100vh]">
              <Table className="table table-text-small mb-0 border">
                <Table.Thead
                  variant="dark"
                  className="thead-primary table-sorting bg-mustard"
                >
                  <Table.Tr className="text-center ">
                    <Table.Th className="whitespace-nowrap border">
                      SR.NO.
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      AIRWAYBILL NO.
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      CUSTOMER NAME
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      PICKUP NO.
                    </Table.Th>

                    <Table.Th className="whitespace-nowrap border text-left">
                      ORIGIN COUNTRY
                    </Table.Th>

                    <Table.Th className="whitespace-nowrap border text-left">
                      DESTINATION PINCODE
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      HUB Name
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      COMMODITY
                    </Table.Th>

                    <Table.Th className="whitespace-nowrap border text-left uppercase">
                      SCHEDULED PICK-UP
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left uppercase">
                      DAYS PENDING
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      SHIPPER NAME
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      CHARGEABLE WEIGHT
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      NO. OF PIECES
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      BSO SHIPMENT
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      BSO STATUS
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      BSO NAME
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      BSO CONTACT DETAILS
                    </Table.Th>
                    <Table.Th className="whitespace-nowrap border text-left">
                      BSO ADDRESS
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {alldata?.map((data: any, index: number) => (
                    <Table.Tr key={index}>
                      <Table.Td className="border whitespace-nowrap text-right">
                        {(page - 1) * 20 + (index + 1)}.
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.airwaybilno || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {
                          franchiseeData?.find(
                            (elem: any) =>
                              elem?.franchisee_id == data?.pickup_franchisee_id,
                          )?.franchisee_name
                        }
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap">
                        {data?.pickup_transaction_id || "N.A"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-left">
                        {data?.extra_data?.origin_country || "-"}
                      </Table.Td>

                      <Table.Td className="border whitespace-nowrap text-left">
                        <div className=" relative ">
                          <div>
                            <strong
                              onMouseLeave={() => {
                                setPincodedata(intpincodedata);
                                setTippyState(false);
                              }}
                              onMouseEnter={async () => {
                                await getpincodedata(data);
                                setTippyState(true);
                              }}
                              className="text-success cursor-pointer"
                            >
                              {" "}
                              {data?.extra_data["destination_pincode"]}
                            </strong>

                            {pincodedata?.pickup_id == data?.pickup_id &&
                            tippystate ? (
                              <div className="absolute p-2 border rounded-lg shadow-lg bg-gray-400 bottom-6  ">
                                <p>
                                  City: <strong>{pincodedata?.city}</strong>
                                </p>
                                <p>
                                  State: <strong>{pincodedata?.state}</strong>
                                </p>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </Table.Td>
                        <Table.Td
                        className={`border whitespace-nowrap text-left `}
                      >
                        {hubdata?.find(
                          (item2: any) => item2?.hub_id == data?.hub_id,
                        )?.hub_name || "N.A"}
                      </Table.Td>
                      <Table.Td
                        className={`border whitespace-nowrap text-left `}
                      >
                        {data?.extra_data?.commodity_code || "-"}
                      </Table.Td>
                      <Table.Td
                        className={`border whitespace-nowrap text-left `}
                      >
                        {data?.pickup_date || "-"}
                      </Table.Td>
                      <Table.Td
                        className={`border whitespace-nowrap text-left `}
                      >
                        {data?.extra_data?.tat_days || "-"}
                      </Table.Td>
                      <Table.Td
                        className={`border whitespace-nowrap text-left `}
                      >
                        {data?.shipper_name || "-"}
                      </Table.Td>
                      <Table.Td
                        className={`border whitespace-nowrap text-left `}
                      >
                        {data?.chargeable_weight} {data["weight_unit"]}
                      </Table.Td>
                      <Table.Td
                        className={`border whitespace-nowrap text-right `}
                      >
                        {data["number_of_pieces"] || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-left">
                        {data?.is_bso ? "Yes" : "No"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-left">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${data?.bso_status == 2 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {data?.bso_status == 2 ? "BSO" : "Non BSO"}
                        </span>
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-left">
                        {data?.bso_name || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-left">
                        {[data?.bso_contact, data?.bso_email].filter(Boolean).join(" | ") || "-"}
                      </Table.Td>
                      <Table.Td className="border whitespace-nowrap text-left">
                        {[data?.bso_address, data?.bso_city, data?.bso_state, data?.bso_pincode].filter(Boolean).join(", ") || "-"}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          ) : isLoading ? (
            <div className="h-[100vh]">
              <IsLoading />
            </div>
          ) : (
            <Nodatafound />
          )}

          {alldata?.length > 0 && totalpages > 1 && (
            <CommonPagination
              totalpages={totalpages}
              onPageChange={handlePagechange}
              page={page}
            />
          )}
        </div>
      </>
    </div>
  );
}
