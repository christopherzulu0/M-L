interface StarRatingProps {
  rating: number
  label?: string
  className?: string
  editable?: boolean
  onRatingChange?: (rating: number) => void
}

export function StarRating({
  rating,
  label,
  className = "text-yellow-400",
  editable = false,
  onRatingChange
}: StarRatingProps) {

  const handleClick = (selectedRating: number) => {
    if (editable && onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? className : "text-gray-300"} ${
              editable ? "cursor-pointer hover:scale-110 transition-transform" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            onClick={() => handleClick(star)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleClick(star);
              }
            }}
            tabIndex={editable ? 0 : -1}
            role={editable ? "button" : "presentation"}
            aria-label={editable ? `Rate ${star} out of 5` : undefined}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  )
}
