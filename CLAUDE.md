# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a T3 Stack application built with:

- **Next.js 15** (App Router)
- **tRPC** for type-safe API routes
- **NextAuth.js** for authentication (Discord provider)
- **Prisma** with MySQL database
- **Tailwind CSS** for styling
- **TypeScript** throughout

## Development Commands

### Core Development

- `bun run dev` - Start development server with Turbo
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run preview` - Build and start production server

### Database

- `./start-database.sh` - Start MySQL Docker container
- `bun run db:push` - Push schema changes to database
- `bun run db:generate` - Generate Prisma client after schema changes
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Prisma Studio

### Code Quality

- `bun run lint` - Run ESLint
- `bun run lint:fix` - Run ESLint with auto-fix
- `bun run typecheck` - Run TypeScript type checking
- `bun run check` - Run both linting and type checking
- `bun run format:check` - Check Prettier formatting
- `bun run format:write` - Format code with Prettier

## Architecture

### File Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/server/api/` - tRPC API routes and configuration
- `src/server/auth/` - NextAuth.js configuration
- `src/trpc/` - tRPC client configuration
- `prisma/` - Database schema and migrations

### Key Files

- `src/server/api/root.ts` - Main tRPC router where all sub-routers are combined
- `src/server/api/trpc.ts` - tRPC configuration, context, and procedures
- `src/server/auth/config.ts` - NextAuth.js configuration
- `prisma/schema.prisma` - Database schema
- `src/env.js` - Environment variable validation

### Data Flow

1. Client components use `api.routerName.procedureName.useQuery()` or `useMutation()`
2. Server components use `api.routerName.procedureName()` directly
3. All API routes are defined in `src/server/api/routers/`
4. Database access is through Prisma ORM with `db` instance

### Authentication

- Uses NextAuth.js with Discord provider
- Session available in tRPC context as `ctx.session`
- Protected procedures check authentication automatically
- User ID is available as `ctx.session.user.id`

## Environment Setup

1. Copy `.env.example` to `.env`
2. Set up Discord OAuth app and add credentials
3. Run `./start-database.sh` to start MySQL container
4. Run `bun run db:push` to set up database schema
5. Run `bun run dev` to start development

## Components

### shadcn

Prefer using shadcn components where possible.
Run `bunx --bun shadcn@latest add {component name}` to install new shadcn components as they are needed.
New components will be made available at the path `src/components/ui/{component name}.tsx`

## Types

Ensure type safety where possible. Always declare a type for `useState` hooks unless it is a simple type (e.g. string, boolean, number).

### Enums

Do not use `enum` - instead create a const object and its associated keys type. Example:

```
const Fruit = {
  apple: "apple",
  banana: "banana",
  pear: "pear",
} as const;
type FruitKeys = (typeof Fruit)[keyof typeof Fruit];
```

## Theme & Styling

The UI should be dark by default.
The primary background color is slate-900
The primary UI color is sky-500
The accent color is yellow-600
The default text color is white

## Testing

Do not write tests.

## Path Aliases

- `~/` maps to `src/` directory
