import { describe, expect, it } from '@jest/globals';
import dataController from '../../../src/app/controllers/dataController';
import dbController from '../../../src/app/controllers/db.controller';


interface PitchingMockData {
    [evalId: string]: {
        coach: string;
        comments: string;
        date: string;
        moundVelo: number;
        pitching: boolean;
        pulldownVelo: number;
        userId: string;
    };
}

const pitchingMockData: PitchingMockData = {
    'yFPi5lAIvwJWRWkCDXT0': {     
        coach: 'Pitching Coach',
        comments: 'Work on pitching.',
        date: Date(),  //
        moundVelo: 88,
        pitching: true,
        pulldownVelo: 90,
        userId: '111015587133119133740' //
    }
};


jest.mock('../../../src/app/firebase.ts', () => {
    const pitchingMockData: PitchingMockData = {
        'yFPi5lAIvwJWRWkCDXT0': {     
            coach: 'Pitching Coach',
            comments: 'Work on pitching.',
            date: Date(),  //
            moundVelo: 88,
            pitching: true,
            pulldownVelo: 90,
            userId: '111015587133119133740' //
        }
    };
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

describe('dataController.processPitching', () => {
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

describe('db.controller.getPlayerEvaluationsByProfileID', () => {
    it('should get the evalution and be equal to the mock data', async () => {
        const pitching = await dbController.getPlayerEvaluationsByProfileID('111015587133119133740');
        expect(pitching).toEqual(pitchingMockData);
   });
});
