import Table from "../../base-components/Table";
import IsLoading from "../../pages/skart_sales/commoncomponents/isLoading/isLoading";
import "./index.css";

export default function index(data: any) {
  const {
    heightTable,
    columns,
    row,
    currentPage,
    margin,
    showSno = false,
    isLoading,
    height,
    vendorData = [],
  } = data;

  return (
    <>
      <div
        style={{ maxHeight: heightTable }}
        className={`${margin ? margin : "mt-0"} tbl-overflow-x-auto ${height ? height : ""} `}
      >
        {isLoading ? (
          <IsLoading />
        ) : (
          <Table className={` min-w-full table-auto`}>
            <Table.Thead className="bg-mustard text-white sticky top-0 z-10">
              <Table.Tr className="text-center">
                {!showSno ? (
                  <Table.Th className="whitespace-nowrap p-2">SR.No.</Table.Th>
                ) : (
                  ""
                )}
                {columns?.map((col: any, ind: number) => (
                  <Table.Th
                    className={`whitespace-nowrap p-2 ${`text-${col.textalign}`}`}
                    key={ind}
                  >
                    {col.headerName}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {row?.map((item: any, rowIndex: number) => (
                <Table.Tr
                  key={rowIndex}
                  className="text-center"
                  style={
                    (item?.shipment_type_id == 4 ||
                      item?.shipment_type_id == 5) &&
                    vendorData
                      ?.find(
                        (elem: any) => elem?.product_id == item?.courier_id,
                      )
                      ?.product_name?.toLowerCase()
                      ?.includes("fedex")
                      ? { backgroundColor: "#FDF6B2" }
                      : {}
                  }
                >
                  <Table.Td className="whitespace-nowrap p-2">
                    {currentPage == undefined
                      ? rowIndex + 1
                      : (currentPage - 1) * 20 + (rowIndex + 1)}
                    .
                  </Table.Td>
                  {columns?.map((col: any, colIndex: number) => (
                    <Table.Td
                      className={`whitespace-nowrap p-2 ${
                        col?.textalign ? ` text-${col.textalign}` : ""
                      }`}
                      key={colIndex}
                    >
                      {item[col.field]}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </div>
    </>
  );
}
