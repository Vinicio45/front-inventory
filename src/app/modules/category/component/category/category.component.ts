import { Component, OnInit, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
 
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[]=['id','name','description','actions'];
  dataSource = new MatTableDataSource<CategoryElement>();


  getCategories():void{
    this.categoryService.getCategories()
      .subscribe((data:any) =>{
        console.log("respuesta categories: ",data);
        this.processCategoriesResponse(data);
      }, (error:any) => {
        console.log("error: ", error);
      })
  }

  processCategoriesResponse(resp:any){
    const dataCategory: CategoryElement[]=[]
    if(resp.metadata[0].code == "00"){
      let listCategory = resp.categoryResponse.category;

      listCategory.forEach((element:CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory)
    }
  }

  openCategoryDialog(){
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '500px' 
    });

    dialogRef.afterClosed().subscribe((result:any) => {

      if(result == 1){
        this.openSanckBar("Categoria agregada", "Exitosa")
        this.getCategories();
      } else if(result == 2){
        this.openSanckBar("Error: no se pudo guardad", "Error")
      }
      
    });
  }

  openSanckBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000 
    })
  }




}

export interface CategoryElement{
  description: string;
  id: number;
  name: string;
}
