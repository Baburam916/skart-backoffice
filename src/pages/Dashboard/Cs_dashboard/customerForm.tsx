import React, { useEffect, useState } from "react";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import { Textarea } from "flowbite-react";
import SellBuyForm from "../../skart_sales/SpotEnquiry/SpotEnquiryModal/spotpriceChargeform";
import BuyForm from "./CsbuysellForm";
import { CheckNumberOrEMail } from "../../skart_sales/commoncomponents/CheckNumberorMail/commoncheckNumberoremail";
import { useAlert } from "../../../ContextProvider/AlertContext";
import {
  commongetrequest,
  commonpostrequest,
} from "../../../AllServices/services";
import CSForm from "./CsbuysellForm";
import { MdEmail } from "react-icons/md";

const CustomerForm = ({
  fdata,
  incoterm,
  statusdata,
  intbuycharges,
  name,
  getparticulardata,
  allerrors,
  datatopost,
  setDataToPost,
  handledatatopost,
  chargesList,
  spotData,
  buycharges,
  setBuyCharges,
  sellingcharges,
  setSellingCharges,
  buychargesadd,
  setBuyChargesadd,
  sellingchargesadd,
  setSellingChargesadd,
  toggleadd,
  setToggleadd,
  currencydata,
  intsellingcharges,
  exchangedata,
  setExchangedata,
  totalbuy,
  totalSell,
  toggle,
  setToggle,
  alltypedata,
  franchisedata,
  agentdetails,
  forwhat,
  setAgentDetails,
  allvendordropdowndata,
  handleemailModal,
  currencyname,
  singlefranchiseedata,
  exchangedataSell,
  setExchangedataSell,

}: any) => {
  const { showAlert } = useAlert();
  const [exchangeSellLocked, setExchangeSellLocked] = useState(false);
  useEffect(() => {
    getbuycharges();
  }, []);

  const getbuycharges = async () => {
    try {
      const buychargesres = await commongetrequest(
        `booking/booking-buy-sell/${datatopost?.pickup_id}`
      );
      if (buychargesres?.status == 200) {
        const data = buychargesres?.data?.buying;
        const sellingdata = buychargesres?.data?.selling;
        if (data?.length >= 1) {
          const newdata = data?.map((item: any) => ({
            ...item,
            party_name: allvendordropdowndata?.find(
              (item2: any) => item2?.vendor_id == item?.party
            )?.vendor_name,
          }));

          setBuyCharges(newdata);
          const ids = data?.map((item: any) => {
            if (item?.party_type == 3) {
              return item?.party;
            }
            return;
          });
          const uniqueIds = [...new Set(ids)];
          const agentres = await commonpostrequest(
            "master/address-multiple-customer",
            { party_ids: uniqueIds || [] }
          );
          if (agentres?.status == 200) {
            setAgentDetails(agentres?.data?.data || []);
          } else {
            setAgentDetails([]);
          }
        } else {
          setBuyCharges([
            {
              ...intbuycharges,
              weight: datatopost?.chargeable_weight,
              job_id: datatopost?.job_id,
            },
          ]);
        }

        if (sellingdata?.length >= 1) {
          setSellingCharges(sellingdata);
          const uniqueForeign: any[] = [];
          sellingdata.forEach((charge: any) => {
            const cId = String(charge?.currency || "24");
            if (cId && cId !== "24" && !uniqueForeign.find((c: any) => c.currency_id === cId)) {
              uniqueForeign.push({ currency_id: cId, ex_rate: String(charge?.ex_rate || "") });
            }
          });
          setExchangedataSell([
            { id: "1", currency_id: "24", ex_rate: "1" },
            { id: "2", currency_id: uniqueForeign[0]?.currency_id || "", ex_rate: uniqueForeign[0]?.ex_rate || "" },
            { id: "3", currency_id: uniqueForeign[1]?.currency_id || "", ex_rate: uniqueForeign[1]?.ex_rate || "" },
          ]);
          setExchangeSellLocked(true);
        } else {
          setSellingCharges([
            {
              ...intsellingcharges,
              job_id: datatopost?.job_id,
            },
          ]);
          setExchangeSellLocked(true);
        }
      } else {
        setBuyCharges(
          buychargesres?.data?.data || [
            {
              ...intbuycharges,
              weight: datatopost?.chargeable_weight,
              job_id: datatopost?.job_id,
            },
          ]
        );
      }
    } catch (err: any) {
      console.log(err?.message);
    }
  };

  return (
    <div>
      {forwhat && forwhat != 3 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="">
            <FormLabel htmlFor="vertical-form-1 mb-1">Customer Name</FormLabel>
            <FormInput
              name="customer_name"
              disabled
              value={
                getparticulardata("f", datatopost?.pickup_franchisee_id, fdata)
                  ?.franchisee_name || ""
              }
              type="text"
            />
          </div>

          {/* <div className="">
          <FormLabel htmlFor="vertical-form-1 mb-1">Agent Name</FormLabel>
          <FormInput
            name="agent_name"
            value={datatopost?.agent_name || ""}
            onChange={handledatatopost}
            type="text"
          />
        </div>
        <div className="">
          <FormLabel htmlFor="vertical-form-1 mb-1">
            Agent Contact Number
          </FormLabel>
          <FormInput
            name="agent_contact_no"
            maxLength={12}
            onBlur={(e: any) => {
              const value = e.target.value;
              if (!CheckNumberOrEMail(value, "num")) {
                showAlert("Please provide a valid contact number", "warning");
                setDataToPost((pre: any) => ({ ...pre, agent_contact_no: "" }));
              }
            }}
            value={datatopost?.agent_contact_no || ""}
            onChange={handledatatopost}
            type="text"
          />
        </div>
        <div>
          <FormLabel htmlFor="vertical-form-1 mb-1">Agent Email Id</FormLabel>
          <FormInput
            name="agent_email_id"
            onBlur={(e: any) => {
              const value = e.target.value;
              if (!CheckNumberOrEMail(value, "email")) {
                showAlert("Please provide a valid eamil id", "warning");
                setDataToPost((pre: any) => ({ ...pre, agent_email_id: "" }));
              }
            }}
            value={datatopost?.agent_email_id || ""}
            onChange={handledatatopost}
            type="text"
          />
        </div> */}

          <div className="">
            <FormLabel htmlFor="vertical-form-1 mb-1">HAWB No.</FormLabel>
            <FormInput
              name="hawb_no"
              disabled
              value={datatopost?.airwaybilno || ""}
              type="text"
            />
          </div>
          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">MAWB No</FormLabel>
            <FormInput
              name="master"
              disabled
              value={datatopost?.master || ""}
              type="text"
            />
          </div>
          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">
              CONTACT PERSON NAME
            </FormLabel>
            <FormInput
              disabled
              name="contact_person"
              value={
                datatopost?.contact_person_details[0]?.contact_person || ""
              }
              onChange={(e: any) => {
                const newdata = { ...datatopost?.contact_person_details[0] };
                newdata.contact_person = e.target.value;
                setDataToPost((pre: any) => ({
                  ...pre,
                  contact_person_details: [newdata],
                }));
              }}
              type="text"
            />
          </div>

          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">PHONE NUMBER</FormLabel>
            <FormInput
              name="contact_no"
              disabled
              maxLength={12}
              onBlur={(e: any) => {
                const value = e.target.value;
                if (!CheckNumberOrEMail(value, "num")) {
                  showAlert("Please provide a valid contact number", "warning");
                  setDataToPost((pre: any) => ({
                    ...pre,
                    contact_person_details: [
                      {
                        ...datatopost.contact_person_details[0],
                        mobile_no: "",
                      },
                    ],
                  }));
                }
              }}
              value={datatopost?.contact_person_details[0]?.mobile_no || ""}
              onChange={(e: any) => {
                const newdata = { ...datatopost?.contact_person_details[0] };
                newdata.mobile_no = e.target.value;
                setDataToPost((pre: any) => ({
                  ...pre,
                  contact_person_details: [newdata],
                }));
              }}
              type="text"
            />
          </div>
          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">EMAIL ID</FormLabel>
            <FormInput
              disabled
              name="email_id"
              onBlur={(e: any) => {
                const value = e.target.value;
                if (!CheckNumberOrEMail(value, "email")) {
                  showAlert("Please provide a valid eamil id", "warning");
                  setDataToPost((pre: any) => ({
                    ...pre,
                    contact_person_details: [
                      {
                        ...datatopost.contact_person_details[0],
                        email: "",
                      },
                    ],
                  }));
                }
              }}
              value={datatopost?.contact_person_details[0]?.email || ""}
              onChange={(e: any) => {
                const newdata = { ...datatopost?.contact_person_details[0] };
                newdata.email = e.target.value;
                setDataToPost((pre: any) => ({
                  ...pre,
                  contact_person_details: [newdata],
                }));
              }}
              type="text"
            />
          </div>

          {/* <div>
          <FormLabel htmlFor="vertical-form-1 mb-1">Last Update</FormLabel>
          <FormInput
            name="last_update"
            value={datatopost?.last_update || ""}
            onChange={handledatatopost}
            type="text"
          />
        </div> */}

          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">CONSIGNEE NAME</FormLabel>
            <FormInput
              name="consignee_name"
              value={datatopost?.consignee_name || ""}
              onChange={handledatatopost}
              type="text"
            />
          </div>
          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">
              CONSIGNEE CONTACT NUMBER
            </FormLabel>
            <FormInput
              name="consignee_contact_number"
              maxLength={12}
              onBlur={(e: any) => {
                const value = e.target.value;
                if (value && !CheckNumberOrEMail(value, "num")) {
                  showAlert("Please provide a valid contact number", "warning");
                  setDataToPost((pre: any) => ({
                    ...pre,
                    consignee_contact_number: "",
                  }));
                }
              }}
              value={datatopost?.consignee_contact_number || ""}
              onChange={handledatatopost}
              type="text"
            />
          </div>
          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">
              CONSIGNEE EMAIL{" "}
            </FormLabel>
            <FormInput
              name="consignee_email"
              onBlur={(e: any) => {
                const value = e.target.value;
                if (value && !CheckNumberOrEMail(value, "email")) {
                  showAlert("Please provide a valid eamil id", "warning");
                  setDataToPost((pre: any) => ({
                    ...pre,
                    consignee_email: "",
                  }));
                }
              }}
              value={datatopost?.consignee_email || ""}
              onChange={handledatatopost}
              type="text"
            />
          </div>
          {/* <div>
          <FormLabel htmlFor="vertical-form-1 mb-1">Additional cost</FormLabel>
          <FormInput
            name="add_cost"
            onBlur={(e: any) => {
              const value = e.target.value;
              if (!CheckNumberOrEMail(value, "num")) {
                showAlert("Please provide a valid number", "warning");
                setDataToPost((pre: any) => ({ ...pre, add_cost: "" }));
              }
            }}
            value={datatopost?.add_cost || ""}
            onChange={handledatatopost}
            type="text"
          />
        </div> */}
          <div>
            <FormLabel htmlFor="vertical-form-1 mb-1">
              CHANGE OF INCO TERM
            </FormLabel>
            <FormSelect
              name="inco_term"
              value={datatopost?.inco_term || ""}
              className={`${
                allerrors?.inco_term ? "border border-red-400" : ""
              }`}
              onChange={handledatatopost}
            >
              <option value="">Select</option>
              {incoterm?.map((item: any) => (
                <option value={item?.id}>{item?.name}</option>
              ))}
            </FormSelect>
          </div>
        </div>
      ) : (
        ""
      )}
      {forwhat && forwhat == 1 ? (
        <div className="space-y-6 mt-4">
          {agentdetails?.map((party: any, partyIndex: number) => (
            <div key={partyIndex} className="space-y-4">
              {party?.addresses?.length >= 1 ? (
                <div className="flex">
                  {" "}
                  <h2>PARTY: </h2>
                  <h2 className=" font-semibold text-gray-800 ml-2">
                    {party.party_name}
                  </h2>
                </div>
              ) : (
                ""
              )}
              {party?.addresses?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border md:grid lg:grid grid-cols-4 gap-4 rounded-md shadow-sm"
                >
                  <div>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      OVERSEAS AGENT NAME ({index + 1})
                    </FormLabel>
                    <FormInput
                      type="text"
                      value={item.contact_person_name}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      OVERSEAS AGENT EMAIL ({index + 1})
                    </FormLabel>
                    <FormInput
                      type="email"
                      value={item.contact_person_email}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <FormLabel className="block text-sm font-medium text-gray-700">
                      OVERSEAS AGENT CONTACT ({index + 1})
                    </FormLabel>
                    <FormInput
                      type="tel"
                      value={item.contact_person_contact}
                      readOnly
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      {forwhat == 1 ? (
        <div>
          <FormLabel>OLD CHARGES</FormLabel>
          <CSForm
            chargesdata={chargesList}
            isRead={true}
            // spotData={pickDataforForm}
            sellingcharges={sellingcharges}
            setSellingCharges={setSellingCharges}
            buycharges={buycharges}
            setBuyCharges={setBuyCharges}
            franchiseedata={franchisedata || []}
            allvendordropdowndata={allvendordropdowndata}
            // selectedfranchisedata={selectedfranchisedata}
            // setSelectedfranchisedata={setSelectedfranchisedata}
            spotData={{ forwhat: "pricing" }}
            currencydata={currencydata}
            // fun1={fun1}
            // funtoempty={funtoempty}
            exchangedata={exchangedata}
            setExchangedata={setExchangedata}
            totalbuy={totalbuy}
            totalSell={totalSell}
            toggle={toggle}
            setToggle={setToggle}
            alltypedata={alltypedata}
            forwhat={"pricing"}
            // hasUpdated={hasUpdated}
            // setHasUpdated={setHasUpdated}
          />
        </div>
      ) : (
        ""
      )}
      {forwhat == 1 ? (
        <div className="mt-8">
          <FormLabel>ADDITIONAL COST</FormLabel>
          <SellBuyForm
            singlefranchiseedata={singlefranchiseedata}
            exchangedataSell={exchangedataSell}
            setExchangedataSell={setExchangedataSell}
            disableExchangeSell={true}
            importBookingType={datatopost?.import_booking}
            chargesdata={
              toggleadd == 1
                ? chargesList?.filter((item: any) => {
                    const exists = sellingcharges?.some(
                      (item2: any) =>
                        Number(item2?.charge_id) == Number(item?.ref_sell_id),
                    );

                    return !exists;
                  })
                : chargesList?.filter((item: any) => {
                    const exists = buycharges?.some(
                      (item2: any) =>
                        Number(item2?.charge_id) == Number(item?.charge_id),
                    );

                    return !exists;
                  })
            }
            // isRead={true}
            // spotData={pickDataforForm}
            sellingcharges={sellingchargesadd}
            setSellingCharges={setSellingChargesadd}
            buycharges={buychargesadd}
            setBuyCharges={setBuyChargesadd}
            // franchiseedata={pickDataforForm?.franchiseedata || []}
            // selectedfranchisedata={selectedfranchisedata}
            // setSelectedfranchisedata={setSelectedfranchisedata}
            currencydata={currencydata}
            // fun1={fun1}
            // funtoempty={funtoempty}
                      
            exchangedata={exchangedata}
            setExchangedata={setExchangedata}
            totalbuy={totalbuy}
            totalSell={totalSell}
            toggle={toggleadd}
            setToggle={setToggleadd}
            alltypedata={alltypedata}
            forwhat={"pricing"}
            spotData={{
              forwhat: "pricing",
              id: datatopost?.enquiry_id,
              weight: spotData?.weight || 1,
            }}
            currencyname={currencyname}
            singlefranchiseedata={singlefranchiseedata}
          />
        </div>
      ) : (
        ""
      )}
      <div>
        {/* <BuyForm
          chargesdata={chargesList}
          spotData={{ weight: "" }}
          // sellingcharges={sellingcharges}
          // setSellingCharges={setSellingCharges}
          buycharges={buycharges}
          setBuyCharges={setBuyCharges}
          currencydata={currencydata}
          exchangedata={exchangedata}
          setExchangedata={setExchangedata}
          totalbuy={totalbuy}
          totalSell={totalSell}
          toggle={toggle}
          setToggle={setToggle}
          alltypedata={alltypedata}
        /> */}
      </div>
    </div>
  );
};

export default CustomerForm;
