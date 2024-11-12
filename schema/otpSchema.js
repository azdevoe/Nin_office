const mongoose = require('mongoose');
const userSchema = require('./schema');

const otp = mongoose.Schema({
  Nin: {
    type: Number,
    required: true,
    validate: {
      validator: async (Nin) => {
        const userExists = await userSchema.exists({ Nin });
        if (!userExists) {
          return false;
        }
        const hasActiveOtp = await mongoose.model('otp').exists({ Nin, expiresAt: { $gt: Date.now() } });
        if (hasActiveOtp) {
          return false;
        }
        return true;
      }
    }
  },
  otp: {
    type: String,
required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  indexes: [
    { createdAt: 1 },
    { expireAfterSeconds: 300 }
  ]
});

const otpSchema = mongoose.model('otp', otp);



module.exports = otpSchema 


















// const mongoose = require('mongoose');
// const userSchema = require('../schema/schema');
// const ExpiredOtp = require('./expiredOtp'); // Import the ExpiredOtp model

// const otpSchema = mongoose.Schema({
//   Nin: { type: Number, required: true },
//   otp: { type: Number, required: true },
//   createdAt: { type: Date, required: true },
//   expiresAt: { type: Date, required: true },
// }, {
//   select: { _id: 0, __v: 0 },
// });

// otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

// const otpModel = mongoose.model('otp', otpSchema);

// otpSchema.path('Nin').validate(async (Nin) => {
//   const existingOtp = await otpModel.findOne({ Nin, expiresAt: { $gt: new Date() } });
//   if (existingOtp) {
//     console.log(`OTP for user with Nin ${Nin} already exists and hasn't expired`);
//     return false;
//   }
//   return true;
// }, 'OTP for this user already exists and hasn\'t expired');

// otpModel.watch().on('change', (change) => {
//   if (change.operationType === 'delete' && change.documentKey._id) {
//     const otpDoc = change.fullDocument;
//     ExpiredOtp.create(otpDoc); // Use the imported ExpiredOtp model
//   }
// });

// module.exports = otpModel ;




// Use otpModel and expiredOtpModel here




// const otp = mongoose.Schema({
//     Nin:{
//         type: Number,
//         required: true,
//         validate:{
//             validator:async (NiN)=>{
//                 const hh= await userSchema.findOne(Nin)
//                 if(hh){
//                     return hh
//                 }
//                 else{
//                     console.log(`user with nin not found`);
                    
//                 }
//             }
//         }
//     },
//     otp: {
//         type: Number
//     },
//     createdAt:{
//         type: Date,
//      },
//     expiresAt:{
//         type: Date
//     },
    

// }
// ,{
//         select: { _id: 0, __v: 0 }
// })




// const otp = mongoose.Schema({
//   Nin: {
//     type: Number,
//     required: true,
//     validate: {
//       validator: async (Nin) => {
//         const existingOtp = await otpModel.findOne({ Nin, expiresAt: { $gt: new Date() } });
//         if (existingOtp) {
//           console.log(`OTP for user with Nin ${Nin} already exists and hasn't expired`);
//           return false;
//         }
//         return true;
//       },
//     },
//   },
//   otp: {
//     type: Number,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     required: true,
//      },
//   expiresAt: {
//     type: Date,
//     required: true,
//   },
// }, {
//   select: {
//     _id: 0,
//     __v: 0,
//   },
// });



// const otp = mongoose.Schema({
//   Nin: {
//     type: Number,
//     required: true,
//   },
//   otp: {
//     type: Number,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     required: true,
//   },
//   expiresAt: {
//     type: Date,
//     required: true,
//   },
// }, {
//   select: {
//     _id: 0,
//     __v: 0,
//   },
// });

// otp.pre('save', async function(next) {
//   const existingOtp = await userSchema.findOne({ Nin: this.Nin, expiresAt: { $gt: new Date() } });



// if (existingOtp) {
//     throw new Error(`OTP for user with Nin ${this.Nin} already exists and hasn't expired`);
//   }
//   next();
// });


// const otpSchema = mongoose.Schema({
//   Nin: {
//     type: Number,
//     required: true,
//   },
//   otp: {
//     type: Number,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     required: true,
//   },
//   expiresAt: {
//     type: Date,
//     required: true,
//   },
// }, {
//   select: {
//     _id: 0,
//     __v: 0,
//   },
// });

// const otpModel = mongoose.model('otp', otpSchema);

// otpSchema.path('Nin').validate(async (Nin) => {
//   const existingOtp = await otpModel.findOne({ Nin, expiresAt: { $gt: new Date() } });
//   if (existingOtp) {
//     console.log(`OTP for user with Nin ${Nin} already exists and hasn't expired`);
//     return false;
//   }
//   return true;
// }, 'OTP for this user already exists and hasn\'t expired');


// module.exports = mongoose.model('otp',otpSchema)


