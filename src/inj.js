const getStyle = function(element, name)
{
  return element.currentStyle ? element.currentStyle[name] : window.getComputedStyle ? window.getComputedStyle(element, null).getPropertyValue(name) : null
}

const focusOnFirstInput = function () {
  const validTagNames = ['INPUT', 'TEXTAREA']
  let isFocusedOnValidInput = !!validTagNames.find((tagName) => tagName === document.activeElement.tagName)
  
  if (!isFocusedOnValidInput) {
    const textInputs = document.body.querySelectorAll("input,textarea")
    let focused = false

    for (let i = 0; i < textInputs.length; i++) {
      const textInput = textInputs[i]
      const isHiddenByDisplay = getStyle(textInput, 'display') === 'none'
      const isHiddenByVisibility = getStyle(textInput, 'visibility') === 'hidden'
      const isHidden = isHiddenByDisplay || isHiddenByVisibility
      const isDisabledOrReadonly = textInput.disabled || textInput.readOnly
      
      let isValidFocusableField = false
      switch (textInput.tagName) {
        case 'INPUT': {
          const validInputTypes = ['text', 'search', 'email', 'number', 'password', 'tel', 'url']
          isValidFocusableField = !!validInputTypes.find(validInputType => validInputType === textInput.type)
          break
        }
        case 'TEXTAREA': 
          isValidFocusableField = true
          break
      }
      
      if (!isHidden && !isDisabledOrReadonly && elementInViewport(textInput) && isValidFocusableField) {
        textInput.focus()
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

const elementInViewport = function (el) {
  var bounding = el.getBoundingClientRect()
  const isInViewport = (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  )

  return isInViewport
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