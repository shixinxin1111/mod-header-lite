# Chrome 请求头插件实现计划

## 摘要

基于空仓库从 0 搭建一个 Chrome Manifest V3 浏览器插件，交付一个类似 ModHeader 的弹窗式请求头修改工具。

本期范围固定为：
- 顶部提供插件级**启用 / 停用**开关
- 仅支持修改**请求头**
- 弹窗内完成全部操作，不单独做 options 页面
- 左侧为**窄栏配置列表**，支持多个配置，且同一时刻仅启用一个配置
- 右侧为主编辑区，上半区编辑请求头，下半区编辑 URL 过滤规则
- 视觉上参考 ModHeader 的信息分区，但能力明显简化，只保留核心功能

## 当前状态分析

- 当前仓库路径：`/Users/bytedance/Desktop/Programing/chrome-plugin`
- 仓库现状：**空目录**
- 当前不存在任何现有代码、构建配置、Chrome 插件清单、UI 组件或文档
- 因为没有历史结构需要兼容，本次直接按绿色字段项目设计目录与文件

这意味着实现阶段需要一次性补齐：
- 工程初始化
- MV3 清单与构建配置
- Popup UI
- 本地持久化
- 动态请求头规则编译与同步

## 需求定稿

### 目标

做一个可加载到 Chrome 的本地插件，用户点击工具栏图标后打开弹窗，能像 ModHeader 一样在单个弹窗里管理配置、开关插件、编辑请求头，并用 URL 规则控制这些请求头何时生效。

### 成功标准

满足以下行为即视为完成：
- 能以 `Load unpacked` 方式在 Chrome 中加载
- 弹窗打开后顶部展示全局启用 / 停用开关
- 弹窗打开后展示左侧配置列表与右侧上下编辑区
- 可新增、切换、删除配置
- 可为当前启用配置新增、编辑、删除请求头
- 可为当前启用配置新增、编辑、删除 URL 过滤规则
- 插件停用时，不注入任何请求头
- 当访问命中过滤规则的请求时，插件会写入对应请求头
- 切换启用配置后，旧规则失效，新规则立即生效

### 已确认决策

- 顶部提供全局启用 / 停用开关
- 请求头范围：仅请求头
- 配置启用方式：单选启用
- 本期范围不包含“添加当前 URL”快捷功能

## 技术方案

### 总体架构

采用 `React + TypeScript + Vite + Tailwind CSS + Chrome Manifest V3`：

- `Popup`：承载全部交互界面
- `chrome.storage.local`：保存插件启用状态、配置数据与当前启用配置
- `chrome.declarativeNetRequest.updateDynamicRules`：将配置编译为浏览器动态规则，真正修改请求头
- `Background Service Worker`：负责规则同步、初始化与兜底监听

### 为什么选 declarativeNetRequest

Chrome MV3 已不适合继续依赖旧式阻塞型 `webRequest` 修改请求头。这里直接使用 `declarativeNetRequest`，优点是：
- 与 MV3 兼容
- 请求头修改是浏览器原生能力
- 配置变更后可重建动态规则，行为稳定

### 数据模型

#### 配置对象

```ts
type Profile = {
  id: string;
  name: string;
  headers: HeaderItem[];
  urlFilters: UrlFilterItem[];
};
```

#### 请求头条目

```ts
type HeaderItem = {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
};
```

#### URL 过滤条目

```ts
type UrlFilterItem = {
  id: string;
  pattern: string;
  enabled: boolean;
};
```

#### 存储对象

```ts
type ExtensionState = {
  extensionEnabled: boolean;
  profiles: Profile[];
  activeProfileId: string | null;
};
```

### 关键业务规则

#### 1. 插件启用规则

- 顶部开关控制整个插件是否生效
- `extensionEnabled === false` 时，立即清空全部动态规则
- `extensionEnabled === true` 时，根据当前启用配置重新生成动态规则

#### 2. 配置启用规则

