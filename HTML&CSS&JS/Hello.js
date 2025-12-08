const modal = document.getElementById("requestBloodModal");
const btn = document.getElementById("requestBloodBtn");
const span = document.getElementsByClassName("close")[0];
const form = document.getElementById("bloodRequestForm");

// --- Modal Open/Close Logic ---

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// --- Form Submission Logic ---

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  // Get values from the form inputs
  const patientName = document.getElementById("name").value;
  const hospital = document.getElementById("hospital").value;
  const bloodType = document.getElementById("bloodType").value;
  const units = document.getElementById("units").value;
  const reason = document.getElementById("reason").value;

  // Call the global function exposed by firebase.js
  // NOTE: This assumes firebase.js loads successfully as a module
  window.saveBloodRequest(patientName, hospital, bloodType, units, reason);

  // Close the modal and reset the form
  modal.style.display = "none";
  form.reset();
});
