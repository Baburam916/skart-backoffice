import React from "react";
import Button from "../../../../base-components/Button";
import { ChevronLeft } from "lucide-react";


function BackButton() {


  const goBack = () => {
    // console.log(window.history)
   window.history.back(); // Go back to the previous page
  };

  return (
    <Button  onClick={goBack} className=" mr-1 text-primary p-1   bg-none mt-2">
    <ChevronLeft />  Go Back
    </Button>
    // <button onClick={goBack} className=" mr-1 text-primary p-1   bg-none mt-2">
    //   <div className="flex justify-between">
    //     <ChevronLeft /> <span className="mt-1"> Go Back</span>
    //   </div>
    // </button>
  );
}

export default BackButton;
