import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseApi, ResponseSimple } from '../interfaces/response-api';
import { Category } from '../interfaces/category';
import { LastPrice, Product } from '../interfaces/product';
import { MerchandiseEntry, MerchandiseTransfer, Warehouse } from '../interfaces/warehouse';
import { Invoice } from '../interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  myAppUrl: string;
  myApiUrl: string;
  constructor(private httpClient: HttpClient) {
    this.myAppUrl= environment.apiURL;
    this.myApiUrl ='/api/v1';
  }
  // productos
  getProducts(page: number): Observable<ResponseApi>{
    return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/products?page=${page}`);
  }
  getAllProducts(): Observable<ResponseSimple>{
    return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/allproducts`);
  }
  getProductsByName(name:string, warehouse_id: number): Observable<ResponseSimple>{
    return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/product/findByName?name=${name}&warehouse_id=${warehouse_id}`);
  }
  getProductsByBarCode(bar_code:string, warehouse_id: number): Observable<ResponseSimple>{
    return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/product/findByBarCode?bar_code=${bar_code}&warehouse_id=${warehouse_id}`);
  }

  getProduct(productId:number): Observable<ResponseSimple>{
    return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/products/${productId}`);
  }
  saveProduct(product: Product):Observable<ResponseSimple>{
    product.active = product.active?1:0;
    return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}/products`, product);
  }
  updateProduct(product: Product): Observable<any>{
    product.active = product.active?1:0;
    return this.httpClient.put<any>( `${this.myAppUrl}${this.myApiUrl}/products/${product.id}`, product);
  }
  deleteProduct(product: Product): Observable<ResponseSimple>{
    return this.httpClient.delete<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/products/${product.id}`);
  }
  //ProductPrice

  getProductPrice(page: number): Observable<ResponseApi>{
    return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/productprices?page=${page}`);
  }
  saveProductPrice(lastPrice: LastPrice):Observable<ResponseSimple>{

    return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}/productprices`, lastPrice);
  }
  deleteProductPrice(lastPrice: LastPrice): Observable<ResponseSimple>{
    return this.httpClient.delete<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/productprices/${lastPrice.id}`);
  }

  //Categories
  getCategories(page: number): Observable<ResponseApi>{
    return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/categories?page=${page}`);
  }
  getAllCategory(): Observable<ResponseSimple>{
    return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/allcategories`);
  }
  getCategory(categoryId: number): Observable<ResponseSimple>{
    return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/categories/${categoryId}`);
  }

  saveCategory(category:Category): Observable<any>{
    category.active = category.active?1:0;
    return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}/categories`, category);
  }
  updateCategory(category:Category): Observable<any>{
    category.active = category.active?1:0;
    return this.httpClient.put<any>( `${this.myAppUrl}${this.myApiUrl}/categories/${category.id}`, category);
  }
  deleteCategory(category:Category): Observable<ResponseSimple>{
    return this.httpClient.delete<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/categories/${category.id}`);
  }
   //Warehouse

  getWarehouses(page: number): Observable<ResponseApi>{
    return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/warehouses?page=${page}`);
  }
  getWarehouse(id: number): Observable<ResponseSimple>{
    return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/warehouses/${id}`);
  }
  getAllWarehouse(): Observable<ResponseSimple>{
    return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/allwarehouses`);
  }

  saveWarehouse(warehouse: Warehouse):Observable<ResponseSimple>{
    warehouse.active = warehouse.active?1:0;
    return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}/warehouses`, warehouse);
  }
  updateWarehouse(warehouse: Warehouse): Observable<ResponseSimple>{
    warehouse.active = warehouse.active?1:0;
    return this.httpClient.put<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/warehouses/${warehouse.id}`, warehouse);
  }
  deleteWarehouse(warehouse: Warehouse): Observable<ResponseSimple>{
    return this.httpClient.delete<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/warehouses/${warehouse.id}`);
  }

    //Merchandise Entry

    getMerchandiseEntries(page: number): Observable<ResponseApi>{
      return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/merchandise-entry?page=${page}`);
    }
    getMerchandiseEntry(id: number): Observable<ResponseSimple>{
      return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/merchandise-entry/${id}`);
    }
    saveMerchandiseEntry(mechandise: MerchandiseEntry):Observable<ResponseSimple>{
      mechandise.active = mechandise.active?1:0;
      return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}/merchandise-entry`, mechandise);
    }

    // Invoices
    saveInvoice(invoice: Invoice):Observable<ResponseSimple>{
      return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}/invoice`, invoice);
    }
    getInvoices(page: number){
      return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/invoice?page=${page}`);
    }
    getInvoice(id: number): Observable<ResponseSimple>{
      return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/invoice/${id}`);
    }

    cancelInvoice(id: number): Observable<ResponseSimple>{
      return this.httpClient.delete<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/invoice/${id}`);
    }

    getTotalSalesToday(){
      return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/totalsalestoday`);
    }

  //inventories
    getInventory(page: number, warehouseId: number): Observable<ResponseApi>{
      return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/inventories?page=${page}&warehouseId=${warehouseId}`);
    }


    // Merchandise Transfer

    getMerchandiseTransfers(page: number): Observable<ResponseApi>{
      return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/merchandise-transfer?page=${page}`);
    }
    getMerchandiseTransfer(id: number): Observable<ResponseSimple>{
      return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/merchandise-transfer/${id}`);
    }
    saveMerchandiseTransfer(mechandise: MerchandiseTransfer):Observable<ResponseSimple>{
      mechandise.active = mechandise.active?1:0;
      return this.httpClient.post<any>( `${this.myAppUrl}${this.myApiUrl}/merchandise-transfer`, mechandise);
    }


    //Users
    getUsers(page: number):Observable<ResponseApi>{
      return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/user?page=${page}`);
    }
    getAllUsers():Observable<ResponseApi>{
      return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/user`);
    }
    getUser(id: number):Observable<ResponseSimple>{
      return this.httpClient.get<ResponseSimple>( `${this.myAppUrl}${this.myApiUrl}/user/${id}`);
    }

    assignPermission(userId: number, permissions: any):Observable<any>{

      let permitionList: any[] = [];

      for (const [key, value] of Object.entries(permissions)) {
        permitionList.push({ key, value})
      }

      return this.httpClient.put<any>( `${this.myAppUrl}${this.myApiUrl}/user/assign/permissions/${userId}`, { roles: permitionList});
    }

    userConfig(userId: number, configurations: any):Observable<any>{

      return this.httpClient.put<any>( `${this.myAppUrl}${this.myApiUrl}/user/configuration/${userId}`,  configurations );
    }


    //Permissions

    getRoles():Observable<ResponseApi>{
      return this.httpClient.get<ResponseApi>( `${this.myAppUrl}${this.myApiUrl}/permission/roles`);

    }

    //Customer
    getAllMyCustomer():Observable<any>{

      return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}/customer/mycustomers` );
    }

    //PaymentMethod
    getPaymentMethod():Observable<any>{
      return this.httpClient.get<any>( `${this.myAppUrl}${this.myApiUrl}/paymentMethods` );
    }


}
