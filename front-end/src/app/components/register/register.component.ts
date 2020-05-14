import { Component, OnInit, ɵConsole } from '@angular/core';
import { LoginServiceService } from 'src/app/services/login-service/login-service.service';
import { Router } from '@angular/router';
import { IpServiceService } from '../../ip-service.service';
import { DeviceDetectorService } from 'ngx-device-detector';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  errorMessage: string = null
  ipAddress: string;
  deviceInfo = null;
  userObject = {
    uname: "",
    upass: "",
    uip: "",
    ubrowser: ""
  }

  confirmPass: string = ""

  constructor(private deviceService: DeviceDetectorService,private ip: IpServiceService,private _loginService: LoginServiceService, private _router: Router) { }

  ngOnInit() {
    this.getIP()
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.userObject.ubrowser = this.deviceInfo.browser
 
  }
  //récupère l'adresse ip de l'utilisateur
  getIP() {
    this.ip.getIPAddress().subscribe((res: any) => {
      this.ipAddress = res.ip;
      console.log(res)
      console.log(this.ipAddress)
    });
  }


  registerUser() {
    this.userObject.uip = this.ipAddress
    if (this.userObject.uname.trim() !== "" && this.userObject.upass.trim() !== "" && (this.userObject.upass.trim() === this.confirmPass))
      this._loginService.registerUser(this.userObject).subscribe((data) => {
        const result = data.body
        console.log(result['status'] )
        if (result['status'] === 200) {
          this.errorMessage = result['message'];
        
          setTimeout(() => {
            this._router.navigate(['/login']);
          }, 2000);
        }
      });
  }
}
