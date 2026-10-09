import { useEffect, useState } from "react";
import IsLoading from "../skart_sales/commoncomponents/isLoading/isLoading";
import {
  ThumbsDown,
  Clock8,
  UserPlus,
  Laptop2,
  Loader,
  ClipboardList,
} from "lucide-react";
import SearchImg from "../../assets/images/searchbox.png";
import { commongetrequest } from "../../AllServices/services";
import { useLogin } from "../skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";
import SpotpriceApproval from "../skart_sales/Spotprice/spotpricesapproval";

import CounterAnimator from "../skart_sales/commoncomponents/CounterAnimator/CounterAnimator";

import circleeback from "../../assets/images/circleeback.gif";
import { Box } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const inttopdata = {
  intjobs: 0,
  cancelled: 0,
  open: 0,
  requoted: 0,
  expired: 0,
  rejected: 0,
  approval_pending: 0,
  booked: 0,
};

const index = () => {
  const { userdata }: any = useLogin();
  const [topdata, setTopData] = useState<any>(inttopdata);
  const [topLoading, setTopLoading] = useState(false);

  const handletopdata = (name: string, value: any) => {
    setTopData((pre: any) => ({ ...pre, [name]: value }));
  };

  const gettopdata = async () => {
    try {
      setTopLoading(true);
      const res = await commongetrequest(`booking/get-spot-enquiry-count`);
      const res2 = await commongetrequest(
        `booking/job-count?sales_id=${userdata?.mapped_id}`,
      );
      if (res?.status == 200) {
        const data = res?.data?.data[0] || [];
        setTopData((pre: any) => ({ ...pre, ...data }));
      }
      if (res2?.status == 200) {
        const data = res2?.data?.data;
        handletopdata("intjobs", Number(data?.initiated) || 0);
        handletopdata("cancelled", Number(data?.cancelled) || 0);
      } else {
        setTopData(inttopdata);
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setTopLoading(false);
    }
  };

  useEffect(() => {
    gettopdata();
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <div className="mt-4 mb-6">
        <div className=" w-full ">
          {topLoading ? (
            <IsLoading />
          ) : (
            <>
              <div className="w-full mb-2 " data-aos="fade-up">
                <h1 className="text-lg font-bold ">Spot Enquires</h1>
              </div>

              <div className="grid grid-cols-12 gap-2 lg:gap-4">
                <div
                  className="col-span-12  sm:col-span-6 lg:col-span-3"
                  data-aos="fade-up"
                >
                  <div className="w-full bg-white rounded-md p-4 overflow-hidden min-h-[91px]">
                    <figure className="relative">
                      <Loader
                        className="w-[21px] h-[21px] text-[#bc8306] absolute z-[1]  -top-[7px] -left-[7px]"
                        strokeWidth={2.5}
                      />
                      <i
                        className="absolute  -top-[100px] w-[162px] -left-[102px] before:content-[''] before:absolute before:w-[110px] before:h-[110px] before:bg-[#f9e5b9] before:z-[0] before:bottom-[21px] 
                  before:left-[28px] before:rounded-full"
                      >
                        <img src={circleeback} alt="circleeback" />
                      </i>
                    </figure>

                    <div className="pl-[12px] text-right z-[2] relative">
                      <p className="text-2xl font-medium">
                        {/* {topdata?.approval_pending} */}
                        <CounterAnimator
                          value={topdata?.approval_pending}
                          not_decimal={1}
                        />
                      </p>
                      <h2 className="text-[13px] uppercase text-[#c0a15d] font-medium">
                        Approval Pending
                      </h2>
                    </div>
                  </div>
                </div>

                <div
                  className="col-span-12  sm:col-span-6 lg:col-span-3"
                  data-aos="fade-up"
                >
                  <div className="w-full bg-white rounded-md p-4 overflow-hidden min-h-[91px]">
                    <figure className="relative">
                      <ClipboardList
                        className="w-[21px] h-[21px] text-[#055731] absolute z-[2]  -top-[7px] -left-[7px]"
                        strokeWidth={2.5}
                      />
                      <i
                        className="absolute  -top-[100px] w-[162px] -left-[102px] before:content-[''] before:absolute before:w-[110px] before:h-[110px] before:bg-[#b9f4d8] before:z-[1] before:bottom-[21px] 
                  before:left-[28px] before:rounded-full"
                      >
                        <img
                          src={circleeback}
                          className="filter hue-rotate-[113deg]"
                          alt="circleeback"
                        />
                      </i>
                    </figure>

                    <div className="pl-[12px] text-right z-[2] relative">
                      <p className="text-2xl font-medium">
                        {/* {topdata?.requoted} */}

                        <CounterAnimator
                          value={topdata?.requoted}
                          not_decimal={1}
                        />
                      </p>
                      <h2 className="text-[13px] uppercase text-[#3e7d5f] font-medium">
                        Requoted
                      </h2>
                    </div>
                  </div>
                </div>

                <div
                  className="col-span-12  sm:col-span-6 lg:col-span-3"
                  data-aos="fade-up"
                >
                  <div className="w-full bg-white rounded-md p-4 overflow-hidden min-h-[91px]">
                    <figure className="relative">
                      <ThumbsDown
                        className="w-[21px] h-[21px] text-[#d82c2c] absolute z-[2]  -top-[7px] -left-[7px]"
                        strokeWidth={2.5}
                      />
                      <i
                        className="absolute  -top-[100px] w-[162px] -left-[102px] before:content-[''] before:absolute before:w-[110px] before:h-[110px] before:bg-[#ffdbdb] before:z-[1] before:bottom-[21px] 
                  before:left-[28px] before:rounded-full"
                      >
                        <img
                          src={circleeback}
                          className="filter hue-rotate-[303deg]"
                          alt="circleeback"
                        />
                      </i>
                    </figure>

                    <div className="pl-[12px] text-right z-[2] relative">
                      <p className="text-2xl font-medium">
                        {/* {topdata?.rejected} */}
                        <CounterAnimator
                          value={topdata?.rejected}
                          not_decimal={1}
                        />
                      </p>
                      <h2 className="text-[13px] uppercase text-[#b35f5f] font-medium">
                        Rejected
                      </h2>
                    </div>
                  </div>
                </div>

                <div
                  className="col-span-12  sm:col-span-6 lg:col-span-3"
                  data-aos="fade-up"
                >
                  <div className="w-full bg-white rounded-md p-4 overflow-hidden min-h-[91px]">
                    <figure className="relative">
                      <Box
                        className="w-[21px] h-[21px] text-[#158197] absolute z-[2]  -top-[7px] -left-[7px]"
                        strokeWidth={2.5}
                      />
                      <i
                        className="absolute  -top-[100px] w-[162px] -left-[102px] before:content-[''] before:absolute before:w-[110px] before:h-[110px] before:bg-[#b4e6f0] before:z-[1] before:bottom-[21px] 
                  before:left-[28px] before:rounded-full"
                      >
                        <img
                          src={circleeback}
                          className="filter hue-rotate-[504deg]"
                          alt="circleeback"
                        />
                      </i>
                    </figure>

                    <div className="pl-[12px] text-right z-[2] relative">
                      <p className="text-2xl font-medium">
                        <CounterAnimator
                          value={topdata?.booked}
                          not_decimal={1}
                        />
                      </p>
                      <h2 className="text-[13px] uppercase text-[#158197] font-medium">
                        Converted To Booking
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full" data-aos="fade-up">
        <SpotpriceApproval value={"limited"} gettopdata={gettopdata} />
      </div>
    </>
  );
};

export default index;
