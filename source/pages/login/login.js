// pages/login/login.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { InstApi } from "../../apis/inst.api.js";
import { MemberApi } from "../../apis/member.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    this.Base.needauth = false;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
  }

  phonenoCallback(phoneno, e) {
    console.log(phoneno);
    this.Base.setMyData({ mobile: phoneno });
  }
  confirm(e) {
    var that = this;
    var data = e.detail.value;
    if (data.name == "") {
      this.Base.info("请输入您的姓名");
      return;
    }
    if (data.mobile == "") {
      this.Base.info("请点击绑定手机号");
      return;
    }

    var mobile = data.mobile;
    var name = data.name;
    var openid = AppBase.UserInfo.openid;
    var session_key = AppBase.UserInfo.session_key;
    var api = new MemberApi();
    api.register({ mobile, name, openid, session_key }, (ret) => {
      console.log(ret)
      if (ret.code == 0) {
        wx.reLaunch({
          url: '/pages/home/home',
        })
      } else {
        this.Base.info("用户信息不正确");
      }
    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.confirm = content.confirm;
Page(body)