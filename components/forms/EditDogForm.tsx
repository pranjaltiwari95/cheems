"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { IKContext, IKUpload } from "imagekitio-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  age: z.coerce.number().min(0, "Age cannot be negative.").max(30),
  breed: z.string().min(3, "Breed must be at least 3 characters."),
  gender: z.enum(["Male", "Female"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  vaccinationStatus: z.string().min(3, "Vaccination status is required."),
  healthStatus: z.string().min(3, "Health status is required."),
  imageUrls: z
    .array(z.string())
    .min(1, "At least one image is required for the profile."),
});

type FormValues = z.infer<typeof formSchema>;

const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit/auth");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Authentication request failed:", error);
    throw new Error("Could not authenticate with ImageKit.");
  }
};

interface EditDogFormProps {
  dog: Doc<"dogs">;
  onFormSubmit: () => void;
}

export function EditDogForm({ dog, onFormSubmit }: EditDogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(
    dog.imageUrls
  );

  const updateDog = useMutation(api.dogs.updateDog);

  type DogFormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<DogFormValues>,
    defaultValues: dog,
  });

  useEffect(() => {
    if (dog) {
      form.reset(dog);
      setUploadedImageUrls(dog.imageUrls);
    }
  }, [dog, form]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await updateDog({ dogId: dog._id, ...values });
      toast.success(`${dog.name}'s profile updated successfully!`);
      onFormSubmit();
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <IKContext
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Buddy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age (years)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Golden Retriever" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the dog's gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about the dog's personality, history, and needs."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="healthStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Health Status</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Healthy, Special Needs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vaccinationStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vaccination Status</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fully vaccinated" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="imageUrls"
            render={() => (
              <FormItem>
                <FormLabel>Dog Images</FormLabel>
                <FormControl>
                  <div>
                    {uploadedImageUrls.length > 0 && (
                      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                        {uploadedImageUrls.map((url) => (
                          <Image
                            key={url}
                            src={url}
                            alt="Uploaded dog image"
                            width={120}
                            height={120}
                            className="h-32 w-full rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      {isUploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="text-muted-foreground mb-2 h-8 w-8 animate-spin" />
                          <p className="text-muted-foreground text-sm">
                            Uploading...
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="mb-2 h-8 w-8 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                        </div>
                      )}
                      <IKUpload
                        className="hidden"
                        fileName="dog-image.jpg"
                        useUniqueFileName={true}
                        folder="/dog-adoptions"
                        onUploadStart={() => setIsUploading(true)}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onSuccess={(res: any) => {
                          const newUrl = res.url;
                          const updatedUrls = [
                            ...form.getValues("imageUrls"),
                            newUrl,
                          ];
                          setUploadedImageUrls(updatedUrls);
                          form.setValue("imageUrls", updatedUrls);
                          toast.success("Image uploaded!");
                          setIsUploading(false);
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onError={(err: any) => {
                          toast.error("Image upload failed.");
                          console.error("ImageKit Error:", err);
                          setIsUploading(false);
                        }}
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </IKContext>
  );
}
