import Link from "next/link";
import { format } from "date-fns";

import type { Hackathon } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface HackathonCardProps {
  hackathon: Hackathon;
}

function formatDateRange(start: string, end: string) {
  try {
    const startDate = format(new Date(start), "MMM d, yyyy");
    const endDate = format(new Date(end), "MMM d, yyyy");

    if (startDate === endDate) {
      return startDate;
    }

    return `${startDate} - ${endDate}`;
  } catch {
    return `${start} - ${end}`;
  }
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="capitalize">
              {hackathon.status}
            </Badge>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {hackathon.location_type}
            </span>
          </div>

          <CardTitle>{hackathon.title}</CardTitle>
          <CardDescription>
            {hackathon.short_description ?? hackathon.description.slice(0, 120)}
            {hackathon.short_description ? "" : "..."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">Dates:</span>{" "}
            {formatDateRange(hackathon.start_date, hackathon.end_date)}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {hackathon.themes?.slice(0, 3).map((theme) => (
              <Badge key={theme} variant="secondary">
                {theme}
              </Badge>
            ))}
            {hackathon.themes && hackathon.themes.length > 3 ? (
              <span className="text-xs text-muted-foreground">
                +{hackathon.themes.length - 3} more
              </span>
            ) : null}
          </div>

          {hackathon.participation_fee ? (
            <div>
              <span className="font-medium text-foreground">Fee:</span>{" "}
              INR {hackathon.participation_fee.toFixed(0)}
            </div>
          ) : (
            <div className="text-emerald-600 dark:text-emerald-400">
              Free participation
            </div>
          )}
        </CardContent>
      </div>

      <CardFooter className="mt-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Prize pool: INR {hackathon.prize_pool.toLocaleString("en-IN")}
        </span>
        <Button asChild>
          <Link href={`/hackathons/${hackathon.slug}`}>View details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
