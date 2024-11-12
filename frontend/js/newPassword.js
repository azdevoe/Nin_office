const form = document.getElementById('form');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const Nin = localStorage.getItem('Nin');
console.log(Nin);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!newPassword || !confirmPassword) {
    alert('Please enter both new password and confirm password');
    return;
  }

  if (newPassword !== confirmPassword) {
    alert('New password and confirm password do not match');
    return;
  }

  try {
    const response = await fetch(`http://localhost:2000/router/changePassword/${Nin}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (response.ok) {
      console.log('Password changed successfully');

      // Redirect to login page with new credentials
      const loginResponse = await fetch('http://localhost:2000/router/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Nin, password: newPassword }),
      });

      if (loginResponse.ok) {
        console.log('Login successful');
        localStorage.removeItem('Nin');
        localStorage.clear();
        window.location.href = '/home'; // Redirect to dashboard or desired page
      } else {
        console.error('Login failed:', loginResponse.status);
        alert('Login failed. Please try again.');
      }
    } else {
      console.error('Error changing password:', response.status);
      alert('Error changing password. Please try again.');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    alert('Error changing password. Please try again.');
  }
});

