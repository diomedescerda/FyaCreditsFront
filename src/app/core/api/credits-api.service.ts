import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../config/environment';
import {
  Credit,
  CreditQuery,
  PagedResult,
  RegisterCreditRequest,
} from '../models/credit.model';

@Injectable({ providedIn: 'root' })
export class CreditsApiService {
  private readonly creditsUrl = `${environment.apiBaseUrl}/credits`;

  constructor(private readonly http: HttpClient) {}

  register(request: RegisterCreditRequest) {
    return this.http.post<Credit>(this.creditsUrl, request);
  }

  search(query: CreditQuery) {
    let params = new HttpParams()
      .set('sortBy', query.sortBy)
      .set('sortDirection', query.sortDirection)
      .set('page', query.page)
      .set('pageSize', query.pageSize);

    if (query.search) params = params.set('search', query.search);

    return this.http.get<PagedResult<Credit>>(this.creditsUrl, { params });
  }
}
