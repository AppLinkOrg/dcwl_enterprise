// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { ContentApi } from "../../apis/content.api";
import { MemberApi } from "../../apis/member.api";
import { InstApi } from "../../apis/inst.api.js";

import { VehicleApi } from '../../apis/vehicle.api';



class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    var type=options.type;

    var vehicleApi = new VehicleApi();

    vehicleApi.annualsurvey({}, (res) => {
      if(type==1){
        var ret = res.inspect
      }else{
        var ret = res.insurance
      }
      this.Base.setMyData({ vehicle: ret, type: type });
    });
  }
  onMyShow() {
    var that = this;

    

  }

  
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changePlayinback = content.changePlayinback;
body.jump = content.jump;
Page(body)