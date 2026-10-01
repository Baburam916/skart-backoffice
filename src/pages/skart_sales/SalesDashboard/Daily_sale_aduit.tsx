import { useEffect, useState } from "react";
import Counter from "../../../components/Counter/AnimatedCounter";
import {
  Download,
  UserPlus,
  ArrowUp,
  ArrowDown,
  Diff,
  Import,
  Box,
  Truck,
  Package,
  FileText  ,
} from "lucide-react";

// import FormSelect from "../../base-components/form/FormSelect";

// import { FormInput, FormLabel, FormSelect } from "../../../base-components/Form";

import Litepicker from "../../../base-components/Litepicker/index";

import Button from "../../../base-components/Button";

import Table from "../../../base-components/Table";

import { Dialog, Menu } from "../../../base-components/Headless";
import { DayGridView } from "@fullcalendar/daygrid";

import Current_analysis from "./Current_analysis";
import bgnew from "../../../assets/images/bgnew.gif";
// import { Dialog } from "../../base-components/Headless";
import Daily_revenue from "./Current_analysis";
import Performance_comparison from "./Performance_comparison";
import Lucide from "../../../base-components/Lucide";
import { FormSelect } from "../../../base-components/Form";
// import Lucide from "../../base-components/Lucide";

const progressData = [
  {
    label: "Express",
    value: 10,
    percent: 85,
    status: "85% of Target",
    type: "normal",
  },
  {
    label: "Cargo",
    value: 12,
    percent: 100,
    status: "100% of Target",
    type: "normal",
  },
  {
    label: "Import",
    value: 8,
    percent: 40,
    status: "40% of Target",
    type: "normal",
  },
  {
    label: "Domestic",
    value: 15,
    percent: 100,
    status: "Target Exceeded",
    type: "exceeded",
  },
];

