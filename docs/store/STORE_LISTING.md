# Chrome Web Store 商店描述 / Listing Copy

> 用于 Chrome Web Store Developer Dashboard 的 "Store listing" 页面。
> 每一段都标注了对应表单字段和字符上限，直接复制粘贴即可。

---

## 一、中文（简体）

### 扩展名称 / Name（≤ 45 字符）

```
Mod Header Lite — 轻量请求头修改工具
```

### 简短说明 / Summary（≤ 132 字符）

```
一款聚焦请求头修改的轻量 Chrome 扩展。多配置管理、URL 正则匹配、一键启停，全部本地运行，不上传任何数据。
```

### 详细描述 / Description（≤ 16,000 字符）

```
Mod Header Lite 是一款专注于「请求头修改」的轻量 Chrome 扩展，交互结构参考 ModHeader，但去掉了臃肿的功能，只保留每天真正会用到的核心能力。

━━━━━━━━━━━━━━━━━━━━
核心功能
━━━━━━━━━━━━━━━━━━━━

• 全局启用 / 停用开关，一键接管或释放浏览器
• 多配置管理，可为不同项目/环境分别维护规则
• 同一时刻仅一个配置生效，切换即时同步
• 请求头名值编辑，支持逐条启用/禁用
• URL 正则规则编辑，非法正则实时提示
• 基于 Chrome 官方 declarativeNetRequest，性能与安全性有保障

━━━━━━━━━━━━━━━━━━━━
适用场景
━━━━━━━━━━━━━━━━━━━━

• 前后端联调时注入自定义 Header 进行灰度或分流
• 测试环境下模拟不同用户身份、UA、Region
• 排查线上问题时快速切换 Header 复现请求
• 需要在多个环境（Dev / Staging / Prod）之间频繁切换的开发者

━━━━━━━━━━━━━━━━━━━━
隐私承诺
━━━━━━━━━━━━━━━━━━━━

• 所有配置只保存在你的本地 chrome.storage 中
• 无任何服务器、无任何网络上报、无第三方 SDK
• 不读取请求体、不读取 Cookie、不记录访问历史
• 源代码完全开源，可自行审计

━━━━━━━━━━━━━━━━━━━━
使用步骤
━━━━━━━━━━━━━━━━━━━━

1. 点击扩展图标打开弹窗
2. 在左侧点击 “+” 新建配置
3. 添加请求头名和值，打开单条开关
4. 添加 URL 正则规则（例：^https://api\.example\.com/.*$）
5. 顶部全局开关打开即生效

━━━━━━━━━━━━━━━━━━━━
反馈与源码
━━━━━━━━━━━━━━━━━━━━

GitHub: https://github.com/shixinxin1111/mod-header-lite
问题反馈 / 功能建议请提交 Issue，欢迎 PR。
```

### 分类 / Category

```
Developer Tools
```

### 语言 / Language

```
Chinese (Simplified)  —— 主
English  —— 副（可选，见下方）
```

---

## 二、English

### Name (≤ 45 chars)

```
Mod Header Lite — Lightweight Header Modifier
```

### Summary (≤ 132 chars)

```
A focused Chrome extension for modifying HTTP request headers. Multi-profile, URL regex rules, one-click toggle, 100% local.
```

### Description (≤ 16,000 chars)

