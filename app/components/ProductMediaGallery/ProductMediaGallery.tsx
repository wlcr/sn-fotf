import {Grid} from '@radix-ui/themes';
import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

export type ProductMediaGalleryProps = {
  image: ProductVariantFragment['image'];
};

export default function ProductMediaGallery({image}: ProductMediaGalleryProps) {
  if (!image) return <Grid></Grid>;
  return (
    <Grid>
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </Grid>
  );
}
