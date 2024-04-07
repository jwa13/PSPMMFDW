const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize AJV
const ajv = new Ajv();
addFormats(ajv);

const eval_1 = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    'title': 'Evaluations',
    'type': 'object',
    'properties': {
        'coach': { 'type': 'string' },
        'comments': { 'type': 'string' },
        'date': { 'type': 'string', 'format': 'date-time' },
        'moundVelo': { 'type': 'number' },
        'pitching': { 'type': 'boolean' },
        'pulldownVelo': { 'type': 'number' },
        'userId': { 'type': 'string' }
    },
    'required': ['coach', 'comments', 'date', 'moundVelo', 'pitching', 'pulldownVelo', 'userId']
};

ajv.addSchema(eval_1, 'eval_1');
