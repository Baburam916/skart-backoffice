import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../../../../assets/images/dashboardimg.png";
import { indianFormat } from "../../../../utils";
import { useLogin } from "../../commoncomponents/LoginContextProvider/LoginContextProvider";
import { Clock, IndianRupee, MailCheck, MessageSquare, User } from "lucide-react";
import { Building2 } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Briefcase } from "lucide-react";
import Button from "../../../../base-components/Button";
import { FormInput } from "../../../../base-components/Form";

const PdfExport = ({
  franchiseeName,
  enquiryNumber,
  exposureData,
  creditBalData,
  salespersondata,
  // total_credit,
  // Request_credit_amount,
  // total_exposure,
  // acl,
  hubData,
  dataForm,
  franchisee,
  // approver1,
  // approver2,
  // collection_date,
  // thirty,
  // thirtytosixty,
  // sixtytoninty,
  // greaterninty,
  branchname,
}: any) => {
  const printRef = useRef();
  const { userdata } = useLogin();
  // Extract franchisee info

  console.log("exposureData", exposureData?.[0]?.acl);

  const labels = [
    "Name of Agent",
    "Spot Enquiry Number",
    `Chargeable Weight (${creditBalData?.weight_unit})`,
    "Field Sales",
    "Margin (Per Kg)",

    "Total Sell",
    "Total Buy",
    "Total Credit Assigned",
    "Requested Credit Amount",
    "Available Credit Limit",
    "Outstanding",
    "Unbilled Amount",
    "Credit Days",
    // "Approver 1",
    // "Approver 2",
    // "Collection Date",
    "UPTO 30 DAYS",
    "30 - 60 DAYS",
    "60 - 90 DAYS",
    "90 - 120 DAYS",
    ">120 DAYS",
    "Total Exposure",
  ];

  function getValues(obj, string) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.includes(string)) {
        return value;
      }
    }
    return null;
  }

  const getValue = (item, label, value) => {
    switch (label) {
      case "Name of Agent":
        return item?.franchisee_name || "";
      case "Spot Enquiry Number":
        return creditBalData?.booking_no || "-";
      case `Chargeable Weight (${creditBalData?.weight_unit})`:
        return creditBalData?.weight && !value ? creditBalData?.weight : "";
      case "Field Sales":
        return salespersondata?.length >= 1 && !value
          ? salespersondata.join(",")
          : "";
      case "Margin (Per Kg)":
        return creditBalData?.margin && !value ? creditBalData?.margin : "";

      case `Total Sell`:
        return creditBalData?.sell && !value ? creditBalData?.sell : "";
      case `Total Buy`:
        return creditBalData?.buy && !value ? creditBalData?.buy : "";
      case "Total Credit Assigned":
        return item?.total_credit_assigned
          ? indianFormat(item?.total_credit_assigned)
          : "0";
      case "Available Credit Limit":
        return item?.acl || 0;
      case "Outstanding":
        return indianFormat(Number(creditBalData?.outstanding)) || 0;
      case "Unbilled Amount":
        return indianFormat(Number(creditBalData?.unbilled)) || 0;
      case "Requested Credit Amount":
        return indianFormat(creditBalData?.credit_limit || 0);
      case "Credit Days":
        return creditBalData?.credit_days || 0;
      case "UPTO 30 DAYS":
        return indianFormat(Number(getValues(item, "(0-30)") || 0));
      case "30 - 60 DAYS":
        return indianFormat(Number(getValues(item, "(31-60)") || 0));
      case "60 - 90 DAYS":
        return indianFormat(Number(getValues(item, "(61-90)") || 0));
      case "90 - 120 DAYS":
        return indianFormat(Number(getValues(item, "(91-120)") || 0));
      case ">120 DAYS":
        return indianFormat(Number(getValues(item, "(>120)") || 0));
      case "Total Exposure":
        return indianFormat(item?.total_amount || 0);

      case "Approver 1":
        return approver1 || "-";
      case "Approver 2":
        return approver2 || "-";
      case "Collection Date":
        return collection_date || "-";
      case "Requested By":
        return userdata?.display_name;
      case "Requested Date":
        return new Date(Date.now()).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      default:
        return "-";
    }
  };
  // Extract credit approval info
  const approver1 = creditBalData?.credit_app1 || "";
  const approver2 = creditBalData?.credit_app2 || "";
  const collection_date = creditBalData?.collection_date || "";

  // Aging bucket values from exposureData[0]
  const exp = exposureData?.[0] || {};

  const thirty = indianFormat(Number(getValues(exp, "(0-30)") || 0));
  const thirtytosixty = indianFormat(Number(getValues(exp, "(31-60)") || 0));
  const sixtytoninty = indianFormat(Number(getValues(exp, "(61-90)") || 0));
  const greaterninty = indianFormat(
    Number(getValues(exp, "(91-120)") || 0) +
    Number(getValues(exp, "(>120)") || 0)
  );



  const total_exposure = indianFormat(Number(exp?.total_amount || 0));
  // Prepare aggregated exposure totals
  let total_0_30 = 0;
  let total_31_60 = 0;
  let total_61_90 = 0;
  let total_91_120 = 0;
  let total_gt_120 = 0;
  let total_exposure_amount = 0;

  exposureData.forEach((item: any) => {
    total_0_30 += Number(getValues(item, "(0-30)"));
    total_31_60 += Number(getValues(item, "(31-60)"));
    total_61_90 += Number(getValues(item, "(61-90)"));
    total_91_120 += Number(getValues(item, "(91-120)"));
    total_gt_120 += Number(getValues(item, "(>120)"));
    total_exposure_amount += Number(item?.total_amount || 0);
  });

  function getValues(obj: any, string: string) {
    for (const [key, value] of Object.entries(obj)) {
      if (key.includes(string)) {
        return value;
      }
    }
    return null;
  }

  return (

    <div>
      <div
        ref={printRef}
      // className="p-4 bg-white text-black w-full max-w-[800px] mx-auto"
      >
        {/* Header Section */}
        {/* <table style={{ width: "100%", fontFamily: "arial" }}>
          <tbody>
            <tr>
              <td style={{ borderBottom: "1px solid #3c3c3c" }}>
                <img src={logo} alt="Logo" style={{ maxWidth: "200px" }} />
              </td>
              <td
                style={{ borderBottom: "1px solid #3c3c3c", textAlign: "left" }}
              >
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div>
                    <p style={{ fontWeight: "bold", fontSize: "15px" }}>
                      SKART GLOBAL EXPRESS PVT. LTD.
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      {hubData?.find(
                        (item: any) => item?.hub_id == dataForm?.hub_id
                      )?.hub_address || ""}
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      {hubData?.find(
                        (item: any) => item?.hub_id == dataForm?.hub_id
                      )?.city || ""}
                      ,{" "}
                      {hubData?.find(
                        (item: any) => item?.hub_id == dataForm?.hub_id
                      )?.state || ""}
                      ,{" "}
                      {hubData?.find(
                        (item: any) => item?.hub_id == dataForm?.hub_id
                      )?.pincode || ""}
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      Tel No. -{" "}
                      {hubData?.find(
                        (item: any) => item?.hub_id == dataForm?.hub_id
                      )?.contact_no || ""}
                    </p>
                    <p style={{ fontSize: "14px" }}>
                      Email -{" "}
                      {hubData?.find(
                        (item: any) => item?.hub_id == dataForm?.hub_id
                      )?.email_id || ""}
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table> */}

        {/* Credit Info Table */}
        {/* <table
          style={{
            width: "100%",
            marginTop: "13px",
            fontFamily: "arial",
            border: "1px solid #000",
          }}
          cellSpacing="0"
          cellPadding="0"
        >
          <tbody>
            <tr>
              <td
                style={{
                  padding: "20px",
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                }}
              ></td>
              <td
                style={{
                  padding: "20px",
                  fontWeight: "bold",
                  textAlign: "right",
                  borderRight: "1px solid #000",
                  borderBottom: "1px solid #000",
                }}
              >
                REQUESTING BRANCH ({branchname})
              </td>
              <td
                style={{
                  padding: "20px",
                  fontWeight: "bold",
                  textAlign: "right",
                  borderBottom: "1px solid #000",
                }}
              >
                PAN INDIA
              </td>
            </tr>

            {(exposureData.length === 1
              ? [exposureData[0], exposureData[0]]
              : exposureData
            ).map((item, index) =>
              index !== 0 ? (
                <> */}
        {/* Regular Fields (excluding shipment & exposure fields) */}
        {/* {labels
                    .filter(
                      (label) =>
                        ![
                          "Spot Enquiry Number",
                          `Chargeable Weight (${creditBalData?.weight_unit})`,
                          "Field Sales",
                          "Margin (Per Kg)",

                          "Total Sell",
                          "Total Buy",
                          "UPTO 30 DAYS",
                          "30 - 60 DAYS",
                          "60 - 90 DAYS",
                          "90 - 120 DAYS",
                          ">120 DAYS",
                          "Total Exposure",
                        ].includes(label)
                    )
                    .map((label, labelIdx) => (
                      <tr key={`general-${index}-${labelIdx}`}>
                        <td
                          style={{
                            padding: "12px",
                            fontWeight: "bold",
                            borderRight: "1px solid #000",
                            borderBottom: "1px solid #000",
                          }}
                        >
                          {label}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            borderRight: "1px solid #000",
                            borderBottom: "1px solid #000",
                          }}
                        >
                          {getValue(exposureData[0], label)}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            borderRight: "1px solid #000",
                            borderBottom: "1px solid #000",
                          }}
                        >
                          {getValue(item, label, "test")}
                        </td>
                      </tr>
                    ))} */}

        {/* Exposure Section Header */}
        {/* <tr key={`exposure-header-${index}`}>
                    <td
                      colSpan={3}
                      style={{
                        padding: "12px",
                        fontWeight: "bold",
                        backgroundColor: "#f0f0f0",
                        borderBottom: "1px solid #000",
                      }}
                    >
                      Exposure
                    </td>
                  </tr> */}

        {/* Exposure Fields */}
        {/* {[
                    "UPTO 30 DAYS",
                    "30 - 60 DAYS",
                    "60 - 90 DAYS",
                    "90 - 120 DAYS",
                    ">120 DAYS",
                    "Total Exposure",
                  ].map((label, labelIdx) => (
                    <tr key={`exposure-${index}-${labelIdx}`}>
                      <td
                        style={{
                          color: label === "Total Exposure" ? "green" : "",
                          padding: "12px",
                          fontWeight: "bold",
                          borderRight: "1px solid #000",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        {label}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          borderRight: "1px solid #000",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        {getValue(exposureData[0], label)}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          textAlign: "right",
                          borderRight: "1px solid #000",
                          borderBottom: "1px solid #000",
                        }}
                      >
                        {getValue(item, label, "test")}
                      </td>
                    </tr>
                  ))}
                </>
              ) : null
            )} */}



        {/* <div style={{ pageBreakBefore: "always", height: "30px" }}></div> */}
        {/* Shipment Details Section */}
        {/* <tr>
              <td
                colSpan={3}
                style={{
                  padding: "12px",
                  fontWeight: "bold",
                  backgroundColor: "#f0f0f0",
                  borderBottom: "1px solid #000",
                }}
              >
                Shipment Details
              </td>
            </tr> */}

        {/* {[
              "Spot Enquiry Number",
              `Chargeable Weight (${creditBalData?.weight_unit})`,
              "Margin (Per Kg)",
              "Total Buy",
              "Total Sell",
              "Field Sales",
              "Requested By",
              "Requested Date",
            ].map((label, idx) => (
              <tr key={`shipment-${idx}`}>
                <td
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    borderRight: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {label}
                </td>
                <td
                  colSpan={2}
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    borderBottom: "1px solid #000",
                  }}
                >
                  {getValue({}, label)}
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}




        <>
            {/* {allDataLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingIcon
            icon="bars"
            className="block w-[80px]"
            style={{ color: "#efb847" }}
          />
        </div>
      ) : ( */}


            <div className="container0 printCard ">
              {/* Top Row */}
              <table className="w-full"  cellPadding={3}>
              <tr>


                  <td className="align-top">
                    <div className="w-full">
                      <div className="bg-white rounded-lg shadow-sm p-[1px] min-h-[383px] ">
                        <div className=" ">
                          <h2 className="text-lg leading-[22px] font-semibold text-gray-900  bg-[#F0F2F3] py-2 rounded-t-lg px-[14px] h-[40px]">
                            Transaction Summary
                          </h2>
                          <div className="pt-[6px]">
                            <table className="w-full" cellPadding={3}>
                            
                            <tr>
                                <td className="w-[50%]">




                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt ">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                      Name of Agent
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px]">
                                      {exposureData?.[0]?.franchisee_name || "-"}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <MessageSquare className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                      Spot Enquiry Number
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px]">
                                      {creditBalData?.booking_no || "-"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              </tr>

<tr>
                              <td>
                                <div className="flex items-center  bg-[#fcf4e0] rounded-lg border border-[#fbdda6] p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <IndianRupee className="h-5 w-5 text-[#ce9317]" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                      Requested Credit Amount{" "}
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px]">
                                      {indianFormat(creditBalData?.credit_limit || 0)}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px] ">
                                      Credit Days
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px]">
                                      {`${creditBalData?.credit_days || 0} days`}
                                    </p>
                                  </div>
                                </div>
                              </td>

