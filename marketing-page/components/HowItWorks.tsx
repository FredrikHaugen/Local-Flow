import { Section } from "@/components/Section";
import { CONTROLS, STEPS } from "@/lib/site";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      title="How it works"
      intro="No app to switch to, no window to click. It works wherever your cursor is."
    >
      <ol className="grid gap-6 sm:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-border bg-card p-6">
            <span aria-hidden="true" className="font-mono text-sm text-accent">
              0{i + 1}
            </span>
            <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
      <table className="mt-12 w-full max-w-xl text-left text-sm">
        <caption className="mb-3 text-left font-semibold">Keyboard controls</caption>
        <tbody>
          {CONTROLS.map((control) => (
            <tr key={control.action} className="border-t border-border">
              <th scope="row" className="py-3 pr-6 font-medium">
                {control.action}
              </th>
              <td className="py-3 text-muted">{control.keys}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
