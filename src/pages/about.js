import Head from 'next/head'
import IntelPageLayout from '../components/IntelPageLayout'

export default function About() {
  return (
    <>
      <Head>
        <title>About Us | TheNationBrief</title>
        <meta
          name="description"
          content="Learn about TheNationBrief, our mission, editorial approach, and coverage of defence, geopolitics, and strategic affairs."
        />
      </Head>

      <IntelPageLayout
        syslog="SYS_LOG // 05. ABOUT DOSSIER"
        title="About TheNationBrief"
        description="Mission profile, editorial principles, and intelligence coverage areas."
      >
        <div className="space-y-8 article-content">

          <section>
            <h2>Our Story</h2>

            <p>
              TheNationBrief began with a simple idea: to make complex topics in
              Defence, Geopolitics, and Strategic Affairs easier to understand
              without sacrificing accuracy or depth.
            </p>

            <p>
              For years, I have followed military technology, national security
              developments, and the shifting balance of global power. During that
              journey, I noticed a recurring problem. Important developments were
              often buried beneath technical jargon, fragmented reporting, or
              sensational headlines.
            </p>

            <p>
              TheNationBrief was created to bridge that gap.
            </p>

            <p>
              Our mission is to explain critical developments with clarity,
              context, and credibility. We believe readers should not only know
              what happened but also understand why it matters and how it fits
              into the broader strategic picture.
            </p>

            <p>
              Whether covering a major defence acquisition, an emerging military
              technology, a geopolitical flashpoint, or a long-term strategic
              trend, our focus remains the same: delivering fact-driven analysis
              and meaningful insights that go beyond the headlines.
            </p>

            <p>
              Every article published on TheNationBrief contributes to a larger
              goal: building a well-informed community that values depth,
              context, and thoughtful discussion.
            </p>

            <p>
              Thank you for being part of this journey.
            </p>
          </section>

          <section>
            <h2>What We Cover</h2>

            <h3>Defence & Military Technology</h3>
            <p>
              We analyse India's defence modernisation efforts, global military
              developments, strategic doctrines, and advances in aerospace,
              naval, missile, cyber, and land warfare technologies.
            </p>

            <h3>Geopolitics & Global Affairs</h3>
            <p>
              From shifting alliances and regional conflicts to great-power
              competition and international diplomacy, we explain the
              geopolitical developments shaping the world.
            </p>

            <h3>Strategic Affairs</h3>
            <p>
              We examine long-term security trends, military modernisation
              programmes, defence policy, deterrence frameworks, and emerging
              challenges across the Indo-Pacific and beyond.
            </p>
          </section>

          <section>
            <h2>Editorial Approach</h2>

            <ul>
              <li>Accuracy over speed</li>
              <li>Context over headlines</li>
              <li>Analysis over speculation</li>
              <li>Facts over narratives</li>
            </ul>

            <p>
              At TheNationBrief, our objective is to provide readers with
              reliable, fact-driven, and context-rich reporting that helps them
              understand the strategic developments shaping India and the wider
              world.
            </p>
          </section>

          <section>
            <h2>Further Reading</h2>

            <p>
              For readers interested in India's defence research ecosystem,
              explore the official DRDO website:
            </p>

            <a
              href="https://drdo.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400"
            >
              DRDO Official Website →
            </a>
          </section>

        </div>
      </IntelPageLayout>
    </>
  )
}

