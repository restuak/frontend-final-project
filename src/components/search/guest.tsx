"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSearchStore } from "@/store/search.store";

export default function GuestPicker({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { guests, setGuests } = useSearchStore();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Guests</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setGuests(Math.max(1, guests - 1))}
          >
            -
          </Button>
          <span>{guests}</span>
          <Button variant="outline" onClick={() => setGuests(guests + 1)}>
            +
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
