# Deployment Guide (VPS / Bare Metal)

This guide covers how to deploy the Muka Baking CMS exactly as it is architected right now. 

Because the backend relies on **local disk storage (`/uploads/`)** for Multer image uploads, you **cannot** use ephemeral serverless providers like Vercel or Render for the backend. The easiest and most reliable way to deploy this specific architecture is on a **Single VPS (Virtual Private Server)** like DigitalOcean, Linode, or an AWS EC2 instance running Ubuntu.

## Architecture on Server
- **Database**: PostgreSQL installed directly on the VPS.
- **Backend**: Node.js managed by `pm2` (Process Manager) running on port `5000`.
- **Frontend**: Built into static files (`dist`) and served by NGINX.
- **Reverse Proxy**: NGINX listening on port `80`/`443`, routing `/api` and `/uploads` to the Backend, and everything else to the Frontend `dist` folder.

---

## 1. Server Setup Requirements

SSH into your fresh Ubuntu server and install the core dependencies:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install NGINX
sudo apt install -y nginx

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 globally
sudo npm install -g pm2
```

---

## 2. Database Preparation

Create the database and user in PostgreSQL on your server:
```bash
sudo -u postgres psql
```
Inside the `psql` console:
```sql
CREATE DATABASE muka_baking_db;
CREATE USER muka_admin WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE muka_baking_db TO muka_admin;
ALTER DATABASE muka_baking_db OWNER TO muka_admin;
\q
```

---

## 3. Clone and Setup Project

Clone your repository to `/var/www/muka_baking`:
```bash
cd /var/www
git clone <your-repo-url> muka_baking
cd muka_baking
```

### 3.1 Backend Setup
```bash
cd /var/www/muka_baking/backend
npm install

# Create environment file
cat > .env << EOF
DATABASE_URL="postgresql://muka_admin:your_secure_password@localhost:5432/muka_baking_db?schema=public"
PORT=5000
JWT_SECRET="Production-Super-Secret-Key-Change-Me"
EOF

# Sync Schema and Seed Data
npx prisma db push
node src/seed.js

# Start backend via PM2
pm2 start src/index.js --name "muka-backend"
pm2 save
pm2 startup
```

### 3.2 Frontend Build
```bash
cd /var/www/muka_baking/frontend
npm install

# Create environment file pointing to the public domain's API
echo "VITE_API_BASE_URL=/api" > .env.production

# Build the SPA (Outputs to /dist)
npm run build
```
*(By pointing `VITE_API_BASE_URL` to `/api`, we rely on NGINX to proxy the request below).*

---

## 4. NGINX Configuration (The Glue)

We will use NGINX to serve the React app and act as a reverse proxy for the Express backend.

Edit the NGINX configuration:
```bash
sudo nano /etc/nginx/sites-available/muka_baking
```

Add the following block (replace `yourdomain.com` with your Server IP or Domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 1. Serve frontend React application
    root /var/www/muka_baking/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 2. Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 3. Serve uploaded images directly or proxy to node.js
    location /uploads/ {
        proxy_pass http://localhost:5000/uploads/;
    }
}
```

Enable the configuration and restart NGINX:
```bash
sudo ln -s /etc/nginx/sites-available/muka_baking /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 5. Persistent File Uploads Note

Once running:
Any images you upload via the Admin CMS will be safely saved to `/var/www/muka_baking/backend/uploads/`. Because this is a permanent VPS server, your files will **NOT** be deleted when the Node.js server restarts (which is the problem with serverless tools like Vercel).

**Backup Strategy:**
Make sure you periodically back up the PostgreSQL database and the `/backend/uploads/` directory to prevent data loss.
