function getStyle(element, name) {
  return element.currentStyle
    ? element.currentStyle[name]
    : window.getComputedStyle
    ? window.getComputedStyle(element, null).getPropertyValue(name)
    : null;
}

function isValidFocusableInput(textInput) {
  switch (textInput.tagName) {
    case "INPUT": {
      const validInputTypes = [
        "text",
        "search",
        "email",
        "number",
        "password",
        "tel",
        "url",
      ];
      return !!validInputTypes.find(
        (validInputType) => validInputType === textInput.type
      );
    }
    case "TEXTAREA":
      return true;
  }

  return false;
}

function isElementInScope(el, scopeToViewport) {
  // When scoping to viewport check if the element is in the viewport otherwise always consider it in scope
  return scopeToViewport ? elementInViewport(el) : true;
}

function focusOnFirstInput(settings = { scopeToViewport: true }) {
  const textInputs = document.body.querySelectorAll("input,textarea");
  let focused = false;

  for (let i = 0; i < textInputs.length; i++) {
    const textInput = textInputs[i];
    const hiddenByDisplay = getStyle(textInput, "display") === "none";
    const hiddenByVisibility = getStyle(textInput, "visibility") === "hidden";
    const hidden = hiddenByDisplay || hiddenByVisibility;
    const disabledOrReadonly = textInput.disabled || textInput.readOnly;
    const validFocusableField = isValidFocusableInput(textInput);
    const elementInScope = isElementInScope(textInput, settings.scopeToViewport);

    if (
      !hidden &&
      !disabledOrReadonly &&
      elementInScope &&
      validFocusableField
    ) {
      textInput.focus();
      textInput.setSelectionRange(
        textInput.value.length,
        textInput.value.length
      );
      focused = true;
      break;
    }
  }

  if (!focused && textInputs.length > 0) {
    // We've tried to focus on an input, but none were valid (according to our rules). Focus on the first invalid one as a fallback.
    for (let i = 0; i < textInputs.length; i++) {
      const textInput = textInputs[i];
      const elementInScope = isElementInScope(textInput, settings.scopeToViewport);
      if (elementInScope) {
        textInput.focus();
        focused = true;
        break;
      }
    }
  }
}

function elementInViewport(el) {
  const bounding = el.getBoundingClientRect();
  const inViewport =
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth);

  return inViewport;
}

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "focusOnFirstInput":
      focusOnFirstInput({ scopeToViewport: true });
      sendResponse({ complete: true });
      break;
    case "focusOnFirstInputOnPage":
      focusOnFirstInput({ scopeToViewport: false });
      sendResponse({ complete: true });
      break;
  }
});
