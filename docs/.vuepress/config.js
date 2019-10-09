module.exports = {
    title: 'HopeMa学习历程',
    description: '技术学习进阶之路',
    port: 8083,
    base: '/hopema',
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
          // { text: '技术杂谈', link: '/vue3/' },
          {
            text: '技术杂谈',
            items: [
              { text: '前端可视化后台', link: '/technicalTalks/forntBack/' },
              { text: '微信机器人', link: '/technicalTalks/wechatRobot/'}
              // { text: 'Japanese', link: '/language/japanese' }
              // { text: 'Group1', items: [{ text: 'Chinese', link: '/language/chinese' }] },
              // { text: 'Japanese', link: '/language/japanese' }
            ]
          },
          // { text: 'Guide', link: '/foo/' },
          { text: 'github', link: 'https://github.com/HopeMa/hopema' },
          // {
            // text: 'Languages',
            // items: [
            //   { text: 'Chinese', link: '/language/chinese' },
            //   { text: 'Japanese', link: '/language/japanese' }
              // { text: 'Group1', items: [{ text: 'Chinese', link: '/language/chinese' }] },
              // { text: 'Japanese', link: '/language/japanese' }
            // ]
          // }
        ],
        sidebar: [
            ['/vue3', 'Explicit link text']
            // {
            //     title: 'Group 1',
            //     collapsable: false,
            //     children: [
            //       '/foo'
            //     ]
            //   },
            //   {
            //     title: 'Group 2',
            //     children: [ /* ... */ ]
            //   }
        ]
      }
}