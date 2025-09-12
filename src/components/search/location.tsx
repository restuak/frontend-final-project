"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/search.store";

export default function LocationPicker({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { setLocation } = useSearchStore();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter a city or destination"
          onChange={(e) => setLocation(e.target.value)}
        />
      </DialogContent>
    </Dialog>
  );
}
