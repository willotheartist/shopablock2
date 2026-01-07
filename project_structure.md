# 📁 shopablock2 - Project Structure

*Generated on: 07/01/2026, 14:58:37*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 52 |
| 📁 Total Folders | 28 |
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

- ⚛️ **.tsx** (React TypeScript files): 17 files (32.7%)
- 🔷 **.ts** (TypeScript files): 9 files (17.3%)
- 🎨 **.svg** (SVG images): 5 files (9.6%)
- ⚙️ **.json** (JSON files): 3 files (5.8%)
- 📖 **.md** (Markdown files): 2 files (3.8%)
- 📄 **.db** (Other files): 2 files (3.8%)
- 📄 **.mjs** (Other files): 2 files (3.8%)
- ⚙️ **.yaml** (YAML files): 2 files (3.8%)
- 🎨 **.css** (Stylesheets): 2 files (3.8%)
- 🚫 **.gitignore** (Git ignore): 1 files (1.9%)
- 📄 **.txt** (Text files): 1 files (1.9%)
- 📄 **.db-journal** (Other files): 1 files (1.9%)
- 📄 **.sql** (Other files): 1 files (1.9%)
- ⚙️ **.toml** (TOML files): 1 files (1.9%)
- 📄 **.prisma** (Other files): 1 files (1.9%)
- 🖼️ **.png** (PNG images): 1 files (1.9%)
- 🖼️ **.ico** (Icon files): 1 files (1.9%)

### By Category

- **React**: 17 files (32.7%)
- **TypeScript**: 9 files (17.3%)
- **Other**: 7 files (13.5%)
- **Assets**: 7 files (13.5%)
- **Config**: 6 files (11.5%)
- **Docs**: 3 files (5.8%)
- **Styles**: 2 files (3.8%)
- **DevOps**: 1 files (1.9%)

### 📁 Largest Directories

- **root**: 52 files
- **src**: 24 files
- **src/app**: 17 files
- **public**: 6 files
- **src/app/app**: 6 files

## 🌳 Directory Structure

```
shopablock2/
├── 🟡 🚫 **.gitignore**
├── 📂 .vercel/
│   ├── ⚙️ project.json
│   └── 📄 README.txt
├── 📄 dev.db
├── 🔵 🔍 **eslint.config.mjs**
├── 🔷 middleware.ts
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
│   │   │   └── 📂 [[...sign-up]]/
│   │   │   │   └── ⚛️ page.tsx
│   │   └── 📂 sign-up/
│   │   │   └── 📂 [[...sign-up]]/
│   │   │   │   └── ⚛️ page.tsx
│   ├── 🧩 components/
│   │   ├── ⚛️ SiteHeader.tsx
│   │   └── ⚛️ ui.tsx
│   ├── 📚 lib/
│   │   ├── 🔷 actions.ts
│   │   ├── 🔷 blocks.ts
│   │   ├── 🔷 db.ts
│   │   └── 🔷 orders.ts
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
