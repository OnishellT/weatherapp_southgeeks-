const { initializeApp, getApps, getApp } = require("firebase/app");
const { getDatabase, ref } = require("firebase/database");

let app;
let database;
let usersRef;

const initializeFirebase = async () => {
    if (app) {
        return;
    }
    
    let firebaseConfig;
    const hasDirect = (
        process.env.FIREBASE_API_KEY &&
        process.env.FIREBASE_AUTH_DOMAIN &&
        process.env.FIREBASE_DATABASE_URL &&
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_STORAGE_BUCKET &&
        process.env.FIREBASE_MESSAGING_SENDER_ID &&
        process.env.FIREBASE_APP_ID
    );
    if (hasDirect) {
        firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
        };
    } else {
        const { getParameters } = require('../utils/ssm');
        const names = [
            process.env.FIREBASE_API_KEY_NAME,
            process.env.FIREBASE_AUTH_DOMAIN_NAME,
            process.env.FIREBASE_DATABASE_URL_NAME,
            process.env.FIREBASE_PROJECT_ID_NAME,
            process.env.FIREBASE_STORAGE_BUCKET_NAME,
            process.env.FIREBASE_MESSAGING_SENDER_ID_NAME,
            process.env.FIREBASE_APP_ID_NAME,
        ];
        const ssmParams = await getParameters(names);
        firebaseConfig = {
            apiKey: ssmParams[process.env.FIREBASE_API_KEY_NAME],
            authDomain: ssmParams[process.env.FIREBASE_AUTH_DOMAIN_NAME],
            databaseURL: ssmParams[process.env.FIREBASE_DATABASE_URL_NAME],
            projectId: ssmParams[process.env.FIREBASE_PROJECT_ID_NAME],
            storageBucket: ssmParams[process.env.FIREBASE_STORAGE_BUCKET_NAME],
            messagingSenderId: ssmParams[process.env.FIREBASE_MESSAGING_SENDER_ID_NAME],
            appId: ssmParams[process.env.FIREBASE_APP_ID_NAME],
        };
    }

    try {
        if (!getApps().length) {
            console.log("Initializing Firebase app...");
            app = initializeApp(firebaseConfig);
            console.log("Firebase app initialized successfully.");
        } else {
            app = getApp();
            console.log("Re-using existing Firebase app.");
        }
        database = getDatabase(app);
        usersRef = ref(database, 'users');
    } catch (error) {
        console.error("Firebase initialization error:", error.message);
        console.error("Firebase config used:", firebaseConfig);
        throw new Error("Failed to initialize Firebase. Please check your Firebase configuration or environment variables.");
    }
};

module.exports = {
  initializeFirebase,
  getDB: () => database,
  getUsersRef: () => usersRef,
};