const otpModel  = require('../schema/otpSchema')
const mongoose = require('mongoose');
const userSchema = require('../schema/schema')

const expiredSchema = require('./expiredOtpController')
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const bcrypt= require('bcrypt')

const { expiredOtpModel } = require('../schema/otpSchema');


function generate() {
  let y = Math.random() * 1000000;
  let u = Math.trunc(y);
  if (u < 100000) {
    u = u.toString().padStart(6, '0');
  }
  console.log(u);
  return u; // Return the generated OTP
}





async function generateOpt(Nin) {
  const otp = generate(); // Call the generate function internally
  console.log('Generated OTP:', otp);

  
  console.log('Checking for existing OTP...');
  const check = await otpModel.findOne({ Nin, otp });
  if (check && check.expiresAt > new Date()) {
    console.log(`check.expiresAt: ${check.expiresAt}, Current Date: ${new Date()}`);
    console.log(`You can't generate a new OTP because one still exists`);
    return { error: true, message: `You can't generate a new OTP because one still exists` };
  }
  console.log('No existing OTP found. Creating a new one...');
  const now = new Date();
  const exp = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
  const savedOtp = otp
  try {
    console.log('Creating new OTP...');
    let hashedOtp =await bcrypt.hash(otp.toString(),10)
    let otps = await otpModel.create({
      Nin: Nin,
      otp: hashedOtp,
      createdAt: now,
      expiresAt: exp,
    });
    console.log("User's OTP successfully created");
    console.log(otps);
  const userMail = await userSchema.findOne({Nin:Nin}).exec();
    console.log(userMail);
    
    const yy = userMail.email
    
    await sendOtpEmail( yy, savedOtp)
    console.log(savedOtp);
    
    return { error: false, data: otps };
   } 
catch (error) {
    if (error.name === 'ValidationError') {
        console.log(`Please wait 5 minutes before requesting another OTP`);
        
      return { error: true, message: 'Please wait 5 minutes before requesting another OTP' };
    }
    return { error: true, message: error.message };
  }
}


  
//   catch (error) {
//     console.error('Error creating OTP:', error);
//  return { error: true, message: error.message };
//   }
// }




   async function sendOtpEmail( email, otp) {
  try {
    const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 465, // or your email provider's port
  secure: false, // or true if using TLS
  debug: true, // Enable debug logging
  auth: {
    user: 'aroabdulazeez@gmail.com',
    pass: 'hqkxjtyqeocubcxk', // Your App Password
  },
  tls: {
    rejectUnauthorized: false
  },
  socketTimeout: 60000 // 60 seconds
});

    const mailOptions = {
      from: 'aroabdulazeez@gmail.com',
      to: email,
      subject: 'Your One Time Password',
      text: `Your OTP is: ${otp}`,
      html: `<h1>Your OTP is: ${otp}</h1>`,
    };

    const info = await transporter.sendMail(mailOptions);
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();

console.log(`Email sent on ${formattedDateTime}: ${info.response}`);
return{
  message: `Email sent on ${formattedDateTime}: ${info.response}`
}


  } catch (error) {
    console.log(error);
  }
}


async function allOtp(){
  try {
    const allOtp = await otpModel.find()

    console.log(`these are all OTP ${allOtp}`);

  return{
    error: false,
    return: allOtp
  }
    

    
  } catch (error) {
    console.log(`error occurred in allOtp function in allOtp controller`);
    return{
      error: true,
      message: error.message
    }
    
  }
}

