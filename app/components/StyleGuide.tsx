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
        <Flex direction="column" gap="4">
          <Flex gap="2" p="2">
            <Button label="Dark Solid" appearance="dark" variant="solid" />
            <Button label="Dark Outline" appearance="dark" variant="outline" />
            <Button label="Dark Round" appearance="dark" variant="round" />
            <Button label="Dark Text" appearance="dark" variant="text" />
          </Flex>
          <div style={{backgroundColor: 'var(--color-mills-river)'}}>
            <Flex gap="2" p="2">
              <Button label="Light Solid" appearance="light" variant="solid" />
              <Button
                label="Light Outline"
                appearance="light"
                variant="outline"
              />
              <Button label="Light Round" appearance="light" variant="round" />
              <Button label="Light Text" appearance="light" variant="text" />
            </Flex>
          </div>
        </Flex>
      </Section>
    </Container>
  );
}
