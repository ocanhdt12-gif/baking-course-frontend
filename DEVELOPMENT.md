# 🛠️ Development Guide

How to work with baking-course-frontend project.

---

## 📦 Prerequisites

- **Node.js**: v16 or higher (check: `node --version`)
- **npm**: v7 or higher (check: `npm --version`)
- **Git**: For version control
- **Code Editor**: VS Code recommended

---

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/ocanhdt12-gif/baking-course-frontend.git
cd baking-course-frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- React 18
- Vite (build tool)
- React Router v6
- Bootstrap 5
- SCSS support
- Axios (HTTP client)
- And all other dependencies listed in package.json

### 3. Start Development Server

```bash
npm run dev
```

**Output:**
```
  VITE v4.x.x ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open browser and go to: **http://localhost:5173**

### 4. Start Editing!

- Edit files in `src/` folder
- Browser auto-refreshes (Hot Module Replacement)
- Check browser console for errors
- Enjoy!

---

## 📁 File Organization

### Pages
All page components in `src/pages/`:
```
src/pages/
├── Home.jsx          # Homepage (main entry)
├── About.jsx         # About page (placeholder)
├── Shop.jsx          # Shop listing (placeholder)
├── Contact.jsx       # Contact page (placeholder)
└── ...
```

**To add a new page:**
1. Create `src/pages/MyPage.jsx`
2. Write React component
3. Import in routing (Phase 2)

### Components
Reusable components in `src/components/`:
```
src/components/
├── Layout/           # Page layouts
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── MainLayout.jsx
├── Navigation/       # Navigation components
│   └── TopNav.jsx
├── UI/              # Basic UI (Phase 2)
│   ├── Button.jsx
│   ├── Card.jsx
│   └── ...
└── Sections/        # Feature sections (Phase 2)
    ├── Hero.jsx
    ├── Features.jsx
    └── ...
```

**To add a new component:**
1. Create `src/components/MyComponent/MyComponent.jsx`
2. Create `src/components/MyComponent/MyComponent.scss` (if styled)
3. Add props documentation in file comments
4. Export from parent index.js (optional)

### Styles
Global styles in `src/styles/`:
```
src/styles/
├── variables.scss       # Color, spacing, typography vars
├── globals.scss         # Global styles
└── animations.scss      # Animation definitions
```

**Component-specific styles:**
```
src/components/Button/Button.jsx
src/components/Button/Button.scss   # Component-scoped styles
```

---

## 💻 Development Workflow

### Typical Day

```bash
# 1. Start server
npm run dev

# 2. Edit files (auto-refresh in browser)
# - Create new component
# - Or modify existing page
# - Save file → browser updates instantly

# 3. Test locally
# - Open http://localhost:5173
# - Interact with UI
# - Check console for errors

# 4. Commit changes
git add .
git commit -m "feat: describe what you did"

# 5. Push to GitHub
git push origin master
```

---

## 🔄 Git Workflow

### Making a Change

```bash
# 1. Create/edit files
# ... (make your changes)

# 2. Check status
git status

# 3. Stage changes
git add .

# 4. Commit with clear message
git commit -m "feat: add new component

- Added Button component with variants
- Updated Home.jsx to use Button
- Added corresponding styles"

# 5. Push to GitHub
git push origin master
```

### Commit Message Format

```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code restructuring
- `style:` Formatting/styling only
- `docs:` Documentation
- `test:` Tests
- `perf:` Performance improvement
- `chore:` Maintenance

**Examples:**
```
feat: add button component with primary/secondary variants

fix: hero slider images not loading on mobile

refactor: extract CardComponent from Home.jsx

docs: update README with Phase 2 plan
```

---

## 🔨 Common Tasks

### Add a New Page

```bash
# 1. Create file
touch src/pages/MyPage.jsx

# 2. Create component
cat > src/pages/MyPage.jsx << 'EOF'
import React from 'react';

function MyPage() {
  return (
    <div className="my-page">
      <h1>My Page</h1>
      <p>Content here</p>
    </div>
  );
}

export default MyPage;
EOF

# 3. Update routing (Phase 2 - when App.jsx has Routes)
# 4. Test: http://localhost:5173/mypage
```

### Add a New Component

