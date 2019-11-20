module.exports = {
    title: 'HopeMa学习历程',
    description: '技术学习进阶之路',
    port: 8083,
    base: '/hopema/',
    // configureWebpack: {
    //   resolve: {
    //     alias: {
    //       '@alias': 'path/to/some/dir'
    //     }
    //   }
    // },
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
              { text: '微信机器人搭建', link: '/technicalTalks/wechatRobot/'}
            ]
          },
          {
            text: '前端·面试',
            items: [
              { text: "面试积累", link: '/frontInterview/'},
              // { text: '前端可视化后台', link: '/frontInterview/forntBack/' },
              // { text: '微信机器人', link: '/frontInterview/wechatRobot/'}
            ]
          },
          {
            text: '计算机·基础',
            items: [
              { text: '算法基础合集', link: '/basiccomputer/algorithm/' },
            ]
          },
          { text: 'github', link: 'https://github.com/HopeMa/hopema' },
        ],
        sidebar: {
            '/frontInterview/': [
              ['', 'ES6知识汇总'],
              ['one', '前端面试手写题'],
              ['two', 'vue问题总结'],
              ['three', '前端性能优化']
            ],
            '/basiccomputer/': [
              ['algorithm', '算法集合'],
            ],
            '/vue3/': [
              ['', 'vue3源码导读'],
              ['one', 'vue3与vue2区别对比']
            ]
        }
      }
}