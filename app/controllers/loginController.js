import validator from 'email-validator';
import Mailer from '../delegates/mailer';
import OTP from '../models/otp';
import Token from '../models/token';

export default class LoginController {
  static sendOTP(req, res) {
    const email = req.body.email;
    if(!validator.validate(email)) {
      res.status(404).json({
        "status" : 'Email should be valid'
      });
    }
    OTP
     .findOne({ email })
     .then(otp => {
        // If the user has generated a secret, then use it to generate same OTP.
        if(otp) {
          return otp;
        }

        // Record a new secret for User.
        return OTP.assignOTP(email);
      })
     .then(otp => Mailer.instance.sendOTPMail(otp.email, otp.code()))
     .then(info => {
        // Log the message Id for tracking purposes
        console.log("Queued: An email is queued for Email : " + email + " with MessageId : " + info.messageId);
        res.json({
          "status" : "An email is queued. Retry if not delivered.",
        });
      })
     .catch(error => {
        // Log the error for further analysis
        console.log("Error: " + error.message + ", Email: " + email);
        res.status(500).json({
          "reason": "An Internal Server Error has Occurred. Please wait we are looking into this."
        });
      });
  }

  static verifyOTP(req, res) {
    const { email, code } = req.body;
    if(!validator.validate(email)) {
      res.status(404).json({
        "status" : 'Email should be valid'
      });
    }
    OTP
     .findOne({ email })
     .then(otp => {
        if(!otp) {
          return res.status(404).json({
            "reason": "Invalid Request"
          });
        }
        if(!otp.verifyCode(code)) {
          return res.status(400).json({
            "reason": "Invalid Code. Retry using code sent at your email id."
          });
        }
        // User is valid
        // Issue a access token for further requests by user.
        const token = Math.random().toString(36).substring(2);
        otp
         .removeOTP()
         .then(() => Token.addToken(email, token))
         .then(issued => {
            res.json({
              "access_token": issued.token,
              "issued_at": Date.now()
            });
          });
      })
     .catch(error => {
        // Log the error for further analysis
        console.log("Error: " + error.message + ", Email: " + email);
        res.status(500).json({
          "reason": "An Internal Server Error has Occurred. Please wait we are looking into this."
        });
      });
  }
}
