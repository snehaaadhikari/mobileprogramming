// hello.js

import {
  auth,
  db,
  ref,
  onValue,
  set, // Needed for initBloodStock
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserData,
  createBloodRequest,
  createDonation,
  updateBloodRequestStatus,
  deleteBloodRequest,
  updateBloodStock,
} from "./firebase.js"; // All imports are now combined here

// --- Element References ---
const authPage = document.getElementById("authPage");
const loginForm = document.getElementById("loginForm");
const mainHeader = document.getElementById("mainHeader");
const offScreenMenu = document.getElementById("menu");
const mainContent = document.getElementById("mainContent");
const registerForm = document.getElementById("registerForm");
const registerModal = document.getElementById("registerModal");
const logoutBtn = document.getElementById("logoutBtn");
const bloodRequestForm = document.getElementById("bloodRequestForm");
const donateForm = document.getElementById("donateForm");
const donateBtn = document.getElementById("donateBtn");
const donateModal = document.getElementById("donateModal");
const closeDonateModalBtn = donateModal.querySelector(".close");
const requestsList = document.getElementById("requestsList");
const activitiesList = document.getElementById("activitiesList");

// Blood types array
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// --- Helper Function to Toggle App Visibility ---
function toggleAppVisibility(isAuthenticated) {
  if (isAuthenticated) {
    // Show App Content
    mainHeader.classList.add("show-app");
    offScreenMenu.classList.add("show-app");
    mainContent.classList.add("show-app");
    authPage.style.display = "none";
  } else {
    // Show Login Page
    mainHeader.classList.remove("show-app");
    offScreenMenu.classList.remove("show-app");
    mainContent.classList.remove("show-app");
    authPage.style.display = "flex"; // Use flex to center the login form
  }
}

// --- 1. Real-time Authentication State Listener ---
// Checks if the user is already logged in when the app starts.
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    console.log("User logged in:", user.email);
    toggleAppVisibility(true);
    setupListeners(); // Set up real-time listeners after login
  } else {
    // User is logged out
    console.log("User logged out (or starting app).");
    toggleAppVisibility(false);
  }
});

// Function to set up real-time listeners for data
function setupListeners() {
  // Initialize blood stock if not exists
  initBloodStock(); // Listen for blood stock changes

  const bloodStockRef = ref(db, "bloodStock");
  onValue(bloodStockRef, (snapshot) => {
    const stock = snapshot.val() || {};
    bloodTypes.forEach((type) => {
      const elem = document.getElementById(`stock-${type}`);
      if (elem) {
        elem.textContent = stock[type] || 0;
      }
    });
  }); // Listen for blood requests changes

  const bloodRequestsRef = ref(db, "bloodRequests");
  onValue(bloodRequestsRef, (snapshot) => {
    requestsList.innerHTML = "";
    if (snapshot.exists()) {
      snapshot.forEach((child) => {
        const data = child.val();
        const requestKey = child.key;

        const listItem = document.createElement("li");
        listItem.className = `urgent-box ${
          data.status === "Fulfilled" ? "fulfilled" : "pending"
        }`;

        listItem.innerHTML = `
          <p><strong>Blood Type:</strong> ${data.bloodType}</p>
          <p><strong>Units:</strong> ${data.units}</p>
          <p><strong>Hospital:</strong> ${data.hospital}</p>
          <p><strong>Status:</strong> <span class="status-${data.status.toLowerCase()}">${
          data.status
        }</span></p>
          <div class="action-buttons">
              <button class="urgent-btn" onclick="handleUpdateStatus('${requestKey}', '${
          data.bloodType
        }', ${data.units})" ${data.status === "Fulfilled" ? "disabled" : ""}>
              ${data.status === "Fulfilled" ? "Fulfilled" : "Mark as Fulfilled"}
              </button>
              <button class="urgent-btn delete-btn" onclick="handleDeleteRequest('${requestKey}')">Delete</button>
          </div>
      `;
        requestsList.appendChild(listItem);
      });
    } else {
      requestsList.innerHTML =
        '<li class="no-requests">No active blood requests found.</li>';
    }
  }); // Listen for recent donations (for activities)

  const donationsRef = ref(db, "donations");
  onValue(donationsRef, (snapshot) => {
    activitiesList.innerHTML = "";
    if (snapshot.exists()) {
      let donations = [];
      snapshot.forEach((child) => {
        donations.push(child.val());
      }); // Sort by timestamp descending and take last 5
      donations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      donations.slice(0, 5).forEach((data) => {
        const div = document.createElement("div");
        div.className = "abox";
        div.innerHTML = `
          <h3><p>Donation by ${data.donorName}</p></h3>
          <p>- Donated ${data.units} units of ${data.donateBloodType} at ${data.donateLocation}</p>
        `;
        activitiesList.appendChild(div);
      });
    } else {
      activitiesList.innerHTML = "<p>No recent activities.</p>";
    }
  });
}

