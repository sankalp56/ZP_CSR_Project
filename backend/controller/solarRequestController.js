const SolarRequest = require("../model/solarRequest");
const {sendMail}  = require("../utils/SendMail");
const Department = require("../model/department"); // Adjust the path as necessary
const mongoose = require("mongoose");
const {
  authenticate,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ✅ Create Solar Request (Appealer)
exports.createRequest = async (req, res) => {
  try {
   // console.log(req.user);

    if (!req.user.isVerified) {
      return res.status(403).json({ error: "User not verified." });
    }

    const {
      organisationName,
      institutionType,
      villageName,
      taluka,
      solarDemand,
      district,
    } = req.body;

    if (
      !organisationName ||
      !institutionType ||
      !villageName ||
      !taluka ||
      !solarDemand ||
      !district
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const request = new SolarRequest({
      ...req.body,
      userId: req.user.userId,
    });

    await request.save();
    res.status(201).json({ message: "Request created successfully", request });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create request", details: error.message });
  }
};

// ✅ Get All Solar Requests (Public/Home Page)
exports.getAllRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 15,
      taluka,
      institutionType,
      village,
    } = req.query;

    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 15,
      sort: { createdAt: -1 },
    };

    const filters = {};
    if (taluka) filters.taluka = taluka;
    if (institutionType) filters.institutionType = institutionType;
    if (village) filters.villageName = { $regex: village, $options: "i" };

    const aggregatePipeline = [];

    if (Object.keys(filters).length > 0) {
      aggregatePipeline.push({ $match: filters });
    }

    aggregatePipeline.push({
      $project: {
        organisationName: 1,
        institutionType: 1,
        villageName: 1,
        taluka: 1,
        solarDemand: 1,
        fulfillmentPercentage: 1,
        createdAt: 1,
      },
    });

    const aggregate = SolarRequest.aggregate(aggregatePipeline);

    const paginatedResult = await SolarRequest.aggregatePaginate(
      aggregate,
      options
    );

    const distinctTalukas = await SolarRequest.distinct("taluka");
    const distinctDepartments = await SolarRequest.distinct("institutionType");

    return res.json({
      pagination: {
        totalItems: paginatedResult.totalDocs,
        totalPages: paginatedResult.totalPages,
        currentPage: paginatedResult.page,
        hasNextPage: paginatedResult.hasNextPage,
        hasPrevPage: paginatedResult.hasPrevPage,
        nextPage: paginatedResult.nextPage,
        prevPage: paginatedResult.prevPage,
      },
      requests: paginatedResult.docs,
      distinctTalukas,
      distinctDepartments,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to fetch requests", details: error.message });
  }
};

// ✅ Search by Village Name (Public)
exports.searchVillages = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }

    const villages = await SolarRequest.aggregate([
      {
        $match: {
          villageName: { $regex: query, $options: "i" },
        },
      },
      {
        $group: {
          _id: "$villageName",
        },
      },
      {
        $limit: 10,
      },
    ]);

    const villageNames = villages.map((v) => v._id);

    res.json(villageNames);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to search villages", details: error.message });
  }
};

// ✅ Filter by Department (Public)
exports.filterByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.query;
    if (!departmentId)
      return res.status(400).json({ error: "Department ID is required." });

    const results = await SolarRequest.find({ departmentId }).select("-donors");
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Filtering failed", details: error.message });
  }
};


// exports.donorInterest = async (req, res) => {
//   try {
//     //console.log("req: ",req);
//     const { requestId } = req.body;
//     const donorId = req.user._id;
//     const request = await SolarRequest.findById(requestId);
//     //console.log("Request:", request);
//     if (!request) return res.status(404).json({ error: "Request not found." });

//     // Check if donor already expressed interest
//     const alreadyInterested = request.donors.some(donor => donor.donorId.equals(donorId));
//     if (alreadyInterested) {
//       return res.status(400).json({ error: "You have already expressed interest in this request." });
//     }
    
//     const department = await Department.findOne({ departmentName: request.institutionType });
//     if (!department) {
//       return res.status(404).json({ error: 'Department not found for the given institution type.' });
//     }
//     // Add donor's details
//     request.donors.push({
//       donorId,
//       name: `${req.user.fname} ${req.user.lname}`,
//       //lname: req.user.lname,
//       email: req.user.email,
//       phone: req.user.phone,
//     });
//     await request.save();

//     // Notify the department head
//     const departmentHead = await User.findOne({
//       role: 'Head of Department',
//       departmentId: department._id,
//     });
//      console.log("Department:", departmentHead);
//      if (departmentHead) {
//       await sendMail(
//         departmentHead.email,
//         'New Donor Interest Notification',
//         `
//         <p>Dear ${departmentHead.fname},</p>
//         <p>${req.user.fname} ${req.user.lname} has expressed interest in donating to ${request.organisationName}.</p>
//         <p>Contact Details:</p>
//         <ul>
//           <li>Email: ${req.user.email}</li>
//           <li>Phone: ${req.user.phone}</li>
//         </ul>
//         <p>Please reach out to the donor for further coordination.</p>
//         `
//       );
//     }

//     res.json({ message: 'Interest recorded successfully.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to register interest.', details: error.message });
//   }
// };



