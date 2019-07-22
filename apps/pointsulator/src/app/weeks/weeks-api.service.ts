import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WeekDetailsDTO, WeekDTO } from '@pointsulator/api-interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export const WEEKS_ENDPOINT = `${environment.apiUrl}/weeks`;

@Injectable({
  providedIn: 'root'
})
export class WeeksApiService {
  constructor(private readonly http: HttpClient) {}

  public getWeeks(): Observable<WeekDTO[]> {
    return this.http.get<WeekDTO[]>(WEEKS_ENDPOINT);
  }

  public getWeekById(id: number): Observable<WeekDetailsDTO> {
    return this.http.get<WeekDetailsDTO>(`${WEEKS_ENDPOINT}/${id}`);
  }

  public createWeek(date: Date): Observable<WeekDTO> {
    return this.http.post<WeekDTO>(WEEKS_ENDPOINT, { date: date.valueOf() });
  }

  public saveWeek(week: WeekDetailsDTO) {
    return this.http.put<void>(`${WEEKS_ENDPOINT}/${week.id}`, week);
  }
}