// Global handlers for update and delete (since in HTML)
window.handleUpdateStatus = async function (id, bloodType, units) {
  if (confirm("Confirm that this blood request has been fulfilled?")) {
    // Check stock
    const stockRef = ref(db, `bloodStock/${bloodType}`);
    onValue(
      stockRef,
      async (snapshot) => {
        const currentStock = snapshot.val() || 0;
        if (currentStock >= units) {
          await updateBloodStock(bloodType, -units);
          await updateBloodRequestStatus(id);
        } else {
          alert("Insufficient stock to fulfill this request.");
        }
      },
      { onlyOnce: true }
    );
  }
};

window.handleDeleteRequest = function (id) {
  if (confirm("Are you sure you want to delete this blood request?")) {
    deleteBloodRequest(id);
  }
};

// Function to initialize blood stock if not exists
function initBloodStock() {
  const stockRef = ref(db, "bloodStock");
  onValue(
    stockRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        const initialStock = {};
        bloodTypes.forEach((type) => {
          initialStock[type] = 0;
        });
        set(stockRef, initialStock);
      }
    },
    { onlyOnce: true }
  );
}

// --- 2. Login Form Submission Handler ---
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password); // onAuthStateChanged listener handles toggleAppVisibility(true)
    alert(`Login successful! Welcome back.`);
  } catch (error) {
    console.error("Firebase Login Error:", error.code, error.message);

    let errorMessage = "Invalid email or password. Please try again.";
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Invalid password.";
    }

    alert(errorMessage);
  }
});

// --- 3. Registration Form Submission Handler ---
registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById(
    "registerConfirmPassword"
  ).value;
  const phone = document.getElementById("registerPhone").value;
  const dob = document.getElementById("registerDOB").value;
  const idType = document.getElementById("registerIDType").value;
  const idNumber = document.getElementById("registerIDNumber").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user; // Save user data using firebase.js function

    await createUserData(user.uid, {
      name,
      email,
      phone,
      dob,
      idType,
      idNumber,
    });

    alert("Registration successful! You are now logged in."); // onAuthStateChanged listener handles toggleAppVisibility(true)

    registerModal.style.display = "none";
  } catch (error) {
    console.error("Firebase Registration Error:", error.code, error.message);
    let errorMessage =
      "Registration failed: " +
      (error.code === "auth/email-already-in-use"
        ? "Email already in use."
        : error.message);
    alert(errorMessage);
  }
});

// --- 4. Logout Functionality ---
logoutBtn.addEventListener("click", async () => {
  try {
    await signOut(auth); // onAuthStateChanged listener handles toggleAppVisibility(false)
    alert("You have been logged out.");
  } catch (error) {
    console.error("Logout Error:", error);
  }
});

// --- 5. Modal Visibility Logic ---
const showRegisterLink = document.getElementById("showRegister");
const closeRegisterModalBtn = document.getElementById("closeRegisterModal");
const requestBloodBtn = document.getElementById("requestBloodBtn");
const requestBloodModal = document.getElementById("requestBloodModal");
const closeRequestModalBtn = requestBloodModal.querySelector(".close");

showRegisterLink.addEventListener("click", () => {
  registerModal.style.display = "block";
});

closeRegisterModalBtn.addEventListener("click", () => {
  registerModal.style.display = "none";
});

requestBloodBtn.addEventListener("click", () => {
  requestBloodModal.style.display = "block";
});

closeRequestModalBtn.addEventListener("click", () => {
  requestBloodModal.style.display = "none";
});

donateBtn.addEventListener("click", () => {
  donateModal.style.display = "block";
});

closeDonateModalBtn.addEventListener("click", () => {
  donateModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == registerModal) {
    registerModal.style.display = "none";
  }
  if (event.target == requestBloodModal) {
    requestBloodModal.style.display = "none";
  }
  if (event.target == donateModal) {
    donateModal.style.display = "none";
  }
});

// --- 6. Request Blood Form Submission ---
bloodRequestForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Get all form data

  const patientName = document.getElementById("name").value;
  const hospital = document.getElementById("hospital").value;
  const bloodType = document.getElementById("bloodType").value;
  const units = document.getElementById("units").value;
  const reason = document.getElementById("reason").value;

  try {
    await createBloodRequest({
      patientName,
      hospital,
      bloodType,
      units,
      reason,
    });
    alert("Blood Request Submitted Successfully!");
    bloodRequestForm.reset();
    requestBloodModal.style.display = "none";
  } catch (error) {
    alert("Error submitting request: " + error.message);
  }
});

// --- 7. Donate Form Submission ---
donateForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const donorName = document.getElementById("donorName").value;
  const donateBloodType = document.getElementById("donateBloodType").value;
  const donateUnits = parseInt(document.getElementById("donateUnits").value);
  const donateLocation = document.getElementById("donateLocation").value;

  try {
    await createDonation({
      donorName,
      donateBloodType,
      donateUnits,
      donateLocation,
    });
    await updateBloodStock(donateBloodType, donateUnits);
    alert("Donation Submitted Successfully!");
    donateForm.reset();
    donateModal.style.display = "none";
  } catch (error) {
    alert("Error submitting donation: " + error.message);
  }
});
