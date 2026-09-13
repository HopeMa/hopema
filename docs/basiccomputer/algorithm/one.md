---
# sidebar: auto
# markdown:
#   -lineNumbers: true
---
# 热门算法完全入门指南
## 从零基础到面试通关 · 小白友好版

> **本文目标**：覆盖面试热门算法的**完整场景**，同时让零基础小白也能快速入门。
> **学习方法**：每个算法都按统一模板讲解——**一句话人话 → 生活类比 → 核心思想 → 模板代码 → 典型题目 → 场景识别信号 → 小白坑点**。
> **代码语言**：JavaScript（思路通用，任何语言可迁移）。

### 📚 知识体系总览

```
数据结构(容器)                 算法思想(套路)
├── 数组/字符串                ├── 双指针 / 滑动窗口
├── 链表                      ├── 二分查找
├── 栈/队列                   ├── 排序
├── 哈希表                    ├── 递归 / 分治
├── 树/二叉树                 ├── 回溯
├── 图                        ├── BFS / DFS
├── 堆                        ├── 贪心
└── 高级结构(并查集/Trie/     ├── 动态规划
    布隆/LRU/跳表)            └── 前缀和 / 位运算 / 单调栈
```

**怎么刷题最高效**：数据结构是"词汇"，算法套路是"句型"——先认识词汇，再背句型，最后用真实题目练对话。

### 🗺️ 小白学习路线（建议顺序）

```
第 1 周: 复杂度 → 数组/字符串/哈希 → 双指针/滑动窗口
第 2 周: 链表/栈/队列 → 二分/排序 → 递归入门
第 3 周: 树 → BFS/DFS → 回溯
第 4 周: 贪心 → 动态规划 → 高级结构(并查集/Trie/LRU)
之后:   按"场景专题"查漏补缺 + 定期重刷错题
```

---

## 第零部分：学前必备（10 分钟搞懂复杂度）

### 0.1 什么是时间复杂度？（一句话人话版）

**时间复杂度**就是：**数据量变大 10 倍，你的代码会慢多少倍**的粗略刻画。

| 大 O | 直觉名字 | 数据×10 时耗时变化 | 典型代表 |
| --- | --- | --- | --- |
| O(1) | 瞬间 | 不变 | 哈希表查找、数组按下标取值 |
| O(log n) | 极快 | +一点点 | 二分查找 |
| O(n) | 快 | ×10 | 一层循环遍历 |
| O(n log n) | 还行 | 略多于×10 | 归并/快排 |
| O(n²) | 危险 | ×100 | 双重嵌套循环 |
| O(2ⁿ) | 爆炸 | 直接跑不完 | 暴力枚举所有子集 |

**面试速算口诀**（看到数据规模 n，反推需要的复杂度）：

```
n ≤ 20        → 可以 O(2ⁿ) 暴力枚举
n ≤ 500       → 可以 O(n³)
n ≤ 5000      → 可以 O(n²)
n ≤ 10⁵~10⁶   → 必须 O(n log n) 或 O(n)
n > 10⁸       → 需要 O(log n) 或 O(√n) 甚至 O(1)
```

这叫**从数据范围倒推算法**——竞赛和面试都极实用的技巧。

### 0.2 空间复杂度

只看**额外开了多少内存**：递归深度算栈空间；`new Array(n)` 是 O(n)。常见考点：递归转迭代可以省掉 O(n) 栈空间。

### 0.3 刷题五步法（小白防挫败）

```
1. 读题 → 自己想 10 分钟（哪怕只想出暴力解）
2. 想不出 → 看题解的"思路"（不看代码），再回来自己写
3. 写完 → 跑测试，逐个 bug 调试（别急着看答案）
4. 通过后 → 看优秀题解，对比差距，提炼"套路模板"
5. 3 天后重写一遍（能白板写出才算掌握）
```

**关键心法**：刷题不是"做过多少题"，而是"掌握多少个可复用的模板"。

---

## 第一部分：数据结构基础（认识容器）

### 1.1 数组与字符串

**一句话**：内存里**连续摆放**的一排格子，按下标瞬间定位。

```
下标:   0    1    2    3    4
值:   [10] [20] [30] [40] [50]
      ← 连续内存，跳到任意格都是 O(1) →
```

| 操作 | 复杂度 | 原因 |
| --- | --- | --- |
| 按下标访问 | O(1) | 地址直接算出来 |
| 头部插入/删除 | O(n) | 后面全部要挪 |
| 尾部插入 | O(1)* | *动态数组均摊 |
| 查找特定值 | O(n) | 只能逐个看 |

**字符串**就是字符数组，套路完全通用。**高频题**：两数之和、移动零、反转字符串、合并区间。

---

### 1.2 链表

**一句话**：一串**散落在内存各处**的节点，靠"指针/next"手拉手串起来。

```
head → [10|next] → [20|next] → [30|null]
        节点 = 值 + 指向下一个的指针
```

| 操作 | 复杂度 | 对比数组 |
| --- | --- | --- |
| 访问第 k 个 | O(n) | 要从头走过去（数组 O(1)） |
| 头部插入/删除 | O(1)✅ | 只改一个指针（数组 O(n)） |

**小白必背三件套**：

```javascript
// 1. 虚拟头节点：统一处理"删头节点"的特殊情况
const dummy = { val: 0, next: head };

// 2. 快慢指针找中点 / 判环
let slow = head, fast = head;
while (fast && fast.next) {
  slow = slow.next;          // 慢的走 1 步
  fast = fast.next.next;     // 快的走 2 步
}
// 相遇 = 有环；slow 到达 = 中点

// 3. 反转链表（三指针，必须会默写）
let prev = null, cur = head;
while (cur) {
  const next = cur.next;  // 先存后路
  cur.next = prev;        // 掉头
  prev = cur;             // prev 前进
  cur = next;             // cur 前进
}
return prev;
```

