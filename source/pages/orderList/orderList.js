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
      month: options.month
    })

  }

  onMyShow() {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    var that = this;
    var memberApi = new MemberApi();
    memberApi.info({ }, (info) => {
      console.log(info)
      that.Base.setMyData(info);
      if (info.company == 2) {
        var quoteferryapi = new QuoteferryApi();
        if (that.Base.getMyData().month){
          quoteferryapi.listcompany({ submit_time: that.Base.getMyData().month }, (ret) => {
            this.Base.setMyData({ list: ret });
          });
        }else{
          quoteferryapi.listcompany({ }, (ret) => {
            this.Base.setMyData({ list: ret });
          });
        }
        
        
      } else {
        var memberApi = new MemberApi();

        var instapi = new InstApi();
        instapi.info({}, (inst) => {
          memberApi.info({}, (ret) => {

            var quoteferryapi = new QuoteferryApi();
            quoteferryapi.list({ mobile: ret.mobile, inst_id: inst.id }, (ret) => {
              this.Base.setMyData({ list: ret });
            });
            
          })
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