import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
// CORRECT PATH
import {
  getDatabase,
  ref,
  set,
  push,
  update,
  remove,
  onValue,
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

// // CREATE/set using SET

// function registerNewDonor(
//   donorId,
//   firstName,
//   lastName,
//   bloodGroup,
//   phone,
//   lastDonationDate
// ) {
//   set(ref(db, "/donors/" + donorId), {
//     firstName: firstName,
//     lastName: lastName,
//     bloodGroup: bloodGroup,
//     phone: phone,
//     lastDonationDate: lastDonationDate,
//     isEligible: true,
//   });
// }
// // Call:
// registerNewDonor("DNR1001", "Prakash", "Adhikari", "B+", 9851012345, "N/A");

// //Read
// function readPendingRequests() {
//   const requestsRef = ref(db, "requests");
//   get(requestsRef)
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         console.log("--- Current Pending Blood Requests ---");
//         snapshot.forEach((childSnapshot) => {
//           const requestData = childSnapshot.val();
//           if (requestData.status === "Pending") {
//             console.log(
//               `ID: ${childSnapshot.key} - Type: ${requestData.bloodType} - Hospital: ${requestData.hospital}`
//             );
//           }
//         });
//       } else {
//         console.log("No blood requests found.");
//       }
//     })
//     .catch((error) => {
//       console.error("Error reading requests:", error);
//     });
// }

// // Automatically run on page load to populate the "Urgent Needs" section
// readPendingRequests();

//
////update
// function updatedDonorData(donorId, updatedData) {
//   const donorRef = ref(db, "donors/" + donorId);
//   update(donorRef, updatedData)
//     .then(() => {
//       console.log("Request status fulfilled successfully");
//     })
//     .catch((error) => {
//       console.error("Error updating request status:", error);
//     });
// }
// updatedDonorData("DNR1001", { lastName: "Khanal" });

// // Remove:

// function deleteDonor(donorId) {
//   const donorRef = ref(db, "donors/" + donorId);
//   remove(donorRef)
//     .then(() => {
//       console.log("User deleted successfully");
//     })
//     .catch((error) => {
//       console.error("Error deleting user:", error);
//     });
// }

// deleteDonor("DNR1001");

//UI
// --- 1. CREATE Function: Saves a new blood request (Exposed to the window) ---
window.saveBloodRequest = function (
  patientName,
  hospital,
  bloodType,
  units,
  reason
) {
  const requestsRef = ref(db, "bloodRequests");
  const newRequestRef = push(requestsRef);

  set(newRequestRef, {
    patientName: patientName,
    hospital: hospital,
    bloodType: bloodType,
    units: units,
    reason: reason,
    timestamp: new Date().toISOString(),
    status: "Pending",
  })
    .then(() => {
      console.log(
        "✓ New blood request successfully added with ID:",
        newRequestRef.key
      );
      alert("Blood Request Submitted Successfully!");
    })
    .catch((error) => {
      console.error("✗ Error submitting blood request:", error);
      alert("Error submitting request: " + error.message);
    });
};

// --- 2. READ Function: Real-time listener for all requests ---
const bloodRequestsRef = ref(db, "bloodRequests");
const requestsList = document.getElementById("requestsList");

onValue(bloodRequestsRef, (snapshot) => {
  if (!requestsList) return;
  requestsList.innerHTML = ""; // Clear the list

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
          <button class="urgent-btn" onclick="updateStatus('${requestKey}')" ${
        data.status === "Fulfilled" ? "disabled" : ""
      }>4
            ${data.status === "Fulfilled" ? "Fulfilled" : "Mark as Fulfilled"}
          </button>
          <button class="urgent-btn delete-btn" onclick="deleteRequest('${requestKey}')">Delete</button>
        </div>
      `;
      requestsList.appendChild(listItem);
    });
  } else {
    requestsList.innerHTML =
      '<li class="no-requests">No active blood requests found.</li>';
  }
});
window.bloodRequestsRef= bloodRequestsRef;

// --- 3. UPDATE Function: Change request status (Exposed to the window) ---
window.updateStatus = function (id) {
  if (confirm("Confirm that this blood request has been fulfilled?")) {
    const requestRef = ref(db, "bloodRequests/" + id);
    update(requestRef, {
      status: "Fulfilled",
      fulfilledAt: new Date().toISOString(),
    })
      .then(() => {
        console.log(`Request ${id} status updated to Fulfilled.`);
      })
      .catch((error) => {
        console.error("Error updating request status:", error);
      });
  }
};
window.updateStatus = updateStatus;

// --- 4. DELETE Function: Remove a request (Exposed to the window) ---
window.deleteRequest = function (id) {
  if (confirm("Are you sure you want to delete this blood request?")) {
    remove(ref(db, "bloodRequests/" + id))
      .then(() => {
        console.log(`Request ${id} deleted successfully.`);
      })
      .catch((error) => {
        console.error("Error deleting request:", error);
      });
  }
};
window.deleteRequest= deleteRequest;