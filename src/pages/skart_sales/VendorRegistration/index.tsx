import React, { useEffect, useState } from "react";
import { FormInput } from "../../../base-components/Form";
import Button from "../../../base-components/Button";
import { ArrowLeft, FileText, MapPin, Pencil, XCircle } from "lucide-react";
import { masterGET } from "../../../AllServices/masterServices";
import CommonTable from "../commoncomponents/CommonTable/CommonTable";
import CommonPagination from "../commoncomponents/JsonToCsv/pagination";
import { useDebounce } from "../commoncomponents/JsonToCsv/useDebounce/useDebounce";
import LoadingIcon from "../../../base-components/LoadingIcon";
import TaxModal from "../../../Modals";
import { Dialog } from "../../../base-components/Headless";
import CustomerAddress from "../../../Modals/CustomerAddress";
import DocumentUpload from "../../../MyComponents/DocumentUpload";
import CustomerForm from "./customer_form";

const VendorRegistration = ({ pdata }: any) => {
  const [forTableData, setForTableData] = useState<Array<any>>([]);
  const [showList, setShowList] = useState<boolean>(true);
  const [pickDataForEdit, setPickDataForEdit] = useState<any>(null);
  const [editUpdateTextBtn, setEditUpdateTextBtn] = useState<boolean>(true);
  const [count, setCount] = useState<any>("1");
  const [currentPage, setCurrentPage] = useState<any>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [pickGSTStatusToggle, setPickGSTStatusToggle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [plusAddre, setPlusAddress] = useState<any>(null);
  const [headerAddress, setHeaderAddress] = useState<boolean>(false);
  const [docsPartyId, setDocsPartyId] = useState<any>(null);
  const [docsModal, setDocsModal] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500);

  useEffect(() => {
    getList();
  }, [currentPage, debouncedSearchTerm]);

  const getList = async () => {
    try {
      setLoading(true);
      const response: any = await masterGET(
        `/api/v1/master/customer?key=${debouncedSearchTerm}&limit=10&short_key=party_id&short_type=0&page=${Number(currentPage - 1)}&registration_type=vendor`
      );
      const data: any[] = response?.data?.data || [];
      setForTableData(data);
      setCount(response?.data?.pages || 1);

    } catch {
      setForTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (e: any) => {
    setCurrentPage(e);
  };

  const columns = [
    { field: "status", headerName: "Status" },
    { field: "source", headerName: "Source" },
    { field: "created_by_cell", headerName: "Created By" },
    { field: "address", headerName: "Addresses" },
    { field: "documents", headerName: "Documents" },
    { field: "company_name", headerName: "Company Name" },
    { field: "party_name", headerName: "Party Name" },
    { field: "legal_name", headerName: "Legal Name" },
    { field: "ctype_name", headerName: "Company Type" },
    { field: "gstin_no", headerName: "GSTIN Number" },
    { field: "pan_no", headerName: "PAN Number" },
    { field: "tan_no", headerName: "TAN Number" },
    ...(pdata?.update_permission == 1
      ? [{ field: "action", headerName: "Action" }]
      : []),
  ];

  const row: any = forTableData?.map((item: any, index) => {
    // All vendor states are always editable — no view-only lock after submission.
    const action = (
      <Pencil
        className="cursor-pointer"
        key={index}
        onClick={() => {
          setPickDataForEdit(item);
          setEditUpdateTextBtn(false);
          setPickGSTStatusToggle(true);
          setShowList(false);
        }}
      />
    );

    const companyName = item?.company?.map((elem: any) => (
      <p key={elem?.cpy_id}>{elem?.cpy_name}</p>
    ));
    const legalName = <p>{item?.legal_name || "—"}</p>;
    const panNum = <p>{item?.pan_no || "—"}</p>;
    const tanNum = <p>{item?.tan_no || "—"}</p>;
    const gstinNum = <p>{item?.gstin_no || "—"}</p>;

    const approvalStatus = item?.is_approved;
    const isRejected = approvalStatus === 0 && item?.action_by;
    const statusBadge = (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          approvalStatus === 2
            ? "bg-green-100 text-green-700"
            : approvalStatus === 1
            ? "bg-amber-100 text-amber-700"
            : isRejected
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {approvalStatus === 2
          ? "Approved"
          : approvalStatus === 1
          ? "Pending"
          : isRejected
          ? "Rejected"
          : "Draft"}
      </span>
    );

    const sourceBadge = (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
          item?.registration_source === "backoffice"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {item?.registration_source === "backoffice" ? "Backoffice" : "Master"}
      </span>
    );

    const addressBtn = item?.party_id ? (
      <MapPin
        className="cursor-pointer mx-auto text-blue-600"
        onClick={() => {
          setPickDataForEdit(item);
          setPlusAddress(item.party_id);
          setHeaderAddress(true);
        }}
      />
    ) : (
      <span className="text-gray-400 text-xs">N/A</span>
    );

    const docsBtn = item?.party_id ? (
      <FileText
        className="cursor-pointer mx-auto text-purple-600"
        onClick={() => {
          setDocsPartyId(item.party_id);
          setDocsModal(true);
        }}
      />
    ) : (
      <span className="text-gray-400 text-xs">N/A</span>
    );

    const createdByCell = (
      <span className="text-xs text-gray-700 whitespace-nowrap">{item.created_by_name || "—"}</span>
    );

    return {
      ...item,
      status: statusBadge,
      source: sourceBadge,
      created_by_cell: createdByCell,
      address: addressBtn,
      documents: docsBtn,
      action,
      company_name: companyName,
      legal_name: legalName,
      pan_no: panNum,
      tan_no: tanNum,
      gstin_no: gstinNum,
    };
  });

  return (
    <div className="w-full max-w-8xl mx-auto mt-8 p-8 md:p-10 lg:p-12 bg-white rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between border-b border-gray-300">
        <div className="w-100 sm:w-[80%]">
          <div className="flex mb-4 justify-between">
            {!showList && (
              <div
                className="p-2 cursor-pointer rounded-full shadow-xl mr-4"
                onClick={() => {
                  setShowList(true);
                  setPickDataForEdit(null);
                  setEditUpdateTextBtn(true);
                }}
              >
                <ArrowLeft className="w-5 h-4" />
              </div>
            )}
            <div className="flex justify-between w-[100%]">
              <div className="w-[60%] sm:w-auto">
                <h1 className="text-sm sm:text-3xl font-bold mb-2">
                  {showList
                    ? "Vendor Registration"
                    : editUpdateTextBtn
                    ? "Create — Vendor Details"
                    : "Update — Vendor Details"}
                </h1>
              </div>
              <div className="w-[40%] sm:w-auto">
                {showList && (
                  <FormInput
                    id="vendor-search"
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {showList && pdata?.create_permission == 1 && (
          <div className="flex w-100 sm:w-[19%] mb-2 sm:mb-auto justify-end">
            <Button
              className="bg-mustard text-white px-5 py-2 ml-2 mr-2"
              onClick={() => {
                setShowList(false);
                setPickDataForEdit(null);
                setEditUpdateTextBtn(true);
                setPickGSTStatusToggle(false);
              }}
            >
              Create
            </Button>
          </div>
        )}
      </div>

      {showList ? (
        <>
          {loading ? (
            <div className="flex justify-center mt-8">
              <LoadingIcon icon="puff" className="w-8 h-8" />
            </div>
          ) : forTableData?.length > 0 ? (
            <>
              <CommonTable
                columns={columns}
                row={row}
                loading={loading}
                page={currentPage - 1}
                pdata={pdata}
              />
              <CommonPagination
                totalpages={+count}
                onPageChange={onPageChange}
                page={currentPage}
              />
            </>
          ) : (
            <p className="text-center mt-4">No Data Found!</p>
          )}
        </>
      ) : (
        <CustomerForm
          pickDataForEdit={pickDataForEdit}
          setPickDataForEdit={setPickDataForEdit}
          editUpdateTextBtn={editUpdateTextBtn}
          setEditUpdateTextBtn={setEditUpdateTextBtn}
          setCreateNewCustomer={setShowList}
          getCustomerList={getList}
          forTableData={forTableData}
          pickGSTStatusToggle={pickGSTStatusToggle}
          setPickGSTStatusToggle={setPickGSTStatusToggle}
          isStep2={true}
          viewOnly={false}
        />
      )}

      <TaxModal open={headerAddress} onClose={() => setHeaderAddress(false)}>
        <Dialog.Panel size="lg" className="md:w-6/12 md:top-10">
          <Dialog.Title className="flex flex-row justify-between">
            <div>Saved Addresses</div>
            <div>
              <XCircle
                className="cursor-pointer"
                onClick={() => setHeaderAddress(false)}
              />
            </div>
          </Dialog.Title>
          <CustomerAddress
            pickdata={pickDataForEdit}
            plusAddre={plusAddre}
            viewOnly={true}
          />
        </Dialog.Panel>
      </TaxModal>

      <TaxModal open={docsModal} onClose={() => setDocsModal(false)}>
        <Dialog.Panel size="lg" className="md:w-6/12 md:top-10">
          <Dialog.Title className="flex flex-row justify-between">
            <div>Uploaded Documents</div>
            <div>
              <XCircle
                className="cursor-pointer"
                onClick={() => setDocsModal(false)}
              />
            </div>
          </Dialog.Title>
          <div className="px-4 pb-4">
            {docsPartyId ? (
              <DocumentUpload party_id={docsPartyId} viewOnly={true} showUpload={false} />
            ) : (
              <p className="text-gray-400 text-sm">N/A</p>
            )}
          </div>
        </Dialog.Panel>
      </TaxModal>
    </div>
  );
};

export default VendorRegistration;
