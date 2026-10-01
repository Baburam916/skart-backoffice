import { indianFormat } from "../../../../utils";
import imagelogo from "../../../src/assets/images/dashboardimg.png";
 export const getpropersalespersons = (data: any,userdata:any,forwhat?:any) => {
   const singlesalespersondata = data.find(
     (item: any) => item?.id == userdata?.mapped_id
   );
   // console.log(singlesalespersondata,"singdata")
   let salespersons = [];
   if (
     Object.keys(singlesalespersondata)?.length >= 1 &&
     singlesalespersondata?.manager?.length >= 1
   ) {
    if(forwhat){
const salespersons = data
  ?.filter((item: any) => singlesalespersondata?.manager?.includes(item?.id))
  .map((item: any) => item?.email)
  .filter((email: string | null | undefined) => !!email); // Remove null/undefined

// Remove duplicates
const uniqueSalespersons = [...new Set(salespersons)];


// Return only if not empty
return uniqueSalespersons.length ? uniqueSalespersons : undefined;
    }else{
   
     salespersons = data
       ?.filter((item: any) =>
         singlesalespersondata?.manager?.includes(item?.id)
       )
       .map((item: any) => item?.sales_person);
     return salespersons;}
   } else {
     return [];
   }
 };
export const emailbodyfun = (
  hubData: any,
  branchname: any,
  spotData: any,
  exposureData: any,
  salespersondata: any,
  userdata: any,
  creditlimit: any

) => {
  const labels = [
    "Name of Agent",
    "Spot Enquiry Number",
    "Field Sales",
    "Margin (Per Kg)",
    `Chargeable Weight (${spotData?.weight_unit})`,
    "Total Buy",
    "Total Sell",
    "Total Credit Assigned",
    "Requested Credit Amount",
    "Available Credit Limit",
    "Outstanding",
    "Unbilled Amount",
    "Credit Days",
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


  const getValue = (item, label, spotData, value) => {
    switch (label) {
      case "Name of Agent":
        return item?.franchisee_name||"";
      case "Spot Enquiry Number":
        return spotData?.booking_no || "-";
      case "Field Sales":
        return salespersondata?.length >= 1 && !value
          ? getpropersalespersons(salespersondata,userdata)?.join(",")
          : "";
      case "Margin (Per Kg)":
        return spotData?.margin && !value ? spotData?.margin : "";
      case `Chargeable Weight (${spotData?.weight_unit})`:
        return spotData?.weight && !value ? spotData?.weight : "";
      case "Total Sell":
        return spotData?.sell && !value ? spotData?.sell : "";
      case "Total Buy":
        return spotData?.buy && !value ? spotData?.buy : "";
      case "Total Credit Assigned":
        return item?.total_credit_assigned
          ? indianFormat(item?.total_credit_assigned)
          : "0";
      case "Available Credit Limit":
        return item?.acl || 0;
      case "Outstanding":
        return indianFormat(Number(spotData?.outstanding)) || 0;
      case "Unbilled Amount":
        return indianFormat(Number(spotData?.unbilled)) || 0;
      case "Credit Days":
        return indianFormat(spotData?.credit_days || 0);
      case "Requested Credit Amount":
        return indianFormat(creditlimit || 0);
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
      case "Requested By":
        return userdata?.display_name;
      case "Requested Date":
        return new Date(Date.now()).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

      // case "Approver 1":
      //   return approver1 || "-";
      // case "Approver 2":
      //   return approver2 || "-";
      // case "Collection Date":
      //   return collection_date || "-";
      default:
        return "-";
    }
  };

  return `
  <div style="padding:16px; background:white; color:black; max-width:800px; margin:0 auto; font-family:arial;">
    <table style="width: 100%; font-family: arial; border-collapse: collapse;">
      <tbody>
        <tr>
          <td style="border-bottom: 1px solid #3c3c3c;">
            <img src="https://iili.io/JVRihhP.png" alt="Logo" style="max-width: 220px; padding: 12px; margin: 12px 0;" />
          </td>
          <td style="border-bottom: 1px solid #3c3c3c; text-align: left;">
            <div style="display: flex; justify-content: flex-end;">
              <div>
                <p style="font-weight: bold; font-size: 15px;">SKART GLOBAL EXPRESS PVT. LTD.</p>
                <p style="font-size: 14px;">
                  ${
                    hubData?.find((item) => item?.hub_id == spotData?.hub_id)
                      ?.hub_address || ""
                  }
                </p>
                <p style="font-size: 14px;">
                  ${
                    hubData?.find((item) => item?.hub_id == spotData?.hub_id)
                      ?.city || ""
                  },
                  ${
                    hubData?.find((item) => item?.hub_id == spotData?.hub_id)
                      ?.state || ""
                  },
                  ${
                    hubData?.find((item) => item?.hub_id == spotData?.hub_id)
                      ?.pincode || ""
                  }
                </p>
                <p style="font-size: 14px;">
                  Tel No. - ${
                    hubData?.find((item) => item?.hub_id == spotData?.hub_id)
                      ?.contact_no || ""
                  }
                </p>
                <p style="font-size: 14px;">
                  Email - ${
                    hubData?.find((item) => item?.hub_id == spotData?.hub_id)
                      ?.email_id || ""
                  }
                </p>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <table style="width: 100%; margin-top: 13px; font-family: arial; border-collapse: collapse; border: 1px solid #000;" cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
          <td style="padding: 20px; border: 1px solid #000;"></td>
          <td style="padding: 20px; font-weight: bold; text-align: right; border: 1px solid #000;">
            REQUESTING BRANCH (${branchname})
          </td>
          <td style="padding: 20px; font-weight: bold; text-align: right; border: 1px solid #000;">
            PAN INDIA
          </td>
        </tr>
        ${(() => {
          const shipmentLabels = [
            "Spot Enquiry Number",
            "Field Sales",
            "Margin (Per Kg)",
            `Chargeable Weight (${spotData?.weight_unit})`,
            "Total Sell",
            "Total Buy",
            "Requested By",
            "Requested Date"
          ];

          const exposureLabels = [
            "UPTO 30 DAYS",
            "30 - 60 DAYS",
            "60 - 90 DAYS",
            "90 - 120 DAYS",
            ">120 DAYS",
            "Total Exposure",
          ];

          return (
            exposureData.length === 1
              ? [exposureData[0], exposureData[0]]
              : exposureData
          )
            .map((item, index) => {
              if (index === 0) return "";

              const regularLabels = labels.filter(
                (label) =>
                  !shipmentLabels.includes(label) &&
                  !exposureLabels.includes(label)
              );

              return `
                ${regularLabels
                  .map(
                    (label) => `
                      <tr>
                        <td style="color: ${
                          label === "Total Exposure" ? "green" : "black"
                        }; padding: 12px; font-weight: bold; border: 1px solid #000;">
                          ${label}
                        </td>
                        <td style="padding: 12px; text-align: right; border: 1px solid #000;">
                          ${getValue(exposureData[0], label, spotData)}
                        </td>
                        <td style="padding: 12px; text-align: right; border: 1px solid #000;">
                          ${getValue(item, label, spotData, "test")}
                        </td>
                      </tr>
                    `
                  )
                  .join("")}

                <tr>
                  <td colspan="3" style="padding: 12px; font-weight: bold; background-color: #f0f0f0; border: 1px solid #000;">
                    Exposure
                  </td>
                </tr>

                ${exposureLabels
                  .map(
                    (label) => `
                      <tr>
                        <td style="color: ${
                          label === "Total Exposure" ? "green" : "black"
                        }; padding: 12px; font-weight: bold; border: 1px solid #000;">
                          ${label}
                        </td>
                        <td style="padding: 12px; text-align: right; border: 1px solid #000;">
                          ${getValue(exposureData[0], label, spotData)}
                        </td>
                        <td style="padding: 12px; text-align: right; border: 1px solid #000;">
                          ${getValue(item, label, spotData, "test")}
                        </td>
                      </tr>
                    `
                  )
                  .join("")}
              `;
            })
            .join("");
        })()}

        <tr>
          <td colspan="3" style="padding: 12px; font-weight: bold; background-color: #f0f0f0; border: 1px solid #000;">
            Shipment Details
          </td>
        </tr>
        ${[
          "Spot Enquiry Number",
          "Field Sales",
          "Margin (Per Kg)",
          `Chargeable Weight (${spotData?.weight_unit})`,
          "Total Sell",
          "Total Buy",
          "Requested By",
          "Requested Date"
        ]
          .map(
            (label) => `
              <tr>
                <td style="padding: 12px; font-weight: bold; border: 1px solid #000;">
                  ${label}
                </td>
                <td colspan="2" style="padding: 12px; text-align: right; border: 1px solid #000;">
                  ${getValue({}, label, spotData)}
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  </div>
`;
};
