# Upload API

The Upload API allows uploading files to CloudFlare ImgBed from third-party applications and services.

## Basic Information

- **Endpoint**: `/upload`
- **Method**: `POST`
- **Authentication**: Upload auth code or API Token (requires `upload` permission)
- **Content Type**: `multipart/form-data`

## Response Format

Successful basic uploads and chunk merges return an array by default:

```json
[
  {
    "src": "/file/abc123_image.jpg",
    "publicUrl": "https://img.example.com/abc123_image.jpg"
  }
]
```

For clients that can only read JSON objects, add `responseFormat=object` to the upload or merge request. For example, `/upload?responseFormat=object&returnFormat=full` returns:

```json
{
  "src": "https://your.domain/file/abc123_image.jpg",
  "publicUrl": "https://img.example.com/abc123_image.jpg"
}
```

`responseFormat` controls the JSON shape; `returnFormat` controls whether `src` is a relative path or a full URL. Only `responseFormat=object` selects an object; omitted or other values retain the array response. Chunk initialization, individual chunks, HuggingFace direct upload and error responses keep their respective formats.

Common fields:

| Field | Type | Description |
|-------|------|-------------|
| `src` | string | File access path. By default it does not include the domain, for example `/file/abc123_image.jpg`; with `returnFormat=full`, it returns a full URL for the current site |
| `publicUrl` | string | Optional. For successful basic uploads and chunked-upload merge, returned when a default URL prefix is set under `System Settings -> Web Settings -> Global Settings -> Default URL Prefix`; combines that prefix with the file ID |
| `expiresAt` | number | Optional. Expiry time in milliseconds when the file has an expiry |

## Basic Upload

Upload a file directly via the `/upload` endpoint. Suitable for small files.

