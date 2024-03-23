import db from '../firebase'


const evalMiddleware = {
    async getAllPlayers(req, res, next) {
        console.log('getting to the all players area')
        const snapshot = await db.collection('users')
        .where('player', '==', true)
        .get();
        const players = [];
        snapshot.forEach(doc => {
            players.push({
                name: doc.data().name,
                id: doc.data().profileId
            });
        });
        req.session.players = players;
        console.log(req.session.players);
        next();
    }
}

export default evalMiddleware