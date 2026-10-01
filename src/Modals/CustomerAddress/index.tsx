import React, { useEffect, useState } from "react";
import { Dialog } from "../../base-components/Headless";
import { Clock, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { FormInput, FormLabel, FormSelect, FormTextarea } from "../../base-components/Form";
import TomSelect from "../../base-components/TomSelect";
import Button from "../../base-components/Button";
import Table from "../../base-components/Table";
import { masterDELETE, masterGET, masterPOST, masterPUT } from "../../AllServices/masterServices";
import { useAlert } from "../../ContextProvider/AlertContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10,15}$/;
const PIN_RE   = /^\d{4,10}$/;

const emptyForm = {
  address_label: "",
  address_1: "",
  address_2: "",
  p_email_id: "",
  p_mobile_no: "",
  p_telephone: "",
  country_id: "",
  state_id: "",
  city_id: "",
  pin_code: "",
  contact_person_name: "",
  contact_person_email: "",
  contact_person_contact: "",
};

const index = ({ pickdata, plusAddre, viewOnly = false, localAddresses, onLocalChange, gstPrefillAddress }: any) => {
  const { showAlert } = useAlert();

  const isLocalMode = !plusAddre;

  const [formdata, setFormdata] = useState({ ...emptyForm });
  const [tablePlus, setTablePlus] = useState<any[]>([]);
  const [errorhan, setError] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [idPut, setIdPut] = useState<any>(null);
  const [country, setCountry] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [countryId, setCountryId] = useState("");
  const [getCity, setGetCity] = useState<any[]>([]);

  const validateForm = () => {
    const errs: any[] = [];
    if (!formdata.address_label?.trim())
      errs.push({ path: "address_label", msg: "Address label is required" });
    if (!formdata.address_1?.trim())
      errs.push({ path: "address_1", msg: "Address 1 is required" });
    else if (formdata.address_1.length > 100)
      errs.push({ path: "address_1", msg: "Maximum 100 characters allowed" });
    if (formdata.address_2 && formdata.address_2.length > 100)
      errs.push({ path: "address_2", msg: "Maximum 100 characters allowed" });
    if (formdata.p_email_id?.trim() && !EMAIL_RE.test(formdata.p_email_id.trim()))
      errs.push({ path: "p_email_id", msg: "Enter a valid email address" });
    if (formdata.p_mobile_no?.trim() && !PHONE_RE.test(formdata.p_mobile_no.trim()))
      errs.push({ path: "p_mobile_no", msg: "Phone must be 10–15 digits" });
    if (formdata.p_telephone?.trim() && !/^\d+$/.test(formdata.p_telephone.trim()))
      errs.push({ path: "p_telephone", msg: "Telephone must be numeric" });
    if (!formdata.country_id)
      errs.push({ path: "country_id", msg: "Country is required" });
    if (!formdata.pin_code?.trim())
      errs.push({ path: "pin_code", msg: "Pincode is required" });
    else if (!PIN_RE.test(formdata.pin_code.trim()))
      errs.push({ path: "pin_code", msg: "Pincode must be 4–10 digits" });
    if (formdata.contact_person_email?.trim() && !EMAIL_RE.test(formdata.contact_person_email.trim()))
      errs.push({ path: "contact_person_email", msg: "Enter a valid email address" });
    if (formdata.contact_person_contact?.trim() && !PHONE_RE.test(formdata.contact_person_contact.trim()))
      errs.push({ path: "contact_person_contact", msg: "Phone must be 10–15 digits" });
    return errs;
  };

  const fieldError = (path: string) => {
    const e = errorhan.find((v) => v.path === path);
    return e ? <small style={{ color: "red" }}>{e.msg}</small> : null;
  };

  const resolveNames = () => ({
    country_name: country.find((c) => String(c.id) === String(formdata.country_id))?.name || "",
    state_name: stateList.find((s) => String(s.state_id) === String(formdata.state_id))?.state_name || "",
    city_name: getCity.find((c) => String(c.city_id) === String(formdata.city_id))?.city_name || "",
  });

  const fetchAddresses = async () => {
    const res = await masterGET(`/api/v1/master/customer-address/${plusAddre}`);
    setTablePlus((res as any)?.data?.data || []);
  };

  const getCountry = async () => {
    const res = await masterGET("/api/v1/master/country");
    setCountry((res as any)?.data?.data || []);
  };

  const stateAPIList = async (e: string) => {
    setStateList([]);
    setCountryId(e);
    const res = await masterGET(`/api/v1/master/state/${e}`);
    const data = (res as any)?.data?.data || [];
    if (data.length === 0) {
      setFormdata((prev) => ({ ...prev, state_id: "0" }));
    } else {
      setStateList(data);
    }
  };

  const cityAPIList = async (stateVal: string, countryVal?: string) => {
    const cid = countryVal || countryId;
    const sid = stateVal === "" ? "0" : stateVal;
    const res = await masterGET(`/api/v1/master/city/${cid}/${sid}`);
    setGetCity((res as any)?.data?.data || []);
  };

  const resetForm = () => {
    setFormdata({ ...emptyForm });
    setError([]);
    setStateList([]);
    setGetCity([]);
    setIsEditing(false);
    setIdPut(null);
  };

  const handleFormchange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
    setError((prev) => prev.filter((err) => err.path !== name));
  };

  const handleSubmit = async () => {
    const clientErrors = validateForm();
    if (clientErrors.length > 0) { setError(clientErrors); return; }

    if (isLocalMode) {
      const newAddr = { ...formdata, ...resolveNames(), _localId: Date.now() };
      onLocalChange?.([...(localAddresses || []), newAddr]);
      showAlert("Address saved — it will be submitted with your registration.");
      resetForm();
      return;
    }

    const res = await masterPOST(`/api/v1/master/customer-address/${plusAddre}`, formdata);
    if ((res as any)?.response?.status === 406) {
      setError((res as any).response.data.errors || []);
    } else if ((res as any)?.status === 200) {
      const isPending = (res as any).data?.is_pending === 1;
      showAlert(isPending ? "Address submitted for admin review." : "Address added successfully!");
      fetchAddresses();
      resetForm();
    }
  };

  const handleAddressEdit = async () => {
    const clientErrors = validateForm();
    if (clientErrors.length > 0) { setError(clientErrors); return; }

    if (isLocalMode) {
      const updated = { ...idPut, ...formdata, ...resolveNames() };
      onLocalChange?.(
        (localAddresses || []).map((a: any) => a._localId === idPut._localId ? updated : a)
      );
      showAlert("Address updated.");
      resetForm();
      return;
    }

    const res = await masterPUT(
      `/api/v1/master/internal/customer-address/${idPut.party_id}/${idPut.id}`,
      formdata
    );
    if ((res as any)?.status === 200) {
      const isPending = (res as any).data?.is_pending === 1;
      showAlert(isPending ? "Address edit submitted for admin review." : "Address updated successfully!");
      fetchAddresses();
      resetForm();
    } else if ((res as any)?.response?.status === 406) {
      setError((res as any).response.data.errors || []);
    }
  };

  const handleUpdateTable = async (updateData: any) => {
    setError([]);
    setIdPut(updateData);
    setIsEditing(true);
    setFormdata({
      address_label: String(updateData.address_label || ""),
      address_1: String(updateData.address_1 || ""),
      address_2: String(updateData.address_2 || ""),
      p_email_id: String(updateData.p_email_id || ""),
      p_mobile_no: String(updateData.p_mobile_no || ""),
      p_telephone: String(updateData.p_telephone || ""),
      country_id: String(updateData.country_id || ""),
      state_id: String(updateData.state_id || ""),
      city_id: String(updateData.city_id || ""),
      pin_code: String(updateData.pin_code || ""),
      contact_person_name: String(updateData.contact_person_name || ""),
      contact_person_email: String(updateData.contact_person_email || ""),
      contact_person_contact: String(updateData.contact_person_contact || ""),
    });
    if (updateData.country_id) await stateAPIList(String(updateData.country_id));
    if (updateData.state_id) await cityAPIList(String(updateData.state_id), String(updateData.country_id));
  };

  const handleAddressAction = async (elem: any) => {
    if (!elem.party_id || !elem.id) return;
    const res: any = await masterDELETE(`/api/v1/master/customer-address/${elem.party_id}/${elem.id}`);
    if ((res as any)?.status === 200) {
      showAlert((res as any).data?.message || "Done.");
      fetchAddresses();
    } else {
      showAlert("Action failed.", "error");
    }
  };

  useEffect(() => {
    getCountry();
    if (!isLocalMode) fetchAddresses();
  }, []);

  const tableData = isLocalMode ? (localAddresses || []) : tablePlus;

  const tabelcol = [
    "S.No.", "Status", "Phone No", "Email", "Telephone",
    "Address 1", "Address 2", "Country", "State", "City", "Pincode",
    "Contact Person Name", "Contact Person Email", "Contact Person Phone",
    ...(!viewOnly && !isLocalMode ? ["Action"] : []),
  ];

  return (
    <div>
      <Dialog.Description>
        {!viewOnly && (
          <div className="bg-[#e5e5e569] p-5 mb-5 rounded-md">
            {isLocalMode && (
              <p className="text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded px-3 py-2 mb-3">
                Addresses will be saved when you submit the registration form.
              </p>
            )}
            {!isLocalMode && pickdata?.is_approved === 2 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3">
                Since your account is approved, any address changes (add, edit, or remove) will be sent for admin review before taking effect. Items under review will show an amber badge in the list below.
              </p>
            )}

            {gstPrefillAddress && (gstPrefillAddress.address_1 || gstPrefillAddress.pin_code) && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 border border-green-200 rounded-md text-xs text-green-700">
                <span>GST registered address available.</span>
                <button
                  type="button"
                  className="underline font-semibold hover:text-green-900"
                  onClick={() =>
                    setFormdata((prev) => ({
                      ...prev,
                      address_1: String(gstPrefillAddress.address_1 || prev.address_1 || ""),
                      address_2: String(gstPrefillAddress.address_2 || prev.address_2 || ""),
                      pin_code: String(gstPrefillAddress.pin_code || prev.pin_code || ""),
                    }))
                  }
                >
                  Fill from GST
                </button>
              </div>
            )}

            <strong><p className="mb-2 underline">ADDRESS</p></strong>

            <div className="sm:flex justify-between ml-2">
              <div className="sm:w-[30%]">
                <FormLabel>Address Label</FormLabel><span className="text-red-500 ml-1">*</span>
                <FormInput type="text" name="address_label" value={formdata.address_label} onChange={handleFormchange} />
                {fieldError("address_label")}
              </div>
              <div className="sm:w-[30%]">
                <FormLabel>Address 1</FormLabel><span className="text-red-500 ml-1">*</span>
                <FormTextarea name="address_1" className="px-4 py-3 min-h-[10px] max-h-[100px] resize-y" value={formdata.address_1} onChange={handleFormchange} />
                {fieldError("address_1")}
              </div>
              <div className="sm:w-[30%]">
                <FormLabel>Address 2</FormLabel>
                <FormTextarea name="address_2" className="px-4 py-3 min-h-[10px] max-h-[100px] resize-y" value={formdata.address_2} onChange={handleFormchange} />
                {fieldError("address_2")}
              </div>
            </div>

            <div className="sm:flex justify-between ml-2 mt-2">
              <div className="sm:w-[30%]">
                <FormLabel>Email</FormLabel>
                <FormInput type="text" name="p_email_id" value={formdata.p_email_id} onChange={handleFormchange} />
                {fieldError("p_email_id")}
              </div>
              <div className="sm:w-[30%]">
                <FormLabel>Phone</FormLabel>
                <FormInput type="text" name="p_mobile_no" value={formdata.p_mobile_no} onChange={handleFormchange} />
                {fieldError("p_mobile_no")}
              </div>
              <div className="sm:w-[30%]">
                <FormLabel>Telephone</FormLabel>
                <FormInput type="text" name="p_telephone" value={formdata.p_telephone} onChange={handleFormchange} />
                {fieldError("p_telephone")}
              </div>
            </div>

            <div className="sm:flex justify-between ml-2 mt-2">
              <div className="sm:w-[23%]">
                <label>Country</label><span className="text-red-500 ml-1">*</span>
                <div className="mt-2">
                  {country.length > 0 && (
                    <TomSelect
                      name="country_id"
                      value={`${formdata.country_id}`}
                      onChange={(e: string) => {
                        stateAPIList(e);
                        setGetCity([]);
                        setFormdata((prev) => ({ ...prev, country_id: e, state_id: "", city_id: "" }));
                        setError((prev) => prev.filter((err) => err.path !== "country_id"));
                      }}
                      options={{ placeholder: "Please Select" }}
                      className="w-full"
                    >
                      <option value="">Please Select</option>
                      {country.map((elem) => (
                        <option key={elem.id} value={elem.id}>{elem.name}</option>
                      ))}
                    </TomSelect>
                  )}
                </div>
                {fieldError("country_id")}
              </div>

              <div className="sm:w-[23%]">
                <label>State</label>
                <div className="mt-2">
                  <FormSelect
                    name="state_id"
                    value={formdata.state_id}
                    disabled={stateList.length === 0}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const val = e.target.value;
                      cityAPIList(val);
                      setFormdata((prev) => ({ ...prev, state_id: val, city_id: "" }));
                      setError((prev) => prev.filter((err) => err.path !== "state_id"));
                    }}
                  >
                    <option value="">Please Select</option>
                    {stateList.map((elem) => (
                      <option key={elem.state_id} value={elem.state_id}>{elem.state_name}</option>
                    ))}
                  </FormSelect>
                </div>
                {fieldError("state_id")}
              </div>

              <div className="sm:w-[23%]">
                <label>City</label>
                <div className="mt-2">
                  <FormSelect
                    name="city_id"
                    value={formdata.city_id}
                    disabled={getCity.length === 0}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFormdata((prev) => ({ ...prev, city_id: e.target.value }));
                      setError((prev) => prev.filter((err) => err.path !== "city_id"));
                    }}
                  >
                    <option value="">Please Select</option>
                    {getCity.map((elem) => (
                      <option key={elem.city_id} value={elem.city_id}>{elem.city_name}</option>
                    ))}
                  </FormSelect>
                </div>
                {fieldError("city_id")}
              </div>

              <div className="sm:w-[23%]">
                <FormLabel>Pincode</FormLabel><span className="text-red-500 ml-1">*</span>
                <FormInput type="text" name="pin_code" value={formdata.pin_code} onChange={handleFormchange} />
                {fieldError("pin_code")}
              </div>
            </div>

            <div className="mt-4">
              <strong><p className="mb-2 underline">CONTACT PERSON</p></strong>
              <div className="sm:flex justify-between ml-2">
                <div className="sm:w-[30%]">
                  <FormLabel>Name</FormLabel>
                  <FormInput type="text" name="contact_person_name" value={formdata.contact_person_name} onChange={handleFormchange} />
                  {fieldError("contact_person_name")}
                </div>
                <div className="sm:w-[30%]">
                  <FormLabel>Email</FormLabel>
                  <FormInput type="text" name="contact_person_email" value={formdata.contact_person_email} onChange={handleFormchange} />
                  {fieldError("contact_person_email")}
                </div>
                <div className="sm:w-[30%]">
                  <FormLabel>Phone</FormLabel>
                  <FormInput type="text" name="contact_person_contact" value={formdata.contact_person_contact} onChange={handleFormchange} />
                  {fieldError("contact_person_contact")}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              {isEditing && (
                <Button variant="outline-secondary" onClick={resetForm}>Cancel</Button>
              )}
              <Button
                onClick={isEditing ? handleAddressEdit : handleSubmit}
                className="w-20 rounded-md font-medium cursor-pointer bg-primary border-primary text-white"
              >
                {isEditing ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table className="border text-center">
            <Table.Thead className="bg-mustard text-white">
              <Table.Tr>
                {tabelcol.map((col) => (
                  <Table.Th key={col} className="px-2 border whitespace-nowrap">{col}</Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tableData.map((elem: any, i: number) => {
                const isPendingAdd = !isLocalMode && elem.is_pending === 1;
                const isPendingRemove = !isLocalMode && elem.is_pending === 2;
                const isPendingEdit = isPendingAdd && elem.pending_for_id;
                const rowBg = isPendingAdd ? "bg-amber-50" : isPendingRemove ? "bg-red-50" : "";
                return (
                  <Table.Tr key={elem._localId ?? elem.id ?? i} className={`border ${rowBg}`}>
                    <Table.Td className="border">{i + 1}.</Table.Td>
                    <Table.Td className="border whitespace-nowrap">
                      {isPendingEdit ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                          <Clock size={11} /> Edit Under Review
                        </span>
                      ) : isPendingAdd ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                          <Clock size={11} /> Under Review
                        </span>
                      ) : isPendingRemove ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 border border-red-300 px-1.5 py-0.5 rounded">
                          <Trash2 size={11} /> Pending Removal
                        </span>
                      ) : (
                        <span className="text-xs text-green-600 font-semibold">Active</span>
                      )}
                    </Table.Td>
                    <Table.Td className="border">{elem.p_mobile_no || "—"}</Table.Td>
                    <Table.Td className="border">{elem.p_email_id || "—"}</Table.Td>
                    <Table.Td className="border">{elem.p_telephone || "—"}</Table.Td>
                    <Table.Td className="border">{elem.address_1 || "—"}</Table.Td>
                    <Table.Td className="border">{elem.address_2 || "—"}</Table.Td>
                    <Table.Td className="border">{elem.country_name || "—"}</Table.Td>
                    <Table.Td className="border">{elem.state_name || "—"}</Table.Td>
                    <Table.Td className="border">{elem.city_name || "—"}</Table.Td>
                    <Table.Td className="border">{elem.pin_code || "—"}</Table.Td>
                    <Table.Td className="border">{elem.contact_person_name || "—"}</Table.Td>
                    <Table.Td className="border">{elem.contact_person_email || "—"}</Table.Td>
                    <Table.Td className="border">{elem.contact_person_contact || "—"}</Table.Td>
                    {!viewOnly && !isLocalMode && (
                      <Table.Td className="border">
                        {isPendingAdd ? (
                          <button
                            type="button"
                            title="Cancel — remove this pending change"
                            className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 mx-auto"
                            onClick={() => handleAddressAction(elem)}
                          >
                            <RotateCcw size={13} /> Cancel
                          </button>
                        ) : isPendingRemove ? (
                          <button
                            type="button"
                            title="Cancel removal — restore this address"
                            className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900 mx-auto"
                            onClick={() => handleAddressAction(elem)}
                          >
                            <RotateCcw size={13} /> Cancel
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 justify-center">
                            <Pencil
                              className="cursor-pointer text-gray-600 hover:text-primary"
                              size={15}
                              onClick={() => handleUpdateTable(elem)}
                            />
                            <Trash2
                              className="cursor-pointer text-red-400 hover:text-red-600"
                              size={15}
                              onClick={() => handleAddressAction(elem)}
                            />
                          </div>
                        )}
                      </Table.Td>
                    )}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
          {tableData.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              {viewOnly ? "No addresses found." : "No addresses added yet."}
            </p>
          )}
        </div>
      </Dialog.Description>
    </div>
  );
};

export default index;
