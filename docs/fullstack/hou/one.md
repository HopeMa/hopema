---
# sidebar: auto
# markdown:
#   -lineNumbers: true
---
# Docker · Kubernetes · Spring 全家桶 · 微服务架构
## 云原生后端工程能力面试题 · 由浅入深

> **对标岗位要求**：熟悉 Docker、Kubernetes 等容器化技术；熟悉 Spring、SpringBoot、SpringCloud 等主流开发框架；熟悉微服务并具备落地经验。
> **一句话定位**：Spring Boot 造服务，Docker 打包交付，Kubernetes 编排调度，Spring Cloud 治理微服务体系——四层能力串成"云原生后端"完整链路。

### 📚 知识体系总览

1. **Docker**：容器原理、镜像分层、Dockerfile 最佳实践、网络与存储、资源限制
2. **Kubernetes**：架构组件、Pod 生命周期、工作负载、Service/Ingress、探针、调度与弹性、故障排查
3. **Spring / Spring Boot**：IOC/AOP、Bean 生命周期、事务、自动装配、启动流程、新特性
4. **Spring Cloud**：注册发现、配置中心、OpenFeign、网关、熔断限流、链路追踪、分布式事务
5. **微服务落地**：拆分原则、通信选型、分布式 ID、灰度发布、演进路径
6. **场景设计**：容器化上云全流程、电商拆分、线上故障排查、雪崩治理

---

## 第一部分：Docker 容器化技术（初级 → 中级）

### Q1：容器和虚拟机有什么区别？

**答：**

| 维度 | 容器 | 虚拟机 |
| --- | --- | --- |
| 隔离级别 | 进程级（共享宿主内核） | 硬件级（独立 Guest OS 内核） |
| 启动速度 | 秒级 | 分钟级 |
| 体积 | MB 级 | GB 级 |
| 性能损耗 | 接近原生（无 Hypervisor） | 有虚拟化开销 |
| 密度 | 单机可跑上百容器 | 单机几十个 VM |
| 安全性 | 隔离弱于 VM（内核共享） | 强隔离 |

**面试要点**：容器本质是**被隔离的进程**——靠 Namespace 做视图隔离，Cgroups 做资源限制，不是轻量虚拟机。

---

### Q2：Docker 的核心概念与底层原理？

**答：**

* **三大概念**：镜像（只读模板）、容器（镜像的运行实例）、仓库（存镜像，如 Docker Hub / Harbor）
* **两大内核机制**：
  * **Namespace**：隔离"看得见什么"——PID（进程）、NET（网络）、MNT（挂载）、UTS（主机名）、IPC、User
  * **Cgroups**：限制"用得了多少"——CPU、内存、IO、进程数
* **联合文件系统（UnionFS / overlay2）**：镜像分层叠加的基础

---

### Q3：镜像为什么是分层的？容器写了文件存在哪？

**答：**

* 镜像由多个**只读层**叠加（每条 Dockerfile 指令 ≈ 一层），多镜像可**共享基础层**（省空间、拉取快）
* 容器启动时在顶部加一个**可写层（容器层）**：
  * **写时复制（CoW）**：修改镜像文件时，先把文件从只读层复制到可写层再改
  * 删除文件只是在可写层打"白障"标记，不真删
* `docker commit` 把容器层固化为新镜像（生产不推荐，应走 Dockerfile）

---

### Q4：Dockerfile 怎么写才专业？

**答：** 一份合格的 Dockerfile：

