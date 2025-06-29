import { PublicLayout } from "@/components/layout/public-layout";
import { createFileRoute } from "@tanstack/react-router";
import { FC, forwardRef, PropsWithChildren, useRef } from "react";

const InShort: FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="italic">
    In short: <span className="ml-1">{children}</span>
  </div>
);

const Headline: FC<PropsWithChildren<{}>> = ({ children }) => (
  <h2 className="text-2xl font-bold mb-4 font-peachy">{children}</h2>
);
const Paragraph: FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="my-1 text-[#37251e] ">{children}</div>
);

type Props = PropsWithChildren<{
  headline: string;
  inShort?: string;
  index: number;
}>;

const Section = forwardRef<HTMLDivElement, Props>(
  ({ headline, inShort, index, children }, ref) => (
    <div ref={ref}>
      <Headline>
        {index + 1}. {headline}
      </Headline>
      {inShort && <InShort>{inShort}</InShort>}
      <div className="mb-6">{children}</div>
    </div>
  )
);
type SectionType = {
  headline: string;
  inShort?: string;
  child: (_: { goto: (_: number) => () => void }) => JSX.Element;
};
const Sections: SectionType[] = [
  {
    headline: "WHAT INFORMATION DO WE COLLECT?",
    inShort: "We collect personal information that you provide to us. ",
    child: ({ goto }) => (
      <>
        <Paragraph>
          We collect personal information that you voluntarily provide to us
          when you register on the Services, express an interest in obtaining
          information about us or our products and Services, when you
          participate in activities on the Services, or otherwise when you
          contact us.
        </Paragraph>
        <Paragraph>
          Personal Information Provided by You. The personal information that we
          collect depends on the context of your interactions with us and the
          Services, the choices you make, and the products and features you use.
          The personal information we collect may include the following:
        </Paragraph>
        <Paragraph>admin@frendle.space</Paragraph>
        <Paragraph>
          Sensitive Information. We do not process sensitive information.
        </Paragraph>
        <Paragraph>
          Social Media Login Data. We may provide you with the option to
          register with us using your existing social media account details,
          like your Facebook, X, or other social media account. If you choose to
          register in this way, we will collect certain profile information
          about you from the social media provider, as described in the section
          called
          <span className="underline cursor-pointer mx-1" onClick={goto(5)}>
            "HOW DO WE HANDLE YOUR SOCIAL LOGINS?"
          </span>
          below.
        </Paragraph>
        <Paragraph>
          All personal information that you provide to us must be true,
          complete, and accurate, and you must notify us of any changes to such
          personal information.
        </Paragraph>
        Information automatically collected
        <InShort>
          Some information — such as your Internet Protocol (IP) address and/or
          browser and device characteristics — is collected automatically when
          you visit our Services.
        </InShort>
        <Paragraph>
          We automatically collect certain information when you visit, use, or
          navigate the Services. This information does not reveal your specific
          identity (like your name or contact information) but may include
          device and usage information, such as your IP address, browser and
          device characteristics, operating system, language preferences,
          referring URLs, device name, country, location, information about how
          and when you use our Services, and other technical information. This
          information is primarily needed to maintain the security and operation
          of our Services, and for our internal analytics and reporting
          purposes.
        </Paragraph>
        <Paragraph>
          Like many businesses, we also collect information through cookies and
          similar technologies.
        </Paragraph>
        <Paragraph>The information we collect includes: </Paragraph>
        <Paragraph>
          Log and Usage Data. Log and usage data is service-related, diagnostic,
          usage, and performance information our servers automatically collect
          when you access or use our Services and which we record in log files.
          Depending on how you interact with us, this log data may include your
          IP address, device information, browser type, and settings and
          information about your activity in the Services (such as the date/time
          stamps associated with your usage, pages and files viewed, searches,
          and other actions you take such as which features you use), device
          event information (such as system activity, error reports (sometimes
          called "crash dumps"), and hardware settings).
        </Paragraph>
        <Paragraph>
          Device Data. We collect device data such as information about your
          computer, phone, tablet, or other device you use to access the
          Services. Depending on the device used, this device data may include
          information such as your IP address (or proxy server), device and
          application identification numbers, location, browser type, hardware
          model, Internet service provider and/or mobile carrier, operating
          system, and system configuration information.
        </Paragraph>
      </>
    ),
  },
  {
    headline: "HOW DO WE PROCESS YOUR INFORMATION?",
    inShort:
      "We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We process the personal information for the following purposes listed below. We may also process your information for other purposes only with your prior explicit consent. ",
    child: () => (
      <>
        <Paragraph>
          We process your personal information for a variety of reasons,
          depending on how you interact with our Services, including:
        </Paragraph>
        <Paragraph>
          To facilitate account creation and authentication and otherwise manage
          user accounts. We may process your information so you can create and
          log in to your account, as well as keep your account in working order.
        </Paragraph>
        <Paragraph>
          To deliver and facilitate delivery of services to the user. We may
          process your information to provide you with the requested service.
        </Paragraph>
        <Paragraph>
          To respond to user inquiries/offer support to users. We may process
          your information to respond to your inquiries and solve any potential
          issues you might have with the requested service.
        </Paragraph>
        <Paragraph>
          To send administrative information to you. We may process your
          information to send you details about our products and services,
          changes to our terms and policies, and other similar information.
        </Paragraph>
        <Paragraph>
          To enable user-to-user communications. We may process your information
          if you choose to use any of our offerings that allow for communication
          with another user.
        </Paragraph>
        <Paragraph>
          To save or protect an individual's vital interest. We may process your
          information when necessary to save or protect an individual’s vital
          interest, such as to prevent harm.
        </Paragraph>
      </>
    ),
  },
  {
    headline: "WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?",
    inShort:
      "We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e. , legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests. ",
    child: () => (
      <>
        <Paragraph>
          If you are located in the EU or UK, this section applies to you.
        </Paragraph>
        <Paragraph>
          The General Data Protection Regulation (GDPR) and UK GDPR require us
          to explain the valid legal bases we rely on in order to process your
          personal information. As such, we may rely on the following legal
          bases to process your personal information:
        </Paragraph>
        <Paragraph>
          Consent. We may process your information if you have given us
          permission (i.e. , consent) to use your personal information for a
          specific purpose. You can withdraw your consent at any time. Learn
          more about withdrawing your consent.
        </Paragraph>
        <Paragraph>
          Performance of a Contract. We may process your personal information
          when we believe it is necessary to fulfill our contractual obligations
          to you, including providing our Services or at your request prior to
          entering into a contract with you.
        </Paragraph>
        <Paragraph>
          Legal Obligations. We may process your information where we believe it
          is necessary for compliance with our legal obligations, such as to
          cooperate with a law enforcement body or regulatory agency, exercise
          or defend our legal rights, or disclose your information as evidence
          in litigation in which we are involved.
        </Paragraph>
        <Paragraph>
          Vital Interests. We may process your information where we believe it
          is necessary to protect your vital interests or the vital interests of
          a third party, such as situations involving potential threats to the
          safety of any person.
        </Paragraph>
        <Paragraph>
          If you are located in Canada, this section applies to you.
        </Paragraph>
        <Paragraph>
          We may process your information if you have given us specific
          permission (i.e. , express consent) to use your personal information
          for a specific purpose, or in situations where your permission can be
          inferred (i.e. , implied consent). You can withdraw your consent at
          any time.
        </Paragraph>
        <Paragraph>
          In some exceptional cases, we may be legally permitted under
          applicable law to process your information without your consent,
          including, for example:
        </Paragraph>
        <ul className="list-disc list-inside">
          <li>
            If collection is clearly in the interests of an individual and
            consent cannot be obtained in a timely way
          </li>
          <li>For investigations and fraud detection and prevention </li>
          <li>For business transactions provided certain conditions are met</li>
          <li>
            If it is contained in a witness statement and the collection is
            necessary to assess, process, or settle an insurance claim
          </li>
          <li>
            For identifying injured, ill, or deceased persons and communicating
            with next of kin
          </li>
          <li>
            If we have reasonable grounds to believe an individual has been, is,
            or may be victim of financial abuse
          </li>
          <li>
            If it is reasonable to expect collection and use with consent would
            compromise the availability or the accuracy of the information and
            the collection is reasonable for purposes related to investigating a
            breach of an agreement or a contravention of the laws of Canada or a
            province
          </li>
          <li>
            If disclosure is required to comply with a subpoena, warrant, court
            order, or rules of the court relating to the production of records
          </li>
          <li>
            If it was produced by an individual in the course of their
            employment, business, or profession and the collection is consistent
            with the purposes for which the information was produced
          </li>
          <li>
            If the collection is solely for journalistic, artistic, or literary
            purposes
          </li>
          <li>
            If the information is publicly available and is specified by the
            regulations
          </li>
        </ul>
        <Paragraph>
          We may disclose de-identified information for approved research or
          statistics projects, subject to ethics oversight and confidentiality
          commitments
        </Paragraph>
      </>
    ),
  },
  {
    headline: "WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?",
    inShort:
      "We may share information in specific situations described in this section and/or with the following third parties. ",
    child: () => (
      <>
        <Paragraph>
          We may need to share your personal information in the following
          situations:
        </Paragraph>
        <Paragraph>
          Business Transfers. We may share or transfer your information in
          connection with, or during negotiations of, any merger, sale of
          company assets, financing, or acquisition of all or a portion of our
          business to another company.
        </Paragraph>
        <Paragraph>
          Other Users. When you share personal information or otherwise interact
          with public areas of the Services, such personal information may be
          viewed by all users and may be publicly made available outside the
          Services in perpetuity. If you interact with other users of our
          Services and register for our Services through a social network (such
          as Facebook), your contacts on the social network will see your name,
          profile photo, and descriptions of your activity. Similarly, other
          users will be able to view descriptions of your activity, communicate
          with you within our Services, and view your profile.
        </Paragraph>
      </>
    ),
  },
  {
    headline: "DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?",
    inShort:
      "We may use cookies and other tracking technologies to collect and store your information. ",
    child: () => (
      <>
        <Paragraph>
          We may use cookies and similar tracking technologies (like web beacons
          and pixels) to gather information when you interact with our Services.
          Some online tracking technologies help us maintain the security of our
          Services and your account , prevent crashes, fix bugs, save your
          preferences, and assist with basic site functions.
        </Paragraph>
        <Paragraph>
          We also permit third parties and service providers to use online
          tracking technologies on our Services for analytics and advertising,
          including to help manage and display advertisements, to tailor
          advertisements to your interests, or to send abandoned shopping cart
          reminders (depending on your communication preferences). The third
          parties and service providers use their technology to provide
          advertising about products and services tailored to your interests
          which may appear either on our Services or on other websites.
        </Paragraph>
        <Paragraph>
          To the extent these online tracking technologies are deemed to be a
          "sale"/"sharing" (which includes targeted advertising, as defined
          under the applicable laws) under applicable US state laws, you can opt
          out of these online tracking technologies by submitting a request as
          described below under section " DO UNITED STATES RESIDENTS HAVE
          SPECIFIC PRIVACY RIGHTS? "
        </Paragraph>
        <Paragraph>
          Specific information about how we use such technologies and how you
          can refuse certain cookies is set out in our Cookie Notice .
        </Paragraph>
        <Paragraph>Google Analytics </Paragraph>
        <Paragraph>
          We may share your information with Google Analytics to track and
          analyze the use of the Services. The Google Analytics Advertising
          Features that we may use include: Google Display Network Impressions
          Reporting . To opt out of being tracked by Google Analytics across the
          Services, visit https://tools.google.com/dlpage/gaoptout. You can opt
          out of Google Analytics Advertising Features through Ads Settings and
          Ad Settings for mobile apps. Other opt out means include
          http://optout.networkadvertising.org/ and
          http://www.networkadvertising.org/mobile-choice. For more information
          on the privacy practices of Google, please visit the Google Privacy &
          Terms page.
        </Paragraph>
      </>
    ),
  },
  {
    headline: "HOW DO WE HANDLE YOUR SOCIAL LOGINS?",
    inShort:
      "If you choose to register or log in to our Services using a social media account, we may have access to certain information about you. ",
    child: () => (
      <>
        <Paragraph>
          Our Services offer you the ability to register and log in using your
          third-party social media account details (like your Facebook or X
          logins). Where you choose to do this, we will receive certain profile
          information about you from your social media provider. The profile
          information we receive may vary depending on the social media provider
          concerned, but will often include your name, email address, friends
          list, and profile picture, as well as other information you choose to
          make public on such a social media platform.
        </Paragraph>
        <Paragraph>
          We will use the information we receive only for the purposes that are
          described in this Privacy Notice or that are otherwise made clear to
          you on the relevant Services. Please note that we do not control, and
          are not responsible for, other uses of your personal information by
          your third-party social media provider. We recommend that you review
          their privacy notice to understand how they collect, use, and share
          your personal information, and how you can set your privacy
          preferences on their sites and apps.
        </Paragraph>
      </>
    ),
  },
  {
    headline: "HOW LONG DO WE KEEP YOUR INFORMATION?",
    inShort:
      "We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law. ",
    child: () => (
      <>
        <Paragraph>
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this Privacy Notice, unless a
          longer retention period is required or permitted by law (such as tax,
          accounting, or other legal requirements). No purpose in this notice
          will require us keeping your personal information for longer than
          three (3) months past the termination of the user's account .
        </Paragraph>
        <Paragraph>
          When we have no ongoing legitimate business need to process your
          personal information, we will either delete or anonymize such
          information, or, if this is not possible (for example, because your
          personal information has been stored in backup archives), then we will
          securely store your personal information and isolate it from any
          further processing until deletion is possible.
        </Paragraph>
      </>
    ),
  },
  {
    headline: "DO WE COLLECT INFORMATION FROM MINORS?",
    inShort:
      "We do not knowingly collect data from or market to children under 18 years of age or the equivalent age as specified by law in your jurisdiction . ",
    child: () => (
      <>
        <Paragraph>
          We do not knowingly collect, solicit data from, or market to children
          under 18 years of age or the equivalent age as specified by law in
          your jurisdiction , nor do we knowingly sell such personal
          information. By using the Services, you represent that you are at
          least 18 or the equivalent age as specified by law in your
          jurisdiction or that you are the parent or guardian of such a minor
          and consent to such minor dependent’s use of the Services. If we learn
          that personal information from users less than 18 years of age or the
          equivalent age as specified by law in your jurisdiction has been
          collected, we will deactivate the account and take reasonable measures
          to promptly delete such data from our records. If you become aware of
          any data we may have collected from children under age 18 or the
          equivalent age as specified by law in your jurisdiction , please
          contact us at admin@frendle.space .
        </Paragraph>
      </>
    ),
  },
  {
    headline: "WHAT ARE YOUR PRIVACY RIGHTS?",
    inShort:
      "Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada , you have rights that allow you greater access to and control over your personal information.  You may review, change, or terminate your account at any time, depending on your country, province, or state of residence. ",
    child: ({ goto }) => (
      <>
        <Paragraph>
          In some regions (like the EEA, UK, Switzerland, and Canada ), you have
          certain rights under applicable data protection laws. These may
          include the right (i) to request access and obtain a copy of your
          personal information, (ii) to request rectification or erasure; (iii)
          to restrict the processing of your personal information; (iv) if
          applicable, to data portability; and (v) not to be subject to
          automated decision-making. If a decision that produces legal or
          similarly significant effects is made solely by automated means, we
          will inform you, explain the main factors, and offer a simple way to
          request human review. In certain circumstances, you may also have the
          right to object to the processing of your personal information. You
          can make such a request by contacting us by using the contact details
          provided in the section
          <span className="underline cursor-pointer mx-1" onClick={goto(12)}>
            “HOW CAN YOU CONTACT US ABOUT THIS NOTICE?”
          </span>
          below.
        </Paragraph>
        <Paragraph>
          We will consider and act upon any request in accordance with
          applicable data protection laws.
        </Paragraph>
        <Paragraph>
          If you are located in the EEA or UK and you believe we are unlawfully
          processing your personal information, you also have the right to
          complain to your Member State data protection authority or UK data
          protection authority.
        </Paragraph>
        <Paragraph>
          If you are located in Switzerland, you may contact the Federal Data
          Protection and Information Commissioner.
        </Paragraph>
        <Paragraph>
          Withdrawing your consent: If we are relying on your consent to process
          your personal information, which may be express and/or implied consent
          depending on the applicable law, you have the right to withdraw your
          consent at any time. You can withdraw your consent at any time by
          contacting us by using the contact details provided in the section "
          HOW CAN YOU CONTACT US ABOUT THIS NOTICE? " below .
        </Paragraph>
        <Paragraph>
          However, please note that this will not affect the lawfulness of the
          processing before its withdrawal nor, when applicable law allows, will
          it affect the processing of your personal information conducted in
          reliance on lawful processing grounds other than consent.
        </Paragraph>
        <Paragraph>Account Information </Paragraph>
        <Paragraph>
          If you would at any time like to review or change the information in
          your account or terminate your account, you can:
        </Paragraph>
        <Paragraph>
          Contact us using the contact information provided.
        </Paragraph>
        <Paragraph>
          Upon your request to terminate your account, we will deactivate or
          delete your account and information from our active databases.
          However, we may retain some information in our files to prevent fraud,
          troubleshoot problems, assist with any investigations, enforce our
          legal terms and/or comply with applicable legal requirements.
        </Paragraph>
        <Paragraph>
          Cookies and similar technologies: Most Web browsers are set to accept
          cookies by default. If you prefer, you can usually choose to set your
          browser to remove cookies and to reject cookies. If you choose to
          remove cookies or reject cookies, this could affect certain features
          or services of our Services.
        </Paragraph>
        <Paragraph>
          If you have questions or comments about your privacy rights, you may
          email us at admin@frendle.space.
        </Paragraph>
      </>
    ),
  },
  {
    headline: " CONTROLS FOR DO-NOT-TRACK FEATURES",
    inShort: "",
    child: () => (
      <>
        <Paragraph>
          Most web browsers and some mobile operating systems and mobile
          applications include a Do-Not-Track ( "DNT" ) feature or setting you
          can activate to signal your privacy preference not to have data about
          your online browsing activities monitored and collected. At this
          stage, no uniform technology standard for recognizing and implementing
          DNT signals has been finalized . As such, we do not currently respond
          to DNT browser signals or any other mechanism that automatically
          communicates your choice not to be tracked online. If a standard for
          online tracking is adopted that we must follow in the future, we will
          inform you about that practice in a revised version of this Privacy
          Notice.
        </Paragraph>
        <Paragraph>
          California law requires us to let you know how we respond to web
          browser DNT signals. Because there currently is not an industry or
          legal standard for recognizing or honoring DNT signals, we do not
          respond to them at this time.
        </Paragraph>
      </>
    ),
  },
  {
    headline: " DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?",
    inShort:
      "If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia , you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below. ",
    child: () => (
      <>
        <Paragraph>Categories of Personal Information We Collect </Paragraph>
        <Paragraph>
          The table below shows the categories of personal information we have
          collected in the past twelve (12) months. The table includes
          illustrative examples of each category and does not reflect the
          personal information we collect from you. For a comprehensive
          inventory of all personal information we process, please refer to the
          section " WHAT INFORMATION DO WE COLLECT? "
        </Paragraph>
        <Paragraph>
          We may also collect other personal information outside of these
          categories through instances where you interact with us in person,
          online, or by phone or mail in the context of:
        </Paragraph>
        <Paragraph>
          Receiving help through our customer support channels;
        </Paragraph>
        <Paragraph>
          Participation in customer surveys or contests; and
        </Paragraph>
        <Paragraph>
          Facilitation in the delivery of our Services and to respond to your
          inquiries.
        </Paragraph>
        <Paragraph>
          We will use and retain the collected personal information as needed to
          provide the Services or for:
        </Paragraph>
        <Paragraph>
          Category H - As long as the user has an account with us
        </Paragraph>
        <Paragraph>Sources of Personal Information </Paragraph>
        <Paragraph>
          Learn more about the sources of personal information we collect in "
          WHAT INFORMATION DO WE COLLECT? "
        </Paragraph>
        <Paragraph>How We Use and Share Personal Information </Paragraph>
        <Paragraph>
          Learn more about how we use your personal information in the section,
          " HOW DO WE PROCESS YOUR INFORMATION? "
        </Paragraph>
        <Paragraph>Will your information be shared with anyone else?</Paragraph>
        <Paragraph>
          We may disclose your personal information with our service providers
          pursuant to a written contract between us and each service provider.
          Learn more about how we disclose personal information to in the
          section, " WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION? "
        </Paragraph>
        <Paragraph>
          We may use your personal information for our own business purposes,
          such as for undertaking internal research for technological
          development and demonstration. This is not considered to be "selling"
          of your personal information.
        </Paragraph>
        <Paragraph>
          We have not disclosed, sold, or shared any personal information to
          third parties for a business or commercial purpose in the preceding
          twelve (12) months. We will not sell or share personal information in
          the future belonging to website visitors, users, and other consumers.
        </Paragraph>
        <Paragraph>Your Rights </Paragraph>
        <Paragraph>
          You have rights under certain US state data protection laws. However,
          these rights are not absolute, and in certain cases, we may decline
          your request as permitted by law. These rights include:
        </Paragraph>
        <Paragraph>
          Right to know whether or not we are processing your personal data
        </Paragraph>
        <Paragraph>Right to access your personal data </Paragraph>
        <Paragraph>
          Right to correct inaccuracies in your personal data
        </Paragraph>
        <Paragraph>
          Right to request the deletion of your personal data
        </Paragraph>
        <Paragraph>
          Right to obtain a copy of the personal data you previously shared with
          us
        </Paragraph>
        <Paragraph>
          Right to non-discrimination for exercising your rights
        </Paragraph>
        <Paragraph>
          Right to opt out of the processing of your personal data if it is used
          for targeted advertising (or sharing as defined under California’s
          privacy law) , the sale of personal data, or profiling in furtherance
          of decisions that produce legal or similarly significant effects (
          "profiling" )
        </Paragraph>
        <Paragraph>
          Depending upon the state where you live, you may also have the
          following rights:
        </Paragraph>
        <Paragraph>
          Right to access the categories of personal data being processed (as
          permitted by applicable law, including the privacy law in Minnesota)
        </Paragraph>
        <Paragraph>
          Right to obtain a list of the categories of third parties to which we
          have disclosed personal data (as permitted by applicable law,
          including the privacy law in California, Delaware, and Maryland )
        </Paragraph>
        <Paragraph>
          Right to obtain a list of specific third parties to which we have
          disclosed personal data (as permitted by applicable law, including the
          privacy law in Minnesota and Oregon )
        </Paragraph>
        <Paragraph>
          Right to review, understand, question, and correct how personal data
          has been profiled (as permitted by applicable law, including the
          privacy law in Minnesota)
        </Paragraph>
        <Paragraph>
          Right to limit use and disclosure of sensitive personal data (as
          permitted by applicable law, including the privacy law in California)
        </Paragraph>
        <Paragraph>
          Right to opt out of the collection of sensitive data and personal data
          collected through the operation of a voice or facial recognition
          feature (as permitted by applicable law, including the privacy law in
          Florida)
        </Paragraph>
        <Paragraph>How to Exercise Your Rights </Paragraph>
        <Paragraph>
          To exercise these rights, you can contact us by submitting a data
          subject access request, by emailing us at admin@frendle.space , or by
          referring to the contact details at the bottom of this document.
        </Paragraph>
        <Paragraph>
          Under certain US state data protection laws, you can designate an
          authorized agent to make a request on your behalf. We may deny a
          request from an authorized agent that does not submit proof that they
          have been validly authorized to act on your behalf in accordance with
          applicable laws.
        </Paragraph>
        <Paragraph>Request Verification </Paragraph>
        <Paragraph>
          Upon receiving your request, we will need to verify your identity to
          determine you are the same person about whom we have the information
          in our system. We will only use personal information provided in your
          request to verify your identity or authority to make the request.
          However, if we cannot verify your identity from the information
          already maintained by us, we may request that you provide additional
          information for the purposes of verifying your identity and for
          security or fraud-prevention purposes.
        </Paragraph>
        <Paragraph>
          If you submit the request through an authorized agent, we may need to
          collect additional information to verify your identity before
          processing your request and the agent will need to provide a written
          and signed permission from you to submit such request on your behalf.
        </Paragraph>
        <Paragraph>Appeals </Paragraph>
        <Paragraph>
          Under certain US state data protection laws, if we decline to take
          action regarding your request, you may appeal our decision by emailing
          us at admin@frendle.space . We will inform you in writing of any
          action taken or not taken in response to the appeal, including a
          written explanation of the reasons for the decisions. If your appeal
          is denied, you may submit a complaint to your state attorney general.
        </Paragraph>
        <Paragraph>California "Shine The Light" Law </Paragraph>
        <Paragraph>
          California Civil Code Section 1798.83, also known as the "Shine The
          Light" law, permits our users who are California residents to request
          and obtain from us, once a year and free of charge, information about
          categories of personal information (if any) we disclosed to third
          parties for direct marketing purposes and the names and addresses of
          all third parties with which we shared personal information in the
          immediately preceding calendar year. If you are a California resident
          and would like to make such a request, please submit your request in
          writing to us by using the contact details provided in the section "
          HOW CAN YOU CONTACT US ABOUT THIS NOTICE? "
        </Paragraph>
      </>
    ),
  },
  {
    headline: " DO WE MAKE UPDATES TO THIS NOTICE?",
    inShort:
      "Yes, we will update this notice as necessary to stay compliant with relevant laws. ",
    child: () => (
      <>
        <Paragraph>
          We may update this Privacy Notice from time to time. The updated
          version will be indicated by an updated "Revised" date at the top of
          this Privacy Notice. If we make material changes to this Privacy
          Notice, we may notify you either by prominently posting a notice of
          such changes or by directly sending you a notification. We encourage
          you to review this Privacy Notice frequently to be informed of how we
          are protecting your information.
        </Paragraph>
      </>
    ),
  },
  {
    headline: " HOW CAN YOU CONTACT US ABOUT THIS NOTICE?",
    inShort: "",
    child: () => (
      <>
        <Paragraph>
          If you have questions or comments about this notice, you may email us
          at admin@frendle.space.
        </Paragraph>
      </>
    ),
  },
  {
    headline:
      " HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?",
    inShort: "",
    child: () => (
      <>
        <Paragraph>
          Based on the applicable laws of your country or state of residence in
          the US , you may have the right to request access to the personal
          information we collect from you, details about how we have processed
          it, correct inaccuracies, or delete your personal information. You may
          also have the right to withdraw your consent to our processing of your
          personal information. These rights may be limited in some
          circumstances by applicable law. To request to review, update, or
          delete your personal information, please fill out and submit a data
          subject access request .
        </Paragraph>
      </>
    ),
  },
];

