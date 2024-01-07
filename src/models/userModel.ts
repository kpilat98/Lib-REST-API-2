// usermodel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface BorrowedBook {
  id: number;
  title: string;
}

export interface User extends Document {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  borrowedBooks?: BorrowedBook[];
}

const borrowedBookSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
});

const userSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  borrowedBooks: [borrowedBookSchema],
},
{ versionKey: false });  // disabling '_v" key assigned by MongoDB

export const UserModel = mongoose.model<User>('User', userSchema);
