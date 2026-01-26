# zoa Technical Specification

## 1. Project Overview

**zoa** is a web-based utility toolkit that provides encoding/decoding and hashing functions commonly used by developers and general users. When possible, processing is performed client-side (Web Crypto API), and unsupported algorithms are handled server-side (Node.js crypto module).

### 1.1 Core Values

- **Privacy**: Process in browser when possible; no data storage even during server-side processing
- **Simplicity**: Intuitive UI for immediate use
- **Extensibility**: Architecture that facilitates adding new utilities

---

## 2. Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| UI Library | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Component | shadcn/ui pattern | - |

### 2.1 Runtime Environment

- **Execution**: Hybrid (Client + Server Actions)
- **Browser Support**: Latest Chrome, Firefox, Safari, Edge
- **Node.js**: v24 or higher (for server-side hash processing)

---

## 3. Directory Structure

```
zoa/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage (feature list)
│   ├── globals.css               # Global styles (Tailwind)
│   ├── encoder/                  # Encoder/Decoder page
│   │   └── page.tsx
│   └── hash/                     # Hash page
│       └── page.tsx
├── components/                   # Shared components
│   ├── ui/                       # shadcn/ui based base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── layout/                   # Layout related components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── page-container.tsx
│   └── shared/                   # Feature-specific shared components
│       ├── input-output-panel.tsx
│       ├── file-upload.tsx
│       ├── hex-input.tsx
│       └── copy-button.tsx
├── actions/                      # Server Actions
│   └── hash.ts                   # Server-side hash processing (Node.js crypto)
├── lib/                          # Utilities and helpers
│   ├── utils.ts                  # Common utilities (cn function, etc.)
│   ├── encoder/                  # Encoding/decoding logic
│   │   ├── base64.ts
│   │   └── url.ts
│   └── hash/                     # Hash logic
│       ├── client.ts             # Client-side hash (Web Crypto API)
│       ├── algorithms.ts         # Algorithm metadata
│       └── index.ts
├── hooks/                        # Custom React hooks
│   └── use-clipboard.ts
├── types/                        # TypeScript type definitions
│   └── index.ts
├── docs/                         # Documentation
│   └── spec.md
└── public/                       # Static files
```

---

## 4. Core Feature Specifications

### 4.1 Encoder/Decoder

**Route**: `/encoder`

#### 4.1.1 Supported Algorithms

| Algorithm | Encode | Decode | Description |
|-----------|--------|--------|-------------|
| Base64 | O | O | RFC 4648 standard Base64 |
| URL Encode | O | O | RFC 3986 percent encoding |

#### 4.1.2 Functional Requirements

- **Bidirectional conversion**: Provide encoding/decoding in a single interface
- **Real-time conversion**: Display results immediately on input (200ms debounce recommended)
- **Copy function**: One-click result copy
- **Input limit**: Maximum 1MB (for performance)

#### 4.1.3 UI Layout

```
┌─────────────────────────────────────────────┐
│  [Base64] [URL Encode]        (tab selection)│
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐    │
│  │ Input                          [Copy]│    │
│  │                                      │    │
│  │ (textarea)                          │    │
│  │                                      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│        [Encode ↓]    [Decode ↑]             │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Output                         [Copy]│    │
│  │                                      │    │
│  │ (textarea, readonly)                │    │
│  │                                      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

### 4.2 Hash

**Route**: `/hash`

#### 4.2.1 Supported Algorithms

| Algorithm | Output Length | Implementation |
|-----------|---------------|----------------|
| MD5 | 128-bit (32 hex chars) | Server Action (Node.js crypto) |
| SHA-1 | 160-bit (40 hex chars) | Web Crypto API (client) |
| SHA-256 | 256-bit (64 hex chars) | Web Crypto API (client) |
| SHA-384 | 384-bit (96 hex chars) | Web Crypto API (client) |
| SHA-512 | 512-bit (128 hex chars) | Web Crypto API (client) |

#### 4.2.1.1 Implementation Selection Criteria

- **Web Crypto API supported algorithms**: Process directly on client (SHA series)
- **Web Crypto API unsupported algorithms**: Use Node.js crypto module via Server Action (MD5, etc.)

> **Note**: Future hash algorithms follow the same criteria. First check Web Crypto API support; if unsupported, implement via Server Action.

#### 4.2.2 Input Formats

| Input Type | Description | Max Size |
|------------|-------------|----------|
| String | Direct UTF-8 text input | 10MB |
| File | Drag-and-drop or file selection | 10MB |
| Hex | Hexadecimal string (spaces allowed) | 10MB |

#### 4.2.3 Functional Requirements

- **Multiple algorithm output**: Display all hash results at once
- **Large file support**: Memory efficiency via FileReader + chunked hashing
- **Progress display**: Show progress bar for large file processing
- **Result format**: lowercase hex (uppercase option supported)

#### 4.2.4 UI Layout

```
┌─────────────────────────────────────────────┐
│  Input Type: [String] [File] [Hex]          │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐    │
│  │ (input area - changes by type)       │    │
│  │                                      │    │
│  │ String: textarea                    │    │
│  │ File: dropzone + file info          │    │
│  │ Hex: textarea with validation       │    │
│  │                                      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│              [Generate Hash]                │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ Results                              │    │
│  │                                      │    │
│  │ MD5:    abc123...              [Copy]│    │
│  │ SHA-1:  def456...              [Copy]│    │
│  │ SHA-256: 789abc...             [Copy]│    │
│  │ SHA-384: ...                   [Copy]│    │
│  │ SHA-512: ...                   [Copy]│    │
│  │                                      │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

