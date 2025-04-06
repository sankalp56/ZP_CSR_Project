import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const BASE_URL = process.env.Base_URL;

const SolarCard = ({ request }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!request) return null;

  const handleDonateInterest = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `https://api.zpsanglivardaan.in/api/v1/solar/donor-interest`,
        { requestId: request._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error showing interest:", error);
      alert(error.response?.data?.error || "Failed to register interest");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col h-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      {/* Card content */}
      <div className="flex-grow">
        <h3 className="text-lg font-bold">{request.organisationName}</h3>
        <p className="text-gray-600">{request.institutionType}</p>
        <p className="text-sm text-gray-500">
          {request.villageName}, {request.taluka}
        </p>
        <p className="text-sm">
          Solar Demand: <strong>{request.solarDemand}</strong>
        </p>
      </div>
      {/* Button */}
      <button
        onClick={handleDonateInterest}
        className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded transform transition-all duration-300 hover:scale-110 hover:from-blue-600 hover:to-blue-800"
      >
        Interested to Donate
      </button>
    </div>
  );
};

export default SolarCard;
