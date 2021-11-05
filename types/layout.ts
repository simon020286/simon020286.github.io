import { PostType } from './post';

export interface MetaProps
  extends Pick<PostType, 'description' | 'image' | 'title'> {
  /**
   * For the meta tag `og:type`
   */
  type?: string;
  date?: string;
}
