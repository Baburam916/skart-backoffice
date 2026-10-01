import React, { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../commoncomponents/CommonModal/CommonModal";
import { commonpostrequest, universalpost } from "../../../../AllServices/services";
import { commongetrequest } from "../../../../AllServices/services";
import CommonSearchableAll from "../../commoncomponents/CommonSearchableall/CommonSearchableall";
import { useAlert } from "../../../../ContextProvider/AlertContext";
import { useLogin } from "../../commoncomponents/LoginContextProvider/LoginContextProvider";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const UPLOAD_API =
  "https://n8n.srv965283.hstgr.cloud/webhook/6e171586-10c6-4b2d-a27b-741fb7f90ef8";

// ── Default sell charges ─────────────────────────────────────────────────────
const makeDefaultSellCharges = (franchisee: any) => [
  {
    charge_id: "",
    weight: 0,
    rate: 0,
    per_kg: 2,
    inr_amount: 0,
    currency: franchisee?.currency ?? 24,
    enquiry_id: "",
    sac_code: "",
    ex_rate: franchisee?.exchange_rate ?? "1.00",
    remarks: "",
  },
];

// ── Deep immutable set ────────────────────────────────────────────────────────
const deepSet = (obj: any, path: (string | number)[], value: any): any => {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (typeof head === "number") {
    const arr = Array.isArray(obj) ? [...obj] : [];
    arr[head] = deepSet(arr[head], rest, value);
    return arr;
  }
  return {
    ...obj,
    [head as string]: deepSet(obj?.[head as string], rest, value),
  };
};

// ── Value type detection ──────────────────────────────────────────────────────
type ValueType =
  | "primitive"
  | "object"
  | "array-of-objects"
  | "array-of-primitives";

const getValueType = (value: any): ValueType => {
  if (value === null || typeof value !== "object") return "primitive";
  if (Array.isArray(value)) {
    if (value.length === 0) return "array-of-primitives";
    if (typeof value[0] === "object" && value[0] !== null)
      return "array-of-objects";
    return "array-of-primitives";
  }
  return "object";
};

const getArrayKeys = (arr: Record<string, any>[]): string[] => {
  const keys = new Set<string>();
  arr.forEach((item) => Object.keys(item).forEach((k) => keys.add(k)));
  return Array.from(keys);
};

const LABEL_OVERRIDES: Record<string, string> = {
  quantity: "No. of Pieces",
};

const formatLabel = (key: string) =>
  LABEL_OVERRIDES[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const DIMENSION_NON_NEG_FIELDS = new Set(["weight", "value", "quantity", "length", "breadth", "height", "hsn_code"]);

const blockNegativeSymbols = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (["-", "+", "e", "E"].includes(e.key)) e.preventDefault();
};

const inputCls =
  "w-full border border-slate-200 rounded-md px-2 py-1.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white";

// ── Chevron ───────────────────────────────────────────────────────────────────
const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// ── Sub-editors ───────────────────────────────────────────────────────────────
interface EditorProps {
  path: (string | number)[];
  value: any;
  onChange: (path: (string | number)[], value: any) => void;
  nonNegativeFields?: Set<string>;
}

const PrimitiveInput: React.FC<{
  value: any;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => (
  <input
    type="text"
    value={value === null || value === undefined ? "" : String(value)}
    onChange={(e) => onChange(e.target.value)}
    className={inputCls}
  />
);

// Collapsible object editor — stacked on mobile, side-by-side on sm+
const ObjectEditor: React.FC<EditorProps> = ({ path, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const entries = Object.entries(value as Record<string, any>);

  return (
    <div className="w-full border border-slate-200 rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-600"
      >
        <span>
          {open
            ? "Hide fields"
            : `Show ${entries.length} field${entries.length !== 1 ? "s" : ""}`}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <div className="divide-y divide-slate-100">
          {entries.map(([k, v], idx) => (
            <div
              key={k}
              className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 px-3 py-2 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                }`}
            >
              <span className="text-xs font-semibold text-slate-500 sm:w-[200px] sm:min-w-[200px] sm:pt-1.5 whitespace-nowrap">
                {formatLabel(k)} :
              </span>
              <div className="flex-1 min-w-0">
                {k.endsWith("_country") ? (
                  <CountryDropdown
                    value={v}
                    onChange={(val) => onChange([...path, k], val)}
                  />
                ) : k.endsWith("_date") ? (
                  <input
                    type="date"
                    value={v === null || v === undefined ? "" : String(v)}
                    onChange={(e) => onChange([...path, k], e.target.value)}
                    className={inputCls}
                  />
                ) : (
                  <FieldEditor
                    path={[...path, k]}
                    value={v}
                    onChange={onChange}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Collapsible array-of-objects — accordion with horizontally scrollable table
const ArrayOfObjectsEditor: React.FC<EditorProps> = ({
  path,
  value,
  onChange,
  nonNegativeFields,
}) => {
  const [open, setOpen] = useState(false);
  const arr = value as Record<string, any>[];
  const keys = getArrayKeys(arr);

  const addRow = () => {
    const newRow = Object.fromEntries(keys.map((k) => [k, ""]));
    onChange(path, [...arr, newRow]);
  };

  const removeRow = (idx: number) => {
    onChange(
      path,
      arr.filter((_, i) => i !== idx),
    );
  };

  return (
    <div className="w-full border border-slate-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-600"
      >
        <span>
          {arr.length} item{arr.length !== 1 ? "s" : ""}
        </span>
        <Chevron open={open} />
      </button>
      {open && (
        <>
          <div className="w-full overflow-x-auto">
            <table className="text-xs w-max min-w-full">
              <thead>
                <tr className="bg-slate-100">
                  <th className="px-2 py-2 text-center font-semibold text-slate-500 border-b border-slate-200 w-8">
                    #
                  </th>
                  {keys.map((k) => (
                    <th
                      key={k}
                      className="px-2 py-2 text-left font-semibold text-slate-600 border-b border-slate-200 whitespace-nowrap"
                    >
                      {formatLabel(k)}
                    </th>
                  ))}
                  <th className="px-2 py-2 border-b border-slate-200 w-8" />
                </tr>
              </thead>
              <tbody>
                {arr.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-2 py-1.5 border-b border-slate-100 text-center text-slate-400 font-medium">
                      {rowIdx + 1}
                    </td>
                    {keys.map((k) => (
                      <td
                        key={k}
                        className="px-2 py-1 border-b border-slate-100"
                      >
                        <input
                          type={nonNegativeFields?.has(k.toLowerCase()) ? "number" : "text"}
                          min={nonNegativeFields?.has(k.toLowerCase()) ? "0" : undefined}
                          value={
                            row[k] === null || row[k] === undefined
                              ? ""
                              : String(row[k])
                          }
                          onKeyDown={nonNegativeFields?.has(k.toLowerCase()) ? blockNegativeSymbols : undefined}
                          onChange={(e) => {
                            const raw = e.target.value;
                            const val = nonNegativeFields?.has(k.toLowerCase()) && parseFloat(raw) < 0 ? "0" : raw;
                            onChange([...path, rowIdx, k], val);
                          }}
                          className="w-full min-w-[80px] border border-slate-200 rounded px-1.5 py-1 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400 bg-white"
                        />
                      </td>
                    ))}
                    <td className="px-2 py-1 border-b border-slate-100 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(rowIdx)}
                        title="Remove row"
                        className="text-red-400 hover:text-red-600 font-bold text-lg leading-none"
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
                {arr.length === 0 && (
                  <tr>
                    <td
                      colSpan={keys.length + 2}
                      className="text-center text-slate-400 py-4 text-xs"
                    >
                      No rows yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={addRow}
            className="w-full text-xs text-slate-500 hover:text-yellow-600 hover:bg-yellow-50 py-2 transition-colors flex items-center justify-center gap-1 border-t border-slate-200"
          >
            <span className="text-sm font-bold">+</span> Add Row
          </button>
        </>
      )}
    </div>
  );
};

// Array of primitives — scrollable list
const ArrayOfPrimitivesEditor: React.FC<EditorProps> = ({
  path,
  value,
  onChange,
}) => {
  const arr = value as any[];
  return (
    <div className="w-full flex flex-col gap-1.5">
      {arr.map((item, idx) => (
        <div key={idx} className="flex gap-1.5 items-center">
          <input
            type="text"
            value={item === null || item === undefined ? "" : String(item)}
            onChange={(e) => onChange([...path, idx], e.target.value)}
            className="flex-1 min-w-0 border border-slate-200 rounded-md px-2 py-1.5 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          />
          <button
            type="button"
            onClick={() =>
              onChange(
                path,
                arr.filter((_, i) => i !== idx),
              )
            }
            title="Remove"
            className="text-red-400 hover:text-red-600 font-bold text-lg leading-none px-1 shrink-0"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange(path, [...arr, ""])}
        className="text-xs text-slate-400 hover:text-yellow-600 text-left flex items-center gap-1 mt-0.5"
      >
        <span className="text-sm font-bold">+</span> Add item
      </button>
    </div>
  );
};

// ── Selling Charges Editor ────────────────────────────────────────────────────
let _chargesCache: any[] | null = null;
let _chargesFetchPromise: Promise<void> | null = null;
let _currencyCache: any[] | null = null;
let _currencyFetchPromise: Promise<void> | null = null;

const SellChargesEditor: React.FC<EditorProps> = ({
  path,
  value,
  onChange,
}) => {
  const arr = (value as any[]) || [];
  const currency = arr[0]?.currency ?? "";
  const ex_rate = arr[0]?.ex_rate ?? "1.00";
  const [chargeOptions, setChargeOptions] = useState<any>(_chargesCache ?? []);
  const [currencyList, setCurrencyList] = useState<any[]>(_currencyCache ?? []);
  const [remarksModal, setRemarksModal] = useState<{ rowIdx: number; value: string } | null>(null);

  useEffect(() => {
    if (!_chargesFetchPromise) {
      _chargesFetchPromise = commongetrequest("admin/charges?type=E&is_cargo=1")
        .then((charges: any) => {
          _chargesCache = charges?.data?.data || [];
        })
        .catch(() => {});
    }
    if (!_chargesCache) {
      _chargesFetchPromise.then(() => {
        if (_chargesCache) setChargeOptions(_chargesCache);
      });
    }

    if (!_currencyFetchPromise) {
      _currencyFetchPromise = commongetrequest("booking/currency")
        .then((res: any) => {
          if (res?.status === 200) _currencyCache = res?.data?.data || [];
        })
        .catch(() => {});
    }
    if (!_currencyCache) {
      _currencyFetchPromise.then(() => {
        if (_currencyCache) setCurrencyList(_currencyCache);
      });
    }
  }, []);

  const currencyLabel = currencyList.find((c) => c.id == currency || c.id == Number(currency))?.currency ?? String(currency);
  const updateCell = (rowIdx: number, key: string, val: any) =>
    onChange([...path, rowIdx, key], val);

  const updateRow = (rowIdx: number, patch: Record<string, any>) =>
    onChange(path, arr.map((r, i) => i === rowIdx ? { ...r, ...patch } : r));

  const addRow = () =>
    onChange(path, [
      ...arr,
      {
        charge_id: "",
        weight: 0,
        rate: "0",
        per_kg: 2,
        inr_amount: "0",
        currency: arr[0]?.currency ?? 24,
        enquiry_id: arr[0]?.enquiry_id ?? "",
        sac_code: "",
        ex_rate: arr[0]?.ex_rate ?? "1.00",
        remarks: "",
        isNew: true,
      },
    ]);

  const defaultRow = () => ({
    charge_id: "",
    weight: 0,
    rate: "0",
    per_kg: 2,
    inr_amount: "0",
    currency: arr[0]?.currency ?? 24,
    enquiry_id: arr[0]?.enquiry_id ?? "",
    sac_code: "",
    ex_rate: arr[0]?.ex_rate ?? "1.00",
    remarks: "",
    isNew: true,
  });

  const removeRow = (idx: number) => {
    const next = arr.filter((_, i) => i !== idx);
    onChange(path, next.length > 0 ? next : [defaultRow()]);
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden w-full">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200">
        <span className="text-md font-bold text-slate-600 py-1.5 rounded self-start">
          Selling Charges
        </span>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start sm:items-end">
            <label className="text-[12px] text-slate-500 mb-0.5">
              Currency
            </label>
            <input
              type="text"
              value={currencyLabel}
              disabled
              className="w-20 border border-slate-200 rounded px-2 py-1 text-xs text-slate-500 bg-slate-50 cursor-not-allowed"
            />
          </div>
          <div className="flex flex-col items-start sm:items-end">
            <label className="text-[12px] text-slate-500 mb-0.5">
              Exchange Rate
            </label>
            <input
              type="text"
              value={String(ex_rate)}
              disabled
              className="w-24 border border-slate-200 rounded px-2 py-1 text-xs text-slate-500 bg-slate-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="text-xs w-max min-w-full">
          <thead>
            <tr className="bg-mustard text-white">
              <th className="px-2 py-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={addRow}
                    className="bg-green-500 hover:bg-green-600 rounded w-5 h-5 flex items-center justify-center font-bold text-sm leading-none"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => arr.length > 1 && removeRow(arr.length - 1)}
                    disabled={arr.length <= 1}
                    className="bg-red-500 hover:bg-red-600 rounded w-5 h-5 flex items-center justify-center font-bold text-sm leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                </div>
              </th>
              {[
                "CHARGES",
                "RATE",
                "RATE TYPE",
                "WEIGHT/UNIT",
                "INR AMOUNT",
                "REMARKS",
                "ACTION",
              ]?.map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left font-semibold whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {arr.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}
              >
                <td className="px-2 py-1.5 border-b border-slate-100 text-center text-slate-400 font-medium">
                  {rowIdx + 1}
                </td>
                <td className="px-2 py-1 border-b border-slate-100">
                  <select
                    value={row.charge_id ?? ""}
                    onChange={(e) =>
                      updateCell(rowIdx, "charge_id", e.target.value)
                    }
                    className="w-full min-w-[150px] border border-slate-200 rounded px-1.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-yellow-400 bg-white"
                  >
                    <option value="">Select charge</option>
                    {chargeOptions?.map((c) => (
                      <option key={c.ref_sell_id} value={c.ref_sell_id}>
                        {c.charge_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1 border-b border-slate-100">
                  <input
                    type="number"
                    min="0"
                    value={row.rate ?? ""}
                    onKeyDown={blockNegativeSymbols}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const rate = parseFloat(raw) < 0 ? "0" : raw;
                      const w = Number(row.per_kg) === 1 ? 1 : Number(row.weight) || 0;
                      updateRow(rowIdx, { rate, inr_amount: (parseFloat(rate) || 0) * w });
                    }}
                    onBlur={(e) => {
                      const v = Math.max(0, parseFloat(e.target.value) || 0);
                      const w = Number(row.per_kg) === 1 ? 1 : Number(row.weight) || 0;
                      updateRow(rowIdx, { rate: v.toFixed(3), inr_amount: (v * w).toFixed(3) });
                    }}
                    className="w-[70px] border border-slate-200 rounded px-1.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-yellow-400 bg-white"
                  />
                </td>
                <td className="px-2 py-1 border-b border-slate-100">
                  <select
                    value={row.per_kg ?? 2}
                    onChange={(e) => {
                      const per_kg = Number(e.target.value);
                      if (per_kg === 1) {
                        updateRow(rowIdx, { per_kg, weight: 1, inr_amount: (parseFloat(row.rate) || 0) * 1 });
                      } else {
                        updateRow(rowIdx, { per_kg });
                      }
                    }}
                    className="w-full min-w-[90px] border border-slate-200 rounded px-1.5 py-1 text-slate-800 focus:outline-none focus:ring-1 focus:ring-yellow-400 bg-white"
                  >
                    <option value={1}>Absolute</option>
                    <option value={2}>Per Kg</option>
                  </select>
                </td>
                <td className="px-2 py-1 border-b border-slate-100">
                  <input
                    type="number"
                    min="0"
                    value={row.weight ?? ""}
                    disabled={Number(row.per_kg) === 1}
                    onKeyDown={blockNegativeSymbols}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const weight = parseFloat(raw) < 0 ? "0" : raw;
                      updateRow(rowIdx, { weight, inr_amount: (parseFloat(row.rate) || 0) * (parseFloat(weight) || 0) });
                    }}
                    onBlur={(e) => {
                      const v = Math.max(0, parseFloat(e.target.value) || 0);
                      updateRow(rowIdx, { weight: v.toFixed(3), inr_amount: ((parseFloat(row.rate) || 0) * v).toFixed(3) });
                    }}
                    className={`w-[70px] border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-400 ${Number(row.per_kg) === 1 ? "bg-slate-50 text-slate-400 cursor-not-allowed" : "bg-white text-slate-800"}`}
                  />
                </td>
                <td className="px-2 py-1 border-b border-slate-100">
                  <input
                    type="number"
                    value={row.inr_amount ?? ""}
                    disabled
                    className="w-[70px] border border-slate-200 rounded px-1.5 py-1 text-slate-400 bg-slate-50 cursor-not-allowed"
                  />
                </td>
                <td className="px-2 py-1 border-b border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => setRemarksModal({ rowIdx, value: String(row.remarks ?? "") })}
                    className={`text-xs font-semibold px-3 py-1.5 rounded whitespace-nowrap w-full ${row.remarks ? "bg-green-600 text-white" : "bg-mustard text-white"}`}
                  >
                    {row.remarks ? "Added" : "Add +"}
                  </button>
                </td>
                <td className="px-3 py-1 border-b border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(rowIdx)}
                    title={arr.length <= 1 ? "At least one row required" : "Remove"}
                    disabled={arr.length <= 1}
                    className="flex items-center justify-center w-7 h-7 mx-auto rounded bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-50 disabled:hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 011-1h4a1 1 0 011 1m-7 0h8" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {arr.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-slate-400 py-4">
                  No charges. Click + to add.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Remarks mini-modal */}
      {remarksModal !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-5 flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-700">Add/Update Remarks</h3>
            <textarea
              autoFocus
              rows={3}
              value={remarksModal.value}
              onChange={(e) => setRemarksModal({ ...remarksModal, value: e.target.value })}
              placeholder="Remarks"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  updateCell(remarksModal.rowIdx, "remarks", "");
                  setRemarksModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-500 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateCell(remarksModal.rowIdx, "remarks", remarksModal.value);
                  setRemarksModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-mustard hover:opacity-90 text-white text-sm font-semibold transition-colors"
              >
                Add +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Country searchable dropdown ───────────────────────────────────────────────
let _countryCache: { country_id: number; country_name: string }[] | null = null;
let _countryFetchPromise: Promise<void> | null = null;

const CountryDropdown: React.FC<{
  value: any;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const [countries, setCountries] = useState<{ country_id: number; country_name: string }[]>(
    _countryCache ?? []
  );
  const [search, setSearch] = useState(value === null || value === undefined ? "" : String(value));
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (_countryCache) {
      setCountries(_countryCache);
      return;
    }
    if (!_countryFetchPromise) {
      _countryFetchPromise = commongetrequest("admin/country")
        .then((res: any) => {
          if (res?.data?.data) _countryCache = res.data.data;
        })
        .catch(() => {});
    }
    _countryFetchPromise.then(() => {
      if (_countryCache) setCountries(_countryCache);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        // reset search to current value if nothing selected
        setSearch(value === null || value === undefined ? "" : String(value));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filtered = countries.filter((c) =>
    c.country_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (name: string) => {
    setSearch(name);
    onChange(name);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search country..."
        className={inputCls}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-md shadow-lg text-sm">
          {filtered.map((c) => (
            <li
              key={c.country_id}
              onMouseDown={() => handleSelect(c.country_name)}
              className="px-3 py-1.5 cursor-pointer hover:bg-yellow-50 hover:text-yellow-700 text-slate-800"
            >
              {c.country_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Dispatcher
const FieldEditor: React.FC<EditorProps> = ({ path, value, onChange, nonNegativeFields }) => {
  const type = getValueType(value);
  if (type === "primitive")
    return <PrimitiveInput value={value} onChange={(v) => onChange(path, v)} />;
  if (type === "object")
    return <ObjectEditor path={path} value={value} onChange={onChange} />;
  if (type === "array-of-objects")
    return (
      <ArrayOfObjectsEditor path={path} value={value} onChange={onChange} nonNegativeFields={nonNegativeFields} />
    );
  return (
    <ArrayOfPrimitivesEditor path={path} value={value} onChange={onChange} />
  );
};

// ── Chargeable weight ─────────────────────────────────────────────────────────
const getChargeableWeight = (value?: any[]): number => {
  if (!Array.isArray(value) || value.length === 0) return 0;
  const total = value.reduce((acc: number, item: any) => {
    return (
      acc +
      Math.max(
        Number(item?.weight) || 0,
        (Number(item?.height) *
          Number(item?.breadth) *
          Number(item?.length) *
          Number(item?.quantity)) /
        5000,
      )
    );
  }, 0);
  return Number((total || 0).toFixed(3));
};

// ── Clipboard helper (works on HTTP/HTTPS) ────────────────────────────────────
const copyToClipboard = (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "-9999px";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(ta);
      resolve();
    } catch (e) {
      document.body.removeChild(ta);
      reject(e);
    }
  });
};

// ── Main modal ────────────────────────────────────────────────────────────────
type Step = "upload" | "review";

interface DocumentUploadModalProps {
  open: boolean;
  onClose: () => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  open,
  onClose,
}) => {
  const { showAlert } = useAlert();
  const { userdata } = useLogin();
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [enquiryData, setEnquiryData] = useState<{ enquiry_no: string; email: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedFranchisee, setSelectedFranchisee] = useState<any>({ franchisee_id: "", franchisee_name: "" });
  const [franchiseeInactive, setFranchiseeInactive] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const resetAll = () => {
    setStep("upload");
    setFile(null);
    setUploading(false);
    setEditedData({});
    setSubmitting(false);
    setSubmitSuccess(false);
    setEnquiryData(null);
    setFieldErrors({});
    setCopied(false);
    setSelectedFranchisee({ franchisee_id: "", franchisee_name: "" });
    setFranchiseeInactive(false);
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (!selected) return;
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(selected.type)) {
      showAlert("Only image files (JPG, PNG, GIF, WEBP) or PDF are allowed.", "warning");
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      showAlert(`File size must not exceed ${MAX_FILE_SIZE_MB} MB.`, "warning");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!selectedFranchisee?.franchisee_id) {
      setFieldErrors({ franchisee_name: "Franchisee Name is required." });
      showAlert("Please select a Franchisee.", "warning");
      return;
    }
    if (!file) {
      showAlert("Please select a file first.", "warning");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("document", file);
      const res = await fetch(UPLOAD_API, { method: "POST", body: formData });
      if (!res.ok)
        throw new Error(`Server responded with status ${res.status}`);
      const { pickup_required: _pr, ...json } = await res.json();
      const normalizeNum = (val: any): any => {
        if (typeof val === "string" && /^-?\d+\.\d+$/.test(val)) {
          const parsed = parseFloat(val);
          return isNaN(parsed) ? val : String(parsed);
        }
        return val;
      };

      // Enhance shipper_details with domestic pincode lookup if city/state missing
      let shipperDetails = json?.shipper_details ? { ...json.shipper_details } : json?.shipper_details;
      if (shipperDetails) {
        const rawPincode = shipperDetails?.consigner_pincode;
        if (!rawPincode) {
          shipperDetails.consigner_pincode = "0000";
        } else if (String(rawPincode).trim() !== "0000") {
          const cityMissing = !shipperDetails?.consigner_city;
          const stateMissing = !shipperDetails?.consigner_state;
          if (cityMissing || stateMissing) {
            try {
              const pRes = await fetch(
                `https://devapiv2.skart-express.com/api/v1/admin/domestic-pincode/${encodeURIComponent(rawPincode)}`
              );
              if (pRes?.ok) {
                const pData = await pRes.json();
                const row = pData?.data?.data?.[0] ?? pData?.data?.[0] ?? null;
                if (row) {
                  if (cityMissing) shipperDetails.consigner_city = row?.city ?? row?.district ?? "";
                  if (stateMissing) shipperDetails.consigner_state = row?.state ?? "";
                }
              }
            } catch {}
          }
        }
      }

      // Enhance consignee_details with international pincode lookup if city/state missing
      let consigneeDetails = json?.consignee_details ? { ...json.consignee_details } : json?.consignee_details;
      if (consigneeDetails) {
        const rawPincode = consigneeDetails?.consignee_pincode;
        if (!rawPincode) {
          consigneeDetails.consignee_pincode = "0000";
        } else if (String(rawPincode).trim() !== "0000") {
          const cityMissing = !consigneeDetails?.consignee_city;
          const stateMissing = !consigneeDetails?.consignee_state;
          if (cityMissing || stateMissing) {
            const countryCode = consigneeDetails?.consignee_country_code ?? "";
            if (countryCode) {
              try {
                const pRes = await fetch(
                  `https://devapiv2.skart-express.com/api/v1/admin/international-pincode?country_code=${encodeURIComponent(countryCode)}&zipcode=${encodeURIComponent(rawPincode)}`
                );
                if (pRes?.ok) {
                  const pData = await pRes.json();
                  const row = pData?.data?.data?.[0] ?? pData?.data?.[0] ?? null;
                  if (row) {
                    if (cityMissing) consigneeDetails.consignee_city = row?.city ?? "";
                    if (stateMissing) consigneeDetails.consignee_state = row?.state ?? "";
                  }
                }
              } catch {}
            }
          }
        }
      }

      setEditedData({
        ...json,
        ...(Array.isArray(json.shipment_dimensions)
          ? {
            shipment_dimensions: json.shipment_dimensions.map((row: any) => {
              const normalized = Object.fromEntries(
                Object.entries(row).map(([k, v]) => [k, normalizeNum(v)])
              );
              return Object.prototype.hasOwnProperty.call(normalized, "box_no") ? normalized : { box_no: "", ...normalized };
            }),
          }
          : {}),
        ...(shipperDetails != null ? { shipper_details: shipperDetails } : {}),
        ...(consigneeDetails != null ? { consignee_details: consigneeDetails } : {}),
        franchisee_id: selectedFranchisee.franchisee_id,
        sell_charges: makeDefaultSellCharges(selectedFranchisee),
        chargeable_weight: getChargeableWeight(json.shipment_dimensions),
      });
      setStep("review");
    } catch (err: any) {
      showAlert(err?.message || "Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Recalculate chargeable_weight whenever shipment_dimensions changes
  useEffect(() => {
    if (!editedData.shipment_dimensions) return;
    const cw = getChargeableWeight(editedData.shipment_dimensions);
    setEditedData((prev) => ({ ...prev, chargeable_weight: cw }));
  }, [editedData.shipment_dimensions]);

  const handleChange = (path: (string | number)[], value: any) => {
    let finalValue = value;
    if (path[0] === "shipment_dimensions" && path.length === 3) {
      const fieldName = String(path[2]).toLowerCase();
      if (DIMENSION_NON_NEG_FIELDS.has(fieldName) && parseFloat(String(value)) < 0) {
        finalValue = "0";
      }
    }
    setEditedData((prev) => deepSet(prev, path, finalValue));
    const topKey = String(path[0]);
    if (fieldErrors[topKey]) {
      setFieldErrors((prev) => { const n = { ...prev }; delete n[topKey]; return n; });
    }
  };

  const OPTIONAL_FIELDS = new Set(["consignee_details", "shipper_details", "chargeable_weight", "sell_charges", "franchisee_id"]);

  const handleSubmit = async () => {
    // Validate required fields — collect all errors at once
    const errors: Record<string, string> = {};
    for (const [key, val] of Object.entries(editedData)) {
      if (OPTIONAL_FIELDS.has(key)) continue;
      const isEmpty =
        val === null ||
        val === undefined ||
        val === "" ||
        (Array.isArray(val) && val.length === 0);
      if (isEmpty) errors[key] = `${formatLabel(key)} is required.`;
    }

    // Validate mandatory nested fields in consignee_details
    const consigneeRequiredFields = ["consignee_pincode", "consignee_city", "consignee_state", "consignee_country"];
    const consigneeDetails = editedData.consignee_details || {};
    const missingConsignee = consigneeRequiredFields.filter((f) => {
      const v = consigneeDetails[f];
      return v === null || v === undefined || v === "";
    });
    if (missingConsignee.length > 0) {
      errors["consignee_details"] = `Required in Consignee Details: ${missingConsignee.map(formatLabel).join(", ")}`;
    }

    // Validate mandatory nested fields in shipper_details
    const consignerRequiredFields = ["consigner_pincode", "consigner_city", "consigner_state"];
    const shipperDetails = editedData.shipper_details || {};
    const missingShipper = consignerRequiredFields.filter((f) => {
      const v = shipperDetails[f];
      return v === null || v === undefined || v === "";
    });
    if (missingShipper.length > 0) {
      errors["shipper_details"] = `Required in Shipper Details: ${missingShipper.map(formatLabel).join(", ")}`;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showAlert(Object.values(errors)[0], "warning");
      return;
    }
    setFieldErrors({});
    setSubmitting(true);
    try {
      // const res = await universalpost("8019", "booking/create-import-enquiry-by-doc", editedData);
      const { pickup_required: _prSubmit, ...payload } = editedData;
      const res = await commonpostrequest("booking/create-import-enquiry-by-doc", {
        ...payload,
        import_booking: payload.import_booking ?? 2,
      });
      if (res?.status === 406) {
        const errorFields: string[] = res?.response?.data?.errors ?? [];
        const msg = errorFields.length
          ? `Missing required fields: ${errorFields.join(", ")}`
          : "Not acceptable. Please check the submitted data.";
        showAlert(msg, "warning");
        return;
      }
      if (res?.status !== 200 && res?.status !== 201)
        throw new Error(res?.data?.message || `Request failed with status ${res?.status}`);
      setEnquiryData(res?.data?.data ?? null);
      setSubmitSuccess(true);
      showAlert("Submitted successfully!", "success");
    } catch (err: any) {
      showAlert(err?.message || "Submission failed. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const modalTitle = (
    <div className="flex items-center justify-between w-full">
      <span>
        {step === "upload" ? "Upload Document" : "Review & Edit Data"}
      </span>
      <button
        type="button"
        onClick={handleClose}
        className="text-slate-400 hover:text-slate-600 text-2xl leading-none p-1 ml-4"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );

  const modalFooter = (
    <div className="flex items-center justify-end gap-2 sm:gap-3 w-full">
      {!submitSuccess && (
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      )}
      {step === "upload" && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading || franchiseeInactive}
          className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-mustard text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Uploading...
            </>
          ) : (
            "Upload & Extract"
          )}
        </button>
      )}
      {step === "review" && !submitSuccess && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg
                className="w-4 h-4 animate-spin shrink-0"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </button>
      )}
      {submitSuccess && (
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
        >
          Done
        </button>
      )}
    </div>
  );

  const modalBody = (
    <div className="w-full max-h-[60vh] overflow-y-auto min-w-0">
      {/* ── Step 1: Upload ── */}
      {step === "upload" && (
        <div className="flex flex-col items-center gap-4 sm:gap-5">
          {/* Franchisee searchable dropdown */}
          <div className="w-full flex flex-col gap-1 px-1">
            <label className="text-sm font-semibold text-slate-600">
              Franchisee Name <span className="text-red-500">*</span> :
            </label>
            <CommonSearchableAll
              apiEndpoint={`admin/franchisee-settings?sales_id=${userdata?.mapped_id}`}
              placeholder="Search Franchisee..."
              questionmark={true}
              key1="key"
              selecteddata={selectedFranchisee}
              setSelecteddata={setSelectedFranchisee}
              comingselectedname="franchisee_name"
              comingselectedid="franchisee_id"
              fun1={(item: any) => {
                if (item?.is_active != 1) {
                  showAlert("Franchisee is inactive. Cannot proceed with booking.", "warning");
                  setSelectedFranchisee({ franchisee_id: "", franchisee_name: "" });
                  setFranchiseeInactive(true);
                  setFieldErrors((prev) => ({ ...prev, franchisee_name: "This Franchisee is inactive." }));
                  return;
                }
                setFranchiseeInactive(false);
                setSelectedFranchisee(item);
                if (fieldErrors["franchisee_name"]) {
                  setFieldErrors((prev) => { const n = { ...prev }; delete n["franchisee_name"]; return n; });
                }
              }}
              funtoempty={() => { setSelectedFranchisee({ franchisee_id: "", franchisee_name: "" }); setFranchiseeInactive(false); }}
              zIndex={50}
            />
            {fieldErrors["franchisee_name"] && (
              <p className="text-red-500 text-xs mt-0.5">{fieldErrors["franchisee_name"]}</p>
            )}
          </div>

          <div
            className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 sm:p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-yellow-400 active:border-yellow-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-8m0 0-3 3m3-3 3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
              />
            </svg>
            <p className="text-slate-500 text-sm text-center">
              Tap to browse or drag &amp; drop
              <br />
              <span className="text-xs text-slate-400">
                JPG · PNG · PDF &nbsp;|&nbsp; Max {MAX_FILE_SIZE_MB} MB
              </span>
            </p>
            {file && (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-mustard font-medium max-w-full">
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span className="truncate">{file.name}</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* ── Step 2: Review & Edit ── */}
      {step === "review" && (
        <div className="flex flex-col gap-3 sm:gap-4">
          {submitSuccess ? (
            <div className="flex flex-col items-center gap-5 py-10">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-700 font-semibold text-lg">Submitted Successfully!</p>
              {enquiryData?.enquiry_no && (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-slate-500">Enquiry Number</p>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
                    <span
                      className="text-base font-bold text-mustard tracking-wide cursor-pointer hover:underline"
                      onClick={() => navigate("/backoffice/dashboard")}
                    >
                      {enquiryData.enquiry_no}
                    </span>
                    <button
                      type="button"
                      title="Copy enquiry number"
                      onClick={() => {
                        copyToClipboard(enquiryData.enquiry_no).then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 3000);
                        }).catch(() => { });
                      }}
                      className="ml-1 p-1.5 rounded hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-700"
                    >
                      {copied ? (
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {copied && <p className="text-xs text-green-600 font-medium">Copied!</p>}
                </div>
              )}
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm text-slate-500">
                Review and edit the extracted data below before submitting.
              </p>

              {/* Mobile: stacked card layout | sm+: two-column table */}
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                {/* ── Mobile stacked view (hidden on sm+) ── */}
                <div className="divide-y divide-slate-100 sm:hidden">
                  {/* Booking Type */}
                  <div className="px-3 py-3 flex flex-col gap-1.5 bg-white">
                    <span className="text-xs font-semibold text-slate-600">Booking Type</span>
                    <span className="text-sm text-slate-800 font-medium">
                      {editedData.import_booking === 1 ? "Export Booking" : "Import Booking"}
                    </span>
                  </div>
                  {selectedFranchisee?.franchisee_name && (
                    <div className="px-3 py-3 flex flex-col gap-1.5 bg-white">
                      <span className="text-xs font-semibold text-slate-600">Franchisee</span>
                      <input
                        type="text"
                        value={selectedFranchisee.franchisee_name}
                        disabled
                        className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-slate-500 text-sm bg-slate-50 cursor-not-allowed"
                      />
                    </div>
                  )}
                  {Object.entries(editedData)
                    .filter(([key]) => key !== "franchisee_id" && key !== "chargeable_weight" && key !== "import_booking")
                    .map(([key, value], idx) => (
                      <React.Fragment key={key}>
                        <div
                          className={`px-3 py-3 flex flex-col gap-1.5 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
                        >
                          {key !== "sell_charges" && (
                            <span className="text-xs font-semibold text-slate-600">
                              {formatLabel(key)}
                            </span>
                          )}
                          {key === "sell_charges" ? (
                            <SellChargesEditor
                              path={[key]}
                              value={value}
                              onChange={handleChange}
                            />
                          ) : key === "origin_country" || key === "destination_country" ? (
                            <CountryDropdown
                              value={value}
                              onChange={(val) => handleChange([key], val)}
                            />
                          ) : (
                            <FieldEditor
                              path={[key]}
                              value={value}
                              onChange={handleChange}
                              nonNegativeFields={key === "shipment_dimensions" ? DIMENSION_NON_NEG_FIELDS : undefined}
                            />
                          )}
                          {fieldErrors[key] && (
                            <p className="text-red-500 text-xs mt-0.5">{fieldErrors[key]}</p>
                          )}
                        </div>
                        {key === "shipment_dimensions" && (
                          <div className="px-3 py-3 flex flex-col gap-1.5 bg-yellow-50/60">
                            <span className="text-xs font-semibold text-slate-600">Chargeable Weight</span>
                            <div className="relative">
                              <input
                                type="text"
                                value={editedData.chargeable_weight ?? ""}
                                disabled
                                className="w-full border border-slate-200 rounded-md px-2 py-1.5 pr-8 text-slate-500 text-sm bg-slate-50 cursor-not-allowed"
                              />
                              <button
                                type="button"
                                title="Recalculate Chargeable Weight"
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-500 transition-colors"
                                onClick={() =>
                                  setEditedData((prev) => ({
                                    ...prev,
                                    chargeable_weight: getChargeableWeight(prev.shipment_dimensions),
                                  }))
                                }
                              >
                                <RefreshCw className="w-4 h-4 stroke-2.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                </div>

                {/* ── Desktop table view (hidden on mobile) ── */}
                <table className="hidden sm:table w-full text-sm table-fixed">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-4 py-2.5 font-semibold text-slate-600 border-b border-slate-200 w-[28%]">
                        Field
                      </th>
                      <th className="text-left px-4 py-2.5 font-semibold text-slate-600 border-b border-slate-200 w-[72%]">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Booking Type */}
                    <tr className="bg-white">
                      <td className="px-4 py-3 text-slate-600 font-semibold align-middle border-b border-slate-100 w-[28%]">
                        Booking Type
                      </td>
                      <td className="px-4 py-3 border-b border-slate-100 w-[72%]">
                        <span className="text-sm text-slate-800 font-medium">
                          {editedData.import_booking === 1 ? "Export Booking" : "Import Booking"}
                        </span>
                      </td>
                    </tr>
                    {/* Franchisee — read-only */}
                    {selectedFranchisee?.franchisee_name && (
                      <tr className="bg-white">
                        <td className="px-4 py-3 text-slate-600 font-semibold align-top border-b border-slate-100 w-[28%]">
                          Franchisee
                        </td>
                        <td className="px-4 py-3 border-b border-slate-100 w-[72%]">
                          <input
                            type="text"
                            value={selectedFranchisee.franchisee_name}
                            disabled
                            className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-slate-500 text-sm bg-slate-50 cursor-not-allowed"
                          />
                        </td>
                      </tr>
                    )}
                    {Object.entries(editedData)
                      .filter(([key]) => key !== "franchisee_id" && key !== "chargeable_weight" && key !== "import_booking")
                      .map(([key, value], idx) => (
                        <React.Fragment key={key}>
                          <tr className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                            {key === "sell_charges" ? (
                              <td colSpan={2}>
                                <SellChargesEditor
                                  path={[key]}
                                  value={value}
                                  onChange={handleChange}
                                />
                              </td>
                            ) : (
                              <>
                                <td className="px-4 py-3 text-slate-600 font-semibold align-top border-b border-slate-100 w-[28%]">
                                  {formatLabel(key)}
                                </td>
                                <td className="px-4 py-3 border-b border-slate-100 w-[72%] max-w-0">
                                  {key === "origin_country" || key === "destination_country" ? (
                                    <CountryDropdown
                                      value={value}
                                      onChange={(val) => handleChange([key], val)}
                                    />
                                  ) : (
                                    <FieldEditor
                                      path={[key]}
                                      value={value}
                                      onChange={handleChange}
                                      nonNegativeFields={key === "shipment_dimensions" ? DIMENSION_NON_NEG_FIELDS : undefined}
                                    />
                                  )}
                                  {fieldErrors[key] && (
                                    <p className="text-red-500 text-xs mt-1">{fieldErrors[key]}</p>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                          {key === "shipment_dimensions" && (
                            <tr className="bg-yellow-50/60">
                              <td className="px-4 py-3 text-slate-600 font-semibold align-top border-b border-slate-100 w-[28%]">
                                Chargeable Weight
                              </td>
                              <td className="px-4 py-3 border-b border-slate-100 w-[72%]">
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={editedData.chargeable_weight ?? ""}
                                    disabled
                                    className="w-full border border-slate-200 rounded-md px-2 py-1.5 pr-8 text-slate-500 text-sm bg-slate-50 cursor-not-allowed"
                                  />
                                  <button
                                    type="button"
                                    title="Recalculate Chargeable Weight"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-500 transition-colors"
                                    onClick={() =>
                                      setEditedData((prev) => ({
                                        ...prev,
                                        chargeable_weight: getChargeableWeight(prev.shipment_dimensions),
                                      }))
                                    }
                                  >
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                  </tbody>
                </table>
              </div>

            </>
          )}
        </div>
      )}
    </div>
  );

  return (
    <CommonModal
      open={open}
      setOpen={handleClose}
      title={modalTitle}
      description={modalBody}
      footer={modalFooter}
      size="xl"
      gridColumns={1}
    />
  );
};

export default DocumentUploadModal;
