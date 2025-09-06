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
            <div className="heading">Heading - ABC Arizona Flare</div>
            <div className="heading-1">Heading 1 - ABC Arizona Flare</div>
            <div className="heading-2">Heading 2 - ABC Arizona Flare</div>
            <div className="heading-3">Heading 3 - ABC Arizona Flare</div>
            <div className="heading-4">Heading 4 - ABC Arizona Flare</div>
            <div className="heading-5">Heading 5 - ABC Arizona Flare</div>
            <div className="heading-6">Heading 6 - ABC Arizona Flare</div>
          </Flex>

          <Flex direction="column" gap="3">
            <div className="accent">Accent Text - Liberator Medium</div>
          </Flex>

          <Flex direction="column" gap="4" wrap="wrap">
            <Flex gap="2" p="2">
              <Button label="Dark Solid" appearance="dark" variant="solid" />
              <Button
                label="Dark Outline"
                appearance="dark"
                variant="outline"
              />
              <Button label="Dark Round" appearance="dark" variant="round" />
              <Button label="Dark Text" appearance="dark" variant="text" />
            </Flex>
            <div style={{backgroundColor: 'var(--color-mills-river)'}}>
              <Flex gap="2" p="2" wrap="wrap">
                <Button
                  label="Light Solid"
                  appearance="light"
                  variant="solid"
                />
                <Button
                  label="Light Outline"
                  appearance="light"
                  variant="outline"
                />
                <Button
                  label="Light Round"
                  appearance="light"
                  variant="round"
                />
                <Button label="Light Text" appearance="light" variant="text" />
                <Button
                  label="Light Round Outline"
                  appearance="light"
                  variant="round-outline"
                />
              </Flex>
            </div>
          </Flex>
        </Flex>
      </Section>
    </Container>
  );
}
