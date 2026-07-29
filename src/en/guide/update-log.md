# Update Logs

## Recent Updates

Add Features:
- Added image resizing to Cloudflare Pages through custom-domain `/cdn-cgi/image/` URL transformations, using a client redirect to avoid 404 responses from same-domain internal requests in Pages Functions
- Added original-file fallback via `fallback=original` to the Read API and format validation by MIME type or file extension before selecting a processing path; GIF resizing is available only on Docker, while SVG and other unsupported formats return `415` by default

Fix Bugs:
- Fixed abnormal `fetchRes` content in Docker/Node when an upstream compressed body had already been decoded but retained its original encoding and length headers, and corrected the base URL used for chained relative redirects

Optimization:
- Split common, Docker, and Worker production dependencies into deployment-specific profiles so each environment installs only the packages it needs, reducing unrelated dependencies and deployment size
- Changed Star History bootstrap data to weekly aggregation, matching the automated update cadence and reducing daily noise in reconstructed charts

## 2026.07.29

Add Features:
- Added image resizing to Cloudflare Pages through custom-domain `/cdn-cgi/image/` URL transformations, using a client redirect to avoid 404 responses from same-domain internal requests in Pages Functions
- Added original-file fallback via `fallback=original` to the Read API and format validation by MIME type or file extension before selecting a processing path; GIF resizing is available only on Docker, while SVG and other unsupported formats return `415` by default

Fix Bugs:
- Fixed abnormal `fetchRes` content in Docker/Node when an upstream compressed body had already been decoded but retained its original encoding and length headers, and corrected the base URL used for chained relative redirects

Optimization:
- Split common, Docker, and Worker production dependencies into deployment-specific profiles so each environment installs only the packages it needs, reducing unrelated dependencies and deployment size
- Changed Star History bootstrap data to weekly aggregation, matching the automated update cadence and reducing daily noise in reconstructed charts

## 2026.07.28

Add Features:
- Added a concurrent batch deletion endpoint to the dashboard, allowing multiple files to be deleted in one request with per-item results
- Added a folder upload button that recursively reads nested folders and preserves their relative directory structure
- Added URL-based image resizing to the read-file endpoint with `width`, `height`, center cropping via `fit=cover`, and stretching via `fit=squeeze`; Cloudflare Workers use the Images binding, while Docker uses Sharp
- Added an image resizing switch and allowed-size configuration under System Settings → Security Settings → Access Management to restrict requested dimension combinations

Fix Bugs:
- Improved request-body validation and error handling for the batch deletion endpoint to prevent invalid requests from producing incorrect results
- Fixed announcement textarea auto-resizing overriding manually selected heights or changing the height when focused
- Fixed several upload-list and paste-upload textarea interaction issues
- Fixed the mobile date-range calendar layout and alignment of indeterminate checkbox marks

Optimization:
- Refined dashboard search, sorting, view switching, batch actions, and responsive table layouts while unifying primary theme colors and dialog styling
- Refined paste-upload controls, upload cards, and interactions across light and dark themes

Documentation:
- Added Chinese and English documentation for the batch deletion API
- Added Chinese and English documentation for the Read API, including image sizing parameters, deployment differences, and actual error statuses

## 2026.07.21

Add Features:
- Added an “Enable Wallpaper” switch to Web Settings. It is enabled by default; after disabling and saving it, pages use a solid-color background on the next reload

Fix Bugs:
- Fixed insufficient text/background contrast in dark mode for dialog options, System Settings tabs, dropdowns, IP geolocation parameter buttons, Token permissions, and related controls
- Fixed selected dates appearing oval in the upload trend calendar, oversized folder title overlays in the dashboard, and upload channel card hover glows collapsing into circles

Optimization:
- Refined the frontend with a flatter, lighter glass-style design and unified cards, toolbars, dialogs, and interaction states across the upload page, dashboard, and System Settings
- Adjusted the upload page directory-tree button size and hover scale for a more balanced proportion with adjacent toolbar buttons
- Simplified frontend state management by removing the unused `credentials` compatibility mapping
- Reduced Docker runtime image contents to lower the final image size