**高频题**：反转链表(206)、合并两个有序链表(21)、环形链表(141)、LRU(146)、两数相加(2)。

---

### 1.3 栈与队列

**一句话**：栈是**只有一头的羽毛球筒**（后进先出 LIFO）；队列是**排队买奶茶**（先进先出 FIFO）。

```
栈 Stack:  入栈→ [3] [2] [1] →出栈(只能从顶部)     LIFO
队列 Queue: 入队→ (1)(2)(3) →出队(只能从头部)       FIFO
双端队列 Deque: 两头都能进出（滑动窗口神器）
```

**典型用途**：

* 栈：括号匹配、函数调用、表达式求值、**单调栈**、撤销操作、DFS（迭代版）
* 队列：BFS 层序遍历、任务调度、消息队列、滑动窗口

```javascript
// JS 用数组模拟
const stack = [];  stack.push(1); stack.pop();     // 栈
const queue = [];  queue.push(1); queue.shift();   // 队列(shift 是 O(n)，大数据用链表实现)
```

**高频题**：有效的括号(20)、最小栈(155)、用栈实现队列(232)、滑动窗口最大值(239)。

---

### 1.4 哈希表（HashMap / Set）

**一句话**：给每个值算一个"门牌号"（哈希函数），查找直接定位——**用空间换时间**，O(1) 查找的神器。

**生活类比**：字典的目录——查 apple 不用从第一页翻，直接跳到 A 区。

```javascript
const map = new Map();    // 键 → 值
const set = new Set();    // 只存键（去重神器）
map.set(key, val);  map.get(key);  map.has(key);  map.delete(key);
```

**什么时候必须想到它**：

1. 题目出现"**是否存在 / 出现次数 / 去重**" → 无脑先想哈希
2. 需要**把 O(n) 的查找降到 O(1)**（两数之和的暴力 O(n²) → 一遍哈希 O(n)）

```javascript
// 两数之和：经典哈希降维
var twoSum = function(nums, target) {
  const seen = new Map();                    // 值 → 下标
  for (let i = 0; i < nums.length; i++) {
    if (seen.has(target - nums[i])) {
      return [seen.get(target - nums[i]), i];
    }
    seen.set(nums[i], i);                    // 边走边存
  }
};
```

**小白坑点**：普通对象 `{}` 的键会被转成字符串，`0` 和 `'0'` 混淆——**一律用 Map/Set**。

---

### 1.5 树与二叉树

**一句话**：树是"一爹多娃"的层级结构（公司组织架构图）；**二叉树**= 每个节点最多两个孩子。

```
            1           ← 根 root
          /   \
         2     3        ← 层
        / \     \
       4   5     6      ← 叶子 leaf
```

**必背：四种遍历**（一切树题的基础）：

```javascript
// 1. 前序(根左右)——常用于：复制树、序列化
function preorder(root) {
  if (!root) return;
  visit(root);
  preorder(root.left);
  preorder(root.right);
}

// 2. 中序(左根右)——BST 中序 = 升序数组（必考点!）
// 3. 后序(左右根)——常用于：自底向上算高度/直径
function depth(root) {
  if (!root) return 0;
  return Math.max(depth(root.left), depth(root.right)) + 1;
}

// 4. 层序(BFS + 队列)
function levelOrder(root) {
  if (!root) return [];
  const res = [], queue = [root];
  while (queue.length) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {       // 一次处理一整层
      const node = queue.shift();
      level.push(node.val);
      if (node.left)  queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    res.push(level);
  }
  return res;
}
```

**二叉搜索树（BST）**：左 < 根 < 右 → 中序遍历即有序；查找像二分，O(log n)。

**高频题**：最大深度(104)、翻转二叉树(226)、验证 BST(98)、二叉树层序遍历(102)、最近公共祖先(236)、路径总和(112)。

---

### 1.6 图

**一句话**：树是"特殊的不带回路的图"；图 = 节点 + 边，**边可以有方向、可以带权重**。

```
无向图:  A --- B        有向图:  A → B         带权图:  A --5-- B
         |   /                   ↑             |              |
         C --                    C --- A       C------3-------+
```

**存储方式（两种都要会）**：

```javascript
// 1. 邻接表（省空间，最常用）：节点 → 邻居列表
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A', 'D'],
  D: ['B', 'C'],
};

// 2. 邻接矩阵（查边 O(1)，费空间）
// matrix[i][j] = 1 表示 i→j 有边
```

**图的两把瑞士军刀**：BFS（找最短路、层序）和 DFS（找连通块、判环、路径）。带权最短路用 Dijkstra（了解即可）。

**高频题**：岛屿数量(200)、课程表(207)、克隆图(133)、腐烂的橘子(994)。

---

### 1.7 堆（Heap / 优先队列）

**一句话**：一种"**永远把最大（或最小）的顶在最上面**"的完全二叉树，插入/弹出都是 O(log n)。

**生活类比**：医院急诊分诊——不管谁先来，**病情最重的优先看诊**。

```
          100            ← 堆顶永远是最大值(大顶堆)
         /   \
       60     80
      /  \   /  \
    30   50 70   40
```

**核心用途**：

* **Top K 问题**：前 K 个最大元素 → 用**小顶堆**（容量 K，堆顶是"守门员"）
* 合并 K 个有序链表、堆排序、求中位数（对顶堆）

