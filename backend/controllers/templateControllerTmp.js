const catchAsyncError = require('../middlewares/catchAsyncError');
const mongoose = require('mongoose');
const { collection, populate } = require('../models/areaModel');


const collectionHandlers = {
  activities: {},
  area_headings: {},
  assigned_systems: {},
  boq: {},
  bank_details: {
    populate: ['idCompany', 'idCurrency']
  },
  companies: { },
  revision_codes: { },
  job_titles: { },
  contacts: {
    populate: ['idCompany', 'idDepartment', 'idJobTitle'], 
  },
  qualifications: {},
  currencies: { },
  colour_profiles: { },
  contact_qualifications: {
    populate:['idContact', 'idQualification']
  },
  departments: { },
  engineering_documents: { 
    populate: ['idEngineeringGroup', 'idRevisionCode']
  },
  engineering_groups: { },
  departments: { },
  areas: {
      populate: ['idHeading'] // Array of fields to populate when listing documents
  },
  assigned_areas: {
      populate: ['idProject', 'idAssignedSystem', 'idArea']
  },
  projects: {
      populate: [] // Example of an empty populate array
  },
  // Add other collections as needed...
};

const referenceHandlers = {
  idProject : {
      collection: "projects"
  },
  idAssignedSystem: {
      collection: "assigned_systems"
  },
  idHeading: {
     collection: "area_headings"
  },
  idArea: {
    collection: "areas"
  },
  idCompany: {
    collection: "companies"
  },
  idCurrency: {
    collection: "currencies"
  },
  idContact: {
    collection: "contacts"
  },
  idDepartment: {
    collection: "departments"
  },
  idQualification: {
    collection: "qualifications"
  },
  idJobTitle: {
    collection: "job_titles"
  },
  idEngineeringGroup: {
    collection: "engineering_groups"
  },
  idRevisionCode: {
    collection: "revision_codes"
  }
}
// Function to handle storing new documents
exports.store = catchAsyncError(async (req, res, next) => {
    const { collection, data } = req.body;
    const collectionName = mongoose.pluralize()(collection);
    const Model = mongoose.connection.model(collectionName, new mongoose.Schema({}), collectionName);
    
    const document = new Model(data);
    await document.save();

    // Optionally populate document if needed
    await populateReferences(document, Model.schema);
    
    res.status(200).json(document);
});

// Function to handle updating existing documents

// Function to handle updating documents dynamically
exports.update = async (req, res) => {
  const { id } = req.query;
  const { collection, data } = req.body;

  if (!collectionHandlers[collection]) {
      return res.status(404).json({ error: 'Collection not found' });
  }

  try {
      // Dynamically create model with a minimal schema and strict: false option
      let Model;
      try {
          Model = mongoose.model(collection);
      } catch (error) {
          // If model doesn't exist, create it with minimal schema
          const minimalSchema = new mongoose.Schema({}, { strict: false });
          Model = mongoose.model(collection, minimalSchema, collection);
      }

      // Convert fields starting with "id" to ObjectId where necessary
      const updatedData = await convertFieldsToObjectId(data);

      // Perform update operation and retrieve updated document
      let updatedDocument = await Model.findByIdAndUpdate(id, updatedData, { new: true });

      // Optionally populate references in the updated document
      updatedDocument = await populateReferences(collection, updatedDocument);

      res.status(200).json(updatedDocument);
  } catch (error) {
      console.log("Error updating document:", error);
      res.status(500).json({ error: "Failed to update document" });
  }
};

// Helper function to convert fields starting with "id" to ObjectId
async function convertFieldsToObjectId(data) {
  const updatedData = { ...data };

  for (let key in updatedData) {
      if (key.startsWith("id") && key.length > 2) {
          // Check if the value is a string and can be converted to ObjectId
          if (mongoose.Types.ObjectId.isValid(updatedData[key])) {
              updatedData[key] = mongoose.Types.ObjectId(updatedData[key]);
          }
      }
  }

  return updatedData;
}

