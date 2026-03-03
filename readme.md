# ProteinHunt

ProteinHunt is a full-stack deal aggregation platform that fetches protein supplement deals from Reddit, processes them using an AI-powered parsing layer, and displays structured, filterable deal listings in real time.

The system combines external API ingestion, AI-based data normalization, authentication, and community-driven voting into a scalable web application.

---

## 🚀 Core Features

- Automated deal ingestion using Reddit API
- AI-powered deal parsing using Groq AI agent
- Real-time deal listing updates
- User authentication & authorization
- Community-driven upvoting system
- Manual deal submission support
- Advanced filtering & sorting
- MongoDB-backed persistence layer

---

## 🏗 System Architecture

### Data Pipeline

1. Fetch raw deal posts from Reddit API
2. Send unstructured content to Groq AI agent
3. Parse and normalize deal metadata (price, product, discount, link)
4. Store structured deal objects in MongoDB
5. Serve processed deals to frontend via REST APIs

This ensures raw, inconsistent Reddit content is transformed into usable structured deal data.

---

## 🔐 Authentication & User Actions

- JWT-based authentication
- Protected routes for deal submission
- User-specific actions (add deals, upvote deals)
- Vote tracking to prevent duplicate votes
- Role-aware backend validation

---

## ⚡ Real-Time & Interaction Features

- Live deal updates without page reload
- Instant upvote count updates
- Filter by price range, popularity, and recency
- Optimized MongoDB queries for fast retrieval

---

## 🧠 AI Integration

- Integrated Groq AI agent for natural language parsing
- Extracts structured fields from unstructured Reddit posts
- Handles inconsistent formatting and incomplete deal descriptions
- Reduces manual data cleaning effort

This layer bridges the gap between scraped content and structured e-commerce-style listings.

---

## 🛠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

### Database
- MongoDB
- Mongoose

### AI / External Services
- Reddit API
- Groq AI API

### Deployment
- Vercel (Frontend)
- Backend deployed separately (if applicable)

---

## 🌐 Live Demo

Live: https://proteinHunt.vercel.app  
GitHub: https://github.com/fiercfly/proteinHunt  

---

## 📦 Installation

```bash
npm install
npm run dev
```

## 🧠 Technical Challenges Solved

- Converting unstructured Reddit text into structured deal objects

- Preventing duplicate upvotes and vote manipulation

- Designing scalable API endpoints for filtering and sorting

- Managing authentication state securely

- Optimizing MongoDB queries for real-time responsiveness
