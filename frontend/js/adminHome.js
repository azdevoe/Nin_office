
let button=document.getElementById('button')
let less=document.getElementById('less')
let ninSearchForm = document.getElementById('ninSearch')
let ninSearch = document.getElementById('Nin')
let ninResult = document.querySelector('.search')
console.log('Script loaded');

const message = document.getElementById('message');
const body = document.body;

console.log('welcome');
console.log('DOMContentLoaded');

document.addEventListener('DOMContentLoaded', async (e) => {
  try {
    const response = await fetch('http://localhost:2000/message/getAll', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(data.message);
  const messageText = data.message.map((item) => {
      return item.messages.map((msg) => {
        return `
          <p style="background:green;">Email: ${item.email}</p>
          <p>Message: ${msg.message[0]}</p>
          <hr>
        `;
      }).join('');
    }).join('');

    
    message.innerHTML = messageText;
    message.style.display = 'none';
  } 
catch (error) {
    console.error(error.message);
  }
});
button.addEventListener('click', function (){
        message.style.display = 'block';

})
less.addEventListener('click', function (){
        message.style.display = 'none';

})
async function searchNin(nin) {
  try {
    let search = await fetch(`http://localhost:2000/router/user/${nin}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await search.json();
    if (!result) {
      alert('Error occurred while searching for user');
      alert(result.error);
    }
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}

ninSearchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let ninInput = ninSearch.value;
  searchNin(ninInput);
});
