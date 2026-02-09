
export type MemberStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';
export type UserRole = 'ADMIN' | 'ASSOCIATE' | 'GUEST';

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface Member {
  id: string;
  companyName: string;
  cnpj: string;
  logo: string; // Base64 or URL
  description: string;
  website: string;
  socials: SocialLinks;
  status: MemberStatus;
  createdAt: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface AuthState {
  role: UserRole;
  user: Member | null; // Null if admin or guest
  isAuthenticated: boolean;
}

export type ViewType = 'DIRECTORY' | 'REGISTER' | 'ADMIN' | 'LOGIN' | 'PROFILE' | 'NEWS';
