import groq from 'groq';

export const linkReference = groq`
  {
    "page": page->slug.current,
    "product": product->slug.current,
  }
`;

export const linkFields = groq`
  link {
    ...,
    _type == "link" => {
      "page": page->slug.current,
      "product": product->slug.current,
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
  pageBuilder[]{
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
    },
    _type == "sideBySideCta" => {
      sideA{
        ...,
        content[]${portableText},
        ${linkFields}
      },
      sideB{
        ...,
        content[]${portableText},
        ${linkFields}
      }
    }
  }
`;