Documentation:
- Updated the Chinese and English READMEs and storage backend guides with compatible storage services and channel configuration details

## 2026.07.15

Add Features:
- Added a “Reset announcement read status” option to announcement settings. Users who already acknowledged an announcement will see it again on their next visit after its content changes or an administrator manually refreshes it
- Announcements are now marked as acknowledged only after the user clicks “Got it”, recording the acknowledgement time and announcement version while remaining compatible with the legacy first-visit marker

Security:
- Enhance target URL validation for the fetchRes interface
- Upgrade dependencies to improve security

## 2026.07.11

Fix Bugs:
- Fixed intermittent hover flicker and hit-target jitter in the admin top page switcher while images, tables, or charts are loading. Menu visibility is now managed explicitly, with a grouped option animation and a shared hover highlight

Optimization:
- Synchronized the page switcher panel, option group, arrow, and hover slider at roughly 300ms, preserving the glass-style expansion while making the animation more cohesive
- Centered the current-directory-empty state in the dashboard content area and aligned user management table spacing from the top header on desktop and mobile

## 2026.07.01

Optimization:
- Refined upload page title, toolbars, and quick action capsule details with consistent light/dark hover states, borders, shadows, and mobile edge alignment
- Unified dashboard breadcrumb controls, checkboxes, view toggle, and breadcrumb interactions with a lighter glass-style treatment, and extracted a reusable dashboard checkbox component
- Made dashboard mobile card view use a two-column layout, with more compact list view, pagination, loading skeletons, and action buttons
- Added swipe-based page navigation on dashboard mobile content areas and hid the pagination prev/next buttons to reduce small-screen obstruction

## 2026.06.30

Optimization:
- Integrated the dashboard top page switcher into the current option, allowing users to hover or click to switch between file management, user management, system settings, and upload page
- Refined the dashboard page switcher hover stability, dark menu background, current option surface, and mobile spacing for a more consistent interface
- Added dedicated theme variables for the page switcher, with a lighter candy color and soft pink-blue gradient treatment for the current option, including improved dark-mode color quality
- Added a subtle zoom-in effect to multi-image background carousels for smoother background transitions

## 2026.06.29

Add Features:
- Added a floating batch action bar for dashboard multi-select, showing the selected count and quick actions for copy, download, move, tag management, blacklist, whitelist, delete, and clearing selection
- Redesigned the upload page quick toolbar as an expandable capsule, with upload settings available directly and secondary actions expanding upward

Optimization:
- Switched the upload and login title font to Pacifico, and refined title colors, hover underline, and crayon-style hover writing effects for light and dark modes
- Refined the upload list toolbar, quick toolbar spacing, animations, and mobile placement for a lighter interaction
- Moved the dashboard select-current-page control to the breadcrumb row, added breadcrumb spacing, and softened card preview hover scaling
- Added async image decoding and deferred off-screen rendering for dashboard previews to reduce jank when many high-resolution images are shown
- Suppressed card and list hover effects while drag-selecting dashboard items to reduce visual noise
- Extracted the dashboard batch action bar into a standalone component for easier maintenance

## 2026.06.15

Optimization:
- Added a generic Worker Cache layer to the Workers deployment adapter based on business `Cache-Control` responses. Public `GET/HEAD` responses are checked in cache first, and cache misses run the original business route before storing responses with `public, max-age/s-maxage`
- Range requests now try to use an existing complete cached response first; cache misses pass through to the business response and do not store 206 partial responses, preventing partial content from polluting full-file cache entries

Security:
- Changed the directory tree and tag autocomplete APIs to `private` caching, preserving short browser caching while preventing authenticated APIs from entering the shared Workers cache

## 2026.06.14

Add Features:
- Added IP Geolocation Query settings under System Settings → Security Settings → Upload Management, supporting enable/disable, custom API request parameters, and the `{ip}` placeholder for passing the upload IP
- IP Geolocation Query now supports JSON response field paths; the backend joins field values in order and writes the result to file metadata `UploadAddress`

## 2026.06.12

Add Features:
- Added `publicUrl` to successful Upload API responses. When a default URL prefix is set, basic uploads and chunked-upload merge return this public access link

