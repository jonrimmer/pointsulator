import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeekDetailsDTO } from '@pointsulator/api-interface';
import { Observable } from 'rxjs';

export const WEEKS_ENDPOINT = `/weeks`;

@Injectable({
  providedIn: 'root'
})
export class WeeksApiService {
  constructor(private readonly http: HttpClient) {}

  public getWeeks(): Observable<WeekDetailsDTO[]> {
    return this.http.get<WeekDetailsDTO[]>(WEEKS_ENDPOINT);
  }

  public getWeekById(id: number): Observable<WeekDetailsDTO> {
    return this.http.get<WeekDetailsDTO>(`${WEEKS_ENDPOINT}/${id}`);
  }
}
