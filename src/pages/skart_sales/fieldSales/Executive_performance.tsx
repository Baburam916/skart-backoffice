import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  User,
  Check,
  TrendingUp,
  TrendingDown,
  Plane,
  Home,
  Calendar,

} from "lucide-react";

import Daily_sale_lineChart from "./Daily_sale_lineChart";
import Excutive_performace_chart from "./Excutive_performace_chart";

import {FormSelect} from "../../../base-components/Form";

import { FormInput, FormLabel } from "../../../base-components/Form";

import Litepicker from "../../../base-components/Litepicker/index";

import Button from "../../../base-components/Button";

import Table from "../../../base-components/Table";


import { DayGridView } from "@fullcalendar/daygrid";

import bgnew from "../../../assets/images/dashboardImages/bgnew.gif";

import new_billICON from "../../../public/images/new_bill.png";
import target from "../../../public/images/target.svg";
import truckbooking from "../../../public/images/truckbooking.svg";
import chart from "../../../public/images/chart.png";

import emoneynew from "../../../assets/images/dashboardImages/emoneynew.svg";
import etruck from "../../../assets/images/dashboardImages/etruck.svg";
import eweight from "../../../assets/images/dashboardImages/eweight.svg";
import etrending from "../../../assets/images/dashboardImages/etrending.svg";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";

const Executive_performance = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [activeWeight, setActiveWeight] = useState(1);
  const [activeExcutive, setActiveExcutive] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<"Daily" | "Monthly" | "Yearly">("Monthly");
