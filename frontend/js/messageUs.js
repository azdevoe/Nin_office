const form = document.getElementById('form');
const messages = document.getElementById('message');


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let message = messages.value
    console.log(message);
    fetchdata({message});
    form.reset();
    
})

async function fetchdata(data){
  try {
    const response = await fetch('http://localhost:2000/message/send',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    
    if(result.error === false) {
      console.log(`message sent: ${result.message}`);
      alert(`Message sent successfully`);
    } else {
      console.log(`an error occurred`);
      console.error(result);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}