## 2026.06.09

Security:
- Admin login, user login, and session checks now return 503 when security settings cannot be loaded, preventing fallback to an empty default authentication config
- Session max-age settings are now normalized on the backend; timestamp-like or out-of-range values fall back to 14 days to avoid Cloudflare KV `expirationTtl` range errors

Optimization:
- Added frontend validation for user and admin session max age in System Settings > Security Settings, restricting values to 1-3650 days

Fix Bugs:
- Fixed admin login returning HTTP 500 when an abnormal millisecond timestamp was used as the Cloudflare KV `expirationTtl`

## 2026.06.08

Fix Bugs:
- Fixed chunked uploads failing when some browsers cannot detect a file MIME type and the frontend sends an empty `originalFileType`; the upload form now falls back to `application/octet-stream`

## 2026.06.05

Optimization:
- Added fallback channel matching based on unique identity fields stored in legacy metadata, allowing files to keep resolving to the current Telegram, S3/R2, Discord, HuggingFace, or WebDAV channel configuration after a channel is renamed
- Added channel-name immutability hints in channel settings and disabled channel-name editing to prevent breaking the association between uploaded files and their channel configuration

Fix Bugs:
- Fixed large admin file lists stopping before all pages were appended even when later load-more requests succeeded
- Changed channel deletion confirmation into a risk warning that clearly states files associated with the deleted channel may become inaccessible

## 2026.06.03

Optimization:
- Reduced persisted file metadata for S3, Telegram, Discord, HuggingFace, WebDAV, and related channels by no longer storing fields that can be read from the current channel configuration
- Management file details now dynamically enrich S3Location, S3CdnFileUrl, HfFileUrl, WebDAVPublicUrl, and similar display fields from the current channel configuration, so displayed links refresh after config changes
- File read, delete, move, and rename operations now resolve credentials through the current channel configuration; legacy Telegram/TelegramNew records without `ChannelName` fall back to `Telegram_env`

Security:
- Management metadata, tag, allow/block list, move, rename, and backup restore write paths now consistently remove sensitive and config-derived fields, preventing old backups or legacy records from writing credentials back

Fix Bugs:
- Fixed file details still showing stale S3Location or CDN links after changing S3 endpoint/CDN configuration
- Fixed S3 move or rename failures potentially moving the database record even when the remote S3 operation failed

## 2026.06.02

Add Features:
- Added `/upload/huggingface/completeMultipart` to proxy HuggingFace LFS multipart completion for large direct uploads
- HuggingFace direct upload URL generation now rewrites multipart completion URLs to an internal endpoint, enabling multipart completion in Cloudflare Workers deployments

Optimization:
- Unified WebDAV credential resolution into the shared channel credential flow, so read, delete, move, and rename operations use the same configuration source

Security:
- Management file list, batch list, custom file list, and metadata APIs now filter sensitive S3, Telegram, Discord, HuggingFace, and WebDAV credentials from returned metadata
- File read, delete, move, and rename operations now prefer current channel configuration for credentials, reducing the need to store or expose credentials in file metadata
- `WebDAVBaseUrl` in metadata now strips URL userinfo to avoid leaking usernames or passwords through management API responses

Fix Bugs:
- Fixed HuggingFace direct upload URL requests requiring `fileType`; files without a MIME type now fall back to `application/octet-stream`
- Improved HuggingFace multipart completion target and parts validation so invalid requests return 400 instead of 500
- Fixed WebDAV public URL reads changing the original 404/403 status into 500 when the WebDAV API fallback also failed

## 2026.05.30

Fix Bugs:
- Fixed HuggingFace file `HEAD` responses returning `Content-Length: 0`; the handler now uses uploaded metadata (`FileSizeBytes`) to report the actual file size, improving browser and player media probing

## 2026.05.25

Add Features:
- Added an upload trend line chart to the system status page, showing uploads from the last 7 days by default
- Upload trends can be grouped by channel type or channel name, with a total uploads line
- Upload trends support date range filtering with a single-month calendar dialog; click twice to select start/end dates or manually enter the date range
- Dashboard file rename dialog now supports confirming with Enter

