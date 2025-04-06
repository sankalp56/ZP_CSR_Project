import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
const BASE_URL = process.env.Base_URL;

const DepartmentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fulfillmentInputs, setFulfillmentInputs] = useState({});

  useEffect(() => {
    const fetchDepartmentRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://api.zpsanglivardaan.in/api/v1/solar/department-requests`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests);
        const initialInputs = {};
        response.data.requests.forEach(request => {
          initialInputs[request._id] = request.fulfillmentPercentage;
        });
        setFulfillmentInputs(initialInputs);
      } catch (err) {
        setError('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentRequests();
  }, []);

  const handleInputChange = (requestId, value) => {
    setFulfillmentInputs(prevInputs => ({
      ...prevInputs,
      [requestId]: value,
    }));
  };

  const handleUpdateFulfillment = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedPercentage = fulfillmentInputs[requestId];
      await axios.put(
        `https://api.zpsanglivardaan.in/api/v1/solar/${requestId}/update-fulfillment`,
        { fulfillmentPercentage: updatedPercentage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === requestId
            ? { ...request, fulfillmentPercentage: updatedPercentage }
            : request
        )
      );
    } catch (err) {
      setError('Failed to update fulfillment percentage.');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://api.zpsanglivardaan.in/api/v1/solar/head-delete/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
    } catch (err) {
      setError('Failed to delete request.');
      console.error(err);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Department Dashboard</h2>
      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No requests found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {requests.map((request) => (
            <div key={request._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800">{request.organisationName}</h3>
                <p className="text-gray-600">{request.villageName}, {request.taluka}</p>
                <p className="text-gray-700 mt-2">
                  Solar Demand: <span className="font-medium">{request.solarDemand}</span>
                </p>
                <div className="mt-2">
                  <label className="text-gray-700">
                    Fulfillment Percentage:
                    <input
                      type="number"
                      value={fulfillmentInputs[request._id]}
                      onChange={(e) => handleInputChange(request._id, e.target.value)}
                      className="ml-2 p-1 border rounded w-20"
                      min="0"
                      max="100"
                    />
                  </label>
                  <button
                    onClick={() => handleUpdateFulfillment(request._id)}
                    className="ml-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                </div>

                <h4 className="text-lg font-medium text-gray-800 mt-4">Interested Donors:</h4>
                {request.donors.length === 0 ? (
                  <p className="text-gray-600">No donors yet.</p>
                ) : (
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {request.donors.map((donor) => (
                      <li key={donor.donorId._id} className="text-gray-700">
                        <span className="font-medium">
                          {donor.donorId.fname} {donor.donorId.lname}
                        </span>{' '}
                        - <a href={`mailto:${donor.donorId.email}`} className="text-blue-500 hover:underline">
                          {donor.donorId.email}
                        </a>{' '}
                        - {donor.amount} units
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  onClick={() => handleDeleteRequest(request._id)}
                  className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete Request
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentDashboard;
