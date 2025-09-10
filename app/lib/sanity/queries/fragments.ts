import groq from 'groq';

export const linkReference = groq`
  {
    "home": '/',
    "page": page->slug.current,
    "productPage": productPage->slug.current,
  }
`;

export const linkFields = groq`
  link {
    ...,
    _type == "link" => {
      "home": '/',
      "page": page->slug.current,
      "productPage": productPage->slug.current,
    }
  }
`;

export const portableText = groq`
  {
    ...,
    markDefs[]{
      ...,
      _type == "link" => ${linkReference}
    }
  }
`;

export const sectionsFragment = groq`
  {
    ...,
    _type == "imageContentSection" => {
      image{
        ...,
        ${linkFields}
      },
      content[]${portableText},
      button{
        ...,
        ${linkFields}
      }
    },
    _type == "imageSection" => {
      image{
        ...,
        ${linkFields}
      }
    },
    _type == "contentSection" => {
      content[]${portableText},
      button{
        ...,
        ${linkFields}
      }
    },
    _type == "faqSection" => {
      faqItems[]{
        ...,
        answer[]${portableText}
      }
    }
  }
`;
