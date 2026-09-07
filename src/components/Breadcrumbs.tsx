import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-brown-400 flex-wrap" aria-label="مسار التنقل">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronLeft size={14} className="text-brown-300" />}
          {item.to ? (
            <Link to={item.to} className="hover:text-gold-500 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-brown-600 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
