import React from "react";
import Script from "next/script";

const subscribe_form_key = process.env.NEXT_PUBLIC_SUBSCRIBE_FORM_KEY;;

const NewsletterBox: React.FC = () => {
  return (
    <div className="main-content mx-auto px-5 flex justify-center items-center">
      <iframe
        src={`https://subscribe-forms.beehiiv.com/${subscribe_form_key}`}
        className="beehiiv-embed"
        data-test-id="beehiiv-embed"
        title="Newsletter signup form"
        frameBorder="0"
        scrolling="no"
        style={{
          margin: "0",
          borderRadius: "0",
          backgroundColor: "transparent",
          boxShadow: "none",
          width: "100%",
          maxWidth: "100%",
        }}
      />
      <Script
        src="https://subscribe-forms.beehiiv.com/embed.js"
        strategy="lazyOnload"
      />
    </div>
  );
};

export default NewsletterBox;
