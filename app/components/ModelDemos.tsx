"use client";

import { useState } from "react";

const treePoints = Array.from({ length: 34 }, (_, index) => ({
  x: 8 + ((index * 29) % 84),
  y: 8 + ((index * 47) % 84),
  c: ((index * 29) % 84 > 48 ? 1 : 0) ^ (((index * 47) % 84 > 64 && index % 3 === 0) ? 1 : 0),
}));

const questions = [
  { text: "Tem experiência prática?", yes: 1, no: "Revisar portfólio" },
  { text: "Conhece Python?", yes: 2, no: "Propor desafio técnico" },
  { text: "Possui projetos?", yes: "Avançar candidato", no: "Solicitar projeto curto" },
] as const;

export function DecisionTreeDemo() {
  const [node, setNode] = useState(0);
  const [path, setPath] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [depth, setDepth] = useState(3);

  function answer(choice: "Sim" | "Não") {
    const branch = choice === "Sim" ? questions[node].yes : questions[node].no;
    setPath((items) => [...items, choice]);
    if (typeof branch === "number") setNode(branch);
    else setResult(branch);
  }

  function resetQuestions() {
    setNode(0);
    setPath([]);
    setResult(null);
  }

  return (
    <div className="two-pane-demo tree-demo">
      <div className="human-tree">
        <p className="prompt-label">Que perguntas você faria?</p>
        <div className="tree-path" aria-label="Caminho de respostas">{path.map((item, index) => <span key={index}>{item}</span>)}</div>
        <div className="question-node">
          {!result ? <><span>PERGUNTA {node + 1}</span><strong>{questions[node].text}</strong><div><button type="button" onClick={() => answer("Sim")}>Sim</button><button type="button" onClick={() => answer("Não")}>Não</button></div></> : <><span>DECISÃO</span><strong>{result}</strong><button className="primary-button" type="button" onClick={resetQuestions}>Recomeçar</button></>}
        </div>
        <p className="reveal-name">Você acabou de percorrer uma <strong>DECISION TREE</strong>.</p>
      </div>
      <div className="partition-panel">
        <svg className="plot" viewBox="0 0 480 330" role="img" aria-label={`Divisões de uma árvore com profundidade ${depth}`}>
          <title>Partições do espaço por uma árvore de decisão</title>
          <rect className="partition-base class-0" x="20" y="20" width="440" height="285" />
          <rect className="partition-base class-1" x="232" y="20" width="228" height="285" />
          {depth >= 2 && <rect className="partition-alt" x="232" y="190" width="228" height="115" />}
          {depth >= 3 && <rect className="partition-third" x="20" y="65" width="122" height="120" />}
          {depth >= 4 && <rect className="partition-alt" x="335" y="20" width="55" height="82" />}
          {depth >= 5 && <rect className="partition-third" x="142" y="220" width="90" height="85" />}
          {treePoints.map((point, index) => <g key={index} transform={`translate(${20 + point.x * 4.4} ${305 - point.y * 2.85})`}><circle className={`data-point class-${point.c}`} r="7" /><text className="point-symbol" textAnchor="middle" dy="4">{point.c === 0 ? "●" : "◆"}</text></g>)}
        </svg>
        <label className="range-control"><span>Profundidade <strong>{depth}</strong></span><input type="range" min="1" max="5" value={depth} onChange={(event) => setDepth(Number(event.target.value))} /></label>
        <div className="depth-message"><span>{depth <= 2 ? "Modelo simples demais" : depth <= 4 ? "Divisões úteis" : "Regiões muito específicas"}</span><strong>{depth === 5 ? "risco de overfitting" : `x < limite → nova pergunta`}</strong></div>
      </div>
    </div>
  );
}

const forestSamples = [
  ["gato", "gato", "cachorro", "gato", "cachorro", "gato", "gato"],
  ["cachorro", "gato", "cachorro", "cachorro", "gato", "cachorro", "gato"],
  ["gato", "cachorro", "gato", "gato", "gato", "cachorro", "gato"],
];

