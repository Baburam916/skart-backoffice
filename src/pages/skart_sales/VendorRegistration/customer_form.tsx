import React, { useEffect, useState } from "react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import { masterGET, masterPOST, masterPUT } from "../../../AllServices/masterServices";
import Button from "../../../base-components/Button";
import { ArrowDownCircle, Eye, EyeOff, Upload, X, MapPin, XCircle } from "lucide-react";
import DocumentUpload from "../../../MyComponents/DocumentUpload";
import SdAutoComplete from "../../../MyComponents/Autocomplete/index";
import { useAlert } from "../../../ContextProvider/AlertContext";
import LoadingIcon from "../../../base-components/LoadingIcon";
import TaxModal, { MainModal } from "../../../Modals";
import { Dialog } from "../../../base-components/Headless";
import CustomerAddress from "../../../Modals/CustomerAddress";
import { ArrowUpCircle } from "lucide-react";

const customer_form = (data: any) => {
  const {
    pickDataForEdit,
    setPickDataForEdit,
    editUpdateTextBtn,
    setEditUpdateTextBtn,
    setCreateNewCustomer,
    getCustomerList,
    forTableData,
    pickGSTStatusToggle,
    setPickGSTStatusToggle,
    isStep2,
    viewOnly,
  } = data;
  const { showAlert } = useAlert();
  const [customerTypeCheckbox, setCustomerTypeCheckbox] = useState<Array<any>>(
    []
  );
  const [companyListCheckbox, setCompanyListCheckbox] = useState<Array<any>>(
    []
  );
  const [companyType, setCompanyType] = useState<Array<any>>([]);
  const [parentId, setParentId] = useState<Array<any>>([]);
  const [gstCheck, setGstCheck] = useState<boolean>(false);
  const [gstPanCheck, setGstPanCheck] = useState<boolean>(false);
  const [directorInput, setDirectorInput] = useState<any>("");
  const [error, setError] = useState<Array<any>>([]);
  const [searchParent, setSearchParent] = useState<any>("");
  const [spinner, setSpinner] = useState<boolean>(false);
  const [creditLimitValidation, setCreditLimitValidation] = useState<any>();
  const [creditlimitDisable, setCreditlimitDisable] = useState<boolean>(false);
  const [disableGst, setDisableGst] = useState<boolean>(false);
  const [fileData, setFileData] = useState<any>("");
  const [showModal, setShowModal] = useState<boolean>(true);
  const [eyeOff, setEyeOff] = useState<boolean>(true);
  const [currentUploadId, setCurrentUploadId] = useState("");
  const [currentUploadId1, setCurrentUploadId1] = useState("");

  const [crLimitForData, setCrLimitForData] = useState();
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingTypedDocs, setPendingTypedDocs] = useState<{ doc_type_id: number | ""; custom_name: string; file: File | null; preview: string | null; error: string }[]>([]);
  const [vendorDocTypes, setVendorDocTypes] = useState<{ id: number; doc_name: string }[]>([]);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModal1, setOpenModal1] = useState<boolean>(false);

  const [fileLarge, setFileLarge] = useState<boolean>(false);

  const [entityId, setEntityId] = useState({
    party_name: pickDataForEdit?.party_name,
    party_id: pickDataForEdit?.parent_id,
  });
  const [uploadFile, setUploadFile] = useState();
  const [imgAttachData, setImgAttachData] = useState<Array<any>>([]);
  const [imgAttachData1, setImgAttachData1] = useState<Array<any>>([]);
  const [requiredGST, setRequiredGST] = useState<boolean>(false);
  const [requiredPAN, setRequiredPAN] = useState<boolean>(false);
  const [gstFetchData, setGstFetchData] = useState<boolean>(true);
  const [totalCreditData, setTotalCreditData] = useState<any>(null);
  const [openModal2, setOpenModal2] = useState<boolean>(false);
  const [companylistDataItem, setCompanylistDataItem] = useState<any>();
  const [addressModalOpen, setAddressModalOpen] = useState<boolean>(false);
  const [pendingAddresses, setPendingAddresses] = useState<any[]>([]);
  const [gstPrefillAddress, setGstPrefillAddress] = useState<any>(null);

  const isPendingApproval = isStep2 && pickDataForEdit?.is_approved === 1;
  const _rawPendingChanges = pickDataForEdit?.pending_changes
    ? (typeof pickDataForEdit.pending_changes === "string"
        ? (() => { try { return JSON.parse(pickDataForEdit.pending_changes); } catch { return null; } })()
        : pickDataForEdit.pending_changes)
    : null;
  const isChangesRejected = isStep2 && pickDataForEdit?.is_approved === 2 && _rawPendingChanges?.status === 'rejected';
  const isPendingChanges = isStep2 && pickDataForEdit?.is_approved === 2 && !!pickDataForEdit?.pending_changes && !isChangesRejected;

  useEffect(() => {
    getCustomerCheckboxdata();
    getCompanyListCheckboxdata();
    getCompanyType();
    getParentId();
    forTableData?.forEach((elem: any) => {
      elem?.company?.forEach((item: any) => {
        if (item?.party_id == pickDataForEdit?.party_id)
          setCrLimitForData(item?.cr_limit);
      });
    });
  }, [searchParent, pickDataForEdit?.party_id]);

  useEffect(() => {
    if (isStep2) {
      masterGET('/api/v1/master/vendor-doc-types').then((res: any) => {
        if (res?.status === 200) setVendorDocTypes(res.data?.data || []);
      }).catch(() => {});
    }
  }, [isStep2]);

  const getCustomerCheckboxdata = async () => {
    try {
      const res: any = await masterGET("/api/v1/master/customer-type-data");
      if (res.status == 200) {
        setCustomerTypeCheckbox(res?.data?.data);
      } else {
        showAlert("Something went to wrong!", "error");
      }
    } catch (error) {
      showAlert("Something went to wrong", "error");
    }
  };
  const getCompanyListCheckboxdata = async () => {
    const res: any = await masterGET("/api/v1/master/company");
    setCompanyListCheckbox(
      res?.data?.data?.sort((a, b) => a.cpy_id - b.cpy_id)
    );
  };
  const addUpdateDataOfCustomer = async () => {
    setSpinner(true);
    if (editUpdateTextBtn) {
      setPickDataForEdit((prev) => {
        let newData = [...(pickDataForEdit?.company ?? [])];
        newData = newData.map((elem: any) => {
          if (elem.cpy_id === currentUploadId1) {
            return { ...elem, is_prepaid: 1 };
          }
          return elem;
        });
        return { ...prev, company: newData };
      });
    }
    // Validate pending docs before submit (vendor flow only)
    if (isStep2) {
      const othersDocTypeId = vendorDocTypes.find(t => t.doc_name.toLowerCase() === 'others')?.id ?? null;
      const validated = pendingTypedDocs.map(row => {
        if (!row.doc_type_id && !row.file && !row.custom_name?.trim()) return { ...row, error: '' };
        if (!row.doc_type_id) return { ...row, error: 'Select a document type' };
        if (othersDocTypeId && row.doc_type_id === othersDocTypeId && !row.custom_name?.trim()) {
          return { ...row, error: 'Enter a name for this document' };
        }
        if (!row.file) return { ...row, error: 'Attach a file' };
        return { ...row, error: '' };
      });
      if (validated.some(r => r.error)) {
        setPendingTypedDocs(validated);
        setSpinner(false);
        showAlert("Please fix the document errors before submitting.", "error");
        return;
      }
    }

    const buildPayload = (jsonData: any) => {
      const fd = new FormData();
      // Attach any locally-staged addresses — backend will insert them after getting party_id
      const cleanAddresses = pendingAddresses.map(
        ({ _localId, country_name, state_name, city_name, ...rest }: any) => rest
      );
      fd.append('data', JSON.stringify({ ...jsonData, addresses: cleanAddresses }));
      if (isStep2) {
        // Vendor flow: typed docs with doc_type_id per file
        const validDocs = pendingTypedDocs.filter(d => d.file);
        validDocs.forEach(d => fd.append('documents', d.file as File));
        if (validDocs.length > 0) {
          fd.append('doc_type_ids', JSON.stringify(validDocs.map(d => d.doc_type_id)));
          fd.append('doc_type_custom_names', JSON.stringify(validDocs.map(d => d.custom_name?.trim() || null)));
        }
      } else {
        pendingFiles.forEach(f => fd.append('documents', f));
      }
      return fd;
    };
    try {
      if (isStep2) {
        const id = pickDataForEdit?.party_id;

        let res: any;
        if (editUpdateTextBtn) {
          res = await masterPOST(`/api/v1/master/customer-submit`, buildPayload(pickDataForEdit));
        } else {
          res = await masterPUT(`/api/v1/master/customer-submit/${id}`, buildPayload(pickDataForEdit));
        }

        if (res?.status == 200) {
          setPendingAddresses([]);
          setCreateNewCustomer(true);
          setError([]);
          setPendingFiles([]);
          setPendingTypedDocs([]);
          showAlert("Form sent for approval successfully!");
          getCustomerList();
        } else if (res?.response?.status == 406) {
          setError(res?.response?.data.errors);
          setCreateNewCustomer(false);
          setRequiredGST(true);
        } else {
          setCreateNewCustomer(false);
          showAlert(res?.response?.data?.message || res?.message || "Submission failed. Please try again.", "error");
        }
      } else if (editUpdateTextBtn) {
        const res: any = await masterPOST(`/api/v1/master/customer`, buildPayload(pickDataForEdit));
        if (res?.status == 200) {
          setCreateNewCustomer(true);
          setError([]);
          setPendingFiles([]);
          showAlert("Data is added successfully!");
          getCustomerList();
        } else if (res?.response?.status == 406) {
          setError(res?.response?.data.errors);
          setCreateNewCustomer(false);
          setRequiredGST(true);
        } else {
          setCreateNewCustomer(false);
          showAlert(res?.response?.data?.message || res?.message || "Submission failed. Please try again.", "error");
        }
      } else {
        let id = pickDataForEdit?.party_id;
        const res: any = await masterPUT(`/api/v1/master/customer/${id}`, buildPayload(pickDataForEdit));
        if (res?.response?.status === 406) {
          setError(res?.response?.data.errors);
          setCreateNewCustomer(false);
        } else if (res.status === 200) {
          setCreateNewCustomer(true);
          setPendingFiles([]);
          showAlert("Data Updated succesfully!");
          setEditUpdateTextBtn(true);
          getCustomerList();
        } else {
          showAlert(res?.response?.data?.message || res?.message || "Update failed. Please try again.", "error");
        }
      }
    } catch (err: any) {
      console.error("addUpdateDataOfCustomer error:", err);
      showAlert("Something went wrong. Please try again.", "error");
    } finally {
      setSpinner(false);
    }
  };

  const getCompanyType = async () => {
    const res: any = await masterGET("/api/v1/master/company-type");
    setCompanyType(res?.data?.data);
  };
  const getParentId = async () => {
    const res: any = await masterGET(
      `/api/v1/master/parent-list?key=${searchParent}&offset=0&limit=20`
    );
    setParentId(res?.data?.data);
  };
  const gstValidation = (data: any) => {
    {
      error?.map((val, index) => (
        <span key={index}>{val.path === "company" ? val.msg : ""}</span>
      ));
    }
    if (data == 0) {
      setGstCheck(false);
      setGstPanCheck(false);
    } else if (data == 1) {
      setGstCheck(true);
      setGstPanCheck(false);
      setRequiredPAN(false);
      // setGstFetchData(true)
    } else if (data == 2) {
      setGstPanCheck(true);
      setGstCheck(false);
      setRequiredGST(false);
      setRequiredPAN(true);
      // setGstFetchData(false)
    } else if (data == 3) {
      setGstCheck(true);
      setGstPanCheck(false);
      // setGstFetchData(false)
    } else if (data == 4) {
      setGstCheck(true);
      setGstPanCheck(false);
      // setGstFetchData(false)
    }
  };

  const handleGstCheck = async () => {
    let gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;
    const isValid = gstRegex.test(pickDataForEdit.gstin_no);
    let data;
    if (isValid) {
      data = {
        gstin_no: pickDataForEdit.gstin_no,
      };
    }
    const response: any = await masterPOST(`/api/v1/master/check-gst`, data);
    try {
      if (response?.status == 200) {
        const data = response?.data?.data[0];
        const address = [
          data.AddrBnm,
          data.AddrBno,
          data.AddrFlno,
          data.AddrLoc,
          data.AddrPncd,
          data.AddrSt,
        ]
          .filter(Boolean)
          .join(", ");

        setPickDataForEdit((prev: any) => ({
          ...prev,
          legal_name: response?.data?.data[0].LegalName,
          trade_name: response?.data?.data[0].TradeName,
          registered_address: address,
        }));

        setGstPrefillAddress({
          address_1: [data.AddrBno, data.AddrBnm, data.AddrFlno, data.AddrSt].filter(Boolean).join(", ").slice(0, 100) || "",
          address_2: data.AddrLoc || "",
          pin_code: data.AddrPncd || "",
        });

        setError([]);
        setDisableGst(true);
      } else if (response?.response?.status == 406) {
        setRequiredGST(true);
        setError(response?.response?.data.errors);
      }
    } catch (err) {
      setPickDataForEdit((prev: any) => ({
        ...prev,
        legal_name: "",
        trade_name: "",
        registered_address: [],
      }));
      setDisableGst(false);
      setError(response?.response?.data.errors);
    }
  };
  const handleGStBlacklist = async (data: any) => {
    const list = {
      party_name: "",
      gstin_no: data,
      pan_no: "",
    };
    const res: any = await masterPOST(`/api/v1/master/check-blacklist`, list);
    // console.log("resy", res?.data?.data[0].gst)
    const check = res?.data?.data[0].gst;
    if (check == data) {
      showAlert("GST No. is blacklist. Use other GST No.", "warning");
    }
  };
  const handlePartyBlacklist = async (data: any) => {
    const list = {
      party_name: data,
      gstin_no: "",
      pan_no: "",
    };
    const res: any = await masterPOST(`/api/v1/master/check-blacklist`, list);
    const check = res?.data?.data[0].name;
    if (check == data) {
      showAlert("Party Name is blacklist. Use other Party name", "warning");
    }
  };
  const handlePanBlacklist = async (data: any) => {
    const list = {
      party_name: "",
      gstin_no: "",
      pan_no: data,
    };
    const res: any = await masterPOST(`/api/v1/master/check-blacklist`, list);
    const check = res?.data?.data[0].pan_no;
    if (check == data) {
      showAlert("PAN No. is blacklist. Use other PAN No.", "warning");
    }
  };

  // const checkCustomFile = () => {
  //   console.log("Trueitem", )
  //   console.log("pickdates", pickDataForEdit)
  // }
  const handleFileChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setOpenModal(false);
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      showAlert("File size is too large!", "warning");
      setFileLarge(true);
      return;
    } else {
      setFileLarge(false);
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // console.log("Base64 String: ", base64String);
      setImgAttachData(base64String);

      let newData = [...(pickDataForEdit?.company ?? [])];
      newData = newData.map((elem: any) => {
        if (elem.cpy_id === currentUploadId) {
          return {
            ...elem,
            attachment: base64String,
          };
        }
        return elem;
      });

      setPickDataForEdit((prev: any) => ({ ...prev, company: newData }));
    };

    reader.readAsDataURL(selectedFile);
    setUploadFile(URL.createObjectURL(selectedFile)); // Update uploadFile after validation
  };

  const imgUploadFunc = (data: any, index) => {
    const result = data
      ?.filter((item) => item?.cpy_id == index)
      ?.map((item) => item?.cr_attachment);
    setImgAttachData(result[0]);
  };

  const newTabUploadImage = (data: any, index) => {
    const result = data
      ?.filter((item) => item?.cpy_id == index)
      ?.map((item) => item?.cr_attachment);
    window.open(result[0], "_blank");
  };
  const description = (
    <>
      <FormInput
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFileChange1(e)
        }
      />
      <div className="border-2 mt-4 flex justify-center">
        {imgAttachData && (
          <img
            className="h-[40vh]"
            src={imgAttachData}
            alt="Company Attachment"
          />
        )}
      </div>
      <Button
        className="bg-mustard text-white mt-4"
        disabled={fileLarge}
        onClick={() => setOpenModal(false)}
      >
        Save
      </Button>
    </>
  );

  const imgUploadFunc1 = (data: any, index) => {
    const result = data?.find((elem) => elem?.cpy_id == index)?.custom_file;
    setImgAttachData1(result);
  };
  const newTabUploadImage1 = (data: any, index) => {
    // const result = data
    //   ?.filter((item) => item?.cpy_id == index)
    //   ?.map((item) => item?.custom_file);
    const result = data?.find((elem) => elem?.cpy_id == index)?.custom_file;
    window.open(result, "_blank");
  };
  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setOpenModal(false);
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      showAlert("File size is too large!", "warning");
      setFileLarge(true);
      return;
    } else {
      setFileLarge(false);
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImgAttachData1(base64String);

      let newData = [...(pickDataForEdit?.company ?? [])];
      newData = newData.map((elem: any) => {
        if (elem.cpy_id === currentUploadId1) {
          return {
            ...elem,
            attachment_custom_file: base64String,
          };
        }
        return elem;
      });

      setPickDataForEdit((prev: any) => ({ ...prev, company: newData }));
    };

    reader.readAsDataURL(selectedFile);
    setUploadFile(URL.createObjectURL(selectedFile)); // Update uploadFile after validation
  };
  const description1 = (
    <>
      <FormLabel htmlFor="input-state-3" className="mb-0">
        Is Prepaid
      </FormLabel>
      <span className="text-red-500 ml-2">*</span>
      <FormSelect
        className="mt-2 sm:mr-2"
        name="ctype_id"
        value={
          pickDataForEdit?.company?.find(
            (elem: any) => elem.cpy_id == currentUploadId1
          )?.is_prepaid
        }
        onChange={(e) => {
          setPickDataForEdit((prev: any) => {
            const updatedCompany = (prev?.company || []).map((elem: any) => {
              if (elem.cpy_id == currentUploadId1) {
                // Match the correct object
                return { ...elem, is_prepaid: e.target.value };
              }
              return elem;
            });

            return {
              ...prev,
              company: updatedCompany,
            };
          });
        }}
        aria-label="Default select example"
      >
        <option value="1">Yes</option>
        <option value="0">No</option>
      </FormSelect>
      <FormLabel className="mt-2">Remarks</FormLabel>
      <FormInput
        value={
          pickDataForEdit?.company?.find(
            (elem: any) => elem.cpy_id == currentUploadId1
          )?.custom_remarks
        }
        onChange={(e) => {
          setPickDataForEdit((prev: any) => {
            const updatedCompany = (prev?.company || []).map((elem: any) => {
              if (elem.cpy_id == currentUploadId1) {
                // Match the correct object
                return { ...elem, custom_remarks: e.target.value };
              }
              return elem;
            });

            return {
              ...prev,
              company: updatedCompany,
            };
          });
        }}
        type="text"
      />
      <FormInput
        className="mt-2"
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleFileChange2(e)
        }
      />
      {/* <div className="border-2 mt-4 flex justify-center">
        {imgAttachData1 && (
          <img
            className="h-[40vh]"
            src={imgAttachData1}
            alt="Company Attachment"
          />
        )}
      </div> */}
      <Button
        className="bg-mustard text-white mt-4"
        disabled={fileLarge}
        onClick={() => setOpenModal1(false)}
      >
        Save
      </Button>
    </>
  );

  const findparticulardata = (companydata: any, elemid: any) => {
    const newdata = companydata?.find((item: any) => item.cpy_id == elemid);
    return newdata;
  };
  const description2 = (
    <>
      <div>
        <FormCheck className="flex items-center mt-2 sm:mt-0 space-x-2">
          <FormCheck.Input
            checked={
              pickDataForEdit?.company?.find(
                (elem: any) => elem?.cpy_id === companylistDataItem?.cpy_id
              )?.is_block || false
            }
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                const updatedCompanies = prev?.company?.map((elem: any) => {
                  if (elem?.cpy_id == companylistDataItem?.cpy_id) {
                    return {
                      ...elem,
                      is_block: e.target.checked,
                    };
                  }
                  return elem;
                });
                return {
                  ...prev,
                  company: updatedCompanies,
                };
              })
            }
            type="checkbox"
          />
          <FormCheck.Label>Block</FormCheck.Label>
        </FormCheck>
      </div>

      <div>
        <FormInput
          type="number"
          placeholder="Credit Limit"
          value={
            pickDataForEdit?.company?.find(
              (elem: any) => elem?.cpy_id == companylistDataItem?.cpy_id
            )?.cr_limit
          }
          onChange={(e) =>
            setPickDataForEdit((prev: any) => {
              setCreditlimitDisable(false);
              const updatedCompanies = prev?.company?.map((elem: any) => {
                if (elem?.cpy_id === companylistDataItem?.cpy_id) {
                  return {
                    ...elem,
                    cr_limit:
                      Number(e.target.value) < Number(crLimitForData) &&
                      elem?.cpy_id == 1
                        ? Number(e.target.value) < creditLimitValidation &&
                          companylistDataItem.cpy_id == 1
                          ? (setCreditlimitDisable(true), Number(e.target.value))
                          : Number(e.target.value)
                        : Number(e.target.value),
                  };
                }
                return elem;
              });
              return {
                ...prev,
                company: updatedCompanies,
              };
            })
          }
          className={`uppercase p-1 mb-1 ${
            companylistDataItem?.cpy_id == 1 &&
            creditlimitDisable &&
            "border-4 border-red-400"
          }`}
        />

        {/* {pickDataForEdit?.company?.map((elem: any) => {
          if (elem?.cpy_id === item?.cpy_id && item?.cpy_id == 1) {
            return (
              <small style={{ color: "red" }}>
                Cannot reduce below {creditLimitValidation} (Total Outstanding)
              </small>
            );
          } else {
            return null;
          }
        })} */}
      </div>

      {/* <div>
        <FormInput
          id={`credit-days-${index}`}
          type="number"
          placeholder="Credit Days"
          value={
            pickDataForEdit?.company?.find(
              (elem: any) => elem?.cpy_id == item?.cpy_id
            )?.cr_days
          }
          onChange={(e) =>
            setPickDataForEdit((prev: any) => {
              const updatedCompanies = prev?.company?.map((elem: any) => {
                if (elem.cpy_id === item.cpy_id) {
                  return {
                    ...elem,
                    cr_days: Number(e.target.value),
                  };
                }
                return elem;
              });
              return {
                ...prev,
                company: updatedCompanies,
              };
            })
          }
          className="uppercase p-1 mb-1"
        />
      </div> */}
    </>
  );
  return (
    <>
      {/* Approved vendor — informational, only when no pending re-submission */}
      {isStep2 && pickDataForEdit?.is_approved === 2 && !pickDataForEdit?.pending_changes && (
        <div className="mb-3 px-3 py-2 rounded-md bg-amber-50 border border-amber-300 text-amber-700 text-sm font-medium">
          This vendor is approved. You can edit and re-submit for any changes — the vendor stays active while admin reviews.
        </div>
      )}

      {/* Pending first-time approval */}
      {isPendingApproval && (
        <div className="mb-3 px-3 py-2 rounded-md bg-blue-50 border border-blue-300 text-blue-700 text-sm">
          <span className="font-semibold">Awaiting admin approval.</span> Your submission is under review. You can still edit and re-send for approval anytime.
        </div>
      )}

      {/* Rejected — show reason, form is editable */}
      {!viewOnly && pickDataForEdit?.is_approved === 0 && pickDataForEdit?.action_by && (
        <div className="mb-3 px-3 py-2 rounded-md bg-red-50 border border-red-300 text-red-700 text-sm">
          <span className="font-semibold">Submission rejected.</span>{pickDataForEdit?.remarks ? ` Reason: ${pickDataForEdit.remarks}.` : ""} Please update and re-submit.
        </div>
      )}

      {/* Changes rejected by admin — show reason so vendor can resubmit */}
      {isChangesRejected && (
        <div className="mb-3 px-3 py-2 rounded-md bg-red-50 border border-red-300 text-red-800 text-sm">
          <span className="font-semibold">Your pending changes were rejected by admin.</span>
          {_rawPendingChanges?.rejection_remark && (
            <p className="mt-1">Reason: <span className="font-medium">{_rawPendingChanges.rejection_remark}</span></p>
          )}
          <p className="text-xs text-red-600 mt-1">Please make the necessary corrections and re-submit.</p>
        </div>
      )}

      {/* Changes pending — re-submitted, form fully editable, show what was sent */}
      {isPendingChanges && (() => {
        const pc = pickDataForEdit?.pending_changes;
        const changes = pc && typeof pc === "string" ? JSON.parse(pc) : pc;
        return (
          <div className="mb-3 px-3 py-2 rounded-md bg-amber-50 border border-amber-300 text-amber-800 text-sm">
            <span className="font-semibold">Changes submitted for admin review.</span> The vendor remains active. You can still edit and re-send anytime — all pending changes accumulate until admin reviews.
            {Array.isArray(changes?.changed_fields) && changes.changed_fields.length > 0 && (
              <div className="mt-2 border-t border-amber-300 pt-2">
                <span className="block text-xs font-semibold mb-1">Submitted changes:</span>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  {changes.changed_fields.map((cf: any, i: number) => (
                    <li key={i}><span className="font-medium">{cf.field}:</span> {cf.old || '(empty)'} → {cf.new || '(empty)'}</li>
                  ))}
                </ul>
              </div>
            )}
            {changes?.resubmitted_at && (
              <p className="text-xs text-amber-600 mt-1">Submitted on: {new Date(changes.resubmitted_at).toLocaleString()}</p>
            )}
            <p className="text-xs text-amber-600 mt-1">Address and document changes saved via their panels are also under review.</p>
          </div>
        );
      })()}

      <fieldset className="block border-0 p-0 m-0 min-w-0 w-full">
      <div className="mb-2">
        <label>Vendor Type</label>
        <span className="text-red-500 ml-2">*</span>
        <div className="h-24 overflow-y-auto mb-1 flex flex-wrap gap-x-6 gap-y-1 pt-2 pl-2">
          {customerTypeCheckbox?.map(
            (item: any, index) =>
              item.ct_name == "Vendor" && (
                <FormCheck className="flex items-center gap-2" key={index}>
                  <FormCheck.Input
                    id={`checkbox-switch-${index}`}
                    type="checkbox"
                    checked={pickDataForEdit?.type
                      ?.map((elem: any) => elem?.ctd_id)
                      .includes(item?.ctd_id)}
                    onChange={(e) =>
                      setPickDataForEdit((prev: any) => {
                        const isChecked = e.target.checked;
                        let updatedType;
                        if (isChecked) {
                          updatedType = [...(prev?.type || []), item];
                        } else {
                          updatedType = (prev?.type || []).filter(
                            (elem: any) => elem?.ctd_id !== item?.ctd_id
                          );
                        }
                        return { ...prev, type: updatedType };
                      })
                    }
                  />
                  <FormCheck.Label htmlFor={`checkbox-switch-${index}`}>
                    {item.ctype_name}
                  </FormCheck.Label>
                </FormCheck>
              )
          )}
        </div>
        <small style={{ color: "red" }}>
          {error?.some((val: any) => val.path === "type" || val.path === "vendor_type") && (
            <span>At least one vendor type must be selected</span>
          )}
        </small>
      </div>
      {/* <div className="mb-4">
        <div>
          <label>Company List</label>
          <span className="text-red-500 ml-2">*</span>
          <div className="h-28 overflow-y-scroll mb-4">
            {companyListCheckbox?.map((item: any, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 mb-2 sm:mb-auto p-2 sm:p-0 border-[1px] border-solid border-inherit sm:border-[0px]"
              >
                <div>
                  <FormCheck className="flex items-center space-x-2">
                    <FormCheck.Input
                      id={`checkbox-company-${index}`}
                      type="checkbox"
                      checked={pickDataForEdit?.company
                        ?.map((elem: any) => elem?.cpy_id)
                        .includes(item?.cpy_id)}
                      onChange={(e) => {
                        e.target.checked
                          ? setPickDataForEdit((prev: any) => {
                              const addCompany = [
                                ...(prev?.company || []),
                                {
                                  ...item,
                                  is_block: false,
                                  cr_limit: 0,
                                  cr_days: 0,
                                  is_prepaid: 1,
                                },
                              ];
                              return {
                                ...prev,
                                company: addCompany,
                              };
                            })
                          : setPickDataForEdit((prev: any) => {
                              const removeCompany = prev?.company.filter(
                                (elem: any) => elem.cpy_id !== item.cpy_id
                              );
                              return {
                                ...prev,
                                company: removeCompany,
                              };
                            });
                      }}
                    />
                    <FormCheck.Label htmlFor={`checkbox-company-${index}`}>
                      {item.cpy_name}
                    </FormCheck.Label>
                  </FormCheck>
                </div>
                {item?.cpy_id == 1 ? (
                  <div className="flex">
                    <Button
                      className="h-10 border border-transparent bg-mustard text-white shadow-none"
                      disabled={
                        !pickDataForEdit?.company
                          ?.map((elem: any) => elem.cpy_id)
                          .includes(item?.cpy_id)
                      }
                      onClick={() => {
                        setCurrentUploadId1(item?.cpy_id);
                        imgUploadFunc1(pickDataForEdit?.company, item?.cpy_id);
                        setOpenModal1(true);
                      }}
                    >
                      Is Duty Prepaid
                    </Button>


                    {findparticulardata(
                      pickDataForEdit?.company,
                      item?.cpy_id
                    ) !== undefined &&
                    findparticulardata(pickDataForEdit?.company, item?.cpy_id)
                      ?.custom_file ? (
                      <Eye
                        className="cursor-pointer"
                        onClick={() =>
                          newTabUploadImage1(
                            pickDataForEdit?.company,
                            item?.cpy_id
                          )
                        }
                      />
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
                <div>
                  <FormCheck className="flex items-center mt-2 sm:mt-0 space-x-2">
                    <FormCheck.Input
                      checked={
                        pickDataForEdit?.company?.find(
                          (elem: any) => elem.cpy_id === item.cpy_id
                        )?.is_block || false
                      }
                      onChange={(e) =>
                        setPickDataForEdit((prev: any) => {
                          const updatedCompanies = prev?.company?.map(
                            (elem: any) => {
                              if (elem.cpy_id === item.cpy_id) {
                                return {
                                  ...elem,
                                  is_block: e.target.checked,
                                };
                              }
                              return elem;
                            }
                          );
                          return {
                            ...prev,
                            company: updatedCompanies,
                          };
                        })
                      }
                      id={`checkbox-block-${index}`}
                      type="checkbox"
                    />
                    <FormCheck.Label htmlFor={`checkbox-block-${index}`}>
                      Block
                    </FormCheck.Label>
                  </FormCheck>
                </div>

                <div>
                  <FormInput
                    id={`credit-limit-${index}`}
                    type="number"
                    placeholder="Credit Limit"
                    value={
                      pickDataForEdit?.company?.find(
                        (elem: any) => elem?.cpy_id == item?.cpy_id
                      )?.cr_limit
                    }
                    onChange={(e) =>
                      setPickDataForEdit((prev: any) => {
                        setCreditlimitDisable(false);
                        const updatedCompanies = prev?.company?.map(
                          (elem: any) => {
                            if (elem.cpy_id === item.cpy_id) {
                              return {
                                ...elem,
                                cr_limit:
                                  Number(e.target.value) <
                                    Number(crLimitForData) && elem.cpy_id == 1
                                    ? Number(e.target.value) <
                                        creditLimitValidation &&
                                      item.cpy_id == 1
                                      ? setCreditlimitDisable(true)
                                      : Number(e.target.value)
                                    : Number(e.target.value),
                              };
                            }
                            return elem;
                          }
                        );
                        return {
                          ...prev,
                          company: updatedCompanies,
                        };
                      })
                    }
                    className={`uppercase p-1 mb-1 ${
                      item?.cpy_id == 1 &&
                      creditlimitDisable &&
                      "border-4 border-red-400"
                    }`}
                  />

                  {pickDataForEdit?.company?.map((elem: any) => {
                    if (elem?.cpy_id === item?.cpy_id && item?.cpy_id == 1) {
                      return (
                        <small style={{ color: "red" }}>
                          Cannot reduce below {creditLimitValidation} (Total
                          Outstanding)
                        </small>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>

                <div>
                  <FormInput
                    id={`credit-days-${index}`}
                    type="number"
                    placeholder="Credit Days"
                    value={
                      pickDataForEdit?.company?.find(
                        (elem: any) => elem?.cpy_id == item?.cpy_id
                      )?.cr_days
                    }
                    onChange={(e) =>
                      setPickDataForEdit((prev: any) => {
                        const updatedCompanies = prev?.company?.map(
                          (elem: any) => {
                            if (elem.cpy_id === item.cpy_id) {
                              return {
                                ...elem,
                                cr_days: Number(e.target.value),
                              };
                            }
                            return elem;
                          }
                        );
                        return {
                          ...prev,
                          company: updatedCompanies,
                        };
                      })
                    }
                    className="uppercase p-1 mb-1"
                  />
                </div>
                <div>
                  <FormTextarea
                    className=""
                    style={{ maxHeight: "50px", height: "30px" }}
                    autoComplete="off"
                    placeholder="Remarks"
                    value={
                      pickDataForEdit?.company?.find(
                        (elem: any) => elem?.cpy_id == item?.cpy_id
                      )?.remarks || ""
                    }
                    onChange={(e) =>
                      setPickDataForEdit((prev: any) => {
                        const updatedCompanies = prev?.company?.map(
                          (elem: any) => {
                            if (elem.cpy_id === item.cpy_id) {
                              return {
                                ...elem,
                                remarks: e.target.value,
                              };
                            }
                            return elem;
                          }
                        );
                        return {
                          ...prev,
                          company: updatedCompanies,
                        };
                      })
                    }
                  />
                </div>
                <div className="flex justify-start items-start space-x-2">
                  <Button
                    className="py-1 border border-transparent shadow-none"
                    disabled={
                      !pickDataForEdit?.company
                        ?.map((elem: any) => elem.cpy_id)
                        .includes(item?.cpy_id)
                    }
                    onClick={() => {
                      setCurrentUploadId(item?.cpy_id);
                      imgUploadFunc(pickDataForEdit?.company, item?.cpy_id);
                      setOpenModal(true);
                    }}
                  >
                    <ArrowUpCircle />
                  </Button>
                  {findparticulardata(
                    pickDataForEdit?.company,
                    item?.cpy_id
                  ) !== undefined &&
                  findparticulardata(pickDataForEdit?.company, item?.cpy_id)
                    ?.cr_attachment ? (
                    <Eye
                      className="cursor-pointer"
                      onClick={() =>
                        newTabUploadImage(
                          pickDataForEdit?.company,
                          item?.cpy_id
                        )
                      }
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <small style={{ color: "red" }}>
          {error?.map((val, index) => (
            <span key={index}>{val.path === "company" ? val.msg : ""}</span>
          ))}
        </small>
      </div> */}

      <div className="mb-4">
        <div>
          <label>Company List</label>
          <span className="text-red-500 ml-2">*</span>
          {/* <div className="h-44 overflow-y-scroll mb-4">
            {companyListCheckbox?.map((item: any, index) => (
              <>
               <div className="p-2 border border-gray-200 rounded-md mb-2">
                <div
                  key={index}
                  className="flex gap-4 flex-wrap justify-center"
                >
                  <div className="w-[15%] mt-2">
                    <FormCheck className="flex items-center space-x-2">
                      <FormCheck.Input
                        id={`checkbox-company-${index}`}
                        type="checkbox"
                        checked={pickDataForEdit?.company
                          ?.map((elem: any) => elem?.cpy_id)
                          .includes(item?.cpy_id)}
                        onChange={(e) => {
                          e.target.checked
                            ? setPickDataForEdit((prev: any) => {
                                const addCompany = [
                                  ...(prev?.company || []),
                                  {
                                    ...item,
                                    is_block: false,
                                    cr_limit: 0,
                                    cr_days: 0,
                                    is_prepaid: 1,
                                  },
                                ];
                                return {
                                  ...prev,
                                  company: addCompany,
                                };
                              })
                            : setPickDataForEdit((prev: any) => {
                                const removeCompany = prev?.company.filter(
                                  (elem: any) => elem.cpy_id !== item.cpy_id
                                );
                                return {
                                  ...prev,
                                  company: removeCompany,
                                };
                              });
                        }}
                      />
                      <FormCheck.Label htmlFor={`checkbox-company-${index}`}>
                        {item.cpy_name}
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                  <div className="w-[15%]">
                    {item?.cpy_id == 1 ? (
                      <div className="flex mb-2">
                        <Button
                          className="h-10 border border-transparent bg-mustard text-white shadow-none"
                          disabled={
                            !pickDataForEdit?.company
                              ?.map((elem: any) => elem.cpy_id)
                              .includes(item?.cpy_id)
                          }
                          onClick={() => {
                            setCurrentUploadId1(item?.cpy_id);
                            imgUploadFunc1(
                              pickDataForEdit?.company,
                              item?.cpy_id
                            );
                            setOpenModal1(true);
                          }}
                        >
                          Is Duty Prepaid
                        </Button>

                        {findparticulardata(
                          pickDataForEdit?.company,
                          item?.cpy_id
                        ) !== undefined &&
                        findparticulardata(
                          pickDataForEdit?.company,
                          item?.cpy_id
                        )?.custom_file ? (
                          <Eye
                            className="cursor-pointer"
                            onClick={() =>
                              newTabUploadImage1(
                                pickDataForEdit?.company,
                                item?.cpy_id
                              )
                            }
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="w-[10%] mt-2">
                    <FormCheck className="flex items-center mt-2 sm:mt-0 space-x-2">
                      <FormCheck.Input
                        checked={
                          pickDataForEdit?.company?.find(
                            (elem: any) => elem.cpy_id === item.cpy_id
                          )?.is_block || false
                        }
                        onChange={(e) =>
                          setPickDataForEdit((prev: any) => {
                            const updatedCompanies = prev?.company?.map(
                              (elem: any) => {
                                if (elem.cpy_id === item.cpy_id) {
                                  return {
                                    ...elem,
                                    is_block: e.target.checked,
                                  };
                                }
                                return elem;
                              }
                            );
                            return {
                              ...prev,
                              company: updatedCompanies,
                            };
                          })
                        }
                        id={`checkbox-block-${index}`}
                        type="checkbox"
                      />
                      <FormCheck.Label htmlFor={`checkbox-block-${index}`}>
                        Block
                      </FormCheck.Label>
                    </FormCheck>
                  </div>

                  <div className="w-[25%]">
                    <FormInput
                      id={`credit-limit-${index}`}
                      type="number"
                      placeholder="Credit Limit"
                      value={
                        pickDataForEdit?.company?.find(
                          (elem: any) => elem?.cpy_id == item?.cpy_id
                        )?.cr_limit
                      }
                      onChange={(e) =>
                        setPickDataForEdit((prev: any) => {
                          setCreditlimitDisable(false);
                          const updatedCompanies = prev?.company?.map(
                            (elem: any) => {
                              if (elem.cpy_id === item.cpy_id) {
                                return {
                                  ...elem,
                                  cr_limit:
                                    Number(e.target.value) <
                                      Number(crLimitForData) && elem.cpy_id == 1
                                      ? Number(e.target.value) <
                                          creditLimitValidation &&
                                        item.cpy_id == 1
                                        ? setCreditlimitDisable(true)
                                        : Number(e.target.value)
                                      : Number(e.target.value),
                                };
                              }
                              return elem;
                            }
                          );
                          return {
                            ...prev,
                            company: updatedCompanies,
                          };
                        })
                      }
                      className={`uppercase p-1 mb-1 ${
                        item?.cpy_id == 1 &&
                        creditlimitDisable &&
                        "border-4 border-red-400"
                      }`}
                    />

                    {pickDataForEdit?.company?.map((elem: any) => {
                      if (elem?.cpy_id === item?.cpy_id && item?.cpy_id == 1) {
                        return (
                          <small style={{ color: "red" }}>
                            Cannot reduce below {creditLimitValidation} (Total
                            Outstanding)
                          </small>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </div>

                  <div className="w-[25%]">
                    <FormInput
                      id={`credit-days-${index}`}
                      type="number"
                      placeholder="Credit Days"
                      value={
                        pickDataForEdit?.company?.find(
                          (elem: any) => elem?.cpy_id == item?.cpy_id
                        )?.cr_days
                      }
                      onChange={(e) =>
                        setPickDataForEdit((prev: any) => {
                          const updatedCompanies = prev?.company?.map(
                            (elem: any) => {
                              if (elem.cpy_id === item.cpy_id) {
                                return {
                                  ...elem,
                                  cr_days: Number(e.target.value),
                                };
                              }
                              return elem;
                            }
                          );
                          return {
                            ...prev,
                            company: updatedCompanies,
                          };
                        })
                      }
                      className="uppercase p-1 mb-1"
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="w-[97%]">
                    <FormTextarea
                      className=""
                      style={{ maxHeight: "50px", height: "40px" }}
                      autoComplete="off"
                      placeholder="Remarks"
                      value={
                        pickDataForEdit?.company?.find(
                          (elem: any) => elem?.cpy_id == item?.cpy_id
                        )?.remarks || ""
                      }
                      onChange={(e) =>
                        setPickDataForEdit((prev: any) => {
                          const updatedCompanies = prev?.company?.map(
                            (elem: any) => {
                              if (elem.cpy_id === item.cpy_id) {
                                return {
                                  ...elem,
                                  remarks: e.target.value,
                                };
                              }
                              return elem;
                            }
                          );
                          return {
                            ...prev,
                            company: updatedCompanies,
                          };
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-start items-start space-x-2">
                    <Button
                      className="py-1 border border-transparent shadow-none"
                      disabled={
                        !pickDataForEdit?.company
                          ?.map((elem: any) => elem.cpy_id)
                          .includes(item?.cpy_id)
                      }
                      onClick={() => {
                        setCurrentUploadId(item?.cpy_id);
                        imgUploadFunc(pickDataForEdit?.company, item?.cpy_id);
                        setOpenModal(true);
                      }}
                    >
                      <ArrowUpCircle />
                    </Button>
                    {findparticulardata(
                      pickDataForEdit?.company,
                      item?.cpy_id
                    ) !== undefined &&
                    findparticulardata(pickDataForEdit?.company, item?.cpy_id)
                      ?.cr_attachment ? (
                      <Eye
                        className="cursor-pointer"
                        onClick={() =>
                          newTabUploadImage(
                            pickDataForEdit?.company,
                            item?.cpy_id
                          )
                        }
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
               </div>
              </>
            ))}
          </div> */}

          <div className="h-44 overflow-y-scroll mb-4">
            {companyListCheckbox?.map((item: any, index) => (
              <>
                <div className="p-2 border border-gray-200 rounded-md mb-2">
                  <div
                    key={index}
                    className="flex flex-wrap bg-gray-100 items-center mb-2"
                  >
                    <div className="flex w-[85%]">
                      <div className="ml-2 mt-2 mb-2 mr-4">
                        <FormCheck className="flex items-center space-x-2">
                          <FormCheck.Input
                            id={`checkbox-company-${index}`}
                            type="checkbox"
                            checked={pickDataForEdit?.company
                              ?.map((elem: any) => elem?.cpy_id)
                              .includes(item?.cpy_id)}
                            onChange={(e) => {
                              e.target.checked
                                ? setPickDataForEdit((prev: any) => {
                                    const addCompany = [
                                      ...(prev?.company || []),
                                      {
                                        ...item,
                                        is_block: false,
                                        cr_limit: 0,
                                        cr_days: 0,
                                        is_prepaid: 1,
                                      },
                                    ];
                                    return {
                                      ...prev,
                                      company: addCompany,
                                    };
                                  })
                                : setPickDataForEdit((prev: any) => {
                                    const removeCompany = prev?.company.filter(
                                      (elem: any) => elem.cpy_id !== item.cpy_id
                                    );
                                    return {
                                      ...prev,
                                      company: removeCompany,
                                    };
                                  });
                            }}
                          />
                          <FormCheck.Label htmlFor={`checkbox-company-${index}`}>
                            {item.cpy_name}
                          </FormCheck.Label>
                        </FormCheck>
                      </div>

                      <div className="mt-2 mb-2">
                        <FormCheck className="flex items-center mt-2 sm:mt-0 space-x-2">
                          <FormCheck.Input
                            checked={
                              pickDataForEdit?.company?.find(
                                (elem: any) => elem.cpy_id === item.cpy_id
                              )?.is_block || false
                            }
                            onChange={(e) =>
                              setPickDataForEdit((prev: any) => {
                                const updatedCompanies = prev?.company?.map(
                                  (elem: any) => {
                                    if (elem.cpy_id === item.cpy_id) {
                                      return {
                                        ...elem,
                                        is_block: e.target.checked,
                                      };
                                    }
                                    return elem;
                                  }
                                );
                                return {
                                  ...prev,
                                  company: updatedCompanies,
                                };
                              })
                            }
                            id={`checkbox-block-${index}`}
                            type="checkbox"
                          />
                          <FormCheck.Label htmlFor={`checkbox-block-${index}`}>
                            Block
                          </FormCheck.Label>
                        </FormCheck>
                      </div>
                    </div>
                    <div className="w-[15%]">
                      {item?.cpy_id == 1 ? (
                        <div className="flex mb-2 mt-2">
                          <Button
                            className="border border-transparent bg-white rounded shadow border-1 border-grey-500 shadow-none"
                            disabled={
                              !pickDataForEdit?.company
                                ?.map((elem: any) => elem.cpy_id)
                                .includes(item?.cpy_id)
                            }
                            onClick={() => {
                              setCurrentUploadId1(item?.cpy_id);
                              imgUploadFunc1(
                                pickDataForEdit?.company,
                                item?.cpy_id
                              );
                              setOpenModal1(true);
                            }}
                          >
                            Is Duty Prepaid
                          </Button>

                          {findparticulardata(
                            pickDataForEdit?.company,
                            item?.cpy_id
                          ) !== undefined &&
                          findparticulardata(
                            pickDataForEdit?.company,
                            item?.cpy_id
                          )?.custom_file ? (
                            <Eye
                              className="cursor-pointer"
                              onClick={() =>
                                newTabUploadImage1(
                                  pickDataForEdit?.company,
                                  item?.cpy_id
                                )
                              }
                            />
                          ) : (
                            ""
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between flex-wrap">

                    <div className="w-[65%]">
                      <FormTextarea
                        className=""
                        style={{ maxHeight: "50px", height: "35px" }}
                        autoComplete="off"
                        placeholder="Remarks"
                        value={
                          pickDataForEdit?.company?.find(
                            (elem: any) => elem?.cpy_id == item?.cpy_id
                          )?.remarks || ""
                        }
                        onChange={(e) =>
                          setPickDataForEdit((prev: any) => {
                            const updatedCompanies = prev?.company?.map(
                              (elem: any) => {
                                if (elem.cpy_id === item.cpy_id) {
                                  return {
                                    ...elem,
                                    remarks: e.target.value,
                                  };
                                }
                                return elem;
                              }
                            );
                            return {
                              ...prev,
                              company: updatedCompanies,
                            };
                          })
                        }
                      />
                    </div>
                    <div className="w-[12%]">
                      <FormInput
                        id={`credit-limit-${index}`}
                        type="number"
                        placeholder="Credit Limit"
                        value={
                          pickDataForEdit?.company?.find(
                            (elem: any) => elem?.cpy_id == item?.cpy_id
                          )?.cr_limit
                        }
                        onChange={(e) =>
                          setPickDataForEdit((prev: any) => {
                            setCreditlimitDisable(false);
                            const updatedCompanies = prev?.company?.map(
                              (elem: any) => {
                                if (elem.cpy_id === item.cpy_id) {
                                  return {
                                    ...elem,
                                    cr_limit:
                                      Number(e.target.value) <
                                        Number(crLimitForData) &&
                                      elem.cpy_id == 1
                                        ? Number(e.target.value) <
                                            creditLimitValidation &&
                                          item.cpy_id == 1
                                          ? (setCreditlimitDisable(true), Number(e.target.value))
                                          : Number(e.target.value)
                                        : Number(e.target.value),
                                  };
                                }
                                return elem;
                              }
                            );
                            return {
                              ...prev,
                              company: updatedCompanies,
                            };
                          })
                        }
                        className={`uppercase p-1 mb-1 ${
                          item?.cpy_id == 1 &&
                          creditlimitDisable &&
                          "border-4 border-red-400"
                        }`}
                      />

                      {pickDataForEdit?.company?.map((elem: any) => {
                        if (
                          elem?.cpy_id === item?.cpy_id &&
                          item?.cpy_id == 1
                        ) {
                          return (
                            <small style={{ color: "red" }}>
                              Cannot reduce below {creditLimitValidation} (Total
                              Outstanding)
                            </small>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>

                    <div className="w-[12%]">
                      <FormInput
                        id={`credit-days-${index}`}
                        type="number"
                        placeholder="Credit Days"
                        value={
                          pickDataForEdit?.company?.find(
                            (elem: any) => elem?.cpy_id == item?.cpy_id
                          )?.cr_days
                        }
                        onChange={(e) =>
                          setPickDataForEdit((prev: any) => {
                            const updatedCompanies = prev?.company?.map(
                              (elem: any) => {
                                if (elem.cpy_id === item.cpy_id) {
                                  return {
                                    ...elem,
                                    cr_days: Number(e.target.value),
                                  };
                                }
                                return elem;
                              }
                            );
                            return {
                              ...prev,
                              company: updatedCompanies,
                            };
                          })
                        }
                        className="uppercase p-1 mb-1"
                      />
                    </div>
                    <div className="flex justify-start items-start space-x-2">
                      <Button
                        className="py-1 border border-transparent shadow-none bg-mustard text-white"
                        disabled={
                          !pickDataForEdit?.company
                            ?.map((elem: any) => elem.cpy_id)
                            .includes(item?.cpy_id)
                        }
                        onClick={() => {
                          setCurrentUploadId(item?.cpy_id);
                          imgUploadFunc(pickDataForEdit?.company, item?.cpy_id);
                          setOpenModal(true);
                        }}
                      >
                        <ArrowUpCircle />
                      </Button>
                      {findparticulardata(
                        pickDataForEdit?.company,
                        item?.cpy_id
                      ) !== undefined &&
                      findparticulardata(pickDataForEdit?.company, item?.cpy_id)
                        ?.cr_attachment ? (
                        <Eye
                          className="cursor-pointer"
                          onClick={() =>
                            newTabUploadImage(
                              pickDataForEdit?.company,
                              item?.cpy_id
                            )
                          }
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
        <small style={{ color: "red" }}>
          {error?.map((val, index) => (
            <span key={index}>{val.path === "company" ? val.msg : ""}</span>
          ))}
        </small>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
        <div>
          <FormLabel htmlFor="regular-form-1">Party Name</FormLabel>
          <span className="text-red-500 ml-2">*</span>
          <FormInput
            id="regular-form-1"
            type="text"
            value={pickDataForEdit?.party_name}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  party_name: e.target.value,
                };
              })
            }
            onBlur={(e) => handlePartyBlacklist(e.target.value)}
            className="uppercase"
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>
                {val.path === "party_name" ? val.msg : ""}
              </span>
            ))}
          </small>
        </div>
        {pickDataForEdit?.registered_address && (
          <div>
            <FormLabel htmlFor="regular-form-1">Address</FormLabel>
            {/* <span className="text-red-500 ml-2">*</span> */}
            <p>{pickDataForEdit?.registered_address}</p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <FormLabel htmlFor="input-state-3" className="mb-0">
            Gst Status
          </FormLabel>
          <span className="text-red-500 ml-2">*</span>
          <FormSelect
            className="mt-2 sm:mr-2"
            // name="ctype_id"
            value={pickDataForEdit?.gst_status}
            // disabled={
            //   pickGSTStatusToggle &&
            //   (pickDataForEdit?.gst_status == 1 ||
            //     pickDataForEdit?.gst_status == 2)
            // }
            onChange={(e) => {
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  gst_status: Number(e.target.value),
                };
              }),
                gstValidation(e.target.value);
            }}
            aria-label="Default select example"
          >
            <option value="">Select One</option>
            <option value="0">Not Applicable</option>
            <option value="1">GST Registered</option>
            <option value="2">GST Unregistered</option>
            <option value="3">SEZ/GST</option>
            <option value="4">SEZ/EXEMPT</option>
          </FormSelect>
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>
                {val.path === "gst_status" ? val.msg : ""}
              </span>
            ))}
          </small>
        </div>
        <div>
          <FormLabel htmlFor="regular-form-1">GSTIN Number</FormLabel>
          {gstCheck ? <span className="text-red-500 ml-2">*</span> : ""}
          {pickDataForEdit?.gst_status == 1 ||
          pickDataForEdit?.gst_status == 3 ||
          pickDataForEdit?.gst_status == 4 ? (
            <Button
              className="m-2 bg-blue-600 border-none py-1 px-2 text-white"
              onClick={() => handleGstCheck()}
            >
              Fetch Data
            </Button>
          ) : (
            ""
          )}
          <FormInput
            id="regular-form-1"
            type="text"
            value={pickDataForEdit?.gstin_no}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  gstin_no: e.target.value.toUpperCase(),
                };
              })
            }
            onBlur={(e) => handleGStBlacklist(e.target.value)}
            className="uppercase"
          />
          {requiredGST && (
            <small style={{ color: "red" }}>
              {error?.map((val, index) => (
                <span key={index}>
                  {val.path === "gstin_no" ? val.msg : ""}
                </span>
              ))}
            </small>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <FormLabel htmlFor="regular-form-1">PAN Number</FormLabel>
          {gstPanCheck ? <span className="text-red-500 ml-2">*</span> : ""}
          <FormInput
            id="regular-form-1"
            type="text"
            value={pickDataForEdit?.pan_no}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  pan_no: e.target.value.toUpperCase(),
                };
              })
            }
            onBlur={(e) => handlePanBlacklist(e.target.value)}
            className="uppercase"
          />
          {(requiredPAN || error?.some((e: any) => e.path === "pan_no")) && (
            <small style={{ color: "red" }}>
              {error?.map((val, index) => (
                <span key={index}>{val.path === "pan_no" ? val.msg : ""}</span>
              ))}
            </small>
          )}
        </div>
        <div>
          <FormLabel htmlFor="regular-form-1">Trade Name</FormLabel>
          <FormInput
            id="regular-form-1"
            type="text"
            value={pickDataForEdit?.trade_name}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  trade_name: e.target.value,
                };
              })
            }
            className="uppercase"
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>
                {val.path === "trade_name" ? val.msg : ""}
              </span>
            ))}
          </small>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <FormLabel htmlFor="input-state-3" className="mb-0">
            Type of Company
          </FormLabel>
          <span className="text-red-500 ml-2">*</span>
          <FormSelect
            className="mt-2 sm:mr-2"
            name="ctype_id"
            value={pickDataForEdit?.ctype_id}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  ctype_id: e.target.value,
                };
              })
            }
            aria-label="Default select example"
          >
            <option value="">Select One</option>
            {companyType?.map((item: any, index) => (
              <option key={index} value={item.ctype_id}>
                {item.ctype_name}
              </option>
            ))}
          </FormSelect>
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path === "ctype_id" ? val.msg : ""}</span>
            ))}
          </small>
        </div>
        <div>
          <FormLabel htmlFor="regular-form-1">Legal Name</FormLabel>
          <FormInput
            id="regular-form-1"
            type="text"
            value={pickDataForEdit?.legal_name}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  legal_name: e.target.value,
                };
              })
            }
            className="uppercase"
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>
                {val.path === "legal_name" ? val.msg : ""}
              </span>
            ))}
          </small>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <FormLabel htmlFor="regular-form-1">IEC Number</FormLabel>
          <FormInput
            id="regular-form-1"
            type="text"
            value={pickDataForEdit?.iec_no}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  iec_no: e.target.value,
                };
              })
            }
            className="uppercase"
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path === "iec_no" ? val.msg : ""}</span>
            ))}
          </small>
        </div>
        <div>
          <FormLabel htmlFor="regular-form-1">EORI Number</FormLabel>
          <FormInput
            id="regular-form-1"
            type="text"
            value={pickDataForEdit?.eori_no}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  eori_no: e.target.value,
                };
              })
            }
            className="uppercase"
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path === "eori_no" ? val.msg : ""}</span>
            ))}
          </small>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <label>Parent Id</label>
          <SdAutoComplete
            endpoint={"/api/v1/master/parent-list"}
            setEntityId={setEntityId}
            entityId={entityId}
            pickDataForEdit={pickDataForEdit}
            setPickDataForEdit={setPickDataForEdit}
            // errorvalue={error?.entity_id}
            // setError={setError}
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path === "parent_id" ? val.msg : ""}</span>
            ))}
          </small>
        </div>
        <div>
          <FormLabel htmlFor="regular-form-1">TAN Number</FormLabel>
          <FormInput
            id="regular-form-1"
            type="text"
            value={pickDataForEdit?.tan_no}
            onChange={(e) =>
              setPickDataForEdit((prev: any) => {
                return {
                  ...prev,
                  tan_no: e.target.value,
                };
              })
            }
            className="uppercase"
          />
          <small style={{ color: "red" }}>
            {error?.map((val, index) => (
              <span key={index}>{val.path === "tan_no" ? val.msg : ""}</span>
            ))}
          </small>
        </div>
      </div>

      <div className="mt-2">
        <FormLabel htmlFor="regular-form-1">Director Name</FormLabel>
        <span className="text-gray-400 text-xs ml-2">(Optional)</span>
        <div className="p-2 flex border border-gray-200 rounded-lg">
          {pickDataForEdit?.directors?.map((elem: any) => (
            <>
              <div className="bg-[#777779] text-white m-2 p-[4px] flex justify-between rounded-md">
                <span className="ml-1 flex uppercase">{elem}</span>
                <X
                  style={{ width: "20px" }}
                  onClick={() =>
                    setPickDataForEdit((prev: any) => {
                      const updatedDirectors = prev?.directors.filter(
                        (item: any) => item !== elem
                      );

                      return {
                        ...prev,
                        directors: updatedDirectors,
                      };
                    })
                  }
                  className="text-mustard rounded-md p-[2px] cursor-pointer"
                />
              </div>
            </>
          ))}
          <FormInput
            id="regular-form-1"
            type="text"
            value={directorInput}
            onChange={(e) => setDirectorInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key == "Enter" || e.key == "Tab") {
                e.preventDefault();
                setPickDataForEdit((prev: any) => {
                  // const newupdate = { directorInput };
                  const updateDirector = [
                    ...(prev?.directors || []),
                    directorInput,
                  ];
                  return {
                    ...prev,
                    directors: updateDirector,
                  };
                });
                setDirectorInput("");
              }
            }}
            onBlur={() => {
              const trimmedInput = directorInput.trim();
              if (!trimmedInput) return;

              setPickDataForEdit((prev: any) => {
                const existing = prev?.directors || [];
                if (existing.includes(trimmedInput)) return prev;

                return {
                  ...prev,
                  directors: [...existing, trimmedInput],
                };
              });

              setDirectorInput("");
            }}
            style={{ border: "none", boxShadow: "none" }}
            className="uppercase border-none shadow-none hover:shadow-none"
          />
        </div>
        <small style={{ color: "red" }}>
          {error?.map((val, index) => (
            <span key={index}>{val.path === "directors" ? val.msg : ""}</span>
          ))}
        </small>
      </div>
      <div>
        <MainModal
          open={openModal}
          size="md"
          title="Upload Attachment"
          setOpen={setOpenModal}
          description={description}
          footer={null}
        />
        <MainModal
          open={openModal1}
          size="md"
          title="Upload Attachment"
          setOpen={setOpenModal1}
          description={description1}
          footer={null}
        />

        <MainModal
          open={openModal2}
          size="lg"
          title=""
          setOpen={setOpenModal2}
          description={description2}
          footer={null}
        />
      </div>
      </fieldset>

      {/* Documents section */}
      {isStep2 ? (
        /* Vendor flow — typed docs by PAN/TAN/etc. */
        pickDataForEdit?.party_id ? (
          /* Update: full DocumentUpload component handles via API independently */
          <DocumentUpload party_id={pickDataForEdit?.party_id} viewOnly={false} />
        ) : (
          /* Create: typed pending rows submitted with the form */
          !viewOnly && (
            <div className="mt-4 mb-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                Documents
                <span className="text-gray-400 text-xs font-normal">(Optional)</span>
              </h4>
              <div className="flex items-start gap-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-xs mb-3">
                <span className="mt-0.5">ℹ</span>
                <span>Select a type for each file. Documents will be saved when you submit the form. Allowed: PDF, JPG, PNG, DOC — max 5 MB each.</span>
              </div>
              {pendingTypedDocs.map((row, index) => {
                const othersDocTypeId = vendorDocTypes.find(t => t.doc_name.toLowerCase() === 'others')?.id ?? null;
                const usedIds = pendingTypedDocs
                  .filter((_, i) => i !== index)
                  .map(p => p.doc_type_id)
                  .filter(id => id !== "" && id !== othersDocTypeId) as number[];
                const available = vendorDocTypes.filter(t => !usedIds.includes(t.id));
                const isOthersSelected = othersDocTypeId !== null && row.doc_type_id === othersDocTypeId;
                return (
                  <div key={index} className={`border rounded-md p-2 mb-2 ${row.error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
                    <div className="grid grid-cols-12 gap-2 items-start">
                      <div className={`col-span-12 ${isOthersSelected ? "sm:col-span-3" : "sm:col-span-4"}`}>
                        <select
                          value={row.doc_type_id}
                          className={`w-full border rounded px-2 py-1.5 text-sm ${row.error && !row.doc_type_id ? "border-red-400" : "border-gray-300"}`}
                          onChange={(e) => {
                            const val = e.target.value ? Number(e.target.value) : "";
                            setPendingTypedDocs(prev => { const u = [...prev]; u[index] = { ...u[index], doc_type_id: val, custom_name: "", error: "" }; return u; });
                          }}
                        >
                          <option value="">Select Type</option>
                          {available.map(t => <option key={t.id} value={t.id}>{t.doc_name}</option>)}
                        </select>
                        {row.error && !row.doc_type_id && <small className="text-red-500 block mt-0.5">{row.error}</small>}
                      </div>
                      {isOthersSelected && (
                        <div className="col-span-12 sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Document name *"
                            value={row.custom_name}
                            maxLength={255}
                            className={`w-full border rounded px-2 py-1.5 text-sm ${row.error && !row.custom_name?.trim() ? "border-red-400" : "border-gray-300"}`}
                            onChange={(e) => setPendingTypedDocs(prev => { const u = [...prev]; u[index] = { ...u[index], custom_name: e.target.value, error: "" }; return u; })}
                          />
                          {row.error && !row.custom_name?.trim() && <small className="text-red-500 block mt-0.5">{row.error}</small>}
                        </div>
                      )}
                      <div className={`col-span-12 ${isOthersSelected ? "sm:col-span-4" : "sm:col-span-6"}`}>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="text-xs w-full cursor-pointer"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (!file) return;
                            const ext = (file.name.split('.').pop() || '').toLowerCase();
                            if (!['pdf','jpg','jpeg','png','doc','docx'].includes(ext)) { showAlert(`Unsupported file type`, 'warning'); e.target.value = ''; return; }
                            if (file.size > 5 * 1024 * 1024) { showAlert(`File exceeds 5 MB limit`, 'warning'); e.target.value = ''; return; }
                            const preview = ['jpg','jpeg','png'].includes(ext) ? URL.createObjectURL(file) : null;
                            setPendingTypedDocs(prev => {
                              const u = [...prev];
                              if (u[index]?.preview) URL.revokeObjectURL(u[index].preview!);
                              u[index] = { ...u[index], file, preview, error: "" };
                              return u;
                            });
                          }}
                        />
                        {row.error && row.doc_type_id && !(isOthersSelected && !row.custom_name?.trim()) && <small className="text-red-500 block mt-0.5">{row.error}</small>}
                      </div>
                      <div className="col-span-12 sm:col-span-2 flex justify-end items-center pt-1">
                        <button type="button" className="text-red-400 hover:text-red-600" onClick={() => {
                          setPendingTypedDocs(prev => {
                            if (prev[index]?.preview) URL.revokeObjectURL(prev[index].preview!);
                            return prev.filter((_, i) => i !== index);
                          });
                        }}>✕</button>
                      </div>
                    </div>
                    {row.preview && (
                      <div className="mt-2">
                        <img src={row.preview} alt="preview" className="max-h-24 rounded border border-gray-200 object-contain" />
                      </div>
                    )}
                  </div>
                );
              })}
              {(vendorDocTypes.length === 0 || vendorDocTypes.some(t => t.doc_name.toLowerCase() === 'others') || pendingTypedDocs.length < vendorDocTypes.length) && (
                <button
                  type="button"
                  onClick={() => setPendingTypedDocs(prev => [...prev, { doc_type_id: "", custom_name: "", file: null, preview: null, error: "" }])}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2 py-1 bg-blue-50 mt-1"
                >
                  + Add Document
                </button>
              )}
            </div>
          )
        )
      ) : (
        /* Non-vendor flow — generic file attach */
        <>
          {!viewOnly && (
            <div className="mt-4 mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Attach Documents</label>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                id="doc-attach-input"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  const valid = files.filter(f => {
                    const ext = (f.name.split('.').pop() || '').toLowerCase();
                    if (!['pdf','jpg','jpeg','png','doc','docx'].includes(ext)) {
                      showAlert(`${f.name}: unsupported file type`, 'warning');
                      return false;
                    }
                    if (f.size > 5 * 1024 * 1024) {
                      showAlert(`${f.name}: exceeds 5 MB limit`, 'warning');
                      return false;
                    }
                    return true;
                  });
                  setPendingFiles(prev => [...prev, ...valid]);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => (document.getElementById('doc-attach-input') as HTMLInputElement)?.click()}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                + Attach files (PDF, JPG, PNG, DOC — max 5 MB each)
              </button>
              {pendingFiles.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {pendingFiles.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="flex-1 truncate">{f.name}</span>
                      <span className="text-gray-400 text-xs">{(f.size / 1024).toFixed(0)} KB</span>
                      <button
                        type="button"
                        onClick={() => setPendingFiles(prev => prev.filter((_, j) => j !== i))}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >×</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <DocumentUpload
            party_id={pickDataForEdit?.party_id}
            viewOnly={false}
            showUpload={false}
          />
        </>
      )}

      {/* Address section — outside fieldset so it's always clickable */}
      {isStep2 && (
        <div className="mt-4 mb-4 p-4 border border-dashed border-blue-300 rounded-lg bg-blue-50">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                Business Addresses
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Add or manage your business addresses — admin will verify these during approval.
              </p>
              {gstPrefillAddress && (gstPrefillAddress.address_1 || gstPrefillAddress.pin_code) && (
                <p className="text-xs text-green-700 mt-1 font-medium">
                  GST registered address available — open "Manage Addresses" to pre-fill it.
                </p>
              )}
            </div>
            <Button
              className="text-white text-sm bg-blue-600"
              onClick={() => setAddressModalOpen(true)}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Manage Addresses
            </Button>
          </div>
        </div>
      )}

      {/* Address modal — outside fieldset so modal content is never disabled */}
      {isStep2 && (
        <TaxModal open={addressModalOpen} onClose={() => setAddressModalOpen(false)}>
          <Dialog.Panel size="lg" className="md:w-6/12 md:top-10">
            <Dialog.Title className="flex flex-row justify-between">
              <div>Manage Addresses</div>
              <div>
                <XCircle className="cursor-pointer" onClick={() => setAddressModalOpen(false)} />
              </div>
            </Dialog.Title>
            <CustomerAddress
              pickdata={pickDataForEdit}
              plusAddre={pickDataForEdit?.party_id}
              viewOnly={false}
              localAddresses={pendingAddresses}
              onLocalChange={setPendingAddresses}
              gstPrefillAddress={gstPrefillAddress}
            />
          </Dialog.Panel>
        </TaxModal>
      )}

      {/* Send For Approval / Save / Update — always at the very bottom after all sections */}
      <div className="mt-4 text-end">
        <Button
          onClick={addUpdateDataOfCustomer}
          className="bg-mustard text-white px-6 py-2"
          disabled={spinner || creditlimitDisable}
        >
          {isStep2
            ? (isPendingApproval || isPendingChanges || isChangesRejected) ? "Re-Send For Approval" : "Send For Approval"
            : editUpdateTextBtn
            ? "Save"
            : "Update"}
          {spinner && <LoadingIcon icon="puff" className="" />}
        </Button>
      </div>
    </>
  );
};

export default customer_form;
