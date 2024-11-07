const express = require('express');
const { store, all, remove, update, show, addVendor } = require('../controllers/rfqController');
const router = express.Router();

// Routes for handling RFQs
router.route('/rfqs')
    .post(store) // Create a new RFQ
    .get(all); // Get all RFQs

router.route('/rfqs/:id')
    .get(show) // Get a single RFQ by ID
    .delete(remove) // Delete an RFQ by ID
    .put(update); // Update an RFQ by ID

// New route for adding a vendor to an RFQ
router.route('/rfqs/addVendor')
    .post(addVendor); // Add a vendor to an RFQ

module.exports = router;
