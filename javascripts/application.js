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
});
