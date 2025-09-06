import {Grid} from '@radix-ui/themes';
import {Image} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import type {ProductFragment} from 'storefrontapi.generated';

export type ProductMediaGalleryProps = {
  media: ProductFragment['media'];
};

export default function ProductMediaGallery({media}: ProductMediaGalleryProps) {
  return (
    <Grid>
      {media.nodes.map((node) => {
        if (!node.image) return null;
        return (
          <Image
            alt={node?.image.altText || 'Product Image'}
            aspectRatio="1/1"
            data={node?.image}
            key={node?.id}
            sizes="(min-width: 45em) 50vw, 100vw"
          />
        );
      })}
    </Grid>
  );
}
