import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the machine learning class", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Aprendizagem de Maquina/i);
  assert.match(html, /Supervisionado vs nao supervisionado/i);
  assert.match(html, /Laboratorio de algoritmos/i);
  assert.match(html, /Metricas contam historias diferentes/i);
  assert.match(html, /aprendizagem_maquina_aula\.ipynb/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("keeps class assets and removes starter preview references", async () => {
  const [page, layout, packageJson, notebook] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(
      new URL("../public/notebooks/aprendizagem_maquina_aula.ipynb", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(page, /AutoGluon Tabular, FLAML, TPOT/);
  assert.match(page, /MLPClassifier, MLPRegressor/);
  assert.match(layout, /Aprendizagem de Maquina \| Aula Interativa/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page + layout, /codex-preview|_sites-preview|SkeletonPreview/);
  assert.doesNotThrow(() => JSON.parse(notebook));
  await access(new URL("../public/og.png", import.meta.url));
});
