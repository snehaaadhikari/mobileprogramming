import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjkxmd78sscUCMyYyRLIYOaP5aKr4RM-w",
  authDomain: "blooddonationsystem-e9623.firebaseapp.com",
  databaseURL: "https://blooddonationsystem-e9623-default-rtdb.firebaseio.com",
  projectId: "blooddonationsystem-e9623",
  storageBucket: "blooddonationsystem-e9623.firebasestorage.app",
  messagingSenderId: "111364708782",
  appId: "1:111364708782:web:5a3b76f8a14fb29bfa103f",
  measurementId: "G-41FLC7DMWN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const msgBox = document.getElementById("msgBox");

function showMsg(text, type = "error") {
  msgBox.textContent = text;
  msgBox.className = "alert " + type;
  msgBox.style.display = "block";
  setTimeout(() => (msgBox.style.display = "none"), 4000);
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showMsg("Please fill in all fields.");
    return;
  }

  // Example: check against a "users" node in RTDB
  const usersRef = ref(db, "users");
  onValue(
    usersRef,
    (snapshot) => {
      let found = false;
      snapshot.forEach((child) => {
        const user = child.val();
        if (user.email === email && user.password === password) {
          found = true;
          showMsg("Login successful!", "success");
          setTimeout(() => {
            window.location.href = "dashboard.html"; // redirect after login
          }, 1000);
        }
      });
      if (!found) showMsg("Invalid email or password.");
    },
    {
      onlyOnce: true,
    }
  );
});
