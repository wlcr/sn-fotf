import React, {useState} from 'react';
import {Card, Button, Stack, Text, Flex, Box, Spinner} from '@sanity/ui';
import {
  ChartUpwardIcon,
  WarningOutlineIcon,
  CheckmarkIcon,
} from '@sanity/icons';

/**
 * SEO Testing Tool for Sanity Studio
 *
 * This tool provides content managers with an easy way to test their site's
 * SEO implementation directly from the Studio interface. It leverages the
 * embedded setup for same-origin API calls to avoid CORS issues.
 */

interface SeoTestResult {
  score: number;
  categories: Record<string, {score: number; maxScore: number}>;
  recommendations: string[];
  timestamp: string;
  settingsUsed?: {
    seoStrategy: string;
    emergencyMode: boolean;
  };
}

interface SeoTestError {
  error: string;
}

export default function SeoTestingTool() {
  const [results, setResults] = useState<SeoTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSeoTest = async () => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // This works because studio is embedded - same origin!
      const response = await fetch('/studio/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: window.location.origin,
          testType: 'full',
        }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({
          error: `HTTP ${response.status}: ${response.statusText}`,
        }))) as SeoTestError;
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = (await response.json()) as SeoTestResult;
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SEO test failed');
      console.error('SEO test error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Flex align="center" gap={2}>
          <ChartUpwardIcon />
          <Text size={3} weight="bold">
            SEO Testing & Analysis
          </Text>
        </Flex>

        <Text size={1} muted>
          Test your site&apos;s SEO implementation and get actionable
          recommendations. This analyzes your current SEO strategy settings and
          provides specific guidance for improving search engine visibility.
        </Text>

        <Button
          onClick={runSeoTest}
          disabled={isLoading}
          tone="primary"
          mode="default"
          text={isLoading ? 'Running Tests...' : 'Run Full SEO Test'}
          icon={isLoading ? Spinner : ChartUpwardIcon}
        />

        {error && (
          <Card tone="critical" padding={3} border>
            <Flex align="flex-start" gap={2}>
              <Box paddingTop={1}>
                <WarningOutlineIcon />
              </Box>
              <Stack space={2}>
                <Text size={1} weight="semibold">
                  Test Failed
                </Text>
                <Text size={1}>{error}</Text>
                <Text size={0} muted>
                  Make sure your development server is running and try again.
                </Text>
              </Stack>
            </Flex>
          </Card>
        )}

        {results && <SeoScorecard results={results} />}
      </Stack>
    </Card>
  );
}

/**
 * SEO Scorecard Component
 *
 * Displays test results in a user-friendly format with color-coded scores
 * and actionable recommendations.
 */
interface SeoScorecardProps {
  results: SeoTestResult;
}

function SeoScorecard({results}: SeoScorecardProps) {
  const getScoreColor = (
    score: number,
  ): 'positive' | 'caution' | 'critical' => {
    if (score >= 90) return 'positive';
    if (score >= 70) return 'caution';
    return 'critical';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return CheckmarkIcon;
    if (score >= 70) return WarningOutlineIcon;
    return WarningOutlineIcon;
  };

  const ScoreIcon = getScoreIcon(results.score);

  return (
    <Card tone={getScoreColor(results.score)} padding={4} border>
      <Stack space={4}>
        {/* Overall Score */}
        <Flex align="center" gap={3}>
          <ScoreIcon />
          <Text size={4} weight="bold">
            SEO Score: {results.score}/100
          </Text>
        </Flex>

        {/* Current Settings */}
        {results.settingsUsed && (
          <Card padding={3} tone="transparent" border>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Current SEO Strategy:
              </Text>
              <Flex gap={4}>
                <Text size={1}>
                  <strong>Mode:</strong> {results.settingsUsed.seoStrategy}
                </Text>
                {results.settingsUsed.emergencyMode && (
                  <Text size={1}>
                    <strong>🚨 Emergency Mode Active</strong>
                  </Text>
                )}
              </Flex>
            </Stack>
          </Card>
        )}

        {/* Category Breakdown */}
        <Stack space={3}>
          <Text size={2} weight="semibold">
            Category Breakdown:
          </Text>
          <Stack space={2}>
            {Object.entries(results.categories).map(([category, data]) => {
              const percentage = Math.round((data.score / data.maxScore) * 100);
              const categoryTone = getScoreColor(percentage);

              return (
                <Card key={category} padding={2} tone="transparent" border>
                  <Flex justify="space-between" align="center">
                    <Text size={1} weight="medium">
                      {category
                        .replace(/([A-Z])/g, ' $1')
                        .replace(/^./, (str) => str.toUpperCase())}
                    </Text>
                    <Flex align="center" gap={2}>
                      <Text size={1} weight="semibold">
                        {data.score}/{data.maxScore}
                      </Text>
                      <Text size={0} muted>
                        ({percentage}%)
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </Stack>
        </Stack>

        {/* Recommendations */}
        {results.recommendations.length > 0 && (
          <Stack space={3}>
            <Text size={2} weight="semibold">
              Recommendations:
            </Text>
            <Stack space={2}>
              {results.recommendations.map((rec) => (
                <Card key={rec} padding={3} tone="primary" border>
                  <Text size={1}>💡 {rec}</Text>
                </Card>
              ))}
            </Stack>
          </Stack>
        )}

        {/* Test Metadata */}
        <Box paddingTop={3}>
          <Text size={0} muted>
            Last tested: {new Date(results.timestamp).toLocaleString()}
          </Text>
        </Box>
      </Stack>
    </Card>
  );
}
