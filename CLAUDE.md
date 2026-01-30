# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server at http://localhost:3000
pnpm build    # Production build
pnpm lint     # Run ESLint
```

## Architecture

**zoa** is a web utility toolkit (encoding/decoding, hashing, ID generation, string transformation, random value generation) built with Next.js 16 App Router. Dark pastel theme, no light mode.

### Key Directories

- `lib/encoder/` - Encoding logic (base64, url, hex). Each algorithm in separate file, unified export via `index.ts`
- `lib/hash/` - Hash algorithm metadata (display names, output lengths)
- `lib/id/` - ID generation logic (UUID v4/v7, ULID, NanoID, CUID)
- `lib/string/` - String transformation logic (case conversion, sorting, etc.)
- `lib/random/` - Random value generators (bytes, string, number, shuffle)
- `lib/file.ts` - File utilities (fileToBytes)
- `lib/utils.ts` - Utility functions (`cn()` for conditional class merging)
- `actions/hash.ts` - Server Action for all hash computations (MD5, SHA-1/256/384/512) using Node.js crypto
- `components/ui/` - Base components (Button, Textarea, Card, Tabs) following shadcn/ui pattern
- `components/shared/` - Feature components (CopyButton, FileUpload, HexInput, InputOutputPanel)
- `components/layout/` - Layout components (Header, PageContainer)
- `hooks/` - Custom React hooks (useClipboard)
- `types/index.ts` - Shared TypeScript types

### Configuration

- Server Actions body limit: 5MB (in `next.config.ts`)
- File upload limit: 5MB (in `components/shared/file-upload.tsx`)
- Theme colors defined as CSS variables in `app/globals.css`

### Component Patterns

- Use `cn()` from `lib/utils.ts` for conditional class merging
- All functions must have explicit return types
- UI components support className override via props

## Development Guidelines

- **Keep CLAUDE.md up to date**: Always update this file when making the following changes
  - Adding new features or pages
  - Changing directory structure
  - Introducing new library patterns
  - Modifying commands
  - Changing configuration values (body limit, file size limit, etc.)
- Prioritize existing common components (`components/ui/`, `components/shared/`) for UI work before creating new ones
- Maintain clear separation between UI components (client) and Server Actions (`actions/`) - avoid mixing concerns
