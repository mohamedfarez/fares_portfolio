import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { type Locale, locales, getDirection, getFontFamily } from '@/lib/i18n/config';
import { AccessibilityPanel } from '@/components/accessibility/accessibility-features';
import { getSEOConfig, generateMetaTags, generatePersonSchema, generateWebsiteSchema } from '@/lib/seo/seo-config';
import { ThemeProvider } from '@/lib/theme/theme-provider';
import { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';
import '../../styles/accessibility.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-english',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});

// Force dynamic rendering for i18n
export const dynamic = 'force-dynamic';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Generate metadata for SEO
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const seoConfig = getSEOConfig('home', locale);
  const metaTags = generateMetaTags(seoConfig);

  return {
    title: seoConfig.title,
    description: seoConfig.description,
    keywords: seoConfig.keywords,
    authors: [{ name: seoConfig.author }],
    openGraph: {
      title: seoConfig.title,
      description: seoConfig.description,
      url: seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      type: 'website',
      images: seoConfig.image ? [
        {
          url: seoConfig.image,
          alt: seoConfig.imageAlt || seoConfig.title,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoConfig.title,
      description: seoConfig.description,
      creator: '@mohamedfarez',
      images: seoConfig.image ? [seoConfig.image] : [],
    },
    robots: {
      index: !seoConfig.noIndex,
      follow: !seoConfig.noFollow,
    },
    alternates: {
      canonical: seoConfig.canonical,
      languages: seoConfig.alternateLanguages,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: LocaleLayoutProps) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const direction = getDirection(locale as Locale);
  const fontFamily = getFontFamily(locale as Locale);

  // Generate structured data
  const personSchema = generatePersonSchema(locale);
  const websiteSchema = generateWebsiteSchema(locale);

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Analytics - will be initialized client-side */}
      </head>
      <body
        className={`${inter.variable} ${cairo.variable} ${fontFamily} antialiased min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Skip Links for Accessibility */}
          <a href="#main-content" className="skip-link">
            {locale === 'ar' ? 'تخطي إلى المحتوى الرئيسي' : 'Skip to main content'}
          </a>

          <NextIntlClientProvider messages={messages}>
            <main id="main-content">
              {children}
            </main>

            {/* Accessibility Panel */}
            <AccessibilityPanel />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
