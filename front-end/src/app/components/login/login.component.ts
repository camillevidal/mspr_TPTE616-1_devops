import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'
import {LoginServiceService} from 'src/app/services/login-service/login-service.service';
import {IpServiceService} from '../../ip-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  tfaFlag: boolean = false
  userObject = {
    uname: "",
    upass: ""
  }
  errorMessage: string = null
  title = 'DemoApp';
  ipAddress: string;
  captcha = null;

  constructor(private ip: IpServiceService, private _loginService: LoginServiceService, private _router: Router) {
  }


  ngOnInit() {
    this.getIP();
    this.cookie();

  }
  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      console.log(res)
      console.log(this.ipAddress)
      console.log("dede" + this.captcha)
    });
  }

  loginUser() {
    this._loginService.loginAuth(this.userObject).subscribe((data) => {
      this.errorMessage = null;
      if (data.body['status'] === 200) {
        this._loginService.updateAuthStatus(true);
        this._router.navigateByUrl('/home');
      }
      if (data.body['status'] === 206) {
        this.tfaFlag = true;
      }
      if (data.body['status'] === 403) {
        this.errorMessage = data.body['message'];
      }
      if (data.body['status'] === 404) {
        this.errorMessage = data.body['message'];
      }
    })
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with responses: ${captchaResponse}`);
    this.captcha = captchaResponse;
    console.log(this.captcha)
  }

  cookie(){
    console.log("ssssssssssssssssssssssssssss")
      const cookieDisclaimer = document.querySelector('.js-cookie-disclaimer');

      if (!localStorage.getItem('cookieDisclaimer')) {
        cookieDisclaimer.classList.add('is-active');
      }

      cookieDisclaimer.querySelector('button').addEventListener('click', () => {
        localStorage.setItem('cookieDisclaimer', "true");
        cookieDisclaimer.classList.remove('is-active');
      });
  }


}
