# 配置说明

本章节详细介绍 CloudFlare ImgBed 的各种配置选项和自定义设置。

## 🗂️ 存储渠道配置

部署完成后访问您的域名，进入管理后台配置存储渠道。

### 访问管理后台

访问 `https://your-domain/dashboard`
::: tip 提示
   管理后台默认无需密码，登录后请及时设置管理员用户名和密码。
:::

### 配置 Telegram 渠道

1. 左上角菜单栏进入 "系统设置" → "上传设置"
2. 找到 "Telegram 渠道配置"
3. 点击 "添加渠道"
4. 填入准备好的 Token 和 Chat ID：
   - **渠道名称**：自定义名称（如：主渠道）
   - **Bot Token**：从 @BotFather 获得的 Token
   - **Chat ID**：频道 ID（有`-`号时需要保留）
   - **代理 URL**：（可选）自定义代理地址，用于代理 Telegram API 请求
   - **启用状态**：开启
5. 点击 "保存设置"

::: tip 关于代理配置
如果您的服务器无法直接访问 Telegram API，可以配置代理 URL。您可以使用 Cloudflare Worker 搭建简单的代理服务：
```javascript
// worker.js
export default {
    async fetch(request) {
        const url = new URL(request.url);
        const target = `https://api.telegram.org${url.pathname}${url.search}`;
        const resp = await fetch(target, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            redirect: 'follow'
        });
        return new Response(resp.body, {
            status: resp.status,
            headers: resp.headers
        });
    }
};
```
部署此 Worker 后，将 Worker 地址填入代理 URL 字段即可。
:::


### 配置 R2 渠道

服务器部署时默认添加了 Cloudflare R2 存储方式，以下步骤仅针对 Cloudflare 部署方式：

1. 在项目设置中绑定 R2 存储桶：
   - 选择 "设置" → "绑定"
   - 添加 "R2 存储桶"
   - **变量名称**：`img_r2`
   - **R2 存储桶**：选择已创建的存储桶

![配置 R2 渠道](/images/deployment/r2-config.png)

2. 在管理后台配置：
   - 进入 "系统设置" → "上传设置"
   - 配置 R2 渠道参数
   - 如需图像审查，填入 R2 公开访问链接

::: tip 提示
请注意Cloudflare R2 的免费额度限制，超过后可能会产生费用。
   ![注意](/images/deployment/r2-free-tier.png)
:::

### 配置 S3 渠道

在管理后台的 S3 渠道配置中填入：

- **Access Key ID**：访问密钥 ID
- **Secret Access Key**：机密访问密钥
- **Bucket Name**：存储桶名称
- **Endpoint**：服务端点（完整 URL，如 https://s3.us-east-005.backblazeb2.com）
- **PathStyle**：路径样式（如需兼容旧 S3 版本，开启此选项）
- **Region**：存储区域（可选）
- **CDN 域名**：（可选）自定义 CDN 加速域名，设置后优先通过CDN读取文件

### 配置 Discord 渠道

在管理后台的 Discord 渠道配置中填入：

- **渠道名称**：自定义名称
- **Bot Token**：Discord Bot Token
- **Channel ID**：Discord 频道 ID
- **Is Nitro**：是否为 Nitro 用户（Nitro 用户单文件限制为 25MB，普通用户为 10MB）
- **代理 URL**：（可选）自定义代理地址

### 配置 HuggingFace 渠道

在管理后台的 HuggingFace 渠道配置中填入：

- **渠道名称**：自定义名称
- **Token**：HuggingFace Access Token（从 https://huggingface.co/settings/tokens 获取）
- **Repo**：仓库名称（格式：username/repo-name，用户名须填写正确，会自动创建 dataset 类型仓库）
- **Is Private**：是否为私有仓库

::: tip 提示
HuggingFace 渠道支持大文件直传，适合上传超过 20MB 的文件。对于大文件，系统会自动使用 LFS 协议进行分片上传。
:::

### 配置 WebDAV 渠道

在管理后台的 WebDAV 渠道配置中填入：

- **渠道名称**：自定义名称
- **WebDAV 基础地址**：WebDAV 服务的完整 URL（如 `https://dav.example.com/remote.php/dav/files/user/imgbed/`）
- **用户名**：（可选）WebDAV 认证用户名
- **密码**：（可选）WebDAV 认证密码
- **公开访问链接**：（可选）公开 HTTP/CDN 地址，配置后服务端支持直接从该地址读取文件
- **自定义请求头**：（可选）额外的 HTTP 请求头，JSON 对象格式（如 `{"X-Api-Key":"value"}`）
- **自动创建目录**：上传文件前自动创建父级目录，默认开启


