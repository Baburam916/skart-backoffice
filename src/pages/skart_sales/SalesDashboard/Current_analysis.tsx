import React, {useEffect, useState} from "react";
// import FormSelect from "../../base-components/form/FormSelect";

import Daily_sale_lineChart from "./Daily_sale_lineChart";
import { FormSelect } from "../../../base-components/Form";
import { commongetrequest } from "../../../AllServices/services";
import { formatDateWithoutTime } from "../../../utils";
// import { FormSelect } from "../../base-components/Form";
import IsLoading from "../commoncomponents/isLoading/isLoading";

type PeriodOption = "Daily" | "Monthly" | "Yearly";

// activeTab (Express/Cargo/Import/Domestic) -> leg_id used by sales-target-management APIs
const TAB_TO_LEG_ID: Record<number, number> = { 1: 1, 2: 3, 3: 4, 4: 2 };

const formatPeriodLabel = (value: string) => {
  if (!value) return "";
  return formatDateWithoutTime(value);
};

const Current_analysis  = () => {
 const [modeal, setModeal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(1);
  const [period, setPeriod] = useState<PeriodOption>("Monthly");
  const [trendData, setTrendData] = useState<
    { name: string; target: number; actual: number }[] | undefined
  >(undefined);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    const fetchRevenueTrend = async () => {
      try {
        setChartLoading(true);
        const legId = TAB_TO_LEG_ID[activeTab];
        const res: any = await commongetrequest(
          "booking/sales-target-management/revenue-trend",
          { params: { period: period.toLowerCase(), leg_id: legId } }
        );
        if (res?.status === 200) {
          const raw = res?.data?.data;
          const list = Array.isArray(raw) ? raw : raw?.revenue_trend || [];
          setTrendData(
            list.map((item: any) => ({
              name: formatPeriodLabel(item?.period ?? item?.date),
              target: Number(item?.target_revenue ?? item?.target ?? 0),
              actual: Number(item?.actual_revenue ?? item?.actual ?? 0),
            }))
          );
        }
      } catch (err: any) {
        console.log(err?.message);
      } finally {
        setChartLoading(false);
      }
    };
    fetchRevenueTrend();
  }, [activeTab, period]);

  return (
    <>
    

  <div>
                  <div className="md:flex block gap-1 justify-between items-center">
                    <div className="   bg-[#fffcf7] px-1  lg:px-2 py-1 border border-[#f4ead6] rounded-full inline-block lg:mr-2 mb-[12px] lg:mb-0 mr-0">
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
                          value={period}
                          onChange={(e) => setPeriod(e.target.value as PeriodOption)}
                        >
                          <option value="Daily">Daily </option>
                          <option value="Monthly">Monthly </option>
                          <option value="Yearly">Yearly </option>
                        </FormSelect>
                      </div>
                    </div>
                  </div>

                  <div className="tab-content mt-4">
                    {chartLoading ? (
                      <IsLoading />
                    ) : (
                      <>
                        {activeTab === 1 && (
                          <div>
                            <Daily_sale_lineChart period={period} data={trendData} />
                          </div>
                        )}
                        {activeTab === 2 && (
                          <div>
                            <Daily_sale_lineChart period={period} data={trendData} />
                          </div>
                        )}
                        {activeTab === 3 && (
                          <div>
                            <Daily_sale_lineChart period={period} data={trendData} />
                          </div>
                        )}
                        {activeTab === 4 && (
                          <div>
                            <Daily_sale_lineChart period={period} data={trendData} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>





    </>
  );
};

export default Current_analysis ;