# Phase 9: SPA Navigation & Polish

**Scope:** Frontend only  
**Goal:** Fix navigation bugs caused by React SPA behavior conflicting with the legacy jQuery template, and eliminate all hardcoded URLs.

## Problems Solved

### Problem 1: Header Overlap After Navigation
When navigating from one page to another via React Router `<Link>`, the page content was partially hidden behind the header. Refreshing the page fixed it.

**Root Cause:** The Muka template's `main.js` calculates header height on `window.load` and adjusts page padding accordingly. React SPA navigations don't trigger `window.load`, so the padding calculation never re-runs.

**Solution:** Created `ScrollToTop.jsx` component:
```jsx
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, [pathname]);
  return null;
};
```
- Placed inside `<Router>` in `App.jsx` so it runs on every route change
- Scrolls to top immediately
- Dispatches a fake `resize` event after 100ms, which triggers the template's header recalculation

### Problem 2: Broken Links (404 Errors)
Many components had hardcoded `<a href="blog-right.html">` or `<a href="/post/sample-post">` from the original HTML template. These caused full page reloads or 404 errors in the SPA.

**Solution:** Created `constants/routes.js`:
```js
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROGRAM: '/program',
  RECEIPT: '/receipt',
  CONTACT: '/contact',
  AUTH: '/auth',
  CHIEF_DETAIL: (id) => `/chief/${id}`,
  PROGRAM_DETAIL: (slug) => `/program/${slug}`,
  POST_DETAIL: (slug) => `/post/${slug}`,
  MY_ACCOUNT: '/my-account',
  ADMIN: '/admin',
};
```

Then systematically replaced every hardcoded URL across the entire codebase:
- `App.jsx` — all `<Route path>` definitions
- `ProgramCard.jsx` — card click links
- `BlogCard.jsx` — post links, category links, author links
- `BlogSidebar.jsx` — category list links
- `Receipt.jsx` — featured post links, metadata links
- `siteConfig.js` — sidebar category definitions

All `<a href>` tags for internal links were converted to `<Link to={ROUTES.xxx}>`.

### Problem 3: No 404 Page
Invalid URLs showed a blank page.

**Solution:** Created `NotFound.jsx` with a styled 404 message and registered it at `path="*"` as the last route inside `<PublicLayout>`.

## Files Created
- `frontend/src/components/Shared/ScrollToTop.jsx`
- `frontend/src/constants/routes.js`
- `frontend/src/pages/NotFound.jsx`

## Files Modified
- `frontend/src/App.jsx` — added ScrollToTop, switched to ROUTES constants, added 404 route
- `frontend/src/components/Shared/ProgramCard.jsx` — switched to ROUTES constants
- `frontend/src/components/Blog/BlogCard.jsx` — replaced all `<a href>` with `<Link to={ROUTES.xxx}>`
- `frontend/src/components/Blog/BlogSidebar.jsx` — replaced hardcoded links
- `frontend/src/pages/Receipt.jsx` — replaced all hardcoded links in featured posts section
- `frontend/src/config/siteConfig.js` — imported ROUTES for sidebar category links

## Result
Navigation is now rock-solid. No broken links, no 404 errors from internal navigation, no header overlap when switching pages. The project is ready for production deployment.
