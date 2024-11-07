const { Types } = require('mongoose');
const RFQ = require('../models/rfqModel'); // Adjust the path as needed

// Function to generate the next drfqNo
const generateNextDrfqNo = async () => {
  const latestRFQ = await RFQ.findOne().sort({ drfqNo: -1 }).exec();
  
  if (!latestRFQ) {
    return "DRFQ0001"; // Starting value if no documents are present
  }

  const lastDrfqNo = latestRFQ.drfqNo;
  const numberPart = parseInt(lastDrfqNo.replace(/^DRFQ/, ''), 10);
  const nextNumberPart = numberPart + 1;
  const nextDrfqNo = `DRFQ${nextNumberPart.toString().padStart(4, '0')}`;
  
  return nextDrfqNo;
};

// Create a new RFQ
exports.store = async (req, res) => {
  try {
    const nextDrfqNo = await generateNextDrfqNo();
    const input = { ...req.body, drfqNo: nextDrfqNo };
    const newRFQ = new RFQ(input);
    const savedRFQ = await newRFQ.save();
    res.status(201).json(savedRFQ);
  } catch (error) {
    res.status(400).json({ message: 'Error creating RFQ', error: error.message });
  }
};

// Get all RFQs with pagination and group by drfqNo
exports.all = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Aggregate RFQs to group by drfqNo and include vendor data
    const aggregatedRFQs = await RFQ.aggregate([
      {
        $sort: { drfqNo: 1, _id: 1 } // Ensure documents are sorted
      },
      {
        $group: {
          _id: "$drfqNo", // Group by drfqNo
          firstDocument: { $first: "$$ROOT" }, // Capture the first document
          allDocuments: { $push: "$$ROOT" } // Push all documents for later processing
        }
      },
      {
        $project: {
          // Include fields from the first document
          drfqNo: "$firstDocument.drfqNo",
          _id: "$firstDocument._id",
          category: "$firstDocument.category",
          description: "$firstDocument.description",
          entity: "$firstDocument.entity",
          ypDocumentNumber: "$firstDocument.ypDocumentNumber",
          packageManager: "$firstDocument.packageManager",
          packageEngineer: "$firstDocument.packageEngineer",
          packageBuyer: "$firstDocument.packageBuyer",
          eca: "$firstDocument.eca",
          draft: "$firstDocument.draft",
          issued: "$firstDocument.issued",
          signed: "$firstDocument.signed",
          company: "$firstDocument.company",
          contact: "$firstDocument.contact",
          selectedVendor: "$firstDocument.selectedVendor",
          level: "$firstDocument.level",
          rfqPlanned: "$firstDocument.rfqPlanned",
          rfqForecast: "$firstDocument.rfqForecast",
          rfqActual: "$firstDocument.rfqActual",
          bidDays: "$firstDocument.bidDays",
          bidPlanned: "$firstDocument.bidPlanned",
          bidForecast: "$firstDocument.bidForecast",
          bidReceivedActual: "$firstDocument.bidReceivedActual",
          tbeDays: "$firstDocument.tbeDays",
          tbePlanned: "$firstDocument.tbePlanned",
          tbeForecast: "$firstDocument.tbeForecast",
          tbeActual: "$firstDocument.tbeActual",
          cbeDays: "$firstDocument.cbeDays",
          cbePlanned: "$firstDocument.cbePlanned",
          cbeForecast: "$firstDocument.cbeForecast",
          cbeActual: "$firstDocument.cbeActual",
          poDays: "$firstDocument.poDays",
          poPlanned: "$firstDocument.poPlanned",
          poForecast: "$firstDocument.poForecast",
          poActual: "$firstDocument.poActual",
          poType: "$firstDocument.poType",
          poNo: "$firstDocument.poNo",
          estLeadTimeMonths: "$firstDocument.estLeadTimeMonths",
          estLeadTimeDays: "$firstDocument.estLeadTimeDays",
          deliveryTerms: "$firstDocument.deliveryTerms",
          exwDate: "$firstDocument.exwDate",
          readyToShipLeadDays: "$firstDocument.readyToShipLeadDays",
          estReadyToShip: "$firstDocument.estReadyToShip",
          estTransitTimeDays: "$firstDocument.estTransitTimeDays",
          phase: "$firstDocument.phase",
          customsClearance: "$firstDocument.customsClearance",
          etaPlanned: "$firstDocument.etaPlanned",
          etaForecast: "$firstDocument.etaForecast",
          etaActual: "$firstDocument.etaActual",
          siteLocation: "$firstDocument.siteLocation",
          ros: "$firstDocument.ros",
          variance: "$firstDocument.variance",
          location: "$firstDocument.location",
          cutOff: "$firstDocument.cutOff",
          remarks: "$firstDocument.remarks",
          // Exclude the first document from vendors field
          vendors: {
            $filter: {
              input: "$allDocuments",
              as: "doc",
              cond: { $ne: ["$$doc._id", "$firstDocument._id"] } // Exclude first document
            }
          }
        }
      },
      {
        $sort: { drfqNo: 1 } // Sort by drfqNo
      },
      {
        $skip: skip // Skip documents for pagination
      },
      {
        $limit: limit // Limit to the number of documents per page
      }
    ]);

    // Retrieve the total count of unique drfqNo values
    const total = await RFQ.aggregate([
      {
        $group: {
          _id: "$drfqNo" // Group by drfqNo
        }
      },
      {
        $count: "total" // Count the number of unique drfqNo
      }
    ]).then(result => result[0]?.total || 0); // Extract total from result

    res.status(200).json({
      rfqs: aggregatedRFQs,
      total,
      page,
      pages: Math.ceil(total / limit) // Total number of pages
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching RFQs', error: error.message });
  }
};




// Get a single RFQ by ID
exports.show = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id);
    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    res.status(200).json(rfq);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching RFQ', error: error.message });
  }
};

// Update an RFQ by ID
exports.update = async (req, res) => {
  try {
    const updatedRFQ = await RFQ.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRFQ) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    res.status(200).json(updatedRFQ);
  } catch (error) {
    res.status(400).json({ message: 'Error updating RFQ', error: error.message });
  }
};

// Delete an RFQ by ID
exports.remove = async (req, res) => {
  try {
    const deletedRFQ = await RFQ.findByIdAndDelete(req.params.id);
    if (!deletedRFQ) {
      return res.status(404).json({ message: 'RFQ not found' });
    }
    res.status(200).json({ message: 'RFQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting RFQ', error: error.message });
  }
};

// Add vendor to RFQ
exports.addVendor = async (req, res) => {
  try {
    const { rfqId, company, contact } = req.body;
    
    if (!rfqId || !company || !contact) {
      return res.status(400).json({ message: 'RFQ ID, company, and contact are required' });
    }

    // Find the original RFQ
    const originalRFQ = await RFQ.findById(rfqId);
    if (!originalRFQ) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    // Generate the same drfqNo for the new RFQ
    const newDrfqNo = originalRFQ.drfqNo;

    // Create a new RFQ with the vendor details
    const newRFQ = new RFQ({
      ...originalRFQ.toObject(),
      _id: new Types.ObjectId(), // Generate a new unique ObjectId
      company,
      contact,
      drfqNo: newDrfqNo // Use the same drfqNo
    });

    // Save the new RFQ
    const savedRFQ = await newRFQ.save();

    res.status(201).json(savedRFQ);
  } catch (error) {
    res.status(400).json({ message: 'Error adding vendor', error: error.message });
  }
};