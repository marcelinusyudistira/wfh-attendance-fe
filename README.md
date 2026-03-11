# React + Vite Frontend

A minimal React frontend project built with Vite.

## Requirements

* Node.js >= 18
* npm / pnpm / yarn

## Installation

Install dependencies:

```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

After the server starts, open the URL shown in the terminal (usually `http://localhost:5173`).

## Environment Variables

API configuration is managed through the `.env` file.

### Development (Using Vite Proxy – Recommended)

Using the Vite proxy allows API requests to avoid CORS issues during development.

Example configuration:

```
VITE_API_BASE_URL=
VITE_PROXY_TARGET=http://localhost:3000
```

### Without Proxy

If you prefer not to use the proxy:

```
VITE_API_BASE_URL=http://localhost:3000
```

In this case, the backend must allow CORS if the frontend and backend run on different origins.

**Note:**
After modifying `.env`, restart the development server.

```
npm run dev
```

or rebuild the project.

## CORS Notes

If you see login requests triggered twice in the browser network tab, this is usually caused by:

* `OPTIONS` request (CORS preflight)
* followed by the actual request

When using the Vite proxy (same-origin request), the preflight request and CORS errors usually do not occur.

## Build

To create a production build:

```bash
npm run build
```

The build output will be generated in the `dist` folder.

## Preview Build

To preview the production build locally:

```bash
npm run preview
```
