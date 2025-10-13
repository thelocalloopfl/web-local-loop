"use client";
import React from "react";
import NewsletterBox from "./NewsLetterBox";

const BottomBanner: React.FC = () => {
  return (
    <>
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-3xl text-white text-center font-bold mt-10">LocalLoop Newsletter</h2>
      <div className="mt-4">
        <NewsletterBox/>
      </div>
    </div>
     
    </>
  );
};

export default BottomBanner;
