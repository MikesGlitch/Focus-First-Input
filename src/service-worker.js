chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "focus-first-input":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "focusOnFirstInput" },
          function (response) {}
        );
      });
      break;
    case "focus-first-input-on-page":
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "focusOnFirstInputOnPage" },
          function (response) {}
        );
      });
      break;
  }
});
