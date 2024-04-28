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
interface WorkoutSchema {
    userId: string;
    coach: string;
    date: string;
    comments?: string;
    exercise?: string;
    reps?: number;
    video?: string; //url
    weight?: number;
    sets?: number;
}
const workoutSchema: JSONSchemaType<WorkoutSchema> = {
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
        date: {
            type: 'string', format: 'date-time', errorMessage: {
                format: 'Date must be in ISO date-time format.'
            }
        },
        comments: { type: 'string', nullable: true, minLength: 1, errorMessage: "Comments cannot be empty." },
        exercise: { type: 'string', nullable: true, minimum: 0, errorMessage: "exercise must be between" },
        reps: { type: 'number', nullable: true, minimum: 0, errorMessage: "reps must be a non-negative number." },
        video: { type: 'string', nullable: true, format: 'url', errorMessage: "invalid url." },
        weight: { type: 'number', nullable: true, minimum: 0, errorMessage: "weight must be a non-negative number." },
        sets: { type: 'number', nullable: true, minimum: 0, errorMessage: "Set must be a non-negative number." },
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
const validateEvaluation = ajv.compile(workoutSchema);

// Example workout data
const workoutData = {
    "userId": "124578",
    "coach": "Emily Watson",
    "date": "2023-04-28T07:30:00Z",
    "comments": "Good progress, keep focusing on form.",
    "exercise": "Deadlift",
    "reps": 5,
    "sets": 3,
    "weight": 120, // This is in kilograms
    "video": "https://example.com/videos/workout123.mp4"
};


// Validate the data using the compiled function and log the results
if (validateEvaluation(workoutData)) {
    log.info("Evaluation data is valid!");
} else {
    log.error("Validation errors:", validateEvaluation.errors);
}
