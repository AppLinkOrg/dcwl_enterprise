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
        quoteferryapi.listcompany({ }, (ret) => {
          this.Base.setMyData({ list: ret });
        });
        
      } else {
        var memberApi = new MemberApi();
        memberApi.info({}, (ret) => {

          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.list({  mobile: ret.mobile }, (ret) => {
            this.Base.setMyData({ list: ret });
          });
          
        })
      }
    });


  }


}




var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;

Page(body)