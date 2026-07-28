# Project Introduction
<div align="center">
    <a href="https://github.com/MarSeventh/CloudFlare-ImgBed">
        <img width="80%" alt="logo" src="/images/guide/banner.png"/>
    </a>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px; margin-top: 20px; margin-bottom: 20px;">
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/LICENSE"><img src="https://img.shields.io/github/license/MarSeventh/CloudFlare-ImgBed" alt="License" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/releases"><img src="https://img.shields.io/github/release/MarSeventh/CloudFlare-ImgBed" alt="latest version" /></a>
        <a href="https://hub.docker.com/r/marseventh/cloudflare-imgbed"><img src="https://img.shields.io/docker/pulls/marseventh/cloudflare-imgbed" alt="Docker Pulls" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/stargazers"><img src="https://img.shields.io/github/stars/MarSeventh/CloudFlare-ImgBed" alt="Stars" /></a>
        <a href="https://github.com/MarSeventh/CloudFlare-ImgBed/network/members"><img src="https://img.shields.io/github/forks/MarSeventh/CloudFlare-ImgBed" alt="Forks" /></a>
        <a href="https://atomgit.com/MarSeventh/CloudFlare-ImgBed"><img src="https://atomgit.com/MarSeventh/CloudFlare-ImgBed/star/badge.svg" alt="G-star" /></a>
    </div>
    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 5px;">
        <a href="https://trendshift.io/repositories/14324" target="_blank"><img src="https://trendshift.io/api/badge/repositories/14324" alt="GitHub Trending" width="250" /></a>
        <a href="https://hellogithub.com/repository/MarSeventh/CloudFlare-ImgBed" target="_blank"><img src="https://api.hellogithub.com/v1/widgets/recommend.svg?rid=71d65ace215945b0909d4c75c31b9fcb&claim_uid=6DsuqF4hInJWerv&theme=neutral" alt="Featured｜HelloGitHub" width="250" /></a>
    </div>
</div>


CloudFlare ImgBed is an open-source image and file hosting solution for Docker and serverless environments. It brings Telegram, Discord, Cloudflare R2, S3-compatible storage, Hugging Face, WebDAV, and other backends into one management interface. The project provides uploading, reading, directory and tag management, authentication, content moderation, HTTP APIs, WebDAV, and public browsing for personal image hosting, website asset management, and lightweight file distribution.

<div style="position: relative; padding: 30% 45%;">
    <iframe 
        src="//player.bilibili.com/player.html?bvid=BV1y3WGe4EGh&page=1" 
        scrolling="no" 
        border="0" 
        frameborder="no" 
        framespacing="0" 
        allowfullscreen="true" 
        style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;"
    ></iframe>
</div>

## Demo Screenshots
![Poster](/images/guide/poster.png)
![Upload Interface](/images/guide/upload.png)

<details>
    <summary>More Interface Screenshots</summary>

![Login Interface](/images/guide/login.png)
![Uploading Interface](/images/guide/uploading.png)
![Dashboard Interface](/images/guide/dashboard.png)
![User Management](/images/guide/cusmanager.png)
![System Settings](/images/guide/sysconfig.png)

</details>

## Technical Architecture

- **Frontend Interface**: Built with Vue 3 and Element Plus, with responsive design, dark mode, and Chinese/English switching
- **Backend API**: Cloudflare Pages Functions and Workers use serverless runtimes; Docker runs a native Node.js and Hono service
- **Storage Layer**: Supports multiple storage backends (Telegram, R2, S3, Discord, Hugging Face, WebDAV)
- **Data Layer**: Cloudflare deployments support KV or D1; Docker uses local SQLite and can use the local filesystem in place of R2
- **Image Processing**: Cloudflare Workers use the Images binding, Docker uses Sharp, and Pages Functions does not support this feature
- **Deployment**: Supports Cloudflare Pages, Cloudflare Workers, and Docker deployment


## Version History

### v2.x Major Update

- 🎨 Responsive upload and management interfaces with dark mode, bilingual UI, and custom backgrounds
- 📁 Directories, tags, filters, batch operations, and recursive folder uploads
- 🗄️ Telegram, R2, S3, Discord, Hugging Face, and WebDAV storage backends
- ⚡ Multi-channel load balancing, capacity limits, failover, and chunked large-file uploads
- 🌐 Upload, Read, Delete, List, Random Image, and Token Management APIs, plus WebDAV
- 🖼️ URL-based image resizing on Cloudflare Worker and Docker deployments
- 🔐 Auth system hardening: PBKDF2 password hashing, HttpOnly Cookie session management
- 🔑 Scoped API Tokens with expiration and automatic deletion
- ☁️ Cloudflare Pages, Workers, and Docker deployment using KV/D1 or SQLite data layers

### v1.x Feature Foundation

- 🚀 Basic file upload and management functionality
- 🔐 Authentication and permission control
- 🎨 Custom interface and configuration
- 📡 Complete API interface

## Open Source License

This project is licensed under the [MIT Open Source License](https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/LICENSE), you can:

- ✅ Commercial use
- ✅ Modify and distribute
- ✅ Private use
- ✅ Patent use

But you must retain the original author's copyright notice in all copies or substantial portions of the software, including but not limited to the frontend and backend code and other files.

## Star History

<a href="https://www.star-history.com/?repos=MarSeventh%2FCloudFlare-ImgBed%2CMarSeventh%2FSanyue-ImgHub&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=MarSeventh/CloudFlare-ImgBed%2CMarSeventh/Sanyue-ImgHub&type=date&theme=dark&legend=top-left&sealed_token=sAw_e7kRryMASKC9b3AqORk8leSZgKYTuCvYqOzqsyOmTse-00LgwOS4FtG75lHuCuxsyd-TPlyV3BieLloGaM-3M2AlLeQt2g1_Kczjm0UZdqnvVKRCR2J9oqdE0_XEKFMmOMLG_Loz8Bz3-JPKwiMyTjKM0LRRLm2TjGA73QSrTuOsRAqwj6F7LAVf" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=MarSeventh/CloudFlare-ImgBed%2CMarSeventh/Sanyue-ImgHub&type=date&legend=top-left&sealed_token=sAw_e7kRryMASKC9b3AqORk8leSZgKYTuCvYqOzqsyOmTse-00LgwOS4FtG75lHuCuxsyd-TPlyV3BieLloGaM-3M2AlLeQt2g1_Kczjm0UZdqnvVKRCR2J9oqdE0_XEKFMmOMLG_Loz8Bz3-JPKwiMyTjKM0LRRLm2TjGA73QSrTuOsRAqwj6F7LAVf" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=MarSeventh/CloudFlare-ImgBed%2CMarSeventh/Sanyue-ImgHub&type=date&legend=top-left&sealed_token=sAw_e7kRryMASKC9b3AqORk8leSZgKYTuCvYqOzqsyOmTse-00LgwOS4FtG75lHuCuxsyd-TPlyV3BieLloGaM-3M2AlLeQt2g1_Kczjm0UZdqnvVKRCR2J9oqdE0_XEKFMmOMLG_Loz8Bz3-JPKwiMyTjKM0LRRLm2TjGA73QSrTuOsRAqwj6F7LAVf" />
 </picture>
</a>

Like the project? Please consider giving it a free star ✨✨✨, thank you!
