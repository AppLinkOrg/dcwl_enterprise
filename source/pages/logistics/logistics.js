// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { QuoteferryApi } from "../../apis/quoteferry.api.js";
import { MemberApi } from '../../apis/member.api';
class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      ctt: 1
    })

  }

  onMyShow() {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    var that = this;
    var memberApi = new MemberApi();
    memberApi.info({}, (info) => {
      console.log(info)
      that.Base.setMyData(info);
      if (info.userrole_id == 2) {
        var quoteferryapi = new QuoteferryApi();
        quoteferryapi.listcompany({ status: 4 }, (ret) => {
          this.Base.setMyData({ list_4: ret });
        });
        quoteferryapi.listcompany({ status: 6 }, (ret) => {
          this.Base.setMyData({ list_6: ret });
        });
        quoteferryapi.listcompany({ status: 7 }, (ret) => {
          this.Base.setMyData({ list_7: ret });
        });

      }else{
        wx.switchTab({
          url: '../home/home',
        })
      }
    });

    
  }

  bindcompleted(e) {
    this.Base.setMyData({
      ctt: 3
    })
    this.onMyShow();
  }
  bindwaitcompleted(e) {
    this.Base.setMyData({
      ctt: 2
    })
    this.onMyShow();
  }
  bindcontact(e) {
    this.Base.setMyData({
      ctt: 1
    })
    this.onMyShow();
  }

 

  logistics(e){
    wx.navigateTo({
      url: '../receiptDetails/receiptDetails?id=' + e.currentTarget.id,
    })
  }

  order(e) {
    wx.navigateTo({
      url: '../logisticsDetails/logisticsDetails?id=' + e.currentTarget.id,
    })
  }
}




var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.bindcompleted = content.bindcompleted;
body.bindwaitcompleted = content.bindwaitcompleted;
body.bindcontact = content.bindcontact;

body.logistics = content.logistics;
body.order = content.order;
Page(body)