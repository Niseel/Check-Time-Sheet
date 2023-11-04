// Import the proxy configuration from helper/app.constant.js
import { TIME_SHEET_URL } from '../../helper/app.constant.js';

$(document).ready(function () {
  checkTimeSheet();
})


function checkTimeSheet() {
  $('#continueButton').click(function() {
    runRedirect(TIME_SHEET_URL);
  });
}


function runRedirect(URL) {
  chrome.tabs.create({ url: URL });
}