// Helper function to populate references in the updated document
async function populateReferences(collection, document) {
  if (collectionHandlers[collection] && collectionHandlers[collection].populate) {
      const { populate } = collectionHandlers[collection];

      // Prepare an array to hold all promises for population
      const populationPromises = [];

      if(populate) for (let field of populate) {
          if (referenceHandlers[field]) {
              const refCollectionName = referenceHandlers[field].collection;

              // Add populate promise to the array
              populationPromises.push(
                  document.populate({
                      path: field,
                      model: refCollectionName
                  }).execPopulate()
              );
          }
      }

      // Wait for all population promises to resolve
      await Promise.all(populationPromises);
  }

  return document;
}

// Function to populate references and return single objects
async function populateReferences(collection, document) {
  if (!document) return;

  const { populate } = collectionHandlers[collection];

  // Start aggregation pipeline
  let pipeline = [];

  // Match stage to filter documents based on _id
  const matchStage = { $match: { _id: mongoose.Types.ObjectId(document._id) } };
  pipeline.push(matchStage);

  // Convert populate fields to $lookup stages
  if (populate && populate.length > 0) {
      for (let field of populate) {
          if (referenceHandlers[field]) {
              const refCollectionName = referenceHandlers[field].collection;
              const localField = field;
              const foreignField = "_id"; // Assuming references are based on _id field
              const asField = field; // Use the same field name for alias

              const lookupStage = {
                  $lookup: {
                      from: refCollectionName,
                      localField,
                      foreignField,
                      as: asField
                  }
              };

              pipeline.push(lookupStage);
          }
      }
  }

  // Add a $addFields stage to reshape the array into a single object
  const addFieldsStage = {};
  if(populate)
    for (let field of populate) {
        addFieldsStage[field] = { $arrayElemAt: [`$${field}`, 0] };
    }
    pipeline.push({ $addFields: addFieldsStage });

  try {
      // Execute aggregation pipeline
      const result = await mongoose.connection.collection(collection).aggregate(pipeline).toArray();

      // Return updated document with populated references as single objects
      return result[0];
  } catch (error) {
      console.error("Error populating references:", error);
      throw error; // Propagate error to handle it in the calling function
  }
}



// Function to handle listing documents dynamically using collectionHandlers and referenceHandlers
exports.list = async (req, res) => {
  const { collection, query = {} } = req.query;

  if (collectionHandlers[collection]) {
      const { populate } = collectionHandlers[collection];

      // Start aggregation pipeline
      let pipeline = [];

      // Match stage to filter documents based on query
      pipeline.push({ $match: query });

      // Convert populate fields to $lookup stages
      if (populate && populate.length > 0) {
          for (let field of populate) {
              if (referenceHandlers[field]) {
                  const refCollectionName = referenceHandlers[field].collection;
                  const localField = field;
                  const foreignField = "_id"; // Assuming references are based on _id field
                  const asField = field; // Use the same field name for alias

                  const lookupStage = {
                      $lookup: {
                          from: refCollectionName,
                          localField,
                          foreignField,
                          as: asField
                      }
                  };

                  pipeline.push(lookupStage);
                  
                  // Add a $addFields stage to reshape the array into a single object
                  const addFieldsStage = {
                      $addFields: {
                          [asField]: { $arrayElemAt: [`$${asField}`, 0] }
                      }
                  };
                  pipeline.push(addFieldsStage);
              }
          }
      }

      // Execute aggregation pipeline
      try {
          const collectionName = mongoose.pluralize()(collection);
          const collectionRef = mongoose.connection.collection(collectionName);

          const documents = await collectionRef.aggregate(pipeline).toArray();

          res.status(200).json(documents);
      } catch (error) {
          console.error("Error executing aggregation pipeline:", error);
          res.status(500).json({ error: "Failed to retrieve documents" });
      }
  } else {
      res.status(404).json({ error: 'Collection not found' });
  }
};

// Function to handle deleting documents
exports.remove = catchAsyncError(async (req, res, next) => {
    const { collection, id } = req.query;
    const collectionName = mongoose.pluralize()(collection);
    const Model = mongoose.model(collectionName);

    const deletedDocument = await Model.findByIdAndDelete(id);
    res.status(200).json({ success: true });
});

