'use client'

import { useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const teamMemberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Team member name is required." })
    .max(120, { message: "Name must not exceed 120 characters." }),
  email: z
    .string()
    .trim()
    .email({ message: "Provide a valid email address." })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value)),
  role: z
    .string()
    .trim()
    .max(80, { message: "Role must not exceed 80 characters." })
    .optional()
    .or(z.literal(""))
    .transform((value) => (value === "" ? undefined : value))
});

const teamFormSchema = z.object({
  teamName: z
    .string()
    .trim()
    .max(120, { message: "Team name must not exceed 120 characters." })
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  teamMembers: z
    .array(teamMemberSchema)
    .max(10, { message: "You can add up to 10 teammates." })
    .optional()
});

export type TeamFormInput = z.input<typeof teamFormSchema>;
export type TeamFormOutput = z.output<typeof teamFormSchema>;

interface TeamFormProps {
  minSize: number;
  maxSize: number;
  onSubmit: (values: TeamFormOutput) => Promise<void>;
  submitting: boolean;
}

export function TeamForm({
  minSize,
  maxSize,
  onSubmit,
  submitting
}: TeamFormProps) {
  const additionalMembersAllowed = Math.max(maxSize - 1, 0);

  const form = useForm<TeamFormInput>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: useMemo(
      () => ({
        teamName: "",
        teamMembers: []
      }),
      []
    )
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers"
  });

  const canAddMore =
    additionalMembersAllowed === 0 ||
    fields.length < additionalMembersAllowed;

  const totalTeamSizePreview =
    1 + (form.watch("teamMembers")?.length ?? 0);

  const submitHandler = async (values: TeamFormInput) => {
    const parsed = teamFormSchema.parse(values);
    await onSubmit(parsed);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/50 p-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Teams must include between{" "}
            <span className="font-medium text-foreground">{minSize}</span> and{" "}
            <span className="font-medium text-foreground">{maxSize}</span>{" "}
            members (including you).
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5" aria-hidden>
              {Array.from({ length: Math.max(maxSize, 1) }, (_, seat) => (
                <span
                  key={seat}
                  className={
                    seat < totalTeamSizePreview
                      ? "size-6 rounded-full border-2 border-background bg-signal"
                      : "size-6 rounded-full border-2 border-dashed border-foreground/25 bg-background"
                  }
                />
              ))}
            </div>
            <span className="font-mono text-xs text-foreground">
              {totalTeamSizePreview}/{maxSize}
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team name (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Team Innovators" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Team members (excluding you)</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ name: "", email: "", role: "" })
              }
              disabled={!canAddMore}
            >
              Add member
            </Button>
          </div>
          <Separator />

          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {additionalMembersAllowed > 0
                ? `You can add up to ${additionalMembersAllowed} teammate${
                    additionalMembersAllowed > 1 ? "s" : ""
                  } now or invite them later from the dashboard.`
                : "This is a solo-friendly hackathon—you can register individually."}
            </p>
          ) : null}

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id} className="gap-0 py-0 shadow-none">
                <CardContent className="space-y-3 py-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      teammate 0{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      Remove
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`teamMembers.${index}.name`}
                    render={({ field: nameField }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input placeholder="Teammate name" {...nameField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.email`}
                      render={({ field: emailField }) => (
                        <FormItem>
                          <FormLabel>Email (optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="teammate@example.com"
                              {...emailField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`teamMembers.${index}.role`}
                      render={({ field: roleField }) => (
                        <FormItem>
                          <FormLabel>Role (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Developer / Designer" {...roleField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Confirm registration"}
        </Button>
      </form>
    </Form>
  );
}
