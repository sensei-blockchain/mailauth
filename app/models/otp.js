import mongoose from 'mongoose';
import otplib from 'otplib';

otplib.authenticator.options = {
  step: 1800    // OTP to be valid for 30 minutes
}

let Schema = mongoose.Schema;

let OTPSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  secret: {
    type: String,
    required: true
  }
});

OTPSchema.statics.assignOTP = function (email) {
  const secret = otplib.authenticator.generateSecret();
  return this
    .where({ email })
    .setOptions({ new : true, upsert: true })
    .findOneAndUpdate({
      email,
      secret
    });
}

OTPSchema.methods.removeOTP = function () {
  return this.remove({ email: this.email });
}

OTPSchema.methods.code = function (){
  const code = otplib.authenticator.generate(this.secret);
  return code;
}

OTPSchema.methods.verifyCode = function (codeToBeVerify){
  return otplib.authenticator.verify({secret: this.secret, token: codeToBeVerify});
}

export default mongoose.model("OTP", OTPSchema);
