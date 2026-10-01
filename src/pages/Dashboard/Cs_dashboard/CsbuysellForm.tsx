import { ShoppingBag, ClipboardCheck, Trash2, Plus, Minus } from "lucide-react";
import { FormInput, FormLabel } from "../../../base-components/Form";
import Table from "../../../base-components/Table";
import { Tab } from "../../../base-components/Headless";
import TomSelect from "../../../base-components/TomSelect/index";
import { FormSelect } from "../../../base-components/Form";
import { useLogin } from "../../skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";
import Button from "../../../base-components/Button";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useEffect, useRef, useState } from "react";

import CommonSearchArr from "../../skart_sales/Spotprice/commonsearcharr";
import { formatIndianNumber } from "../../skart_sales/commoncomponents/CommonNumberConverter/CommonNumberconverter";

import { MdWarning } from "react-icons/md";
import styles from "../../skart_sales/SpotEnquiry/SpotEnquiryModal/spotenquiry.module.css";
const CSForm = (props: any) => {
  const bottomRef = useRef(null);

  const {
    chargesdata,
    spotData,
    isRead,
    sellingcharges,
    setSellingCharges,
    buycharges,
    setBuyCharges,
    franchiseedata,
    allvendordropdowndata,
    currencydata,
    fun1,
    funtoempty,
    exchangedata,
    setExchangedata,
    totalbuy,
    totalSell,
    toggle,
    setToggle,
    getchweight,
    alltypedata,
    forwhat,
    hasUpdated,
    setHasUpdated,
  } = props;
  const { showAlert } = useAlert();
  const { userdata } = useLogin();
  // const hasUpdated = useRef(false);

  useEffect(() => {
    if (!hasUpdated) {
      return; // Prevent scrolling on initial API response
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sellingcharges, hasUpdated]);
  useEffect(() => {
    const singledata = franchiseedata?.find(
      (item: any) => item?.franchisee_id == 6676
    );
    const singledata2 = alltypedata?.find((item: any) => item?.ctd_id == 56);
  }, []);
  useEffect(() => {
    if (!hasUpdated) {
      return;
    }

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [buycharges, hasUpdated]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [hasUpdated]);
  

  // handling selling charges here
  const handleSelectChange = (index: any, field: any, value: any) => {
    let newFormData = [...sellingcharges];
    if (field == "charge_id") {
      const singledata = chargesdata?.find(
        (item: any) => item.ref_sell_id == value
      );

      newFormData[index]["charge_id"] = value;
      newFormData[index]["enquiry_id"] = spotData?.id;
      newFormData[index]["sac_code"] = singledata["hsn_code"];
      setSellingCharges(newFormData);
    } else {
      if (field == "per_kg") {
        if (value == "1") {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
              Number(newFormData[index]["weight"]) || 0;
          setSellingCharges(newFormData);
        } else {
          newFormData[index][field] = value || 0;
          newFormData[index]["weight"] = 1;
          newFormData[index]["inr_amount"] = newFormData[index]["rate"] || 0;
          setSellingCharges(newFormData);
        }
      } else if (field == "rate") {
        if (newFormData[index]["per_kg"] == 1) {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
              Number(newFormData[index]["weight"]) || 0;
          setSellingCharges(newFormData);
        } else {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] = newFormData[index]["rate"] || 0;
          setSellingCharges(newFormData);
        }
      } else if (field == "weight") {
        if (newFormData[index]["per_kg"] == 1) {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
              Number(newFormData[index]["weight"]) || 0;
          setSellingCharges(newFormData);
        } else {
          newFormData[index][field] = 1;
          newFormData[index]["inr_amount"] = newFormData[index]["rate"] || 0;
          setSellingCharges(newFormData);
        }
      } else {
        newFormData[index][field] = value || 0;
        setSellingCharges(newFormData);
      }
      setSellingCharges(newFormData);
    }
  };
  // handling buying charges
  const handleSelectChange2 = (index: any, field: any, value: any) => {
    let newFormData = [...buycharges];
    if (field == "charge_id") {
      const singledata = chargesdata?.find(
        (item: any) => item.charge_id == value
      );

      const singledata2 = sellingcharges.find(
        (item2: any) => item2?.charge_id == singledata?.ref_sell_id
      );

      newFormData[index]["charge_id"] = value;
      newFormData[index]["enquiry_id"] = spotData?.id;
      newFormData[index]["sac_code"] = singledata["hsn_code"];
      newFormData[index]["sell_rate"] = singledata2?.rate || 0;
      setBuyCharges(newFormData);
    } else {
      if (field == "per_kg") {
        if (value == "1") {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
              Number(newFormData[index]["weight"]) *
              (Number(newFormData[index]["ex_rate"]) || 1) || 0;
          setBuyCharges(newFormData);
        } else {
          newFormData[index][field] = value || 0;
          newFormData[index]["weight"] = 1;
          newFormData[index]["inr_amount"] =
            newFormData[index]["rate"] *
              (Number(newFormData[index]["ex_rate"]) || 1) || 0;
          setBuyCharges(newFormData);
        }
      } else if (field == "rate") {
        if (newFormData[index]["per_kg"] == 1) {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
            Number(newFormData[index]["weight"]) *
            (Number(newFormData[index]["ex_rate"]) || 1);
          setBuyCharges(newFormData);
        } else {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            newFormData[index]["rate"] *
            (Number(newFormData[index]["ex_rate"]) || 1);
          setBuyCharges(newFormData);
        }
      } else if (field == "weight") {
        if (newFormData[index]["per_kg"] == 1) {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
            Number(newFormData[index]["weight"]) *
            (Number(newFormData[index]["ex_rate"]) || 1);
          setBuyCharges(newFormData);
        } else {
          newFormData[index][field] = 1;
          newFormData[index]["inr_amount"] =
            newFormData[index]["rate"] *
            (Number(newFormData[index]["ex_rate"]) || 1);
          setBuyCharges(newFormData);
        }
      } else if (field == "currency") {
        if (newFormData[index]["per_kg"] == 1) {
          newFormData[index]["ex_rate"] =
            Number(
              exchangedata?.find((item: any) => item?.currency_id == value)
                ?.ex_rate
            ) || 0;
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
            Number(newFormData[index]["weight"]) *
            (Number(
              exchangedata?.find((item: any) => item?.currency_id == value)
                ?.ex_rate
            ) || 1);
          newFormData[index]["ex_rate"] =
            Number(
              exchangedata?.find((item: any) => item?.currency_id == value)
                ?.ex_rate
            ) || 0;
          setBuyCharges(newFormData);
        } else {
          newFormData[index][field] = value || 0;

          newFormData[index]["ex_rate"] =
            Number(
              exchangedata?.find((item: any) => item?.currency_id == value)
                ?.ex_rate
            ) || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
            Number(
              exchangedata?.find((item: any) => item?.currency_id == value)
                ?.ex_rate
            );
          setBuyCharges(newFormData);
        }
      } else {
        newFormData[index][field] = value || 0;
        setBuyCharges(newFormData);
      }
      // setBuyCharges(newFormData);
    }
  };

  const removeRow = (index: any) => {
    if (sellingcharges?.length > 1) {
      const newFormData = [...sellingcharges];
      newFormData.splice(index, 1);
      setSellingCharges(newFormData);
    }
  };

  //  deleting particuar row buying
  const removeRow2 = (index: any) => {
    if (buycharges?.length > 1) {
      const newFormData = [...buycharges];
      newFormData.splice(index, 1);
      setBuyCharges(newFormData);
    }
  };

  // handling addrow here selling

  const addRow = () => {
    const excludedKeys = [
      "ex_rate",
      "party",
      "pp_cc",
      "sgst_amount",
      "igst_amount",
      "cgst_amount",
      "enquiry_id",
      "currency",
    ]; // Add keys you want to exclude

    const isAllFilled = sellingcharges.every((item: any) =>
      Object.entries(item).every(([key, value]) =>
        excludedKeys.includes(key)
          ? true
          : value !== "" && value !== null && value !== undefined && value !== 0
      )
    );
    if (isAllFilled) {
      const newdata = [...sellingcharges];
      setSellingCharges([
        ...sellingcharges,
        {
          charge_id: "",

          weight: spotData?.weight || 0,
          rate: 0,
          per_kg: 2,
          inr_amount: 0,
          currency: "24",
          enquiry_id: spotData?.id,
          sac_code: "",
        },
      ]);
    } else {
      showAlert("Please Provide Details First", "warning");
    }
  };

  // handling addrow here buying
  const addRow2 = () => {
    const excludedKeys = ["sell_rate"]; // Add keys you want to exclude

    const isAllFilled = buycharges.every((item: any) =>
      Object.entries(item).every(([key, value]) =>
        excludedKeys.includes(key)
          ? true
          : value !== "" && value !== null && value !== undefined && value !== 0
      )
    );
    if (isAllFilled) {
      const newdata = [...buycharges];
      setBuyCharges([
        ...buycharges,
        {
          charge_id: "",

          weight: spotData?.weight || 0,
          rate: 0,
          per_kg: 2,
          inr_amount: 0,
          currency: "24",
          enquiry_id: spotData?.id,
          party_type: "",
          ex_rate: "1",
          pp_cc: "1",
          party: "",
          party_name: "",
          sac_code: "",
        },
      ]);
    } else {
      showAlert("Please Provide Details First", "warning");
    }
  };

  const findrate = (charge_id: any) => {
    const masterCharge = chargesdata.find(
      (master) => master.charge_id == charge_id
    );

    // Find the corresponding selling charge
    const sellCharge = sellingcharges.find(
      (sell) => sell.charge_id == masterCharge?.ref_sell_id
    );

    return Number(sellCharge?.inr_amount) || 0;
  };
  // handling exchangereate data

  const handleexchangerate = (
    index?: any,
    forwhat?: string,
    value?: string
  ) => {
    const data: any = [...exchangedata];
    data[index][forwhat] = value;
    // if(value=="24"){
    //   data[index]["ex_rate"]=1
    // }else{
    //   data[index]["ex_rate"]=""
    // }
    setExchangedata(data);
  };

  return (
    <>
      <div className="box 2xl:p-5 xl:p-5  md:p-5 sm:p-2 p-2 mt-5 border border-gray-200 shadow-lg ">
        {!isRead && toggle == 2 ? (
          <div className="border border-gray-200 shadow-lg p-2 w-[100%] m-auto mb-4 min-[759px]:grid grid-cols-3 gap-2">
            {exchangedata?.map((item: any, index: number) => {
              // Extract already selected currency IDs except the current one to allow re-selection in the same row
              const selectedCurrencyIds = exchangedata
                .map((ex: any, i: number) =>
                  i !== index ? ex.currency_id : null
                ) // Exclude current row's selection
                .filter(Boolean); // Remove null/empty values

              return (
                <div key={index} className="col-span-1 gap-2 mb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      {/* {index === 0 && ( */}
                      <FormLabel>
                        {index + 1}
                        {index == 0 ? "st" : index == 1 ? "nd" : "rd"} Currency
                        {index == 0 && <span className="text-red-400">*</span>}
                      </FormLabel>
                      {/* )} */}
                      <FormSelect
                        onChange={(e: any) =>
                          handleexchangerate(
                            index,
                            "currency_id",
                            e.target.value
                          )
                        }
                        disabled={index == 0}
                        value={item?.currency_id}
                      >
                        {/* <option value="">Select</option> */}
                        {currencydata
                          .filter(
                            (item2: any) =>
                              !selectedCurrencyIds.includes(String(item2.id))
                          ) // Ensure same type comparison
                          .map((item2: any) => (
                            <option key={item2?.id} value={item2?.id}>
                              {item2?.currency}
                            </option>
                          ))}
                      </FormSelect>
                    </div>

                    <div>
                      {/* {index === 0 && ( */}
                      <FormLabel>
                        Exchange Rate ({index + 1})
                        {index == 0 && <span className="text-red-400">*</span>}
                      </FormLabel>

                      <FormInput
                        disabled={index == 0}
                        onChange={(e: any) => {
                          let newValue = e.target.value
                            .replace(/[^0-9.]/g, "")
                            .replace(/(\..*)\./g, "$1"); // Remove non-numeric characters

                          // Prevent leading zeros
                          if (newValue.startsWith("0") && newValue.length > 1) {
                            newValue = newValue.replace(/^0+/, ""); // Remove leading zeros
                          }
                          handleexchangerate(index, "ex_rate", newValue);
                        }}
                        min="0"
                        type="text"
                        placeholder="Enter Exchange rate"
                        value={item?.ex_rate}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          ""
        )}
        {userdata?.type_id == 8 ||
        userdata?.type_id == 6 ||
        userdata?.type_id == 9 ? (
          <div className="min-[767px]:flex justify-between mb-2">
            <div className="flex">
              <Button
                className={`p-2 mt-5 ${
                  toggle == 1 ? "bg-mustard" : "bg-gray-400"
                }  text-white`}
                onClick={() => {
                  setToggle(1);
                }}
              >
                {" "}
                Selling Charges
              </Button>
              {userdata?.type_id == 8 || userdata?.type_id == 9 ? (
                <Button
                  onClick={() => {
                    setToggle(2);
                    // setHasUpdated(true);
                  }}
                  className={`p-2 mt-5   ml-2 ${
                    toggle == 2 ? "bg-mustard" : "bg-gray-400"
                  }  text-white`}
                >
                  {" "}
                  Buying Charges{" "}
                </Button>
              ) : (
                ""
              )}
            </div>
            {spotData?.incoterm == 2 && !isRead ? (
              <div className="flex ">
                <MdWarning
                  className={`text-yellow-400 mt-[33px] ${styles["animate-blink"]}`}
                />
                <p
                  className={`text-yellow-400 mt-8 ${styles["animate-blink"]}`}
                >
                  Attention
                </p>
                <p className={`text-green-400 mt-8 ${styles["animate-blink"]}`}>
                  : This is a Duty Shipment. Please ensure you enter the custom
                  duty charges accurately before proceeding.
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}

        {toggle == 1 ? (
          <div className="max-[982px]:overflow-auto">
            <Table className="whitespace-nowrap ">
              {/* Table headers */}
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="px-2 py-2 text-center">
                    <div className="flex justify-center items-center">
                      <p className="flex ">
                        {!isRead ? (
                          <Plus
                            onClick={() => {
                              addRow();
                              // setHasUpdated(true);
                            }}
                            className="w-[24px] h-[24px] bg-green-400 text-white p-[3px] rounded-sm mr-1 cursor-pointer"
                          />
                        ) : (
                          ""
                        )}
                        {!isRead ? (
                          <Minus
                            onClick={() => {
                              if (sellingcharges?.length > 1) {
                                const newdata = [...sellingcharges];
                                newdata.pop();
                                setSellingCharges(newdata);
                                // if (
                                //   newdata[newdata?.length - 1]["charge_id"] !=
                                //     32 ||
                                //   !forwhat
                                // ) {
                                //   newdata.pop();
                                //   setSellingCharges(newdata);
                                // } else {
                                //   showAlert(
                                //     "Custom Charge is compulsory",
                                //     "warning"
                                //   );
                                // }
                              }
                            }}
                            className="w-[24px] h-[24px] bg-red-500 text-white p-[3px] rounded-sm mr-1 cursor-pointer"
                          />
                        ) : (
                          ""
                        )}
                        CHARGES
                      </p>
                    </div>
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">RATE</Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    RATE TYPE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center ">
                    WEIGHT/UNIT
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    CURRENCY
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    EX-RATE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    INR AMOUNT
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center min-w-[70px]">GST %</Table.Th>
                  <Table.Th className="px-1 py-1 text-center min-w-[110px]">TOTAL AMT</Table.Th>

                  {!isRead ? (
                    <Table.Th className="px-1 py-1 text-center">
                      ACTION
                    </Table.Th>
                  ) : (
                    ""
                  )}
                </Table.Tr>
              </Table.Thead>

              {/* Table body */}

              {sellingcharges.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className="px-1 py-1 w-[20%]">
                    {isRead ? (
                      <FormInput
                        disabled
                        value={
                          chargesdata?.find(
                            (item: any) => item?.ref_sell_id == row?.charge_id
                          )?.charge_name
                        }
                      />
                    ) : (
                      <FormSelect
                        className="border w-full border-gray-300 rounded-lg"
                        value={`${row?.charge_id}`}
                        name="charge_id"
                        // disabled={index !== 0}
                        // options={{
                        //   placeholder: "Search Search",
                        // }}
                        //                       onBlur={(e:any)=>{
                        //                         const value=e.target.value
                        //                         if(spotData?.incoterm==4&&forwhat){
                        // if(value==32){
                        //   const singledata=sellingcharges?.find((item2:any)=>item2?.charge_id==value)
                        //   if(singledata?.charge_id){
                        //     const newdata=[...sellingcharges]
                        //     newdata[index]['charge_id']=""
                        //     setSellingCharges(newdata)
                        //     showAlert("Duplicate entry not allowed","warning")
                        //   }
                        // }
                        //                         }
                        //                       }}
                        disabled={isRead}
                        onChange={(e: any) => {
                          const value = e.target.value;

                          if (value) {
                            handleSelectChange(
                              index,
                              "charge_id",
                              e.target.value
                            );
                          }
                        }}
                      >
                        <option value={0}>Select Charge</option>
                        {chargesdata
                          .sort((a: any, b: any) =>
                            a.charge_name.localeCompare(b.charge_name)
                          )
                          .map((item: any) => (
                            <option
                              className="w-full"
                              key={item.ref_sell_id}
                              value={item?.ref_sell_id}
                            >
                              {item?.charge_name}
                            </option>
                          ))}
                      </FormSelect>
                    )}
                  </Table.Td>

                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      min="0"
                      placeholder="Rate"
                      value={row?.rate}
                      name="rate"
                      disabled={
                        !Number(row?.charge_id) || row?.is_edit || isRead
                      }
                      onChange={(e: any) => {
                        let newValue = e.target.value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*)\./g, "$1"); // Remove non-numeric characters

                        // Prevent leading zeros
                        if (newValue.startsWith("0") && newValue.length > 1) {
                          newValue = newValue.replace(/^0+/, ""); // Remove leading zeros
                        }
                        handleSelectChange(index, "rate", newValue);
                      }}
                      className="w-full text-right p-2 border border-gray-300  rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      value={row?.per_kg}
                      disabled={isRead}
                      onChange={(e: any) => {
                        handleSelectChange(index, "per_kg", e.target.value);
                      }}
                    >
                      <option value="2">Absolute</option>
                      <option value="1">Per Kg/Piece</option>
                    </FormSelect>
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      min="0"
                      disabled={
                        !sellingcharges[index]["charge_id"] ||
                        row?.per_kg == 2 ||
                        isRead
                      }
                      onChange={(e: any) => {
                        handleSelectChange(index, "weight", e.target.value);
                      }}
                      value={row?.per_kg == 2 ? 1 : row?.weight}
                      className="text-right w-full p-2 border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      value={currencydata?.find((c: any) => c.id == row?.currency)?.currency || "INR"}
                      disabled
                      onChange={(e: any) => {
                        handleSelectChange(index, "currency", e.target.value);
                      }}
                      className="w-full p-2 border border-gray-300  rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      value={row?.ex_rate || "1"}
                      disabled
                      className="w-full p-2 text-right border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      value={formatIndianNumber(Number(row?.inr_amount))}
                      disabled
                      onChange={(e: any) => {
                        handleSelectChange(index, "inr_amount", e.target.value);
                      }}
                      className="w-full p-2 text-right border border-gray-300  rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1 min-w-[70px]">
                    <FormInput
                      type="text"
                      value={(() => {
                        if (!row?.charge_id) return "-";
                        const singleF = franchiseedata?.find((f: any) => f?.franchisee_id == spotData?.pickup_franchisee_id);
                        const zeroGST = singleF?.gst_status == 4 || singleF?.is_overseas || spotData?.import_booking == 3;
                        if (zeroGST) return "0%";
                        const chargeInfo = chargesdata?.find((c: any) => c.ref_sell_id == row?.charge_id);
                        const igst = chargeInfo?.tax_breakup?.igst;
                        return igst != null ? `${parseFloat(igst)}%` : "-";
                      })()}
                      disabled
                      className="w-full p-2 text-center border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1 min-w-[110px]">
                    <FormInput
                      type="text"
                      value={(() => {
                        const inr = parseFloat(Number(row?.inr_amount).toFixed(3));
                        if (!row?.charge_id || row?.charge_id == 162) return formatIndianNumber(inr);
                        const singleF = franchiseedata?.find((f: any) => f?.franchisee_id == spotData?.pickup_franchisee_id);
                        const zeroGST = singleF?.gst_status == 4 || singleF?.is_overseas || spotData?.import_booking == 3;
                        if (zeroGST) return formatIndianNumber(inr);
                        const chargeInfo = chargesdata?.find((c: any) => c.ref_sell_id == row?.charge_id);
                        const igstRate = parseFloat(chargeInfo?.tax_breakup?.igst || "18") / 100;
                        return formatIndianNumber(parseFloat((inr + inr * igstRate).toFixed(3)));
                      })()}
                      disabled
                      className="w-full p-2 text-right border border-gray-300 rounded"
                    />
                  </Table.Td>

                  {!isRead ? (
                    <Table.Td className="">
                      <div className="h-[100%] flex justify-center items-center">
                        <Button
                          disabled={row?.is_edit}
                          onClick={() => {
                            removeRow(index);
                            // if (
                            //   sellingcharges[index]["charge_id"] != 32 ||
                            //   !forwhat
                            // ) {
                            //   removeRow(index);
                            // } else {
                            //   showAlert("This Charge is compulsory", "warning");
                            // }
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="text-red-400" />
                        </Button>
                        {/* <button
                            onClick={() => handleInputChange(index)}
                            className="text-green-500 hover:text-green-700 ml-2"
                          >
                            <Pencil />
                          </button> */}
                      </div>
                    </Table.Td>
                  ) : (
                    ""
                  )}
                </Table.Tr>
              ))}
            </Table>
          </div>
        ) : (
          ""
        )}

        {toggle == 2 ? (
          <div className="overflow-auto w-full h-[30vh] ">
            <Table className="whitespace-nowrap ">
              {/* Table headers */}
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="px-2 py-2 text-center">
                    <div className="flex justify-center items-center ">
                      <p className="flex ">
                        {!isRead ? (
                          <Plus
                            onClick={() => {
                              addRow2();
                              // setHasUpdated(true);
                            }}
                            className="w-[24px] h-[24px] bg-green-400 text-white p-[3px] rounded-sm mr-1 cursor-pointer"
                          />
                        ) : (
                          ""
                        )}
                        {!isRead ? (
                          <Minus
                            onClick={() => {
                              if (buycharges?.length > 1) {
                                const newdata = [...buycharges];
                                newdata.pop();
                                setBuyCharges(newdata);
                              }
                            }}
                            className="w-[24px] h-[24px] bg-red-500 text-white p-[3px] rounded-sm mr-1 cursor-pointer"
                          />
                        ) : (
                          ""
                        )}
                        CHARGES
                      </p>
                    </div>
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center w-[7%] ">
                    {" "}
                    PP/CC
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    SELL RATE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    BUY RATE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center w-[7%]">
                    RATE TYPE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center  ">
                    WEIGHT/UNIT
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center ">
                    CURRENCY
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center ">
                    EX-RATE
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center">
                    INR AMOUNT
                  </Table.Th>
                  <Table.Th className="px-1 py-1 text-center min-w-[70px]">GST %</Table.Th>
                  <Table.Th className="px-1 py-1 text-center min-w-[110px]">TOTAL AMT</Table.Th>

                  <Table.Th className="px-1 py-1 text-center ">
                    PARTY TYPE
                  </Table.Th>

                  <Table.Th className="px-1 py-1 text-center w-[10%] ">
                    PARTY
                  </Table.Th>

                  {/* <Table.Th className="px-1 py-1 text-center">EXRATE</Table.Th> */}
                  {/* <Table.Th className="px-1 py-1 text-center">
                    PAYABLE TO
                  </Table.Th> */}
                  {!isRead ? (
                    <Table.Th className="px-1 py-1 text-center">
                      ACTION
                    </Table.Th>
                  ) : (
                    ""
                  )}
                </Table.Tr>
              </Table.Thead>

              {/* Table body */}

              {buycharges.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className="px-1 py-1 w-[10%]">
                    {isRead ? (
                      <FormInput
                        disabled
                        value={
                          chargesdata?.find(
                            (item: any) => item?.charge_id == row?.charge_id
                          )?.charge_name
                        }
                      />
                    ) : (
                      <FormSelect
                        className="border w-full border-gray-300 rounded-lg"
                        value={row?.charge_id}
                        name="charge_id"
                        // disabled={index !== 0}
                        options={{
                          placeholder: "Search Search",
                        }}
                        disabled={isRead}
                        onChange={(e: any) => {
                          const value = e.target.value;

                          const singledata = chargesdata.find(
                            (item2: any) => item2.charge_id == value
                          );
                          const singledata2 = sellingcharges.find(
                            (item2: any) =>
                              item2?.charge_id == singledata?.ref_sell_id
                          );

                          if (value) {
                            handleSelectChange2(index, "charge_id", value);
                          }
                        }}
                      >
                        <option value={0}>Select Charge</option>
                        {chargesdata
                          .sort((a: any, b: any) =>
                            a.charge_name.localeCompare(b.charge_name)
                          )
                          .map((item: any) => (
                            <option
                              className="w-full"
                              key={item.charge_id}
                              value={item?.charge_id}
                            >
                              {item?.charge_name}
                            </option>
                          ))}
                      </FormSelect>
                    )}
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      value={row?.pp_cc}
                      disabled={isRead}
                      onChange={(e: any) => {
                        handleSelectChange2(index, "pp_cc", e.target.value);
                      }}
                    >
                      <option value="1">PP</option>
                      <option value="2">CC</option>
                    </FormSelect>
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      min="0"
                      value={formatIndianNumber(findrate(row?.charge_id)) || 0}
                      // name="rate
                      disabled
                      onChange={(e: any) => {
                        handleSelectChange2(index, "rate", e.target.value);
                      }}
                      className="text-right w-full p-2 border border-gray-300  rounded"
                    />
                  </Table.Td>

                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      min="0"
                      disabled={isRead}
                      placeholder="Buy Rate"
                      value={row?.rate}
                      name="rate"
                      onChange={(e: any) => {
                        let newValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                        // Prevent leading zeros
                        if (newValue.startsWith("0") && newValue.length > 1) {
                          newValue = newValue.replace(/^0+/, ""); // Remove leading zeros
                        }

                        handleSelectChange2(index, "rate", newValue);
                      }}
                      className="text-right w-full p-2 border border-gray-300  rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      value={row?.per_kg}
                      disabled={!row?.currency || !row?.charge_id || isRead}
                      onChange={(e: any) => {
                        handleSelectChange2(index, "per_kg", e.target.value);
                      }}
                    >
                      <option value="2">Abs</option>
                      <option value="1">Per Kg/Piece</option>
                    </FormSelect>
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      min="0"
                      disabled={
                        !buycharges[index]["charge_id"] ||
                        row?.per_kg == 2 ||
                        isRead
                      }
                      // onBlur={(e: any) => {
                      //   const value = e.target.value;
                      //   if (!CheckNumberOrEMail(value,"num")) {
                      //     const newdata = [...buycharges];
                      //     newdata[index]["weight"] = "";
                      //     setBuyCharges(newdata);
                      //   }
                      // }}
                      onChange={(e: any) => {
                        let newValue = e.target.value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*)\./g, "$1"); // Remove non-numeric characters

                        // Prevent leading zeros
                        if (newValue.startsWith("0") && newValue.length > 1) {
                          newValue = newValue.replace(/^0+/, ""); // Remove leading zeros
                        }
                        handleSelectChange2(index, "weight", newValue);
                      }}
                      value={row?.per_kg == 2 ? 1 : row?.weight}
                      className="text-right w-full p-2 border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      onBlur={(e: any) => {
                        const value = e.target.value;
                        const singledata = exchangedata.find(
                          (ex: any) => ex.currency_id == value
                        );

                        if (value && !singledata?.ex_rate) {
                          showAlert(
                            "Please Provide exchange rate against this currency",
                            "warning"
                          );
                          const newdata = [...buycharges];
                          newdata[index]["currency"] = "";
                        }
                      }}
                      onChange={(e: any) => {
                        handleSelectChange2(index, "currency", e.target.value);
                      }}
                      className="w-full p-2 border border-gray-300  rounded"
                      value={row?.currency}
                      disabled={isRead}
                    >
                      <option value="">Select</option>

                      {currencydata?.length
                        ? currencydata
                            .filter((item2: any) => {
                              const ids = exchangedata
                                ?.map((ex: any) => String(ex.currency_id))
                                .filter(Boolean);

                              return ids.includes(String(item2.id)); // Convert to string for comparison
                            })
                            .map((item: any) => (
                              <option key={item?.id} value={item?.id}>
                                {item?.currency}
                              </option>
                            ))
                        : ""}
                    </FormSelect>
                    {/* <FormInput
                      type="text"
                      value={row?.currency}
                      disabled
                      onChange={(e: any) => {
                        handleSelectChange2(index, "currency", e.target.value);
                      }}
                      className="w-full p-2 border border-gray-300  rounded"
                    /> */}
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      value={formatIndianNumber(Number(row?.ex_rate)) || 1}
                      disabled
                      onChange={(e: any) => {
                        handleSelectChange2(index, "ex_rate", e.target.value);
                      }}
                      className="text-right w-full p-2 border border-gray-300  rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      value={formatIndianNumber(Number(row?.inr_amount))}
                      disabled
                      onChange={(e: any) => {
                        handleSelectChange2(
                          index,
                          "inr_amount",
                          e.target.value
                        );
                      }}
                      className="text-right w-full p-2 border border-gray-300  rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1 min-w-[70px]">
                    <FormInput
                      type="text"
                      value={(() => {
                        const chargeInfo = chargesdata?.find((c: any) => c.charge_id == row?.charge_id);
                        const igst = chargeInfo?.tax_breakup?.igst;
                        return row?.charge_id ? (igst != null ? `${parseFloat(igst)}%` : "-") : "-";
                      })()}
                      disabled
                      className="w-full p-2 text-center border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1 min-w-[110px]">
                    <FormInput
                      type="text"
                      value={(() => {
                        const inr = parseFloat(Number(row?.inr_amount).toFixed(3));
                        if (!row?.charge_id || row?.charge_id == 163) return formatIndianNumber(inr);
                        const singleF = franchiseedata?.find((f: any) => f?.franchisee_id == spotData?.pickup_franchisee_id);
                        const zeroGST = singleF?.gst_status == 4;
                        if (zeroGST) return formatIndianNumber(inr);
                        const chargeInfo = chargesdata?.find((c: any) => c.charge_id == row?.charge_id);
                        const igstRate = parseFloat(chargeInfo?.tax_breakup?.igst || "18") / 100;
                        return formatIndianNumber(parseFloat((inr + inr * igstRate).toFixed(3)));
                      })()}
                      disabled
                      className="w-full p-2 text-right border border-gray-300 rounded"
                    />
                  </Table.Td>

                  <Table.Td className="px-1 py-1">
                    {isRead ? (
                      <FormInput
                        disabled
                        value={
                          alltypedata.find(
                            (item2: any) => item2?.ctd_id == row?.party_type
                          )?.ctype_name || ""
                        }
                      />
                    ) : (
                      <FormSelect
                        value={row?.party_type}
                        disabled={!row?.charge_id}
                        onChange={(e: any) => {
                          handleSelectChange2(
                            index,
                            "party_type",
                            e.target.value
                          );
                          const data = [...buycharges];
                          data[index]["party"] = "";
                          data[index]["party_name"] = "";
                          setBuyCharges(data);
                        }}
                      >
                        <option value="">Select</option>
                        {alltypedata?.length >= 1
                          ? alltypedata?.map((item: any) => (
                              <option value={item?.ctd_id}>
                                {item?.ctype_name}
                                {item?.ct_id == 1
                                  ? "(C)"
                                  : item?.ct_id == 2
                                  ? "(V)"
                                  : ""}
                              </option>
                            ))
                          : ""}
                      </FormSelect>
                    )}
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    {buycharges[index]["party_type"] && !isRead ? (
                      <CommonSearchArr
                        apiEndpoint={`admin/vendor-settings?c_type=${buycharges[index]["party_type"]}`}
                        placeholder={"Search"}
                        buycharges={buycharges}
                        setBuyCharges={setBuyCharges}
                        fun1={fun1}
                        comingselectedname={"party_name"}
                        comingselectedid={"party"}
                        funtoempty={funtoempty}
                        key1={"key"}
                        index={index}
                        questionmark={true}
                        zIndex={"20"}
                      />
                    ) : isRead && !buycharges[index]["party_type"] ? (
                      <FormInput placeholder="Search " disabled />
                    ) : (
                      <FormInput
                        value={
                          allvendordropdowndata?.find(
                            (item: any) => item?.vendor_id == row?.party
                          )?.vendor_name
                        }
                        disabled
                      />
                    )}
                  </Table.Td>

                  {/* <Table.Td className="px-1 py-1">
                    <FormInput
                      placeholder="Ex-Rate"
                      value={row?.ex_rate}
                      onChange={(e: any) => {
                        handleSelectChange2(index, "ex_rate", e.target.value);
                      }}
                    />
                  </Table.Td> */}
                  {!isRead ? (
                    <Table.Td className="">
                      <div className="h-[100%] flex justify-center items-center">
                        <Button
                          disabled={row?.is_edit}
                          onClick={() => removeRow2(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="text-red-400" />
                        </Button>
                        {/* <button
                            onClick={() => handleInputChange(index)}
                            className="text-green-500 hover:text-green-700 ml-2"
                          >
                            <Pencil />
                          </button> */}
                      </div>
                    </Table.Td>
                  ) : (
                    ""
                  )}
                </Table.Tr>
              ))}
            </Table>
          </div>
        ) : (
          ""
        )}

        <div className="">
          {/* <div className="text-right min-[767px]:w-[50%] max-[767px]:mt-2 min-[417px]:grid grid-cols-3 gap-2">
              <div>
                <FormLabel>Total Amt (Rs.): </FormLabel>
                <FormInput
                  disabled
                  value={
                    toggle == 2
                      ? formatIndianNumber(Number(totalbuy))
                      : formatIndianNumber(Number(totalSell))
                  }
                />
              </div>
              <div>
                <FormLabel>GST (18%) (Rs.): </FormLabel>
                <FormInput
                  disabled
                  value={
                    toggle == 2
                      ? formatIndianNumber(Number(totalbuy) * 0.18)
                      : formatIndianNumber(Number(totalSell) * 0.18)
                  }
                />
              </div>
              <div>
                <FormLabel>Sub-Total (Rs.) : </FormLabel>
                <FormInput
                  disabled
                  value={
                    toggle == 2
                      ? formatIndianNumber(
                          Number(totalbuy) + Number(totalbuy) * 0.18
                        )
                      : formatIndianNumber(
                          Number(totalSell) + Number(totalSell) * 0.18
                        )
                  }
                />
              </div>
            </div> */}
        </div>

        {/* <div ref={bottomRef} className="h-1"></div> */}
      </div>
    </>
  );
};

export default CSForm;
