import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { BadgeComponent } from "../../ui/badge/badge.component";
import { ModalComponent } from "../../ui/modal/modal.component";
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Employees, EmployeeService } from "../../../services/employee/employee.service";
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2'



@Component({
  selector: "app-employees",
  imports: [BadgeComponent, ModalComponent, FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: "./employee.component.html",
})
export class EmployeesComponent implements OnInit {
  tableData: Employees[] = [];
  isOpen = false;
  errorMessage: string = "";
  employeeForm: FormGroup;
  isEditing: boolean = false;
  tipoEmpleado = [
    { id: 0, type: "Local" },
    { id: 1, type: "Externo" }
  ];
  constructor(private fb: FormBuilder, private employeeService: EmployeeService) {
    this.employeeForm = this.fb.group({});
  }
  ngOnInit() {
    this.initForm();
    this.getEmployees();
  }

  getEmployees(){
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.tableData = employees;
        console.log("Employees fetched successfully:", employees);
      },
      error: (error) => {
        console.error("Error fetching employees:", error);
        Swal.fire("Error", "Hubo un error al obtener los empleados.", "error");
        this.errorMessage = "An error occurred while fetching employees.";
      }
    });
  }


  initForm() {
    this.employeeForm = this.fb.group({
      id: [0],
      name: ["", [Validators.required, Validators.maxLength(50), this.noWhitespaceValidator()]],
      lastname: ["", [Validators.maxLength(50), this.noWhitespaceValidator()]],
      secondLastname: ["", [Validators.maxLength(50), this.noWhitespaceValidator()]],
      rfc: ["", [Validators.maxLength(13), Validators.required,Validators.pattern(/^[A-ZÑ&]{3,4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[A-Z0-9]{3}$/), this.noWhitespaceValidator()]],
      birthday: [""],
      employeeType: [0],
      salaryPerHour: [null, [Validators.min(1), Validators.pattern("^[0-9]+$")] ],
    });
  }

  closeModal() {
    this.isOpen = false;
    this.initForm();
    this.errorMessage = "";
    this.employeeForm.markAsPristine();
  }

  openModal() {
    this.isOpen = true;
  }
  getBadgeColor(status: string): "success" | "warning" | "error" | "manage" {
    if (status === "Delivered") return "success";
    if (status === "Pending") return "warning";
    if (status === "manage") return "manage";
    return "error";
  }

  createEmployee(employeeForm: FormGroup) {
    console.log("Creating employee with data:", employeeForm.value);
    if(employeeForm.value.salaryPerHour == null) {
      this.employeeForm.get('salaryPerHour')?.markAsDirty();
      this.employeeForm.get('salaryPerHour')?.markAsTouched();
    }
    this.employeeForm.markAllAsTouched();
    this.employeeForm.markAllAsDirty();
    
    if(employeeForm.valid) {
      employeeForm.value.birthday = employeeForm.value.birthday == "" ? "1995-01-01" : employeeForm.value.birthday;
      employeeForm.value["weekNumber"] = 0;
      const newEmployee: Employees = {...employeeForm.value };
      this.employeeService.createEmployee(newEmployee).subscribe({
        next: (employee) => {
          console.log("Employee created successfully:", employee);
          this.getEmployees();
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage = error.error?.message[0] || "An error occurred while creating the employee.";
          if(error.error?.message[0].status == 0) {
            Swal.fire("Error", this.errorMessage, "error");
            this.closeModal();
          }
        }
      });
    }

  }

  editEmployee(employee: Employees) {  
    this.isEditing = true;
    this.employeeForm.patchValue({
      id: employee.id,
      name: employee.name,
      lastname: employee.lastname,
      secondLastname: employee.secondLastname,
      rfc: employee.rfc,
      birthday: employee.birthday,
      employeeType: employee.employeeType,
      salaryPerHour: employee.salaryPerHour,
    });
    this.openModal();

  }

  updateEmployee(employeeForm: FormGroup) {
    if(employeeForm.invalid) {
      console.error("Form is invalid. Please check the input fields.");
      return;
    }
    const updatedEmployee: Employees = {...employeeForm.value };
    console.log("Updating employee with data:", updatedEmployee);
    this.employeeService.updateEmployee(updatedEmployee.id, updatedEmployee).subscribe({
      next: (employee) => {
        console.log("Employee updated successfully:", employee);
        this.getEmployees();
        this.closeModal();
        this.isEditing = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message[0] || "An error occurred while updating the employee.";
        console.error("Error:", error.error.message[0] || "An error occurred while updating the employee.");
      }
    });
    
  }

  deleteEmployee(employee: Employees) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Deseas eliminar al empleado ${employee.name} ${employee.lastname}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.deleteEmployee(employee.id).subscribe({
          next: () => {
            Swal.fire("Eliminado", "El empleado ha sido eliminado.", "success");
            this.getEmployees();
          },
          error: (error) => {
            Swal.fire("Error", "Hubo un error al eliminar el empleado.", "error");
            console.error("Error deleting employee:", error);
          }
        });
      }
    });
      
  }




  getErrorMessage(errorKey: string, errorValue: any, controlName: string): string {
     let controlNameModify = controlName
    if(controlName == 'hoursWorked'){
      controlNameModify = "horas trabajadas"
    }
    if(controlName == 'name'){
      controlNameModify = 'nombre';
    }
    
    const control = this.employeeForm.get(controlName);
    if(!control?.touched || !control?.dirty) return "";
    const messages: any = {
      required: `El campo ${controlNameModify} es obligatorio`,
      maxlength: `Máximo ${errorValue.requiredLength} caracteres`,
      minlength: `Mínimo ${errorValue.requiredLength} caracteres`,
      pattern: "Formato inválido",
      rfcExists: "El RFC ya está registrado",
      whitespace: "No se permiten espacios en blanco"
    };

    return messages[errorKey] || "Error inválido";
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === "") {
        return null;
      }
      if (typeof value === "string" && value.trim().length === 0) {
        return { whitespace: true };
      }
      return null;
    };
  }

  validateTrimUpper(input: string) {
    const rfcControl = this.employeeForm.get(input);
    if (rfcControl) {
      const value = rfcControl.value;
      if (typeof value === "string" && input === "rfc") {
        rfcControl.setValue(value.trim().toUpperCase(), { emitEvent: false });
      }
    }
  }
}