export function RandomForestDemo() {
  const [sample, setSample] = useState(0);
  const [details, setDetails] = useState(false);
  const votes = forestSamples[sample];
  const cats = votes.filter((vote) => vote === "gato").length;
  const winner = cats > votes.length / 2 ? "GATO" : "CACHORRO";
  return (
    <div className="forest-demo">
      <div className="forest-stage" aria-label="Sete árvores votando em uma classe">
        {votes.map((vote, index) => (
          <div className="tree-vote" key={`${sample}-${index}`} style={{ animationDelay: `${index * 70}ms` }}>
            <div className="mini-tree" aria-hidden="true"><i /><i /><i /><i /><i /></div>
            <span>Árvore {index + 1}</span>
            <strong>{vote}</strong>
            {details && <small>dados {String.fromCharCode(65 + index)} · features {index % 3 + 1}/{index % 4 + 2}</small>}
          </div>
        ))}
      </div>
      <div className="forest-result">
        <div><span>gato</span><strong>{cats}</strong></div><div><span>cachorro</span><strong>{votes.length - cats}</strong></div>
        <p>VOTO FINAL <strong>{winner}</strong></p>
      </div>
      <div className="demo-toolbar"><button className="primary-button" type="button" onClick={() => setSample((value) => (value + 1) % forestSamples.length)}>Nova votação</button><label className="toggle"><input type="checkbox" checked={details} onChange={(event) => setDetails(event.target.checked)} /><span>Ver detalhes</span></label></div>
      <p className="closing-line">Vários modelos simples combinados podem produzir uma decisão mais robusta. <strong>RANDOM FOREST</strong></p>
    </div>
  );
}

const spamTokens = [
  { word: "Parabéns!", weight: 7 }, { word: "Você", weight: -2 }, { word: "ganhou", weight: 18 },
  { word: "um", weight: -1 }, { word: "prêmio.", weight: 20 }, { word: "Clique", weight: 15 },
  { word: "aqui", weight: 6 }, { word: "agora!", weight: 11 },
];