- 左侧列表允许存在多个配置
- 任一时刻仅 `activeProfileId` 对应配置生效
- 删除当前启用配置时：
  - 若仍有其它配置，自动切到第一个配置
  - 若无其它配置，清空动态规则

#### 3. 请求头规则

- UI 层支持多条请求头
- 本期请求头操作统一使用 `set`
- 仅编译 `enabled === true` 且 `key/value` 非空的条目
- 为避免同一配置内行为不确定，**同名请求头只保留最后一条启用项**参与编译

#### 4. URL 规则

- UI 层支持多条 URL 过滤规则
- 每条规则为正则表达式文本
- 仅编译 `enabled === true` 且 `pattern` 非空的条目
- 正则不合法时在 UI 内提示错误，并禁止该条参与规则编译

#### 5. 动态规则编译策略

- 仅在插件全局开关开启时编译规则
- 仅根据当前启用配置生成规则
- 一个 URL 过滤条目编译为一条 DNR 规则
- 每条 DNR 规则内合并当前配置下全部有效请求头
- 若当前配置没有有效请求头或没有有效 URL 规则，则清空全部动态规则

编译后的单条规则形态：

```ts
{
  id: number,
  priority: 1,
  action: {
    type: "modifyHeaders",
    requestHeaders: [
      { header: "x-demo", operation: "set", value: "1" }
    ]
  },
  condition: {
    regexFilter: "^https?:\\/\\/example\\.com(?:\\/.*)?$",
    resourceTypes: ["main_frame", "sub_frame", "xmlhttprequest", "script", "image", "font", "media", "ping", "other"]
  }
}
```

## 界面方案

### Popup 布局

使用固定尺寸弹窗，优先桌面端体验，控制在 Chrome 插件弹窗可用范围内：
- 宽度约 `720px`
- 高度约 `560px`

布局结构：
- 顶部：全局启用开关 + 当前配置名称
- 左侧：约 `160px` 的窄栏配置列表
- 右侧：主编辑区
  - 上半区：请求头编辑器
  - 下半区：URL 过滤编辑器

### 顶部工具栏

职责：
- 提供插件全局启用 / 停用
- 显示当前激活配置名称

交互约束：
- 开关状态必须足够明显
- 停用后主编辑区保持可见，但顶部给出“当前不生效”的状态提示
- 不在本期加入撤销、导入导出、登录等额外操作

### 左侧配置列表

职责：
- 展示全部配置
- 高亮当前启用配置
- 提供新增配置入口
- 提供删除操作

交互约束：
- 列表项尽量紧凑，减少文案冗余
- 当前启用配置有明显激活态
- 删除操作需要二次确认，避免误删

### 右上：请求头编辑区

展示为可编辑表格，列为：
- 请求头名称
- 请求头值
- 启用开关
- 删除按钮

区域能力：
- 新增空白行
- 行内编辑
- 行内启停
- 删除单行

### 右下：URL 过滤编辑区

展示为可编辑列表，列为：
- 正则表达式
- 启用开关
- 删除按钮

区域能力：
- 新增空白规则
- 行内编辑
- 行内启停
- 删除单行
- 正则合法性提示

## 文件规划

以下文件均为本次实现新增：

### 工程与构建

- `package.json`
  - 安装 React、TypeScript、Vite、Tailwind 及扩展构建依赖
- `tsconfig.json`
  - TypeScript 编译配置
- `vite.config.ts`
  - Vite 构建配置，输出 popup 页面与 background 脚本
- `postcss.config.js`
  - Tailwind PostCSS 配置
- `tailwind.config.js`
  - Tailwind 扫描范围与主题变量

### 插件清单与静态资源

- `public/manifest.json`
  - Manifest V3 定义
- 声明 `storage`、`declarativeNetRequest` 权限
  - 配置 `action.default_popup`
  - 配置 `background.service_worker`
- `public/icons/icon16.png`
- `public/icons/icon32.png`
- `public/icons/icon48.png`
- `public/icons/icon128.png`

### Popup 入口与页面

