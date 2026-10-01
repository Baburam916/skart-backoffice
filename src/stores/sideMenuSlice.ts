import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
export interface Menu {
  icon?: keyof typeof icons;
  id?: any;
  title?: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}
export interface SideMenuState {
  menu: Array<Menu | "divider">;
}
const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/backoffice/dashboard",
    },
     {
          id: 476,
          icon: "CreditCard",
          pathname: "/backoffice/sales_operations/credit_request_list",
          title: "Credit Request List",
    },
    {
          id: 481,
          icon: "Box",
          pathname: "/backoffice/sales_operations/cargo_commercial_bookings",
          title: "Cargo Commercial Bookings",
    },
    {
      id: 475,
      icon: "LineChart",
      title: "Sales Dashboard",
      pathname: "/backoffice/sales-dashboard"
    },
    {
      id: 472,
      icon: "Activity",
      title: "Sales Person Dashboard",
      pathname: "/backoffice/sales-person-dashboard"
    },
    {
      id: 422,
      icon: "User",
      title: "Cargo Cs Dashboard",
      pathname: "/backoffice/cargo_cs_dashboard",
    },
    {
      id: 423,
      icon: "FileText",
      title: "TAT Consignments",
      pathname: "/backoffice/reports/tat_consignments"
    },
    {
      id: 433,
      icon: "Settings",
      pathname: "/backoffice/update_pickup",
      title: "Schedule Pickup (Import Booking)",
    },
    {
      icon: "PackageSearch",
      title: "Accounts",
      subMenu: [
        {
          id: 284,
          icon: "UserCog",
          title: "Customer Logger",
          pathname: "/backoffice/accounts/customer_logger",
        },

        {
          id: 285,
          icon: "Contact",
          title: "Customer List",
          pathname: "/backoffice/accounts/customerlist",
        },
        {
          id: 335,
          icon: "Users",
          title: "Customer List",
          pathname: "/backoffice/accounts/customerlist",
        },
      ],
    },
    {
      icon: "Edit",
      title: "Pricing Operations",
      subMenu: [
        {
          id: 301,
          icon: "ClipboardList",
          pathname: "/backoffice/pricing_operations/spot_price_approvel",
          title: "Spot Price List",
        },
      ],
    },
    {
      icon: "Edit",
      title: "Sales Operations",
      subMenu: [
        {
          id: 286,
          icon: "Wallet",
          pathname: "/backoffice/sales_operations/spot_price_enquiry",
          title: "Spot Price Enquiry",
        },

        // {
        //   id: 271,
        //   icon: "Minus",
        //   pathname: "/sales/sales_operations/spot_price_approval",
        //   title: "Spot Price Approval",
        // },
        {
          id: 292,
          icon: "ClipboardList",
          pathname: "/backoffice/sales_operations/spot_price_list",
          title: "Spot Price List",
        },
        {
          id: 286,
          icon: "ClipboardList",
          pathname: "/backoffice/sales_operations/pdc_list",
          title: "PDC List",
        },

        {
          id: 424,
          icon: "Settings",
          pathname: "/backoffice/sales_operations/update_pickup",
          title: "Schedule Pickup (Import Booking)",
        },
        {
          id: 433,
          icon: "Settings",
          pathname: "/backoffice/update_pickup",
          title: "Schedule Pickup (Import Booking)",
        }
      ],
    },
    // {
    //   icon: "Edit",
    //   title: "Pricing Operations",
    //   subMenu: [
    //     {
    //       id: 301,
    //       icon: "Minus",
    //       pathname: "/backoffice/pricing_operations/spot_price_approvel",
    //       title: "Spot Price Enquiry",
    //     },
    //   ],
    // },

    {
      id: 293,
      icon: "Calculator",
      title: "Rate Calculator",
      pathname: "/backoffice/rate_calculator",
    },
    {
      id: 333,
      icon: "Calculator",
      title: "Rate Calculator",
      pathname: "/backoffice/rate_calculator",
    },
    {
      id: 339,
      icon: "Calculator",
      title: "Rate Calculator",
      pathname: "/backoffice/rate_calculator",
    },
    {
      id: 283,
      icon: "Megaphone",
      pathname: "/backoffice/announcements",
      title: "Announcements",
    },
    {
      id: 282,
      icon: "Truck",
      pathname: "/backoffice/tracker",
      title: "Tracking",
    },
    {
      id: 334,
      icon: "Truck",
      pathname: "/backoffice/tracker",
      title: "Tracking",
    },
    {
      id: 388,
      icon: "Truck",
      pathname: "/backoffice/tracking",
      title: "Tracking",
    },

    {
      id: 388,
      icon: "File",
      title: "CS Billing",
      pathname: "/backoffice/cs_billing",
    },

    {
      id: 389,
      icon: "Contact",
      title: "Raise Query",
      pathname: "/backoffice/raise_query",
    },

    {
      id: 434,
      icon: "Compass",
      title: "Commercial Discrepancy",
      pathname: "/backoffice/commercial_discrepancy",
    },

    {
      id: 435,
      icon: "Compass",
      title: "Commercial Discrepancy",
      pathname: "/backoffice/commercial_discrepancy",
    },

    {
      id: 431,
      icon: "File",
      title: "Tag PickUp Number",
      pathname: "/backoffice/tag_pickup",
    },
    {
      icon: "Clipboard",
      title: "Reports",
      subMenu: [
        {
          id: 389,
          icon: "FileText",
          title: "Import TAT Report",
          pathname: "/backoffice/reports/tat_report",
        },
      ],
    }
  
  ],
};
export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});
export const selectSideMenu = (state: RootState) => state.sideMenu.menu;
export default sideMenuSlice.reducer;
