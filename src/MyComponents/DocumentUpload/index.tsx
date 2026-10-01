import React, { useEffect, useRef, useState } from "react";
import { masterGET, masterPOST, masterDELETE } from "../../AllServices/masterServices";
import { useAlert } from "../../ContextProvider/AlertContext";
import { Clock, Download, RotateCcw, Trash2, Upload, FileText, X, Plus, Image as ImageIcon } from "lucide-react";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";

const ALLOWED_TYPES = ["pdf", "jpg", "jpeg", "png", "doc", "docx"];
const IMAGE_TYPES = ["jpg", "jpeg", "png"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const formatSize = (bytes: number) => {
  if (!bytes) return "—";
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
};

const isImageExt = (ext: string) => IMAGE_TYPES.includes((ext || "").toLowerCase());
const isImageUrl = (url: string) => /\.(jpg|jpeg|png)(\?.*)?$/i.test(url || "");

interface PendingDoc {
  doc_type_id: number | "";
  custom_name: string;
  file: File | null;
  preview: string | null;
  error: string;
}

interface DocType {
  id: number;
  doc_name: string;
}

interface DocumentUploadProps {
  party_id?: any;
  viewOnly?: boolean;
  showUpload?: boolean;
}

const DocumentUpload = ({ party_id, viewOnly = false, showUpload = true }: DocumentUploadProps) => {
  const { showAlert } = useAlert();
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [docs, setDocs] = useState<any[]>([]);
  const [docTypes, setDocTypes] = useState<DocType[]>([]);
  const [pending, setPending] = useState<PendingDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showUpload && !viewOnly) fetchDocTypes();
    if (party_id) fetchDocs();
  }, [party_id]);

  useEffect(() => {
    return () => {
      pending.forEach((p) => { if (p.preview) URL.revokeObjectURL(p.preview); });
    };
  }, []);

  const fetchDocTypes = async () => {
    try {
      const res: any = await masterGET(`/api/v1/master/vendor-doc-types`);
      if (res?.status === 200) setDocTypes(res.data?.data || []);
    } catch {}
  };

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res: any = await masterGET(`/api/v1/master/vendor-documents/${party_id}`);
      if (res?.status === 200) setDocs(res.data?.data || []);
    } catch {} finally {
      setLoading(false);
    }
  };

  const othersTypeId = docTypes.find((t) => t.doc_name.toLowerCase() === "others")?.id ?? null;

  const usedTypeIds = (rowIndex: number): number[] => {
    const fromUploaded = docs.map((d: any) => d.doc_type_id).filter(Boolean);
    const fromPending = pending
      .filter((_, i) => i !== rowIndex)
      .map((p) => p.doc_type_id)
      .filter((id) => id !== "") as number[];
    return [...fromUploaded, ...fromPending].filter((id) => id !== othersTypeId);
  };

  const addPendingRow = () => {
    setPending((prev) => [...prev, { doc_type_id: "", custom_name: "", file: null, preview: null, error: "" }]);
  };

  const updatePendingType = (index: number, type_id: number | "") => {
    setPending((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], doc_type_id: type_id, custom_name: "", error: "" };
      return updated;
    });
  };

  const updatePendingCustomName = (index: number, name: string) => {
    setPending((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], custom_name: name, error: "" };
      return updated;
    });
  };

  const updatePendingFile = (index: number, file: File | null) => {
    if (!file) return;
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_TYPES.includes(ext)) {
      showAlert(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`, "error");
      if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      showAlert(`File exceeds ${MAX_SIZE_MB} MB limit`, "error");
      if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
      return;
    }
    setPending((prev) => {
      const updated = [...prev];
      if (updated[index]?.preview) URL.revokeObjectURL(updated[index].preview!);
      const preview = isImageExt(ext) ? URL.createObjectURL(file) : null;
      updated[index] = { ...updated[index], file, preview, error: "" };
      return updated;
    });
  };

  const removePendingRow = (index: number) => {
    if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = "";
    setPending((prev) => {
      if (prev[index]?.preview) URL.revokeObjectURL(prev[index].preview!);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    const revalidated = pending.map((row) => {
      if (!row.doc_type_id) return { ...row, error: "Select a document type" };
      if (othersTypeId && row.doc_type_id === othersTypeId && !row.custom_name.trim()) {
        return { ...row, error: "Enter a name for this document" };
      }
      if (!row.file) return { ...row, error: "Attach a file" };
      return { ...row, error: "" };
    });
    setPending(revalidated);
    const allValid = revalidated.every((r) => !r.error);
    if (!allValid || !party_id || pending.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      const doc_type_ids: (number | null)[] = [];
      const doc_type_custom_names: (string | null)[] = [];

      revalidated.forEach((row) => {
        formData.append("documents", row.file as File);
        doc_type_ids.push(row.doc_type_id as number);
        doc_type_custom_names.push(
          othersTypeId && row.doc_type_id === othersTypeId && row.custom_name.trim()
            ? row.custom_name.trim()
            : null
        );
      });

      formData.append("doc_type_ids", JSON.stringify(doc_type_ids));
      formData.append("doc_type_custom_names", JSON.stringify(doc_type_custom_names));

      const res: any = await masterPOST(`/api/v1/master/vendor-documents/${party_id}`, formData);
      if (res?.status === 200) {
        const isPending = res.data?.is_pending === 1;
        showAlert(
          isPending
            ? "Documents submitted for admin review. They will appear as 'Under Review' until approved."
            : "Documents uploaded successfully.",
          "success"
        );
        pending.forEach((p) => { if (p.preview) URL.revokeObjectURL(p.preview); });
        setPending([]);
        fileInputRefs.current = [];
        fetchDocs();
      } else {
        const errList = res?.response?.data?.errors || res?.data?.errors;
        const msg = Array.isArray(errList) ? errList.join(", ") : "Upload failed.";
        showAlert(msg, "error");
      }
    } catch {
      showAlert("Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDocAction = async (doc: any) => {
    try {
      const res: any = await masterDELETE(`/api/v1/master/vendor-documents/${doc.id}`);
      if (res?.status === 200) {
        showAlert(res.data?.message || "Done.", "success");
        fetchDocs();
      } else {
        showAlert("Action failed.", "error");
      }
    } catch {
      showAlert("Action failed.", "error");
    }
  };

  const canAddMore =
    !viewOnly &&
    showUpload &&
    (othersTypeId !== null ||
      docTypes.length === 0 ||
      pending.length + docs.length < docTypes.length);

  if (!party_id) return null;

  return (
    <div className="mt-4">
      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Documents
        <span className="text-gray-400 text-xs font-normal">(Optional)</span>
      </h3>

      {!viewOnly && showUpload && (
        <div className="mb-4">
          <div className="flex items-start gap-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-xs mb-3">
            <span className="mt-0.5">ℹ</span>
            <span>
              Select a document type for each file. Use "Others" with a custom name for additional
              documents. Allowed: PDF, JPG, PNG, DOC — max {MAX_SIZE_MB} MB.
            </span>
          </div>

          {pending.map((row, index) => {
            const used = usedTypeIds(index);
            const available = docTypes.filter((t) => !used.includes(t.id));
            const isOthersSelected = othersTypeId !== null && row.doc_type_id === othersTypeId;
            return (
              <div
                key={index}
                className={`border rounded-md p-2 mb-2 ${
                  row.error ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="grid grid-cols-12 gap-2 items-start">
                  <div className={`col-span-12 ${isOthersSelected ? "sm:col-span-3" : "sm:col-span-4"}`}>
                    <select
                      value={row.doc_type_id}
                      className={`w-full border rounded px-2 py-1.5 text-sm ${
                        row.error && !row.doc_type_id ? "border-red-400" : "border-gray-300"
                      }`}
                      onChange={(e) =>
                        updatePendingType(index, e.target.value ? Number(e.target.value) : "")
                      }
                    >
                      <option value="">Select Type</option>
                      {available.map((t) => (
                        <option key={t.id} value={t.id}>{t.doc_name}</option>
                      ))}
                    </select>
                    {row.error && !row.doc_type_id && (
                      <small className="text-red-500 block mt-0.5">{row.error}</small>
                    )}
                  </div>

                  {isOthersSelected && (
                    <div className="col-span-12 sm:col-span-3">
                      <input
                        type="text"
                        placeholder="Document name *"
                        value={row.custom_name}
                        maxLength={255}
                        className={`w-full border rounded px-2 py-1.5 text-sm ${
                          row.error && !row.custom_name.trim() ? "border-red-400" : "border-gray-300"
                        }`}
                        onChange={(e) => updatePendingCustomName(index, e.target.value)}
                      />
                      {row.error && !row.custom_name.trim() && (
                        <small className="text-red-500 block mt-0.5">{row.error}</small>
                      )}
                    </div>
                  )}

                  <div className={`col-span-12 ${isOthersSelected ? "sm:col-span-4" : "sm:col-span-6"}`}>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      ref={(el) => (fileInputRefs.current[index] = el)}
                      className="text-xs w-full cursor-pointer"
                      onChange={(e) => updatePendingFile(index, e.target.files?.[0] || null)}
                    />
                    {row.error && row.doc_type_id && !(isOthersSelected && !row.custom_name.trim()) && (
                      <small className="text-red-500 block mt-0.5">{row.error}</small>
                    )}
                  </div>

                  <div className="col-span-12 sm:col-span-2 flex justify-end items-center pt-1">
                    <X
                      className="w-4 h-4 cursor-pointer text-red-400 hover:text-red-600"
                      onClick={() => removePendingRow(index)}
                    />
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

          <div className="flex items-center gap-2 mt-2">
            {canAddMore && (
              <button
                type="button"
                onClick={addPendingRow}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2 py-1 bg-blue-50"
              >
                <Plus className="w-3.5 h-3.5" /> Add Document
              </button>
            )}
            {pending.length > 0 && (
              <Button
                className="bg-blue-600 text-white text-xs px-3 py-1.5 flex items-center gap-1.5"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <LoadingIcon icon="oval" className="w-3.5 h-3.5" color="white" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {uploading ? "Uploading..." : `Upload ${pending.length} file${pending.length > 1 ? "s" : ""}`}
              </Button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">
          <LoadingIcon icon="oval" className="w-6 h-6 mx-auto" />
        </div>
      ) : docs.length === 0 ? (
        <p className="text-sm text-gray-400">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {docs.map((doc) => {
            const isPendingAdd = doc.is_pending === 1;
            const isPendingRemove = doc.is_pending === 2;
            return (
              <div
                key={doc.id}
                className={`border rounded-lg px-3 py-2 ${
                  isPendingAdd ? "border-amber-300 bg-amber-50" : isPendingRemove ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {isImageUrl(doc.file_url) ? (
                      <ImageIcon className={`w-4 h-4 shrink-0 ${isPendingAdd ? "text-amber-500" : isPendingRemove ? "text-red-400" : "text-blue-400"}`} />
                    ) : (
                      <FileText className={`w-4 h-4 shrink-0 ${isPendingAdd ? "text-amber-500" : isPendingRemove ? "text-red-400" : "text-gray-400"}`} />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        {doc.doc_type_name && (
                          <span className="inline-block text-xs font-semibold bg-mustard/10 text-mustard px-1.5 py-0.5 rounded">
                            {doc.doc_type_name}
                          </span>
                        )}
                        {isPendingAdd && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                            <Clock className="w-3 h-3" /> Under Review
                          </span>
                        )}
                        {isPendingRemove && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 border border-red-300 px-1.5 py-0.5 rounded">
                            <Trash2 className="w-3 h-3" /> Pending Removal
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">{doc.file_name}</p>
                      <p className="text-xs text-gray-400">
                        {formatSize(doc.file_size)} · {new Date(doc.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {!isPendingRemove && (
                      <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded hover:bg-blue-100 text-blue-600 inline-flex items-center" title="View / Download">
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    {!viewOnly && (
                      isPendingAdd ? (
                        <button type="button"
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 border border-amber-300"
                          onClick={() => handleDocAction(doc)} title="Cancel upload">
                          <X className="w-3.5 h-3.5" /> Cancel Upload
                        </button>
                      ) : isPendingRemove ? (
                        <button type="button"
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 border border-red-300"
                          onClick={() => handleDocAction(doc)} title="Cancel removal">
                          <RotateCcw className="w-3.5 h-3.5" /> Cancel Removal
                        </button>
                      ) : (
                        <button type="button" className="p-1.5 rounded hover:bg-red-100 text-red-500"
                          onClick={() => handleDocAction(doc)} title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
                {isPendingAdd && (
                  <p className="text-xs text-amber-600 mt-1">Waiting for admin approval before this document becomes active.</p>
                )}
                {isPendingRemove && (
                  <p className="text-xs text-red-600 mt-1">This document will be removed once admin approves your changes.</p>
                )}
                {isImageUrl(doc.file_url) && !isPendingRemove && (
                  <div className="mt-2">
                    <img src={doc.file_url} alt={doc.file_name}
                      className="max-h-28 rounded border border-gray-200 object-contain cursor-pointer"
                      onClick={() => window.open(doc.file_url, "_blank", "noopener,noreferrer")} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
