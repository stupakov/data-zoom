var makeZoomable = function($element, $container, $frame) {
  var zoomScale = 2;
  var $messenger = $({});

  var elementMatrixValues = function($element) {
    var matrix = $element.css('transform');
    if (matrix === "none") return undefined;
    return matrix.match(/-?[0-9\.]+/g);
  }

  var scaleLevel = function($element) {
    var values = elementMatrixValues($element);
    if (values == undefined) return 1;
    return values[0];
  }

  var containerScaleLevel = function() {
    return scaleLevel($container);
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

  var placeDot = function(coordinates, color) {
      $('.position-dot').css('left', coordinates.x + "px").css('top', coordinates.y + "px").css('background-color', color);
  };

  // grabs the current translation value from the css
  // TODO: expand browser compatibility
  var getTranslationValue = function($element) {
    var values = elementMatrixValues($element);
    if(values == undefined) return { x: 0, y: 0 };
    return {
      x: parseFloat(values[4]),
      y: parseFloat(values[5])
    };
  };

  // computes new translation by finding the current
  // translation value of the element and adding
  // the desired movement vector
  var computeNewTranslation = function($element, translationDistance) {
    var currentTranslation = getTranslationValue($element);
    console.log("CURRENT TRANSLATION: ", currentTranslation);
    return {
      x: currentTranslation.x + translationDistance.x,
      y: currentTranslation.y + translationDistance.y
    };
  };

  (function setUpAllTheThings() {
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

    $container.on('mousewheel', function(event, d, dx, dy) {
      var newScale = containerScaleLevel() * (1 - dy/120);
      if(newScale < 1) {
        newScale = 1;
      };
      $container.css('transform', 'scale(' + newScale + ')');
      event.preventDefault();
      $messenger.trigger('render');
    });

    $messenger.on('render', function() {
      if(containerScaleLevel() >= zoomScale) {
        $element.addClass("full").removeClass("summary");
      } else {
        $element.addClass("summary").removeClass("full");
      }
    });

    $messenger.trigger('render');

    var doStuffWhenClicked = function(event) {
      var mousePosition = {
        x: event.clientX,
        y: event.clientY
      }

      var containerCenter = getElementCenter($container);
      var frameCenter = getElementCenter($frame);
      var elementCenter = getElementCenter(event.currentTarget);
      var translationDistance = computeDistance(elementCenter, frameCenter);

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
    };

    $element.click(doStuffWhenClicked);
  } ());
};

