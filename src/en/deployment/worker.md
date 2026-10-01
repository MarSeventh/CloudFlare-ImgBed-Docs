# Cloudflare Workers Deployment

Cloudflare Workers deployment is an alternative serverless deployment method alongside Pages. Compared to Pages, Workers offers more flexible routing control and higher customizability, suitable for users who need fine-grained control over the deployment process.

::: tip Pages vs Workers
- **Pages deployment**: Simpler, suitable for most users, can be completed through the Cloudflare Dashboard UI, supports automatic updates
- **Workers deployment**: Deployed via GitHub Actions, suitable for users familiar with CI/CD workflows, supports auto-deploy on push to main branch, can also be triggered manually

Both methods provide identical functionality. Choose whichever suits you best.
:::

## 📂 Step 1: Fork the Project

1. Visit [CloudFlare ImgBed Project](https://github.com/MarSeventh/CloudFlare-ImgBed)
2. Click the "Fork" button in the top right corner
3. Select your GitHub account
4. Confirm the Fork is complete

## 🔑 Step 2: Prepare Cloudflare Resources

### 2.1 Get API Token and Account ID

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click your avatar → "My Profile" → "API Tokens"
3. Click "Create Token"
4. Select the "Edit Cloudflare Workers" template
5. Confirm permissions and create, **save the generated Token**
6. Return to the Dashboard home page, find and **save the Account ID** in the right sidebar

### 2.2 Create Database

The database stores file metadata. Choose between KV or D1 (pick one).

| Feature | KV Database | D1 Database |
|---------|-------------|-------------|
| Read/Write Performance | High | Lower |
| Free Quota | Less | More |

#### KV Database

1. In Dashboard, select "Storage & Databases" → "Workers KV"
2. Click "Create instance", name it `img_url`
3. After creation, **save the Namespace ID**

#### D1 Database

1. In Dashboard, select "Storage & Databases" → "D1 SQL Database"
2. Click "Create database", name it `img_d1`
3. After creation, **save the Database ID**
4. In the "Console" tab, execute the initialization SQL (see [init.sql](https://github.com/MarSeventh/CloudFlare-ImgBed/blob/main/database/init.sql))

### 2.3 Create R2 Bucket (Optional)

If you need to use the R2 storage channel:

1. In Dashboard, select "Storage & Databases" → "R2 Object Storage"
2. Click "Create bucket", **save the bucket name**

## ⚙️ Step 3: Configure GitHub Secrets

In your forked repository, go to **Settings → Secrets and variables → Actions → Secrets** and add the following:

| Secret Name | Description | Required |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token | ✅ Required |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID | ✅ Required |
| `D1_DATABASE_ID` | D1 Database ID | Pick one |
| `KV_NAMESPACE_ID` | KV Namespace ID | Pick one |
| `R2_BUCKET_NAME` | R2 Bucket name | Optional |
| `WORKER_NAME` | Worker name (default `cloudflare-imgbed`) | Optional |
| `WORKER_VARS` | Business environment variables (JSON format, supports `text` / `secret`) | Optional |

### WORKER_VARS Format {#worker-vars}

Add a GitHub Actions Secret named `WORKER_VARS` and set its value to the complete JSON object. Each entry accepts a direct value or an object with `value` and an optional `type`:

```json
{
  "TG_CHAT_ID": "your-chat-id",
  "CUSTOM_DOMAIN": {
    "value": "https://img.example.com",
    "type": "text"
  },
  "AI_CONFIG_SECRET": {
    "value": "replace-with-a-random-secret-of-at-least-32-characters",
    "type": "secret"
  },
  "TG_BOT_TOKEN": {
    "value": "your-bot-token",
    "type": "secret"
  }
}
```

| Format / Type | Deployment behavior |
|---|---|
| `"NAME": "value"` | Preserves the original format and deploys as a regular `text` environment variable |
| `"NAME": { "value": "value" }` | Defaults to `text` when `type` is omitted |
| `"NAME": { "value": "value", "type": "text" }` | Written to `[vars]` in `wrangler.toml` and deployed as a Cloudflare plain text variable |
| `"NAME": { "value": "value", "type": "secret" }` | Excluded from `[vars]`; uploaded together as Cloudflare Secrets using `wrangler secret bulk` after the Worker deploys successfully |

`type` only accepts lowercase `text` and `secret`. Invalid configuration stops deployment. Business variable values are hidden when printing the generated configuration, and the temporary secrets file is cleaned up at the end of the workflow. Run the deployment workflow again after changing a GitHub Secret.

For AI features, configure `AI_CONFIG_SECRET` as `secret` with a **random value of at least 32 characters**, and enter provider API Keys in **AI Settings** in the admin panel. When migrating from the original direct-value format, keep the same `AI_CONFIG_SECRET` value so existing provider API Keys can still be decrypted.

For all available environment variables, refer to the [Configuration Guide](/en/deployment/configuration).

::: warning Not recommended unless necessary
All business settings (storage channels, moderation policies, etc.) can be configured through the admin panel after deployment. Only use `WORKER_VARS` for special environment variables that cannot be set via the admin panel.
:::

::: warning Security Note
Store configuration in GitHub Secrets. Do not commit real credentials or put them in Variables in a public repository. A GitHub Secret does not automatically become a Cloudflare Secret: direct values and `type: "text"` deploy as plain text variables. Set `type: "secret"` explicitly for keys, tokens, and other sensitive values.
:::

## 🚀 Step 4: Run Deployment

1. Go to the **Actions** page of your forked repository
2. Select **Deploy to Cloudflare Workers** on the left
3. Click **Run workflow**
4. Select the branch to deploy (default `main`)
5. Optionally modify the Worker name (priority: manual input > `WORKER_NAME` Secret > `cloudflare-imgbed`)
6. Click **Run workflow** to start deployment

After deployment, access your site at `https://<worker-name>.<account-subdomain>.workers.dev`.

## 🚀 Next Steps

After deployment, you need to add storage channels for the service to work properly. Please refer to the [Configuration Guide](/en/deployment/configuration#🗂%EF%B8%8F-storage-channel-configuration) for setup instructions.
