import { unparse } from "papaparse";

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

export const disableSymbols = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const prohibitedSymbols = /[,.\/\\|'"`;:{}[\]()*&^%$?#@!`~+=<>_-]/;

  if (
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey &&
    e.key.length === 1 &&
    prohibitedSymbols.test(e.key)
  ) {
    e.preventDefault();
  }
};

export const formatDate = (dateString: any) => {
  if (!dateString) {
    return "-";
  }
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
};

export const formatDateWithoutTime = (dateString: any) => {
  if (!dateString) {
    return "-";
  }
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", options);
};

export const onlyNumbers = (e: KeyboardEvent) => {
  const prohibitedSymbolsAndLetters =
    /[a-zA-Z,.\/\\|'"`;:{}[\]()*&^%$?#@!`~+=<>_-]/;
  if (
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey &&
    e.key.length === 1 &&
    prohibitedSymbolsAndLetters.test(e.key)
  ) {
    e.preventDefault();
  }
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  let day = today.getDate();

  month = month < 10 ? `0${month}` : month;
  day = day < 10 ? `0${day}` : day;

  return `${year}-${month}-${day}`;
};

export const convertJSONtoCSV = async (data: any = [], fileName: string) => {
  try {
    const csv = unparse(data);
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}` + " " + getCurrentDate();
    document.body.appendChild(link);
    link.click();
    document.removeChild(link);
  } catch (error: any) {
    console.log(error.message);
  }
};

export const handlePaste = (value: any, e: any, maxLength: any) => {
  const pastedData = value + e.clipboardData.getData("Text");
  const totalLength = pastedData.length;

  if (totalLength > maxLength) {
    e.preventDefault();
    return pastedData.slice(0, maxLength);
  }

  return pastedData;
};

export function indianFormat(number?: any) {
  const [integerPart, decimalPart] = Number(number).toFixed(3).split(".");
  const lastThreeDigits = integerPart.slice(-3);
  const otherDigits = integerPart.slice(0, -3);
  const formattedInteger =
    otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherDigits ? "," : "") +
    lastThreeDigits;
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export function foreignFormat(number?:any) {
  const [integerPart, decimalPart] = Number(number)?.toFixed(2)?.split(".");
  const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
}



export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[today.getMonth()];
  const day = String(today.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
}

export function downloadAttachment(url: string, filename: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.target = "_blank";
  anchor.click();
  anchor.remove();
}

export function convertUTCtoIST(dateString: any) {
  // Parse the input date string (assuming it's in UTC)
  const utcDate = new Date(dateString);
  // Get the UTC time in milliseconds and add the IST offset (5 hours 30 minutes)
  const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
  const istTime = new Date(utcDate.getTime() + istOffset);
  // Format the IST date into the desired format
  const day = String(istTime.getDate()).padStart(2, "0");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[istTime.getMonth()];
  const year = istTime.getFullYear();
  let hours = istTime.getHours();
  const minutes = String(istTime.getMinutes()).padStart(2, "0");
  const seconds = String(istTime.getSeconds()).padStart(2, "0");
  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 24-hour to 12-hour format
  const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  return formattedDate;
}

export const validateEmail = (email: any = "") => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};