const KeyPoints = () => (
  <ul className="list-disc list-inside mb-6">
    <li>
      This summary provides key points from our Privacy Notice, but you can find
      out more details about any of these topics by clicking the link following
      each key point or by using our table of contents below to find the section
      you are looking for.
    </li>
    <li>
      What personal information do we process? When you visit, use, or navigate
      our Services, we may process personal information depending on how you
      interact with us and the Services, the choices you make, and the products
      and features you use. Learn more about personal information you disclose
      to us.
    </li>
    <li>
      Do we process any sensitive personal information? Some of the information
      may be considered "special" or "sensitive" in certain jurisdictions, for
      example your racial or ethnic origins, sexual orientation, and religious
      beliefs. We do not process sensitive personal information.
    </li>
    <li>
      Do we collect any information from third parties? We do not collect any
      information from third parties.
    </li>
    <li>
      How do we process your information? We process your information to
      provide, improve, and administer our Services, communicate with you, for
      security and fraud prevention, and to comply with law. We may also process
      your information for other purposes with your consent. We process your
      information only when we have a valid legal reason to do so. Learn more
      about how we process your information.
    </li>
    <li>
      In what situations and with which parties do we share personal
      information? We may share information in specific situations and with
      specific third parties. Learn more about when and with whom we share your
      personal information.
    </li>
    <li>
      What are your rights? Depending on where you are located geographically,
      the applicable privacy law may mean you have certain rights regarding your
      personal information. Learn more about your privacy rights.
    </li>
    <li>
      How do you exercise your rights? The easiest way to exercise your rights
      is by submitting a data subject access request , or by contacting us. We
      will consider and act upon any request in accordance with applicable data
      protection laws.
    </li>
    <li>
      Want to learn more about what we do with any information we collect?
      Review the Privacy Notice in full.
    </li>
  </ul>
);

