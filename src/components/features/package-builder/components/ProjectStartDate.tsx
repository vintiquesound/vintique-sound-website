import * as React from "react";

type ProjectStartDateProps = {
  selectedDate: string;
  onSelectDate: (nextDate: string) => void;
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(value: string) {
  const [year, month, day] = value.split("-").map((entry) => Number(entry));
  if (!year || !month || !day) return null;
  const nextDate = new Date(year, month - 1, day);
  if (Number.isNaN(nextDate.getTime())) return null;
  return nextDate;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function isBefore(a: Date, b: Date) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function formatLongDate(value: string) {
  const date = fromDateKey(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function ProjectStartDate({ selectedDate, onSelectDate }: ProjectStartDateProps) {
  const tomorrow = React.useMemo(() => {
    const next = startOfDay(new Date());
    next.setDate(next.getDate() + 1);
    return next;
  }, []);

  const [visibleMonth, setVisibleMonth] = React.useState<Date>(() => {
    const selected = fromDateKey(selectedDate);
    return startOfMonth(selected ?? tomorrow);
  });

  React.useEffect(() => {
    const selected = fromDateKey(selectedDate);
    if (!selected) return;
    setVisibleMonth(startOfMonth(selected));
  }, [selectedDate]);

  const monthLabel = React.useMemo(
    () =>
      new Intl.DateTimeFormat("en-CA", {
        month: "long",
        year: "numeric",
      }).format(visibleMonth),
    [visibleMonth]
  );

  const canGoToPreviousMonth = React.useMemo(() => {
    const previousMonth = addMonths(visibleMonth, -1);
    return endOfMonth(previousMonth).getTime() >= tomorrow.getTime();
  }, [tomorrow, visibleMonth]);

  const calendarCells = React.useMemo(() => {
    const first = startOfMonth(visibleMonth);
    const totalDays = endOfMonth(visibleMonth).getDate();
    const leadingEmpty = first.getDay();
    const cells: Array<Date | null> = [];

    for (let index = 0; index < leadingEmpty; index += 1) {
      cells.push(null);
    }

    for (let day = 1; day <= totalDays; day += 1) {
      cells.push(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [visibleMonth]);

  const selectedDateLongLabel = selectedDate ? formatLongDate(selectedDate) : "";

  return (
    <div className="rounded-lg border border-border p-4 space-y-4">
      <div className="space-y-1">
        <h3 className="font-medium">Project start date</h3>
        <p className="text-sm text-muted-foreground">
          Choose your preferred start date. Availability begins tomorrow and later.
        </p>
      </div>

      <div className="rounded-md border border-border p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setVisibleMonth((prev) => addMonths(prev, -1))}
            disabled={!canGoToPreviousMonth}
          >
            Previous
          </button>
          <div className="font-medium">{monthLabel}</div>
          <button
            type="button"
            className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted/60"
            onClick={() => setVisibleMonth((prev) => addMonths(prev, 1))}
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="py-1">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="h-10" />;
            }

            const dateKey = toDateKey(date);
            const isDisabled = isBefore(date, tomorrow);
            const isSelected = selectedDate === dateKey;

            return (
              <button
                key={dateKey}
                type="button"
                className={[
                  "h-10 rounded-md text-sm transition",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted/60",
                  isDisabled ? "cursor-not-allowed text-muted-foreground/50 hover:bg-transparent" : "",
                ].join(" ")}
                disabled={isDisabled}
                onClick={() => onSelectDate(dateKey)}
                aria-pressed={isSelected}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
        {selectedDateLongLabel ? (
          <span>
            Selected start date: <span className="font-medium">{selectedDateLongLabel}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">No date selected yet.</span>
        )}
      </div>
    </div>
  );
}
