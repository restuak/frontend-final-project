"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useSearchStore } from "@/store/search";
import { DateRange } from "react-day-picker";

export default function DatePicker({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { dateRange, setDateRange } = useSearchStore();

  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      setDateRange([
        range.from?.toISOString() || "",
        range.to?.toISOString() || "",
      ]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pilih Tanggal</DialogTitle>
        </DialogHeader>
        <Calendar
          mode="range"
          selected={{
            from: dateRange[0] ? new Date(dateRange[0]) : undefined,
            to: dateRange[1] ? new Date(dateRange[1]) : undefined,
          }}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </DialogContent>
    </Dialog>
  );
}