```javascript
// JS 没有内置堆，面试可手写简化版或用数组模拟
// 小顶堆核心操作：上浮(插入) + 下沉(弹出)
class MinHeap {
  constructor() { this.a = []; }
  push(v) {
    this.a.push(v);
    let i = this.a.length - 1;
    while (i > 0) {                       // 上浮
      const p = (i - 1) >> 1;
      if (this.a[p] <= this.a[i]) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    const top = this.a[0], last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;                          // 下沉
      while (true) {
        const l = 2 * i + 1, r = 2 * i + 2;
        let m = i;
        if (l < this.a.length && this.a[l] < this.a[m]) m = l;
        if (r < this.a.length && this.a[r] < this.a[m]) m = r;
        if (m === i) break;
        [this.a[m], this.a[i]] = [this.a[i], this.a[m]];
        i = m;
      }
    }
    return top;
  }
}
```

**高频题**：前 K 个高频元素(347)、数组中第 K 个最大元素(215)、合并 K 个升序链表(23)、丑数(264)。

---
## 第二部分：热门算法套路详解

> 每个套路按统一模板：**人话 → 类比 → 识别信号 → 模板代码 → 经典题 → 坑点**。

### 2.1 双指针

**一句话人话**：两个指针配合着移动，把 O(n²) 的两两比较压成 O(n) 的一趟扫描。

**生活类比**：两岸相向而行的铺路队——一个从左、一个从右，各修各的直到中间汇合，不用每米都派人从起点量一遍。

**识别信号**：**有序数组**上找一对数满足条件；原地删除/移动元素；判断回文。

**模板一：对撞指针（两端向中间）**

```javascript
// 有序数组两数之和; 两端向中间
function twoSumSorted(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l < r) {
    const sum = nums[l] + nums[r];
    if (sum === target) return [l, r];
    sum < target ? l++ : r--;   // 和小了左移左指针，大了左移右指针
  }
}
```

**模板二：快慢指针（同向不同速）**

```javascript
// 原地移除元素：慢指针指向"下一个可放位置"，快指针探路
function removeElement(nums, val) {
  let slow = 0;
  for (let fast = 0; fast < nums.length; fast++) {
    if (nums[fast] !== val) {
      nums[slow++] = nums[fast];   // 不是目标值就搬到前面
    }
  }
  return slow;                     // 新长度
}
```

**经典题**：盛最多水的容器(11)、三数之和(15)、移动零(283)、验证回文串(125)。

**小白坑点**：三数之和要先**排序**再固定一个数 + 对撞；记得去重（跳过相同值）。

---

### 2.2 滑动窗口

**一句话人话**：维护一个"可伸缩的连续区间"（像毛毛虫爬行：进一格、出一格），避免每个子数组都重算。

**生活类比**：公交车过站——乘客上车（右边界扩张），超载了就从前门下人（左边界收缩），不用每次重新数全车。

**识别信号**：求**连续子数组/子串**的最大/最小长度、和为 target、至多 K 种字符等。

**万能模板（背下来能解 80% 窗口题）**：

```javascript
function slidingWindow(s) {
  const need = new Map();      // 统计目标
  const window = new Map();    // 统计当前窗口
  let left = 0, right = 0;

  while (right < s.length) {
    const c = s[right];        // 1. 右边界扩张，入窗
    right++;
    // ... 更新 window 统计

    while (/* 窗口满足收缩条件 */) {
      // ... 在这里收集答案(窗口 [left, right))
      const d = s[left];       // 2. 左边界收缩，出窗
      left++;
      // ... 更新 window 统计
    }
  }
}
```

**实例：无重复字符的最长子串(3)**

```javascript
function lengthOfLongestSubstring(s) {
  const lastIndex = new Map();
  let left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (lastIndex.has(c) && lastIndex.get(c) >= left) {
      left = lastIndex.get(c) + 1;   // 重复了→左边界跳到重复字符下一位
    }
    lastIndex.set(c, right);
    max = Math.max(max, right - left + 1);
  }
  return max;
}
```

**经典题**：最小覆盖子串(76)、长度最小的子数组(209)、水果成篮(904)、找到字符串中所有字母异位词(438)。

**小白坑点**：收缩条件写反（该收不收会超时）；窗口内统计通常用 Map 或数组计数。

---

### 2.3 二分查找

**一句话人话**：每次砍掉一半，像猜价格游戏——"高了/低了"最多问 log n 次就猜中。

**生活类比**：查英文字典找 binary——从中间翻开，偏前就扔掉后半本，偏后就扔掉前半本。

**识别信号**：**有序** + 查找；或答案具有**单调性**（越小越能满足/越不满足）→ 二分答案。

**标准模板（左闭右闭，背熟这一版）**：

```javascript
function binarySearch(nums, target) {
  let left = 0, right = nums.length - 1;   // 闭区间 [left, right]
  while (left <= right) {                   // 注意 <=
    const mid = left + ((right - left) >> 1); // 防溢出写法
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;  // 目标在右半
    else right = mid - 1;                    // 目标在左半
  }
  return -1;
}
```

**变体：找左边界 / 右边界（高频考点）**

```javascript
// 找第一个 >= target 的位置(左边界)
function lowerBound(nums, target) {
  let left = 0, right = nums.length;       // 注意: 左闭右开
  while (left < right) {                    // 注意: <
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) left = mid + 1;
    else right = mid;                       // mid 可能是答案，不丢
  }
  return left;                              // 第一个 >= target 的下标
}
```

**小白坑点三连**（死循环/漏答案都出在这）：

1. `left <= right` 还是 `left < right`？取决于区间开闭
2. `right = mid` 还是 `mid - 1`？取决于 mid 是否可能是答案
3. mid 计算别写 `(left + right) / 2`（大数溢出），用 `left + ((right-left) >> 1)`

