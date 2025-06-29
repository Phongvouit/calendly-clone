"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { eventFormSchema } from "@/schema/events";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { useTransition } from "react";
import { createEvent, updateEvent } from "@/server/actions/events";
import { useRouter } from "next/navigation";

export default function EventForm({
  event,
}: {
  event?: {
    id: string;
    name: string;
    description?: string;
    durationInMinutes: number;
    isActive: boolean;
  };
}) {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event
      ? {
          ...event,
        }
      : {
          isActive: true,
          durationInMinutes: 30,
          description: "",
          name: "",
        },
  });

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    const action =
      event == null ? createEvent : updateEvent.bind(null, event.id);
    try {
      await action(values);
      router.push("/events");
    } catch (error: any) {
      form.setError("root", {
        message: `There was an error saving your event ${error.message}`,
      });
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The name users will see when booking
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationInMinutes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>In minutes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Textarea className="resize-none h-32" {...field} />
              </FormControl>
              <FormDescription>
                {" "}
                Optional description of the event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription> Active</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 justify-end">
          {event && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="cursor-pointer hover:scale-105 hover:bg-red-700"
                  variant="destructive"
                  disabled={isDeletePending || form.formState.isSubmitting}
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-700 cursor-pointer"
                    disabled={isDeletePending || form.formState.isSubmitting}
                  ></AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            disabled={isDeletePending || form.formState.isSubmitting}
            type="button"
            variant="outline"
          >
            Submit
          </Button>

          <Button
            disabled={isDeletePending || form.formState.isSubmitting}
            className="cursor-pointer hover:scale-105 bg-blue-400 hover:bg-blue-600"
            type="submit"
          >
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