Optimization:
- Enhanced the `indexinfo` API with upload trend statistics, using linear aggregation into date buckets and capped point/series counts to avoid high CPU usage on the status page

## 2026.05.06

Fix Bugs:
- Fixed duplicate `Content-Length` response headers from the Docker native Node server when accessing `/random` through a reverse proxy, which could cause Nginx / Cloudflare to return 502

## 2026.05.01

Security:
- WebDAV internal calls now use a dedicated API Token instead of admin password Basic Auth, eliminating the risk of password hash leakage

Fix Bugs:
- Fixed off-by-one error in Docker deployment `[[path]].js` catch-all route matching, causing `/dav/` and `/file/` root paths to return 404
- Fixed WebDAV PROPFIND always reporting file size as 0 (was reading non-existent `File-Size` field, changed to `FileSizeBytes`)
- Fixed WebDAV PROPFIND file href missing `/dav` prefix, preventing clients from downloading files
- Fixed WebDAV PROPFIND missing `getcontenttype` property, preventing Alist and other clients from identifying file types and showing previews

## 2026.04.29

Security:
- Admin file previews no longer trust `from=admin` or same-origin Referer, and now require a verified admin session before allowing admin previews
- Manage APIs now get a default non-cacheable response header to prevent browser or CDN caching from causing stale state after GET-style management operations
- Reduced mutation response payloads for manage APIs to avoid returning unnecessary metadata or sensitive data from blocklist, tag, and API Token update endpoints

Optimization:
- Optimized data loading on the admin user management page: the user list API now aggregates IP summaries in a single pass and returns summary rows only, while per-user file records are lazy-loaded on row expansion to reduce Worker CPU usage and response payload size

Fix Bugs:
- Fixed blocklist/whitelist toggles in the admin panel potentially returning cached old responses, which could show success without updating the actual state

## 2026.04.28

Add Features:
- Added WebDAV storage channel, allowing third-party WebDAV services to be used as upload backends with upload, read, delete, move, rename, and channel-list support

Security:
- Session storage keys migrated to the `manage@session@` prefix to prevent session data from entering the file index and backup exports

Fix Bugs:
- Fixed D1 adapter routing for `manage@` configuration keys so blocklists, sessions, and other settings no longer get written to the files table
- Fixed D1 settings backup reads so `manage@` settings data can be listed correctly

## 2026.04.27

Refactor:
- Reworked login page keyboard avoidance: replaced media query approach with visualViewport API to detect virtual keyboard, fixing false triggers on narrow screens without a keyboard
- Optimized mobile login card spacing, reduced input height and field gaps for better visibility when keyboard is open

## 2026.04.24

Add Features:
- Added Cloudflare Workers deployment method, supporting one-click deployment via GitHub Actions

## 2026.04.21

Add Features:
- Added session security policy settings: support enabling Cookie Secure mode (HTTPS-only transmission)
- Support configuring separate session max age for user and admin sessions (in days)
- Backend session creation and destruction now dynamically adjust Cookie attributes based on security policy config
- Session security policy settings support Chinese/English i18n

## 2026.04.19

Fix Bugs:
- Fixed SQLITE_TOOBIG error caused by saving raw chunk data on upload failure when using D1 database

## 2026.04.18

Security:
- Upgraded password hashing to PBKDF2 for stronger security
- Unified auth logic by refactoring backend auth core into authCore with authScope parameter to distinguish admin/user contexts

Fix Bugs:
- Fixed unauthorized popup appearing when redirecting to login page while not logged in
- Fixed duplicate auth error messages when changing password
- Fixed save button sending duplicate requests on click

## 2026.04.17

Security:
- Auth system hardening: passwords now stored with SHA-256 + salt hashing, backward compatible with existing plaintext passwords
- Session management switched to HttpOnly Cookies (admin_session / user_session), passwords no longer stored on the client side
- Frontend no longer stores passwords/credentials in localStorage or Cookies
- Admin and user sessions use independent cookies, fully isolated
- Changing a password automatically clears all sessions of the corresponding type
- Security settings page no longer exposes password/hash values to the frontend
- Added "Clear Password" feature to remove existing authentication
- Added `/api/auth/resetAuth` endpoint for password recovery via RESET_KEY environment variable
- Auth-related endpoints moved to `/api/auth/` subdirectory

