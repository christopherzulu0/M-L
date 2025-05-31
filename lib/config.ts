/**
 * Application configuration
 * Centralizes hardcoded values that might need to change across the application
 */

/**
 * Company information
 */
export const companyInfo = {
  name: "ML Real Estate",
  phone: "+1 (555) 123-4567",
  email: "info@mlrealestate.com",
  address: "123 Main Street, New York, NY 10001",
  socialMedia: {
    facebook: "https://facebook.com/mlrealestate",
    twitter: "https://twitter.com/mlrealestate",
    instagram: "https://instagram.com/mlrealestate",
    linkedin: "https://linkedin.com/company/mlrealestate",
  },
};

/**
 * Navigation structure
 */
export const navigation = {
  main: [
    {
      name: "Home",
      href: "/",
      icon: null,
      featured: false,
    },
    {
      name: "Properties",
      href: "/listings",
      icon: "MapPin",
      featured: true,
      submenu: [
        { name: "Luxury Homes", href: "/listings/luxury", badge: "Premium", icon: "Star" },
        { name: "For Sale", href: "/listings/sale", icon: "MapPin" },
        { name: "For Rent", href: "/listings/rent", icon: "Calendar" },
        { name: "Commercial", href: "/listings/commercial", icon: "TrendingUp" },
        { name: "New Developments", href: "/listings/new", badge: "Hot", icon: "Zap" },
        { name: "Map View", href: "/property-map", icon: "MapPin" },
      ],
    },
    {
      name: "Agents",
      href: "/agents",
      icon: "Users",
      featured: false,
    },
    {
      name: "Market",
      href: "/market-trends",
      icon: "TrendingUp",
      featured: true,
      submenu: [
        { name: "Market Reports", href: "/market-trends/reports", icon: "BookOpen" },
        { name: "Price Analytics", href: "/market-trends/analytics", icon: "TrendingUp" },
        { name: "Investment Insights", href: "/market-trends/insights", icon: "Star" },
      ],
    },
    {
      name: "Resources",
      href: "/resources",
      icon: "BookOpen",
      featured: false,
      submenu: [
        { name: "Buyers Guide", href: "/buyers-guide", icon: "BookOpen" },
        { name: "Sellers Guide", href: "/sellers-guide", icon: "BookOpen" },
        { name: "News & Blog", href: "/blog", icon: "Globe" },
        { name: "Calculator", href: "/calculator", icon: "Calculator" },
        { name: "Saved Searches", href: "/saved-searches", icon: "Save" },
      ],
    },
  ],
  footer: [
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Guides", href: "/guides" },
        { name: "FAQ", href: "/faq" },
        { name: "Help Center", href: "/help" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "GDPR", href: "/gdpr" },
      ],
    },
  ],
};

/**
 * Application settings
 */
export const appSettings = {
  propertyListingPageSize: 12,
  featuredPropertiesCount: 6,
  defaultCurrency: "USD",
  defaultLanguage: "en",
  toastDuration: 3000,
};

/**
 * Feature flags
 */
export const featureFlags = {
  enableMapView: true,
  enableVirtualTours: true,
  enableMortgageCalculator: true,
  enablePropertyComparison: true,
  enableSavedSearches: true,
};
