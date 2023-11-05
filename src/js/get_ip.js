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
          $('#filterGroup').show();
          $('#filterButton').click(function() {
            checkTimeSheet(TIME_SHEET_URL);
          });
          getIpAndPort();
          $('#continueButton').hide();
      } else {
          getIpAndPort();
          $('#filterGroup').hide();
      }
  });


  const jsonFileInput = document.getElementById('jsonFileInput');
  // Listen for changes in the file input
  jsonFileInput.addEventListener('change', function() {
    // Check if a file is selected
    if (jsonFileInput.files.length > 0) {
      $("#filterButton").prop("disabled", false);
    } else {
      $("#filterButton").prop("disabled", true);
    }
  });
  
  $(".custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
  });

  $("#copy-btn").click(function (ev) {
    $(".msg-success").css("display", "block");
    $(".msg-success").delay(2000).fadeOut("slow");
  });

  new ClipboardJS("#copy-btn");
})

function getIpAndPort() {
  // Check if the current proxy configuration matches the constants
  // const isProxyConfigCorrect = checkProxyConfiguration(PROXY_IP, PROXY_PORT);
  $.ajax({
    url: "https://api.ipify.org?format=json",
    dataType: "json",
    success: async function (data) {
      const ipAddress = data.ip;
      console.log('IP: ', ipAddress);
      // Check if the current proxy configuration matches the constants
      checkWebsiteConnection(TIME_SHEET_URL)
        .then((result) => {
          console.log(result, 'Website is accessible.'); 
          const isProxyConfigCorrect = result

          if (isProxyConfigCorrect) {
            $('#notification').hide();
            disableCheckButton('show');
          }
        })
        .catch((error) => {
          console.error(error, 'Website is unaccessible.'); 

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
  // chrome.runtime.sendMessage({ message: 'checkTimeSheetClicked' });
  showData();
}

function showTable(tableData) {
  $('#dynamicTable').show();

  // Reference to the table body element
  const tableBody = $('#dynamicTable').append('<tbody></tbody>');

  // Loop through the data and create table rows
  $.each(tableData, function (index, dataItem) {
      const row = $('<tr>');
      row.append($('<td>').text(++index));
      row.append($('<td>').text(dataItem.name));
      row.append($('<td>').text(dataItem.timeSubmitted));
      row.append($('<td>').text(dataItem.timeStatus));
      row.append($('<td class="text-danger">').text(dataItem.action));
      tableBody.append(row);
  });

}

function showMessage(tableData) {
  tableData.forEach(member => {
    $("#textMessage").append(`${member.name}: ${member.action}\n`); 
  });
}


function showData() {
  // Check if a file is selected
  const jsonFileInput = document.getElementById('jsonFileInput');
  if (jsonFileInput.files.length > 0) {
    const file = jsonFileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const fileContent = event.target.result;
      const jsonContent = textToJson(fileContent);

      // Send the JSON data to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { message: 'jsonUpload', data: jsonContent }, function(response) {
          // Handle the response from content.js if needed
          showTable(response);
          showMessage(response);
        });
      });
    };
    reader.readAsText(file);
  }
}

function textToJson(fileContent) {
  // Initialize the JSON structure
  const jsonData = {
    date: '',
    department: '',
    resource: '',
    payroll: '',
    manager: '',
    time: 0,
    employees: []
  };

  const lines = fileContent.split('\n');

  const firstLine = (lines[0].trim()).split(' ');
  jsonData.date = firstLine[0];
  jsonData.department = firstLine[1];
  jsonData.resource = firstLine[2];
  jsonData.payroll = firstLine[3];
  jsonData.manager = firstLine[4];
  jsonData.time = firstLine[5];

  // Parse the rest of the lines and add them to the JSON array
  for (let i = 1; i < lines.length; i++) {
    const employee = lines[i].trim();
    if (employee.length > 0) {
      jsonData.employees.push(employee);
    }
  }
  
  // Convert the JSON data to a JSON string
  const jsonStr = JSON.stringify(jsonData, null, 2);
  // Print the JSON string
  return JSON.parse(jsonStr);
}
