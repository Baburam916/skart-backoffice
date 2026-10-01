import React, {useState} from "react";
// import FormSelect from "../../base-components/form/FormSelect";

import Daily_sale_lineChart from "./Daily_sale_lineChart";
import { FormSelect } from "../../../base-components/Form";
// import { FormSelect } from "../../base-components/Form";


const Performance_comparison  = () => {
 const [modeal, setModeal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(1);
  return (
    <>
    

  <div>
                  <div className="md:flex block gap-1 justify-between items-center">
                    <div className="   bg-[#f9f9f9] px-1  lg:px-2 py-1 border border-[#e7e7e7] rounded-full inline-block lg:mr-2 mb-[12px] lg:mb-0 mr-0">
                      <div className="flex gap-1 ">
                        <button
                          className={`md:px-[10px] md:py-[3px] px-[6px] py-[1px]  text-[#000] rounded-full text-[13px]  md:text-[14px]   ${
                            activeTab === 1
                              ? "bg-[#303030] text-[#fff] "
                              : "bg-[#f2f2f2] text-[#000] "
                          }`}
                          onClick={() => setActiveTab(1)}
                        >
                          Express
                        </button>

                        <button
                          className={`md:px-[10px] md:py-[3px] px-[6px] py-[1px]  text-[#000] rounded-full text-[13px]  md:text-[14px]     ${
                            activeTab === 2
                              ? "bg-[#303030] text-[#fff] "
                              : "bg-[#f2f2f2] text-[#000] "
                          }`}
                          onClick={() => setActiveTab(2)}
                        >
                          Cargo
                        </button>

                        <button
                          className={`md:px-[10px] md:py-[3px] px-[6px] py-[1px]  text-[#000] rounded-full text-[13px]  md:text-[14px]    ${
                            activeTab === 3
                              ? "bg-[#303030] text-[#fff] "
                              : "bg-[#f2f2f2] text-[#000] "
                          }`}
                          onClick={() => setActiveTab(3)}
                        >
                          Import
                        </button>

                        <button
                          className={`md:px-[10px] md:py-[3px] px-[6px] py-[1px]  text-[#000] rounded-full text-[13px]  md:text-[14px]   ${
                            activeTab === 4
                              ? "bg-[#303030] text-[#fff]"
                              : "bg-[#f2f2f2] text-[#000] "
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
                          className="mt-0  h-[34px]   bg-[#f9f9f9] px-3 py-1 border border-[#f1f1f1] rounded-full inline-block"
                          aria-label=".form-select-xs example"
                        >
                          <option>6 month avg  </option>
                          <option>3 month total rev  </option>
                          <option>Last month total rev </option>
                        </FormSelect>
                      </div>
                    </div>
                  </div>

                  <div className="tab-content mt-4">
                    {activeTab === 1 && (
                      <div>
                        <Daily_sale_lineChart />
                      </div>
                    )}
                    {activeTab === 2 && (
                      <div>
                        {" "}
                        <Daily_sale_lineChart />
                      </div>
                    )}
                    {activeTab === 3 && (
                      <div>
                        {" "}
                        <Daily_sale_lineChart />
                      </div>
                    )}
                    {activeTab === 4 && (
                      <div>
                        {" "}
                        <Daily_sale_lineChart />
                      </div>
                    )}
                  </div>
                </div>





    </>
  );
};

export default Performance_comparison ;