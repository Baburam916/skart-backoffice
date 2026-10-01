import { useEffect, useState } from "react";
import styles from "./tracker.module.css"
import { useAlert } from "../../../ContextProvider/AlertContext";
import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";
import { FormCheck, FormSwitch } from "../../../base-components/Form";
import { Truck } from "lucide-react";
import { FaLocationPin } from "react-icons/fa6";
import { ImLocation, ImLocation2 } from "react-icons/im";
import { MdLocationOn } from "react-icons/md";
import { convertUTCtoIST } from "../commoncomponents/CommonUtctoist/commonutctoist";
import IsLoading from "../commoncomponents/isLoading/isLoading";


export default function Tracker(props:any) {
  const { data, livelocationloading, length, externalevents,courierName,intdata } = props;
  const [events,setEvents]=useState<any>({internal:1,external:2})
  const [trackerdata,setTrackerdata]=useState<Array<any>>([])
  const {showAlert}=useAlert()
  useEffect(()=>{

  },[])
  const fetchData=async()=>{
    try{

    }catch(err:any){

    }
  }

  // console.log("tracking")
  function capitalizeWords(str) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <>
      <div className="flex justify-around shadow-lg border border-green-400 rounded-full min-[820px]:w-[60%] m-auto mt-2 p-4">
        <div className="">
          <label>Internal Scanning Events</label>
          <FormSwitch className="grid justify-items-center w-full text-center mt-3 sm:w-auto sm:ml-auto sm:mt-0">
            <FormSwitch.Input
              className=" shadow-lg"
              onChange={(e: any) => {
                const value = e.target.checked;
                if (data?.length >= 1 && value) {
                  setEvents((pre: any) => ({
                    ...pre,
                    internal: value ? 1 : 0,
                  }));
                } else {
                  if (data?.length == 0) {
                    showAlert("No Internal Events", "warning");
                  }
                  setEvents((pre: any) => ({
                    ...pre,
                    internal: 0,
                  }));
                }

                // handleToggle(2, item.branch_id);
              }}
              checked={events?.internal == 1 ? true : false}
              type="checkbox"
            />
          </FormSwitch>
        </div>

        <div>
          {" "}
          <label>External Scanning Events</label>
          <FormSwitch className="grid justify-items-center w-full text-center mt-3 sm:w-auto sm:ml-auto sm:mt-0">
            <FormSwitch.Input
              onChange={(e: any) => {
                const value = e.target.checked;
                if (externalevents?.length >= 1 && value) {
                  setEvents((pre: any) => ({
                    ...pre,
                    external: value ? 2 : 0,
                  }));
                } else {
                  if (externalevents?.length == 0) {
                    showAlert("No External Events", "warning");
                  }
                  setEvents((pre: any) => ({
                    ...pre,
                    external: 0,
                  }));
                }
                // setEvents((pre: any) => ({ ...pre, external: value ? 2 : 0 }));
              }}
              checked={events?.external == 2 ? true : false}
              type="checkbox"
              className=" shadow-lg"
            />
          </FormSwitch>
        </div>
      </div>
      <div
      //   className={`flex ${
      //     events?.internal && events?.external
      //       ? "justify-between"
      //       : "justify-center"
      //   } items-center border rounded-lg  shadow-lg
      // `}
      >
        <div
          className={` bg-white mt-2 ${styles["animate-timeline"]}  ${
            data?.length >= 5 && "overflow-auto overflow-x-hidden  h-[450px]"
          }  border border-green-200 rounded-lg `}
        >
          {livelocationloading ? (
            <IsLoading />
          ) : (
            <div
              className={`min-[620px]:flex ${
                events?.internal && events?.external
                  ? "justify-around"
                  : "justify-center"
              }  border rounded-lg  shadow-lg p-4  
      `}
            >
              {data?.length >= 1 && events?.internal == 1 ? (
                <div className="pl-4  w-[100%]">
                  <h1 className="text-center font-bold text-primary text-lg shadow-lg">
                    Internal Events (IST)
                  </h1>
                  {data
                    ?.sort((a, b) => new Date(a.date) - new Date(b.date))
                    ?.reverse()
                    .map((item: any, index: number) => (
                      <div className="w-full bg-white  ">
                        <div className="flex items-start">
                          <div className="flex flex-col items-center mr-4">
                            <CircleCheckIcon className="text-green-500 h-5 w-5" />
                            {/* <Truck className="text-green-500 h-8 w-8" /> */}
                            {index !== data?.length - 1 && (
                              <div className="w-0.5 h-16 bg-green-500" />
                            )}
                          </div>
                          <div>
                            <span
                              className={`${
                                // intdata?.is_open == 0
                                //   ? "text-sm font-bold py-1 px-3"
                                //   :
                                "text-xs py-0.5 px-2 "
                              }  text-green-500 bg-green-100   rounded-full 
                             
                               `}
                            >
                              {item?.status || ""}
                            </span>
                            <p className="text-xs text-gray-500 mt-1">
                              {" "}
                              {item?.date ? formatDate(item?.date) : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}{" "}
                </div>
              ) : (
                ""
              )}

              {externalevents?.length >= 1 && events?.external == 2 ? (
                <div className="pl-4 w-[100%]">
                  <h1 className="text-center font-bold text-primary text-lg shadow-lg">
                    External Events (GMT)
                  </h1>
                  {externalevents
                    ?.sort((a, b) => new Date(a.date) - new Date(b.date))
                    ?.reverse()
                    ?.map((item: any, index: number) => (
                      <div className="w-full bg-white  ">
                        <div className="flex items-start">
                          <div className="flex flex-col items-center mr-4">
                            <CircleCheckIcon className="text-green-500 h-5 w-5" />
                            {/* <Truck className="text-green-500 h-8 w-8" /> */}
                            {index !== externalevents?.length - 1 && (
                              <div
                                className={`w-0.5 ${
                                  item.hasOwnProperty("arrival_localtion") ||
                                  item.hasOwnProperty("update_location")
                                    ? "h-16"
                                    : "h-16"
                                }  bg-green-500`}
                              />
                            )}
                          </div>

                          <div>
                            {/* <span
                              className={`${
                                item?.status
                                  ?.toLowerCase()
                                  .includes("delivered")
                                  ? "text-sm font-bold py-1 px-3"
                                  : "text-xs py-0.5 px-2 "
                              }  text-green-500 bg-green-100   rounded-full ${
                                item?.status
                                  ?.toLowerCase()
                                  .includes("delivered")
                                  ? styles.continuousPulse
                                  : ""
                              } `}
                            >
                              {item?.status?.toLowerCase().includes("delivered")
                                ? "Delivered"
                                : item?.status }
                            </span> */}
                            <span
                              className={`${
                                intdata?.status_code == 400
                                  ? "text-sm font-bold py-1 px-3"
                                  : "text-xs py-0.5 px-2 "
                              }  text-green-500 bg-green-100   rounded-full ${
                                intdata?.status_code == 400
                                  ? styles.continuousPulse
                                  : ""
                              } `}
                            >
                              {intdata?.status_code ==400
                                ? "Delivered"
                                : item?.status}
                            </span>
                            {courierName &&
                              (courierName.toLowerCase().includes("fedex") ||
                              (courierName.toLowerCase().includes("aramex") &&
                                item.hasOwnProperty("arrival_localtion")) ? (
                                item?.arrival_localtion ? (
                                  <div>
                                    <div className="mt-1 flex">
                                      <span className=" text-danger">
                                        <ImLocation2 />
                                      </span>
                                      <span className="font-normal text-mustard ">
                                        {item?.arrival_localtion
                                          ? capitalizeWords(
                                              item?.arrival_localtion
                                            )
                                          : ""}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )
                              ) : item.hasOwnProperty("update_location") ? (
                                item?.update_location ? (
                                  <div>
                                    <div className="mt-1 flex">
                                      <span className=" text-danger">
                                        <ImLocation2 />
                                      </span>
                                      <span className="font-normal text-mustard ">
                                        {item?.update_location
                                          ? capitalizeWords(
                                              item?.update_location
                                            )
                                          : ""}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              ))}

                            <p className="text-xs text-gray-500">
                              {" "}
                              {item?.date ? formatDate(item?.date) : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}{" "}
                </div>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
// import { useEffect, useState } from "react";
// import styles from "./tracker.module.css";
// import { useAlert } from "../../../ContextProvider/AlertContext";
// import { formatDate } from "../Commoncomponents/commondateformat/datetoreqformat";

// export default function Tracker(props: any) {
//   const { data, livelocationloading } = props;
//   const [trackerdata, setTrackerdata] = useState<Array<any>>([]);
//   const { showAlert } = useAlert();
//   useEffect(() => {}, []);
//   const fetchData = async () => {
//     try {
//     } catch (err: any) {}
//   };
//   return (
//     <div
//       className={`p-4 bg-white border rounded-lg shadow-lg w-full m-auto  ${
//         styles["animate-timeline"]
//       } h-[350px] ${data?.length >= 3 && "overflow-auto"} `}
//     >
//       {livelocationloading ? (
//         <div className="flex justify-center py-16 px-10 items-center">
//           <div className="animate-spin  rounded-full border-t-4 border-primary border-t-primary h-[auto] w-12"></div>
//         </div>
//       ) : data?.length >= 1 ? (
//         <div className="flex overflow-auto">
//           {data
//             ?.sort((a, b) => new Date(a.date) - new Date(b.date))
//             ?.map((item: any, index: number) => (
//               <div className=" bg-white  " style={{ minWidth: "200px" }}>
//                 <div className="w-full">
//                   <div className="w-full  mr-4">
//                     {index !== data?.length - 1 && (
//                       <div>
//                         <div className="flex">
//                           {" "}
//                           <div className="w-full h-1.5 bg-green-500 mt-8" />
//                           <div>
//                             {" "}
//                             <CircleCheckIcon className="text-green-500 h-16 w-16 " />
//                           </div>{" "}
//                           <div className="w-full h-1.5 bg-green-500 mt-8" />
//                           {/* <div>
                   
//                             <span className="text-xs text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
//                               {item?.status ? item?.status : "N.A"}
                           
//                             </span>
                          
//                             <p className="text-xs text-gray-500">
//                               {item?.date ? formatDate(item?.date) : ""}
                         
//                             </p>
                        
//                           </div> */}
//                         </div>
//                         <div className=" text-center ">
//                           <span className="text-xs text-green-500 bg-green-100 py-0.5 px-2 rounded-full">
//                             {item?.status ? item?.status : "N.A"}
//                           </span>

//                           <p className="text-xs text-gray-500">
//                             {item?.date ? formatDate(item?.date) : ""}
//                           </p>
//                         </div>
//                       </div>
//                     )}
//                   </div>
               
//                 </div>
//               </div>
//             ))}
//         </div>
//       ) : (
//         <div className="flex items-center py-16 px-10">
//           <h1 className="text-center text-primary">OOps.. No data found!..</h1>
//         </div>
//       )}
//     </div>
//   );
// }

// function CircleCheckIcon(props) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <circle cx="12" cy="12" r="10" />
//       <path d="m9 12 2 2 4-4" />
//     </svg>
//   );
// }
