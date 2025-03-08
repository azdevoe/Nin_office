const mongoose = require("mongoose");
const userSchema = require('../schema/schema')
const otpSchema = require('../schema/otpSchema')
 

const expiredOtp = mongoose.Schema({
    Nin:{
        type: Number, 
        required: true,
        validate: {
                    validator: async (Nin) => {
                    const userInOtpDb = await otpSchema.findOne({ Nin });
                    const userInUsedDb = await userSchema.findOne({ Nin });
                    if (userInOtpDb && userInUsedDb) {
                    console.log(`User with Nin ${Nin} exists in both databases`);
                    return true;
                    } else {
                    console.log(`User with Nin ${Nin} does not exist in both databases`);
                    return false;
                    }
                }
            }

    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type:Date,
        required: true
    },
    expiresAt:{
        type:Date,
        required: true
    }
})



module.exports = mongoose.model('expiredOtp',expiredOtp)




