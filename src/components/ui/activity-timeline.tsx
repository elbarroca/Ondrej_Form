import { cn } from "@/lib/utils"

type ActivityEvent = {
  id: string
  actor: string
  action: string
  when: string
  state: "done" | "now"
}

type ActivityTimelineProps = {
  events: ActivityEvent[]
  className?: string
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  return (
    <ul className={cn("divide-y-0", className)}>
      {events.map((event, i) => (
        <li
          key={event.id}
          className={cn(
            "relative border-b border-line-soft py-[14px] pl-11 pr-5 text-[13px]",
            i === events.length - 1 && "border-b-0",
            event.state === "done" &&
              "after:absolute after:left-[14px] after:top-[18px] after:size-[10px] after:rounded-full after:bg-emerald after:border-emerald",
            event.state === "now" &&
              "after:absolute after:left-[14px] after:top-[18px] after:size-[10px] after:rounded-full after:bg-brand after:border-brand"
          )}
          style={{
            // Vertical line
            backgroundImage: `linear-gradient(to bottom, var(--tw-gradient-stops))`,
          }}
        >
          {/* Vertical line pseudo-element via ::before */}
          <span className="absolute left-[18px] top-0 bottom-0 w-[2px] bg-line" />
          {i === events.length - 1 && (
            <span className="absolute left-[18px] top-[18px] bottom-0 w-[2px] bg-white" />
          )}
          {/* Circle marker */}
          <span
            className={cn(
              "absolute left-[14px] top-[18px] size-[10px] rounded-full border-2 bg-white",
              event.state === "done" && "border-emerald bg-emerald",
              event.state === "now" && "border-brand bg-brand",
              event.state !== "done" && event.state !== "now" && "border-line"
            )}
          />
          <p>
            <span className="font-semibold">{event.actor}</span>{" "}
            {event.action}
          </p>
          <p className="mt-0.5 text-[11.5px] text-mute">{event.when}</p>
        </li>
      ))}
    </ul>
  )
}
