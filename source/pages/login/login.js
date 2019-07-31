// pages/login/login.js
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
  MemberApi
} from "../../apis/member.api.js";

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
    that.Base.setMyData({
      usertype: '普通'
    });
  }

  ordinaryLogin(){
    var that = this;
    that.Base.setMyData({
      usertype: '普通'
    });
  }

  adminLogin() {
    var that = this;
    that.Base.setMyData({
      usertype: '管理'
    });
  }


  phonenoCallback(phoneno, e) {
    console.log(phoneno);
    this.Base.setMyData({
      mobile: phoneno
    });
  }
  mobileChange(e) {
    this.Base.setMyData({
      mobile: e.detail.value
    });
  }
  confirm(e) {
    var that = this;
    var data = e.detail.value;
    if (data.name == "") {
      this.Base.info("请输入您的姓名");
      return;
    }
    var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
    var flag = reg.test(data.mobile); //true

    if (data.mobile.length != 11 || !flag) {
      this.Base.info("手机号格式有误");
      return;
    }

    if (data.mobile.length != 11 || data.mobile == '') {
      this.Base.info("请点击绑定手机号");
      return;
    }
    
    AppBase.UserInfo.mobile = data.mobile;
    AppBase.UserInfo.name = data.name;
    var mobile = this.Base.getMyData().mobile ;
    var name = data.name;
    AppBase.UserInfo.mobile = mobile;
    AppBase.UserInfo.name = name;
    var openid = AppBase.UserInfo.openid;
    var session_key = AppBase.UserInfo.session_key;

    console.log(openid,"裂了");
    console.log(session_key, "裂了");
    //return;

    var api = new MemberApi();
    console.log(name);
    console.log(mobile);
    api.update(AppBase.UserInfo, () => {
      console.log("牛逼");
      console.log(AppBase.UserInfo);

      api.register({
        mobile: mobile,
        name: name,
        openid: openid,
        session_key: session_key
      }, (ret) => {
        console.log(ret);
        console.log(122222222);

        api.info({
          mobile: mobile,
          name: name,
          usertype: that.Base.getMyData().usertype
        }, (info) => {
          AppBase.UserInfo.info = info;
          console.log(info);
          console.log(1231321321321);
          if (ret.code == 0) {
            wx.reLaunch({
              url: '/pages/home/home',
            })
          } else {
            this.Base.info("用户信息不正确");
          }
        })
      })

    })
  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.confirm = content.confirm;
body.mobileChange = content.mobileChange;
body.ordinaryLogin = content.ordinaryLogin; 
body.adminLogin = content.adminLogin;
Page(body)