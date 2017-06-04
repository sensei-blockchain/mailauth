import nodemailer from 'nodemailer';

var inst;

export default class Mailer {
  constructor() {
    if(inst)
      throw new Error("Mailer is a singleton object. Cannot create new Object.");
    this.transport = nodemailer.createTransport({
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    });
  }

  // Make this singleton
  static get instance() {
    if(!inst)
      inst = new Mailer();
    return inst;
  }

  sendOTPMail(toEmail, otp) {
    return new Promise((resolve, reject) => {
      const email = {
        from: process.env.FROM_EMAIL || 'contact@xyz.com',
        to: toEmail,
        subject: 'Access code for loging in xyz.com',
        html: `<p>Your OTP Code : <b>${otp}</b></p>`
      };
      this.transport.sendMail(email, (error, info) => {
        if(error) {
          return reject(error);
        }
        resolve(info);
      });
    });
  }
}
