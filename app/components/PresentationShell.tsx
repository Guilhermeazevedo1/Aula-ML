"use client";

import { useCallback, useEffect, useState } from "react";

export type Chapter = { id: string; short: string; title: string };

export function PresentationShell({ chapters, children }: { chapters: Chapter[]; children: React.ReactNode }) {
  const [current, setCurrent] = useState(0);
  const [overview, setOverview] = useState(false);

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(chapters.length - 1, index));
    document.getElementById(chapters[next].id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOverview(false);
  }, [chapters]);

  useEffect(() => {
    const sections = chapters.map((chapter) => document.getElementById(chapter.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setCurrent(chapters.findIndex((chapter) => chapter.id === visible.target.id));
    }, { threshold: [.25, .5, .75] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [chapters]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const editing = target.matches("input, button, textarea, select, a");
      if (event.key === "Escape") { setOverview((value) => !value); return; }
      if (editing) return;
      if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") { event.preventDefault(); goTo(current + 1); }
      if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); goTo(current - 1); }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, chapters, goTo]);

  return (
    <main className="presentation-shell">
      <header className="presentation-header">
        <button className="brand-button" type="button" onClick={() => goTo(0)} aria-label="Voltar ao início"><b>ML</b><span>Aprendizagem de Máquina</span></button>
        <div className="chapter-status"><span>{String(current + 1).padStart(2, "0")} / {chapters.length}</span><strong>{chapters[current]?.short}</strong></div>
        <div className="header-actions"><a href="/notebooks/aprendizagem_de_maquina.ipynb" download>Notebook</a><button type="button" onClick={() => setOverview(true)}>Visão geral</button></div>
        <div className="progress-track" aria-hidden="true"><i style={{ width: `${((current + 1) / chapters.length) * 100}%` }} /></div>
      </header>

      <nav className="chapter-rail" aria-label="Capítulos da apresentação">
        {chapters.map((chapter, index) => <button type="button" className={index === current ? "active" : ""} aria-label={`${index + 1}. ${chapter.title}`} aria-current={index === current ? "step" : undefined} onClick={() => goTo(index)} key={chapter.id}><span>{chapter.short}</span></button>)}
      </nav>

      {children}

      <div className="presentation-controls" aria-label="Navegação entre capítulos"><button type="button" aria-label="Capítulo anterior" onClick={() => goTo(current - 1)} disabled={current === 0}>←</button><button type="button" aria-label="Próximo capítulo" onClick={() => goTo(current + 1)} disabled={current === chapters.length - 1}>→</button></div>

      {overview && <div className="overview-backdrop" role="dialog" aria-modal="true" aria-label="Visão geral dos capítulos" onPointerDown={(event) => { if (event.currentTarget === event.target) setOverview(false); }}><div className="overview-panel"><div className="overview-heading"><div><span>ROTEIRO DA AULA</span><h2>24 capítulos</h2></div><button type="button" aria-label="Fechar visão geral" onClick={() => setOverview(false)}>×</button></div><div className="overview-grid">{chapters.map((chapter, index) => <button type="button" className={index === current ? "active" : ""} onClick={() => goTo(index)} key={chapter.id}><span>{String(index + 1).padStart(2, "0")}</span><strong>{chapter.title}</strong></button>)}</div></div></div>}
    </main>
  );
}

export function ChapterSection({ id, number, eyebrow, title, prompt, children, tone = "dark", compact = false }: { id: string; number: string; eyebrow: string; title: string; prompt?: string; children: React.ReactNode; tone?: "dark" | "light" | "accent"; compact?: boolean }) {
  return (
    <section className={`chapter tone-${tone} ${compact ? "chapter-compact" : ""}`} id={id} data-chapter={number}>
      <div className="chapter-inner">
        <div className="chapter-heading"><div className="chapter-number">{number}</div><div><p>{eyebrow}</p><h2>{title}</h2>{prompt && <blockquote>{prompt}</blockquote>}</div></div>
        <div className="chapter-content">{children}</div>
      </div>
    </section>
  );
}
