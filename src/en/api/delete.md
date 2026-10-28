# Delete API

The Delete API supports deleting files in CloudFlare ImgBed, including single file, folder, and batch file deletion functionality.

## Basic Information

- **Endpoint**: `/api/manage/delete/{path}`
- **Method**: `GET`
- **Authentication**: `delete` privileges required
- **Content Type**: `application/json`

## Request Parameters

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | string | Yes | File path or folder path(e.g., `file.png` or `your/folder`) |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `folder` | boolean | No | `false` | Whether it's a folder deletion, `true` means delete entire folder and its contents |

## Functionality

### Single File Deletion
When the `folder` parameter is `false` or not provided, deletes the specified single file.

### Folder Deletion
When the `folder` parameter is `true`, recursively deletes the specified folder and all its subfolders and files.

### Batch File Deletion

Use the batch deletion endpoint to delete multiple files in one request. Files are deleted concurrently.

#### Basic Information

- **Endpoint**: `/api/manage/delete/batch`
- **Method**: `POST`
- **Authentication**: `delete` privileges required
- **Content Type**: `application/json`

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `fileIds` | string[] | Yes | List of file paths to delete; up to 500 files per request, duplicate paths are processed only once |

```json
{
  "fileIds": [
    "folder/image1.jpg",
    "folder/image2.png"
  ]
}
```


## Response Format

Deletion remains idempotent: a missing record still returns success. The new fields distinguish whether a file record existed without changing existing status codes or `success` semantics.

- A single-file response sets `existed` to `true` when the record existed before deletion, or `false` when it was already absent.
- Batch and folder responses retain all idempotently successful IDs in `deleted`; `missing` is the subset whose records were already absent. Do not treat `deleted.length` as the number of records actually deleted.
- `details` provides `fileId`, `success`, `existed`, and `error` for each item. Count actual record deletions with `details.filter(item => item.success && item.existed).length`.
- Missing records still have stale index entries removed; failed deletions retain their records and indexes. `existed` describes the service record, not a remote storage inventory check.
- Folder deletion preserves its existing top-level `success` behavior; check `failed` or `details` for partial failures. Batch deletion sets `success` to `false` if any item fails.

### Single File Deletion Success Response

```json
{
  "success": true,
  "fileId": "example/image.jpg",
  "existed": true
}
```

### Folder Deletion Success Response

```json
{
  "success": true,
  "deleted": [
    "folder/image1.jpg",
    "folder/image2.png",
    "folder/subfolder/image3.gif"
  ],
  "failed": [],
  "missing": [],
  "details": [
    { "fileId": "folder/image1.jpg", "success": true, "existed": true, "error": "" },
    { "fileId": "folder/image2.png", "success": true, "existed": true, "error": "" },
    { "fileId": "folder/subfolder/image3.gif", "success": true, "existed": true, "error": "" }
  ]
}
```

### Batch Deletion Success Response

```json
{
  "success": true,
  "deleted": [
    "folder/image1.jpg",
    "folder/image2.png"
  ],
  "failed": [],
  "missing": ["folder/image2.png"],
  "details": [
    { "fileId": "folder/image1.jpg", "success": true, "existed": true, "error": "" },
    { "fileId": "folder/image2.png", "success": true, "existed": false, "error": "" }
  ]
}
```

### Partial Batch Deletion Failure Response

When some files cannot be deleted, `success` is `false` and `failed` contains each failed file and its reason.

```json
{
  "success": false,
  "deleted": ["folder/image1.jpg"],
  "failed": [
    {
      "fileId": "folder/image2.png",
      "error": "Delete file failed"
    }
  ],
  "missing": [],
  "details": [
    { "fileId": "folder/image1.jpg", "success": true, "existed": true, "error": "" },
    { "fileId": "folder/image2.png", "success": false, "existed": true, "error": "Delete file failed" }
  ]
}
```

### Error Response

```json
{
  "success": false,
  "error": "Delete file failed"
}
```

## Examples

### Delete Single File

```bash
curl --location --request GET 'https://your.domain/api/manage/delete/example,image.jpg' \
--header 'Authorization: Bearer your_token'
```

### Delete Folder

```bash
curl --location --request GET 'https://your.domain/api/manage/delete/example,folder?folder=true' \
--header 'Authorization: Bearer your_token'
```

### Batch Delete Files

```bash
curl --location --request POST 'https://your.domain/api/manage/delete/batch' \
--header 'Authorization: Bearer your_token' \
--header 'Content-Type: application/json' \
--data '{
  "fileIds": [
    "folder/image1.jpg",
    "folder/image2.png"
  ]
}'
```
