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
  // Add event listeners for user actions (add, update, delete)
  const addForm = document.querySelector('form#add-datareport-form');

  addForm.addEventListener('submit', event => {
    alert("Add DataReport");
    event.preventDefault();
    addUser();
    addForm.reset();
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
  
function updateUser(id, name, email, age) {
  const userData = { name, email, age };
  
  fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to update user');
    }
  })
  .then(user => {
    console.log("Updated user: ", user);
    alert(`User ${user.name} updated successfully`);
    fetch('/api/users')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch users');
      }
    })
    .then(users => {
      updateTable(users);
    })
    .catch(error => {
      console.error('Error fetching users: ', error);
      alert('Failed to fetch users');
    });
  })
  .catch(error => {
    console.error(error);
    alert('Failed to update user');
  });
}
