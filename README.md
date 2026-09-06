# ☁️ CloudVault - Secure Cloud Storage & File Sharing Platform

CloudVault is a modern, full-stack cloud file storage, management, and sharing web application built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **Supabase (Auth, PostgreSQL DB, Supabase Storage)**.

Designed with a sleek purple/indigo brand identity matching modern SaaS products.

---

## 🚀 Features Implemented

- **Authentication & Security (`/login`, `/signup`, `/forgot-password`)**:
  - Centered white rounded authentication card matching exact reference screenshot proportions.
  - Vibrant purple/violet background gradient (`from-[#5352ed] via-[#7158e2] to-[#8052EC]`).
  - Squircle gradient logo badge with white cloud glyph.
  - Real form validation, show/hide password toggle, login/signup switching, forgot password flow.
  - Session state persistence & protected dashboard routes.

- **Main Dashboard & Layout (`/dashboard/*`)**:
  - Responsive layout: Desktop (sticky sidebar), Tablet (collapsible drawer), Mobile (compact nav bar).
  - Brand header with global search bar (`Ctrl + K` indicator), notification popover, user menu.
  - Storage quota meter progress bar widget.

- **My Drive & Navigation (`/dashboard/my-drive`)**:
  - Nested folder creation and navigation with breadcrumbs.
  - View modes: Responsive Grid View & List View Table.
  - Sorting: Name (A-Z, Z-A), Date modified, File size.
  - Multi-file drag and drop uploader overlay zone.
  - Floating Upload Progress Manager widget (bottom right) with upload %, success/error status.

- **File Operations**:
  - Open/Preview (Image viewer, Video player, Document details).
  - Instant file download with generated URLs.
  - Inline / Modal item renaming with optimistic UI updates.
  - Folder Tree selector modal for moving files/folders (safely preventing circular parent nesting).
  - Soft delete (move to Trash) & Restore functionality.
  - Favorite / Star toggle.
  - Slide-over Details & Metadata panel with activity timeline.

- **Sharing & Public Share Links (`/share/[token]`)**:
  - User-to-user sharing with Viewer / Editor role permissions and access removal.
  - Public Share Link generation with optional Password Protection and Expiry Date.
  - Recipient public download page (`/share/[token]`) with password unlock challenge and expired link state.

- **Starred, Recent & Trash (`/dashboard/...`)**:
  - Starred view filtering user favorites.
  - Recent Activity timeline logging uploads, folder creation, renaming, moving, and sharing.
  - Trash view with 30-day retention notice, item restoration to original location, and permanent purging.

- **Supabase Integration & Out-of-the-Box Hybrid Layer**:
  - PostgreSQL DB schema script (`supabase/schema.sql`) with tables (`profiles`, `folders`, `files`, `file_versions`, `shares`, `link_shares`, `stars`, `activities`), indexes, RLS policies, and triggers.
  - Seamless hybrid data layer: runs out-of-the-box in local demo state, or connects directly when live Supabase credentials are set in `.env.local`.

---

## 📁 Project Structure

```
cloudvault/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── my-drive/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [...folderId]/page.tsx
│   │   │   │   ├── shared/page.tsx
│   │   │   │   ├── starred/page.tsx
│   │   │   │   ├── recent/page.tsx
│   │   │   │   └── trash/page.tsx
│   │   ├── share/[token]/page.tsx
│   │   ├── api/
│   │   │   ├── auth/ (login, register, logout, me)
│   │   │   ├── folders/
│   │   │   ├── files/ (init, complete, search, stars)
│   │   │   └── shares/
│   │   ├── globals.css
│   │   ├── providers.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/ (LoginForm, SignupForm, ForgotPasswordForm)
│   │   ├── layout/ (Sidebar, Header, StorageMeter, UserMenu, MobileNav)
│   │   ├── files/ (FileGrid, FileList, FileCard, FileRow, FileContextMenu, FileDetailsPanel, FileTypeIcon)
│   │   ├── folders/ (FolderCard, FolderRow, FolderTreeModal, CreateFolderModal)
│   │   ├── upload/ (UploadDropzone, UploadProgressWidget)
│   │   ├── sharing/ (ShareModal)
│   │   └── common/ (Modal, Breadcrumbs, EmptyState, LoadingSkeleton, RenameModal)
│   ├── lib/
│   │   ├── supabase/ (client.ts, server.ts)
│   │   ├── storage.ts
│   │   ├── mockData.ts
│   │   └── utils.ts
│   └── types/index.ts
├── supabase/
│   └── schema.sql
├── .env.example
├── vercel.json
└── package.json
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Supabase Setup & Database Migration

1. Create a free project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. Create a new Storage Bucket named `cloudvault-files` and set it to **Private**.
5. Copy your Project URL and Anon Key into `.env.local`.

---

## 💻 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Deploy CloudVault to Vercel"
   git push origin main
   ```

2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your GitHub repository.
4. Set Framework Preset to **Next.js**.
5. Add your Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
6. Click **Deploy**.
