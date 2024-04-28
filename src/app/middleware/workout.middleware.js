import db from '../firebase'

const workoutMiddleware = {
    async activeWorkout (req, res, next) {
        const snapshot = await db.collection('workouts')
            .where('id', '==', req.query.w)
            .get();
        const workout = [];
        snapshot.forEach(doc => {
            workout.push({
                data: doc.data()
            });
        });
        req.session.activeWorkout = workout;
        next();
    }
}
export default workoutMiddleware