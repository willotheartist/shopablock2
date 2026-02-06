# 📁 shopablock2 - Project Structure

*Generated on: 06/02/2026, 13:36:03*

## 📋 Quick Overview

| Metric | Value |
|--------|-------|
| 📄 Total Files | 105 |
| 📁 Total Folders | 51 |
| 🌳 Max Depth | 6 levels |
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

- ⚛️ **.tsx** (React TypeScript files): 34 files (32.4%)
- 🖼️ **.png** (PNG images): 23 files (21.9%)
- 🔷 **.ts** (TypeScript files): 20 files (19.0%)
- 🎨 **.svg** (SVG images): 5 files (4.8%)
- 📄 **.sql** (Other files): 4 files (3.8%)
- ⚙️ **.json** (JSON files): 3 files (2.9%)
- 📖 **.md** (Markdown files): 2 files (1.9%)
- 📄 **.db** (Other files): 2 files (1.9%)
- 📄 **.mjs** (Other files): 2 files (1.9%)
- ⚙️ **.yaml** (YAML files): 2 files (1.9%)
- 🎨 **.css** (Stylesheets): 2 files (1.9%)
- 🚫 **.gitignore** (Git ignore): 1 files (1.0%)
- 📄 **.txt** (Text files): 1 files (1.0%)
- 📄 **.db-journal** (Other files): 1 files (1.0%)
- ⚙️ **.toml** (TOML files): 1 files (1.0%)
- 📄 **.prisma** (Other files): 1 files (1.0%)
- 🖼️ **.ico** (Icon files): 1 files (1.0%)

### By Category

- **React**: 34 files (32.4%)
- **Assets**: 29 files (27.6%)
- **TypeScript**: 20 files (19.0%)
- **Other**: 10 files (9.5%)
- **Config**: 6 files (5.7%)
- **Docs**: 3 files (2.9%)
- **Styles**: 2 files (1.9%)
- **DevOps**: 1 files (1.0%)

### 📁 Largest Directories

- **root**: 105 files
- **src**: 53 files
- **src/app**: 31 files
- **public**: 28 files
- **src/components**: 13 files

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
│   │   ├── 📂 20260108150645_add_block_media/
│   │   │   └── 📄 migration.sql
│   │   ├── 📂 20260206113235_add_kompipay/
│   │   │   └── 📄 migration.sql
│   │   └── ⚙️ migration_lock.toml
│   └── 📄 schema.prisma
├── 📖 project_structure.md
├── 🔷 proxy.ts
├── 🌐 public/
│   ├── 🖼️ blocklogo.png
│   ├── 🖼️ Card1.png
│   ├── 🖼️ Card2.png
│   ├── 🖼️ Card3.png
│   ├── 🖼️ Card4.png
│   ├── 🖼️ Card5.png
│   ├── 🖼️ Card6.png
│   ├── 🎨 file.svg
│   ├── 🎨 globe.svg
│   ├── 🎨 next.svg
│   ├── 📂 shopablocks/
│   │   ├── 🖼️ Card1.png
│   │   ├── 🖼️ Card2.png
│   │   ├── 🖼️ Card3.png
│   │   ├── 🖼️ Card4.png
│   │   ├── 🖼️ Card5.png
│   │   └── 🖼️ Card6.png
│   ├── 📂 uploads/
│   │   ├── 🖼️ 346a7334-91df-4644-9e4c-831bf6629065.png
│   │   ├── 🖼️ 6ec25b27-3b49-4606-8213-096ba2242e82.png
│   │   ├── 🖼️ 6f47cf96-3c9c-47c5-b86c-a208151c267b.png
│   │   ├── 🖼️ 7264e916-9b38-487f-9473-207d41d90602.png
│   │   ├── 🖼️ 7b135ffc-cc02-4aff-a32a-ae9749085829.png
│   │   ├── 🖼️ 8ce89270-6c67-40ce-9d23-f12b326171fa.png
│   │   ├── 🖼️ 9f87eaf8-65a3-45d0-85c0-448d3dc41335.png
│   │   ├── 🖼️ a7f96b4f-7545-405e-895e-a7c901e3e085.png
│   │   ├── 📂 cmk5l6tp10001hni9ih4pzueb/
│   │   │   └── 🖼️ 7-mk5l6tqz-v8a8hl.png
│   │   └── 🖼️ f278e628-1a18-4a77-a50e-68e5a0addd6c.png
│   ├── 🎨 vercel.svg
│   └── 🎨 window.svg
├── 🔴 📖 **README.md**
├── 📁 src/
│   ├── 🚀 app/
│   │   ├── 📂 [handle]/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── ⚛️ ProductClient.tsx
│   │   ├── 🔌 api/
│   │   │   ├── 📂 auth/
│   │   │   │   ├── 📂 reset/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   │   ├── 📂 sign-in/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   │   ├── 📂 sign-out/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   │   └── 📂 sign-up/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   ├── 📂 blocks/
│   │   │   │   └── 📂 [id]/
│   │   │   │   │   └── 📂 media/
│   │   │   │   │   │   └── 🔷 route.ts
│   │   │   ├── 📂 checkout/
│   │   │   │   └── 📂 create/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   └── 📂 kompipay/
│   │   │   │   ├── 📂 connect/
│   │   │   │   │   └── 🔷 route.ts
│   │   │   │   └── 📂 webhook/
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
│   │   │   ├── 📂 reset/
│   │   │   │   └── ⚛️ page.tsx
│   │   │   └── 📂 settings/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 checkout/
│   │   │   └── 📂 [orderId]/
│   │   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 demo/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 explore/
│   │   │   ├── ⚛️ ExploreGrid.tsx
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
│   │   ├── 📂 reset/
│   │   │   └── ⚛️ page.tsx
│   │   ├── 📂 sign-in/
│   │   │   ├── ⚛️ page.tsx
│   │   │   └── ⚛️ sign-in-error-cleaner.tsx
│   │   └── 📂 sign-up/
│   │   │   └── ⚛️ page.tsx
│   ├── 🧩 components/
│   │   ├── ⚛️ BlockMediaUploader.tsx
│   │   ├── 📂 explore/
│   │   │   └── ⚛️ ExploreGrid.tsx
│   │   ├── 📂 home/
│   │   │   ├── ⚛️ aha.tsx
│   │   │   ├── ⚛️ categories.tsx
│   │   │   ├── ⚛️ faqs.tsx
│   │   │   ├── ⚛️ HowItWorksEditorial.tsx
│   │   │   ├── ⚛️ shopablocks.tsx
│   │   │   ├── ⚛️ stacks.tsx
│   │   │   └── ⚛️ testimonials.tsx
│   │   ├── ⚛️ SiteFooter.tsx
│   │   ├── ⚛️ SiteHeader.tsx
│   │   ├── ⚛️ SiteHeaderClient.tsx
│   │   └── ⚛️ ui.tsx
│   ├── 📚 lib/
│   │   ├── 🔷 actions.ts
│   │   ├── 🔷 auth.ts
│   │   ├── 🔷 blocks.ts
│   │   ├── 🔷 db.ts
│   │   ├── 🔷 kompipay.ts
│   │   ├── 🔷 orders.ts
│   │   └── 🔷 uploads.ts
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