**经典题**：搜索旋转排序数组(33)、寻找两个正序数组的中位数(4)、在排序数组中查找元素的范围(34)、x 的平方根(69)。

---

### 2.4 排序算法

**十大排序对比总表（面试直接背）**：

| 算法 | 平均 | 最坏 | 空间 | 稳定 | 一句话特点 |
| --- | --- | --- | --- | --- | --- |
| 冒泡 | O(n²) | O(n²) | O(1) | ✅ | 相邻交换，大的往后冒 |
| 选择 | O(n²) | O(n²) | O(1) | ❌ | 每轮选最小放前面 |
| 插入 | O(n²) | O(n²) | O(1) | ✅ | 像整理扑克牌，**小数据很快** |
| 希尔 | O(n^1.3) | O(n²) | O(1) | ❌ | 分组插入排序 |
| **快排** | O(n log n) | **O(n²)** | O(log n) | ❌ | 选基准分区，**实践最快** |
| **归并** | O(n log n) | O(n log n) | O(n) | ✅ | 一分为二各自排好再合并 |
| **堆排** | O(n log n) | O(n log n) | O(1) | ❌ | 建堆反复取堆顶 |
| 计数 | O(n+k) | O(n+k) | O(k) | ✅ | 值域小直接数个数 |
| 桶排 | O(n) | O(n²) | O(n) | ✅ | 分桶各排各的 |
| 基数 | O(d·n) | O(d·n) | O(n) | ✅ | 按位从低到高分桶 |

> **稳定性**：值相同的元素排序后相对顺序不变。电商"先按价格、再按销量"排序时，需要稳定排序保住第一次的结果。

**必会手写一：快速排序（分治思想）**

```javascript
function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  const p = partition(arr, lo, hi);
  quickSort(arr, lo, p - 1);   // 左半
  quickSort(arr, p + 1, hi);   // 右半
  return arr;
}
function partition(arr, lo, hi) {
  const pivot = arr[hi];              // 取末尾当基准
  let i = lo;                         // i 左边都是 < pivot 的
  for (let j = lo; j < hi; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[hi]] = [arr[hi], arr[i]];  // 基准归位
  return i;
}
```

