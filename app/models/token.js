import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let TokenSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  }
});

TokenSchema.statics.addToken = function(email, token) {
  return this
   .where({ email })
   .setOptions({ new : true, upsert: true })
   .findOneAndUpdate({ email, token });
}

export default mongoose.model("Token", TokenSchema);
