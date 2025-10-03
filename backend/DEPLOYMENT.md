# Backend Deployment Configuration

## Render.com Configuration (render.yaml)

```yaml
services:
  - type: web
    name: lms-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URI
        fromDatabase:
          name: mongodb
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CLIENT_URL
        value: https://your-netlify-app.netlify.app
      - key: CORS_ORIGIN
        value: https://your-netlify-app.netlify.app
```

## Heroku Configuration

- Create a new Heroku app
- Add MongoDB Atlas add-on or set MONGO_URI
- Set environment variables in Heroku dashboard
- Deploy using Git or GitHub integration

## Railway Configuration

- Connect GitHub repository
- Set environment variables in Railway dashboard
- Automatic deployments on push to main branch

## Environment Variables Required:

- NODE_ENV=production
- PORT=5000 (or process.env.PORT)
- MONGO_URI=your-mongodb-connection-string
- JWT_SECRET=your-jwt-secret
- CLIENT_URL=https://your-netlify-app.netlify.app
- CORS_ORIGIN=https://your-netlify-app.netlify.app
