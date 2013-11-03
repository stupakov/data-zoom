var render = function() {
  if(scaleLevel() >= 2) {
    $(".node-container").addClass("full").removeClass("summary");
  } else {
    $(".node-container").addClass("summary").removeClass("full");
  }
}

function scaleLevel() {
  var matrix = $(".container").css("-webkit-transform");
  if (matrix === "none") return 1;
  var values = matrix.split('(')[1].split(')')[0].split(',');
  return values[0];
}
