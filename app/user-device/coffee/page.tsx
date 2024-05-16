"use client";

import { savePreference } from "@/actions/authsignal";
import { Button, ButtonLoading } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Coffee = z.enum(["espresso", "flat-white", "cappuccino", "long-black"], {
  required_error: "Please select a coffee.",
});
type Coffee = z.infer<typeof Coffee>;

const Size = z.enum(["small", "regular", "large"], {
  required_error: "Please select a size.",
});
type Size = z.infer<typeof Size>;

const formSchema = z.object({
  coffee: Coffee,
  size: Size,
  email: z.string().email("Please enter a valid email."),
});

export default function Order() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    await savePreference({
      email: values.email,
      coffeePreference: { coffee: values.coffee, size: values.size },
    });
  };

  return (
    <main className="flex max-h-[calc(100vh-64px)] flex-col items-center justify-center p-24 space-y-6">
      <div className="mx-auto max-w-md space-y-6 py-12">
        <div className="space-y-2 text-center">
          <h1 className="text-xl md:text-3xl font-bold text-center">
            Coffee Preference
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Select your coffee and size preference.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="coffee"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <Label className="text-base font-medium" htmlFor="coffee">
                      Coffee
                    </Label>
                    <FormControl>
                      <RadioGroup
                        className="mt-2 flex flex-col gap-2"
                        id="coffee"
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <Label
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:border-gray-900 [&:has([data-state=checked])]:border-primary"
                          htmlFor="espresso"
                        >
                          <RadioGroupItem
                            id="espresso"
                            value="espresso"
                            className="sr-only"
                          />
                          <div className="font-medium">Espresso</div>
                        </Label>
                        <Label
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:border-gray-900 [&:has([data-state=checked])]:border-primary"
                          htmlFor="flat-white"
                        >
                          <RadioGroupItem
                            id="flat-white"
                            value="flat-white"
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Flat White</div>
                          </div>
                        </Label>
                        <Label
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:border-gray-900 [&:has([data-state=checked])]:border-primary"
                          htmlFor="cappuccino"
                        >
                          <RadioGroupItem
                            id="cappuccino"
                            value="cappuccino"
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Cappuccino</div>
                          </div>
                        </Label>
                        <Label
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:border-gray-900 [&:has([data-state=checked])]:border-primary"
                          htmlFor="long-black"
                        >
                          <RadioGroupItem
                            id="long-black"
                            value="long-black"
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Long Black</div>
                          </div>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <Label className="text-base font-medium" htmlFor="size">
                      Size
                    </Label>
                    <FormControl>
                      <RadioGroup
                        className="mt-2 flex flex-col gap-2"
                        defaultValue={field.value}
                        onChange={field.onChange}
                        id="size"
                      >
                        <Label
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:border-gray-900 [&:has([data-state=checked])]:border-primary"
                          htmlFor="small"
                        >
                          <RadioGroupItem
                            id="small"
                            value="small"
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Small</div>
                          </div>
                        </Label>
                        <Label
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:border-gray-900 [&:has([data-state=checked])]:border-primary"
                          htmlFor="regular"
                        >
                          <RadioGroupItem
                            id="regular"
                            value="regular"
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Regular</div>
                          </div>
                        </Label>
                        <Label
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white p-3 transition-colors hover:border-gray-900 [&:has([data-state=checked])]:border-primary"
                          htmlFor="large"
                        >
                          <RadioGroupItem
                            id="large"
                            value="large"
                            className="sr-only"
                          />
                          <div className="flex-1">
                            <div className="font-medium">Large</div>
                          </div>
                        </Label>
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div>
                    <Label className="text-base font-medium" htmlFor="size">
                      Email
                    </Label>
                    <FormControl>
                      <Input
                        type="email"
                        id="email"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {isLoading ? (
              <ButtonLoading className="w-full" />
            ) : (
              <Button className="w-full" type="submit">
                Save Preference
              </Button>
            )}
          </form>
        </Form>
      </div>
    </main>
  );
}
