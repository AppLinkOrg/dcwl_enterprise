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
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
    this.Base.setMyData({ id: options.id, ctt: options.ctt });

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

      var images = [ret.pickupgoods_img,
      ret.vehicle_img,
      ret.goods_img1,
      ret.goods_img2,
      ret.goods_img3,
      ret.goods_img4]
      that.Base.setMyData({ info: ret, images: images});
    });


  }

  photo() {
    console.log(this.Base.getMyData().images)
    this.Base.viewGallary('photo', this.Base.getMyData().images, '')
  }


}


var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.photo = content.photo;
Page(body)