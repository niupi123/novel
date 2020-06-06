//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  book:[],
    background: ['/image/b1.jpg', '/image/b2.jpg', '/image/b3.jpg', '/image/b4.jpg', '/image/b5.jpg'],
    icon:[
      {
            title:"全球畅销",
            i:"/image/quan.png"
      },
      {
        title: "当代文学",
        i: "/image/dang.png"
      },
      {
        title: "外国文学",
        i: "/image/wai.png"
      },
      {
        title: "古代文学",
        i: "/image/gu.png"
      },
      {
        title: "商业管理",
        i: "/image/shang.png"
      },
      {
        title: "亲子育儿",
        i: "/image/qin.png"
      },
      {
        title: "投资理财",
        i: "/image/tou.png"
      },
      {
        title: "中国史",
        i: "/image/zhong.png"
      },
      {
        title: "外国史",
        i: "/image/bing.png"
      },
      {
        title: "更多",
        i: "/image/geng.png"
      }
    ]
  },
  details(e){
    let book_id = e.currentTarget.dataset.id
   wx.navigateTo({
     url: '/pages/details/details?book_id=' + book_id,
   })
  },
  onLoad: function () {
    let that = this
   wx.request({
     url: 'http://api.likeball.top/index/index/book',
     success:function(res){
      //  console.log(res.data)
       that.setData({
         book: res.data
       })
     }
   })
  }
})
