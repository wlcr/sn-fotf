import {page} from './documents/page'
import {blockContent} from './objects/blockContent'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {link} from './objects/link'
import {mediaImage} from './objects/mediaImage'
import {settings} from './singletons/settings'
import {imageContentSection} from './objects/imageContentSection'
import {linkButton} from './objects/linkButton'
import {contentSection} from './objects/contentSection'
import {imageSection} from './objects/imageSection'
import {header} from './singletons/header'
import {footer} from './singletons/footer'
import {menu} from './objects/menu'
import faqSection from './objects/faqSection'
import {productDecorator} from './documents/productDecorator'
import {sideBySideCta} from './objects/sideBySideCTA'
import {homepage} from './singletons/homepage'
import {productPage} from './documents/productPage'

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
  menu,
  sideBySideCta,
  // Sections
  contentSection,
  faqSection,
  imageSection,
  imageContentSection,
  infoSection,
]
