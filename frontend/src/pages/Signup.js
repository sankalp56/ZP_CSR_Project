import React from "react";
import signupImg from "../assets/csr_image.jpeg";
import Template from "../components/Template";

const Signup = ({ setIsLoggedIn }) => {
  return (
    <Template
      title="Join the mission to help and get help with ease"
      desc1="Be a part of a platform where kindness meets need."
      desc2="Connect, support, and make a difference — one step at a time."
      image={signupImg}
      formtype="signup"
      setIsLoggedIn={setIsLoggedIn}
    />
  );
};

export default Signup;