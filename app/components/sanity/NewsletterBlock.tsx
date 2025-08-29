import {NewsletterBlock} from '~/studio/sanity.types';

type NewsletterBlockProps = {
  block: NewsletterBlock;
};

export default function NewsletterSectionBlock({block}: NewsletterBlockProps) {
  if (!block?.klaviyoAccountId) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const email = (event.target as HTMLFormElement).email.value;
    // Handle newsletter subscription logic here
    console.log('submitting form to klaviyo account', block.klaviyoAccountId);
  };

  return (
    <>
      <h2 className="h2">Join our Newsletter</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
    </>
  );
}
