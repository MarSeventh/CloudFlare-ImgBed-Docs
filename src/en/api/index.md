# API Overview

CloudFlare ImgBed provides a series of API interfaces that facilitate users and developers to perform file upload, deletion, listing, and random image retrieval operations.

Additionally, the project supports the standard WebDAV protocol, allowing users to manage files through WebDAV clients. For detailed information, please refer to the [WebDAV Documentation](./webdav).

## API Endpoints
- **Upload API**: `/upload`
- **Read File API**: `/file/{path}`
- **Delete API**: `/api/manage/delete`
- **List API**: `/api/manage/list`
- **Random Image API**: `/random`

## Authentication

For all interfaces that require authentication, unless otherwise specified, the API Token authentication method is uniformly adopted. Users need to provide a valid API Token during upload to perform related operations.

### API Token Generation

Users can generate API Tokens in the CloudFlare ImgBed `Admin Panel -> System Settings -> Security Settings -> API Token Management`. After generation, please save it properly, as for security reasons, the Token will only be displayed once.

::: warning Notice
Try to set Token permissions according to the required operations, and avoid using overly broad permissions.

Do not leak API Tokens to others to avoid unnecessary security risks.
:::

### API Token Usage

When calling the API, you need to add the following field to the request header:

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
