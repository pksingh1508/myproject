'use client'

import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  userProfileUpdateSchema,
  type UserProfileUpdateInput
} from "@/lib/validation/users";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileFormProps {
  defaultValues: Partial<UserProfileUpdateInput>;
  onSubmit: (values: UserProfileUpdateInput) => Promise<void>;
  submitting: boolean;
}

export function ProfileForm({
  defaultValues,
  onSubmit,
  submitting
}: ProfileFormProps) {
  const form = useForm<UserProfileUpdateInput>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: useMemo(
      () => ({
        name: defaultValues.name ?? "",
        college_name: defaultValues.college_name ?? "",
        branch: defaultValues.branch ?? "",
        phone: defaultValues.phone ?? "",
        year_of_study: defaultValues.year_of_study ?? ""
      }),
      [defaultValues]
    )
  });

  const handleSubmit = useCallback(
    (values: UserProfileUpdateInput) => onSubmit(values),
    [onSubmit]
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="college_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College / University</FormLabel>
                <FormControl>
                  <Input placeholder="Your college name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch / Department</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input placeholder="10 digit mobile number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year_of_study"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year of study</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 3rd year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save profile"}
        </Button>
      </form>
    </Form>
  );
}
