import { Plus, Trash2 } from "lucide-react";
import Table from "../../../../base-components/Table";
import { Minus } from "lucide-react";
import { FormInput } from "../../../../base-components/Form";
import { useAlert } from "../../../../ContextProvider/AlertContext";

const limitToThreeDecimals = (value: string): string => {
  const v = value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
  const dotIdx = v.indexOf(".");
  if (dotIdx !== -1 && v.length - dotIdx - 1 > 3) {
    return v.slice(0, dotIdx + 4);
  }
  return v;
};

const onKeyDownDecimal = (e: any) => {
  const val = e.target.value;
  const dot = val.indexOf(".");
  if (dot !== -1 && /^[0-9]$/.test(e.key) && e.target.selectionStart === e.target.selectionEnd && e.target.selectionStart > dot && val.length - dot - 1 >= 3) {
    e.preventDefault();
  }
};
export const checkallfiled=(excludearr?:any,arr?:any)=>{
  const isAllFilled = arr.every((item: any) =>
    Object.entries(item).every(([key, value]) =>
      excludearr.includes(key)
        ? true
        : value !== "" &&
          value !== null &&
          value !== undefined &&
          value !== 0 &&
          Number(value) !== 0
    )
  );
  return isAllFilled
}
export const checkrequiredvalues=(data?:any)=>{
const lastindex=data[data?.length-1]
const {length,breadth,quantity,height}=lastindex
if(length||breadth||quantity||height){
  return true 
}else{
  return false
}
}

