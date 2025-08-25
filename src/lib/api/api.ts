import axiosClient from './axios-client';
import { date, z } from 'zod';

// Zod schemas for validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z
  .object({
    name: z.string().min(4),
    email: z.string().email(),
    phone: z.string().min(10),
    age: z.number(),
    dob: z.string().min(1),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const updateProfileSchema = z.object({
  email: z.string().email(),
  name: z.string().min(4),
  phone: z.string().min(10),
  age: z.number(),
  dob: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
});

export type RegisterFormInputs = z.infer<typeof registerSchema>;

// API functions
export const api = {
  auth: {
    login: (data: z.infer<typeof loginSchema>) =>
      axiosClient.post('/auth/login', data),
    register: (data: any) => axiosClient.post('/auth/register', data),
    forgotPassword: (data: z.infer<typeof forgotPasswordSchema>) =>
      axiosClient.post('/auth/forgot-password', data),
    changePassword: (data: z.infer<typeof changePasswordSchema>) =>
      axiosClient.post('/auth/change-password', data),
    updateProfile: (id: string, data: z.infer<typeof updateProfileSchema>) =>
      axiosClient.patch(`/crudusers/${id}`, data),
  },
  products: {
    getAll: () => axiosClient.get('/crudproducts'),
    getOne: (id: string) => axiosClient.get(`/products/${id}`),
    create: (data: z.infer<typeof productSchema>) =>
      axiosClient.post('/products', data),
    update: (id: string, data: z.infer<typeof productSchema>) =>
      axiosClient.patch(`/products/${id}`, data),
    delete: (id: string) => axiosClient.delete(`/products/${id}`),
  },
};
