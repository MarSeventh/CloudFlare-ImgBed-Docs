# API 基本介绍

CloudFlare ImgBed 提供文件上传、读取、删除、列出、随机文件获取和 API Token 管理等接口。除 HTTP API 外，项目还支持标准 WebDAV 协议，可通过 WebDAV 客户端管理文件，详细说明请参阅 [WebDAV 文档](./webdav)。

## 基础 URL

文档中的端点均相对于您的 CloudFlare ImgBed 站点地址，例如：

```text
https://your.domain
```

将端点拼接到站点地址后即可调用，例如 `https://your.domain/upload`。路径参数包含空格、中文或其他特殊字符时，应进行 URL 编码。

## API 端点

| 接口 | 端点 | 方法 | 访问要求 |
|------|------|------|----------|
| [上传 API](./upload) | `/upload` | `POST` | 上传认证码，或具有 `upload` 权限的 API Token；未配置用户端认证时可直接上传 |
| [读取 API](./file) | `/file/{path}` | `GET`、`HEAD` | 普通读取通常无需认证，但受域名、黑白名单和内容审查规则限制 |
| [删除 API](./delete) | `/api/manage/delete/{path}`<br>`/api/manage/delete/batch` | `GET`<br>`POST` | 管理员会话，或具有 `delete` 权限的 API Token |
| [列出 API](./list) | `/api/manage/list` | `GET` | 管理员会话，或具有 `list` 权限的 API Token |
| [随机图 API](./random) | `/random` | `GET` | 无需认证，但需要先开启随机图功能 |
| [Token 管理 API](./token) | `/api/manage/apiTokens` | `GET`、`POST`、`PUT`、`DELETE` | 管理员会话，或具有 `manage` 权限的 API Token |
| [WebDAV](./webdav) | `/dav/` | `OPTIONS`、`PROPFIND`、`GET`、`PUT`、`DELETE`、`MOVE`、`MKCOL` | 需要先开启 WebDAV，并使用单独配置的 WebDAV 用户名和密码 |

## 鉴权方式

需要鉴权的 HTTP API 支持通过 `Authorization` 请求头传递 API Token。Token 权限包括：

- `upload`：上传文件
- `delete`：删除单个文件、文件夹或批量文件
- `list`：查询文件列表
- `manage`：管理 API Token 及调用其他管理接口

管理端接口也可以使用已登录的管理员会话；上传 API 还支持用户端上传认证码。读取 API 和随机图 API 通常无需 API Token，WebDAV 则使用单独配置的用户名和密码。具体要求以各接口文档为准。

### API Token 获取

用户可以在 CloudFlare ImgBed 的“管理界面 → 系统设置 → 安全设置 → API Token 管理”中生成 API Token。Token 只会在创建时完整显示一次，请及时妥善保存。

::: warning 注意
尽量根据所需操作设置 Token 的权限，避免使用过于宽泛的权限。

请勿将 API Token 泄露给他人，避免造成不必要的安全风险。
:::

### API Token 使用

调用需要 Token 鉴权的 API 时，在请求头中使用以下任一格式，建议优先使用 Bearer 格式：

```http
Authorization: Bearer YOUR_API_TOKEN

或

Authorization: YOUR_API_TOKEN
```

使用示例：

```bash
curl -X POST "https://your-cloudflare-imgbed-url/upload" \
-H "Authorization: Bearer YOUR_API_TOKEN" \
-F "file=@/path/to/your/image.jpg"
```
