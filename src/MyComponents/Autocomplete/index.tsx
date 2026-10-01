import React, { useState, useCallback } from "react";
import { masterGET } from "../../AllServices/masterServices";
import { FormInput } from "../../base-components/Form";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Search } from "lucide-react";

const debounce = (func: any, delay: number) => {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const index = (props: any) => {
  const { endpoint, setEntityId, entityId, setPickDataForEdit } = props;

  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchSuggestions = useCallback(
    debounce(async (inputValue: any) => {
      try {
        if (inputValue) {
          setLoading(true);
          const response: any = await masterGET(
            `/api/v1/master/parent-list?key=${inputValue}&offset=0&limit=20`
          );
          if (response?.status === 200) {
            setFilteredSuggestions(response?.data?.data || []);
            setShowSuggestions(true);
          } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
          }
        } else {
          setFilteredSuggestions([]);
          setShowSuggestions(false);
        }
      } catch {
        setFilteredSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    }, 1000),
    []
  );

  const handleChange = (e: any) => {
    setEntityId((prev: any) => ({ ...prev, party_name: e.target.value }));
    fetchSuggestions(e.target.value);
  };

  const onClick = (data: any) => {
    setFilteredSuggestions([]);
    setEntityId((prev: any) => ({ ...prev, party_id: data?.party_id, party_name: data?.party_name }));
    setPickDataForEdit((prev: any) => ({ ...prev, parent_id: data?.party_id }));
    setShowSuggestions(false);
  };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length > 0 ? (
      <div className="relative top-0 overflow-auto h-20" onMouseLeave={() => setShowSuggestions(false)}>
        <ul className="border-gray-300 border-t-0 bg-white rounded w-full absolute top-1 z-10">
          {loading && (
            <div className="text-gray-400 p-1.5 text-sm">
              <LoadingIcon icon="oval" className="w-4 h-4 inline" />
            </div>
          )}
          {filteredSuggestions.map((elem, index) => (
            <li
              className="cursor-pointer text-gray-400 text-sm font-medium p-1 px-2 border-b border-x"
              key={index}
              onClick={() => onClick(elem)}
            >
              {elem?.party_name}
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="text-gray-400 p-1.5 text-sm">No Data Found</div>
    );
  };

  return (
    <>
      <FormInput
        type="text"
        onChange={handleChange}
        className="w-full rounded-0 h-10 mt-2"
        value={entityId?.party_name || ""}
      />
      <Search className="w-10 h-5 absolute top-[37px] right-[7px] text-[#0000006e]" />
      {showSuggestions && entityId?.party_name && <SuggestionsListComponent />}
    </>
  );
};

export default index;
