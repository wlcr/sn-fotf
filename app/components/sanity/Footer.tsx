'use client';

import * as Form from '@radix-ui/react-form';
import * as Label from '@radix-ui/react-label';
import {
  Flex,
  Text,
  VisuallyHidden,
} from '@radix-ui/themes';
import { LogoLink } from './LogoLink';
import Link from 'next/link';
import { clsx } from 'clsx';
import { getSquadUpLinks } from '@wlcr/make-some-noise/core';

export function Footer() {
  const squadUpLinks = getSquadUpLinks();

  return (
    <footer className={clsx(['footer', 'container'])}>
      <Flex direction="column" align="center" gap="5">
        <LogoLink />
        {/* Newsletter form using RadixUI Form */}
        <Form.Root
          style={{ width: '100%', maxWidth: 400 }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Form.Field
            name="email"
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <Label.Root htmlFor="newsletter-email" asChild>
              <VisuallyHidden>
                Email for newsletter
              </VisuallyHidden>
            </Label.Root>
            <Form.Control asChild>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email for updates"
                required
                style={{
                  flex: 1,
                  padding: '0.5rem 1rem',
                  border: '1px solid #ddd',
                  borderRadius: 6,
                  fontSize: 16,
                  outline: 'none',
                }}
              />
            </Form.Control>
            <Form.Submit asChild>
              <button
                type="submit"
                style={{
                  padding: '0.5rem 1.25rem',
                  background: '#111',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer',
                }}
              >
                Sign Up
              </button>
            </Form.Submit>
          </Form.Field>
        </Form.Root>
        <Flex align="center" gap="3">
          <Text as="span" color="gray" size="2">
            &copy; {new Date().getFullYear()} MakeSomeNoise.
          </Text>
          <Text as="span" color="gray" size="2">
            All rights reserved.
          </Text>
          <Link
            href={squadUpLinks.privacyPolicy}
            target="_blank"
          >
            <Text as="span" color="gray" size="2">
              Privacy Policy
            </Text>
          </Link>
          <Link
            href={squadUpLinks.termsOfService}
            target="_blank"
          >
            <Text as="span" color="gray" size="2">
              Terms of Service
            </Text>
          </Link>
        </Flex>
      </Flex>
    </footer>
  );
}
