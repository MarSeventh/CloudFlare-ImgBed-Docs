# Cloudflare Pages Deployment

Cloudflare Pages is the recommended deployment method, offering free hosting, global CDN acceleration, and no server maintenance required.

## 📂 Step 1: Fork the Project

1. Visit [CloudFlare ImgBed Project](https://github.com/MarSeventh/CloudFlare-ImgBed)
2. Click the "Fork" button in the top right corner
3. Select your GitHub account
4. Confirm the Fork is complete

## 🏗️ Step 2: Create Pages Project

### 2.1 Access Cloudflare Dashboard

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select "Workers & Pages" from the left menu
3. Click "Create application"
4. Select the "Pages" tab
5. Click "Connect to Git"

![Create Pages Project](/images/deployment/pages-create.png)

### 2.2 Connect GitHub Repository

1. If using for the first time, authorize Cloudflare to access GitHub
2. Select your forked `CloudFlare-ImgBed` repository
3. Click "Begin setup"

### 2.3 Configure Project Settings

| Configuration | Value | Description |
|---------------|-------|-------------|
| Project name | `cloudflare-imgbed` (or custom) | Project identifier |
| Production branch | `main` | Production environment branch |
| Build command | `npm install` | **Important: v2.0 new build command** |
| Build output directory | `/` | Keep default |

![Configure Project Settings](/images/deployment/pages-build-config.png)

::: warning Important Notice
The build command for v2.0 has changed to `npm install`. Please ensure you use the correct build command.
:::

### 2.4 Deploy Project

1. Click "Save and Deploy"
2. Wait for the first deployment to complete (about 2-3 minutes)

## 🗄️ Step 3: Configure KV Database

KV database is used to store file metadata and is a required component.

### 3.1 Create KV Namespace

1. In Cloudflare Dashboard, select "Workers & Pages"
2. Click "KV"
3. Click "Create namespace"
4. Enter namespace name: `img_url` (recommended name)
5. Click "Add"

![Create KV Namespace](/images/deployment/kv-create.png)
![Create KV Namespace](/images/deployment/kv-create-1.png)

### 3.2 Bind KV to Project

1. Return to your Pages project
2. Select "Settings" → "Bindings"
3. Click "Add" → "KV namespace"
4. Fill in binding information:
   - **Variable name**: `img_url` (must be this name)
   - **KV namespace**: Select the newly created namespace
5. Click "Save"

::: warning Important Notice
The variable name must be `img_url`, which is used in the code to access the KV database. Do not change this name.
:::

## 🔄 Step 4: Redeploy

After binding KV, you need to redeploy for it to take effect:

1. Go to the project's "Deployments" page
2. Find the latest deployment record
3. Click the "..." menu on the right
4. Select "Retry deployment"
5. Wait for deployment to complete

![Redeploy](/images/deployment/redeploy.png)

## 🚀 Next Steps

At this point, you have completed the deployment of the project on Cloudflare Pages, but you have not yet added storage channels. For adding storage channels and other settings, please refer to [Configuration Guide](/en/deployment/configuration#🗂%EF%B8%8F-storage-channel-configuration).
