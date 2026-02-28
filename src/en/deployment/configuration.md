# Configuration Guide

This section details the various configuration options and custom settings for CloudFlare ImgBed.

## 🗂️ Storage Channel Configuration

After deployment is complete, access your domain and enter the admin backend to configure storage channels.

### Access Admin Backend

Visit `https://your-domain/dashboard`
::: tip Note
   The admin backend requires no password by default. Please set an admin username and password promptly after logging in.
:::

### Configure Telegram Channel

1. Enter "System Settings" → "Upload Settings" from the top left menu
2. Find "Telegram Channel Configuration"
3. Click "Add Channel"
4. Fill in the prepared Token and Chat ID:
   - **Channel Name**: Custom name (e.g., Main Channel)
   - **Bot Token**: Token obtained from @BotFather
   - **Chat ID**: Channel ID (retain the `-` sign if present)
   - **Proxy URL**: (Optional) Custom proxy address for Telegram API requests
   - **Enable Status**: On
5. Click "Save Settings"

::: tip About Proxy Configuration
If your server cannot directly access the Telegram API, you can configure a proxy URL. You can use Cloudflare Worker to set up a simple proxy service:
```javascript
// worker.js
export default {
    async fetch(request) {
        const url = new URL(request.url);
        const target = `https://api.telegram.org${url.pathname}${url.search}`;
        const resp = await fetch(target, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            redirect: 'follow'
        });
        return new Response(resp.body, {
            status: resp.status,
            headers: resp.headers
        });
    }
};
```
After deploying this Worker, fill in the Worker address in the Proxy URL field.
:::

### Configure R2 Channel

For server deployment, Cloudflare R2 storage is added by default. The following steps are only for Cloudflare deployment:

1. Bind R2 bucket in project settings:
   - Select "Settings" → "Bindings"
   - Add "R2 bucket"
   - **Variable name**: `img_r2`
   - **R2 bucket**: Select the created bucket

![Configure R2 Channel](/images/deployment/r2-config.png)

2. Configure in admin backend:
   - Enter "System Settings" → "Upload Settings"
   - Configure R2 channel parameters
   - If image review is needed, fill in R2 public access link
::: tip Note
Please note the free tier limits of Cloudflare R2, exceeding which may incur costs.
   ![Note](/images/deployment/r2-free-tier.png)
:::

### Configure S3 Channel

Fill in the S3 channel configuration in the admin backend:

- **Access Key ID**: Access key ID
- **Secret Access Key**: Secret access key
- **Bucket Name**: Bucket name
- **Endpoint**: Service endpoint (complete URL, e.g., https://s3.us-east-005.backblazeb2.com)
- **PathStyle**: Path style (enable this option for compatibility with older S3 versions)
- **Region**: Storage region (optional)
- **CDN Domain**: (Optional) Custom CDN acceleration domain. The file will firstly read from CDN if configured.

### Configure Discord Channel

Fill in the Discord channel configuration in the admin backend:

- **Channel Name**: Custom name
- **Bot Token**: Discord Bot Token
- **Channel ID**: Discord Channel ID
- **Is Nitro**: Whether the account is Nitro (Nitro users have 25MB single file limit, regular users have 10MB)
- **Proxy URL**: (Optional) Custom proxy address

### Configure HuggingFace Channel

Fill in the HuggingFace channel configuration in the admin backend:

- **Channel Name**: Custom name
- **Token**: HuggingFace Access Token (obtain from https://huggingface.co/settings/tokens)
- **Repo**: Repository name (format: username/repo-name, username must be filled correctly, it will automatically create a dataset type repository)
- **Is Private**: Whether the repository is private

::: tip Note
HuggingFace channel supports large file direct upload, suitable for uploading files larger than 20MB. For large files, the system will automatically use LFS protocol for chunked uploads.
:::

## 🔒 Security Settings

Security-related settings are configured in "System Settings" → "Security Settings" in the admin backend

### Authentication Management

- User Authentication: Used for web user login and API authentication
- Admin Authentication: Admin username and password for accessing the admin backend

### Upload Management

#### Image Moderation

The moderation channels support both nsfwjs and moderatecontent.com. Please configure it yourself by following the steps below.

##### 1.moderatecontent.com

- Visit [ModerateContent](https://moderatecontent.com/)

- Register and obtain a free API Key (currently free registration is no longer supported)

- Enter the API Key in the management console under "System Settings" → "Security Settings"

##### 2.nsfwjs

Deploy the nsfwjs moderation service using Docker:
```bash
# Example command
docker run -d -p 127.0.0.1:5000:5000/tcp \
  --env PORT=5000 \
  --restart=always \
  eugencepoi/nsfw_api:latest
