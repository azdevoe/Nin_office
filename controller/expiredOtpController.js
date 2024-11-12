const schema = require('../schema/expiredOtp')




async function createExpiredOtp(Nin, otp, createdAt, expiresAt) {
  try {
    const expiredOtp = await schema.create({
      Nin,
      otp,
      createdAt,
      expiresAt
    });
    console.log(`Expired OTP logged successfully`);
    return {
      error: false,
      data: expiredOtp
    };
  } catch (error) {
    console.error(`Error logging expired OTP: ${error.message}`);
    return {
      error: true,
      message: 'Failed to log expired OTP'
    };
  }
}


module.exports = {
    createExpiredOtp
}


