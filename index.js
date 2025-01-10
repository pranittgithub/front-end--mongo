// User Registration Form Submission
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('pass').value.trim();
    const gender = document.getElementById('gender').value;
    const purchase = document.getElementById('purchase').value;
    const message = document.getElementById('message');
  
    // Basic Validations
    if (!/^\d{10}$/.test(phone)) { // Ensure phone number is exactly 10 digits
        message.textContent = 'Phone number must be exactly 10 digits!';
        return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) { // Ensure email is valid
        message.textContent = 'Invalid email format!';
        return;
    }
    if (!gender) { // Ensure a gender is selected
        message.textContent = 'Please select your gender!';
        return;
    }
    if (!purchase) { // Ensure a purchase source is selected
        message.textContent = 'Please select a purchase source!';
        return;
    }
  
    try {
        // Backend Request
        const response = await fetch('https://backend-mongo-pehs.onrender.com/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, email, password, gender, purchase }),
        });
  
        const result = await response.json();
        message.textContent = result.message;
  
        // Redirect only if the message matches "User registered successfully!"
        if (response.ok && result.message === 'User registered successfully!') {
            // Clear the form
            document.getElementById('registerForm').reset();
  
            // Redirect to labelcode.html
            localStorage.setItem('userEmail', email);
            window.location.href = 'label_code.html';
        }
    } catch (error) {
        message.textContent = 'An error occurred. Please try again!';
        console.error('Error:', error);
    }
  });
  