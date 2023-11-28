type Props = {
  title: string;
  description?: string;
};

export const Heading: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="flex-1">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};
