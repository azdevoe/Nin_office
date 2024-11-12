const express = require('express');
const router = express.Router();
const messageController = require('../controller/messageController');
const { body, validationResult } = require('express-validator');

// Extract cookie and message


router.post('/send', [body('message').trim().escape()], async (req, res) => {
  console.log(`this is the message us router`);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const cookieValue = req.cookies.email;
    const message = req.body.message;
    console.log(`This is the email from cookie: ${cookieValue}`);
    console.log(`This is the message from body: ${message}`);

    // Validate input
    if (!cookieValue || !message) {
  const missingField = !cookieValue ? 'Email' : 'Message';
  console.log(`${missingField} is missing`);
  return res.status(400).json({ error: `${missingField} is missing` });
}



    // Send message
    const sendMessage = await messageController.sendMessage(cookieValue, message);
    console.log(sendMessage);

    if (sendMessage) {
      return res.status(200).json(sendMessage);
    }

    // Handle unexpected error
    return res.status(500).json({ error: 'Failed to send message' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server-side error' });
  }
});


router.get('/getAll',async function(req, res) {
    try {
      const all = await messageController.getAll();
      if(!all){
        res.status(404).json({ error: 'error occurred getting all the users' });
      }
      res.status(200).json(all)
    } catch (error) {
              res.status(500).json({ error: 'Server-side error' });

    }
})

router.post('/per',(req, res) => {
    res.send(`hello world`)
     const cookieValue = req.cookies.email;
    console.log(cookieValue);
})
router.get('/test', (req, res) => {
  res.send('Hello World!');
  const cookieValue = req.cookies.email;
  console.log(cookieValue);

});

module.exports = router;
