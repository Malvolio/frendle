import { PublicLayout } from '@/components/layout/public-layout';
import { Separator } from '@/components/ui/separator';

export function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">
              Last updated: January 1, 2025
            </p>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p>
                At Frendle, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              
              <h2>Information We Collect</h2>
              <p>
                We collect information when you register for an account, participate in interactive features, fill out a form, or otherwise communicate with us. The information we may collect includes:
              </p>
              <ul>
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Profile information and preferences</li>
                <li>Payment information (through our secure payment processor)</li>
                <li>Communication data between you and Frendle</li>
              </ul>
              
              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process payments and manage your account</li>
                <li>Match you with other users based on your preferences</li>
                <li>Send you important information about our services</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor usage patterns and analyze trends</li>
                <li>Protect the security and integrity of our platform</li>
              </ul>
              
              <h2>Sharing Your Information</h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul>
                <li>With other users as part of the matching process, but only as described in our service</li>
                <li>With service providers who perform services on our behalf</li>
                <li>With your selected charity organization (only your donation amount, not personal information)</li>
                <li>If required by law or to protect our rights</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
              
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
              
              <h2>Your Choices</h2>
              <p>
                You can access, update, or delete your account information at any time through your profile settings. You may also:
              </p>
              <ul>
                <li>Opt out of marketing communications</li>
                <li>Choose not to share certain information in your profile</li>
                <li>Request a copy of your data</li>
                <li>Close your account</li>
              </ul>
              
              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> privacy@frendle.example.com<br />
                <strong>Address:</strong> 123 Connection Street, Suite 456, San Francisco, CA 94107
              </p>
            </div>
            
            <Separator className="my-8" />
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Need Help?</h2>
              <p className="text-muted-foreground">
                If you have any questions about our privacy practices or would like to exercise your privacy rights, please don't hesitate to contact us.
              </p>
              <div className="flex gap-4">
                <a href="mailto:privacy@frendle.example.com" className="text-primary hover:underline">
                  Email Us
                </a>
                <span className="text-muted-foreground">|</span>
                <a href="#" className="text-primary hover:underline">
                  FAQs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}