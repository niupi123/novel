//app.js
App({
  onLaunch: function () {
    var  record = wx.getStorageSync('record')
    console.log(record)
    wx.setStorageSync("schedule", record)
  }
})