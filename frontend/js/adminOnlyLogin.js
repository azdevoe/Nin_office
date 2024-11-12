const form = document.querySelector('#loginform');
const Nins = document.querySelector('#Nin');
const passwords = document.querySelector('#password');
const forgotPassword = document.querySelector('#forgotPassword');



form.addEventListener('submit', (e) => {
    e.preventDefault();
    let Nin = Nins.value;
    let password = passwords.value;
 

    console.log(Nin,password);
      verifyUserCredentials({Nin,password});
        form.reset();
});



async function verifyUserCredentials(data) {
  try {
    const response = await fetch('http://localhost:2000/router/verify', {
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
      alert('Login successful!');
      fetch('/adminHome')
        .then(response => response.text())
        .then(html => {
          document.body.innerHTML = html;
        });
    } else {
      alert(result.error || 'An error occurred. Please try again.');
      console.error(result);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}


// forgotPassword.addEventListener('click',()=>{
//     let otpPage = fetch('http://localhost:2000/otp/generateOpt',{
//       method: 'POST',
//       headers:{
//         'Content-Type':'application/json'
//       }
//     })
// })