### Parameters

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `authCode` | string | No | - | Upload authentication code |
| `uploadChannel` | string | No | `telegram` | Storage channel: `telegram`, `cfr2`, `s3`, `discord`, `huggingface`, `webdav` |
| `channelName` | string | No | - | Specific channel name (multi-channel scenarios). Get available list via `/api/channels` |
| `serverCompress` | boolean | No | `true` | Server-side compression (Telegram channel images only) |
| `autoRetry` | boolean | No | `true` | Auto-retry with another channel on failure |
| `uploadNameType` | string | No | `default` | Naming: `default` (prefix_original), `index` (prefix only), `origin` (original only), `short` (short link) |
| `returnFormat` | string | No | `default` | Link format: `default` (`/file/id`), `full` (full URL) |
| `responseFormat` | string | No | `array` | JSON shape: `array` (default), `object` (single file object) |
| `uploadFolder` | string | No | - | Upload directory, relative path, e.g. `img/test` |
| `expire` | string | No | - | File expiry such as `12h`, `7d` or `forever`. Only applies when the administrator has enabled [File Expiry](../deployment/configuration.md#file-expiry) and lets uploaders choose; must be one of the available options, otherwise 400 |

If `expire` is omitted, the configured default applies. When file expiry is disabled, uploads are permanent; when uploaders may not choose, any supplied `expire` value is ignored.

**Body Parameters (FormData):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | File to upload |

### Example

```bash
curl -X POST 'https://your.domain/upload?authCode=YOUR_CODE&uploadChannel=telegram' \
  -F 'file=@"/path/to/image.jpg"'
```

::: tip File Size Limits
- **Cloudflare Pages deployment**: max request body **100MB**
- **Telegram channel**: single file max **20MB** (auto server-side chunking beyond this)
- **Discord channel**: free **10MB** / Nitro **25MB**
- **HuggingFace channel**: basic upload proxied through backend, limited by CF Workers CPU time. Use direct upload for large files (see below)
:::

## Chunked Upload (Telegram / R2 / S3 / Discord)

For large files, the client splits the file into chunks, uploads them individually, then requests the server to merge. Supported for `telegram`, `cfr2`, `s3`, and `discord` channels.

::: warning HuggingFace does NOT support chunked upload
HuggingFace has its own direct upload flow for large files. See [HuggingFace Direct Upload](#huggingface-direct-upload) below.
:::

### Recommended Chunk Sizes

| Channel | Recommended Size | Notes |
|---------|-----------------|-------|
| `telegram` | **16MB** | Telegram Bot getFile download limit is 20MB, 4MB safety margin |
| `cfr2` / `s3` | **5MB - 20MB** | Follows S3 Multipart Upload spec, minimum 5MB |
| `discord` | **8MB** | Free user limit is 10MB, leave margin |

### Upload Flow

Chunked upload has three steps: **Initialize → Upload Chunks → Merge**.

#### Step 1: Initialize

Create an upload session and obtain an `uploadId`.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `authCode` | string | No | Upload authentication code |
| `initChunked` | boolean | Yes | Set to `true` |
| `expire` | string | No | File expiry, same rules as a basic upload; validated at initialization, and the merge request must send the same value |
| `uploadChannel` | string | No | Storage channel: `telegram`, `cfr2`, `s3`, `discord` |
| `channelName` | string | No | Specific channel name (multi-channel scenarios). Get available list via `/api/channels` |

**Body Parameters (FormData):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `originalFileName` | string | Yes | Original file name |
| `originalFileType` | string | Yes | Original file MIME type |
| `totalChunks` | integer | Yes | Total number of chunks |

**Request Example:**

```
POST /upload?authCode=YOUR_CODE&initChunked=true&uploadChannel=telegram
Content-Type: multipart/form-data

FormData:
  originalFileName: "video.mp4"
  originalFileType: "video/mp4"
  totalChunks: 5
```

**Response Example:**

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

#### Step 2: Upload Chunks

Split the file by the recommended chunk size and upload each chunk. Each request is **synchronous** — the server waits for the chunk to be stored before responding.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `authCode` | string | No | Upload authentication code |
| `chunked` | boolean | Yes | Set to `true` |
| `uploadChannel` | string | No | Storage channel: `telegram`, `cfr2`, `s3`, `discord` |
| `channelName` | string | No | Specific channel name (multi-channel scenarios). Get available list via `/api/channels` |

**Body Parameters (FormData):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | File | Yes | Chunk binary data |
| `uploadId` | string | Yes | Upload session ID from initialization |
| `chunkIndex` | integer | Yes | Chunk index, 0-based |
| `totalChunks` | integer | Yes | Total number of chunks |
| `originalFileName` | string | Yes | Original file name |
| `originalFileType` | string | Yes | Original file MIME type |

**Request Example:**

```
POST /upload?authCode=YOUR_CODE&chunked=true&uploadChannel=telegram
Content-Type: multipart/form-data

FormData:
  file: <chunk binary data>
  uploadId: "upload_1713500000000_abc123def"
  chunkIndex: 0
  totalChunks: 5
  originalFileName: "video.mp4"
  originalFileType: "video/mp4"
```

**Response Example:**

```json
{
  "success": true,
  "message": "Chunk 1/5 received and being uploaded",
  "uploadId": "upload_1713500000000_abc123def",
  "chunkIndex": 0
}
```

::: tip Concurrent Uploads
Chunks can be uploaded concurrently for better speed. For R2/S3 channels, the first chunk (`chunkIndex=0`) initializes the Multipart Upload; other chunks automatically wait for initialization (up to 60 seconds).
:::

#### Step 3: Merge

After all chunks are uploaded, request a merge. The merge process is **synchronous**.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `authCode` | string | No | Upload authentication code |
| `chunked` | boolean | Yes | Set to `true` |
| `merge` | boolean | Yes | Set to `true` |
| `expire` | string | No | File expiry, same value as at initialization |
| `uploadChannel` | string | No | Storage channel: `telegram`, `cfr2`, `s3`, `discord` |
| `channelName` | string | No | Specific channel name (multi-channel scenarios). Get available list via `/api/channels` |
| `returnFormat` | string | No | Link format: `default` (`/file/id`), `full` (full URL) |
| `responseFormat` | string | No | JSON shape: `array` (default), `object` (single file object) |
| `uploadFolder` | string | No | Upload directory, relative path, e.g. `img/test` |

**Body Parameters (FormData):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `uploadId` | string | Yes | Upload session ID |
| `totalChunks` | integer | Yes | Total number of chunks |
| `originalFileName` | string | Yes | Original file name |
| `originalFileType` | string | Yes | Original file MIME type |

**Request Example:**

```
POST /upload?authCode=YOUR_CODE&chunked=true&merge=true&uploadChannel=telegram
Content-Type: multipart/form-data

FormData:
  uploadId: "upload_1713500000000_abc123def"
  totalChunks: 5
  originalFileName: "video.mp4"
  originalFileType: "video/mp4"
```

**Response Example:**

```json
[
  {
    "src": "/file/1713500000000_video.mp4",
    "publicUrl": "https://img.example.com/1713500000000_video.mp4"
  }
]
```

::: tip Failure Retry
During merge, the server automatically checks chunk statuses and retries failed/timed-out chunks (up to 5 times). If chunks remain incomplete, the merge returns an error.
:::

### Cleanup Request

To cancel an in-progress upload and release temporary data.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `authCode` | string | No | Upload authentication code |
| `cleanup` | boolean | Yes | Set to `true` |
| `uploadId` | string | Yes | Upload session ID |
| `totalChunks` | integer | Yes | Total number of chunks |

```
POST /upload?authCode=YOUR_CODE&cleanup=true&uploadId=xxx&totalChunks=5
```

## HuggingFace Direct Upload

The HuggingFace channel uses a dedicated upload flow where **the client uploads directly to HuggingFace LFS storage**. CF Workers only handle signing and committing, bypassing Cloudflare's 100MB request body limit and CPU time constraints.

### Choosing Upload Method

| Scenario | Method | Notes |
|----------|--------|-------|
| Small files (< 20MB) | Basic upload `/upload?uploadChannel=huggingface` | File proxied through backend |
| Large files (≥ 20MB) | Direct upload (3 steps) | Client uploads directly to HuggingFace S3 |

### Direct Upload Flow

::: tip File expiry
Send the same `expire` query parameter on both the upload-URL and the commit requests (e.g. `/upload/huggingface/getUploadUrl?expire=7d`); the rules are the same as for a basic upload.
:::

#### Prerequisites

The client must pre-compute:
- **SHA-256**: Full file content SHA-256 hash (hex string)
- **fileSample**: Base64 encoding of the first 512 bytes

#### Step 1: Get Upload URL

**Request Parameters (JSON Body):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fileName` | string | Yes | File name |
| `fileType` | string | Yes | File MIME type |
| `fileSize` | integer | Yes | File size in bytes |
| `sha256` | string | Yes | File SHA-256 hash (hex) |
| `fileSample` | string | Yes | Base64 of first 512 bytes |
| `channelName` | string | No | Specific channel name (multi-channel scenarios). Get available list via `/api/channels` |
| `uploadNameType` | string | No | Naming: `default` (prefix_original), `index` (prefix only), `origin` (original only), `short` (short link) |
| `uploadFolder` | string | No | Upload directory, relative path, e.g. `img/test` |

**Request Example:**

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

**Response Example:**

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

**Key fields:**
- `needsLfs: false` — file doesn't need LFS (tiny text files), skip to Step 3
- `alreadyExists: true` — file already in LFS, skip Step 2 and go to Step 3
- `uploadAction.header.chunk_size` — if present, HuggingFace requires multipart upload; zoro-padding numeric keys (`"00001"`, `"00002"`, ...) in `header` are pre-signed URLs for each part

#### Step 2: Upload File to HuggingFace S3

Upload directly to HuggingFace S3 storage using the `uploadAction` info.

**Basic upload** (no `chunk_size`):

```
PUT <uploadAction.href>
Headers: <uploadAction.header>
Body: <file binary content>
```

**Multipart upload** (has `chunk_size`):

Split the file by `chunk_size`, PUT each part to `header["00001"]`, `header["00002"]`, etc., collecting the `ETag` from each response. After all parts are uploaded, complete the upload:

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

#### Step 3: Commit File Reference

After upload, call the commit endpoint to register the file in the system database.

**Request Parameters (JSON Body):**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fullId` | string | Yes | File ID from Step 1 |
| `filePath` | string | Yes | Storage path from Step 1 |
| `sha256` | string | Yes | File SHA-256 hash (hex) |
| `fileSize` | integer | Yes | File size in bytes |
| `fileName` | string | No | File name |
| `fileType` | string | No | File MIME type |
| `channelName` | string | No | Specific channel name (multi-channel scenarios). Get available list via `/api/channels` |

**Request Example:**

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

**Response Example:**

```json
{
  "success": true,
  "src": "/file/videos/1713500000000_large-video.mp4",
  "publicUrl": "https://img.example.com/videos/1713500000000_large-video.mp4",
  "fileUrl": "https://huggingface.co/datasets/username/repo-name/resolve/main/videos/a1b2c3d4_1713500000000_large-video.mp4",
  "fullId": "videos/1713500000000_large-video.mp4"
}
```

### Flow Summary

![HF Direct Upload Demo](/images/api/hf_direct_upload.png)
