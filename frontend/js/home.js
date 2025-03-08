let nin = document.querySelector(".nin")
const NinCookie = document.cookie.split(';').find(c => c.trim().startsWith('Nin='));
if (NinCookie) {
    const Nin = NinCookie.split('=')[1];
    nin.innerHTML = Nin
    console.log(Nin);
} else {
    console.log('Nin cookie not found');
}

  const name = document.cookie.split(';').find(c => c.includes('name')).split('=')[1];
  console.log(name)
  document.getElementById('username-display').innerHTML = `Welcome, ${name}!`;




