# Mod Header Lite

一个基于 `Chrome Manifest V3` 的轻量请求头修改插件，交互结构参考 ModHeader，但只保留最核心的能力：

- 全局启用 / 停用
- 多配置管理，同一时刻仅一个配置生效
- 请求头编辑
- URL 正则规则编辑
- 基于 `declarativeNetRequest` 的动态规则同步

## 技术栈

- `React 19`
- `TypeScript 5.9`
- `Vite 8`
- `Tailwind CSS 4`
- `ESLint + Prettier`
- `Vitest`
- `Chrome Manifest V3`

## 本地安装

```bash
pnpm install
```

## 本地开发

启动开发服务器：

```bash
pnpm dev
```

说明：

- 开发页面入口为 `http://localhost:5173/popup.html`
- `index.html` 也会指向同一套 popup 界面，方便本地快速预览
- 这个开发服务器主要用于调试 UI，不等同于可直接加载到 Chrome 的扩展产物

## 本地调试

### 1. 调试 Popup UI

先启动开发服务器：

```bash
pnpm dev
```

然后访问：

```text
http://localhost:5173/popup.html
```

适合调试内容：

- popup 布局与视觉样式
- 表单输入交互
- 配置切换逻辑

注意：

- 在普通浏览器页面中，`chrome.storage` 和 `chrome.declarativeNetRequest` 不可用
- 这类能力需要在真实扩展环境中验证

### 2. 调试真实扩展能力

先构建扩展产物：

```bash
pnpm build
```

然后在 Chrome 中加载：

1. 打开 `chrome://extensions`
2. 开启右上角“开发者模式”
3. 点击“加载已解压的扩展程序”
4. 选择项目下的 `dist` 目录

加载完成后可以调试：

- popup 页面交互
- `chrome.storage.local` 持久化
- DNR 动态规则下发
- 请求头是否真正写入命中请求

### 3. 调试 Background Service Worker

在 `chrome://extensions` 中找到该扩展：

1. 点击“Service Worker”或“检查视图”
2. 打开后台调试面板
3. 查看消息通信、规则同步与异常日志

## 如何使用

### 1. 新增配置

- 点击左侧顶部的 `+` 按钮
- 新配置会自动成为当前生效配置

### 2. 添加请求头

- 在“请求头”区域点击“新增请求头”
- 填写请求头名称和请求头值
- 打开对应启用开关

### 3. 添加 URL 规则

- 在“URL 规则”区域点击“新增规则”
- 输入一个正则表达式，例如：

```text
^https://example\.com/.*$
```

- 规则合法时才会参与实际生效

### 4. 开启或关闭插件

- 通过顶部“全局开关”控制插件是否生效
- 关闭后会主动清空全部动态规则

### 5. 切换配置

- 点击左侧任意配置项即可切换当前生效配置
- 切换后旧规则会失效，新规则会立即同步

## 校验命令

项目默认使用轻量校验，不强制执行完整构建。

```bash
pnpm test
pnpm lint
pnpm exec tsc --noEmit
```

也可以直接运行：

```bash
pnpm check
```

## 上线 / 发布

如果只是本地使用：

1. 执行 `pnpm build`
2. 将 `dist` 目录通过 `Load unpacked` 加载到 Chrome

如果需要正式发布到 Chrome Web Store：

1. 执行 `pnpm build`
2. 将 `dist` 目录打包为 zip
3. 登录 Chrome Web Store Developer Dashboard
4. 创建新扩展并上传 zip
5. 按要求补充商店描述、截图、图标和隐私说明
6. 提交审核并发布

## 目录结构

```text
.
├── public
│   ├── icons
│   └── manifest.json
├── src
│   ├── background
│   ├── hooks
│   ├── popup
│   │   └── components
│   └── shared
├── popup.html
├── index.html
└── vite.config.ts
```

## 核心实现说明

- Popup 中的所有编辑操作都会先更新本地状态，再写入 `chrome.storage.local`
- 保存成功后会通知 background 重新同步 DNR 动态规则
- 仅当前激活配置会被编译
- 同名请求头仅保留最后一条启用项
- 非法正则会在 UI 提示，但不会进入规则编译
