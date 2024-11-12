const express = require('express');
const app = express()
let controller = require('./controller/controller')
const mongoose = require('mongoose');
let color = require('colors')
const router =require('./router/adminRouter')
const otpController = require('./controller/otpController')
const expired= require('./controller/expiredOtpController')
const otpRouter = require('./router/otpRouter')
const cookie = require('cookie-parser')
const frontendRouter = require('./router/frontendRouter')
let admin = require('./admin/adminController')
let adminRouter = require('./admin/router')
let messageController = require('./controller/messageController')
const messageRouter = require('./router/messageRouter')
const cors = require('cors')
app.use(express.json())

app.use(cookie())
app.use(cors())
 
//console.log(messageController.sendMessage('aroabdulazeez1@gmail.com'));





app.use('/router',router)
app.use('/otp',otpRouter)
app.use('/admin',adminRouter)
app.use('/message', messageRouter)
app.use('/',frontendRouter)
app.use(express.static('frontend'))



// app.get('/test', (req, res) => {
//   res.send('Hello World!');
//   const cookieValue = req.cookies.email;
//   console.log(cookieValue);

// });
mongoose.connect('mongodb://127.0.0.1:27017/apt',{




}).then(()=>{
    console.log(color.bold.bgGreen(`connected to MongoDB server`));
        
    
    
    //controller.creteUser('ninthName', 'ninthpass', controller.genRand(),'aroabdulazeez1@gmail.com',['jumping ', 'running'])
        //controller.getAll()
       // controller.findOne('firstName')
       //controller.findNin(2024821103744745)
        //controller.updateUser(20248892127868, 'nameupdated')
        //controller.verifyUser(2024811211447976, 'secondpass')
        //controller.verifyUser(2024811211447976, 'thirdp')
        //controller.verifyUser(2024811211447976, 'bruce')
        //controller.changePassword(2024811211447976,'thirdp')
        //controller.findEmail('aroabdulazeez1@gmail.com')
       //otpController.create({Nin:20248892127868})
       
       
       
       
       
       
       
       
       //otpController.generateOpt(2024821111032699)
       //otpController.transferExpiredOtp(20248892127868,291916)
       
       
      //otpController.validateOtp(2024821111032699,209842)
       
       //otpController.allOtp()


       //expired.createExpiredOtp(expiredOtpData.Nin,expiredOtpData.Otp, new Date(expiredOtpData.createdAt),new Date(expiredOtpData.expiresAt))


    //admin.creteUser('second','second',2024821111032699)
       //admin.getAll()
       //admin.findOne('first')
       //admin.findNin(202491291541449)
       //admin.updateUser(202491291541449,'firstUpdated')
       //admin.updateUser(202491291541449,'firstUpdated')
       //admin.verifyUser(202492417244325,'firstUpdated')
       //admin.verifyUser(2024924173842245,'second')


       //messageController.sendMessage('aroabdulazeez1@gmail.com', 'first message')
        //messageController.getAll()
    
}).catch((error)=>{

    console.log(color.bold.bgRed(error,`error connecting to database`));
})



app.listen(2000,()=>{
console.log(color.italic.bgBlue(`listening at port 2000`));
})

// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);
