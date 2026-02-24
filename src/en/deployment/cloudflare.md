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
2. Select the "Compute & AI" -> "Workers & Pages" from the left menu
3. Click "Create application"
4. At the bottom, under `Looking to deploy Pages?`, select "Get started"
5. Click "Start with an existing Git repository"

![Create Pages Project](/images/deployment/pages-create.png)
![Create Pages Project](/images/deployment/pages-create-1.png)

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

## 🗄️ Step 3: Configure Database

The database is used to store file metadata and is a required component. You can choose between `KV` database and `D1` database. The comparison is shown in the table below. **Please choose one based on your usage scenario**.

| Feature | KV Database | D1 Database |
|---------|-------------|-------------|
| Read/Write Performance | High | Lower |
| Free Quota | Less | More |

::: tip Important
You only need to configure **one** of KV or D1 database, not both! Please choose the database type that suits your needs based on the table above.
:::

### 3.1 KV Database Configuration

#### Create KV Namespace

1. In Cloudflare Dashboard, select "Storage & Databases"
2. Click "Workers KV"
3. Click "Create instance"
4. Enter namespace name: `img_url` (recommended name)
5. Click "Create"

![Create KV Namespace](/images/deployment/kv-create.png)
![Create KV Namespace](/images/deployment/kv-create-1.png)

#### Bind KV to Project

1. Return to your Pages project
2. Select "Settings" → "Functions"
3. Click "Add" → "KV namespace"
4. Fill in binding information:
   - **Variable name**: `img_url` (must be this name)
   - **KV namespace**: Select the namespace you just created
5. Click "Save"

::: warning Note
When binding KV, the variable name must be `img_url`, which is the preset variable name for the project. Incorrect naming will cause issues such as inability to access the admin interface.
:::

### 3.2 D1 Database Configuration

#### Create D1 Database

1. In Cloudflare Dashboard, select "Storage & Databases"
2. Click "D1 SQL Database"
3. Click "Create database"
4. Enter database name: `img_d1` (recommended name)
5. Click "Add"

#### Initialize D1 Database

1. After creation, click to enter the database details page
2. Select the "Console" tab
3. Paste and execute the content below the comments in the SQL input box. (see [project repository](https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/database/init.sql))
4. Click "Execute"

#### Bind D1 to Project

1. Return to your Pages project
2. Select "Settings" → "Functions"
3. Click "Add" → "D1 database"
4. Fill in binding information:
   - **Variable name**: `img_d1` (must be this name)
   - **D1 database**: Select the database you just created
5. Click "Save"

## 🔄 Step 4: Redeploy

After binding the database, you need to redeploy for it to take effect:

1. Go to the project's "Deployments" page
2. Find the latest deployment record
3. Click the "..." menu on the right
4. Select "Retry deployment"
5. Wait for deployment to complete

![Redeploy](/images/deployment/redeploy.png)

## 🚀 Next Steps

At this point, you have completed the deployment of the project on Cloudflare Pages, but you have not yet added storage channels. For adding storage channels and other settings, please refer to [Configuration Guide](/en/deployment/configuration#🗂%EF%B8%8F-storage-channel-configuration).
