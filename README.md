# Financial Hub

Financial Hub is a personal finance cockpit built for people who want clarity, not chaos.

Imagine your money as a city:
- transactions are the traffic
- budgets are the lane limits
- goals are the destinations
- reports are the aerial view

This app gives you the control tower.

## What This Project Is About

Financial Hub helps users:
- track day-to-day transactions
- plan category budgets
- build savings goals
- analyze monthly trends
- manage preferences and currency settings

It is designed as a modern dashboard with clear visuals, quick actions, and structured financial insight.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Recharts for data visualization
- Prisma for persistence

## Core Routes

- `/` Dashboard
- `/transactions` Transaction management
- `/budgets` Category budget planning
- `/goals` Savings goals tracking
- `/reports` Monthly analytics
- `/settings` Preferences, export/import controls

## Feature Tour (Creative Walkthrough)

### 1) Dashboard: Your Mission Briefing
Open the app and the dashboard acts like morning radar:
- net worth hero with trend signal
- summary metrics for balance, income, expenses, savings rate
- spending donut and trend charts
- recent activity and goals progress

It is the "what changed" screen.

### 2) Transactions: The Event Stream
Every payment, salary, and transfer becomes a timeline event.
You can:
- add, edit, delete transactions
- search by text
- filter by type/category/date range
- sort by date or amount

It is the "why numbers moved" screen.

### 3) Budgets: Guardrails, Not Handcuffs
Budgets are category envelopes with progress and overspend alerts.
You can:
- create and edit category limits
- spot over-budget states instantly
- transfer funds from available balance into a budget

It is the "stay in lane" screen.

### 4) Goals: Future You, Funded
Goals track what you are building toward (emergency fund, travel, upgrades).
You can:
- create and edit goals
- monitor completion and days remaining
- transfer funds from available balance directly into a goal

It is the "long game" screen.

### 5) Reports: The Flight Recorder
Reports summarize your behavior over time.
You get:
- income vs expense comparison
- net worth trajectory
- month-window filtering for focused analysis

It is the "pattern recognition" screen.

### 6) Settings: Control Room
Settings centralize:
- currency preferences
- notification toggles
- CSV export
- CSV import with preview and validation

It is the "operate and maintain" screen.

## Data Model at a Glance

Main entities:
- Transaction
- Budget
- SavingsGoal
- Settings

The calculations layer derives:
- net worth
- monthly income/expenses/savings rate
- budget utilization
- goal completion status

## Local Setup

1. Install dependencies

```bash
pnpm install
```

2. Start development server

```bash
pnpm dev
```

3. Open the app

```text
http://localhost:3000
```

## Why This Project Exists

Most finance apps either overwhelm users with raw data or oversimplify reality.

Financial Hub tries to do both well:
- enough detail to make smart decisions
- enough design clarity to stay calm while doing it

In short: less guessing, more intentional money moves.

## Future Ideas

- recurring transaction automations
- category-level forecasting
- transfer history timeline
- smarter recommendations based on spending drift

---

If money is a story, Financial Hub is the editor.
