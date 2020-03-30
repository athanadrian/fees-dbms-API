const Percentage = require('../models/Percentage');
const {
  createDoc,
  getAllDocs,
  getSingleDoc,
  updateDoc,
  deleteDoc
} = require('./factory');

//@desc         Get all Percentages
//@route        GET /api/v1/percentages
//@access       Private - (Admin - Manager)
exports.getAllPercentages = getAllDocs(Percentage);

//@desc         Get Single Percentage
//@route        GET /api/v1/percentages/:id
//@access       Private - (Admin - Manager)
exports.getPercentageById = getSingleDoc(Percentage);

//@desc         Create Percentage
//@route        POST /api/v1/percentages
//@access       Private - (Admin - Manager)
exports.createPercentage = createDoc(Percentage);

//@desc         Update Percentage
//@route        PATCHE /api/v1/percentages/:id
//@access       Private - (Admin - Manager)
exports.updatePercentage = updateDoc(Percentage);

//@desc         Delete Percentage
//@route        DELETE /api/v1/percentages/:id
//@access       Private - (Admin - Manager)
exports.deletePercentage = deleteDoc(Percentage);
