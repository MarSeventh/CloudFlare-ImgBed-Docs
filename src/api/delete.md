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

删除仍保持原有幂等语义：记录原本不存在时也返回成功。新增字段用于区分是否确实存在文件记录，不改变原有状态码和 `success` 的含义。

- 单文件响应的 `existed` 为 `true` 表示删除前记录存在，`false` 表示记录原本不存在。
- 批量和文件夹响应中的 `deleted` 保留所有幂等成功的 ID；`missing` 是其中记录原本不存在的子集，不能把 `deleted.length` 直接当作实际删除的记录数。
- `details` 提供每项的 `fileId`、`success`、`existed` 和 `error`。实际删除的记录数可按 `details.filter(item => item.success && item.existed).length` 统计。
- 已缺失的记录仍会清理对应的残留索引；删除失败的记录和索引会保留。`existed` 描述服务端记录，不表示已枚举或核对远端存储对象。
- 文件夹接口保留原有顶层 `success` 行为，判断部分失败时请检查 `failed` 或 `details`；批量接口有任一失败时 `success` 为 `false`。

### 单文件删除成功响应

```json
{
  "success": true,
  "fileId": "example/image.jpg",
  "existed": true
}
```

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
