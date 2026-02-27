import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WorkHour {
    weekStartDate: string;
    hoursWorked: number;
    weekNumber: number;
  
}

@Injectable({
  providedIn: 'root'
})
export class WorkHoursService {

  private readonly baseUrl = 'https://localhost:7280/api/employees';

  constructor(private http: HttpClient) {}
 

  createWorkHour(employeeId: number, workHour: WorkHour): Observable<WorkHour> {
        return this.http.post<WorkHour>(`${this.baseUrl}/${employeeId}/workhours`, workHour);
    
  }
}