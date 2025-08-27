/**
 * Sanity GROQ Queries
 *
 * Centralized location for all GROQ queries used in the Friends of the Family project.
 * These queries are separate from Hydrogen's GraphQL queries to maintain clean separation.
 *
 * Types generated from these queries will be available in studio/sanity.types.ts
 * after running: npm run sanity:codegen
 */

// Homepage query - matches the PR's homeQuery
export const homeQuery = `*[_type == "homepage"][0]{
  _id,
  _type,
  title,
  pageBuilder[]{
    _key,
    _type,
    // Content section fields
    _type == "contentSection" => {
      content,
      contentAlign,
      button {
        buttonText,
        link
      }
    },
    // Image content section fields  
    _type == "imageContentSection" => {
      content,
      contentAlign,
      sectionLayout,
      image,
      button {
        buttonText,
        link
      }
    },
    // Image section fields
    _type == "imageSection" => {
      image
    },
    // FAQ section fields
    _type == "faqSection" => {
      title,
      faqItems[]{
        _key,
        question,
        answer
      }
    },
    // Side by side CTA section
    _type == "sideBySideCta" => {
      sideA {
        heading,
        content,
        backgroundImage,
        link,
        buttonText
      },
      sideB {
        heading,
        content,
        backgroundImage,
        link,
        buttonText
      }
    }
  }
}` as const;

// Product decorator query - matches the PR's productDecoratorQuery
export const productDecoratorQuery =
  `*[_type == "productDecorator" && shopifyProduct.handle == $handle][0]{
  _id,
  _type,
  nameOverride,
  pageBuilder[]{
    _key,
    _type,
    // Same page builder structure as homepage
    _type == "contentSection" => {
      content,
      contentAlign,
      button {
        buttonText,
        link
      }
    },
    _type == "imageContentSection" => {
      content,
      contentAlign,
      sectionLayout,
      image,
      button {
        buttonText,
        link
      }
    },
    _type == "imageSection" => {
      image
    },
    _type == "faqSection" => {
      title,
      faqItems[]{
        _key,
        question,
        answer
      }
    },
    _type == "sideBySideCta" => {
      sideA {
        heading,
        content,
        backgroundImage,
        link,
        buttonText
      },
      sideB {
        heading,
        content,
        backgroundImage,
        link,
        buttonText
      }
    }
  }
}` as const;

// Site settings query - for global content
export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  _id,
  title,
  description,
  logo,
  favicon,
  socialMedia,
  membershipInfo {
    title,
    description,
    benefits[]
  }
}` as const;

// Navigation query - for site navigation
export const navigationQuery = `*[_type == "navigation"][0]{
  _id,
  mainNavigation[] {
    title,
    url,
    _type == "reference" => @->{
      title,
      "url": "/pages/" + slug.current
    }
  },
  memberNavigation[] {
    title,
    url,
    _type == "reference" => @->{
      title,  
      "url": "/pages/" + slug.current
    }
  },
  footerNavigation[] {
    title,
    url,
    _type == "reference" => @->{
      title,
      "url": "/pages/" + slug.current  
    }
  }
}` as const;
