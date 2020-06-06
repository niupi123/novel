// pages/content/content.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  content: [],
  novel_length: null,
  book_id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.log(options.chapter_id)
  let novel_length = options.novel_length
  let  that = this
  wx.request({
    url: 'http://api.likeball.top/index/index/chapter',
    data:{
      chapter_id : options.chapter_id,
      book_id : options.book_id
    },
    success:function(res){
       console.log(res)
     that.setData({
       content : res.data,
       novel_length: novel_length
     })
    }
  })
  },
  //上一章
  top() {
    let that = this
    let chapter_id = parseInt(that.data.content.chapter) - 1
    // console.log(chapter_id)
    let book_id = that.data.content.book_id
    // console.log(chapter_id)
    // console.log(book_id)
    if (chapter_id == 0){
      wx.showToast({
        title: '上面没有了',
        icon: 'none',
        image: '',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.request({
        url: 'http://api.likeball.top/index/index/chapter',
        data: {
          chapter_id: chapter_id,
          book_id: book_id
        },
        success: function (res) {
          //  console.log(res)
          that.setData({
            content: res.data
          })
        }
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
      })
    }
  },
  //目录
  catalog(){
    wx.navigateBack({
      delta: 1,
    })
  },
  //下一章
  bottom(){
    let that = this
    let chapter_id = parseInt(that.data.content.chapter)  + 1
    let chapter_length = that.data.novel_length
    // console.log(chapter_length)
    let book_id = that.data.content.book_id
    // console.log(chapter_id)
    // console.log(book_id)
    if (chapter_id > chapter_length){
      wx.showToast({
        title: '暂无最新章节',
        icon: 'none',
        image: '',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }else{
      wx.request({
        url: 'http://api.likeball.top/index/index/chapter',
        data: {
          chapter_id: chapter_id,
          book_id: book_id
        },
        success: function (res) {
          //  console.log(res)
          that.setData({
            content: res.data
          })
        }
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
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
    // let content = this.data.content
    // console.log(content)
    // if(this.data.book_id == 1){
    //   wx.setStorageSync("read_record", content)
    //   let read_record = wx.getStorageSync("read_record")
    //   console.log(read_record)
    // }
    // if (this.data.book_id == 2) {
    //   wx.setStorageSync("read_record_To", content)
    //   let read_record_To = wx.getStorageSync("read_record_To")
    //   console.log(read_record_To)
    // }
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