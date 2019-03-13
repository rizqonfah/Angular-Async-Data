import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from '../product';
import { ProductService } from '../product.service';
import { Supplier } from 'src/app/suppliers/supplier';
import { mergeMap, tap, map } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  templateUrl: './product-suppliers.component.html'
})
export class ProductSuppliersComponent implements OnInit {
  pageTitle = 'Product Suppliers';
  product: Product;
  suppliers: Supplier[];
  errorMessage: string;

  constructor(private route: ActivatedRoute,
    private productService: ProductService) { }

  ngOnInit(): void {
    // Read the parameter from the route
    const id = +this.route.snapshot.paramMap.get('id');

    // AntiPattern: Nested subscriptions
    // this.productService.getProduct(id).subscribe(
    //   product => {
    //     this.product = product;
    //     this.displayProduct(product);
    //     this.productService.getSuppliersForProduct(id).subscribe(
    //       suppliers => this.suppliers = suppliers,
    //       error => this.errorMessage = error
    //     )
    //   },
    //   error => this.errorMessage = error
    // );

    // Displays each type of data without waiting
    // this.productService.getProduct(id).pipe(
    //   tap(product => this.product = product),
    //   mergeMap(product => this.productService.getSuppliersForProduct(id))
    // ).subscribe(
    //   suppliers => this.suppliers = suppliers,
    //   error => this.errorMessage = error
    // );

    // Waits for all of the data before displaying any
    const product$ = this.productService.getProduct(id);
    const suppliers$ = this.productService.getSuppliersForProduct(id);
    forkJoin([product$, suppliers$])
      .subscribe(([product, suppliers]) => {
        this.product = product;
        this.suppliers = suppliers;
      });

  }

  displayProduct(product: Product): void {
    // Display the appropriate heading
    if (product) {
      this.pageTitle = `Product Suppliers for: ${product.productName}`;
    } else {
      this.pageTitle = 'No product found';
    }
  }
}
