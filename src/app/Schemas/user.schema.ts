import Ajv, { JSONSchemaType } from 'ajv';
const ajv = new Ajv({ allErrors: true, verbose: true });
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
addFormats(ajv);
ajvErrors(ajv);

interface UserSchema {
    name: string;
    profileId: number;
    email: string;
    joinDate: string; 
    role: 'admin' | 'coach' | 'player' | 'parent' | 'headcoach';
    team: string;
}

const userSchema: JSONSchemaType<UserSchema> = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 2, 
            maxLength: 50,
        },
        profileId: {
            type: 'integer',
            minimum: 111015587133119133740,
            maximum: 9999999999999999999,
        },
        email: {
            type: 'string',
            format: 'email',
        },
        joinDate: {
            type: 'string',
            format: 'date-time',

        },
        team: {
            type: 'string',
        },
        role: {
            type: 'string',
            enum: ['admin', 'coach', 'player', 'parent', 'headcoach']
        }
    },
    required: ['name', 'profileId', 'email', 'joinDate', 'role', 'team'],
    additionalProperties: false,
};

const validateUser = ajv.compile(userSchema);

// Example user data
const userData = {
    name: "John Doe",
    profileId: 111015587133119133740,
    email: "john.doe@example.com",
    joinDate: "2022-03-15T13:00:00Z",
    role: "coach",
    team: "Team Rocket"
};

console.log("Validation result:", validateUser(userData));
if (!validateUser(userData)) {
    console.log(validateUser.errors);
}
