import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AssetDTO } from '@pointsulator/api-interface';
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

  updateAsset(asset: AssetDTO) {
    return this.http.put(`${ASSETS_ENDPOINT}/${asset.id}`, asset);
  }

  addAsset(asset: AssetDTO): Observable<AssetDTO> {
    return this.http.post<AssetDTO>(ASSETS_ENDPOINT, asset);
  }

  getForOwner(ownerId: number) {
    return this.http.get<AssetDTO[]>(ASSETS_ENDPOINT, {
      params: new HttpParams().append('owner', ownerId.toString())
    });
  }
}
