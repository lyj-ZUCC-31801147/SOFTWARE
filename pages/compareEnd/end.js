// pages/compareEnd/end.js
  const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titlemsg:'总结',
    score:[]
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
          console.log('get analysis success',res)
          that.setData({
            score:res.data
          })
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
  caluScore(){
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("RECORD_USER_SCORE").where({
      _openid:app.globalData.openid
    }).get()
    .then(res=>{
      //caluPScore SZPP
      const BDX=res.data[0].bdx_score
      const SST=res.data[0].sst_score
      const SWBT=res.data[0].swbt_score
      const SZPP=res.data[0].szpp_score
      const WKSZ=res.data[0].wksz_score
      const ZMPD=res.data[0].zmpd_score
      const PScore=parseInt(SZPP/6)
      const AScore=parseInt((BDX+ZMPD)/12)
      const S1Score=parseInt((SST+SWBT)/12)
      const S2Score=parseInt(WKSZ/6)
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({
        data:{
          p_score:PScore,
          a_score:AScore,
          s1_score:S1Score,
          s2_score:S2Score
        }
      })
      console.log('P:',PScore)
      console.log("A:",AScore)
      console.log(S1Score)
      console.log(S2Score)
    })
    .catch(console.error)
  },
  regist(age,name){
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection("USER_INFO").where({
      _openid:app.globalData.openid
      //_openid:openID
    }).get({
      success:res=>{
        console.log(res.data.length)
        
        if(res.data.length=="0"){
          console.log("新用户的处理逻辑")
          db.collection('USER_INFO').add({
            // data 字段表示需新增的 JSON 数据
            data: {name:name,age:age}
          })
          .then(res => {
            console.log(res)
          })
          .catch(console.error)
          db.collection('RECORD_USER_SCORE').add({
            // data 字段表示需新增的 JSON 数据
            data: {
            }
          }).then(res => {console.log(res)}).catch(console.error)
        }else{
          console.log("旧用户的处理逻辑")
          db.collection("RECORD_USER_SCORE").where({
            _openid:app.globalData.openid
            //_openid:openID
          }).get()
          .then(res=>{
            //将用户的旧数据存入全局变量中
            console.log(app.globalData)
            console.log(res)
            console.log("before",app.globalData.p_score)
            app.globalData=res.data[0]
            console.log("after",app.globalData)
          })
          .catch(console.error)
        }
      }
    })
  },
  next: function (params) {
    wx.redirectTo({
      url: '/pages/beginGame/beginGame',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.regist(1,"123")
    this.invokeGetAnalysis()
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})