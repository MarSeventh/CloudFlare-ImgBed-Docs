# 删除 API

删除 API 支持删除 CloudFlare ImgBed 中的文件，包括单个文件、文件夹和批量文件删除功能。

## 基本信息

- **端点**：`/api/manage/delete/{path}`
- **方法**：`GET`
- **认证**：需要`delete`权限
- **内容类型**：`application/json`

## 请求参数

### 路径参数

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `path` | string | 是 | 文件或文件夹路径（如file.png或your/folder） |

### Query 参数

| 参数名 | 类型 | 必需 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `folder` | boolean | 否 | `false` | 是否为文件夹删除，`true`表示删除整个文件夹及其内容 |

## 功能说明

### 单文件删除
当 `folder` 参数为 `false` 或未提供时，删除指定的单个文件。

### 文件夹删除
当 `folder` 参数为 `true` 时，递归删除指定文件夹及其所有子文件夹和文件。

### 批量文件删除

使用批量删除接口可以一次删除多个文件，接口会并发处理删除请求。

#### 基本信息

- **端点**：`/api/manage/delete/batch`
- **方法**：`POST`
- **认证**：需要`delete`权限
- **内容类型**：`application/json`

#### 请求体

| 参数名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `fileIds` | string[] | 是 | 要删除的文件路径列表，单次最多 500 个文件，重复路径只处理一次 |

```json
{
  "fileIds": [
    "folder/image1.jpg",
    "folder/image2.png"
  ]
}
```

## 响应格式

### 单文件删除成功响应

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `success` | boolean | 删除请求处理成功时为 `true`，目标记录不存在也视为成功 |
| `fileId` | string | 请求删除的文件 ID |
| `existed` | boolean | 删除前图床中是否存在该文件记录 |

文件记录存在且删除成功时，返回 `existed: true`；记录不存在时，返回 `existed: false`。两种情况的 HTTP 状态码均为 `200`。

```json
{
  "success": true,
  "fileId": "example/image.jpg",
  "existed": true
}
```

### 文件夹和批量删除响应字段

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `success` | boolean | 批量删除中，所有文件均处理成功时为 `true`；文件夹删除中，遍历处理完成时为 `true`，部分文件可能删除失败，需检查 `failed` |
| `deleted` | string[] | 处理成功的文件 ID 列表，包含记录不存在的文件 |
| `missing` | string[] | `deleted` 中删除前记录不存在的文件 ID 列表 |
| `failed` | string[] / object[] | 删除失败的文件。文件夹接口返回文件 ID 数组；批量接口返回包含 `fileId` 和 `error` 的对象数组 |
| `details` | object[] | 每个文件的处理结果，字段见下表 |

`details` 中每项的字段：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| `fileId` | string | 文件 ID |
| `success` | boolean | 该文件是否处理成功，记录不存在也视为成功 |
| `existed` | boolean | `success` 为 `true` 时，表示删除前是否存在该文件记录 |
| `error` | string | 失败原因，成功时为空字符串 |

需要统计实际删除的文件记录数时，统计 `details` 中 `success` 和 `existed` 均为 `true` 的项。

### 文件夹删除成功响应

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

### 批量删除成功响应

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

### 批量删除部分失败响应

当部分文件删除失败时，`success` 为 `false`，`failed` 中会返回失败文件及原因。

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

### 错误响应

```json
{
  "success": false,
  "error": "Delete file failed"
}
```

## 示例

### 删除单个文件

```bash
curl --location --request GET 'https://your.domain/api/manage/delete/example/image.jpg' \
--header 'Authorization: Bearer your_token'
```

### 删除文件夹

```bash
curl --location --request GET 'https://your.domain/api/manage/delete/example/folder?folder=true' \
--header 'Authorization: Bearer your_token'
```

### 批量删除文件

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
