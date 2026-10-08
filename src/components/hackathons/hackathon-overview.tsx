import type { Hackathon } from "@/types/database";
import { SectionLabel } from "@/components/decor/section-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HackathonOverviewProps {
  hackathon: Hackathon;
}

function paragraphs(text: string) {
  return text
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/** The brief: details, requirements and rules in one tabbed card. */
export function HackathonOverview({ hackathon }: HackathonOverviewProps) {
  const rules = hackathon.rules ? paragraphs(hackathon.rules) : [];

  return (
    <section aria-labelledby="brief-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <SectionLabel>the brief</SectionLabel>
        <h2
          id="brief-heading"
          className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.035em] sm:text-[2.4rem]"
        >
          Everything your team needs to know
        </h2>
      </div>

      <Tabs defaultValue="details" className="w-full gap-5">
        <TabsList className="w-full sm:w-fit">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-soft sm:p-9">
          <TabsContent value="details" className="rich-text">
            {paragraphs(hackathon.description).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </TabsContent>

          <TabsContent value="requirements" className="rich-text">
            {hackathon.requirements ? (
              paragraphs(hackathon.requirements).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p>No specific requirements for this hackathon.</p>
            )}
          </TabsContent>

          <TabsContent value="rules">
            {rules.length > 0 ? (
              <ol className="flex flex-col">
                {rules.map((rule, index) => (
                  <li
                    key={index}
                    className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <span className="font-mono text-sm text-signal-ink tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="leading-relaxed text-muted-foreground">{rule}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="rich-text">Rules will be shared with registered participants.</p>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </section>
  );
}
