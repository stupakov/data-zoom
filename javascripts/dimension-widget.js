// device dimensions in device pixels
var deviceDimensions = function() {
  return { 
    x: screen.width,
    y: screen.height
  }
};

//layout viewport dimensions in CSS pixels
var layoutDimensions = function() {
  return { 
    x: document.documentElement.clientWidth,
    y: document.documentElement.clientHeight
  }
};

// visual viewport dimensions in CSS pixels
var viewportDimensions = function() {
  return { 
    x: window.innerWidth,
    y: window.innerHeight 
  }
};

var scrollingOffset = function() {
  return {
    x: window.pageXOffset,
    y: window.pageYOffset
  }
};

var zoomLevel = function() {
  return {
    x: layoutDimensions().x / viewportDimensions().x,
    y: layoutDimensions().y / viewportDimensions().y
  }
};

var displayValues = function($el, data) {
  $el.find(".x-value").html(data.x);
  $el.find(".y-value").html(data.y);
}

var updateValues = function() {
  displayValues($(".device-dimensions"), deviceDimensions());
  displayValues($(".layout-dimensions"), layoutDimensions());
  displayValues($(".viewport-dimensions"), viewportDimensions());
  displayValues($(".scrolling-offset"), scrollingOffset());
  displayValues($(".zoom-level"), zoomLevel());
};
