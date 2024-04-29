import { describe, expect, it } from '@jest/globals';
import dataController from '../../../src/app/controllers/dataController';
import dbController from '../../../src/app/controllers/db.controller';


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


jest.mock('../../../src/app/firebase.ts', () => {
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
    it('should add a strength evaluation to the database and redirect', async () => {
       const req = strengthMockData;
       const res = {
           redirect: jest.fn()
       };
       const strengthData = await dataController.processStrength(req, res);
       expect(res.redirect).toHaveBeenCalledWith('/');
       expect(strengthData).toEqual((strengthMockData['QwIskiaLUkmuyv1YGYNF']));
   });
});


describe('db.controller.getPlayerEvaluationsByProfileID', () => {
    it('should get the evalution and be equal to the mock data', async () => {
        const strength = await dbController.getPlayerEvaluationsByProfileID('211015587133119133740');
        expect(strength).toEqual(strengthMockData);
   });
});