const {userdata}=useLogin()
  /// Progress bar state and effect
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setProgress(75);
    }, 500);
  }, []);

  const [fromDate, setFromDate] = useState("2025-10-15");
  const [toDate, setToDate] = useState("2025-10-15");

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

      <style>{`
        @keyframes morph {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                 
          }
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; 
          }
        }
        .animate-morph {
          animation: morph 8s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full mt-3 block lg:flex  justify-between items-center">
        <div className="mb-[7px] lg:mb-0">
          <h1 className="mr-auto text-xl text-[#383838] font-bold ">
            Executive Performance
          </h1>
          <div className="block lg:flex items-center">
            <div className="flex items-center">
              <figure className="bg-[#F0FFF2] rounded-full p-[2px] w-[30px] h-[30px] flex  justify-center items-center">
                <User className="w-[20px] h-[20px] text-[#2A9A37]" />
              </figure>

              <p className="text-[16px] font-medium mb-1 lg:mb-0 text-[#1e932c] ml-2">
                {" "}
         {userdata?.display_name||"-"}
              </p>
            </div>
            <div className="lg:ml-3 ml-0 my-1">
              / April 01, 2026 - April 21, 2026
            </div>
          </div>
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
            <Download className="w-[17px] mr-2" /> Export Data
          </button>
        </div>
      </div>

      <div className="mt-[50px]">
        <div className="lg:flex gap-2 justify-between block ">
          <div className="w-fit flex flex-wrap gap-1 lg:gap-2  bg-[#fff]  px-[5px] py-[5px]  rounded-[7px] mb-[10px] lg:mb-[0px]">
            <button
              onClick={() => setActiveExcutive(1)}
              className={`w-[49%] lg:w-auto lg:px-[10px] lg:py-[2px] px-[4px] py-[1px] rounded-[6px] flex items-center justify-center text-[#4b5054] ${
                activeExcutive === 1
                  ? "bg-[#efb847] !text-[#fff]"
                  : "bg-[#f1f5f9]"
              }`}
            >
              <Plane className="w-[14px] mr-[5px]" /> Express
            </button>

            <button
              onClick={() => setActiveExcutive(2)}
              className={`w-[49%] lg:w-auto lg:px-[10px] lg:py-[2px] px-[4px] py-[1px] rounded-[6px] flex items-center justify-center  text-[#4b5054] ${
                activeExcutive === 2
                  ? "bg-[#efb847] !text-[#fff]"
                  : "bg-[#f1f5f9]"
              }`}
            >
              <Truck className="w-[14px] mr-[5px]" /> Cargo
            </button>

            <button
              onClick={() => setActiveExcutive(3)}
              className={`w-[49%] lg:w-auto lg:px-[10px] lg:py-[2px] px-[4px] py-[1px] rounded-[6px] flex items-center justify-center text-[#4b5054] ${
                activeExcutive === 3
                  ? "bg-[#efb847] !text-[#fff]"
                  : "bg-[#f1f5f9]"
              }`}
            >
              <Download className="w-[14px] mr-[5px]" /> Import
            </button>

            <button
              onClick={() => setActiveExcutive(4)}
              className={`w-[49%] lg:w-auto lg:px-[10px] lg:py-[2px] px-[4px] py-[1px] rounded-[6px] flex items-center justify-center  text-[#4b5054] ${
                activeExcutive === 4
                  ? "bg-[#efb847] !text-[#fff]"
                  : "bg-[#f1f5f9]"
              }`}
            >
              <Home className="w-[14px] mr-[1px] lg:mr-[5px]" /> Domestic
            </button>
          </div>

          <div className="w-fit flex gap-0 items-center bg-[#fff] border border-[#e1e8f0]  rounded-[10px] px-[8px] ml-0 lg:ml-2 mb-3 lg:mb-0">
            <div className="flex items-center gap-0">
              <label
                htmlFor="from-month"
                className="text-[12px] font-medium text-[#868686]"
              >
                FROM
              </label>

              <div className="relative flex items-center">
                <DatePicker
                  selected={fromDate}
                  onChange={(date:any) => setFromDate(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                className="w-[101px] lg:w-[120px] h-[34px] rounded-md lg:pl-7 px-2 pl-1 pr-1 text-center !border-none !outline-none focus:!border-none focus:!outline-none focus:!ring-0"
                />
                <Calendar
                  className="absolute  top-[10px] lg:left-2 left-1 text-[#868686] pointer-events-none"
                  size={14}
                />
              </div>
            </div>

            <div className="flex items-center gap-0">
              <label
                htmlFor="to-month"
                className="text-[12px] font-medium text-[#868686]"
              >
                TO
              </label>

              <div className="relative flex items-center">
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
               className="w-[101px] lg:w-[120px] h-[34px] rounded-md lg:pl-7 px-2 pl-1 pr-1 text-center !border-none !outline-none focus:!border-none focus:!outline-none focus:!ring-0"
                />
                <Calendar
                  className="absolute top-[10px] lg:left-2 left-1  text-[#868686] pointer-events-none"
                  size={14}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {activeExcutive === 1 && (
            <>
              <div className="mt-2 w-full mb-[20px]">
                <div className="grid grid-cols-12 gap-[14px] w-full">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group   h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etruck} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#e8f6ec] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#269d4b] font-medium   relative  ">
                          <TrendingUp className="w-[15px] " />
                          <span className="ml-[3px]">+20%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          Shipment
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          43
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : 5
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Total Bookings
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full ">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={emoneynew} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#ffdad6] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#a53226] font-medium   relative  ">
                          <TrendingDown className="w-[15px] " />
                          <span className="ml-[3px]">-3.0%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          REVENUE
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          ₹67,502.72
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : ₹70,000
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Skart Sell
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={eweight} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#feefd8] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#b65a1f] font-medium   relative  ">
                
                          <span className="ml-[3px]">On Target</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <div className="  w-full  px-1 pt-[5px]">
                          <div className="flex justify-between items-center w-full">
                            <h2 className="text-[#696969] text-[14px]  uppercase leading-[20px] group-hover:text-[#c48d13]">
                              WEIGHT METRIC
                            </h2>

                            <div className="flex gap-2 bg-[#f3f3f6]  p-[4px] rounded-[4px]">
                              <button
                                onClick={() => setActiveWeight(1)}
                                className={`px-[10px] py-[1px]  text-[11px] rounded-[4px] leading-[17px] ${
                                  activeWeight === 1
                                    ? "bg-[#ffffff] text-[#825500]"
                                    : ""
                                }`}
                              >
                                AVG
                              </button>

                              <button
                                onClick={() => setActiveWeight(2)}
                                className={`px-[10px] py-[1px]  text-[11px] rounded-[4px] leading-[17px] ${
                                  activeWeight === 2
                                    ? "bg-[#ffffff] text-[#825500]"
                                    : ""
                                }`}
                              >
                                Total
                              </button>
                            </div>
                          </div>

                          <div className="mt-0">
                            {activeWeight === 1 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  18.58 kg
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :18.58 kg
                                </small>
                              </>
                            )}
                            {activeWeight === 2 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  28.34 kg
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :58.90 kg
                                </small>
                              </>
                            )}
                          </div>
                        </div>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Calculated Metric
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full ">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etrending} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#e8f6ec] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#269d4b] font-medium   relative  ">
                          <TrendingUp className="w-[15px] " />
                          <span className="ml-[3px]">+5.2%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          PROFITABILITY
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          100%
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target :95%
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Margin %
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeExcutive === 2 && (
            <>
              <div className="mt-2 w-full mb-[20px]">
                <div className="grid grid-cols-12 gap-[14px] w-full">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group   h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etruck} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#e8f6ec] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#269d4b] font-medium   relative  ">
                          <TrendingUp className="w-[15px] " />
                          <span className="ml-[3px]">+20%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          Shipment
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          43
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : 5
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Total Bookings
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full ">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={emoneynew} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#ffdad6] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#a53226] font-medium   relative  ">
                          <TrendingDown   className="w-[15px] " />
                          <span className="ml-[3px]">-3.0%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          REVENUE
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          ₹67,502.72
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : ₹70,000
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Skart Sell
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={eweight} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#feefd8] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#b65a1f] font-medium   relative  ">
                     
                          <span className="ml-[3px]">On Target</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <div className="  w-full  px-1 pt-[5px]">
                          <div className="flex justify-between items-center w-full">
                            <h2 className="text-[#696969] text-[14px]  uppercase leading-[20px] group-hover:text-[#c48d13]">
                              WEIGHT METRIC
                            </h2>

                            <div className="flex gap-2 bg-[#f3f3f6]  p-[4px] rounded-[4px]">
                              <button
                                onClick={() => setActiveWeight(1)}
                                className={`px-[10px] py-[1px]  text-[11px] rounded-[4px] leading-[17px] ${
                                  activeWeight === 1
                                    ? "bg-[#ffffff] text-[#825500]"
                                    : ""
                                }`}
                              >
                                AVG
                              </button>

                              <button
                                onClick={() => setActiveWeight(2)}
                                className={`px-[10px] py-[1px]  text-[11px] rounded-[4px] leading-[17px] ${
                                  activeWeight === 2
                                    ? "bg-[#ffffff] text-[#825500]"
                                    : ""
                                }`}
                              >
                                Total
                              </button>
                            </div>
                          </div>

                          <div className="mt-0">
                            {activeWeight === 1 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  18.58 kg
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :18.58 kg
                                </small>
                              </>
                            )}
                            {activeWeight === 2 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  28.34 kg
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :58.90 kg
                                </small>
                              </>
                            )}
                          </div>
                        </div>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Calculated Metric
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full ">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etrending} alt="" className="w-[22px]" />
                        </figure>

                  
                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#e8f6ec] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#269d4b] font-medium   relative  ">
                          <TrendingUp className="w-[15px] " />
                          <span className="ml-[3px]">+5.2%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          PROFITABILITY
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          100%
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target :95%
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Margin %
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeExcutive === 3 && (
            <>
              <div className="mt-2 w-full mb-[20px]">
                <div className="grid grid-cols-12 gap-[14px] w-full">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group   h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etruck} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#e8f6ec] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#269d4b] font-medium   relative  ">
                          <TrendingUp className="w-[15px] " />
                          <span className="ml-[3px]">+20%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          Shipment
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          43
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : 5
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Total Bookings
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full ">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={emoneynew} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#ffdad6] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#a53226] font-medium   relative  ">
                          <TrendingDown className="w-[15px] " />
                          <span className="ml-[3px]">-3.0%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          REVENUE
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          ₹67,502.72
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : ₹70,000
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Skart Sell
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={eweight} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#feefd8] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#b65a1f] font-medium   relative  ">
                    
                          <span className="ml-[3px]">On Target</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <div className="  w-full  px-1 pt-[5px]">
                          <div className="flex justify-between items-center w-full">
                            <h2 className="text-[#696969] text-[14px]  uppercase leading-[20px] group-hover:text-[#c48d13]">
                              WEIGHT METRIC
                            </h2>

                            <div className="flex gap-2 bg-[#f3f3f6]  p-[4px] rounded-[4px]">
                              <button
                                onClick={() => setActiveWeight(1)}
                                className={`px-[10px] py-[1px]  text-[11px] rounded-[4px] leading-[17px] ${
                                  activeWeight === 1
                                    ? "bg-[#ffffff] text-[#825500]"
                                    : ""
                                }`}
                              >
                                AVG
                              </button>

                              <button
                                onClick={() => setActiveWeight(2)}
                                className={`px-[10px] py-[1px]  text-[11px] rounded-[4px] leading-[17px] ${
                                  activeWeight === 2
                                    ? "bg-[#ffffff] text-[#825500]"
                                    : ""
                                }`}
                              >
                                Total
                              </button>
                            </div>
                          </div>

                          <div className="mt-0">
                            {activeWeight === 1 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  18.58 kg
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :18.58 kg
                                </small>
                              </>
                            )}
                            {activeWeight === 2 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  28.34 kg
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :58.90 kg
                                </small>
                              </>
                            )}
                          </div>
                        </div>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Calculated Metric
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full ">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etrending} alt="" className="w-[22px]" />
                        </figure>

                       
                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#e8f6ec] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#269d4b] font-medium   relative  ">
                          <TrendingUp className="w-[15px] " />
                          <span className="ml-[3px]">+5.2%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          PROFITABILITY
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          100%
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target :95%
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Margin %
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {activeExcutive === 4 && (
            <>
              <div className="mt-2 w-full mb-[20px]">
                <div className="grid grid-cols-12 gap-[14px] w-full">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group   h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etruck} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#e8f6ec] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#269d4b] font-medium   relative  ">
                          <TrendingUp className="w-[15px] " />
                          <span className="ml-[3px]">+20%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          Shipment
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          43
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : 5
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Total Bookings
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full ">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={emoneynew} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#ffdad6] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#a53226] font-medium   relative  ">
                          <TrendingDown className="w-[15px] " />
                          <span className="ml-[3px]">-3.0%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          REVENUE
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          ₹67,502.72
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : ₹70,000
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Skart Sell
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={eweight} alt="" className="w-[22px]" />
                        </figure>

                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#feefd8] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#b65a1f] font-medium   relative  ">
                  
                          <span className="ml-[3px]">On Target</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <div className="  w-full  px-1 pt-[5px]">
                          <div className="flex justify-between items-center w-full">
                            <h2 className="text-[#696969] text-[14px]  uppercase leading-[20px] group-hover:text-[#c48d13]">
                              WEIGHT METRIC
                            </h2>

                            <div className="flex gap-2 bg-[#f3f3f6]  p-[4px] rounded-[4px]">
                              <button
                                onClick={() => setActiveWeight(1)}
                                className={`px-[10px] py-[1px]  text-[11px] rounded-[4px] leading-[17px] ${
                                  activeWeight === 1
                                    ? "bg-[#ffffff] text-[#825500]"
                                    : ""
                                }`}
                              >
                                AVG
                              </button>

                              <button
                                onClick={() => setActiveWeight(2)}
                                className={`px-[10px] py-[1px]  text-[11px] rounded-[4px] leading-[17px] ${
                                  activeWeight === 2
                                    ? "bg-[#ffffff] text-[#825500]"
                                    : ""
                                }`}
                              >
                                Total
                              </button>
                            </div>
                          </div>

                          <div className="mt-0">
                            {activeWeight === 1 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  18.58 kg
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :18.58 kg
                                </small>
                              </>
                            )}
                            {activeWeight === 2 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  28.34 kg
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :58.90 kg
                                </small>
                              </>
                            )}
                          </div>
                        </div>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Calculated Metric
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group  h-full ">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etrending} alt="" className="w-[22px]" />
                        </figure>

                     
                        <h3 className="flex w-fit items  h-[22px]  items-center leading-[15px] bg-[#e8f6ec] px-[7px] py-[1px] text-[12px] rounded-[5px] text-[#269d4b] font-medium   relative  ">
                          <TrendingUp className="w-[15px] " />
                          <span className="ml-[3px]">+5.2%</span>
                        </h3>

                         <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button>
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          PROFITABILITY
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          100%
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target :95%
                        </small>

                        <h4 className=" text-[13px] text-[#8a8a8a]">
                          Margin %
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full mt-2 mb-4">
        <div className="grid grid-cols-12 gap-[15px] w-full">
          <div className="col-span-12 lg:col-span-7">
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
                <div className=" ">
                  <button className="hover:bg-[#777779] flex items-center  bg-mustard px-3 py-[5px] text-[12px] rounded-lg text-white font-bold uppercase  relative overflow-hidden btnAnimation">
                    <Download className="w-[15px] mr-2" /> Download
                  </button>
                </div>
              </div>
              <div className="p-2  lg:p-3">
                <div>
                  <div className="md:flex block gap-1 justify-between items-center">
                    <div className="   bg-[#fffcf7] px-1  lg:px-1 py-1 border border-[#f4ead6] rounded-full inline-block lg:mr-2 mb-[12px] lg:mb-0 mr-0">
                      <div className="flex gap-1 ">
                        <button
                          className={`md:px-[10px] md:py-[3px] px-[6px] py-[1px]  text-[#000] rounded-full text-[13px]  md:text-[14px]   ${
                            activeTab === 1
                              ? "bg-[#efb946] text-[#fff] "
                              : "bg-[#fdf8ed] text-[#000] "
                          }`}
                          onClick={() => setActiveTab(1)}
                        >
                          Express
                        </button>

                        <button
                          className={`md:px-[10px] md:py-[3px] px-[6px] py-[1px]  text-[#000] rounded-full text-[13px]  md:text-[14px]     ${
                            activeTab === 2
                              ? "bg-[#efb946] text-[#fff] "
                              : "bg-[#fdf8ed] text-[#000] "
                          }`}
                          onClick={() => setActiveTab(2)}
                        >
                          Cargo
                        </button>

                        <button
                          className={`md:px-[10px] md:py-[3px] px-[6px] py-[1px]  text-[#000] rounded-full text-[13px]  md:text-[14px]    ${
                            activeTab === 3
                              ? "bg-[#efb946] text-[#fff] "
                              : "bg-[#fdf8ed] text-[#000] "
                          }`}
                          onClick={() => setActiveTab(3)}
                        >
                          Import
                        </button>

                        <button
                          className={`md:px-[10px] md:py-[3px] px-[6px] py-[1px]  text-[#000] rounded-full text-[13px]  md:text-[14px]   ${
                            activeTab === 4
                              ? "bg-[#efb946] text-[#fff]"
                              : "bg-[#fdf8ed] text-[#000] "
                          }`}
                          onClick={() => setActiveTab(4)}
                        >
                          Domestic
                        </button>
                      </div>
                    </div>

                    <div className="">
                      <div className="flex items-center gap-2">
                        <FormSelect
                          formSelectSize="base"
                          className="mt-0 w-[120px] h-[34px]   bg-[#fffcf7] px-3 py-1 border border-[#f4ead6] rounded-full inline-block"
                          aria-label=".form-select-xs example"
                          value={selectedPeriod}
                          onChange={(e) => setSelectedPeriod(e.target.value as "Daily" | "Monthly" | "Yearly")}
                        >
                          <option>Daily</option>
                          <option>Monthly</option>
                          <option>Yearly</option>
                        </FormSelect>
                      </div>
                    </div>
                  </div>

                  <div className="tab-content mt-4">
                    {activeTab === 1 && (
                      <div>
                        <Daily_sale_lineChart period={selectedPeriod} />
                      </div>
                    )}
                    {activeTab === 2 && (
                      <div>
                        {" "}
                        <Daily_sale_lineChart period={selectedPeriod} />
                      </div>
                    )}
                    {activeTab === 3 && (
                      <div>
                        {" "}
                        <Daily_sale_lineChart period={selectedPeriod} />
                      </div>
                    )}
                    {activeTab === 4 && (
                      <div>
                        {" "}
                        <Daily_sale_lineChart period={selectedPeriod} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5">
            <div className="mt-1 w-full bg-white rounded-[15px]  border border-gray-200 h-full">
              <div
                className=" w-full py-3  px-4 border-b border-gray-200 
           rounded-t-[15px]  bg-gradient-to-l from-[#ffcb00] via-[#d69612] to-[#d69612] flex items-center justify-between relative overflow-hidden"
              >
                <div className="block relative z-[2]">
                  <h2 className="text-[18px] font-bold mb-1 lg:mb-0 text-[#e7a92a]">
                    Shipment Distribution
                  </h2>
                  <p className="text-[#fff]">7-Day Historical vs Target </p>
                </div>

                <figure className="absolute top-[-52px] md:top-[-52px]  lg:top-[-60px]  xl:top-[-64px]  2xl:top-[-140px] right-[0px] left-[0px] bottom-[0px] ">
                  <img
                    src={bgnew}
                    alt=""
                    className="filter hue-rotate-[153deg] opacity-40 w-full"
                  />
                </figure>
              </div>
              <div className="p-2  lg:p-4">
                <div className="md:flex  block gap-1 justify-between items-center mb-[13px]">
                  <div className="mb-3 lg:mb-0">
                    <FormSelect
                      formSelectSize="base"
                      className="mt-0 h-[34px]   bg-[#fffcf7] px-3 py-1 border border-[#f4ead6] rounded-full inline-block"
                      aria-label=".form-select-xs example"
                    >
                      <option>Shipments Count </option>
                      <option>Revenue </option>
                      <option>Tonnage </option>
                      <option>Avg. Revenue/Shipment </option>
                      <option>Gross Profit </option>
                    </FormSelect>
                  </div>

                  <div className="flex gap-6 items-center mb-4 lg:mb-0">
                    <button className="hover:bg-[#777779] flex items-center  bg-mustard px-3 py-[5px] text-[12px] rounded-lg text-white font-bold uppercase  relative overflow-hidden btnAnimation">
                      <Download className="w-[15px] mr-2" /> Download
                    </button>
                  </div>
                </div>

                <div className="w-full 2xl:mb-[60px] 2xl:mt-[60px] xl:mb-[70px] xl:mt-[70px] lg:mb-[70px] lg:mt-[70px]">
                  <Excutive_performace_chart />
                </div>

                <div className="w-full">
                  <div className=" grid grid-cols-12   gap-2">
                    <div className="col-span-6  lg:col-span-6  ">
                      <div
                        className="flex items-center justify-between
                    border border-[#f0f0ef]
                 relative overflow-hidden h-full rounded-[9px] pl-3 pr-4 py-2 bg-gradient-to-r from-[#FDFDFD] via-[#FDFDFD] to-[#FFF9EB]    hover:bg-gradient-to-r hover:from-[#fffaef] hover:via-[#fffaef] hover:to-[#fffaef]    
                    
                    
                    "
                      >
                        <h4 className="flex items-center">
                          <i className="rippledashboardNew w-[9px] h-[9px] bg-[#eea615] rounded-full inline-block"></i>

                          <p className="text-[#575757] text-[13px] font-medium ml-[5px]">
                            Express{" "}
                          </p>
                        </h4>

                        <span className="font-medium text-[#eea615] lg:text-[16px] text-[14px]">
                          48
                        </span>
                      </div>
                    </div>

                    <div className="col-span-6  lg:col-span-6  ">
                      <div
                        className="flex items-center justify-between
                    border border-[#f9ecec]
                 relative overflow-hidden h-full rounded-[9px] pl-3 pr-4 py-2 bg-gradient-to-r from-[#FDFDFD] via-[#FDFDFD] to-[#fff4f4]    hover:bg-gradient-to-r hover:from-[#fffaef] hover:via-[#fffaef] hover:to-[#fffaef]    
                    
                    
                    "
                      >
                        <h4 className="flex items-center">
                          <i className="rippledashboardNew w-[9px] h-[9px] bg-[#fca2a2] rounded-full inline-block"></i>

                          <p className="text-[#575757] text-[13px] font-medium ml-[5px]">
                            Cargo{" "}
                          </p>
                        </h4>

                        <span className="font-medium text-[#fca2a2] lg:text-[16px] text-[14px]">
                          86
                        </span>
                      </div>
                    </div>

                    <div className="col-span-6  lg:col-span-6  ">
                      <div
                        className="flex items-center justify-between
                    border border-[#c6f9f6]
                 relative overflow-hidden h-full rounded-[9px] pl-3 pr-4 py-2 bg-gradient-to-r from-[#FDFDFD] via-[#FDFDFD] to-[#f4fffe]       
                    
                    
                    "
                      >
                        <h4 className="flex items-center">
                          <i className="rippledashboardNew w-[9px] h-[9px] bg-[#25cac2] rounded-full inline-block"></i>

                          <p className="text-[#575757] text-[13px] font-medium ml-[8px]">
                            Import{" "}
                          </p>
                        </h4>

                        <span className="font-medium text-[#12938d] lg:text-[16px] text-[14px]">
                          952
                        </span>
                      </div>
                    </div>

                    <div className="col-span-6  lg:col-span-6  ">
                      <div
                        className="flex items-center justify-between
                    border border-[#c2f2d1]
                 relative overflow-hidden h-full rounded-[9px] pl-3 pr-4 py-2 bg-gradient-to-r from-[#FDFDFD] via-[#FDFDFD] to-[#f1fbf4]      
                    
                    
                    "
                      >
                        <h4 className="flex items-center">
                          <i className="rippledashboardNew w-[9px] h-[9px] bg-[#3d9658] rounded-full inline-block"></i>

                          <p className="text-[#575757] text-[13px] font-medium ml-[5px]">
                            Domestic{" "}
                          </p>
                        </h4>

                        <span className="font-medium text-[#3d9658] lg:text-[16px] text-[14px]">
                          34
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-8 block lg:flex  justify-between items-center mb-2">
        <div className="mb-1 lg:mb-0">
          <h1 className="mr-auto text-xl text-[#383838] font-bold ">
            Recent Booking Audit
          </h1>
        </div>
      </div>
      <div className="mt-3  w-full  ">
        <div className="max-h-[500px] overflow-y-auto border-[3px] border-[#fff] rounded-lg bg-[#fff] stickly_table">
          <table className="w-full whitespace-nowrap ">
            <thead className="text-left">
              <tr>
                <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px] text-[#ddb130] text-[15px]">
                  Sr. No.
                </th>

                <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px] text-[#ddb130] text-[15px]">
                  {" "}
                  BOOKING ID
                </th>

                <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px] text-[#ddb130] text-[15px]">
                  {" "}
                  CARRIER
                </th>

                <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px] text-[#ddb130] text-[15px]">
                  {" "}
                  WEIGHT
                </th>

                <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px] text-[#ddb130] text-[15px]">
                  {" "}
                  REVENUE
                </th>

 <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px] text-[#ddb130] text-[15px]">
                Gross Profit
                </th>

                <th className="sticky top-[57px] z-10 bg-[#f6f1e2] border-y border-[#eee1ba] py-[10px] px-[10px] text-[#ddb130] text-[15px]">
                  Shipment type
                </th>
              </tr>
            </thead>

            <tbody>
              {/* start Loop */}
              <tr className="hover:bg-[#f7fafd] even:bg-[#000]">
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  1
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  SK-98231
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fffaee]  text-[12px] font-medium   text-[#705f1d] border border-[#FFF2C1] text-center">
                    UPS Express{" "}
                  </h5>
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  24.5 kg
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹12,450.00
                </td>

  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹650.00
                </td>
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="flex items-center">
                    <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[21px] h-[21px] flex items-center justify-center ">
                      <Plane className="w-[15px] h-[15px] text-[#09861b]" />
                    </i>
                    <span className="text-[#2A9A37] ml-2">Express </span>{" "}
                  </h5>
                </td>
              </tr>
              {/* end Loop */}

              {/* start Loop */}
              <tr className="hover:bg-[#f7fafd] even:bg-[#fdfdfd]">
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  2
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  SK-98245
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#f1f5f9]  text-[12px] font-medium   text-[#555b61] border border-[#e3eaf2] text-center">
                    FedEx Ground
                  </h5>
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  12.2 kg
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹8,930.50
                </td>

  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹650.00
                </td>
                

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="flex items-center">
                    <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[21px] h-[21px] flex items-center justify-center ">
                      <Truck className="w-[15px] h-[15px] text-[#09861b]" />
                    </i>
                    <span className="text-[#2A9A37] ml-2">Cargo </span>{" "}
                  </h5>
                </td>
              </tr>
              {/* end Loop */}

              {/* start Loop */}
              <tr className="hover:bg-[#f7fafd] even:bg-[#fdfdfd]">
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  3
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  SK-98288
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fffaee]  text-[12px] font-medium   text-[#705f1d] border border-[#FFF2C1] text-center">
                    UPS Standard
                  </h5>
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  32.0 kg
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹22,100.00
                </td>
                
  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹650.00
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="flex items-center">
                    <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[19px] h-[19px] flex items-center justify-center ">
                      <Download className="w-[14px] h-[14px] text-[#09861b]" />
                    </i>
                    <span className="text-[#2A9A37] ml-2"> Import </span>{" "}
                  </h5>
                </td>
              </tr>
              {/* end Loop */}

              {/* start Loop */}
              <tr className="hover:bg-[#f7fafd] even:bg-[#fdfdfd]">
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  4
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  SK-98231
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fffaee]  text-[12px] font-medium   text-[#705f1d] border border-[#FFF2C1] text-center">
                    UPS Express{" "}
                  </h5>
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  24.5 kg
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹12,450.00
                </td>


  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹650.00
                </td>
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="flex items-center">
                    <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[21px] h-[21px] flex items-center justify-center ">
                      <Home className="w-[14px] h-[14px] text-[#09861b]" />
                    </i>
                    <span className="text-[#2A9A37] ml-2"> Domestic </span>{" "}
                  </h5>
                </td>
              </tr>
              {/* end Loop */}

              {/* start Loop */}
              <tr className="hover:bg-[#f7fafd] even:bg-[#000]">
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  5
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  SK-98231
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fffaee]  text-[12px] font-medium   text-[#705f1d] border border-[#FFF2C1] text-center">
                    UPS Express{" "}
                  </h5>
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  24.5 kg
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹12,450.00
                </td>
                
  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹650.00
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="flex items-center">
                    <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[21px] h-[21px] flex items-center justify-center ">
                      <Plane className="w-[15px] h-[15px] text-[#09861b]" />
                    </i>
                    <span className="text-[#2A9A37] ml-2">Express </span>{" "}
                  </h5>
                </td>
              </tr>
              {/* end Loop */}

              {/* start Loop */}
              <tr className="hover:bg-[#f7fafd] even:bg-[#fdfdfd]">
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  6
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  SK-98245
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#f1f5f9]  text-[12px] font-medium   text-[#555b61] border border-[#e3eaf2] text-center">
                    FedEx Ground
                  </h5>
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  12.2 kg
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹8,930.50
                </td>


  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹650.00
                </td>
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="flex items-center">
                    <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[21px] h-[21px] flex items-center justify-center ">
                      <Truck className="w-[15px] h-[15px] text-[#09861b]" />
                    </i>
                    <span className="text-[#2A9A37] ml-2">Cargo </span>{" "}
                  </h5>
                </td>
              </tr>
              {/* end Loop */}

              {/* start Loop */}
              <tr className="hover:bg-[#f7fafd] even:bg-[#fdfdfd]">
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  7
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  SK-98288
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fffaee]  text-[12px] font-medium   text-[#705f1d] border border-[#FFF2C1] text-center">
                    UPS Standard
                  </h5>
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  32.0 kg
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹22,100.00
                </td>


  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹650.00
                </td>
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="flex items-center">
                    <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[19px] h-[19px] flex items-center justify-center ">
                      <Download className="w-[14px] h-[14px] text-[#09861b]" />
                    </i>
                    <span className="text-[#2A9A37] ml-2"> Import </span>{" "}
                  </h5>
                </td>
              </tr>
              {/* end Loop */}

              {/* start Loop */}
              <tr className="hover:bg-[#f7fafd] even:bg-[#fdfdfd]">
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  8
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  SK-98231
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#fffaee]  text-[12px] font-medium   text-[#705f1d] border border-[#FFF2C1] text-center">
                    UPS Express{" "}
                  </h5>
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  24.5 kg
                </td>

                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹12,450.00
                </td>


  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  ₹650.00
                </td>
                <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                  <h5 className="flex items-center">
                    <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[21px] h-[21px] flex items-center justify-center ">
                      <Home className="w-[14px] h-[14px] text-[#09861b]" />
                    </i>
                    <span className="text-[#2A9A37] ml-2"> Domestic </span>{" "}
                  </h5>
                </td>
              </tr>
              {/* end Loop */}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Executive_performance;