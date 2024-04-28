import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import ajvErrors from 'ajv-errors';
import pino from 'pino';

// Configure AJV
const ajv = new Ajv({
    allErrors: true,
    verbose: true,
    useDefaults: true // Ensure default values are set properly
});
addFormats(ajv);
ajvErrors(ajv); // Enables custom error messages

// Configure Pino with pretty print
const log = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        }
    }
});

// Define the user schema with custom error messages
interface UserSchema {
    name: string;
    profileId: string;
    email: string;
    joinDate?: string;
    team?: string;
    parent: boolean;
    player: boolean;
    assistantCoach: boolean;
    headCoach: boolean;
    admin: boolean;
}

const userSchema: JSONSchemaType<UserSchema> = {
    type: 'object',
    properties: {
        name: {
            type: 'string', minLength: 2, maxLength: 50, errorMessage: {
                minLength: 'Name must be at least 2 characters long.',
                maxLength: 'Name must not exceed 50 characters.'
            }
        },
        profileId: {
            type: 'string', pattern: "^[0-9]+$", errorMessage: {
                pattern: 'Profile ID must be numeric.'
            }
        },
        email: {
            type: 'string', format: 'email', errorMessage: {
                format: 'Email must be a valid email address.'
            }
        },
        joinDate: {
            type: 'string', format: 'date-time', nullable: true, errorMessage: {
                format: 'Join Date must be in ISO date-time format.'
            }
        },
        team: {
            type: 'string', nullable: true, minLength: 2, maxLength: 50, errorMessage: {
                maxLength: 'Team name must not exceed 50 characters.',
                minLength: 'Team name must not be less than 2 characters.'
            }
        },
        parent: { type: 'boolean', default: false },
        player: { type: 'boolean', default: false },
        assistantCoach: { type: 'boolean', default: false },
        headCoach: { type: 'boolean', default: false },
        admin: { type: 'boolean', default: false },
    },
    required: ['name', 'profileId', 'email'],
    additionalProperties: false,
    errorMessage: {
        required: {
            name: 'Name is required.',
            profileId: 'Profile ID is required.',
            email: 'Email is required.',
            joinDate: 'Join Date is required.'
        }
    }
};

const validateUser = ajv.compile(userSchema);

// Validate user data
const userData = {
    name: "John Doe",
    profileId: "111015587133119133740",
    email: "john.doe@example.com",
    joinDate: "2022-03-15T13:00:00Z",
    team: "Dream Team Alpha",
    parent: false,
    player: false,
    assistantCoach: true,
    headCoach: false,
    admin: false,
};

if (validateUser(userData)) {
    log.info("User data is valid!");
} else {
    log.error("Validation errors:", validateUser.errors);
}
