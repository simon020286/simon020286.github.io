import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import Layout from '@components/Layout';
import Tags from '@components/Tags';
import { getAllPosts } from '@libs/post';
import { parseAndFormat } from '@libs/date';
import { PostType } from '@mytypes/post';

type IndexProps = {
  posts: PostType[];
};

export const Index = ({ posts }: IndexProps): JSX.Element => {
  return (
    <Layout>
      <h1>Home Page</h1>
      {posts.map((post) => (
        <article key={post.slug} className="mt-12">
          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
            {parseAndFormat(post.date)}
          </p>
          <h1 className="mb-2 text-xl">
            <Link as={`/posts/${post.slug}`} href={`/posts/[slug]`}>
              <a className="text-gray-900 dark:text-white dark:hover:text-blue-400">
                {post.title}
              </a>
            </Link>
          </h1>
          <div>
            <Tags tags={post.tags} />
          </div>
          <p className="mb-3">{post.description}</p>
          <p>
            <Link as={`/posts/${post.slug}`} href={`/posts/[slug]`}>
              <a>Read More</a>
            </Link>
          </p>
        </article>
      ))}
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts({ size: 5 });

  return {
    props: { posts },
  };
};

export default Index;