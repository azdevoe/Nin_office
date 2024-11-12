const express = require('express')
let router = express.Router()
let cors = require('cors')
router.use(express.json());
router.use(cors())

const userController = require('./adminController')

router.post('/',async (req,res) => {
    console.log(req.body);
    const {name,password,Nin} = req.body
    console.log(name,password,Nin);

    
    
    const result = await userController.creteUser(name,password,Nin)

    try {
        if(result){
        res.status(200).json({
            status:200,
            message:`user Successfully created`,
            data:result.id
        })
        return
    }else{
        res.status(500).json(result)
        return
    }
    } catch (error) {
        res.status(400).json({
          error: error.message 
      })
      return
    }

});


router.get('/getAll',async (req,res)=>{
    const result = await userController.getAll()
    if(!result){
        res.status(404).json({
            status:404,
            message: `error occured at our End`

            
        })
    }
    res.status(200).json({
        status:200,
        body:result
    })
})
module.exports = router