const form = document.querySelector('.signup');
const nameInput = document.querySelector('#name');
const passwordInput = document.querySelector('#password');
const emailInput = document.querySelector('#email');
const hobbiesInput = document.getElementById('hobbies');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = nameInput.value;
    let password = passwordInput.value;
    let email = emailInput.value;
    // const hobbiesValue = hobbiesInput.value;
    // const hobbiesArray = hobbiesValue.split(',');
    const hobbiesValue = hobbiesInput.value.trim();
    const hobbiesArray = hobbiesValue.split(' ').filter(hobby => hobby !== '');
   

    console.log(hobbiesArray, name, password, email);
      verifyUserCredentials({name, password,email,hobbies:hobbiesArray });
        form.reset();
});



async function verifyUserCredentials(data) {
  try {
    const response = await fetch('http://localhost:2000/router', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (response.ok) {
      document.cookie = `accessToken=${result.accessToken}; max-age=${3600}; Secure; HttpOnly`;
      document.cookie = `refreshToken=${result.refreshToken}; max-age=${604800}; Secure; HttpOnly`;
                 window.location = '/home'; 

    } else {
      alert(result.error || 'An error occurred. Please try again.');
      console.error(result);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}


