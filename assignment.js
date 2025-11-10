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
function Calculate1(){
    let num1 = 50;
    let num2 = 10;
    return sum = num1 - num2;   
}

function display1()
{
    document.getElementById("text7").innerHTML = Calculate1();
}

function Calculate2(){
    let num1 = 5;
    let num2 = 3;
    return sum = num1 * num2;   
}

function display2()
{
    document.getElementById("text8").innerHTML = Calculate2();
}

function Calculate3(){
    let num1 = 15;
    let num2 = 5;
    return sum = num1 / num2;   
}

function display3()
{
    document.getElementById("text9").innerHTML = Calculate3();
}
function ControlFunc(){
    let num1 = 2;
    let num2 = 5;
    if (num1 > num2) {
        return epp = num1 / num2;
    } else {
        return epp = num2 * num1;
    }
}

function display4()
{
    document.getElementById("text10").innerHTML = ControlFunc();
}
