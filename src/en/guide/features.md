# Features

CloudFlare ImgBed provides rich features to meet the needs of different users.

## 🚀 Core Features

### File Upload

- **Common File Support**: Host images, animations, videos, audio, and other common file types
- **Multiple Upload Methods**:
  - Drag and drop upload
  - Click to select upload
  - Paste upload (supports files and URLs)
  - Batch upload
  - Recursive folder upload while preserving relative directory structure
- **Real-time Progress Display**: Shows real-time progress during upload
- **Optional Image Optimization**: Compress images or convert them to WebP before upload
- **Large File Support**: Chunked uploads for Telegram, R2, S3, and Discord, plus Hugging Face LFS direct upload
- **Upload Retry**: Automatically switch to another available channel when an upload fails

### Storage Channels

| Channel Type | Size and Quota | Features |
|--------------|----------------|----------|
| Telegram Bot | 20 MB per part; larger files can be chunked | Free and easy to use, with image compression support |
| Cloudflare R2 | Subject to Cloudflare plan, request-body, and object limits | Integrated with Cloudflare deployments and supports chunked uploads |
| S3-compatible Storage | Depends on the provider | Supports many object storage services, custom endpoints, and CDNs |
| Discord | Usually 10 MB per part or 25 MB with Nitro; larger files can be chunked | Simple setup for lightweight use |
| Hugging Face | Subject to platform policies | LFS large-file direct upload and private dataset repositories |
| WebDAV | Depends on the provider | Connect self-hosted or third-party WebDAV services |

Exact limits and costs depend on the current policies of the selected provider and deployment platform.

### File Management

- **Directory Function**: Supports creating directories for file categorization management
- **Batch Operations**: Copy, download, move, tag, allowlist/blocklist, and concurrently delete files
- **Search and Filters**: Find files by name, directory, tag, channel, file type, access status, and more
- **Tag Management**: Edit and batch-apply tags with autocomplete
- **Detailed Information**: View file size, upload time, source IP, etc.
- **Multiple Views**: Card and list views with rubber-band selection

### Diverse Copy Options

- **Original Link**: Direct file access link
- **Markdown**: `![](image link)` format
- **HTML**: `<img src="image link">` format
- **BBCode**: `[img]image link[/img]` format

### Smart Features

- **Settings Memory**: Automatically saves user upload preferences
- **One-click Copy**: Click link to automatically copy to clipboard
- **Error Retry**: Failed files support re-upload
- **Directory Suggestions**: Upload page directory input supports auto-suggestion and completion

### File Reading and Image Processing

- **Unified Reads**: Access every storage channel through `/file/{path}`
- **Standard Request Support**: Supports `GET`, `HEAD`, and Range reads where the storage channel provides them
- **Image Resizing**: Cloudflare Worker and Docker deployments can resize, center-crop, or stretch images using `width`, `height`, and `fit`
- **Size Controls**: Administrators can disable image processing or restrict allowed dimension combinations

## 🌐 Internationalization

- **Bilingual Support**: All page text supports dynamic Chinese/English switching
- **Language Memory**: Language preference auto-saved and restored on next visit
- **Component Sync**: Element Plus component library locale syncs with the interface language

## 🎨 Interface Features

### Modern Design

- **Responsive Layout**: Adapts to desktop and mobile devices
- **Dark Mode**: Supports light/dark theme switching
- **Unified Visuals**: Flat, lightweight glass-style surfaces and consistent theme colors
- **Mobile Interactions**: Two-column cards, swipe pagination, and compact mobile controls

### Custom Configuration

- **Background Settings**:
  - Disable wallpapers and use a solid-color background
  - Single image background
  - Multi-image carousel
  - Bing random images
  - Custom transparency and switching time
- **Brand Customization**:
  - Custom logo and website name
  - Custom website title and icon
  - Custom footer links
- **Link Format**: Support custom link prefix

## 🔐 Security Features

### Authentication

