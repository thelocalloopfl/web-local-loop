import type { Metadata } from "next";
import LegalLayout from "../legal/LegalLayout";

const UPDATED = "August 31, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How The Local Loop FL collects, uses, and protects your information when you use our website, newsletter, and services.",
  alternates: { canonical: "https://thelocalloopfl.com/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated={UPDATED}>
      <p>
        This Privacy Policy explains how The Local Loop FL (&quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) collects, uses, and shares information about you when you visit{" "}
        <a href="https://thelocalloopfl.com">thelocalloopfl.com</a> (the &quot;Site&quot;),
        subscribe to our newsletter, create an account, contact us, submit an event, or
        purchase a business partnership.
      </p>

      <h2>Information We Collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Newsletter signup:</strong> your email address, submitted through our
          newsletter provider, Beehiiv.
        </li>
        <li>
          <strong>Account registration:</strong> your name, email address, phone number,
          and a password (passwords are stored only in hashed form).
        </li>
        <li>
          <strong>Contact, advertising, and event-submission forms:</strong> your name,
          email address, phone number, business details, and the content of your message.
        </li>
        <li>
          <strong>Purchases:</strong> when you buy a business partnership or a shop item,
          payment is processed by Stripe. We do not receive or store your full card
          number; we receive a confirmation, the plan or items purchased, and limited
          billing details.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Analytics:</strong> we use Google Analytics to understand how visitors
          use the Site (pages viewed, approximate location, device and browser type,
          referring site). This uses cookies and similar technologies.
        </li>
        <li>
          <strong>Security:</strong> some forms use Google reCAPTCHA to prevent spam and
          abuse, which is subject to the{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google Privacy Policy
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
            Terms of Service
          </a>
          .
        </li>
        <li>
          <strong>Server logs:</strong> our hosting provider (Vercel) automatically logs
          IP addresses and request metadata for reliability and abuse prevention.
        </li>
      </ul>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To send the newsletter and content you asked for.</li>
        <li>To create and maintain your account and keep you signed in.</li>
        <li>To respond to your messages and process event or business submissions.</li>
        <li>To process payments and provide the business partnership you purchased.</li>
        <li>To measure and improve the Site and understand our audience in aggregate.</li>
        <li>To protect the Site against fraud, spam, and abuse, and to comply with law.</li>
      </ul>

      <h2>How Your Information Is Shared</h2>
      <p>
        We do not sell your personal information. We share information only with service
        providers that operate the Site on our behalf, including:
      </p>
      <ul>
        <li>Beehiiv (newsletter delivery)</li>
        <li>Stripe (payment processing)</li>
        <li>Google Analytics and Google reCAPTCHA (analytics and spam prevention)</li>
        <li>Sanity (content management)</li>
        <li>Vercel (website hosting)</li>
        <li>Our email provider (transactional and support email)</li>
      </ul>
      <p>
        We may also disclose information if required by law or to protect the rights,
        safety, or property of The Local Loop FL, our users, or the public.
      </p>

      <h2>Cookies and Your Choices</h2>
      <ul>
        <li>
          Most browsers let you refuse or delete cookies. Blocking analytics cookies will
          not affect your ability to read content or subscribe.
        </li>
        <li>
          You can unsubscribe from the newsletter at any time using the link in any email.
        </li>
        <li>
          You can opt out of Google Analytics using the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </li>
      </ul>

      <h2>Your Rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, or delete
        the personal information we hold about you, or to object to certain processing. To
        make a request, contact us at{" "}
        <a href="mailto:hello@thelocalloopfl.com">hello@thelocalloopfl.com</a>. We will
        respond within the time required by applicable law.
      </p>

      <h2>Data Retention and Security</h2>
      <p>
        We keep personal information only as long as needed for the purposes described
        above or as required by law. We use reasonable administrative and technical
        safeguards to protect your information, but no method of transmission or storage
        is completely secure.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        The Site is not directed to children under 13, and we do not knowingly collect
        personal information from them.
      </p>

      <h2>Changes to This Policy</h2>
      <p>
        We may update this Policy from time to time. When we do, we will revise the
        &quot;Last updated&quot; date above.
      </p>

      <h2>Contact Us</h2>
      <p>
        The Local Loop FL — Winter Garden, Florida
        <br />
        Email: <a href="mailto:hello@thelocalloopfl.com">hello@thelocalloopfl.com</a>
      </p>
      {/* NOTE FOR ISAAC: confirm the legal entity name and a mailing address for the
          Contact section above, and confirm the "Last updated" date. */}
    </LegalLayout>
  );
}
