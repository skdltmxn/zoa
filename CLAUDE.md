# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev      # Start development server at http://localhost:3000
pnpm build    # Production build
pnpm lint     # Run ESLint
```

## Architecture

**zoa** is a web utility toolkit (encoding/decoding, hashing) built with Next.js 16 App Router. Dark pastel theme, no light mode.

### Key Directories

- `lib/encoder/` - Encoding logic (base64, url, hex). Each algorithm in separate file, unified export via `index.ts`
- `lib/hash/` - Hash algorithm metadata (display names, output lengths)
- `lib/file.ts` - File utilities (fileToBytes)
- `actions/hash.ts` - Server Action for all hash computations (MD5, SHA-1/256/384/512) using Node.js crypto
- `components/ui/` - Base components (Button, Textarea, Card, Tabs) following shadcn/ui pattern
- `components/shared/` - Feature components (CopyButton, FileUpload, HexInput, InputOutputPanel)
- `types/index.ts` - Shared TypeScript types

### Adding New Encoder

1. Create `lib/encoder/[algorithm].ts` with encode/decode functions returning `EncoderResult`
2. Add algorithm to `EncoderAlgorithm` type in `types/index.ts`
3. Add cases to `encode()`/`decode()` switch in `lib/encoder/index.ts`
4. Add tab in `app/encoder/page.tsx`

### Adding New Hash Algorithm

1. Add to `actions/hash.ts` - all hashing uses Server Actions with Node.js crypto
2. Update `ALGORITHM_MAP` and algorithm list in `computeAllHashes()`

### Configuration

- Server Actions body limit: 5MB (in `next.config.ts`)
- File upload limit: 5MB (in `components/shared/file-upload.tsx`)
- Theme colors defined as CSS variables in `app/globals.css`

### Component Patterns

- Use `cn()` from `lib/utils.ts` for conditional class merging
- All functions must have explicit return types
- UI components support className override via props

## Development Guidelines

- Update this file (CLAUDE.md) when changes affect architecture, commands, or development workflows
- Prioritize existing common components (`components/ui/`, `components/shared/`) for UI work before creating new ones
- Maintain clear separation between UI components (client) and Server Actions (`actions/`) - avoid mixing concerns
