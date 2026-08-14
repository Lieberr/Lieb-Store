const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

const Star = ({ fillPercent }: { fillPercent: number }) => {
  const safePercent = Math.min(Math.max(fillPercent, 0), 1);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        d={STAR_PATH}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-yellow-300"
      />
      <path
        d={STAR_PATH}
        fill="currentColor"
        className="text-yellow-500"
        style={{
          clipPath: `inset(0 ${100 - safePercent * 100}% 0 0)`,
        }}
      />
    </svg>
  );
};

const Rating = ({
  value,
  caption,
}: {
  value: number;
  caption?: string;
}) => {
  const safeValue = Math.min(Math.max(value, 0), 5);

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 text-yellow-500">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = safeValue - index;

          if (starValue >= 1) return <Star key={`star-${index}`} fillPercent={1} />;
          if (starValue > 0) return <Star key={`star-${index}`} fillPercent={starValue} />;
          return <Star key={`star-${index}`} fillPercent={0} />;
        })}
      </div>

      {caption && <span className="text-sm">{caption}</span>}
    </div>
  );
};

export default Rating;