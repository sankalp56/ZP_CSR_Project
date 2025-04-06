import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
const BASE_URL = process.env.Base_URL;

const SignupForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    panNumber: "",
    GSTNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("Appealer");
  const [donorType, setDonorType] = useState("");

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (role === "Donor") {
      if (!donorType) {
        toast.error("Please select Donor Type");
        return;
      }

      if (donorType === "person" && !formData.panNumber.trim()) {
        toast.error("PAN Number is required for Donor - Person");
        return;
      }

      if (donorType === "organization") {
        if (!formData.panNumber.trim() || !formData.GSTNumber.trim()) {
          toast.error(
            "PAN and GST Number are required for Donor - Organization"
          );
          return;
        }
      }
    }

    const finalData = {
      fname: formData.fname,
      lname: formData.lname,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role,
      ...(role === "Donor" && {
        donorType,
        panNumber: formData.panNumber,
        ...(donorType === "organization" && {
          GSTNumber: formData.GSTNumber,
        }),
      }),
    };

    try {
      const response = await fetch(`https://api.zpsanglivardaan.in/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success("Account Created Successfully");
        setIsLoggedIn(true);
        if (role === "Appealer") navigate("/appealer-dashboard")
        else  if(role =="Donor") navigate("/demands")
       
      } else {
        toast.error(data.error || "Signup failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Signup error:", error);
    }
  };

return (
  <div className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-br from-richblack-800 to-richblack-900 rounded-2xl shadow-2xl text-richblack-5 animate-fade-in">
    {/* User Role Tabs */}
    <div className="flex justify-center bg-richblack-700 p-1 gap-x-4 rounded-full max-w-max mx-auto mb-6">
      {["Appealer", "Donor"].map((r) => (
        <button
          key={r}
          className={`py-2 px-6 rounded-full font-semibold transition duration-300 ${
            role === r
              ? "bg-yellow-400 text-richblack-900 shadow-md"
              : "bg-transparent text-richblack-300 hover:text-yellow-300"
          }`}
          onClick={() => {
            setRole(r);
            if (r === "Appealer") setDonorType("");
          }}
        >
          {r}
        </button>
      ))}
    </div>

    {/* Donor Type Selection */}
    {role === "Donor" && (
      <div className="flex justify-center gap-6 mb-6">
        {["person", "organization"].map((type) => (
          <div
            key={type}
            onClick={() => setDonorType(type)}
            className={`cursor-pointer px-6 py-3 rounded-xl border-2 text-center capitalize font-semibold transition-all duration-300 ease-in-out ${
              donorType === type
                ? "border-yellow-400 bg-yellow-50 text-richblack-900 shadow-lg scale-105"
                : "border-richblack-600 text-richblack-300 hover:border-yellow-300 hover:text-yellow-200"
            }`}
          >
            {type}
          </div>
        ))}
      </div>
    )}

    {/* Form */}
    <form onSubmit={submitHandler} className="space-y-5">
      <div className="flex gap-4">
        <label className="w-full">
          <p className="mb-1 text-sm font-medium">First Name</p>
          <input
            required
            type="text"
            name="fname"
            value={formData.fname}
            onChange={changeHandler}
            className="w-full p-3 rounded-md bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="John"
          />
        </label>

        <label className="w-full">
          <p className="mb-1 text-sm font-medium">Last Name</p>
          <input
            required
            type="text"
            name="lname"
            value={formData.lname}
            onChange={changeHandler}
            className="w-full p-3 rounded-md bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="Doe"
          />
        </label>
      </div>

      <label>
        <p className="mb-1 text-sm font-medium">Email Address</p>
        <input
          required
          type="email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
          className="w-full p-3 rounded-md bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="john@example.com"
        />
      </label>

      <label>
        <p className="mb-1 text-sm font-medium">Phone Number</p>
        <input
          required
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={changeHandler}
          className="w-full p-3 rounded-md bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          placeholder="9876543210"
        />
      </label>

      {/* Donor Specific Fields */}
      {role === "Donor" && (
        <>
          <label>
            <p className="mb-1 text-sm font-medium">PAN Number</p>
            <input
              required={donorType === "person" || donorType === "organization"}
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={changeHandler}
              className="w-full p-3 rounded-md bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              placeholder="ABCDE1234F"
            />
          </label>

          {donorType === "organization" && (
            <label>
              <p className="mb-1 text-sm font-medium">GST Number</p>
              <input
                required
                type="text"
                name="GSTNumber"
                value={formData.GSTNumber}
                onChange={changeHandler}
                className="w-full p-3 rounded-md bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                placeholder="22ABCDE1234F1Z5"
              />
            </label>
          )}
        </>
      )}

      <div className="flex gap-4">
        <label className="w-full relative">
          <p className="mb-1 text-sm font-medium">Password</p>
          <input
            required
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={changeHandler}
            className="w-full p-3 pr-10 rounded-md bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="********"
          />
          <span
            className="absolute right-3 top-10 text-sm text-yellow-300 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </label>

        <label className="w-full relative">
          <p className="mb-1 text-sm font-medium">Confirm Password</p>
          <input
            required
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={changeHandler}
            className="w-full p-3 pr-10 rounded-md bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            placeholder="********"
          />
          <span
            className="absolute right-3 top-10 text-sm text-yellow-300 cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-richblack-900 font-semibold py-3 rounded-md mt-6 shadow-lg transition duration-300 ease-in-out"
      >
        Create Account
      </button>
    </form>
  </div>
);

};

export default SignupForm;