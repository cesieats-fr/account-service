import { IAccount } from 'cesieats-service-types/src/account';
import mongoose, { Schema, model } from 'mongoose';

export const accountSchema = new Schema<IAccount>({
  name: { type: String, required: true },
  forname: { type: String, required: true },
  idIdentity: { type: String, required: true },
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
