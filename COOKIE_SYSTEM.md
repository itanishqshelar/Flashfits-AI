# Cookie Consent & User Tracking System

This documentation explains how the cookie consent and user tracking system works in the Flashfits application.

## Features

### 1. **Cookie Consent Banner**

- Appears on first visit to the website
- Allows users to:
  - Accept all cookies
  - Reject all cookies (only necessary cookies)
  - Customize cookie preferences

### 2. **Cookie Settings Dialog**

- Accessible from the footer "Cookie Settings" button
- Three categories of cookies:
  - **Necessary Cookies** (always enabled): Essential for website functionality
  - **Analytics Cookies**: Track user behavior and page views
  - **Marketing Cookies**: For advertising and retargeting

### 3. **User History Tracking**

When analytics cookies are enabled, the system tracks:

- Page views (URL, title, timestamp)
- Product views (product ID, name, timestamp)
- Search queries
- Visit count and last visit time

## Implementation

### Components

#### `CookieConsentContext`

Location: `contexts/cookie-consent-context.tsx`

Manages the cookie consent state across the application.

#### `CookieConsentBanner`

Location: `components/cookie-consent-banner.tsx`

The banner that appears at the bottom of the screen for first-time visitors.

#### `CookieSettingsDialog`

Location: `components/cookie-settings-dialog.tsx`

Modal dialog for customizing cookie preferences.

### Tracking Functions

Location: `lib/tracking.ts`

Available functions:

```typescript
// Track page view
trackPageView(url: string, title: string)

// Track product view
trackProductView(productId: string, productName: string)

// Track search query
trackSearch(query: string)

// Get user history
getUserHistory(): UserHistory

// Get recently viewed pages
getRecentPages(limit?: number): PageView[]

// Get viewed products
getViewedProducts(): ProductView[]

// Get search history
getSearchHistory(): SearchQuery[]

// Clear all user history
clearUserHistory()
```

### Custom Hook

Location: `lib/hooks/use-page-tracking.ts`

```typescript
import { usePageTracking } from "@/lib/hooks/use-page-tracking";

// Use in any client component to auto-track page views
function MyComponent() {
  usePageTracking();
  // ...
}
```

## Usage Examples

### Accessing Cookie Consent State

```typescript
import { useCookieConsent } from "@/contexts/cookie-consent-context";

function MyComponent() {
  const { hasConsent, preferences, openSettings } = useCookieConsent();

  // Check if user has given consent
  if (hasConsent && preferences.analytics) {
    // Track something
  }

  // Open cookie settings
  const handleOpenSettings = () => {
    openSettings();
  };
}
```

### Track Product Views

```typescript
import { trackProductView } from "@/lib/tracking";

// In product detail page
useEffect(() => {
  if (product) {
    trackProductView(product.id, product.name);
  }
}, [product]);
```

### Track Search

```typescript
import { trackSearch } from "@/lib/tracking";

const handleSearch = (query: string) => {
  trackSearch(query);
  // ... perform search
};
```

### Get User's Viewing History

```typescript
import { getRecentPages, getViewedProducts } from "@/lib/tracking";

const recentPages = getRecentPages(10); // Get last 10 pages
const viewedProducts = getViewedProducts(); // Get all viewed products
```

## Cookie Storage

The system uses the following cookies:

| Cookie Name                    | Purpose                               | Expiry   |
| ------------------------------ | ------------------------------------- | -------- |
| `flashfits_cookie_consent`     | Stores whether user has given consent | 365 days |
| `flashfits_cookie_preferences` | Stores user's cookie preferences      | 365 days |
| `flashfits_user_history`       | Stores browsing history               | 30 days  |
| `flashfits_viewed_products`    | Stores viewed products                | 30 days  |
| `flashfits_search_history`     | Stores search queries                 | 30 days  |

## Privacy Compliance

- **GDPR Compliant**: Users can accept/reject cookies and modify preferences
- **Default**: No tracking until user gives consent
- **Necessary cookies only**: Essential cookies are always enabled
- **User control**: Users can change preferences at any time via footer link
- **Data retention**: History data expires after 30 days
- **Transparency**: Clear description of each cookie category

## Customization

### Modify Cookie Categories

Edit `components/cookie-settings-dialog.tsx`:

```typescript
const cookieCategories = [
  {
    id: "necessary",
    icon: Shield,
    title: "Necessary Cookies",
    description: "...",
    required: true, // Cannot be disabled
  },
  // Add more categories...
];
```

### Change Expiry Times

Edit `lib/tracking.ts`:

```typescript
const COOKIE_EXPIRY_DAYS = 30; // Change to your preference
const MAX_HISTORY_ITEMS = 50; // Maximum history items to store
```

### Integrate with Analytics Services

Edit `contexts/cookie-consent-context.tsx` in the `initializeTracking` function:

```typescript
const initializeTracking = (prefs: CookiePreferences) => {
  if (prefs.analytics) {
    // Add Google Analytics
    // gtag('config', 'GA_MEASUREMENT_ID')
  }

  if (prefs.marketing) {
    // Add Facebook Pixel
    // fbq('init', 'FB_PIXEL_ID')
  }
};
```

## Testing

1. **First Visit**: Clear cookies and reload - banner should appear
2. **Accept All**: Click "Accept All" - all tracking should work
3. **Reject All**: Click "Reject All" - only necessary cookies
4. **Customize**: Click "Customize" - toggle preferences
5. **Footer Link**: Click "Cookie Settings" in footer - settings should open
6. **Persistence**: Reload page - preferences should persist

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
