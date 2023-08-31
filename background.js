// background.js

// Function to transcribe audio using Web Speech API
async function transcribeAudio(audioUrl) {
  const audio = new Audio(audioUrl);

  const recognition = new webkitSpeechRecognition();
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    const transcription = event.results[0][0].transcript;
    console.log('Transcription:', transcription);

    // Save the transcription after it's obtained
    saveTranscription(transcription);
  };

  recognition.onerror = (error) => {
    console.error('Error transcribing audio:', error);
  };

  recognition.start();
}

// Function to transcribe a list of URLs
async function transcribeUrls(urls) {
  for (const url of urls) {
    await transcribeAudio(url);
  }
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === 'startTranscription') {
        // Execute content script in the active tab
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          function: initiateTranscription,
        });
      }
  
    // Check if the message contains URLs
  if (request.urls && Array.isArray(request.urls)) {
    await transcribeUrls(request.urls);
  }

  if (request.type === 'transcription') {
    // Handle the received transcription data
    const transcription = request.data;
    // Save the transcription using saveData or any other method
    saveTranscription(transcription);
  }
});

function saveTranscription(transcription) {
  // Get existing transcriptions from storage
  chrome.storage.local.get('transcriptions', function(result) {
    const existingTranscriptions = result.transcriptions || [];

    // Add the new transcription
    existingTranscriptions.push(transcription);

    // Save updated transcriptions back to storage
    chrome.storage.local.set({ transcriptions: existingTranscriptions }, function() {
      console.log('Transcription saved:', transcription);
    });
  });
}

function saveData(key, data) {
  // Get existing data from storage
  chrome.storage.local.get(key, function(result) {
    const existingData = result[key] || [];

    // Add the new data
    existingData.push(data);

    // Save updated data back to storage
    const newData = {};
    newData[key] = existingData;
    chrome.storage.local.set(newData, function() {
      console.log('Data saved:', data);
    });
  });
}
