export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  dob: Date;
  phone: string;
  status: boolean;
  // Add other properties of your user object here, as returned by your API.
  // For example:
  // role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
