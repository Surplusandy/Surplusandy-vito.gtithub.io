// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner:['../../images/gd1.jpg','../../images/gd2.jpg','../../images/gd3.jpg'],
    indexConfig:[
      {
        icon:'../../images/waimai.png',
        text:'外卖快递代取',
        url:'../getExpress/getExpress'
      },
      {
        icon:'../../images/print.png',
        text:'打印服务',
        url:'../print/print'
      },
      {
        icon:'../../images/run.png',
        text:'跑腿服务',
        url:'../run/run'
      },
      {
        icon:'../../images/kuaidi.png',
        text:'快递代取',
        url:'../expressReplace/expressReplace'
      },
      {
        icon:'../../images/zujie.png',
        text:'租借服务',
        url:'../lease/lease'
      },
      {
        icon:'../../images/games.png',
        text:'游戏陪玩',
        url: '../playGame/playGame',
      },
      {
        icon:'../../images/song.png',
        text:'代送',
        url: '../helpMeGive/helpMeGive',
      },
      {
        icon:'../../images/daiti.png',
        text:'代替服务',
        url: '../replaceMe/replaceMe',
      },
      {
        icon:'../../images/other.png',
        text:'其他服务',
        url: '../otherHelp/otherHelp',
      }
    ]
  },

  toDetail(e){
    const userInfo = wx.getStorageSync('userInfo');
    const url = e.currentTarget.dataset.url;
    if (userInfo) {
      wx.navigateTo({
        url,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请前往个人中心登录',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const openid = wx.getStorageSync('openid');

    // wx.request({
    //   url: 'http://localhost:3000/api/test',
    //   success: (res) => {
    //     console.log(res);
    //   }
    // })
    if (!openid) {
      wx.login({
        success: (res) => {
          wx.request({
            url: 'http://localhost:3000/login',
            data: {
              code: res.code
            },
            success: (res) => {
              const { openid } = res.data;
              wx.setStorageSync('openid', openid)
            }
          })
        }
      })
    }
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