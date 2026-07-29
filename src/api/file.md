# 读取 API

读取 API 用于通过统一路径访问已经存储在 CloudFlare ImgBed 中的文件。接口支持各存储渠道的文件读取、HEAD 请求、Range 分段读取，以及按 URL 参数缩放图片。

## 基本信息

- **端点**：`/file/{path}`
- **方法**：`GET`、`HEAD`
- **认证**：普通文件通常无需认证；实际访问仍受域名白名单、文件黑白名单和内容审查配置限制
- **响应内容**：文件二进制内容

## 请求参数

### 路径参数

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `path` | string | 是 | 文件路径，例如 `photo.jpg` 或 `album/2026/photo.jpg`；路径中的特殊字符应进行 URL 编码 |

### Query 参数

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `width` | integer | 否 | - | 图片最大宽度，取值范围为 `1`–`4096`；可单独使用，此时保持原始宽高比 |
| `height` | integer | 否 | - | 图片最大高度，取值范围为 `1`–`4096`；可单独使用，此时保持原始宽高比 |
| `fit` | string | 否 | - | 同时设置宽高时的适配方式：`cover` 按比例居中裁剪，`squeeze` 拉伸到指定尺寸；必须与 `width`、`height` 一起使用 |
| `fallback` | string | 否 | - | 仅支持 `original`；格式不受当前部署支持、源文件超限或处理失败时返回原文件，必须与图片尺寸参数一起使用 |
| `from` | string | 否 | - | 设为 `admin` 时表示管理端预览，需要管理权限，普通文件读取不应设置此参数 |

不传 `fit` 时，`width` 和 `height` 表示图片的最大边界：图片保持原始宽高比且不会放大。例如原图为 `1600×900`，请求 `width=640&height=480` 时返回 `640×360`。

### 请求头

| 请求头 | 必需 | 说明 |
|--------|------|------|
| `Range` | 否 | 请求原文件的指定字节范围。不能与图片尺寸处理参数同时使用 |
| `Referer` | 否 | 配置来源域名限制后用于防盗链检查 |
| `Authorization` | 否 | 仅管理端预览等受保护场景需要 |

## 图片尺寸处理

::: warning 注意
图片尺寸处理默认关闭，JPEG、PNG 和 WebP 可在所有部署方式中处理；AVIF 仅 Worker 和 Docker 支持，Pages 默认返回 `415`；GIF 仅 Docker 支持并保持 GIF 格式，Pages 和 Worker 默认返回 `415`；SVG 及其他格式不支持。Worker 和 Docker 的待处理源文件最大为 20 MB，Pages 以 Cloudflare Images 当前限制为准。使用 `fallback=original` 可在格式不支持、源文件超限或处理失败时返回原文件。使用前请在[配置说明 → 安全设置 → 访问管理](/deployment/configuration#访问管理)中开启功能并配置允许尺寸。
:::

## 响应

成功的 `GET` 请求返回文件或处理后图片的二进制内容，`Content-Type` 根据实际输出格式设置；`HEAD` 请求只返回响应头。原文件的有效 Range 请求返回 `206 Partial Content`。

常见响应头包括：

| 响应头 | 说明 |
|--------|------|
| `Content-Type` | 文件或处理后图片的 MIME 类型 |
| `Content-Disposition` | 默认为内联展示，并包含文件名 |
| `Cache-Control` | 文件对应的缓存策略；尺寸处理不会改变原有策略 |
| `Access-Control-Allow-Origin` | 值为 `*`，允许跨域读取 |

## 错误状态

| 状态码 | 说明 |
|--------|------|
| `400` | 文件路径无法解码，尺寸或 fallback 参数无效、重复或缺少必要搭配，或尺寸处理与 Range 请求同时使用 |
| `401` | 管理端预览未授权 |
| `403` | 文件被访问规则拦截，或图片尺寸处理功能未开启 |
| `404` | 文件不存在 |
| `405` | 带尺寸参数的请求使用了 GET 以外的方法 |
| `413` | Worker 或 Docker 的待处理源文件超过 20 MB，且未设置 `fallback=original` |
| `415` | 当前部署不支持处理该图片格式，且未设置 `fallback=original` |
| `416` | Range 请求的范围无效（适用于支持分段读取的存储渠道） |
| `422` | 图片处理失败，且未设置 `fallback=original` |
| `500` | 存储配置异常、源文件读取失败或分片文件重组失败 |
| `501` | 当前部署未配置可用的图片处理器，且未设置 `fallback=original` |

## 示例

### 读取原文件

```bash
curl --location 'https://your.domain/file/album/example.jpg' \
--output example.jpg
```

### 按固定尺寸居中裁剪

```html
<img src="https://your.domain/file/album/example.jpg?width=640&height=480&fit=cover&fallback=original" alt="示例图片">
```
