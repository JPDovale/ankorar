"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";

import { cn } from "@/lib/utils";

import "react-day-picker/src/style.css";
import "./calendar-overrides.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  showOutsideDays = true,
  locale = ptBR,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={locale}
      className={cn(
        "rdp-root text-xs rounded-lg border border-input p-3",
        "[.rdp-month_caption]:text-xs [.rdp-caption_label]:text-xs [.rdp-caption_label]:font-medium",
        className,
      )}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