- **Password Security**: PBKDF2 password hashing, backward compatible with automatic upgrade from plaintext passwords
- **Session Management**: HttpOnly Cookie sessions, admin and user sessions fully isolated
- **Session Security Policy**: Supports Cookie Secure mode (HTTPS-only), configurable session max age
- **Admin Authentication**: Backend management page password protection
- **Upload Authentication**: Web and API upload authentication codes
- **API Token**: Supports expiration time, auto-deletion after expiry
- **API Token Permissions**: Grant `upload`, `delete`, `list`, and `manage` permissions independently
- **Access Control**: Source-domain restrictions, file allowlists/blocklists, and allowed image sizing combinations
- **Password Reset**: Supports resetting authentication via environment variable for password recovery

### Content Security

- **Image Review**: Integrates third-party APIs for content review
- **IP Management**:
  - Upload IP recording and statistics
  - IP allowlists and blocklists
  - Query and record IP geolocation through a custom API
- **Whitelist Mode**: Only allows whitelisted images to be accessed

## 🔧 Management Features

### File Management

- **Gallery Browse**: Visual file browsing interface with card view and list view
- **Rubber-band Selection**: Card view supports drag multi-selection from blank areas
- **Paginated Loading**: Efficient loading for large numbers of files
- **Batch Operations**: Supports operations in user-selected order
- **Concurrent Batch Deletion**: Delete multiple files in one request with per-item results
- **File Movement**: Supports moving files between directories with visual directory tree picker
- **Tag Management**: Add and manage tags for files with autocomplete
- **Metadata Editing**: Supports editing file name, file type, and renaming File ID
- **Backup & Restore**: Supports batch backup and restore of file data
- **Index Rebuild**: Supports batch index rebuild to avoid CPU time limits
- **Public Browsing**: Expose selected directories for visitor browsing

### User Management

- **Upload Statistics**: User upload file count statistics
- **IP Tracking**: Records uploader IP and geographic location
- **Permission Control**: User upload permission management

### System Status

- **Storage Statistics**: View file counts, storage usage, and channel distribution
- **Upload Trends**: View upload trends by date, channel type, or channel name
- **Channel Capacity**: Configure capacity thresholds for R2, S3, and WebDAV channels

### System Settings

- **Channel Management**: Multi-storage channel configuration and switching
- **Load Balancing**: Multi-channel load balancing settings
- **Cache Management**: Automatic CDN cache cleanup
- **Announcement System**: Site announcement publishing functionality
- **Client Default Settings**: Supports configuring default upload channel, naming method, compression settings, etc.
- **Image Processing Settings**: Enable image resizing and configure allowed dimensions

## 🌐 API Support

### HTTP APIs

- **Complete Endpoint Set**: Upload, Read, Delete, Batch Delete, List, Random Image, and Token Management APIs
- **File Reads**: Binary responses, HEAD, Range, and optional image resizing
- **Permission Control**: Protected endpoints accept scoped API Tokens
- **API Documentation**: See the [API Overview](/en/api/) for parameters and response details

### WebDAV Support
- **Standard Protocol**: Supports `OPTIONS`, `PROPFIND`, `GET`, `PUT`, `DELETE`, `MOVE`, and `MKCOL`
- **Directory Browsing**: Supports browsing and managing files via WebDAV clients
- **File Operations**: Upload, download, move, and delete files, and create directories

### Third-party Integration

- **PicGo Support**: Integrates with the PicGo image hosting tool
- **Cross-origin Support**: API supports cross-origin access

## 📊 Deployment & Operations

### Multiple Deployment Methods

- **Cloudflare Pages**: Git-connected serverless deployment with straightforward configuration, but no Images binding support
- **Cloudflare Workers**: GitHub Actions deployment and Cloudflare Images processing support
- **Docker**: Self-hosted Node.js and Hono service using SQLite and a local data directory

### Performance Optimization

- **CDN Acceleration**: Cloudflare deployments can use the global CDN network
- **Cache Strategy**: Workers cache public responses according to application `Cache-Control` while avoiding cached Range fragments
- **Preview Optimization**: Async decoding and deferred off-screen rendering reduce dashboard jank with many image previews

### Stability

- **Failover**: Automatic channel switching and retry on upload failure
- **Large File Chunking**: Supports chunked upload for large files to improve stability
