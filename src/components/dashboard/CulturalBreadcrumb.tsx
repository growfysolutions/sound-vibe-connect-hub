
import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';

interface BreadcrumbSegment {
  title: string;
  href?: string;
  isActive?: boolean;
}

const CulturalBreadcrumb: React.FC = () => {
  const location = useLocation();
  
  const generateBreadcrumbs = (pathname: string): BreadcrumbSegment[] => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [
      { title: 'Dashboard', href: '/dashboard' }
    ];

    // Map route segments to readable titles
    const routeMap: { [key: string]: string } = {
      'projects': 'Projects',
      'feed': 'Feed',
      'discover': 'Discover',
      'network': 'Network',
      'progress': 'Progress',
      'contracts': 'Contracts',
      'recommendations': 'Recommendations',
      'analytics': 'Analytics',
      'settings': 'Settings',
      'profile': 'Profile',
      'collaboration': 'Collaboration',
      'messages': 'Messages'
    };

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      const title = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const href = i === segments.length - 1 ? undefined : '/' + segments.slice(0, i + 1).join('/');
      
      breadcrumbs.push({
        title,
        href,
        isActive: i === segments.length - 1
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(location.pathname);

  return (
    <div className="px-6 py-3 bg-gradient-to-r from-background/80 to-muted/30 border-b border-saffron/20">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.title}>
              <BreadcrumbItem>
                {breadcrumb.isActive ? (
                  <BreadcrumbPage className="font-semibold text-saffron">
                    {breadcrumb.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={breadcrumb.href}
                    className="text-muted-foreground hover:text-saffron transition-colors"
                  >
                    {breadcrumb.title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="text-saffron/60">
                  <span className="text-lg">🌾</span>
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default CulturalBreadcrumb;
