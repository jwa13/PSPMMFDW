import { describe, expect, test } from '@jest/globals';
import dbController from '../../../src/app/controllers/db.controller';



const playerEmail = "test_player@pspmmfdw.gmail.com";
const coachEmail = "test_coach@pspmmfdw.gmail.com";
const adminEmail = "test_admin@pspmmfdw.gmail.com";
const newUserEmail = "test_admin@pspmmfdw.gmail.com";
const deleteUserEmail = "test_admin@pspmmfdw.gmail.com";
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
        profileId: '000000000000000000000',
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
                get: jest.fn().mockResolvedValue({
                    exists: mockData[email] !== undefined,
                    data: () => mockData[email]
                })
            };
        })
    };
});

describe('dbController.getUserByEmail', () => {
    // Test for retrieving the Player existing user
    it('should retrieve an existing user by email', async () => {
        const user = await dbController.getUserByEmail(playerEmail);

        expect(user).toEqual({
            email: playerEmail,
            profileId: '000000000000000000000',
            name: 'Player User',
            team: 'Player Team',
            admin: false,
            coach: false,
            player: true
        });
    });

    // Test for retrieving the coach existing user
    it('should retrieve another existing user by email', async () => {
        const user = await dbController.getUserByEmail(coachEmail);

        expect(user).toEqual({
            email: coachEmail,
            profileId: '111111111111111111111',
            name: 'Coach User',
            team: 'Coach Team',
            admin: false,
            coach: true,
            player: false
        });
    });

    // Test for retrieving the Admin existing user
    it('should retrieve admin existing user by email', async () => {
        const user = await dbController.getUserByEmail(adminEmail);

        expect(user).toEqual({
            email: adminEmail,
            profileId: '3333333333333333333333',
            name: 'Admin User',
            team: '',
            admin: true,
            coach: false,
            player: false
        });
    });

    // Test for attempting to retrieve a user that does not exist
    it('should return null for a non-existing user', async () => {
        const user = await dbController.getUserByEmail(badUserEmail);

        expect(user).toBeNull();
    });

// db.controller.test.ts

// Refined tests for the createUser method

    describe('dbController.createUser', () => {
        const newUser = {
                email: 'new_user@pspmmfdw.gmail.com',
                profileId: '4444444444444444444444',
                name: 'New User',
                team: 'New Team',
                admin: false,
                coach: false,
                player: true
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
});
