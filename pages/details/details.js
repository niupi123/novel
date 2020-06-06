const app = getApp();

Page({
  data: {
    details: [],
    novel: [],
    show: false,
    playStatus: true, //背景音乐播放
    progress: 0,     //当前
    duration: 0,    //最大
    audioIndex: 0,   //播放下标
    read: "开始阅读",
    book_id:""
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  //回退
  backoff() {
    let back = this.data.progress - 15
    let manager = wx.getBackgroundAudioManager();
    manager.pause();
    manager.seek(back);
    this.setData({
      progressText: this.formatTime(back)
    })
    setTimeout(function () {
      manager.play();
    }, 500);
  },
  //快进
  fast(){
    let fast = this.data.progress + 15
    let manager = wx.getBackgroundAudioManager();
    manager.pause();
    manager.seek(fast);
    this.setData({
      progressText: this.formatTime(fast)
    })
    setTimeout(function () {
      manager.play();
    }, 500);
  },
  read(){
    let record = this.data.details.record
    console.log(record)
    if (record == 0){
      let novel = this.data.novel.length
      let chapter_id = this.data.novel[0].chapter
      let book_id = this.data.novel[0].book_id
      wx.navigateTo({
        url: '/pages/content/content?chapter_id=' + chapter_id + "&book_id=" + book_id + "&novel_length=" + novel,
      })
    }else{
      let novel = this.data.novel.length
      let chapter_id = record
      let book_id = this.data.novel[0].book_id
      wx.navigateTo({
        url: '/pages/content/content?chapter_id=' + chapter_id + "&book_id=" + book_id + "&novel_length=" + novel,
      })

    }
  },
  //获取数据
  detail(){
    let that = this
    wx.request({
      url: 'http://api.likeball.top/index/index/details',
      data: {
        book_id: that.data.book_id
      },
      success: function (res) {
        that.setData({
          details: res.data,
          novel: res.data.novel,
        })

      }
    })
  },
  myrecord(){
    let myrecord = wx.getStorageSync("schedule")
    console.log(myrecord)
    if (myrecord != "") {
      if (myrecord.book_id == this.data.book_id){
        this.setData({
          audioIndex: myrecord.index,
        })
        console.log("已切换到上次播放歌曲")
      }
    }
    this.playMusic();
    if (myrecord != "") {
      if (myrecord.book_id == this.data.book_id) {
      let manager = wx.getBackgroundAudioManager();
      manager.pause();
      manager.seek(myrecord.progress);
      this.setData({
        progressText: this.formatTime(myrecord.progress)
      })
      setTimeout(function () {
        manager.play();
      }, 1000);
      console.log("已跳转到上次播放进度")
        wx.setStorageSync("schedule", "")
    }
    }
  },
  onLoad: function (options) {
    let that = this
    let book_id = options.book_id
    that.setData({
      book_id: book_id
    })
    that.detail()
    setTimeout(function(){
      that.myrecord()
    },1500)
  },
  playMusic() {
    let audio = this.data.novel[this.data.audioIndex];
    let details = this.data.details
    let manager = wx.getBackgroundAudioManager();
    manager.title = audio.chapter_name || "章节标题";
    manager.epname = details.book_name || "专辑名称";
    manager.singer = details.author || "歌手名";
    manager.coverImgUrl = details.book_img;
    manager.src = audio.audio;
    let that = this;
    manager.onPlay(function () {
      // console.log("======播放======");
      that.setData({
        playStatus: true
      })
      that.countTimeDown(that, manager);
    });
    manager.onPause(function () {
      that.setData({
        playStatus: false
      })
      // console.log("======暂停======");
    });
    manager.onEnded(function () {
      console.log("======结束，播放下一首======");
      that.setData({
        playStatus: false
      })
      setTimeout(function () {
        that.nextMusic();
      }, 1500);
    });
  },
  //循环计时
  countTimeDown: function (that, manager, cancel) {
        if (that.data.playStatus) {
          that.setData({
            progress: Math.ceil(manager.currentTime),
            progressText: that.formatTime(Math.ceil(manager.currentTime)),
            duration: Math.ceil(manager.duration),
            durationText: that.formatTime(Math.ceil(manager.duration))
          })
          setTimeout(function(){
            that.countTimeDown(that, manager);
          },1000)
        }
  },
  //拖动事件
  sliderChange: function (e) {
    let manager = wx.getBackgroundAudioManager();
    manager.pause();
    manager.seek(e.detail.value);
    this.setData({
      progressText: this.formatTime(e.detail.value)
    })
    setTimeout(function () {
      manager.play();
    }, 500);
  },
  //上一首
  lastMusic: function () {
    let audioIndex = this.data.audioIndex > 0 ? this.data.audioIndex - 1  :  this.data.novel.length - 1;
    this.setData({
      audioIndex: audioIndex,
      playStatus: false,
      progress: 0,
      progressText: "00:00",
      durationText: "00:00"
    })
    setTimeout(function () {
      this.playMusic();
    }.bind(this), 100);
  },
  //播放按钮
  playOrpause: function () {
    let manager = wx.getBackgroundAudioManager();
    if (this.data.playStatus) {
      manager.pause();
    } else {
      manager.play();
    }
  },
  //下一首
  nextMusic: function () {
    let audioIndex = this.data.audioIndex < this.data.novel.length - 1 ? this.data.audioIndex + 1 : 0;
    this.setData({
      audioIndex: audioIndex,
      playStatus: false,
      progress: 0,
      progressText: "00:00",
      durationText: "00:00"
    })
    setTimeout(function () {
      this.playMusic();
    }.bind(this), 100);
  },
  //格式化时长
  formatTime: function (s) {
    let t = '';
    s = Math.floor(s);
    if (s > -1) {
      let min = Math.floor(s / 60) % 60;
      let sec = s % 60;
      if (min < 10) {
        t += "0";
      }
      t += min + ":";
      if (sec < 10) {
        t += "0";
      }
      t += sec;
    }
    return t;
  },
  //正序
  just() {
    var achearr = this.data.novel;
    if (achearr[0].chapter == 1) {
      wx.showToast({
        title: '已是正序',
        icon: 'none',
        image: '',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      var bchearr = achearr.reverse();
      this.setData({
        novel: bchearr
      })
    }
  },
  //倒序
  back() {
    var achearr = this.data.novel;
    if (achearr[0].chapter != 1) {
      wx.showToast({
        title: '已是倒序',
        icon: 'none',
        image: '',
        duration: 500,
        mask: true,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      var bchearr = achearr.reverse();
      this.setData({
        novel: bchearr
      })
    }
  },

  //进入章节内容
  content(e) {
    let novel = this.data.novel.length
    let chapter_id = e.currentTarget.dataset.chapter
    let book_id = e.currentTarget.dataset.book_id
    wx.navigateTo({
      url: '/pages/content/content?chapter_id=' + chapter_id + "&book_id=" + book_id + "&novel_length=" + novel,
    })
  },

  onShow: function () {
    let that = this
    that.detail()
    setTimeout(function(){
      console.log(that.data.details.record)
      if (that.data.details.record != 0) {
        that.setData({
          read: "继续阅读"
        })
      }
    },500)
  },
  onUnload: function () {
    let index = this.data.audioIndex
    let progress = this.data.progress
    let progressText = this.data.progressText
    let duration = this.data.duration
    let durationText = this.data.durationText
    let book_id = this.data.book_id
    let record = new Object()
    record.index = index
    record.book_id = book_id
    record.progress = progress
    record.progressText = progressText
    record.duration = duration
    record.durationText = durationText
    wx.setStorageSync("record", record)
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