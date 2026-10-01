import { useEffect, useState } from "react";
import IsLoading from "../skart_sales/commoncomponents/isLoading/isLoading";
import { ThumbsDown, Clock8, UserPlus, Laptop2 } from "lucide-react";
import SearchImg from "../../assets/images/searchbox.png";
import { commongetrequest } from "../../AllServices/services";
import { useLogin } from "../skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";
import SpotpriceApproval from "../skart_sales/Spotprice/spotpricesapproval";
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
        `booking/job-count?sales_id=${userdata?.mapped_id}`
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

  return (
    <>
      <div>
        <div className="grid lg:grid-cols-12 md:grid-cols-12 sm:grid-cols-12 gap-2 mt-4 p-4">
          <div className="flex lg:col-span-12 md:col-span-12 sm:col-span-12 bg-white rounded-md justify-between shadow-lg">
            <div className="lg:flex md:flex sm:block w-full">
              <div className="bg-gray-100 p-4 text-center sm:block w-full lg:w-48 md:w-24 mb-3 lg:mb-0 sm:mb-0 rounded-l-md ">
                <div className="grid grid-cols-1">
                  <i className=" md:inline-block hidden">
                    <img src={SearchImg} alt="Search" />
                  </i>
                  <h5 className="text-xl lg:text-lg md:text-sm sm:text-sm">
                    Spot Enquires
                  </h5>
                </div>
              </div>

              <div className=" w-full p-2 items-center flex">
                {topLoading ? (
                  <IsLoading />
                ) : (
                <ul className="flex-wrap flex lg:flex md:flex sm:flex w-full ">
                  <li className=" flex w-1/2 lg:w-1/4 md:w-1/4 sm:w-1/4 mb-2 lg:mb-0 md:mb-0 sm:mb-0">
                    <Clock8 className="w-8 h-8 p-[3px] lg:p-[5px] text-blue-400 bg-blue-100 rounded-3xl" />
                    <p className="pl-2 text-sm lg:text-base md:text-base sm:text-base">
                      Approval Pending{" "}
                      <b className="block">{topdata?.approval_pending}</b>
                    </p>
                  </li>

                  <li className=" flex w-1/2 lg:w-1/4 md:w-1/4 sm:w-1/4 mb-2 lg:mb-0 md:mb-0 sm:mb-0">
                    <UserPlus className="w-8 h-8 p-[3px] lg:p-[5px] text-mustard bg-yellow-100 rounded-3xl" />
                    <p className="pl-2 text-sm lg:text-base md:text-base sm:text-base">
                      Requoted <b className="block">{topdata?.requoted}</b>
                    </p>
                  </li>

                  <li className="flex  w-1/2 lg:w-1/4 md:w-1/4 sm:w-1/4 mb-2 lg:mb-0 md:mb-0 sm:mb-0">
                    <ThumbsDown className="w-8 h-8 p-[3px] lg:p-[5px] text-red-500 bg-red-100 rounded-3xl" />
                    <p className="pl-2 text-sm lg:text-base md:text-base sm:text-base">
                      Rejected <b className="block">{topdata?.rejected}</b>
                    </p>
                  </li>

                  <li className="flex w-1/2 lg:w-1/4 md:w-1/4 sm:w-1/4 lg:mb-0 md:mb-0 sm:mb-0">
                    <Laptop2 className="w-8 h-8 p-[3px] lg:p-[5px] text-green-400 bg-green-100 rounded-3xl" />
                    <p className="pl-2 text-sm lg:text-base md:text-base sm:text-base">
                      Converted To Booking{" "}
                      <b className="block">{topdata?.booked}</b>
                    </p>
                  </li>
                </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 mt-4 rounded-md">
          <div className="col-span-12">
            <div className="bg-white rounded-lg shadow-md">
              <SpotpriceApproval value={"limited"} gettopdata={gettopdata} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
