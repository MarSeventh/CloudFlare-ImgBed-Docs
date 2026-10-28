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

### Single File Deletion Success Response

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | `true` when the deletion request succeeds; an already absent record also counts as success |
| `fileId` | string | The file ID requested for deletion |
| `existed` | boolean | Whether the file record existed in ImgBed before deletion |

Deleting an existing record returns `existed: true`. An already absent record returns `existed: false`. Both cases return HTTP `200`.

```json
{
  "success": true,
  "fileId": "example/image.jpg",
  "existed": true
}
```

### Folder and Batch Deletion Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | For batch deletion, `true` when every file is processed successfully. For folder deletion, `true` when traversal and processing finish; individual deletions may have failed, so check `failed` |
| `deleted` | string[] | Successfully processed file IDs, including files whose records were already absent |
| `missing` | string[] | The subset of `deleted` whose records were absent before deletion |
| `failed` | string[] / object[] | Failed deletions. Folder deletion returns file IDs; batch deletion returns objects containing `fileId` and `error` |
| `details` | object[] | Per-file results, with the fields listed below |

Each item in `details` contains:

| Field | Type | Description |
|-------|------|-------------|
| `fileId` | string | File ID |
| `success` | boolean | Whether the file was processed successfully; an already absent record also counts as success |
| `existed` | boolean | When `success` is `true`, indicates whether the file record existed before deletion |
| `error` | string | Failure reason, or an empty string on success |

To count records actually deleted, count the items in `details` where both `success` and `existed` are `true`.

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
curl --location --request GET 'https://your.domain/api/manage/delete/example/image.jpg' \
--header 'Authorization: Bearer your_token'
```

### Delete Folder

```bash
curl --location --request GET 'https://your.domain/api/manage/delete/example/folder?folder=true' \
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
