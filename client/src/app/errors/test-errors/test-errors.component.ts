import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent {
  basUrl = environment.apiUrl;
  private http = inject(HttpClient);
  validationErros:string[]=[];

  get400Error() {
    this.http.get(this.basUrl + 'buggy/bad-request').subscribe({
      next: responce => console.log(responce),
      error: error => console.log(error)
    })
  }
  get401Error() {
    this.http.get(this.basUrl + 'buggy/auth').subscribe({
      next: responce => console.log(responce),
      error: error => console.log(error)
    })
  }
  get404Error() {
    this.http.get(this.basUrl + 'buggy/not-found').subscribe({
      next: responce => console.log(responce),
      error: error => console.log(error)
    })
  }
  get500Error() {
    this.http.get(this.basUrl + 'buggy/server-error').subscribe({
      next: responce => console.log(responce),
      error: error => console.log(error)
    })
  }
  get400ValidationError(){
    this.http.post(this.basUrl+'account/register',{}).subscribe({
      next:responce =>console.log(responce),
      error:error=> {console.log(error)
        this.validationErros=error;
      }
    })
  }
}
