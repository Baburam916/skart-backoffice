import { ShoppingBag, ClipboardCheck, Trash2, Plus, Minus } from "lucide-react";
import { FormInput, FormLabel } from "../../../../base-components/Form";
import Table from "../../../../base-components/Table";
import { Tab } from "../../../../base-components/Headless";
import TomSelect from "../../../../base-components/TomSelect/index";
import { FormSelect } from "../../../../base-components/Form";
import { useLogin } from "../../commoncomponents/LoginContextProvider/LoginContextProvider";
import Button from "../../../../base-components/Button";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import { useEffect, useRef, useState } from "react";
import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";
import CommonSearchArr from "../../Spotprice/commonsearcharr";
import { formatIndianNumber } from "../../commoncomponents/CommonNumberConverter/CommonNumberconverter";
import { CheckNumberOrEMail } from "../../commoncomponents/CheckNumberorMail/commoncheckNumberoremail";
import { MdWarning } from "react-icons/md";
import styles from "./spotenquiry.module.css";
import ReportCommonTable from "../../commoncomponents/CommonForReports/ReportscommonTable";
import { checkstatus } from "../../Spotprice/checkstatus";
import { BsPlus } from "react-icons/bs";
import CommonModal from "../../commoncomponents/CommonModal/CommonModal";
import Tippy from "../../../../base-components/Tippy";

const limitToThreeDecimals = (value: string): string => {
  const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const dotIdx = v.indexOf(".");
  if (dotIdx !== -1 && v.length - dotIdx - 1 > 3) {
    return v.slice(0, dotIdx + 4);
  }
  return v;
};

