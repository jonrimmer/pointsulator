import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { TeamSheetDTO, TeamSheetConfigDTO } from '@pointsulator/api-interface';
import { Observable } from 'rxjs';

const TEAM_SHEETS_ENDPOINT = `${environment.apiUrl}/team-sheets`;

@Injectable({
  providedIn: 'root'
})
export class TeamSheetApiService {
  constructor(private readonly http: HttpClient) {}

  getForManager(mangerId: number): Observable<TeamSheetDTO[]> {
    return this.http.get<TeamSheetDTO[]>(TEAM_SHEETS_ENDPOINT, {
      params: new HttpParams().append('manager', mangerId.toString())
    });
  }

  getById(id: number): Observable<TeamSheetDTO> {
    return this.http.get<TeamSheetDTO>(`${TEAM_SHEETS_ENDPOINT}/${id}`);
  }

  create(teamSheet: TeamSheetConfigDTO): Observable<TeamSheetDTO> {
    return this.http.post<TeamSheetDTO>(TEAM_SHEETS_ENDPOINT, teamSheet);
  }
}
