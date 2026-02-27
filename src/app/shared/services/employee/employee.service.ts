import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  lastname: string;
  secondLastname: string;
  rfc: string;
  birthday: string;
  employeeType: number;
  salaryPerHour: number;
  workHours: {
    id: number;
    employeeId: number;
    weekStartDate: string;
    hoursWorked: number;
    salary?: number; // Agregado para mostrar el salario calculado
    weekNumber: number;
  }[];

  
}
export interface Employees extends Employee {

  }[];
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly baseUrl = 'https://localhost:7280/api/Employee';

  constructor(private http: HttpClient) {}

  // ✅ Obtener empleados
  getEmployees(): Observable<Employees[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }
  getEmployee(param: string): Observable<Employee> {
    return this.http.get<Employee>(this.baseUrl +"/"+ param);
  }

  // ✅ Crear empleado
  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  // ✅ Obtener empleado por id (muy útil después)
  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  // ✅ Actualizar empleado
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
  }

  // ✅ Eliminar empleado
  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}