import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {CrudComponent} from './crud.component';
import {MatTableModule} from "@angular/material/table";

@NgModule({
  declarations: [CrudComponent],
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule.forChild([
      {
        path: '',
        component: CrudComponent,
      },
    ])
  ],
})
export class CrudModule {}
