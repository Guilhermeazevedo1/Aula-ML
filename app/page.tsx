"use client";

import { ChapterSection, PresentationShell, type Chapter } from "./components/PresentationShell";
import { IntroPipeline, KnnDemo, LearningModes, LinearRegressionDemo, ReinforcementBoard, ScikitFlow } from "./components/FoundationDemos";
import { AlgorithmCards, ClassificationBridge, DecisionTreeDemo, ModelChooser, NaiveBayesDemo, RandomForestDemo } from "./components/ModelDemos";
import { AccuracyTrap, ConfusionMatrixDemo, FitDemo, RegressionMetricsDemo, ThresholdDemo } from "./components/EvaluationDemos";
import { ClusteringIntro, DbscanDemo, KMeansDemo, PcaDemo } from "./components/DiscoveryDemos";
import { AutoMlDemo, ClosingSynthesis, DeepLearningDemo, NeuralNetworkDemo } from "./components/NeuralAutoMLDemos";

const chapters: Chapter[] = [
  { id: "capitulo-01", short: "Pergunta", title: "Como uma máquina aprende?" },
  { id: "capitulo-02", short: "3 formas", title: "Três formas de aprender" },
  { id: "capitulo-03", short: "Scikit", title: "O padrão do Scikit-learn" },
  { id: "capitulo-04", short: "Regressão", title: "Regressão linear" },
  { id: "capitulo-05", short: "Classes", title: "Classificação" },
  { id: "capitulo-06", short: "k-NN", title: "K-Nearest Neighbors" },
  { id: "capitulo-07", short: "Árvore", title: "Árvore de decisão" },
  { id: "capitulo-08", short: "Floresta", title: "Random Forest" },
  { id: "capitulo-09", short: "Bayes", title: "Naive Bayes" },
  { id: "capitulo-10", short: "Avaliar", title: "Como sabemos se o modelo é bom?" },
  { id: "capitulo-11", short: "Matriz", title: "Matriz de confusão" },
  { id: "capitulo-12", short: "P × R", title: "Precision vs Recall" },
  { id: "capitulo-13", short: "Erros", title: "Métricas de regressão" },
  { id: "capitulo-14", short: "Ajuste", title: "Underfitting e overfitting" },
  { id: "capitulo-15", short: "Descobrir", title: "Aprendizado não supervisionado" },
  { id: "capitulo-16", short: "K-Means", title: "K-Means" },
  { id: "capitulo-17", short: "DBSCAN", title: "DBSCAN" },
  { id: "capitulo-18", short: "PCA", title: "PCA" },
  { id: "capitulo-19", short: "Reforço", title: "Aprendizado por reforço" },
  { id: "capitulo-20", short: "Neurônio", title: "De um neurônio para uma rede" },
  { id: "capitulo-21", short: "Deep", title: "Deep Learning" },
  { id: "capitulo-22", short: "AutoML", title: "AutoML" },
  { id: "capitulo-23", short: "Escolher", title: "Qual algoritmo usar?" },
  { id: "capitulo-24", short: "Síntese", title: "Como ela aprende?" },
];