const Introduction = () => (
  <>
    <Paragraph>
      This Privacy Notice for Frendle.space ("we," "us," or "our" ), describes
      how and why we might access, collect, store, use, and/or share ("process")
      your personal information when you use our services ( "Services"),
      including when you:
    </Paragraph>
    <Paragraph>
      Visit our website at http://frendle.space/ or any website of ours that
      links to this Privacy Notice
    </Paragraph>
    <Paragraph>
      Download and use our mobile application (Frendle) , or any other
      application of ours that links to this Privacy Notice
    </Paragraph>
    <Paragraph>
      Engage with us in other related ways, including any sales, marketing, or
      events
    </Paragraph>
    <Paragraph>
      Questions or concerns? Reading this Privacy Notice will help you
      understand your privacy rights and choices. We are responsible for making
      decisions about how your personal information is processed. If you do not
      agree with our policies and practices, please do not use our Services. If
      you still have any questions or concerns, please contact us at
      admin@frendle.space.
    </Paragraph>
  </>
);
const PrivacyPolicy = () => {
  const componentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollToComponent = (index: number) => () => {
    const element = componentRefs.current[index];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold font-peachy">PRIVACY POLICY </h1>
      <Paragraph>Last updated June 23, 2025 </Paragraph>
      <Introduction />
      <Headline>SUMMARY OF KEY POINTS </Headline>
      <KeyPoints />

      <Headline>TABLE OF CONTENTS </Headline>
      <ul className="list-disc list-inside mb-6">
        {Sections.map((item, index) => (
          <li key={`toc-${index}`}>
            <a
              className="cursor-pointer underline"
              onClick={scrollToComponent(index)}
            >
              {item.headline}
            </a>
          </li>
        ))}
      </ul>
      {Sections.map(({ headline, inShort, child: Child }, index) => (
        <Section
          key={`section-${index}`}
          index={index}
          headline={headline}
          ref={(el) => (componentRefs.current[index] = el)}
          inShort={inShort}
        >
          <Child goto={scrollToComponent} />
        </Section>
      ))}
    </div>
  );
};

export const Route = createFileRoute("/privacy")({
  component: () => (
    <PublicLayout>
      <PrivacyPolicy />
    </PublicLayout>
  ),
});
