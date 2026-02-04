import { 
  Milk, 
  Apple, 
  Cookie, 
  Beef, 
  Droplet, 
  Wheat, 
  Package 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const iconProps = { className: cn("h-full w-full", className) };

  switch (category) {
    case 'Dairy':
      return <Milk {...iconProps} />;
    case 'Fruits':
      return <Apple {...iconProps} />;
    case 'Bakery':
      return <Cookie {...iconProps} />;
    case 'Meat':
      return <Beef {...iconProps} />;
    case 'Cooking':
      return <Droplet {...iconProps} />;
    case 'Grains':
      return <Wheat {...iconProps} />;
    default:
      return <Package {...iconProps} />;
  }
}
