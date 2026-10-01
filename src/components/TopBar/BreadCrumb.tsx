import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../../base-components/Breadcrumb";

import { Home } from "lucide-react";
import { useLogin } from "../../pages/skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";
export default function BreadCrumb() {
  const commonpath = "/admin";
  const location = useLocation();

  let path = location.pathname;
  let search = location.search;
  let completeaddress = `${path}${search}`;
  const baseplus = location.pathname.split("/")[2];
  const basepath = location.pathname.split("/")[1];
  const baseplus3 = location.pathname.split("/")[3];
  // console.log(baseplus3,"baseplus3")

  // console.log(baseplus,"I am  baseplus",basepath,"basepath")

  const check1 = (pathname: string) => {
    return location.pathname.includes(pathname);
  };

  return (
    <>
      <Breadcrumb className="hidden mr-auto -intro-x sm:flex">
        <Breadcrumb.Link to={"/backoffice/dashboard"}>
          <Home className="size-4 inline mr-1 mb-1" />
          Home
        </Breadcrumb.Link>

        <Breadcrumb.Link
          to={`${
            location.pathname == "/backoffice/dashboard"
              ? "backoffice/dashboard"
              : check1("/backoffice/sales_operations")
              ? completeaddress
              : check1("/backoffice/tracker")
              ? completeaddress
              : check1("/backoffice/accounts")
              ? completeaddress
              : check1("/backoffice/announcements")
              ? completeaddress
              : check1("/backoffice/rate_calculator")
              ? completeaddress              
              : check1("/backoffice/tracker")
              ? completeaddress
              : check1("/backoffice/accounts")
              ? completeaddress
              : check1("/backoffice/announcements")
              ? completeaddress
              : check1("/backoffice/rate_calculator")
              ? completeaddress
              : check1("/backoffice/pricing_operations")
              ? completeaddress
              : check1("/backoffice/commercial_discrepancy")
              ? completeaddress
              : check1("backoffice/rate_enquiry_logs")
              ? completeaddress
              : check1("/backoffice/raise_query")
              ? completeaddress
              : check1("/backoffice/commercial_discrepancy")
              ?completeaddress
              :check1('/backoffice/cs_billing')?completeaddress:check1('/backoffice/tracking')?completeaddress
              :check1('/backoffice/cargo_cs_dashboard')?completeaddress:check1('/backoffice/tag_pickup')?completeaddress:check1("/backoffice/update_pickup")?completeaddress
              : check1("/backoffice/vendor_batch_dashboard") ? completeaddress :check1('/backoffice/sales-person-dashboard') ? completeaddress: ""
          }`}
        >
          {location.pathname == "/backoffice"
            ? "Dashboard"
            : check1("/backoffice/dashboard")
            ? "Dashboard"
            : check1("/backoffice/tracker")
            ? "Tracker"
            : check1("/backoffice/accounts")
            ? "Accounts"
            : check1("/backoffice/sales_operations")
            ? "Sales Operations"
            : check1("/backoffice/announcements")
            ? "Announcement"
            : check1("/backoffice/rate_calculator")
            ? "Rate Calculator"
            : check1("/backoffice/pricing_operations")
            ? "pricing Operations"
            : check1("backoffice/rate_enquiry_logs")
            ? "Rate Enquiry Logs"
            : check1("/backoffice/raise_query")
            ? "Raise Query"
            : check1("/backoffice/commercial_discrepancy")
            ? "Commercial Discrepancy"
            :check1('/backoffice/cargo_cs_dashboard')?"Cargo Cs Dashboard"
            :check1('/backoffice/cs_billing')?"Cs Billing":check1('/backoffice/tracking')?"Cs Tracking"
            :check1('/backoffice/tag_pickup')?"Tag Pickup Number"
            :check1("/backoffice/update_pickup")?"Schedule Pickup": check1("/backoffice/vendor_batch_dashboard")?"Vendor Batch Dashboard": check1('/backoffice/sales-person-dashboard')?"Sales Person Dashboard": ""}
        </Breadcrumb.Link>
        <Breadcrumb.Link
          to={`${
            check1("/backoffice/sales_operations/spot_price_enquiry")
              ? completeaddress
              : check1("/backoffice/sales_operations/spot_price_approval")
              ? completeaddress
              : check1("/backoffice/accounts/customerlist")
              ? completeaddress
              : check1("/backoffice/sales_operations/spot_price_list")
              ? completeaddress
              : check1("/backoffice/accounts/customer_logger")
              ? completeaddress
              : check1("/backoffice/sales_operations/spot_price_list")
              ? completeaddress
              : check1("/backoffice/pricing_operations/spot_price_approvel")
              ? completeaddress
              :check1('/backoffice/sales_operations/update_pickup')?completeaddress: ""
          }`}
        >
          {check1("/backoffice/sales_operations/spot_price_enquiry")
            ? "Spot Price Enquiry "
            : check1("/backoffice/sales_operations/spot_price_approval")
            ? "Spot Price Approval"
            : check1("/backoffice/accounts/customer_logger")
            ? "Customer Logger"
            : check1("/backoffice/accounts/customerlist")
            ? "Customer List"
            : check1("/backoffice/sales_operations/spot_price_list")
            ? "Spot Price List"
            : check1("/backoffice/pricing_operations/spot_price_approvel")
            ? "Spot Price Enquiry"
            :check1('/backoffice/sales_operations/update_pickup')?"Update Pickup": ""}
        </Breadcrumb.Link>
      </Breadcrumb>
    </>
  );
}
