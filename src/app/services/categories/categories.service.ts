import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookie.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`
    }),
  }

  constructor(private http: HttpClient, private cookie: CookieService) { }

  getAllCategories(): Observable<Array<GetCategoriesResponse>> {
    return this.http.get<Array<GetCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    )
  }

  createNewCategory(requestData: { name: string }): Observable<Array<GetCategoriesResponse>> {
    return this.http.post<Array<GetCategoriesResponse>>(
      `${this.API_URL}/category`, requestData, this.httpOptions
    );
  }

  deleteCategory(requestData: { category_id: string }): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/category/delete`, {
      ...this.httpOptions, params: {
        category_id: requestData.category_id
      }
    }
    )
  }

  editCategoryName(requestData: { name: string, category_id: string }): Observable<void> {
    return this.http.put<void>(
      `${this.API_URL}/category/edit`, { name: requestData.name },
      {
        ...this.httpOptions,
        params: {
          category_id: requestData?.category_id,
        }
      }
    )
  }
}
