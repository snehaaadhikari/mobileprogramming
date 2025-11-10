function toggleContainer1() {
  const text = document.getElementById("toggleText1");
  const button = event.target;
}

function add() {
  let travel1 = 5000;
  let travel2 = 6000;
  const sum = travel1 + travel2;
  return sum;
}

function displaySum() {
  const displaySum = add();
  document.getElementById("text5").innerText = displaySum;
}
