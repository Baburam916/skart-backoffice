import React, { useEffect, useState } from "react";
import { FormInput } from "../../../base-components/Form";
import { Search } from "lucide-react";
import Table from "../../../components/Table";
import CommonPagination from "../../../components/Pagination";
import { useAlert } from "../../../ContextProvider/AlertContext";
import { useDebounce } from "../../../components/Search";
import { commongetrequest } from "../../../AllServices/services";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import IsLoading from "../commoncomponents/isLoading/isLoading";

const customerlist = () => {
  const { showAlert } = useAlert();
  const [customerList, setCustomerList] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [totalpages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce<string>(search, 500);
  const current_user = localStorage.getItem("current_user");
  const sales_id = current_user ? JSON.parse(current_user).mapped_id : null;
  const [salespersondata, setSalesPersondata] = useState<any>([]);
  const [branchData, setBranchData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handlePagechange = (e: number) => {
    setPage(e - 1);
  };

  const columns = [
    {
      field: "franchisee_name",
      headerName: "CUSTOMER NAME",
      textalign: "left",
    },
    {
      field: "contact_person",
      headerName: "CONTACT PERSON",
      textalign: "left",
    },
    { field: "contact", headerName: "CONTACT", textalign: "left" },
    { field: "email_id", headerName: "EMAIL", textalign: "left" },
    { field: "address", headerName: "ADDRESS", textalign: "left" },
    { field: "branch", headerName: "BRANCH", textalign: "left" },
    { field: "field_sales", headerName: "FIELD SALES PERSON", textalign: "left" },
  ];

  const row: any = customerList?.map((item: any) => {

    
    return {
      ...item,
      contact_person: item?.contacts[0]?.contact_person || "N.A.",
      contact: item?.contacts[0]?.mobile_no || "N.A.",
      email_id: item?.email_id || "N.A.",
      address:
        item?.communication_address?.address &&
        item?.communication_address?.city &&
        item?.communication_address?.state &&
        item?.communication_address?.pincode
          ? [
              item?.communication_address?.address,
              item?.communication_address?.city,
              item?.communication_address?.state,
              item?.communication_address?.pincode,
            ]
              .filter(Boolean)
              .join(", ")
          : "N.A.",
      branch:
        branchData?.filter((ele: any) => ele?.branch_id == item?.branch)[0]
          ?.branch_name || "N.A.",
      field_sales:
        salespersondata?.find((ele: any) => ele?.id == item?.field_sales)
          ?.sales_person || "N.A.",
    };
  });

  const getData = async () => {
    try {
      setLoading(true);
      const res = await commongetrequest(
        `admin/franchisee-settings?offset=${page}&key=${debouncedSearch.trim()}`
      );
      if (res?.status == 200) {
        setCustomerList(res?.data?.data || []);
        setTotalPages(res?.data?.count || 0);
      } else if (res?.status == 204) {
        setCustomerList([]);
        setTotalPages(0);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getBranch = async () => {
    try {
      const res = await commongetrequest(`admin/hub-pud`);
      if (res?.status == 200) {
        setBranchData(res?.data?.data || []);
      } else if (res?.status == 204) {
        setBranchData([]);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
 
  const getsalesperson = async () => {
    try {
      const res = await commongetrequest(`admin/sales-person`);
      if (res?.status == 200) {

        setSalesPersondata(res?.data?.data || []);
      } else if (res?.status == 204) {
        setSalesPersondata([]);
      } else {
        showAlert(
          res?.data?.message || res?.response?.data?.message || res?.message,
          "error"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getsalesperson();
    getBranch();
  }, []);

  useEffect(() => {
    getData();
  }, [debouncedSearch, page]);

  return (
    <>
      <div className="w-full max-w-8xl mx-auto mt-4 px-6 py-3 bg-white rounded-lg shadow-lg">
        <div className="">
          <div className="min-[474px]:flex flex-row justify-between border-b border-gray-300">
            <div className="w-[40%]">
              <h1 className="text-2xl mt-4 ml-2 font-bold  text-primary ">
                Customer List
              </h1>
            </div>
            <div className="flex w-[60%] justify-end mb-4">
              <div>
                <div className="relative flex justify-between items-center mt-4">
                  <FormInput
                    className="pr-8 pt-1 pb-1 rounded-xl"
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                  <Search className="absolute right-1 w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          {loading ? (
            <IsLoading h="h-40" />
          ) : customerList?.length > 0 ? (
            <>
              <Table heightTable="60vh" columns={columns} row={row} />
              <CommonPagination
                totalpages={totalpages}
                onPageChange={handlePagechange}
                page={page + 1}
              />
            </>
          ) : (
            <>
              <Nodatafound />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default customerlist;
