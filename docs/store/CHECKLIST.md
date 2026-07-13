# Chrome Web Store 上架 Checklist

> 配套文件：
> - [PRIVACY.md](./PRIVACY.md) — 隐私政策（中英）
> - [STORE_LISTING.md](./STORE_LISTING.md) — 商店描述 / 权限说明

## 一、发布前

- [ ] `public/manifest.json` 的 `version` 已递增（当前 `0.1.2`）
- [ ] `package.json` 的 `version` 与之同步
- [ ] `pnpm check` 全部通过（lint + tsc）
- [ ] `pnpm test` 全部通过
- [ ] `pnpm build` 成功，`dist/` 里 `manifest.json` 版本正确
- [ ] 打包 zip（排除 `.map` 文件）
  ```bash
  cd dist && zip -r ../mod-header-lite-v0.1.2.zip . -x "**/*.map"
  ```
- [ ] 隐私政策 `PRIVACY.md` 已发布到可公开访问的 URL（GitHub raw / Pages / gist 都可以）

## 二、Developer Dashboard 填写

- [ ] 名称、简短说明、详细描述 —— 复制自 `STORE_LISTING.md`
- [ ] Category：Developer Tools
- [ ] 语言：至少一种主语言
- [ ] 图标 128×128：使用 `public/icons/icon128.png`
- [ ] 截图 ≥ 1 张（推荐 3-5 张，1280×800）
- [ ] Single purpose：填 `STORE_LISTING.md` 中的对应段落
- [ ] 权限 Justification：`storage` / `declarativeNetRequest` / `host_permissions` 逐项填
- [ ] Remote code：填 "No"
- [ ] Privacy practices：按 `STORE_LISTING.md` 中建议勾选
- [ ] Privacy policy URL：填 `PRIVACY.md` 的公开访问地址
- [ ] Distribution：Public / Unlisted / Private 三选一
- [ ] 上传 zip 包

## 三、提交后

- [ ] 记录审核提交时间（含 `<all_urls>` 属敏感权限，可能 1-3 周）
- [ ] 保留审核意见邮件，被拒时按建议修改后重新提交
- [ ] 上架成功后，在仓库 README 补上 Web Store 链接和徽章

## 四、后续版本更新

- [ ] `version` 递增，写入 CHANGELOG
- [ ] 重新执行发布前 checklist
- [ ] Dashboard 内点击"上传新包"，写更新说明后重新提交
