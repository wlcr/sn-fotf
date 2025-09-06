import {Box, Grid} from '@radix-ui/themes';
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import styles from './ProductMediaGallery.module.css';

export type ProductMediaGalleryProps = {
  media: ProductFragment['media'];
};

export default function ProductMediaGallery({media}: ProductMediaGalleryProps) {
  return (
    <Grid columns={'2'} gap="4">
      {media.nodes.map((node) => {
        if (!node.image) return null;
        return (
          <Box className={styles.ProductMediaGalleryImage} key={node?.id}>
            <Image
              alt={node?.image.altText || 'Product Image'}
              data={node?.image}
              sizes="(min-width: 45em) 50vw, 100vw"
            />
          </Box>
        );
      })}
    </Grid>
  );
}
