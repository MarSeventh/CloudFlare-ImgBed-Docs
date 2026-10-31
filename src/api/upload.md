# 上传 API

上传 API 支持通过第三方上传文件至 CloudFlare ImgBed，便于集成到各种应用和服务中。

## 基本信息

- **端点**：`/upload`
- **方法**：`POST`
- **认证**：上传认证码或 API Token（需要 `upload` 权限）
- **内容类型**：`multipart/form-data`

## 响应格式

```json
[
  {
    "src": "/file/abc123_image.jpg",
    "publicUrl": "https://img.example.com/abc123_image.jpg"
  }
]
```

上传成功响应为数组，常见字段如下：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `src` | string | 文件访问路径。默认不包含域名，如 `/file/abc123_image.jpg`；使用 `returnFormat=full` 时返回当前站点完整链接 |
| `publicUrl` | string | 可选。普通上传、分块合并成功时，若已在`系统设置 -> 网页设置 -> 全局设置 -> 默认 URL 前缀`设置了默认的 URL 前缀，则返回该前缀拼接文件 ID 的公开访问链接 |
| `expiresAt` | number | 可选。文件设置了有效期时返回到期时间（毫秒时间戳） |

## 普通上传

直接通过 `/upload` 端点上传文件，适用于小文件。

### 参数

