import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AppealerDashboard = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    organisationName: '',
    institutionType: '',
    villageName: '',
    taluka: '',
    solarDemand: '',
    district: '',
  });

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const institutionTypes = [
    'School',
    'Veterinary Hospital',
    'Primary Health Center',
    'Health Subcenter',
    'Anganwadi',
    'Other',
  ];

  // Fetch user's requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/v1/solar/requests/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.requests || []);
      } catch (err) {
        console.error(err);
        //setError('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:4000/api/v1/solar/create',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests([...requests, response.data.request]);
      setFormData({
        organisationName: '',
        institutionType: '',
        villageName: '',
        taluka: '',
        solarDemand: '',
        district: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create request.');
    } finally {
      setLoading(false);
    }
  };

  // Handle request deletion
  const handleDelete = async (requestId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/v1/solar/appealer-delete/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(requests.filter((request) => request._id !== requestId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
  <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-10 drop-shadow">
    Appealer Dashboard
  </h2>

  {/* Create Request Form */}
  <form onSubmit={handleSubmit} className="bg-white border border-blue-100 rounded-2xl shadow-xl p-8 space-y-6">
    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3">Create New Solar Request</h3>

    {error && <p className="text-red-500 text-sm">{error}</p>}

    {/* Organisation Name */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Organisation Name</label>
      <input
        type="text"
        name="organisationName"
        value={formData.organisationName}
        onChange={handleChange}
        required
        placeholder="Organisation Name"
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Institution Type */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Institution Type</label>
      <select
        name="institutionType"
        value={formData.institutionType}
        onChange={handleChange}
        required
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="" disabled>Select Institution Type</option>
        {institutionTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>
    </div>

    {/* Village */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Village Name</label>
      <input
        type="text"
        name="villageName"
        value={formData.villageName}
        onChange={handleChange}
        required
        placeholder="Village Name"
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Taluka */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Taluka</label>
      <input
        type="text"
        name="taluka"
        value={formData.taluka}
        onChange={handleChange}
        required
        placeholder="Taluka"
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* District */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
      <input
        type="text"
        name="district"
        value={formData.district}
        onChange={handleChange}
        required
        placeholder="District"
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Solar Demand */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">Solar Demand (in kW)</label>
      <input
        type="number"
        name="solarDemand"
        value={formData.solarDemand}
        onChange={handleChange}
        required
        placeholder="e.g. 10"
        className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow transition duration-200"
    >
      {loading ? 'Submitting...' : 'Submit Request'}
    </button>
  </form>

  {/* Request List */}
  <div className="mt-10">
    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Your Submitted Requests</h3>

    {loading ? (
      <p className="text-gray-600">Loading...</p>
    ) : requests.length > 0 ? (
      <div className="grid md:grid-cols-2 gap-6">
        {requests.map((req) => (
          <div key={req._id} className="p-6 bg-white border border-gray-100 rounded-2xl shadow hover:shadow-lg transition">
            <div className="mb-2">
              <h4 className="text-lg font-bold text-blue-800">{req.organisationName}</h4>
              <p className="text-gray-600">{req.institutionType}</p>
            </div>
            <div className="text-sm text-gray-500 mb-3">
              <p>{req.villageName}, {req.taluka}, {req.district}</p>
              <p>Demand: <span className="font-semibold">{req.solarDemand} kW</span></p>
            </div>
            <button
              onClick={() => handleDelete(req._id)}
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">No requests found.</p>
    )}
  </div>
</div>

  );
};

export default AppealerDashboard;
