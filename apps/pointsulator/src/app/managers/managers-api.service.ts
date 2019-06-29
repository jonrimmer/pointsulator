import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManagerDTO } from '@pointsulator/api-interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

const MANAGERS_ENDPOINT = `${environment.apiUrl}/managers`;

@Injectable({
  providedIn: 'root'
})
export class ManagersApiService {
  constructor(private readonly http: HttpClient) {}

  public loadAll(): Observable<ManagerDTO[]> {
    return this.http.get<ManagerDTO[]>(MANAGERS_ENDPOINT);
  }

  getById(id: number) {
    return this.http.get<ManagerDTO>(`${MANAGERS_ENDPOINT}/${id}`);
  }

  updateManager(manager: ManagerDTO) {
    return this.http.put(`${MANAGERS_ENDPOINT}/${manager.id}`, manager);
  }

  addManager(manager: ManagerDTO): Observable<ManagerDTO> {
    return this.http.post<ManagerDTO>(MANAGERS_ENDPOINT, manager);
  }
}
