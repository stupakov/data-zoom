var render = function() {
  if(zoomLevel().x > 2) {
    $(".node-full").show();
    $(".node-summary").hide();
  } else {
    $(".node-full").hide();
    $(".node-summary").show();
  }
}
