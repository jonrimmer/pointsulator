import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AssetDTO } from '../../../../../libs/api-interface/src';
import { Observable } from 'rxjs';

const ASSETS_ENDPOINT = `${environment.apiUrl}/assets`;

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<AssetDTO[]> {
    return this.http.get<AssetDTO[]>(ASSETS_ENDPOINT);
  }

  getById(id: number) {
    return this.http.get<AssetDTO>(`${ASSETS_ENDPOINT}/${id}`);
  }
}
