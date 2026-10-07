import React, { useEffect, useState } from "react";
import { FormInput, FormLabel } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import {
  Download,
  Eye,
  FileText,
  MessageCircle,
  RefreshCcw,
  Search,
  Settings,
} from "lucide-react";
import CommonSearchableAll from "../commoncomponents/CommonSearchableall/CommonSearchableall";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import IsLoading from "../commoncomponents/isLoading/isLoading";
import Table from "../../../base-components/Table";
import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";
import { Link } from "react-router-dom";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import CommonPagination from "../../../components/Pagination";
import { jsontocsv } from "../commoncomponents/JsonToCsv/Jsontocsv";
import { tranfereddata } from "../../../components/booking_summary_table/TransformKey";
import { ExportToXLSX } from "../commoncomponents/ExportToXLSX/ExportToXLSX";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import LoadingIcon from "../../../base-components/LoadingIcon";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useLogin } from "../commoncomponents/LoginContextProvider/LoginContextProvider";
import { indianFormat } from "../../../utils";
import { User } from "lucide-react";

import AOS from "aos";
import "aos/dist/aos.css";
import { Compass } from "lucide-react";

const intfranchiseedata = {
  franchisee_name: "",
  franchisee_id: "",
};

function CommercialDiscrepancy() {
  const { showAlert } = useAlert();
  const [selectedfranchisedata, setSelectedfranchisedata] =
    useState<any>(intfranchiseedata);
  const [searchvalue, setSearchvalue] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [allLoading, setAllLoading] = useState(false);
  const [allDiscrepancy, setAllDiscrepancy] = useState<any>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [chatDescription, setChatDescription] = useState("");
  const [disputeCommentLoading, setDisputeCommentLoading] = useState(false);
  const [chatdisputeId, setChatdisputeId] = useState<string | number | null>(
    null,
  );
  const [handleDisputeCommentLoading, setHandleDisputeCommentLoading] =
    useState(false);
  const [allDataDisputeComment, setAllDataDisputeComment] = useState<any[]>([]);
  const [remarksError, setRemarksError] = useState("");
  const [userData, setUserData] = useState<any[]>([]);
  // const { userdata } = useLogin();

  const getCommercialDiscrepancyData = async () => {
    try {
      setAllLoading(true);

      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        key: searchvalue || "",
        franchisee_id: selectedfranchisedata?.franchisee_id || "",
      });

      const res = await commongetrequest(
        `booking/disputes/get-cargo-disputes?${params.toString()}`,
      );

      if (res?.status === 200 || res?.status === 201) {
        setAllDiscrepancy(res?.data?.data || []);
        const totalCount = Number(res?.data?.total_count || 0);
        setTotalPages(Math.ceil(totalCount / limit));
      }
    } catch (error) {
      console.error("Error fetching discrepancy:", error);
    } finally {
      setAllLoading(false);
    }
  };

  const handledownload = (data: any) => {
    ExportToXLSX({
      tableData: data,
      leftAlignColumns: [
        "TICKET NUMBER",
        "AIRWAYBILL NUMBER",
        "FRANCHISEE NAME",
        "DESCRIPTION",
      ],
      centerAlignColumns: ["RAISED ON", "BOOKING DATE"],
      rightAlignColumns: ["QUERY AMOUNT"],
      fileName: "commercial_discrepancy",
    });
  };

  useEffect(() => {
    getCommercialDiscrepancyData();
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = () => {
    setPage(1);
    getCommercialDiscrepancyData();
  };

  const fun1 = () => {
    setPage(1);
  };
  const funtoempty = () => {
    setSelectedfranchisedata(intfranchiseedata);
    setPage(1);
  };

  const disputeComment = async () => {
    if (!chatDescription.trim()) {
      setRemarksError("Please enter remarks");
      return;
    }
    try {
      setDisputeCommentLoading(true);
      const payload = {
        dispute_id: chatdisputeId,
        comment_text: chatDescription,
      };
      const res = await commonpostrequest("booking/dispute-comments", payload);
      if (res?.status === 201) {
        await handleDisputeComment(chatdisputeId);
        setChatDescription("");
        setRemarksError("");
        showAlert("Comment added successfully", "success");
      } else {
        showAlert(res?.response?.data?.message, "error");
      }
    } catch (error) {
      console.error("Error closing disputeComment:", error);
    } finally {
      setDisputeCommentLoading(false);
    }
  };

  const handleDisputeComment = async (dispute_id: any) => {
    try {
      setHandleDisputeCommentLoading(true);
      const res = await commongetrequest(
        `booking/dispute-comments/of/${dispute_id}`,
      );
      if (res?.status === 200 || res?.status === 204) {
        setAllDataDisputeComment(res?.data?.data || []);
      } else {
      }
    } catch (error) {
      console.error("Error closing handleDisputeComment:", error);
    } finally {
      setHandleDisputeCommentLoading(false);
    }
  };

  const getintdata = async () => {
    try {
      const res = await commongetrequest("auth/user");
      if (res?.status == 200 || res?.status == 204) {
        setUserData(res?.data?.data?.result || []);
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  useEffect(() => {
    getintdata();
  }, []);

  const Description = (
    <div className="h-[300px] flex flex-col p-0">
      {/* Scrollable table area - takes up remaining space */}
      <div className="flex-1 overflow-y-auto border rounded-md mb-4">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100 z-10">
            <tr className="text-left">
              <th className="border p-2 bg-gray-100">Name</th>
              <th className="border p-2 bg-gray-100">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {handleDisputeCommentLoading ? (
              <tr>
                <td colSpan={2} className="text-center p-3">
                  Loading...
                </td>
              </tr>
            ) : allDataDisputeComment?.length > 0 ? (
              allDataDisputeComment.map((item: any, index: number) => {
                // 🔥 find matching user
                const matchedUser = (userData || []).find((user: any) =>
                  (user?.type || []).some(
                    (t: any) => String(t?.emp_id) === String(item?.user_id),
                  ),
                );

                return (
                  <tr key={index}>
                    <td className="border p-2 bg-white">
                      {matchedUser?.name ||
                        item?.user_name ||
                        item?.user_id ||
                        ""}
                    </td>
                    <td className="border p-2 bg-white">
                      {item?.comment_text || "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={2} className="text-center p-3">
                  No remarks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fixed input and button area at bottom */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-2 w-full">
        <div className="w-full sm:flex-1 min-w-0 relative">
          <FormLabel>
            Remarks: <span className="text-red-400">*</span>
          </FormLabel>

          <FormInput
            type="text"
            value={chatDescription}
            onChange={(e: any) => {
              const value = e.target.value;
              setChatDescription(value);
              if (value.trim()) {
                setRemarksError("");
              }
            }}
            placeholder="Enter Remarks..."
          />
          {remarksError && (
            <p className="text-red-500 text-sm mt-1 absolute bottom-[-24px] left-[0px]">
              {remarksError}
            </p>
          )}
        </div>
        <div className="mt-[10px] lg:mt-[25px]">
          <Button
            onClick={disputeComment}
            className="bg-mustard text-white px-4 py-2 rounded-md h-[38px] border-none"
            disabled={disputeCommentLoading}
          >
            Submit
            {disputeCommentLoading && (
              <LoadingIcon
                icon="puff"
                color="white"
                className="w-5 h-5 ml-2 stroke-2.5 text-white"
              />
            )}
          </Button>
        </div>{" "}
      </div>
    </div>
  );

  const Footer = (
    <div className="flex justify-end space-x-2">
      <Button
        className="bg-red-400 text-white px-4 py-2 rounded-md  border-none"
        onClick={() => {
          setOpenModal(false);
          setChatDescription("");
          setRemarksError("");
        }}
      >
        Cancel
      </Button>
    </div>
  );

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <>
      <div className="w-full mt-2 mb-4">
        <div
          className="mt-1 w-full bg-white rounded-[10px]  border border-white"
          data-aos="fade-up"
        >
          <div className=" w-full py-2  px-3 border-b border-white commonGBackOffice  rounded-t-[10px]">
            <div className="flex-wrap lg:flex-nowrap flex gap-2 items-center justify-between w-full commonGBackOfficeInner">
              <div>
                <div className="flex items-center gap-2" data-aos="fade-up">
                  <i className=" w-[25px] h-[25px]  rounded-lg flex items-center justify-center bg-mustard">
                    <Compass className="w-[17px]  text-[#fff] " />
                  </i>
                  <h4 className="text-[16px] font-medium text-white">
                    COMMERCIAL DISCREPANCY
                  </h4>
                </div>
              </div>

              <div
                className="flex items-center w-full lg:w-auto"
                data-aos="fade-up"
              >
                <div className="flex  space-x-2 w-full lg:w-auto">
                  <div className=" w-full lg:w-auto">
                    <FormInput
                      className="p-2.5 h-[36px] rounded-md border-none w-full"
                      value={searchvalue}
                      onChange={(e: any) => {
                        setSearchvalue(e.target.value);
                      }}
                      placeholder="Search.."
                    />
                  </div>
                  <div>
                    <Button
                      className="py-2 px-3 bg-success text-white border-none"
                      onClick={() => {
                        const mappedData = (allDiscrepancy || []).map(
                          (item: any) => ({
                            ticket_number: item?.ticket_no || "",
                            franchisee_name: item?.franchisee_name || "",
                            airwaybill_number: item?.airwaybilno || "",
                            query_amount: indianFormat(
                              item?.dispute_amount || "",
                            ),
                            raised_on: formatDate(item?.raised_on || ""),
                            booking_date: formatDate(item?.booking_date || ""),
                            description: item?.description || "",
                          }),
                        );
                        handledownload(mappedData);
                      }}
                    >
                      <Download className="w-[15px] h-[15px] mr-[3px]" />{" "}
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className=" w-full p-2 lg:p-3 border-b border-[#fffaef] bg-[#fffaef] "
            data-aos="fade-up"
          >
            <div className="grid grid-cols-12 gap-2 w-full">
              <div className="col-span-12 lg:col-span-4">
                <CommonSearchableAll
                  apiEndpoint={`admin/franchisee-settings`}
                  placeholder={"Search By Franchisee"}
                  selecteddata={selectedfranchisedata}
                  setSelecteddata={setSelectedfranchisedata}
                  fun1={fun1}
                  comingselectedname={"franchisee_name"}
                  comingselectedid={"franchisee_id"}
                  funtoempty={funtoempty}
                  key1={"key"}
                  zIndex={20}
                  className="!border-none"
                />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <div className="flex gap-2">
                  <div className="">
                    <Button
                      onClick={handleSearch}
                      className="bg-mustard text-white px-4 py-2 rounded-md border-none"
                    >
                      <Search className="w-[15px] h-[15px] mr-[3px]" /> Search
                    </Button>
                  </div>

                  <div className="">
                    <Button
                      onClick={() => {
                        setSelectedfranchisedata(intfranchiseedata);
                        setSearchvalue("");
                        setPage(1);
                      }}
                      disabled={
                        !searchvalue && !selectedfranchisedata?.franchisee_id
                      }
                      className="bg-red-400 text-white px-4 py-2 rounded-md border-none "
                    >
                      <RefreshCcw className="w-[15px] h-[15px] mr-[3px]" />{" "}
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-2  lg:p-6">
            <div>
              <div className="bg-white w-full overflow-auto" data-aos="fade-up">
                {allLoading ? (
                  <IsLoading />
                ) : (
                  <Table sm hover>
                    {/* Table headers */}
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="text-right whitespace-nowrap">
                          S.NO.
                        </Table.Th>
                        <Table.Th className="text-center whitespace-nowrap">
                          REMARKS
                        </Table.Th>
                        {/* <Table.Th className="text-center whitespace-nowrap">
                    REMARKS
                  </Table.Th> */}
                        <Table.Th className="text-left whitespace-nowrap">
                          TICKET NUMBER
                        </Table.Th>
                        <Table.Th className="text-left whitespace-nowrap">
                          FRANCHISEE NAME
                        </Table.Th>
                        <Table.Th className="text-left whitespace-nowrap">
                          AIRWAYBILL NUMBER
                        </Table.Th>
                        <Table.Th className="text-right whitespace-nowrap">
                          QUERY AMOUNT
                        </Table.Th>
                        <Table.Th className="text-center whitespace-nowrap">
                          RAISED ON
                        </Table.Th>
                        <Table.Th className="text-center whitespace-nowrap">
                          BOOKING DATE
                        </Table.Th>
                        <Table.Th className="text-left whitespace-nowrap">
                          DESCRIPTION
                        </Table.Th>
                        {/* <Table.Th className="text-center whitespace-nowrap">
                    ATTACHMENT
                  </Table.Th> */}
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {allDiscrepancy?.length >= 1 &&
                        allDiscrepancy?.map((item: any, index: any) => (
                          <Table.Tr key={index} className="intro-x">
                            <Table.Td className="text-right">
                              {(page - 1) * limit + index + 1}
                            </Table.Td>
                            <Table.Td className="text-center">
                              <Button
                                className="border-none"
                                onClick={(event: React.MouseEvent) => {
                                  setOpenModal(true);
                                  setChatdisputeId(item?.dispute_id);
                                  handleDisputeComment(item?.dispute_id);
                                }}
                              >
                                <MessageCircle className="w-5 h-5" />
                              </Button>
                            </Table.Td>
                            {/* <Table.Td className="text-center">
                        <Button
                          className="border-none"
                          onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setChatdisputeId(item?.dispute_id);
                            handleDisputeComment(item?.dispute_id);
                          }}
                        >
                          <MessageCircle />
                        </Button>
                      </Table.Td> */}
                            <Table.Td className="text-left whitespace-nowrap">
                              {item?.ticket_no || ""}
                            </Table.Td>
                            <Table.Td className="text-left whitespace-nowrap">
                              {item?.franchisee_name || ""}
                            </Table.Td>
                            <Table.Td className="text-left whitespace-nowrap">
                              {item?.airwaybilno || ""}
                            </Table.Td>
                            <Table.Td className="text-right whitespace-nowrap">
                              {indianFormat(item?.dispute_amount || "")}
                            </Table.Td>
                            <Table.Td className="text-center whitespace-nowrap">
                              {formatDate(item?.raised_on || "")}
                            </Table.Td>
                            <Table.Td className="text-center whitespace-nowrap">
                              {formatDate(item?.booking_date || "")}
                            </Table.Td>
                            <Table.Td className="text-left whitespace-nowrap">
                              {item?.description || ""}
                            </Table.Td>
                            {/* <Table.Td className="text-center whitespace-nowrap">
                        {item?.attachment ? (
                          <div className="flex justify-center">
                            <Link target="_blank" to={`${item?.attachment}`}>
                              <FileText className="text-mustard" />
                            </Link>
                          </div>
                        ) : (
                          ""
                        )}
                      </Table.Td> */}
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                )}
              </div>
              {allDiscrepancy?.length == 0 ? <Nodatafound /> : ""}

              {totalPages > 1 && (
                <CommonPagination
                  totalpages={totalPages}
                  onPageChange={handlePageChange}
                  page={page}
                />
              )}

              {openModal && (
                <CommonModal
                  open={openModal}
                  setOpen={setOpenModal}
                  title={<span className="text-white">Remarks</span>}
                  description={Description}
                  footer={Footer}
                  size={"lg"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommercialDiscrepancy;
