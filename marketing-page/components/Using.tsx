import { Chapter } from "@/components/Chapter";
import { USING } from "@/lib/content";

export function Using() {
  return (
    <Chapter id="using" title={USING.title} className="pt-20 sm:pt-28">
      {USING.paragraphs.map((p) => (
        <p key={p} className="mt-5">
          {p}
        </p>
      ))}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse font-sans text-[0.98rem]">
          <caption className="sr-only">{USING.caption}</caption>
          <thead>
            <tr className="border-b-2 border-foreground text-left">
              <th scope="col" className="py-2 pr-6 font-semibold">
                {USING.columns[0]}
              </th>
              <th scope="col" className="py-2 font-semibold">
                {USING.columns[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {USING.keys.map((row) => (
              <tr key={row.press} className="border-b border-border align-top">
                <th scope="row" className="whitespace-nowrap py-3 pr-6 text-left font-semibold">
                  {row.press}
                </th>
                <td className="py-3 text-muted">{row.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Chapter>
  );
}
