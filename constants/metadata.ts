export interface IMetadata {
  DESCRIPTION: string;
  TYPE?: string;
  OG_IMAGE?: {
    URL: string;
    WIDTH: number;
    HEIGHT: number;
    ALT: string;
  };
  TAGS?: string[];
  ARTICLE_SECTION?: string;
  PUBLISHED_TIME?: string;
}

const METADATA = {
  // HOST_URL: 'https://getsession.org',
  // For testing purposes only
  HOST_URL: 'https://session-website-demo-dlwmkh4kj-yougotwill.vercel.app',
  SITE_NAME: 'Session',
  TITLE: 'Session | Send Messages, Not Metadata. | Private Messenger',
  DESCRIPTION:
    'Session is a private messenger that aims to remove any chance of metadata collection by routing all messages through an onion routing network.',
  TAGS: [
    'Privacy',
    'co-op',
    'Community contribution',
    'decentralisation',
    'decentralised',
    'messaging',
    'Private messaging',
  ],
  OG_TYPE: 'website',
  OG_IMAGE: {
    URL: '/assets/images/logo-black.png',
    WIDTH: 804,
    HEIGHT: 665,
    ALT: 'Session Logo Black Background',
  },
  LOCALE: 'en_US',
  FAVICON: {
    MEDIUM: '/favicon-32x32.png',
    SMALL: '/favicon-16x16.png',
    APPLE_TOUCH_ICON: '/apple-touch-icon.png',
  },
  MANIFEST: '/site.webmanifest',
  MASK_ICON: { PATH: '/safari-pinned-tab.svg', COLOR: '#00f782' },
  MSAPPLICATION_TILECOLOR: '#343132',
  THEME_COLOR: '#ffffff',
  404: {
    DESCRIPTION:
      'It looks like the link pointing here was faulty. Maybe try searching?',
  },
  BLOG_PAGE: {
    TYPE: 'article',
    DESCRIPTION:
      'View the Session Blogs. | Session is an end-to-end encrypted messenger that removes sensitive metadata collection.',
    OG_IMAGE: {
      URL: '/assets/images/send-messages-not-metadata.jpg',
      WIDTH: 1024,
      HEIGHT: 1024,
      ALT: 'Mysterious man on the phone. Heading is Use Session.',
    },
  },
  DOWNLOAD_PAGE: {
    TYPE: 'article',
    DESCRIPTION:
      'Download Session Today | Session is an end-to-end encrypted messenger that removes sensitive metadata collection for all operating systems.',
    OG_IMAGE: {
      URL: '/assets/images/send-messages-not-metadata.jpg',
      WIDTH: 1024,
      HEIGHT: 1024,
      ALT: 'Mysterious man on the phone. Heading is Use Session.',
    },
  },
  FAQ_PAGE: {
    TYPE: 'article',
    DESCRIPTION:
      "Session's FAQ. Find answers to some of the most frequently asked questions about Session — info on the team, the tech, and the technicalities.",
    OG_IMAGE: {
      URL: '/assets/images/faq.png',
      WIDTH: 800,
      HEIGHT: 800,
      ALT: 'Frequently Asked Questions heading with redacted text below',
    },
  },
  OPEN_GROUP_PAGE: {
    TYPE: 'article',
    DESCRIPTION:
      'Join the movement to keep the internet private! Chat with like-minded individuals in Sessions Open Group Channel. Join Now',
    OG_IMAGE: {
      URL: '/assets/images/faq.png',
      WIDTH: 1024,
      HEIGHT: 1024,
      ALT: 'Frequently Asked Questions heading with redacted text below',
    },
  },
};

export default METADATA;