## 2026.03.28

Add Features:
- Added bilingual (Chinese/English) i18n support, users can freely switch language in the UI
- Integrated vue-i18n, all page text supports dynamic Chinese/English switching
- Added language switcher component on login, upload, and admin pages
- Element Plus component library locale syncs with the interface language
- Language preference auto-saved to localStorage and restored on next visit
- Backend page config API now includes English fields (label_en, category_en, tooltip_en, etc.)
- System config sidebar width auto-fits content, compatible with both Chinese and English text
- Upload page desktop toolbar consolidated into a "more" dropdown for cleaner layout
- Main repo README switched to English by default, Chinese version moved to README_zh.md

## 2026.03.10

Add Features:
- API Token supports setting expiration time (seconds/minutes/hours/days/months/years)
- API Token supports auto-deletion after expiration
- Token list adds status column and expiration time column
- Token validation automatically checks expiration status
- Added Token Management API documentation

Fix Bugs:
- Fixed some text files failing to upload via HuggingFace channel

## 2026.03.04

Add Features:
- Upload page directory input supports auto-suggestion and completion

Refactor:
- Docker architecture rebuild, optimized performance and memory management (read the announcement before upgrading!)

## 2026.02.28

Add Features:
- Added directory tree picker component, supports visual directory selection when uploading or moving files
- channels and fetchRes APIs now support dual authentication

Fix Bugs:
- Fixed Element Plus component property warnings
- Fixed S3 chunk upload failure issue

## 2026.02.24

Add Features:
- D1 storage now supports chunk upload

## 2026.02.23

Add Features:
- Upload and move operations now support path traversal protection
- Optimized HuggingFace channel large file upload
- Improved announcement settings experience

## 2026.02.09

Add Features:
- Random API supports returning image according to the device (orientation=auto)
- Admin panel list view supports rubber-band (drag) multi-selection from blank areas
- Admin panel remembers list/card view selection, automatically restores last view mode after page refresh

## 2026.02.07

Add Features:
- Admin panel card view supports rubber-band (drag) multi-selection from blank areas
  - Supports Shift/Ctrl/Cmd modifier keys for appending selections
  - Auto-scroll and text selection prevention during drag
  - Only active in desktop card view (screen width > 768px)
- File detail dialog supports editing metadata (file name, file type) with real-time sync to file list
- File detail dialog supports renaming File ID (URL path identifier) with frontend format validation and backend duplicate detection

Refactor:
- Reorganized component directory structure by page module (dashboard, config, upload, browse)

## 2026.02.07

Refactor:
- Reorganized component directory structure by page module (dashboard, config, upload, browse)

Add Features:
- Admin panel card view supports rubber-band (drag) multi-selection from blank areas
  - Supports Shift/Ctrl/Cmd modifier keys for appending selections
  - Auto-scroll and text selection prevention during drag
  - Only active in desktop card view (screen width > 768px)

## 2026.02.06

Refactor:
- Upload page component refactoring for better code maintainability
  - Extracted UploadFileItem component (file list item display)
  - Extracted UploadSettingsDialog component (upload settings dialog)
  - Extracted urlBuilder.js utility (URL format generation)
  - Extracted sha256.js utility (SHA256 computation)
- Cleaned up unused CSS styles and redundant methods left over from refactoring

## 2026.01.30

Add Features:
- Random image API adds `orientation` parameter for filtering by image orientation (landscape/portrait/square)
- Auto-extract image dimensions (Width, Height) during upload via file header magic number detection
- Record file size in bytes (FileSizeBytes) during upload for more accurate capacity statistics
- Admin panel file details now displays image dimensions and orientation
- Admin panel file size display optimized with auto unit selection (B/KB/MB)
- Public browse API adds caching mechanism for faster access
- Blacklist/whitelist operations now auto-clear related API caches

## 2026.01.29

Add Features:
- Support custom background images for admin panel

## 2026.01.25

Add Features:
- Admin panel supports multi-dimensional filtering by channel type, channel name, access status, file type, etc.
- Optimized admin panel search display effects

