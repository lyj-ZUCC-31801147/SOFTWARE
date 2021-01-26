var numCount = 4;
var numSlot = 5;
var mW = 300;
var mH = 300;
var mCenter = (mW+mH) / 6; //中心点
var mAngle = Math.PI * 2 / numCount; //角度
var mRadius = mCenter - 60; //半径(减去的值用于给绘制的文本留空间)
//获取Canvas
var radCtx = wx.createCanvasContext("radarCanvas")
const app=getApp()
var index
let analysis=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepText:5,
    chanelArray1:[["计划能力",88],["注意力",30],["同时性加工",66],["即时性加工",90]],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    trendsList:[{}]
  },
  onLoad:function(){
    var that = this;
    const query = wx.createSelectorQuery();
    query.selectAll('.textFour_box').fields({
     size: true,
    }).exec(function (res) {
     console.log(res[0], '所有节点信息');
     let lineHeight = 26; //固定高度值 单位：PX
     for (var i = 0; i < res[0].length; i++) {
      if ((res[0][i].height / lineHeight) > 3) {
       that.data.trendsList[i].auto = true;
       that.data.trendsList[i].seeMore = true;
      }
     }
     that.setData({
      trendsList: that.data.trendsList
     })
    })
    // 微信头像
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
      
    }
    this.invokeGetAnalysis()
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  GoBack(){
    wx.redirectTo({
      url: '/pages/beginGame/beginGame',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

        //雷达图
        // this.drawRadar()

  },
  // 雷达图
  drawRadar:function(){
    var sourceData1 = this.data.chanelArray1
    //调用
    this.drawEdge() //画六边形
    //this.drawArcEdge() //画圆
    this.drawLinePoint()
    //设置数据
    this.drawRegion(sourceData1,'rgba(255, 0, 0, 0.5)') //第一个人的
    //设置文本数据
    this.drawTextCans(sourceData1)
    //设置节点
    this.drawCircle(sourceData1,'red')
    //开始绘制
    radCtx.draw()
  },
  // 绘制6条边
  drawEdge: function(){
    radCtx.setStrokeStyle("white")
    radCtx.setLineWidth(2)  //设置线宽
    for (var i = 0; i < numSlot; i++) {
      //计算半径
      radCtx.beginPath()
      var rdius = mRadius / numSlot * (i + 1)
      //画6条线段
      for (var j = 0; j < numCount; j++) {
        //坐标
        var x = mCenter + rdius * Math.cos(mAngle * j);
        var y = mCenter + rdius * Math.sin(mAngle * j);
        radCtx.lineTo(x, y);
      }
      radCtx.closePath()
      radCtx.stroke()
    } 
  },
  // 绘制连接点
  drawLinePoint:function(){
    radCtx.beginPath();
    for (var k = 0; k < numCount; k++) {
      var x = mCenter + mRadius * Math.cos(mAngle * k);
      var y = mCenter + mRadius * Math.sin(mAngle * k);

      radCtx.moveTo(mCenter, mCenter);
      radCtx.lineTo(x, y);
    }
    radCtx.stroke();
  },
  //绘制数据区域(数据和填充颜色)
  drawRegion: function (mData,color){
      
      radCtx.beginPath();
      for (var m = 0; m < numCount; m++){
      var x = mCenter + mRadius * Math.cos(mAngle * m) * mData[m][1] / 100;
      var y = mCenter + mRadius * Math.sin(mAngle * m) * mData[m][1] / 100;

      radCtx.lineTo(x, y);
      }
      radCtx.closePath();
      radCtx.setFillStyle(color)
      radCtx.fill();
    },

    //绘制文字
    drawTextCans: function (mData){

      radCtx.setFillStyle("white")
      radCtx.font = 'bold 17px cursive'  //设置字体
      for (var n = 0; n < numCount; n++) {
        var x = mCenter + mRadius * Math.cos(mAngle * n);
        var y = mCenter + mRadius * Math.sin(mAngle * n);
        // radCtx.fillText(mData[n][0], x, y);
        //通过不同的位置，调整文本的显示位置
        if (mAngle * n >= 0 && mAngle * n <= Math.PI / 2) {
          radCtx.fillText(mData[n][0], x+5, y+5);
        } else if (mAngle * n > Math.PI / 2 && mAngle * n <= Math.PI) {
          radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-7, y+5);
        } else if (mAngle * n > Math.PI && mAngle * n <= Math.PI * 3 / 2) {
          radCtx.fillText(mData[n][0], x - radCtx.measureText(mData[n][0]).width-5, y);
        } else {
          radCtx.fillText(mData[n][0], x+7, y+2);
        }

      }
    },
    //画点
    drawCircle: function(mData,color){
       var r = 3; //设置节点小圆点的半径
       for(var i = 0; i<numCount; i ++){
          var x = mCenter + mRadius * Math.cos(mAngle * i) * mData[i][1] / 100;
          var y = mCenter + mRadius * Math.sin(mAngle * i) * mData[i][1] / 100;

          radCtx.beginPath();
          radCtx.arc(x, y, r, 0, Math.PI * 2);
          radCtx.fillStyle = color;
          radCtx.fill();
        }

      },
      
      //展开更多
      toggleHandler: function (e) {
       var that = this;
       index = e.currentTarget.dataset.index;
       for (var i = 0; i < that.data.trendsList.length; i++) {
        if (index == i) {
         that.data.trendsList[index].auto = true;
         that.data.trendsList[index].seeMore = false;
        }
       }
       that.setData({
        trendsList: that.data.trendsList
       })
      },
      //收起更多
      toggleContent: function (e) {
       var that = this;
       index = e.currentTarget.dataset.index;
       for (var i = 0; i < that.data.trendsList.length; i++) {
        if (index == i) {
         that.data.trendsList[index].auto = true;
         that.data.trendsList[index].seeMore = true;
        }
       }
       that.setData({
        trendsList: that.data.trendsList
       })
      },
      getAnalysis(P_score,A_score,S1_score,S2_score){
        let that=this
        console.log("getAnalysis invoked")
        wx.cloud.init()
        const db = wx.cloud.database()
        const _ = db.command
        console.log(P_score)
        console.log(A_score)
        console.log(S1_score)
        db.collection("ANALYSIS").where(_.or([
          {module_item:"P",module_score:P_score},
          {module_item:"A",module_score:A_score},
          {module_item:"S1",module_score:S1_score},
          {module_item:"S2",module_score:S2_score}])).get({
            success:res=>{
              let twenty = 20
              that.setData({
                chanelArray1:[
                  [res.data[0].module_item,res.data[0].module_score*twenty],
                  [res.data[1].module_item,res.data[1].module_score*twenty],
                  [res.data[2].module_item,res.data[2].module_score*twenty],
                  [res.data[3].module_item,res.data[3].module_score*twenty]
                ],
                trendsList:[
                  {
                   auto: false,
                   seeMore: false,
                   text: res.data[0].module_name+"("+res.data[0].module_item+"): "+res.data[0].analysis_comment,
                  },
                  {
                   auto: false,
                   seeMore: false,
                   text:  res.data[1].module_name+"("+res.data[1].module_item+"): "+res.data[1].analysis_comment,
                  },
                   {
                   auto: false,
                   seeMore: false,
                    text:  res.data[2].module_name+"("+res.data[2].module_item+"): "+res.data[2].analysis_comment,
                  },
                  {
                   auto: false,
                   seeMore: false,
                   text:  res.data[3].module_name+"("+res.data[3].module_item+"): "+res.data[3].analysis_comment,
                  },

                 ]
              })
              that.drawRadar()
              console.log('get analysis success',res) 
              console.log('after')
            }
            }
          )
      },
      invokeGetAnalysis(){
        let that=this
        wx.cloud.init()
        const db = wx.cloud.database()
        const _ = db.command
        db.collection("RECORD_USER_SCORE").where({
          _openid:app.globalData.openid
          //_openid:openID
        }).get()
        .then(res=>{
            that.getAnalysis(
            parseInt(res.data[0].p_score),
            parseInt(res.data[0].a_score),
            parseInt(res.data[0].s1_score),
            parseInt(res.data[0].s2_score))
          console.log(res)
         },
        )
        .catch(console.log)
      },
})