**必会手写二：归并排序**

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  // 合并两个有序数组
  const res = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    res.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return res.concat(left.slice(i), right.slice(j));
}
```

**面试高频追问**：

* 快排为什么快但最坏 O(n²)？→ 基准总选到最值（如已排序数组选首元素）；**随机化基准**可规避
* 为什么 JS 的 `Array.sort` 复杂度是 O(n log n)？→ 现代引擎用 TimSort（归并+插入的混合，稳定）

---

### 2.5 递归与分治

**一句话人话**：递归 = **函数自己调用自己**，把大问题拆成"同样形状的小问题"；分治 = 拆开分别解决再合并结果。

**生活类比**：站在电影院问"我是第几排"——问前排的人"你是第几排"，他再问他前排……到第一排返回 1，然后逐层 +1 传回来。

**递归三要素（写任何递归先填这三行）**：

```
1. 终止条件(base case)：问题小到直接可答
2. 递归调用：缩小规模，信任"子问题已经解决"
3. 返回与合并：拿到子结果，加工成本层答案
```

**入门实例：斐波那契（带记忆化）**

```javascript
// 普通递归 O(2ⁿ) → 会重复算大量子问题
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// 记忆化：算过的存起来 → O(n)
const memo = new Map();
function fibMemo(n) {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n);      // 命中缓存
  const v = fibMemo(n - 1) + fibMemo(n - 2);
  memo.set(n, v);
  return v;
}
```

**分治经典**：归并排序、快速排序、 Pow(x,n)(50)、多数元素(169)。

**小白坑点**：

1. 忘写终止条件 → 栈溢出
2. 递归里重复计算 → 加 memo（这其实就是 DP 的雏形！）

---

### 2.6 回溯

**一句话人话**：走迷宫时**每个岔路口都试**，走不通就**原路退回上一个岔口换条路**——"试错 + 撤退"。

**生活类比**：自动售货机密码锁 3 位数，暴力从 000 试到 999；回溯 = 试完一位发现不对就回退换一位，**系统化地穷举所有可能**。

**识别信号**：要求输出**所有方案/全排列/子集/组合**（不是求最优，是"全部列出来"）。

**万能模板（回溯三板斧）**：

```javascript
function backtrack(路径, 选择列表) {
  if (满足结束条件) {
    result.push([...路径]);   // ⚠️ 必须拷贝！直接 push 引用会被后续修改
    return;
  }
  for (const 选择 of 选择列表) {
    做选择;              // ① 放入路径
    backtrack(路径, 新的选择列表);
    撤销选择;            // ② 弹出路径(回溯的核心动作)
  }
}
```

**实例：全排列(46)**

```javascript
function permute(nums) {
  const res = [], path = [], used = new Array(nums.length).fill(false);
  function backtrack() {
    if (path.length === nums.length) {   // 排列满了
      res.push([...path]);               // 拷贝！
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;             // 用过的跳过
      path.push(nums[i]); used[i] = true;    // 做选择
      backtrack();
      path.pop(); used[i] = false;           // 撤销选择
    }
  }
  backtrack();
  return res;
}
```

**经典题**：子集(78)、组合总和(39)、括号生成(22)、N 皇后(51)、电话号码字母组合(17)。

**小白坑点**：收集答案忘了拷贝（`[...path]`）；排列用 used 数组、组合用 start 索引防重复。

---

### 2.7 BFS 与 DFS

**一句话人话**：

* **DFS 深度优先**：一条路走到黑，撞墙再回头 → 适合"找**有没有**路径、找所有路径"
* **BFS 广度优先**：一层一层向外扩散 → 适合"找**最短**路径"（每步代价相同）

**生活类比**：在朋友圈找能介绍你进某公司的人——

* DFS：顺着一个好友的好友一直深挖到底，不行换下一条线
* BFS：先问所有一度好友，都不行再问二度好友——**最先找到的一定是关系最近的**

**DFS 模板（递归 / 栈）**：

```javascript
// 递归版
function dfs(node, visited) {
  if (!node || visited.has(node)) return;
  visited.add(node);
  // 处理 node ...
  for (const next of node.neighbors) {
    dfs(next, visited);
  }
}
```

**BFS 模板（队列，最短路标配）**：

```javascript
function bfs(start, target) {
  const queue = [start];
  const visited = new Set([start]);   // 入队时就标记，防止重复入队
  let step = 0;
  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {  // 处理当前一整层
      const cur = queue.shift();
      if (cur === target) return step;
      for (const next of 邻居(cur)) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    step++;   // 层数 +1
  }
  return -1;
}
```

**经典题**：岛屿数量(200)、腐烂的橘子(994)、单词接龙(127)、二叉树层序遍历(102)、岛屿最大面积(695)。

**小白坑点**：

1. BFS 忘记 visited → 死循环
2. visited 应在**入队时**标记（出队时才标记会重复入队）
3. 带权图的最短路不能用普通 BFS（要 Dijkstra）

---
### 2.8 贪心算法

**一句话人话**：每一步都选**眼前最优**，且相信局部最优叠加出全局最优——不回头、不后悔。

**生活类比**：超市排队结账——你扫一眼各队，直接站最短的那队。不纠结"万一两分钟后别的队更快"，**当下最优就行**。

**识别信号**：题意允许"每一步独立做局部最优选择"；或排序后逐个处理（区间问题大本营）。

**贪心 vs 动态规划（必考辨析）**：

| 维度 | 贪心 | 动态规划 |
| --- | --- | --- |
| 决策 | 只看眼前，不回头 | 考虑所有子问题 |
| 正确性 | 需证明局部最优⇒全局最优 | 状态转移保证正确 |
| 复杂度 | 通常 O(n log n)（含排序） | O(n²)/O(n·m) |
| 例子 | 找零(标准币制✅) | 找零(任意币制❌要 DP，见 2.9) |

**经典模板题：无重叠区间 / 区间调度**

```javascript
// 会议室安排最多场：按"结束时间"排序，越早结束越不挡路
function maxEvents(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);   // 按右端点升序
  let count = 0, end = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= end) {      // 与上一场不冲突
      count++;
      end = e;           // 占据这个位置
    }
  }
  return count;
}
```

**经典题**：跳跃游戏(55)、跳跃游戏 II(45)、分发饼干(455)、买卖股票的最佳时机 II(122)、划分字母区间(763)。

**小白坑点**：贪心策略不是"怎么想都对"——同样的找零，标准币制贪心对，任意币制就错（下一节见证）。

---

### 2.9 动态规划（DP）——本文压轴

**一句话人话**：把大问题拆成小问题，**小问题的答案存表避免重算**，逐步填表得到大答案。

**生活类比**：爬楼梯到第 100 层的方法数——你不需要每次从头数，只要记住"到第 98 层有 X 种、到第 99 层有 Y 种"，第 100 层 = X + Y。**算过的记在本子上（dp 表），永不重算**。

**DP 四步曲（小白照着填就能解 90% 的 DP 题）**：

```
第 1 步: 定义状态      dp[i] 表示什么？(最关键的一步!)
第 2 步: 找转移方程    dp[i] 怎么由更小的子问题推出？
第 3 步: 初始化        dp[0] / dp[1] 是多少？
第 4 步: 确定遍历顺序  保证算 dp[i] 时依赖项已算好
```

#### 案例一：爬楼梯(70)——入门

```
第 1 步: dp[i] = 爬到第 i 阶的方法数
第 2 步: 最后一步要么跨 1 阶、要么跨 2 阶
         dp[i] = dp[i-1] + dp[i-2]
第 3 步: dp[0]=1, dp[1]=1
第 4 步: 从小到大
```

```javascript
function climbStairs(n) {
  let a = 1, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];    // 滚动变量，空间 O(1)
  }
  return b;
}
```

#### 案例二：换钱的最少货币数（零钱兑换，LeetCode 322）

**题目回顾**：给定面值数组 arr（每种可无限用）和目标 aim，求组成 aim 的最少货币数，无解输出 -1。

**为什么贪心会错（面试必讲的亮点）**：

```
面值 [1, 3, 4]，目标 6：
贪心(先用大的): 4 + 1 + 1 = 3 张 ❌
最优解:         3 + 3     = 2 张 ✅
```

贪心"先用大面值"的局部最优不能保证全局最优——这正是**必须用 DP** 的教科书理由。

**四步曲填空**：

```
第 1 步: dp[i] = 组出金额 i 需要的最少货币数
第 2 步: 最后一张货币必然是某个面值 c：
         dp[i] = min(dp[i - c]) + 1，c 取遍所有 ≤ i 的面值
第 3 步: dp[0] = 0（金额 0 需要 0 张）
第 4 步: i 从 1 到 aim 从小到大（"从小到大 + 每种面值无限用" = 完全背包）
```

**正确代码**：

```javascript
function coinChange(arr, aim) {
  const dp = new Array(aim + 1).fill(Infinity);
  dp[0] = 0;                                  // 初始化
  for (let i = 1; i <= aim; i++) {            // 枚举每个金额
    for (const c of arr) {                    // 枚举每种面值
      if (c <= i && dp[i - c] + 1 < dp[i]) {
        dp[i] = dp[i - c] + 1;                // 取更优解
      }
    }
  }
  return dp[aim] === Infinity ? -1 : dp[aim];
}

