import { describe, expect, it } from '@jest/globals';
import dataController from '../../../src/app/controllers/dataController';

const currentDate = Date();

interface PitchingMockData {
    [evalID: string]: {
        coach: string;
        comments: string;
        date: string;
        moundVelo: number;
        pitching: boolean;
        pulldownVelo: number;
        userId: string;
    };
}

interface HittingMockData {
    [evalId: string]: {
        coach: string;
        comments: string;
        date: string;
        exitVeloTee: number;
        exitVeloToss: number;
        hitting: boolean;
        userId: string;
    };
}

interface StrengthMockData {
    [evalId: string]: {
        bench: number;
        coach: string;
        comments: string;
        date: string;
        deadlift: number;
        squat: number;
        strength: boolean;
        userId: string;
    };
}
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


const PitchingMockData: PitchingMockData = {
    'yFPi5lAIvwJWRWkCDXT0': {      //
        coach: 'Pitching Coach',
        comments: 'Work on pitching.',
        date: currentDate,  //
        moundVelo: 88,
        pitching: true,
        pulldownVelo: 90,
        userId: '111015587133119133740' //
    },
};

const HittingMockData: HittingMockData = {
    'ErIskiaLUkmuyv1YGYNF': {
        coach: 'Hitting Coach',
        comments: 'Work on form',
        date: currentDate,
        exitVeloTee: 76,
        exitVeloToss: 81,
        hitting: true,
        userId: '102649053160928139704'
    }
};

const StrengthMockData: StrengthMockData = {
    'QwIskiaLUkmuyv1YGYNF': {
        bench: 190,
        coach: 'Strength Coach',
        comments: 'Work on bench.',
        date: currentDate,
        deadlift: 305,
        squat: 230,
        strength: true,
        userId: '211015587133119133740'
    }
};

const WorkoutMockData: WorkoutMockData = {
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


// Setup for mock Firebase database
jest.mock('../../../src/app/firebase.ts', () => {
    return {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockImplementation((evalId) => {
            return {
                get: jest.fn().mockResolvedValue({ // this need to be better defined
                    exists: PitchingMockData[evalId] !== undefined, 
                    data: () => PitchingMockData[evalId]
                }),
                set: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                delete: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                update: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
            };
        })
    };
});

//Possible issue: in dataController fields are defined with different names, example, "coachName".

describe('dataController.processPitching', () => {
    //no way to remove or pull down an evaluation so this test adds one
    it('should add a pitching evaluation to the database and redirect', async () => {
        const req = PitchingMockData;
        const res = {
            redirect: jest.fn()
        };
        const pitchingData = await dataController.processPitching(req, res);
        expect(res.redirect).toHaveBeenCalledWith('/');
        expect(pitchingData).toEqual((PitchingMockData['yFPi5lAIvwJWRWkCDXT0']));
    });
});
/*
jest.mock('../../../src/app/firebase.ts', () => {
    return {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockImplementation((evalId) => {
            return {
                get: jest.fn().mockResolvedValue({ // this need to be better defined
                    exists: HittingMockData[evalId] !== undefined, 
                    data: () => HittingMockData[evalId]
                }),
                set: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                delete: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                update: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
            };
        })
    };
});

describe('dataController.processHitting', () => {
     //no way to remove or pull down an evaluation so this test adds one
     it('should add a hitting evaluation to the database and redirect', async () => {
        const req = HittingMockData;
        const res = {
            redirect: jest.fn()
        };
        await dataController.processHitting(req, res);
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

jest.mock('../../../src/app/firebase.ts', () => {
    return {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockImplementation((evalId) => {
            return {
                get: jest.fn().mockResolvedValue({ // this need to be better defined
                    exists: StrengthMockData[evalId] !== undefined, 
                    data: () => StrengthMockData[evalId]
                }),
                set: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                delete: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                update: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
            };
        })
    };
});

describe('dataController.procesStrength', () => {
    //no way to remove or pull down an evaluation so this test adds one
    it('should add a strength evaluation to the database and redirect', async () => {
       const req = StrengthMockData;
       const res = {
           redirect: jest.fn()
       };
       await dataController.processStrength(req, res);
       expect(res.redirect).toHaveBeenCalledWith('/');
   });
});

jest.mock('../../../src/app/firebase.ts', () => {
    return {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockImplementation((workoutId) => {
            return {
                get: jest.fn().mockResolvedValue({ // this need to be better defined
                    exists: WorkoutMockData[workoutId] !== undefined, 
                    data: () => WorkoutMockData[workoutId]
                }),
                set: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                delete: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                update: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
            };
        })
    };
});

describe('dataController.procesWorkout', () => {
    //no way to remove or pull down an evaluation so this test adds one
    it('should add a workout to the database and redirect', async () => {
       const req = WorkoutMockData;
       const res = {
           redirect: jest.fn()
       };
       await dataController.processWorkout(req, res);
       expect(res.redirect).toHaveBeenCalledWith('/');
   });
});
*/