```
Enter the moderation service address in the management console under "System Settings" → "Security Settings", e.g., https://nsfwjs.your.domain

#### Show Directory Suggestions

When enabled, a directory tree picker button will be displayed on the upload page. Users can visually select the target folder instead of manually entering the path.

### Access Management

- Domain Filtering
  - Allowed Domains: List of domains allowed to access (leave empty to allow all domains, otherwise manually add the image hosting's own domain)
- Whitelist Mode: When enabled, only files added to the whitelist can be accessed

## 🌐 Web Settings

Frontend web-related settings are configured in "System Settings" → "Web Settings" in the admin backend

| Field Name | Purpose | Type | Content Specification |
|------------|---------|------|----------------------|
| siteTitle | Website Title | String | Only supports `string` type, set to your custom website title |
| siteIcon | Website Icon | String | Only supports `string` type, set to your custom website icon link |
| ownerName | Image Hosting Name | String | Only supports `string` type, set to your custom image hosting name (default is `Sanyue`) |
| logoUrl | Image Hosting Logo | String | Only supports `string` type, set to your custom image hosting logo link |
| logoLink | Logo Click Link | String | Only supports `string` type, set to the link when clicking the logo, leave empty to use default GitHub link. Only applies to upload page |
| bkInterval | Background Switch Interval | Positive Integer | Set to background image carousel time, default `3000`, unit `ms`.<br />For example, if you want to switch every 10s, set to `10000`. |
| bkOpacity | Background Image Transparency | Float in (0,1] | Displayed background image transparency, default is `1`.<br />If you think the display effect is poor, you can customize it, like `0.8` |
| urlPrefix | Default URL Prefix | String | Only supports `string` type, set to custom global default link prefix, this prefix will override the original default prefix, but will not override user-customized link prefixes |
| announcement | Announcement | String | Only supports `string` type, can be HTML format, set to your custom announcement content (if any) |
| defaultUploadChannel | Default Upload Channel | String | Only supports `string` type, set to your custom default upload channel, supports `telegram` (Telegram channel), `cfr2` (Cloudflare R2), `s3` (S3 channel), `discord` (Discord channel), and `huggingface` (HuggingFace channel) |
| defaultChannelName | Default Channel Name | String | Only supports `string` type, specify the default channel name to use, requires selecting an upload channel first. When multiple channels are configured for the same channel type, this can specify which channel to use by default |
| defaultUploadNameType | Default Naming Method | String | Only supports `string` type, set to your custom default upload file naming method, supports `default` (default), `index` (only prefix), `original` (only original name), and `short` (short link) |
| loginBkImg | Login Page Background | List/String | 1. When field type is `list`, list elements are image links to be added to the carousel list (when list has only one image, it becomes a fixed background), like `["1.jpg","2.jpg"]`<br />2. When field type is `string`, currently **only supports** string value `bing`, setting this value enables bing random image carousel mode. |
| uploadBkImg | Upload Page Background | List/String | Same as loginBkImg |
| footerLink | Footer Portal Link | String | Only supports `string` type, set to your custom destination address (like personal blog link) |
| disableFooter | Hide Footer | boolean | Supports `boolean` type, set to `true` to disable footer, default `false` |
| defaultConvertToWebp | Default WebP Conversion | boolean | Supports `boolean` type, set to `true` to enable WebP conversion by default, default `false` |
| defaultCustomerCompress | Default Compression | boolean | Supports `boolean` type, set to `true` to enable client compression by default, default `true` |
| defaultCompressBar | Default Compression Threshold | Number | Images larger than this value will be automatically compressed, unit MB, range 1-20, default `5` |
| defaultCompressQuality | Default Expected Size | Number | Expected image size after compression, unit MB, range 0.5-compression threshold, default `4` |
| adminLoginBkImg | Admin Login Page Background | List/String | Same as loginBkImg |
| adminBkImg | Admin Page Background | List/String | Same as loginBkImg |

## 🛠️ Other Settings
Other setting items are configured in "System Settings" → "Other Settings" in the admin backend

### Remote Telemetry
This helps developers capture and locate bugs, but may collect information such as access links and domain names during the process. If you don't want to disclose such information to project developers, please disable this feature in the admin backend.

### Random Image API
- Directory: Directories with random image permissions, default is root directory, multiple directories separated by commas; all directories use absolute paths, e.g., `/img/cover`, indicating that files in this directory and all its subdirectories can be accessed by the random image API.

### Visitor Gallery
Allows unauthenticated users to access files in specified directories, useful for creating public galleries or album displays.
- Enable Public Browse: Turn on or off the public browse feature
- Allowed Directories: Directories with public access permissions, multiple directories separated by commas; all directories use absolute paths (either start with `/` or not), e.g., `/img/gallery,/img/wallpapers`

::: tip Note
Once enabled, users can access the public gallery via the `/browse/directory-name` path, e.g., `/browse/img/gallery`
:::

### CloudFlare API Token
Under normal circumstances, due to the existence of CloudFlare CDN cache, operations such as deletion, blacklisting, and whitelisting in the admin backend will not take effect immediately and need to wait until the cache expires. To make operations take effect immediately, it is recommended to set this item as follows:
- `CF_ZONE_ID`: Cloudflare Zone ID of the bound domain
![How to get](/images/deployment/cf-zone-id.png)
- `CF_EMAIL`: Cloudflare account email
- `CF_API_KEY`: Cloudflare Global API Key
![How to get](/images/deployment/cf-api-key.png)

### WebDAV
WebDAV service related settings, detailed introduction and usage methods can be found in the [API documentation](../api/webdav.md).
- Enable WebDAV Service: Turn on or off the WebDAV service
- Username: WebDAV login username
- Password: WebDAV login password
- Upload Channel: Storage channel used when uploading files via WebDAV, supports Telegram, Cloudflare R2, S3, Discord, HuggingFace
- Channel Name: When the selected upload channel has multiple configurations, specify which channel name to use for uploading

## 🔧 Environment Variables List

::: warning Note
Environment variable setting method has been deprecated after v2.0. Please configure the following in the admin backend.
:::

### Basic Authentication Configuration

| Variable Name | Type | Required | Description | Example Value |
|--------------|------|----------|-------------|---------------|
| `BASIC_USER` | string | No | Admin username | `admin` |
| `BASIC_PASS` | string | No | Admin password | `your_secure_password` |
| `AUTH_CODE` | string | No | Upload authentication code | `your_auth_code` |

### Storage Channel Configuration

#### Telegram Channel

| Variable Name | Type | Required | Description | Example Value |
|--------------|------|----------|-------------|---------------|
| `TG_BOT_TOKEN` | string | Yes | Telegram Bot Token | `123456789:ABCdefGHI...` |
| `TG_CHAT_ID` | string | Yes | Telegram Channel ID | `-1001234567890` |

### Feature Switch Configuration

| Variable Name | Type | Default | Description |
|--------------|------|---------|-------------|
| `AllowRandom` | boolean | `false` | Enable random image API |
| `WhiteList_Mode` | boolean | `false` | Enable whitelist mode |
| `disable_telemetry` | boolean | `false` | Disable telemetry data |

### Security Configuration

| Variable Name | Type | Description | Example Value |
|--------------|------|-------------|---------------|
| `ALLOWED_DOMAINS` | string | List of domains allowed to access | `domain1.com,domain2.com` |
| `ModerateContentApiKey` | string | Image content review API Key | `your_api_key` |

### CDN Cache Configuration

| Variable Name | Type | Description | Purpose |
|--------------|------|-------------|---------|
| `CF_ZONE_ID` | string | Cloudflare Zone ID | Automatically clear CDN cache |
| `CF_EMAIL` | string | Cloudflare account email | Automatically clear CDN cache |
| `CF_API_KEY` | string | Cloudflare Global API Key | Automatically clear CDN cache |