**Query 参数：**

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `authCode` | string | 否 | - | 上传认证码 |
| `uploadChannel` | string | 否 | `telegram` | 上传渠道：`telegram`、`cfr2`、`s3`、`discord`、`huggingface`、`webdav` |
| `channelName` | string | 否 | - | 指定渠道名称（多渠道场景），可通过 `/api/channels` 获取可用列表 |
| `serverCompress` | boolean | 否 | `true` | 服务端压缩（仅 Telegram 渠道图片） |
| `autoRetry` | boolean | 否 | `true` | 失败时自动切换渠道重试 |
| `uploadNameType` | string | 否 | `default` | 命名方式：`default`（前缀_原名）、`index`（仅前缀）、`origin`（仅原名）、`short`（短链接） |
| `returnFormat` | string | 否 | `default` | 返回格式：`default`（`/file/id`）、`full`（完整链接） |
| `uploadFolder` | string | 否 | - | 上传目录，相对路径，如 `img/test` |
| `expire` | string | 否 | - | 文件有效期，如 `12h`、`7d`、`forever`。仅在管理员开启 [文件有效期](../deployment/configuration.md#file-expiry) 并允许自选时生效，必须是可选项之一，否则返回 400 |

未传入 `expire` 时使用管理员设置的默认有效期。未开启文件有效期时，上传的文件为永久文件；不允许上传者自选时，传入的 `expire` 会被忽略。

**Body 参数（FormData）：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `file` | File | 是 | 要上传的文件 |

### 示例

```bash
curl -X POST 'https://your.domain/upload?authCode=YOUR_CODE&uploadChannel=telegram' \
  -F 'file=@"/path/to/image.jpg"'
```

::: tip 文件大小限制
- **Cloudflare Pages 部署**：单次请求体上限 **100MB**
- **Telegram 渠道**：单文件上限 **20MB**（超过自动服务端分片）
- **Discord 渠道**：免费 **10MB** / Nitro **25MB**
- **HuggingFace 渠道**：普通上传走后端代理，受 CF Workers CPU 时间限制，建议大文件使用直传方式（见下文）
:::

## 分块上传（Telegram / R2 / S3 / Discord）

当文件较大时，客户端可将文件切分为多个分块，逐块上传后由服务端合并。适用于 `telegram`、`cfr2`、`s3`、`discord` 四个渠道。

::: warning HuggingFace 渠道不支持分块上传
HuggingFace 渠道有独立的大文件直传流程，请参考下方 [HuggingFace 大文件直传](#huggingface-大文件直传) 章节。
:::

### 推荐分块大小

| 渠道 | 推荐分块大小 | 说明 |
|------|-------------|------|
| `telegram` | **16MB** | Telegram Bot getFile 下载限制 20MB，留 4MB 安全余量 |
| `cfr2` / `s3` | **5MB - 20MB** | 遵循 S3 Multipart Upload 规范，最小 5MB |
| `discord` | **8MB** | 免费用户 10MB 限制，留余量 |

### 上传流程

分块上传分为三步：**初始化 → 逐块上传 → 合并**。

#### 第一步：初始化

创建上传会话，获取 `uploadId`。

**Query 参数：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `authCode` | string | 否 | 上传认证码 |
| `initChunked` | boolean | 是 | 固定为 `true` |
| `expire` | string | 否 | 文件有效期，规则同普通上传；初始化时校验，合并请求需携带相同的值 |
| `uploadChannel` | string | 否 | 上传渠道：`telegram`、`cfr2`、`s3`、`discord` |
| `channelName` | string | 否 | 指定渠道名称（多渠道场景），可通过 `/api/channels` 获取可用列表 |

**Body 参数（FormData）：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `originalFileName` | string | 是 | 原始文件名 |
| `originalFileType` | string | 是 | 原始文件 MIME 类型 |
| `totalChunks` | integer | 是 | 分块总数 |

**请求示例：**

```
POST /upload?authCode=YOUR_CODE&initChunked=true&uploadChannel=telegram
Content-Type: multipart/form-data

FormData:
  originalFileName: "video.mp4"
  originalFileType: "video/mp4"
  totalChunks: 5
```

**响应示例：**

```json
{
  "success": true,
  "uploadId": "upload_1713500000000_abc123def",
  "sessionInfo": {
    "uploadId": "upload_1713500000000_abc123def",
    "originalFileName": "video.mp4",
    "totalChunks": 5,
    "uploadChannel": "telegram"
  }
}
```

#### 第二步：逐块上传

将文件按推荐大小切分，依次上传每个分块。每个请求是**同步**的，服务端会等待分块上传到存储端后才响应。

**Query 参数：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `authCode` | string | 否 | 上传认证码 |
| `chunked` | boolean | 是 | 固定为 `true` |
| `uploadChannel` | string | 否 | 上传渠道：`telegram`、`cfr2`、`s3`、`discord` |
| `channelName` | string | 否 | 指定渠道名称（多渠道场景），可通过 `/api/channels` 获取可用列表 |

**Body 参数（FormData）：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `file` | File | 是 | 分块二进制数据 |
| `uploadId` | string | 是 | 初始化返回的上传会话 ID |
| `chunkIndex` | integer | 是 | 分块索引，从 0 开始 |
| `totalChunks` | integer | 是 | 分块总数 |
| `originalFileName` | string | 是 | 原始文件名 |
| `originalFileType` | string | 是 | 原始文件 MIME 类型 |

**请求示例：**

```
POST /upload?authCode=YOUR_CODE&chunked=true&uploadChannel=telegram
Content-Type: multipart/form-data

FormData:
  file: <分块二进制数据>
  uploadId: "upload_1713500000000_abc123def"
  chunkIndex: 0
  totalChunks: 5
  originalFileName: "video.mp4"
  originalFileType: "video/mp4"
```

**响应示例：**

```json
{
  "success": true,
  "message": "Chunk 1/5 received and being uploaded",
  "uploadId": "upload_1713500000000_abc123def",
  "chunkIndex": 0
}
```

::: tip 并发上传
各分块可并发上传以提升速度。对于 R2/S3 渠道，第一个分块（`chunkIndex=0`）会初始化 Multipart Upload，其他分块会自动等待初始化完成（最多等待 60 秒）。
:::

#### 第三步：合并

所有分块上传完成后，请求合并。合并过程是**同步**的。

**Query 参数：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `authCode` | string | 否 | 上传认证码 |
| `chunked` | boolean | 是 | 固定为 `true` |
| `merge` | boolean | 是 | 固定为 `true` |
| `expire` | string | 否 | 文件有效期，需与初始化时相同 |
| `uploadChannel` | string | 否 | 上传渠道：`telegram`、`cfr2`、`s3`、`discord` |
| `channelName` | string | 否 | 指定渠道名称（多渠道场景），可通过 `/api/channels` 获取可用列表 |
| `returnFormat` | string | 否 | 返回格式：`default`（`/file/id`）、`full`（完整链接） |
| `uploadFolder` | string | 否 | 上传目录，相对路径，如 `img/test` |

**Body 参数（FormData）：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `uploadId` | string | 是 | 上传会话 ID |
| `totalChunks` | integer | 是 | 分块总数 |
| `originalFileName` | string | 是 | 原始文件名 |
| `originalFileType` | string | 是 | 原始文件 MIME 类型 |

**请求示例：**

```
POST /upload?authCode=YOUR_CODE&chunked=true&merge=true&uploadChannel=telegram
Content-Type: multipart/form-data

FormData:
  uploadId: "upload_1713500000000_abc123def"
  totalChunks: 5
  originalFileName: "video.mp4"
  originalFileType: "video/mp4"
```

**响应示例：**

```json
[
  {
    "src": "/file/1713500000000_video.mp4",
    "publicUrl": "https://img.example.com/1713500000000_video.mp4"
  }
]
```

::: tip 失败重试
合并时服务端会自动检查各分块状态，对失败或超时的分块进行重试（最多 5 次）。如果仍有分块未完成，合并会返回错误。
:::

### 清理请求

如果上传中途取消，可发送清理请求释放临时数据。

**Query 参数：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `authCode` | string | 否 | 上传认证码 |
| `cleanup` | boolean | 是 | 固定为 `true` |
| `uploadId` | string | 是 | 上传会话 ID |
| `totalChunks` | integer | 是 | 分块总数 |

```
POST /upload?authCode=YOUR_CODE&cleanup=true&uploadId=xxx&totalChunks=5
```

## HuggingFace 大文件直传

HuggingFace 渠道采用独立的上传流程，**文件由客户端直接上传到 HuggingFace LFS 存储**，CF Workers 仅负责签名和提交，从而绕过 Cloudflare 的 100MB 请求体限制和 CPU 时间限制。

### 上传方式选择

| 场景 | 方式 | 说明 |
|------|------|------|
| 小文件（< 20MB） | 普通上传 `/upload?uploadChannel=huggingface` | 文件经由后端代理上传 |
| 大文件（≥ 20MB） | 直传流程（三步） | 客户端直传 HuggingFace S3，后端只做签名和提交 |

### 直传流程

::: tip 文件有效期
获取上传 URL 和提交文件引用两个请求都在 URL 上携带相同的 `expire` 参数（如 `/upload/huggingface/getUploadUrl?expire=7d`），规则同普通上传。
:::

#### 前置准备

客户端需要预先计算：
- **SHA-256**：文件完整内容的 SHA-256 哈希（hex 字符串）
- **fileSample**：文件前 512 字节的 Base64 编码

#### 第一步：获取上传 URL

**请求参数（JSON Body）：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `fileName` | string | 是 | 文件名 |
| `fileType` | string | 是 | 文件 MIME 类型 |
| `fileSize` | integer | 是 | 文件大小（字节） |
| `sha256` | string | 是 | 文件 SHA-256 哈希（hex） |
| `fileSample` | string | 是 | 文件前 512 字节的 Base64 |
| `channelName` | string | 否 | 指定渠道名称（多渠道场景），可通过 `/api/channels` 获取可用列表 |
| `uploadNameType` | string | 否 | 命名方式：`default`（前缀_原名）、`index`（仅前缀）、`origin`（仅原名）、`short`（短链接） |
| `uploadFolder` | string | 否 | 上传目录，相对路径，如 `img/test` |

**请求示例：**

```
POST /upload/huggingface/getUploadUrl
Content-Type: application/json
Authorization: Bearer <API_TOKEN>

{
  "fileName": "large-video.mp4",
  "fileType": "video/mp4",
  "fileSize": 524288000,
  "sha256": "e3b0c44298fc1c149afbf4c8996fb924...",
  "fileSample": "AAAAIGZ0eXBpc29t...",
  "channelName": "my-hf-channel",
  "uploadNameType": "default",
  "uploadFolder": "videos"
}
```

**响应示例：**

```json
{
  "success": true,
  "fullId": "videos/1713500000000_large-video.mp4",
  "filePath": "videos/a1b2c3d4_1713500000000_large-video.mp4",
  "channelName": "my-hf-channel",
  "repo": "username/repo-name",
  "needsLfs": true,
  "alreadyExists": false,
  "oid": "e3b0c44298fc1c149afbf4c8996fb924...",
  "uploadAction": {
    "href": "https://s3.amazonaws.com/...",
    "header": { ... }
  }
}
```

**关键字段说明：**
- `needsLfs: false`：文件无需 LFS（极小的文本文件），直接跳到第三步提交
- `alreadyExists: true`：文件已存在于 LFS，跳过第二步直接提交
- `uploadAction.header.chunk_size`：如果存在此字段，说明 HuggingFace 要求分片上传，`header` 中的零填充数字键（`"00001"`, `"00002"`, ...）为各分片的预签名上传 URL

#### 第二步：上传文件到 HuggingFace S3

根据 `uploadAction` 返回的信息，客户端直接上传到 HuggingFace 的 S3 存储。

**基本上传**（无 `chunk_size`）：

```
PUT <uploadAction.href>
Headers: <uploadAction.header>
Body: <文件二进制内容>
```

**分片上传**（有 `chunk_size`）：

将文件按 `chunk_size` 切分，依次 PUT 到 `header["00001"]`、`header["00002"]` ... 对应的 URL，收集每个响应的 `ETag`。全部上传完成后，POST 到 `uploadAction.href` 完成合并：

```
POST <uploadAction.href>
Content-Type: application/vnd.git-lfs+json

{
  "oid": "<sha256>",
  "parts": [
    { "partNumber": 1, "etag": "\"abc123\"" },
    { "partNumber": 2, "etag": "\"def456\"" }
  ]
}
```

#### 第三步：提交文件引用

上传完成后，调用提交接口将文件注册到系统数据库。

**请求参数（JSON Body）：**

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `fullId` | string | 是 | 第一步返回的文件 ID |
| `filePath` | string | 是 | 第一步返回的存储路径 |
| `sha256` | string | 是 | 文件 SHA-256 哈希（hex） |
| `fileSize` | integer | 是 | 文件大小（字节） |
| `fileName` | string | 否 | 文件名 |
| `fileType` | string | 否 | 文件 MIME 类型 |
| `channelName` | string | 否 | 指定渠道名称（多渠道场景），可通过 `/api/channels` 获取可用列表 |

**请求示例：**

```
POST /upload/huggingface/commitUpload
Content-Type: application/json
Authorization: Bearer <API_TOKEN>

{
  "fullId": "videos/1713500000000_large-video.mp4",
  "filePath": "videos/a1b2c3d4_1713500000000_large-video.mp4",
  "sha256": "e3b0c44298fc1c149afbf4c8996fb924...",
  "fileSize": 524288000,
  "fileName": "large-video.mp4",
  "fileType": "video/mp4",
  "channelName": "my-hf-channel"
}
```

**响应示例：**

```json
{
  "success": true,
  "src": "/file/videos/1713500000000_large-video.mp4",
  "publicUrl": "https://img.example.com/videos/1713500000000_large-video.mp4",
  "fileUrl": "https://huggingface.co/datasets/username/repo-name/resolve/main/videos/a1b2c3d4_1713500000000_large-video.mp4",
  "fullId": "videos/1713500000000_large-video.mp4"
}
```

### 流程总结

![HF直传示意图](/images/api/hf_direct_upload.png)
