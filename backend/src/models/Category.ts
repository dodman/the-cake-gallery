import mongoose, { Schema } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", categorySchema);

