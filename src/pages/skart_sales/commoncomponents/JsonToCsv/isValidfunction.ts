import React from "react";

interface MyObject {
  [key: string]: string | number;
}

export const isValid = (obj: any,value:any): boolean => {
    let count=0
  for (const key in obj) {
    if (obj[key]) {
      count++ 
    }
  }
  if(count==value){
    return true
  }else{
    return false
  } // If all values are empty, return true
};
