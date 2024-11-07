const express = require('express');
const {  getContracts, getDocuments } = require('../controllers/globalLibraryController');
const { getMenus } = require('../controllers/globalLibraryController');
const router = express.Router();

router.get('/gl/contracts/:contractCategory', getContracts);
router.get('/gl/menus', getMenus);
router.get('/gl/documents/:contractCode', getDocuments);

module.exports = router;
