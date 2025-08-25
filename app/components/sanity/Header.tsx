'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Box,
  Flex,
  IconButton,
  Text,
} from '@radix-ui/themes';
import { AudioWaveform, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { LogoLink } from './LogoLink';
import { useDrawer } from './Drawer.provider';
import Drawer from './Drawer';
import { Link as LinkType, Menu } from '@/sanity.types';
import ResolvedLink from './ResolvedLink';

interface HeaderProps {
  menu?: Menu;
  announcementBar?: {
    text?: string;
    link?: LinkType;
    enabled?: boolean;
  };
}

export function Header({
  menu,
  announcementBar,
}: HeaderProps) {
  const { openDrawer } = useDrawer();
  const handleOpenDrawer = () => {
    openDrawer(<NavMenu menu={menu} />);
  };

  return (
    <>
      {announcementBar?.enabled && (
        <Box className="announcement-bar" p="3">
          {announcementBar.link ? (
            <ResolvedLink link={announcementBar.link}>
              {announcementBar.text}
            </ResolvedLink>
          ) : (
            <Text>{announcementBar.text}</Text>
          )}
        </Box>
      )}
      <header className={clsx(['header', 'container'])}>
        <Flex justify="between" align="center">
          <IconButton
            variant="ghost"
            onClick={handleOpenDrawer}
          >
            <AudioWaveform size={32} />
          </IconButton>

          <LogoLink />

          <IconButton variant="ghost" asChild>
            <Link href="/events">
              <Calendar size={32} />
            </Link>
          </IconButton>
        </Flex>
      </header>
      <Drawer />
    </>
  );
}

type NavMenuProps = {
  menu?: Menu;
};

const NavMenu = ({ menu }: NavMenuProps) => {
  return (
    <Flex direction="column" gap="3" py="5" asChild>
      <Text as="div" size="7" asChild>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/events">All Events</Link>
          {menu &&
            menu.map((item) => (
              <ResolvedLink
                link={item.link}
                key={item._key}
              >
                {item.title}
              </ResolvedLink>
            ))}
        </nav>
      </Text>
    </Flex>
  );
};
