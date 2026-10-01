import {unparse} from "papaparse"
import { CurrentformattedDate } from "../Commonfunctions/getcurrentdate";

export const jsontocsv = async (data: any, forwhat: string) => {
  // console.log(data,"datatomap")

  try {
    // const data = await getPassengerListData(id);
    //  console.log(data,"comingdata")
    const csv = unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${forwhat}_${CurrentformattedDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.removeChild(link);
  } catch (error: any) {
    console.log(error.message);
  }
};  