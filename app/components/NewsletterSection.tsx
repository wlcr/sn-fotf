import {useState} from 'react';
import type {NewsletterSection as NewsletterSectionType} from '~/types/sanity';

type NewsletterSectionProps = {
  section?: NewsletterSectionType;
};

export default function NewsletterSection({section}: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  if (!section?.klaviyoAccountId) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // const email = (event.target as HTMLFormElement).email.value;
    console.log(
      `Submitting email, ${email}, to Klaviyo account: ${section.klaviyoAccountId}`,
    );
    setTimeout(() => setSuccess(true), 1000);
  };

  return success ? (
    <h2>Thank you for subscribing!</h2>
  ) : (
    <>
      <h2 className="h2">Join our Newsletter</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={!email}>
          Subscribe
        </button>
      </form>
    </>
  );
}
