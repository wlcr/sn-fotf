import {CollectionItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import styles from './CollectionProductCard.module.css';
import Button from '../Button/Button';
import {Box, Grid} from '@radix-ui/themes';

export type CollectionProductCardProps = {
  product: CollectionItemFragment;
};

export default function CollectionProductCard({
  product,
}: CollectionProductCardProps) {
  const image = product.featuredImage;
  return (
    <Grid gap="2">
      {image && (
        <Link
          to={`/products/${product.handle}`}
          aria-label={`Learn more about ${product.title}`}
        >
          <div className={styles.CollectionProductCardImage}>
            <Image
              alt={image.altText || product.title}
              data={image}
              loading="lazy"
              sizes="(min-width: 769px) 50vw, 100vw"
            />
          </div>
        </Link>
      )}
      <Grid gap="2">
        <Box>
          <h2 className="heading-5">{product.title}</h2>
        </Box>
        <Box>
          <Money data={product.priceRange.minVariantPrice} as="span" />
        </Box>
      </Grid>
    </Grid>
  );
}
