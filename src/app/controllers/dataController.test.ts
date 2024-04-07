import { describe, expect, it } from '@jest/globals';
import dataController from '../../../src/app/controllers/dataController';
import db from '../firebase';

//test file that uses real DB but deletes tests docs afterwards
//When the process is called it puts date in DB as a string instead of timestamp for some reason.
/*
describe("Data Controller Process Tester", () => {
    it("should process pitching data correctly", async () => {
        const req = {
            body: {
            coachName: "Coach Oliver",
            selectedPlayer: "Player Test",
            moundVelo: 90,
            pulldownVelo: 85,
            comments: "Good pitching",
            },
        };
        const res = {
            redirect: jest.fn(),
        };

        const id = await dataController.processPitching(req, res);
        const evalRef = db.collection("evaluations");
        const querySnapshot = await evalRef.doc(id).get();
        const addedDoc = querySnapshot.data();
        
        expect(addedDoc).toEqual({
            coach: req.body.coachName,
            userId: req.body.selectedPlayer,
            moundVelo: req.body.moundVelo,
            pulldownVelo: req.body.pulldownVelo,
            comments: req.body.comments,
            date: addedDoc.date,
            pitching: true,
        });

        const docToDelete = evalRef.doc(id);
        await docToDelete.delete();
      
    });

    it("should process hitting data correctly", async () => {
        const req = {
          body: {
            coachName: "Test Coach",
            selectedPlayer: "Test Player",
            exitVeloTee: 90,
            exitVeloToss: 85,
            comments: "npm test ran. This is a test evaluation.",
          },
        };
        const res = {
          redirect: jest.fn(),
        };
        
        const id = await dataController.processHitting(req, res);
        
        const evalRef = db.collection("evaluations");
        const querySnapshot = await evalRef.doc(id).get();
        const addedDoc = querySnapshot.data();
        
        
        expect(addedDoc).toEqual({
          coach: req.body.coachName,
          userId: req.body.selectedPlayer,
          exitVeloTee: req.body.exitVeloTee,
          exitVeloToss: req.body.exitVeloToss,
          comments: req.body.comments,
          date: addedDoc.date,
          hitting: true,
        });

        const docToDelete = evalRef.doc(id);
        await docToDelete.delete();
    });

    it("should process strength data correctly", async () => {
        const req = {
          body: {
            coachName: "Test Coach",
            selectedPlayer: "Test Player",
            squat: 215,
            bench: 190,
            deadlift: 290,
            comments: "npm test ran. This is a test evaluation.",
          },
        };
        const res = {
          redirect: jest.fn(),
        };
        
        const id = await dataController.processStrength(req, res);
        
        const evalRef = db.collection("evaluations");
        const querySnapshot = await evalRef.doc(id).get();
        const addedDoc = querySnapshot.data();
        
        
        expect(addedDoc).toEqual({
          coach: req.body.coachName,
          userId: req.body.selectedPlayer,
          squat: req.body.squat,
          bench: req.body.bench,
          deadlift: req.body.deadlift,
          comments: req.body.comments,
          date: addedDoc.date,
          strength: true,
        });

        const docToDelete = evalRef.doc(id);
        await docToDelete.delete();
    });

    it("should process workout data correctly", async () => {
        const req = {
            body: {
            coachName: "Test Coach",
            selectedPlayer: "Test Player",
            exercise: ['bench press', 'squat'],
            sets: ['5', '8'],
            reps: ['5', '4'],
            weight: ['205', '185'],
            comments: ['npm test ran.', 'This is a test workout.'],
            exampleVideo: ['youtube.url/bench', 'youtube.url/squat']
            },
        };
        const res = {
            redirect: jest.fn(),
        };
            
        const id = await dataController.processWorkout(req, res);
            
        const workoutRef = db.collection("workouts");
        const querySnapshot = await workoutRef.doc(id).get();
        const addedDoc = querySnapshot.data();
        console.log(addedDoc);
        console.log(req);    
            
        expect(addedDoc).toEqual({
            coach: req.body.coachName,
            userId: req.body.selectedPlayer,
            exercise: req.body.exercise,
            sets: req.body.sets,
            reps: req.body.reps,
            weight: req.body.weight,
            comments: req.body.comments,
            video: req.body.exampleVideo
        });
        
        const docToDelete = workoutRef.doc(id);
        await docToDelete.delete();
    });
});
*/
const currentDate = Date();


interface PitchingMockData {
    [evalId: string]: {
        evalId: string,
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

const hittingMockData: HittingMockData = {
    'ErIskiaLUkmuyv1YGYNF': {
        coach: 'Hitting Coach',
        comments: 'Work on form',
        date: Date(),
        exitVeloTee: 76,
        exitVeloToss: 81,
        hitting: true,
        userId: '102649053160928139704'
    }
};

const strengthMockData: StrengthMockData = {
    'QwIskiaLUkmuyv1YGYNF': {
        bench: 190,
        coach: 'Strength Coach',
        comments: 'Work on bench.',
        date: Date(),
        deadlift: 305,
        squat: 230,
        strength: true,
        userId: '211015587133119133740'
    }
};

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

const pitchingMockData: PitchingMockData = {
    'yFPi5lAIvwJWRWkCDXT0': {  
        evalId: 'yFPi5lAIvwJWRWkCDXT0',    
        coach: 'Pitching Coach',
        comments: 'Work on pitching.',
        date: Date(),  //
        moundVelo: 88,
        pitching: true,
        pulldownVelo: 90,
        userId: '111015587133119133740' //
    }
};


// Setup for mock Firebase database
jest.mock('src/app/firebase.ts', () => {
    return {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockImplementation((evalId) => {
            return {
                get: jest.fn().mockResolvedValue({ // this need to be better defined
                    exists: pitchingMockData[evalId] !== undefined, 
                    data: () => pitchingMockData[evalId]
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
        const req = pitchingMockData;
        const res = {
            redirect: jest.fn()
        };
        const pitchingData = await dataController.processPitching(req, res);
        expect(res.redirect).toHaveBeenCalledWith('/');
        expect(pitchingData).toEqual((pitchingMockData['yFPi5lAIvwJWRWkCDXT0']));
    });
});

/*
jest.mock('../../../src/app/firebase.ts', () => {
    return {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockImplementation((evalId) => {
            return {
                get: jest.fn().mockResolvedValue({ // this need to be better defined
                    exists: hittingMockData[evalId] !== undefined, 
                    data: () => hittingMockData[evalId]
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
        const req = hittingMockData;
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
                    exists: strengthMockData[evalId] !== undefined, 
                    data: () => strengthMockData[evalId]
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
       const req = strengthMockData;
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
    //no way to remove or pull down an evaluation so this test adds one
    it('should add a workout to the database and redirect', async () => {
       const req = workoutMockData;
       const res = {
           redirect: jest.fn()
       };
       await dataController.processWorkout(req, res);
       expect(res.redirect).toHaveBeenCalledWith('/');
   });
});
*/