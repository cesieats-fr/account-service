import { IAccount } from 'cesieats-service-types/src/account';
import mongoose, { Schema, model } from 'mongoose';

export const accountSchema = new Schema<IAccount>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  forname: { type: String, required: true },
  accountType: { type: Number, required: true },
  address: { type: String, required: false },
  apiKey: { type: String, required: false },
  codeSponsor: {type: String, required: false },
});

export const Account = model<IAccount>('Account', accountSchema);

export async function connectMongoose() {
  await mongoose.connect(`mongodb://${process.env.DB_URL}/`, {
    dbName: 'cesieats-service',
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
  });
  console.log('Connected to MongoDB ');
}
