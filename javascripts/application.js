$(function() {
  updateValues();
  render();

  $(window).resize(function () {
    updateValues();
    render();
  });

  $(window).scroll(function () {
    updateValues();
    render();
  });

  var zoomSettings = {
    closeclick: false,
    targetsize: 0.6,
    animationendcallback: render
  };

  $(".node-container").click(function(el) {
    $(".node-container").zoomTo(zoomSettings);
  });
});
