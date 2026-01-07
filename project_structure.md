# 📁 shopablock2 - Project Structure

*Generated on: 07/01/2026, 13:30:34*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 46 |
| 📁 Total Folders | 23 |
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

- ⚛️ **.tsx** (React TypeScript files): 15 files (32.6%)
- 🔷 **.ts** (TypeScript files): 7 files (15.2%)
- 🎨 **.svg** (SVG images): 5 files (10.9%)
- 📖 **.md** (Markdown files): 2 files (4.3%)
- 📄 **.db** (Other files): 2 files (4.3%)
- 📄 **.mjs** (Other files): 2 files (4.3%)
- ⚙️ **.json** (JSON files): 2 files (4.3%)
- ⚙️ **.yaml** (YAML files): 2 files (4.3%)
- 🎨 **.css** (Stylesheets): 2 files (4.3%)
- 🚫 **.gitignore** (Git ignore): 1 files (2.2%)
- 📄 **.db-journal** (Other files): 1 files (2.2%)
- 📄 **.sql** (Other files): 1 files (2.2%)
- ⚙️ **.toml** (TOML files): 1 files (2.2%)
- 📄 **.prisma** (Other files): 1 files (2.2%)
- 🖼️ **.ico** (Icon files): 1 files (2.2%)
- 📄 **.** (Other files): 1 files (2.2%)

### By Category

- **React**: 15 files (32.6%)
- **Other**: 8 files (17.4%)
- **TypeScript**: 7 files (15.2%)
- **Assets**: 6 files (13.0%)
- **Config**: 5 files (10.9%)
- **Docs**: 2 files (4.3%)
- **Styles**: 2 files (4.3%)
- **DevOps**: 1 files (2.2%)

### 📁 Largest Directories

- **root**: 46 files
- **src**: 23 files
- **src/app**: 16 files
- **src/app/app**: 6 files
- **prisma**: 5 files

## 🌳 Directory Structure

```
shopablock2/
├── 🟡 🚫 **.gitignore**
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
│   │   ├── 📂 20260106182522_init/
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   └── 📄 schema.prisma
├── 📖 project_structure.md
├── 🌐 public/
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
│   │   ├── 📄 r
│   │   └── 📂 receipt/
│   │   │   └── 📂 [orderId]/
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
- 📖 Docs: Markdown files
- 📄 Other: Other files
- 🔷 TypeScript: TypeScript files
- ⚙️ Config: JSON files
- ⚙️ Config: YAML files
- ⚙️ Config: TOML files
- 🎨 Assets: SVG images
- ⚛️ React: React TypeScript files
- 🖼️ Assets: Icon files
- 🎨 Styles: Stylesheets

### Importance Levels
- 🔴 Critical: Essential project files
- 🟡 High: Important configuration files
- 🔵 Medium: Helpful but not essential files
