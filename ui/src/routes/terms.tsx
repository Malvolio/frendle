import { PublicLayout } from "@/components/layout/public-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: () => {
    return (
      <PublicLayout>
        <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Terms of Service
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Please read these terms carefully before using our services. Your
              use of our service constitutes acceptance of these terms.
            </p>
            <div className="mt-8 text-foreground/60">
              <p>
                Last updated:{" "}
                <span className="font-semibold">June 2025</span>
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-12">
            {/* Section 1 */}
            <section className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                By accessing and using this website, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to abide by the above, please do not use this service.
                These terms apply to all visitors, users, and others who access
                or use the service.
              </p>
            </section>

            {/* Section 2 */}
            <section className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                2. Use License
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the
                materials on our website for personal, non-commercial transitory
                viewing only. This is the grant of a license, not a transfer of
                title, and under this license you may not:
              </p>
              <ul className="text-foreground/80 space-y-2 pl-6">
                <li className="flex items-start">
                  <span className="text-pink-400 mr-2">•</span>
                  Modify or copy the materials
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Use the materials for any commercial purpose or for any public
                  display
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Attempt to reverse engineer any software contained on the
                  website
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                3. Disclaimer
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                The materials on our website are provided on an 'as is' basis.
                We make no warranties, expressed or implied, and hereby disclaim
                and negate all other warranties including without limitation,
                implied warranties or conditions of merchantability, fitness for
                a particular purpose, or non-infringement of intellectual
                property or other violation of rights.
              </p>
            </section>

            {/* Section 4 */}
            <section className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                4. Limitations
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                In no event shall our company or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use the materials on our website, even if we
                or our authorized representative has been notified orally or in
                writing of the possibility of such damage. Because some
                jurisdictions do not allow limitations on implied warranties, or
                limitations of liability for consequential or incidental
                damages, these limitations may not apply to you.
              </p>
            </section>

            {/* Section 5 */}
            <section className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                5. Privacy Policy
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                Your privacy is important to us. Our Privacy Policy explains how
                we collect, use, and protect your information when you use our
                service. By using our service, you agree to the collection and
                use of information in accordance with our Privacy Policy. We are
                committed to protecting your personal information and your right
                to privacy.
              </p>
            </section>

            {/* Section 6 */}
            <section className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                6. Revisions and Errata
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                The materials appearing on our website could include technical,
                typographical, or photographic errors. We do not warrant that
                any of the materials on its website are accurate, complete, or
                current. We may make changes to the materials contained on its
                website at any time without notice. However, we do not make any
                commitment to update the materials.
              </p>
            </section>

            {/* Section 7 */}
            <section className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                7. Governing Law
              </h2>
              <p className="text-foreground/80 leading-relaxed">
                These terms and conditions are governed by and construed in
                accordance with the laws of the jurisdiction in which our
                company operates, and you irrevocably submit to the exclusive
                jurisdiction of the courts in that state or location. Any
                disputes arising under these terms shall be resolved through
                binding arbitration.
              </p>
            </section>

            {/* Contact Section */}
            <section className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                If you have any questions about these Terms of Service, please
                don't hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-foreground font-semibold py-3 px-8 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Contact Support
                </button> */}
                <button className="border-2 border-black font-semibold py-3 px-8 rounded-sm hover:bg-[#58B4AE] transition-all duration-300 hover:scale-105">
                  Email Us
                </button>
              </div>
            </section>
          </div>
        </main>
      </PublicLayout>
    );
  },
});
