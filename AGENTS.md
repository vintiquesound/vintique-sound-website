# AGENTS.md

## Build Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm preview` - Preview production build
- No test framework configured

## Code Style Guidelines

### Imports & Formatting
- Use 2-space indentation (EditorConfig)
- Import React components: `import * as React from "react"`
- Use absolute imports with `@/` alias for src directory
- Group imports: external libraries first, then internal components

### TypeScript & Types
- Strict TypeScript enabled (`astro/tsconfigs/strictest`)
- Use React component props with proper typing
- Export variant types from UI components
- Use `VariantProps<typeof buttonVariants>` pattern

### Naming Conventions  
- Components: PascalCase (Button, HeaderNavMenu)
- Files: kebab-case for pages, PascalCase for components
- Functions: camelCase (cn, slugifyTag)
- CSS classes: Tailwind utility classes

### UI Components
- Use Radix UI primitives with custom variants
- Follow class-variance-authority (cva) pattern for component variants
- Use `cn()` utility for conditional class merging
- Components accept `className` prop for customization
- Keep `src/components/ui/` for foundational primitives/building blocks
- Keep `src/components/ui/card/` for card composition primitives only (`Card*` parts)
- Keep `src/components/cards/` for composed/domain-specific card components
- Organize `src/components/ui/` by primitive families when helpful:
	- `ui/form/` for form primitives (Input/Label/TextArea/Field)
	- `ui/navigation/` for navigation/dropdown primitives used by nav UI

### Astro Files
- Use frontmatter dashes (`---`) for script sections
- Import React components with `client:load` when needed
- Use Fragment slots for component composition