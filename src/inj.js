function getStyle(element, name)
{
  return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null
}

function isValidFocusableInput(textInput) {
  let validFocusableField = false

  switch (textInput.tagName) {
    case 'INPUT': {
      const validInputTypes = ['text', 'search', 'email', 'number', 'password', 'tel', 'url']
      validFocusableField = !!validInputTypes.find(validInputType => validInputType === textInput.type)
      break
    }
    case 'TEXTAREA': 
      validFocusableField = true
      break
  }

  return validFocusableField
}

function focusOnFirstInput () {
  const focusedOnValidInput = isValidFocusableInput(document.activeElement)
  
  if (!focusedOnValidInput) {
    const textInputs = document.body.querySelectorAll("input,textarea")
    let focused = false

    for (let i = 0; i < textInputs.length; i++) {
      const textInput = textInputs[i]
      const hiddenByDisplay = getStyle(textInput, 'display') === 'none'
      const hiddenByVisibility = getStyle(textInput, 'visibility') === 'hidden'
      const hidden = hiddenByDisplay || hiddenByVisibility
      const disabledOrReadonly = textInput.disabled || textInput.readOnly
      const validFocusableField = isValidFocusableInput(textInput)
      
      if (!hidden && !disabledOrReadonly && elementInViewport(textInput) && validFocusableField) {
        textInput.focus()
        textInput.setSelectionRange(textInput.value.length, textInput.value.length);
        focused = true
        break
      }
    }

    if (!focused && textInputs.length > 0)
      for (let i = 0; i < textInputs.length; i++) {
        const textInput = textInputs[i]
        if (elementInViewport(textInput)) {
          textInput.focus()
          focused = true
          break
        }
      }
  }
}

function elementInViewport(el) {
  var bounding = el.getBoundingClientRect()
  const inViewport = (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  )

  return inViewport
}

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "focusOnFirstInput") {
      focusOnFirstInput()      
      sendResponse({complete: true})
    }
  }
)