import { describe, expect, it } from '@jest/globals';
import dataController from '../../../src/app/controllers/dataController';
import dbController from '../../../src/app/controllers/db.controller';


interface WorkoutMockData {
    [workoutId: string]: {
        coach: string;
        comments: string[];
        exercise: string[];
        reps: string[];
        sets: string[];
        userId: string;
        video: string[];
        weight: string[];
    };
}

const workoutMockData: WorkoutMockData = {
    'UoIskiaLUkmuyv1YGYNF': {
        coach: 'Workout Coach',
        comments: ['Do this workout.', 'You can do it'],
        exercise: ['bench press', 'squat'],
        reps: ['5', '8'],
        sets: ['5', '4'],
        userId: '502649053160928139704',
        video: ['youtube.url/bench', 'youtube.url/squat'],
        weight: ['205', '185']
    }
};


jest.mock('../../../src/app/firebase.ts', () => {
    return {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockImplementation((workoutId) => {
            return {
                get: jest.fn().mockResolvedValue({ // this need to be better defined
                    exists: workoutMockData[workoutId] !== undefined, 
                    data: () => workoutMockData[workoutId]
                }),
                set: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                delete: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                update: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
            };
        })
    };
});

describe('dataController.procesWorkout', () => {
    it('should add a workout to the database and redirect', async () => {
       const req = workoutMockData;
       const res = {
           redirect: jest.fn()
       };
       await dataController.processWorkout(req, res);
       expect(res.redirect).toHaveBeenCalledWith('/');
   });
});

/*
describe('db.controller.', () => {
    it('should get the workout and be equal to the mock data', async () => {
        expect(getworkoutnotmade('QwIskiaLUkmuyv1YGYNF')).toEqual(workoutMockData);
   });
});
*/