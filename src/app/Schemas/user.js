import ajv from './ajv-instance';

const user = {
    '$schema': 'http://json-schema.org/draft-07/schema#',
    'title': 'User',
    'type': 'object',
    'properties': {
        'email': { 'type': 'string', 'format': 'email' },
        'name': { 'type': 'string' },
        'profileId': { 'type': 'string' },
        'profileCreationDate': { 'type': 'string', 'format': 'date' },
        'admin': { 'type': 'boolean' },
        'coach': { 'type': 'boolean' },
        'headCoach': { 'type': 'boolean' },
        'player': { 'type': 'boolean' },
        'team': { 'type': 'string' }
    },
    'required': ['admin', 'coach', 'email', 'headCoach', 'name', 'player', 'profileId', 'profileCreationDate']
};

ajv.addSchema(user, 'user');
