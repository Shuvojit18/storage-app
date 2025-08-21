# Media Timeline

Node + Express media timeline (images/videos) with JWT cookies and modern UI. Heroku-ready. SoC structured.

## Local
```bash
npm i
cp .env.example .env  # set JWT_SECRET
npm run dev           # http://localhost:3000
```

## Deploy to Heroku
```bash
heroku create media-timeline
heroku config:set JWT_SECRET=$(openssl rand -hex 32) COOKIE_SECURE=true FORCE_HTTPS=true
# optional persistent uploads
# heroku config:set CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"

git push heroku main
```
