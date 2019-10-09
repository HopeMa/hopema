---
sidebar: auto
---
# 如何制作自己的微信机器人

## 通过图灵机器人
之前给各位介绍过别样的微信，可以实现一些自动化的功能。今天来分享如何制作一个微信机器人陪你聊天？工具依然是强大的python，而代码也只有几行而已。

在制作之前，需要在图灵机器人的官方网站注册申请一个APIKey，等会需要用到。

在官方注册之后，创建一个机器人之后，就会分配一个APIKey。

安装好python和wxpy库之后，在桌面新建一个python文件，输入如下的代码：

~~~ python
from wxpy import *
bot = Bot()
#api可以直接用，也可去图灵机器人官网申请
tuling = Tuling（api_key=''）
@bot.register(msg_types=TEXT)
def auto_reply_all(msg):
    tuling.do_reply(msg)
bot.join
~~~

记得把上面获得的APIKey输入到代码当中去，运行。

接下来会弹出一个二维码，用微信扫码登录之后，你的微信便成为一个聊天机器人。这个时候可以用另外一个微信和它聊天了。如下演示：（左边为机器人微信）

## 通过itchat
https://itchat.readthedocs.io/zh/latest/

## 通过WeChatRobot
https://github.com/TonyChen56/WeChatRobot

## 通过wechaty
https://github.com/Chatie/wechaty

##  通过wkteam
https://wkteam.gitbook.io/doc/