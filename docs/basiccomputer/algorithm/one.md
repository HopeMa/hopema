---
# sidebar: auto
# markdown:
#   -lineNumbers: true
---
# 算法集合
## 算法总览

1. 数据结构和算法总览
1. 数组与链表、栈与队列
1. 哈希表、映射、集合
1. 树、二叉数和图
1. 递归、分治和回溯
1. 深度、广度优先搜索与剪枝
1. 贪心算法与二分查找
1. 动态规划
1. 并查集、字典树、红黑树和 AVL 树
1. 位运算、布隆过滤器和 LRU Cache
1. 排序、字符串操作串讲
1. 整体知识总结

## 数据结构和算法总览
### 数据结构
* 一维
基础：数组array(string),链表linked list 
高级：栈stack,队列queue，双端队列deque，集合set，映射map(hash or map),…… 
* 二维：
基础：树tree，图graph 
高级：二叉搜索树binary search tree(red-black tree,AVL),堆heap,并查集disjoint set，字典树Trie，…… 
* 特殊：
位运算Bitwise，布隆过滤器BloomFiter 
LRU Cache 

## 数组与链表、栈与队列
## 哈希表、映射、集合
## 树、二叉数和图
## 递归、分治和回溯
## 深度、广度优先搜索与剪枝
## 贪心算法与二分查找
## 动态规划
换钱的最少货币数
给定数组arr，arr中所有的值都为正整数且不重复。每个值代表一种面值的货币，每种面值的货币可以使用任意张，再给定一个aim，代表要找的钱数，求组成aim的最少货币数。
输入描述
输入包括两行，第一行两个整数n（0<=n<=1000）代表数组长度和aim（0<=aim<=5000），第二行n个不重复的正整数，代表arr\left( 1 \leq arr_i \leq 10^9 \right)(1≤arr i ≤10^9)。
输出描述
输出一个整数，表示组成aim的最小货币数，无解时输出-1.
示例1
输入
3 20
5 2 3
输出
4
说明
20=5*4
示例2
输入
3 0
5 2 3
输出
0
示例3
输入
2 2
3 5
输出
-1

~~~ js
function a(num, arr){
    arr = arr.sort((a,b)=>a-b)
    let max = arr[arr.lenght-1]
    let min = arr[0]
    if(num<min){
        return -1
    }
    let curMin = 0
    let curMaxIndex
    for(var i = 0; i<arr.lenght; i++){
        if(num<arr[i]){
            curMaxIndex = i-1
        }
    }
    curMax = curMax
    function aa(curnum, index, num){
        let a
        let num1
        let cura = arr[index]
        if(curnum>cura){
           a = curnum % cura
           num1 = Match(curnum/cura)
           if(a === 0){
               return num1+num
           }
           if(index-1<0){
               return -1
           }
           return aa(a,index-1,num1+num)
        }else{
            if(index-1<0){
               return   -1
            }
            return aa(a,index-1,num)
        }
        
        
    }
}
~~~

## 并查集、字典树、红黑树和 AVL 树
## 位运算、布隆过滤器和 LRU Cache
## 排序、字符串操作串讲
## 整体知识总结
