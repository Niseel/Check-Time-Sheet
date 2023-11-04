// Import the proxy configuration from helper/app.constant.js
import { PROXY_IP, PROXY_PORT, TIME_SHEET_URL } from '../../helper/app.constant.js';

$(document).ready(function () {
  // Add an event listener to run code when the popup is opened.
    // Get the current active tab's URL.
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const currentUrl = tabs[0].url;
        // Define your desired URL and the button elements.
        const desiredUrl = TIME_SHEET_URL; 
        if (currentUrl === desiredUrl) {
            $('#filterButton').show();
            $('#filterButton').click(function() {
              checkTimeSheet(TIME_SHEET_URL);
            });
        } else {
            getIpAndPort();
            $('#filterButton').hide();
        }
    });
})

function getIpAndPort() {
  // Check if the current proxy configuration matches the constants
  // const isProxyConfigCorrect = checkProxyConfiguration(PROXY_IP, PROXY_PORT);
  $.ajax({
    url: "https://api.ipify.org?format=json",
    dataType: "json",
    success: async function (data) {
      console.log(data);
      const ipAddress = data.ip;
      // Check if the current proxy configuration matches the constants
      checkWebsiteConnection(TIME_SHEET_URL)
        .then((result) => {
          console.log(result); // Website is accessible.
          const isProxyConfigCorrect = result

          if (isProxyConfigCorrect) {
            $('#notification').hide();
            disableCheckButton('show');
          }
        })
        .catch((error) => {
          console.error(error); // Handle the error.

          $('#notification').show();
          disableCheckButton('disabled')
        });

      // Display the IP address in your extension's popup or interface
      $('#ipAddress').text(`Proxy IP: ${ipAddress}`);
    },
    error: function (xhr, status, errorThrown) {
      console.error('Error fetching IP address:', xhr.status, status,  errorThrown);
    }
  });
}

function disableCheckButton(keyCheck) {
  switch (keyCheck) {
    case 'show':
      $("#continueButton").removeClass('disabled');
      $("#continueButton").prop("disabled", false);
      $("#continueButton").text('Access...');
      break;
      case 'disabled':
        $("#continueButton").addClass('disabled');
        $("#continueButton").prop("disabled", true);
        $("#continueButton").text('Checking...');
      break;
    default:
      break;
  }
}

function checkWebsiteConnection(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Successful connection (status code 2xx)
        resolve(true);
      } else {
        // Failed connection (status code outside 2xx)
        reject(false);
      }
    };

    xhr.onerror = function () {
      // Connection error
      reject("Error connecting to the website.");
    };

    xhr.send();
  });
}


function checkTimeSheet() {
  chrome.runtime.sendMessage({ message: 'checkTimeSheetClicked' });

  // Send a message to the content script to collect data
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'collectData' }, function(response) {
          // Handle the collected data from the content script
          if (response) {
              console.log('Collected Data:', response);
              // Do something with the data, like displaying it in the popup
              showData();
          }
      });
  });
}


function showData() {
  $('#dynamicTable').show();

  const tableData = [
    { id: 1, name: 'Mark', surname: 'Otto', email: '@mdo' },
    { id: 1, name: 'Mark1', surname: 'Otto1', email: '@mdo1' },
    { id: 1, name: 'Mark2', surname: 'Otto2', email: '@mdo2' },
    // Add more data entries as needed
  ];

  // Reference to the table body element
  const tableBody = $('#dynamicTable').append('<tbody></tbody>');

  // Loop through the data and create table rows
  $.each(tableData, function (index, dataItem) {
      const row = $('<tr>');
      row.append($('<td>').text(dataItem.id));
      row.append($('<td>').text(dataItem.name));
      row.append($('<td>').text(dataItem.surname));
      row.append($('<td>').text(dataItem.email));
      tableBody.append(row);
  });
}