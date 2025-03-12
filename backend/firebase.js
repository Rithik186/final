import admin from "firebase-admin";
import { readFile } from "fs/promises";

// Load Firebase service account credentials
const serviceAccount = JSON.parse(
  await readFile("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sendora-9e14f-default-rtdb.firebaseio.com"
});

export const db = admin.database();
export const auth = admin.auth();
const app = initializeApp(firebaseConfig);