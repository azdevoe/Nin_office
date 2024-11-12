const express = require('express');
const router = express.Router();
router.use(express.json());

const otpController = require('../controller/otpController')



router.post('/createOpt', async (req, res) => {
    try {
        console.log(req.body);
    let {Nin} = req.body
    console.log(Nin);

    const createOpt = otpController.generateOpt(Nin)
    if(createOpt){
        res.status(200).json({
                status: 200,
                message: `Otp generated created`,
                data:createOpt.id
        })
        return
    }else{
                   console.log(`error occurred: at adminRouter while connecting to the controller`);

            
            res.status(500).json(result)
            return
    }

    } catch (error) {
        res.status(400).json({
            error: error.message
        })
        return
    }
    
    
})

router.get('/getAllOtp',async (req,res)=>{
    try {
        const all = await otpController.allOtp()
        if(all){
            console.log(`these are the users ${all}`);
            res.status(200).json({
                status: 200,
                message: `users found`,
                data: all
            })
            return
        }
        res.status(404).json(all)
        return

    } catch (error) {
        console.log(`error occurred at tthe otprouter `);
        res.status(500).json(error.message)
        
    }    
})

router.post('/verifyOpt', async (req, res) => {
  try {
    console.log(req.body)
    const Nin = req.body.Nin;
    const otp = req.body.otp;

    const verify = await otpController.validateOtp(Nin,otp)
    if (verify.error) {
  console.log('Verify error:', verify)
  res.status(401).json(verify)
}
else{
      res.status(200).json(verify)
    }
  } catch (error) {
    res.status(500).json(error.message)
  }
})


module.exports= router