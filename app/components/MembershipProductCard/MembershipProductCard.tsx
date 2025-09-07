import {CollectionItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

export type MembershipProductCardProps = {
  product: CollectionItemFragment;
};

export default function MembershipProductCard({
  product,
}: MembershipProductCardProps) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading="lazy"
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}
