# 📁 shopablock2 - Project Structure

*Generated on: 08/01/2026, 12:48:45*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 57 |
| 📁 Total Folders | 32 |
| 🌳 Max Depth | 5 levels |
| 🛠️ Tech Stack | React, Next.js, TypeScript, CSS, Node.js |

## ⭐ Important Files

- 🟡 🚫 **.gitignore** - Git ignore rules
- 🔴 📖 **README.md** - Project documentation
- 🔵 🔍 **eslint.config.mjs** - ESLint config
- 🟡 ▲ **next.config.ts** - Next.js config
- 🔴 📦 **package.json** - Package configuration
- 🟡 🔷 **tsconfig.json** - TypeScript config

## 📊 File Statistics

### By File Type

- ⚛️ **.tsx** (React TypeScript files): 17 files (29.8%)
- 🔷 **.ts** (TypeScript files): 13 files (22.8%)
- 🎨 **.svg** (SVG images): 5 files (8.8%)
- ⚙️ **.json** (JSON files): 3 files (5.3%)
- 📖 **.md** (Markdown files): 2 files (3.5%)
- 📄 **.db** (Other files): 2 files (3.5%)
- 📄 **.mjs** (Other files): 2 files (3.5%)
- ⚙️ **.yaml** (YAML files): 2 files (3.5%)
- 📄 **.sql** (Other files): 2 files (3.5%)
- 🎨 **.css** (Stylesheets): 2 files (3.5%)
- 🚫 **.gitignore** (Git ignore): 1 files (1.8%)
- 📄 **.txt** (Text files): 1 files (1.8%)
- 📄 **.db-journal** (Other files): 1 files (1.8%)
- ⚙️ **.toml** (TOML files): 1 files (1.8%)
- 📄 **.prisma** (Other files): 1 files (1.8%)
- 🖼️ **.png** (PNG images): 1 files (1.8%)
- 🖼️ **.ico** (Icon files): 1 files (1.8%)

### By Category

- **React**: 17 files (29.8%)
- **TypeScript**: 13 files (22.8%)
- **Other**: 8 files (14.0%)
- **Assets**: 7 files (12.3%)
- **Config**: 6 files (10.5%)
- **Docs**: 3 files (5.3%)
- **Styles**: 2 files (3.5%)
- **DevOps**: 1 files (1.8%)

### 📁 Largest Directories

- **root**: 57 files
- **src**: 29 files
- **src/app**: 20 files
- **prisma**: 6 files
- **public**: 6 files

## 🌳 Directory Structure

```
shopablock2/
├── 🟡 🚫 **.gitignore**
├── 📂 .vercel/
│   ├── ⚙️ project.json
│   └── 📄 README.txt
├── 📄 dev.db
├── 🔵 🔍 **eslint.config.mjs**
├── 🔷 next-env.d.ts
├── 🟡 ▲ **next.config.ts**
├── 🔴 📦 **package.json**
├── ⚙️ pnpm-lock.yaml
├── ⚙️ pnpm-workspace.yaml
├── 📄 postcss.config.mjs
├── 📂 prisma/
│   ├── 📄 dev.db
│   ├── 📄 dev.db-journal
│   ├── 📂 migrations/
│   │   ├── 📂 20260107134830_init_postgres/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260107173054_auth/
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   └── 📄 schema.prisma
├── 📖 project_structure.md
├── 🔷 proxy.ts
├── 🌐 public/
│   ├── 🖼️ blocklogo.png
│   ├── 🎨 file.svg
│   ├── 🎨 globe.svg
│   ├── 🎨 next.svg
│   ├── 🎨 vercel.svg
│   └── 🎨 window.svg
├── 🔴 📖 **README.md**
├── 📁 src/
│   ├── 🚀 app/
│   │   ├── 📂 [handle]/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 🔌 api/
│   │   │   └── 📂 auth/
│   │   │   │   ├── 📂 sign-in/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   │   ├── 📂 sign-out/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   │   └── 📂 sign-up/
│   │   │   │   │   └── 🔷 route.ts
│   │   ├── 🚀 app/
│   │   │   ├── 📂 blocks/
│   │   │   │   └── 📂 [id]/
│   │   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 new/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── 📂 orders/
│   │   │   │   ├── 📂 [id]/
│   │   │   │   │   └── ⚛️ page.tsx
│   │   │   │   └── ⚛️ page.tsx
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── 📂 settings/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 checkout/
│   │   │   └── 📂 [orderId]/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 demo/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 🖼️ favicon.ico
│   │   ├── 🎨 globals.css
│   │   ├── ⚛️ layout.tsx
│   │   ├── ⚛️ page.tsx
│   │   ├── 📂 pricing/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 receipt/
│   │   │   └── 📂 [orderId]/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 sign-in/
│   │   │   └── ⚛️ page.tsx
│   │   └── 📂 sign-up/
│   │   │   └── ⚛️ page.tsx
│   ├── 🧩 components/
│   │   ├── ⚛️ SiteHeader.tsx
│   │   └── ⚛️ ui.tsx
│   ├── 📚 lib/
│   │   ├── 🔷 actions.ts
│   │   ├── 🔷 auth.ts
│   │   ├── 🔷 blocks.ts
│   │   ├── 🔷 db.ts
│   │   └── 🔷 orders.ts
│   ├── 🔷 middleware.ts
│   └── 🎨 styles/
│   │   └── 🎨 tokens.css
├── 🔷 tailwind.config.ts
└── 🟡 🔷 **tsconfig.json**
```

## 📖 Legend

### File Types
- 🚫 DevOps: Git ignore
- 📄 Docs: Text files
- ⚙️ Config: JSON files
- 📖 Docs: Markdown files
- 📄 Other: Other files
- 🔷 TypeScript: TypeScript files
- ⚙️ Config: YAML files
- ⚙️ Config: TOML files
- 🖼️ Assets: PNG images
- 🎨 Assets: SVG images
- ⚛️ React: React TypeScript files
- 🖼️ Assets: Icon files
- 🎨 Styles: Stylesheets

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
