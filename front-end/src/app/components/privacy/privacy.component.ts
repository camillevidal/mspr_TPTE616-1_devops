import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'


@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {

  tfaFlag: boolean = false
  deviceInfo = null;
  userObject = {
    uname: "",
    upass: "",
    uip: "",
    ubrowser: ""
  }
  errorMessage: string = null
  title = 'Privacy';
  ipAddress: string;
  captcha = null;

  constructor(private _router: Router) {
  }


  ngOnInit() {

  }


}
