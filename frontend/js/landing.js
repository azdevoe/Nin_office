const signInPage = document.getElementById('create');
const logInPage = document.getElementById('logIn');
const container = document.getElementById('container'); // assume you have a container element in your HTML

signInPage.addEventListener('click', async (event) => {
  event.preventDefault();
  try {
    const response = await fetch('/frontend/html/signup.html');
    const html = await response.text();
    container.innerHTML = html; // update the container element with the fetched HTML
  } catch (error) {
    console.error('Failed to fetch signup page:', error);
  }
});
