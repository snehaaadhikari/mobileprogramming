// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
// CORRECT PATH
import {
  getDatabase,
  get,
  set,
  ref,
  remove,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApdRDrF-Bs_Ci_M68oZnDja3f9kLapd6Q",
  authDomain: "blood-donation-managemen-2f77e.firebaseapp.com",
  projectId: "blood-donation-managemen-2f77e",
  storageBucket: "blood-donation-managemen-2f77e.firebasestorage.app",
  messagingSenderId: "791113555452",
  appId: "1:791113555452:web:50dba87cef9f2ca0282679",
  measurementId: "G-XBBLM49WY7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getDatabase(app);

console.log(db);

//Using SET GET REF REMOVE (CRUD)
//GET
function userDB(
  userid,
  firstName,
  lastName,
  email,
  phone,
  address,
  gender,
  age,
  priority,
  noofcertificate
) {
  set(ref(db, "/users/" + userid), {
    firstName: firstName,
    lastName: lastName,
    Email: email,
    phone: phone,
    Address: address,
    Gender: gender,
    Age: age,
    Priority: priority,
    NoOfCertification: noofcertificate,
  });
}
userDB(
  101,
  "Sneha",
  "Adhikari",
  "sneh@gmail.com",
  9877832020,
  "KTM",
  "Female",
  22,
  "AI/ML",
  3
);

//Get
// function readUser() {
//   const userRef = ref(db, "users");
//   get(userRef).then((snapshot) => {
//     snapshot.forEach((childsnapshot) => {
//       console.log(childsnapshot.val());
//     });
//   });
// }

// readUser();
function readUser() {
  const userRef = ref(db, "users");
  get(userRef).then((snapshot) => {
    snapshot.forEach((childsnapshot) => {
      console.log(childsnapshot.val());
    });
  });
}
readUser();
