import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  headerOptions: any = null

  _isLoggedIn: boolean = false

  authSub = new Subject<any>();

  constructor(private _http: HttpClient) {
  }

  loginAuth(userObj: any) {
    if (userObj.authcode) {
      console.log('Appending headers');
      this.headerOptions = new HttpHeaders({
        'x-tfa': userObj.authcode
      });
    }
    console.log(userObj.uip)
   return this._http.post("http://localhost:3000/login", { uname: userObj.uname, upass: userObj.upass, uip: userObj.uip, ubrowser: userObj.ubrowser }, { observe: 'response', headers: this.headerOptions });
  }

  setupAuth() {
    return this._http.post("http://localhost:3000/tfa/setup", {}, { observe: 'response' })
  }

  registerUser(userObj: any) {
    console.log("user object "+JSON.stringify(userObj))
    return this._http.post("http://localhost:3000/register", { uname: userObj.uname, upass: userObj.upass,uip:userObj.uip , ubrowser:userObj.ubrowser}, { observe: 'response' });
  }

  updateAuthStatus(value: boolean) {
    this._isLoggedIn = value
    this.authSub.next(this._isLoggedIn);
    localStorage.setItem('isLoggedIn', value ? "true" : "false");
  }

  getAuthStatus() {
    this._isLoggedIn = localStorage.getItem('isLoggedIn') == "true" ? true : false;
    return this._isLoggedIn
  }

  logoutUser() {
    this._isLoggedIn = false;
    this.authSub.next(this._isLoggedIn);
    localStorage.setItem('isLoggedIn', "false")
  }

  getAuth() {
    return this._http.get("http://109.11.21.53:3000/tfa/setup", { observe: 'response' });
  }
  getUser(user:String){
    return this._http.get(`http://109.11.21.53:3000/user/${user}`)
  }
  deleteAuth() {
    return this._http.delete("http://109.11.21.53:3000/tfa/setup", { observe: 'response' });
  }

  verifyAuth(token: any) {
    return this._http.post("http://109.11.21.53:3000/tfa/verify", { token }, { observe: 'response' });
  }
}
