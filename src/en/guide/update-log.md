# Update Logs

## Recent Updates

Add Features:
- Added directory tree picker component, supports visual directory selection when uploading or moving files
- channels and fetchRes APIs now support dual authentication

Fix Bugs:
- Fixed Element Plus component property warnings (size, pagerCount)

## 2026.02.28

Add Features:
- Added directory tree picker component, supports visual directory selection when uploading or moving files
- channels and fetchRes APIs now support dual authentication

Fix Bugs:
- Fixed Element Plus component property warnings

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
