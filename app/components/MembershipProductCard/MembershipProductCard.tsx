import {CollectionItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import styles from './MembershipProductCard.module.css';
import Button from '../Button/Button';
import {Box, Grid} from '@radix-ui/themes';

export type MembershipProductCardProps = {
  product: CollectionItemFragment;
};

export default function MembershipProductCard({
  product,
}: MembershipProductCardProps) {
  const image = product.featuredImage;
  return (
    <Grid gap="2">
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
      <Grid gap="2">
        <Box>
          <div className="heading-6">Chico, Lorem Ipsum</div>
          <h2 className="heading-5">{product.title}</h2>
        </Box>
        <Box>
          <span>Starting at </span>
          <Money data={product.priceRange.minVariantPrice} as="span" />
        </Box>

        <Button width="full">Learn More</Button>
      </Grid>
    </Grid>
  );
}