export const isValidHsn = (inputString: string) => {
  const invalidStrings = [
    "00000000",
    "11111111",
    "22222222",
    "33333333",
    "44444444",
    "55555555",
    "66666666",
    "77777777",
    "88888888",
    "99999999",
    "01234567",
    "12345678",
    "23456789",
    "34567890",
    "45678901",
    "56789012",
    "67890123",
    "78901234",
    "89012345",
    "90123456",
  ];

  if (inputString.length >= 6) {
    if (/^[0-9]+$/.test(inputString)) {
      if (invalidStrings.includes(inputString)) {
        // console.log("Invalid HSN Code");
        return false;
      } else {
        // console.log("Valid HSN Code");
        return true;
      }
    } else {
      // console.log("Invalid HSN Code");
      return false;
    }
  } else {
    // console.log("Invalid HSN Code");
    return false;
  }
};
export const ShipmentDimensions = ({
  dimensionData,
  setDimensionData,
  setJobData,
  checkdisable,
  currencyData,
  booking,
  currencyId,
  jobdata,
  weightUnit,
}: any) => {
  const { showAlert } = useAlert();
  const handleDimensionChange = (name: any, Value: any, index: any) => {
    const updatedDimensions = [...dimensionData];

    updatedDimensions[index] = { ...updatedDimensions[index], [name]: Value };
    setDimensionData(updatedDimensions);
    setJobData((prev: any) => ({
      ...prev,
      shipment_dimensions: updatedDimensions,
    }));
  };
  const handleDelete = (e: any, index?: any) => {
    e.stopPropagation();
    e.isPropagationStopped();
    const newData = [...dimensionData];
    newData.splice(index, 1);
    setJobData((prev: any) => ({ ...prev, shipment_dimensions: newData }));
    setDimensionData(newData);
    // getChargeableWeight(1, newData, editData?.courier_id);
  };
  const addrow = () => {
    const excludedKeys = [
      "ex_rate",
      "party",
      "pp_cc",
      "sgst_amount",
      "igst_amount",
      "cgst_amount",
      "enquiry_id",
      "currency",
      "party_type",
    ]; // Add keys you want to exclude

    const isAllFilled = dimensionData.every((item: any) =>
      Object.entries(item).every(([key, value]) =>
        excludedKeys.includes(key)
          ? true
          : value !== "" &&
            value !== null &&
            value !== undefined &&
            value !== 0 &&
            Number(value) !== 0
      )
    );
    if (isAllFilled) {
      const newdata = [...dimensionData];
      setDimensionData([
        ...dimensionData,
        {
          item_description: "",
          weight: "",
          value: "",
          quantity: "",
          length: "",
          breadth: "",
          height: "",
          hsn_code: "",
        },
      ]);
    } else {
      showAlert("Please Provide Details First", "warning");
    }
  };
  return (
    <>
      <div className="overflow-x-auto">
        <Table sm hover striped className="bg-white shadow-lg rounded-md">
          <Table.Thead className="p-0">
            <Table.Tr className="bg-mustard text-white text-center">
              <Table.Th className="whitespace-nowrap border">
                <div className="flex gap-2 items-center">
                  <p>SR NO.</p>
                {!checkdisable?  <Plus
                    className="w-[20px] h-[20px] bg-green-400 text-white p-[3px] rounded-sm mr-1 cursor-pointer stroke-2.5"
                    onClick={(e) => {
                      // if (!spinner) {
                      //   e.stopPropagation();
                      //   e.isPropagationStopped();
                      //   setDimensionData((prev) => [...prev, initDimension]);
                      // }
                      addrow();
                    }}
                  />:""}
                  {!checkdisable?
                  <Minus
                    className="w-[20px] h-[20px] bg-red-500 text-white p-[3px] rounded-sm mr-1 cursor-pointer stroke-2.5"
                    onClick={(e) => {
                      if (dimensionData?.length > 1) {
                        const newdata=[...dimensionData]
                        newdata.pop()
                     setDimensionData(newdata)
                      } else {
                      
                        setDimensionData([
                          {
                            item_description: "",
                            weight: "",
                            value: "",
                            quantity: "",
                            length: "",
                            breadth: "",
                            height: "",
                            hsn_code: "",
                          },
                        ]);
                      }
                        
                      // }
                    }}
                  />:""}
                </div>
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">
                DESCRIPTION
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">
                WEIGHT (in{" "}
                {`${
                  booking?.unit?.weight_unit
                    ? booking?.unit?.weight_unit
                    : weightUnit
                    ? weightUnit
                    : "kgs"
                }`}
                )
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">
                Value (in {""}
                {`${
                  booking?.unit?.currency
                    ? currencyData?.find(
                        (data) => data?.id == booking?.unit?.currency
                      )?.currency
                    : currencyId
                    ? currencyData.find((item: any) => item?.id == currencyId)
                        ?.currency
                    : "INR"
                }`}
                )
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">QUANTITY</Table.Th>
              <Table.Th className="whitespace-nowrap border">
                LENGTH (in cm)
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">
                BREADTH (in cm)
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">
                HEIGHT (in cm)
              </Table.Th>
              <Table.Th className="whitespace-nowrap border">HSN CODE</Table.Th>
          {!checkdisable? <Table.Th className="whitespace-nowrap border">ACTION</Table.Th>:""}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody className="p-0">
            {dimensionData?.map((item: any, index: number) => (
              <Table.Tr>
                <Table.Td className="text-center border p-0">
                  {index + 1}.
                </Table.Td>
                <Table.Td className="text-center border p-1">
                  <FormInput
                    id="item_description"
                    type="text"
                    disabled={checkdisable}
                    name="item_description"
                    placeholder="Enter Description"
                    value={item?.item_description}
                    onChange={(e) => {
                      handleDimensionChange(
                        e.target.name,
                        e.target.value?.replace(/[^a-zA-Z0-9 ]/g, ""),
                        index
                      );
                    }}
                  />
                </Table.Td>
                <Table.Td className="text-center border p-1">
                  <FormInput
                    id="weight"
                    type="text"
                    disabled={checkdisable}
                    name="weight"
                    placeholder="Enter Weight"
                    value={limitToThreeDecimals(String(item?.weight ?? ""))}
                    onChange={(e) => {
                      handleDimensionChange(e.target.name, limitToThreeDecimals(e.target.value), index);
                    }}
                    onKeyDown={onKeyDownDecimal}
                  />
                </Table.Td>
                <Table.Td className="text-center border p-1">
                  <FormInput
                    id="value"
                    type="text"
                    name="value"
                    placeholder="Enter Value"
                    value={limitToThreeDecimals(String(item?.value ?? ""))}
                    disabled={checkdisable}
                    onChange={(e) => {
                      handleDimensionChange(e.target.name, limitToThreeDecimals(e.target.value), index);
                    }}
                    onKeyDown={onKeyDownDecimal}
                  />
                </Table.Td>
                <Table.Td className="text-center border p-1">
                  <FormInput
                    id="quantity"
                    type="text"
                    name="quantity"
                    disabled={checkdisable}
                    placeholder="Enter Quantity"
                    value={limitToThreeDecimals(String(item?.quantity ?? ""))}
                    onChange={(e) => {
                      handleDimensionChange(e.target.name, limitToThreeDecimals(e.target.value), index);
                    }}
                    onKeyDown={onKeyDownDecimal}
                  />
                </Table.Td>
                <Table.Td className="text-center border p-1">
                  <FormInput
                    id="length"
                    type="text"
                    name="length"
                    placeholder="Enter Length"
                    value={limitToThreeDecimals(String(item?.length ?? ""))}
                    disabled={checkdisable}
                    onChange={(e) => {
                      handleDimensionChange(e.target.name, limitToThreeDecimals(e.target.value), index);
                    }}
                    onKeyDown={onKeyDownDecimal}
                  />
                </Table.Td>
                <Table.Td className="text-center border p-1">
                  <FormInput
                    id="breadth"
                    type="text"
                    name="breadth"
                    placeholder="Enter Breadth"
                    value={limitToThreeDecimals(String(item?.breadth ?? ""))}
                    disabled={checkdisable}
                    onChange={(e) => {
                      handleDimensionChange(e.target.name, limitToThreeDecimals(e.target.value), index);
                    }}
                    onKeyDown={onKeyDownDecimal}
                  />
                </Table.Td>
                <Table.Td className="text-center border p-1">
                  <FormInput
                    id="height"
                    type="text"
                    name="height"
                    placeholder="Enter Height"
                    disabled={checkdisable}
                    value={limitToThreeDecimals(String(item?.height ?? ""))}
                    onChange={(e) => {
                      handleDimensionChange(e.target.name, limitToThreeDecimals(e.target.value), index);
                    }}
                    onKeyDown={onKeyDownDecimal}
                  />
                </Table.Td>
                <Table.Td className="text-center border p-1">
                  <FormInput
                    id="hsn_code"
                    type="text"
                    name="hsn_code"
                    placeholder="Enter HSN Code"
                    value={item?.hsn_code}
                    disabled={checkdisable}
                    minLength={6}
                    maxLength={8}
                    onBlur={(e: any) => {
                      if (!isValidHsn(e.target.value)) {
                        showAlert("please provide a valid hsn code", "warning");
                        const newdata = [...dimensionData];
                        newdata[index]["hsn_code"] = "";
                        setDimensionData(newdata);
                      }
                    }}
                    onChange={(e) => {
                      handleDimensionChange(
                        e.target.name,
                        e.target.value.replace(/[^0-9]/g, ""),
                        index
                      );
                    }}
                  />
                </Table.Td>
              
           {!checkdisable?
                <Table.Td className="text-center border flex justify-center">
                  <Trash2
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={(e) => {
                      // if (!spinner) {
                      if (dimensionData?.length > 1) {
                        handleDelete(e, index);
                      } else {
                        handleDelete(e, index);
                        setDimensionData([
                          {
                            item_description: "",
                            weight: "",
                            value: "",
                            quantity: "",
                            length: "",
                            breadth: "",
                            height: "",
                            hsn_code: "",
                          },
                        ]);
                      }
                    }}
                  />
                </Table.Td>:""}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
    </>
  );
};