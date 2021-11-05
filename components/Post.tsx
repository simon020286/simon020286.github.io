import { parseAndFormat } from '@libs/date';
import { PostType } from '@mytypes/post';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import dockerfile from 'highlight.js/lib/languages/dockerfile';

const Post = (props: {
  post: PostType;
}): JSX.Element => {
  return (
    <article>
      <h1 className="mb-3 text-gray-900 dark:text-white">{props.post.title}</h1>
      <p className="mb-10 text-sm text-gray-500 dark:text-gray-400">
        {parseAndFormat(props.post.date)}
      </p>
      <div className="prose dark:prose-dark">
        <ReactMarkdown
          rehypePlugins={[[rehypeHighlight, {ignoreMissing: true, subset: false, languages: {"dockerfile": dockerfile}}]]}>
          {props.post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default Post;
