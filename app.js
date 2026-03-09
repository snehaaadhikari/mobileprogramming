// ==============================================================
// BLOODCARE APP - COMPLETE CODE
// Simple and Beginner-Friendly Version
// ==============================================================

// ==============================================================
// STEP 1: IMPORT FIREBASE TOOLS
// ==============================================================
// These imports bring in Firebase features we need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  push,
  update,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// ==============================================================
// STEP 2: FIREBASE CONFIGURATION
// ==============================================================
// Your Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyBOC9m1U3opbfrjseErUFxSuCXznXvXb-E",
  authDomain: "login-3de47.firebaseapp.com",
  databaseURL: "https://login-3de47-default-rtdb.firebaseio.com",
  projectId: "login-3de47",
  storageBucket: "login-3de47.firebasestorage.app",
  messagingSenderId: "453696567124",
  appId: "1:453696567124:web:3662dae80db9f22954fac1",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // For handling login/signup
const db = getDatabase(app); // For storing data

// ==============================================================
// STEP 3: HELPER FUNCTIONS (Make coding easier!)
// ==============================================================

// Quick way to get elements by ID
function $(id) {
  return document.getElementById(id);
}

// Quick way to get multiple elements
function $$(selector) {
  return document.querySelectorAll(selector);
}

// Store current user info
let currentUser = null;
let currentUserData = null;

// Show loading spinner
function showLoading() {
  const loader = $("loadingOverlay");
  if (loader) loader.classList.remove("hidden");
}

// Hide loading spinner
function hideLoading() {
  const loader = $("loadingOverlay");
  if (loader) loader.classList.add("hidden");
}

// Show notification message
function showToast(message, type = "success") {
  const toast = $("toast");
  const toastMessage = $("toastMessage");

  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.remove("hidden");

    // Auto-hide after 3 seconds
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3000);
  }
}

// Open a modal (popup window)
function openModal(modalId) {
  const modal = $(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }
}

// Close a modal
function closeModal(modalId) {
  const modal = $(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Allow scrolling again
  }
}

// ==============================================================
// STEP 4: DETECT WHICH PAGE WE'RE ON
// ==============================================================
const isIndexPage =
  window.location.pathname.includes("index.html") ||
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("/");

const isDashboardPage = window.location.pathname.includes("dashboard.html");

