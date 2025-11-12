# Docker Test App

## Overview
This project is a minimal full-stack example that demonstrates how to build a simple student signup form backed by a MongoDB database. An Express server exposes REST endpoints to create and list users, while static assets under `public/` provide the frontend form. The repository relies on Docker Compose for all database infrastructure and bundles a configuration for MongoDB plus the mongo-express UI.

## Features
- Express server (`server.js`) listening on port `5050`
- MongoDB integration using the official Node.js driver
- Static signup form served from `public/index.html`
- POST endpoint to persist user records and GET endpoint to list them
- `docker-compose` setup (`mongodb.yaml`) provisioning MongoDB and mongo-express dashboards

## Prerequisites
- Docker Desktop (or compatible engine) to run MongoDB via Compose
- Node.js 18+ and npm (only if you plan to run the Express API directly on your host machine)

## Installation
```bash
npm install
```

## Run the Express API (host machine)
```bash
node server.js
```

The application serves static assets at `http://localhost:5050/`. Submitting the form issues a POST request to `/addUser`.

## Environment Variables
- `MONGO_URL`: Connection string used by the Express server. Defaults to `mongodb://admin:qwerty@localhost:27017/?authSource=admin`, which targets the MongoDB container published to the host.

## Run MongoDB with Docker Compose
The database must be provisioned through Docker. The file `mongodb.yaml` provides a ready-to-use Docker Compose configuration.

### Start Services
```bash
docker-compose -f mongodb.yaml up -d
```

This command provisions:
- **mongo**: MongoDB instance published on `mongodb://admin:qwerty@localhost:27017/?authSource=admin`
- **mongo-express**: Admin UI exposed on `http://localhost:8081`

### Stop Services
```bash
docker-compose -f mongodb.yaml down
```

## API Endpoints
- `GET /getUsers`: Returns all users stored in the `users` collection
- `POST /addUser`: Accepts URL-encoded form data and inserts a new user document

## Project Structure
```
docker-testapp-main/
├── mongodb.yaml         # Docker Compose setup for MongoDB + mongo-express
├── package.json         # Runtime dependencies
├── public/
│   ├── index.html       # Signup form
│   └── style.css        # Minimal styling for the form
└── server.js            # Express server and Mongo integration
```

## Notes
- Ensure the MongoDB service is running through Docker Compose before submitting the form; otherwise, API calls return HTTP 500.
- Use `ctrl + c` in the terminal running `node server.js` to stop the server gracefully.