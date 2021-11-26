import { PostType } from '@mytypes/post';
import { PostsOptions } from '@mytypes/postOptions';
import { TagType } from '@mytypes/tag';
import { GraphQLClient } from 'graphql-request';

const graphcms = new GraphQLClient(
    process.env.GRAPHCMS as string
);

export async function postFilePaths(): Promise<string[]> {
    const { posts }: {posts: Array<any>} = await graphcms.request(
        `{
        posts {
            slug
          }
        }`
    );
    return posts.map(post => post.slug);
}

export async function getPostBySlug(slug: string): Promise<PostType> {
    const { post } = await graphcms.request(
        `
        query PostQuery($slug: String!) {
            post(where: {slug: $slug}) {
                slug
                title
                date
                excerpt
                tags
                content
            }
          }
        `,
        {
            slug: slug
        }
    );

    return graphqlToPostType(post);
}

function graphqlToPostType(post: any): PostType {
    const items = {
        slug: post.slug || null,
        title: post.title || null,
        date: post.date || null,
        description: post.excerpt || null,
        image: post.image || null,
        tags: post.tags || [],
        content: post.content || null,
    } as PostType;

    return items;
}

function getWhereConditions(conditions: Array<string>): string {
    if (!conditions || conditions.length === 0) {
        return "";
    }
    
    return `where: {${conditions.join(', ')}}`;
}

export async function getAllPosts(
    options: PostsOptions = {} as PostsOptions
): Promise<PostType[]> {
    const queryOptions = [
        "orderBy: date_DESC"
    ];
    const whereConditions = [];
    
    if(options.size) queryOptions.push(`first: ${JSON.stringify(options.size)}`);
    if(options.tags) {
        whereConditions.push(`tags_contains_some: ${JSON.stringify(options.tags)}`);
    }

    if (whereConditions.length > 0) {
        queryOptions.push(getWhereConditions(whereConditions))
    }

    const query = `{
    posts${queryOptions.length === 0 ? '' : `(${queryOptions})`} {
        slug
        title
        date
        excerpt
        tags
      }
    }
    `;

    const { posts }: {posts: Array<any>} = await graphcms.request(query);

    return posts.map(graphqlToPostType);
}

export async function getAllTags(): Promise<TagType[]> {
    const query = `{
        posts {
            tags
          }
        }
        `;

    const { posts }: {posts: Array<any>} = await graphcms.request(query);
    const tags = posts.reduce((prev, curr) => {
        curr.tags.forEach((tag: string) => {
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
