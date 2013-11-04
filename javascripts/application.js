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
    }, function() {
      render()
    });
  });

  $(".node-container").click(function(event) {
    var zoomScale = 2;
    var mousePosition = {
            x: event.clientX,
            y: event.clientY
        }

    var containerCenter = getElementCenter($container);
    var elementCenter = getElementCenter(event.currentTarget);
    var translationDistance = computeDistance(elementCenter, containerCenter);

    // zet zoom transform origin to center of element
    $container.css('transform-origin', (elementCenter.x) + 'px ' + (elementCenter.y) + 'px');

    // move center of element to center of container
    $container.animate({
      transform: '+=scale(' + zoomScale + ')' +
      'translate(' + translationDistance.x/zoomScale + 'px, ' + translationDistance.y/zoomScale + 'px)'
    }, function() { 
      render() 
    });

    event.stopPropagation();
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

  var computeDistance = function(point1, point2) {
    return { 
      x: point2.x - point1.x,
      y: point2.y - point1.y
    }  
  }
});
