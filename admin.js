document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Form submitted');

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const adminMessage = document.getElementById('adminMessage');

  const response = await fetch('https://backend-mongo-pehs.onrender.com//admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const result = await response.json();
  adminMessage.textContent = result.message;

  if (result.success) {
    document.getElementById('adminLoginForm').style.display = 'none';
    
    const userList = document.getElementById('userList');
    userList.style.display = 'block';
    
    userList.innerHTML = `
      <h2>Registered Users:</h2>
      <div class="admin-controls" style="margin-bottom: 20px;">
        <button id="exportCSV" class="btn btn-primary">Export to CSV</button>
      </div>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Win</th>
            <th>Attempts</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    `;

    const tableBody = document.querySelector('table tbody');

    // Populate table
    result.users.forEach(user => {
      const phone = (user.phone && user.phone.length === 10) ? user.phone : 'Invalid Phone Number';
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${phone}</td>
        <td>${user.win}</td>
        <td>${user.attempts}</td>
        <td>
          <button 
            class="delete-user btn btn-danger btn-sm" 
            data-user-id="${user._id}"
            onclick="deleteUser('${user._id}')"
          >
            Delete
          </button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Export to CSV functionality
    document.getElementById('exportCSV').addEventListener('click', () => {
      const csvContent = convertToCSV(result.users);
      downloadCSV(csvContent, 'user_data.csv');
    });
  }
});

// Function to delete specific user
async function deleteUser(userId) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const response = await fetch(`https://backend-mongo-pehs.onrender.com/admin/delete-user/${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove the row from the table
        const row = document.querySelector(`button[data-user-id="${userId}"]`).closest('tr');
        row.remove();
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user: ' + result.message);
      }
    } catch (error) {
      alert('Error deleting user: ' + error.message);
    }
  }
}

// Helper function to convert data to CSV format
function convertToCSV(users) {
  const headers = ['Name', 'Email', 'Phone', 'Win', 'Attempts'];
  const rows = users.map(user => [
    user.name,
    user.email,
    user.phone || 'Invalid Phone Number',
    user.win,
    user.attempts
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

// Helper function to download CSV file
function downloadCSV(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, fileName);
  } else {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}