import React from 'react'

export default function IsError() {
  return (
    <div className="flex items-center justify-center h-screen">
      <img
        src={"/images/internetError.jpg"}
        alt="Internet Error"
        className="w-4/12 rounded-full opacity-50"
      />
    </div>
  );
}
