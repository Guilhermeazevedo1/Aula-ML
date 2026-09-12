"use client";

import { useMemo, useState } from "react";

type AlgorithmId =
  | "linear"
  | "knn"
  | "tree"
  | "forest"
  | "bayes"
  | "automl"
  | "neural";

const algorithms: Array<{
  id: AlgorithmId;
  name: string;
  family: string;
  sklearn: string;
  thesis: string;
  intuition: string;
  use: string;
  caution: string;
  metric: string;
}> = [
  {
    id: "linear",
    name: "Regressao linear",
    family: "Supervisionado",
    sklearn: "LinearRegression, Ridge, LogisticRegression",
    thesis: "Aprende uma reta, plano ou hiperplano que reduz o erro medio.",
    intuition: "Mostra a ideia de ajustar parametros para aproximar uma resposta continua.",
    use: "Precos, notas, demanda, tendencia, baseline interpretavel.",
    caution: "Sofre quando a relacao e muito curva ou quando ha outliers fortes.",
    metric: "MAE, RMSE, R2",
  },
  {
    id: "knn",
    name: "k-NN",
    family: "Supervisionado",
    sklearn: "KNeighborsClassifier, KNeighborsRegressor",
    thesis: "Decide olhando para os vizinhos mais parecidos.",
    intuition: "Nao cria uma formula global; guarda exemplos e consulta a vizinhanca.",
    use: "Recomendacao simples, classificacao didatica, problemas locais.",
    caution: "Precisa de escala normalizada e fica caro com muitos dados.",
    metric: "Acuracia, F1, matriz de confusao",
  },
  {
    id: "tree",
    name: "Arvore de decisao",
    family: "Supervisionado",
    sklearn: "DecisionTreeClassifier, DecisionTreeRegressor",
    thesis: "Divide o espaco em perguntas do tipo: feature <= limite?",
    intuition: "Transforma dados em regras legiveis, como um fluxograma treinado.",
    use: "Explicacao em sala, regras de decisao, dados mistos.",
    caution: "Pode decorar o treino se crescer sem controle.",
    metric: "Acuracia, profundidade, generalizacao",
  },
  {
    id: "forest",
    name: "Random forest",
    family: "Supervisionado",
    sklearn: "RandomForestClassifier, RandomForestRegressor",
    thesis: "Combina muitas arvores treinadas com amostras e variaveis diferentes.",
    intuition: "Uma turma de arvores vota; o erro de uma tende a ser compensado por outras.",
    use: "Tabular robusto, importancia de variaveis, baseline forte.",
    caution: "Menos interpretavel que uma unica arvore e pode ser pesado.",
    metric: "F1, ROC-AUC, erro out-of-bag",
  },
  {
    id: "bayes",
    name: "Naive Bayes",
    family: "Supervisionado",
    sklearn: "GaussianNB, MultinomialNB, BernoulliNB",
    thesis: "Calcula probabilidades por classe assumindo independencia entre atributos.",
    intuition: "Muito rapido: soma evidencias e escolhe a classe mais provavel.",
    use: "Texto, spam, triagem rapida, primeiro classificador probabilistico.",
    caution: "A hipotese de independencia pode ser irreal, mas costuma funcionar bem.",
    metric: "Precision, recall, log loss",
  },
  {
    id: "automl",
    name: "AutoML",
    family: "Meta-aprendizagem",
    sklearn: "AutoGluon Tabular, FLAML, TPOT",
    thesis: "Automatiza busca de modelos, hiperparametros e combinacoes.",
    intuition: "Boa escolha para demonstrar o ciclo completo sem esconder a avaliacao.",
    use: "Competicoes, prototipos tabulares, comparacao de muitos modelos.",
    caution: "Nao substitui entendimento dos dados, vazamento, metricas e custo.",
    metric: "Leaderboard com validacao",
  },
  {
    id: "neural",
    name: "Rede neural e deep learning",
    family: "Supervisionado e representacional",
    sklearn: "MLPClassifier, MLPRegressor; PyTorch/Keras para deep learning",
    thesis: "Camadas aprendem representacoes intermediarias por otimizacao.",
    intuition: "Cada camada transforma sinais ate que a saida fique util para a tarefa.",
    use: "Imagem, audio, texto, problemas com muitos dados e padroes complexos.",
    caution: "Exige mais dados, ajuste cuidadoso e interpretacao mais dificil.",
    metric: "Loss, accuracy, F1, validacao",
  },
];

