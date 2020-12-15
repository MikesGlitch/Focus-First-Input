chrome.commands.onCommand.addListener((command) => {
  if (command === 'focus-first-input') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "focusOnFirstInput" }, function (response) { });
    });
  }
});