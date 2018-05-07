focusOnFirstInput = function () {
  if (document.activeElement.tagName != "INPUT") {
    var inputs = document.body.getElementsByTagName("input")
    focused = false
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i]
      if (elementInViewport(input) && input.type == "text") {
        input.focus()
        focused = true
        break
      }
    }

    if (!focused && inputs.length > 0)
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i]
        if (elementInViewport(input)) {
          input.focus()
          focused = true
          break
        }
      }
  }
}

elementInViewport = function (el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top >= window.pageYOffset &&
    left >= window.pageXOffset &&
    (top + height) <= (window.pageYOffset + window.innerHeight) &&
    (left + width) <= (window.pageXOffset + window.innerWidth)
  );
};

document.onkeyup = function(e){
  // Alt+S
  if (e.keyCode === 83 && e.altKey) {
    focusOnFirstInput();
  }
}