exports.donorInterest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const donorId = req.user._id;
     //console.log("req: ",req);
    // Validate requestId
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ error: 'Invalid request ID.' });
    }

    // Find the solar request by ID
    const request = await SolarRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    // Check if the donor has already expressed interest
      // Check if donor already expressed interest
    const alreadyInterested = request.donors.some(donor => donor.donorId.equals(donorId));
    if (alreadyInterested) {
      return res.status(400).json({ error: "You have already expressed interest in this request." });
    }
    

    // Retrieve the department using institutionType
    const department = await Department.findOne({ departmentName: request.institutionType });
    if (!department) {
      return res.status(404).json({ error: 'Department not found for the given institution type.' , details: error.message});
    }
    
    // Add donor's details to the request
    request.donors.push({
      donorId,
      name: `${req.user.fname} ${req.user.lname}`,
      email: req.user.email,
      phone: req.user.phone,
    });
    await request.save();

    // Find the department head
    const departmentHead = await User.findOne({
      role: 'Head of Department',
      departmentId: department._id,
    });

    // Send notification email to the department head
    if (departmentHead) {
      try {
        await sendMail(
          departmentHead.email,
          'New Donor Interest Notification',
          `
          <p>Dear ${departmentHead.fname},</p>
          <p>${req.user.fname} ${req.user.lname} has expressed interest in donating to ${request.organisationName}.</p>
          <p>Contact Details:</p>
          <ul>
            <li>Email: ${req.user.email}</li>
            <li>Phone: ${req.user.phone}</li>
          </ul>
          <p>Please reach out to the donor for further coordination.</p>
          `
        );
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Decide on the appropriate response or action
      }
    } else {
      console.warn('No department head found for department:', department._id);
      // Handle the absence of a department head as needed
    }

    res.json({ message: 'Interest recorded successfully.' });
  } catch (error) {
    console.error('Error in donorInterest function:', error);
    res.status(500).json({ error: 'Failed to register interest.', details: error.message });
  }
};


// ✅ Department Head Updates Fulfillment
exports.updateFulfillment = async (req, res) => {
  try {
    //console.log(req.body);
    const { fulfillmentPercentage } = req.body;
    const { id } = req.params;

    if (fulfillmentPercentage < 0 || fulfillmentPercentage > 100) {
      return res.status(400).json({ message: 'Fulfillment percentage must be between 0 and 100.' });
    }

    const solarRequest = await SolarRequest.findByIdAndUpdate(
      id,
      { fulfillmentPercentage },
      { new: true, runValidators: true }
    );

    if (!solarRequest) {
      return res.status(404).json({ message: 'Solar request not found.' });
    }

    res.status(200).json({ message: 'Fulfillment percentage updated successfully.', solarRequest });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update fulfillment percentage.', error: error.message });
  }
};

// ✅ Department Head Views Donor Details for Their Department
exports.getInterestedDonors = async (req, res) => {
  try {
    const { departmentId } = req.user; // Get department from the logged-in user

    if (!departmentId) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not a Department Head." });
    }

    // Find all solar requests under the department & return donor details
    const requests = await SolarRequest.find({ departmentId })
      .populate("donors.donorId", "name email phone") // Fetch donor details
      .select("organisationName donors"); // Select only required fields

    res.json(requests);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch donor details", details: error.message });
  }
};

const User = require("../model/user"); // Import User model
const solarRequest = require("../model/solarRequest");

// ✅ Verifier verifies an Appealer
exports.verifyAppealer = async (req, res) => {
  try {
    const { appealerId } = req.body;

    if (!appealerId) {
      return res.status(400).json({ error: "Appealer ID is required." });
    }

    const appealer = await User.findById(appealerId);
    if (!appealer) {
      return res.status(404).json({ error: "Appealer not found." });
    }

    if (appealer.role !== "Appealer") {
      return res.status(400).json({ error: "User is not an Appealer." });
    }

    appealer.isVerified = true;
    await appealer.save();

    res.json({ message: "Appealer verified successfully.", appealer });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Verification failed", details: error.message });
  }
};



exports.getDepartmentRequests = async (req, res) => {
  try {
    const { institutionType } = req.user; // Assuming this is populated during authentication

    const requests = await SolarRequest.find({
      institutionType,
      donors: { $exists: true, $not: { $size: 0 } } // Only fetch requests with interested donors
    }).populate("donors.donorId", "fname lname email phone");

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch department requests." });
  }
};



exports.getDepartmentRequests = async (req, res) => {
  try {
    // Step 1: Retrieve the department's name using departmentId
    const department = await Department.findById(req.user.departmentId).select('departmentName');
    if (!department) {
      return res.status(404).json({ error: 'Department not found.' });
    }

    // Step 2: Use the department's name to find matching SolarRequest documents
    const requests = await SolarRequest.find({ institutionType: department.departmentName , donors: { $exists: true, $not: { $size: 0 } } // Ensure donors array is not empty
    })
      .populate('donors.donorId', 'fname lname email phone') // Populate donor details
      .exec();

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch department requests.', details: error.message });
  }
};

//const Request = require('../models/Request');

// DELETE /api/v1/solar/requests/:id
exports.deleteRequestById = async (req, res) => {
  const requestId = req.params.id;
  const userId = req.user.id;

  try {
    const request = await SolarRequest.findById(requestId);
  // console.log("request:", request);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Safe check: Only allow delete if user field exists and matches
    if (!request) {
      return res.status(403).json({ message: 'Unauthorized to delete this request' });
    }

    await SolarRequest.findByIdAndDelete(requestId);

    return res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ message: 'Server error during deletion' });
  }
};


exports.headDelete = async(req, res) =>{
    try {
      const { id } = req.params;
  
      const solarRequest = await SolarRequest.findByIdAndDelete(id);
    // console.log("solarRequest:", solarRequest);
      if (!solarRequest) {
        return res.status(404).json({ message: 'Solar request not found.' });
      }
  
      res.status(200).json({ message: 'Solar request deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete solar request.', error: error.message });
    }
};