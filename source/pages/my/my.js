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
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.info({}, (info) => {
      that.Base.setMyData(info);
    });
    // var mobile = AppBase.UserInfo.mobile;
    // var name = AppBase.UserInfo.name;
    // var memberinfo = AppBase.UserInfo.info;
    // if (memberinfo){
    //   this.Base.setMyData({ memberinfo: memberinfo });
    // }
    var memberApi = new MemberApi();
    // memberApi.info({ mobile: mobile, name: name }, (memberinfo) => {
    //   if (memberinfo != null) {
    //     this.Base.setMyData({ memberinfo: memberinfo });
    //   }
    // });

    var vehicleApi = new VehicleApi();

    vehicleApi.annualsurvey({},(res)=>{
      this.Base.setMyData({ vehicle: res });
    });
    
  }
  
  jump() {
    wx.navigateToMiniProgram({
      appId: 'wx75aeee915d1db2b5',
      path: 'pages/home/home',
      extraData: {
        foo: 'bar',
        name: AppBase.UserInfo.name,
        mobile: AppBase.UserInfo.mobile
      },
      envVersion: 'trial',
      success(res) {
        // 打开成功
      
      }
    })
  }

  logout(){
    wx.showModal({
      content: '是否退出系统',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          AppBase.UserInfo.mobile = '';
          AppBase.UserInfo.name = '';
          wx.reLaunch({
            url: '/pages/login/login'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changePlayinback = content.changePlayinback;
body.jump = content.jump;
Page(body)