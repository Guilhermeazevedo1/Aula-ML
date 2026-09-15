import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renderiza a narrativa completa da aula", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Se uma máquina pode aprender/i);
  assert.match(html, /Três formas de aprender/i);
  assert.match(html, /K-Nearest Neighbors/i);
  assert.match(html, /Matriz de confusão/i);
  assert.match(html, /DBSCAN/i);
  assert.match(html, /Deep Learning/i);
  assert.match(html, /FLAML/i);
  assert.match(html, /aprendizagem_de_maquina\.ipynb/i);
  assert.equal((html.match(/data-chapter=/g) ?? []).length, 24);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("mantém os laboratórios modulares e acessíveis", async () => {
  const componentFiles = [
    "FoundationDemos.tsx",
    "ModelDemos.tsx",
    "EvaluationDemos.tsx",
    "DiscoveryDemos.tsx",
    "NeuralAutoMLDemos.tsx",
    "PresentationShell.tsx",
  ];
  const sources = await Promise.all(componentFiles.map((file) => readFile(new URL(`../app/components/${file}`, import.meta.url), "utf8")));
  const source = sources.join("\n");
  assert.match(source, /ArrowRight/);
  assert.match(source, /prefere|DBSCAN|KMeansDemo/);
  assert.match(source, /aria-label/);
  assert.match(source, /Resetar/);
  assert.match(source, /time_budget/);
});

test("entrega notebook, dependências e documentação", async () => {
  const [notebookText, requirements, readme, packageJson] = await Promise.all([
    readFile(new URL("../notebooks/aprendizagem_de_maquina.ipynb", import.meta.url), "utf8"),
    readFile(new URL("../requirements.txt", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  const notebook = JSON.parse(notebookText);
  assert.equal(notebook.nbformat, 4);
  assert.ok(notebook.cells.length >= 40);
  const notebookContent = notebook.cells.flatMap((cell) => cell.source).join("");
  for (const topic of ["Regressão Linear", "K-Nearest Neighbors", "Decision Tree", "Random Forest", "Naive Bayes", "K-Means", "DBSCAN", "PCA", "MLPClassifier", "Deep Learning", "FLAML"]) assert.match(notebookContent, new RegExp(topic, "i"));
  assert.match(requirements, /scikit-learn/);
  assert.match(requirements, /flaml\[automl\]/);
  assert.match(readme, /npm run dev/);
  assert.match(readme, /jupyter notebook/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/notebooks/aprendizagem_de_maquina.ipynb", import.meta.url));
  await access(new URL("../public/og-v2.png", import.meta.url));
});
