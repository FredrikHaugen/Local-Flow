import { Chapter } from "@/components/Chapter";
import { Kbd } from "@/components/Kbd";
import { USING } from "@/lib/content";

export function Using() {
  return (
    <Chapter id="using" title={USING.title} className="pt-20 sm:pt-28">
      {USING.paragraphs.map((p) => (
        <p key={p} className="mt-5">
          {p}
        </p>
      ))}
      {/* A key legend: each key once, with what it does. */}
      <dl aria-label={USING.keysLabel} className="mt-8 space-y-3 font-sans">
        {USING.keys.map((k) => (
          <div key={`${k.how}-${k.key}`} className="flex flex-wrap items-baseline gap-x-3">
            <dt className="flex min-w-[11rem] items-baseline gap-2 font-semibold">
              {k.how} <Kbd>{k.key}</Kbd>
            </dt>
            <dd>{k.result}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6">{USING.keysEnd}</p>
    </Chapter>
  );
}
