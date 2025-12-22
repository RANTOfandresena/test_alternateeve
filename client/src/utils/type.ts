

export interface UtilisateurDto {
  _id: string;
  nom: string;
  email: string;
  role: string;
  isActive: boolean;
  soldeConge: number;
  createdAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersResponse {
  data: UtilisateurDto[];
  pagination: Pagination;
}