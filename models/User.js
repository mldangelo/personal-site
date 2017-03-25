import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const User = new Schema({
  name: String,
  given_name: String,
  family_name: String,
  profile: String,
  picture: String,
  email: String,
  email_verified: Boolean,
  gender: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('users', User);
