import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SalaryComponent } from './shared/components/ecommerce/salary/salary.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    children:[
      {
        path: '',
        component: EcommerceComponent,
        pathMatch: 'full',
        title:
          'Empleados',
      },
      {path: 'salary', redirectTo: ''},
      {
        path: 'salary/:id',
        component: SalaryComponent,
        pathMatch: 'full',
        title:
          'Salario',
      },
      
    ]
  },
  // auth pages
 
];
