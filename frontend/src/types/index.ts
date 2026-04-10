export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  tags: string[];
  postedAt: string;
  duration: string;
  stipend: string;
  companyLogo?: string;
}

export type UserRole = 'student' | 'company' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}
