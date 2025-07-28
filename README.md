Skill Tree Website
This repository contains a full‑stack web application for visualising and tracking a learner’s progress through a structured set of skills. It is composed of a React front‑end powered by Tailwind CSS and Framer Motion, and an Express back‑end using PostgreSQL via the Sequelize ORM. The project is designed with best practices in mind: responsive layouts, accessible interactions, OAuth based authentication, secure data storage and a robust API surface.

The remainder of this readme is broken down by sub‑project:

Frontend – the React application responsible for rendering the skill tree, handling user interactions and communicating with the API.

Backend – a Node.js server exposing a REST API, managing authentication and persisting data to a PostgreSQL database.

Deployment – guidance on how to deploy the project to Vercel with continuous integration enabled.

Frontend
The front‑end lives in the frontend/ directory. It uses React with functional components, Framer Motion for animations and Tailwind CSS for styling. The component hierarchy roughly looks like this:

App – top‑level component handling routing and layout.

SkillNode – renders a single hexagonal skill node with hover and click states.

SkillPanel – displays expanded details for a selected skill node.

UserProfile – shows user information and progress charts.

Dependencies are declared in frontend/package.json. See the Getting Started section below for instructions on installing and running the development server.

Backend
The back‑end lives in the backend/ directory. It exposes a small REST API used by the front‑end. It is built with Express.js and uses Sequelize to map JavaScript models to a PostgreSQL database. Key endpoints include:

GET /api/skills – returns the entire skill tree as JSON.

GET /api/users/:id/progress – returns a user’s saved progress.

POST /api/users/:id/progress – updates the user’s progress on one or more skills.

Authentication is handled via OAuth (Google and GitHub). The server stores minimal user information and uses secure cookies to maintain sessions.

Deployment
The project is designed to be deployed to Vercel. To prepare a deployment you must:

Create a new GitHub repository and push this code to it.

Create a Postgres database (you can use Vercel’s Postgres offering or Supabase) and set the connection string as an environment variable named DATABASE_URL in Vercel.

Configure OAuth credentials with Google/GitHub and set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables in Vercel.

In the backend directory there is a vercel.json file which tells Vercel how to route API requests. Ensure this file is committed.

Connect your GitHub repository to Vercel and deploy. Vercel will automatically detect the front‑end and back‑end and build both.

Getting Started
Prerequisites
You need Node.js >= 18 and npm >= 9 installed. A Postgres database is required for the backend.

Running Locally
Install dependencies in both packages:

bash
Copy code
cd skill-tree-website/frontend
npm install
cd ../backend
npm install
Create a .env file in backend/ with the following variables:

env
Copy code
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DATABASE
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
Migrate the database (see backend/models/index.js for schema definitions) then seed with initial skill data. You can write a simple script to insert skills into the skills table.

Start the backend server:

bash
Copy code
cd skill-tree-website/backend
npm start
Start the front‑end development server:

bash
Copy code
cd skill-tree-website/frontend
npm start
The React app will be available at http://localhost:3000 and the API will run on http://localhost:4000 by default. During development the React app is configured to proxy API requests to the backend.

Licence
This project is licensed under the MIT License. See LICENSE for details.
