import {CollectionItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import styles from './MembershipProductCard.module.css';

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
        <div className={styles.MembershipProductCardImage}>
          <Image
            alt={image.altText || product.title}
            data={image}
            loading="lazy"
            sizes="(min-width: 769px) 50vw, 100vw"
          />
        </div>
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}