const lessonBlocks = [
  ["1", "Problema", "Transformar pergunta humana em tarefa de previsao, classificacao ou agrupamento."],
  ["2", "Dados", "Separar atributos, alvo, treino, teste e possiveis vieses."],
  ["3", "Modelo", "Escolher algoritmo pela forma do problema, nao pelo nome mais bonito."],
  ["4", "Avaliacao", "Medir erro, discutir trade-offs e evitar decorar o conjunto de treino."],
];

function scoreFor(id: AlgorithmId, split: number, noise: number, complexity: number) {
  const base = {
    linear: 74,
    knn: 78,
    tree: 75,
    forest: 84,
    bayes: 72,
    automl: 88,
    neural: 81,
  }[id];
  const overfitPenalty =
    (id === "tree" || id === "neural") && complexity > 7 ? (complexity - 7) * 2.8 : 0;
  const localBoost = id === "knn" ? Math.max(0, 4 - Math.abs(complexity - 4)) : 0;
  const splitPenalty = Math.abs(split - 75) * 0.16;
  const noisePenalty = noise * (id === "forest" || id === "automl" ? 0.55 : 0.85);
  const score = base + localBoost + complexity * 0.7 - splitPenalty - noisePenalty - overfitPenalty;
  return Math.max(48, Math.min(96, Math.round(score)));
}

function makeDots(noise: number, selected: AlgorithmId) {
  return Array.from({ length: 46 }, (_, index) => {
    const angle = index * 0.78;
    const radius = 18 + ((index * 13) % 28);
    const side = index % 2 === 0 ? 1 : -1;
    const wobble = ((index * 17) % 11) - 5;
    const x = 50 + Math.cos(angle) * radius + wobble * 0.8;
    const y =
      52 +
      Math.sin(angle) * radius * 0.72 +
      side * (selected === "linear" ? 12 : selected === "tree" ? 18 : 8) +
      noise * (((index * 7) % 9) - 4) * 0.22;
    const klass = y + (selected === "linear" ? x * 0.22 - 12 : 0) > 54 ? "hot" : "cool";
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(10, Math.min(88, y)),
      klass,
    };
  });
}

function decisionClass(id: AlgorithmId) {
  if (id === "linear") return "linear-surface";
  if (id === "tree") return "tree-surface";
  if (id === "forest") return "forest-surface";
  if (id === "bayes") return "bayes-surface";
  if (id === "neural") return "neural-surface";
  if (id === "automl") return "automl-surface";
  return "knn-surface";
}

