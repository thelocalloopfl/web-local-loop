import React from "react";

const subscribe_form_key = process.env.NEXT_PUBLIC_SUBSCRIBE_FORM_KEY;;

const NewsletterBox: React.FC = () => {
  return (
    <div className="main-content mx-auto px-5 flex justify-center items-center">
      <iframe
        src={`https://subscribe-forms.beehiiv.com/${subscribe_form_key}`}
        className="beehiiv-embed"
        data-test-id="beehiiv-embed"
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
      <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
    </div>
  );
};

export default NewsletterBox;
