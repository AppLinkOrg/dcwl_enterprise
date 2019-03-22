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
      if (info.company == 2) {
        var quoteferryapi = new QuoteferryApi();
        quoteferryapi.listcompany({ status: '4,5' }, (ret) => {
          this.Base.setMyData({ list_4: ret });
        });
        quoteferryapi.listcompany({ status: 6 }, (ret) => {
          this.Base.setMyData({ list_6: ret });
        });
        quoteferryapi.listcompany({ status: 7 }, (ret) => {
          this.Base.setMyData({ list_7: ret });
        });

      }else{
        var memberApi = new MemberApi();

        var instapi = new InstApi();
        instapi.info({}, (inst) => {
          memberApi.info({}, (ret) => {

            var quoteferryapi = new QuoteferryApi();
            quoteferryapi.list({ status: '3,4,5', mobile: ret.mobile, inst_id: inst.id }, (ret) => {
              this.Base.setMyData({ list_4: ret });
            });
            quoteferryapi.list({ status: 6, mobile: ret.mobile, inst_id: inst.id }, (ret) => {
              this.Base.setMyData({ list_6: ret });
            });
            quoteferryapi.list({ status: 7, mobile: ret.mobile, inst_id: inst.id }, (ret) => {
              this.Base.setMyData({ list_7: ret });
            });
          })
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

  copy(e) {
    console.log(e.target.dataset);
    var that = this;
    var data='';
    var dispatch = e.target.dataset.dispatch;
    for (var i = 0; i < dispatch.length;i++){
      data = data + '司机:' + dispatch[i].name + '\n' + '联系方式:' + dispatch[i].mobile + '\n' + '身份证:' + dispatch[i].idcard + '\n' + '车辆:' + dispatch[i].plate_number + '\n \n'
    }
    // data = '司机:' + e.target.dataset.name + '\n' + '联系方式:' + e.target.dataset.mobile + '\n' + '身份证:' + e.target.dataset.idcard + '\n' + '车辆:' + e.target.dataset.plate_number
    wx.setClipboardData({
      data: data,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
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
body.copy = content.copy;

Page(body)