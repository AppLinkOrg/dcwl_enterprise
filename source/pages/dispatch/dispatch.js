// pages/content/content.js
import {
  AppBase
} from "../../appbase";
import {
  ApiConfig
} from "../../apis/apiconfig";
import {
  InstApi
} from "../../apis/inst.api.js";
import {
  QuoteferryApi
} from "../../apis/quoteferry.api.js";
import {
  VehicleApi
} from '../../apis/vehicle.api';
import {
  MemberApi
} from '../../apis/member.api';
import {
  DriverApi
} from '../../apis/driver.api';
import {
  DispatchApi
} from '../../apis/dispatch.api';



class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    console.log(options)
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    var list = [{
        driver: {
          id: 0
        },
        vehicle: {
          id: 0
        }
      },

    ]

    this.Base.setMyData({
      currenttab: 0,
      list,
    });

    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.info({
      id: options.id
    }, (ret) => {
      console.log(ret)
      this.Base.setMyData({
        data: ret
      });
    });

  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();

    instapi.info({}, (info) => {
      that.Base.setMyData(info);
    });

    var vehicleApi = new VehicleApi();
    vehicleApi.list({}, (ret) => {
      console.log(ret)
      that.Base.setMyData({
        vehicle: ret
      });
    });

    var driverApi = new DriverApi();
    driverApi.list({}, (ret) => {
      console.log(ret)
      that.Base.setMyData({
        driver: ret
      });
    });

  }

  bindPickerDriver(e) {
    var that = this;
    console.log(e);

    var list = this.Base.getMyData().list;
    var driverlist = this.Base.getMyData().driver;

    var select_index = e.currentTarget.id;
    console.log(select_index);

    var driver_index = e.detail.value;
    var driver = driverlist[driver_index];
    list[select_index].driver = driver;

    this.Base.setMyData({
      list
    });

  }




  bindPickerVehicle(e) {
    var that = this;
    console.log(e)
    var list = this.Base.getMyData().list;
    var vehiclelist = this.Base.getMyData().vehicle;

    var select_index = e.currentTarget.id;
    console.log(select_index);

    var vehicle_index = e.detail.value;
    var vehicle = vehiclelist[vehicle_index];
    list[select_index].vehicle = vehicle;

    this.Base.setMyData({
      list
    });

  }

  add() {
    var that = this;
    var list = that.Base.getMyData().list;

    list.push({
      driver: {
        id: 0
      },
      vehicle: {
        id: 0
      }
    });
    console.log(list)
    this.Base.setMyData({
      list
    });

  }

  delete(e) {
    var that = this;
    var id = e.currentTarget.id;
    var list = that.Base.getMyData().list;
    list.splice(id, 1);
    this.Base.setMyData({
      list
    });
  }

  dispatch(e) {
    var that = this;
    // console.log(that.Base.getMyData().driver_id, that.Base.getMyData().vehicle_id)
    var driverlist = [];
    var vehiclelist = [];
    var list = that.Base.getMyData().list;
    console.log(list)
    var id = e.currentTarget.id
    this.gotoDispatchOneByOne(list,id);

    // if (that.Base.getMyData().driver_id == undefined) {
    //   this.Base.info("请选择司机");
    //   return;
    // }


    wx.showModal({
      content: '请确认订单信息',
      success(res) {
        if (res.confirm) {
          var that=this;
          var id = e.currentTarget.id
          // that.gotoDispatchOneByOne(list, id);

          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.dispatch({
            id: e.currentTarget.id,
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


  gotoDispatchOneByOne(list, id) {
    var dispatchApi = new DispatchApi();
    if (list.length == 0) {
      return;
    }
    var i = 0;
    if (list[i]['driver'] == undefined || list[i]['vehicle'] == undefined) {
      list.splice(i, 1);
      this.gotoDispatchOneByOne(list,id);
      return;
    }

    var data = {
      quoteferry_id: id,
      driver_id: list[i].driver.id,
      vehicle_id: list[i].vehicle.id
    }

    dispatchApi.dispatch1(data, (res) => {
      console.log(res)
      list.splice(i, 1);
      this.gotoDispatchOneByOne(list,id);
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
body.add = content.add;
body.delete = content.delete;
body.gotoDispatchOneByOne = content.gotoDispatchOneByOne;
Page(body)