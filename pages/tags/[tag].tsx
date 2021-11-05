import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import Layout from '@components/Layout';
import Tags from '@components/Tags';
import { PostType } from '@mytypes/post';
import { getAllPosts, getAllTags } from '@libs/post';
import { TagType } from '@mytypes/tag';
import { parseAndFormat } from '@libs/date';

const TagPage = ({
  posts,
  tag,
}: {
  posts: PostType[];
  tag: string;
}): JSX.Element => {
  return (
    <Layout>
      <h1>{tag}</h1>
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

export const getStaticProps: GetStaticProps = async ({ params }: any) => {
  const posts = getAllPosts({ size: 5, tags: [params.tag] });

  return {
    props: {
      posts,
      tag: params.tag,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = getAllTags();

  const paths = tags.map((tag: TagType) => ({
    params: {
      tag: tag.name,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export default TagPage;
