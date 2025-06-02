import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthLayout } from '@/components/layout/auth-layout';
import { ProfileForm } from '@/components/profile/profile-form';
import { CharitySelection } from '@/components/profile/charity-selection';
import { MembershipSection } from '@/components/profile/membership-section';

export function ProfilePage() {
  return (
    <AuthLayout title="My Profile">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="charity">Charity</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileForm />
        </TabsContent>
        
        <TabsContent value="charity" className="space-y-6">
          <CharitySelection />
        </TabsContent>
        
        <TabsContent value="membership" className="space-y-6">
          <MembershipSection />
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
}