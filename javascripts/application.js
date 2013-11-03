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

  var $container=$('.container');

  $container.css({
    transform: 'scale(1)'
  });

  // TODO: zoom out incrementally (but prevent scale < 1)
  $container.click(function() {
    $container.animate({
      transform: 'scale(1)'
    });
    setTimeout(function() {
      render();
    }, 500);
  });

  $(".node-container").click(function(event) {
    var zoomScale = 2;
    var mousePosition = {
            x: event.clientX,
            y: event.clientY
        }

    var containerCenter = getElementCenter($container);
    var elementCenter = getElementCenter(event.currentTarget);

    /*$container.css('transform-origin', mousePosition.x + ' ' + mousePosition.y);*/
    /*$container.css('transform-origin', (elementCenter.x / zoomScale) + ' ' + (elementCenter.y / zoomScale));*/
    $container.css('transform-origin', '50% 50%');

    $container.animate({
      transform: '+=scale(' + zoomScale + ')'
    });
      
    event.stopPropagation();
    setTimeout(function() {
      render();
    }, 500);
  });

  var getElementCenter = function(element) {
    var $element = $(element);
    var offset = $element.offset();
    var width = $element.width();
    var height = $element.height();

    var centerX = offset.left + width / 2;
    var centerY = offset.top + height / 2;

    return {
      x: centerX,
        y: centerY
    };
  };  
});
