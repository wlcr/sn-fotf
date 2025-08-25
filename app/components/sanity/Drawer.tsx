import * as Dialog from '@radix-ui/react-dialog';
import { useDrawer } from './Drawer.provider';
import { X } from 'lucide-react';
import styles from './Drawer.module.css';
import { Box, IconButton, Theme } from '@radix-ui/themes';
import { LogoLink } from './LogoLink';

const Drawer = () => {
  const { isOpen, closeDrawer, drawerContent } =
    useDrawer();
  return (
    <Dialog.Root open={isOpen} onOpenChange={closeDrawer}>
      <Dialog.Portal>
        <Theme>
          <Dialog.Overlay
            className={styles.drawerOverlay}
          />
          <Dialog.Content className={styles.drawerContent}>
            <Box className={styles.drawerBody}>
              <Dialog.Title className={styles.drawerTitle}>
                <LogoLink />
              </Dialog.Title>
              {drawerContent}
            </Box>
            <Dialog.Close asChild>
              <IconButton
                className={styles.drawerClose}
                variant="outline"
                aria-label="Close"
                highContrast
              >
                <X size={20} />
              </IconButton>
            </Dialog.Close>
          </Dialog.Content>
        </Theme>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Drawer;
