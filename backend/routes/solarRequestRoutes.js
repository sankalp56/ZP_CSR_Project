const express = require("express");
const { createRequest, getAllRequests, searchVillages, filterByDepartment, donorInterest,deleteRequestById, headDelete,updateFulfillment, getInterestedDonors, getDepartmentRequests } = require("../controller/solarRequestController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authenticate, authorizeRoles("Appealer"), createRequest);
router.get("/all", getAllRequests);
router.get("/search-villages", searchVillages);
router.get("/filter", filterByDepartment);
router.post("/donor-interest", authenticate, donorInterest);
router.put("/:id/update-fulfillment", authenticate, authorizeRoles("Head of Department"), updateFulfillment);
router.get("/donor-details", authenticate, authorizeRoles("Head of Department"), getInterestedDonors);
router.get('/department-requests', authenticate, authorizeRoles('Head of Department'), getDepartmentRequests);
router.delete('/appealer-delete/:id', authenticate, deleteRequestById);

// DELETE /api/v1/solar/requests/:id
router.delete('/head-delete/:id', authenticate, authorizeRoles('Head of Department'), headDelete);
  module.exports = router;
  
//router.get("/donations", authenticate, authorizeRoles("Donor"), getDonorDonations);  // ✅ New Route

// router.post("/verify-appealer", authenticate, authorizeRoles("Verifier"), verifyAppealer);

module.exports = router;
