const mongoose = require('mongoose');
const YourModel = require('../models/masterRateBookModel');

// Function to fetch nodes recursively based on node ID
const fetchNodesRecursive = async (nodeId) => {
    try {
        const parentNode = await YourModel.findById(nodeId);

        if (!parentNode) {
            throw new Error('Parent node not found');
        }

        const childNodes = await YourModel.find({
            nodeLevel: parentNode.nodeLevel + 1,
                lft: { $gt: parentNode.lft },
                rgt: { $lt: parentNode.rgt }
        }).sort({ lft: 1 });

        for (const node of childNodes) {
            node.hasChildren = await YourModel.exists({
                nodeLevel: node.nodeLevel + 1,
                lft: { $gt: node.lft },
                rgt: { $lt: node.rgt }
            });
        }


        return childNodes;
    } catch (error) {
        console.error('Error fetching nodes recursively:', error);
        throw error;
    }
};


async function updateNodes(node, newRgt) {
    // Update parent's rgt
   node.rgt = newRgt + 1;
   await node.save();

   // Find and update next siblings' lft and rgt values
   const nextSiblings = await YourModel.find({
       nodeLevel: node.nodeLevel ,
       lft: { $gt: node.lft }
   });

   // Update lft and rgt for next siblings
   for (let i = 0; i < nextSiblings.length; i++) {
       const sibling = nextSiblings[i];
       await YourModel.updateOne(
           { _id: sibling._id },
           { $inc: { lft: 2, rgt: 2 } }
       );
   }

   const lastChild = await YourModel.findOne({
       nodeLevel: node.nodeLevel
   }).sort({ rgt: -1 }); // Sort descending by `rgt` to get the highest value

   if(lastChild) {
       const parentNode = await YourModel.findOne({nodeLevel: node.nodeLevel - 1 ,lft: {$lt: lastChild.lft}});
       
       if(parentNode) {
           const parentRgt  = lastChild.rgt;
           updateNodes(parentNode, parentRgt)
       }
   }
}

// Controller function to fetch nodes
exports.getNodes = async (req, res) => {
    let { nodeId } = req.query;

    try {
        if (!nodeId) {
            const rootNode = await YourModel.findOne({ nodeLevel: 0 });

            if (!rootNode) {
                throw new Error('Root node not found');
            }

            rootNode.hasChildren = await YourModel.exists({
                nodeLevel: 1,
                lft: { $gt: rootNode.lft },
                rgt: { $lt: rootNode.rgt }
            });

            rootNode.children = rootNode.hasChildren
                ? await fetchNodesRecursive(rootNode._id)
                : [];

            res.json([rootNode]);
        } else {
            const nodes = await fetchNodesRecursive(nodeId);
            res.json(nodes);
        }
    } catch (error) {
        console.error('Error fetching nodes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


 
// Controller function to store a new node
exports.storeNode = async (req, res) => {
    let { heading, parentId } = req.body;

    try {
        const parentNode = await YourModel.findById(parentId);

        if (!parentNode) {
            return res.status(404).json({ error: 'Parent node not found' });
        }

        // Find the last child node by querying for the node with the highest `rgt` value
        const lastChild = await YourModel.findOne({
            nodeLevel: parentNode.nodeLevel + 1,
            lft: { $gt: parentNode.lft },
            rgt: { $lt: parentNode.rgt }
        }).sort({ rgt: -1 }); // Sort descending by `rgt` to get the highest value

        let newLft, newRgt;
        if (lastChild) {
            // Child node
            newLft = lastChild.rgt + 1;
            newRgt = newLft + 1;
        } else {
            // New node
            newLft = parentNode.lft + 1;
            newRgt = newLft + 1;
        }

        const newNode = new YourModel({
            nodeLevel: parentNode.nodeLevel + 1,
            lft: newLft,
            rgt: newRgt,
            heading,
            parentId // Assuming your model includes a parentId field for nested sets
        });

        await newNode.save();

        await updateNodes(parentNode, newRgt);
       

        // update the previous parent rgt



        res.json(newNode); // Return the newly inserted node
    } catch (error) {
        console.error('Error storing node:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controller function to delete a node
exports.deleteNode = async (req, res) => {
    const { nodeId } = req.params;

    try {
        // Find the node to delete
        const nodeToDelete = await YourModel.findByIdAndDelete(nodeId);

        // Delete its children
        const childNodes = await YourModel.find({
            nodeLevel: nodeToDelete.nodeLevel + 1,
                lft: { $gt: nodeToDelete.lft },
                rgt: { $lt: nodeToDelete.rgt }
        }).sort({ lft: 1 });
        for (const node of childNodes) {
            node.delete();
        }

        res.json({ message: "DELETED" });
    } catch (error) {
        console.error('Error deleting node:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
