"use client";

interface ReviewCardProps {
  id: number;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date?: string;
  avatar?: string;
}

export default function ReviewCard({
  id,
  author,
  rating,
  title,
  comment,
  date,
  avatar,
}: ReviewCardProps) {
  return (
    <div className="border border-[#d6c1b1] rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="mb-4">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${
                i < rating ? "text-[#d4a574]" : "text-[#d6c1b1]"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Title */}
        <h4 className="text-lg font-medium text-[#7c5c4a]">{title}</h4>
      </div>

      {/* Comment */}
      <p className="text-[#7c5c4a] text-sm mb-4 leading-relaxed">{comment}</p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#e5d3c2]">
        <div className="flex items-center gap-2">
          {avatar && (
            <div className="w-8 h-8 bg-[#e5d3c2] rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-[#7c5c4a]">
                {avatar}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-[#7c5c4a]">{author}</p>
            {date && <p className="text-xs text-[#7c5c4a]">{date}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
