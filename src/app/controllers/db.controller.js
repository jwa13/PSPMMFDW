import db from '../firebase.ts';

const dbController = {
    getUserByEmail: async (email) => {
        try {
            const existingUser = db.collection('users').doc(email);
            const userDoc = await existingUser.get();
            if (!userDoc.exists) {
                console.log(`[dbController:getUserByEmail:] User ${email} does not exist`);
                return null;
            } else {
                console.log(`[dbController:getUserByEmail:] User ${email} retireved with data: `, userDoc.data());
                return userDoc.data();
            }
        } catch (error) {
            console.error(`[dbController:getUserByEmail:] Error getting user ${email}:`, error);
            return null;
        }
    },
    
    createUser: async (userData) => {
        try {
            if (!await this.getUserByEmail(userData.email)) {                        //If User is not in DB 
                await db.collection('users').doc(userData.email).set(userData); //attempt creating user doc
                console.log(`[dbController:createUser:] User created with email: ${userData.email}`);
                return newUser.data();
            }
            return false; // if user is in DB
        } catch (error) {
            console.error(`[dbController:createUser:] Error creating user ${userData.email}:`, error);
            return null;
        }
    },
    
    removeUser: async (userData) => {
        try {
            const userToRemove = this.getUserByEmail(userData.email);
            if (userToRemove) {                        //If User is in DB 
                await db.collection('users').doc(userData.email).delete();
                console.log(`[dbController:removeUser:] Removed user with email: ${userData.email}`);
                return userData.data();
            }
            return false; // if user is not in DB
        } catch (error) {
            console.error(`[dbController:removeUser:] Error deleting user ${userData.email}:`, error);
            return null;
        }
    },
    // Admin User Method 
    // used to update existing user datafields Validation need to be added to prevent google auth ID infor from being modified
    // these validation methods will be added when danny creates the testing modules for database access. Though the Admin Profile 
    // created yet the DB methods it will use and the testing / validation can be completed now.
    updateUser: async (userData) => {
        try {
            const userToUpdate = this.getUserByEmail(userData.email);
            if (userToUpdate) {                        //If User is in DB 
                await db.collection('users').doc(userData.email).update(userData);
                console.log(`[dbController:updateUser:] Updated User with email: ${email}`);
                return userData.data();
            }
            return false; // if user is not in DB
        } catch (error) {
            console.error(`[dbController:updateUser:] Error updating user ${email}:`, error);
            return null;
        }
    },

    getPlayerEvaluations: async (sessionUserID) => {
        try {
            const playerEvaluations = await db.collection('evaluations')
                .where('userId', '==', sessionUserID)
                .get();
            const evaluations = [];
            playerEvaluations.forEach(doc => {
                evaluations.push({
                    data: doc.data()
                });
            });
            evaluations.forEach(item => {
                item.data.date = item.data.date.toDate()
                    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            });
            return evaluations;
        } catch {
            console.error('[dbController:getPlayerEvaluations] Error creating user:', error);
            return null;
        }
    }
};

export default dbController;
