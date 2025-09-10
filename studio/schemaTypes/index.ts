import {page} from './documents/page';
import {blockContent} from './objects/blockContent';
import {callToAction} from './objects/callToAction';
import {collectionBlock} from './objects/collectionBlock';
import {link} from './objects/link';
import {mediaImage} from './objects/mediaImage';
import {settings} from './singletons/settings';
import {imageContentBlock} from './objects/imageContentBlock';
import {linkButton} from './objects/linkButton';
import {contentBlock} from './objects/contentBlock';
import {imageBlock} from './objects/imageBlock';
import {header} from './singletons/header';
import {footer} from './singletons/footer';
import announcementBar from './singletons/announcementBar';
import {menu} from './objects/menu';
import {faqBlock} from './objects/faqBlock';
import {ctaBlock} from './objects/ctaBlock';
import {homepage} from './singletons/homepage';
import {productPage} from './documents/productPage';
import {collectionPage} from './documents/collectionPage';
import {specialComponentBlock} from './objects/specialComponentBlock';
import {newsletterBlock} from './objects/newsletterBlock';
import {mediaVimeo} from './objects/mediaVimeo';
import {pageSection} from './objects/pageSection';
import {openGraph, globalOpenGraph} from './objects/openGraph';

export const schemaTypes = [
  // Singletons
  announcementBar,
  footer,
  header,
  homepage,
  settings,
  // Documents
  page,
  productPage,
  collectionPage,
  // Objects
  blockContent,
  callToAction,
  link,
  linkButton,
  mediaImage,
  mediaVimeo,
  menu,
  openGraph,
  globalOpenGraph,
  // Block Arrays + Blocks
  pageSection,
  collectionBlock,
  contentBlock,
  ctaBlock,
  faqBlock,
  imageBlock,
  imageContentBlock,
  newsletterBlock,
  specialComponentBlock,
];
