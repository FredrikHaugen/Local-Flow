import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, test } from "vitest";
import { Header } from "@/components/Header";
import { PageBody } from "@/components/PageBody";
import { PAGES, page, pageUrl } from "@/lib/pages";
import { ALL_PAGE_COPY } from "@/lib/pages/all";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import type { Section } from "@/lib/blocks";
import Home, { metadata as homeMetadata } from "@/app/page";

// Every page's module, by path. Each page task adds its line here.
const ROUTES: Record<string, { default: ComponentType; metadata: unknown }> = {
  "/": { default: Home, metadata: homeMetadata },
};

function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === "object") return Object.values(value).flatMap(strings);
  return [];
}

describe("page registry", () => {
  test("every registered page has a route, and every route is registered", () => {
    expect(Object.keys(ROUTES).sort()).toEqual(PAGES.map((p) => p.path).sort());
  });

  test("paths, titles, descriptions and h1s are unique", () => {
    for (const key of ["path", "title", "description", "h1"] as const) {
      expect(new Set(PAGES.map((p) => p[key])).size, key).toBe(PAGES.length);
    }
  });

  test("titles name peluni and fit a search result", () => {
    for (const p of PAGES) {
      expect(p.title, p.path).toContain(SITE.name);
      expect(p.title.length, p.title).toBeLessThanOrEqual(65);
    }
  });

  test("descriptions are of search-snippet length", () => {
    for (const p of PAGES) {
      expect(p.description.length, p.path).toBeGreaterThanOrEqual(70);
      expect(p.description.length, p.path).toBeLessThanOrEqual(160);
    }
  });

  test("page() rejects an unknown path", () => {
    expect(() => page("/pricing")).toThrow();
  });

  test("pageUrl gives the canonical address", () => {
    expect(pageUrl("/")).toBe(`${SITE.url}/`);
  });
});

describe.each(PAGES.map((p) => [p.path, p] as const))("%s", (path, info) => {
  test("exports the registry's metadata", () => {
    expect(ROUTES[path].metadata).toEqual(pageMetadata(path));
  });

  test("renders exactly one h1, the registry's", () => {
    const Page = ROUTES[path].default;
    render(<Page />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent?.replace(/\s+/g, " ").trim()).toBe(info.h1);
  });

  test("every internal link points at a registered page and an id that exists there", () => {
    const Page = ROUTES[path].default;
    const { container, unmount } = render(<Page />);
    const links = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')].map((a) => a.getAttribute("href")!);
    unmount();
    for (const href of links) {
      const [target, id] = href.split("#");
      expect(PAGES.map((p) => p.path), href).toContain(target);
      if (id) {
        const Target = ROUTES[target].default;
        const { container: there, unmount: done } = render(<Target />);
        expect(there.querySelector(`[id="${id}"]`), href).not.toBeNull();
        done();
      }
    }
  });

  test("every table scrolls inside its own container", () => {
    const Page = ROUTES[path].default;
    const { container } = render(<Page />);
    for (const table of container.querySelectorAll("table")) {
      expect(table.parentElement?.className, path).toContain("overflow-x-auto");
    }
  });
});

describe("header", () => {
  test("marks the current page", () => {
    for (const p of PAGES.filter((p) => p.header)) {
      const { unmount } = render(<Header current={p.path} />);
      expect(screen.getByRole("link", { name: p.nav }).getAttribute("aria-current")).toBe("page");
      unmount();
    }
  });
});

describe("page copy", () => {
  test("autocomplete is only ever described as unfinished", () => {
    for (const s of strings(ALL_PAGE_COPY).filter((s) => /autocomplete/i.test(s))) {
      expect(s).toMatch(/suggestions yet|experimental/i);
    }
  });

  test("PageBody gives each section an h2 with its id", () => {
    const sections: Section[] = [{ id: "one", heading: "One", blocks: [{ p: ["Text."] }] }];
    const { container } = render(<PageBody sections={sections} />);
    expect(container.querySelector("section#one h2")?.textContent).toBe("One");
  });
});
