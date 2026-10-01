import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import SideMenu from "../layouts/SideMenu";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard/main";
// import Tracker from "../pages/skart_sales/Tracking/index";
// import CsTracking from "../pages/skart_sales/Tracker/main.tsx"

import { useEffect, useState } from "react";
import { useLogin } from "../pages/skart_sales/commoncomponents/LoginContextProvider/LoginContextProvider";
import { Auth_verify } from "../AllServices/services";
import IsLoading from "../pages/skart_sales/commoncomponents/isLoading/isLoading";
import CustomerLogger from "../pages/skart_sales/Cutomerlogger/Customerlogger";
import Announcements from "../pages/skart_sales/Announcements/announcements";

import SpotpriceApproval from "../pages/skart_sales/Spotprice/spotpricesapproval";
import SpotEnquirymain from "../pages/skart_sales/SpotEnquiry/SpotPriceEnquiry1";
import SpotPricePart2 from "../pages/skart_sales/SpotEnquiry/SpotPriceEnquiry2";
import RateCalculator from "../pages/skart_sales/RateCalculator/Ratecalculator";
// import SpostenquiryList from "../pages/skart_sales/SpotEnquiry/SpotPriceList";

import { IsDashboard } from "../pages/skart_sales/Dashboards/isDashboard";

import Customerlist from "../pages/skart_sales/Customerlist/customerlist";
import SpostenquiryList from "../pages/skart_sales/SpotEnquiry/SpotPriceList";
import EnquiryLogs from "../pages/skart_sales/RateEnquiryLogs/RateEnquiryLogs";
// import CsTracking from "../pages/skart_sales/Tracker/main"
import CsTracking from "../pages/skart_sales/CsTracker.tsx/main";
import Tracker from "../pages/skart_sales/Tracker/main";
import RaiseDispute from "../pages/skart_sales/RaiseDispute/RaiseDispute";
import Pdclist from "../pages/skart_sales/Pdc/pdc";
import Customer_service from "../pages/Dashboard/Cs_dashboard/cs_dashboard";
import UpdatePickup from "../pages/skart_sales/UpdatePickup/updatePickup";
import CsBilling from "../pages/skart_sales/CsBilling/CsBilling";
import TatReports from "../pages/skart_sales/Reports/TatReports/TatReports";
import TatConsignments from "../pages/skart_sales/TATConsignments/TATConsignments";
import TagTransactionToAWB from "../pages/Dashboard/Cs_dashboard/tagpickup";
import CommercialDiscrepancy from "../pages/skart_sales/CommercialDiscrepancy";
import VendorBatchUpload from "../pages/skart_sales/CsBilling/VendorBatchUpload";
import SalesDashboard from "../pages/skart_sales/SalesDashboard/Daily_sale_aduit"
import ExecutiveDashboard from "../pages/skart_sales/ExecutiveDashboard/Executive_performance";
import CreditRequestList from "../pages/skart_sales/CreditRequestList/creditReqList";
import CargoCommercialBookings from "../pages/skart_sales/CargoCommercialBookings/CargoCommercialBookings";
import VendorRegistration from "../pages/skart_sales/VendorRegistration";


