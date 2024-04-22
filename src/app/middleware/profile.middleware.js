import db from '../firebase';

const profileMiddleware = {
    async evalGetter(req, res, next) {
        if (req.session.passport.user.player) {
            console.log('eval middleware called')
            const snapshot = await db.collection('evaluations')
                .where('userId', '==', req.session.passport.user.id)
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
            // console.log(req.session.evaluations);
            next();
        } else {
            next();
        }
    }
}
export default profileMiddleware;