```bash
# 1. Create component directory
mkdir src/components/MyComponent

# 2. Create component file
touch src/components/MyComponent/MyComponent.jsx
touch src/components/MyComponent/MyComponent.scss

# 3. Add JSX
cat > src/components/MyComponent/MyComponent.jsx << 'EOF'
import React from 'react';
import './MyComponent.scss';

/**
 * MyComponent - Description
 * @param {string} title - Component title
 * @param {string} variant - 'primary' | 'secondary'
 */
function MyComponent({ title, variant = 'primary' }) {
  return (
    <div className={`my-component ${variant}`}>
      <h3>{title}</h3>
    </div>
  );
}

export default MyComponent;
EOF

# 4. Add SCSS
cat > src/components/MyComponent/MyComponent.scss << 'EOF'
.my-component {
  padding: 20px;
  
  &.primary {
    background: #ff6b35;
    color: white;
  }
  
  &.secondary {
    background: #f0f0f0;
    color: #333;
  }
}
EOF

# 5. Use in Home.jsx or other components
# import MyComponent from '../components/MyComponent/MyComponent';
```

### Update Styles

**Global styles:**
```scss
// src/styles/globals.scss
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

**Component styles:**
```scss
// src/components/Button/Button.scss
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &.primary {
    background: $primary-color;
    color: white;
  }
}
```

### Use Variables

```scss
// In any .scss file, these are available:
$primary-color: #ff6b35;
$secondary-color: #f7931e;
$spacing-md: 16px;
$font-size-h1: 48px;

.my-component {
  background: $primary-color;
  padding: $spacing-md;
  font-size: $font-size-h1;
}
```

---

## 🐛 Debugging

### Browser Console

1. Open Developer Tools: `F12` or `Ctrl+Shift+I`
2. Go to **Console** tab
3. Errors/warnings show here
4. Use `console.log()` in your code to debug

### Common Errors

#### "Cannot find module 'xyz'"
```
Solution: Check import path, make sure file exists
// Wrong:
import Button from '../Button.jsx'

// Right:
import Button from '../components/Button/Button';
```

#### "props is undefined"
```
Solution: Pass props to component
// Wrong:
<MyComponent /> {/* no props passed */}

// Right:
<MyComponent title="Hello" />
```

#### Images not loading
```
Solution: Check image path in public/
// Right:
<img src="/images/logo.png" alt="logo" />

// Images are served from public/ automatically
```

---

## 🧪 Testing Locally

### Desktop
1. Open http://localhost:5173
2. Open DevTools (F12)
3. Test all interactions
4. Check console for errors
5. Test all screen sizes

### Mobile
```bash
# Get your local IP
ifconfig | grep inet

# On mobile phone, open:
http://<your-ip>:5173

# Test touch interactions
```

### Different Browsers
- Chrome/Edge (Chromium-based)
- Firefox
- Safari (macOS/iOS)

---

## 📊 Performance

### Check Build Size

```bash
npm run build
# Check dist/ folder size
ls -lh dist/
```

### Lighthouse Audit

1. Build: `npm run build`
2. Run: `npm run preview`
3. Open DevTools
4. Go to **Lighthouse** tab
5. Run audit
6. Check performance score

---

## 🚀 Building for Production

### Create Production Build

```bash
npm run build
```

**Output:**
```
dist/
├── index.html       (optimized)
├── assets/
│   ├── index-xxx.js  (minified)
│   └── index-xxx.css (minified)
```

### Preview Build

```bash
npm run preview
```

Runs locally at http://localhost:4173

---

## 📝 Writing Code

### Component Template

```jsx
import React from 'react';
import './MyComponent.scss';

/**
 * MyComponent - Brief description
 * 
 * @param {string} title - Component title
 * @param {boolean} active - Active state
 * @param {function} onClick - Click handler
 * @returns {JSX}
 */
function MyComponent({ title, active = false, onClick }) {
  return (
    <div className={`my-component ${active ? 'active' : ''}`}>
      <h3>{title}</h3>
      <button onClick={onClick}>Click me</button>
    </div>
  );
}

export default MyComponent;
```

### Best Practices

1. **Always add prop documentation** - JSDoc comments help others understand your component
2. **Use consistent naming** - `MyComponent`, `my-component.scss`
3. **Small components** - Each component should do one thing
4. **Reuse existing CSS** - Use template classes when possible
5. **Test manually** - Click around, check console
6. **Commit often** - Small, focused commits are easier to review

---

## 🆘 Getting Help

### Check Documentation
- `README.md` - Project overview
- `PROJECT_STATUS.md` - Current progress
- Code comments - In your files

### Common Issues

**Port already in use:**
```bash
# Find process using port 5173
lsof -i :5173

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

**Module not found:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Hot reload not working:**
```bash
# Restart dev server
# Press Ctrl+C to stop
# Run: npm run dev
```

---

## 📞 Questions?

Contact project lead or check GitHub issues.

---

**Happy developing! 🚀**
