const Tags = ({ tags }: { tags: string[] }): JSX.Element => {
  if (!tags) {
    return (
      <></>
    );
  }

  return (
    <div className="flex space-x-1">
      {tags.map((cat, index) => (
        <span className="text-gray-500 dark:text-gray-400" key={index}>
          {cat}
        </span>
      ))}
    </div>
  );
};

export default Tags;
