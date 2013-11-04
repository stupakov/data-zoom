var makeZoomable = function($element, $container) {
  var $messenger = $({});
  var zoomScale = 2;

  var scaleLevel = function($element) {
    var matrix = $element.css("-webkit-transform");
    if (matrix === "none") return 1;
    var values = matrix.split('(')[1].split(')')[0].split(',');
    return values[0];
  }

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
  };

  (function () {
    $container.css({
      transform: 'scale(1)'
    });

    // TODO: zoom out incrementally (but prevent scale < 1)
    $container.click(function() {
      $container.animate({
        transform: 'scale(1)'
      }, function() {
        $messenger.trigger('render');
      });
    });

    $messenger.on('render', function() {
      if(scaleLevel($container) >= zoomScale) {
        $element.addClass("full").removeClass("summary");
      } else {
        $element.addClass("summary").removeClass("full");
      }
    });

    $messenger.trigger('render');

    $element.click(function(event) {
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
                       $messenger.trigger('render');
                     });

        event.stopPropagation();
        });
  } ());
};

