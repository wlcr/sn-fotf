import {Container, Grid} from '@radix-ui/themes';
import {CollectionQuery} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '../PaginatedResourceSection';
import {ProductItem} from '../ProductItem';

export type MembershipsProductGridProps = {
  collection?: CollectionQuery['collection'];
};

export default function MembershipsProductGrid({
  collection,
}: MembershipsProductGridProps) {
  if (!collection) return null;
  return (
    <Container>
      <Grid>
        <h1 className="h1">{collection.title}</h1>
        <Grid columns="2" asChild>
          <PaginatedResourceSection
            connection={collection.products}
            resourcesClassName="products-grid"
          >
            {({node: product, index}) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            )}
          </PaginatedResourceSection>
        </Grid>
      </Grid>
    </Container>
  );
}
