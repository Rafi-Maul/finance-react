export interface Role {
  id?: string | number;
  code: string;
  name?: string;
}

export interface Office {
  id: string | number;
  code?: string;
  name?: string;
}

export interface User {
  id: string | number;
  username?: string;
  name?: string;
  roleCode: string;
  roleName?: string;
  email?: string;
  phone?: string;
  company?: string;
  officeId?: string | number;
  officeCode?: string;
  status?: string;
  joinDate?: string;
  lastLogin?: string;
  avatar?: string;
  role?: Role;
  office?: Office;
  roleDetails?: Role;
}
