// Define a function to collect data from the web page
function collectDataFromWebsite() {
  // Add your code here to collect data from the website
  // For example, you can use DOM manipulation to extract information from the page.
  const data = {
      name: 'CongThanh'
  };
  return data;
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'collectData') {
    const collectedData = collectDataFromWebsite();
    console.log(collectedData);
      sendResponse(collectedData);
  }
});