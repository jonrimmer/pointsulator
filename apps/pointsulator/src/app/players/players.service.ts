import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PlayerDTO } from '../../../../../libs/api-interface/src';
import { Observable } from 'rxjs';

const PLAYERS_ENDPOINT = `${environment.apiUrl}/players`;

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<PlayerDTO[]> {
    return this.http.get<PlayerDTO[]>(PLAYERS_ENDPOINT);
  }

  getById(id: number) {
    return this.http.get<PlayerDTO>(`${PLAYERS_ENDPOINT}/${id}`);
  }
}
