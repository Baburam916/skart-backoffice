import { Eye } from "lucide-react";
import Button from "../../../../base-components/Button";
import LoadingIcon from "../../../../base-components/LoadingIcon";
import Table from "../../../../base-components/Table";
import useFetch from "../../GetCustomHook.tsx/GetCustomHook";
import IsLoading from "../isLoading/isLoading";
import styles from "./reportcommoncss.module.css";
import { formatIndianNumber } from "../CommonNumberConverter/CommonNumberconverter";
export default function ReportCommonTable(data: any) {
  const {
    columns,
    row,
    loading,
    page,
    overflowvalue,
    height,
    adddata,
    alignment,
    arr1,
    arr2,
    margin,
  } = data;
  const keys = Object.keys(columns);

  function transformKey(key: any) {
    return key.replace(/_/g, " ").toUpperCase();
  }

  // console.log(keys);
  // console.log(row);
  const check = (item: any) => {
    if (!isNaN(item) && typeof item === "number") {
      // If the item is a number, format it to 2 decimal places
      return true;
    } else {
      // If the item is not a number, return it as is
      return false;
    }
  };
  function formatData(item: any) {
    if (!isNaN(item) && typeof item === "number") {
      // If the item is a number, format it to 2 decimal places
      return formatIndianNumber(Number(item));
    } else {
      // If the item is not a number, return it as is
      return item;
    }
  }
  // console.log(keys, "keys coming", arr1&&arr1.includes("sub_total (Rs.)"));
  let counter = 0;
  return (
    <>
      <div className={`${margin ? "margin" : "mt-4"} bg-white`}>
        {loading ? (
          <IsLoading />
        ) : (
          <div className={`${overflowvalue ? styles["table-container"] : ""}`}>
            <Table
              sm
              striped
              // className={`${overflowvalue ? `overflow-auto h-[${height}px]` : ""}`}
            >
              <Table.Thead
                className={"bg-mustard text-white whitespace-nowrap "}
              >
                <Table.Tr>
                  <Table.Th className="text-right w-[4%]">SR.No.</Table.Th>
                  {keys.map((key, index) =>
                    key !== "unbilled_type" ? (
                      <Table.Th
                        className={`${
                          key == "kyc_documents"
                            ? "text-center"
                            : arr1 && arr1?.length >= 1 && arr1.includes(key)
                            ? "text-right"
                            : arr2 && arr2?.length >= 1 && arr2?.includes(key)
                            ? "text-left"
                            : ""
                        }`}
                        key={index}
                      >
                        {/* {key} */}
                        {key == "Unbilled airwaybill no"
                          ? "Airwaybill No"
                          : transformKey(key)}
                      </Table.Th>
                    ) : (
                      ""
                    )
                  )}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody className="whitespace-nowrap">
                {row?.map((item: any, rowIndex: number) => {
                  counter++;

                  return (
                    <Table.Tr key={rowIndex}>
                      <Table.Td className="text-right" key={`srno-${rowIndex}`}>
                        {page * 20 + rowIndex + 1}
                      </Table.Td>
                      {keys?.map((key, colIndex) =>
                        key !== "unbilled_type" ? (
                          <Table.Td
                            key={`${rowIndex}-${colIndex}`}
                            className={`${
                              key == "Documents(shipper inv,kyc1,kyc2)"
                                ? "text-center"
                                : alignment
                                ? check(item[key])
                                  ? "text-right"
                                  : "text-left"
                                : ""
                            }`}
                          >
                            {key === "dispatch_label" ||
                            key == "Documents(shipper inv,kyc1,kyc2)" ? (
                              item[key] ? (
                                <div className="flex justify-center items-center gap-2">
                                  {item[key].split(",").map((item2) => (
                                    <div className="text-center  flex justify-center items-center">
                                      {" "}
                                      <a
                                        href={item2}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Eye className="text-mustard" />
                                      </a>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                "N/A"
                              )
                            ) : key == "kyc_documents" ? (
                              item[key] ? (
                                <div className="flex justify-center items-center gap-2">
                                  <div className="  flex justify-center items-center">
                                    {" "}
                                    {item[key]?.path1 ? (
                                      <a
                                        href={item[key]?.path1 || ""}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <Button
                                          className="p-2 text-white"
                                          variant="warning"
                                        >
                                          {item[key]?.name1 || ""}
                                        </Button>
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                    {item[key]?.path2 ? (
                                      <a
                                        href={item[key]?.path2 || ""}
                                        target="_blank"
                                        className="ml-2"
                                        rel="noopener noreferrer"
                                      >
                                        <Button
                                          className="p-2 text-white"
                                          variant="success"
                                        >
                                          {item[key]?.name2 || ""}
                                        </Button>
                                      </a>
                                    ) : (
                                      ""
                                    )}
                                    {!item[key]?.path1 && !item[key]?.path2 ? (
                                      <span className="text-left">
                                        No Documents
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              ) : (
                                "N/A"
                              )
                            ) : key == "Unbilled airwaybill no" ? (
                              <span
                                onClick={() => {
                                  adddata(item[key]);
                                }}
                                className="underline hover:cursor-pointer hover:text-red-500"
                              >
                                {item[key]}
                              </span>
                            ) : key == "charge_name " ? (
                              <div>
                                {
                                  <span>
                                    {item[key]}{" "}
                                    <span
                                      className={`${
                                        item["unbilled_type"] == 2
                                          ? "text-success"
                                          : "text-danger"
                                      }`}
                                    >
                                      {" "}
                                      {item["unbilled_type"] == 2
                                        ? "(adc. chg.)"
                                        : item["unbilled_type"] == 1
                                        ? "(booking chg.)"
                                        : ""}
                                    </span>
                                  </span>
                                }
                              </div>
                            ) : item[key] || item[key] === 0 ? (
                              // Number(item[key])
                              formatData(item[key])
                            ) : (
                              // item[key].toString()
                              // check(item[key])!=="NaN"?formatIndianNumber(Number(item[key])):   item[key].toString()
                              "N/A"
                            )}
                          </Table.Td>
                        ) : (
                          ""
                        )
                      )}
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
