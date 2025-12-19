# Deploying Tux Racer to Vercel

## Quick Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (for first deployment)
   - What's your project's name? **tux-racer** (or your preferred name)
   - In which directory is your code located? **./** (press Enter)
   - Want to override the settings? **N** (the vercel.json will be used)

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/new)**

3. **Import your repository**:
   - Click "Add New Project"
   - Import your Git repository
   - Vercel will automatically detect the Vite framework

4. **Configure (if needed)**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

5. **Click "Deploy"**

## Environment Variables

This project doesn't require any environment variables for basic deployment.

## Post-Deployment

After deployment, your game will be available at:
- **Preview URL**: `https://your-project-name-hash.vercel.app`
- **Production URL**: `https://your-project-name.vercel.app`

## Custom Domain (Optional)

To add a custom domain:
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure TypeScript compiles without errors: `npm run build`

### Assets Not Loading
- The `vite.config.js` is already configured with `base: "./"` for proper asset paths
- Verify all assets are in the `public` folder or imported in your code

### Game Not Working
- Check browser console for errors
- Ensure WebGL2 is supported in the browser
- Verify all asset paths are correct

## Local Testing Before Deployment

Always test the production build locally before deploying:

```bash
npm run build
npm run preview
```

This will serve the production build locally at `http://localhost:4173`

## Continuous Deployment

Once connected to Git, Vercel will automatically:
- Deploy every push to `main` branch to production
- Create preview deployments for pull requests
- Run the build command and deploy the `dist` folder

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

