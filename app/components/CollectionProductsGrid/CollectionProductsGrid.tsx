import {Container, Grid} from '@radix-ui/themes';
import {PaginatedResourceSection} from '../PaginatedResourceSection';
import MembershipProductCard from '../MembershipProductCard/MembershipProductCard';
import {CollectionQuery} from 'storefrontapi.generated';
import CollectionProductCard from '../CollectionProductCard/CollectionProductCard';

export type CollectionProductsGridProps = {
  collection?: CollectionQuery['collection'];
};

export default function CollectionProductsGrid({
  collection,
}: CollectionProductsGridProps) {
  if (!collection) return null;
  return (
    <Container px="5" py="9">
      <Grid gap="6">
        <h1 className="heading-2">{collection.title}</h1>

        <Grid columns={{initial: '2', sm: '4'}} gap="5">
          <PaginatedResourceSection connection={collection.products}>
            {({node: product, index}) => (
              <CollectionProductCard product={product} />
            )}
          </PaginatedResourceSection>
        </Grid>
      </Grid>
    </Container>
  );
}