// ==============================================================
// STEP 5: INDEX PAGE CODE (Login & Register)
// ==============================================================
if (isIndexPage) {
  console.log("✅ You're on the login/register page");

  // ----------------------------------------------------------
  // Tab Switching (Login <-> Register)
  // ----------------------------------------------------------
  const loginTab = $("loginTab");
  const registerTab = $("registerTab");
  const loginForm = $("loginForm");
  const registerForm = $("registerForm");

  if (loginTab && registerTab) {
    // When user clicks "Login" tab
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active");
      registerTab.classList.remove("active");
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
    });

    // When user clicks "Register" tab
    registerTab.addEventListener("click", () => {
      registerTab.classList.add("active");
      loginTab.classList.remove("active");
      registerForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    });
  }

  // ----------------------------------------------------------
  // Password Show/Hide Toggle
  // ----------------------------------------------------------
  $$(".toggle-password").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input");
      if (input.type === "password") {
        input.type = "text";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      } else {
        input.type = "password";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      }
    });
  });

  // ----------------------------------------------------------
  // LOGIN FORM HANDLER
  // ----------------------------------------------------------
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault(); // Stop form from refreshing page

      // Get user input
      const email = $("loginEmail").value.trim();
      const password = $("loginPassword").value;

      // Check if fields are filled
      if (!email || !password) {
        showToast("Please fill in all fields", "error");
        return;
      }

      showLoading();

      try {
        // Try to login with Firebase
        await signInWithEmailAndPassword(auth, email, password);
        showToast("Login successful!");
        // Firebase will automatically redirect to dashboard
      } catch (error) {
        hideLoading();
        console.error("Login error:", error);

        // Show friendly error messages
        let errorMessage = "Login failed. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        } else if (error.code === "auth/invalid-credential") {
          errorMessage = "Invalid email or password.";
        }

        showToast(errorMessage, "error");
      }
    });
  }

  // ----------------------------------------------------------
  // REGISTER FORM HANDLER
  // ----------------------------------------------------------
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get all user input
      const name = $("registerName").value.trim();
      const email = $("registerEmail").value.trim();
      const password = $("registerPassword").value;
      const bloodGroup = $("bloodGroup").value;
      const age = $("age").value;
      const phone = $("phone").value.trim();
      const city = $("city").value.trim();

      // Check if all fields are filled
      if (
        !name ||
        !email ||
        !password ||
        !bloodGroup ||
        !age ||
        !phone ||
        !city
      ) {
        showToast("Please fill in all fields", "error");
        return;
      }

      // Check password length
      if (password.length < 6) {
        showToast("Password must be at least 6 characters", "error");
        return;
      }

      showLoading();

      try {
        // Step 1: Create Firebase authentication account
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("✅ Account created:", user.uid);

        // Step 2: Save user details to database
        try {
          await set(ref(db, `users/${user.uid}`), {
            name: name,
            email: email,
            bloodGroup: bloodGroup,
            age: parseInt(age),
            phone: phone,
            city: city,
            createdAt: Date.now(),
            donationCount: 0,
            lastDonation: null,
          });
          console.log("✅ User data saved to database");
        } catch (dbError) {
          console.error("Failed to save user data:", dbError);
          // If database save fails, delete the auth account
          await user.delete();
          throw new Error("Failed to create profile. Please try again.");
        }

        showToast("Account created successfully!");
        // Firebase will automatically redirect to dashboard
      } catch (error) {
        hideLoading();
        console.error("Registration error:", error);

        // Show friendly error messages
        let errorMessage = "Registration failed. Please try again.";
        if (error.code === "auth/email-already-in-use") {
          errorMessage = "This email is already registered.";
        } else if (error.code === "auth/weak-password") {
          errorMessage = "Password is too weak.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address.";
        }

        showToast(errorMessage, "error");
      }
    });
  }

  // ----------------------------------------------------------
  // Auto-redirect if already logged in
  // ----------------------------------------------------------
  onAuthStateChanged(auth, (user) => {
    hideLoading();
    if (user) {
      console.log("✅ Already logged in, going to dashboard");
      window.location.href = "dashboard.html";
    }
  });
}

