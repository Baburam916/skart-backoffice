import React from "react";

const loaderbgscooter = "/images/laoderbg.png";
const loaderScooter = "/images/loaderScooter.png";
const loadertyre = "/images/tyre.png";

export default function IsLoading(props: any) {
  const { styles } = props;
  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] ${styles ? styles : ""}`}>
      <div className="loaderbgInner">
        <div
          className="relative loaderbg"
          style={{ backgroundImage: `url(${loaderbgscooter})` }}
        >
          <div className="loaderScooter left-[-3px] relative w-[80px] m-auto top-[18px]">
            <figure className="loaderScooterr relative z-[1]">
              <img src={loaderScooter} className="w-[145px]" alt="loading" />
            </figure>
            <div className="leftTyre absolute left-[6px] bottom-[-11px]">
              <img src={loadertyre} className="w-[28px] wheelLoader" alt="" />
            </div>
            <div className="rightTyre absolute right-[-5px] bottom-[-11px]">
              <img src={loadertyre} className="w-[28px] wheelLoader" alt="" />
            </div>
          </div>
        </div>
      </div>
      <p className="flex mt-4 font-semibold text-gray-500 text-[15px] tracking-[2px] uppercase">
        Loading
        <span className="loading loading04 ml-1">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    </div>
  );
}
