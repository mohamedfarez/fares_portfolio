// SEO Configuration and Utilities
export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  author: string;
  siteUrl: string;
  siteName: string;
  locale: string;
  type: 'website' | 'article' | 'profile';
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  alternateLanguages?: { [key: string]: string };
}

export const defaultSEOConfig: SEOConfig = {
  title: 'Mohamed Fares - AI Engineer & Prompt Engineering Expert',
  description: 'AI Engineer specializing in Prompt Engineering, Computer Vision, and NLP. 1.5+ years experience with +12% LLM accuracy improvement. Winner of 1st place AI project.',
  keywords: [
    'AI Engineer',
    'Prompt Engineering',
    'Computer Vision',
    'Natural Language Processing',
    'Machine Learning',
    'Deep Learning',
    'TensorFlow',
    'PyTorch',
    'OpenAI',
    'Gemini API',
    'YOLOv5',
    'OpenCV',
    'Mohamed Fares',
    'AI Portfolio',
    'SmaTest',
    'Healthcare AI',
    'LLM Optimization'
  ],
  author: 'Mohamed Fares',
  siteUrl: 'https://mohamedfares.ai',
  siteName: 'Mohamed Fares AI Portfolio',
  locale: 'en_US',
  type: 'profile',
  image: '/images/og-image.jpg',
  imageAlt: 'Mohamed Fares - AI Engineer Portfolio',
};

export const arabicSEOConfig: SEOConfig = {
  title: 'محمد فارس - مهندس ذكاء اصطناعي وخبير هندسة الأوامر',
  description: 'مهندس ذكاء اصطناعي متخصص في هندسة الأوامر والرؤية الحاسوبية ومعالجة اللغات الطبيعية. خبرة أكثر من سنة ونصف مع تحسين دقة النماذج اللغوية بنسبة +12%. الفائز بالمركز الأول في مشروع الذكاء الاصطناعي.',
  keywords: [
    'مهندس ذكاء اصطناعي',
    'هندسة الأوامر',
    'الرؤية الحاسوبية',
    'معالجة اللغات الطبيعية',
    'التعلم الآلي',
    'التعلم العميق',
    'تنسورفلو',
    'بايتورش',
    'أوبن إيه آي',
    'جيميني إيه بي آي',
    'يولو في 5',
    'أوبن سي في',
    'محمد فارس',
    'محفظة الذكاء الاصطناعي',
    'سما تست',
    'الذكاء الاصطناعي الطبي',
    'تحسين النماذج اللغوية'
  ],
  author: 'محمد فارس',
  siteUrl: 'https://mohamedfares.ai',
  siteName: 'محفظة محمد فارس للذكاء الاصطناعي',
  locale: 'ar_EG',
  type: 'profile',
  image: '/images/og-image-ar.jpg',
  imageAlt: 'محمد فارس - محفظة مهندس الذكاء الاصطناعي',
};

