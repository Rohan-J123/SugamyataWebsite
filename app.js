const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { initializeApp } = require('firebase/app');
const { setDoc, doc, getFirestore } = require('firebase/firestore');
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const app = express();
const port = 3000;

const serviceAccount = require('./sugamyatawebsite-firebase-adminsdk-f1nvg-c1737010c3.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://sugamyatawebsite.firebaseio.com'
});

const db = admin.firestore();

const firebaseConfig = {};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const cloud_db = getFirestore(firebaseApp);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('main', { title: 'Home', message: 'Welcome to the Home Page!' });
});

app.get('/buckets', (req, res) => {
    res.render('buckets');
});

app.get('/contributers_courses', (req, res) => {
    res.render('contributers_courses');
});

app.get('/main', (req, res) => {
    res.render('main');
});

app.post('/signUp', (req, res) => {
    const { email, password } = req.body;
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log("User signed up:", user);

            const now = new Date();
            const utcOffset = now.getTimezoneOffset() * 60000;
            const istOffset = 5.5 * 60 * 60 * 1000;
            const istTime = new Date(now.getTime() + utcOffset + istOffset);

            try {
                await setDoc(doc(cloud_db, "player-data", user.uid), {
                    email: user.email,
                    createdAt: String(istTime)
                });
                return res.status(201).json({ message: "User signed up successfully", user: user });
            } catch (firestoreError) {
                console.error("Error creating Firestore document:", firestoreError);
                return res.status(500).json({ message: "Error creating Firestore document", error: firestoreError.message });
            }
        })
        .catch((error) => {
            console.error("Error signing up:", error);
            return res.status(400).json({ message: "Error signing up", error: error.message });
        });
});

app.post('/signIn', (req, res) => {
    const { email, password } = req.body;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User signed in:", user);
            res.status(201).json({ message: "User signed in successfully", user: user });
        })
        .catch((error) => {
            console.error("Error signing in:", error);
            res.status(400).json({ message: "Error signing in", error: error.message });
        });
});


app.post('/createDocument', async (req, res) => {
    try {
        const collectionName = req.body.collectionName || 'player-data';
        const docRef = await db.collection(collectionName).add({});
        res.json({ documentId: docRef.id });
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).send('Error creating document');
    }
});

app.get('/getCollectionData', async (req, res) => {
    try {
        const collectionName = req.query.collectionName || 'player-data';
        const snapshot = await db.collection(collectionName).get();
        const data = snapshot.docs.map(doc => doc.data());
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});


app.post('/addDocumentData', async (req, res) => {
    try {
        let { id, ...documentData} = req.body;
        const collectionName = req.query.collectionName || 'player-data';
        if (!documentData) {
            return res.status(400).send('Content is required');
        }

        let docRef;
        if (id) {
            docRef = db.collection(collectionName).doc(id);
        } else {
            docRef = await db.collection(collectionName).add(documentData);
            id = docRef.id;
        }

        await docRef.set(documentData, { merge: true });
        res.json({ message: 'Data added successfully', id });
    } catch (error) {
        console.error('Error writing data:', error);
        res.status(500).send('Error writing data');
    }
});

app.get('/getDocumentData', async (req, res) => {
    try {
        const collectionName = req.query.collectionName || 'player-data';
        const docId = req.query.id;
        
        let data = [];

        if (docId) {
            const docSnapshot = await db.collection(collectionName).doc(docId).get();
            if (docSnapshot.exists) {
                data = [docSnapshot.data()];
            } else {
                return res.status(404).send('Document not found');
            }
        } else {
            return res.status(400).send('Document ID is required');
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
