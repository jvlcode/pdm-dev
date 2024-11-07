const express = require('express');
const { store, all, remove, update, show } = require('../controllers/rfqController');
const router = express.Router();

// Route for handling RFQs with pagination
router.route('/rfqs')
    .post(store)
    .get(all); // Pagination handled by query parameters

router.route('/rfqs/:id')
    .get(show)
    .delete(remove)
    .put(update);

module.exports = router;