export function NaiveBayesDemo() {
  const [active, setActive] = useState(() => new Set(spamTokens.map((_, index) => index)));
  const [revealed, setRevealed] = useState(false);
  const spam = Math.max(4, Math.min(96, 18 + spamTokens.reduce((sum, token, index) => sum + (active.has(index) ? token.weight : 0), 0)));

  function toggle(index: number) {
    setActive((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  }

  return (
    <div className="bayes-demo">
      <div className="message-box" aria-label="Mensagem para classificar">
        <span>ASSUNTO: uma oportunidade para você</span>
        <p>{spamTokens.map((token, index) => <button type="button" key={token.word} aria-pressed={active.has(index)} onClick={() => toggle(index)}>{token.word}</button>)}</p>
      </div>
      <div className="probability-bars">
        <div><span>Probabilidade de spam</span><div><i style={{ width: `${spam}%` }} /></div><strong>{spam}%</strong></div>
        <div><span>Probabilidade de não spam</span><div><i style={{ width: `${100 - spam}%` }} /></div><strong>{100 - spam}%</strong></div>
      </div>
      <div className="bayes-equation"><span>crença anterior</span><b>×</b><span>novas evidências</span><b>=</b><strong>crença atualizada</strong></div>
      <div className="reveal-line"><span>Ative e desative palavras. O que muda?</span><button className="primary-button" type="button" onClick={() => setRevealed(true)}>{revealed ? "NAIVE BAYES" : "Revelar algoritmo"}</button></div>
    </div>
  );
}

export function ClassificationBridge() {
  const examples = [
    ["spam", "não spam"], ["fraude", "normal"], ["gato", "cachorro"], ["doente", "saudável"],
  ];
  return (
    <div className="classification-bridge">
      <div><span>REGRESSÃO</span><strong>Qual valor?</strong><b>R$ 82.000</b></div>
      <i aria-hidden="true">→</i>
      <div><span>CLASSIFICAÇÃO</span><strong>Qual categoria?</strong><ul>{examples.map(([a, b]) => <li key={a}><b>{a}</b><small>ou</small><b>{b}</b></li>)}</ul></div>
    </div>
  );
}

export function AlgorithmCards() {
  const cards = [
    ["Regressão linear", "Regressão", "Ajusta uma tendência", "Clara e rápida", "Relações lineares", "Prever salários"],
    ["k-NN", "Classificação / regressão", "Olha os vizinhos", "Muito intuitivo", "Lento em grandes bases", "Classificar espécies"],
    ["Decision Tree", "Classificação / regressão", "Faz perguntas", "Explicável", "Pode memorizar", "Decisão de crédito"],
    ["Random Forest", "Classificação / regressão", "Árvores votam", "Robusto", "Menos interpretável", "Risco de fraude"],
    ["Naive Bayes", "Classificação", "Combina evidências", "Rápido", "Supõe independência", "Detecção de spam"],
    ["K-Means", "Clustering", "Move centróides", "Escalável", "Exige escolher K", "Segmentar clientes"],
    ["DBSCAN", "Clustering", "Conecta densidades", "Acha formas livres", "Sensível aos parâmetros", "Identificar outliers"],
    ["PCA", "Redução dimensional", "Projeta direções", "Facilita visualizar", "Perde interpretação", "Explorar muitas features"],
  ];
  return <div className="algorithm-card-grid">{cards.map((card) => <article key={card[0]}><h3>{card[0]}</h3><p>{card[1]}</p><dl><div><dt>Ideia</dt><dd>{card[2]}</dd></div><div><dt>Vantagem</dt><dd>{card[3]}</dd></div><div><dt>Limitação</dt><dd>{card[4]}</dd></div><div><dt>Exemplo</dt><dd>{card[5]}</dd></div></dl></article>)}</div>;
}

export function ModelChooser() {
  const [target, setTarget] = useState<"unknown" | "yes" | "no">("unknown");
  const [goal, setGoal] = useState<"number" | "category" | "groups" | "dimensions" | "agent">("category");
  const recommendation = target === "unknown" ? "RESPONDA A PRIMEIRA PERGUNTA" : target === "yes" ? (goal === "number" ? "REGRESSÃO" : "CLASSIFICAÇÃO") : ({ groups: "CLUSTERING", dimensions: "PCA", agent: "REINFORCEMENT LEARNING", number: "REGRESSÃO", category: "CLASSIFICAÇÃO" }[goal]);
  return (
    <div className="chooser-demo">
      <div className="chooser-question"><span>01</span><strong>Você possui uma variável que quer prever?</strong><div><button type="button" aria-pressed={target === "yes"} onClick={() => { setTarget("yes"); setGoal("category"); }}>Sim</button><button type="button" aria-pressed={target === "no"} onClick={() => { setTarget("no"); setGoal("groups"); }}>Não</button></div></div>
      {target === "yes" && <div className="chooser-question"><span>02</span><strong>Essa variável é um número ou uma categoria?</strong><div><button type="button" aria-pressed={goal === "number"} onClick={() => setGoal("number")}>Número</button><button type="button" aria-pressed={goal === "category"} onClick={() => setGoal("category")}>Categoria</button></div></div>}
      {target === "no" && <div className="chooser-question"><span>02</span><strong>O que você deseja descobrir?</strong><div><button type="button" aria-pressed={goal === "groups"} onClick={() => setGoal("groups")}>Grupos</button><button type="button" aria-pressed={goal === "dimensions"} onClick={() => setGoal("dimensions")}>Reduzir dimensões</button><button type="button" aria-pressed={goal === "agent"} onClick={() => setGoal("agent")}>Estratégia por experiência</button></div></div>}
      <div className="chooser-result"><span>CAMINHO INICIAL</span><strong>{recommendation}</strong><small>O contexto, os dados e a métrica ainda decidem o modelo final.</small></div>
    </div>
  );
}
