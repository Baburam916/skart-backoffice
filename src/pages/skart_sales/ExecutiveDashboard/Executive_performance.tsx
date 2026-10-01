import { useEffect, useState } from "react";
// import Counter from "../../../components/Counter/AnimatedCounter";
// import DatePicker from "react-datepicker";
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
    FileText  ,

} from "lucide-react";
import Daily_sale_lineChart from "../../skart_sales/SalesDashboard/Daily_sale_lineChart";
import Excutive_performace_chart from "../SalesDashboard/Excutive_performace_chart";

// import FormSelect from "../../base-components/form/FormSelect";

import { FormInput, FormLabel, FormSelect } from "../../../base-components/Form";

import Litepicker from "../../../base-components/Litepicker/index";

import Button from "../../../base-components/Button";

import Table from "../../../base-components/Table";


import { DayGridView } from "@fullcalendar/daygrid";

import bgnew from "../../../assets/images/bgnew.gif";

import new_billICON from "../../../public/images/new_bill.png";
import target from "../../../public/images/target.svg";
import truckbooking from "../../../public/images/truckbooking.svg";
import chart from "../../../public/images/chart.png";

import emoneynew from "../../../assets/images/emoneynew.svg";
import etruck from "../../../assets/images/etruck.svg";
import eweight from "../../../assets/images/eweight.svg";
import etrending from "../../../assets/images/etrending.svg";
// import Lucide from "../../base-components/Lucide";
import { Dialog } from "@headlessui/react";
import Lucide from "../../../base-components/Lucide";
import Current_analysis from "../SalesDashboard/Current_analysis";
import Performance_comparison from "../SalesDashboard/Performance_comparison";
import DatePicker from "react-datepicker";
import { commongetrequest } from "../../../AllServices/services";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";
import { ExportToXLSX } from "../commoncomponents/ExportToXLSX/ExportToXLSX";
import dayjs from "dayjs";
import IsLoading from "../commoncomponents/isLoading/isLoading";

interface LegDistributionItem {
  leg_id: number;
  leg_name: string;
  total_actual_consignments: number;
  total_actual_revenue: number;
  total_actual_tonnage: number;
  total_actual_gp: number;
}

interface DashboardSummaryData {
  total_target_consignments: number;
  total_actual_consignments: number;
  total_target_revenue: number;
  total_actual_revenue: number;
  total_target_tonnage: number;
  total_actual_tonnage: number;
  target_gp_percentage: number;
  actual_gp_percentage: number;
}

interface RevenueTrendItem {
  period: string;
  actual_revenue: number;
}

interface DashboardSummaryResponse {
  summary: DashboardSummaryData;
  revenue_trend: RevenueTrendItem[];
  leg_distribution: LegDistributionItem[];
}

interface BookingAuditItem {
  pickup_id: number;
  airwaybilno: string;
  courier_id: number;
  chargeable_weight: number;
  booking_shipment_type_id: number;
  revenue: number;
  gp: number;
}

interface CourierProduct {
  product_id: number;
  product_name: string;
}

interface BookingShipmentType {
  booking_shipment_type_id: number;
  shipment_type: string;
}

const emptyLegData: LegDistributionItem = {
  leg_id: 0,
  leg_name: "",
  total_actual_consignments: 0,
  total_actual_revenue: 0,
  total_actual_tonnage: 0,
  total_actual_gp: 0,
};

const formatNumber = (value?: number) =>
  Number(value || 0).toLocaleString("en-IN");

