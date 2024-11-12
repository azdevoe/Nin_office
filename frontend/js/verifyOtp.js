const form = document.getElementById('form');
const otpInput = document.getElementById('otp');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const Nin = localStorage.getItem('Nin');
  const otp = otpInput.value;

  if (!otp || !Nin) {
    alert('Please enter OTP and ensure NIN is stored');
    return;
  }

  document.getElementById('loading').style.display = 'block';

  fetch('http://localhost:2000/otp/verifyOpt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Nin, otp })
  })
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);
    document.getElementById('loading').style.display = 'none';
    
    if (data.error) {
      alert(data.message);
    } else {
      console.log(`OTP verification successful`);
      
      window.location.href = '/newPassword';
    }
  })
  .catch(error => {
    console.error('Error verifying OTP:', error);
    alert('Error verifying OTP. Please try again.');
    document.getElementById('loading').style.display = 'none';
  });
});

