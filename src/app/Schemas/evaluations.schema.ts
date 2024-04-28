// Import necessary modules from AJV for JSON schema validation and error handling
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';  // Import to add support for formats like 'date-time'
import ajvErrors from 'ajv-errors';   // Import to enable custom error messages in the schema
import pino from 'pino';              // Import Pino for advanced logging capabilities

// Create a new AJV instance with configuration options
const ajv = new Ajv({
    allErrors: true,        // Display all errors, not just the first
    verbose: true,          // Provide more detailed errors
    useDefaults: true       // Automatically set default values in the data
});

// Apply additional formats and custom error messaging functionality to the AJV instance
addFormats(ajv);
ajvErrors(ajv);

// Configure Pino logger with pretty print for easier reading during development
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

// Define a TypeScript interface for strong typing throughout the script
interface EvaluationSchema {
    coach: string;
    comments?: string;
    date: string;
    moundVelo?: number;
    pitching?: boolean;
    pulldownVelo?: number;
    userId: string;
}

// Define the JSON schema for validation using AJV's JSONSchemaType
const evaluationSchema: JSONSchemaType<EvaluationSchema> = {
    type: 'object',
    properties: {
        coach: {
            type: 'string', minLength: 2, maxLength: 50, errorMessage: {
                minLength: 'Name must be at least 2 characters long.',
                maxLength: 'Name must not exceed 50 characters.'
            }
        },
        userId: {
            type: 'string', pattern: "^[0-9]+$", errorMessage: {
                pattern: 'Profile ID must be numeric.'
            }
        },
        comments: { type: 'string', nullable: true, minLength: 1, errorMessage: "Comments cannot be empty." },
        date: {
            type: 'string', format: 'date-time', nullable: true, errorMessage: {
                format: 'Join Date must be in ISO date-time format.'
            }
        },
        moundVelo: { type: 'number', nullable: true, minimum: 0, errorMessage: "Mound velocity must be a non-negative number." },
        pitching: { type: 'boolean', nullable: true, errorMessage: "Pitching must be a boolean value indicating if pitching was evaluated." },
        pulldownVelo: { type: 'number', nullable: true, minimum: 0, errorMessage: "Pulldown velocity must be a non-negative number." },
    },
    required: ['coach', 'date', 'userId'],
    additionalProperties: false,
    errorMessage: {
        required: {
            coach: 'Coach is required.',
            date: 'Date is required.',
            userId: 'User ID is required.'
        }
    }
};

// Compile the schema into a validation function
const validateEvaluation = ajv.compile(evaluationSchema);

// Example evaluation data
const evalData = {
    coach: "Jane Doe",
    comments: "Excellent performance.",
    date: "2023-04-29T15:00:00Z",
    moundVelo: 85,
    pitching: true,
    pulldownVelo: 90,
    userId: "user123"
};

// Validate the data using the compiled function and log the results
if (validateEvaluation(evalData)) {
    log.info("Evaluation data is valid!");
} else {
    log.error("Validation errors:", validateEvaluation.errors);
}
