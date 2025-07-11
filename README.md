# Daggerstart - Virtual Tabletop for Daggerheart

A modern, web-based Virtual Tabletop (VTT) specifically designed for playing Daggerheart RPG campaigns. Built with Next.js, TypeScript, and real-time functionality to enhance your Daggerheart gaming experience.

## Features
- Dice Rolling
- Character Creation / Management
- Campaign Management
- Automated Fear and Hope
- Inventory

## Tech Stack
- Created with [Create T3 App](https://create.t3.gg/)
- This whole repo is vibe-coded with Claude Code. Please don't read the code in here, I did not write it.

## Getting Started

### Prerequisites

- [bun.sh](https://bun.sh/)
- MySQL database
- Discord OAuth application

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/daggerstart.git
cd daggerstart
```

2. Install dependencies:

```bash
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database URL and Discord OAuth credentials.

4. Start the database:

```bash
./start-database.sh
```

5. Set up the database schema:

```bash
bun run db:push
```

6. Start the development server:

```bash
bun run dev
```

Visit `http://localhost:3000` to start playing!

## Development Commands

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run typecheck` - Run TypeScript checks
- `bun run lint` - Run ESLint
- `bun run db:studio` - Open Prisma Studio
- `bun run db:push` - Push schema changes to database

## License

This product includes materials from the Daggerheart System Reference Document 1.0, © Critical Role, LLC. under the terms of the Darrington Press Community Gaming (DPCGL) License. More information can be found at https://www.daggerheart.com. There are no previous modifications by others.
