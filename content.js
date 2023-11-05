const INVALID_STATUS = [
  'In Progress',
  'Missing'
]

// Define a function to collect data from the web page
function collectDataFromWebsite(requestData) {
  // COOK DATA HERE --> BEFORE SEND IT TO POPUP AND SHOW WHO NEED TO UPDATE TIME SHEET
  let { date, department, resource, payroll, manager, time, employees } = requestData;

  const table = document.getElementById('TimesheetReport_GV');
  const data = [];

  // Iterate over the rows and highlight matching ones
  if (table) {
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const cells = row.getElementsByTagName('td'); // Adjust this selector based on your table structure

      // Check if the name column contains a matching name
      const nameCell = cells[0]; 
      const nameValue = nameCell.textContent.trim();

      const timeCell = cells[4]; 
      const timeValue = timeCell.textContent.trim();

      const statusCell = cells[5]; 
      const statusValue = statusCell.textContent.trim();

      if (employees.includes(nameValue)) {
        // Status: In Progress || Missing    
        // AND    
        //Time log not equal input is Danger 
        if (INVALID_STATUS.includes(statusValue) || +timeValue !== +time) {
          row.classList.add('highlighted-row--warning');

          const action = identifyAction(INVALID_STATUS.includes(statusValue), +timeValue !== +time, +time, date)

          const item = {
            name: nameValue,
            timeSubmitted: timeValue,
            timeStatus: statusValue,
            action: action
          }
          data.push(item);
        } else {
          row.classList.add('highlighted-row--done');
        }
      }
    }
  }
  // console.log(data);
  return data;
}

function identifyAction(isInvalidStatus, isWrongTimeCapacity, correctTimeCapacity, correctDate) {
  if (!isInvalidStatus) {
    return `Resubmit ${correctTimeCapacity} hour`;
  } else if (isInvalidStatus && isWrongTimeCapacity) {
    return `Immediately Submit`;
  }
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const requestData = request.data
  if (request.message === 'jsonUpload') {
    const collectedData = collectDataFromWebsite(requestData);
    sendResponse(collectedData);
  }
});