import groq from 'groq'

export const linkReference = groq`
  _type == "link" => {
    "page": page->slug.current,
    "product": product->slug.current,
  }
`

export const linkFields = groq`
  link {
    ...,
    ${linkReference}
  }
`

export const portableText = groq`
  {
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  }
`

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
`