---

## 5. UI/UX Guidelines

### 5.1 Theme

**Dark mode only** - Light mode is not supported

#### 5.1.1 Color Palette

All colors use **pastel tones** to reduce eye strain.

```css
:root {
  /* Background */
  --bg-primary: #1a1b26;      /* Main background (dark navy) */
  --bg-secondary: #24283b;    /* Card/panel background */
  --bg-tertiary: #414868;     /* Hover/focus background */

  /* Text */
  --text-primary: #c0caf5;    /* Primary text (pastel blue) */
  --text-secondary: #9aa5ce;  /* Secondary text */
  --text-muted: #565f89;      /* Disabled text */

  /* Accent */
  --accent-primary: #7aa2f7;  /* Primary accent (pastel blue) */
  --accent-success: #9ece6a;  /* Success (pastel green) */
  --accent-warning: #e0af68;  /* Warning (pastel yellow) */
  --accent-error: #f7768e;    /* Error (pastel pink) */

  /* Border */
  --border-default: #3b4261;  /* Default border */
  --border-focus: #7aa2f7;    /* Focus border */
}
```

### 5.2 Typography

- **Font family**: System font stack (sans-serif)
- **Monospace**: Use monospace font for hash/encoding results
- **Font size**: Base 16px, scale ratio 1.25

### 5.3 Component Style Rules

#### 5.3.1 Buttons

```tsx
// Primary button
className="bg-accent-primary/20 text-accent-primary border border-accent-primary/30
           hover:bg-accent-primary/30 transition-colors rounded-lg px-4 py-2"

// Secondary button
className="bg-bg-secondary text-text-secondary border border-border-default
           hover:bg-bg-tertiary transition-colors rounded-lg px-4 py-2"
```

#### 5.3.2 Input Fields

```tsx
className="bg-bg-secondary border border-border-default rounded-lg px-4 py-3
           text-text-primary placeholder:text-text-muted
           focus:border-border-focus focus:ring-1 focus:ring-border-focus
           transition-colors outline-none"
```

#### 5.3.3 Cards

```tsx
className="bg-bg-secondary border border-border-default rounded-xl p-6
           shadow-lg shadow-black/20"
```

### 5.4 Responsive Design

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, full width |
| Tablet | 640px - 1024px | Max width constrained |
| Desktop | > 1024px | Centered, max-width: 1200px |

### 5.5 Animation

- **Duration**: 150ms - 300ms
- **Easing**: ease-out or ease-in-out
- **Targets**: Apply only to hover, focus, state changes
- **Principle**: Avoid excessive animation; use only for functional feedback

---

## 6. Component Architecture

### 6.1 shadcn/ui Pattern Principles

All UI components follow these principles:

1. **Copy-and-modify**: Own the component source directly
2. **Composable**: Separate into small units, combine as needed
3. **Style overridable**: Extend via className prop

### 6.2 Common Component List

#### 6.2.1 Base UI Components (`components/ui/`)

| Component | File | Description |
|-----------|------|-------------|
| Button | `button.tsx` | Button (variant: primary, secondary, ghost) |
| Input | `input.tsx` | Text input field |
| Textarea | `textarea.tsx` | Multiline text input |
| Select | `select.tsx` | Dropdown selection |
| Card | `card.tsx` | Container card |
| Tabs | `tabs.tsx` | Tab navigation |
| Badge | `badge.tsx` | Label/tag |
| Tooltip | `tooltip.tsx` | Tooltip |

#### 6.2.2 Shared Components (`components/shared/`)

| Component | File | Description |
|-----------|------|-------------|
| InputOutputPanel | `input-output-panel.tsx` | Input/output area layout |
| FileUpload | `file-upload.tsx` | File upload (drag-and-drop) |
| HexInput | `hex-input.tsx` | Hex value input (with validation) |
| CopyButton | `copy-button.tsx` | Clipboard copy button |
| ProgressBar | `progress-bar.tsx` | Progress indicator |

### 6.3 Component Implementation Pattern

```tsx
// components/ui/button.tsx example
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          // variant styles
          variant === 'primary' && 'bg-accent-primary/20 text-accent-primary ...',
          variant === 'secondary' && 'bg-bg-secondary text-text-secondary ...',
          // size styles
          size === 'sm' && 'px-3 py-1.5 text-sm',
          size === 'md' && 'px-4 py-2 text-base',
          // custom className
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
```

---

## 7. Data Flow

### 7.1 State Management

