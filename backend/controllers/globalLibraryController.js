const ContractGroup = require('../models/contractGroup');
const ContractCategory = require('../models/contractCategory');
const Contract = require('../models/contractModel');
const mongoose = require('mongoose')
// Get contract categories by contractGroupId
exports.getContracts = async (req, res) => {
    const { contractCategory:cc } = req.params;

    try {
        const contracts = await Contract.find({contractCategory: cc});
        res.status(200).json(contracts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getMenus = async (req, res) => {
    const topSideMenuId = await getCGId('top-side')
    const marineId = await getCGId('marine')
    const bulkItemsId = await getCGId('bulk-items')
    const meteringId = await getCGId('metering')
    
    async function getCGId(cg) {
        const formattedName = cg.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
        const contractGroup = await ContractGroup.findOne({ name: formattedName });
        return contractGroup._id || null;
    }
    async function getCCMenus(id) {
        let ccMenus = await ContractCategory.find({contractGroup: id});
        ccMenus = ccMenus.map((i) => ({
            label: i.name,
            url: `/gl/cg/top-side/cc/${i._id}`,
        }))
        return ccMenus;
    }

    try {
        const menuData = [
            {
                label: 'Global Library',
                url: '/cg',
                children :[
                    {
                        label: 'Top Side',
                        url: '/gl/cg/top-side',
                        children :await getCCMenus(topSideMenuId)
                    },
                    {
                        label: 'Marine',
                        url: '/gl/cg/marine',
                        children :await getCCMenus(marineId)

                    },
                    {
                        label: 'Bulk Items',
                        url: '/gl/cg/bulk-items',
                        children :await getCCMenus(bulkItemsId)

                    },
                    {
                        label: 'Metering',
                        url: '/gl/cg/metering',
                        children :await getCCMenus(meteringId)

                    }
                ]
            }
        ]

        res.status(200).json(menuData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDocuments = async (req, res) => {
    const { contractCode } = req.params;

    // Pagination parameters (default to page 1 and pageSize 10 if not provided)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    // Calculate the number of documents to skip
    const skip = (page - 1) * pageSize;

    try {
        const db = mongoose.connection;

        // Aggregation pipeline to fetch paginated documents
        const pipeline = [
            {
                $lookup: {
                    from: contractCode, // The collection to join with
                    localField: 'New_SDRL_Code', // The field from the current collection
                    foreignField: 'New_SDRL_Code', // The field from the other collection to match
                    as: 'joinedDocuments' // The name of the new array field to add
                }
            },
            {
                $unwind: {
                    path: '$joinedDocuments',
                    preserveNullAndEmptyArrays: true // Keep documents even if no match
                }
            },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: ["$$ROOT", "$joinedDocuments"] }
                }
            },
            {
                $project: {
                    joinedDocuments: 0 // Optionally remove the original array field
                }
            },
            {
                $skip: skip // Skip the number of documents based on the page number
            },
            {
                $limit: pageSize // Limit the number of documents returned based on page size
            }
        ];

        // Fetch paginated results
        const results = await db.collection('contentData').aggregate(pipeline).toArray();

        // Get the total count of documents without pagination (for calculating total pages)
        const totalDocuments = await db.collection('contentData').aggregate([
            {
                $lookup: {
                    from: contractCode, 
                    localField: 'New_SDRL_Code', 
                    foreignField: 'New_SDRL_Code', 
                    as: 'joinedDocuments'
                }
            },
            {
                $unwind: {
                    path: '$joinedDocuments',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: ["$$ROOT", "$joinedDocuments"] }
                }
            },
            {
                $project: {
                    joinedDocuments: 0
                }
            },
            {
                $count: "totalCount" // Use $count to get the total number of matching documents
            }
        ]).toArray();

        // Calculate the total number of pages
        const totalDocs = totalDocuments[0] ? totalDocuments[0].totalCount : 0;
        const totalPages = Math.ceil(totalDocs / pageSize);

        // Return paginated data along with the total number of pages
        res.status(200).json({
            docs: results,     // The documents for the current page
            totalPages: totalPages, // Total pages available
            currentPage: page, // Current page number
            pageSize: pageSize, // Page size
            totalDocuments: totalDocs // Total number of documents
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Update specific field in a document
exports.updateDocumentCell = async (req, res) => {
    const { collectionName, sdrlCode } = req.params;  // Get contractCode and documentId from the URL params
    const { fieldName, newValue } = req.body;  // Get the fieldName and newValue from the request body

    if (!fieldName || !newValue) {
        return res.status(400).json({ message: 'Field name and new value are required' });
    }

    try {
        // Dynamically get the collection based on contractCode
        const collection = mongoose.connection.collection(collectionName);  // Get the collection

        // Find the document by ID
        const document = await collection.findOne({ New_SDRL_Code: sdrlCode });

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Check if the field exists in the document
        if (!(fieldName in document)) {
            return res.status(400).json({ message: `Field ${fieldName} does not exist in this document` });
        }

        // Update the document's field value
        const updateResult = await collection.updateOne(
            { New_SDRL_Code: sdrlCode },  // Filter by documentId
            { $set: { [fieldName]: newValue } }  // Set the new value for the specified field
        );

        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'No updates were made' });
        }

        // Return the updated document
        const updatedDocument = await collection.findOne({ New_SDRL_Code: sdrlCode });
        
        res.status(200).json({
            message: 'Document updated successfully',
            updatedDocument: updatedDocument
        });
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


