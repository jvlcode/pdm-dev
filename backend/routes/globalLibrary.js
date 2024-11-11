const express = require('express');
const { getContracts, getDocuments, updateDocumentCell } = require('../controllers/globalLibraryController');  // Added updateDocumentCell import
const { getMenus } = require('../controllers/globalLibraryController');
const router = express.Router();

// Existing routes
router.get('/gl/contracts/:contractCategory', getContracts);
router.get('/gl/menus', getMenus);
router.get('/gl/docs/:contractCode', getDocuments);

// New route for updating a document cell
router.put('/gl/docs/:collectionName/:sdrlCode', updateDocumentCell);  // Added PUT route for updating document cell

module.exports = router;