// Page-specific SEO configurations
export const pageSEOConfigs = {
  home: {
    en: {
      ...defaultSEOConfig,
      title: 'Mohamed Fares - AI Engineer Portfolio | Prompt Engineering Expert',
      description: 'Explore the AI portfolio of Mohamed Fares, featuring award-winning projects in Computer Vision, NLP, and Prompt Engineering. 1.5+ years experience with proven results.',
    },
    ar: {
      ...arabicSEOConfig,
      title: 'محمد فارس - محفظة مهندس الذكاء الاصطناعي | خبير هندسة الأوامر',
      description: 'استكشف محفظة الذكاء الاصطناعي لمحمد فارس، تضم مشاريع حائزة على جوائز في الرؤية الحاسوبية ومعالجة اللغات الطبيعية وهندسة الأوامر. خبرة أكثر من سنة ونصف مع نتائج مثبتة.',
    }
  },
  about: {
    en: {
      ...defaultSEOConfig,
      title: 'About Mohamed Fares - AI Engineer & Machine Learning Expert',
      description: 'Learn about Mohamed Fares, an AI Engineer with expertise in Prompt Engineering, Computer Vision, and NLP. Graduate with 1st place AI project and published research.',
      type: 'article' as const,
    },
    ar: {
      ...arabicSEOConfig,
      title: 'نبذة عن محمد فارس - مهندس ذكاء اصطناعي وخبير التعلم الآلي',
      description: 'تعرف على محمد فارس، مهندس ذكاء اصطناعي خبير في هندسة الأوامر والرؤية الحاسوبية ومعالجة اللغات الطبيعية. خريج مع مشروع ذكاء اصطناعي حائز على المركز الأول وبحث منشور.',
      type: 'article' as const,
    }
  },
  projects: {
    en: {
      ...defaultSEOConfig,
      title: 'AI Projects Portfolio - SmaTest, Healthcare AI, Prompt Engineering',
      description: 'Discover Mohamed Fares\' AI projects including SmaTest (1st place winner), Healthcare Chatbot with Gemini API, and Prompt Engineering Lab with +12% improvement.',
      type: 'article' as const,
    },
    ar: {
      ...arabicSEOConfig,
      title: 'محفظة مشاريع الذكاء الاصطناعي - سما تست، الذكاء الاصطناعي الطبي، هندسة الأوامر',
      description: 'اكتشف مشاريع محمد فارس في الذكاء الاصطناعي بما في ذلك سما تست (الفائز بالمركز الأول)، روبوت المحادثة الطبي مع جيميني إيه بي آي، ومختبر هندسة الأوامر مع تحسين +12%.',
      type: 'article' as const,
    }
  },
  demos: {
    en: {
      ...defaultSEOConfig,
      title: 'Live AI Demos - Interactive Computer Vision, NLP & Prompt Engineering',
      description: 'Experience live AI demonstrations including SmaTest exam monitoring, Healthcare AI assistant, Prompt Engineering optimization, and Computer Vision showcase.',
      type: 'article' as const,
    },
    ar: {
      ...arabicSEOConfig,
      title: 'عروض الذكاء الاصطناعي المباشرة - الرؤية الحاسوبية التفاعلية ومعالجة اللغات وهندسة الأوامر',
      description: 'اختبر عروض الذكاء الاصطناعي المباشرة بما في ذلك مراقبة الامتحانات سما تست، مساعد الذكاء الاصطناعي الطبي، تحسين هندسة الأوامر، وعرض الرؤية الحاسوبية.',
      type: 'article' as const,
    }
  },
  contact: {
    en: {
      ...defaultSEOConfig,
      title: 'Contact Mohamed Fares - AI Engineer for Hire | Collaboration',
      description: 'Get in touch with Mohamed Fares for AI engineering opportunities, prompt engineering consulting, or collaboration on machine learning projects.',
      type: 'article' as const,
    },
    ar: {
      ...arabicSEOConfig,
      title: 'تواصل مع محمد فارس - مهندس ذكاء اصطناعي للتوظيف | التعاون',
      description: 'تواصل مع محمد فارس لفرص هندسة الذكاء الاصطناعي، استشارات هندسة الأوامر، أو التعاون في مشاريع التعلم الآلي.',
      type: 'article' as const,
    }
  }
};

// Structured Data Schemas
export const generatePersonSchema = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": locale === 'ar' ? 'محمد فارس' : 'Mohamed Fares',
  "jobTitle": locale === 'ar' ? 'مهندس ذكاء اصطناعي' : 'AI Engineer',
  "description": locale === 'ar' 
    ? 'مهندس ذكاء اصطناعي متخصص في هندسة الأوامر والرؤية الحاسوبية ومعالجة اللغات الطبيعية'
    : 'AI Engineer specializing in Prompt Engineering, Computer Vision, and Natural Language Processing',
  "url": "https://mohamedfares.ai",
  "image": "https://mohamedfares.ai/images/profile.jpg",
  "email": "mohamedhfares5@gmail.com",
  "telephone": "+20 1023629575",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": locale === 'ar' ? 'القاهرة' : 'Cairo',
    "addressCountry": locale === 'ar' ? 'مصر' : 'Egypt'
  },
  "sameAs": [
    "https://linkedin.com/in/mohamedfarez",
    "https://github.com/mohamedfarez"
  ],
  "knowsAbout": [
    "Artificial Intelligence",
    "Machine Learning",
    "Prompt Engineering",
    "Computer Vision",
    "Natural Language Processing",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "OpenAI",
    "Python"
  ],
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": locale === 'ar' ? 'جامعة المنوفية' : 'Menoufia University'
  },
  "worksFor": {
    "@type": "Organization",
    "name": "Hive Tech"
  }
});