// ==============================================================
// STEP 6: DASHBOARD PAGE CODE
// ==============================================================
if (isDashboardPage) {
  console.log("✅ You're on the dashboard page");

  // ----------------------------------------------------------
  // Check if user is logged in
  // ----------------------------------------------------------
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // Not logged in? Go back to login page
      console.log("❌ Not logged in, redirecting...");
      window.location.href = "index.html";
      return;
    }

    currentUser = user;
    console.log("✅ User logged in:", user.uid);

    // Load user data from database
    const loaded = await loadUserData(user);

    hideLoading();

    // Start dashboard features
    initializeDashboard();
  });

  // ----------------------------------------------------------
  // LOAD USER DATA FROM DATABASE
  // ----------------------------------------------------------
  async function loadUserData(user) {
    try {
      const userRef = ref(db, `users/${user.uid}`);
      console.log("📖 Loading user data...");

      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        // User data found!
        currentUserData = snapshot.val();
        console.log("✅ User data loaded:", currentUserData);

        // Update welcome message
        const welcomeText = $("welcomeText");
        if (welcomeText) {
          const firstName = currentUserData.name.split(" ")[0];
          welcomeText.textContent = `Welcome, ${firstName}!`;
        }

        // Pre-fill donate form with user info
        const donateName = $("donateName");
        const donateEmail = $("donateEmail");
        if (donateName) donateName.value = currentUserData.name;
        if (donateEmail) donateEmail.value = currentUserData.email;

        return true;
      } else {
        // No user data found - create basic profile
        console.warn("⚠️ Creating basic profile...");

        const newUserData = {
          name: user.displayName || user.email.split("@")[0],
          email: user.email,
          bloodGroup: "O+",
          age: 25,
          phone: "",
          city: "Not specified",
          createdAt: Date.now(),
          donationCount: 0,
          lastDonation: null,
        };

        await set(userRef, newUserData);
        currentUserData = newUserData;
        console.log("✅ Basic profile created");

        // Update welcome message
        const welcomeText = $("welcomeText");
        if (welcomeText) {
          const firstName = currentUserData.name.split(" ")[0];
          welcomeText.textContent = `Welcome, ${firstName}!`;
        }

        return true;
      }
    } catch (error) {
      console.error("❌ Error loading user data:", error);
      return false;
    }
  }

  // ----------------------------------------------------------
  // INITIALIZE DASHBOARD FEATURES
  // ----------------------------------------------------------
  function initializeDashboard() {
    console.log("🚀 Starting dashboard features...");

    // Quick Action Buttons
    const donateBtn = $("donateBtn");
    const requestBtn = $("requestBtn");

    if (donateBtn) {
      donateBtn.addEventListener("click", () => openModal("donateModal"));
    }

    if (requestBtn) {
      requestBtn.addEventListener("click", () => openModal("requestModal"));
    }

    // "Help Now" buttons in urgent cards
    $$(".help-btn").forEach((btn) => {
      btn.addEventListener("click", () => openModal("donateModal"));
    });

    // Bottom Navigation
    const navSearch = $("navSearch");
    const navProfile = $("navProfile");
    const navMore = $("navMore");

    if (navSearch) {
      navSearch.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("Find Drive feature coming soon!");
      });
    }

    if (navProfile) {
      navProfile.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("Profile page coming soon!");
      });
    }

    if (navMore) {
      navMore.addEventListener("click", (e) => {
        e.preventDefault();
        openModal("moreModal");
      });
    }

    // Initialize form handlers
    setupDonateForm();
    setupRequestForm();
    setupMoreModal();

    console.log("✅ Dashboard ready!");
  }

  // ----------------------------------------------------------
  // DONATE BLOOD FORM
  // ----------------------------------------------------------
  function setupDonateForm() {
    const donateForm = $("donateForm");
    if (!donateForm) return;

    donateForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const center = $("donateCenter").value;
      const date = $("donateDate").value;
      const time = $("donateTime").value;

      // Basic validation
      if (!center || !date || !time) return;

      // Check if date is in the future
      const selectedDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      if (selectedDateTime < now) return;

      // Make sure user data is loaded
      if (!currentUserData) {
        console.error("❌ User data not available");
        return;
      }

      showLoading();

      try {
        // Create new donation record
        const donationsRef = ref(db, "donations");
        const newDonationRef = push(donationsRef);
        const donationId = newDonationRef.key;

        const donationData = {
          donationId: donationId,
          userId: currentUser.uid,
          userName: currentUserData.name,
          userEmail: currentUserData.email,
          bloodGroup: currentUserData.bloodGroup,
          phone: currentUserData.phone,
          city: currentUserData.city,
          age: currentUserData.age,
          center: center,
          date: date,
          time: time,
          appointmentDateTime: selectedDateTime.toISOString(),
          status: "scheduled",
          createdAt: Date.now(),
        };

        // Save to database
        await set(newDonationRef, donationData);
        console.log("✅ Donation saved:", donationId);

        // Update user's donation count
        const userRef = ref(db, `users/${currentUser.uid}`);
        const currentCount = currentUserData.donationCount || 0;
        await update(userRef, {
          donationCount: currentCount + 1,
          lastDonation: Date.now(),
          lastDonationId: donationId,
        });

        currentUserData.donationCount = currentCount + 1;

        hideLoading();
        closeModal("donateModal");
        showToast("✅ Donation appointment scheduled!");
        donateForm.reset();
      } catch (error) {
        hideLoading();
        console.error("❌ Error saving donation:", error);
      }
    });
  }

  // ----------------------------------------------------------
  // REQUEST BLOOD FORM
  // ----------------------------------------------------------
  function setupRequestForm() {
    const requestForm = $("requestForm");
    if (!requestForm) return;

    requestForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form data
      const hospital = $("requestHospital").value.trim();
      const bloodGroup = $("requestBloodGroup").value;
      const reason = $("requestReason").value.trim();
      const contact = $("requestContact").value.trim();

      // Basic validation
      if (!hospital || !bloodGroup || !reason || !contact) return;

      // Validate phone number
      const cleanedContact = contact.replace(/[\s\-\(\)\+]/g, "");
      if (cleanedContact.length < 8 || cleanedContact.length > 15) return;

      // Make sure user data is loaded
      if (!currentUserData) {
        console.error("❌ User data not available");
        await loadUserData(currentUser);
        if (!currentUserData) return;
      }

      showLoading();

      try {
        // Create new blood request
        const requestsRef = ref(db, "bloodRequests");
        const newRequestRef = push(requestsRef);
        const requestId = newRequestRef.key;

        const requestData = {
          requestId: requestId,
          userId: currentUser.uid,
          requesterName: currentUserData.name,
          requesterEmail: currentUserData.email,
          requesterBloodGroup: currentUserData.bloodGroup,
          requesterCity: currentUserData.city,
          hospital: hospital,
          bloodGroup: bloodGroup,
          reason: reason,
          contact: contact,
          status: "urgent",
          fulfilled: false,
          createdAt: Date.now(),
        };

        // Save to database
        await set(newRequestRef, requestData);
        console.log("✅ Blood request saved:", requestId);

        // Also save to user's personal request history
        const userRequestRef = ref(
          db,
          `users/${currentUser.uid}/requests/${requestId}`
        );
        await set(userRequestRef, {
          requestId: requestId,
          bloodGroup: bloodGroup,
          hospital: hospital,
          createdAt: Date.now(),
          status: "urgent",
        });

        hideLoading();
        closeModal("requestModal");
        showToast("✅ Blood request posted!");
        requestForm.reset();
      } catch (error) {
        hideLoading();
        console.error("❌ Error saving request:", error);
      }
    });
  }

  // ----------------------------------------------------------
  // MORE MODAL (Settings, Logout, etc.)
  // ----------------------------------------------------------
  function setupMoreModal() {
    const logoutBtn = $("logoutBtn");
    const editProfileBtn = $("editProfileBtn");
    const donationHistoryBtn = $("donationHistoryBtn");
    const settingsBtn = $("settingsBtn");
    const aboutBtn = $("aboutBtn");

    // Logout button
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        closeModal("moreModal");
        openModal("logoutModal");
      });
    }

    // Other menu buttons (coming soon features)
    if (editProfileBtn) {
      editProfileBtn.addEventListener("click", () => {
        closeModal("moreModal");
        showToast("Edit Profile coming soon!");
      });
    }

    if (donationHistoryBtn) {
      donationHistoryBtn.addEventListener("click", () => {
        closeModal("moreModal");
        showToast("Donation History coming soon!");
      });
    }

    if (settingsBtn) {
      settingsBtn.addEventListener("click", () => {
        closeModal("moreModal");
        showToast("Settings coming soon!");
      });
    }

    if (aboutBtn) {
      aboutBtn.addEventListener("click", () => {
        closeModal("moreModal");
        showToast("About page coming soon!");
      });
    }

    // Confirm Logout button
    const confirmLogoutBtn = $("confirmLogoutBtn");
    if (confirmLogoutBtn) {
      confirmLogoutBtn.addEventListener("click", async () => {
        showLoading();
        try {
          await signOut(auth);
          showToast("Logged out successfully!");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 500);
        } catch (error) {
          hideLoading();
          console.error("Logout error:", error);
        }
      });
    }
  }
}

// ==============================================================
// STEP 7: GLOBAL EVENT LISTENERS
// ==============================================================

// Close modal when clicking outside or on X button
document.addEventListener("click", (e) => {
  // Click on dark overlay
  if (e.target.classList.contains("modal-overlay")) {
    const modal = e.target.closest(".modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Click on close button (X)
  if (
    e.target.classList.contains("close-modal") ||
    e.target.closest(".close-modal")
  ) {
    const modal = e.target.closest(".modal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
});

// ==============================================================
// APP READY!
// ==============================================================
console.log(" BloodCare App Loaded Successfully!");
console.log(" Firebase Connected");
console.log(" Current Page:", window.location.pathname);
