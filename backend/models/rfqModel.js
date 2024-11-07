const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema
const RFQSchema = new Schema({
  // Procurement Status Report
  drfqNo: { type: String},
  category: { type: String, required: true },
  description: { type: String, required: true },
  entity: { type: String, required: true },
  ypDocumentNumber: { type: Number, required: true },
  packageManager: { type: String, required: true },
  packageEngineer: { type: String, required: true },
  packageBuyer: { type: String, required: true },
  eca: { type: String, required: true },

  // PDF
  draft: { type: Date, required: true },
  issued: { type: Date, required: true },
  signed: { type: Date, required: true },
  company: { type: String, required: true },
  contact: { type: String, required: true },
  selectedVendor: { type: String },
  level: { type: Number },

  // RFQ issued
  rfqPlanned: { type: Date },
  rfqForecast: { type: Date },
  rfqActual: { type: Date },

  // Bid Received
  bidDays: { type: Number },
  bidPlanned: { type: Date },
  bidForecast: { type: Date },
  bidReceivedActual: { type: Date },

  // TBE Cycle
  tbeDays: { type: Number },
  tbePlanned: { type: Date },
  tbeForecast: { type: Date },
  tbeActual: { type: Date },

  // CBE Cycle
  cbeDays: { type: Number },
  cbePlanned: { type: Date },
  cbeForecast: { type: Date },
  cbeActual: { type: Date },

  // PO Cycle
  poDays: { type: Number },
  poPlanned: { type: Date },
  poForecast: { type: Date },
  poActual: { type: Date },

  // PO
  poType: { type: String },
  poNo: { type: Number },

  // Shipment 
  estLeadTimeMonths: { type: Number },
  estLeadTimeDays: { type: Number },
  deliveryTerms: { type: String },
  exwDate: { type: Date },
  readyToShipLeadDays: { type: Number },
  estReadyToShip: { type: Date },
  estTransitTimeDays: { type: Number },

  // ETA Site Date
  phase: { type: Number },
  customsClearance: { type: Number },
  etaPlanned: { type: Date },
  etaForecast: { type: Date },
  etaActual: { type: Date },

  // ROS
  siteLocation: { type: String },
  ros: { type: Date },
  variance: { type: Number },
  location: { type: String },
  cutOff: { type: Date },
  remarks: { type: String }
}, { timestamps: true, collection:"rfqs" });

// Create the model
const RFQ = mongoose.model('RFQ', RFQSchema);

module.exports = RFQ;
