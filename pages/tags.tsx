import { GetStaticProps } from 'next';
import React from 'react';
import Link from 'next/link';
import Layout from '@components/Layout';
import { getAllTags } from '@libs/post';
import { TagType } from '@mytypes/tag';


const sizeTag = (count: number): string => {
  if(count < 2){
    return 'text-lg';
  }
  if(count < 4){
    return 'text-xl';
  }
  return 'text-2xl';
}

export const Tags = ({ tags }: { tags: TagType[] }): JSX.Element => {
  return (
    <Layout
      customMeta={{
        title: 'Tags'
      }}
    >
      <h1>Tags</h1>
      <div className="flex flex-wrap">
        {tags.map((tag) => (
          <div key={tag.name} className="m-2">
            <Link key={tag.name} as={`/tags/${tag.name}`} href={`/tags/[tag]`}>
              <a className={sizeTag(tag.count)}>{tag.name}</a>
            </Link>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const tags = getAllTags();
  return {
    props: { tags },
  };
};

export default Tags;