async function transferExpiredOtps() {
  try {
    console.log('Finding expired OTPs...');
    const expiredOtpDocs = await otpModel.find({ expiresAt: { $lt: new Date() } });
    for (const otpDoc of expiredOtpDocs) {
      console.log(`Transferring OTP: ${otpDoc._id}`);
      if (!otpDoc) {
        console.log(`No OTP found for ID: ${otpDoc._id}`);
        continue;
      }
      const expiredOtp = await expiredSchema.createExpiredOtp(
        otpDoc.Nin,
        otpDoc.otp,
        otpDoc.createdAt,
        otpDoc.expiresAt
      );
      console.log(`Expired OTP transferred: ${JSON.stringify(expiredOtp.data)}`);
      const deletedDoc = await otpModel.deleteOne({ _id: otpDoc._id });
      console.log(deletedDoc.deletedCount);
      console.log(`Deleted OTP: ${JSON.stringify(deletedDoc)}`);
if (deletedDoc.deletedCount === 0) {
        console.log(`No expired OTP found for ID: ${otpDoc._id}`);
      }
    }
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    console.log(`${hours}:${minutes}`);

    console.log('Expired OTPs transferred successfully');
    return { error: false, message: `Expired OTPs transferred successfully at  ${hours}:${minutes}` };
  } catch (error) {
    console.error(`Error transferring expired OTPs: ${error}`);
    return { error: true, message: `Error transferring expired OTPs: ${error.message}` };
  }
}


cron.schedule('0 * * * *', async () => {
  await transferExpiredOtps();
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

    console.log(`${hours}:${minutes}`);


  console.log(`expired otp transferred successfully at ${hours}:${minutes}`);
  
});




// async function validateOtp(nin, otp) {
//   try {
//     const find = await otpModel.find({ Nin: nin });
//     console.log('Find result:', find);
//     if (find.length === 0) {
//       console.log('No document found with matching Nin');
//       return { error: true, message: 'No document found' };
//     }
//     const storedOtp = find[0].otp.toString(); // Convert storedOtp to a string
//     console.log('Stored OTP:', storedOtp);
//     const check = await bcrypt.compare(otp.toString(), storedOtp); // Convert otp to a string
//     console.log('Comparison result:', check);
//     if (check) {
//       console.log(`The OTPs correlate`);
//       return { error: false, message: 'OTP valid. Please enter new password.' };
//     } else {
//       console.log(`The OTPs do not correlate`);
//       return { error: true, message: 'Invalid OTP' };
//     }
//   } catch (error) {
//     console.log(`Error occurred at otpController validateOtp`);
//     console.log('Error message:', error.message);
//     return { error: true, message: error.message };
//   }
// }

async function validateOtp(Nin, otp) {
  try {
     console.log('NIN VALUE:', Nin);
  
    const doc = await otpModel.findOne({ Nin: Nin });
    console.log(doc);
    
    if (!doc) {
      return { error: true, message: 'No document found' };
    }
    const expiresAt = doc.expiresAt;
    const currentTime = new Date();
    if (currentTime > expiresAt) {
      return { error: true, message: 'OTP has expired' };
    }
    const storedOtp = doc.otp.toString();
    const check = await bcrypt.compare(otp.toString(), storedOtp);
    if (check) {
      console.log(`the otps match `);
      
      return { error: false, message: 'OTP valid' };
    } else {
      return { error: true, message: 'Invalid OTP' };
    }
  } catch (error) {
    console.error(error);
    return { error: true, message: 'Internal Server Error' };
  }
}





async function enterNewPassword(nin, newPassword) {
  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const user = await userSchema.findOneAndReplace(
      { Nin: nin },
      { password: hashedNewPassword }
    );
    if (!user) {
      console.log(`This user does not exist`);
      return { error: true };
    } else {
      console.log(`Password updated successfully`);
      return { error: false };
    }
  } catch (error) {
    console.log(`Error updating password: ${error}`);
    return { error: true };
  }
}



// async function transferExpiredOtp(Nin, otp) {
//   try {
//     console.log(`Finding OTP with Nin ${Nin} and otp ${otp}`);
//     const expiredOtpDoc = await otpModel.findOne({ Nin, otp, expiresAt: { $lt: new Date() } });
//     if (!expiredOtpDoc) {
//       console.log(`No OTP found for Nin ${Nin} and otp ${otp}`);
//       return { error: true, message: `No OTP found for Nin ${Nin} and otp ${otp}` };
//     }
//     console.log(`OTP found: ${expiredOtpDoc}`);
//     const expiredOtp = await expiredSchema.createExpiredOtp(
//       expiredOtpDoc.Nin,
//       expiredOtpDoc.otp,
//       expiredOtpDoc.createdAt,
//       expiredOtpDoc.expiresAt
//     );
//     console.log(`Expired OTP transferred: ${JSON.stringify(expiredOtp.data)}`); 
//     const deletedDoc = await otpModel.deleteOne({ Nin, otp, expiresAt: { $lt: new Date() } });
//     console.log(deletedDoc.deletedCount);
//     console.log(`Deleted OTP: ${JSON.stringify(deletedDoc)}`);
//     if (deletedDoc.deletedCount === 0) {
//       console.log(`No expired OTP found for Nin ${Nin} and otp ${otp}`);
//       return { error: true, message: `No expired OTP found for Nin ${Nin} and otp ${otp}` };
//     }
//     return { error: false, data: expiredOtp };
//      } catch (error) {
//     console.error(`Error transferring expired OTP: ${error}`);
//     return { error: true, message: `Error transferring expired OTP: ${error.message}` };
//   }
// }





