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

export const pageBuilder = groq`
  pageBuilder[]{
    ...,
    _type == "imageContentSection" => {
      button{
        ...,
        ${linkFields}
      },
      content[]{
        ...,
        markDefs[]{
          ...,
          ${linkReference}
        }
      },
      image{
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
      button{
        ...,
        ${linkFields}
      },
      content[]{
        ...,
        markDefs[]{
          ...,
          ${linkReference}
        }
      }
    },
    _type == "faqSection" => {
      faqItems[]{
        question,
        answer,
        hidden
      }
    }
  }
`
