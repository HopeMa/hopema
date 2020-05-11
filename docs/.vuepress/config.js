module.exports = {
    title: 'HopeMa学习历程',
    description: '技术学习进阶之路',
    port: 8083,
    base: '/hopema/',
    configureWebpack: {
      resolve: {
        alias: {
          '@alias': '/hopema/assets/img/'
        }
      }
    },
    themeConfig: {
        // navbar: false, // 禁用导航栏
        displayAllHeaders: true,
        activeHeaderLinks: true, // 活动的标题链接 默认值：true
        nav: [
          { text: '主页', link: '/' },
          { text: 'vue3源码导读', link: '/vue3/' },
          {
            text: '技术·杂谈',
            items: [
              { text: '技术优质文章集', link: '/technicalTalks/article/' },
              { text: '前端可视化后台', link: '/technicalTalks/forntBack/' },
              { text: '微信机器人搭建', link: '/technicalTalks/wechatRobot/'},
              { text: '音视频相关', link: '/technicalTalks/video_audio/article'},
            ]
          },
          {
            text: '前端·面试',
            items: [
              { text: "面试", link: '/frontInterview/interview/zero'},
              { text: 'js库学习', link: '/frontInterview/js_libraries/one' },
              { text: 'electron学习', link: '/frontInterview/electron/one' },
              { text: '工作积累学习', link: '/frontInterview/worklearn/one' },
              // { text: '微信机器人', link: '/frontInterview/wechatRobot/'}
            ]
          },
          {
            text: '计算机·基础',
            items: [
              { text: '算法基础合集', link: '/basiccomputer/algorithm/one' },
              { text: 'webRTC', link: '/basiccomputer/webrtc/webrtc' },
            ]
          },
          { text: 'github', link: 'https://github.com/HopeMa/hopema' },
        ],
        sidebar: {
            '/technicalTalks/video_audio/':[
              ['article','音视频相关文章']
            ],
            '/frontInterview/interview/': [
              ['zero', 'ES6知识汇总'],
              ['one', '前端面试手写题'],
              ['two', 'vue问题总结'],
              ['three', '前端性能优化']
            ],
            '/frontInterview/js_libraries/': [
              ['one', '前端库集合'],
            ],
             '/frontInterview/electron/': [
              ['one', 'electron问题积累'],
            ],
            '/frontInterview/worklearn/': [
              ['one', '工作学习记录'],
              ['two', '网络协议学习'],
            ],
            '/basiccomputer/algorithm/': [
              ['one', '算法集合'],
            ],
            '/basiccomputer/webrtc/': [
              ['webrtc_introduce', 'webRTC简介'],
              ['webrtc', 'webRTC学习'],
            ],
            '/vue3/': [
              ['', 'vue3源码导读'],
              ['one', 'vue3与vue2区别对比']
            ]
        }
      }
}