// 验证示例
// coinChange([5,2,3], 20) → 4  (5×4)
// coinChange([5,2,3], 0)  → 0
// coinChange([3,5], 2)    → -1 (2 无法组成)
```

> 注：文件早期版本尝试用"取模 + 递归换面值"的贪心思路，正是上面 [1,3,4] 凑 6 这类反例会出错的写法——这是学习 DP 的经典台阶，值得记住。

#### 案例三：最长递增子序列 LIS(300)

```
第 1 步: dp[i] = 以 nums[i] 结尾的 LIS 长度
第 2 步: dp[i] = max(dp[j]) + 1，其中 j<i 且 nums[j]<nums[i]
第 3 步: 全部初始化为 1(自己就是长度1的子序列)
第 4 步: 双层循环，i 从左到右
```

```javascript
function lengthOfLIS(nums) {
  const dp = nums.map(() => 1);
  let ans = 1;
  for (let i = 1; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
      }
    }
    ans = Math.max(ans, dp[i]);
  }
  return ans;
}
```

**DP 热题分级表**：

| 难度 | 题目 | 类型 |
| --- | --- | --- |
| ⭐ | 爬楼梯(70)、打家劫舍(198) | 线性 DP |
| ⭐⭐ | 零钱兑换(322)、最长递增子序列(300) | 背包 / LIS |
| ⭐⭐⭐ | 编辑距离(72)、最长公共子序列(1143) | 双串 DP |
| ⭐⭐⭐ | 零钱兑换 II(518)、分割等和子集(416) | 完全背包 / 01 背包 |

**小白坑点**：

1. 状态定义不清 → 后面全乱。**先写下"dp[i] 表示…"这句话再动手**
2. 01 背包与完全背包只差一个**遍历方向**（物品外层、容量倒序=01；正序=完全）
3. 初始化边界想当然——特别是 Infinity / 0 / 1 的选择

---

### 2.10 前缀和

**一句话人话**：预先算好"从头到每个位置的和"，任意区间和一步相减搞定——**一次预处理，多次 O(1) 查询**。

**生活类比**：里程桩——高速路每公里立个桩写着"距起点多少公里"，问你"第 30 到 50 公里之间多长"，看两个桩一减就行，不用重新量。

```javascript
// 构建前缀和: preSum[i] = 前 i 个元素之和
const preSum = [0];
for (let i = 0; i < nums.length; i++) {
  preSum[i + 1] = preSum[i] + nums[i];
}
// 区间 [l, r] 的和 = preSum[r+1] - preSum[l]    O(1)!
```

**进阶：前缀和 + 哈希（和为 K 的子数组(560)，经典组合）**

```javascript
function subarraySum(nums, k) {
  const count = new Map([[0, 1]]);   // 前缀和 0 出现 1 次
  let pre = 0, ans = 0;
  for (const x of nums) {
    pre += x;                        // 当前前缀和
    if (count.has(pre - k)) {
      ans += count.get(pre - k);     // 之前有 pre-k，差值就是 k
    }
    count.set(pre, (count.get(pre) || 0) + 1);
  }
  return ans;
}
```

**经典题**：区域和检索(303)、和为 K 的子数组(560)、连续数组(525)、除自身以外数组的乘积(238)。

**识别信号**：反复查询"**子数组的和**"（注意：子数组连续 → 前缀和；子序列不连续 → DP）。

---

### 2.11 位运算

**一句话人话**：直接操作二进制位，速度极快——面试常考的"奇技淫巧"收藏夹。

**必背操作表**：

```javascript
x & 1            // 判断奇偶: 结果 1 是奇数
x >> 1           // 除以 2 (向下取整)
x << 1           // 乘以 2
x & (x - 1)      // 消去最低位的 1   → 数 1 的个数 / 判断 2 的幂
x & (-x)         // 取出最低位的 1   (lowbit，树状数组基础)
a ^ b            // 异或: 相同为0不同为1
x ^ x = 0        // 自己异或自己 = 0
x ^ 0 = x        // 异或 0 不变
```

**三大高频题模板**：

```javascript
// 1. 只出现一次的数字(136)：其他都出现两次
//    全员异或，成对的抵消成 0，剩下的就是答案
function singleNumber(nums) {
  return nums.reduce((a, b) => a ^ b, 0);
}

// 2. 位 1 的个数(191)
function hammingWeight(n) {
  let count = 0;
  while (n) {
    n &= n - 1;   // 每次消一个 1
    count++;
  }
  return count;
}