```dockerfile
# 多阶段构建：编译环境与运行环境分离
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline      # 依赖层单独缓存
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre        # 运行层用轻量 JRE
WORKDIR /app
COPY --from=builder /app/target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**最佳实践清单**：

1. **多阶段构建**：最终镜像不含编译工具链（小 50%+）
2. **变化少的指令放前面**：依赖层缓存复用，改代码不重下依赖
3. **合并 RUN、清理缓存**：`RUN apt-get update && apt-get install -y xxx && rm -rf /var/lib/apt/lists/*`
4. **.dockerignore**：排除 node_modules、.git、target
5. **非 root 用户运行**：`USER appuser`
6. **明确指定固定版本 tag**，不用 latest
7. 一容器一进程（日志、应用同容器是反模式）

---

### Q5：Docker 网络模式有哪些？

**答：**

| 模式 | 说明 | 场景 |
| --- | --- | --- |
| **bridge（默认）** | 虚拟网桥 docker0 + NAT，容器有独立 IP | 单机默认 |
| **host** | 共享宿主网络栈，无隔离，性能最好 | 对网络性能敏感 |
| **none** | 无网络 | 安全隔离/离线任务 |
| **container** | 共享另一容器网络 | K8s Pod 内容器互通的基础（pause 容器） |
| **overlay** | 跨主机容器互通 | Docker Swarm / 集群 |

**加分点**：K8s Pod 就是"一组容器共享一个 network namespace"——同 Pod 容器用 localhost 互通。

---

### Q6：容器数据怎么持久化？

**答：**

* **volume（推荐）**：由 Docker 管理（/var/lib/docker/volumes），与宿主路径解耦
* **bind mount**：挂载宿主任意目录，开发常用（源码热更新）
* **tmpfs**：内存挂载，敏感临时数据
* 生产建议：有状态服务（DB）不进容器，或走 K8s PV/PVC 体系

---

### Q7：容器怎么做资源限制？Java 应用容器化有什么坑？

**答：**

```bash
docker run -m 512m --cpus=1.5 my-app
# 或 K8s: resources.limits.memory: 512Mi
```

* 底层是 **cgroups**；内存超限会被 **OOM Kill**（exit code 137），CPU 超限只是**限流**（throttling）不杀

**Java 的经典坑**：

1. **JDK 8u191 之前**：JVM 看到的是宿主机内存/核数 → 容器限 512M 而 JVM 堆按宿主 32G 默认配置 → 被 OOM Kill
2. 新版 JDK（10+）默认感知 cgroup；仍建议显式设置：`-XX:MaxRAMPercentage=75.0`（留余地给堆外/metaspace/线程栈）
3. CPU 核数识别错误 → GC 线程、ForkJoinPool 并行度异常

---

### Q8：容器问题怎么排查？

**答：** 常用工具箱：

```bash
docker ps -a                    # 看状态与退出码（137=OOM，1=应用错误）
docker logs --tail 200 -f xxx   # 日志
docker exec -it xxx /bin/sh     # 进入容器
docker stats                    # 实时资源
docker inspect xxx              # 详细配置（IP/挂载/环境变量）
docker system df / prune        # 磁盘清理
```

**加分点**：容器里没 shell（distroless 镜像）时，用 `kubectl debug` / `nsenter` 从宿主侧进入命名空间排查。

---

## 第二部分：Kubernetes（中级 → 高级）

### Q9：K8s 的整体架构？

**答：**

```
┌────────────── 控制平面 Control Plane ──────────────┐
│  etcd：唯一状态存储（键值库）                        │
│  API Server：唯一入口，认证/校验/读写 etcd           │
│  Scheduler：调度决策（把 Pod 绑到哪个节点）           │
│  Controller Manager：控制器循环（期望状态→实际状态）  │
└─────────────────────────────────────────────────────┘
┌────────────── 数据平面 Node ────────────────────────┐
│  kubelet：节点代理，管理容器生命周期                 │
│  kube-proxy：Service 的虚拟 IP 转发规则             │
│  容器运行时：containerd / CRI-O                    │
└─────────────────────────────────────────────────────┘
```

**核心思想**：**声明式 API + 控制器模式**——你声明期望状态（3 个副本），控制器持续对比实际状态并自动纠偏（挂了一个就再起一个）。

---

### Q10：Pod 是什么？为什么它是最小调度单元而不是容器？

**答：**

* Pod = **一组共享网络（同一 IP，localhost 互通）、存储、生命周期的容器**，永远是调度的最小单位
* 为什么：有些应用天然多个进程紧耦合（主容器 + sidecar 日志收集/代理），它们要"同生共死、本地通信"
* **Pause 容器（根容器）**：Pod 中先启动，持有 network namespace，其他容器加入它的网络栈
* **Sidecar 模式**：把辅助能力（服务治理、文件同步）从主容器剥离——服务网格的基础

---

### Q11：Pod 的生命周期与常见异常状态？

**答：**

**状态机**：Pending（调度中/拉镜像）→ ContainerCreating → Running → Succeeded / Failed

**异常状态排查表**：

| 状态 | 含义 | 常见原因 |
| --- | --- | --- |
| **Pending** | 没跑起来 | 资源不足、调度约束不满足、PVC 未绑定 |
| **ImagePullBackOff** | 拉镜像失败 | 镜像名错、凭证错、仓库不通 |
| **CrashLoopBackOff** | 起来就崩，反复重启 | 应用启动异常、配置错、健康检查太早、OOM |
| **Evicted** | 被驱逐 | 节点资源压力（内存不足）、磁盘压力 |
| **OOMKilled** | 被杀 | 内存超 limit（exit 137） |

---

### Q12：常用工作负载有哪些？怎么选？

**答：**

| 资源 | 用途 | 关键点 |
| --- | --- | --- |
| **Deployment** | 无状态服务（默认选它） | 管理 ReplicaSet，支持滚动更新/回滚 |
| ReplicaSet | 维持副本数（一般不直接用） | 被 Deployment 管理 |
| **StatefulSet** | 有状态服务（DB、MQ） | 稳定的网络标识（pod-0/1/2）+ 独立 PVC，有序启停 |
| **DaemonSet** | 每节点跑一个 | 日志采集、监控 agent、网关 |
| **Job / CronJob** | 一次性 / 定时任务 | 批处理、报表 |

**面试要点**：无状态优先 Deployment；"有状态"指需要**稳定的身份或存储**，不是"用了数据库就算"。

---

### Q13：Service 有哪几种类型？Pod 之间怎么找到彼此？

**答：**

| 类型 | 访问方式 | 场景 |
| --- | --- | --- |
| **ClusterIP（默认）** | 集群内部虚拟 IP + DNS 名 | 服务间互调 |
| **NodePort** | 每节点开端口（30000-32767） | 临时外网暴露 |
| **LoadBalancer** | 云厂商 LB | 云上正式对外 |
| ExternalName | DNS CNAME 别名 | 引用外部服务 |
| Headless（clusterIP: none） | 不分配 VIP，直接解析到 Pod IP | StatefulSet、客户端负载均衡 |

**核心机制**：

* Pod IP 会变，**Service 提供稳定虚拟 IP**，靠 **Label Selector** 关联一组 Pod
* **Endpoints/EndpointSlice** 维护健康 Pod 列表
* **kube-proxy** 在每个节点维护转发规则（iptables 或 **ipvs**，大规模用 ipvs）
* 集群内 DNS：`服务名.命名空间.svc.cluster.local` 直接访问

---

### Q14：Ingress 和 Service 的区别？

**答：**

* Service 是 **L4**（TCP/UDP）转发；**Ingress 是 L7（HTTP/HTTPS）**：按域名/路径路由、TLS 终止、Rewrite
* Ingress 只是**规则资源**，需要 **Ingress Controller**（Nginx Ingress、Traefik、Gateway API）真正执行
* 典型链路：`外网 → LB → Ingress Controller → Service → Pod`
* **Gateway API** 是 Ingress 的下一代替代（角色化、更强表达力）

---

### Q15：ConfigMap 和 Secret 怎么用？

**答：**

* **ConfigMap**：非敏感配置；**Secret**：敏感数据（base64 编码，**不是加密**，需开 encryption at rest 或接 KMS/Vault）
* 注入方式：
  1. 环境变量（简单，**不热更新**）
  2. 挂载文件（subPath 挂法不热更新；目录挂法会自动更新）
  3. Spring Cloud K8s / 启动时主动拉取
* **面试要点**：配置变更生效路径要能说清——挂载热更新后应用是否感知？Java 应用通常需重启或监听刷新事件

---

### Q16：三种探针的区别？怎么配置才合理？

**答：**

| 探针 | 作用 | 失败后果 |
| --- | --- | --- |
| **livenessProbe 存活** | 应用是否死锁/僵死 | **重启容器** |
| **readinessProbe 就绪** | 是否能接流量 | **摘除 Service 端点**（不重启） |
| **startupProbe 启动** | 慢启动应用保护 | 通过前不执行前两者 |

**配置原则**：

* liveness 失败重启是"核武器"——检查逻辑要轻，**别把依赖故障当成本身死亡**（否则连环重启雪崩）
* readiness 必配：滚动更新时老 Pod 摘流量、新 Pod 验证通过才接流量，实现**零停机发布**
* Spring Boot 用 actuator：liveness → `/actuator/health/liveness`，readiness → `/actuator/health/readiness`

---

### Q17：requests / limits / QoS / HPA 是怎么回事？

**答：**

* **requests**：调度依据（保证量）；**limits**：上限（超内存被 OOMKill，超 CPU 被限流）
* **QoS 三级**（节点资源不足时按序驱逐）：
  1. **Guaranteed**：requests == limits（最后被驱逐）
  2. **Burstable**：requests < limits
  3. **BestEffort**：都没设（最先被驱逐）
* **HPA 自动扩缩容**：按 CPU/内存利用率或自定义指标（QPS）自动调副本数；配合 Cluster Autoscaler 扩节点
* 经验：线上服务至少 Guaranteed/Burstable，Java 服务 memory 的 request=limit 防 OOM 波动

---

### Q18：滚动更新是怎么实现的？怎么回滚？

**答：**

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 25%        # 最多多起多少（新）
    maxUnavailable: 0    # 同时最多不可用多少（旧）
```

* 流程：新 Pod 起 → **readiness 通过** → Service 摘旧 Pod → 旧 Pod 优雅终止（preStop + SIGTERM， terminationGracePeriodSeconds 默认 30s）
* **零停机三件套**：readinessProbe + maxUnavailable=0 + 优雅停机（Spring Boot 注册 shutdown hook，先摘流量再退出）
* 回滚：`kubectl rollout undo deployment/xxx --to-revision=2`
* 进阶发布：蓝绿（两套环境切流量）、金丝雀（小比例灰度，配合网关按权重）、Argo Rollouts

---

### Q19：K8s 存储体系：PV / PVC / StorageClass？

**答：**

* **PV**：集群级存储资源（管理员/动态供给创建）
* **PVC**：用户的"存储申请单"（容量、读写模式），绑定 PV
* **StorageClass**：动态供给模板（按 PVC 自动创建 PV，如 Ceph、云盘）
* 生命周期：PV 独立于 Pod 存在；StatefulSet 通过 volumeClaimTemplate 给每个 Pod 独立 PVC
* **回收策略**：Retain（保留需手动）/ Delete / Recycle（废弃）

---

### Q20：线上 Pod 挂了，你的排查 SOP 是什么？

**答：** 标准四步：

```bash
# 1. 看状态与事件（调度失败/镜像/探针失败一目了然）
kubectl get pod xxx -n prod
kubectl describe pod xxx -n prod      # Events 是金矿

# 2. 看日志（当前 + 上一次崩溃的）
kubectl logs xxx -n prod --tail=200
kubectl logs xxx -n prod --previous   # 上次崩溃日志，查 CrashLoop 必用

# 3. 看资源与事件趋势
kubectl top pod xxx -n prod          # 是否 CPU 打满/内存接近 limit

# 4. 进入容器/网络验证
kubectl exec -it xxx -- sh
kubectl run debug --rm -it --image=busybox -- sh   # 临时诊断容器
```

**思路**：describe 看"编排层"问题 → logs 看"应用层"问题 → top 看"资源层"问题，三层定位法。

---
## 第三部分：Spring / Spring Boot（中级）

### Q21：IOC 是什么？解决了什么问题？

**答：** IOC（控制反转）：**对象的创建与依赖关系的维护，从程序员手动 new 反转给容器管理**。DI（依赖注入）是实现方式。

**解决的问题**：

* 解耦：对象不用自己 new 依赖，只声明需要什么（构造器注入）
* 可测试：单测时轻松注入 Mock
* 生命周期统一管理：单例复用、销毁回调

```java
@Service
public class OrderService {
    private final PaymentClient paymentClient;   // 构造器注入（官方推荐）
    public OrderService(PaymentClient paymentClient) {
        this.paymentClient = paymentClient;
    }
}
```

**面试要点**：推荐**构造器注入**——不可变、依赖显式、启动期就暴露循环依赖问题（而不是运行时才炸）。

---

### Q22：AOP 的原理与应用场景？

**答：** AOP（面向切面）：把日志、事务、权限等**横切逻辑**从业务代码抽离，织入到指定连接点。

* **动态代理两种实现**：
  * **JDK 动态代理**：基于接口（`Proxy.newProxyInstance`）
  * **CGLIB**：继承目标类生成子类（无接口也行，final 类/方法不行）；Spring Boot 默认 CGLIB
* **核心概念**：切面 Aspect、切点 Pointcut、通知 Advice（@Before/@After/@Around）、织入
* **典型应用**：`@Transactional` 声明式事务、日志埋点、接口限流、权限校验、链路追踪打标

---

### Q23：Bean 的生命周期？

**答：** 五大阶段（面试按此顺序答）：

```
1. 实例化（反射调用构造器）
2. 属性填充（依赖注入 @Autowired）
3. 初始化 Aware 回调 → BeanPostProcessor 前置 →
   @PostConstruct / afterPropertiesSet / init-method →
   BeanPostProcessor 后置（AOP 代理在这里生成）
4. 使用（单例存入单例池）
5. 销毁 @PreDestroy → destroy-method（容器关闭时）
```

**加分点**：AOP 代理对象是在 **BeanPostProcessor（AnnotationAwareAspectJAutoProxyCreator）** 阶段替换进容器的；常见的"注入的是代理"问题由此而来。

---

### Q24：Spring 怎么用三级缓存解决循环依赖？

**答：**

* **问题**：A 依赖 B，B 又依赖 A——创建 A 时要注入 B，创建 B 时又要 A，死循环
* **三级缓存**：

```
一级 singletonObjects：成品 Bean
二级 earlySingletonObjects：提前暴露的半成品（已实例化未填充）
三级 singletonFactories：ObjectFactory 工厂（决定是否返回 AOP 代理）
```

* **流程**：A 实例化后先把工厂放三级缓存 → 填充属性发现要 B → 创建 B → B 要 A，从三级缓存拿到 A 的早期引用（若是代理则生成代理）→ B 完成 → A 拿到 B，继续完成
* **解决不了的场景**：**构造器循环依赖**（还没实例化没法暴露）、prototype 作用域、`@Async` 等滞后代理场景

---

### Q25：Bean 的作用域有哪些？

**答：**

| 作用域 | 说明 |
| --- | --- |
| **singleton（默认）** | 容器内一个实例 |
| prototype | 每次注入/获取新建 |
| request / session / application | Web 场景 |
| websocket | WebSocket 会话 |

**经典坑**：singleton Bean 注入 prototype Bean 时只注入一次 → 用 `@Lookup`、`ObjectProvider<T>` 或 `ScopedProxyMode.TARGET_CLASS` 解决。

---

### Q26：事务的传播行为有哪些？

**答：** 面试必背 3 个，了解其余：

| 传播行为 | 含义 |
| --- | --- |
| **REQUIRED（默认）** | 有事务就加入，没有就新建 |
| **REQUIRES_NEW** | 挂起当前事务，**总是开新事务**（内层回滚不影响外层已提交逻辑，日志/审计场景） |
| **NESTED** | 嵌套事务（保存点），内层回滚到保存点，外层可继续 |
| SUPPORTS | 有就加入，没有就非事务跑 |
| NOT_SUPPORTED / NEVER / MANDATORY | 挂起 / 禁止 / 强制要求事务 |

**子事务异常是否影响外层**：默认 REQUIRED 下内层回滚标记会传导，外层提交时抛 UnexpectedRollbackException。

---

### Q27：@Transactional 什么时候会失效？（高频）

**答：** 失效八连（本质：代理没生效 / 异常没抛到代理层）：

1. **同类内部调用**：`this.methodB()` 不走代理 → 拆到另一个 Bean 或注入自身代理
2. 方法不是 **public**
3. 异常被 **try-catch 吞了**（代理看不到异常）
4. 抛出**受检异常**默认不回滚 → `@Transactional(rollbackFor = Exception.class)`
5. 数据库引擎不支持事务（MyISAM）
6. **类没被 Spring 管理**（没加 @Service / 手动 new）
7. 传播行为配置错误（NOT_SUPPORTED）
8. 多线程中调用（事务绑定 ThreadLocal 连接）

---

### Q28：Spring Boot 自动装配原理？

**答：** 从 `@SpringBootApplication` 说起：

```
@SpringBootApplication
 = @SpringBootConfiguration（配置类）
 + @ComponentScan（扫描主类包）
 + @EnableAutoConfiguration  ← 核心
```

* `@EnableAutoConfiguration` 通过 `@Import(AutoConfigurationImportSelector.class)` 触发
* 加载所有依赖 jar 中 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`（2.7+ 新位置，旧版是 spring.factories）里的自动配置类
* 配置类上的**条件注解**决定是否生效：`@ConditionalOnClass`（类路径有 X 才生效）、`@ConditionalOnMissingBean`（用户没自定义才给默认值）、`@ConditionalOnProperty`
* 效果：**引入 starter → 满足条件 → Bean 自动进容器**，约定优于配置

**面试要点**：能自己写一个 starter（XXXAutoConfiguration + 条件注解 + AutoConfiguration.imports 注册）是加分项。

---

### Q29：Spring Boot 的启动流程？

**答：** 主线八步：

```
1. SpringApplication.run() 启动，推断应用类型（Servlet/Reactive）
2. 准备 Environment（加载 application.yml、环境变量、命令行参数，优先级覆盖）
3. 创建并准备 ApplicationContext
4. refresh() 上下文：
   → 扫描 @Component 注册 BeanDefinition
   → 执行 AutoConfiguration 导入
   → onRefresh() 内嵌 Tomcat/Jetty 启动
   → 实例化所有单例 Bean
5. 发ApplicationRunner/CommandLineRunner
6. 发布 ready 事件 → 启动完成
```

**加分点**：Spring Boot 3 后同时提供了 `SpringApplication.from(...)` 与 AOT 处理链；启动慢排查可用 `spring-startup-analyzer` 或 Banner 日志时间线。

---

### Q30：Spring Boot 3.x 有什么新特性？

**答：**

1. **基线升级**：JDK 17+、Jakarta EE 9+（javax → jakarta 命名空间迁移）
2. **GraalVM Native Image**：AOT 编译成本地镜像，**毫秒级启动、低内存**——Serverless/CLI 场景利器（代价：构建慢、反射需配置、动态性受限）
3. **可观测性**：Micrometer Observation API 统一 metrics + tracing
4. **虚拟线程（JDK 21，可选用）**：`spring.threads.virtual.enabled=true`——**每请求一个虚拟线程**，阻塞式写法获得接近高并发的吞吐，不必全面 reactive 化
5. REST Client 替代 RestTemplate、支持 Problem Details 等

---

## 第四部分：Spring Cloud（高级）

### Q31：Spring Cloud 全家桶有哪些组件？各自解决什么问题？

**答：**（以 Alibaba 系为主线，面试主流）

| 问题域 | 组件 | 说明 |
| --- | --- | --- |
| 服务注册发现 | **Nacos**（Eureka 已停更） | 服务上下线、健康检查 |
| 配置中心 | **Nacos Config** | 动态配置、灰度发布 |
| 服务调用 | **OpenFeign** + LoadBalancer | 声明式 HTTP 客户端 |
| 网关 | **Spring Cloud Gateway** | 统一入口、路由、鉴权、限流 |
| 熔断限流 | **Sentinel**（Hystrix 停更） | 流控、熔断、系统自适应保护 |
| 链路追踪 | Micrometer Tracing / SkyWalking | 全链路 TraceId |
| 分布式事务 | **Seata** | AT/TCC/SAGA 模式 |
| 消息总线 | RocketMQ / Kafka | 事件驱动解耦 |

**面试要点**：按"问题域 → 组件"记忆，而不是背清单——追问时能讲"为什么需要它"。

---

### Q32：Nacos 注册中心的原理？

**答：**

* **注册**：服务启动时向 Nacos 注册（服务名 → IP:Port + 元数据）
* **健康检查**：
  * **临时实例（默认）**：客户端**心跳**上报（5s 一次，15s 未收到标记不健康，30s 剔除）——AP 模式
  * 持久化实例：服务端主动探测——CP 模式
* **发现**：客户端**本地缓存**服务列表 + **定时拉取 + UDP 推送**变更（不是每次调用都查注册中心）
* **AP/CP 切换**：临时实例走 Distro 协议（AP，可用性优先），持久实例走 Raft（CP，一致性优先）
* 对比 Eureka：Nacos 支持服务端推送、配置中心二合一、健康检查更灵活

---

### Q33：OpenFeign 的原理？怎么优化？

**答：**

* **原理**：`@FeignClient` 接口 + `@EnableFeignClients` → 启动时扫描生成**JDK 动态代理** → 调用方法时：解析注解元数据 → 拼装 HTTP 请求 → 负载均衡选实例（LoadBalancer）→ HTTP 客户端发送 → 解码响应

```java
@FeignClient(name = "order-service", path = "/api/orders")
public interface OrderClient {
    @GetMapping("/{id}")
    OrderDTO getById(@PathVariable Long id);
}
```

* **优化清单**：
  1. 替换默认客户端为 **Apache HttpClient / OkHttp + 连接池**
  2. 配置**超时**（connect/read 分开设）
  3. **重试要幂等**（默认不重试；重试配 Ribbon/Resilience 级别）
  4. 日志级别 BASIC（生产别开 FULL）
  5. 熔断降级兜底（fallbackFactory 拿到异常）
  6. HTTP/2、压缩、GET 请求缓存

---

### Q34：Spring Cloud Gateway 的核心概念？

**答：** 三大件：

* **Route 路由**：目的地（URI）+ 断言 + 过滤器的组合
* **Predicate 断言**：匹配条件（Path、Method、Header、Query、时间、权重）
* **Filter 过滤器**：前置/后置处理（改写路径、鉴权、限流、加 TraceId）

```yaml
spring.cloud.gateway.routes:
  - id: order-route
    uri: lb://order-service        # 负载均衡到注册中心服务
    predicates:
      - Path=/api/order/**
    filters:
      - StripPrefix=1
```

* 基于 **WebFlux + Netty**（响应式非阻塞），**不要在网关写阻塞代码**
* 典型职责：统一鉴权（JWT 校验）、限流（RequestRateLimiter + Redis 令牌桶）、灰度路由（按 header 权重）、日志与 TraceId 注入

---

### Q35：Sentinel 和 Hystrix 的区别？

**答：**

| 维度 | Sentinel | Hystrix（停更） |
| --- | --- | --- |
| 隔离策略 | **信号量**并发隔离（轻量） | 线程池 / 信号量 |
| 熔断策略 | 慢调用比例 / 异常比例 / 异常数 | 异常比例 |
| 流量整形 | **QPS/并发限流、Warm Up、匀速排队** ✅ | 无 |
| 系统自适应保护 | 有（Load/RT 综合入口限流）✅ | 无 |
| 控制台 | 规则动态下发、实时监控 ✅ | 较弱 |
| 规则持久化 | 需接 Nacos/Apollo | — |

**必答**：Sentinel 的核心是**滑动窗口统计 + 责任链插槽**（NodeSelectorSlot → ClusterBuilderSlot → StatisticSlot → FlowSlot → DegradeSlot...）。

---

### Q36：分布式链路追踪的原理？

**答：**

* 核心模型：**Trace**（一次完整请求链）→ **Span**（一次调用段）→ 通过 **TraceId 串联、SpanId 表父子关系**
* 数据传播：TraceId/父 SpanId 放在请求头（W3C traceparent / B3 头），跨服务透传
* Java 侧：字节码增强（SkyWalking agent，无侵入）或 Micrometer Tracing（Boot 官方，代码级）
* **落地价值**：一次慢请求，看到全链路中每段耗时、异常在哪个服务、MQ 消息卡在哪
* 采样策略：全采（调试）、按比例、按错误优先采

**面试要点**：能讲"一次用户请求 → 网关 → 订单 → 库存 → DB"的 TraceId 传递路径。

---

### Q37：Seata 的 AT 模式原理？

**答：** Seata 四种模式：**AT（默认，全自动）**、TCC、SAGA、XA。

* **AT 模式三角色**：TM（事务发起者）、RM（资源管理器，业务 DB）、TC（事务协调者，独立部署）
* **两阶段**：
  * 一阶段：业务 SQL 执行时，代理数据源自动生成**前后镜像 undo_log**，与业务在同一本地事务提交 → 全局锁注册
  * 二阶段提交：异步删 undo_log（很快）；**回滚：用 undo_log 反向补偿**
* **核心机制**：通过 `xid` 全局事务 ID 在服务间透传（Feign 拦截器/头）；回滚时校验后镜像与当前数据一致（防脏写）
* **适用**：短事务、内部服务；对性能要求极高或跨外部系统时用 TCC/SAGA

---
## 第五部分：微服务架构与落地（高级 → 专家）

### Q38：微服务怎么拆分？有什么原则？

**答：**

**拆分维度**：

1. **按业务域（DDD 推荐）**：限界上下文 → 用户、订单、库存、支付、营销
2. 按业务能力 / 按领域事件（一个聚合一个服务）
3. 康威定律：组织结构决定架构——**团队自治边界 = 服务边界**

**拆分原则（面试必答）**：

* **单一职责 + 高内聚低耦合**：一个服务只管一个业务域
* **围绕业务能力而非技术分层**（不要"数据库服务/工具服务"这种技术拆分）
* **数据私有**：每个服务独占自己的库，**禁止跨库直连**（只能 API/事件交互）
* **先粗后细**：初期 3~5 个服务，随团队与流量演进，避免"纳米服务"
* 独立部署、独立伸缩、独立故障域

**拆分过细的代价**：分布式事务、链路复杂、运维成本、联调困难——拆分是**用复杂度换伸缩性与团队并行度**。

---

### Q39：服务间通信怎么选型？

**答：**

| 方式 | 技术 | 适用 | 注意 |
| --- | --- | --- | --- |
| **同步 REST** | OpenFeign | 通用、低延迟强响应 | 级联超时、雪崩风险 |
| **同步 gRPC** | gRPC/Protobuf | 内部高频调用、性能敏感 | 跨语言、序列化小；可调试性差 |
| **异步 MQ** | Kafka / RocketMQ | 解耦、削峰、事件通知 | 消息可靠性、幂等消费 |
| 混合 | 查询走同步 + 状态变更走事件 | 订单创建（同步扣库存 + 异步发通知） | — |

**判断口诀**：**要马上知道结果 → 同步；只要最终一致 → 事件驱动（优先）**。同步链路越长越脆弱，能用事件解耦就用事件。

---

### Q40：微服务带来了哪些新问题？分别怎么解决？

**答：**（体现"落地经验"的答题框架）

| 新问题 | 解决方案 |
| --- | --- |
| 服务去哪找（实例动态变化） | 注册中心 Nacos |
| 配置散落各处 | 配置中心 + 动态刷新 |
| 一个请求跨 N 个服务，排障难 | 链路追踪 + 集中日志（TraceId 串联） + 指标监控 |
| 雪崩连锁反应 | 熔断限流降级（Sentinel）+ 超时与舱壁隔离 |
| 跨服务数据一致性 | Seata / 消息最终一致 |
| 接口契约变动互相伤害 | 契约测试、版本化、灰度兼容 |
| 部署复杂度暴涨 | K8s + CI/CD + 服务网格 |
| 定时任务重复执行 | 分布式调度（XXL-Job） / 分片 |

**面试表达**：别只说"用了什么组件"，要说**"什么问题逼我们引入了它"**。

---

### Q41：分布式 ID 有哪些方案？

**答：** 分库分表与微服务链路追踪都需要全局唯一 ID：

| 方案 | 优点 | 缺点 |
| --- | --- | --- |
| UUID | 简单、无协调 | 无序（B+ 树页分裂）、太长、不含业务含义 |
| 数据库号段模式 | 趋势递增、DB 压力小（一次取一段） | 仍依赖 DB（双 buffer 优化） |
| **雪花算法 Snowflake** | 趋势递增、本地生成无网络开销、高性能 | 时钟回拨问题（等待/备用位）；机器 ID 分配需治理 |
| Redis INCR | 简单 | 网络 IO、持久化窗口风险 |
| Leaf /UidGenerator | 美团/百度开源，工程化完整 | 引入组件 |

**雪花结构**：41 位时间戳 + 10 位机器 ID + 12 位序列号（理论 409 万/秒/机器）。

---

### Q42：灰度发布 / 蓝绿部署 / 金丝雀发布怎么实现？

**答：**

* **蓝绿**：两套完整环境，切流量（快速回滚，成本×2）
* **金丝雀/灰度**：新版本先接 5% 流量 → 观察指标 → 逐步放量
* **实现层次**：
  * K8s 原生：两个 Deployment + Service selector / Argo Rollouts
  * **网关层（最常用）**：Gateway 按用户 ID 尾号/城市/权重路由到不同版本
  * 注册中心元数据：实例打版本标签，负载均衡按标签分流
* **配套**：监控对齐（新旧版本成功率/RT 对比）、一键回切预案、按用户白名单先灰内部员工

---

### Q43：如何从单体演进到微服务？（绞杀者模式）

**答：** 不要"大爆炸重写"，按绞杀者模式（Strangler Fig）渐进：

```
1. 先立规矩：新功能一律独立服务，老单体只减不增
2. 选边缘模块试点（风险低）：如通知、文件服务剥离
3. 网关做流量切换：老路径 → 单体，新路径 → 新服务
4. 数据解耦：先共库不同 schema → 再拆库 + 数据双写/同步迁移
5. 逐步绞杀核心模块（订单/库存），老单体最终退役
6. 全程：契约测试保护 + 灰度切换 + 可回滚
```

**面试要点**：强调**数据拆分比代码拆分更难**——接口可以适配，数据耦合才是单体的根。

---

### Q44：服务网格（Istio）解决什么问题？和 Spring Cloud 什么关系？

**答：**

* Spring Cloud 把治理能力做在**SDK 里**（业务进程内），换语言要重写、升级要改业务
* 服务网格把治理（熔断/重试/加密/流量切分/可观测）下沉到 **Sidecar 代理（Envoy）**，业务只管发请求 → **语言无关、业务无侵入**
* Istio 组件：数据面（Envoy sidecar）+ 控制面（istiod 下发规则）
* 现实建议：中小团队 Spring Cloud 够用；多语言、超大规模、想业务与治理彻底解耦时上网格（复杂度不低）

---

## 第六部分：综合场景设计题（专家）

### Q45：场景题：把一个 Spring Boot 单体应用容器化并部署到 K8s，完整流程？

**答：** 端到端答全（考察工程完整度）：

```
1. 应用改造
   → 配置外部化（环境变量/ConfigMap，12-factor）
   → 日志输出 stdout（采集交给集群，别写容器文件）
   → 优雅停机：接收 SIGTERM → 摘流量 → 处理完在途请求再退出
   → 健康检查端点：/actuator/health/liveness + readiness

2. 构建镜像
   → 多阶段构建（Maven 构建层 + JRE 运行层）
   → JVM 容器参数：-XX:MaxRAMPercentage=75，开启容器感知
   → 推送私有仓库（Harbor），镜像 tag 用 git commit 而非 latest

3. 编写 K8s 清单（或 Helm Chart）
   → Deployment：副本数、resources requests=limits（Guaranteed）
   → 探针三件套 + preStop 钩子
   → 滚动策略 maxUnavailable=0
   → ConfigMap 挂配置 + Secret 挂凭证
   → Service + Ingress 暴露

4. 发布与验证
   → CI/CD 流水线：构建→测试→扫描（镜像漏洞/密钥）→部署 staging→验证→prod
   → 金丝雀发布，观察成功率/RT/日志，异常一键回滚
```

---

### Q46：场景题：电商系统怎么拆微服务？

**答：** 参考拆分 + 关键链路设计：

```
网关 Gateway
 ├── 用户服务（注册/登录/会员）→ 用户库
 ├── 商品服务（商品/类目/搜索→ES）→ 商品库
 ├── 订单服务（下单/订单状态机）→ 订单库（分库分表按 user_id）
 ├── 库存服务（扣减/预占）→ 库存库（Redis 预扣 + DB 兜底）
 ├── 支付服务（对接渠道/回调）→ 支付库
 ├── 营销服务（券/活动）
 └── 通知服务（MQ 消费 → 短信/推送）

下单关键链路：
 同步：下单 → 锁库存（Redis）→ 生成订单（事务）
 异步：订单创建事件 → MQ → 通知/积分/物流/风控消费
 一致性：本地消息表/事务消息 保证 订单+库存 最终一致
 高峰：秒杀流量 网关限流 → Redis 预扣 → MQ 削峰
```

**面试要点**：说明"哪些用同步、哪些用事件"、"热点数据（库存）怎么扛"、"订单分库分表怎么查商家维度（基因法/异构 ES）"。

---

### Q47：场景题：线上服务突然 CPU 100% / 频繁重启，怎么排查？

**答：** 容器 + Java 组合排查（K8s 场景高频）：

```
1. 定位对象
   kubectl top pod → 找到异常 Pod
   kubectl get pod -o wide → 所在节点
2. 看类型：是 CPU 打满 还是 OOMKilled（describe 看 exit code 137?）
3. CPU 打满（JVM 内）：
   kubectl exec -- jps / top -H -p 1      # 容器内找 hottest 线程
   jstack <pid> | grep <tid-hex> -A 20    # 线程栈定位代码
   或 Arthas：thread -n 3 直接看最忙线程
   常见根因：死循环、频繁 Full GC（jstat -gcutil 看）、正则回溯、序列化大对象
4. OOMKilled：
   看是堆内 OOM（java.lang.OutOfMemoryError 日志）还是容器 limit 杀（exit 137 无堆栈）
   堆 dump：jmap -dump 分析（MAT）找大对象
   limit 杀 → 调 MaxRAMPercentage 或加 limit
5. 止血：先扩副本/重启/回滚版本，再找根因
```

**加分**：说出"Full GC 频繁 → 老年代涨太快 → 大查询/缓存全量加载"这类因果链。

---

### Q48：场景题：一次发布后，整个系统雪崩了，怎么办？

**答：** 应急 + 根因 + 长治（考察治理经验）：

```
应急（先恢复再说）：
 1. 回滚版本（K8s rollout undo，分钟级）
 2. 回滚无效 → 依赖故障：降级开关打开（兜底数据/简化流程）
 3. 流量入口限流（网关 QPS 阈值下调），保住核心链路
 4. 扩容非故障侧服务，隔离故障域

根因分析（用链路追踪）：
 按 TraceId 串联 → 定位最初超时的服务/DB/Redis
 常见根因：新版本慢 SQL、连接池耗尽、下游 RT 上升 → 线程池打满 → 级联
 为什么会"雪崩"而不只是单个服务慢：没有超时/熔断/舱壁隔离

长期治理：
 ① 所有调用必设超时（下游 P99×2）
 ② 核心依赖全部接熔断降级（Sentinel）
 ③ 线程池/连接池隔离（舱壁模式）
 ④ 发布强制灰度 + 指标卡点（成功率下跌自动暂停放量）
 ⑤ 混沌演练常态化
```

---

### Q49：反向题：什么情况下不该上微服务 / K8s？

**答：**（考察判断力，加分利器）

**不该上微服务**：

* 团队 < 10 人、业务早期边界未稳定 → 单体（模块化单体）迭代最快
* 流量很小、无独立伸缩需求
* 没有配套 DevOps 能力（CI/CD、监控、注册中心）——微服务的复杂度会直接压垮小团队

**不必急着上 K8s**：

* 几个服务、几台机器 → Docker Compose / 云主机足够
* 强状态服务（DB）上 K8s 收益低、运维复杂（有状态运维能力要求高）

**正确姿势**：单体起步 → 模块化清晰 → 团队与流量到了瓶颈 → 按业务域渐进拆分（绞杀者模式）。

---

## 附录 A：术语速查表

| 术语 | 含义 |
| --- | --- |
| Namespace / Cgroups | 容器两大基石：视图隔离 / 资源限制 |
| OverlayFS / CoW | 镜像分层文件系统 / 写时复制 |
| 声明式 API | 描述期望状态，控制器自动纠偏（K8s 核心） |
| Sidecar | Pod 内辅助容器（代理/日志），服务网格基础 |
| QoS | Guaranteed / Burstable / BestEffort 三级驱逐顺序 |
| CrashLoopBackOff | 容器反复崩溃重启的 K8s 状态 |
| HPA | Pod 水平自动扩缩容 |
| Ingress | L7 路由规则（域名/路径 → Service） |
| IOC / AOP | 控制反转（容器管理对象）/ 面向切面（横切逻辑织入） |
| 三级缓存 | Spring 解决单例 Bean 循环依赖的机制 |
| 自动装配 | @EnableAutoConfiguration + 条件注解按需注入 Bean |
| AT 模式 | Seata 两阶段：undo_log 镜像 + 反向补偿 |
| Nacos Distro/Raft | 临时实例 AP 协议 / 持久实例 CP 协议 |
| 绞杀者模式 | 用新服务逐步替换单体老模块的渐进改造法 |
| 雪花算法 | 时间戳+机器+序列的分布式趋势递增 ID |
| TraceId / SpanId | 链路追踪：全链路串联 / 调用父子关系 |

## 附录 B：面试官高频追问清单

* 你的服务镜像是怎么构建的？多大？怎么瘦身？（多阶段构建 + JRE 基础镜像）
* Pod 一直 CrashLoopBackOff，说出前三个排查动作？（describe Events → logs --previous → 探针配置）
* K8s 上怎么做到发布零停机？（readiness + maxUnavailable=0 + preStop 优雅停机）
* @Transactional 同类方法调用为什么失效？怎么改？（代理机制 → 拆 Bean / 自注入代理）
* Feign 默认有重试吗？什么情况下敢开重试？（幂等才敢）
* Nacos 挂了，服务还能调通吗？（客户端本地缓存列表，新实例不可发现）
* 订单和库存跨服务，怎么保证一致性？（同步 Seata AT / 异步本地消息表，说明取舍）
* 为什么你的服务 QoS 要设 Guaranteed？（防驱逐 + 内存稳定）
* 微服务拆了之后最难的是什么？（答"数据拆分与一致性、排障复杂度"比答"搭建"加分）
* 如果重新给你一次机会，还会这么拆吗？（考察复盘意识）