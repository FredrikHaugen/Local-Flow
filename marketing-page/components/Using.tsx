import { Chapter } from "@/components/Chapter";
import { Kbd } from "@/components/Kbd";
import { USING } from "@/lib/content";

export function Using() {
  return (
    <Chapter id="using" title={USING.title} className="pt-24 sm:pt-32">
      {USING.paragraphs.map((p) => (
        <p key={p} className="mt-5">
          {p}
        </p>
      ))}
      <dl aria-label={USING.keysLabel} className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {USING.keys.map((k) => (
          <div key={`${k.how}-${k.key}`}>
            <dt className="flex items-center gap-2.5 font-sans font-semibold">
              {k.how} <Kbd className="px-2.5 py-1 text-base">{k.key}</Kbd>
            </dt>
            <dd className="mt-2 text-[1.05rem] leading-relaxed text-muted">{k.result}</dd>
          </div>
        ))}
      </dl>
    </Chapter>
  );
}