## 🔒 安全设置

安全相关设置，在管理后台的 "系统设置" → "安全设置" 中配置

### 认证管理

- 用户端认证：用于 Web 端用户登录和 API 认证
- 管理端认证： 管理员用户名和密码，用于访问管理后台

### 上传管理

#### 图像审查

审查渠道支持 `nsfwjs` 和 `moderatecontent.com`，可根据如下步骤自行配置。

##### 1.moderatecontent.com

- 访问 [ModerateContent](https://moderatecontent.com/)
- 注册并获取免费 API Key（目前已不再支持免费注册）
- 在管理后台 "系统设置" → "安全设置" 中填入 API Key

##### 2.nsfwjs

- 使用 Docker 部署 `nsfwjs` 审查服务
```bash
# 参考命令
docker run -d -p 127.0.0.1:5000:5000/tcp \
  --env PORT=5000 \
  --restart=always \
  eugencepoi/nsfw_api:latest
```
- 在管理后台 "系统设置" → "安全设置" 中填入审查服务地址，如 `https://nsfwjs.your.domain`

#### IP 归属地查询

IP 归属地查询用于在文件上传时调用第三方 IP 信息接口，并将查询结果写入文件元数据的 `UploadAddress` 字段。可在管理后台 "系统设置" → "安全设置" → "上传管理" 中配置。

目前查询渠道仅支持 `自定义 API`。

##### 自定义 API 配置项

- **开启查询**：开启后，上传流程会按配置请求自定义 API；关闭时 `UploadAddress` 保存为 `未知`。
- **API 路径**：自定义 API 地址，例如 `https://api.example.com/ip`。
- **查询参数**：按列表添加请求参数名和值。参数值支持 `{ip}` 占位符，上传时会替换为实际上传 IP。
  - 示例：参数名 `ip`，参数值 `{ip}`，最终请求为 `https://api.example.com/ip?ip=1.2.3.4`。
- **响应字段**：按列表配置从 JSON 响应中读取的字段路径，例如 `country.name`、`city`。
  - 最终显示内容会按照字段顺序拼接，字段之间使用 `，` 分隔。
  - 支持点号路径和数组下标，例如 `location.country.name`、`items[0].city`。

##### 响应示例

假设自定义 API 返回：

```json
{
  "country": {
    "name": "中国"
  },
  "city": "深圳"
}
```

响应字段配置为：

```text
country.name
city
```

最终写入 `UploadAddress` 的内容为：

```text
中国，深圳
```

未配置响应字段、接口返回非 JSON、字段读取失败或请求失败时，`UploadAddress` 会保存为 `未知`。

### 访问管理

- 域名过滤
  - 放行域名：允许访问的域名列表（留空放行所有域名，否则需要手动添加图床自身域名）
- 白名单模式：启用后仅允许加入白名单的文件被访问
- 图片尺寸处理
  - **是否开启**：默认关闭。开启后，[读取 API](/api/file) 可通过 `width`、`height` 和 `fit` 参数处理图片尺寸
  - **允许尺寸**：留空时允许任意合法尺寸；也可填写 `320xauto,autox480,1280x720` 等以英文逗号分隔的组合。`auto` 表示不限制对应的一边，数值范围为 `1`–`4096`

::: warning 注意
Cloudflare Pages 部署还需在 Cloudflare 控制台进入 **构建 → 媒体 → Images → 转换**，开启图片转换功能。Pages 通过同域 URL 转换图片，Worker 使用 Images binding，Docker 使用 Sharp。
:::

- 会话安全策略
  - **Secure 模式**：开启后，Session Cookie 将附带 `Secure` 属性，仅通过 HTTPS 连接传输。请确保您的站点已启用 HTTPS，否则浏览器将无法发送 Cookie，导致登录失效。默认关闭。
  - **用户端会话有效期**：用户端登录后 Session 的有效时长，单位为天，最小值为 1，默认 `14` 天。
  - **管理员端会话有效期**：管理员端登录后 Session 的有效时长，单位为天，最小值为 1，默认 `14` 天。

## 🌐 网页设置

前端网页相关设置，在管理后台的 "系统设置" → "网页设置" 中配置

### 全局设置

- **网站标题**：浏览器标签页和页面标题显示的名称。示例：`Sanyue ImgHub`。
- **网站图标**：浏览器标签页图标地址，建议填写可公开访问的图片链接。
- **图床名称**：前端页面展示的图床名称。示例：`Sanyue ImgHub`。
- **图床 Logo**：前端页面展示的 Logo 图片地址，建议使用透明背景 PNG 或 WebP。
- **Logo 跳转链接**：点击 Logo 时跳转的链接；留空时使用默认 GitHub 链接。示例：`https://example.com`。
- **背景切换间隔**：背景图轮播间隔，单位为毫秒。默认 `3000`，例如希望 10 秒切换一次可填写 `10000`。
- **背景图透明度**：背景图显示透明度，填写 `0-1` 之间的小数。默认 `1`，例如 `0.8`。
- **启用壁纸**：控制所有页面是否加载背景壁纸，默认开启。关闭并保存后，页面刷新时将使用纯色背景；具体壁纸来源仍由客户端设置和管理端设置中的背景图选项决定。
- **默认 URL 前缀**：用于生成全局默认访问链接和上传 API 成功响应中的 `publicUrl`，仅影响页面展示和接口返回的链接，不会改变文件的实际访问路径。示例：`https://img.example.com/file/`；留空时使用当前站点域名。

### 客户端设置

- **公告**：上传页面展示的公告内容，支持 HTML 标签。示例：`<b>维护通知</b>：今晚 23:00 进行维护`。
- **目录候选项**：控制上传页面是否显示目录树选择器。启用后，用户选择上传目录时可以通过可视化目录树选择目标文件夹，不需要手动输入路径。
- **默认渠道类型**：上传页面默认选中的存储渠道类型，可选 Telegram、Cloudflare R2、S3、Discord、HuggingFace、WebDAV。
- **默认渠道名称**：当某个渠道类型下配置了多个渠道时，可指定默认使用的渠道名称；需先选择默认渠道类型。
- **默认上传目录**：上传页面默认目录。应填写以 `/` 开头的合法目录路径，不能包含特殊字符；留空时默认为根目录。示例：`/images/wallpaper`。
- **默认命名方式**：上传页面默认的文件命名方式，可选默认、仅前缀、仅原名、短链接。
- **默认转换 WebP**：开启后，上传图片时默认先在浏览器端转换为 WebP，以减小文件体积。
- **默认开启压缩**：开启后，上传图片时默认启用浏览器端压缩，仅对图片文件生效。
- **默认压缩阈值**：图片大小超过该值时自动压缩，单位 MB，范围 `1-20`。默认 `5`。
- **默认压缩期望**：压缩后的目标大小，单位 MB，范围为 `0.5` 到压缩阈值。默认 `4`。
- **登录页背景图**：用户登录页背景。可填写 `bing` 使用必应壁纸轮播，也可填写 JSON 图片数组使用自定义轮播，例如 `["https://example.com/1.jpg","https://example.com/2.jpg"]`；只有一张图片时可填写 `["https://example.com/1.jpg"]`。
- **上传页背景图**：上传页面背景，配置格式同登录页背景图。
- **页脚传送门链接**：页脚入口跳转地址，可填写个人博客、主页或项目地址。示例：`https://blog.example.com`。
- **隐藏页脚**：开启后隐藏前端页脚。默认关闭。

### 管理端设置

- **登录页背景图**：管理端登录页背景，配置格式同客户端登录页背景图。
- **管理页背景图**：管理后台页面背景，配置格式同客户端登录页背景图。



## 🛠️ 其他设置
其他设置项，在管理后台的 "系统设置" → "其他设置" 中配置

### 远端遥测
便于开发者进行bug的捕捉和定位，但是过程中可能收集到访问链接、域名等信息，如您不愿意泄露类似信息给项目开发者，请在管理后台禁用此功能。

### 随机图像 API
- 目录：开放随机图权限的目录，默认为根目录，多个目录用逗号分隔；目录均采用绝对路径，例如`/img/cover`，表示该目录及其所有子目录的文件可被随机图API访问。

### 访客图库
允许未登录用户访问指定目录的文件，可用于创建公开图库或相册展示。
- 启用公开浏览：开启或关闭公开浏览功能
- 允许访问的目录：开放公开访问权限的目录，多个目录用逗号分隔；目录均采用绝对路径（可不写开头的`/`），例如`/img/gallery,/img/wallpapers`

::: tip 提示
启用后，用户可通过 `/browse/目录名` 路径访问公开图库，例如 `/browse/img/gallery`
:::

### CloudFlare API Token
正常情况下，因为CloudFlare CDN缓存的存在，在管理端进行删除、拉黑、加白名单等操作不会立即生效，需要等到缓存过期才能生效。为了让操作立即生效，建议设置此项，设置方式如下：
- `CF_ZONE_ID`：绑定域名的 Cloudflare Zone ID
![获取方法](/images/deployment/cf-zone-id.png)
- `CF_EMAIL`：Cloudflare 账户邮箱
- `CF_API_KEY`：Cloudflare Global API Key
![获取方法](/images/deployment/cf-api-key.png)

### WebDAV
WebDAV 服务相关设置，详细介绍和使用方式请查看 [API 文档](../api/webdav.md)。
- 启用 WebDAV 服务：开启或关闭 WebDAV 服务
- 用户名：WebDAV 登录用户名
- 密码：WebDAV 登录密码
- 上传渠道：通过 WebDAV 上传文件时使用的存储渠道，支持 Telegram、Cloudflare R2、S3、Discord、HuggingFace、WebDAV
- 指定渠道名：当选择的上传渠道有多个配置时，可指定具体使用哪个渠道名称进行上传


## 🔧 环境变量清单

::: warning 注意
环境变量设置方式在 v2.0 版本后已废弃，以下配置请在管理后台进行。
:::

### 基础认证配置

| 变量名 | 类型 | 必需 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `BASIC_USER` | string | 否 | 管理员用户名 | `admin` |
| `BASIC_PASS` | string | 否 | 管理员密码 | `your_secure_password` |
| `AUTH_CODE` | string | 否 | 上传认证码 | `your_auth_code` |

### 存储渠道配置

#### Telegram 渠道

| 变量名 | 类型 | 必需 | 说明 | 示例值 |
|--------|------|------|------|--------|
| `TG_BOT_TOKEN` | string | 是 | Telegram Bot Token | `123456789:ABCdefGHI...` |
| `TG_CHAT_ID` | string | 是 | Telegram 频道 ID | `-1001234567890` |


### 功能开关配置

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `AllowRandom` | boolean | `false` | 启用随机图 API |
| `WhiteList_Mode` | boolean | `false` | 启用白名单模式 |
| `disable_telemetry` | boolean | `false` | 禁用遥测数据 |

### 安全配置

| 变量名 | 类型 | 说明 | 示例值 |
|--------|------|------|--------|
| `ALLOWED_DOMAINS` | string | 允许访问的域名列表 | `domain1.com,domain2.com` |
| `ModerateContentApiKey` | string | 图像内容审查 API Key | `your_api_key` |

### CDN 缓存配置

| 变量名 | 类型 | 说明 | 用途 |
|--------|------|------|------|
| `CF_ZONE_ID` | string | Cloudflare Zone ID | 自动清除 CDN 缓存 |
| `CF_EMAIL` | string | Cloudflare 账户邮箱 | 自动清除 CDN 缓存 |
| `CF_API_KEY` | string | Cloudflare Global API Key | 自动清除 CDN 缓存 |


