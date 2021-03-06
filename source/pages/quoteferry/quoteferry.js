// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";
import { QuoteferryApi } from "../../apis/quoteferry.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    var now = new Date();
    var tomorrow = now.getTime() + 24 * 60 * 60 * 1000;
    var aftermonth = tomorrow + 30 * 24 * 60 * 60 * 1000;
    var startdate = this.Base.util.FormatDate(new Date(tomorrow));
    var enddate = this.Base.util.FormatDate(new Date(aftermonth));
    this.Base.setMyData({ mobile: "", realname: "", remark: "", startdate: startdate, enddate: enddate });

    console.log('tomorrow:' + enddate)
  }
  onMyShow() {
    var that = this;
      
    


    if (this.Base.options.id == undefined) {
      var mobile = this.Base.getMyData().mobile;
      if (mobile == "") {
        var memberapi = new MemberApi();
        memberapi.info({}, (memberinfo) => {
          console.log(memberinfo);
          this.Base.setMyData(memberinfo);
          this.Base.setMyData({ mobile: memberinfo.mobile });
        });
      }
    } else {
      var quoteferryapi = new QuoteferryApi();
      var id = this.Base.getMyData().id;
      if (id == undefined) {

        quoteferryapi.info({ id: this.Base.options.id }, (info) => {
          for (var i = 0; i < info.route.length; i++) {
            info.route[i].location = { lat: info.route[i].lat, lng: info.route[i].lng };
          }
          if (this.Base.options.action == "copy") {
            info.id = undefined;
          }
          this.Base.setMyData(info);
        });
      }
    }

    var memberApi = new MemberApi();
    memberApi.info({}, (info) => {
      console.log(info)
      that.Base.setMyData({ userrole_id: info.company});
     
    })

  }

  phonenoCallback(mobile, e) {
    this.Base.setMyData({ mobile: mobile });
  }

  dataReturnCallback(callbackid, data) {
    console.log(callbackid);
    var that = this;
    if (callbackid == "route") {
      that.Base.setMyData(data);
    }
    if (callbackid == "goods") {
      that.Base.setMyData(data);
    }
  }
  openRoute() {
    var route = this.Base.getMyData().route;
    if (route != undefined) {
      wx.navigateTo({
        url: '/pages/route/route?callbackid=route&route=' + JSON.stringify(route),
      })
    } else {

      wx.navigateTo({
        url: '/pages/route/route?callbackid=route',
      })
    }
  }
  openGoods() {
    var goods = this.Base.getMyData().goods;
    if (goods != undefined) {
      wx.navigateTo({
        url: '/pages/goodsselect/goodsselect?callbackid=route&goods=' + JSON.stringify(goods),
      })
    } else {

      wx.navigateTo({
        url: '/pages/goodsselect/goodsselect?callbackid=goods',
      })
    }
  }

  changeDate(e) {
    console.log(e);
    this.Base.setMyData({ date: e.detail.value });
  }

  confirmQuote(e) {
    //console.log(e);
    //return;
    var data = this.Base.getMyData();
    console.log(data);
    if (data.mobile == null || data.mobile.length != 11 || data.mobile[0] != "1") {
      this.Base.info("请正确输入手机号码");
      return;
    }
    if (data.route == undefined) {
      this.Base.info("请选择路线");
      return;
    }
    if (data.date == undefined) {
      this.Base.info("请选取货时间");
      return;
    }
    if (data.goods == undefined) {
      this.Base.info("请选择货物");
      return;
    }
    if (data.realname.length == 0) {
      this.Base.info("请输入真实姓名");
      return;
    }
    var api = new QuoteferryApi();
    var req = {
      route: JSON.stringify(data.route),
      distance: data.distance,
      duration: data.duration,
      user_pickupgoods_time: data.date,
      goods: JSON.stringify(data.goods),
      weight: data.weight,
      remark: data.remark,
      mobile: data.mobile,
      realname: data.realname,
      formid: e.detail.formId
    };
    if (this.Base.getMyData().userrole_id==2){
      req.status =3;
      req.quoteamount = this.Base.getMyData().quoteamount
    }
    if (this.Base.options.id != undefined
      && this.Base.options.action != "copy") {
      req.primary_id = this.Base.options.id;
    }
    console.log(req);
    api.create(req,
      (ret) => {
        console.log(ret);
        wx.redirectTo({
          url: '/pages/success/success?backpage=home&backmode=switch&title=询价提交成功',
        })
      });
  }
  remarkChange(e) {
    this.Base.setMyData({ remark: e.detail.value });
  }
  realnameChange(e) {
    this.Base.setMyData({ realname: e.detail.value });
  }
  quoteamountChange(e) {
    this.Base.setMyData({ quoteamount: e.detail.value });
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.phonenoCallback = content.phonenoCallback;
body.dataReturnCallback = content.dataReturnCallback;
body.openRoute = content.openRoute;
body.openGoods = content.openGoods;
body.confirmQuote = content.confirmQuote;
body.remarkChange = content.remarkChange;
body.realnameChange = content.realnameChange;
body.changeDate = content.changeDate;
body.quoteamountChange = content.quoteamountChange;
Page(body)