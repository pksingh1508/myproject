import { format } from "date-fns";

import type { Hackathon } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HackathonOverviewProps {
  hackathon: Hackathon;
}

const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

function formatDateTime(value: string) {
  try {
    return format(new Date(value), "PPP p");
  } catch {
    return value;
  }
}

function formatDate(value: string) {
  try {
    return format(new Date(value), "PPP");
  } catch {
    return value;
  }
}

export function HackathonOverview({ hackathon }: HackathonOverviewProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {hackathon.status}
          </Badge>
          <Badge variant="secondary" className="capitalize">
            {hackathon.location_type}
          </Badge>
          {hackathon.themes?.map((theme) => (
            <Badge key={theme} variant="default">
              {theme}
            </Badge>
          ))}
        </div>

        <p className="text-lg text-muted-foreground">
          {hackathon.short_description ?? hackathon.description}
        </p>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Starts:</span>{" "}
              {formatDateTime(hackathon.start_date)}
            </div>
            <div>
              <span className="font-medium text-foreground">Ends:</span>{" "}
              {formatDateTime(hackathon.end_date)}
            </div>
            <Separator className="my-2" />
            <div>
              <span className="font-medium text-foreground">
                Registration:
              </span>{" "}
              {formatDate(hackathon.registration_start)} -{" "}
              {formatDate(hackathon.registration_end)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Teams:</span>{" "}
              {hackathon.min_team_size} - {hackathon.max_team_size} members
            </div>
            <div>
              <span className="font-medium text-foreground">Fee:</span>{" "}
              {hackathon.participation_fee
                ? `INR ${hackathon.participation_fee.toFixed(0)}`
                : "Free"}
            </div>
            {/* {typeof hackathon.max_participants === "number" ? (
              <div>
                <span className="font-medium text-foreground">
                  Participant slots:
                </span>{" "}
                {hackathon.current_participants} / {hackathon.max_participants}
              </div>
            ) : null} */}
            {hackathon.location_details ? (
              <div>
                <span className="font-medium text-foreground">Details:</span>{" "}
                {hackathon.location_details}
              </div>
            ) : null}
            {hackathon.venue_address ? (
              <div>
                <span className="font-medium text-foreground">Venue:</span>{" "}
                {hackathon.venue_address}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList style={brandDisplayStyle}>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="prose max-w-none py-6 dark:prose-invert">
              {hackathon.description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="requirements" className="mt-4">
          <Card>
            <CardContent className="prose max-w-none py-6 dark:prose-invert">
              {hackathon.requirements ? (
                hackathon.requirements.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>No specific requirements for this hackathon.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rules" className="mt-4">
          <Card>
            <CardContent className="prose max-w-none py-6 dark:prose-invert">
              {hackathon.rules ? (
                hackathon.rules.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>Rules will be shared with registered participants.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