function Router() {
  const [loading, setLoading] = useState<boolean>(true);
  const [verify, setVerify] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, userdata, permissionid } = useLogin();
  const checkAuth = async () => {
    try {
      const check = await Auth_verify("auth/verify/0");
      if (check?.status !== 200) {
        navigate("/");
      } else {
        setVerify(true);
        login(check?.data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const createRoute = (path: any, element: any, requiredPermission?: any) => {
    // If no requiredPermission, always include the route
    if (!requiredPermission || permissionid?.includes(requiredPermission)) {
      return { path, element };
    }
    return null; // Exclude route if permission is not met
  };
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);
  const findparticulardata = (id?: any) => {
    if (location.pathname !== "/") {
      const newdata = userdata?.role_permission.find(
        (item: any) => item?.p_id == id
      );
      return newdata;
    }
  };
  const routes = (verify: boolean) => [
    {
      path: "/backoffice",
      element: <SideMenu />,
      children: [
        createRoute(
          "/backoffice/dashboard",
          <Dashboard
            importbookingp={findparticulardata(421)}
            jobListingp={findparticulardata(422)}
          />
        ),
        createRoute(
          "/backoffice/cargo_cs_dashboard",
          <Customer_service />,
          422
        ),

        createRoute(
          "/backoffice/reports/tat_consignments",
          <TatConsignments />,
          423
        ),

        createRoute("/backoffice/tracker", <Tracker />, 282),
        createRoute("/backoffice/tracker", <Tracker />, 334),
        // createRoute("/backoffice/tracker", <Tracker />, 388),
        createRoute("/backoffice/tracking", <CsTracking/>, 388),
        createRoute("/backoffice/commercial_discrepancy", <CommercialDiscrepancy/>, 434),
        createRoute("/backoffice/commercial_discrepancy", <CommercialDiscrepancy/>, 435),

        createRoute(
          "/backoffice/announcements",
          <Announcements pdata={findparticulardata(283)} />,
          283
        ),
        createRoute(
          "/backoffice/accounts/customer_logger",
          <CustomerLogger />,
          284
        ),
        createRoute("/backoffice/accounts/customerlist", <Customerlist />, 285),
        createRoute("/backoffice/accounts/customerlist", <Customerlist />, 335),

        createRoute(
          "/backoffice/pricing_operations/spot_price_approvel",
          <SpotpriceApproval value={"all"} />,
          301
        ),
        createRoute(
          "/backoffice/sales_operations/spot_price_list",
          <SpostenquiryList />,
          292
        ),
        createRoute("/backoffice/sales_operations/pdc_list", <Pdclist />),
        createRoute(
          "/backoffice/sales_operations/spot_price_enquiry",
          <SpotEnquirymain />,
          286
        ),
        createRoute(
          "/backoffice/sales_operations/spot_price_enquiry/book_courier",
          <SpotPricePart2 />,
          286
        ),
        createRoute(
          "/backoffice/rate_calculator",
          <RateCalculator forwhat={1} />,
          293
        ),
        createRoute(
          "/backoffice/rate_calculator",
          <RateCalculator forwhat={2} />,
          333
        ),
     
        createRoute("/backoffice/raise_dispute",<RaiseDispute />,389),
       
        createRoute(
          "/backoffice/rate_calculator",
          <RateCalculator forwhat={3} />,
          339
        ),
        createRoute("/backoffice/sales-dashboard", <SalesDashboard />, 475),
        createRoute("/backoffice/sales-person-dashboard", <ExecutiveDashboard />, 472),
        createRoute("/backoffice/raise_dispute", <RaiseDispute />, 389),
        createRoute("/backoffice/reports/tat_report", <TatReports />, 389),
        createRoute("/backoffice/rate_enquiry_logs", <EnquiryLogs />, 341),
         createRoute(
          "/backoffice/sales_operations/update_pickup",
          <UpdatePickup />,
          424
        ),
        createRoute("/backoffice/update_pickup",<UpdatePickup />,433),
         createRoute("/backoffice/commercial_discrepancy", <CommercialDiscrepancy/>, 434),
        createRoute("/backoffice/commercial_discrepancy", <CommercialDiscrepancy/>, 435),
        createRoute(
          "/backoffice/tag_pickup",
          <TagTransactionToAWB />,
          431
        ),
        createRoute("/backoffice/cs_billing",<CsBilling pdata ={findparticulardata(453)} />, 388),
        createRoute("/backoffice/vendor_batch_dashboard",<VendorBatchUpload />, 453),
        createRoute(
          "/backoffice/sales_operations/credit_request_list",
          <CreditRequestList />,
          476
        ),
        createRoute(
          "/backoffice/sales_operations/cargo_commercial_bookings",
          <CargoCommercialBookings />,
          481
        ),
        createRoute(
          "/backoffice/vendor-registration",
          <VendorRegistration pdata={findparticulardata(500)} />,
          500
        ),
      ].filter(Boolean),
    },

    { path: "/", element: <Login /> },
  ];
  return loading ? (
    <div className="flex items-center justify-center h-[100vh]">
      <IsLoading />
    </div>
  ) : (
    useRoutes(routes(verify))
  );
  // return useRoutes(routes());
}

export default Router;
