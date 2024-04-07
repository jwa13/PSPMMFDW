const Ajv = require("ajv");
const addFormats = require("ajv-formats");

// Initialize AJV
const ajv = new Ajv();
addFormats(ajv);

ajv.addSchema(Calendar, 'Calendar');
ajv.addSchema(gmail, 'gmail');
