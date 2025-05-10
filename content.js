if (!window.sharedAudioContext) {
    window.sharedAudioContext = new AudioContext();
  }
  
  chrome.runtime.onMessage.addListener((request) => {
    const mediaElements = document.querySelectorAll("video, audio");
  
    mediaElements.forEach((media) => {
      if (!media._booster) {
        try {
          const source = window.sharedAudioContext.createMediaElementSource(media);
          const gainNode = window.sharedAudioContext.createGain();
  
          source.connect(gainNode);
          gainNode.connect(window.sharedAudioContext.destination);
  
          media._booster = {
            source,
            gainNode
          };
        } catch (e) {
          console.warn("AudioContext error:", e);
        }
      }
  
      if (request.command === "setVolume" && media._booster) {
        const volume = Math.min(request.volume / 100, 5.0);
        media.muted = false;
        media._booster.gainNode.gain.value = volume;
      }
  
      if (request.command === "toggleMute") {
        media.muted = !media.muted;
      }
    });
  });
  