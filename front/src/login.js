  // Login API Call
  const login = async function () {
    const user = document.getElementById('username').value;
    const pass00 = document.getElementById('password').value;
    const pass0 = await hashPassword(pass00);
    const pass = await hashPassword(pass0+Math.floor(Date.now() / 1000 / 3600) * 3600);
    const messageElement = document.getElementById('login-message');
  
    fetch(API_ENDPOINT+'/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user, pass })
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        messageElement.textContent = 'Login successful!';
        messageElement.style.color = '#4caf50';
        localStorage.setItem('token', data.token);
        //localStorage.getItem('token')
        console.log('JWT Token:', data.token);
      } else {
        messageElement.textContent = 'Login failed!';
      }
    })
    .catch(error => {
      messageElement.textContent = 'An error occurred!';
      console.error('Error:', error);
    });
  }
  
  const hashPassword = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
  };

  document.getElementById('send').onclick = login