</tr>
                          <tr>   
                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <IndianRupee className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px]">

                                      Total Credit Assigned
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px]">
                                      {indianFormat(exposureData?.[0]?.total_credit_assigned || 0)}
                                    </p>
                                  </div>
                                </div>
                              </td>

                            

                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <IndianRupee className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                      Total Exposure
                                    </p>

                                    {/* {unbilledLoading == true ? (
                              <div className="w-4 h-4">
                                <LoadingIcon
                                  icon="puff"
                                  className="w-2 h-2 text-gray-500"
                                />
                              </div>
                            ) : ( */}
                                    {/* <p>
                                {indianFormat(
                                  (
                                    (Number(tempCreditData) || 0) +
                                    (Number(calculatedExposure) || 0)
                                  )?.toFixed(2)
                                )}
                              </p> */}
                                    {/* )} */}
                                    <span>
                                      {indianFormat(Number(total_exposure_amount))}
                                    </span>
                                  </div>
                                </div>
                              </td>
</tr>


<tr>
                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <IndianRupee className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                      Available Credit Limit
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px]">
                                      {(exposureData?.[0]?.acl || 0)}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <Building2 className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px] ">
                                      Hub
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px] ">
                                      {hubData?.find((item: any) => item?.hub_id == dataForm?.hub_id)?.hub_name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              </tr>

                              <tr>
                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px] ">
                                      Requested By
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px] ">
                                      {userdata?.display_name || "-"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px] ">
                                      Requested Date
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px] ">
                                      {new Date().toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              </tr>
                             <tr>
                              <td>
                                <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                  <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                  <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                    <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                      Field Sales
                                    </p>
                                    <p className="text-sm text-gray-600 leading-[17px] ">
                                      {salespersondata?.length > 0 ? salespersondata.join(", ") : "-"}
                                    </p>
                                  </div>
                                </div>
                              </td>
                                  <td></td>
</tr>

                            </table>

                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                    <td className="align-top">
                    <div className="w-full">
                      <div className="bg-white rounded-lg shadow-sm p-[1px] min-h-[383px]">
                        <div className="">
                          <div className="bggisf">
                            {" "}
                            <h2 className="text-base font-semibold text-[#fff] text-center  relative py-2 rounded-t-lg px-[15px] bgTotal ">
                              Total Exposure - {exposureData?.[0]?.franchisee_name || ""}
                            </h2>
                          </div>

                          <div className="pt-[10px]]">
                            <table className="w-full creditControlTable" cellPadding={3}>
                              <tr>
                                <td>01</td>
                                <td className="whitespace-nowrap">{"< 30 days"}</td>

                                <td>
                                  <p className="flex">
                                    <i className="planrupes">
                                      <IndianRupee className="h-5 w-5 text-gray-600" />
                                    </i>{" "}
                                    <span>
                                      {indianFormat(
                                        Number(
                                          getValues(exposureData[0] || 0, "(0-30)")
                                        )
                                      )}
                                    </span>
                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td>02</td>
                                <td className="whitespace-nowrap">{"30-60 days	"}</td>
                                <td>
                                  <p className="flex">
                                    <i className="planrupes">
                                      <IndianRupee className="h-5 w-5 text-gray-600" />{" "}
                                    </i>{" "}
                                    <span>
                                      {indianFormat(
                                        Number(
                                          getValues(exposureData[0] || 0, "(31-60)")
                                        )
                                      )}
                                    </span>
                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td>03</td>
                                <td className="whitespace-nowrap"> {"60-90 days"}</td>

                                <td>
                                  <p className="flex">
                                    <i className="planrupes">
                                      <IndianRupee className="h-5 w-5 text-gray-600" />
                                    </i>{" "}
                                    <span>
                                      {indianFormat(
                                        Number(
                                          getValues(exposureData[0] || 0, "(61-90)")
                                        )
                                      )}
                                    </span>
                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td>04</td>
                                <td className="whitespace-nowrap">{"90-120 days"}</td>

                                <td>
                                  <p className="flex">
                                    <i className="planrupes">
                                      <IndianRupee className="h-5 w-5 text-gray-600" />
                                    </i>{" "}
                                    <span>
                                      {indianFormat(Number(getValues(exposureData[0] || 0, "(91-120)")))}
                                    </span>
                                  </p>
                                </td>
                              </tr>

                              <tr>
                                <td>05</td>
                                <td className="whitespace-nowrap">{"> 120 days"}</td>

                                <td>
                                  <p className="flex">
                                    <i className="planrupes">
                                      <IndianRupee className="h-5 w-5 text-gray-600" />
                                    </i>{" "}
                                    <span>
                                      {indianFormat(Number(getValues(exposureData[0] || 0, "(>120)")))}
                                    </span>
                                  </p>
                                </td>
                              </tr>

                              <tr className="graycontrol">
                                <td colSpan={2}> Total Exposure</td>

                                <td>
                                  <p className="flex">
                                    <i className="planrupes">
                                      <IndianRupee className="h-5 w-5 text-gray-600" />
                                    </i>{" "}
                                    {/* <span>
                              {unbilledLoading == true ? (
                                <LoadingIcon
                                  icon="puff"
                                  className="w-5 h-5 text-gray-500"
                                />
                              ) : (
                                indianFormat(
                                  Number(tempCreditData || 0)?.toFixed(2)
                                )
                              )}
                            </span> */}
                                    <span>
                                      {indianFormat(Number(total_exposure_amount))}
                                    </span>
                                  </p>
                                </td>
                              </tr>

                              {/* <tr className="graycontrol">
                          <td colSpan={2}> Total Amount</td>

                          <td>
                            <p className="flex">
                              <i className="planrupes">
                                <IndianRupee className="h-5 w-5 text-gray-600" />
                              </i>{" "}
                              {/* <span>
                              {unbilledLoading == true ? (
                                <LoadingIcon
                                  icon="puff"
                                  className="w-5 h-5 text-gray-500"
                                />
                              ) : (
                                indianFormat(
                                  (
                                    (Number(tempCreditData) || 0) +
                                    (Number(calculatedExposure) || 0)
                                  )?.toFixed(2)
                                )
                              )}
                            </span> */}
                              {/* </p> */}
                              {/* </td> */}
                              {/* </tr> */}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div></td>
                </tr>



                <tr>
                  {/* Shipment Details */}
                   <td className="align-top"> 
                    <div className="w-full">
                    <div className="bg-white rounded-lg shadow-sm p-[1px] min-h-[183px] ">
                      <div className="">
                        <h2 className="text-lg leading-[22px] font-semibold text-gray-900  bg-[#F0F2F3] py-2 rounded-t-lg px-[14px] h-[40px]">
                          Shipment Details
                        </h2>
                        <div className="pt-[6px]">

                          <table className="w-full" cellPadding={3}>
                            <tr>
                            <td>
                              <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                  <IndianRupee className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                  <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                    Total Sell
                                  </p>
                                  <p className="text-sm text-gray-600 leading-[17px]">
                                    {indianFormat(Number(creditBalData?.sell || 0))}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                  <IndianRupee className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                  <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                    Total Buy
                                  </p>
                                  <p className="text-sm text-gray-600 leading-[17px]">
                                    {indianFormat(Number(creditBalData?.buy || 0))}
                                  </p>
                                </div>
                              </div>
                            </td>
</tr>
                         <tr>
                            <td>
                              <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                  <CheckCircle className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                  <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                    CHRG WT
                                  </p>
                                  <p className="text-sm text-gray-600 leading-[17px]">
                                    {/* {indianFormat(
                                Number(allSummary?.chargeable_weight || "0.00")
                              )}{" "} */}
                                    {indianFormat(Number(creditBalData?.weight || 0))}
                                    KG
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td>
                              <div className="flex items-center  bg-[#F8F8F8] rounded-lg border p-[5px]  listHeihgt">
                                <div className="lleftIcon w-[35px] flex items-center justify-center  ">
                                  <IndianRupee className="h-5 w-5 text-gray-600" />
                                </div>
                                <div className="leading-[12px]  border-l border-[#E1E1E1] pl-2">
                                  <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                    Margin
                                  </p>
                                  <p className="text-sm text-gray-600 leading-[17px]">
                                    {indianFormat(Number(creditBalData?.margin || 0))} KG
                                  </p>
                                </div>
                              </div>
                            </td>
                            </tr>
                          </table>


                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-6">
                      <table className="w-full ">
<tr>
                        {/* <td>
                          <div className="bg-white rounded-lg shadow-sm p-[10px] mt-4">
                            <div className="flex items-center  ">
                              <div className="lleftIcon bg-[#FFF5DF] w-[40px] h-[40px] rounded-full border border-[#FAD98B] flex items-center justify-center  ">
                                <Briefcase className="h-5 w-5 text-[#EFAA08]" />
                              </div>

                              <div className="leading-[12px] pl-2 ml-1">
                                <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                  Business Till Date
                                </p>
                                <p className="text-sm text-gray-600 leading-[17px] flex">
                                  <IndianRupee className="h-5 w-5 text-gray-600 w-[12px] relative top-[2px]" /> */}
                                  {/* <small className="text-base">
                              {" "}
                              {indianFormat(
                                Number(allSummary?.business_till_date || "0.00")
                              )}
                            </small> */}
                                {/* </p>
                              </div>
                            </div>
                          </div>
                        </td> */}

                        {/* <td>
                          <div className="bg-white rounded-lg shadow-sm p-[10px] mt-4">
                            <div className="flex items-center  ">
                              <div className="lleftIcon bg-[#FFF5DF] w-[40px] h-[40px] rounded-full border border-[#FAD98B] flex items-center justify-center  ">
                                <IndianRupee className="h-5 w-5 text-[#EFAA08]" />
                              </div>

                              <div className="leading-[12px] pl-2 ml-1">
                                <p className="text-sm font-medium text-gray-900 leading-[17px]">
                                  Credit Note Till Date
                                </p>
                                <p className="text-sm text-gray-600 leading-[17px] flex">
                                  <IndianRupee className="h-5 w-5 text-gray-600 w-[12px] relative top-[2px]" />
                                  <small className="text-base">
                                    {" "} */}
                                    {/* {indianFormat(
                                Number(allSummary?.credit_note || "0.00")
                              )} */}
                                  {/* </small>
                                </p>
                              </div>
                            </div>
                          </div>
                        </td> */}
                        </tr>
                        </table>
                        {/* <div className="col-span-12 md:col-span-6">
                      <Button
                        // onClick={() => setPdfModal(true)}
                        className="mr-2 rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&:hover:not(:disabled)]:bg-opacity-90 [&:hover:not(:disabled)]:border-opacity-90 [&:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed bg-mustard text-white"
                      >
                        Template Download
                      </Button>
                    </div> */}
                        {/* <div className="col-span-12 md:col-span-6">
                      <Button
                        className={`
                     p-2 bg-mustard text-white`}
                        onClick={() => {
                          if (creditBalData?.credit_limit) {
                            // setEmailModal(true);
                          } else {
                            // showAlert(
                            //   "Please provide Requested Credit Amount",
                            //   "warning"
                            // );
                          }
                        }}
                      >
                        <MailCheck className="mr-2" />
                        Send Email
                      </Button>
                    </div> */}
                      </div>
                    </div>
                 
                  
                  </td>

                  <td className="align-top">
                      <div className="w-full">
                    <div className="bg-white rounded-lg shadow-sm p-[1px] min-h-[253px]">
                      <div className="">
                        <h2 className="text-lg leading-[22px] font-semibold text-gray-900  bg-[#F0F2F3] py-2 rounded-t-lg px-[14px] h-[40px]">
                          Temporary Credit Approval
                        </h2>
                        <div className="pt-[6px]">
                          <div className="errorMessage">
                            {/* Credit Amount and Status in one row */}
                            <table className="w-full" cellPadding={3}>
                              {/* Credit Amount */}
<tr>
                              <td>
                                <div className="formBoxxCredit">
                                  <label className="text-sm font-medium text-gray-700 ">
                                    Requested Credit Amount
                                  </label>
                                  <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-px h-4 bg-gray-300"></div>
                                    <input
                                      type="text"
                                      value={Number(creditBalData?.credit_limit ?? 0).toFixed(3)}
                                      readOnly
                                      // onChange={(e) => {
                                      //   setCreditBalData({
                                      //     ...creditBalData,
                                      //     credit_limit: e.target.value.replace(
                                      //       /[^0-9.]/g,
                                      //       ""
                                      //     ),
                                      //   })
                                      //   if (e.target.value.trim()) {
                                      //     setErrors(prev => ({ ...prev, credit_limit: "" }));
                                      //   }
                                      // }}
                                      className="w-full mt-2 pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                      placeholder="Enter credit amount"
                                    />
                                    {/* {errors.credit_limit && (
                                  <p className="text-red-500 text-[12px] flex items-center space-x-1 absolute bottom-[-16px] left-0">
                                    <span>⚠</span>
                                    <span>{errors.credit_limit}</span>
                                  </p>
                                )} */}
                                  </div>
                                </div>
                              </td>

                              {/* <td>
                                <div className="formBoxxCredit">
                                  <label className="text-sm font-medium text-gray-700">
                                    Approver 1
                                  </label>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-px h-4 bg-gray-300"></div>
                                    <input
                                      type="text"
                                      placeholder="Enter Approver 1"
                                      value={creditBalData?.credit_app1}
                                      // onChange={(e) =>
                                      //   setCreditBalData({
                                      //     ...creditBalData,
                                      //     credit_app1: e.target.value,
                                      //   })
                                      // }
                                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              </td> */}
</tr>
                            <tr>  
                              {/* <td>
                                <div className="formBoxxCredit">
                                  <label className="text-sm font-medium text-gray-700">
                                    Approver 2
                                  </label>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-px h-4 bg-gray-300"></div>
                                    <input
                                      type="text"
                                      placeholder="Enter Approver 2"
                                      value={creditBalData?.credit_app2}
                                      // onChange={(e) =>
                                      //   setCreditBalData({
                                      //     ...creditBalData,
                                      //     credit_app2: e.target.value,
                                      //   })
                                      // }
                                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>
                              </td> */}

                              {/* Approved By and Remarks in one row */}
                              {/* <div className="col-span-12 md:col-span-6">
                            <div className="formBoxxCredit">
                              <label className="text-sm font-medium text-gray-700">
                                Attachment Upload file
                              </label>
                              <div className="relative">
                                <FormInput
                                  type="file"
                                  ref={uploadFile}
                                  className="text-base border p-1"
                                onChange={handleFileChange}
                                />
                              </div>
                            </div>{" "}
                          </div> */}

                              {/* Remarks */}
                              <td>
                                <div className="formBoxxCredit">
                                  <label className="text-sm font-medium text-gray-700">
                                    Remarks
                                  </label>
                                  <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <div className="absolute left-8 top-1/2 transform -translate-y-1/2 w-px h-4 bg-gray-300"></div>
                                    <input
                                      type="text"
                                      value={creditBalData?.remarks}
                                      placeholder="Enter Remarks"
                                      maxLength={150}
                                      readOnly
                                      // onChange={(e) => {
                                      //   setCreditBalData({
                                      //     ...creditBalData,
                                      //     remarks: e.target.value,
                                      //   })
                                      //   if (e.target.value.trim()) {
                                      //     setErrors(prev => ({ ...prev, remarks: "" }));
                                      //   }
                                      // }}
                                      className="w-full mt-2 pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    />
                                    {/* {errors.remarks && (
                                  <p className="text-red-500 text-[12px] flex items-center space-x-1 absolute bottom-[-16px] left-0">
                                    <span>⚠</span>
                                    <span>{errors.remarks}</span>
                                  </p>
                                )} */}
                                  </div>
                                </div>
                              </td>
</tr>
                              {/* Submit Button */}
                              {/* <div className="col-span-12 md:col-span-12">
                            <div className="buttoncredit flex justify-between mt-1">
                              <button
                                onClick={() => {
                                  storeformData(2);setOpenModal1(true);
                                  setText("Reject");
                                  setOpenModal1(true);
                                }}
                                disabled={acceptSpinner || rejectSpinner}
                                className="bg-red-500 font-bold text-white flex items-center px-6 py-2 rounded-md w-auto"
                              >
                                Reject{" "}
                                {rejectSpinner && (
                                  <LoadingIcon
                                    icon="puff"
                                    color="white"
                                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                  />
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  setText("Approve");
                                  setOpenModal1(true);
                                }}
                                disabled={acceptSpinner || rejectSpinner}
                                className="bg-green-500 font-bold text-white flex items-center px-6 py-2 rounded-md w-auto"
                              >
                                Approve
                                {acceptSpinner && (
                                  <LoadingIcon
                                    icon="puff"
                                    color="white"
                                    className="w-5 h-5 ml-2 stroke-2.5 text-white"
                                  />
                                )}
                              </button>

                            </div>
                          </div> */}
                            </table>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div></td>
                </tr></table>

            </div>
            {/* )} */}


          </>





























      </div>
    </div>
  );
};

export default PdfExport;
