// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { QuoteferryApi } from "../../apis/quoteferry.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    console.log(options)
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ id: options.id });

  }

  onMyShow() {
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    var that = this;
    var quoteferryapi = new QuoteferryApi();
    quoteferryapi.info({ id: this.Base.getMyData().id }, (ret) => {
      console.log(ret)

      var images = [
        ret.pickupgoods_img1,
        ret.pickupgoods_img2,
        ret.pickupgoods_img3,
        ret.pickupgoods_img4,
        ret.pickupgoods_img5,
        ret.pickupgoods_img6,
        ret.receipt_img1,
        ret.receipt_img2,
        ret.receipt_img3,
        ret.receipt_img4,
        ret.receipt_img5,
        ret.receipt_img6,
        ret.goods_img1,
        ret.goods_img2,
        ret.goods_img3,
        ret.goods_img4,
        ret.goods_img5,
        ret.goods_img6
      ]

      for (var i = 0; i < images.length; i++) {
        if (images[i] == undefined || images[i] == "undefined" || images[i] == "" || images[i] == null) {
          console.log('22')
          images.splice(i, 1)
          i = i - 1;
        }
      }
      this.Base.setMyData({ datas: ret,images: images });
    });

  }

  photo() {
    console.log(this.Base.getMyData().images)
    this.Base.viewGallary('quoteferry', this.Base.getMyData().images, '')
  }


}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;

body.photo = content.photo;
Page(body)