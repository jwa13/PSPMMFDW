import db from '../firebase';

const homeMiddleware = {
    async evalGetter(req, res, next) {
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
            evaluations.forEach(item => {
                item.data.date = item.data.date.toDate()
                    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'});
            });
            req.session.evaluations = evaluations;
            console.log(req.session.evaluations);
            next();
        } else {
            next();
        }
    }
}
export default homeMiddleware;