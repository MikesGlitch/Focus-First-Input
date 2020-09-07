getStyle = function(element, name)
{
  return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null;
};

focusOnFirstInput = function () {
  if (document.activeElement.tagName != "INPUT") {
    const inputs = document.body.getElementsByTagName("input");
    let focused = false;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const isHiddenByDisplay = getStyle(input, 'display') === 'none';
      const isHiddenByVisibility = getStyle(input, 'visibility') === 'hidden';
      const isHidden = isHiddenByDisplay || isHiddenByVisibility;
      
      if (!isHidden && elementInViewport(input) && (input.type == "text" || input.type == "search")) {
        input.focus();
        focused = true;
        break;
      }
    }

    if (!focused && inputs.length > 0)
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (elementInViewport(input)) {
          input.focus();
          focused = true;
          break;
        }
      }
  }
};

elementInViewport = function (el) {
  var bounding = el.getBoundingClientRect();
  const isInViewport = (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );

  return isInViewport;
};

document.onkeyup = function (e) {
  // Alt+S
  if (e.keyCode === 83 && e.altKey) {
    focusOnFirstInput();
  }
};
