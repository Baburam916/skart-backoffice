import React, { useState, useEffect } from "react";
import Select from "react-select";
import { FixedSizeList as List } from "react-window";
import { commongetrequest } from "../../../../AllServices/services";
import { FormSelect } from "../../../../base-components/Form";
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #d3d3d3", // Add a gray border
    boxShadow: state.isFocused ? "0 0 0 1px gray" : "none", // Add a gray box shadow on focus
    "&:hover": {
      border: "1px solid #d3d3d3", // Ensure the border remains gray on hover
    },
    "&:focus": {
      border: "none", // Ensure the border remains gray on focus
      boxShadow: "0 0 0 1px gray", // Ensure the box shadow remains gray on focus
    },
    "&:active": {
      border: "none", // Ensure the border remains gray on active
      boxShadow: "0 0 0 1px gray", // Ensure the box shadow remains gray on active
    },
  }),
  input: (provided) => ({
    ...provided,
    border: "none", // Remove border from the input itself
    boxShadow: "none", // Remove box shadow from the input itself
  }),
  placeholder: (provided) => ({
    ...provided,
    border: "none", // Remove border from the placeholder
    boxShadow: "none", // Remove box shadow from the placeholder
  }),
  singleValue: (provided) => ({
    ...provided,
    border: "none", // Remove border from the single value
    boxShadow: "none", // Remove box shadow from the single value
  }),
  valueContainer: (provided) => ({
    ...provided,
    border: "none", // Remove border from the value container
    boxShadow: "none", // Remove box shadow from the value container
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    border: "none", // Remove border from the indicators container
    boxShadow: "none", // Remove box shadow from the indicators container
  }),
  menu: (provided, state) => ({
    ...provided,
    zIndex: 9999, // Set a high z-index
  }),
};



const MenuList = ({ options, children, maxHeight }) => {
  return (
    <List
      height={Math.min(options.length * 35, maxHeight)}
      itemCount={options.length}
      itemSize={35}
      width="100%"
    >
      {({ index, style }) => <div style={style}>{children[index]}</div>}
    </List>
  );
};

const SingleSelect = (props:any) => {
    const {data,singlevalue,setSingleValue,fun1}=props
  const [selectedOption, setSelectedOption] = useState(null);


  

  const options = data.map((option:any) => ({
    value: option.id,
    label: option.name,
  }));

  const handleChange = (selectedOption:any) => {
     setSingleValue(selectedOption)
    fun1(selectedOption)
  };
  

  return (
    <>
      <Select
       value={singlevalue}
        onChange={handleChange}
        options={options}
        isClearable={true}
        placeholder="Select an Option"
        components={{ MenuList }}
        styles={customStyles}
      />
    </>
  );
};

export default SingleSelect;