const SellBuyForm = (props: any) => {
  const bottomRef = useRef(null);

  const {
    chargesdata,
    spotData,
    sellingcharges,
    setSellingCharges,
    buycharges,
    setBuyCharges,
    singlefranchiseedata,
    extrakeybuy,
    extrakeysell,
    currencydata,
    fun1,
    addedbuyingcharges,
    addedsellingcharges,
    funtoempty,
    exchangedata,
    setExchangedata,
    exchangedataSell,
    setExchangedataSell,
    totalbuy,
    totalSell,
    toggle,
    setToggle,
    getchweight,
    alltypedata,
    forwhat,
    hasUpdated,
    setHasUpdated,
    additonalList,
    disableExchangeSell,
    importBookingType,
    hideSelling = false,
    hideBuying = false
  } = props;
  const { showAlert } = useAlert();
  const { userdata } = useLogin();
  const [remarksModal, setRemarkModal] = useState<boolean>(false);
  const [singlechargedata, setSingleChargeData] = useState<any>("");
  const [singlechargedatatippy, setSingleChargeDatatippy] = useState<any>("");
  const [tippymodal, setTippyModal] = useState<boolean>(false);
  // const hasUpdated = useRef(false);
  useEffect(() => {
    if (!hasUpdated) {
      return; // Prevent scrolling on initial API response
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sellingcharges, hasUpdated]);

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
    let newFormData2;
    if (forwhat == "pricing") {
      newFormData2 = [...buycharges];
    }
    if (field == "charge_id") {
      const singledata = chargesdata?.find(
        (item: any) => item.ref_sell_id == value
      );

      newFormData[index]["charge_id"] = value;
      newFormData[index]["enquiry_id"] = spotData?.id;
      newFormData[index]["sac_code"] = singledata["hsn_code"];
      setSellingCharges(newFormData);

      const findchargeids = (id: any, id2?: any) => {
        const sellingdataids = newFormData
          ?.filter((item: any) => item?.charge_id == id)
          ?.map((item: any) => item?.charge_id);

        const buychargesids = chargesdata
          .filter((item: any) => sellingdataids.includes(item?.ref_sell_id))
          ?.map((item: any) => item?.charge_id);

        return buychargesids.includes(id2);
      };

      if (spotData?.forwhat == "pricing" || spotData?.forwhat == "cs") {
        let newdata;

        if (findchargeids(value, singledata?.charge_id)) {
          // Case 1: exists → keep existing buycharges as is
          newdata = [...buycharges];
        } else {
          // Case 2: not exists → add a new object
          // logic for cs
       
          if (
            !buycharges[buycharges?.length - 1]?.charge_id &&
            buycharges?.length == 1
          ) {
            newdata = [
              {
                charge_id: singledata?.charge_id,
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
                sac_code: singledata?.hsn_code,
              },
            ];
          } else {
            newdata = [
              ...buycharges,
              {
                charge_id: singledata?.charge_id,
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
                sac_code: singledata?.hsn_code,
              },
            ];
          }
        }
        const uniqueData = Object.values(
          newdata.reduce((acc: any, item: any) => {
            // normalize charge_id to number so "29" and 29 are same
            const id = Number(item.charge_id);

            // if not already stored, keep it
            if (!acc[id]) {
              acc[id] = { ...item, charge_id: id };
            }
            return acc;
          }, {})
        );
        setBuyCharges(uniqueData);
      }
    } else {
      // For overseas sell rows: always lock to franchisee currency and exchange rate
      if (singlefranchiseedata?.is_overseas) {
        newFormData[index]["currency"] = String(singlefranchiseedata?.currency || "24");
        newFormData[index]["ex_rate"] = String(singlefranchiseedata?.exchange_rate || "1");
      }
      if (field == "per_kg") {
        const singledata = chargesdata?.find(
          (item: any) => item.ref_sell_id == newFormData[index]?.charge_id
        );
        const sellingchargesids = newFormData?.map(
          (item: any) => item?.charge_id
        );
        if (value == "1") {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
              Number(newFormData[index]["weight"]) *
              (Number(newFormData[index]["ex_rate"]) || 1) || 0;
          setSellingCharges(newFormData);

          if (spotData?.forwhat == "pricing") {
            const newdata = newFormData2?.map((item: any) => {
              return sellingchargesids.includes(item?.charge_id)
                ? {
                    ...item,
                    charge_id: singledata?.charge_id,
                    [field]: value,
                    inr_amount:
                      Number(item?.rate) *
                        Number(item?.weight) *
                        (Number(newFormData2[index]["ex_rate"]) || 1) || 0,
                  }
                : item;
            });

            setBuyCharges(newdata);
          }
        } else {
          newFormData[index][field] = value || 0;
          newFormData[index]["weight"] = 1;
          newFormData[index]["inr_amount"] = Number(newFormData[index]["rate"]) * (Number(newFormData[index]["ex_rate"]) || 1) || 0;
          setSellingCharges(newFormData);

          if (spotData?.forwhat == "pricing") {
            const newdata = newFormData2?.map((item: any) => {
              return sellingchargesids.includes(item?.charge_id)
                ? {
                    ...item,
                    charge_id: singledata?.charge_id,
                    weight: 1,
                    [field]: value,
                    inr_amount:
                      Number(item?.weight) * (Number(item["ex_rate"]) || 1) ||
                      0,
                  }
                : item;
            });
            newFormData[index][field] = value || 0;
            newFormData[index]["weight"] = 1;
            newFormData[index]["inr_amount"] =
              newFormData[index]["rate"] *
                (Number(newFormData[index]["ex_rate"]) || 1) || 0;
            setBuyCharges(newFormData);
            setBuyCharges(newdata);
          }
        }
      } else if (field == "rate") {
        const singledata = chargesdata?.find(
          (item: any) => item.ref_sell_id == newFormData[index]?.charge_id
        );

        if (newFormData[index]["per_kg"] == 1) {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
              Number(newFormData[index]["weight"]) *
              (Number(newFormData[index]["ex_rate"]) || 1) || 0;
          setSellingCharges(newFormData);
          if (spotData?.forwhat == "pricing") {
            const sellingchargesids = newFormData?.map(
              (item: any) => item?.charge_id
            );
            const newdata = newFormData2?.map((item: any) => {
              return sellingchargesids.includes(item?.charge_id)
                ? {
                    ...item,
                    charge_id: singledata?.charge_id,
                    [field]: value,
                    inr_amount:
                      Number(value) *
                        Number(item?.weight) *
                        (Number(newFormData[index]["ex_rate"]) || 1) || 0,
                  }
                : item;
            });

            setBuyCharges(newdata);
          }
        } else {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] = Number(newFormData[index]["rate"]) * (Number(newFormData[index]["ex_rate"]) || 1) || 0;
          setSellingCharges(newFormData);
          if (spotData?.forwhat == "pricing") {
            const newdata = newFormData2?.map((item: any) =>
              item?.charge_id == newFormData[index]["charge_id"]
                ? {
                    ...item,
                    charge_id: singledata?.charge_id,
                    [field]: value,
                    inr_amount: Number(value) || 0,
                  }
                : item
            );
            setBuyCharges(newdata);
          }
        }
      } else if (field == "weight") {
        const singledata = chargesdata?.find(
          (item: any) => item.ref_sell_id == newFormData[index]?.charge_id
        );
        if (newFormData[index]["per_kg"] == 1) {
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
              Number(newFormData[index]["weight"]) *
              (Number(newFormData[index]["ex_rate"]) || 1) || 0;
          setSellingCharges(newFormData);
          if (spotData?.forwhat == "pricing") {
            const newdata = newFormData2?.map((item: any) =>
              item?.charge_id == newFormData[index]["charge_id"]
                ? {
                    ...item,
                    charge_id: singledata?.charge_id,
                    [field]: value,
                    inr_amount:
                      Number(item?.rate) *
                        Number(value) *
                        (Number(item["ex_rate"]) || 1) || 0,
                  }
                : item
            );
            setBuyCharges(newdata);
          }
        } else {
          newFormData[index][field] = 1;
          newFormData[index]["inr_amount"] = Number(newFormData[index]["rate"]) * (Number(newFormData[index]["ex_rate"]) || 1) || 0;
          setSellingCharges(newFormData);
          if (spotData?.forwhat == "pricing") {
            const newdata = newFormData2?.map((item: any) =>
              item?.charge_id == newFormData[index]["charge_id"]
                ? {
                    ...item,
                    charge_id: singledata?.charge_id,
                    [field]: value,
                    inr_amount: Number(item?.rate) * Number(item?.ex_rate) || 0,
                  }
                : item
            );
            setBuyCharges(newdata);
          }
        }
      } else if (field == "currency") {
        const exRateFromSell = Number(exchangedataSell?.find((item: any) => item?.currency_id == value)?.ex_rate) || 0;
        if (newFormData[index]["per_kg"] == 1) {
          newFormData[index]["ex_rate"] = exRateFromSell;
          newFormData[index][field] = value || 0;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) *
            Number(newFormData[index]["weight"]) *
            (exRateFromSell || 1);
          setSellingCharges(newFormData);
        } else {
          newFormData[index][field] = value || 0;
          newFormData[index]["ex_rate"] = exRateFromSell;
          newFormData[index]["inr_amount"] =
            Number(newFormData[index]["rate"]) * exRateFromSell;
          setSellingCharges(newFormData);
        }

        // Propagate currency + ex_rate to the corresponding buying charge
        if (buycharges && setBuyCharges) {
          const linkedBuyChargeId = chargesdata?.find(
            (item: any) => item.ref_sell_id == newFormData[index]?.charge_id
          )?.charge_id;
          const exRateFromBuy =
            Number(exchangedata?.find((item: any) => item?.currency_id == value)?.ex_rate) ||
            exRateFromSell ||
            0;
          const updatedBuyCharges = buycharges.map((charge: any) => {
            if (String(charge.charge_id) === String(linkedBuyChargeId)) {
              const inrAmount =
                charge.per_kg == 1
                  ? Number(charge.rate) * Number(charge.weight) * (exRateFromBuy || 1)
                  : Number(charge.rate) * exRateFromBuy;
              return { ...charge, currency: value, ex_rate: String(exRateFromBuy), inr_amount: inrAmount };
            }
            return charge;
          });
          setBuyCharges(updatedBuyCharges);
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

  //  deleting particuar row selling
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
    if (buycharges?.length == 1) {
      let newobj: any = {
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
      };
      if (extrakeybuy) {
        newobj[extrakeybuy] = 0;
      }
      setBuyCharges([newobj]);
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
      "party_type",
      "remarks",
      "is_duty"
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
      let newobj: any = {
        charge_id: "",

        weight: spotData?.weight || 0,
        rate: 0,
        per_kg: 2,
        inr_amount: 0,
        currency: singlefranchiseedata?.is_overseas ? String(singlefranchiseedata?.currency || "24") : "24",
        ex_rate: singlefranchiseedata?.is_overseas ? String(singlefranchiseedata?.exchange_rate || "1") : "1",
        enquiry_id: spotData?.id,
        sac_code: "",
        remarks: "",
      };
      if (extrakeybuy) {
        newobj[extrakeybuy] = 0;
      }
      if (extrakeysell) {
        newobj[extrakeysell] = 0;
      }
      setSellingCharges([...sellingcharges, newobj]);
      // setBuyCharges([
      //   ...buycharges,
      //   {
      //     charge_id: "",

      //     weight: spotData?.weight || 0,
      //     rate: 0,
      //     per_kg: 2,
      //     inr_amount: 0,
      //     currency: "24",
      //     enquiry_id: spotData?.id,
      //     party_type: "",
      //     ex_rate: "1",
      //     pp_cc: "1",
      //     party: "",
      //     party_name: "",
      //     sac_code: "",
      //   },
      // ]);
    } else {
      showAlert("Please Provide Details First", "warning");
    }
  };

  // handling addrow here buying
  const addRow2 = () => {
    const excludedKeys = ["sell_rate", "enquiry_id", "job_id", "party_name"]; // Add keys you want to exclude

    const isAllFilled = buycharges.every((item: any) =>
      Object.entries(item).every(([key, value]) =>
        excludedKeys.includes(key)
          ? true
          : value !== "" && value !== null && value !== undefined && value !== 0
      )
    );
    if (isAllFilled) {
      const newdata = [...buycharges];
      let newobj: any = {
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
      };
      if (extrakeybuy) {
        newobj[extrakeybuy] = 0;
      }
      setBuyCharges([...buycharges, newobj]);
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
  // handling exchangereate data — also recalculates all charges using the affected currency
  const handleexchangerate = (
    index?: any,
    forwhat?: string,
    value?: string
  ) => {
    if (toggle == 1) {
      const data: any = [...exchangedataSell];
      const oldCurrencyId = data[index]["currency_id"];
      const updatedItem: any = { ...data[index] };
      updatedItem[forwhat as string] = value;
      data[index] = updatedItem;
      setExchangedataSell(data);

      // Replicate the same change to buying-side exchange table
      if (setExchangedata && exchangedata) {
        const buyExData: any = [...exchangedata];
        const updatedBuyItem: any = { ...buyExData[index] };
        updatedBuyItem[forwhat as string] = value;
        buyExData[index] = updatedBuyItem;
        setExchangedata(buyExData);

        // Recalculate buying charges affected by this replicated change
        if (buycharges && setBuyCharges) {
          if (forwhat === "ex_rate" && oldCurrencyId) {
            const newExRate = Number(value) || 0;
            const updatedBuyCharges = buycharges.map((charge: any) => {
              if (String(charge.currency) === String(oldCurrencyId)) {
                const inrAmount =
                  charge.per_kg == 1
                    ? Number(charge.rate) * Number(charge.weight) * newExRate
                    : Number(charge.rate) * newExRate;
                return { ...charge, ex_rate: String(newExRate), inr_amount: inrAmount };
              }
              return charge;
            });
            setBuyCharges(updatedBuyCharges);
          } else if (forwhat === "currency_id" && oldCurrencyId) {
            const exRate = Number(data[index]["ex_rate"]) || 0;
            const updatedBuyCharges = buycharges.map((charge: any) => {
              if (String(charge.currency) === String(oldCurrencyId)) {
                const inrAmount =
                  charge.per_kg == 1
                    ? Number(charge.rate) * Number(charge.weight) * exRate
                    : Number(charge.rate) * exRate;
                return { ...charge, currency: value, ex_rate: String(exRate), inr_amount: inrAmount };
              }
              return charge;
            });
            setBuyCharges(updatedBuyCharges);
          }
        }
      }

      // Recalculate selling charges
      if (forwhat === "ex_rate" && oldCurrencyId) {
        const newExRate = Number(value) || 0;
        const updatedCharges = sellingcharges.map((charge: any) => {
          if (String(charge.currency) === String(oldCurrencyId)) {
            const inrAmount =
              charge.per_kg == 1
                ? Number(charge.rate) * Number(charge.weight) * newExRate
                : Number(charge.rate) * newExRate;
            return { ...charge, ex_rate: String(newExRate), inr_amount: inrAmount };
          }
          return charge;
        });
        setSellingCharges(updatedCharges);
      } else if (forwhat === "currency_id" && oldCurrencyId) {
        const exRate = Number(data[index]["ex_rate"]) || 0;
        const updatedCharges = sellingcharges.map((charge: any) => {
          if (String(charge.currency) === String(oldCurrencyId)) {
            const inrAmount =
              charge.per_kg == 1
                ? Number(charge.rate) * Number(charge.weight) * exRate
                : Number(charge.rate) * exRate;
            return { ...charge, currency: value, ex_rate: String(exRate), inr_amount: inrAmount };
          }
          return charge;
        });
        setSellingCharges(updatedCharges);
      }
    } else {
      const data: any = [...exchangedata];
      const oldCurrencyId = data[index]["currency_id"];
      const updatedItem: any = { ...data[index] };
      updatedItem[forwhat as string] = value;
      data[index] = updatedItem;
      setExchangedata(data);

      if (buycharges && setBuyCharges) {
        if (forwhat === "ex_rate" && oldCurrencyId) {
          const newExRate = Number(value) || 0;
          const updatedCharges = buycharges.map((charge: any) => {
            if (String(charge.currency) === String(oldCurrencyId)) {
              const inrAmount =
                charge.per_kg == 1
                  ? Number(charge.rate) * Number(charge.weight) * newExRate
                  : Number(charge.rate) * newExRate;
              return { ...charge, ex_rate: String(newExRate), inr_amount: inrAmount };
            }
            return charge;
          });
          setBuyCharges(updatedCharges);
        } else if (forwhat === "currency_id" && oldCurrencyId) {
          const exRate = Number(data[index]["ex_rate"]) || 0;
          const updatedCharges = buycharges.map((charge: any) => {
            if (String(charge.currency) === String(oldCurrencyId)) {
              const inrAmount =
                charge.per_kg == 1
                  ? Number(charge.rate) * Number(charge.weight) * exRate
                  : Number(charge.rate) * exRate;
              return { ...charge, currency: value, ex_rate: String(exRate), inr_amount: inrAmount };
            }
            return charge;
          });
          setBuyCharges(updatedCharges);
        }
      }
    }
  };

  const ModalDescription = (
    <div className="w-full col-span-12">
      <FormInput
        type="text"
        placeholder="Remarks"
        value={
          sellingcharges?.find(
            (item: any, index: number) => index == singlechargedata?.index
          )?.remarks || ""
        }
        name="remarks"
        // disabled={
        //   !Number(row?.charge_id) ||
        //   row?.is_edit ||
        //   ((spotData?.booking_status == 1 || spotData?.booking_status == 14) &&
        //     spotData?.forwhat != "pricing")
        // }
        onChange={(e: any) => {
          handleSelectChange(
            singlechargedata?.index,
            "remarks",
            e.target.value
          );
        }}
        className="w-full p-2 border border-gray-300  rounded"
      />
    </div>
  );
  const modalTitle = (
    <div>
      <h1>Add/Update Remarks</h1>
    </div>
  );
  const ModalFooter2 = (
    <div>
      <div className="flex justify-end items-end  ">
        <Button
          type="button"
          onClick={() => {
            handleSelectChange(singlechargedata?.index, "remarks", "");
            setRemarkModal(false);
            setSingleChargeData("");
          }}
          className="w-20 text-white mr-1  bg-gray-500 p-2"
        >
          Cancel
        </Button>

        <Button
          className={`
                     p-2 bg-mustard text-white w-20`}
          onClick={() => {
            setRemarkModal(false);
            setSingleChargeData("");
          }}
        >
          Add <BsPlus />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="box 2xl:p-5 xl:p-5  md:p-5 sm:p-2 p-2 mt-5 border border-gray-200 shadow-lg ">
        {/* addedbuyingcharges?.length == 0 || */}
        {((toggle == 1 && !singlefranchiseedata?.is_overseas) || toggle == 2) &&
        !checkstatus(spotData?.booking_status) ? (
          <div className="border border-gray-200 shadow-lg p-2 w-[100%] m-auto mb-4 min-[759px]:grid grid-cols-3 gap-2">
            {(toggle == 1 ? (importBookingType == 3 ? exchangedataSell?.slice(0, 2) : exchangedataSell) : exchangedata)?.map((item: any, index: number) => {
              // Extract already selected currency IDs except the current one to allow re-selection in the same row
              const selectedCurrencyIds = (toggle == 1 ? exchangedataSell : exchangedata)
                .map((ex: any, i: number) =>
                  i !== index ? ex.currency_id : null,
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
                            e.target.value,
                          )
                        }
                     disabled={
  index === 0 ||
  (toggle == 1 && disableExchangeSell) ||
  (
    userdata?.type_id !== 9 &&
    ![0, 16, 7].includes(Number(spotData?.booking_status))
  )
}
                        value={item?.currency_id}
                      >
                        <option value="">Select</option>
                        {currencydata
                          .filter(
                            (item2: any) =>
                              !selectedCurrencyIds.includes(String(item2.id)),
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
        disabled={
  index === 0 ||
  (toggle == 1 && disableExchangeSell) ||
  (
    userdata?.type_id !== 9 &&
    ![0, 16, 7].includes(Number(spotData?.booking_status))
  )
}
                        onChange={(e: any) => {
                          let newValue = limitToThreeDecimals(e.target.value);
                          if (newValue.startsWith("0") && newValue.length > 1 && !newValue.startsWith("0.")) {
                            newValue = newValue.replace(/^0+/, "");
                          }

                          // Limit integer part to 5 digits
                          const [intPart, decPart] = newValue.split(".");
                          if (intPart && intPart.length > 5) return;

                          handleexchangerate(index, "ex_rate", newValue);
                        }}
                        onBlur={(e: any) => {
                          const val = Number(e.target.value);
                          if (e.target.value !== "" && (val <= 0 || isNaN(val))) {
                            showAlert("Exchange rate must be a positive number greater than 0", "warning");
                            handleexchangerate(index, "ex_rate", "");
                          }
                        }}
                        onKeyDown={(e: any) => {
                          const val = e.target.value;
                          const dot = val.indexOf(".");
                          if (dot !== -1 && /^[0-9]$/.test(e.key) && e.target.selectionStart === e.target.selectionEnd && e.target.selectionStart > dot && val.length - dot - 1 >= 3) {
                            e.preventDefault();
                          }
                        }}
                        min="0"
                        type="text"
                        placeholder="Enter Exchange rate"
                        value={limitToThreeDecimals(String(item?.ex_rate ?? ""))}
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
        <div className="flex justify-end ">
           {singlefranchiseedata?.is_overseas && toggle == 1 ? (
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Currency:</span>
                    <span className="text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded px-2 py-1">
                      {currencydata?.find((c: any) => c.id == singlefranchiseedata?.currency)?.currency || "INR"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Exchange Rate:</span>
                    <span className="text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded px-2 py-1">
                      {singlefranchiseedata?.exchange_rate || "1"}
                    </span>
                  </div>
                </div>
              ) : (
                ""
              )}</div>
        {userdata?.type_id == 8 ||
        userdata?.type_id == 6 ||
        userdata?.type_id == 9 ? (
          <div className="min-[767px]:flex justify-between mb-2">
            <div className="flex items-center gap-3">
              {!hideSelling ? (
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
              ) : null}
              {!hideBuying &&
              (userdata?.type_id == 8 || userdata?.type_id == 9) ? (
                <Button
                  onClick={() => {
                    setToggle(2);
                    if (setHasUpdated) {
                      setHasUpdated(true);
                    }
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


            {spotData?.incoterm == 2 ? (
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
        {/* addedbuyingcharges?.length == 0 || */}
        {toggle == 1 &&
        (spotData?.forwhat == "pricing" ||
          addedbuyingcharges?.length == 0 ||
          userdata?.type_id == 6) ? (
          <div className="overflow-x-auto w-full">
            <Table className="whitespace-nowrap ">
              {/* Table headers */}
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="px-2 py-2 text-center">
                    <div className="flex justify-center items-center">
                      <p className="flex ">
                        {(![1, 14].includes(Number(spotData?.booking_status)) ||
                          spotData?.forwhat == "pricing") && (
                          <Plus
                            onClick={() => {
                              addRow();
                              if (setHasUpdated) {
                                setHasUpdated(true);
                              }
                            }}
                            className="w-[24px] h-[24px] bg-green-400 text-white p-[3px] rounded-sm mr-1 cursor-pointer"
                          />
                        )}
                        {(![1, 14].includes(Number(spotData?.booking_status)) ||
                          spotData?.forwhat == "pricing") && (
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
                  <Table.Th className="px-1 py-1 text-center">REMARKS</Table.Th>
                  {additonalList
                    ? additonalList?.map((item: any) => (
                        <Table.Th className="px-1 py-1 text-center">
                          {item?.name?.toUpperCase()}
                        </Table.Th>
                      ))
                    : ""}
                  {(![1, 14].includes(Number(spotData?.booking_status)) ||
                    spotData?.forwhat == "pricing") && (
                    <Table.Th className="px-1 py-1 text-center">
                      ACTION
                    </Table.Th>
                  )}
                </Table.Tr>
              </Table.Thead>

              {/* Table body */}

              {sellingcharges?.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className="px-1 py-1 w-[20%]">
                    <FormSelect
                      className="border w-full border-gray-300 rounded-lg"
                      value={`${row?.charge_id}`}
                      name="charge_id"
                      disabled={
                        (spotData?.booking_status == 1 ||
                          spotData?.booking_status == 14) &&
                        spotData?.forwhat != "pricing"
                      }
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
                      onChange={(e: any) => {
                        const value = e.target.value;

                        if (value) {
                          handleSelectChange(
                            index,
                            "charge_id",
                            e.target.value,
                          );
                        }
                      }}
                    >
                      <option value={0}>Select Charge</option>
                      {/* {chargesdata
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
                        ))} */}
                      {[...chargesdata]
                        .sort((a: any, b: any) =>
                          a.charge_name.localeCompare(b.charge_name),
                        )
                        .filter(
                          (item: any) =>
                            // Keep option if it's NOT in sellingcharges
                            // OR if it's the one currently selected
                            !sellingcharges.some(
                              (sc: any) =>
                                sc.charge_id == item.ref_sell_id &&
                                sc.charge_id != row?.charge_id,
                            ),
                        )
                        .map((item: any) => (
                          <option
                            className="w-full"
                            key={item.ref_sell_id}
                            value={item.ref_sell_id}
                          >
                            {item.charge_name}
                          </option>
                        ))}
                    </FormSelect>
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      min="0"
                      placeholder="Rate"
                      value={limitToThreeDecimals(String(row?.rate ?? ""))}
                      name="rate"
                      disabled={
                        !Number(row?.charge_id) ||
                        row?.is_edit ||
                        ((spotData?.booking_status == 1 ||
                          spotData?.booking_status == 14) &&
                          spotData?.forwhat != "pricing")
                      }
                      onChange={(e: any) => {
                        let newValue = limitToThreeDecimals(e.target.value);
                        if (newValue.startsWith("0") && newValue.length > 1) {
                          newValue = newValue.replace(/^0+/, "");
                        }
                        handleSelectChange(index, "rate", newValue);
                      }}
                      onKeyDown={(e: any) => {
                        const val = e.target.value;
                        const dot = val.indexOf(".");
                        if (dot !== -1 && /^[0-9]$/.test(e.key) && e.target.selectionStart === e.target.selectionEnd && e.target.selectionStart > dot && val.length - dot - 1 >= 3) {
                          e.preventDefault();
                        }
                      }}
                      className="w-full text-right p-2 border border-gray-300  rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      value={row?.per_kg}
                      onChange={(e: any) => {
                        handleSelectChange(index, "per_kg", e.target.value);
                      }}
                      disabled={
                        (spotData?.booking_status == 1 ||
                          spotData?.booking_status == 14) &&
                        spotData?.forwhat != "pricing"
                      }
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
                        !sellingcharges[index]["charge_id"] || row?.per_kg == 2
                      }
                      onChange={(e: any) => {
                        const newValue = limitToThreeDecimals(e.target.value);
                        handleSelectChange(index, "weight", newValue);
                      }}
                      onKeyDown={(e: any) => {
                        const val = e.target.value;
                        const dot = val.indexOf(".");
                        if (dot !== -1 && /^[0-9]$/.test(e.key) && e.target.selectionStart === e.target.selectionEnd && e.target.selectionStart > dot && val.length - dot - 1 >= 3) {
                          e.preventDefault();
                        }
                      }}
                      value={row?.per_kg == 2 ? 1 : limitToThreeDecimals(String(row?.weight ?? ""))}
                      className="text-right w-full p-2 border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      onBlur={(e: any) => {
                        if (singlefranchiseedata?.is_overseas) return;
                        const value = e.target.value;
                        const singledata = exchangedataSell.find(
                          (ex: any) => ex.currency_id == value,
                        );
                        if (value && !singledata?.ex_rate) {
                          showAlert(
                            "Please Provide exchange rate against this currency",
                            "warning",
                          );
                          const newdata = [...sellingcharges];
                          newdata[index]["currency"] = "";
                          setSellingCharges(newdata);
                        }
                      }}
                      onChange={(e: any) => {
                        if (!singlefranchiseedata?.is_overseas) handleSelectChange(index, "currency", e.target.value);
                      }}
                      className="w-full p-2 border border-gray-300 rounded"
                      value={singlefranchiseedata?.is_overseas ? String(singlefranchiseedata?.currency || "") : row?.currency}
                      disabled={
                        singlefranchiseedata?.is_overseas ||
                        ((spotData?.booking_status == 1 ||
                          spotData?.booking_status == 14) &&
                        spotData?.forwhat != "pricing")
                      }
                    >
                      <option value="">Select</option>
                      {singlefranchiseedata?.is_overseas
                        ? currencydata?.filter((item2: any) => String(item2.id) == String(singlefranchiseedata?.currency))?.map((item: any) => (
                            <option key={item?.id} value={item?.id}>{item?.currency}</option>
                          ))
                        : currencydata?.length
                          ? currencydata
                              .filter((item2: any) => {
                                const ids = exchangedataSell
                                  ?.map((ex: any) => String(ex.currency_id))
                                  .filter(Boolean);
                                return ids?.includes(String(item2.id));
                              })
                              .map((item: any) => (
                                <option key={item?.id} value={item?.id}>
                                  {item?.currency}
                                </option>
                              ))
                          : ""}
                    </FormSelect>
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      value={singlefranchiseedata?.is_overseas ? String(singlefranchiseedata?.exchange_rate || "1") : (formatIndianNumber(Number(row?.ex_rate||1)) || 1)}
                      disabled
                      className="text-right w-full p-2 border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormInput
                      type="text"
                      value={formatIndianNumber(parseFloat(Number(row?.inr_amount).toFixed(3)))}
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
                        const zeroGST = singlefranchiseedata?.is_overseas || singlefranchiseedata?.gst_status == 4 || spotData?.import_booking == 3;
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
                        const zeroGST = singlefranchiseedata?.gst_status == 4 || spotData?.import_booking == 3 || singlefranchiseedata?.is_overseas;
                        if (zeroGST) return formatIndianNumber(inr);
                        const chargeInfo = chargesdata?.find((c: any) => c.ref_sell_id == row?.charge_id);
                        const igstRate = parseFloat(chargeInfo?.tax_breakup?.igst || "18") / 100;
                        return formatIndianNumber(parseFloat((inr + inr * igstRate).toFixed(3)));
                      })()}
                      disabled
                      className="w-full p-2 text-right border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1 flex justify-between items-center">
                    <div className=" w-full relative">
                      <Button
                        onMouseEnter={() => {
                          setSingleChargeDatatippy({ ...row, index });
                          setTippyModal(true);
                        }}
                        onMouseLeave={() => {
                          setSingleChargeDatatippy("");
                          setTippyModal(false);
                        }}
                        onClick={() => {
                          setTippyModal(false);
                          setSingleChargeDatatippy("");
                          setSingleChargeData({ ...row, index });
                          setRemarkModal(true);
                        }}
                        className={`p-2 w-full ${
                          sellingcharges[index]?.remarks
                            ? "bg-success"
                            : "bg-mustard"
                        } text-white`}
                      >
                        {sellingcharges[index]?.remarks ? "Added" : "Add +"}
                      </Button>
                      {singlechargedatatippy?.index == index && tippymodal ? (
                        <div className="absolute bottom-10 right-2 bg-gray-400 rounded p-2 shadow-lg">
                          {row?.remarks || "No Remarks Added"}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </Table.Td>
                  {additonalList
                    ? additonalList?.map((item: any) =>
                        item?.type == "Button" ? (
                          <Table.Td className="px-1 py-2 flex justify-center items-center">
                            <Button
                              disabled={
                                !sellingcharges[index]["charge_id"] ||
                                !sellingcharges[index]["inr_amount"]
                              }
                              value={row?.remarks}
                              className={item?.type_style}
                              onClick={(e: any) => {
                                item?.handlefun(
                                  index,
                                  sellingcharges[index],
                                  e.target.value,
                                );
                              }}
                            >
                              {item?.icon}
                            </Button>
                          </Table.Td>
                        ) : (
                          ""
                        ),
                      )
                    : ""}
                  {(![1, 14].includes(Number(spotData?.booking_status)) ||
                    spotData?.forwhat == "pricing") && (
                    <Table.Td className="">
                      <div className="h-[100%] flex justify-center items-center">
                        <Button
                          disabled={row?.is_edit}
                          onClick={() => {
                            removeRow(index);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="text-red-400" />
                        </Button>
                      </div>
                    </Table.Td>
                  )}
                </Table.Tr>
              ))}
            </Table>
          </div>
        ) : (
          ""
        )}
        {toggle == 2 &&
        // (addedbuyingcharges?.length == 0 || !checkstatus(spotData?.booking_status)) ? (

        spotData?.forwhat == "pricing" ? (
          <div className="overflow-auto w-full h-[30vh] ">
            <Table className="whitespace-nowrap ">
              {/* Table headers */}
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="px-2 py-2 text-center">
                    <div className="flex justify-center items-center ">
                      <p className="flex ">
                        <Plus
                          onClick={() => {
                            addRow2();
                            if (setHasUpdated) {
                              setHasUpdated(true);
                            }
                          }}
                          className="w-[24px] h-[24px] bg-green-400 text-white p-[3px] rounded-sm mr-1 cursor-pointer"
                        />
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

                  <Table.Th className="px-1 py-1 text-center">ACTION</Table.Th>
                </Table.Tr>
              </Table.Thead>

              {/* Table body */}

              {buycharges.map((row: any, index: number) => (
                <Table.Tr key={index}>
                  <Table.Td className="px-1 py-1 w-[10%]">
                    <FormSelect
                      className="border w-full border-gray-300 rounded-lg"
                      value={row?.charge_id}
                      name="charge_id"
                      // disabled={index !== 0}
                      options={{
                        placeholder: "Search Search",
                      }}
                      onChange={(e: any) => {
                        const value = e.target.value;

                        const singledata = chargesdata.find(
                          (item2: any) => item2.charge_id == value,
                        );
                        const singledata2 = sellingcharges.find(
                          (item2: any) =>
                            item2?.charge_id == singledata?.ref_sell_id,
                        );

                        if (value) {
                          handleSelectChange2(index, "charge_id", value);
                        }
                      }}
                    >
                      <option value={0}>Select Charge</option>
                      {[...chargesdata]
                        .sort((a: any, b: any) =>
                          a.charge_name.localeCompare(b.charge_name),
                        )
                        .filter(
                          (item: any) =>
                            // Keep option if it's NOT in sellingcharges
                            // OR if it's the one currently selected
                            !buycharges.some(
                              (sc: any) =>
                                sc.charge_id == item.charge_id &&
                                sc.charge_id != row?.charge_id,
                            ),
                        )
                        .map((item: any) => (
                          <option
                            className="w-full"
                            key={item.charge_id}
                            value={item.charge_id}
                          >
                            {item.charge_name}
                          </option>
                        ))}
                    </FormSelect>
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      value={row?.pp_cc}
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
                      disabled={sellingcharges?.some(
                        (item: any) =>
                          item?.charge_id ==
                          chargesdata?.find(
                            (item2: any) => item2.charge_id == row?.charge_id,
                          )?.ref_sell_id,
                      )}
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
                      placeholder="Buy Rate"
                      value={limitToThreeDecimals(String(row?.rate ?? ""))}
                      name="rate"
                      onChange={(e: any) => {
                        let newValue = limitToThreeDecimals(e.target.value);
                        if (newValue.startsWith("0") && newValue.length > 1 && !newValue.startsWith("0.")) {
                          newValue = newValue.replace(/^0+/, "");
                        }
                        handleSelectChange2(index, "rate", newValue);
                      }}
                      onKeyDown={(e: any) => {
                        const val = e.target.value;
                        const dot = val.indexOf(".");
                        if (dot !== -1 && /^[0-9]$/.test(e.key) && e.target.selectionStart === e.target.selectionEnd && e.target.selectionStart > dot && val.length - dot - 1 >= 3) {
                          e.preventDefault();
                        }
                      }}
                      className="text-right w-full p-2 border border-gray-300  rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      value={row?.per_kg}
                      disabled={!row?.currency || !row?.charge_id}
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
                        !buycharges[index]["charge_id"] || row?.per_kg == 2
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
                        let newValue = limitToThreeDecimals(e.target.value);
                        if (newValue.startsWith("0") && newValue.length > 1) {
                          newValue = newValue.replace(/^0+/, "");
                        }
                        handleSelectChange2(index, "weight", newValue);
                      }}
                      onKeyDown={(e: any) => {
                        const val = e.target.value;
                        const dot = val.indexOf(".");
                        if (dot !== -1 && /^[0-9]$/.test(e.key) && e.target.selectionStart === e.target.selectionEnd && e.target.selectionStart > dot && val.length - dot - 1 >= 3) {
                          e.preventDefault();
                        }
                      }}
                      value={row?.per_kg == 2 ? 1 : limitToThreeDecimals(String(row?.weight ?? ""))}
                      className="text-right w-full p-2 border border-gray-300 rounded"
                    />
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    <FormSelect
                      onBlur={(e: any) => {
                        const value = e.target.value;
                        const singledata = exchangedata.find(
                          (ex: any) => ex.currency_id == value,
                        );

                        if (value && !singledata?.ex_rate) {
                          showAlert(
                            "Please Provide exchange rate against this currency",
                            "warning",
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
                      value={formatIndianNumber(parseFloat(Number(row?.ex_rate).toFixed(3))) || 1}
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
                      value={formatIndianNumber(parseFloat(Number(row?.inr_amount).toFixed(3)))}
                      disabled
                      onChange={(e: any) => {
                        handleSelectChange2(
                          index,
                          "inr_amount",
                          e.target.value,
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
                        const zeroGST = singlefranchiseedata?.gst_status == 4;
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
                    <FormSelect
                      value={row?.party_type}
                      disabled={!row?.charge_id}
                      onChange={(e: any) => {
                        handleSelectChange2(
                          index,
                          "party_type",
                          e.target.value,
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
                  </Table.Td>
                  <Table.Td className="px-1 py-1">
                    {buycharges[index]["party_type"] ? (
                      <CommonSearchArr
                        // apiEndpoint={`master/entity?cpy_id=1&type_data=${buycharges[index]["party_type"]}`}
                        apiEndpoint={`admin/vendor-settings?c_type=${buycharges[index]["party_type"]}`}
                        placeholder={"Search.."}
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
                    ) : (
                      <FormInput placeholder="Search For Franchisee" disabled />
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
                </Table.Tr>
              ))}
            </Table>
          </div>
        ) : (
          ""
        )}
        {toggle == 1 &&
        addedbuyingcharges?.length >= 1 &&
        checkstatus(spotData?.booking_status) &&
        !spotData?.forwhat
          ? addedsellingcharges?.length >= 1 && (
              <ReportCommonTable
                columns={addedsellingcharges[0]}
                row={addedsellingcharges}
                page={0}
                overflow={true}
                // alignment={true}
                // arr1={["rate", "inr_amount  (Rs.)", "weight/Unit"]}
              />
            )
          : ""}
        {toggle == 2 &&
        addedbuyingcharges?.length >= 1 &&
        checkstatus(spotData?.booking_status) &&
        !spotData?.forwhat
          ? addedbuyingcharges?.length >= 1 && (
              <ReportCommonTable
                columns={addedbuyingcharges[0]}
                row={addedbuyingcharges}
                page={0}
                overflow={true}
                // alignment={true}
                // arr1={["rate", "inr_amount  (Rs.)"]}
              />
            )
          : ""}
        {/* <div ref={bottomRef} className="h-1"></div> */}
      </div>
      {remarksModal && (
        <CommonModal
          open={remarksModal}
          setOpen={setRemarkModal}
          title={modalTitle}
          description={ModalDescription}
          footer={ModalFooter2}
          gridColumns={6}
          size={"md"}
        />
      )}
    </>
  );
};

export default SellBuyForm;
