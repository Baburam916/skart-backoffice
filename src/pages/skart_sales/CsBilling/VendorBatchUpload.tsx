import React, { useEffect, useState } from "react";
import { Download, Mail, Search, X } from "lucide-react";
import { FormInput, FormLabel } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { RxReset } from "react-icons/rx";
import TomSelect from "../../../base-components/TomSelect";
import { commongetrequest, commonpostrequest } from "../../../AllServices/services";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingButtonCommon from "../commoncomponents/LoadingButtonCommon/LoadingButtonCommon";
import Nodatafound from "../commoncomponents/Nodatafound/Nodatafound";
import CommonPagination from "../../../components/Pagination";
import IsLoading from "../commoncomponents/isLoading/isLoading";
import Table from "../../../base-components/Table";
import { formatDate } from "../commoncomponents/commondateformat/datetoreqformat";
import { ExportToXLSX } from "../commoncomponents/ExportToXLSX";
import { useNavigate } from "react-router-dom";
import CommonModal from "../commoncomponents/CommonModal/CommonModal";
import CommonTable from "../commoncomponents/CommonTable/CommonTable";

function VendorBatchUpload() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [batchNumber, setBatchNumber] = useState<string>("");
  const [courierProductData, setCourierProductData] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [downloadisLoading, setDownloadisLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [totalPages, setTotalPages] = useState(0);
  const [allLoading, setAllLoading] = useState(false);
  const [getAdditionalCharge, setGetAdditionalCharge] = useState<any[]>([]);
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");

  // Mail modal state
  const [openMailModal, setOpenMailModal] = useState<boolean>(false);
  const [awbMailData, setAwbMailData] = useState<any[]>([]);
  const [awbCharges, setAwbCharges] = useState<any[]>([]);
  const [chargehead, setChargehead] = useState<any[]>([]);
  const [selectedMailBatch, setSelectedMailBatch] = useState<any>(null);

  const getCourierProduct = async () => {
    try {
      const res: any = await commongetrequest("master/entity?type=2");
      if (res?.status === 200 || res?.status === 204) {
        setCourierProductData(res?.data?.data || []);
      }
    } catch (err: any) {
      showAlert(err.message, "error");
    }
  };

  const chargeHead = async () => {
    const response: any = await commongetrequest("admin/charges?type=E&is_cargo=2");
    if (response?.status == 200) {
      setChargehead(response?.data?.data || []);
    } else if (response?.status == 204) {
      setChargehead([]);
    }
  };

  useEffect(() => {
    getCourierProduct();
    chargeHead();
  }, []);

  const getAdditionalChargeData = async (
    currentPage: number,
    currentLimit: number,
    filters?: {
      batchNumber: string;
      courier: string;
      startDate: string;
      endDate: string;
    },
  ) => {
    const bn = filters?.batchNumber ?? batchNumber;
    const cp = filters?.courier ?? selectedCourier;
    const sd = filters?.startDate ?? startMonth;
    const ed = filters?.endDate ?? endMonth;
    try {
      setAllLoading(true);
      const res: any = await commongetrequest(
        `booking/vendor-additional-charge-dashboard?page=${currentPage}&limit=${currentLimit}&batch_number=${bn}&courier_product_id=${cp}&from_date=${sd}&to_date=${ed}`,
      );
      if (res?.status === 200 || res?.status === 204) {
        setGetAdditionalCharge(res?.data?.data || []);
        setTotalPages(res?.data?.total_pages || 0);
      }
    } catch (error: any) {
      showAlert(error.message, "error");
    } finally {
      setAllLoading(false);
    }
  };

  const getDownloadData = async () => {
    try {
      setDownloadisLoading(true);
      const res: any = await commongetrequest(
        `booking/vendor-additional-charge-dashboard?batch_number=${batchNumber}&courier_product_id=${selectedCourier}&from_date=${startMonth}&to_date=${endMonth}`,
      );
      if (res?.status === 200 || res?.status === 204) {
        const responseList = res?.data?.data || [];
        const mappedData =
          responseList?.map((item: any) => ({
            batch_number: item.batch_number || "",
            vendor:
              courierProductData.find(
                (p) => String(p.party_id) === String(item.vendor),
              )?.party_name ||
              item.vendor ||
              "",
            created_date: formatDate(item.created_date || ""),
            total_awb: item.total_awb || 0,
            billed_awb: item.billed_awb || 0,
            kavach_awb: item.kavach_awb || 0,
            additional_pending: item.additional_pending || 0,
          })) || [];
        handledownload(mappedData || []);
      }
    } catch (error: any) {
      showAlert(error.message, "error");
    } finally {
      setDownloadisLoading(false);
    }
  };

  const handledownload = (data: any) => {
    ExportToXLSX({
      tableData: data,
      leftAlignColumns: [
        "BATCH NUMBER",
        "VENDOR",
        "TOTAL AWB",
        "BILLED AWB",
        "KAVACH AWB",
        "ADDITIONAL PENDING",
      ],
      centerAlignColumns: ["CREATED DATE"],
      rightAlignColumns: [""],
      fileName: "Vendor_Batch_Upload_Data",
    });
  };

  useEffect(() => {
    getAdditionalChargeData(page, limit);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getSearch = () => {
    setPage(1);
    getAdditionalChargeData(1, limit);
  };

  const getMailAwbfunc = async (batchId: any) => {
    const res: any = await commongetrequest(
      `booking/cs-additional-billing/cs-billing-charges?batch_id=${batchId}`,
    );
    try {
      if (res?.status == 200) {
        const data: any[] = res?.data?.data || [];
        const withCharge = data.filter((item: any) => item.charge_id && item.billed == 0);
        setAwbMailData(withCharge);
        setAwbCharges(
          withCharge.map((item: any) => ({
            franchisee_id: item.pickup_franchisee_id,
            cs_bill_id: item.cs_bill_id,
            airwaybill_no: item.airwaybilno,
            charge_name:
              chargehead?.find((c: any) => c.ref_sell_id == item.charge_id)?.charge_name || "",
            charge_amount: item.charge_amount,
            invoice_no: item.vendor_inv,
            is_kawach: item.is_kawach ? 1 : 0,
          })),
        );
      } else if (res?.status == 204) {
        setAwbMailData([]);
      } else {
        showAlert("Something went wrong!", "error");
      }
    } catch (err: any) {
      console.log("err", err);
    }
  };


  const funcSubmitAwbFooter = async (data: any) => {
    const grouped = data.reduce((acc: any, item: any) => {
      const id = item.franchisee_id;
      if (!acc[id]) acc[id] = [];
      const { franchisee_id, ...charge } = item;
      acc[id].push(charge);
      return acc;
    }, {});
    const mail_data = Object.entries(grouped).map(([franchisee_id, charges]) => ({
      franchisee_id: Number(franchisee_id),
      charges,
    }));
    const payload = { batch_id: selectedMailBatch?.batch_id, mail_data };
    try {
      const res: any = await commonpostrequest(
        `booking/cs-additional-billing/send-charges-mail`,
        payload,
      );
      if (res?.status == 200) {
        showAlert("Mail successfully sent!!");
        setAwbCharges([]);
        setOpenMailModal(false);
      } else {
        showAlert("Something went wrong!", "error");
      }
    } catch (err: any) {
      console.log("err", err);
    }
  };

  const closeMailModal = () => {
    setOpenMailModal(false);
    setAwbCharges([]);
    setSelectedMailBatch(null);
  };

  const handleReset = () => {
    setBatchNumber("");
    setSelectedCourier("");
    setStartMonth("");
    setEndMonth("");
    setPage(1);
    getAdditionalChargeData(1, limit, {
      batchNumber: "",
      courier: "",
      startDate: "",
      endDate: "",
    });
  };

  const mailColumns = [
    { field: "airwaybilno", headerName: "AWB No.", text: "text-left" },
    { field: "charge", headerName: "Charge Head", text: "text-left" },
    { field: "charge_amount", headerName: "Amount", text: "text-right" },
    { field: "kavach", headerName: "Kavach", text: "text-center" },
  ];

  const mailRow: any = awbMailData?.map((item: any) => {
    const chargeName =
      chargehead?.find((elem: any) => elem?.ref_sell_id == item?.charge_id)?.charge_name;
    return {
      ...item,
      charge: chargeName || "N.A.",
      kavach: item.is_kawach ? "YES" : "NO",
    };
  });

  const modalMailTitle = (
    <div className="flex justify-between w-[100%]">
      <div>
        <h1 className="font-bold text-2xl text-primary mt-2">
          Send Mail
          {selectedMailBatch?.batch_number && (
            <span className="text-sm font-medium text-white bg-primary px-3 py-1 rounded-full ml-3">
              Batch: {selectedMailBatch.batch_number}
            </span>
          )}
        </h1>
      </div>
      <div>
        <X className="cursor-pointer" onClick={closeMailModal} />
      </div>
    </div>
  );

  const modalMailDescription = (
    <>
      {awbMailData?.length > 0 ? (
        <div className="max-h-[70vh] overflow-auto"><CommonTable columns={mailColumns} row={mailRow} height="300px" /></div>
      ) : (
        <div className="max-h-[70vh] overflow-auto"><Nodatafound /></div>
      )}
    </>
  );

  const footerMail = (
    <>
      <Button
        type="button"
        onClick={closeMailModal}
        className="w-20 text-white mr-1 bg-gray-500 p-2"
      >
        Cancel
      </Button>
      {awbMailData?.length > 0 && (
        <Button
          className="ml-2 w-20 bg-success p-2 text-white"
          onClick={() => funcSubmitAwbFooter(awbCharges)}
        >
          Send
        </Button>
      )}
    </>
  );

  return (
    <>
      <div className="flex justify-between mt-5 mb-2 p-2 bg-white shadow-lg rounded-md">
        <div className="flex items-center">
          <h2 className="text-xl mt-1 font-bold text-primary">
            VENDOR BATCH DASHBOARD
          </h2>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="p-2 mr-1 text-white"
            variant="success"
            onClick={() => getDownloadData()}
          >
            <Download />
            {downloadisLoading ? (
              <LoadingButtonCommon text="Downloading" />
            ) : (
              "Download"
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white shadow-lg my-4 rounded-md p-4">
        {/* Filters */}
        <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-4 mb-4 items-end">
          <div>
            <FormLabel className="text-gray-700">Batch Number</FormLabel>
            <FormInput
              type="text"
              placeholder="Batch Number"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
            />
          </div>
          <div>
            <FormLabel>Vendor</FormLabel>
            <TomSelect
              value={selectedCourier}
              onChange={(e: any) => setSelectedCourier(e)}
              className="bg-white"
            >
              <option value="">All</option>
              {courierProductData.map((item: any, index: number) => (
                <option key={index} value={`${item.party_id}`}>
                  {item.party_name}
                </option>
              ))}
            </TomSelect>
          </div>
          <div>
            <FormLabel>START DATE:</FormLabel>
            <FormInput
              type="date"
              value={startMonth}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setStartMonth(e.target.value)}
            />
          </div>
          <div>
            <FormLabel>END DATE:</FormLabel>
            <FormInput
              type="date"
              value={endMonth}
              min={startMonth || ""}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setEndMonth(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button
              variant="mustard"
              onClick={getSearch}
              className="p-2 w-[150px]"
            >
              <Search className="mr-1" />
              Search
            </Button>
            <Button
              onClick={handleReset}
              className="p-2.5 w-[150px] bg-red-400 text-white"
            >
              Reset <RxReset />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full rounded-md overflow-auto">
          {allLoading ? (
            <IsLoading />
          ) : getAdditionalCharge.length === 0 ? (
            <Nodatafound />
          ) : (
            <Table sm hover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="text-right whitespace-nowrap">
                    S.NO.
                  </Table.Th>
                  <Table.Th className="text-center whitespace-nowrap">
                    SEND MAIL
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    BATCH NUMBER
                  </Table.Th>
                  <Table.Th className="text-left whitespace-nowrap">
                    VENDOR
                  </Table.Th>
                  <Table.Th className="text-center whitespace-nowrap">
                    CREATED DATE
                  </Table.Th>
                  <Table.Th className="text-right whitespace-nowrap">
                    TOTAL CHARGES
                  </Table.Th>
                  <Table.Th className="text-right whitespace-nowrap">
                    BILLED CHARGES
                  </Table.Th>
                  <Table.Th className="text-right whitespace-nowrap">
                    KAVACH CHARGES
                  </Table.Th>
                  <Table.Th className="text-right whitespace-nowrap">
                    ADDITIONAL PENDING
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {getAdditionalCharge.map((item: any, index: number) => (
                  <Table.Tr key={index} className="intro-x">
                    <Table.Td className="text-right">
                      {(page - 1) * limit + index + 1}
                    </Table.Td>
                    <Table.Td className="text-center whitespace-nowrap">
                      {item.mail_sent==0?<button
                        title="Send Mail"
                        onClick={() => {
                          setSelectedMailBatch(item);
                          getMailAwbfunc(item.batch_id);
                          setOpenMailModal(true);
                        }}
                        className="inline-flex items-center justify-center p-1.5 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                      >
                        <Mail size={16} />
                      </button>:"Mail Sent"}
                    </Table.Td>
                    <Table.Td className="text-left whitespace-nowrap">
                      {item.batch_number || "—"}
                    </Table.Td>
                    <Table.Td className="text-left whitespace-nowrap">
                      {courierProductData.find(
                        (p) => String(p.party_id) === String(item.vendor),
                      )?.party_name || ""}
                    </Table.Td>
                    <Table.Td className="text-center whitespace-nowrap">
                      {formatDate(item.created_date)}
                    </Table.Td>
                    <Table.Td className="text-right whitespace-nowrap">
                      <span
                        className={item.total_awb ? "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer" : ""}
                        onClick={() => {
                          if (item.total_awb) navigate("/backoffice/cs_billing", { state: { batch_id: item.batch_id, batch_number: item.batch_number } });
                        }}
                      >
                        {item.total_awb ?? "—"}
                      </span>
                    </Table.Td>
                    <Table.Td className="text-right whitespace-nowrap">
                      <span
                        className={item.billed_awb ? "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer" : ""}
                        onClick={() => {
                          if (item.billed_awb) navigate("/backoffice/cs_billing", { state: { batch_id: item.batch_id, batch_number: item.batch_number, list_type: "billed" } });
                        }}
                      >
                        {item.billed_awb ?? "—"}
                      </span>
                    </Table.Td>
                    <Table.Td className="text-right whitespace-nowrap">
                      <span
                        className={item.kavach_awb ? "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer" : ""}
                        onClick={() => {
                          if (item.kavach_awb) navigate("/backoffice/cs_billing", { state: { batch_id: item.batch_id, batch_number: item.batch_number, list_type: "kavach" } });
                        }}
                      >
                        {item.kavach_awb ?? "—"}
                      </span>
                    </Table.Td>
                    <Table.Td className="text-right whitespace-nowrap">
                      <span
                        className={item.additional_pending ? "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer" : ""}
                        onClick={() => {
                          if (item.additional_pending) navigate("/backoffice/cs_billing", { state: { batch_id: item.batch_id, batch_number: item.batch_number, list_type: "additional_pending" } });
                        }}
                      >
                        {item.additional_pending ?? "—"}
                      </span>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4">
            <CommonPagination
              totalpages={totalPages}
              onPageChange={handlePageChange}
              page={page}
            />
          </div>
        )}
      </div>

      <CommonModal
        open={openMailModal}
        size="xl"
        title={modalMailTitle}
        setOpen={setOpenMailModal}
        description={modalMailDescription}
        footer={footerMail}
      />
    </>
  );
}

export default VendorBatchUpload;