const Daily_sale_aduit = () => {
  const [activeTab, setActiveTab] = useState(1);

  /// Progress bar state and effect
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setProgress(75);
    }, 500);
  }, []);

  const [fromDate, setFromDate] = useState("2025-10-15");
  const [toDate, setToDate] = useState("2025-10-15");
  const [modeal, setModeal] = useState<boolean>(false);
  return (
    <>
      <style>
        {`
          @keyframes gradient-animate {
            0% {
              background-position: 0%;
            }
            100% {
              background-position: 400%;
            }
          }
        `}
      </style>

      <div className="w-full mt-3 block lg:flex  justify-between items-center">
        <div className="mb-[7px] lg:mb-0">
          <h1 className="mr-auto text-xl text-[#383838] font-bold ">
            Daily Sales Audit
          </h1>
          <p>Performance tracking for current shipping period</p>
        </div>

        <div className="lg:flex block  justify-between items-center">
          <button
            className="
            
       flex items-center mr-[7px] bg-mustard px-3 py-2 font-lg rounded-lg text-white font-bold mb-4 uppercase  relative overflow-hidden btnAnimation
  
  
            
            bg-[linear-gradient(90deg,#ffbe3a,#efb847,#f0cf1d,#efb847)]
            bg-[length:700%_700%]
            transition-all duration-300
            hover:bg-[#353535]
          "
            style={{
              animation: "gradient-animate 8s linear infinite",
            }}
          >
            <Download className="w-[17px] mr-2" /> Export Report
          </button>
        </div>
      </div>

      <div className="w-full mt-2 mb-4">
        <div className="grid grid-cols-12 gap-[15px] w-full">
          <div className="col-span-12 lg:col-span-8">
            <div className="mt-1 w-full bg-white rounded-[15px]  border border-gray-200">
              <div
                className=" w-full py-3  px-4 border-b border-gray-200 
           rounded-t-[15px]  bg-gradient-to-l from-[#fff] via-[#fff] to-[#fefbf4]  block lg:flex   items-center justify-between h-full"
              >
                <div className="block mb-[8px] lg:mb-0">
                  <h2 className="text-[18px] font-bold mb-1 lg:mb-0 text-[#e7a92a]">
                    Daily Revenue Comparison
                  </h2>
                  <p className="text-[#575757]">7-Day Historical vs Target </p>
                </div>
                <div className="flex gap-2 ">
                  <button
                    variant="primary"
                    onClick={(event: React.MouseEvent) => {
                      event.preventDefault();
                      setModeal(true);
                    }}
                    className="hover:bg-[#efb847] hover:text-[#fff]  flex items-center text-[#efb847]  border border-mustard px-3 py-[5px] text-[12px] rounded-lg font-bold uppercase  relative overflow-hidden btnAnimation"
                  >
                    <FileText    className="w-[17px] mr-2" /> Analysis
                  </button>

                  <button className="hover:bg-[#777779] flex items-center  bg-mustard px-3 py-[5px] text-[12px] rounded-lg text-white font-bold uppercase  relative overflow-hidden btnAnimation">
                    <Download className="w-[15px] mr-2" /> Download
                  </button>
                </div>
              </div>

              <Dialog
                size="90%"
                open={modeal}
                onClose={() => {
                  setModeal(false);
                }}
              >
                <Dialog.Panel className="w-[95%] lg:w-[90%]   xl:w-[90%]  2xl:w-[80%] mx-auto bg-white rounded-lg shadow-md">
                  <div
                    onClick={(event: React.MouseEvent) => {
                      event.preventDefault();
                      setModeal(false);
                    }}
                    className="hover:bg-[#303030] absolute top-[7px] right-[7px] bg-[#f4aa11] w-[25px] h-[25px] rounded-full flex justify-center cursor-pointer
                        items-center"
                  >
                    <Lucide
                      icon="X"
                      className="w-[15px] h-[14px] text-[#fff]  stroke-[3]"
                    />
                  </div>

                  <div className="p-[10px] lg:p-[50px]">
                    <div className="grid grid-cols-12 lg:gap-[20px] gap-[10px] w-full">
                      <div className="col-span-12 lg:col-span-6">
                        <div className="mt-1 w-full bg-white rounded-[15px]  border border-gray-200">
                          <div
                            className=" w-full py-3  px-4 border-b border-gray-200 
 rounded-t-[15px]  bg-gradient-to-l from-[#fff] via-[#fff] to-[#fefbf4]  block lg:flex   items-center justify-between h-full"
                          >
                            <div className="block mb-[8px] lg:mb-0">
                              <h2 className="text-[18px] font-bold mb-1 lg:mb-0 text-[#e7a92a]">
                               Current Analysis
                              </h2>
                              <p className="text-[#575757]">
                                7-Day Historical vs Target{" "}
                              </p>
                            </div>

                            <div className=" ">
                              <button className="hover:bg-[#777779] flex items-center  bg-mustard px-3 py-[5px] text-[12px] rounded-lg text-white font-bold uppercase  relative overflow-hidden btnAnimation">
                                <Download className="w-[15px] mr-2" /> Download
                              </button>
                            </div>
                          </div>
                          <div className="p-2  lg:p-3">
                            <Current_analysis />
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 lg:col-span-6">
                        <div className="mt-1 w-full bg-white rounded-[15px]  border border-gray-200">
                          <div
                            className=" w-full py-3  px-4 border-b border-gray-200 
 rounded-t-[15px]  bg-gradient-to-l from-[#fff] via-[#fff] to-[#f1f1f1]  block lg:flex   items-center justify-between h-full"
                          >
                            <div className="block mb-[8px] lg:mb-0">
                              <h2 className="text-[18px] font-bold mb-1 lg:mb-0 text-[#303030]">
                 Performance comparison
                              </h2>
                              <p className="text-[#575757]">
                                7-Day Historical vs Target{" "}
                              </p>
                            </div>

                            <div className=" ">
                              <button className="hover:bg-mustard flex items-center   bg-[#777779] px-3 py-[5px] text-[12px] rounded-lg text-white font-bold uppercase  relative overflow-hidden btnAnimation">
                                <Download className="w-[15px] mr-2" /> Download
                              </button>
                            </div>
                          </div>
                          <div className="p-2  lg:p-3">
                            <Performance_comparison />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Dialog>

              <div className="p-2  lg:p-3">
                <Daily_revenue />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="mt-1 w-full bg-white rounded-[15px]  border border-gray-200 h-full">
              <div
                className=" w-full py-3  px-4 border-b border-gray-200 
           rounded-t-[15px]  bg-gradient-to-l from-[#ffcb00] via-[#d69612] to-[#d69612] flex items-center justify-between relative overflow-hidden"
              >
                <div className="block relative z-[2]">
                  <h2 className="text-[18px] font-bold mb-3 lg:mb-0 text-[#e7a92a]">
                    Daily Revenue Comparison
                  </h2>
                  <p className="text-[#fff]">Category Distribution </p>
                </div>
                <figure className="absolute top-[-52px] md:top-[-52px]  lg:top-[-60px]  xl:top-[-70px]  2xl:top-[-110px] right-[0px] left-[0px] bottom-[0px] ">
                  <img
                    src={bgnew}
                    alt=""
                    className="filter hue-rotate-[153deg] opacity-40 w-full"
                  />
                </figure>
              </div>
              <div className="p-2  lg:p-4">
                <div className="  block gap-2 justify-between items-center mb-6">
                  <div className="flex gap-7 items-center mb-4 lg:mb-3">
                    <div className="flex items-center">
                      <i className="rippledashboardNew w-[9px] h-[9px] bg-[#18a274] rounded-full inline-block"></i>
                      <p className="text-[#575757] text-[13px] font-medium ml-[5px]">
                        Actual{" "}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <i className="rippledashboardNew w-[9px] h-[9px] bg-[#fbb03b] rounded-full inline-block"></i>
                      <p className="text-[#575757] text-[13px] font-medium ml-[5px]">
                        Target
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <FormSelect
                      formSelectSize="base"
                      className="mt-0 h-[34px] w-fit  bg-[#fffcf7] px-3 py-1 border border-[#f4ead6] rounded-full inline-block"
                      aria-label=".form-select-xs example"
                    >
                      <option>Shipments Count </option>
                      <option>Revenue </option>
                      <option>Tonnage </option>
                      <option>Avg. Revenue/Shipment </option>
                      <option>Gross Profit </option>
                    </FormSelect>
                  </div>{" "}
                </div>

                <div className="mt-4 flex flex-col gap-6">
                  {progressData.map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontSize: "12px", fontWeight: 500 }}>
                          {item.label}: {item.value}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color:
                              item.type === "exceeded" ? "#BA7517" : "#1D9E75",
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className=" w-full h-[7px] bg-[#f0f0f0] rounded-lg relative overflow-hidden">
                        <div
                          className="progressanimation relative"
                          style={{
                            width: `${item.percent}%`,
                            height: "100%",
                            backgroundColor:
                              item.type === "exceeded" ? "#EF9F27" : "#1D9E75",
                            borderRadius: "8px",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 block lg:flex  justify-between items-center mb-2">
        <div className="mb-1 lg:mb-0">
          <h1 className="mr-auto text-xl text-[#383838] font-bold ">
            Performance Summary Metrics
          </h1>
        </div>

        <div className="lg:flex block  justify-between items-center">
          <button
            className="
            
       flex items-center mr-[7px] bg-mustard px-3 py-2 font-lg rounded-lg text-white font-bold  uppercase  relative overflow-hidden btnAnimation
  
  
            
            bg-[linear-gradient(90deg,#ffbe3a,#efb847,#f0cf1d,#efb847)]
            bg-[length:700%_700%]
            transition-all duration-300
            !hover:bg-[#353535]
          "
            style={{
              animation: "gradient-animate 8s linear infinite",
            }}
          >
            <Download className="w-[17px] mr-2" /> Download
          </button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto border-[2px] border-[#fff] rounded-lg bg-[#fff] stickly_table">
        <table className="w-full">
          <thead className="text-left">
            <tr>
              <th
                className="sticky top-0 z-20 bg-[#F2F3F4] p-[10px] whitespace-nowrap "
                colSpan={7}
              >
                <div className="flex items-center gap-2 2xl:gap-6">
                  <div className="flex items-center ">
                    <FormSelect
                      formSelectSize="base"
                      className="mt-0 w-[120px] h-[34px]   bg-[#fff] px-3 py-1 border border-[#e1e8f0] rounded-[10px] inline-block font-normal"
                      aria-label=".form-select-xs example"
                    >
                      <option>Daily </option>
                      <option>Monthly </option>
                      <option>Yearly </option>
                    </FormSelect>
                  </div>

                  <div className="flex gap-1 items-center bg-[#fff] border border-[#e1e8f0]  rounded-[10px] px-[8px]">
                    <div className="flex items-center gap-1">
                      <label
                        htmlFor="from-date"
                        className="text-[13px] font-medium text-[#868686]"
                      >
                        FROM
                      </label>

                      <input
                        id="from-date"
                        type="date"
                        max="2026-01-13"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="tracking-[-1px] w-[115px]  h-[34px] font-normal text-[14px] pl-[2px] pr-[0px] border-none rounded-md bg-white focus:outline-none focus:ring-0 focus:shadow-none"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <label
                        htmlFor="to-date"
                        className="text-[13px] font-medium text-[#868686]"
                      >
                        TO
                      </label>

                      <input
                        id="to-date"
                        type="date"
                        max="2026-01-13"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="tracking-[-1px] w-[115px] h-[34px] font-normal text-[14px] pl-[2px] pr-[0px] border-none rounded-md bg-white focus:outline-none focus:ring-0 focus:shadow-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <i className="w-[30px] h-[30px] bg-[#fff] text-[#303030] rounded-full p-1 mr-[5px] flex items-center justify-center border border-[#dbe8ee]">
                      <Import className="w-[17px] text-[#a7adb3]" />
                    </i>
                    <p className="flex text-[13px] font-medium text-[#303030]">
                      IMPORT:{" "}
                      <span>
                        {" "}
                        <Counter value={87} duration={3000} />
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center">
                    <i className="w-[30px] h-[30px] bg-[#fff] text-[#303030] rounded-full p-1 mr-[5px] flex items-center justify-center border border-[#dbe8ee]">
                      <Box className="w-[17px] text-[#a7adb3]" />
                    </i>
                    <p className="flex text-[13px] font-medium text-[#303030]">
                      PARCEL:{" "}
                      <span className="text-[#cc211a]">
                        <Counter
                          value={42}
                          duration={3000}
                          className="text-[#cc211a]"
                        />
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center">
                    <i className="w-[30px] h-[30px] bg-[#fff] text-[#303030] rounded-full p-1 mr-[5px] flex items-center justify-center border border-[#dbe8ee]">
                      <Truck className="w-[17px] text-[#a7adb3]" />
                    </i>
                    <p className="flex text-[13px] font-medium text-[#303030]">
                      CARGO EXPORT:{" "}
                      <span>
                        {" "}
                        <Counter value={30} duration={3000} />
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center border-x border-[#dbe8ee] px-3    ">
                    <i className="w-[30px] h-[30px] bg-[#fff6db] text-[#303030] rounded-full p-1 mr-[5px] flex items-center justify-center border border-[#f6e2a4]">
                      <Package className="w-[17px] text-[#cb9f1e]" />
                    </i>

                    <aside className="leading-[15px]">
                      <p className="flex text-[13px] font-medium text-[#303030]">
                        TOTAL WEIGHT: <span>842 kg</span>{" "}
                      </p>

                      <h5 className="text-[12px] text-[#686868] font-normal whitespace-nowrap flex ">
                        GOAL: <span> 1000KG </span>{" "}
                        <p className="text-[#cc211a] ml-[4px]"> 84% </p>
                      </h5>
                    </aside>
                  </div>
                  <div className="flex items-center">
                    <div className="inline-block rounded-[20px] px-[10px] py-[5px] bg-[#fffaee]  text-[14px] font-medium   text-[#705f1d] border border-[#fdeeb3] text-center">
                      Audit Log Active
                    </div>
                  </div>
                </div>
              </th>
            </tr>

            <tr>
              <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px]">
                <p className="text-[#ddb130] text-[15px]"> Sales Person</p>
              </th>
              <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px]">
                <p className="text-[#ddb130] text-[15px]">Shipments</p>
                <small className="text-[12px] text-[#686868] font-normal">
                  (Actual / Target)
                </small>
              </th>
              <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px]">
                <p className="text-[#ddb130] text-[15px]">Revenue (₹)</p>
                <small className="text-[12px] text-[#686868] font-normal">
                  (Actual / Target)
                </small>
              </th>
              <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px]">
                <p className="text-[#ddb130] text-[15px]">Tonnage (KG)</p>
                <small className="text-[12px] text-[#686868] font-normal">
                  (Actual / Target)
                </small>
              </th>
              <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px]">
                <p className="text-[#ddb130] text-[15px]">
                  Avg. Revenue/Shipment
                </p>
                <small className="text-[12px] text-[#686868] font-normal">
                  (Actual / Target)
                </small>
              </th>

              <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px]">
                <p className="text-[#ddb130] text-[15px]">Gross Profit</p>
                <small className="text-[12px] text-[#686868] font-normal">
                  (Actual / Target)
                </small>
              </th>

              <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px]">
                <p className="text-[#ddb130] text-[15px]"> Status</p>
              </th>
            </tr>
          </thead>

          <tbody>
            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Prince Rai </p>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 6</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:5{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(20%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 67,502.72</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:59k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(35%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 145.20</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:140kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (3.7%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 11,250.45</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:10k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(12%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 11,250.45</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:10k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(12%)</small>
                  </span>
                </h6>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fffaee]  text-[12px] font-medium   text-[#705f1d] border border-[#FFF2C1] text-center">
                  Top Performer
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Saurabh Sharma</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 0</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:0{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <Diff className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">(20%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 9,811.64</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:10k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (1.9%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 98.50</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:100kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (1.5%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 1,962.32</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:2k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (1.9%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 1,962.32</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:2k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (1.9%)
                    </small>
                  </span>
                </h6>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#f1f5f9]  text-[12px] font-medium   text-[#555b61] border border-[#e3eaf2] text-center">
                  On Target
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Sunil Kumar</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 5</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:4{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (125%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]">23,778.62</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:20k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(18%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 120.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:120kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <Diff className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">(0%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 3,498.75</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:3.5k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">
                      (0.1%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 3,498.75</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:3.5k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">
                      (0.1%)
                    </small>
                  </span>
                </h6>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fef1f1]  text-[12px] font-medium   text-[#cc2323] border border-[#ffdbdb] text-center">
                  International{" "}
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Abhishek Ram</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 4</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:4{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <Diff className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">(0%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]">13,995.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:14k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(0%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 88.40</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:95kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (6.9%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 3,498.75</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:3.5k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (0.1%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 3,498.75</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:3.5k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (0.1%)
                    </small>
                  </span>
                </h6>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#f1f5f9]  text-[12px] font-medium   text-[#555b61] border border-[#e3eaf2] text-center">
                  On Target
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Rajat Verma</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 4</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:5{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(20%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]">132.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:1k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(86%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 2.10</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:15kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(86%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 33.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:200{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(83%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 33.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:200{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(83%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#e4fbf0]  text-[12px] font-medium   text-[#1ea164] border border-[#a8f2cf] text-center">
                  Domestic Only
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}

            <tr className="hover:bg-[#f7fafd] !bg-[#fffbf5]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Ritik Katoch</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 1</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:1{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <Diff className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">(0%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#825500] text-[15px]">108,100.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:50k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (116%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 387.80 </p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:100kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (287%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 108,100.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:50k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (116%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 108,100.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:50k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (116%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fbb03b]  text-[12px] font-medium   text-[#FFF] border border-[#fbb03b] text-center">
                  High Margin
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Prince Rai </p>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 6</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:5{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(20%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 67,502.72</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:59k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(35%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 145.20</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:140kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (3.7%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 11,250.45</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:10k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(12%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 11,250.45</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:10k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(12%)</small>
                  </span>
                </h6>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fffaee]  text-[12px] font-medium   text-[#705f1d] border border-[#FFF2C1] text-center">
                  Top Performer
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Saurabh Sharma</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 0</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:0{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <Diff className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">(20%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 9,811.64</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:10k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (1.9%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 98.50</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:100kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (1.5%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 1,962.32</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:2k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (1.9%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 1,962.32</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:2k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (1.9%)
                    </small>
                  </span>
                </h6>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#f1f5f9]  text-[12px] font-medium   text-[#555b61] border border-[#e3eaf2] text-center">
                  On Target
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Sunil Kumar</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 5</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:4{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (125%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]">23,778.62</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:20k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">(18%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 120.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:120kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <Diff className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">(0%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 3,498.75</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:3.5k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">
                      (0.1%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 3,498.75</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:3.5k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">
                      (0.1%)
                    </small>
                  </span>
                </h6>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fef1f1]  text-[12px] font-medium   text-[#cc2323] border border-[#ffdbdb] text-center">
                  International{" "}
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Abhishek Ram</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 4</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:4{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <Diff className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">(0%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]">13,995.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:14k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(0%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 88.40</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:95kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (6.9%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 3,498.75</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:3.5k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (0.1%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 3,498.75</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:3.5k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">
                      (0.1%)
                    </small>
                  </span>
                </h6>
              </td>
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#f1f5f9]  text-[12px] font-medium   text-[#555b61] border border-[#e3eaf2] text-center">
                  On Target
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Rajat Verma</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 4</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:5{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(20%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]">132.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:1k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(86%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 2.10</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:15kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(86%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 33.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:200{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(83%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 33.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:200{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowDown className="w-[13px] h-[19px] text-[#cc211a] " />
                    <small className="text-[12px] text-[#cc211a] ">(83%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#e4fbf0]  text-[12px] font-medium   text-[#1ea164] border border-[#a8f2cf] text-center">
                  Domestic Only
                </h5>
              </td>
            </tr>
            {/* end Loop */}

            {/* start Loop */}
            <tr className="hover:bg-[#f7fafd] !bg-[#fffbf5]">
              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> Ritik Katoch</p>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 1</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:1{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <Diff className="w-[13px] h-[19px] text-[#fbb03b] " />
                    <small className="text-[12px] text-[#fbb03b] ">(0%)</small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#825500] text-[15px]">108,100.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:50k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (116%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 387.80 </p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:100kg{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (287%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 108,100.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:50k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (116%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <p className="text-[#303030] text-[15px]"> 108,100.00</p>

                <h6 className="flex">
                  <cite className="text-[12px] text-[#808080] not-italic">
                    Target:50k{" "}
                  </cite>

                  <span className=" flex ml-[4px]">
                    <ArrowUp className="w-[13px] h-[19px] text-[#289e4a] " />
                    <small className="text-[12px] text-[#289e4a] ">
                      (116%)
                    </small>
                  </span>
                </h6>
              </td>

              <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] ">
                <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fbb03b]  text-[12px] font-medium   text-[#FFF] border border-[#fbb03b] text-center">
                  High Margin
                </h5>
              </td>
            </tr>
            {/* end Loop */}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Daily_sale_aduit;