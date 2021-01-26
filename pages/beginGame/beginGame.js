// pages/beginGame/beginGame.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goGame1:function(){
wx.redirectTo({
  url: '/pages/comparelogin/login',
})
  },
  goGame2:function(){
    wx.redirectTo({
      url: '/pages/deterlogin/login',
    })
  },
  goGame3:function(){

  },
  goMyself:function(){
    wx.redirectTo({
      url: '/pages/Myself/myself',
    })
  },
})