- `popup.html`
  - Vite 入口 HTML
- `src/popup/main.tsx`
  - React 挂载入口
- `src/popup/App.tsx`
  - Popup 页面骨架
- `src/popup/index.css`
  - Tailwind 基础样式与少量自定义布局样式

### Popup 组件

- `src/popup/components/ProfileSidebar.tsx`
  - 左侧配置列表
- `src/popup/components/ProfileItem.tsx`
  - 单个配置项
- `src/popup/components/HeaderEditor.tsx`
  - 请求头编辑区
- `src/popup/components/UrlFilterEditor.tsx`
  - URL 规则编辑区
- `src/popup/components/SectionCard.tsx`
  - 统一卡片容器
- `src/popup/components/EmptyState.tsx`
  - 空状态提示

### 后台与共享逻辑

- `src/background/service-worker.ts`
  - 初始化时同步规则
  - 监听来自 popup 的状态变更消息
- `src/shared/types.ts`
  - 全部类型定义
- `src/shared/storage.ts`
  - `chrome.storage.local` 的读写封装
- `src/shared/dnr.ts`
  - 将当前启用配置编译为 DNR 动态规则
- `src/shared/defaults.ts`
  - 默认配置生成
- `src/shared/messages.ts`
  - popup 与 background 通信消息类型

## 实现步骤

### 1. 初始化工程

- 建立 Vite + React + TypeScript 工程
- 接入 Tailwind
- 配置多入口输出

### 2. 接入 Chrome MV3

- 编写 `manifest.json`
- 打通 popup 页面与 background service worker
- 声明所需权限

### 3. 建立状态与持久化

- 定义类型
- 实现默认状态
- 封装本地存储读写

### 4. 完成 Popup UI

- 搭建顶部 + 左右布局
- 完成顶部全局开关
- 完成配置列表
- 完成请求头编辑区
- 完成 URL 过滤编辑区
- 接入新增 / 删除 / 切换 / 编辑交互

### 5. 打通动态规则同步

- 根据当前启用配置编译 DNR 规则
- 接入全局启用 / 停用开关
- 状态变更后通知 background 重建规则
- 无有效规则时清空动态规则

### 6. 细化边界处理

- 正则校验提示
- 空配置兜底
- 删除启用配置后的回退逻辑
- 同名请求头覆盖策略

## 验证方案

### 本地静态验证

- TypeScript 类型检查
- ESLint 校验
- 不执行全量生产构建

### 手工功能验证

#### 验证 1：基础加载

- 在 Chrome 扩展页加载打包产物
- 插件能正常显示图标与弹窗

#### 验证 2：配置管理

- 新增两个配置
- 切换配置后右侧内容同步变化
- 删除当前配置后自动切换到剩余配置

#### 验证 3：全局启停

- 开启插件时，请求头规则生效
- 关闭插件时，请求头规则全部失效
- 再次开启后，按当前启用配置恢复规则

#### 验证 4：请求头注入

- 在配置 A 中添加 `x-debug: 1`
- 添加匹配测试站点的 URL 规则
- 打开 DevTools Network，确认命中请求包含该请求头

#### 验证 5：切换启用配置

- 配置 B 使用不同请求头
- 切换到配置 B 后，请求应仅携带配置 B 的头信息

#### 验证 6：异常输入

- 输入非法正则
- UI 立即提示错误
- 非法规则不应进入动态规则编译

## 假设与边界

- 本期不做响应头修改
- 本期不做配置导入导出
- 本期不做跨设备同步，统一使用 `chrome.storage.local`
- 本期不做独立 options 页面
- 本期不做复杂优先级系统，只允许单个配置生效
- 本期不做“添加当前 URL”快捷按钮
- 本期不做配置重命名，默认使用简单命名规则，如“配置 1 / 配置 2”

## 交付结果

执行该计划后，应得到一个能本地加载、具备实际请求头改写能力、交互结构接近 ModHeader、但能力聚焦于 4 个核心功能的 Chrome 插件 MVP。
