import LoadingIcon from "../../../../base-components/LoadingIcon";
import Table from "../../../../base-components/Table";
import useFetch from "../../GetCustomHook.tsx/GetCustomHook";
import styles from "./commontable.module.css"
import IsLoading from "../isLoading/isLoading";

export default function CommonTable(data: any) {

  const { columns, row,loading,page,pdata, height, limit = 20 } = data;

  // console.log(columns , row, "test");
  

  return (
    <>
      <div className={`bg-white overflow-auto ${height ? `h-[${height}]` : ""}`}>
        {loading ? (
          <IsLoading />
        ) : (
          <div className={styles["table-container"]}>
            <div className="overflow-x-auto">
            <Table sm striped>
              <Table.Thead className="bg-mustard text-white whitespace-nowrap">
                <Table.Tr className="text-center">
                  <Table.Th>SR.No.</Table.Th>
                  {columns.map((col: any, ind: number) => (
                    <Table.Th key={ind} className={col.text}>
                      {col.headerName}
                      {/* col.headerName.toLowerCase() == "action" ?
                      !pdata?.delete_permission&&!pdata?.update_permission ? ""
                      : col.headerName : col.headerName */}
                    </Table.Th>
                  ))}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {row.map((item: any, rowIndex: number) => (
                  <Table.Tr
                    key={rowIndex}
                    className="text-center capitalize whitespace-nowrap"
                  >
                    <Table.Td>{page?((page)*limit)+rowIndex + 1:rowIndex+1}.</Table.Td>
                    {columns.map((col: any, colIndex: number) => (
                      <Table.Td key={colIndex} className={col.text}>
                        {item[col.field] ? item[col.field] : ""}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table></div>
          </div>
        )}
      </div>
    </>
  );
}
