// popup.js

document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startTranscription');
    const statusDiv = document.getElementById('status');
  
    startButton.addEventListener('click', function() {
      // Communicate with the content script to start transcription
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
          chrome.scripting.executeScript({
            target: { tabId: activeTab.id },
            function: startTranscription,
          });
          // Display transcription status
          statusDiv.textContent = 'Transcription started...';
        } else {
          console.error('No active tab found.');
        }
      });
    });
  });
  
  // Content script function to be executed
  function startTranscription() {
    // Send a message to the background script to start transcription
    chrome.runtime.sendMessage({ action: 'startTranscription' }, function(response) {
      if (response.success) {
        console.log('Transcription started');
      } else {
        console.error('Error starting transcription');
      }
    });
  }
  
  // ... Other code for displaying stored transcriptions
  