// 3. 不用临时变量交换两个数
a = a ^ b;  b = a ^ b;  a = a ^ b;
```

---

### 2.12 单调栈

**一句话人话**：维护一个**栈内元素从底到顶递增（或递减）**的栈，遇到破坏规律的元素就弹栈结算——专门解决"**下一个更大元素**"类问题。

**生活类比**：排队等下一个更高的同学来"接手"——矮的同学一直等着，直到一个更高的来了，前面比他矮的全部被"清出去结算"。

**识别信号**：找每个元素**左边/右边第一个比它大/小**的元素；柱状图最大矩形。

**模板：每日温度(739)——找右边第一个更高温度**

```javascript
function dailyTemperatures(temps) {
  const res = new Array(temps.length).fill(0);
  const stack = [];                         // 存下标，栈内温度递减
  for (let i = 0; i < temps.length; i++) {
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {
      const j = stack.pop();                // j 的答案找到了
      res[j] = i - j;                       // 距离
    }
    stack.push(i);
  }
  return res;
}
```

**经典题**：下一个更大元素 I(496)、柱状图中最大的矩形(84)、接雨水(42，也可用双指针)。

---
## 第三部分：高级数据结构（进阶必备）

### 3.1 并查集（Union-Find）

**一句话人话**：高效管理"**分组**"的数据结构——秒答"这两个人是不是一个朋友圈"，并能随时合并两个圈。

**生活类比**：班级合并——2 班和 3 班合并春游，之后"谁和谁同队"瞬间可查；每个队选一个"队长"（代表元）代表全队。

**核心两个操作 + 路径压缩模板（背下来）**：

```javascript
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);  // 初始各自为政
    this.count = n;                                          // 连通分量数
  }
  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);  // 路径压缩：一路指向根
    }
    return this.parent[x];
  }
  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return;          // 已同组
    this.parent[ra] = rb;           // 合并
    this.count--;                   // 组数减 1
  }
}
```

**经典题**：岛屿数量(200，也可 BFS)、朋友圈(547)、被围绕的区域(130)、冗余连接(684)。

**识别信号**：动态合并集合、判断连通性、"有多少个组"。

---

### 3.2 字典树（Trie）

**一句话人话**：把一堆字符串按**公共前缀**存成一棵树——所有单词**共享前缀路径**，前缀查询极快。

```
存入: app, apple, apply
        root
         │ a
         │ p
         │ p ●(isEnd: app)
         │ l
         │ e ●(apple)
         │ y ●(apply)
```

**生活类比**：通讯录按字母分组——找"张三"先跳到 Z 区再找，不用从头翻。

```javascript
class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    const node = this._walk(word);
    return !!node && node.isEnd === true;
  }
  startsWith(prefix) {
    return !!this._walk(prefix);
  }
  _walk(s) {
    let node = this.root;
    for (const ch of s) {
      if (!node[ch]) return null;
      node = node[ch];
    }
    return node;
  }
}
```

**经典题**：实现 Trie(208)、单词搜索 II(212)、添加与搜索单词(211)。

**识别信号**：大量字符串的**前缀匹配 / 自动补全 / 词频统计**。

---

### 3.3 LRU Cache（设计题之王）

**一句话人话**：缓存满了先淘汰**最久没被使用**的数据——"最近最少使用"淘汰策略。

**生活类比**：书包容量有限——天天要用的课本放包里，一个月没翻过的练习册就拿出来。

**标准解法 = 哈希表 + 双向链表**（面试要求手写）：

* 哈希表：key → 链表节点，**O(1) 定位**
* 双向链表：维护使用顺序，**O(1) 移动/删除**

```javascript
class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();          // Map 本身保持插入顺序，可模拟
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);          // 删除再插入 = 变"最新"
    this.map.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.cap) {
      this.map.delete(this.map.keys().next().value);  // 淘汰最旧(第一个key)
    }
  }
}
```

> 进阶：严格 O(1) 且面试官要求手写双向链表版本时，用节点 `prev/next` 指针 + dummy 头尾实现；JS Map 版在大多数前端面试可接受。

**关联高频**：LFU 缓存(460，淘汰最不常用，更难)。

---

### 3.4 布隆过滤器（Bloom Filter）

**一句话人话**：一个超省内存的"**可能存在**判断器"——说**不存在就一定不存在**，说存在可能有误判（概率极小）。

**生活类比**：门卫的"黑名单速查卡"——卡片很薄记不全细节，**查到"没见过"就放行（一定对）**，查到"可疑"再进系统细查。

```
原理: 一个大位数组 + k 个哈希函数
插入: 把元素经 k 个哈希算出 k 个位置，全部置 1
查询: k 个位置全为 1 → "可能存在"(可能误判)
      任一位置为 0  → "一定不存在"(绝不误判)
