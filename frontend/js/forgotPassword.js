

let form = document.getElementById('form');
let Nins = document.getElementById('Nin')

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const Nin = Nins.value
localStorage.setItem('Nin', Nin);

  console.log(Nin)

  if (!Nin) {
    alert('Please enter your NIN');
    return;
  }

  // Display loading indicator
  document.getElementById('loading').style.display = 'block';

  try {
    const response = await fetch(`http://localhost:2000/router/user/${Nin}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';

    const result = await response.json();
    console.log(result.status);

    if (result.status === 200) {
      try {
        let sendOtpEmail = await fetch(`http://localhost:2000/otp/createOpt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Nin: Nin })
        })
        const result = await sendOtpEmail.json();
        window.location.href = '/verifyOtp';
        return;
      } catch (error) {
        console.error('Error sending OTP:', error.message)
        alert(`Error sending OTP: ${error.message}. Please try again.`)
      }
    } else {
      alert(`Unexpected status: ${result.status}`)
    }
  } catch (error) {
    console.error('Error:', error.message)
    alert(`Error occurred: ${error.message}. Please try again.`)
  }
})

