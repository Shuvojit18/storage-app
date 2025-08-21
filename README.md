# storage-app

Simple Express app configured for Heroku deployment.

## Project Structure

```
server.js        # Entry point
src/
  app.js        # Express app setup
  routes/
    index.js    # Root route
```

## Development

Install dependencies:

```
npm install
```

Start the server:

```
npm start
```

## Deployment

Heroku uses the `Procfile` to start the web process via `npm start`.
