
import Head from 'next/head'
import IntelPageLayout from '../components/IntelPageLayout'

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us | TheNationBrief</title>
        <meta
          name="description"
          content="Contact TheNationBrief for feedback, article suggestions, corrections, and editorial enquiries."
        />
      </Head>

      <IntelPageLayout
        syslog="SYS_LOG // 06. CONTACT CHANNEL"
        title="Contact TheNationBrief"
        description="Secure communication channel for readers, contributors, and editorial feedback."
      >
        <div className="space-y-8 article-content">

          <section>
            <h2>We'd Love to Hear From You</h2>

            <p>
              Thank you for visiting TheNationBrief.
            </p>

            <p>
              Whether you have feedback on our coverage, a question about an
              article, or a suggestion for topics you would like us to explore,
              we welcome your message.
            </p>

            <p>
              At TheNationBrief, we value informed discussion, constructive
              feedback, and thoughtful perspectives. Your input helps us improve
              the quality, clarity, and relevance of our work.
            </p>
          </section>

          <section>
            <h2>Get in Touch</h2>

            <p>
              Please use the contact form available on this page to reach us.
            </p>

            <p>
              Every message is reviewed carefully. While we may not be able to
              respond to every enquiry, we read all feedback and suggestions
              submitted by our readers.
            </p>
          </section>

          <section>
            <h2>Editorial Feedback</h2>

            <p>
              If you believe an article contains an error, requires
              clarification, or would benefit from additional context, please
              let us know.
            </p>

            <p>
              Accuracy, transparency, and factual reporting remain central to
              our editorial standards.
            </p>
          </section>

          <section>
            <h2>Response Time</h2>

            <p>
              We aim to review messages promptly. However, response times may
              vary depending on message volume and editorial workload.
            </p>
          </section>

          <section>
            <h2>Thank You</h2>

            <p>
              Thank you for taking the time to connect with us.
            </p>

            <p>
              Every message matters, and we appreciate your support of
              TheNationBrief.
            </p>
          </section>

        </div>
      </IntelPageLayout>
    </>
  )
}

