// pages/order/order.js
import {
  getTimeNow
} from '../../utils/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['全部', '我的订单', '我帮助的', '正在悬赏', '接单者排行榜'],
    tabNow: 0,
    orderList: [],
    myOrder: [],
    rewardOrder: [],
    helpOrder: [],
    openid: '',
    canReceive: false,
    helpTotalNum: 0,
    helpTotalMoeny: 0,
    comment: '',
    showComment: false,
    starList: [
      '../../images/star.png',
      '../../images/star.png',
      '../../images/star.png',
      '../../images/star.png',
      '../../images/star.png',
    ],
    showStar: false,
    finishID: ''
  },

  submitStar() {
    wx.showLoading({
      title: '加载中',
    })
    let starNum = 0;
    let _id = this.data.finishID;
    this.data.starList.forEach(item => {
      if (item === '../../images/star_fill.png') {
        starNum++;
      }
    })
    this.setData({
      showStar: false
    })

    wx.request({
      url: 'http://localhost:3000/toFinishOrder',
      data: {
        _id,
        starNum
      },
      success: (res) => {
        wx.hideLoading();
        if (res.data === "success") {
          this.getMyOrder();
        } else {
          wx.showToast({
            icon: 'none',
            title: '操作失败',
          })
        }
      }
    })
  },

  selectStar(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let list = this.data.starList;

    for (let i = 0; i < list.length; i++) {
      if (i <= index) {
        list[i] = '../../images/star_fill.png';
      } else {
        list[i] = '../../images/star.png';
      }
    }

    this.setData({
      starList: list
    })
  },

  showComment() {
    this.setData({
      showComment: !this.data.showComment
    })
  },

  getComment(e) {
    const comment = e.detail.value;
    const _id = e.currentTarget.dataset.id;

    const {
      avatarUrl,
      nickName
    } = wx.getStorageSync('userInfo');

    wx.request({
      url: 'http://localhost:3000/addComment',
      method: 'POST',
      data: {
        _id,
        comment,
        nickName,
        avatarUrl,
        time: getTimeNow()
      },
      success: (res) => {
        if (res.data === "success") {
          wx.showToast({
            title: '评论成功',

          })
          this.setData({
            comment: ''
          })
          const tabNow = this.data.tabNow;

          if (tabNow === 0) {
            this.onLoad();
          } else if (tabNow === 1) {
            this.getMyOrder();
          } else if (tabNow === 2) {
            this.getMyHelpOrder();
            this.getHelpTotalNum();
            this.getHelpTotalMoney();
          } else if (tabNow === 3) {
            this.getRewardOrder();
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: '评论失败',
          })
        }
      }
    })
  },
  selectTab(e) {
    const {
      id
    } = e.currentTarget.dataset;
    this.setData({
      tabNow: id,
    })
    if (id === 0) {
      this.onLoad();
    } else if (id === 1) {
      this.getMyOrder();
    } else if (id === 2) {
      this.getMyHelpOrder();
      this.getHelpTotalNum();
      this.getHelpTotalMoney();
    } else if (id === 3) {
      this.getRewardOrder();
    }
  },

  callPhone(e) {
    const {
      phone
    } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  // 获取我帮助的订单信息 
  getMyHelpOrder() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://localhost:3000/getMyHelpOrder',
      data: {
        receivePerson: this.data.openid
      },
      success: (res) => {
        console.log(res);
        const {
          data
        } = res;
        data.forEach(item => {
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          helpOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  // 我帮助的订单单数总和
  getHelpTotalNum() {
    wx.request({
      url: 'http://localhost:3000/getHelpTotalNum',
      data: {
        receivePerson: wx.getStorageSync('openid')
      },
      success: (res) => {
        this.setData({
          helpTotalNum: res.data.count
        })
      }
    })
  },

  // 我帮助的订单金额总和
  getHelpTotalMoney() {
    wx.request({
      url: 'http://localhost:3000/getHelpTotalMoney',
      data: {
        receivePerson: wx.getStorageSync('openid')
      },
      success: (res) => {
        this.setData({
          helpTotalMoeny: res.data[0].totalNum
        })
      }
    })
  },

  // 获取正在悬赏的订单信息
  getRewardOrder() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://localhost:3000/getRewardOrder',
      success: (res) => {
        const {
          data
        } = res;
        data.forEach(item => {
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          rewardOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  // 获取我的订单信息
  getMyOrder() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'http://localhost:3000/getMyOrder',
      data: {
        openid: this.data.openid
      },
      success: (res) => {
        const {
          data
        } = res;
        data.forEach(item => {
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          myOrder: data,
        })
        wx.hideLoading();
      }
    })
  },

  // 点击接单
  orderReceive(e) {
    if (this.data.canReceive) {
      wx.showLoading({
        title: '加载中',
      })
      const {
        item
      } = e.currentTarget.dataset;
      const {
        _id
      } = item;
      wx.request({
        url: 'http://localhost:3000/toGetOrder',
        data: {
          receivePerson: this.data.openid,
          _id
        },
        success: (res) => {
          if (res.data === "success") {
            if (this.data.tabNow === 0) {
              this.onLoad();
            } else {
              this.getRewardOrder();
            }
            wx.hideLoading();
          } else {
            wx.showToast({
              icon: 'none',
              title: '接单失败',
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您目前不是接单员, 请前往个人中心申请成为接单员!'
      })
    }

  },

  toFinish(e) {
    const {
      item
    } = e.currentTarget.dataset;
    const {
      _id
    } = item;
    this.setData({
      showStar: true,
      finishID: _id
    })
  },

  formatInfo(orderInfo) {
    const {
      name,
      info,
    } = orderInfo;
    if (name === '快递代取') {
      const {
        business,
        expectGender,
        expectTime,
        number,
        remark,
        size
      } = info;
      return `快递类型: ${size} -- 快递数量: ${number}个 -- 快递商家: ${business} -- 期望送达: ${expectTime} -- 性别限制: ${expectGender} -- 备注: ${remark}`;
    } else if (name === '打印服务') {
      const {
        colorPrint,
        pageNum,
        remark,
        twoSided
      } = info;
      return `页数: ${pageNum} -- 是否彩印: ${colorPrint ? '是' : '否'} -- 是否双面: ${twoSided ? '是' : '否'} -- 备注: ${remark}`;
    } else if (name === '校园跑腿') {
      const {
        helpContent,
        pickUpAddress
      } = info;
      return `帮助内容: ${helpContent} -- 取货地点: ${pickUpAddress}`;
    } else if (name === '快递代寄') {
      const {
        helpContent,
        business,
        remark
      } = info;
      return `帮助内容: ${helpContent} -- 快递商家: ${business} -- 备注: ${remark}`;
    } else if (name === '租借服务') {
      const {
        leaseItem,
        leaseTime,
        deliveryTime
      } = info;
      return `租借物品: ${leaseItem} -- 租借时长: ${leaseTime} -- 预计交货时间: ${deliveryTime}`;
    } else if (name === '游戏陪玩') {
      const {
        gameID,
        gameName,
        gameTime,
        remark
      } = info;
      return `游戏名称: ${gameName} -- 游戏时间or盘数: ${gameTime} -- 游戏ID: ${gameID} -- 备注信息: ${remark}`;
    } else if (name === '帮我送') {
      const {
        deliveryInfo
      } = info;
      return `送达地点: ${deliveryInfo}`;
    } else if (name === '代替服务') {
      const {
        helpContent
      } = info;
      return `帮助内容: ${helpContent}`;
    } else if (name === '其它帮助') {
      const {
        helpContent
      } = info;
      return `帮助内容: ${helpContent}`;
    }
  },

  formatState(state) {
    if (state === '待帮助') {
      return 'top_right';
    } else if (state === '已帮助') {
      return 'top_right_help';
    } else if (state === '已完成') {
      return 'top_right_finish';
    }
  },

  getPersonPower() {
    wx.request({
      url: 'http://localhost:3000/getPersonPower',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: (res) => {
        this.setData({
          canReceive: !!res.data.length
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getPersonPower();
    wx.request({
      url: 'http://localhost:3000/getAllOrder',
      success: (res) => {
        console.log(res);
        const {
          data
        } = res;
        data.forEach(item => {
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
        });
        this.setData({
          orderList: data,
          openid: wx.getStorageSync('openid')
        })
        wx.hideLoading();
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '服务器异常~~~',
        })
        wx.hideLoading();
      }
    })
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
    this.onLoad();
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