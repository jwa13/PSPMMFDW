import { describe, expect, it } from '@jest/globals';
import dataController from '../../../src/app/controllers/dataController';
import dbController from '../../../src/app/controllers/db.controller';

const id = '102649053160928139704';

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

const hittingMockData: HittingMockData = {
    'ErIskiaLUkmuyv1YGYNF': {
        coach: 'Hitting Coach',
        comments: 'Work on form',
        date: Date(),
        exitVeloTee: 76,
        exitVeloToss: 81,
        hitting: true,
        userId: id
    }
};

jest.mock('../../../src/app/firebase.ts', () => {
    const hittingMockData: HittingMockData = {
        'ErIskiaLUkmuyv1YGYNF': {
            coach: 'Hitting Coach',
            comments: 'Work on form',
            date: Date(),
            exitVeloTee: 76,
            exitVeloToss: 81,
            hitting: true,
            userId: id
        }
    };
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
    it('should add a hitting evaluation to the database and redirect', async () => {
       const req = hittingMockData;
       const res = {
           redirect: jest.fn()
       };
       const hittingData = await dataController.processHitting(req, res);
       expect(res.redirect).toHaveBeenCalledWith('/');
       expect(hittingData).toEqual((hittingMockData['ErIskiaLUkmuyv1YGYNF']));
   });
});


describe('db.controller.getPlayerEvaluationsByProfileID', () => {
    it('should get the evalution and be equal to the mock data', async () => {
        const hitting = await dbController.getPlayerEvaluationsByProfileID('102649053160928139704');
        expect(hitting).toEqual(hittingMockData);
   });
});
