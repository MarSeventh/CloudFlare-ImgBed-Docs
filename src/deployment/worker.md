# Cloudflare Workers 部署

Cloudflare Workers 部署是 Pages 部署之外的另一种 Serverless 部署方式。与 Pages 相比，Workers 提供更灵活的路由控制和更高的自定义能力，适合需要精细控制部署流程的用户。

::: tip Pages vs Workers
- **Pages 部署**：更简单，适合大多数用户，通过 Cloudflare Dashboard 可视化操作即可完成，支持自动更新
- **Workers 部署**：通过 GitHub Actions 部署，适合熟悉 CI/CD 流程的用户，支持 push 到 main 分支时自动部署，也可手动触发

两种方式功能完全一致，选择适合自己的即可。
:::

## 📂 第一步：Fork 项目

1. 访问 [CloudFlare ImgBed 项目](https://github.com/MarSeventh/CloudFlare-ImgBed)
2. 点击右上角的 "Fork" 按钮
3. 选择您的 GitHub 账户
4. 确认 Fork 完成

## 🔑 第二步：准备 Cloudflare 资源

### 2.1 获取 API Token 和 Account ID

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击右上角头像 → "我的个人资料" → "API 令牌"
3. 点击 "创建令牌"
4. 选择 "编辑 Cloudflare Workers" 模板
5. 确认权限并创建，**记录生成的 Token**
6. 返回 Dashboard 首页，在右侧栏找到并**记录 Account ID**

### 2.2 创建数据库

数据库用于存储文件元数据，可选 KV 或 D1（二选一）。

| 特点 | KV 数据库 | D1 数据库 |
|------|-----------|-----------|
| 读写性能 | 高 | 较低 |
| 免费额度 | 少 | 多 |

#### KV 数据库

1. 在 Dashboard 中选择 "存储和数据库" → "Workers KV"
2. 点击 "创建实例"，名称填 `img_url`
3. 创建完成后，**记录命名空间 ID**

#### D1 数据库

1. 在 Dashboard 中选择 "存储和数据库" → "D1 SQL 数据库"
2. 点击 "创建数据库"，名称填 `img_d1`
3. 创建完成后，**记录数据库 ID**
4. 在 "控制台" 选项卡中执行初始化 SQL（见 [init.sql](https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/database/init.sql)）

### 2.3 创建 R2 存储桶（可选）

如果需要使用 R2 存储渠道：

1. 在 Dashboard 中选择 "存储和数据库" → "R2 对象存储"
2. 点击 "创建存储桶"，**记录存储桶名称**

## ⚙️ 第三步：配置 GitHub Secrets

在 Fork 的仓库中，进入 **Settings → Secrets and variables → Actions → Secrets**，添加以下 Secrets：

| Secret 名称 | 说明 | 是否必填 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token | ✅ 必填 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID | ✅ 必填 |
| `D1_DATABASE_ID` | D1 数据库 ID | 二选一 |
| `KV_NAMESPACE_ID` | KV 命名空间 ID | 二选一 |
| `R2_BUCKET_NAME` | R2 存储桶名称 | 可选 |
| `WORKER_NAME` | Worker 名称（默认 `cloudflare-imgbed`） | 可选 |
| `WORKER_VARS` | 业务环境变量（JSON 格式，支持 `text` / `secret`） | 可选 |

### WORKER_VARS 格式说明 {#worker-vars}

在 GitHub Actions 的 Secrets 中添加名为 `WORKER_VARS` 的 Secret，将完整 JSON 对象填写为它的值。每项可以直接填写值，也可以使用包含 `value` 和可选 `type` 的对象：

```json
{
  "TG_CHAT_ID": "your-chat-id",
  "CUSTOM_DOMAIN": {
    "value": "https://img.example.com",
    "type": "text"
  },
  "AI_CONFIG_SECRET": {
    "value": "replace-with-a-random-secret-of-at-least-32-characters",
    "type": "secret"
  },
  "TG_BOT_TOKEN": {
    "value": "your-bot-token",
    "type": "secret"
  }
}
```

| 写法 / 类型 | 部署行为 |
|---|---|
| `"变量名": "值"` | 兼容原有写法，作为普通 `text` 环境变量部署 |
| `"变量名": { "value": "值" }` | 省略 `type`，默认为 `text` |
| `"变量名": { "value": "值", "type": "text" }` | 写入 `wrangler.toml` 的 `[vars]`，作为 Cloudflare 普通文本变量部署 |
| `"变量名": { "value": "值", "type": "secret" }` | 不写入 `[vars]`；Worker 部署成功后统一通过 `wrangler secret bulk` 上传为 Cloudflare Secret |

所有可用的环境变量请参考 [配置说明](/deployment/configuration)。

::: warning 非必要不建议在此处配置
所有业务设置都可以在部署完成后通过管理面板进行配置，无需在此处填写，仅当管理面板无法覆盖的特殊环境变量才需要通过 `WORKER_VARS` 配置。

请将配置保存在 GitHub Secrets 中，不要将真实密钥提交到代码仓库或填写到公开仓库的 Variables。GitHub Secret 不会自动变成 Cloudflare Secret，密钥、Token 等敏感值应明确设置 `type: "secret"`。
:::

## 🚀 第四步：运行部署

1. 进入 Fork 仓库的 **Actions** 页面
2. 在左侧选择 **Deploy to Cloudflare Workers**
3. 点击 **Run workflow**
4. 选择要部署的分支（默认 `main`）
5. 可选修改 Worker 名称（优先级：手动输入 > Secrets 中的 `WORKER_NAME` > `cloudflare-imgbed`）
6. 点击 **Run workflow** 开始部署

部署完成后，可以通过 `https://<worker-name>.<account-subdomain>.workers.dev` 访问。

## 🚀 下一步

部署完成后，需要添加存储渠道才能正常使用。请参考 [配置说明](/deployment/configuration#🗂%EF%B8%8F-存储渠道配置) 进行配置。
