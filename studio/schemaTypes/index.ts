import {page} from './documents/page';
import {blockContent} from './objects/blockContent';
import {callToAction} from './objects/callToAction';
import {link} from './objects/link';
import {mediaImage} from './objects/mediaImage';
import {settings} from './singletons/settings';
import {imageContentBlock} from './objects/imageContentBlock';
import {linkButton} from './objects/linkButton';
import {contentBlock} from './objects/contentBlock';
import {imageBlock} from './objects/imageBlock';
import {header} from './singletons/header';
import {footer} from './singletons/footer';
import {menu} from './objects/menu';
import {faqBlock} from './objects/faqBlock';
import {productDecorator} from './documents/productDecorator';
import {ctaBlock} from './objects/ctaBlock';
import {homepage} from './singletons/homepage';
import {productPage} from './documents/productPage';
import {specialComponentBlock} from './objects/specialComponentBlock';
import {newsletterBlock} from './objects/newsletterBlock';
import {mediaVimeo} from './objects/mediaVimeo';
import {pageSection} from './objects/pageSection';

export const schemaTypes = [
  // Singletons
  footer,
  header,
  homepage,
  settings,
  // Documents
  page,
  productPage,
  productDecorator,
  // Objects
  blockContent,
  callToAction,
  link,
  linkButton,
  mediaImage,
  mediaVimeo,
  menu,
  // Block Arrays + Blocks
  pageSection,
  contentBlock,
  ctaBlock,
  faqBlock,
  imageBlock,
  imageContentBlock,
  newsletterBlock,
  specialComponentBlock,
];
