import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoryData: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string, code: string }> = [];
  public productAction!: {
    event: EventAction;
    productData: Array<GetAllProductsResponse>;
  }
  public productSelectedData!: GetAllProductsResponse;
  public productData: Array<GetAllProductsResponse> = [];

  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required]
  });

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required]
  });
  public sellProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required]
  });
  public sellSelectedProduct!: GetAllProductsResponse;
  public renderDropdown = false;

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public sellProductAction = ProductEvent.SELL_PRODUCT;

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private productsService: ProductsService,
    private productsDataTransferService: ProductsDataTransferService,
    private ref: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    this.productAction = this.ref.data;

    this.productAction?.event?.action === this.sellProductAction && this.getProductData();

    this.getAllCategories();
    this.renderDropdown = true;
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount)
      }

      this.productsService.createProduct(requestCreateProduct).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto criado com sucesso!',
              life: 2500
            })
          }
        }, error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar produto',
            life: 2500
          })
        }
      })
    }

    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    if (this.editProductForm.value && this.editProductForm.valid && this.productAction.event.id) {
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction.event.id,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string,
      };

      this.productsService.editProduct(requestEditProduct).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Produto atualizado com sucesso!',
            life: 2500,
          })
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao atualizar produto!',
            life: 2500,
          });
        },
        complete: () => {
          this.editProductForm.reset();
        }
      })
    }
  }

  getProductSelectedData(productId: string): void {
    const allProducts = this.productAction?.productData;
    if (allProducts.length > 0) {
      const filteredProduct = allProducts.filter((element) => element?.id === productId);

      if (filteredProduct) {
        this.productSelectedData = filteredProduct[0];

        this.editProductForm.setValue({
          name: this.productSelectedData?.name,
          price: this.productSelectedData?.price,
          amount: this.productSelectedData?.amount,
          description: this.productSelectedData?.description,
          category_id: this.productSelectedData.category.id,
        })
      }
    }
  }

  getProductData(): void {
    this.productsService.getAllProducts().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.productData = response;
          this.productData && this.productsDataTransferService.setProductsData(this.productData);
        }
      }
    })
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.categoryData = response;

          if (this.productAction?.event?.action === this.editProductAction && this.productAction?.productData) {
            this.getProductSelectedData(this.productAction?.event?.id as string);
          }
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
