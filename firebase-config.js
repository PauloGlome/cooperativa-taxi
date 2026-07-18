import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getDatabase } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

const firebaseConfig = {

apiKey: "AIzaSyC7IChnSfeXLzsMgiKyzywguOXEOz26JOM",

authDomain: "cooperativa-taxi.firebaseapp.com",

databaseURL: "https://cooperativa-taxi-default-rtdb.europe-west1.firebasedatabase.app",

projectId: "cooperativa-taxi",

storageBucket: "cooperativa-taxi.firebasestorage.app",

messagingSenderId: "468818057773",

appId: "1:468818057773:web:cccceef57933330c72b6a4"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const database = getDatabase(app);

export { app,auth, database };

