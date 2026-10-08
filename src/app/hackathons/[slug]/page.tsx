import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getHackathonBySlug } from "@/lib/repos/hackathons";
import { HackathonDetail } from "@/components/hackathons";

export const revalidate = 120;

function isRegistrationOpen(registrationEnd: string) {
  const registrationEndDate = new Date(registrationEnd);

  if (Number.isNaN(registrationEndDate.getTime())) {
    return false;
  }

  return new Date() <= registrationEndDate;
}

interface HackathonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params
}: HackathonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug).catch(() => null);

  if (!hackathon) {
    return {
      title: "Hackathon not found | Hackathon Wallah"
    };
  }

  return {
    title: `${hackathon.title} | Hackathon Wallah`,
    description:
      hackathon.short_description ?? hackathon.description.slice(0, 160),
    openGraph: {
      title: hackathon.title,
      description:
        hackathon.short_description ?? hackathon.description.slice(0, 160),
      images: hackathon.banner_url ? [hackathon.banner_url] : undefined
    }
  };
}

export default async function HackathonPage({ params }: HackathonPageProps) {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug).catch(() => null);

  if (!hackathon) {
    notFound();
  }

  return (
    <HackathonDetail
      hackathon={hackathon}
      registrationOpen={isRegistrationOpen(hackathon.registration_end)}
    />
  );
}
