import React from "react";
import frameImage from "../assets/frame.png";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

const Template = ({ title, desc1, desc2, image, formtype, setIsLoggedIn }) => {
  return (
    <div className="flex justify-between items-center w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 flex-col md:flex-row">
      
      {/* Text and Form Section */}
      <div className="w-11/12 max-w-[450px] mx-auto md:mx-0">
        <h1 className="text-gray-900 font-bold text-[1.875rem] leading-[2.375rem]">
          {title}
        </h1>

        <p className="text-[1.125rem] leading-[1.625rem] mt-4">
          <span className="text-gray-700">{desc1}</span>
          <br />
          <span className="text-gray-500 italic">{desc2}</span>
        </p>

        {formtype === "signup" ? (
          <SignupForm setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <LoginForm setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>

      {/* Single Image Section */}
   {/* Responsive Image Section */}
<div className="relative w-full max-w-[600px] aspect-[6/5] md:w-[600px] md:h-[500px] flex justify-center items-center mx-auto mt-8 md:mt-0">
  <img
    src={image}
    alt="Overlay"
    loading="lazy"
    className="absolute w-full h-full object-contain translate-x-2 translate-y-2"
  />
</div>

    </div>
  );
};

export default Template;