- **Scope**: Page-level local state (useState)
- **Global state**: Not needed (each page is independent)
- **URL state**: None (bookmark/sharing not required)

### 7.2 Processing Flow Example: Hash

```
[User Input]
     │
     ▼
[Input Validation]
     │
     ├─ Failure → [Display Error Message]
     │
     ▼
[Prepare Input Data]
     │
     ├─ String → Pass as-is
     ├─ File → Convert to ArrayBuffer (FileReader)
     └─ Hex → Convert to Uint8Array
     │
     ▼
[Branch by Algorithm]
     │
     ├─ Web Crypto API supported (SHA series)
     │   │
     │   ▼
     │   [Call crypto.subtle.digest() on client]
     │
     └─ Web Crypto API unsupported (MD5, etc.)
         │
         ▼
         [Call Server Action]
             │
             ▼
         [Process with Node.js crypto.createHash()]
             │
             ▼
         [Return result]
     │
     ▼
[Consolidate results as Hex String]
     │
     ▼
[Display Results]
```

### 7.3 Server Action Implementation Pattern

```typescript
// actions/hash.ts
'use server'

import { createHash } from 'crypto'

export async function computeHash(
  algorithm: string,
  data: string | ArrayBuffer
): Promise<string> {
  const hash = createHash(algorithm)

  if (typeof data === 'string') {
    hash.update(data, 'utf8')
  } else {
    hash.update(Buffer.from(data))
  }

  return hash.digest('hex')
}
```

---

## 8. Implementation Guidelines

### 8.1 Adding New Features Procedure

1. Implement pure logic in `lib/` directory (without UI dependencies)
2. Check if required common components exist in `components/`
3. If not, review if it can be extracted as a common component
4. Implement page in `app/[feature]/page.tsx`
5. Add navigation link to homepage

### 8.2 Code Quality Standards

#### 8.2.1 TypeScript

- `strict` mode required
- No `any` usage (document reason if unavoidable)
- Explicit return types for all functions

#### 8.2.2 Error Handling

```tsx
// Bad example
try {
  const result = encode(input)
  setOutput(result)
} catch {
  // Swallowing error
}

// Good example
try {
  const result = encode(input)
  setOutput(result)
  setError(null)
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  setError(message)
  setOutput('')
}
```

#### 8.2.3 Performance

- **Debounce**: Apply 200ms debounce for real-time input processing
- **Memoization**: Use useMemo for expensive computations
- **Chunked Processing**: Process large files in chunks

### 8.3 Accessibility

- Support keyboard navigation for all interactive elements
- Use appropriate ARIA labels
- Ensure sufficient color contrast (WCAG 2.1 AA standard)

---

## 9. Testing Strategy

### 9.1 Test Coverage

| Target | Test Type | Priority |
|--------|-----------|----------|
| `lib/` pure functions | Unit tests | High |
| Component interactions | Integration tests | Medium |
| E2E user scenarios | E2E tests | Low |

### 9.2 Test Case Examples

```typescript
// lib/encoder/base64.test.ts
describe('Base64', () => {
  describe('encode', () => {
    it('should encode ASCII string', () => {
      expect(encodeBase64('Hello')).toBe('SGVsbG8=')
    })

    it('should encode UTF-8 string', () => {
      expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=')
    })

    it('should handle empty string', () => {
      expect(encodeBase64('')).toBe('')
    })
  })

  describe('decode', () => {
    it('should decode valid Base64', () => {
      expect(decodeBase64('SGVsbG8=')).toBe('Hello')
    })

    it('should throw on invalid Base64', () => {
      expect(() => decodeBase64('!!invalid!!')).toThrow()
    })
  })
})
```

---

## 10. Future Extension Considerations

Follow these guidelines when extending:

### 10.1 Adding New Encoding/Decoding

1. Implement logic in `lib/encoder/[algorithm].ts`
2. Export from `lib/encoder/index.ts`
3. Add tab to Encoder page

### 10.2 Adding New Hash Algorithms

1. Check Web Crypto API support
2. **If supported**:
   - Add client logic to `lib/hash/client.ts`
3. **If not supported**:
   - Add Node.js crypto based Server Action to `actions/hash.ts`
4. Register algorithm metadata in `lib/hash/algorithms.ts`
5. Automatically included in results display

### 10.3 Adding New Utility Categories

1. Create `app/[feature]/page.tsx`
2. Create `lib/[feature]/` directory
3. Add to homepage navigation
4. Extract common components if needed

---

## Appendix A: Library and API Recommendations

| Purpose | Library/API | Notes |
|---------|-------------|-------|
| Client hash (SHA) | Web Crypto API | Browser built-in, no installation required |
| Server hash (MD5, etc.) | Node.js `crypto` module | Built-in module, no installation required |
| Class merging | `clsx` + `tailwind-merge` | For cn() utility |
| Icons | `lucide-react` | Consistent icon style |

---

## Appendix B: References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Node.js crypto module](https://nodejs.org/api/crypto.html)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

---

*This document serves as the technical standard for the zoa project. All AI Agents and developers must follow this specification to maintain consistent code quality.*
