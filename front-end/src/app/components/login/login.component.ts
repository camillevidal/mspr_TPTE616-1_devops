import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { LoginServiceService } from 'src/app/services/login-service/login-service.service';
import { IpServiceService } from '../../ip-service.service';
import { sha256 } from 'js-sha256';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  tfaFlag: boolean = false
  userObject = {
    uname: "",
    upass: "",
    uip:"",
    ubrowser:""
  }
  errorMessage: string = null
  title = 'DemoApp';
  ipAddress: string;
  deviceInfo: any;
  constructor(private deviceService: DeviceDetectorService,private ip: IpServiceService, private _loginService: LoginServiceService, private _router: Router) {
  }


  ngOnInit() {
   this.getIP();
   this.deviceInfo = this.deviceService.getDeviceInfo();
   this.userObject.ubrowser = this.deviceInfo.browser
  }
  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      console.log(res)
      console.log(this.ipAddress)
    });
  }

  login() {
    console.log("user browser "+this.userObject.ubrowser)
    console.log("uname "+this.userObject.uname)
    this.userObject.uip = this.ipAddress
    console.log("user ip "+this.userObject.uip)
    this._loginService.loginAuth(this.userObject).subscribe((data) => {
      let status = data.body['status']
      
      this.errorMessage = null;
      if (status === 200) {
        console.log("login successful")
        this._loginService.updateAuthStatus(true);
        this._router.navigateByUrl('/home');
      }
      if (status === 206) {
        this.tfaFlag = true;
      }
      if (status === 403) {
        console.log("user or pass invalid")
        this.errorMessage = data.body['message'];
      }
      if (status === 404) {
        this.errorMessage = data.body['message'];
      }
    })
  }

}
