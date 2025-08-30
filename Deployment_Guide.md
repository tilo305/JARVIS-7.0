# JARVIS Chat Bot - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the JARVIS Chat Bot to various hosting platforms and environments.

## Prerequisites

### System Requirements
- Node.js 18+ 
- npm or pnpm package manager
- Git for version control
- Modern web browser with ES6+ support

### Required Accounts
- ElevenLabs account with ConvAI agent configured
- Hosting platform account (Vercel, Netlify, or similar)
- Optional: Domain name for custom URL

## Local Development Setup

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd jarvis-chatbot

# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm run dev
# or
npm run dev
```

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```env
# ElevenLabs Configuration
VITE_ELEVENLABS_AGENT_ID=agent_7601k23b460aeejb2pvyfcvw6atk

# Development Settings
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true

# Optional: Analytics and Monitoring
VITE_ANALYTICS_ID=your-analytics-id
VITE_SENTRY_DSN=your-sentry-dsn
```

### 3. Development Testing
```bash
# Run tests
pnpm run test

# Build for production (test)
pnpm run build

# Preview production build
pnpm run preview
```

## Production Deployment

### Option 1: Vercel (Recommended)

#### A. Automatic Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push

#### B. Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add VITE_ELEVENLABS_AGENT_ID
```

#### C. Vercel Configuration (`vercel.json`)
```json
{
  "framework": "vite",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "installCommand": "pnpm install",
  "devCommand": "pnpm run dev",
  "env": {
    "VITE_ELEVENLABS_AGENT_ID": "@elevenlabs-agent-id"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

#### A. Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### B. Deployment Steps
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build and deploy
pnpm run build
netlify deploy --prod --dir=dist
```

### Option 3: GitHub Pages

#### A. GitHub Actions Workflow (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_ELEVENLABS_AGENT_ID: ${{ secrets.ELEVENLABS_AGENT_ID }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### B. Vite Configuration for GitHub Pages
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/jarvis-chatbot/', // Replace with your repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
})
```

### Option 4: Docker Deployment

#### A. Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### B. Nginx Configuration (`nginx.conf`)
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Referrer-Policy strict-origin-when-cross-origin;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

#### C. Docker Commands
```bash
# Build image
docker build -t jarvis-chatbot .

# Run container
docker run -p 80:80 jarvis-chatbot

# Docker Compose (docker-compose.yml)
version: '3.8'
services:
  jarvis-chatbot:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

## Environment Variables

### Required Variables
```env
# ElevenLabs Agent ID (Required)
VITE_ELEVENLABS_AGENT_ID=agent_7601k23b460aeejb2pvyfcvw6atk
```

### Optional Variables
```env
# Environment
VITE_NODE_ENV=production

# Debug Mode (development only)
VITE_DEBUG_MODE=false

# Analytics
VITE_ANALYTICS_ID=your-analytics-id
VITE_GTM_ID=your-gtm-id

# Error Monitoring
VITE_SENTRY_DSN=your-sentry-dsn

# API Endpoints (if using custom backend)
VITE_API_BASE_URL=https://api.yoursite.com

# Feature Flags
VITE_ENABLE_DEBUG_PANEL=false
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

## Performance Optimization

### 1. Build Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          animations: ['framer-motion'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. Asset Optimization
- Compress images and videos
- Use WebP format for images
- Implement lazy loading
- Enable gzip compression
- Set proper cache headers

### 3. Code Splitting
```javascript
// Lazy load components
const DebugPanel = lazy(() => import('./components/debug/DebugPanel'));
const ElevenLabsWidget = lazy(() => import('./components/voice/ElevenLabsWidget'));
```

## Security Configuration

### 1. Content Security Policy
```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://unpkg.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  media-src 'self' blob:;
  connect-src 'self' https://api.elevenlabs.io wss://api.elevenlabs.io;
  font-src 'self' https://fonts.gstatic.com;
">
```

### 2. Security Headers
```javascript
// Add to hosting platform configuration
{
  "headers": [
    {
      "key": "Strict-Transport-Security",
      "value": "max-age=31536000; includeSubDomains"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    },
    {
      "key": "Referrer-Policy",
      "value": "strict-origin-when-cross-origin"
    }
  ]
}
```

## Monitoring and Analytics

### 1. Error Monitoring (Sentry)
```javascript
// Add to main.jsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_NODE_ENV,
  });
}
```

### 2. Performance Monitoring
```javascript
// Add to App.jsx
useEffect(() => {
  if ('performance' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.log('Performance:', entry);
      });
    });
    observer.observe({ entryTypes: ['navigation', 'paint'] });
  }
}, []);
```

### 3. Analytics Integration
```javascript
// Google Analytics 4
import { gtag } from 'ga-gtag';

gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID);
```

## Troubleshooting

### Common Issues

#### 1. ElevenLabs Widget Not Loading
- Check agent ID is correct
- Verify script is loading from CDN
- Check browser console for errors
- Ensure CORS is properly configured

#### 2. Voice Permissions Denied
- Check browser microphone permissions
- Verify HTTPS is enabled (required for microphone access)
- Test on different browsers
- Check for conflicting browser extensions

#### 3. Build Failures
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Verify all environment variables are set
- Check for TypeScript errors

#### 4. Performance Issues
- Enable production build optimizations
- Check bundle size analysis
- Implement code splitting
- Optimize images and assets

### Debug Commands
```bash
# Check bundle size
pnpm run build && npx vite-bundle-analyzer dist

# Test production build locally
pnpm run build && pnpm run preview

# Run performance audit
npx lighthouse http://localhost:4173

# Check for security vulnerabilities
npm audit

# Analyze dependencies
npx depcheck
```

## Maintenance

### Regular Tasks
1. **Update Dependencies**
   ```bash
   pnpm update
   npm audit fix
   ```

2. **Monitor Performance**
   - Check Core Web Vitals
   - Monitor error rates
   - Review user feedback

3. **Security Updates**
   - Update Node.js version
   - Patch security vulnerabilities
   - Review and update CSP headers

4. **Backup and Recovery**
   - Regular code backups
   - Database backups (if applicable)
   - Deployment rollback procedures

### Scaling Considerations
- CDN implementation for global distribution
- Load balancing for high traffic
- Database optimization (if backend is added)
- Caching strategies
- Rate limiting implementation

## Support and Documentation

### Resources
- [ElevenLabs Documentation](https://elevenlabs.io/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion)

### Getting Help
1. Check the troubleshooting section
2. Review browser console errors
3. Test in different browsers
4. Check network connectivity
5. Verify environment variables
6. Contact support with detailed error logs

This deployment guide ensures a smooth and secure deployment of the JARVIS Chat Bot across various platforms and environments.

