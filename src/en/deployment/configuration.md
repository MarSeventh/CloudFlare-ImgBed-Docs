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

### Configure WebDAV Channel

Fill in the WebDAV channel configuration in the admin backend:

- **Channel Name**: Custom name
- **WebDAV Base URL**: Full URL of the WebDAV service (e.g., `https://dav.example.com/remote.php/dav/files/user/imgbed/`)
- **Username**: (Optional) WebDAV authentication username
- **Password**: (Optional) WebDAV authentication password
- **Public Access URL**: (Optional) Public HTTP/CDN address. When configured, the server can read files directly from this URL
- **Custom Headers**: (Optional) Additional HTTP headers in JSON object format (e.g., `{"X-Api-Key":"value"}`)
- **Auto Create Directory**: Automatically create parent directories before uploading files, enabled by default


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

#### IP Geolocation Query

IP Geolocation Query calls a third-party IP information API during file upload and writes the query result to the file metadata field `UploadAddress`. Configure it in "System Settings" → "Security Settings" → "Upload Management" in the admin backend.

Currently, the only supported query channel is `Custom API`.

##### Custom API Configuration

- **Enable Query**: When enabled, uploads request the custom API according to the configuration. When disabled, `UploadAddress` is saved as `未知`.
- **API Path**: The custom API URL, for example `https://api.example.com/ip`.
- **Query Parameters**: Add request parameter names and values as a list. Parameter values support the `{ip}` placeholder, which is replaced with the actual upload IP.
  - Example: parameter name `ip`, parameter value `{ip}`; the final request becomes `https://api.example.com/ip?ip=1.2.3.4`.
- **Response Fields**: Configure JSON response field paths as a list, for example `country.name` and `city`.
  - The final display text is joined in field order, separated by `，`.
  - Dot paths and array indexes are supported, for example `location.country.name` and `items[0].city`.

##### Response Example

Assume the custom API returns:

```json
{
  "country": {
    "name": "China"
  },
  "city": "Shenzhen"
}
```

Configure response fields as:

```text
country.name
city
```

The final value written to `UploadAddress` is:

```text
China，Shenzhen
```

If response fields are not configured, the API returns non-JSON content, field extraction fails, or the request fails, `UploadAddress` is saved as `未知`.

### Access Management

- Domain Filtering
  - Allowed Domains: List of domains allowed to access (leave empty to allow all domains, otherwise manually add the image hosting's own domain)
- Whitelist Mode: When enabled, only files added to the whitelist can be accessed
- Image Resizing
  - **Enable**: Disabled by default. When enabled, the [Read API](/en/api/file) can process images using the `width`, `height`, and `fit` parameters
  - **Allowed Sizes**: Leave empty to allow any valid dimensions, or enter comma-separated combinations such as `320xauto,autox480,1280x720`. Here, `auto` leaves that dimension unrestricted, while numeric dimensions must be from `1` to `4096`

::: warning Notice
Cloudflare Pages deployments must also enable image transformations in the Cloudflare Dashboard under **Build → Media → Images → Transformations**. Pages transforms images through same-domain URLs, Workers use the Images binding, and Docker uses Sharp.
:::

- Session Security Policy
  - **Secure Mode**: When enabled, the Session Cookie will include the `Secure` attribute and only be transmitted over HTTPS connections. Make sure your site has HTTPS enabled, otherwise the browser will not send the Cookie and login will fail. Disabled by default.
  - **User Session Max Age**: How long a user session remains valid after login, in days, minimum 1, default `14` days.
  - **Admin Session Max Age**: How long an admin session remains valid after login, in days, minimum 1, default `14` days.

## 🌐 Web Settings

Frontend web-related settings are configured in "System Settings" → "Web Settings" in the admin backend

### Global Settings

- **Site Title**: The name shown in the browser tab and page title. Example: `Sanyue ImgHub`.
- **Site Icon**: The browser tab icon URL. Use a publicly accessible image URL.
- **Site Name**: The image hosting name shown on frontend pages. Example: `Sanyue ImgHub`.
- **Site Logo**: The logo image URL shown on frontend pages. A transparent PNG or WebP is recommended.
- **Logo Link**: The URL opened when clicking the logo. Leave empty to use the default GitHub link. Example: `https://example.com`.
- **Background Interval**: Background carousel interval in milliseconds. Default `3000`; use `10000` for 10 seconds.
- **Background Opacity**: Background image opacity. Use a decimal between `0` and `1`. Default `1`; example `0.8`.
- **Enable Wallpaper**: Controls whether background wallpapers are loaded across all pages. Enabled by default. After disabling and saving, pages use a solid-color background on the next reload; wallpaper sources are still configured by the background options under Client Settings and Admin Settings.
- **Default URL Prefix**: Used to generate default file access links and the `publicUrl` field in successful Upload API responses. It only affects displayed links and returned API links, and does not change the actual file access path. Example: `https://img.example.com/file/`; leave empty to use the current site domain.

### Client Settings

- **Announcement**: Announcement shown on the upload page. HTML tags are supported. Example: `<b>Maintenance</b>: scheduled at 23:00 tonight`.
- **Directory Suggestions**: Controls whether the upload page shows the directory tree picker. When enabled, users can visually select the target folder instead of typing the path manually.
- **Default Channel Type**: The storage channel type selected by default on the upload page. Supports Telegram, Cloudflare R2, S3, Discord, HuggingFace, and WebDAV.
- **Default Channel Name**: When multiple channels exist under the selected channel type, specify which channel name should be used by default. Select the default channel type first.
- **Default Upload Directory**: The default upload directory. Use a valid path starting with `/` and avoid special characters. Leave empty for the root directory. Example: `/images/wallpaper`.
- **Default Naming**: The default file naming mode on the upload page. Options are Default, Prefix Only, Original Name, and Short Link.
- **Default Convert to WebP**: When enabled, images are converted to WebP in the browser before upload to reduce file size.
- **Default Compression**: When enabled, browser-side compression is used by default for image uploads.
- **Default Compress Threshold**: Images larger than this value are compressed automatically, in MB, range `1-20`. Default `5`.
- **Default Compress Target**: Target size after compression, in MB, range `0.5` to the compression threshold. Default `4`.
- **Login Background**: User login page background. Enter `bing` to use Bing wallpaper rotation, or a JSON image array for custom rotation, e.g. `["https://example.com/1.jpg","https://example.com/2.jpg"]`; use one image for a fixed background, e.g. `["https://example.com/1.jpg"]`.
- **Upload Background**: Upload page background. Uses the same format as Login Background.
- **Footer Portal Link**: The footer portal destination, such as a personal blog, homepage, or project URL. Example: `https://blog.example.com`.
- **Hide Footer**: When enabled, hides the frontend footer. Disabled by default.

### Admin Settings

- **Login Background**: Admin login page background. Uses the same format as the client Login Background.
- **Admin Background**: Admin dashboard background. Uses the same format as the client Login Background.

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
- Upload Channel: Storage channel used when uploading files via WebDAV, supports Telegram, Cloudflare R2, S3, Discord, HuggingFace, WebDAV
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
