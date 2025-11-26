

import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import React from "react";

/* ------------------ ZOD SCHEMA ------------------ */
const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().optional(),
  bio: z.string().optional(),
  urls: z.array(z.string().url("Invalid URL")).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

/* ------------------ PAGE ------------------ */
export default function EditProfilePage() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
      urls: [""],
    },
  });

  const { control, handleSubmit, watch, setValue } = form;

  // Populate dummy data
  React.useEffect(() => {
    const dummyUser: ProfileFormValues = {
      username: "shadcn",
      email: "shadcn@example.com",
      bio: "I own a computer.",
      urls: ["https://shadcn.com", "http://twitter.com/shadcn"],
    };
    form.reset(dummyUser);
  }, []);

  const urls = watch("urls") || [];

  const addUrl = () => setValue("urls", [...urls, ""]);
  const removeUrl = (index: number) =>
    setValue(
      "urls",
      urls.filter((_, i) => i !== index)
    );

  const onSubmit: SubmitHandler<ProfileFormValues> = (values) => {
    console.log("Updated profile:", values);
    alert("Profile updated! (Check console for data)");
  };

  return (
    <div className=" py-6 px-4 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          This is how others will see you on the site.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* USERNAME */}
        <Controller
          control={control}
          name="username"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input {...field} placeholder="Username" />
              <p className="text-gray-500 text-sm mt-1">
                This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.
              </p>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {/* EMAIL */}
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input {...field} placeholder="Select a verified email to display" />
              <p className="text-gray-500 text-sm mt-1">
                You can manage verified email addresses in your email settings.
              </p>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {/* BIO */}
        <Controller
          control={control}
          name="bio"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea {...field} placeholder="Tell us about yourself" />
              <p className="text-gray-500 text-sm mt-1">
                You can @mention other users and organizations to link to them.
              </p>
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {/* URLs */}
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-1">URLs</h2>
          <p className="text-xs text-gray-500 mb-2">
            Add links to your website, blog, or social media profiles.
          </p>
          {urls.map((_url, index) => (
            <Controller
              key={index}
              control={control}
              name={`urls.${index}`}
              render={({ field, fieldState }) => (
                <div className="flex gap-2 mb-2">
                  <Input {...field} placeholder="https://example.com" />
                  <Button type="button" variant="destructive" onClick={() => removeUrl(index)}>
                    Remove
                  </Button>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </div>
              )}
            />
          ))}
          <Button type="button" onClick={addUrl}>
            Add URL
          </Button>
        </div>

        {/* SUBMIT */}
        <div className="pt-4">
          <Button type="submit">Update profile</Button>
        </div>
      </form>
    </div>
  );
}
