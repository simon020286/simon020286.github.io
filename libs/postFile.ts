import fs from 'fs';
import matter from 'gray-matter';
import path, { join } from 'path';
import { PostType } from '@mytypes/post';
import { TagType } from '@mytypes/tag';
import { PostsOptions } from '@mytypes/postOptions';

export const POSTS_PATH = path.join(process.cwd(), 'posts');
export const postFilePaths = fs
  .readdirSync(POSTS_PATH)
  // Only include md(x) files
  .filter((path) => /\.mdx?$/.test(path));

const posts: { [key: string]: PostType } = {};

export async function getPostBySlug(slug: string): Promise<PostType> {
  if (posts[slug]) {
    return posts[slug];
  }

  const realSlug = slug.replace(/\.mdx$/, '');
  const fullPath = join(POSTS_PATH, `${realSlug}.mdx`);

  const readFile = new Promise<string>((resolve, reject) => {
    fs.readFile(fullPath, (err, data) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(data.toString());
    })
  })
  
  const fileContents = await readFile;
  const { data, content } = matter(fileContents);

  const items = {
    slug: realSlug || null,
    title: data.title || null,
    date: data.date || null,
    description: data.description || null,
    image: data.image || null,
    tags: data.tags || [],
    content: content || null,
  } as PostType;

  posts[slug] = items;

  return posts[slug];
}

export async function getAllPosts(
  options: PostsOptions = {} as PostsOptions
): Promise<PostType[]> {
    let posts = await Promise.all(postFilePaths.map((slug) => getPostBySlug(slug)));

  if (options.tags && options.tags.length > 0) {
    posts = posts.filter((post) =>
      post.tags.find((tag) => options.tags && options.tags.indexOf(tag) >= 0)
    );
  }

  posts = posts.sort((post1, post2) => (post1.date > post2.date ? -1 : 1));

  if (options.size && options.size > 0) {
    posts = posts.slice(0, options.size);
  }
  return posts;
}

export async function getAllTags(): Promise<TagType[]> {
  const postsTags = await Promise.all(postFilePaths.map((slug) => getPostBySlug(slug)));

  const tags = postsTags.reduce((prev, curr) => {
    curr.tags.forEach((tag) => {
      if (!prev[tag]) {
        prev[tag] = 0;
      }

      prev[tag] += 1;
    });

    return prev;
  }, {} as { [key: string]: number });

  return Object.keys(tags).map((tag) => {
    return {
      name: tag,
      count: tags[tag],
    };
  });
}