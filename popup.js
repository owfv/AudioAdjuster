function sendMessageToTab(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.executeScript(tabs[0].id, { file: "content.js" }, () => {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    });
  }
  
  function updateDisplay(value) {
    document.getElementById("volumeValue").textContent = `${value}%`;
  }
  
  window.onload = () => {
    const slider = document.getElementById("volumeSlider");
    const savedVolume = localStorage.getItem("savedVolume");
  
    if (savedVolume !== null) {
      slider.value = savedVolume;
      updateDisplay(savedVolume);
      slider.dispatchEvent(new Event("input"));
    } else {
      updateDisplay(slider.value);
    }
  
    slider.addEventListener("input", (e) => {
      const vol = parseInt(e.target.value);
      localStorage.setItem("savedVolume", vol);
      updateDisplay(vol);
      sendMessageToTab({ command: "setVolume", volume: vol });
    });
  };
  
  document.getElementById("muteButton").addEventListener("click", () => {
    sendMessageToTab({ command: "toggleMute" });
  });
  