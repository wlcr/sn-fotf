import React from 'react';
import {Stack, Text, Card, Flex, Badge} from '@sanity/ui';
import {
  InfoOutlineIcon,
  WarningOutlineIcon,
  ErrorOutlineIcon,
} from '@sanity/icons';

interface SeoImpactPreviewProps {
  strategy: 'marketing' | 'private' | 'homepage_only' | 'custom';
  emergencyMode?: boolean;
  siteDiscoverable?: boolean;
  allowRobotsCrawling?: boolean;
}

const strategyConfigs = {
  marketing: {
    title: 'Marketing Mode Active',
    description:
      'Perfect for member acquisition. Shows exclusive products to attract new members while protecting member privacy.',
    visible: ['Homepage', 'Products', 'Collections', 'Future blog'],
    hidden: ['Account pages', 'Cart/Checkout', 'Member sections'],
    risk: 'low' as const,
    icon: InfoOutlineIcon,
    recommendation: 'RECOMMENDED for growing membership',
  },
  private: {
    title: 'Private Mode Active',
    description:
      'Complete privacy. Members find you through direct channels only.',
    visible: ['Nothing - complete privacy'],
    hidden: ['Everything'],
    risk: 'high' as const,
    icon: ErrorOutlineIcon,
    recommendation: 'CAUTION: No organic discovery',
  },
  homepage_only: {
    title: 'Homepage Only Mode Active',
    description:
      'Minimal visibility. Only landing page visible for member acquisition.',
    visible: ['Homepage only'],
    hidden: ['All products', 'All collections', 'Everything else'],
    risk: 'medium' as const,
    icon: WarningOutlineIcon,
    recommendation: 'LIMITED: Reduces discovery potential',
  },
  custom: {
    title: 'Custom Configuration Active',
    description: 'Advanced mode using technical controls below.',
    visible: ['Depends on settings'],
    hidden: ['Configure below'],
    risk: 'medium' as const,
    icon: WarningOutlineIcon,
    recommendation: 'ADVANCED: Requires SEO knowledge',
  },
};

const riskColors = {
  low: {bg: '#f0f9f0', border: '#4caf50', text: '#2e7d32'},
  medium: {bg: '#fff8e1', border: '#ff9800', text: '#f57c00'},
  high: {bg: '#ffebee', border: '#f44336', text: '#d32f2f'},
};

export function SeoImpactPreview({
  strategy,
  emergencyMode,
  siteDiscoverable,
  allowRobotsCrawling,
}: SeoImpactPreviewProps) {
  // Emergency mode overrides everything
  if (emergencyMode) {
    return (
      <Card
        padding={3}
        radius={2}
        style={{
          background: '#ffebee',
          border: '2px solid #f44336',
        }}
      >
        <Stack space={2}>
          <Flex align="center" gap={2}>
            <ErrorOutlineIcon style={{color: '#d32f2f'}} />
            <Text weight="bold" style={{color: '#d32f2f'}}>
              🚨 EMERGENCY MODE ACTIVE
            </Text>
          </Flex>
          <Text size={1}>
            🔒 Everything is hidden from Google immediately. Use this only for
            urgent privacy needs.
          </Text>
          <Text size={1} style={{color: '#666'}}>
            ⏱️ Google removal: 1-3 days | Impact: Immediate privacy, hurts SEO
            recovery
          </Text>
        </Stack>
      </Card>
    );
  }

  const config = strategyConfigs[strategy];
  const colors = riskColors[config.risk];

  // For custom mode, adjust based on actual settings
  let effectiveVisible = config.visible;
  let effectiveHidden = config.hidden;

  if (strategy === 'custom') {
    if (!siteDiscoverable) {
      effectiveVisible = ['Nothing - indexing disabled'];
      effectiveHidden = ['Everything'];
    } else if (!allowRobotsCrawling) {
      effectiveVisible = ['Homepage only'];
      effectiveHidden = ['All other pages blocked'];
    } else {
      effectiveVisible = ['All pages'];
      effectiveHidden = ['Only private areas (cart, account, etc.)'];
    }
  }

  const IconComponent = config.icon;

  return (
    <Card
      padding={3}
      radius={2}
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Stack space={3}>
        <Flex align="center" gap={2}>
          <IconComponent style={{color: colors.text}} />
          <Text weight="bold" style={{color: colors.text}}>
            {config.title}
          </Text>
          <Badge
            mode="outline"
            tone={
              config.risk === 'low'
                ? 'positive'
                : config.risk === 'high'
                  ? 'critical'
                  : 'caution'
            }
          >
            {config.recommendation}
          </Badge>
        </Flex>

        <Text size={1} weight="medium">
          {config.description}
        </Text>

        <Flex gap={4}>
          <Stack flex={1} space={1}>
            <Text size={1} weight="bold" style={{color: '#2e7d32'}}>
              ✅ Visible to Google:
            </Text>
            <Text size={1}>{effectiveVisible.join(', ')}</Text>
          </Stack>

          <Stack flex={1} space={1}>
            <Text size={1} weight="bold" style={{color: '#d32f2f'}}>
              🔒 Hidden from Google:
            </Text>
            <Text size={1}>{effectiveHidden.join(', ')}</Text>
          </Stack>
        </Flex>

        <Text size={0} style={{color: '#666', fontStyle: 'italic'}}>
          ⏱️ Changes take effect: Immediately | Google reflects changes: 1-7
          days
        </Text>
      </Stack>
    </Card>
  );
}
