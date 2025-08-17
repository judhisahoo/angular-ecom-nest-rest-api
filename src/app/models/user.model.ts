// src/app/models/user.model.ts
export interface User {
  _id?: string; // MongoDB style ID
  id?: string; // Alternative ID field
  userId?: string; // Another alternative ID field
  name: string;
  email: string;
  phone?: string;
  age?: number;
  dob?: string | Date;
  status?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  __v?: number; // MongoDB version field
}
