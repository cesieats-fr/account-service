// import { Schema, model } from 'mongoose';

// export const accountSchema = new Schema<IAccount>({
//   id: { type: Number, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// });

// export const Account = model<IAccount>('Account', accountSchema);
import mongoose from 'mongoose';

export const connectMongoose = () => {
  mongoose
    .connect('mongodb://192.168.2.30:32000/', {
      dbName: 'cesieats-service',
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
    })
    .then(() => {
      console.log('Connected to the database');
    })
    .catch((err) => {
      console.log(err);
    });
};