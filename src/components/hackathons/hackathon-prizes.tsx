import type { Hackathon } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HackathonPrizesProps {
  hackathon: Hackathon;
}

function formatPrize(value?: number | null) {
  if (value === null || value === undefined) {
    return "Not announced";
  }

  return `INR ${value.toLocaleString("en-IN")}`;
}

export function HackathonPrizes({ hackathon }: HackathonPrizesProps) {
  const prizeData = [
    { label: "First Prize", value: hackathon.first_prize },
    { label: "Second Prize", value: hackathon.second_prize },
    { label: "Third Prize", value: hackathon.third_prize }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prizes & Recognition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Total Prize Pool
          </div>
          <div className="text-2xl font-semibold">
            INR {hackathon.prize_pool.toLocaleString("en-IN")}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {prizeData.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border px-4 py-3 text-center"
            >
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {item.label}
              </div>
              <div className="text-lg font-semibold">
                {formatPrize(item.value)}
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          In addition to cash prizes, top teams often gain access to fast-track
          interviews, cloud credits, and community recognition. Details will be
          shared with finalists.
        </p>
      </CardContent>
    </Card>
  );
}
