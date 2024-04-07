const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Initialize AJV
const ajv = new Ajv();
addFormats(ajv);

const workout_1 = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    'title': 'Workouts',
    'type': 'object',
    'properties': {
        'coach': { 'type': 'string' },
        'comments': { 'type': 'array', 'items': { 'type': 'string' } },
        'exercise': { 'type': 'array', 'items': { 'type': 'string' } },
        'reps': { 'type': 'array', 'items': { 'type': 'string' } },
        'sets': { 'type': 'array', 'items': { 'type': 'string' } },
        'userId': { 'type': 'string' },
        'video': { 'type': 'array', 'items': { 'type': 'string' } },
        'weight': { 'type': 'array', 'items': { 'type': 'string' } }
    },
    'required': ['coach', 'comments', 'exercise', 'reps', 'sets', 'userId', 'video', 'weight']
};

ajv.addSchema(workout_1, 'workout_1');
