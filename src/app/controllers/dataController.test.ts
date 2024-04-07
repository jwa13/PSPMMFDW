import { describe, expect, it } from '@jest/globals';
import dataController from '../../../src/app/controllers/dataController';

/*
const playerEmail = "test_player@pspmmfdw.gmail.com";
const coachEmail = "test_coach@pspmmfdw.gmail.com";
const adminEmail = "test_admin@pspmmfdw.gmail.com";
const newUserEmail = "test_newUserEmail@pspmmfdw.gmail.com";
const deleteUserEmail = "test_deleteUserEmail@pspmmfdw.gmail.com";
const badUserEmail = "bad@pspmmfdw.gmail.com";
const updateUserEmail = 'test_UpdateUser@pspmmfdw.gmail.com';
*/

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



describe('dbController.removeUser', () => {
    it('removeUser should remove an existing user and return their data', async () => {
        const removeUserResult = await dbController.removeUser(mockData['test_deleteUser@pspmmfdw.gmail.com']);
        console.log(removeUserResult);
        expect(await dbController.getUserByEmail(mockData['test_deleteUser@pspmmfdw.gmail.com'])).toBeFalsy();
    });
    it('removeUser should return false for a non-existing user', async () => {
        const baduser = { email: badUserEmail };
        const removeUserResult = await dbController.removeUser(baduser);
        console.log(removeUserResult);
        console.log(baduser);
        expect(removeUserResult).toBeFalsy();
    });
});
describe('dbController.updateUser', () => {
    const userProfileUpdate = {
        email: updateUserEmail,
        profileId: '6666666666666666666666',
        name: 'Updated User',
        team: 'Updated Team',
        admin: false,
        coach: false,
        player: true
    };
    const ilegalUserProfileUpdate = {
        email: updateUserEmail,
        profileId: '4156456456415648465146',
        name: 'illegal User',
        team: 'illegal Team',
        admin: true,
        coach: false,
        player: false
    };
    const badUser = {
        email: badUserEmail,
        profileId: '4444444444444444444444',
        name: 'Bad User',
    };
    it('updateUser should update the profile of an existing user and return their data', async () => {
        const updateUserResult = await dbController.updateUser(userProfileUpdate);
        console.log(updateUserResult);
        console.log(userProfileUpdate);
        expect(updateUserResult).toEqual(userProfileUpdate);
    });
    it('updateUser should return false for a non-existing user', async () => {
        const updateUserResult = await dbController.updateUser(badUser);
        console.log(updateUserResult);
        console.log(badUser);
        expect(updateUserResult).toBeFalsy();
    });
//    it('updateUser should return false for an existing user but an attempt to modify restricted data fields', async () => {
//        const updateUserResult = await dbController.updateUser(ilegalUserProfileUpdate);
//        console.log(updateUserResult);
//        console.log(ilegalUserProfileUpdate);
//        expect(updateUserResult).toBeFalsy();
//    });
});
*/