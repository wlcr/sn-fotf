import {Container, Grid} from '@radix-ui/themes';
import {CollectionQuery} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '../PaginatedResourceSection';
import MembershipProductCard from '../MembershipProductCard/MembershipProductCard';

export type MembershipsProductGridProps = {
  collection?: CollectionQuery['collection'];
};

export default function MembershipsProductGrid({
  collection,
}: MembershipsProductGridProps) {
  if (!collection) return null;
  return (
    <Container px="5" py="9">
      <Grid gap="6">
        <h1 className="heading-2">{collection.title}</h1>

        <Grid columns={{initial: '1', sm: '2'}} gap="5">
          <PaginatedResourceSection connection={collection.products}>
            {({node: product, index}) => (
              <MembershipProductCard product={product} />
            )}
          </PaginatedResourceSection>
        </Grid>
      </Grid>
    </Container>
  );
}
