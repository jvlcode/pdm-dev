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
    const {contractCode} = req.params;
    
    try {
    const db = mongoose.connection;

    const pipeline = [
        {
            $lookup: {
                from: contractCode, // The collection to join with
                localField: 'New_SDRL_Code', // The field from the current collection
                foreignField: 'New_SDRL_Code', // The field from the other collection to match
                as: 'joinedDocuments' // The name of the new array field to add
            }
        },{
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
            $limit: 2 // Limit the results to 10 documents
        }
    ];

    const results = await db.collection('contentData').aggregate(pipeline).toArray();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};