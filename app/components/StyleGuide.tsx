import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Section,
  Separator,
  Select,
  Tabs,
  Text,
} from '@radix-ui/themes';

export default function StyleGuide() {
  return (
    <Container size="4" py="6">
      <Heading size="8" mb="6">
        Style Guide
      </Heading>

      <Section size="3">
        <Heading size="6" mb="4">
          Typography
        </Heading>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Text Sizes
          </Heading>
          <Flex direction="column" gap="2">
            <Text size="1">
              Size 1 - The quick brown fox jumps over the lazy dog.
            </Text>
            <Text size="2">
              Size 2 - The quick brown fox jumps over the lazy dog.
            </Text>
            <Text size="3">
              Size 3 - The quick brown fox jumps over the lazy dog.
            </Text>
            <Text size="4">
              Size 4 - The quick brown fox jumps over the lazy dog.
            </Text>
            <Text size="5">
              Size 5 - The quick brown fox jumps over the lazy dog.
            </Text>
            <Text size="6">
              Size 6 - The quick brown fox jumps over the lazy dog.
            </Text>
            <Text size="7">
              Size 7 - The quick brown fox jumps over the lazy dog.
            </Text>
            <Text size="8">
              Size 8 - The quick brown fox jumps over the lazy dog.
            </Text>
            <Text size="9">
              Size 9 - The quick brown fox jumps over the lazy dog.
            </Text>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Text Weights
          </Heading>
          <Flex direction="column" gap="2">
            <Text weight="light">Light weight text</Text>
            <Text weight="regular">Regular weight text</Text>
            <Text weight="medium">Medium weight text</Text>
            <Text weight="bold">Bold weight text</Text>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Text Colors
          </Heading>
          <Flex direction="column" gap="2">
            <Text color="indigo">Indigo colored text</Text>
            <Text color="cyan">Cyan colored text</Text>
            <Text color="orange">Orange colored text</Text>
            <Text color="crimson">Crimson colored text</Text>
            <Text color="gray">Gray colored text</Text>
            <Text color="gray" highContrast>
              Gray high contrast text
            </Text>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Text Alignment
          </Heading>
          <Flex direction="column" gap="2">
            <Text align="left">Left aligned text</Text>
            <Text align="center">Center aligned text</Text>
            <Text align="right">Right aligned text</Text>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Text Elements
          </Heading>
          <Flex direction="column" gap="2">
            <Text as="p">
              This is a paragraph element with{' '}
              <Text weight="bold">bold text</Text> and{' '}
              <Text color="indigo">colored text</Text>.
            </Text>
            <Text as="label">This is a label element</Text>
            <Text as="div">This is a div element</Text>
            <Text as="span">This is a span element</Text>
          </Flex>
        </Card>
      </Section>

      <Separator size="4" my="6" />

      <Section size="3">
        <Heading size="6" mb="4">
          Headings
        </Heading>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Heading Sizes
          </Heading>
          <Flex direction="column" gap="3">
            <Heading size="1">Heading Size 1</Heading>
            <Heading size="2">Heading Size 2</Heading>
            <Heading size="3">Heading Size 3</Heading>
            <Heading size="4">Heading Size 4</Heading>
            <Heading size="5">Heading Size 5</Heading>
            <Heading size="6">Heading Size 6</Heading>
            <Heading size="7">Heading Size 7</Heading>
            <Heading size="8">Heading Size 8</Heading>
            <Heading size="9">Heading Size 9</Heading>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Heading Colors
          </Heading>
          <Flex direction="column" gap="3">
            <Heading size="4" color="indigo">
              Indigo Heading
            </Heading>
            <Heading size="4" color="cyan">
              Cyan Heading
            </Heading>
            <Heading size="4" color="orange">
              Orange Heading
            </Heading>
            <Heading size="4" color="crimson">
              Crimson Heading
            </Heading>
            <Heading size="4" color="gray">
              Gray Heading
            </Heading>
            <Heading size="4" color="gray" highContrast>
              Gray High Contrast Heading
            </Heading>
          </Flex>
        </Card>
      </Section>

      <Separator size="4" my="6" />

      <Section size="3">
        <Heading size="6" mb="4">
          Buttons
        </Heading>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Button Variants
          </Heading>
          <Flex gap="3" wrap="wrap">
            <Button variant="classic">Classic</Button>
            <Button variant="solid">Solid</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="surface">Surface</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Button Sizes
          </Heading>
          <Flex gap="3" align="center">
            <Button size="1" variant="soft">
              Size 1
            </Button>
            <Button size="2" variant="soft">
              Size 2
            </Button>
            <Button size="3" variant="soft">
              Size 3
            </Button>
            <Button size="4" variant="soft">
              Size 4
            </Button>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Button Colors
          </Heading>
          <Flex gap="3" wrap="wrap">
            <Button color="indigo" variant="soft">
              Indigo
            </Button>
            <Button color="cyan" variant="soft">
              Cyan
            </Button>
            <Button color="orange" variant="soft">
              Orange
            </Button>
            <Button color="crimson" variant="soft">
              Crimson
            </Button>
            <Button color="gray" variant="soft">
              Gray
            </Button>
          </Flex>
        </Card>
      </Section>

      <Separator size="4" my="6" />

      <Section size="3">
        <Heading size="6" mb="4">
          Tabs
        </Heading>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Basic Tabs
          </Heading>
          <Tabs.Root defaultValue="account">
            <Tabs.List>
              <Tabs.Trigger value="account">Account</Tabs.Trigger>
              <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="account">
                <Text size="2">Make changes to your account.</Text>
              </Tabs.Content>

              <Tabs.Content value="documents">
                <Text size="2">Access and update your documents.</Text>
              </Tabs.Content>

              <Tabs.Content value="settings">
                <Text size="2">
                  Edit your profile or update contact information.
                </Text>
              </Tabs.Content>
            </Box>
          </Tabs.Root>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Tab Sizes
          </Heading>
          <Flex direction="column" gap="4" pb="2">
            <Tabs.Root defaultValue="account">
              <Tabs.List size="1">
                <Tabs.Trigger value="account">Account</Tabs.Trigger>
                <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root defaultValue="account">
              <Tabs.List size="2">
                <Tabs.Trigger value="account">Account</Tabs.Trigger>
                <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Tab Colors
          </Heading>
          <Flex direction="column" gap="4" pb="2">
            <Tabs.Root defaultValue="account">
              <Tabs.List color="indigo">
                <Tabs.Trigger value="account">Account</Tabs.Trigger>
                <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root defaultValue="account">
              <Tabs.List color="cyan">
                <Tabs.Trigger value="account">Account</Tabs.Trigger>
                <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>

            <Tabs.Root defaultValue="account">
              <Tabs.List color="orange">
                <Tabs.Trigger value="account">Account</Tabs.Trigger>
                <Tabs.Trigger value="documents">Documents</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </Flex>
        </Card>
      </Section>

      <Separator size="4" my="6" />

      <Section size="3">
        <Heading size="6" mb="4">
          Separators
        </Heading>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Separator Sizes
          </Heading>
          <Flex direction="column" gap="4">
            <Separator orientation="horizontal" size="1" />
            <Separator orientation="horizontal" size="2" />
            <Separator orientation="horizontal" size="3" />
            <Separator orientation="horizontal" size="4" />
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Separator Colors
          </Heading>
          <Flex direction="column" gap="3">
            <Separator color="indigo" size="4" />
            <Separator color="cyan" size="4" />
            <Separator color="orange" size="4" />
            <Separator color="crimson" size="4" />
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Separator Orientation
          </Heading>
          <Flex align="center" gap="4" height="96px">
            <Separator orientation="horizontal" />
            <Separator orientation="vertical" />
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Separator in Context
          </Heading>
          <Text size="2">
            Tools for building high-quality, accessible UI.
            <Separator my="3" size="4" />
            <Flex gap="3" align="center">
              Themes
              <Separator orientation="vertical" />
              Primitives
              <Separator orientation="vertical" />
              Icons
              <Separator orientation="vertical" />
              Colors
            </Flex>
          </Text>
        </Card>
      </Section>

      <Separator size="4" my="6" />

      <Section size="3">
        <Heading size="6" mb="4">
          Select
        </Heading>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Basic Select
          </Heading>
          <Select.Root defaultValue="apple">
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Label>Fruits</Select.Label>
                <Select.Item value="orange">Orange</Select.Item>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="grape" disabled>
                  Grape
                </Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>Vegetables</Select.Label>
                <Select.Item value="carrot">Carrot</Select.Item>
                <Select.Item value="potato">Potato</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Select Variants
          </Heading>
          <Flex gap="3" wrap="wrap">
            <Select.Root defaultValue="apple">
              <Select.Trigger variant="classic" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root defaultValue="apple">
              <Select.Trigger variant="surface" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root defaultValue="apple">
              <Select.Trigger variant="soft" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root defaultValue="apple">
              <Select.Trigger variant="ghost" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Select Variants
          </Heading>
          <Flex gap="3" wrap="wrap">
            <Select.Root defaultValue="apple">
              <Select.Trigger variant="classic" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root defaultValue="apple">
              <Select.Trigger variant="surface" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root defaultValue="apple">
              <Select.Trigger variant="soft" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>

            <Select.Root defaultValue="apple">
              <Select.Trigger variant="ghost" />
              <Select.Content>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>
          </Flex>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Select with Placeholder
          </Heading>
          <Select.Root>
            <Select.Trigger placeholder="Pick a fruit" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Fruits</Select.Label>
                <Select.Item value="orange">Orange</Select.Item>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="grape" disabled>
                  Grape
                </Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>Vegetables</Select.Label>
                <Select.Item value="carrot">Carrot</Select.Item>
                <Select.Item value="potato">Potato</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Select with Placeholder
          </Heading>
          <Select.Root>
            <Select.Trigger placeholder="Pick a fruit" />
            <Select.Content>
              <Select.Group>
                <Select.Label>Fruits</Select.Label>
                <Select.Item value="orange">Orange</Select.Item>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="grape" disabled>
                  Grape
                </Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>Vegetables</Select.Label>
                <Select.Item value="carrot">Carrot</Select.Item>
                <Select.Item value="potato">Potato</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Card>
      </Section>

      <Separator size="4" my="6" />

      <Section size="3">
        <Heading size="6" mb="4">
          Layout Components
        </Heading>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Grid Layout
          </Heading>
          <Grid columns="3" gap="3">
            <Box p="3" style={{backgroundColor: 'var(--accent-3)'}}>
              <Text>Grid Item 1</Text>
            </Box>
            <Box p="3" style={{backgroundColor: 'var(--accent-3)'}}>
              <Text>Grid Item 2</Text>
            </Box>
            <Box p="3" style={{backgroundColor: 'var(--accent-3)'}}>
              <Text>Grid Item 3</Text>
            </Box>
          </Grid>
        </Card>

        <Card size="3" mb="6">
          <Heading size="5" mb="3">
            Flex Layout
          </Heading>
          <Flex gap="3" wrap="wrap">
            <Box p="3" style={{backgroundColor: 'var(--accent-3)'}}>
              <Text>Flex Item 1</Text>
            </Box>
            <Box p="3" style={{backgroundColor: 'var(--accent-3)'}}>
              <Text>Flex Item 2</Text>
            </Box>
            <Box p="3" style={{backgroundColor: 'var(--accent-3)'}}>
              <Text>Flex Item 3</Text>
            </Box>
          </Flex>
        </Card>
      </Section>
    </Container>
  );
}
