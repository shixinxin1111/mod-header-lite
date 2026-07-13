# Mod Header Lite 隐私政策 / Privacy Policy

> Last updated / 最后更新：2026-07-13
> Version / 版本：v0.1.2

## 中文版

### 1. 谁在提供本扩展

Mod Header Lite（下称"本扩展"）是一款开源的 Chrome 浏览器扩展程序，用于在本地修改浏览器发出的 HTTP 请求头。本扩展由个人开发者维护，源代码公开于 GitHub。

### 2. 我们收集哪些数据

**我们不收集、不上传、不共享任何用户数据。**

所有数据只在你的本地浏览器中处理和保存：

| 数据类型 | 是否采集 | 说明 |
| --- | --- | --- |
| 个人身份信息（姓名、邮箱等） | 否 | 本扩展没有任何账号系统 |
| 认证凭据（Cookies、Token） | 否 | 本扩展不读取任何 Cookie |
| 用户配置（请求头名值、URL 规则） | 仅本地存储 | 保存在 `chrome.storage.local` 中，不上传 |
| 浏览记录 | 否 | 不记录你访问了哪些网站 |
| 请求内容或响应内容 | 否 | 不读取任何请求体或响应体 |
| 位置信息 | 否 | 不采集 |
| 使用分析 / 崩溃日志 | 否 | 无任何统计上报 |

### 3. 为什么需要这些权限

本扩展在 `manifest.json` 中声明的权限及用途：

- **`storage`**：将你配置的请求头规则、URL 匹配规则和开关状态保存到本地，重启浏览器后仍然可用。数据不会离开你的设备。
- **`declarativeNetRequest`**：Chrome 官方推荐的请求修改 API。扩展只向 Chrome 声明"当访问某类 URL 时，请添加/修改某个请求头"，实际执行由浏览器完成，扩展本身**看不到请求内容**。
- **`host_permissions: <all_urls>`**：因为用户可能想在任意站点修改请求头，因此需要"所有 URL"的匹配权限。**权限仅用于让上面的 `declarativeNetRequest` 规则生效**，扩展代码本身不会主动读取或访问任何页面的 DOM 或网络内容。

### 4. 数据是否离开你的设备

**不会。** 本扩展没有任何服务器、没有任何网络请求，全部逻辑在浏览器本地完成。你可以在 Chrome 任务管理器或 DevTools 的 Network 面板中自行验证。

### 5. 是否共享数据给第三方

**否。** 本扩展不集成任何第三方 SDK、不使用任何分析服务、不加载任何远程脚本。

### 6. 如何删除数据

- 在扩展弹窗中删除对应配置即可清空规则
- 在 `chrome://extensions/` 中卸载本扩展，Chrome 会自动清除所有 `chrome.storage.local` 中的相关数据

### 7. 儿童隐私

本扩展不针对 13 岁以下儿童设计，且不采集任何数据，因此不涉及儿童隐私相关条款。

### 8. 变更

本隐私政策如有更新，会在扩展的 GitHub 仓库同步发布，并在扩展新版本发布说明中注明。

### 9. 联系方式

如有任何疑问，请通过 GitHub Issue 联系：
`https://github.com/shixinxin1111/mod-header-lite/issues`

---

## English

### 1. Who provides this extension

Mod Header Lite ("the Extension") is an open-source Chrome extension that modifies HTTP request headers locally in your browser. It is maintained by an individual developer and the full source code is available on GitHub.

### 2. What data we collect

**We do not collect, upload or share any user data.**

All data stays on your local device:

| Data type | Collected | Notes |
| --- | --- | --- |
| Personally identifiable info | No | The Extension has no account system |
| Authentication credentials (cookies, tokens) | No | The Extension never reads cookies |
| User configurations (header rules, URL patterns) | Local only | Stored in `chrome.storage.local`, never uploaded |
| Browsing history | No | We do not record which sites you visit |
| Request or response contents | No | We do not read request bodies or responses |
| Location | No | Not collected |
| Analytics / crash reports | No | No telemetry is sent anywhere |

### 3. Why each permission is required

Permissions declared in `manifest.json`:

- **`storage`**: to persist your header rules, URL patterns and enable/disable state locally so that they survive browser restarts. Data never leaves your device.
- **`declarativeNetRequest`**: the Chrome-recommended API for modifying network requests. The Extension only *declares* rules to Chrome (e.g., "add header X when URL matches Y"); the browser applies them internally. **The Extension itself never sees request contents.**
- **`host_permissions: <all_urls>`**: users may want to modify headers on any site, so the Extension needs URL-match access across all origins. This permission is only used to scope `declarativeNetRequest` rules; the Extension does not inject scripts or read page DOM.

### 4. Does data leave your device?

**No.** The Extension has no backend, makes no network requests, and processes everything locally. You can verify this via Chrome's Task Manager and DevTools Network panel.

### 5. Third-party data sharing

**No.** The Extension bundles no third-party SDKs, uses no analytics service, and loads no remote scripts.

### 6. How to delete your data

- Delete configurations in the popup UI to remove rules.
- Uninstall the Extension from `chrome://extensions/`; Chrome will automatically clear its `chrome.storage.local` data.

### 7. Children's privacy

The Extension is not directed at children under 13 and collects no data.

### 8. Changes

Any updates to this policy will be published in the GitHub repository and noted in the extension's release notes.

### 9. Contact

Report issues via GitHub:
`https://github.com/shixinxin1111/mod-header-lite/issues`
