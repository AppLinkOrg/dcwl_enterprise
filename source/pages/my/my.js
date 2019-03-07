// pages/content/content.js
import { AppBase } from "../../appbase";
import { ApiConfig } from "../../apis/apiconfig";
import { ContentApi } from "../../apis/content.api";
import { MemberApi } from "../../apis/member.api";
import { InstApi } from "../../apis/inst.api.js";

class Content extends AppBase {
  constructor() {
    super();
  }
  onLoad(options) {
    this.Base.Page = this;
    //options.id=5;
    super.onLoad(options);
  }
  onMyShow() {
    var that = this;
    var instapi = new InstApi();
    instapi.info({}, (info) => {
      that.Base.setMyData(info);
    });
    var memberApi = new MemberApi();
    memberApi.info({}, (memberinfo) => {
      if (memberinfo != null) {
        this.Base.setMyData({ memberinfo: memberinfo });
      }
    });


  }
}
var content = new Content();
var body = content.generateBodyJson();
body.onLoad = content.onLoad;
body.onMyShow = content.onMyShow;
body.changePlayinback = content.changePlayinback;
Page(body)