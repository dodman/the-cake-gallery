import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

export type UserRole = "customer" | "admin";

export interface IUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  address?: string;
  favorites: mongoose.Types.ObjectId[];
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    address: { type: String },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Product" }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);

