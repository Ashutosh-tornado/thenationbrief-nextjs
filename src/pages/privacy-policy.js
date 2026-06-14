import Head from 'next/head'
import IntelPageLayout from '../components/IntelPageLayout'

export default function PrivacyPolicy() {
return (
<> <Head> <title>Privacy Policy | TheNationBrief</title> <meta
       name="description"
       content="Read TheNationBrief's privacy policy and learn how we collect, use, and protect user information."
     /> </Head>

```
  <IntelPageLayout
    syslog="SYS_LOG // 07. PRIVACY PROTOCOL"
    title="Privacy Policy"
    description="Information handling, privacy standards, and editorial independence."
  >
    <div className="space-y-8 article-content">

      <section>
        <p>
          <strong>Last Updated:</strong> June 2026
        </p>

        <p>
          TheNationBrief respects your privacy and is committed to
          protecting any information you share while using our website.
        </p>
      </section>

      <section>
        <h2>1. Information We Collect</h2>

        <p>
          We may collect anonymous browsing information such as pages
          visited, browser type, device information, and approximate
          geographic location.
        </p>

        <p>
          Information voluntarily submitted through comments, contact forms,
          or reader feedback channels may include your name, email address,
          and message content.
        </p>
      </section>

      <section>
        <h2>2. How We Use Information</h2>

        <ul>
          <li>Improve website performance and user experience</li>
          <li>Respond to enquiries and feedback</li>
          <li>Analyse readership trends and engagement</li>
          <li>Maintain website security and functionality</li>
        </ul>

        <p>
          We do not sell, rent, or share personal information with third
          parties for marketing purposes.
        </p>
      </section>

      <section>
        <h2>3. Cookies Policy</h2>

        <p>
          TheNationBrief uses essential cookies required for website
          functionality and limited analytics cookies to understand
          readership trends and improve user experience.
        </p>
      </section>

      <section>
        <h2>4. Editorial Independence</h2>

        <p>
          Our reporting and analysis are not influenced by advertisers,
          political organisations, governments, or external interest
          groups.
        </p>

        <p>
          Editorial decisions are made independently based on relevance,
          accuracy, and public interest.
        </p>
      </section>

      <section>
        <h2>5. Policy Updates</h2>

        <p>
          This Privacy Policy may be updated periodically. Any changes will
          be reflected by revising the "Last Updated" date displayed on
          this page.
        </p>
      </section>

      <section>
        <h2>6. Contact</h2>

        <p>
          For privacy-related questions or concerns, please contact us
          through our Contact Page.
        </p>
      </section>

      <section>
        <h2>Publisher Information</h2>

        <p>
          <strong>TheNationBrief</strong>
          <br />
          Published by StackMinds Web Solutions
          <br />
          Mumbai, Maharashtra, India
        </p>
      </section>

    </div>
  </IntelPageLayout>
</>


)
}