```

**用途**：缓存穿透防护（先挡掉不存在的 key）、爬虫 URL 去重、垃圾邮件黑名单。

**特点**：空间效率极高；**不支持删除**（计数布隆可以）；有误判率但可控。

---

### 3.5 跳表 / 红黑树 / AVL（了解层级即可）

| 结构 | 一句话 | 用在哪 |
| --- | --- | --- |
| **AVL 树** | 严格平衡的二叉搜索树，查询最快，插入调整贵 | 读多写少 |
| **红黑树** | 近似平衡（黑高一致），增删改查都稳在 O(log n) | Linux 进程调度、HashMap 冲突链转树、C++ map |
| **跳表** | 有序链表 + 多级索引，实现简单，范围查询友好 | Redis 的 ZSet、LevelDB |

**面试口径**：为什么 Redis 用跳表不用红黑树？→ 实现简单、范围查询天然高效（链表顺藤摸瓜）、无旋转并发更友好。

---

## 第四部分：场景专题（覆盖完整场景）

### 4.1 面试高频题总清单（按场景分类）

| 场景 | 必刷题（LeetCode 编号） | 核心套路 |
| --- | --- | --- |
| 数组/字符串 | 1 两数之和、15 三数之和、53 最大子数组和、121 买卖股票 | 哈希/双指针/DP |
| 子串/子数组 | 3 无重复最长子串、560 和为K、76 最小覆盖子串 | 滑动窗口/前缀和 |
| 链表 | 206 反转、141 环形、21 合并、146 LRU | 快慢指针/dummy |
| 栈/队列 | 20 有效括号、739 每日温度、239 滑窗最大值 | 栈/单调栈/双端队列 |
| 二叉树 | 104 深度、226 翻转、102 层序、236 最近公共祖先 | 递归/BFS |
| 图/搜索 | 200 岛屿、207 课程表、994 腐烂橘子 | DFS/BFS/拓扑排序 |
| 二分 | 33 旋转数组、34 查找范围、69 平方根 | 二分/边界模板 |
| 排序 | 912 排序数组、56 合并区间、179 最大数 | 快排/归并/自定义比较 |
| 动态规划 | 70 爬楼梯、322 零钱兑换、300 LIS、72 编辑距离 | 四步曲 |
| 回溯 | 46 全排列、78 子集、22 括号生成、51 N皇后 | 模板三板斧 |
| 设计题 | 146 LRU、155 最小栈、208 Trie | 结构组合 |
| 位运算 | 136 只出现一次、191 位1个数 | 异或/消1 |

### 4.2 场景一：Top K 问题（海量数据找前 K 大）

**问题形态**：10 亿个数找最大的 100 个 / 数组第 K 大。

**方案对比**：

```
全排序:          O(n log n)，大材小用
堆(推荐):        维护容量 K 的小顶堆，遍历一遍 O(n log K) ✅ 内存友好
快速选择 quickselect: 平均 O(n) 就地求第 K 大，但改原数组
```

```javascript
// 第 K 大：容量 K 的小顶堆(堆顶是第 K 大的"守门员")
function findKthLargest(nums, k) {
  const heap = new MinHeap();               // 用 2.7 节的 MinHeap
  for (const x of nums) {
    heap.push(x);
    if (heap.a.length > k) heap.pop();      // 超员就踢掉最小的
  }
  return heap.pop();                         // 堆顶即第 K 大
}
```

**加分点**：数据大到内存放不下 → 分治（按哈希拆文件各求 Top K 再合并）。

### 4.3 场景二：接雨水(42)——一题三解

```
双指针:   左右指针 + 左右最大值, O(n)/O(1) ✅ 最优
单调栈:   按行接水, O(n)/O(n)
动态规划: 预处理每个位置左右最大高度, O(n)/O(n)
```

这题是"一题多解"的典范——面试能讲清三解的取舍直接加分。

### 4.4 场景三：字符串匹配

```
暴力:    逐位对齐比较, O(n·m)
KMP:     失配时利用已匹配前缀跳转, O(n+m) —— next 数组是难点
工程实践: 直接 indexOf/includes(底层高度优化), 面试重点讲思想
```

**识别信号**：在一个串里找模式串出现位置；或要求优于 O(n·m)。

---

## 第五部分：刷题路线与总结

### 5.1 四阶段刷题路线图

```
阶段一(打地基, 2 周): 数组/哈希/双指针/滑窗/二分
  → 目标: 30 题, 手写二分/双指针不出错
阶段二(建结构, 2 周): 链表/栈队列/树
  → 目标: 30 题, 反转链表/层序遍历能白板默写
阶段三(上套路, 2-3 周): 递归/回溯/BFS-DFS/贪心/DP
  → 目标: 40 题, 回溯模板/DP 四步曲内化
阶段四(冲综合, 持续): 高级结构/设计题/一题多解
  → 目标: 每类 5-10 题, 讲得出复杂度与取舍
```

**错题管理**：建一个错题表（题目/卡在哪/套路归类/重做日期），**3 天后、7 天后各重做一次**，两次都过才算掌握。

### 5.2 复杂度速查总表（贴在桌前）

| 场景 | 数据规模上限 | 可用算法 |
| --- | --- | --- |
| n ≤ 20 | 暴力枚举/回溯 | O(2ⁿ)、O(n!) |
| n ≤ 500 | 三重循环 | O(n³) |
| n ≤ 5000 | 双重循环 | O(n²) |
| n ≤ 10⁶ | 排序/哈希/双指针 | O(n log n)、O(n) |
| n 很大 | 二分/数学 | O(log n)、O(1) |

### 5.3 面试官视角：怎么判断你"真会了"

1. **能说出复杂度**：时间+空间，脱口而出
2. **能说"为什么"**：为什么用滑窗不用暴力？为什么贪心在这里不成立？
3. **能主动给边界**：空数组？单元素？重复值？溢出？
4. **能举一反三**：这题换个条件（有序变无序）还能这么做吗？
5. **代码命名清晰、先写伪代码再落地**——工程素养比炫技加分

### 5.4 术语速查表

| 术语 | 含义 |
| --- | --- |
| 大 O | 复杂度上界的粗略表示，看数量级不看常数 |
| 原地(in-place) | 只用 O(1) 额外空间 |
| 稳定排序 | 相等元素排序后相对顺序不变 |
| 贪心 | 每步局部最优，不回头 |
| 状态转移方程 | dp[i] 与更小子问题的递推关系 |
| 完全背包 | 每种物品可无限次使用（正序遍历容量） |
| 01 背包 | 每种物品最多用一次（倒序遍历容量） |
| 记忆化 | 递归 + 缓存，避免重复子问题 |
| 剪枝 | 回溯中提前砍掉不可能的分支 |
| 拓扑排序 | 有向无环图的依赖顺序（课程表） |
| 前缀和 | preSum[i] = 前 i 项之和，区间和 O(1) |
| lowbit | x & (-x)，取出最低位的 1 |

### 5.5 最后的话

算法入门的正确姿势：**不要追求题海，追求模板内化**。本文的每个模板都值得抄写三遍——第一遍照抄理解、第二遍默写对比、第三遍变形应用。当你能在白板上 5 分钟写出反转链表和二分查找，5 分钟讲清 DP 四步曲，热门面试算法就已经在你口袋里了。