import mongoose, { Schema } from "mongoose";

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  price: number;
  image: string;
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  isTodaySpecial: boolean;
  prepTimeMinutes: number;
  stock: number;
  ratingAverage: number;
  ratingCount: number;
  soldCount: number;
  tags: string[];
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    images: [String],
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isTodaySpecial: { type: Boolean, default: false },
    prepTimeMinutes: { type: Number, default: 30 },
    stock: { type: Number, default: 100 },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    tags: [String]
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

export const Product = mongoose.model<IProduct>("Product", productSchema);

