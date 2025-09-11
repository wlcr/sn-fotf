import {
  Box,
  Card,
  Container,
  Flex,
  Grid,
  Section,
  Theme,
} from '@radix-ui/themes';
import Button from './Button/Button';

export default function StyleGuide() {
  return (
    <Container size="4" py="6" px="6">
      <Section>
        <Flex direction="column" gap="6">
          <Flex direction="column" gap="3">
            <div className="body">Body Text - Gotham Book Regular</div>
            <div className="body-large">
              Body Large Text - Gotham Book Regular
            </div>
            <div className="body-default">
              Body Default Text - Gotham Book Regular
            </div>
            <div className="body-small">
              Body Small Text - Gotham Book Regular
            </div>
          </Flex>

          <Flex direction="column" gap="3">
            <div className="heading">Heading - Nevada</div>
            <div className="heading-1">Heading 1 - Nevada</div>
            <div className="heading-2">Heading 2 - Nevada</div>
            <div className="heading-3">Heading 3 - Nevada</div>
            <div className="heading-4">Heading 4 - Nevada</div>
            <div className="heading-5">Heading 5 - Nevada</div>
            <div className="heading-6">Heading 6 - Nevada</div>
          </Flex>

          <Flex direction="column" gap="3">
            <div className="accent">Accent Text - Liberator Medium</div>
          </Flex>

          <Flex direction="column" gap="4" wrap="wrap">
            <Flex gap="2" p="2">
              <Button appearance="dark" variant="solid">
                Dark Solid
              </Button>
              <Button appearance="dark" variant="outline">
                Dark Outline
              </Button>
              <Button appearance="dark" variant="round">
                Dark Round
              </Button>
              <Button appearance="dark" variant="text">
                Dark Text
              </Button>
            </Flex>
            <div style={{backgroundColor: 'var(--color-mills-river)'}}>
              <Flex gap="2" p="2" wrap="wrap">
                <Button appearance="light" variant="solid">
                  Light Solid
                </Button>
                <Button appearance="light" variant="outline">
                  Light Outline
                </Button>
                <Button appearance="light" variant="round">
                  Light Round
                </Button>
                <Button appearance="light" variant="text">
                  Light Text
                </Button>
                <Button appearance="light" variant="round-outline">
                  Light Round Outline
                </Button>
              </Flex>
            </div>
          </Flex>
        </Flex>
      </Section>
    </Container>
  );
}
