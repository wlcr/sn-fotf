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

export default function StyleGuide() {
  return (
    <Container size="4" py="6" px="6">
      <Section>
        <div>
          <div className="body">Body Text</div>
          <div className="body-large">Body Large Text</div>
          <div className="body-default">Body Default Text</div>
          <div className="body-small">Body Small Text</div>
          <div className="heading">Heading</div>
          <div className="heading-1">Heading 1</div>
          <div className="heading-2">Heading 2</div>
          <div className="heading-3">Heading 3</div>
          <div className="heading-4">Heading 4</div>
          <div className="heading-5">Heading 5</div>
          <div className="heading-6">Heading 6</div>
          <div className="accent">Accent Text</div>
        </div>
      </Section>
    </Container>
  );
}
