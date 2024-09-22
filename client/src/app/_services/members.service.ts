import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { map, of } from 'rxjs';
import { AccountService } from './account.service';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult =signal<PaginatedResult<Member[]> | null>(null);
  memberCache=new Map();
  user=this.accountService.currentUser();
  userparams=signal<UserParams>(new UserParams(this.user));

  resetUserParams(){
    this.userparams.set(new UserParams(this.user));
  }

  getMembers() {
   const response=this.memberCache.get(Object.values(this.userparams()).join('-'));

   if(response) return setPaginatedResponse(response,this.paginatedResult);

   
    let params=setPaginationHeaders(this.userparams().pageNumber,this.userparams().pageSize);

    params=params.append('minAge',this.userparams().minAge);
    params=params.append('maxAge',this.userparams().maxAge);
    params=params.append('gender',this.userparams().gender);
    params=params.append('orderBy',this.userparams().orderBy);


    return this.http.get<Member[]>(this.baseUrl + 'users',{observe:'response',params}).subscribe({
      next: response=>{
        setPaginatedResponse(response,this.paginatedResult);
        this.memberCache.set(Object.values(this.userparams()).join('-'),response);
      }
    });
  }




  getMember(username: string) {
     const member:Member = [...this.memberCache.values()].reduce((arr,elem)=> arr.concat(elem.body),[])
     .find((m:Member)=>m.userName===username);

     if(member) return of(member);

    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member:Member)
  {
    return this.http.put(this.baseUrl+'users',member).pipe(
      // tap(()=> {
      //   this.members.update(members=> members.map(m=>m.userName === member.userName? member : m))
      // })
    )
  }
  setMainPhoto(photo: Photo){
    return this.http.put(this.baseUrl + 'users/set-main-photo/'+ photo.id,{}).pipe(
      // tap(()=>{
      //   this.members.update(members=>members.map(m=>{
      //     if(m.photos.includes(photo)){
      //       m.photoUrl=photo.url
      //     }
      //     return m;
      //   }))
      // })
    )
  }

  deletePhoto(photo :Photo){
    return this.http.delete(this.baseUrl+'users/delete-photo/'+photo.id).pipe(
    //   tap(()=>{
    //   this.members.update(members=>members.map(m=>{
    //     if(m.photos.includes(photo)){
    //       m.photos=m.photos.filter(x=>x.id !== photo.id)
    //     }
    //     return m;
    //   }))
    // })
    );
  }
}
