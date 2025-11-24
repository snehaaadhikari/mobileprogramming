$(document).ready(function () {
  $("button").click(function () {
    var div = $("div");
    div.animate({ left: "100px" }, "slow");
    div.animate({ fontSize: "3em" }, "slow");
    div.animate({ height: "300px", opacity: "0.4" }, "slow");
    div.animate({ width: "300px", opacity: "0.8" }, "slow");
    div.css("background-color", "pink");
    div.animate({ height: "100px", opacity: "0.4" }, "slow");
    div.animate({ width: "100px", opacity: "0.8" }, "slow");
    div.animate({ left: "0px", opacity: "1" }, "slow");
  });
});