module.exports ={
    generate,generateOpt,allOtp,transferExpiredOtps,validateOtp
}



// async function generateOpt(Nin, otp) {
//   const check = await otpModel.findOne({ Nin,otp });
//   if (check && check.expiresAt > new Date()) {
//     console.log(`check.expiresAt: ${check.expiresAt}, Current Date: ${new Date()}`);
//     console.log(`You can't generate a new OTP because one still exists`);
//     return { error: true, message: `You can't generate a new OTP because one still exists` };
//   }
//   const now = new Date();
//   const exp = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now
//   try {
//     let otps = await otpModel.create({
//       Nin: Nin,
//       otp: otp,
//       createdAt: now,
//       expiresAt: exp,
//     });
//     console.log("User successfully created");
//     console.log(otps);
//     return { error: false, data: otps };
//   } catch (error) {
//     return { error: true, message: error.message };
//   }
// }



// async function transferExpiredOtp(Nin, otp) {
//   try {
//     console.log(`Finding OTP with Nin ${Nin} and otp ${otp}`);
//     const expiredOtpDoc = await otpModel.findOne({ Nin, otp, expiresAt: { $lt: new Date() } });
//     if (!expiredOtpDoc) {
//       console.log(`No OTP found for Nin ${Nin} and otp ${otp}`);
//       return { error: true, message: `No OTP found for Nin ${Nin} and otp ${otp}` };
//     }
//     console.log(`OTP found: ${expiredOtpDoc}`);
//     const expiredOtp = await expiredSchema.createExpiredOtp(
//       expiredOtpDoc.Nin,
//       expiredOtpDoc.otp,
//       expiredOtpDoc.createdAt,
//       expiredOtpDoc.expiresAt
//     );
//     console.log(`Expired OTP transferred: ${JSON.stringify(expiredOtp.data)}`); 
//     const deletedDoc = await otpModel.deleteOne({ Nin, otp, expiresAt: { $lt: new Date() } });
//     console.log(deletedDoc.deletedCount);
//     console.log(`Deleted OTP: ${JSON.stringify(deletedDoc)}`);
//     if (deletedDoc.deletedCount === 0) {
//       console.log(`No expired OTP found for Nin ${Nin} and otp ${otp}`);
//       return { error: true, message: `No expired OTP found for Nin ${Nin} and otp ${otp}` };
//     }
//     return { error: false, data: expiredOtp };
//      } catch (error) {
//     console.error(`Error transferring expired OTP: ${error}`);
//     return { error: true, message: `Error transferring expired OTP: ${error.message}` };
//   }
// }














//if you dont want to use validator in the schema use this function
// async function generateOpt(Nin,otp){
//     const now = new Date();
//     const minute = now.getMinutes();
//     const exp = minute+5
//     const security = await userSchema.find({Nin:Nin})
//    if (security && security._id) {
//     try {
//       let otps = await schema.create({
//         Nin: Nin,
//         otp: otp,
//         createdAt: minute,
//         expiresAt: exp,
//       });
//       console.log(`user successfully created`);
//       console.log(otps);
//       return {
//         error: false,
//         data: otps,
//       };
//     } catch (error) {
//       return {
//         error: true,
//         message: error.message,
//       };
//     }
//   } else {
//     console.log(`User with Nin ${Nin} not found`);
//     return {
//       error: true,
//       message: `User with Nin ${Nin} not found`,
//     };
//   }
// }