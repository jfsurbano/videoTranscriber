// content.js

// Function to extract source URLs from video/audio elements
function extractSourceUrls() {
    const videoElements = document.querySelectorAll('video');
    const audioElements = document.querySelectorAll('audio');
    const sourceUrls = [];
  
    videoElements.forEach((video) => {
      sourceUrls.push(video.src);
    });
  
    audioElements.forEach((audio) => {
      sourceUrls.push(audio.src);
    });
  
    return sourceUrls;
  }
  
  // Extract source URLs
  const videoAudioUrls = extractSourceUrls();
  
  // Send the URLs to the background script
  chrome.runtime.sendMessage({ urls: videoAudioUrls }, (response) => {
    console.log('URLs sent to background script:', videoAudioUrls);
  });
  