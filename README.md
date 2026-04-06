# Hackathon Registration — Backend

Node.js · Express · MongoDB (Mongoose)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set your MONGO_URI

# 3. Run (development)
npm run dev

# 4. Run (production)
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/register | Register a new team |
| GET | /api/registrations | Get all registrations |
| GET | /api/registrations/:id | Get single registration |
| DELETE | /api/registrations/:id | Delete a registration |

## POST /api/register — Request Body

```json
{
  "teamName": "Team Alpha",
  "email": "contact@example.com",
  "members": [
    { "name": "Alice", "class": "SE-A" },
    { "name": "Bob",   "class": "SE-B" },
    { "name": "Carol", "class": "TE-A" },
    { "name": "Dave",  "class": "TE-B" },
    { "name": "Eve",   "class": "BE-A" }
  ]
}
```

## MongoDB URI Options

**Local:** `mongodb://localhost:27017/hackathon`  
**MongoDB Atlas:** `mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/hackathon`
