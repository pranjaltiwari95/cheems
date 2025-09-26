import { DogForm } from "@/components/forms/DogForm";
import { SiteHeader } from "@/components/site-header";

export default function AddNewDogPage() {
  return (
    <>
      <SiteHeader heading="Add Dog" />
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create a New Dog Profile</h1>
          <p className="text-muted-foreground">
            Fill out the form below to list a new dog for adoption.
          </p>
        </div>
        <DogForm />
      </div>
    </>
  );
}
