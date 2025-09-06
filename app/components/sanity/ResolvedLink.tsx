import {linkResolver} from '~/lib/sanity/linkResolver';
import {Link as LinkType} from '~/types/sanity';
import {Link} from 'react-router';

interface ResolvedLinkProps {
  link: LinkType | undefined;
  children: React.ReactNode;
  className?: string;
}

export default function ResolvedLink({
  link,
  children,
  className,
}: ResolvedLinkProps) {
  // resolveLink() is used to determine the type of link and return the appropriate URL.
  const resolvedLink = linkResolver(link);

  if (typeof resolvedLink === 'string') {
    return (
      <Link
        to={resolvedLink}
        target={link?.openInNewTab ? '_blank' : undefined}
        rel={link?.openInNewTab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return <>{children}</>;
}
