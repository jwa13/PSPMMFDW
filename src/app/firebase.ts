const {
	initializeApp,
	applicationDefault,
	cert,
} = require('firebase-admin/app');
const {
	getFirestore,
	Timestamp,
	FieldValue,
	deleteField,
	Filter,
} = require('firebase-admin/firestore');
const firebaseConfig = {
	credential: 'src/app/controllers/pspmmfdw-6586b-5b850d44ee32.json',
	apiKey: 'AIzaSyC2EVM2_4lOG83k3kf_2XkylX-hOLc7Pfc',
	authDomain: 'pspmmfdw-6586b.firebaseapp.com',
	projectId: 'pspmmfdw-6586b',
	storageBucket: 'pspmmfdw-6586b.appspot.com',
	messagingSenderId: '949890250152',
	appId: '1:949890250152:web:81bb4fac772a0cc547d99d',
	measurementId: 'G-CX84FKXHHK',
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

export default db;
