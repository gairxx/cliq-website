import {
  createClient,
  ContentfulClientApi,
  EntryCollection,
  Tag,
} from 'contentful';
import { Document, Block, Inline } from '@contentful/rich-text-types';
import isLive from '@/utils/environment';
import { format, parseISO } from 'date-fns';

import {
  IFigureImage,
  IAuthor,
  IPost,
  IFAQItem,
  IPage,
  IFetchEntriesReturn,
  IFetchBlogEntriesReturn,
  IFetchFAQItemsReturn,
  IFetchPagesReturn,
  ITagList,
} from '@/types/cms';
import { fetchContent } from '@/services/embed';

const client: ContentfulClientApi = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

async function getTagList() {
  const _tags = await client.getTags();
  const tags: ITagList = {};
  _tags.items.forEach((tag) => {
    tags[tag.sys.id] = tag.name;
  });
  return tags;
}

function loadOptions(options: any) {
  if (isLive()) options['fields.live'] = true;
  return options;
}

export async function fetchBlogEntries(
  quantity = 100
): Promise<IFetchBlogEntriesReturn> {
  const _entries = await client.getEntries(
    loadOptions({
      content_type: 'post', // only fetch blog post entry
      order: '-fields.date',
      limit: quantity,
    })
  );

  const results = await generateEntries(_entries, 'post');
  return {
    entries: results.entries as Array<IPost>,
    total: results.total,
  };
}

export async function fetchBlogEntriesByTag(
  tag: string,
  quantity = 100
): Promise<IFetchBlogEntriesReturn> {
  const _entries = await client.getEntries(
    loadOptions({
      content_type: 'post', // only fetch blog post entry
      order: '-fields.date',
      'fields.tags[in]': tag,
      limit: quantity,
    })
  );

  const results = await generateEntries(_entries, 'post');
  return {
    entries: results.entries as Array<IPost>,
    total: results.total,
  };
}

export async function fetchEntryBySlug(
  slug: string,
  entryType: 'post' | 'page'
): Promise<any> {
  const _entries = await client.getEntries({
    content_type: entryType, // only fetch specific type
    'fields.slug': slug,
  });
  const taglist = await getTagList();

  if (_entries?.items?.length > 0) {
    let entry;
    switch (entryType) {
      case 'post':
        entry = convertPost(_entries.items[0], taglist);
        break;
      case 'page':
        entry = convertPage(_entries.items[0]);
        break;
      default:
        break;
    }
    return entry;
  }

  return Promise.reject(new Error(`Failed to fetch ${entryType} for ${slug}`));
}

function convertPost(rawData: any, taglist: ITagList): IPost {
  const rawPost = rawData.fields;
  const rawFeatureImage = rawPost?.featureImage
    ? rawPost?.featureImage.fields
    : null;
  const rawAuthor = rawPost.author ? rawPost.author.fields : null;

  return {
    id: rawData.sys.id ?? null,
    body: rawPost.body ?? null,
    subtitle: rawPost.subtitle ?? null,
    description: rawPost.description ?? null,
    publishedDateISO: rawPost.date,
    publishedDate: format(parseISO(rawPost.date), 'MMMM dd, yyyy'),
    slug: rawPost.slug,
    tags: convertTags(rawData.metadata.tags, taglist),
    title: rawPost.title,
    featureImage: convertImage(rawFeatureImage),
    fullHeader: rawPost.fullHeader ?? null,
    author: convertAuthor(rawAuthor),
  };
}

function convertImage(rawImage: any): IFigureImage {
  return {
    imageUrl: rawImage.file.url.replace('//', 'https://'), // may need to put null check as well here
    description: rawImage.description ?? null,
    title: rawImage.title ?? null,
    width: rawImage.file.details.image.width,
    height: rawImage.file.details.image.height,
  };
}

function convertAuthor(rawAuthor: any): IAuthor {
  return {
    name: rawAuthor?.name ?? null,
    avatar: convertImage(rawAuthor.avatar.fields),
    shortBio: rawAuthor?.shortBio ?? null,
    position: rawAuthor?.position ?? null,
    email: rawAuthor?.email ?? null,
    twitter: rawAuthor?.twitter ?? null,
    facebook: rawAuthor.facebook ?? null,
    github: rawAuthor.github ?? null,
  };
}

function convertTags(rawTags: any, taglist: ITagList): string[] {
  const tags = rawTags.map((tag: Tag) => {
    return taglist[tag.sys.id];
  });
  return tags;
}

async function generateEntries(
  entries: EntryCollection<unknown>,
  entryType: 'post' | 'faq' | 'page'
): Promise<IFetchEntriesReturn> {
  let _entries: any = [];
  if (entries && entries.items && entries.items.length > 0) {
    switch (entryType) {
      case 'post':
        const taglist = await getTagList();
        _entries = entries.items.map((entry) => convertPost(entry, taglist));
        break;
      case 'faq':
        _entries = entries.items.map((entry) => convertFAQ(entry));
        break;
      case 'page':
        _entries = entries.items.map((entry) => convertPage(entry));
        break;
      default:
        break;
    }
    return { entries: _entries, total: entries.total };
  }

  return { entries: _entries, total: 0 };
}

export function generateRoute(slug: string): string {
  const route =
    slug.indexOf('/blog/') > 0 ? slug.split('/blog/')[1] : '/blog/' + slug;
  return route;
}

async function loadMetaData(node: Block | Inline) {
  // is embedded link not embedded media
  if (!node.data.target.fields.file) {
    node.data.target.fields.meta = await fetchContent(
      node.data.target.fields.url
    );
  }
  return node;
}

export async function generateLinkMeta(doc: Document): Promise<Document> {
  const promises = doc.content.map(async (node: Block | Inline) => {
    if (node.nodeType === 'embedded-entry-block') {
      node = await loadMetaData(node);
    } else {
      // check for inline embedding
      const innerPromises = node.content.map(async (innerNode) => {
        if (
          innerNode.nodeType === 'embedded-entry-inline' &&
          innerNode.data.target.sys.contentType.sys.id !== 'markup'
        ) {
          innerNode = await loadMetaData(innerNode);
        }
      });
      await Promise.all(innerPromises);
    }
  });
  await Promise.all(promises);
  return doc;
}

export async function fetchFAQItems(): Promise<IFetchFAQItemsReturn> {
  const _entries = await client.getEntries({
    content_type: 'faq_item', // only fetch faq items
    order: 'fields.id',
  });

  const results = await generateEntries(_entries, 'faq');
  return { entries: results.entries as Array<IFAQItem>, total: results.total };
}

function convertFAQ(rawData: any): IFAQItem {
  const rawFAQ = rawData.fields;
  const { question, answer, id, tag, slug } = rawFAQ;

  return {
    id: id ?? null,
    question: question ?? null,
    answer: answer ?? null,
    tag: tag ?? null,
    slug: slug ?? null,
  };
}

export async function fetchPages(quantity = 100): Promise<IFetchPagesReturn> {
  const _entries = await client.getEntries(
    loadOptions({
      content_type: 'page',
      limit: quantity,
    })
  );

  const results = await generateEntries(_entries, 'page');
  return {
    entries: results.entries as Array<IPage>,
    total: results.total,
  };
}

function convertPage(rawData: any): IPage {
  const rawPage = rawData.fields;

  return {
    title: rawPage.title,
    slug: rawPage.slug,
    headline: rawPage.headline ?? null,
    body: rawPage.body,
  };
}
