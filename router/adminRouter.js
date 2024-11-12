const express = require('express');
const{generateToken,generateRefreshToken}=require('../auth')
const router = express.Router();
router.use(express.json());


const  controller = require('../controller/controller')

router.post('/', async (req, res) => {
  try {
    const { name, password, email, hobbies } = req.body;
    const Nin = controller.genRand();
    console.log(name, password, Nin, email, hobbies);
    const result = await controller.creteUser(name, password, Nin, email, hobbies);
    if (!result) {
      return res.status(500).json({ error: 'Error creating user' });
    }
    const jwt = await generateToken({ name: result.name, hobbies: result.hobbies });
    const jwtRefresh = await generateRefreshToken({ name: result.name, hobbies: result.hobbies });
    const tokenExpirationTime = 1 * 60 * 60 * 1000;
    const refreshTokenExpirationTime = 7 * 24 * 60 * 60 * 1000;
    res.setHeader('Content-Type', 'application/json');


    res.cookie('accessToken', jwt, {
      httpOnly: true,
      maxAge: tokenExpirationTime,
      // secure: true,
      sameSite: 'strict',
    });

    res.cookie('refreshToken', jwtRefresh, {
      httpOnly: true,
      maxAge: refreshTokenExpirationTime,
      secure: true,
      sameSite: 'strict',
    });
    res.cookie('username', name.trim(), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    const decodedEmail = decodeURIComponent(email.trim())
    console.log(`this is decodedEmail ${decodedEmail}`);
    
    res.cookie('email', decodedEmail, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.status(200).json({
      status: 200,
      message: `user successifully created`,
      data: result._id,
      token: jwt,
      refreshToken: jwtRefresh,
      named:name,
      email: email
    });

    return;
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
});



router.get('/allUsers', async (req, res)=>{
    //http://localhost:2000/router/allUsers
   try {
        const allUsers =await controller.getAll()
        if(!allUsers){
            res.status(400).json({
                error: error.message
            })
            return
        }else{
            console.log('these are all the users');
            res.status(200).json(allUsers.message)
            return
        }
   } catch (error) {
    res.status(500).json({
        error: error.message
    })
    return
   }
})

// router.get('/user/:id',async (req,res) => {
//     // http://localhost:2000/router/user/2024889555104
//     console.log(req.params);
//     const  id = req.params.id
//     const user = await controller.findNin(id)
//     if(!user){
//             console.log(`User ${id} not found`);
//             res.status(404).json({
//             message: 'User not found'
//         })
//         return
//     }else{
//         console.log(`user was found using router id.Nin`);
        
//             res.status(200).json({
//                 status: 200,
//                 data: user
//             })
//             return
//     }
    
// })
router.get('/user/:id', async (req, res) => {
  // http://localhost:2000/router/user/2024889555104
    const id = req.params.id;
    const userResponse = await controller.findNin(id); // Capture the response

    // Check if there was an error in finding the user
    if (userResponse.error) {
        console.log(`User ${id} not found`);
        return res.status(404).json({ message: 'User not found' });
    } else {
        console.log(`User was found using router id.Nin`);
        return res.status(200).json({
            status: 200,
            data: userResponse.data // Use the data from the response
        });
    }
});
router.get('/userEmail/:email',async (req,res) => {
    // http://localhost:2000/router/userEmail/aroabdulazeez1@gmail.com

    console.log(req.params);
    const  email = req.params.email
    const user = await controller.findEmail(email)
    if(!user){
            console.log(`User ${email} not found`);
            express.response.status(404).json({
            message: 'User not found'
        })
        return
    }else{
            res.status(200).json({
                status: 200,
                data: user
            })
            return
    }
    
})

router.put('/update/:id/name', async (req, res) => {
    //http://localhost:2000/router/update/id/name
    // http://localhost:2000/router/update/2024811211447976/name
    //when updating the id is req.params so you add it directly to the request
    //but the name is req.body so you use body and json(recommending)     
    // move to the bottom for better explanation
  try {
    console.log('Route handler called');
    console.log(req.params); // Check if :id is being passed correctly
    console.log(req.body); // Check if password is being passed correctly
    const { id } = req.params;
    const { name } = req.body;
    console.log('Calling controller.updateUser');
    const user = await controller.updateUser(id, name);
    console.log('Controller update user result:', user);
    if (!user) {
      console.log('User not found');
      res.status(404).json({ data: `error updating at router` });
    } else {
              res.setHeader('Content-Type', 'application/json')
      console.log('User updated successfully');
      res.status(200).json({ status: 200, data: user.data });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});






router.post('/verify', async (req, res) => {
  try {
    console.log(`the beginning`);
    console.log(req.body);
    console.log('the end');
    let { Nin, password } = req.body;
    console.log(`Nin value: ${Nin} (type: ${typeof Nin})`);
    console.log(Nin, password);
    const user = await controller.verifyUser(Nin, password);
    if (!user) {
      res.status(404).send({ error: `User not found` });
    } else {
      let Nin = Number(req.body.Nin);
      console.log(`Nin value: ${Nin} (type: ${typeof Nin})`);
      const { data } = await controller.findNin(Nin);
      console.log(`this is the user ${JSON.stringify(data)}`);
      console.log(data);
      const token = generateToken({ name: data.name, hobbies: data.hobbies });
      const refreshToken = generateRefreshToken({ name: data.name, hobbies: data.hobbies });
      const tokenExpirationTime = 1 * 60 * 60 * 1000;
      const refreshTokenExpirationTime = 7 * 24 * 60 * 60 * 1000;
      res.setHeader('Content-Type', 'application/json');
      res.cookie('accessToken', token, {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        maxAge: tokenExpirationTime,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        maxAge: refreshTokenExpirationTime,
      });

       const decodedEmail = data.email
      console.log(`this is me trying to get the email ${decodedEmail}`);
      
    console.log(`this is decodedEmail ${decodedEmail}`);
    
    res.cookie('email', decodedEmail, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
      res.status(200).json({ status: 200, token, refreshToken });
    }
  } catch (error) {
    console.error('Error during verification:', error.message);
    res.status(500).send({ error: error.message });  }
});






router.put('/changePassword/:Nin/password',async function (req, res) {
    try {
        console.log(req.params);
        console.log(req.body);

        let Nin = req.params.Nin
        let password = req.body.password

        let user = controller.changePassword(Nin, password)

        if(!user){
            res.status(404).json({
                error: `this user does not exist`,
            })
        }else{
            res.status(200).json({
                statusbar: 'success',
                data: user.name,
                message: `this user ${user.name}'s password has been changed`,
            })
        }
        
        
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
        })
    }
})










module.exports = router



// router.post('/verify', async(req,res)=>{
//     try {
//         console.log(`the beginning`);
//         console.log(req.body);
//         console.log('the end');
//         let{Nin,password}=req.body
//         console.log(Nin,password);

//         const user = await controller.verifyUser(Nin,password)
//         if(!user){

//             res.status(404).res.send({
//                 error: `error occured`
                
//             })
//         }else{
//             res.setHeader('Content-Type', 'application/json')
//             res.status(200).json({
//                 status: 200,
//                 data:user.data
//             })
//         }
        
        
//     } catch (error) {
//         res.status(500).send({
//             error: error.message
//         })
//     }
// })


// router.post('/verify', async (req, res) => {
//   try {
//     console.log('The beginning');
//     console.log(req.body);
//     console.log('The end');

//     const { Nin, password } = req.body;
//     console.log(Nin, password);

//     const result = await controller.verifyUser(Nin, password);

//     if (result.error) {
//       return res.status(404).json({ error: result.message });
//     }

//     return res.status(200).json({ status: 200, data: result.data });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: error.message });
//   }
// });






// router.put('/update/:id/password', async (req,res)=>{
//     console.log(req.body);
//     const { password} = req.body
//     const {id} = req.params

//     const user =await controller.updateUser(id,password)
//     if(!user) {
//         res.status(404).json({
//             data:  `error updating at router`  
//         })
//     }else{
//         res.status(200).json({
//             status: 200,
//             data: user.data,
            
//         })
//     }
    
// })


// In Express.js, req.params and req.body are two different objects that contain data from an incoming HTTP request.

// *req.params*:

// - Contains route parameters, which are named placeholders in the route path.
// - Example: /users/:id - id is a route parameter.
// - Accessed using (http://localhost:2000/router/user/2024889555104).
// - Typically used for GET requests.

// *req.body*:

// - Contains the payload of the HTTP request, typically in JSON format.
// - Example: { name: 'John', age: 30 } sent in the request body.
// - Accessed using req.body.name or req.body.age.
// - Typically used for POST, PUT, and PATCH requests.

// Key differences:

// - req.params is used for route parameters, while req.body is used for request payload.
// - req.params is usually used for GET requests, while req.body is used for POST, PUT, and PATCH requests.
// - req.params is automatically populated by Express.js, while req.body requires a middleware like express.json() or express.urlencoded() to parse the request body.

// Here's an example to illustrate the difference:


// // Route with route parameter
// app.get('/users/:id', (req, res) => {
//   console.log((link unavailable)); // prints the id from the URL
// });

// // Route with request body
// app.post('/users', (req, res) => {
//   console.log(req.body.name); // prints the name from the request body
// });





// var nodemailer = require('nodemailer');

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'youremail@gmail.com',
//     pass: 'yourpassword'
//   }
// });

// var mailOptions = {
//   from: 'youremail@gmail.com',
//   to: 'myfriend@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });