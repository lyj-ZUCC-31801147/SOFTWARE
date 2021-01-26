const app = getApp()
let easy = []
let middle =[]
let hard = []
var alltime=8
Page({
  data: {
    titlemsg:'点击卡片选择',
    problemMsg:'',
    progress:1,
    allscore:0,
    countDown:'8',
    isclickLeft:false,
    isclickRight:false,
    LeftUrl:"",
    RightUrl:"",
    difficulity:'',
    answer:"",
    timeProgress:'',
    timer:'',
    next:true,
  },

onLoad() {
this.getSWBT("1")
this.setData({
  "allscore":0,
  "countDown":8
})
},
onShow:function(){
  let that=this;
  if(that.data.progress<=8){
  that.timeprogress()
  that.timeprogress()
}
 },
  restart:function(e){
    let that=this
this.getSWBT(that.data.difficulity)
  },

  goBack:function(e){
    wx.navigateBack({
      delta: 0,
      // 增加返回的主页面
    }) 
  },

 tapLeft:function(e){
  let that=this;
  let left=that.data.isclickLeft;
  let right=that.data.isclickRight;
  console.log(e)
  if(left==false&&right){
    wx.showToast({
      title: '请勿多次点击',
      icon:'none',
      duration:2000,
    })
  }
  else if(left){
    that.setData({
    "isclickLeft":false,
    })
  }else if(left==false&&right==false){
  that.setData({
    "isclickLeft":true,
  }) 
  }
  },
  tapRight:function(e){
    let that=this;
    let left=that.data.isclickLeft;
    let right=that.data.isclickRight;
    let all=that.data.isclick;
    console.log(e)
    if(right==false&&left){
      wx.showToast({
        title: '请勿多次点击',
        icon:'none',
        duration:2000,
      })
    }
    else if(right){
      that.setData({
      "isclickRight":false,
      })
    }else if(left==false&&right==false){
      that.setData({
      "isclickRight":true,
    }) 
    }
    },
  
  confirm:function(){
  let that=this;
  let progress=that.data.progress;
  let allscore=that.data.allscore;
  let left=that.data.isclickLeft;
  let right=that.data.isclickRight;
  let answer=that.data.answer;
  if(!left&&!right){
  wx.showToast({
    title: '请选择图片',
    icon:'none',
    duration:2000,
  })}
  if(left||right){
    progress+=1
    if((left&&answer=="Left")||(right&&answer=="Right")){
      allscore+=1;
      console.log(allscore)
      console.log("success")
    }else {
      console.log("error")
    }
    if(progress<=8){
      alltime=8
      if(progress>0&&progress<=3){
        that.getSWBT("1")
      }else if(progress>3&&progress<=6){
        that.getSWBT("2")
      }else{
        that.getSWBT("3")
        if(progress==8){
          that.updateScore("SWBT",that.data.allscore)
        }
      }
    }else{
      if(that.setData.next){
        that.setData({
          "next":false
        })
      wx.redirectTo({
        url: '/pages/deterEnd/end?allscore=score',
      })
    } 
    }
    that.setData({
    "progress":progress,
    "allscore":allscore
    })
  } 
  },
  updateScore(aModule,aScore){
    console.log(aModule,aScore)
    console.log("updateScore invoked")
    wx.cloud.init()
    const db = wx.cloud.database()
    if(aModule=="P"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{p_score:aScore}}).then(res=>{ console.log('更新P成功',res)}).catch(console.error)
    }else if(aModule=="A"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{a_score:aScore}}).then(res=>{ console.log('更新A成功',res)}).catch(console.error)
    }else if(aModule=="S1"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{s1_score:aScore}}).then(res=>{ console.log('更新S1成功',res)}).catch(console.error)
    }else if(aModule=="S2"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{s2_score:aScore}}).then(res=>{ console.log('更新S2成功',res)}).catch(console.error)
    }else if(aModule=="SST"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{sst_score:aScore}}).then(res=>{ console.log('更新三视图成功',res)}).catch(console.error)
    }else if(aModule=="BDX"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{bdx_score:aScore}}).then(res=>{ console.log('更新比大小成功',res)}).catch(console.error)
    }else if(aModule=="SWBT"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{swbt_score:aScore}}).then(res=>{ console.log('更新识文辨图成功',res)}).catch(console.error)
    }else if(aModule=="WKSZ"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{wksz_score:aScore}}).then(res=>{ console.log('更新挖空数字成功',res)}).catch(console.error)
    }else if(aModule=="ZMPD"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{zmpd_score:aScore}}).then(res=>{ console.log('更新字母配对成功',res)}).catch(console.error)
    }else if(aModule=="SZPP"){
      db.collection("RECORD_USER_SCORE").where({
        _openid:app.globalData.openid
      }).update({data:{szpp_score:aScore}}).then(res=>{ console.log('更新数字匹配成功',res)}).catch(console.error)
    }
  },
        getSWBT(aDiffculty){
              wx.cloud.init()
              const db = wx.cloud.database()
              db.collection("QUESTIONBANK_SWBT").where({
                swbt_degree_difficulty:aDiffculty
              }).get({
                success: res => {
                  console.log('数据库获取成功',res)
                  easy=res.data
                  const a=Math.floor(Math.random()*res.data.length);
                  this.setData({
                  "LeftUrl":res.data[a].URL_Left,
                  "RightUrl":res.data[a].URL_Right,
                  "difficulity":aDiffculty,
                  "answer":res.data[a].swbt_true,
                  "countDown":8,
                  "isclickLeft":false,
                  "isclickRight":false,
                  "problemMsg":res.data[a].swbt_problem,
                  })

                } ,fail:res=>{
                  console.log('数据库获取失败',res)
                }})
            },
  loadinformation:function(a){
    this.getSWBT(a)
  },
  timeprogress:function(){
    let that=this;
    let countDown=that.data.countDown;
    let progress=that.data.progress;
    that.setData({
      "timer": setInterval(function () {
        alltime--
        that.setData({
          "countDown": alltime,
          "timeProgress":alltime/8*100
        })
        if (alltime == 0) {
          alltime=8
          clearInterval(that.data.timer);
          progress+=1;
          if(progress<=8){
            if(progress>0&&progress<=3){
              that.getSWBT("1")
            }else if(progress>3&&progress<=6){
              that.getSWBT("2")
            }else{
              that.getSWBT("3")
              if(progress==8){
                that.updateScore("SWBT",that.data.allscore)
                var score=that.data.allscore
               
                wx.redirectTo({
                  url: '/pages/deterEnd/end?allscore=score',
                })
              }
            }
            that.setData({
              "process":progress,
            })
          }else{
            if(that.setData.next){
              that.setData({
                "next":false
              })
            wx.redirectTo({
              url: '/pages/deterEnd/end?allscore=score',
            })
          }
        }
        }
      }, 1000)
    })
  }
})