## 2026.01.23

Add Features:
- Batch index rebuild feature to avoid Cloudflare Workers CPU time limits
- Batch backup and restore optimization with chunked processing for large files
- Settings page save button changed to floating component with light/dark theme support
- Mobile settings page layout optimization

## 2026.01.17

Add Features:
- Discord and HuggingFace channels support image moderation for small file uploads
- Optimized moderatecontent.com moderation channel request method, using POST to avoid URL encoding issues
- Channel name selector maintains empty state after clearing and page refresh

## 2026.01.15

Add Features:
- Admin panel folders support copy link feature
- Batch copy links supports mixed folders and files
- Admin panel list view adds channel name column display
- Unified folder path format validation rules with upload page
- Admin panel component refactoring for better code maintainability
- Mobile directory navigation color unified to blue theme
- System status pie charts add hover zoom effect
- System status pie charts tooltip z-index optimization
- Upload history supports paginated loading to avoid lag with large records
- Upload history page colors unified with upload page
- Upload history page open animation changed to circular expansion effect

## 2026.01.15

Add Features:
- Admin panel folders support copy link feature (recursively copy all file links in folder)
- Batch copy links supports mixed folders and files
- Admin panel list view adds channel name column display
- Unified folder path format validation rules with upload page
- Admin panel component refactoring for better code maintainability
  - Extracted FileCard, FolderCard, FileListItem components
  - Extracted FileDetailDialog, MobileActionSheet, MobileDirectoryDrawer components
- Mobile directory navigation color unified to blue theme
- System status pie charts add hover zoom effect
- System status pie charts tooltip z-index optimization
- Upload history supports paginated loading to avoid lag with large records
- Upload history page colors unified with upload page
- Upload history page open animation changed to circular expansion effect

## 2026.01.10

Add Features:
- Support specifying channel name when uploading (select specific channel in multi-channel scenarios)
- WebDAV supports configuring upload channel and specifying channel name
- Admin panel file details now displays channel name
- Added API to get available channels list (`/api/channels`)

## 2026.01.08

Add Features:
- Upload page logo click link supports customization
- File management page pagination supports displaying total pages and jumping to specific page
- Upload channel cards optimization
- Upload channel cards add hover glow effect following mouse
- System status card icons changed to light blue gradient
- System status cards (newest/oldest upload) optimization
- Upload card adds hover glow effect following mouse
- Paste upload card edge glow effect optimization
- HuggingFace large file direct upload supports user-specified file naming method
- HuggingFace channel file storage path is now consistent with other channels

Fix Bugs:
- Fixed HuggingFace large file direct upload Content-Type not being set correctly, causing browser unable to preview directly

## 2026.01.07

Add Features:
- Telegram channel supports proxy settings
- Optimized upload settings page user experience
- Support converting images to WebP format before upload
- Client settings add new default file preprocessing configuration

## 2026.01.03

Add Features:
- Visitor gallery experience optimization
- Discord channel access optimization

## 2026.01.02

Fix Bugs:
- Fixed Discord channel file expiration issue

## 2026.01.01

Add Features:
- Added public browse feature (visitor gallery)

Fix Bugs:
- Fixed HuggingFace large file upload issues
- Fixed Telegram channel retry failure issues

## 2025.12.31

Add Features:
- Added Discord storage channel support (support chunk upload)
- Added HuggingFace storage channel support (with large file direct upload)
- Optimized error handling for file uploads
- Support canceling uploads when deleting files that are being uploaded
- Telegram channel retry automatically disables server-side compression

## 2025.12.30

Add Features:
- Support for R2/S3 channels capacity limit

## 2025.12.29

Add Features:
- Beautified scrollbar style

## 2025.12.27

Add Features:
- Cancel paste upload file type limit
- Beautified upload page display effects

## 2025.12.25

Add Features:
- Beautified some pages display effects

## 2025.12.24

Add Features:
- Beautified some pages display effects

## 2025.12.20

Add Features:
- Beautified admin panel gallery and user management page display effects
- Added list view support for admin panel gallery
- Added long-press operations for admin panel gallery on mobile devices

## 2025.12.18

