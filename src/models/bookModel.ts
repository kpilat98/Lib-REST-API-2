import mongoose, { Schema, Document } from 'mongoose';

export interface Tag {
  id: number;
  name: string;
}

export interface Book extends Document {
  id: number;
  title: string;
  author: string;
  year?: number;
  tags?: Tag[];
  category: string;
  status: string;
}

const tagSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
});

const bookSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number },
  tags: [tagSchema],
  category: { type: String, required: true },
  status: { type: String, enum: ['available', 'borrowed', 'in maintenance'], required: true },
},
{ versionKey: false }); //disabling '_v" key assigned by MongoDB

export const BookModel = mongoose.model<Book>('Book', bookSchema);
