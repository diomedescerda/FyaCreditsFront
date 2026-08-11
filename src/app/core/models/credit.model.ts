export interface RegisterCreditRequest {
  clientName: string;
  clientId: string;
  amount: number;
  interestRate: number;
  termMonths: number;
}

export interface Credit {
  id: string;
  clientName: string;
  clientId: string;
  amount: number;
  interestRate: number;
  termMonths: number;
  commercialName: string;
  registeredAtUtc: string;
}

export interface CreditQuery {
  clientName?: string;
  clientId?: string;
  commercialName?: string;
  sortBy: 'date' | 'amount';
  sortDirection: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}
