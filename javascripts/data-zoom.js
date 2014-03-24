var makeZoomable = function($element, $container, $frame) {

  // TODO: consider storing a reference to the node's container in the node

  (Node = function(el, $positionDot, $dimensionsWidget) {
    this.$el = $(el);
    this.$positionDot = $positionDot;
    this.$dimensionsWidget = $dimensionsWidget;
    this.initialize();
  }).prototype = {
    initialize: function() {
      this.$centerLink = this.$dimensionsWidget.find(".center-link");
      this.$el.click(this.showDimensions.bind(this));
      this.$centerLink.click(this.centerNode.bind(this));
      this.showDimensions();
      $(window).on('mousewheel resize scroll', this.showDimensions.bind(this));
    },

    getCenter: function() {
      return getElementCenter(this.$el);
    },

    getWidth: function() {
      return this.$el.width();
    },

    getHeight: function() {
      return this.$el.height();
    },

    // TODO:
    // containerScaleLevel is still global. Instead, an element should recursively figure
    // out its scale by multiplying its own scale level by its parent's.

    getScaledWidth: function() {
      return this.getWidth() * containerScaleLevel();
    },

    getScaledHeight: function() {
      return this.getHeight() * containerScaleLevel();
    },

    getOffset: function() {
      return this.$el.offset();
    },

    getCenter: function() {
      var centerX = (this.getOffset().left + (this.getScaledWidth() / 2));
      var centerY = (this.getOffset().top + (this.getScaledHeight() / 2));

      return {
        x: centerX,
          y: centerY
      };
    },


    // TODO: move this into a dimensionsWidget object
    showDimensions: function() {
      if(undefined != this.$dimensionsWidget) {
        this.$dimensionsWidget.css("left", this.getOffset().left);
        this.$dimensionsWidget.css("top", this.getOffset().top);

        this.$dimensionsWidget.find(".width-value").html(this.getWidth().toFixed(1));
        this.$dimensionsWidget.find(".height-value").html(this.getHeight().toFixed(1));
        this.$dimensionsWidget.find(".scaled-width-value").html(this.getScaledWidth().toFixed(1));
        this.$dimensionsWidget.find(".scaled-height-value").html(this.getScaledHeight().toFixed(1));
        this.$dimensionsWidget.find(".center-x-value").html(this.getCenter().x.toFixed(1));
        this.$dimensionsWidget.find(".center-y-value").html(this.getCenter().y.toFixed(1));
        this.$dimensionsWidget.find(".left-value").html(this.getOffset().left.toFixed(1));
        this.$dimensionsWidget.find(".top-value").html(this.getOffset().top.toFixed(1));

        if(this.$el.is(":visible")) {
          this.$dimensionsWidget.show();
        } else {
          this.$dimensionsWidget.hide();
        }
      }
      if(undefined != this.$positionDot) {
        placeDot(this.$positionDot, this.getCenter(), "red");

        if(this.$el.is(":visible")) {
          this.$positionDot.show();
        } else {
          this.$positionDot.hide();
        }
      }

    },

    centerNode: function() {
      moveNodeContainerToCenterElement(this);
    }
  };


  var zoomScale = 2;
  var $messenger = $({});

  var elementMatrixValues = function($element) {
    var matrix = $element.css('transform');
    if (matrix === "none") return undefined;
    return matrix.match(/-?[0-9\.]+/g);
  }

  // assume that x and y scale are always the same
  var scaleLevel = function($element) {
    var values = elementMatrixValues($element);
    if (values == undefined) return 1;
    return values[0];
  }

  // assume that x and y scale are always the same
  var setElementScaleLevel = function($element, scaleLevel) {
    var values = elementMatrixValues($element);
    if (values == undefined) {
      $element.css('transform', 'scale(' + newScale + ')');
    } else {
      values[0] = scaleLevel; // x scale
      values[3] = scaleLevel; // y scale
      var newMatrixString = "matrix(" + values.join(", ") + ")"
      $element.css("transform", newMatrixString);
    }
  }

  var containerScaleLevel = function() {
    return scaleLevel($container);
  }

  var getElementCenter = function(element) {
    var $element = $(element);
    var offset = $element.offset();
    var width = $element.width();
    var height = $element.height();

    var containerScale = containerScaleLevel();

    var scaledWidth = width / containerScale;
    var scaledHeight = height / containerScale;

    var centerX = (offset.left + (width / 2));
    var centerY = (offset.top + (height / 2));

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

  var placeDot = function($el, coordinates, color) {
      $el.css('left', coordinates.x + "px").css('top', coordinates.y + "px").css('background-color', color);
      $el.attr('data-content', "x: " + coordinates.x.toFixed(1) + ", y: " + coordinates.y.toFixed(1))
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

  // TODO: does not work correctly yet.
  var moveNodeContainerToCenterElement = function(node) {
      var containerCenter = containerNode.getCenter();
      var frameCenter = frameNode.getCenter();
      var elementCenter = node.getCenter();

      console.log(containerCenter, frameCenter, elementCenter);

      var translationDistance = computeDistance(elementCenter, frameCenter);

      // zet zoom transform origin to center of element
      //$container.css('transform-origin', (elementCenter.x) + 'px ' + (elementCenter.y) + 'px');

      // move container so that element is centered in the frame
      $container.animate({
        transform: 'translate(' + translationDistance.x + 'px, ' + translationDistance.y + 'px)'
      }, function() {
        $messenger.trigger('render');
      });
  };


    var createWidgetsForNode = function(idx) {
      $positionDotElement = $("<div>", {id: "position-dot-" + idx, class: "position-dot"});
      $dimensionsWidgetElement = $("<div>", {id: "node-dimensions-" + idx, class: "node-dimensions"});

      $dimensionsWidgetElement.html(' \
                <div>width: <span class="width-value"></span>, scaled width:<span class="scaled-width-value"></span></div> \
                <div>height: <span class="height-value"></span>, scaled height:<span class="scaled-height-value"></span></div> \
                <div>center x: <span class="center-x-value"></span>, center y: <span class="center-y-value"></span></div> \
                <div>left: <span class="left-value"></span>, top: <span class="top-value"></span></div> \
                <a href="#" class="center-link">center</a> \
      ');

      return {
        dot: $positionDotElement,
        dimensions: $dimensionsWidgetElement
      }
    };


    // TODO: move these back into setup function and make their nodes accessible:

    // make widgets and node for frame
    var widgets = createWidgetsForNode(0);
    $("#position-dots").append(widgets.dot);
    $("#dimensions-widgets").append(widgets.dimensions);
    var frameNode = new Node($frame, widgets.dot, widgets.dimensions);

    // make widgets and node for container
    var widgets = createWidgetsForNode(0);
    $("#position-dots").append(widgets.dot);
    $("#dimensions-widgets").append(widgets.dimensions);
    var containerNode = new Node($container, widgets.dot, widgets.dimensions);


  (function setUpAllTheThings() {
    $container.css({
      transform: 'scale(1)'
    });

    // TODO: zoom out incrementally (but prevent scale < 1)
    if(false) {
    $container.click(function() {
      $container.animate({
        transform: 'scale(1)'
      }, function() {
        $messenger.trigger('render');
      });
    });
    }


    $container.on('mousewheel', function(event, d, dx, dy) {
      var newScale = containerScaleLevel() * (1 - dy/120);
      if(newScale < 1) {
        newScale = 1;
      };

      setElementScaleLevel($container, newScale)
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

      // Zoom-plus-translate code; does not work.
      if(false) {
      // zet zoom transform origin to center of element
      $container.css('transform-origin', (elementCenter.x) + 'px ' + (elementCenter.y) + 'px');

      // move container so that element is centered in the frame
      $container.animate({
        transform: '+=scale(' + zoomScale + ')' +
          'translate(' + translationDistance.x/zoomScale + 'px, ' + translationDistance.y/zoomScale + 'px)'
      }, function() {
        $messenger.trigger('render');
      });
      }

      event.stopPropagation();
    };


    $(".node-summary, .node-full").each(function(idx, el) {
      var widgets = createWidgetsForNode(idx+2);

      $("#position-dots").append(widgets.dot);
      $("#dimensions-widgets").append(widgets.dimensions);

      var node = new Node(el, widgets.dot, widgets.dimensions);
    })


    // $element.click(doStuffWhenClicked);
  } ());
};

