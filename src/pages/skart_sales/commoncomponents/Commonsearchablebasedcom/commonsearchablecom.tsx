import React, { useState, useEffect } from "react";
import { commongetrequest } from "../../../../AllServices/services";
import { useDebounce } from "../JsonToCsv/useDebounce/useDebounce";
import { FormInput } from "../../../../base-components/Form";
import { useLogin } from "../LoginContextProvider/LoginContextProvider";
const SearchableComp = (props: any) => {
  const {
    apiEndpoint,
    placeholder,
    zIndex,
    selectedfranchisedata,
    setSelectedfranchisedata,
    fun1,
    fun2,
    border,
  } = props;
  const [query, setQuery] = useState(
    selectedfranchisedata?.franchisee_name || ""
  );
  const [isUserTyping, setIsUserTyping] = useState(true); // Track whether the user is typing
  const debouncedSearchTerm = useDebounce<any>(
    selectedfranchisedata?.franchisee_name,
    500
  );
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { userdata } = useLogin();

  useEffect(() => {
    if (isUserTyping && debouncedSearchTerm.length > 2) {
      // Trigger API call only when query length is greater than 2 and user is typing
      getdata();
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, apiEndpoint, isUserTyping]);

  const getdata = async () => {
    try {
      setIsLoading(true);
      const res = await commongetrequest(
        `${apiEndpoint}?key=${debouncedSearchTerm}&sales_id=${userdata?.mapped_id}`
      );
      if (res?.status === 200) {
        setData(res?.data?.data || []);
        setShowSuggestions(true);
      } else {
        setData([]);
        setShowSuggestions(false);
      }
    } catch (err: any) {
      console.log(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: any) => {
    setIsUserTyping(false); // Stop the API call from being triggered
    setQuery(item?.franchisee_name);
    fun1(item); // Set the query to the selected item
    setSelectedfranchisedata(item);
    if (fun2) {
      fun2();
    }

    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsUserTyping(true); // Reset typing state when the user types again
    setSelectedfranchisedata((pre: any) => ({
      ...pre,
      franchisee_name: value,
    }));
    if (!value) {
      setSelectedfranchisedata({
        franchisee_id: "",
        franchisee_name: "",
      });
    }
    fun2();
  };

  return (
    <div className="relative w-full  mx-auto ">
      <FormInput
        type="text"
        className={`w-full ${border ? "border border-red-400" : ""}`}
        placeholder={placeholder || "Search..."}
        value={selectedfranchisedata?.franchisee_name}
        onChange={handleInputChange} // Call this on input change
      />

      {isLoading && (
        <div className="absolute top-[80%] left-0 right-0 bg-white p-2 border border-gray-300 mt-1">
          Loading...
        </div>
      )}

      {showSuggestions && !isLoading && (
        <ul
          className={`absolute top-[80%] left-0 right-0 bg-white border border-gray-300 mt-1 rounded max-h-60 overflow-y-auto z-${
            zIndex ? zIndex : "40"
          }`}
        >
          {data?.length > 0 ? (
            data?.map((item: any, index: number) => (
              <li
                key={index}
                className="p-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => handleSelect(item)} // Handle selection
              >
                {item?.franchisee_name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableComp;
