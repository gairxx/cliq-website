import { ReactElement, useState, useEffect } from 'react';
import { GetStaticProps, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import { fetchBlogEntries, generateRoute } from '@/services/cms';
import { IPost } from '@/types/cms';

import { Layout } from '@/components/ui';
import { PostCard } from '@/components/cards';
import { PostList } from '@/components/posts';
import METADATA from '@/constants/metadata';

interface Props {
  posts: IPost[];
}

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const { entries: posts, total: totalPosts } = await fetchBlogEntries();
  return {
    props: { posts },
    revalidate: 3600, // refresh hourly
  };
};

export default function Blog(props: Props): ReactElement {
  const router = useRouter();
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (router.query.tag) {
      if (typeof router.query.tag === 'string') {
        setTag(router.query.tag);
      } else {
        setTag(router.query.tag.join(','));
      }
    } else {
      setTag('');
    }
  }, [router.query.tag]);

  let { posts } = props;
  if (tag.length > 0) {
    posts = posts.filter((post) => {
      return post.tags.join(',').includes(tag);
    });
  }
  const [featuredPost, ...otherPosts] = posts;
  return (
    <Layout
      title={tag ? `${tag} Archives` : 'Blog'}
      metadata={METADATA.BLOG_PAGE}
    >
      <section>
        {tag ? (
          <div
            className={classNames(
              'text-primary-dark text-4xl font-bold mx-auto mt-12 px-3',
              'md:mt-16 md:mb-8',
              'lg:max-w-6xl lg:mt-8 lg:px-10'
            )}
          >
            <h1
              className={classNames(
                'bg-gray-50 border border-gray-200 py-3 px-2',
                'lg:max-w-4xl'
              )}
            >
              {tag}
            </h1>
          </div>
        ) : (
          <div
            className={classNames(
              'flex justify-center items-center mx-auto mt-12',
              'md:mt-24',
              'lg:max-w-screen-xl lg:mt-16 lg:px-24'
            )}
          >
            <PostCard
              route={generateRoute(featuredPost.slug)}
              featured={true}
              classes={classNames('mb-5', 'md:flex')}
              key={featuredPost.id}
              {...featuredPost}
            />
          </div>
        )}
        <PostList posts={tag ? posts : otherPosts} showHeading={!tag} />
      </section>
    </Layout>
  );
}