export default function Home() {
  const [selected, setSelected] = useState<AlgorithmId>("forest");
  const [split, setSplit] = useState(75);
  const [noise, setNoise] = useState(12);
  const [complexity, setComplexity] = useState(5);
  const [mode, setMode] = useState<"supervised" | "unsupervised">("supervised");

  const algorithm = algorithms.find((item) => item.id === selected) ?? algorithms[0];
  const score = scoreFor(selected, split, noise, complexity);
  const dots = useMemo(() => makeDots(noise, selected), [noise, selected]);
  const falsePositives = Math.max(2, Math.round((100 - score) / 4));
  const falseNegatives = Math.max(2, Math.round((100 - score) / 5));
  const truePositives = 42 - falseNegatives;
  const trueNegatives = 38 - falsePositives;
  const precision = Math.round((truePositives / (truePositives + falsePositives)) * 100);
  const recall = Math.round((truePositives / (truePositives + falseNegatives)) * 100);
  const f1 = Math.round((2 * precision * recall) / (precision + recall));

  return (
    <main className="page-shell">
      <nav className="topbar" aria-label="Navegacao principal">
        <a href="#inicio" className="brand">
          <span className="brand-mark">ML</span>
          <span>Aprendizagem de Maquina</span>
        </a>
        <div className="nav-links">
          <a href="#tipos">Tipos</a>
          <a href="#algoritmos">Algoritmos</a>
          <a href="#metricas">Metricas</a>
          <a href="#notebook">Notebook</a>
        </div>
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Aula de 16/09</p>
          <h1>Como maquinas aprendem com exemplos, padroes e erros medidos.</h1>
          <p className="hero-text">
            Uma apresentacao interativa para conduzir a turma por aprendizado
            supervisionado, nao supervisionado, algoritmos classicos do
            scikit-learn, AutoML, redes neurais e metricas de avaliacao.
          </p>
          <div className="hero-actions">
            <a href="#algoritmos" className="primary-action">
              Explorar algoritmos
            </a>
            <a href="/notebooks/aprendizagem_maquina_aula.ipynb" className="secondary-action">
              Baixar notebook
            </a>
          </div>
        </div>
        <div className="hero-board" aria-label="Mapa visual de classificacao">
          <div className={`decision-plane ${decisionClass(selected)}`}>
            {dots.map((dot, index) => (
              <span
                key={`${dot.x}-${dot.y}-${index}`}
                className={`sample-dot ${dot.klass}`}
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              />
            ))}
            <div className="axis x-axis">feature 1</div>
            <div className="axis y-axis">feature 2</div>
          </div>
          <div className="board-caption">
            <strong>{algorithm.name}</strong>
            <span>{algorithm.thesis}</span>
          </div>
        </div>
      </section>

      <section className="section band">
        <div className="section-heading">
          <p className="eyebrow">Roteiro didatico</p>
          <h2>Da pergunta ao modelo avaliado</h2>
        </div>
        <div className="lesson-grid">
          {lessonBlocks.map(([step, title, text]) => (
            <article className="lesson-card" key={step}>
              <span>{step}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section" id="tipos">
        <div>
          <p className="eyebrow">Tipos de aprendizagem</p>
          <h2>Supervisionado vs nao supervisionado</h2>
          <p className="section-copy">
            A diferenca central e a presenca do alvo. No supervisionado, cada
            exemplo vem com resposta esperada. No nao supervisionado, o modelo
            procura estrutura nos dados sem uma resposta dada.
          </p>
          <div className="segmented" role="tablist" aria-label="Tipo de aprendizagem">
            <button
              className={mode === "supervised" ? "active" : ""}
              onClick={() => setMode("supervised")}
              type="button"
            >
              Supervisionado
            </button>
            <button
              className={mode === "unsupervised" ? "active" : ""}
              onClick={() => setMode("unsupervised")}
              type="button"
            >
              Nao supervisionado
            </button>
          </div>
        </div>
        <div className="comparison-panel">
          {mode === "supervised" ? (
            <>
              <h3>Quando existe resposta certa no treino</h3>
              <p>
                O modelo observa pares X e y: atributos de entrada e o alvo.
                Depois tenta prever y para novos X.
              </p>
              <div className="mini-table">
                <span>Entrada</span>
                <span>Alvo</span>
                <span>horas de estudo, faltas</span>
                <strong>aprovado?</strong>
                <span>area, quartos, bairro</span>
                <strong>preco</strong>
              </div>
            </>
          ) : (
            <>
              <h3>Quando queremos descobrir estrutura</h3>
              <p>
                O modelo recebe apenas X e procura grupos, dimensoes latentes,
                anomalias ou representacoes uteis.
              </p>
              <div className="cluster-strip" aria-label="Tres agrupamentos de pontos">
                <span />
                <span />
                <span />
              </div>
              <p className="fine-print">Exemplos: K-Means, DBSCAN, PCA, clustering hierarquico.</p>
            </>
          )}
        </div>
      </section>

      <section className="section" id="algoritmos">
        <div className="section-heading">
          <p className="eyebrow">Laboratorio de algoritmos</p>
          <h2>Troque o algoritmo e discuta o que muda</h2>
        </div>
        <div className="algorithm-layout">
          <aside className="algorithm-list" aria-label="Lista de algoritmos">
            {algorithms.map((item) => (
              <button
                key={item.id}
                className={selected === item.id ? "algorithm-button active" : "algorithm-button"}
                onClick={() => setSelected(item.id)}
                type="button"
              >
                <span>{item.name}</span>
                <small>{item.family}</small>
              </button>
            ))}
          </aside>

          <div className="algorithm-stage">
            <div className="stage-visual">
              <div className={`decision-plane ${decisionClass(selected)}`}>
                {dots.map((dot, index) => (
                  <span
                    key={`${selected}-${dot.x}-${index}`}
                    className={`sample-dot ${dot.klass}`}
                    style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="algorithm-notes">
              <p className="pill">{algorithm.family}</p>
              <h3>{algorithm.name}</h3>
              <p>{algorithm.intuition}</p>
              <dl>
                <div>
                  <dt>Scikit-learn ou lib</dt>
                  <dd>{algorithm.sklearn}</dd>
                </div>
                <div>
                  <dt>Bom para</dt>
                  <dd>{algorithm.use}</dd>
                </div>
                <div>
                  <dt>Cuidado</dt>
                  <dd>{algorithm.caution}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="section playground">
        <div className="section-heading compact">
          <p className="eyebrow">Simulador de sala</p>
          <h2>Complexidade, ruido e divisao treino/teste</h2>
        </div>
        <div className="control-row">
          <label>
            <span>Treino</span>
            <input
              type="range"
              min="50"
              max="90"
              value={split}
              onChange={(event) => setSplit(Number(event.target.value))}
            />
            <strong>{split}%</strong>
          </label>
          <label>
            <span>Ruido</span>
            <input
              type="range"
              min="0"
              max="35"
              value={noise}
              onChange={(event) => setNoise(Number(event.target.value))}
            />
            <strong>{noise}%</strong>
          </label>
          <label>
            <span>Complexidade</span>
            <input
              type="range"
              min="1"
              max="10"
              value={complexity}
              onChange={(event) => setComplexity(Number(event.target.value))}
            />
            <strong>{complexity}</strong>
          </label>
        </div>
        <div className="score-panel">
          <div>
            <span className="score-label">Pontuacao simulada</span>
            <strong>{score}%</strong>
          </div>
          <p>
            Use como provocacao: aumentar complexidade pode melhorar o treino,
            mas tambem pode reduzir generalizacao quando ha ruido.
          </p>
        </div>
      </section>

      <section className="section metrics" id="metricas">
        <div>
          <p className="eyebrow">Avaliacao</p>
          <h2>Metricas contam historias diferentes</h2>
          <p className="section-copy">
            Acuracia e facil de entender, mas precision, recall e F1 mostram
            erros assimetricos. Em regressao, MAE, RMSE e R2 ajudam a comparar
            tamanho do erro e qualidade do ajuste.
          </p>
        </div>
        <div className="metric-board">
          <div className="confusion" aria-label="Matriz de confusao simulada">
            <span />
            <strong>Prev. sim</strong>
            <strong>Prev. nao</strong>
            <strong>Real sim</strong>
            <b>{truePositives}</b>
            <b className="miss">{falseNegatives}</b>
            <strong>Real nao</strong>
            <b className="miss">{falsePositives}</b>
            <b>{trueNegatives}</b>
          </div>
          <div className="metric-stack">
            <p><span>Precision</span><strong>{precision}%</strong></p>
            <p><span>Recall</span><strong>{recall}%</strong></p>
            <p><span>F1</span><strong>{f1}%</strong></p>
            <p><span>{algorithm.metric}</span><strong>foco</strong></p>
          </div>
        </div>
      </section>

      <section className="section notebook" id="notebook">
        <div>
          <p className="eyebrow">Material pratico</p>
          <h2>Notebook explicativo para acompanhar a aula</h2>
          <p className="section-copy">
            O notebook inclui exemplos pequenos em Python com scikit-learn:
            treino/teste, regressao, classificadores, clustering, metricas,
            rede neural simples e uma celula opcional de AutoML.
          </p>
          <a className="primary-action" href="/notebooks/aprendizagem_maquina_aula.ipynb">
            Abrir notebook .ipynb
          </a>
        </div>
        <div className="notebook-cells" aria-label="Topicos do notebook">
          {[
            "Dataset sintetico e split",
            "Regressao linear",
            "k-NN, arvore e random forest",
            "Naive Bayes",
            "K-Means e PCA",
            "Metricas de classificacao e regressao",
            "MLP e deep learning",
            "AutoML com AutoGluon ou FLAML",
          ].map((cell, index) => (
            <div key={cell}>
              <span>In [{index + 1}]</span>
              <p>{cell}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>Referencias: scikit-learn User Guide, AutoGluon Tabular e FLAML.</span>
        <span>Preparado para apresentacao interativa em 16/09.</span>
      </footer>
    </main>
  );
}