```
Mod Header Lite is a lightweight Chrome extension focused solely on modifying HTTP request headers. Inspired by ModHeader, but stripped down to only what you actually use every day.

━━━━━━━━━━━━━━━━━━━━
Features
━━━━━━━━━━━━━━━━━━━━

• Global on/off toggle — take over or release the browser instantly
• Multiple profiles for different projects or environments
• Only one profile active at a time; switching is instant
• Per-header enable/disable
• URL regex matching with live validation
• Powered by Chrome's official declarativeNetRequest API for performance and security

━━━━━━━━━━━━━━━━━━━━
Use cases
━━━━━━━━━━━━━━━━━━━━

• Inject custom headers during frontend/backend development
• Simulate users, User-Agents, or regions in QA
• Reproduce production issues by tweaking headers on demand
• Switch quickly between Dev / Staging / Prod environments

━━━━━━━━━━━━━━━━━━━━
Privacy
━━━━━━━━━━━━━━━━━━━━

• All configuration is stored locally in chrome.storage
• No servers, no telemetry, no third-party SDKs
• Never reads request bodies, cookies, or browsing history
• Fully open source — audit the code yourself

━━━━━━━━━━━━━━━━━━━━
Quick start
━━━━━━━━━━━━━━━━━━━━

1. Click the toolbar icon to open the popup
2. Click "+" on the left to create a profile
3. Add header name/value pairs and enable them
4. Add a URL regex (e.g., ^https://api\.example\.com/.*$)
5. Flip the global switch — you're done

━━━━━━━━━━━━━━━━━━━━
Source & feedback
━━━━━━━━━━━━━━━━━━━━

GitHub: https://github.com/shixinxin1111/mod-header-lite
Report issues or request features via GitHub Issues. PRs welcome.
```

### Category

```
Developer Tools
```

---

## 三、Single Purpose 描述

Chrome Web Store 要求扩展说明"单一用途"。在 Developer Dashboard 的 *Single purpose* 字段填：

```
Modify HTTP request headers sent by the browser based on user-defined rules.
根据用户自定义规则修改浏览器发送的 HTTP 请求头。
```

---

## 四、权限使用说明 / Permission Justifications

Developer Dashboard 里每项敏感权限都会要求写"Justification"，逐条对应填：

### `storage`

```
Save user-defined header profiles, URL matching rules, and enable/disable state
locally so that they persist across browser restarts. Data never leaves the
device.

用于将用户自定义的请求头配置、URL 规则和开关状态本地持久化保存，浏览器重启后仍然可用。数据不会离开设备。
```

### `declarativeNetRequest`

```
Declaratively modify HTTP request headers based on user-configured rules.
This is the Chrome-recommended API for header modification and does not
allow the extension to observe request contents.

按用户配置的规则以声明式方式修改 HTTP 请求头。这是 Chrome 官方推荐的请求修改 API，扩展本身无法读取请求内容。
```

### `host_permissions: <all_urls>`

```
Users may need to modify headers on any website they choose. This host
permission is required so that declarativeNetRequest rules can be scoped
to arbitrary origins. The extension does not inject content scripts and
does not read page DOM.

用户可能在任意站点上配置请求头修改规则，因此需要匹配所有 URL 的宿主权限，用于让 declarativeNetRequest 规则生效。扩展不注入任何内容脚本，也不读取页面 DOM。
```

### Remote code

```
No. The extension does not load or execute any remote code. All logic is
bundled inside the extension package.

否。扩展不加载也不执行任何远程代码，全部逻辑打包在扩展包内。
```

---

## 五、Privacy practices 表单勾选建议

在 Dashboard 的 *Privacy practices* 表单里，逐项按如下勾选：

- **Do you collect...**
  - Personally identifiable info → **No**
  - Health info → **No**
  - Financial and payment info → **No**
  - Authentication info → **No**
  - Personal communications → **No**
  - Location → **No**
  - Web history → **No**
  - User activity → **No**
  - Website content → **No**

- **Certifications**（三项都必须勾选）：
  - ✅ 不将用户数据出售或转让给非法用途
  - ✅ 不将用户数据用于与扩展核心功能无关的场景
  - ✅ 不将用户数据用于评估信用度或用于放贷

- **Privacy policy URL**：填 `PRIVACY.md` 部署后的公开地址（例：GitHub Pages / gist / 仓库 raw 链接）

---

## 六、截图建议 / Screenshots

必需至少 1 张，推荐 3-5 张：

1. **主界面全览**：popup 打开状态、左侧配置列表、右侧规则编辑区都可见
2. **添加请求头**：展示"新增请求头"表单填写状态
3. **URL 规则**：展示正则输入 + 校验提示
4. **多配置切换**：左侧多条 profile 高亮当前生效项
5. **停用状态**：全局开关关闭、图标变灰的状态对比

尺寸建议 **1280×800 PNG**，可以留一点边距和背景色，让截图看上去像宣传图而不是原始弹窗。
