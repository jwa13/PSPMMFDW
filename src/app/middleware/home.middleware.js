import db from '../firebase';

module.exports = {
    evalGetter: async (req, res, next) => {
        if (req.session.passport.user.player) {
            const snapshot = await db.collection('evaluations')
                .where('userId', '==', req.session.passport.user.id)
                .orderBy('date', 'desc')
                .limit(1)
                .get();
            const evaluations = [];
            snapshot.forEach(doc => {
                evaluations.push({
                    data: doc.data()
                });
            });
            if(evaluations.length > 0) {
                evaluations.forEach(item => {
                    item.data.date = item.data.date.toDate()
                        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
                });
            }
            req.session.evaluations = evaluations;
            // console.log(req.session.evaluations);
            next();
        } else {
            next();
        }
    },

    workoutGetter: async (req, res, next) => {
        if(req.session.passport.user.player) {
            const snapshot = await db.collection('workouts')
            .where('userId', '==', req.session.passport.user.id)
            .where('completed', '==', false)
            .get();
            const workouts = [];
            snapshot.forEach(doc => {
                workouts.push({
                    data:doc.data()
                });
            });
            console.log(workouts);
            if(workouts.length > 0) {
                workouts.forEach(item => {
                    item.data.dateCreated = item.data.dateCreated.toDate()
                        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
                });
            }
            req.session.workouts = workouts;
            // console.log(req.session.workouts);
            next();
        } else if(req.session.passport.user.coach) {
            // Get Incomplete Workouts
            let snapshot = await db.collection('workouts')
            .where('coachId', '==', req.session.passport.user.id)
            .where('completed', '==', false)
            .get();
            const incompleteWorkouts = [];
            snapshot.forEach(doc => {
                incompleteWorkouts.push({
                    data:doc.data()
                });
            });
            if(incompleteWorkouts.length > 0) {
                incompleteWorkouts.forEach(item => {
                    item.data.dateCreated = item.data.dateCreated.toDate()
                        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
                });
            }
            req.session.incompleteWorkouts = incompleteWorkouts;
            
            // Get Completed Workouts
            snapshot = await db.collection('workouts')
            .where('coachId', '==', req.session.passport.user.id)
            .where('completed', '==', true)
            .get();
            const completedWorkouts = [];
            snapshot.forEach(doc => {
                completedWorkouts.push({
                    data:doc.data()
                });
            });
            if(completedWorkouts.length > 0) {
                completedWorkouts.forEach(item => {
                    item.data.dateCreated = item.data.dateCreated.toDate()
                        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
                });
            }
            req.session.completedWorkouts = completedWorkouts;
            next();
        } else {
            next();
        }
    },
};