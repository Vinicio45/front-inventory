import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css'
})
export class NewCategoryComponent implements OnInit {

  Titulo_Formulario: String = "Agregar Nueva Categoria";
  public categoryForm: FormGroup;
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });

    if(this.data != null){
      this.Titulo_Formulario="Actualizar Categoria"
      this.updateForm(this.data)
    }
  }

  onSave(){
    let data = {
        name: this.categoryForm.get('name')?.value,
        description: this.categoryForm.get('description')?.value
    }

    if (this.data != null){
      this.categoryService.updateCategorie(data,this.data.id)
      .subscribe(data =>{
        console.log(data);
        this.dialogRef.close(1)
      }, error =>{
        this.dialogRef.close(2 )
      });
    }else{
      this.categoryService.saveCategories(data)
      .subscribe(data =>{
        this.dialogRef.close(1)
      }, error =>{
        this.dialogRef.close(2 )
      });
    }
  }


  onCancel(){
    this.dialogRef.close(3);
  } 

  updateForm(data:any){
    this.categoryForm = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description, Validators.required],
    });
  }


}