export default function Home() {
  return (
    <PresentationShell chapters={chapters}>
      <section className="hero-chapter" id="capitulo-01" data-chapter="01">
        <div className="hero-dots" aria-hidden="true">{Array.from({ length: 34 }, (_, index) => <i key={index} style={{ left: `${4 + ((index * 37) % 92)}%`, top: `${10 + ((index * 53) % 78)}%`, animationDelay: `${(index % 8) * 130}ms` }} />)}</div>
        <div className="hero-content">
          <div className="hero-meta"><span>AULA 16/09</span><span>APRENDIZAGEM DE MÁQUINA</span></div>
          <h1>Se uma máquina pode aprender... <strong>como ela aprende?</strong></h1>
          <p>Não comece pela definição. Observe os dados.</p>
          <IntroPipeline />
          <button className="hero-advance" type="button" onClick={() => document.getElementById("capitulo-02")?.scrollIntoView({ behavior: "smooth" })}>Começar a investigação <span aria-hidden="true">↓</span></button>
        </div>
      </section>

      <ChapterSection id="capitulo-02" number="02" eyebrow="TRÊS FORMAS DE APRENDER" title="O mesmo mundo. Três tipos de feedback." prompt="O que muda quando mostramos a resposta, escondemos a resposta ou deixamos a máquina agir?" tone="light"><LearningModes /></ChapterSection>
      <ChapterSection id="capitulo-03" number="03" eyebrow="UMA INTERFACE, MUITOS MODELOS" title="Já entendemos a ideia. Agora precisamos ensinar isso ao computador." tone="accent"><ScikitFlow /></ChapterSection>
      <ChapterSection id="capitulo-04" number="04" eyebrow="PRIMEIRO O PROBLEMA" title="Onde você colocaria uma linha que representasse estes pontos?" prompt="Qual seria o salário esperado para alguém com 5 anos de experiência?" tone="light"><LinearRegressionDemo /></ChapterSection>
      <ChapterSection id="capitulo-05" number="05" eyebrow="UMA MUDANÇA DE PERGUNTA" title="Nem sempre queremos prever um número." tone="dark"><ClassificationBridge /></ChapterSection>
      <ChapterSection id="capitulo-06" number="06" eyebrow="OLHE AO REDOR" title="De qual grupo este novo ponto parece fazer parte?" prompt="Escolha uma classe antes de revelar o nome do algoritmo." tone="light"><KnnDemo /></ChapterSection>
      <ChapterSection id="capitulo-07" number="07" eyebrow="DECISÕES COMO PERGUNTAS" title="Que perguntas você faria para tomar esta decisão?" tone="accent"><DecisionTreeDemo /></ChapterSection>
      <ChapterSection id="capitulo-08" number="08" eyebrow="ENSEMBLE" title="E se várias árvores opinassem?" prompt="Uma árvore pode errar. Uma votação pode ser mais robusta." tone="dark"><RandomForestDemo /></ChapterSection>
      <ChapterSection id="capitulo-09" number="09" eyebrow="EVIDÊNCIAS E PROBABILIDADES" title="Esta mensagem parece spam?" prompt="Quais palavras mudam sua crença sobre a classe da mensagem?" tone="light"><NaiveBayesDemo /></ChapterSection>
      <ChapterSection id="capitulo-10" number="10" eyebrow="A PEGADINHA DA ACCURACY" title="Treinar um modelo é apenas metade do problema." prompt="Um modelo que acerta 95% pode ser completamente inútil?" tone="accent"><AccuracyTrap /></ChapterSection>
      <ChapterSection id="capitulo-11" number="11" eyebrow="QUATRO TIPOS DE RESULTADO" title="A matriz que mostra onde o modelo erra." prompt="Clique em cada quadrante e traduza o resultado para o mundo real." tone="light"><ConfusionMatrixDemo /></ChapterSection>
      <ChapterSection id="capitulo-12" number="12" eyebrow="O ERRO DEPENDE DO PROBLEMA" title="Precision vs Recall" prompt="Qual erro é mais grave: deixar passar um caso ou gerar um alarme falso?" tone="dark"><ThresholdDemo /></ChapterSection>
      <ChapterSection id="capitulo-13" number="13" eyebrow="QUANDO A RESPOSTA É UM NÚMERO" title="Quatro maneiras de olhar para os erros." tone="light"><RegressionMetricsDemo /></ChapterSection>
      <ChapterSection id="capitulo-14" number="14" eyebrow="GENERALIZAÇÃO" title="Simples demais, adequado ou complexo demais?" prompt="O melhor modelo não é o que memoriza o conjunto de treino." tone="accent"><FitDemo /></ChapterSection>
      <ChapterSection id="capitulo-15" number="15" eyebrow="SEM TARGET" title="Você consegue perceber grupos sem conhecer as respostas?" tone="dark"><ClusteringIntro /></ChapterSection>
      <ChapterSection id="capitulo-16" number="16" eyebrow="CENTROS QUE SE MOVEM" title="Como descobrir grupos repetindo quatro passos?" tone="light"><KMeansDemo /></ChapterSection>
      <ChapterSection id="capitulo-17" number="17" eyebrow="GRUPOS COM FORMAS LIVRES" title="E se os grupos não forem circulares?" prompt="Compare a divisão pelo centro com a conexão por densidade." tone="accent"><DbscanDemo /></ChapterSection>
      <ChapterSection id="capitulo-18" number="18" eyebrow="REDUÇÃO DE DIMENSIONALIDADE" title="Precisamos de todas essas dimensões?" tone="light"><PcaDemo /></ChapterSection>
      <ChapterSection id="capitulo-19" number="19" eyebrow="APRENDER PELA EXPERIÊNCIA" title="O agente aprende pelas consequências das ações." prompt="Andar custa -1, bater em um obstáculo custa -10 e alcançar o objetivo vale +100." tone="dark"><ReinforcementBoard /></ChapterSection>
      <ChapterSection id="capitulo-20" number="20" eyebrow="DE UM CÁLCULO PARA UMA REDE" title="Pesos, soma, ativação e camadas." tone="light"><NeuralNetworkDemo /></ChapterSection>
      <ChapterSection id="capitulo-21" number="21" eyebrow="MAIS CAMADAS, NOVAS REPRESENTAÇÕES" title="O que muda quando a rede fica profunda?" tone="accent"><DeepLearningDemo /></ChapterSection>
      <ChapterSection id="capitulo-22" number="22" eyebrow="MUITOS MODELOS, UMA BUSCA" title="Qual algoritmo devemos escolher?" prompt="Deixe vários candidatos competir sob o mesmo tempo e a mesma métrica." tone="light"><AutoMlDemo /></ChapterSection>
      <ChapterSection id="capitulo-23" number="23" eyebrow="UM MAPA, NÃO UMA RECEITA" title="Comece pelo tipo de pergunta." tone="dark" compact><ModelChooser /><AlgorithmCards /><div className="notebook-download"><div><span>AGORA, O CÓDIGO</span><strong>As mesmas ideias em poucas linhas de Python.</strong><p>17 seções com Scikit-learn, Keras opcional e AutoML com FLAML.</p></div><a className="primary-button" href="/notebooks/aprendizagem_de_maquina.ipynb" download>Baixar notebook</a></div></ChapterSection>
      <ChapterSection id="capitulo-24" number="24" eyebrow="VOLTAMOS À PERGUNTA INICIAL" title="Se uma máquina pode aprender... como ela aprende?" tone="accent"><ClosingSynthesis /></ChapterSection>
    </PresentationShell>
  );
}
