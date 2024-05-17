document.addEventListener('DOMContentLoaded', () => {
  // Fetch sensor and then display sensor status
  fetch('/sensor')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(sensordata => {
    updateSensorTable(sensordata);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
  
  fetch('/conclusion')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(conclusion => {
    updateConclusionTable(conclusion);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

  fetch('/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(datareport => {
    updateDatareportTable(datareport);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

  document.getElementById('add-cases-button').addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Get the value from the text field
    const inputValue = document.getElementById('add-cases-desc').value;
    
    // Send a POST request to your server
    fetch('/caseadd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input : inputValue }) // Assuming your server expects JSON data
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const tableBody = document.querySelector('table#cases tbody');
      const newRowHTML = `
        <tr>
          <td>${inputValue}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', newRowHTML);
      return response.json();
    })
    .then(data => {
      // Handle the response from the server
      console.log('Server response:', data);
    })
    .catch(error => {
      console.error('Error sending POST request:', error);
    });
  });
  
  
  
});

function updateSensorText() {
}
// Update the table with the fetched users
function updateSensorTable(sensordata) {
  console.log('Received data:', sensordata);
  const tableBody = document.querySelector('table#sensor-stats tbody');
  tableBody.innerHTML = '';
  
  sensordata.forEach(sensor => {
    const row = document.createElement('tr');
    const statusCell = document.createElement('td');
    statusCell.textContent = sensor.status;
    row.appendChild(statusCell);
    tableBody.appendChild(row);
  });
}

function updateDatareportTable(datareport) {
  console.log('Received data:', datareport);
  const tableBody = document.querySelector('table#data-report tbody');
  tableBody.innerHTML = '';
  
  datareport.forEach(data => {
    const row = document.createElement('tr');
    const idCell = document.createElement('td');
    idCell.textContent = data.id;
    const dataCell = document.createElement('td');
    dataCell.textContent = data.data;
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = data.conclusion;
    const timeCell = document.createElement('td');
    timeCell.textContent = data.time;
    row.appendChild(idCell);
    row.appendChild(dataCell);
    row.appendChild(descriptionCell);
    row.appendChild(timeCell);
    tableBody.appendChild(row);
  });
}

function updateConclusionTable(conclusion) {
  console.log('Received data:', conclusion);
  const tableBody = document.querySelector('table#cases tbody');
  tableBody.innerHTML = '';
  
  conclusion.forEach(cases => {
    const row = document.createElement('tr');
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = cases.description;
    row.appendChild(descriptionCell);
    tableBody.appendChild(row);
  });
}