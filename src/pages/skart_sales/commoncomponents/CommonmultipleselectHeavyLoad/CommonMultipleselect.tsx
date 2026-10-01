import React, { useState, useMemo, useEffect, useCallback } from "react";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
import { commongetrequest } from "../../../../AllServices/services";

const MenuList = (props:any) => {
  const { options, children, maxHeight } = props;
  const height = 35;

  if (!children || children.length === 0) {
    return null;
  }

  return (
    <List
      height={maxHeight}
      itemCount={children.length}
      itemSize={height}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style} key={index}>
          {children[index]}
        </div>
      )}
    </List>
  );
};

const MultiSelectCommon = (props:any) => {
    const {data,multipledata, setmultipledata,errorvalue,fun1,fun2}=props
    // console.log(data,"datamin",multipledata,"datatopost","multidata")
  const [inputValue, setInputValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [franchiseeData, setFranchiseeData] = useState([]);



  const allOptions = useMemo(
    () =>
      data.map((option:any) => ({
        value: option.id,
        label: option.name,
      })),
    [data]
  );

  const filteredOptions = useMemo(
    () => [
      { value: "select-all", label: "Select All" },
      ...allOptions.filter((option:any) =>

        option.label.toLowerCase().includes(inputValue.toLowerCase())
      ),
    ],
    [inputValue, allOptions]
  );

  const handleInputChange = useCallback((newValue:any) => {

    setInputValue(newValue);
  }, []);

  const handleChange = useCallback(
    (newValue:any) => {
      // console.log(newValue,"newvaluehandlechange")
    fun2((pre: any) => ({ ...pre, franchisee_ids:""}));
      if (
        newValue &&
        newValue.some((option:any) => option.value === "select-all")
      ) {
        if (multipledata.length === allOptions.length) {
   
          setmultipledata([])
        //   fun1([])
        } else {
        // console.log(allOptions,"alloptions")
          setmultipledata(allOptions)
        //   fun1(allOptions)
        }
      } else {
    
        // fun1(newValue||[])

        setmultipledata(newValue||[])
      }
    },
    [allOptions, multipledata?.length]
  );


  return (
    <Select
      components={{ MenuList }}
      options={filteredOptions}
      isMulti
      onInputChange={handleInputChange}
      onChange={handleChange}
      value={multipledata}
      className={`z-[100] ${errorvalue ? "border border-red-400" : "border border-none"}  rounded-lg`}
      classNamePrefix="react-select"
      inputValue={inputValue}
    />
  );
};

export default MultiSelectCommon;
