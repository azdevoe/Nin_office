
  const name = document.cookie.split(';').find(c => c.includes('name')).split('=')[1];
  console.log(name)
  document.getElementById('username-display').innerHTML = `Welcome, ${name}!`;

