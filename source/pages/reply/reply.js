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

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({
      currenttab: 0,
      quoteferry_id: options.id
    });

    console.log(options)
    var quoteferryapi = new QuoteferryApi();

    quoteferryapi.info({ id: options.id }, (ret) => {
      //console.log(ret)
      this.Base.setMyData({
        data: ret
      });
    });
    
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
   
    instapi.indexbanner({}, (indexbanner) => {
      that.Base.setMyData({
        indexbanner: indexbanner
      });
    });
    instapi.info({}, (info) => {
      that.Base.setMyData(info);
    });
    instapi.servicelist({}, (servicelist) => {
      that.Base.setMyData({
        servicelist: servicelist
      });
    });
    
  }

  reply(e){
    
    var that = this;
    console.log(that.Base.getMyData().quoteferry_id)
    var data = e.detail.value;
    wx.showModal({
      content: '请确认',
      success(res) {
        if (res.confirm) {
          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.updatepriceitem({
            quoteferry_id: that.Base.getMyData().quoteferry_id,
            name:data.username,
            price: data.quoteamount,
            mobile: data.mobile,
            remark: data.remark
          }, (ret) => {
           // console.log(ret)
            wx.redirectTo({
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

body.reply = content.reply;
Page(body)