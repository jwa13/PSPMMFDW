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
            console.log(`[dbController:getUserByEmail:] Error getting user ${email}:`, error);
            return null;
        }
    },
    
    createUser: async (userData) => {
        let newUser = await dbController.getUserByEmail(userData.email);
        try {
            if (!newUser) {
                await db.collection('users').doc(userData.email).set(userData);
                console.log(`[dbController:createUser:] User created with email: ${userData.email}`);
                return userData;
            }
            else
                return null;
        } catch (error) {
            console.log(`[dbController:createUser:] Error creating user ${userData.email}:`, error);
            return null;
        }
    },
    
    removeUser: async (userData) => {
        try {
            let userToRemove = await dbController.getUserByEmail(userData.email);
            if (userToRemove) {                        
                await db.collection('users').doc(userData.email).delete();
                console.log(`[dbController:removeUser:] Removed user with email: ${userToRemove.email}`);
                return userToRemove;
            }
            return false; // if user is not in DB
        } catch (error) {
            console.log(`[dbController:removeUser:] Error deleting user ${userData.email}:`, error);
            return null;
        }
    },

    updateUser: async (userData) => {
        try {
            const userToUpdate = await dbController.getUserByEmail(userData.email);
            if (userData.profileID == userToUpdate.profileID) {                                
                await db.collection('users').doc(userData.email).update(userData);
                console.log(`[dbController:updateUser:] Updated User with email: ${userData.email}`);
                return userData;
            }
            return false; 
        } catch (error) {
            console.log(`[dbController:updateUser:] Error updating user ${userData.email}:`, error);
            return null;
        }
    },

    getPlayerEvaluationsByProfileID: async (sessionUserID) => {
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
            console.log('[dbController:getPlayerEvaluations] Error creating user:', error);
            return null;
        }
    }
};

export default dbController;
