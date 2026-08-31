import type { Metadata } from "next";
import LegalLayout from "../legal/LegalLayout";

const UPDATED = "August 31, 2026";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of The Local Loop FL, including newsletter, accounts, event submissions, the shop, and business partnerships.",
  alternates: { canonical: "https://thelocalloopfl.com/terms" },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated={UPDATED}>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of{" "}
        <a href="https://thelocalloopfl.com">thelocalloopfl.com</a> and the services
        offered by The Local Loop FL (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
        By using the Site, you agree to these Terms.
      </p>

      <h2>Using the Site</h2>
      <ul>
        <li>You must be at least 18 years old, or the age of majority where you live.</li>
        <li>
          You agree not to misuse the Site, interfere with its operation, attempt to
          access it in an unauthorized way, or use it to post unlawful, misleading, or
          infringing content.
        </li>
        <li>
          Content on the Site is provided for general information about the Winter Garden
          and West Orange County area. We do not guarantee that event details, business
          listings, or other information are always accurate or current.
        </li>
      </ul>

      <h2>Accounts</h2>
      <p>
        If you create an account, you are responsible for keeping your password secure and
        for activity that happens under your account. Contact us promptly if you believe
        your account has been compromised.
      </p>

      <h2>Newsletter</h2>
      <p>
        By subscribing you agree to receive email from The Local Loop FL. You can
        unsubscribe at any time using the link in any email.
      </p>

      <h2>Event and Business Submissions</h2>
      <p>
        When you submit an event, a business listing, or other content, you grant us a
        non-exclusive license to display, edit for length and clarity, and promote that
        content across the Site and our newsletter. You confirm that you have the right to
        submit it. We may decline or remove any submission at our discretion.
      </p>

      <h2>Business Partnerships and Payments</h2>
      <ul>
        <li>
          Business partnership plans (Founders, Professional, Standard, and Basic) are
          recurring monthly subscriptions billed through Stripe. Pricing and included
          benefits are described on our{" "}
          <a href="https://thelocalloopfl.com/pricing">Pricing page</a>.
        </li>
        <li>
          Your subscription renews automatically each month until cancelled. You can
          cancel at any time through the customer portal or by contacting us; cancellation
          takes effect at the end of the current billing period.
        </li>
        <li>
          Except where required by law, payments are non-refundable. Founders slots and
          promotional pricing may be limited and are offered on a first-come basis.
        </li>
        <li>
          Shop purchases are one-time payments processed through Stripe and are subject to
          the delivery and return details provided at checkout.
        </li>
      </ul>

      <h2>Third-Party Links and Services</h2>
      <p>
        The Site links to third-party websites and relies on third-party services
        (including Beehiiv, Stripe, Google, Sanity, and Vercel). We are not responsible
        for third-party content or practices; your use of those services is governed by
        their own terms.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        The Local Loop FL name, logo, and original content on the Site are owned by us or
        our licensors. You may share links to our content, but you may not copy or
        republish it in full without permission.
      </p>

      <h2>Disclaimers and Limitation of Liability</h2>
      <p>
        The Site is provided &quot;as is&quot; without warranties of any kind. To the
        fullest extent permitted by law, The Local Loop FL will not be liable for
        indirect, incidental, or consequential damages arising from your use of the Site,
        and our total liability for any claim will not exceed the amount you paid us in
        the twelve months before the claim.
      </p>

      <h2>Changes and Termination</h2>
      <p>
        We may update these Terms or change or discontinue parts of the Site at any time.
        Continued use after a change means you accept the updated Terms. We may suspend or
        terminate access for conduct that violates these Terms.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms are governed by the laws of the State of Florida, without regard to
        its conflict-of-laws rules.
      </p>

      <h2>Contact Us</h2>
      <p>
        The Local Loop FL — Winter Garden, Florida
        <br />
        Email: <a href="mailto:hello@thelocalloopfl.com">hello@thelocalloopfl.com</a>
      </p>
      {/* NOTE FOR ISAAC: confirm the legal entity name, governing-law county/venue, and
          the refund and cancellation terms match how you actually operate. */}
    </LegalLayout>
  );
}
