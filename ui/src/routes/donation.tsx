import PageTitle from "@/components/layout/PageTitle";
import { PublicLayout } from "@/components/layout/public-layout";
import TextBlock from "@/components/layout/text-block";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/donation")({
  component: () => (
    <PublicLayout>
      <PageTitle title="Donation Policy and Why We charge">
        {/* An explanation for our monthly fee. */}
      </PageTitle>
      <TextBlock>

        <p>
          Frendle charges a modest monthly fee not primarily to make money,
          though of course it helps us keep the lights on, but because we
          believe the value of a community is shaped by the intentions of its
          members. When people pay even a small amount, they tend to show up
          with purpose. It signals that you’re not just passing time—you’re here
          to connect.
        </p>
        <p>
          The membership fee helps create a shared sense of responsibility, and it ensures that
          consequences like suspensions or expulsions, when they are needed,
          carry real weight.
        </p>

        <p>
          In light of that motivation, we <strong>do not</strong> keep most of the money we
          collect in fees. The majority goes directly to supporting charities
          chosen by the members themselves. We do curate the list of charities.
          For legal reasons, all charities must be registered as 501(c)
          nonprofits in the United States, and we try to pick causes that all
          members can be comfortable being associated with.
        </p>

        <p>
          Yes, the subscription supports our work behind the scenes, but more
          importantly, it reinforces a culture of care, respect, and commitment.
          Frendle isn’t just an app. It’s a place we’re creating together.
        </p>
      </TextBlock>
    </PublicLayout>
  ),
});
