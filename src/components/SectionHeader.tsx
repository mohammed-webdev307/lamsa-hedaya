import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
}

export default function SectionHeader({ title, subtitle, viewAllLink }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-brown-700">{title}</h2>
        {subtitle && <p className="text-brown-400 mt-2">{subtitle}</p>}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="flex items-center gap-1 text-gold-600 hover:text-gold-700 font-medium text-sm transition-colors"
        >
          عرض الكل
          <ChevronLeft size={16} />
        </Link>
      )}
    </div>
  );
}
