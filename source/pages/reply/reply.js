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
      currenttab: 0,
      quoteferry_id: options.id
    });

    var memberapi = new MemberApi();
    memberapi.info({}, (memberinfo) => {
      console.log(memberinfo);
      this.Base.setMyData(memberinfo);
    });

    console.log(options)
    var quoteferryapi = new QuoteferryApi();

    quoteferryapi.info({ id: options.id }, (ret) => {
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
   
    
  }

  price(e){ //计算总价
    var weight = this.Base.getMyData().data.weight;
    // var weight = '33吨';

    var length = weight.length - 1;
    weight = weight.substr(0, length) ;
    var quoteamount = weight * e.detail.value;
    this.Base.setMyData({ quoteamount: quoteamount});
    // console.log(e.detail.value)
  }

  reply(e){
    
    var that = this;
    // console.log(that.Base.getMyData().quoteferry_id)
    var memberinfo = that.Base.getMyData().memberinfo;
    var data = e.detail.value;
    if (!data.name){
      data.name = memberinfo.name;
      // this.Base.info("请输入姓名");
      // return;
    }
    if (!data.mobile) {
      data.mobile = memberinfo.mobile;
      // this.Base.info("请输入联系方式");
      // return;
    }

    if (that.Base.getMyData().quoteamount == undefined || that.Base.getMyData().quoteamount == null || that.Base.getMyData().quoteamount == '') {
      this.Base.info("请输入报价");
      return;
    }

    if (data.name == undefined) {
      this.Base.info("请输入姓名");
      return;
    }

    if (data.mobile == undefined) {
      this.Base.info("请输入联系方式");
      return;
    }

    wx.showModal({
      content: '请确认',
      success(res) {
        if (res.confirm) {
          var quoteferryapi = new QuoteferryApi();
          quoteferryapi.updatepriceitem({
            quoteferry_id: that.Base.getMyData().quoteferry_id,
            name:data.username,
            price: that.Base.getMyData().quoteamount,
            mobile: data.mobile,
            remark: data.remark
          }, (ret) => {
           // console.log(ret)
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

body.reply = content.reply; 

body.price = content.price;

Page(body)