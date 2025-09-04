import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  Flex,
  Grid,
  Heading,
  Section,
  Separator,
  Select,
  Tabs,
  Text,
} from '@radix-ui/themes';
import ThemeMillsRiverDark from '../components/Themes/ThemeMillsRiverDark';

export default function StyleGuide() {
  return (
    <>
      <Container size="4" py="6" px="6">
        <Heading size="8" mb="6">
          Style Guide
        </Heading>

        <Section size="1">
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

        <Section size="1">
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
        </Section>

        <Section size="1">
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
        </Section>

        <Section size="1">
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
        </Section>

        <Section size="1">
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
        </Section>

        <Section size="1">
          <Heading size="6" mb="4">
            Dialog
          </Heading>

          <Card size="3" mb="6">
            <Heading size="5" mb="3">
              Basic Dialog
            </Heading>
            <Dialog.Root>
              <Dialog.Trigger>
                <Button>Edit profile</Button>
              </Dialog.Trigger>

              <Dialog.Content maxWidth="450px">
                <Dialog.Title>Edit profile</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                  Make changes to your profile.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Name
                    </Text>
                    <Text size="2" color="gray">
                      Freja Johnsen
                    </Text>
                  </Box>
                  <Box>
                    <Text as="div" size="2" mb="1" weight="bold">
                      Email
                    </Text>
                    <Text size="2" color="gray">
                      freja@example.com
                    </Text>
                  </Box>
                </Flex>

                <Flex gap="3" mt="4" justify="end">
                  <Dialog.Close>
                    <Button variant="soft" color="gray">
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button>Save</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
          </Card>

          <Card size="3" mb="6">
            <Heading size="5" mb="3">
              Dialog Sizes
            </Heading>
            <Flex gap="4" align="center">
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant="soft">Size 1</Button>
                </Dialog.Trigger>
                <Dialog.Content size="1" maxWidth="300px">
                  <Text as="p" trim="both" size="1">
                    The quick brown fox jumps over the lazy dog.
                  </Text>
                </Dialog.Content>
              </Dialog.Root>

              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant="soft">Size 2</Button>
                </Dialog.Trigger>
                <Dialog.Content size="2" maxWidth="400px">
                  <Text as="p" trim="both" size="2">
                    The quick brown fox jumps over the lazy dog.
                  </Text>
                </Dialog.Content>
              </Dialog.Root>

              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant="soft">Size 3</Button>
                </Dialog.Trigger>
                <Dialog.Content size="3" maxWidth="500px">
                  <Text as="p" trim="both" size="3">
                    The quick brown fox jumps over the lazy dog.
                  </Text>
                </Dialog.Content>
              </Dialog.Root>

              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant="soft">Size 4</Button>
                </Dialog.Trigger>
                <Dialog.Content size="4">
                  <Text as="p" trim="both" size="4">
                    The quick brown fox jumps over the lazy dog.
                  </Text>
                </Dialog.Content>
              </Dialog.Root>
            </Flex>
          </Card>
        </Section>
      </Container>

      <ThemeMillsRiverDark>
        <Container size="4" py="6" px="6">
          <Section>
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
          </Section>
          <Section size="1">
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
          </Section>
          <Section size="1">
            <Heading size="6" mb="4">
              Dialog
            </Heading>

            <Card size="3" mb="6">
              <Heading size="5" mb="3">
                Basic Dialog
              </Heading>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button>Edit profile</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                  <Dialog.Title>Edit profile</Dialog.Title>
                  <Dialog.Description size="2" mb="4">
                    Make changes to your profile.
                  </Dialog.Description>

                  <Flex direction="column" gap="3">
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Name
                      </Text>
                      <Text size="2" color="gray">
                        Freja Johnsen
                      </Text>
                    </Box>
                    <Box>
                      <Text as="div" size="2" mb="1" weight="bold">
                        Email
                      </Text>
                      <Text size="2" color="gray">
                        freja@example.com
                      </Text>
                    </Box>
                  </Flex>

                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button>Save</Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </Card>

            <Card size="3" mb="6">
              <Heading size="5" mb="3">
                Dialog Sizes
              </Heading>
              <Flex gap="4" align="center">
                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft">Size 1</Button>
                  </Dialog.Trigger>
                  <Dialog.Content size="1" maxWidth="300px">
                    <Text as="p" trim="both" size="1">
                      The quick brown fox jumps over the lazy dog.
                    </Text>
                  </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft">Size 2</Button>
                  </Dialog.Trigger>
                  <Dialog.Content size="2" maxWidth="400px">
                    <Text as="p" trim="both" size="2">
                      The quick brown fox jumps over the lazy dog.
                    </Text>
                  </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft">Size 3</Button>
                  </Dialog.Trigger>
                  <Dialog.Content size="3" maxWidth="500px">
                    <Text as="p" trim="both" size="3">
                      The quick brown fox jumps over the lazy dog.
                    </Text>
                  </Dialog.Content>
                </Dialog.Root>

                <Dialog.Root>
                  <Dialog.Trigger>
                    <Button variant="soft">Size 4</Button>
                  </Dialog.Trigger>
                  <Dialog.Content size="4">
                    <Text as="p" trim="both" size="4">
                      The quick brown fox jumps over the lazy dog.
                    </Text>
                  </Dialog.Content>
                </Dialog.Root>
              </Flex>
            </Card>
          </Section>
        </Container>
      </ThemeMillsRiverDark>
    </>
  );
}
