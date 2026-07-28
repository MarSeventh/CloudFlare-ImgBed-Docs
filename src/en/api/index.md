# API Overview

CloudFlare ImgBed provides APIs for uploading, reading, deleting, and listing files, retrieving random files, and managing API Tokens. In addition to its HTTP APIs, the project supports the standard WebDAV protocol for file management through WebDAV clients. See the [WebDAV documentation](./webdav) for details.

## Base URL

All endpoints in this documentation are relative to your CloudFlare ImgBed site URL, for example:

```text
https://your.domain
```

Append an endpoint to the site URL to call it, such as `https://your.domain/upload`. URL-encode path parameters that contain spaces, non-ASCII characters, or other special characters.

## API Endpoints

| API | Endpoint | Methods | Access Requirements |
|-----|----------|---------|---------------------|
| [Upload API](./upload) | `/upload` | `POST` | Upload auth code or an API Token with `upload` permission; authentication is not required when user authentication is not configured |
| [Read API](./file) | `/file/{path}` | `GET`, `HEAD` | Regular reads usually require no authentication but remain subject to domain, allowlist/blocklist, and content moderation rules |
| [Delete API](./delete) | `/api/manage/delete/{path}`<br>`/api/manage/delete/batch` | `GET`<br>`POST` | Admin session or an API Token with `delete` permission |
| [List API](./list) | `/api/manage/list` | `GET` | Admin session or an API Token with `list` permission |
| [Random Image API](./random) | `/random` | `GET` | No authentication, but the random image feature must be enabled |
| [Token Management API](./token) | `/api/manage/apiTokens` | `GET`, `POST`, `PUT`, `DELETE` | Admin session or an API Token with `manage` permission |
| [WebDAV](./webdav) | `/dav/` | `OPTIONS`, `PROPFIND`, `GET`, `PUT`, `DELETE`, `MOVE`, `MKCOL` | WebDAV must be enabled and uses its separately configured username and password |

## Authentication

Protected HTTP APIs accept an API Token through the `Authorization` request header. Available Token permissions are:

- `upload`: Upload files
- `delete`: Delete individual files, folders, or batches of files
- `list`: Query file lists
- `manage`: Manage API Tokens and access other management endpoints

Management endpoints also accept an authenticated admin session, while the Upload API additionally supports the user upload auth code. The Read and Random Image APIs usually do not require an API Token. WebDAV uses its separately configured username and password. Refer to each API page for its exact requirements.

### API Token Generation

Generate API Tokens under **Admin Panel → System Settings → Security Settings → API Token Management**. A Token is shown in full only once when it is created, so store it securely at that time.

::: warning Notice
Try to set Token permissions according to the required operations, and avoid using overly broad permissions.

Do not leak API Tokens to others to avoid unnecessary security risks.
:::

### API Token Usage

For APIs that require Token authentication, use either of the following request header formats. The Bearer format is recommended:

```http
Authorization: Bearer YOUR_API_TOKEN

or

Authorization: YOUR_API_TOKEN
```

Usage example:

```bash
curl -X POST "https://your-cloudflare-imgbed-url/upload" \
-H "Authorization: Bearer YOUR_API_TOKEN" \
-F "file=@/path/to/your/image.jpg"
```
