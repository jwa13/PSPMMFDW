import db from '../firebase';
import dbController from '../controllers/db.controller.js';

const profileMiddleware = {
    async evalGetter(req, res, next) {
        if (req.session.passport.user.player) {
            console.log(`[profileMiddleware]: calling getPlayerEvaluations(${req.session.passport.user.id})`);
            req.session.evaluations = await dbController.getPlayerEvaluations(req.session.passport.user.id);
            console.log(`[profileMiddleware]: req.session.evaluations = ${req.session.evaluations}`);
            next();
        } else {
            console.log('[profileMiddleware]: No player information found in session, skipping evaluation retrieval.');
            next();
        }
    }
}
export default profileMiddleware;
