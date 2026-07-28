# Read File API

The Read File API provides a unified path for accessing files stored in CloudFlare ImgBed. It supports all storage channels, HEAD requests, byte-range reads, and URL-based image resizing on Worker and Docker deployments.

## Basic Information

- **Endpoint**: `/file/{path}`
- **Methods**: `GET`, `HEAD`
- **Authentication**: Regular files usually require no authentication; access is still subject to allowed-domain, file allowlist/blocklist, and content moderation settings
- **Response Content**: Binary file content

## Request Parameters

### Path Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `path` | string | Yes | File path, such as `photo.jpg` or `album/2026/photo.jpg`; URL-encode special characters |

### Query Parameters

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `width` | integer | No | - | Maximum image width from `1` to `4096`; may be used alone while preserving the source aspect ratio |
| `height` | integer | No | - | Maximum image height from `1` to `4096`; may be used alone while preserving the source aspect ratio |
| `fit` | string | No | - | Fit mode when both dimensions are set: `cover` proportionally resizes and center-crops, while `squeeze` stretches to the exact dimensions; requires both `width` and `height` |
| `from` | string | No | - | Set to `admin` for an authenticated management preview; regular file requests should omit it |

Without `fit`, `width` and `height` define a maximum bounding box. The source aspect ratio is preserved and the image is not enlarged. For example, a `1600×900` source requested with `width=640&height=480` is returned as `640×360`.

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Range` | No | Requests a byte range of the original file. It cannot be combined with image resizing parameters |
| `Referer` | No | Used for hotlink protection when allowed source domains are configured |
| `Authorization` | No | Required only for protected scenarios such as management previews |

## Image Resizing

This feature is disabled by default. Enable it under **System Settings → Security Settings → Access Management → Image Resizing**. Leave Allowed Sizes empty to accept any valid dimensions, or enter combinations such as `320xauto,autox480,1280x720` to restrict available sizes. Here, `auto` leaves that dimension unrestricted.

Image resizing is available with the following deployment types:

- **Cloudflare Worker**: Uses the Cloudflare Images binding. The Free plan includes 5,000 unique transformation combinations per month
- **Docker**: Uses Sharp to process images

Cloudflare Pages Functions does not currently provide the Images binding, so resizing parameters are unavailable on Pages deployments. Source images are limited to 20 MB. JPEG, PNG, WebP, AVIF, GIF, and SVG are supported; processed GIF files are returned as WebP, and SVG files as PNG.

## Response

A successful `GET` request returns the original file or transformed image as binary content, with `Content-Type` set to the actual output format. A `HEAD` request returns headers only. A valid byte-range request for the original file returns `206 Partial Content`.

Common response headers include:

| Header | Description |
|--------|-------------|
| `Content-Type` | MIME type of the file or transformed image |
| `Content-Disposition` | Defaults to inline display and includes the filename |
| `Cache-Control` | The file's cache policy; resizing preserves the existing policy |
| `Access-Control-Allow-Origin` | Set to `*` to permit cross-origin reads |

## Error Statuses

| Status | Description |
|--------|-------------|
| `400` | The file path cannot be decoded, resizing parameters are invalid or duplicated, or resizing is combined with a Range request |
| `401` | The management preview is unauthorized |
| `403` | Access is denied by file access rules, or image resizing is disabled |
| `404` | File not found |
| `405` | A resized request used a method other than GET |
| `413` | The source image exceeds 20 MB |
| `415` | The file is not a supported image format |
| `416` | The requested byte range is invalid for a storage channel that supports range reads |
| `422` | Image transformation failed |
| `500` | Storage configuration, source retrieval, or chunk reconstruction failed |
| `501` | No image processor is configured for this deployment |

## Examples

### Read the Original File

```bash
curl --location 'https://your.domain/file/album/example.jpg' \
--output example.jpg
```

### Center-Crop to Exact Dimensions

```html
<img src="https://your.domain/file/album/example.jpg?width=640&height=480&fit=cover" alt="Example image">
```