export const generateWebsiteSchema = (locale: string) => ({
  "@context": "https://schema.org",
  "@type": "Website",
  "name": locale === 'ar' ? 'محفظة محمد فارس للذكاء الاصطناعي' : 'Mohamed Fares AI Portfolio',
  "description": locale === 'ar'
    ? 'محفظة مهندس الذكاء الاصطناعي محمد فارس تضم مشاريع متقدمة في هندسة الأوامر والرؤية الحاسوبية'
    : 'AI Engineer Mohamed Fares portfolio featuring advanced projects in Prompt Engineering and Computer Vision',
  "url": "https://mohamedfares.ai",
  "author": {
    "@type": "Person",
    "name": locale === 'ar' ? 'محمد فارس' : 'Mohamed Fares'
  },
  "inLanguage": locale === 'ar' ? 'ar-EG' : 'en-US',
  "copyrightYear": new Date().getFullYear(),
  "copyrightHolder": {
    "@type": "Person",
    "name": locale === 'ar' ? 'محمد فارس' : 'Mohamed Fares'
  }
});

export const generateProjectSchema = (project: any, locale: string) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": project.title,
  "description": project.description,
  "applicationCategory": "AI/ML Application",
  "operatingSystem": "Web",
  "author": {
    "@type": "Person",
    "name": locale === 'ar' ? 'محمد فارس' : 'Mohamed Fares'
  },
  "programmingLanguage": project.technologies || ["Python", "JavaScript", "TypeScript"],
  "url": `https://mohamedfares.ai/projects/${project.id}`,
  "dateCreated": project.dateCreated || "2024",
  "award": project.award || undefined
});

// Utility functions
export const getSEOConfig = (page: string, locale: string): SEOConfig => {
  const pageConfig = pageSEOConfigs[page as keyof typeof pageSEOConfigs];
  if (pageConfig) {
    return pageConfig[locale as keyof typeof pageConfig] || pageConfig.en;
  }
  return locale === 'ar' ? arabicSEOConfig : defaultSEOConfig;
};

export const generateMetaTags = (config: SEOConfig) => {
  const tags = [
    { name: 'description', content: config.description },
    { name: 'keywords', content: config.keywords.join(', ') },
    { name: 'author', content: config.author },
    { name: 'robots', content: `${config.noIndex ? 'noindex' : 'index'},${config.noFollow ? 'nofollow' : 'follow'}` },
    
    // Open Graph
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:type', content: config.type },
    { property: 'og:url', content: config.siteUrl },
    { property: 'og:site_name', content: config.siteName },
    { property: 'og:locale', content: config.locale },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    { name: 'twitter:creator', content: '@mohamedfarez' },
    
    // Additional SEO
    { name: 'theme-color', content: '#3b82f6' },
    { name: 'msapplication-TileColor', content: '#3b82f6' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
  ];

  if (config.image) {
    tags.push(
      { property: 'og:image', content: config.image },
      { property: 'og:image:alt', content: config.imageAlt || config.title },
      { name: 'twitter:image', content: config.image },
      { name: 'twitter:image:alt', content: config.imageAlt || config.title }
    );
  }

  // Note: canonical link should be handled in Next.js metadata, not as meta tag

  return tags;
};
