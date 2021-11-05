import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import Layout, { WEBSITE_HOST_URL } from '@components/Layout';
import { MetaProps } from '@mytypes/layout';
import { PostType } from '@mytypes/post';
import { getPostBySlug, postFilePaths } from '@libs/post';
import Post from '@components/Post';

type PostPageProps = {
  post: PostType;
};

const PostPage = ({ post }: PostPageProps): JSX.Element => {
  const customMeta: MetaProps = {
    title: post.title,
    description: post.description,
    image: `${WEBSITE_HOST_URL}${post.image}`,
    date: post.date,
    type: 'article',
  };
  return (
    <Layout customMeta={customMeta}>
      <Post post={post} />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getPostBySlug(params?.slug as string);

  return {
    props: {
      source: post.content,
      post: post,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export default PostPage;
