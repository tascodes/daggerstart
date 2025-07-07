# Daggerstart - Virtual Tabletop for Daggerheart

A modern, web-based Virtual Tabletop (VTT) specifically designed for playing Daggerheart RPG campaigns. Built with Next.js, TypeScript, and real-time functionality to enhance your Daggerheart gaming experience.

## Features

### 🎲 Dice Rolling System
- **Action Dice (2d12)**: Roll Hope and Fear dice with automatic outcome calculation
- **Damage Dice**: Support for all standard dice types (d4, d6, d8, d10, d12, d20)
- **Real-time Roll Feed**: See all players' rolls in real-time with floating notifications
- **Roll Outcome Badges**: Automatic "With Hope", "With Fear", and mixed outcome detection
- **Notification Controls**: Toggle roll notifications on/off in the floating dice panel

### 👥 Character Management
- **Complete Character Sheets**: Full support for Daggerheart character creation and management
- **Ability Scores**: Track all six abilities (Agility, Strength, Finesse, Instinct, Presence, Knowledge)
- **Health & Stress**: Interactive bars for HP, Stress, and Hope with optimistic updates
- **Damage Thresholds**: Configure Major and Severe damage thresholds
- **Defense Stats**: Evasion and Armor tracking with interactive bars
- **Wealth System**: Gold management with Handfuls, Bags, and Chest tracking
- **Character Navigation**: Tabbed interface for character details and domain cards

### 🏰 Campaign Management  
- **Game Creation**: Create and manage Daggerheart campaigns as a Game Master
- **Player Management**: Add/remove characters from games with proper permission controls
- **Game Master Tools**: Dedicated GM interface with enhanced controls
- **Character Assignment**: Flexible character-to-game assignment system

### 😱 Fear/Hope Automation
- **Automatic Fear Tracking**: Fear automatically increases for Game Masters when players roll "With Fear"
- **Fear Resource Management**: Game Master Fear counter (max 12) with manual adjustment
- **Real-time Updates**: Fear updates immediately when "With Fear" rolls occur
- **Visual Fear Bar**: Purple stat bar showing current Fear level for Game Masters

### 🃏 Domain Cards
- **Card Management**: Dedicated interface for managing character domain cards
- **Character Integration**: Seamless navigation between character details and cards

### 🔄 Real-time Features
- **Live Dice Rolls**: All players see dice rolls instantly via WebSocket subscriptions
- **Optimistic Updates**: Immediate UI feedback for all character stat changes
- **Floating Notifications**: Non-intrusive roll notifications with auto-dismiss
- **Real-time Fear Tracking**: Fear updates across all clients when triggered

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React, TypeScript
- **Backend**: tRPC for type-safe API routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js with Discord provider
- **Styling**: Tailwind CSS with shadcn/ui components
- **Real-time**: WebSocket subscriptions for live updates

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
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

## Game Features

### For Players
- Create and manage multiple characters
- Join games hosted by Game Masters
- Roll dice with automatic outcome calculation
- Track character health, stress, and resources
- View real-time dice rolls from all players
- Manage domain cards and character abilities

### For Game Masters
- Create and manage campaigns
- Add/remove players and characters
- Track Fear resource that increases with player "With Fear" rolls
- Clear dice roll history
- Enhanced controls for game management
- Real-time visibility into all player actions

## Contributing

This project is designed specifically for Daggerheart RPG. Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is not affiliated with or endorsed by Darrington Press or Critical Role. Daggerheart is a trademark of Darrington Press.