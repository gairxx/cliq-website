import { ReactElement } from 'react';
import Head from 'next/head';
import METADATA, { IMetadata } from '@/constants/metadata';
import { isLocal } from '@/utils/links';

interface Props {
  title?: string;
  metadata?: IMetadata;
}

export default function CustomHead(props: Props): ReactElement {
  const { title, metadata } = props;
  const pageTitle =
    title && title.length > 0
      ? `${title} - Session Private Messenger`
      : METADATA.TITLE;
  const pageUrl = `${METADATA.HOST_URL}`;
  const imageUrl = (() => {
    if (!metadata?.OG_IMAGE?.URL)
      return `${METADATA.HOST_URL}${METADATA.OG_IMAGE.URL}`;
    if (metadata?.OG_IMAGE?.URL && isLocal(metadata?.OG_IMAGE?.URL)) {
      return `${METADATA.HOST_URL}${metadata?.OG_IMAGE?.URL}`;
    } else {
      return `${metadata?.OG_IMAGE?.URL}`;
    }
  })();
  const renderTags = (() => {
    const tags = metadata?.TAGS ? metadata?.TAGS : METADATA.TAGS;
    const keywords = <meta name="keywords" content={tags.join(' ')} />;
    if (metadata?.TYPE !== 'article') return keywords;
    return (
      <>
        {tags.map((tag) => {
          return <meta property="article:tag" content={tag} />;
        })}
        <meta
          property="article:section"
          content={metadata?.ARTICLE_SECTION ?? METADATA.TAGS[0]}
        />
        {metadata?.PUBLISHED_TIME && (
          <meta
            property="article:published_time"
            content={metadata?.PUBLISHED_TIME}
          />
        )}
        {keywords}
      </>
    );
  })();

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, viewport-fit=cover"
      />
      <meta
        name="description"
        content={metadata?.DESCRIPTION ?? METADATA.DESCRIPTION}
      />
      <meta
        name="robots"
        content="max-snippet:-1, max-image-preview:large, max-video-preview:-1"
      />
      <meta name="googlebot" content="index,follow" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:type" content={metadata?.TYPE ?? METADATA.OG_TYPE} />
      <meta
        property="og:description"
        content={metadata?.DESCRIPTION ?? METADATA.DESCRIPTION}
      />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl}></meta>
      <meta
        property="og:image:alt"
        content={metadata?.OG_IMAGE?.ALT ?? METADATA.OG_IMAGE.ALT}
      />
      <meta
        property="og:image:width"
        content={String(metadata?.OG_IMAGE?.WIDTH ?? METADATA.OG_IMAGE.WIDTH)}
      />
      <meta
        property="og:image:height"
        content={String(metadata?.OG_IMAGE?.HEIGHT ?? METADATA.OG_IMAGE.HEIGHT)}
      />
      <meta property="og:locale" content={METADATA.LOCALE} />
      <meta property="og:site_name" content={METADATA.SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta
        name="twitter:description"
        content={metadata?.DESCRIPTION ?? METADATA.DESCRIPTION}
      />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content={METADATA.HOST_URL} />
      <meta name="twitter:creator" content="session_app" />
      <meta name="apple-itunes-app" content="app-id=1470168868" />
      <meta
        name="msapplication-TileColor"
        content={METADATA.MSAPPLICATION_TILECOLOR}
      />
      <meta name="theme-color" content={METADATA.THEME_COLOR} />
      {renderTags}
      <link rel="canonical" href={pageUrl} />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={METADATA.FAVICON.MEDIUM}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={METADATA.FAVICON.SMALL}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={METADATA.FAVICON.APPLE_TOUCH_ICON}
      />
      <link rel="manifest" href={METADATA.MANIFEST} />
      <link
        rel="mask-icon"
        href={METADATA.MASK_ICON.PATH}
        color={METADATA.MASK_ICON.COLOR}
      />
      <link rel="shortlink" href={METADATA.HOST_URL} />
      <link rel="alternative" type="application/rss+xml" href="/feed" />
      <link rel="alternative" type="application/atom+xml" href="/feed/atom" />
      <link rel="alternative" type="application/feed+json" href="/feed/json" />
    </Head>
  );
}