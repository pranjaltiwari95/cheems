"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditDogForm } from "../forms/EditDogForm";
import { Button } from "../ui/button";

interface ManageDogModalProps {
  dog: Doc<"dogs"> | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageDogModal({ dog, isOpen, onClose }: ManageDogModalProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const removeDog = useMutation(api.dogs.removeDog);
  const markDogAsAdopted = useMutation(api.dogs.markDogAsAdopted);

  if (!dog) return null;

  const handleDelete = async () => {
    try {
      await removeDog({ dogId: dog._id });
      toast.success(`${dog.name}'s profile was removed.`);
      onClose();
    } catch (error) {
      toast.error("Failed to remove dog.");
    }
  };

  const handleMarkAsAdopted = async () => {
    try {
      await markDogAsAdopted({ dogId: dog._id });
      toast.success(`${dog.name} has been marked as adopted!`);
      onClose();
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage {dog.name}&#39;s Profile</DialogTitle>
          <DialogDescription>
            Update details, mark as adopted, or remove the listing.
          </DialogDescription>
        </DialogHeader>

        <EditDogForm dog={dog} onFormSubmit={onClose} />

        <div className="mt-6 space-y-2 border-t pt-4">
          <h3 className="font-semibold">Other Actions</h3>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleMarkAsAdopted}
              variant="outline"
              className="w-full"
              disabled={dog.status === "adopted"}
            >
              {dog.status === "adopted" ? "Already Adopted" : "Mark as Adopted"}
            </Button>
            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              className="w-full"
            >
              Delete Listing
            </Button>
          </div>
        </div>
      </DialogContent>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              {dog.name}&#39;s profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, delete profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
