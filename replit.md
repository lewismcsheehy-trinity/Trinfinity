# Project Overview

A Next.js 16 web application for Trinity High School Physics - an official study portal for custom physics assessments and mark schemes. Migrated from Vercel to Replit.

## Features

- **Multiple learning modes**: Multiple choice, paper-based questions, retrieval practice, targets, definitions, and calculations
- **Drawing canvas**: Interactive whiteboard in the quiz interface with support for freehand drawing, lines, circles, squares, and labels
- **Submit drawings**: Users can submit drawings directly into their response area with a "Submit Drawing" button in the popup
- **Answer marking**: View SQA marking instructions and submit marks for each question part
- **Grid toggle**: Visual grid overlay option on the drawing canvas
- **Color palette**: Multiple color options for drawing tools
- **Adjustable brush size**: Line width slider for drawing

## Stack

- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Runtime**: Node.js 20
- **Package manager**: pnpm
- **Styling**: Tailwind CSS v4 with shadcn/ui (Radix UI primitives)
- **Drawing**: HTML5 Canvas API
- **AI**: Vercel AI SDK (`ai` package) with `@ai-sdk/gateway`
- **Forms**: react-hook-form + zod
- **Charts**: recharts
- **Analytics**: @vercel/analytics

## Project Structure

- `app/page.tsx` — Main application with Quiz, Whiteboard, and all modes
- `app/api/generate-questions/` — AI question generation endpoint
- `components/ui/` — shadcn/ui components (drawer, button, etc.)
- `lib/` — Utility functions
- `public/` — Static assets

## Drawing Feature Details

The Whiteboard component provides:
- **Tools**: Free draw, line, circle, square, label, eraser
- **Submit Button**: Converts canvas to PNG and inserts into response area
- **Submitted Drawing Display**: Shows submitted drawings as images in the response area
- **Canvas Grid**: Toggle grid overlay for measurement reference

## Running the App

```bash
pnpm run dev    # Development server on port 5000
pnpm run build  # Production build
pnpm run start  # Production server on port 5000
```

## Replit Configuration

- Dev and start scripts bind to `0.0.0.0:5000` for Replit preview pane compatibility
- Workflow: "Start application" runs `pnpm run dev`, output type: webview, port: 5000