Add Features:
- Default content moderation feature is now disabled
- Beautified some page display effects

## 2025.12.8

Add Features:
- Default content moderation feature is now disabled
- Updated dependencies
- Beautified some page display effects

## 2025.11.27

Fix Bugs:
- Fixed issue with moving files causing path errors

## 2025.11.24

Add Features:
- Optimized chunked upload logic to synchronous upload for better stability
- Frontend supports concurrent chunk uploads to improve speed
- Added retry mechanism for failed chunk uploads

## 2025.11.23

Add Features:
- Upload page adds history feature

## 2025.11.19

Add Features:
- Optimized admin panel tag management user experience

## 2025.11.18

Add Features:
- Admin panel supports tag management
- Supports dark mode following system settings
- Beautified some page display effects

## 2025.9.27

Fix Bugs:
- Fixed issue with custom site icon not taking effect

## 2025.9.15

Fix Bugs:
- Fixed intermittent failure issue with list API channel filtering

## 2025.8.28

Add Features:
- Support for WebDAV service, allowing file access and management via WebDAV clients

## 2025.8.23

Add Features:
- Adapted to Cloudflare D1 database

## 2025.8.11

Add Features:
- web upload now supports automatic retry on failure
- list API now supports fallback to traditional data return method in case of index build failure

## 2025.8.5

Fix Bugs:
- Fixed issue with images not previewing in user management page

## 2025.7.31

Add Features:
- Support for backup and restore functionality
- Support for specifying default upload settings for certain parameters
- Support for API Token authentication, opening up more interfaces

## 2025.7.28

Add Features:
- Support for file database indexing, optimizing access speed
- Admin panel now includes a system status page

## 2025.7.13

Add Features:
- Support for large file chunked uploads, improving stability for large file uploads
- Telegram Bot channel now supports chunked storage, allowing uploads larger than 20MB
- File reading now supports streaming processing

## 2025.7.10

Add Features:
- Optimized response speed of list API

## 2025.7.2

Add Features:
- Support for automatic renaming of files with the same name
- Admin panel now supports previewing external link images
- Beautified some error pages

## 2025.6.29

Add Features:
- Added 404 page

Fix Bugs:
- Fixed errors when file names contain special characters

## 2025.6.28

Add Features:
- Optimized display effects of some pages
- Added validity check for login password

## 2025.6.26

Add Features:
- Admin panel now supports global search
- Admin login page supports custom background images
- Multiple visual experience optimizations

## 2025.6.22

Add Features:
- Support for nsfwjs moderation channels, with custom API address

## 2025.6.19

Add Features:
- S3 channels now support path-style access, compatible with more S3-compatible storage services

Fix Bugs:
- Code style optimizations

## 2025.6.13

Add Features:

- Beautified error images
- Upload page now supports previewing ico and more file formats

## 2025.6.12

Add Features:

- `upload` API now supports cross-origin access and invocation

Fix Bugs:

- Fixed data integrity issue in `list` API response

## 2025.5.23

Add Features:

- Added announcement feature

Fix Bugs:

- Fixed image name overflow issue in admin panel
- Optimized display of some pages
- Fixed Docker image unable to access https external links

## 2025.5.11

Add Features:

- Support for server deployment via Docker

## 2025.3.14

Add Features:

- Upload user management now displays IP location

## 2025.3.8

Add Features:

- Random image API supports directory reading and permission control by directory

Fix Bugs:

- Fixed cache issue in random image API

## 2025.3.7

Add Features:

- **Directory feature is now online**, currently supports:
  - Upload to specified directory
  - Delete entire directory
  - Move file location (Telegraph and old Telegram channels do not support moving)
  - Read files by directory
- Random image API supports directory reading

Fix Bugs:

- Fixed multiple bugs affecting user experience

## 2025.3.1

Add Features:

- Support for uploading multiple links at once
- Support for storing and managing external links

Fix Bugs:

- Fixed issues with copying S3 links in admin panel
- Fixed some admin panel settings not taking effect
- Fixed channel settings not saving in some cases

## 2025.2.6

**v2.0 is here** with many new features and optimizations for a brand new user experience:

