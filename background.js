chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'checkTimeSheetClicked') {
      // alert('Hello world')
  }
});