const formatCurrency = (value?: number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatWeight = (value?: number) =>
  `${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kg`;

const formatPercentage = (value?: number) => `${Number(value || 0).toFixed(2)}%`;

const getVariancePercent = (actual?: number, target?: number) => {
  const actualValue = Number(actual || 0);
  const targetValue = Number(target || 0);
  return targetValue ? ((actualValue - targetValue) / targetValue) * 100 : 0;
};

const VarianceBadge = ({ actual, target }: { actual?: number; target?: number }) => {
  const percent = getVariancePercent(actual, target);
  const isPositive = percent >= 0;
  return (
    <h3
      className={`flex w-fit items  h-[22px]  items-center leading-[15px] px-[7px] py-[1px] text-[12px] rounded-[5px] font-medium   relative   ${
        isPositive ? "bg-[#e8f6ec] text-[#269d4b]" : "bg-[#ffdad6] text-[#a53226]"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="w-[15px] " />
      ) : (
        <TrendingDown className="w-[15px] " />
      )}
      <span className="ml-[3px]">
        {isPositive ? "+" : ""}
        {percent.toFixed(1)}%
      </span>
    </h3>
  );
};

const formatMonthParam = (date: Date | null) =>
  date ? dayjs(date).startOf("month").format("YYYY-MM-DD") : undefined;

const Executive_performance = () => {
  const { userdata }: any = useLogin();
  const [activeTab, setActiveTab] = useState(1);
  const [activeWeight, setActiveWeight] = useState(1);
  const [activeExcutive, setActiveExcutive] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<"Daily" | "Monthly" | "Yearly">("Monthly");

  /// Progress bar state and effect
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setProgress(75);
    }, 500);
  }, []);

  const [fromDate, setFromDate] = useState<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [modeal, setModeal] = useState<boolean>(false);

  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);

  // NOTE: the API currently ignores `leg_id` - a call with leg_id=3 returns the exact same
  // portfolio-wide `summary` and all-4-legs `leg_distribution` as a call with no leg_id at all.
  // So we fetch once (scoped to the sales rep + date range only) and derive each leg's actuals
  // from `leg_distribution` client-side. Targets stay portfolio-wide since there's no per-leg
  // target in this API. Re-add leg_id-based scoping here if the backend starts honoring it.
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setSummaryLoading(true);
        const res: any = await commongetrequest(
          "booking/sales-target-management/dashboard-summary",
          {
            params: {
              sales_id: userdata?.mapped_id,
              target_month_from: formatMonthParam(fromDate),
              target_month_to: formatMonthParam(toDate),
            },
          }
        );
        if (res?.status === 200) {
          setDashboardSummary(res?.data?.data || null);
        }
      } catch (err: any) {
        console.log(err?.message);
      } finally {
        setSummaryLoading(false);
      }
    };
    fetchDashboardSummary();
  }, [userdata?.mapped_id, fromDate, toDate]);

  const [bookingAuditList, setBookingAuditList] = useState<BookingAuditItem[]>([]);
  const [bookingAuditPage, setBookingAuditPage] = useState<number>(1);
  const [bookingShipmentTypeFilter, setBookingShipmentTypeFilter] = useState<string>("");
  const bookingAuditLimit = 20;
  // Fetched once with a high limit and filtered/paginated client-side below, since the
  // backend ignores a `booking_shipment_type_id` query param on this endpoint.
  const bookingAuditFetchLimit = 500;

  useEffect(() => {
    const fetchBookingAuditList = async () => {
      try {
        setAuditLoading(true);
        const res: any = await commongetrequest(
          "booking/sales-target-management/booking-audit-list",
          {
            params: {
              page: 1,
              limit: bookingAuditFetchLimit,
            },
          }
        );
        if (res?.status === 200) {
          setBookingAuditList(res?.data?.data || []);
        }
      } catch (err: any) {
        console.log(err?.message);
      } finally {
        setAuditLoading(false);
      }
    };
    fetchBookingAuditList();
  }, []);

  const filteredBookingAuditList = bookingShipmentTypeFilter
    ? bookingAuditList.filter(
        (item) =>
          String(item.booking_shipment_type_id) === bookingShipmentTypeFilter
      )
    : bookingAuditList;

  const bookingAuditTotalPages = Math.max(
    Math.ceil(filteredBookingAuditList.length / bookingAuditLimit),
    1
  );

  const paginatedBookingAuditList = filteredBookingAuditList.slice(
    (bookingAuditPage - 1) * bookingAuditLimit,
    bookingAuditPage * bookingAuditLimit
  );

  const [courierMap, setCourierMap] = useState<Record<number, string>>({});

  const [bookingShipmentTypes, setBookingShipmentTypes] = useState<BookingShipmentType[]>([]);

  useEffect(() => {
    const fetchBookingShipmentTypes = async () => {
      try {
        const res: any = await commongetrequest("admin/booking-shipment-type");
        if (res?.status === 200 && res?.data?.status) {
          setBookingShipmentTypes(res?.data?.data || []);
        }
      } catch (err: any) {
        console.log(err?.message);
      }
    };
    fetchBookingShipmentTypes();
  }, []);

  const bookingShipmentTypeMap = bookingShipmentTypes.reduce(
    (map: Record<number, string>, type) => {
      map[type.booking_shipment_type_id] = type.shipment_type;
      return map;
    },
    {}
  );

  useEffect(() => {
    const fetchCourierList = async () => {
      try {
        const res: any = await commongetrequest("admin/courier-product/0");
        if (res?.status === 200 && res?.data?.status) {
          const map: Record<number, string> = {};
          (res?.data?.data || []).forEach((courier: CourierProduct) => {
            map[courier.product_id] = courier.product_name;
          });
          setCourierMap(map);
        }
      } catch (err: any) {
        console.log(err?.message);
      }
    };
    fetchCourierList();
  }, []);

  const handleExportBookingAudit = () => {
    const tableData = filteredBookingAuditList.map((item, index) => ({
      "SR NO": index + 1,
      "BOOKING ID": item.pickup_id,
      "AWB NO": item.airwaybilno,
      "CARRIER": courierMap[item.courier_id] || `Courier #${item.courier_id}`,
      "WEIGHT (KG)": item.chargeable_weight,
      "REVENUE": item.revenue,
      "GROSS PROFIT": item.gp,
      "SHIPMENT TYPE":
        bookingShipmentTypeMap[item.booking_shipment_type_id] ||
        `Type #${item.booking_shipment_type_id}`,
    }));

    ExportToXLSX({
      tableData,
      leftAlignColumns: ["BOOKING ID", "AWB NO", "CARRIER", "SHIPMENT TYPE"],
      centerAlignColumns: ["SR NO"],
      rightAlignColumns: ["WEIGHT (KG)", "REVENUE", "GROSS PROFIT"],
      fileName: "Executive_Performance_Booking_Audit",
    });
  };

  const summary = dashboardSummary?.summary;

  const getLegData = (legName: string): LegDistributionItem =>
    dashboardSummary?.leg_distribution?.find((leg) =>
      leg.leg_name.toLowerCase().includes(legName.toLowerCase())
    ) || emptyLegData;

  const expressData = getLegData("Express");
  const cargoData = getLegData("Cargo");
  const importData = getLegData("Import");
  const domesticData = getLegData("Domestic");

  const getAvgWeight = (leg: LegDistributionItem) =>
    leg.total_actual_consignments
      ? leg.total_actual_tonnage / leg.total_actual_consignments
      : 0;

  const getMarginPercentage = (leg: LegDistributionItem) =>
    leg.total_actual_revenue
      ? (leg.total_actual_gp / leg.total_actual_revenue) * 100
      : 0;

  const [distributionMetric, setDistributionMetric] = useState<
    "count" | "revenue" | "tonnage" | "avgRevenue" | "grossProfit"
  >("count");

  const getDistributionValue = (leg: LegDistributionItem) => {
    switch (distributionMetric) {
      case "revenue":
        return leg.total_actual_revenue;
      case "tonnage":
        return leg.total_actual_tonnage;
      case "avgRevenue":
        return leg.total_actual_consignments
          ? leg.total_actual_revenue / leg.total_actual_consignments
          : 0;
      case "grossProfit":
        return leg.total_actual_gp;
      default:
        return leg.total_actual_consignments;
    }
  };

  const formatDistributionValue = (value: number) => {
    switch (distributionMetric) {
      case "revenue":
      case "avgRevenue":
      case "grossProfit":
        return formatCurrency(value);
      case "tonnage":
        return formatWeight(value);
      default:
        return formatNumber(value);
    }
  };

  const targetAvgWeight = summary?.total_target_consignments
    ? summary.total_target_tonnage / summary.total_target_consignments
    : 0;

  const distributionMetricLabel: Record<typeof distributionMetric, string> = {
    count: "SHIPMENTS COUNT",
    revenue: "REVENUE",
    tonnage: "TONNAGE",
    avgRevenue: "AVG. REVENUE/SHIPMENT",
    grossProfit: "GROSS PROFIT",
  };

  const handleExportShipmentDistribution = () => {
    const metricLabel = distributionMetricLabel[distributionMetric];
    const tableData = [
      { LEG: "Express", [metricLabel]: getDistributionValue(expressData) },
      { LEG: "Cargo", [metricLabel]: getDistributionValue(cargoData) },
      { LEG: "Import", [metricLabel]: getDistributionValue(importData) },
      { LEG: "Domestic", [metricLabel]: getDistributionValue(domesticData) },
    ];

    ExportToXLSX({
      tableData,
      leftAlignColumns: ["LEG"],
      centerAlignColumns: [],
      rightAlignColumns: [metricLabel],
      fileName: "Shipment_Distribution",
    });
  };

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
                {userdata?.display_name}
              </p>
            </div>
            {/* <div className="lg:ml-3 ml-0 my-1">
              / April 01, 2026 - April 21, 2026
            </div> */}
          </div>
        </div>

        <div className="lg:flex block  justify-between items-center">
          <button
            onClick={handleExportBookingAudit}
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
                  onChange={(date) => setFromDate(date)}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  popperProps={{ strategy: "fixed" }}
                  popperPlacement="bottom-start"
                  popperClassName="z-[9999]"
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
                  popperProps={{ strategy: "fixed" }}
                  popperPlacement="bottom-start"
                  popperClassName="z-[9999]"
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
          {summaryLoading && (
            <div className="flex items-center justify-center h-40 w-full">
              <IsLoading />
            </div>
          )}
          {!summaryLoading && activeExcutive === 1 && (
            <>
              <div className="mt-2 w-full mb-[20px]">
                <div className="grid grid-cols-12 gap-[14px] w-full">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group   h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etruck} alt="" className="w-[22px]" />
                        </figure>

                        <VarianceBadge
                          actual={expressData.total_actual_consignments}
                          target={summary?.total_target_consignments}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          Shipment
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatNumber(expressData.total_actual_consignments)}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : {formatNumber(summary?.total_target_consignments)}
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

                        <VarianceBadge
                          actual={expressData.total_actual_revenue}
                          target={summary?.total_target_revenue}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          REVENUE
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatCurrency(expressData.total_actual_revenue)}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : {formatCurrency(summary?.total_target_revenue)}
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

                        <VarianceBadge
                          actual={
                            activeWeight === 1
                              ? getAvgWeight(expressData)
                              : expressData.total_actual_tonnage
                          }
                          target={
                            activeWeight === 1
                              ? targetAvgWeight
                              : summary?.total_target_tonnage
                          }
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
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
                                  {formatWeight(getAvgWeight(expressData))}
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :{formatWeight(targetAvgWeight)}
                                </small>
                              </>
                            )}
                            {activeWeight === 2 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  {formatWeight(expressData.total_actual_tonnage)}
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :{formatWeight(summary?.total_target_tonnage)}
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

                        <VarianceBadge
                          actual={getMarginPercentage(expressData)}
                          target={summary?.target_gp_percentage}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          PROFITABILITY
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatPercentage(getMarginPercentage(expressData))}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target :{formatPercentage(summary?.target_gp_percentage)}
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
          {!summaryLoading && activeExcutive === 2 && (
            <>
              <div className="mt-2 w-full mb-[20px]">
                <div className="grid grid-cols-12 gap-[14px] w-full">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group   h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etruck} alt="" className="w-[22px]" />
                        </figure>

                        <VarianceBadge
                          actual={cargoData.total_actual_consignments}
                          target={summary?.total_target_consignments}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          Shipment
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatNumber(cargoData.total_actual_consignments)}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : {formatNumber(summary?.total_target_consignments)}
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

                        <VarianceBadge
                          actual={cargoData.total_actual_revenue}
                          target={summary?.total_target_revenue}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          REVENUE
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatCurrency(cargoData.total_actual_revenue)}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : {formatCurrency(summary?.total_target_revenue)}
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

                        <VarianceBadge
                          actual={
                            activeWeight === 1
                              ? getAvgWeight(cargoData)
                              : cargoData.total_actual_tonnage
                          }
                          target={
                            activeWeight === 1
                              ? targetAvgWeight
                              : summary?.total_target_tonnage
                          }
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
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
                                  {formatWeight(getAvgWeight(cargoData))}
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :{formatWeight(targetAvgWeight)}
                                </small>
                              </>
                            )}
                            {activeWeight === 2 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  {formatWeight(cargoData.total_actual_tonnage)}
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :{formatWeight(summary?.total_target_tonnage)}
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


                        <VarianceBadge
                          actual={getMarginPercentage(cargoData)}
                          target={summary?.target_gp_percentage}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          PROFITABILITY
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatPercentage(getMarginPercentage(cargoData))}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target :{formatPercentage(summary?.target_gp_percentage)}
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
          {!summaryLoading && activeExcutive === 3 && (
            <>
              <div className="mt-2 w-full mb-[20px]">
                <div className="grid grid-cols-12 gap-[14px] w-full">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group   h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etruck} alt="" className="w-[22px]" />
                        </figure>

                        <VarianceBadge
                          actual={importData.total_actual_consignments}
                          target={summary?.total_target_consignments}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          Shipment
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatNumber(importData.total_actual_consignments)}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : {formatNumber(summary?.total_target_consignments)}
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

                        <VarianceBadge
                          actual={importData.total_actual_revenue}
                          target={summary?.total_target_revenue}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          REVENUE
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatCurrency(importData.total_actual_revenue)}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : {formatCurrency(summary?.total_target_revenue)}
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

                        <VarianceBadge
                          actual={
                            activeWeight === 1
                              ? getAvgWeight(importData)
                              : importData.total_actual_tonnage
                          }
                          target={
                            activeWeight === 1
                              ? targetAvgWeight
                              : summary?.total_target_tonnage
                          }
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
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
                                  {formatWeight(getAvgWeight(importData))}
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :{formatWeight(targetAvgWeight)}
                                </small>
                              </>
                            )}
                            {activeWeight === 2 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  {formatWeight(importData.total_actual_tonnage)}
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :{formatWeight(summary?.total_target_tonnage)}
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


                        <VarianceBadge
                          actual={getMarginPercentage(importData)}
                          target={summary?.target_gp_percentage}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          PROFITABILITY
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatPercentage(getMarginPercentage(importData))}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target :{formatPercentage(summary?.target_gp_percentage)}
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
          {!summaryLoading && activeExcutive === 4 && (
            <>
              <div className="mt-2 w-full mb-[20px]">
                <div className="grid grid-cols-12 gap-[14px] w-full">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <div className="w-full relative overflow-hidden relative border-1 border-[#f1f1f1] rounded-lg p-[10px] mb-3  bg-white group   h-full">
                      <div className="  w-full flex px-1 pt-[2px] mb-2 items-center  justify-between">
                        <figure className=" w-[35px] h-[35px] flex items-center justify-center  rounded-[5px] z-[5] bg-[#f2eee5] ">
                          <img src={etruck} alt="" className="w-[22px]" />
                        </figure>

                        <VarianceBadge
                          actual={domesticData.total_actual_consignments}
                          target={summary?.total_target_consignments}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          Shipment
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatNumber(domesticData.total_actual_consignments)}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : {formatNumber(summary?.total_target_consignments)}
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

                        <VarianceBadge
                          actual={domesticData.total_actual_revenue}
                          target={summary?.total_target_revenue}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          REVENUE
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatCurrency(domesticData.total_actual_revenue)}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target : {formatCurrency(summary?.total_target_revenue)}
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

                        <VarianceBadge
                          actual={
                            activeWeight === 1
                              ? getAvgWeight(domesticData)
                              : domesticData.total_actual_tonnage
                          }
                          target={
                            activeWeight === 1
                              ? targetAvgWeight
                              : summary?.total_target_tonnage
                          }
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
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
                                  {formatWeight(getAvgWeight(domesticData))}
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :{formatWeight(targetAvgWeight)}
                                </small>
                              </>
                            )}
                            {activeWeight === 2 && (
                              <>
                                <h3 className=" text-[25px] font-medium text-[#303030]">
                                  {formatWeight(domesticData.total_actual_tonnage)}
                                </h3>

                                <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                                  Target :{formatWeight(summary?.total_target_tonnage)}
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


                        <VarianceBadge
                          actual={getMarginPercentage(domesticData)}
                          target={summary?.target_gp_percentage}
                        />

                         {/* <button className="hover:bg-[#f9ecd3] group top-[8px] right-[9px] bg-[#f1f5f9]  rounded-[6px] px-[1px] py-[1px] w-[21px] h-[21px] flex items-center justify-center">
                        <Download className="w-[13px] h-[13px] text-[#303030] group-hover:text-[#a36e0a]" />
                        </button> */}
                      </div>

                      <div className="  w-full  px-1 pt-[12px]">
                        <h2 className="text-[#696969] text-[14px]  mb-[5px] uppercase leading-[20px] group-hover:text-[#c48d13]">
                          PROFITABILITY
                        </h2>

                        <h3 className=" text-[25px] font-medium text-[#303030]">
                          {formatPercentage(getMarginPercentage(domesticData))}
                        </h3>

                        <small className=" text-[12px]  text-[#86888f] mb-[5px] block">
                          Target :{formatPercentage(summary?.target_gp_percentage)}
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
                {/* <div className="flex gap-2 ">
                                  <button
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
                                </div> */}
              </div>
              <div className="p-2  lg:p-3">
              

  <Current_analysis />







              </div>
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
                      value={distributionMetric}
                      onChange={(e) =>
                        setDistributionMetric(e.target.value as typeof distributionMetric)
                      }
                    >
                      <option value="count">Shipments Count </option>
                      <option value="revenue">Revenue </option>
                      <option value="tonnage">Tonnage </option>
                      <option value="avgRevenue">Avg. Revenue/Shipment </option>
                      <option value="grossProfit">Gross Profit </option>
                    </FormSelect>
                  </div>

                  <div className="flex gap-6 items-center mb-4 lg:mb-0">
                    <button
                      onClick={handleExportShipmentDistribution}
                      className="hover:bg-[#777779] flex items-center  bg-mustard px-3 py-[5px] text-[12px] rounded-lg text-white font-bold uppercase  relative overflow-hidden btnAnimation"
                    >
                      <Download className="w-[15px] mr-2" /> Download
                    </button>
                  </div>
                </div>

                <div className="w-full 2xl:mb-[60px] 2xl:mt-[60px] xl:mb-[70px] xl:mt-[70px] lg:mb-[70px] lg:mt-[70px]">
                  <Excutive_performace_chart
                    expressCount={getDistributionValue(expressData)}
                    cargoCount={getDistributionValue(cargoData)}
                    importCount={getDistributionValue(importData)}
                    domesticCount={getDistributionValue(domesticData)}
                  />
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
                          {formatDistributionValue(getDistributionValue(expressData))}
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
                          {formatDistributionValue(getDistributionValue(cargoData))}
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
                          {formatDistributionValue(getDistributionValue(importData))}
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
                          {formatDistributionValue(getDistributionValue(domesticData))}
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
        <div>
          <FormSelect
            formSelectSize="base"
            className="mt-0 w-[180px] h-[34px] bg-[#fffcf7] px-3 py-1 border border-[#f4ead6] rounded-full inline-block"
            aria-label="Filter by shipment type"
            value={bookingShipmentTypeFilter}
            onChange={(e) => {
              setBookingShipmentTypeFilter(e.target.value);
              setBookingAuditPage(1);
            }}
          >
            <option value="">All Shipment Types</option>
            {bookingShipmentTypes.map((type) => (
              <option
                key={type.booking_shipment_type_id}
                value={type.booking_shipment_type_id}
              >
                {type.shipment_type}
              </option>
            ))}
          </FormSelect>
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
                  AWB NO.
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
              {auditLoading && (
                <tr>
                  <td colSpan={8} className="py-10 text-center">
                    <div className="flex items-center justify-center">
                      <IsLoading />
                    </div>
                  </td>
                </tr>
              )}
              {!auditLoading && paginatedBookingAuditList.map((item, index) => (
                <tr
                  key={item.pickup_id}
                  className={`hover:bg-[#f7fafd] ${
                    index % 2 === 0 ? "bg-[#fdfdfd]" : "bg-[#fff]"
                  }`}
                >
                  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                    {(bookingAuditPage - 1) * bookingAuditLimit + index + 1}
                  </td>

                  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                    {item.pickup_id}
                  </td>

                  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                    {item.airwaybilno}
                  </td>

                  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                    <h5 className="inline-block rounded-[20px] px-[10px] py-[2px] bg-[#f1f5f9]  text-[12px] font-medium   text-[#555b61] border border-[#e3eaf2] text-center">
                      {courierMap[item.courier_id] || `Courier #${item.courier_id}`}
                    </h5>
                  </td>

                  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                    {formatWeight(item.chargeable_weight)}
                  </td>

                  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                    {formatCurrency(item.revenue)}
                  </td>

                  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                    {formatCurrency(item.gp)}
                  </td>
                  <td className=" top-[72px] z-10  border-b border-[#dbe8ee] py-[10px] px-[10px] text-[#303030] text-[15px]">
                    <h5 className="flex items-center">
                      <i className="bg-[#D3F9D8] rounded-full p-[1px] w-[21px] h-[21px] flex items-center justify-center ">
                        {item.booking_shipment_type_id === 1 ? (
                          <Plane className="w-[15px] h-[15px] text-[#09861b]" />
                        ) : (
                          <Truck className="w-[15px] h-[15px] text-[#09861b]" />
                        )}
                      </i>
                      <span className="text-[#2A9A37] ml-2">
                        {bookingShipmentTypeMap[item.booking_shipment_type_id] ||
                          `Type #${item.booking_shipment_type_id}`}
                      </span>
                    </h5>
                  </td>
                </tr>
              ))}
              {!auditLoading && paginatedBookingAuditList.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-[20px] text-[#8a8a8a] text-[14px]"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-[#575757] text-[13px]">
            Page {bookingAuditPage} of {bookingAuditTotalPages} ({formatNumber(filteredBookingAuditList.length)} records)
          </p>
          <div className="flex gap-2">
            <button
              disabled={bookingAuditPage <= 1}
              onClick={() => setBookingAuditPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 text-[13px] rounded-md border border-[#e1e8f0] text-[#575757] disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={bookingAuditPage >= bookingAuditTotalPages}
              onClick={() =>
                setBookingAuditPage((p) => Math.min(p + 1, bookingAuditTotalPages))
              }
              className="px-3 py-1 text-[13px] rounded-md border border-[#e1e8f0] text-[#575757] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Executive_performance;