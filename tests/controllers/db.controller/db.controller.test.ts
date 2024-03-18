import { describe, expect, it } from '@jest/globals';
import dbController from '../../../src/app/controllers/db.controller';

const playerEmail = "test_player@pspmmfdw.gmail.com";
const coachEmail = "test_coach@pspmmfdw.gmail.com";
const adminEmail = "test_admin@pspmmfdw.gmail.com";
const newUserEmail = "test_newUserEmail@pspmmfdw.gmail.com";
const deleteUserEmail = "test_deleteUserEmail@pspmmfdw.gmail.com";
const badUserEmail = "bad@pspmmfdw.gmail.com";

interface MockData {
    [email: string]: {
        email: string;
        profileId: string;
        name: string;
        team: string;
        admin: boolean;
        coach: boolean;
        player: boolean;
    };
}

const mockData: MockData = {
    'test_player@pspmmfdw.gmail.com': {
        email: playerEmail,
        profileId: '0000000000000000000000',
        name: 'Player User',
        team: 'Player Team',
        admin: false,
        coach: false,
        player: true
    },
    'test_coach@pspmmfdw.gmail.com': {
        email: coachEmail,
        profileId: '111111111111111111111',
        name: 'Coach User',
        team: 'Coach Team',
        admin: false,
        coach: true,
        player: false
    },
    'test_admin@pspmmfdw.gmail.com': {
        email: adminEmail,
        profileId: '3333333333333333333333',
        name: 'Admin User',
        team: '',
        admin: true,
        coach: false,
        player: false
    },
    'test_deleteUser@pspmmfdw.gmail.com': {
        email: deleteUserEmail,
        profileId: '5555555555555555555555',
        name: 'Delete User',
        team: 'Delete Team',
        admin: false,
        coach: false,
        player: true
    }
};

// Setup for mock Firebase database
jest.mock('../../../src/app/firebase.ts', () => {
    return {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockImplementation((email) => {
            return {
                get: jest.fn().mockResolvedValue({ // this need to be better defined
                    exists: mockData[email] !== undefined, 
                    data: () => mockData[email]
                }),
                set: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
                delete: jest.fn().mockResolvedValue(true), //userdata is passed with isfalsey propery
            };
        })
    };
});

describe('dbController.getUserByEmail', () => {
    // Test for retrieving the Player existing user
    it('should retrieve an existing user by email', async () => {
        const user = await dbController.getUserByEmail(playerEmail);
        expect(user).toEqual((mockData['test_player@pspmmfdw.gmail.com']));
    });

    // Test for retrieving the coach existing user
    it('should retrieve another existing user by email', async () => {
        const user = await dbController.getUserByEmail(coachEmail);
        expect(user).toEqual((mockData['test_coach@pspmmfdw.gmail.com']));
    });

    // Test for retrieving the Admin existing user
    it('should retrieve admin existing user by email', async () => {
        const user = await dbController.getUserByEmail(adminEmail);
        expect(user).toEqual((mockData['test_admin@pspmmfdw.gmail.com']));
    });

    // Test for attempting to retrieve a user that does not exist
    it('should return null for a non-existing user', async () => {
        const user = await dbController.getUserByEmail(badUserEmail);
        expect(user).toBeFalsy();
    });
});
describe('dbController.createUser', () => {
    const newUser = {
        email: newUserEmail,
        profileId: '4444444444444444444444',
        name: 'New User',
    };
    it('should return false when attempting to create a user with an email that already exists', async () => {
        const createUserResult = await dbController.createUser(mockData['test_player@pspmmfdw.gmail.com']);
        expect(createUserResult).toBeFalsy();
    });
    it('should successfully create a new user when the email does not exist in the database', async () => {
        const createUserResult = await dbController.createUser(newUser);
        console.log(newUser);
        console.log(createUserResult);
        expect(createUserResult).toEqual(newUser);
    });
});

describe('dbController.removeUser', () => {
    it('removeUser should remove an existing user and return their data', async () => {
        const removeUserResult = await dbController.removeUser(mockData['test_deleteUser@pspmmfdw.gmail.com']);
        console.log(removeUserResult);
        expect(await dbController.getUserByEmail(mockData['test_deleteUser@pspmmfdw.gmail.com'])).toBeFalsy();
    });
    it('removeUser should return false for a non-existing user', async () => {
        const baduser = { email: badUserEmail }; // Use an email not present in mockData
        const removeUserResult = await dbController.removeUser(baduser);
        console.log(removeUserResult);
        console.log(baduser);
        expect(removeUserResult).toBeFalsy();
    });

});
