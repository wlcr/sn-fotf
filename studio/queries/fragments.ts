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

export const pageBuilder = groq`
  {
    ...,
    _type == "imageContentBlock" => {
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
    _type == "imageBlock" => {
      image{
        ...,
        ${linkFields}
      }
    },
    _type == "contentBlock" => {
      content[]${portableText},
      button{
        ...,
        ${linkFields}
      }
    },
    _type == "faqBlock" => {
      faqItems[]{
        ...,
        answer[]${portableText}
      }
    },
    _type == "ctaBlock" => {
      ctas[]{
        ...,
        content[]${portableText},
        button{
          ...,
          ${linkFields}
        }
      }
    }
  }
`;
