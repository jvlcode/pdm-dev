const express = require('express');
const { getNodes, storeNode, deleteNode } = require('../controllers/masterRateBookController');


const router = express.Router();

router.route('/mrb')
    .get(getNodes)  // Endpoint to fetch nodes
    .post(storeNode);  // Endpoint to store a new node

router.delete('/mrb/:nodeId', deleteNode);  // Endpoint to delete a node
module.exports = router;