💪**More Powerful**:

- Integrated S3 API channels, supporting Cloudflare R2, Backblaze B2, Qiniu Cloud, Upyun, and more object storage providers
- Support for multiple Telegram and S3 channels, with load balancing
- Upload files now support short link naming

✈️**More Efficient**:

- All settings moved to admin system settings, no more tedious environment variable configuration, changes take effect immediately
- Admin Gallery and User Management pages now use pagination for faster frontend rendering and better experience
- Channels can be enabled/disabled at will
- More settings now have prompt popups, no need to search documentation everywhere

✨**More Refined**:

- Global dark mode support, auto-switches based on user preference and time
- Login, gallery, user management and other pages refined for better usability
- New tab bar on upload page, flexible and convenient
- New logo, handcrafted (please be kind)
- Option to hide footer for OCD users

## 2024.12.27

Add Features:

- Support for customizing global default link prefix via environment variable (see 3.1.3.6 Custom Config API)
- Admin panel supports custom link prefix
- Optimized display of some admin pages
- `/upload` API supports returning full link (set `returnFormat` parameter, see API docs)

Fix Bugs:

- Optimized upload page display

## 2024.12.20

Add Features:

- Admin panel supports blacklisting upload IPs (Dashboard->User Management->Allow Upload)
- Admin batch operations now follow user selection order ([#issue124](https://github.com/MarSeventh/CloudFlare-ImgBed/issues/124))
- `random` API optimized, reduced KV operations, added `content` parameter, supports returning specific file types
- Integrated CloudFlare Cache API to speed up list-related API access
- CDN cache time for images changed from 1 year to 7 days to prevent long-term access if cache is not cleared

## 2024.12.14

Add Features:

- Admin panel adds batch blacklist/whitelist features

## 2024.12.13

Add Features:

- Optimized cache strategy for blockimg, whitelistmode, 404, etc., to minimize origin requests (see 3.1.3.9 Admin Delete/Blacklist Optimization)

## 2024.12.12

Add Features:

- Backend now retries with other channels if upload fails
- Optimized display for 404, blockimg, whitelistmode, etc.

## 2024.12.11

Add Features:

- Deleting, whitelisting, blacklisting now auto-clears CF CDN cache to avoid delay (see 3.1.3.9 Admin Delete/Blacklist Optimization)

## 2024.12.10

Add Features:

- File details now record file size

## 2024.12.09

Add Features:

- More file formats supported

Fix Bugs:

- Added CORS header `access-control-allow-origin: *` to file response

## 2024.12.04

Add Features:

- Support for custom naming (original only, random prefix only, or default random prefix_original)
- Telegram Channel uploads now record bot and channel data for migration/backup
- Support for custom link prefix

Fix Bugs:

- R2 channel now deletes from bucket when deleted in admin panel

## 2024.11.05

Add Features:

- Added support for R2 bucket

## 2024.10.20

Add Features:

- Footer now supports custom portals

## 2024.09.28

Add Features:

- Refactored upload page toolbar, supports custom compression (pre-upload & storage)
- Option to delete only successful uploads or retry failed uploads

## 2024.09.27

Add Features:

- Clicking links on upload page now auto-copies to clipboard
- Upload settings are remembered (method, link format, etc.)

Fix Bugs:

- No login redirect if password not set

## 2024.09.26

Add Features:

- Optimized file naming for paste uploads

## 2024.09.12

Add Features:

- Added support for custom background transparency

## 2024.09.11

Add Features:

- Support for custom background switch interval

## 2024.08.26

Add Features:

- Images >5MB are auto-compressed before upload
- Customizable image bed name and logo
- Customizable site title and icon

## 2024.08.23

Add Features:

- Support for URL paste upload

## 2024.08.21

Add Features:

- Improved multi-format link display, added UBB format support
- Improved login logic, backend adds verification code API

## 2024.07.25

Add Features:

- Added random image API

Fix Bugs:

- Fixed API uploads not showing in admin panel

## 2024.07.22

Add Features:

- Added paste image upload feature

## 2024.07.21

Add Features:

- Added copy link feature for Markdown, HTML, etc.
- Upload page adds admin panel entry
