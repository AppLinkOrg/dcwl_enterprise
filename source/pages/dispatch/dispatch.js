// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { QuoteferryApi } from "../../apis/quoteferry.api.js";
import { VehicleApi } from '../../apis/vehicle.api';
import { MemberApi } from '../../apis/member.api';
import { DriverApi } from '../../apis/driver.api';


class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    console.log(options)
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ currenttab: 0});

    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.info({ id: options.id }, (ret) => {
      console.log(ret)
      this.Base.setMyData({ data:ret });
    });

  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    
    instapi.info({}, (info) => {
      that.Base.setMyData(info);
    });
    
    var vehicleApi = new VehicleApi();
    vehicleApi.list({},(ret)=>{
      console.log(ret)
      that.Base.setMyData({vehicle:ret});
    });

    var driverApi = new DriverApi();
    driverApi.list({}, (ret) => {
      console.log(ret)
      that.Base.setMyData({ driver: ret });
    });
  
  }

  bindPickerDriver(e) {
    var that = this;
    console.log(e)
    that.Base.setMyData({ driver_index: e.detail.value });
    var driver_id = that.Base.getMyData().driver[e.detail.value].id
    console.log(driver_id)
    that.Base.setMyData({ driver_id: driver_id });
  }



  bindPickerVehicle(e){
    var that = this;
    console.log(e)
    that.Base.setMyData({ vehicle_index: e.detail.value});
    var vehicle_id = that.Base.getMyData().vehicle[e.detail.value].id
    console.log(vehicle_id)
    that.Base.setMyData({ vehicle_id: vehicle_id });
  }

  dispatch(e){
    var that = this;
   // console.log(that.Base.getMyData().driver_id, that.Base.getMyData().vehicle_id)
    wx.showModal({
      content: '请确认订单信息',
      success(res) {
        if (res.confirm) {
          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.dispatch({
            id: e.currentTarget.id,
            driver_id: that.Base.getMyData().driver_id,
            vehicle_id: that.Base.getMyData().vehicle_id
             }, (ret) => {
            //console.log(ret)
               wx.switchTab({
              url: '../home/home',
            })
          });
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
body.bindPickerVehicle = content.bindPickerVehicle;
body.bindPickerDriver = content.bindPickerDriver;
body.dispatch = content.dispatch;

Page(body)