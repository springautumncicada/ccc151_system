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

  const addForm = document.querySelector('form#add-datareport-form');
  const deleteForm = document.querySelector('form#delete-datareport-form');
  const updateForm = document.querySelector('form#update-datareport-form');
  addForm.addEventListener('submit', event => {
    alert("Add form");
    event.preventDefault();
    adddatareport();
    addForm.reset();
  });
  deleteForm.addEventListener('submit', event => {
    event.preventDefault();
    const id = deleteForm.elements['id'].value;
    deleteDataReport(id);
    deleteForm.reset();
  });
  updateForm.addEventListener('submit', event => {
    alert("Update form");
    event.preventDefault();
    const id = updateForm.elements['updatedatareport-id'].value;
    const measurement_id = updateForm.elements['updatemeasurement-id'].value;
    const conclusion_id = updateForm.elements['updateconclusion-id'].value;
    
    updateData(id, measurement_id, conclusion_id);
    updateForm.reset();
  });

  document.getElementById('add-cases-button').addEventListener('click', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
  
    // Get the value from the text field
    const textField = document.getElementById('add-cases-desc');
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
      return response.json();
    })
    .then(data => {
      // Handle the response from the server
      console.log('Server response:', data);
    })
    .catch(error => {
      console.error('Error sending POST request:', error);
    });

    textField.value = '';
  });
  
  document.getElementById('del-cases-button').addEventListener('click', async function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();
    const textField = document.getElementById('add-cases-desc');
    const inputValue = document.getElementById('add-cases-desc').value;
    deleteCase(inputValue);
    textField.value = '';
    // try {
    //     // Send a DELETE request to your server
    //     const deleteResponse = await fetch('/casedel', {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //     });

    //     if (!deleteResponse.ok) {
    //         throw new Error('Failed to delete cases');
    //     }

    //     // Fetch conclusion data
    //     const conclusionResponse = await fetch('/conclusion');
    //     if (!conclusionResponse.ok) {
    //         throw new Error('Failed to fetch conclusion');
    //     }
        
    //     const conclusion = await conclusionResponse.json();
    //     updateConclusionTable(conclusion);
    //     console.log('Server response:', conclusion);
    // } catch (error) {
    //     console.error('Error:', error.message);
    // }
});
  
});
function deleteCase(id) {
  fetch(`/casedel/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to delete user');
    }
  })
  .then(result => {
    if (result.id) {
      fetch('/conclusion')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch users');
        }
      })
      .then(conclusions => {
        updateConclusionTable(conclusions);
      })
      .catch(error => {
        console.error('Error fetching users: ', error);
        alert('Failed to fetch users');
      });
    } else {
      throw new Error('Failed to delete user');
    }
  })
  .catch(error => {
    console.error(error);
    alert('Failed to delete user');
  });
}



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
    const idCell = document.createElement('td');
    idCell.textContent = cases.id;
    const descriptionCell = document.createElement('td');
    descriptionCell.textContent = cases.description;
    row.appendChild(idCell);
    row.appendChild(descriptionCell);
    tableBody.appendChild(row);
  });
}

function adddatareport() {
  const measurement_id = document.getElementById('measurement-id').value;
  const conclusion_id = document.getElementById('conclusion-id').value;
  const userData = { measurement_id, conclusion_id };

  if (!measurement_id || !conclusion_id) {
    alert('Please fill in all required fields.');
    return;
  }

  fetch('/adddatareport', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to add data report');
    }
  })
  .then(datareport => {
    console.log("Added data report: ", datareport);
    alert(`Data Report ${datareport.id} added successfully`);

    // Fetch updated data reports from the correct endpoint
    return fetch('/data');
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to fetch data reports');
    }
  })
  .then(datareports => {
    updateDatareportTable(datareports);
  })
  .catch(error => {
    console.error('Error: ', error);
    alert('An error occurred');
  });
}

function deleteDataReport(id) {
  fetch(`/deletedata/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to delete user');
    }
  })
  .then(result => {
    if (result.id) {
      fetch('/data')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch users');
        }
      })
      .then(datareports => {
        updateDatareportTable(datareports);
      })
      .catch(error => {
        console.error('Error fetching users: ', error);
        alert('Failed to fetch users');
      });
    } else {
      throw new Error('Failed to delete user');
    }
  })
  .catch(error => {
    console.error(error);
    alert('Failed to delete user');
  });
}

function updateData(id, measurement_id, conclusion_id) {
  const userData = { measurement_id, conclusion_id};
  
  fetch(`/updatedata/${id}`, {
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
    alert(`User ${user.measurement_id} updated successfully`);
    fetch('/data')
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to fetch users');
      }
    })
    .then(datareports => {
      updateDatareportTable(datareports);
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