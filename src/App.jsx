import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ─── FONTS ──────────────────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=Unbounded:wght@700;900&display=swap');`;

/* ─── STYLES ─────────────────────────────────────────────────────────── */
const CSS = `
:root{
  --bg:#ffffff;--bg1:#f7f7f5;--bg2:#eeeeec;--bg3:#e5e5e3;
  --border:rgba(0,0,0,0.12);--border2:rgba(0,0,0,0.08);
  --amber:#d97706;--amber2:#b45309;--amber3:#f59e0b;
  --green:#059669;--red:#dc2626;--blue:#2563eb;--cyan:#0891b2;
  --purple:#7c3aed;
  --text:#000000;--text2:#1a1a1a;--text3:#333333;
}
*{box-sizing:border-box;margin:0;padding:0}
.root{
  font-family:'IBM Plex Mono',monospace;
  background:var(--bg);
  color:var(--text);
  min-height:100vh;
  overflow-x:hidden;
  font-size:13px;
}

/* SCANLINES */
.root::before{
  content:'';position:fixed;inset:0;
  background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.015) 2px,rgba(0,0,0,0.015) 4px);
  pointer-events:none;z-index:9999;
}

/* TOP BAR */
.topbar{
  display:flex;align-items:center;
  padding:0 1rem;height:40px;
  background:var(--bg1);
  border-bottom:1px solid var(--border);
  gap:1.5rem;
  position:sticky;top:0;z-index:100;
}
.topbar-brand{
  font-family:'Unbounded',sans-serif;
  font-size:11px;letter-spacing:0.25em;
  color:var(--amber);text-transform:uppercase;
  white-space:nowrap;
}
.topbar-sep{width:1px;height:16px;background:var(--border);flex-shrink:0}
.ticker{
  display:flex;align-items:center;gap:1.5rem;
  overflow:hidden;flex:1;
}
.tick-item{
  display:flex;align-items:center;gap:0.4rem;
  font-size:11px;white-space:nowrap;color:var(--text2);
  flex-shrink:0;
}
.tick-val{color:var(--amber);font-weight:600}
.tick-up{color:var(--green)}
.tick-dn{color:var(--red)}
.topbar-right{
  font-size:10px;color:var(--text3);
  white-space:nowrap;letter-spacing:0.1em;
  flex-shrink:0;
  display:flex;gap:0.75rem;align-items:center;
}

/* MODE TOGGLE */
.mode-toggle{
  display:flex;
  border:1px solid var(--border);
  overflow:hidden;
}
.mode-btn{
  font-family:'IBM Plex Mono',monospace;
  font-size:9px;letter-spacing:0.1em;
  padding:5px 12px;
  border:none;
  background:transparent;
  color:var(--text3);
  cursor:pointer;
  transition:all 0.15s;
}
.mode-btn:hover{color:var(--amber)}
.mode-btn.active{background:var(--amber);color:#fff}

/* SCENARIO BUTTONS */
.scenario-btns{display:flex;gap:4px}
.scenario-btn{
  font-family:'IBM Plex Mono',monospace;
  font-size:9px;letter-spacing:0.1em;
  padding:4px 10px;
  border:1px solid var(--border2);
  background:transparent;
  color:var(--text3);
  cursor:pointer;
  transition:all 0.15s;
}
.scenario-btn:hover{border-color:var(--amber);color:var(--amber)}
.scenario-btn.active{background:var(--amber);color:#fff;border-color:var(--amber)}

/* STATUS BAR */
.statusbar{
  display:flex;align-items:center;
  padding:0 1rem;height:28px;
  background:var(--bg1);
  border-bottom:1px solid var(--border2);
  gap:1rem;overflow-x:auto;
}
.status-chip{
  display:flex;align-items:center;gap:0.35rem;
  font-size:10px;letter-spacing:0.1em;text-transform:uppercase;
  white-space:nowrap;
  padding:0 0.6rem;height:22px;
  border:1px solid var(--border2);
}
.status-chip.alarm{border-color:rgba(220,38,38,0.45);color:#dc2626;background:rgba(220,38,38,0.08);animation:blink-alarm 1s step-end infinite}
.status-chip.ok{border-color:rgba(5,150,105,0.35);color:#059669}
.status-chip.warn{border-color:rgba(217,119,6,0.35);color:#d97706}
.status-chip.idle{color:var(--text3)}
.status-chip.purple{border-color:rgba(124,58,237,0.35);color:#7c3aed}
@keyframes blink-alarm{0%,100%{opacity:1}50%{opacity:0.4}}
.status-dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0}

/* LAYOUT */
.layout{display:grid;grid-template-columns:260px 1fr;min-height:calc(100vh - 68px)}
.sidebar{
  background:var(--bg1);
  border-right:1px solid var(--border);
  padding:0;
  overflow-y:auto;
}
.main{padding:1rem;overflow-y:auto;background:var(--bg)}

/* SIDEBAR SECTIONS */
.sb-section{border-bottom:1px solid var(--border2);padding:0.75rem}
.sb-title{
  font-size:9px;letter-spacing:0.25em;text-transform:uppercase;
  color:var(--text3);margin-bottom:0.6rem;
  display:flex;align-items:center;gap:0.4rem;
}
.sb-title::before{content:'';width:2px;height:8px;background:var(--amber);flex-shrink:0}

/* INPUT ROWS */
.input-row{margin-bottom:0.6rem}
.input-label{font-size:10px;color:var(--text2);margin-bottom:0.3rem;display:flex;justify-content:space-between}
.input-val{color:var(--amber);font-weight:600}
.slider{
  width:100%;-webkit-appearance:none;appearance:none;
  height:3px;background:var(--border);outline:none;cursor:pointer;
  display:block;
}
.slider::-webkit-slider-thumb{
  -webkit-appearance:none;width:14px;height:14px;
  background:var(--amber);cursor:pointer;
  clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);
}

/* FEEDBACK LOOP INDICATORS */
.loop-grid{display:flex;flex-direction:column;gap:4px}
.loop-item{
  display:flex;align-items:center;gap:5px;
  font-size:9px;color:var(--text3);
  padding:4px 5px;border:1px solid transparent;
  transition:all 0.3s;
}
.loop-item.triggered{
  color:#d97706;
  border-color:rgba(217,119,6,0.25);
  background:rgba(217,119,6,0.06);
}
.loop-item.danger{color:#dc2626;border-color:rgba(220,38,38,0.25);background:rgba(220,38,38,0.06)}
.loop-arrow{font-size:9px;flex-shrink:0}

/* RUN BUTTON */
.run-btn{
  width:100%;height:36px;
  background:var(--amber);color:#fff;
  font-family:'IBM Plex Mono',monospace;
  font-size:11px;font-weight:700;
  letter-spacing:0.15em;text-transform:uppercase;
  border:none;cursor:pointer;
  transition:all 0.15s;
  display:flex;align-items:center;justify-content:center;gap:0.4rem;
}
.run-btn:hover{background:var(--amber2)}
.run-btn:active{background:var(--amber3)}
.run-btn:disabled{background:var(--text3);color:var(--bg2);cursor:not-allowed}

/* EXPORT BUTTONS */
.export-row{display:flex;gap:4px;margin-top:0.5rem}
.export-btn{
  flex:1;height:28px;
  background:transparent;
  border:1px solid var(--border);
  color:var(--text2);
  font-family:'IBM Plex Mono',monospace;
  font-size:9px;letter-spacing:0.1em;
  cursor:pointer;
  transition:all 0.15s;
}
.export-btn:hover{border-color:var(--amber);color:var(--amber)}

/* PROGRESS */
.progress-wrap{height:2px;background:var(--border2);width:100%}
.progress-bar{height:100%;background:var(--amber);transition:width 0.2s ease}

/* MAIN PANELS */
.panel-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-bottom:1px;background:var(--border2)}
.kpi-panel{
  background:var(--bg);
  padding:0.65rem 0.75rem;
  position:relative;
}
.kpi-panel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
}
.kpi-panel.amber::before{background:var(--amber)}
.kpi-panel.green::before{background:var(--green)}
.kpi-panel.red::before{background:var(--red)}
.kpi-panel.blue::before{background:var(--blue)}
.kpi-panel.cyan::before{background:var(--cyan)}
.kpi-panel.purple::before{background:var(--purple)}

.kpi-label{font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--text3);margin-bottom:0.35rem}
.kpi-p50{font-size:1.8rem;font-weight:700;line-height:1;letter-spacing:-0.04em;color:var(--amber)}
.kpi-p50.green{color:var(--green)}
.kpi-p50.red{color:var(--red)}
.kpi-p50.blue{color:var(--blue)}
.kpi-p50.cyan{color:var(--cyan)}
.kpi-p50.purple{color:var(--purple)}
.kpi-unit{font-size:11px;font-weight:400;color:var(--text3);margin-left:2px}
.kpi-band{font-size:9px;color:var(--text3);margin-top:0.2rem;display:flex;gap:0.6rem}
.kpi-band span{color:var(--text2)}
.kpi-delta{
  font-size:9px;
  display:inline-flex;align-items:center;
  padding:2px 5px;margin-top:3px;
}
.delta-up{color:#059669;background:rgba(5,150,105,0.1)}
.delta-dn{color:#dc2626;background:rgba(220,38,38,0.1)}

/* AI RECOMMENDATIONS PANEL */
.ai-panel{
  background:linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(8,145,178,0.04) 100%);
  border:1px solid rgba(124,58,237,0.25);
  padding:1rem;
  margin-bottom:1px;
  position:relative;
  overflow:hidden;
}
.ai-panel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg, var(--purple), var(--cyan));
}
.ai-header{
  display:flex;align-items:center;gap:0.5rem;
  margin-bottom:0.75rem;
}
.ai-icon{font-size:16px}
.ai-title{
  font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
  color:var(--purple);font-weight:600;
}
.ai-subtitle{font-size:9px;color:var(--text3);margin-left:auto}
.ai-grid{display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem}
.ai-rec{
  background:rgba(255,255,255,0.7);
  border:1px solid var(--border2);
  padding:0.75rem;
  position:relative;
  box-shadow:0 1px 3px rgba(0,0,0,0.08);
}
.ai-rec-priority{
  position:absolute;top:0.5rem;right:0.5rem;
  font-size:8px;letter-spacing:0.1em;
  padding:2px 6px;
  border:1px solid;
}
.ai-rec-priority.high{color:#dc2626;border-color:rgba(220,38,38,0.35)}
.ai-rec-priority.medium{color:#d97706;border-color:rgba(217,119,6,0.35)}
.ai-rec-priority.low{color:#059669;border-color:rgba(5,150,105,0.35)}
.ai-rec-action{
  font-size:12px;font-weight:600;color:var(--text);
  margin-bottom:0.4rem;display:flex;align-items:center;gap:0.4rem;
}
.ai-rec-action::before{content:'▶';color:var(--purple);font-size:8px}
.ai-rec-impact{font-size:10px;color:var(--text2);margin-bottom:0.5rem;line-height:1.5}
.ai-rec-metrics{display:flex;gap:1rem;flex-wrap:wrap}
.ai-metric{
  display:flex;flex-direction:column;gap:2px;
  padding:4px 8px;background:rgba(0,0,0,0.04);
}
.ai-metric-label{font-size:7px;letter-spacing:0.1em;color:var(--text3);text-transform:uppercase}
.ai-metric-val{font-size:11px;font-weight:600}
.ai-metric-val.up{color:#059669}
.ai-metric-val.dn{color:#dc2626}
.ai-risk{
  margin-top:0.75rem;padding:0.5rem;
  background:rgba(220,38,38,0.08);
  border:1px solid rgba(220,38,38,0.25);
}
.ai-risk-title{font-size:8px;letter-spacing:0.15em;color:#dc2626;margin-bottom:0.3rem}
.ai-risk-text{font-size:10px;color:var(--text2)}

/* MODEL QUALITY BADGE */
.model-badge{
  background:var(--bg1);
  border:1px solid var(--border);
  padding:0.75rem;
  margin-bottom:1px;
}
.model-badge-title{
  font-size:8px;letter-spacing:0.2em;text-transform:uppercase;
  color:var(--text3);margin-bottom:0.5rem;
  display:flex;align-items:center;gap:0.4rem;
}
.model-badge-title::before{content:'🏛️'}
.model-features{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem}
.model-feature{
  display:flex;align-items:center;gap:0.4rem;
  font-size:9px;color:var(--text2);
}
.model-feature::before{content:'✓';color:#059669;font-size:8px}
.model-note{font-size:8px;color:var(--text3);margin-top:0.5rem;font-style:italic}

/* CHART PANELS */
.chart-row{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border2);margin-bottom:1px}
.chart-panel{background:var(--bg2);padding:0.75rem;position:relative}
.chart-panel.full{grid-column:1/-1}
.chart-header{
  display:flex;align-items:baseline;justify-content:space-between;
  margin-bottom:0.5rem;
}
.chart-title{font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:var(--text2)}
.chart-legend{display:flex;gap:0.75rem}
.legend-item{display:flex;align-items:center;gap:3px;font-size:9px;color:var(--text3)}
.legend-dot{width:5px;height:5px;border-radius:50%}
.chart-wrap{position:relative}
.chart-svg{width:100%;display:block}
.chart-empty{
  height:100px;display:flex;align-items:center;justify-content:center;
  font-size:10px;color:var(--text3);letter-spacing:0.1em;
  border:1px dashed var(--border2);
}

/* TOOLTIP */
.chart-tooltip{
  position:absolute;
  background:rgba(255,255,255,0.98);
  border:1px solid var(--border);
  box-shadow:0 4px 12px rgba(0,0,0,0.2);
  padding:6px 10px;
  pointer-events:none;
  z-index:99999;
  min-width:120px;
}
.tooltip-month{font-size:10px;color:var(--amber);font-weight:600;margin-bottom:4px}
.tooltip-row{font-size:9px;color:var(--text2);display:flex;justify-content:space-between;gap:1rem}
.tooltip-val{color:var(--text);font-weight:600}

/* DATA TABLE */
.data-table{width:100%;border-collapse:collapse}
.data-table th{
  font-size:9px;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--text3);font-weight:600;
  padding:0.5rem 0.6rem;text-align:left;
  border-bottom:1px solid var(--border2);
  background:var(--bg1);
}
.data-table td{
  padding:0.4rem 0.6rem;
  border-bottom:1px solid rgba(0,0,0,0.05);
  font-size:11px;color:var(--text2);
}
.data-table tr:hover td{background:rgba(217,119,6,0.06)}
.td-val{color:var(--amber);font-weight:600}
.td-green{color:var(--green);font-weight:600}
.td-red{color:var(--red);font-weight:600}
.td-blue{color:var(--blue)}

/* MONTH TABLE */
.month-table-wrap{overflow-x:auto;max-height:200px;overflow-y:auto}
.month-table-wrap::-webkit-scrollbar{width:3px;height:3px}
.month-table-wrap::-webkit-scrollbar-track{background:transparent}
.month-table-wrap::-webkit-scrollbar-thumb{background:var(--border)}

/* ALARM PANEL */
.alarm-panel{
  border:1px solid rgba(220,38,38,0.35);
  background:rgba(220,38,38,0.06);
  padding:0.5rem 0.75rem;
  margin-bottom:1px;
}
.alarm-title{font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#dc2626;margin-bottom:0.4rem}
.alarm-items{display:flex;flex-wrap:wrap;gap:0.5rem}
.alarm-item{
  font-size:10px;color:#dc2626;
  border:1px solid rgba(220,38,38,0.25);
  padding:3px 8px;
}

/* REGIME INDICATOR */
.regime-indicator{
  display:inline-flex;align-items:center;gap:0.3rem;
  padding:3px 8px;font-size:9px;letter-spacing:0.1em;
  border:1px solid;margin-left:0.5rem;
}
.regime-growth{color:#059669;border-color:rgba(5,150,105,0.35);background:rgba(5,150,105,0.08)}
.regime-stable{color:#d97706;border-color:rgba(217,119,6,0.35);background:rgba(217,119,6,0.08)}
.regime-recession{color:#dc2626;border-color:rgba(220,38,38,0.35);background:rgba(220,38,38,0.08)}

/* HISTOGRAM */
.histogram-wrap{display:flex;align-items:flex-end;gap:1px;height:50px}
.histogram-bar{flex:1;background:#d97706;opacity:0.7;min-width:3px;transition:opacity 0.15s}
.histogram-bar:hover{opacity:1}

/* BOTTOM BAR */
.bottombar{
  position:sticky;bottom:0;
  background:var(--bg1);border-top:1px solid var(--border);
  padding:0.4rem 1rem;
  display:flex;align-items:center;gap:2rem;
  font-size:9px;color:var(--text3);letter-spacing:0.1em;
}
.bb-item{display:flex;gap:0.3rem}
.bb-val{color:var(--text2)}

/* ANIMATION */
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
.animated{animation:fade-in 0.3s ease forwards}

@keyframes pulse-glow{
  0%,100%{box-shadow:0 0 5px rgba(124,58,237,0.2)}
  50%{box-shadow:0 0 15px rgba(124,58,237,0.35)}
}
.ai-panel{animation:pulse-glow 3s ease-in-out infinite}

/* APPLY BUTTON */
.apply-btn{
  width:100%;height:44px;
  background:linear-gradient(135deg, #059669 0%, #047857 100%);
  color:#fff;
  font-family:'IBM Plex Mono',monospace;
  font-size:12px;font-weight:700;
  letter-spacing:0.15em;text-transform:uppercase;
  border:none;cursor:pointer;
  transition:all 0.2s;
  display:flex;align-items:center;justify-content:center;gap:0.5rem;
  margin-top:0.75rem;
  position:relative;
  overflow:hidden;
}
.apply-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform:translateX(-100%);
}
.apply-btn:hover::before{
  animation:shimmer 1s ease;
}
@keyframes shimmer{
  to{transform:translateX(100%)}
}
.apply-btn:hover{
  background:linear-gradient(135deg, #10b981 0%, #059669 100%);
  transform:scale(1.02);
}
.apply-btn:disabled{
  background:#333;color:#999;cursor:not-allowed;transform:none;
}

/* COMPARISON PANEL */
.comparison-panel{
  background:linear-gradient(135deg, rgba(5,150,105,0.08) 0%, rgba(5,150,105,0.04) 100%);
  border:2px solid rgba(5,150,105,0.4);
  padding:1rem;
  margin-bottom:1px;
  position:relative;
}
.comparison-panel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:3px;
  background:linear-gradient(90deg, var(--green), var(--cyan));
}
.comparison-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:1rem;
}
.comparison-title{
  font-size:11px;letter-spacing:0.2em;text-transform:uppercase;
  color:var(--green);font-weight:700;
  display:flex;align-items:center;gap:0.5rem;
}
.comparison-close{
  background:transparent;border:1px solid var(--border);
  color:var(--text3);padding:4px 12px;font-size:9px;
  cursor:pointer;font-family:'IBM Plex Mono',monospace;
}
.comparison-close:hover{border-color:var(--red);color:var(--red)}
.comparison-grid{
  display:grid;grid-template-columns:1fr auto 1fr;gap:1rem;
  align-items:center;
}
.comparison-col{
  background:rgba(255,255,255,0.6);
  padding:0.75rem;
  border:1px solid var(--border2);
}
.comparison-col-title{
  font-size:8px;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--text3);margin-bottom:0.5rem;
  text-align:center;
}
.comparison-col.before .comparison-col-title{color:var(--red)}
.comparison-col.after .comparison-col-title{color:var(--green)}
.comparison-arrow{
  font-size:24px;color:var(--green);
  display:flex;flex-direction:column;align-items:center;gap:4px;
}
.comparison-arrow-text{font-size:8px;letter-spacing:0.1em}
.comparison-metric{
  display:flex;justify-content:space-between;align-items:center;
  padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.08);
  font-size:10px;
}
.comparison-metric:last-child{border-bottom:none}
.comparison-metric-label{color:var(--text3)}
.comparison-metric-val{font-weight:600}
.comparison-metric-val.bad{color:var(--red)}
.comparison-metric-val.good{color:var(--green)}
.comparison-metric-val.neutral{color:var(--amber)}
.comparison-summary{
  margin-top:1rem;padding:0.75rem;
  background:rgba(5,150,105,0.1);
  border:1px solid rgba(5,150,105,0.25);
  text-align:center;
}
.comparison-summary-title{
  font-size:10px;color:var(--green);font-weight:700;
  margin-bottom:0.3rem;
}
.comparison-summary-text{font-size:11px;color:var(--text2)}

/* ADVANCED MODELS PANEL */
.models-panel{
  background:linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(8,145,178,0.04) 100%);
  border:1px solid rgba(37,99,235,0.25);
  padding:1rem;
  margin-bottom:1px;
}
.models-panel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg, var(--blue), var(--cyan));
}
.models-header{
  display:flex;align-items:center;gap:0.5rem;
  margin-bottom:0.75rem;
}
.models-icon{font-size:16px}
.models-title{
  font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
  color:var(--blue);font-weight:600;
}
.models-grid{
  display:grid;grid-template-columns:repeat(4, 1fr);gap:0.5rem;
}
.model-card{
  background:rgba(255,255,255,0.7);
  border:1px solid var(--border2);
  padding:0.6rem;
  position:relative;
  box-shadow:0 1px 3px rgba(0,0,0,0.06);
}
.model-card-header{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:0.4rem;
}
.model-card-title{
  font-size:8px;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--text3);
}
.model-card-badge{
  font-size:7px;padding:2px 5px;
  background:rgba(37,99,235,0.15);
  color:var(--blue);
  letter-spacing:0.1em;
}
.model-card-value{
  font-size:1.4rem;font-weight:700;
  color:var(--cyan);line-height:1;
  margin-bottom:0.3rem;
}
.model-card-value.warn{color:var(--amber)}
.model-card-value.danger{color:var(--red)}
.model-card-value.good{color:var(--green)}
.model-card-sub{font-size:9px;color:var(--text3)}
.model-card-detail{
  margin-top:0.4rem;padding-top:0.4rem;
  border-top:1px solid rgba(0,0,0,0.08);
  font-size:8px;color:var(--text2);
}
.model-card-row{
  display:flex;justify-content:space-between;
  margin-bottom:2px;
}
.model-card-row span:last-child{color:var(--amber);font-weight:600}

/* SERVICE LEVEL GAUGE */
.gauge-wrap{
  position:relative;
  width:100%;height:8px;
  background:rgba(0,0,0,0.08);
  margin:0.4rem 0;
  overflow:hidden;
}
.gauge-fill{
  height:100%;
  transition:width 0.3s ease;
}
.gauge-fill.good{background:linear-gradient(90deg, var(--green), var(--cyan))}
.gauge-fill.warn{background:linear-gradient(90deg, var(--amber), var(--red))}
.gauge-fill.danger{background:var(--red)}

/* ═══ SPEEDOMETER GAUGES ═══ */
.speedometer-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));
  gap:12px;
  margin-bottom:16px;
}
.speedometer{
  background:var(--bg1);
  border:1px solid var(--border);
  padding:12px;
  text-align:center;
  position:relative;
}
.speedometer-title{
  font-size:9px;
  letter-spacing:0.1em;
  color:var(--text3);
  margin-bottom:8px;
  text-transform:uppercase;
}
.speedometer-arc{
  position:relative;
  width:100px;
  height:55px;
  margin:0 auto;
  overflow:hidden;
}
.speedometer-bg{
  position:absolute;
  width:100px;
  height:100px;
  border-radius:50%;
  border:8px solid var(--bg3);
  border-bottom-color:transparent;
  border-left-color:transparent;
  transform:rotate(-45deg);
  top:0;
}
.speedometer-fill{
  position:absolute;
  width:100px;
  height:100px;
  border-radius:50%;
  border:8px solid transparent;
  border-top-color:var(--amber);
  border-right-color:var(--amber);
  transform:rotate(-45deg);
  top:0;
  transition:all 0.5s ease;
}
.speedometer-fill.good{border-top-color:var(--green);border-right-color:var(--green)}
.speedometer-fill.warn{border-top-color:var(--amber);border-right-color:var(--amber)}
.speedometer-fill.danger{border-top-color:var(--red);border-right-color:var(--red)}
.speedometer-value{
  font-family:'Unbounded',sans-serif;
  font-size:24px;
  font-weight:700;
  color:var(--text);
  line-height:1;
  margin-top:4px;
}
.speedometer-unit{
  font-size:10px;
  color:var(--text3);
  margin-top:2px;
}
.speedometer-range{
  display:flex;
  justify-content:space-between;
  font-size:8px;
  color:var(--text3);
  margin-top:4px;
}
.speedometer-target{
  font-size:8px;
  color:var(--green);
  margin-top:4px;
}
.speedometer-delta{
  position:absolute;
  top:8px;
  right:8px;
  font-size:9px;
  font-weight:600;
  padding:2px 4px;
}
.speedometer-delta.up{color:var(--green)}
.speedometer-delta.down{color:var(--red)}

/* ═══ WATERFALL CHART ═══ */
.waterfall-chart{
  background:var(--bg1);
  border:1px solid var(--border);
  padding:16px;
  margin-bottom:16px;
}
.waterfall-title{
  font-size:11px;
  font-weight:600;
  color:var(--text);
  margin-bottom:12px;
  display:flex;
  align-items:center;
  gap:6px;
}
.waterfall-row{
  display:flex;
  align-items:center;
  gap:8px;
  margin-bottom:8px;
  font-size:10px;
}
.waterfall-label{
  width:80px;
  color:var(--text2);
  flex-shrink:0;
}
.waterfall-bar-wrap{
  flex:1;
  height:20px;
  background:var(--bg2);
  position:relative;
  overflow:hidden;
}
.waterfall-bar{
  height:100%;
  position:absolute;
  display:flex;
  align-items:center;
  justify-content:flex-end;
  padding-right:4px;
  font-size:9px;
  font-weight:600;
  color:#fff;
}
.waterfall-bar.positive{background:var(--green);left:50%}
.waterfall-bar.negative{background:var(--red);right:50%}
.waterfall-bar.total{background:var(--amber);left:0}
.waterfall-center{
  position:absolute;
  left:50%;
  top:0;
  bottom:0;
  width:1px;
  background:var(--border);
}

/* ═══ HEATMAP ═══ */
.heatmap{
  background:var(--bg1);
  border:1px solid var(--border);
  padding:16px;
  margin-bottom:16px;
}
.heatmap-title{
  font-size:11px;
  font-weight:600;
  color:var(--text);
  margin-bottom:12px;
}
.heatmap-grid{
  display:grid;
  gap:2px;
}
.heatmap-row{
  display:flex;
  gap:2px;
  align-items:center;
}
.heatmap-label{
  width:50px;
  font-size:8px;
  color:var(--text3);
  text-align:right;
  padding-right:6px;
}
.heatmap-cell{
  flex:1;
  height:18px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:7px;
  color:#fff;
  min-width:20px;
}
.heatmap-cell.low{background:rgba(5,150,105,0.6)}
.heatmap-cell.med{background:rgba(217,119,6,0.6)}
.heatmap-cell.high{background:rgba(220,38,38,0.6)}
.heatmap-cell.critical{background:rgba(127,29,29,0.9)}
.heatmap-legend{
  display:flex;
  gap:12px;
  margin-top:8px;
  font-size:8px;
  color:var(--text3);
}
.heatmap-legend-item{display:flex;align-items:center;gap:4px}
.heatmap-legend-box{width:12px;height:12px}

/* ═══ INVESTOR KPIs ═══ */
.investor-panel{
  background:linear-gradient(135deg, var(--bg1), var(--bg2));
  border:1px solid var(--border);
  padding:16px;
  margin-bottom:16px;
}
.investor-title{
  font-size:11px;
  font-weight:600;
  color:var(--text);
  margin-bottom:12px;
  display:flex;
  align-items:center;
  gap:6px;
}
.investor-grid{
  display:grid;
  grid-template-columns:repeat(4, 1fr);
  gap:12px;
}
.investor-metric{
  text-align:center;
  padding:8px;
  background:var(--bg);
  border:1px solid var(--border2);
}
.investor-metric-label{
  font-size:8px;
  color:var(--text3);
  text-transform:uppercase;
  letter-spacing:0.05em;
  margin-bottom:4px;
}
.investor-metric-value{
  font-family:'Unbounded',sans-serif;
  font-size:18px;
  font-weight:700;
  color:var(--amber);
}
.investor-metric-sub{
  font-size:8px;
  color:var(--text3);
  margin-top:2px;
}
.investor-metric.good .investor-metric-value{color:var(--green)}
.investor-metric.warn .investor-metric-value{color:var(--amber)}
.investor-metric.bad .investor-metric-value{color:var(--red)}

/* ═══ MINI SPARKLINE ═══ */
.sparkline{
  display:flex;
  align-items:flex-end;
  gap:1px;
  height:20px;
}
.sparkline-bar{
  flex:1;
  background:var(--amber);
  min-width:2px;
  opacity:0.6;
}
.sparkline-bar:last-child{opacity:1}

/* ═══ KPI CARDS ROW ═══ */
.kpi-row{
  display:grid;
  grid-template-columns:repeat(6, 1fr);
  gap:8px;
  margin-bottom:12px;
}
.kpi-mini{
  background:var(--bg1);
  border:1px solid var(--border);
  padding:10px;
  text-align:center;
}
.kpi-mini-label{
  font-size:8px;
  color:var(--text3);
  text-transform:uppercase;
  letter-spacing:0.05em;
  margin-bottom:4px;
}
.kpi-mini-value{
  font-size:16px;
  font-weight:700;
  color:var(--text);
}
.kpi-mini-value.good{color:var(--green)}
.kpi-mini-value.warn{color:var(--amber)}
.kpi-mini-value.bad{color:var(--red)}
.kpi-mini-delta{
  font-size:8px;
  margin-top:2px;
}
.kpi-mini-delta.up{color:var(--green)}
.kpi-mini-delta.down{color:var(--red)}

/* ═══ ONBOARDING WIZARD ═══ */
.wizard-overlay{
  position:fixed;
  inset:0;
  background:rgba(0,0,0,0.7);
  z-index:10000;
  display:flex;
  align-items:center;
  justify-content:center;
  animation:fadeIn 0.3s ease;
}
@keyframes fadeIn{
  from{opacity:0}
  to{opacity:1}
}
.wizard-modal{
  background:var(--bg);
  border:1px solid var(--border);
  width:90%;
  max-width:700px;
  max-height:90vh;
  overflow:hidden;
  display:flex;
  flex-direction:column;
  animation:slideUp 0.3s ease;
}
@keyframes slideUp{
  from{transform:translateY(20px);opacity:0}
  to{transform:translateY(0);opacity:1}
}
.wizard-header{
  background:linear-gradient(135deg, var(--amber), var(--amber2));
  color:#fff;
  padding:20px 24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.wizard-header-title{
  font-family:'Unbounded',sans-serif;
  font-size:16px;
  font-weight:700;
}
.wizard-header-sub{
  font-size:11px;
  opacity:0.9;
  margin-top:4px;
}
.wizard-close{
  background:rgba(255,255,255,0.2);
  border:none;
  color:#fff;
  width:32px;
  height:32px;
  cursor:pointer;
  font-size:18px;
  display:flex;
  align-items:center;
  justify-content:center;
  transition:background 0.2s;
}
.wizard-close:hover{background:rgba(255,255,255,0.3)}
.wizard-progress{
  display:flex;
  padding:16px 24px;
  background:var(--bg1);
  border-bottom:1px solid var(--border);
  gap:8px;
}
.wizard-step{
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:4px;
}
.wizard-step-dot{
  width:28px;
  height:28px;
  border-radius:50%;
  background:var(--bg3);
  color:var(--text3);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:12px;
  font-weight:600;
  transition:all 0.3s;
}
.wizard-step.active .wizard-step-dot{
  background:var(--amber);
  color:#fff;
}
.wizard-step.completed .wizard-step-dot{
  background:var(--green);
  color:#fff;
}
.wizard-step-label{
  font-size:9px;
  color:var(--text3);
  text-transform:uppercase;
  letter-spacing:0.05em;
}
.wizard-step.active .wizard-step-label{color:var(--amber);font-weight:600}
.wizard-step.completed .wizard-step-label{color:var(--green)}
.wizard-content{
  flex:1;
  overflow-y:auto;
  padding:24px;
}
.wizard-section{
  margin-bottom:24px;
}
.wizard-section-title{
  font-size:13px;
  font-weight:600;
  color:var(--text);
  margin-bottom:12px;
  display:flex;
  align-items:center;
  gap:8px;
}
.wizard-section-title span{font-size:16px}
.wizard-grid{
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:12px;
}
.wizard-field{
  display:flex;
  flex-direction:column;
  gap:4px;
}
.wizard-field.full{grid-column:span 2}
.wizard-label{
  font-size:10px;
  color:var(--text2);
  text-transform:uppercase;
  letter-spacing:0.05em;
}
.wizard-input{
  font-family:'IBM Plex Mono',monospace;
  font-size:13px;
  padding:10px 12px;
  border:1px solid var(--border);
  background:var(--bg);
  color:var(--text);
  transition:border-color 0.2s;
}
.wizard-input:focus{
  outline:none;
  border-color:var(--amber);
}
.wizard-input::placeholder{color:var(--text3)}
.wizard-select{
  font-family:'IBM Plex Mono',monospace;
  font-size:13px;
  padding:10px 12px;
  border:1px solid var(--border);
  background:var(--bg);
  color:var(--text);
  cursor:pointer;
}
.wizard-checkbox-group{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.wizard-checkbox{
  display:flex;
  align-items:center;
  gap:6px;
  padding:8px 12px;
  border:1px solid var(--border);
  background:var(--bg);
  cursor:pointer;
  transition:all 0.2s;
  font-size:11px;
}
.wizard-checkbox:hover{border-color:var(--amber)}
.wizard-checkbox.checked{
  background:rgba(217,119,6,0.1);
  border-color:var(--amber);
  color:var(--amber);
}
.wizard-checkbox-icon{
  width:16px;
  height:16px;
  border:1px solid var(--border);
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:10px;
}
.wizard-checkbox.checked .wizard-checkbox-icon{
  background:var(--amber);
  border-color:var(--amber);
  color:#fff;
}
.wizard-info{
  background:rgba(37,99,235,0.08);
  border:1px solid rgba(37,99,235,0.2);
  padding:12px;
  font-size:11px;
  color:var(--text2);
  line-height:1.5;
}
.wizard-info-title{
  font-weight:600;
  color:var(--blue);
  margin-bottom:4px;
}
.wizard-footer{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:16px 24px;
  background:var(--bg1);
  border-top:1px solid var(--border);
}
.wizard-btn{
  font-family:'IBM Plex Mono',monospace;
  font-size:11px;
  letter-spacing:0.1em;
  padding:10px 20px;
  border:none;
  cursor:pointer;
  transition:all 0.2s;
}
.wizard-btn-skip{
  background:transparent;
  color:var(--text3);
  border:1px solid var(--border);
}
.wizard-btn-skip:hover{border-color:var(--text2);color:var(--text2)}
.wizard-btn-back{
  background:transparent;
  color:var(--text2);
  border:1px solid var(--border);
}
.wizard-btn-back:hover{border-color:var(--amber);color:var(--amber)}
.wizard-btn-next{
  background:var(--amber);
  color:#fff;
}
.wizard-btn-next:hover{background:var(--amber2)}
.wizard-btn-finish{
  background:var(--green);
  color:#fff;
}
.wizard-btn-finish:hover{background:#047857}
.wizard-quick-start{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:12px;
  margin-top:16px;
}
.wizard-preset{
  padding:16px;
  border:1px solid var(--border);
  background:var(--bg);
  cursor:pointer;
  text-align:center;
  transition:all 0.2s;
}
.wizard-preset:hover{border-color:var(--amber);background:rgba(217,119,6,0.05)}
.wizard-preset.selected{
  border-color:var(--amber);
  background:rgba(217,119,6,0.1);
}
.wizard-preset-icon{font-size:24px;margin-bottom:8px}
.wizard-preset-title{font-size:12px;font-weight:600;color:var(--text)}
.wizard-preset-desc{font-size:9px;color:var(--text3);margin-top:4px}
.wizard-summary{
  background:var(--bg1);
  border:1px solid var(--border);
  padding:16px;
}
.wizard-summary-row{
  display:flex;
  justify-content:space-between;
  padding:8px 0;
  border-bottom:1px solid var(--border2);
  font-size:11px;
}
.wizard-summary-row:last-child{border-bottom:none}
.wizard-summary-label{color:var(--text2)}
.wizard-summary-value{color:var(--text);font-weight:600}
.topbar-wizard-btn{
  font-family:'IBM Plex Mono',monospace;
  font-size:9px;
  letter-spacing:0.1em;
  padding:4px 10px;
  border:1px solid var(--border);
  background:transparent;
  color:var(--text3);
  cursor:pointer;
  transition:all 0.15s;
  display:flex;
  align-items:center;
  gap:4px;
}
.topbar-wizard-btn:hover{border-color:var(--amber);color:var(--amber)}

/* ═══ ONBOARDING DELAY VISUALIZATION ═══ */
.onboarding-panel{
  background:var(--bg1);
  border:1px solid var(--border);
  padding:12px;
  margin-top:12px;
}
.onboarding-title{
  font-size:10px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:0.1em;
  color:var(--text2);
  margin-bottom:8px;
  display:flex;
  align-items:center;
  gap:6px;
}
.onboarding-title span{font-size:14px}
.onboarding-timeline{
  display:flex;
  gap:2px;
  height:20px;
  margin-bottom:8px;
}
.onboarding-bar{
  flex:1;
  background:linear-gradient(to top, var(--green), var(--amber));
  opacity:0.7;
  position:relative;
  display:flex;
  align-items:flex-end;
}
.onboarding-bar-fill{
  width:100%;
  background:var(--green);
  transition:height 0.3s;
}
.onboarding-labels{
  display:flex;
  justify-content:space-between;
  font-size:8px;
  color:var(--text3);
}
.onboarding-legend{
  display:flex;
  gap:12px;
  margin-top:8px;
  font-size:9px;
}
.onboarding-legend-item{
  display:flex;
  align-items:center;
  gap:4px;
}
.onboarding-legend-dot{
  width:8px;
  height:8px;
}
.onboarding-legend-dot.ramp{background:linear-gradient(135deg, #f59e0b, #10b981)}
.onboarding-legend-dot.full{background:var(--green)}
.onboarding-stats{
  display:grid;
  grid-template-columns:repeat(3, 1fr);
  gap:8px;
  margin-top:10px;
  padding-top:10px;
  border-top:1px solid var(--border2);
}
.onboarding-stat{
  text-align:center;
}
.onboarding-stat-value{
  font-size:14px;
  font-weight:700;
  color:var(--text);
}
.onboarding-stat-label{
  font-size:8px;
  color:var(--text3);
  text-transform:uppercase;
}

/* ═══ BULLWHIP EFFECT INDICATOR ═══ */
.bullwhip-panel{
  background:var(--bg1);
  border:1px solid var(--border);
  padding:12px;
  margin-top:12px;
}
.bullwhip-title{
  font-size:10px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:0.1em;
  color:var(--text2);
  margin-bottom:8px;
  display:flex;
  align-items:center;
  gap:6px;
}
.bullwhip-title span{font-size:14px}
.bullwhip-meter{
  height:24px;
  background:linear-gradient(to right, 
    var(--green) 0%, 
    var(--green) 33%,
    var(--amber) 33%,
    var(--amber) 66%,
    var(--red) 66%
  );
  position:relative;
  border-radius:2px;
}
.bullwhip-needle{
  position:absolute;
  top:-4px;
  width:3px;
  height:32px;
  background:var(--text);
  transform:translateX(-50%);
  transition:left 0.3s;
}
.bullwhip-needle::after{
  content:'';
  position:absolute;
  top:-4px;
  left:50%;
  transform:translateX(-50%);
  width:0;
  height:0;
  border-left:5px solid transparent;
  border-right:5px solid transparent;
  border-top:6px solid var(--text);
}
.bullwhip-scale{
  display:flex;
  justify-content:space-between;
  font-size:8px;
  color:var(--text3);
  margin-top:4px;
}
.bullwhip-value{
  text-align:center;
  margin-top:8px;
}
.bullwhip-value-num{
  font-size:20px;
  font-weight:700;
}
.bullwhip-value-num.low{color:var(--green)}
.bullwhip-value-num.med{color:var(--amber)}
.bullwhip-value-num.high{color:var(--red)}
.bullwhip-value-label{
  font-size:9px;
  color:var(--text2);
}
.bullwhip-explanation{
  font-size:9px;
  color:var(--text3);
  margin-top:8px;
  padding:8px;
  background:var(--bg);
  border:1px solid var(--border2);
}

/* HAZARD CURVE */
.hazard-curve{
  display:flex;align-items:flex-end;gap:1px;
  height:30px;margin:0.3rem 0;
}
.hazard-bar{
  flex:1;
  background:rgb(220,38,38);
  opacity:0.7;
  min-width:2px;
}
.hazard-bar.low{background:rgb(5,150,105);opacity:0.8}
.hazard-bar.med{background:rgb(217,119,6);opacity:0.75}

/* CLV DISTRIBUTION */
.clv-dist{
  display:flex;gap:2px;
  margin:0.3rem 0;
}
.clv-segment{
  flex:1;
  padding:3px;
  text-align:center;
  font-size:7px;
  border:1px solid var(--border2);
}
.clv-segment.high{background:rgba(5,150,105,0.12);border-color:rgba(5,150,105,0.35);color:#059669}
.clv-segment.med{background:rgba(217,119,6,0.12);border-color:rgba(217,119,6,0.35);color:#d97706}
.clv-segment.low{background:rgba(220,38,38,0.12);border-color:rgba(220,38,38,0.35);color:#dc2626}

/* TOGGLE SWITCHES */
.toggle-grid{display:flex;flex-direction:column;gap:6px}
.toggle-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:4px 0;
}
.toggle-label{
  font-size:9px;color:var(--text2);
  display:flex;align-items:center;gap:4px;
}
.toggle-label .toggle-icon{font-size:10px}
.toggle-switch{
  position:relative;
  width:32px;height:16px;
  background:var(--border2);
  border-radius:8px;
  cursor:pointer;
  transition:all 0.2s;
  border:1px solid var(--border);
}
.toggle-switch.on{
  background:var(--green);
  border-color:var(--green);
}
.toggle-switch::after{
  content:'';
  position:absolute;
  top:2px;left:2px;
  width:10px;height:10px;
  background:#fff;
  border-radius:50%;
  transition:all 0.2s;
  box-shadow:0 1px 2px rgba(0,0,0,0.2);
}
.toggle-switch.on::after{
  left:18px;
}
.toggle-category{
  font-size:8px;letter-spacing:0.15em;text-transform:uppercase;
  color:var(--text3);margin:8px 0 4px;padding-top:6px;
  border-top:1px solid var(--border2);
}
.toggle-category:first-child{border-top:none;margin-top:0;padding-top:0}

/* ABM AGENT PANEL */
.abm-panel{
  background:linear-gradient(135deg, rgba(217,119,6,0.06) 0%, rgba(245,158,11,0.04) 100%);
  border:1px solid rgba(217,119,6,0.25);
  padding:0.75rem;
  margin-bottom:1px;
}
.abm-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem}
.abm-agent{
  background:rgba(255,255,255,0.6);
  border:1px solid var(--border2);
  padding:0.4rem;
  text-align:center;
  font-size:9px;
}
.abm-agent-icon{font-size:16px;margin-bottom:2px}
.abm-agent-name{font-weight:600;color:var(--text)}
.abm-agent-status{color:var(--text3);font-size:8px}
.abm-agent.sick{border-color:rgba(220,38,38,0.3);background:rgba(220,38,38,0.08)}
.abm-agent.training{border-color:rgba(37,99,235,0.3);background:rgba(37,99,235,0.08)}
.abm-agent.senior{border-color:rgba(5,150,105,0.3);background:rgba(5,150,105,0.08)}

/* EVENT QUEUE PANEL */
.queue-panel{
  background:linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(8,145,178,0.04) 100%);
  border:1px solid rgba(37,99,235,0.25);
  padding:0.75rem;
  margin-bottom:1px;
}
.queue-list{display:flex;flex-direction:column;gap:4px;max-height:120px;overflow-y:auto}
.queue-item{
  display:flex;align-items:center;gap:6px;
  padding:4px 6px;
  background:rgba(255,255,255,0.6);
  border:1px solid var(--border2);
  font-size:9px;
}
.queue-item.critical{border-color:rgba(220,38,38,0.4);background:rgba(220,38,38,0.08)}
.queue-item.high{border-color:rgba(217,119,6,0.4);background:rgba(217,119,6,0.08)}
.queue-item.normal{border-color:var(--border2)}
.queue-priority{
  font-size:7px;letter-spacing:0.1em;padding:2px 4px;
  border-radius:2px;font-weight:600;
}
.queue-priority.critical{background:#dc2626;color:#fff}
.queue-priority.high{background:#d97706;color:#fff}
.queue-priority.normal{background:var(--bg2);color:var(--text3)}
.queue-sla{margin-left:auto;color:var(--text3)}
.queue-sla.breach{color:#dc2626;font-weight:600}

/* FORECAST PANEL */
.forecast-panel{
  background:linear-gradient(135deg, rgba(8,145,178,0.06) 0%, rgba(5,150,105,0.04) 100%);
  border:1px solid rgba(8,145,178,0.25);
  padding:0.75rem;
  margin-bottom:1px;
}
.forecast-row{display:flex;justify-content:space-between;font-size:10px;padding:3px 0}
.forecast-label{color:var(--text3)}
.forecast-val{font-weight:600;color:var(--cyan)}
.forecast-trend{display:flex;align-items:center;gap:4px}
.forecast-trend.up{color:#059669}
.forecast-trend.down{color:#dc2626}

/* TOOLTIPS */
.tooltip-wrapper{position:relative;display:inline-flex;cursor:help}
.tooltip-trigger{display:inline-flex;align-items:center}
.tooltip-icon{
  font-size:10px;color:var(--text3);margin-left:4px;
  opacity:0.6;transition:opacity 0.15s;
}
.tooltip-wrapper:hover .tooltip-icon{opacity:1}
.tooltip-content{
  position:absolute;
  bottom:calc(100% + 8px);left:50%;
  transform:translateX(-50%);
  background:rgba(26,26,26,0.98);
  color:#fff;
  padding:8px 12px;
  border-radius:4px;
  font-size:10px;
  line-height:1.5;
  white-space:normal;
  width:max-content;
  max-width:280px;
  z-index:99999;
  opacity:0;
  visibility:hidden;
  transition:all 0.15s;
  pointer-events:none;
  box-shadow:0 4px 12px rgba(0,0,0,0.3);
}
.tooltip-content::after{
  content:'';position:absolute;
  top:100%;left:50%;
  transform:translateX(-50%);
  border:6px solid transparent;
  border-top-color:rgba(26,26,26,0.95);
}
.tooltip-wrapper:hover .tooltip-content{
  opacity:1;visibility:visible;
}
.tooltip-content.right{
  left:auto;right:0;
  transform:none;
}
.tooltip-content.right::after{
  left:auto;right:12px;
  transform:none;
}
.tooltip-content.left{
  left:0;right:auto;
  transform:none;
}
.tooltip-content.left::after{
  left:12px;right:auto;
  transform:none;
}
.tooltip-title{font-weight:600;color:var(--amber3);margin-bottom:4px}
.tooltip-formula{
  font-family:'IBM Plex Mono',monospace;
  background:rgba(255,255,255,0.1);
  padding:4px 6px;
  margin:6px 0;
  font-size:9px;
  border-radius:2px;
}
.tooltip-list{margin:4px 0;padding-left:12px}
.tooltip-list li{margin:2px 0}

/* ENHANCED CHART TOOLTIP */
.chart-hover-info{
  position:absolute;
  background:rgba(255,255,255,0.98);
  border:1px solid var(--border);
  padding:8px 12px;
  border-radius:4px;
  font-size:10px;
  box-shadow:0 4px 12px rgba(0,0,0,0.2);
  pointer-events:none;
  z-index:99999;
  min-width:140px;
}
.chart-hover-title{font-weight:600;color:var(--text);margin-bottom:4px;font-size:11px}
.chart-hover-row{display:flex;justify-content:space-between;padding:2px 0;color:var(--text2)}
.chart-hover-val{font-weight:600;color:var(--amber)}
.chart-hover-p10{color:var(--text3)}
.chart-hover-p90{color:var(--text3)}

/* HELP ICON */
.help-icon{
  display:inline-flex;align-items:center;justify-content:center;
  width:14px;height:14px;
  border-radius:50%;
  background:var(--bg2);
  color:var(--text3);
  font-size:9px;
  font-weight:600;
  margin-left:4px;
  cursor:help;
}
.help-icon:hover{background:var(--amber);color:#fff}
`;

/* ─── ADVANCED MATH UTILITIES ────────────────────────────────────────── */

// Student-t distribution for fat tails (df=4 gives heavier tails than Gaussian)
// Uses ratio of standard normal to sqrt(chi-squared/df)
function studentT(df = 4) {
  // Generate standard normal Z using Box-Muller
  const u1 = Math.max(1e-10, Math.random());
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  
  // Generate chi-squared(df) as sum of df standard normals squared
  let chi2 = 0;
  for (let i = 0; i < df; i++) {
    const v1 = Math.max(1e-10, Math.random());
    const v2 = Math.random();
    const n = Math.sqrt(-2 * Math.log(v1)) * Math.cos(2 * Math.PI * v2);
    chi2 += n * n;
  }
  
  // Student-t = Z / sqrt(chi2/df)
  return z / Math.sqrt(chi2 / df);
}

// Fat-tailed distribution (mix of Gaussian and Student-t)
function fatTailRandom(mean, std, fatTailWeight = 0.15) {
  if (Math.random() < fatTailWeight) {
    return mean + std * studentT(4) * 1.5; // Fat tail event
  }
  const u = Math.max(1e-10, 1 - Math.random());
  const v = Math.random();
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Correlated random draws using Cholesky decomposition
function correlatedShocks(correlationMatrix) {
  const n = correlationMatrix.length;
  const z = [];
  for (let i = 0; i < n; i++) {
    const u = Math.max(1e-10, 1 - Math.random());
    const v = Math.random();
    z.push(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v));
  }
  
  // Simple Cholesky for small matrices
  const L = Array(n).fill(null).map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];
      L[i][j] = i === j 
        ? Math.sqrt(Math.max(0.001, correlationMatrix[i][i] - sum))
        : (correlationMatrix[i][j] - sum) / L[j][j];
    }
  }
  
  // Transform to correlated
  const correlated = [];
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j <= i; j++) sum += L[i][j] * z[j];
    correlated.push(sum);
  }
  return correlated;
}

// Regime state transition
const REGIMES = {
  GROWTH: { name: 'VÆKST', pipelineMult: 1.25, churnMult: 0.7, dsoMult: 0.9, color: 'growth' },
  STABLE: { name: 'STABIL', pipelineMult: 1.0, churnMult: 1.0, dsoMult: 1.0, color: 'stable' },
  RECESSION: { name: 'RECESSION', pipelineMult: 0.65, churnMult: 1.4, dsoMult: 1.35, color: 'recession' },
};

// Transition matrix (rows = from, cols = to) [GROWTH, STABLE, RECESSION]
const REGIME_TRANSITIONS = [
  [0.85, 0.12, 0.03], // From GROWTH
  [0.10, 0.80, 0.10], // From STABLE
  [0.05, 0.20, 0.75], // From RECESSION
];

function nextRegime(currentIdx) {
  const probs = REGIME_TRANSITIONS[currentIdx];
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i];
    if (r < cumulative) return i;
  }
  return 1; // Default to STABLE
}

// Learning curve for new hires (sigmoid ramp-up)
function learningCurve(monthsSinceHire, maxProductivity = 1.0) {
  // S-curve: 30% at month 0, 95% at month 6
  const k = 0.8; // Steepness
  const midpoint = 3; // Months to 50%
  const minProd = 0.3;
  const sigmoid = 1 / (1 + Math.exp(-k * (monthsSinceHire - midpoint)));
  return minProd + (maxProductivity - minProd) * sigmoid;
}

// AR(1) process for autocorrelation
function ar1(prevValue, mean, rho = 0.6, sigma = 0.1) {
  const u = Math.max(1e-10, 1 - Math.random());
  const v = Math.random();
  const epsilon = sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + rho * (prevValue - mean) + epsilon;
}

/* ─── ERLANG-C QUEUEING MODEL ────────────────────────────────────────── */
// Calculates service level metrics for field service operations
function factorial(n) {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function erlangC(lambda, mu, c) {
  // lambda = arrival rate (jobs/hour)
  // mu = service rate per server (jobs/hour per technician)
  // c = number of servers (technicians)
  
  const rho = lambda / (c * mu); // Traffic intensity
  if (rho >= 1) return { pWait: 1, avgWait: Infinity, serviceLevel: 0, rho };
  
  const a = lambda / mu; // Offered load
  
  // Calculate P0 (probability of empty system)
  let sum = 0;
  for (let k = 0; k < c; k++) {
    sum += Math.pow(a, k) / factorial(k);
  }
  const lastTerm = Math.pow(a, c) / (factorial(c) * (1 - rho));
  const P0 = 1 / (sum + lastTerm);
  
  // Erlang C formula: P(wait > 0)
  const pWait = (Math.pow(a, c) * P0) / (factorial(c) * (1 - rho));
  
  // Average waiting time in queue
  const avgWait = pWait / (c * mu - lambda);
  
  // Service level: P(wait < target) where target = 2 hours
  const targetWait = 2; // hours
  const serviceLevel = 1 - pWait * Math.exp(-(c * mu - lambda) * targetWait);
  
  return { pWait, avgWait, serviceLevel, rho, P0 };
}

function calculateOptimalStaffing(lambda, mu, targetServiceLevel = 0.95, targetWait = 2) {
  // Find minimum c where service level >= target
  const minC = Math.ceil(lambda / mu);
  for (let c = minC; c <= minC + 50; c++) {
    const result = erlangC(lambda, mu, c);
    if (result.serviceLevel >= targetServiceLevel && result.avgWait <= targetWait) {
      return { optimalC: c, ...result };
    }
  }
  return { optimalC: minC + 50, ...erlangC(lambda, mu, minC + 50) };
}

/* ─── BG/NBD CUSTOMER LIFETIME VALUE MODEL ───────────────────────────── */
// Simplified BG/NBD implementation for CLV prediction
function bgNBD(params, customers) {
  // params: { r, alpha, a, b } - model parameters
  // customers: array of { recency, frequency, T } - customer data
  
  const { r, alpha, a, b } = params;
  
  return customers.map(cust => {
    const { recency, frequency, T } = cust;
    const x = frequency;
    const tx = recency;
    
    // Expected number of future transactions (simplified)
    // E[Y(t) | x, tx, T] approximation
    const pAlive = Math.pow(a / (a + b + x), b) * 
                   Math.pow((alpha + T) / (alpha + T + 1), r + x);
    
    // Expected transactions in next period
    const expectedTrans = pAlive * (r + x) / (alpha + T);
    
    // CLV = margin * expected transactions * avg transaction value
    return {
      ...cust,
      pAlive: Math.min(1, Math.max(0, pAlive)),
      expectedTrans,
      churnRisk: 1 - pAlive,
    };
  });
}

function segmentCustomers(customers, avgDealSize, margin = 0.35) {
  // Segment customers by CLV
  const withCLV = customers.map(c => ({
    ...c,
    clv: c.pAlive * c.expectedTrans * avgDealSize * margin * 36, // 3-year CLV
  }));
  
  const sorted = [...withCLV].sort((a, b) => b.clv - a.clv);
  const total = sorted.reduce((sum, c) => sum + c.clv, 0);
  
  // Segment into High/Med/Low
  let cumulative = 0;
  const segments = { high: [], medium: [], low: [] };
  
  sorted.forEach(c => {
    cumulative += c.clv;
    if (cumulative <= total * 0.6) segments.high.push(c);
    else if (cumulative <= total * 0.9) segments.medium.push(c);
    else segments.low.push(c);
  });
  
  return {
    segments,
    totalCLV: total,
    avgCLV: total / customers.length,
    highValueCount: segments.high.length,
    atRiskRevenue: withCLV.filter(c => c.churnRisk > 0.3).reduce((sum, c) => sum + c.clv, 0),
  };
}

/* ─── SURVIVAL ANALYSIS / HAZARD MODEL ───────────────────────────────── */
// Piecewise exponential hazard for SaaS-style churn patterns
function calculateHazardRates(baseChurnRate) {
  // Hazard rates by customer tenure (months)
  // Higher at start (onboarding), lower in middle, spike at renewal
  return [
    baseChurnRate * 2.0,   // Month 1-2: Onboarding risk
    baseChurnRate * 1.5,   // Month 3: Still evaluating
    baseChurnRate * 0.8,   // Month 4-6: Established
    baseChurnRate * 0.6,   // Month 7-9: Sticky
    baseChurnRate * 0.5,   // Month 10-11: Very sticky
    baseChurnRate * 2.5,   // Month 12: Renewal spike
    baseChurnRate * 0.7,   // Month 13-18: Post-renewal
    baseChurnRate * 0.5,   // Month 19-24: Loyal
    baseChurnRate * 1.8,   // Month 24: 2-year renewal
    baseChurnRate * 0.4,   // Month 25-36: Very loyal
  ];
}

function survivalProbability(hazardRates, months) {
  // S(t) = exp(-∫h(u)du) ≈ exp(-Σh_i)
  let cumHazard = 0;
  for (let i = 0; i < months && i < hazardRates.length; i++) {
    cumHazard += hazardRates[Math.min(i, hazardRates.length - 1)];
  }
  return Math.exp(-cumHazard);
}

function medianSurvivalTime(hazardRates) {
  // Find t where S(t) = 0.5
  let cumHazard = 0;
  for (let t = 1; t <= 60; t++) {
    const idx = Math.min(t - 1, hazardRates.length - 1);
    cumHazard += hazardRates[idx];
    if (Math.exp(-cumHazard) <= 0.5) return t;
  }
  return 60; // >5 years
}

/* ─── JUMP DIFFUSION (MERTON MODEL) ──────────────────────────────────── */
// Models sudden large changes (losing big customer, market shock)
function jumpDiffusion(S0, mu, sigma, lambda, jumpMean, jumpStd, T, dt = 1/12) {
  // S0: initial value
  // mu: drift rate
  // sigma: volatility
  // lambda: jump intensity (expected jumps per year)
  // jumpMean: average jump size (negative for drops)
  // jumpStd: jump size volatility
  // T: time horizon (years)
  // dt: time step (monthly = 1/12)
  
  const steps = Math.ceil(T / dt);
  const path = [S0];
  let S = S0;
  
  for (let i = 0; i < steps; i++) {
    // Brownian motion component
    const u = Math.max(1e-10, Math.random());
    const v = Math.random();
    const dW = Math.sqrt(dt) * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    
    // Jump component (Poisson process)
    const jumpOccurs = Math.random() < lambda * dt;
    let jump = 0;
    if (jumpOccurs) {
      const u2 = Math.max(1e-10, Math.random());
      const v2 = Math.random();
      const jumpSize = jumpMean + jumpStd * Math.sqrt(-2 * Math.log(u2)) * Math.cos(2 * Math.PI * v2);
      jump = Math.exp(jumpSize) - 1;
    }
    
    // GBM with jumps: dS = μS dt + σS dW + S(e^J - 1)
    const drift = mu * dt;
    const diffusion = sigma * dW;
    S = S * (1 + drift + diffusion + jump);
    S = Math.max(0, S); // Can't go negative
    
    path.push(S);
  }
  
  return path;
}

function calculateJumpRisk(cfg, N = 1000) {
  // Run jump diffusion simulations to estimate extreme event risk
  const S0 = cfg.startHeads * cfg.billingRate * cfg.hoursPerDay * 22 * 0.72; // Monthly revenue
  const mu = 0.05; // 5% annual growth
  const sigma = 0.15; // 15% volatility
  const lambda = 0.8; // ~0.8 jumps per year
  const jumpMean = -0.25; // -25% average jump (negative = loss)
  const jumpStd = 0.15;
  
  const finalValues = [];
  const worstDrops = [];
  
  for (let i = 0; i < N; i++) {
    const path = jumpDiffusion(S0, mu, sigma, lambda, jumpMean, jumpStd, 3);
    finalValues.push(path[path.length - 1]);
    
    // Calculate worst month-over-month drop
    let worstDrop = 0;
    for (let j = 1; j < path.length; j++) {
      const drop = (path[j - 1] - path[j]) / path[j - 1];
      if (drop > worstDrop) worstDrop = drop;
    }
    worstDrops.push(worstDrop);
  }
  
  // Sort for percentiles
  finalValues.sort((a, b) => a - b);
  worstDrops.sort((a, b) => a - b);
  
  const catastropheThreshold = 0.30; // 30% drop
  const catastropheRisk = worstDrops.filter(d => d > catastropheThreshold).length / N * 100;
  
  return {
    finalP05: finalValues[Math.floor(N * 0.05)],
    finalP50: finalValues[Math.floor(N * 0.50)],
    finalP95: finalValues[Math.floor(N * 0.95)],
    worstDropP95: worstDrops[Math.floor(N * 0.95)] * 100,
    catastropheRisk,
    expectedJumps: lambda * 3, // Over 3 years
  };
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function pct(arr, p) {
  if (!arr || !arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const i = clamp(Math.floor(p / 100 * s.length), 0, s.length - 1);
  return s[i];
}
function fmtK(n) {
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1000) return `${Math.round(n / 1000)}k`;
  return Math.round(n).toString();
}
function fmtDKK(n) {
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)} mio.`;
  if (Math.abs(n) >= 1000) return `${Math.round(n / 1000).toLocaleString('da-DK')}k`;
  return `${Math.round(n)} kr`;
}

/* ─── SEASONALITY ────────────────────────────────────────────────────── */
const SEASONALITY = [
  0.85, 0.88, 0.95, 1.02, 1.05, 1.08,
  0.92, 0.88, 1.05, 1.12, 1.15, 1.05
];

/* ─── CORRELATION MATRIX ─────────────────────────────────────────────── */
// [utilization, pipeline, churn, dso]
const SHOCK_CORRELATION = [
  [1.0, 0.3, -0.2, 0.1],   // utilization
  [0.3, 1.0, -0.4, -0.2],  // pipeline
  [-0.2, -0.4, 1.0, 0.5],  // churn (negative = when things go bad, churn goes up)
  [0.1, -0.2, 0.5, 1.0],   // dso
];

/* ─── ABM: AGENT-BASED MODELING ─────────────────────────────────────── */
const SKILL_LEVELS = ['junior', 'mid', 'senior', 'expert'];
const TECHNICIAN_NAMES = [
  'Anders', 'Bo', 'Christian', 'Dennis', 'Erik', 'Frederik', 'Gustav', 'Henrik',
  'Ivan', 'Jan', 'Klaus', 'Lars', 'Mads', 'Niels', 'Ole', 'Peter', 'Rasmus',
  'Søren', 'Thomas', 'Ulrik', 'Viggo', 'William', 'Xavier', 'Yngve', 'Zander'
];

function initializeAgents(count, extParams) {
  const agents = [];
  for (let i = 0; i < count; i++) {
    const tenure = Math.floor(Math.random() * 60); // 0-60 months
    const skillIdx = tenure < 6 ? 0 : tenure < 18 ? 1 : tenure < 36 ? 2 : 3;
    agents.push({
      id: i,
      name: TECHNICIAN_NAMES[i % TECHNICIAN_NAMES.length],
      skill: SKILL_LEVELS[skillIdx],
      tenure,
      productivity: learningCurve(tenure),
      sick: false,
      training: false,
      jobsCompleted: 0,
      revenue: 0,
      satisfaction: 4.0 + Math.random() * 0.5,
    });
  }
  return agents;
}

function simulateAgentMonth(agents, extParams, month) {
  return agents.map(agent => {
    const newAgent = { ...agent };
    
    // Sickness simulation
    newAgent.sick = Math.random() < extParams.sicknessRate;
    
    // Training (spread through year)
    const trainingMonths = Math.ceil(extParams.trainingDaysYear / 2);
    newAgent.training = month % Math.ceil(12 / trainingMonths) === 0 && Math.random() < 0.3;
    
    // Productivity adjustment
    if (newAgent.sick) newAgent.productivity *= 0;
    else if (newAgent.training) newAgent.productivity *= 0.5;
    else newAgent.productivity = learningCurve(newAgent.tenure + month);
    
    // Skill progression
    if (newAgent.tenure + month >= 36 && newAgent.skill !== 'expert') {
      newAgent.skill = 'expert';
    } else if (newAgent.tenure + month >= 18 && newAgent.skill === 'mid') {
      newAgent.skill = 'senior';
    } else if (newAgent.tenure + month >= 6 && newAgent.skill === 'junior') {
      newAgent.skill = 'mid';
    }
    
    return newAgent;
  });
}

function calculateABMCapacity(agents, hoursPerDay) {
  const workingAgents = agents.filter(a => !a.sick && !a.training);
  const effectiveHours = workingAgents.reduce((sum, a) => sum + hoursPerDay * 22 * a.productivity, 0);
  return {
    totalAgents: agents.length,
    workingAgents: workingAgents.length,
    sickAgents: agents.filter(a => a.sick).length,
    trainingAgents: agents.filter(a => a.training).length,
    effectiveHours,
    avgProductivity: workingAgents.length > 0 
      ? workingAgents.reduce((sum, a) => sum + a.productivity, 0) / workingAgents.length 
      : 0,
    seniorCount: agents.filter(a => a.skill === 'senior' || a.skill === 'expert').length,
  };
}

/* ─── DISCRETE EVENT QUEUE ───────────────────────────────────────────── */
const JOB_TYPES = [
  { type: 'installation', duration: 4, priority: 'normal', slaHours: 48 },
  { type: 'repair', duration: 2, priority: 'high', slaHours: 8 },
  { type: 'maintenance', duration: 1.5, priority: 'normal', slaHours: 72 },
  { type: 'emergency', duration: 1, priority: 'critical', slaHours: 4 },
  { type: 'inspection', duration: 1, priority: 'normal', slaHours: 168 },
];

function generateJobQueue(jobsPerMonth, extParams) {
  const queue = [];
  const urgentPct = extParams.urgentJobPct;
  
  for (let i = 0; i < jobsPerMonth; i++) {
    const isUrgent = Math.random() < urgentPct;
    const jobTemplate = isUrgent 
      ? JOB_TYPES.find(j => j.priority === 'critical') || JOB_TYPES[3]
      : JOB_TYPES[Math.floor(Math.random() * (JOB_TYPES.length - 1))]; // Exclude emergency for non-urgent
    
    const arrivalHour = Math.random() * 22 * 8; // Random arrival within month
    const travelTime = extParams.travelTimeHours * (0.5 + Math.random());
    
    queue.push({
      id: i,
      ...jobTemplate,
      duration: jobTemplate.duration * (0.7 + Math.random() * 0.6), // Variance
      arrivalTime: arrivalHour,
      travelTime,
      totalTime: jobTemplate.duration + travelTime,
      slaDeadline: arrivalHour + jobTemplate.slaHours,
      status: 'pending',
      assignedTo: null,
      completedAt: null,
      slaBreach: false,
    });
  }
  
  return queue.sort((a, b) => {
    // Sort by priority first, then arrival time
    const priorityOrder = { critical: 0, high: 1, normal: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.arrivalTime - b.arrivalTime;
  });
}

function processQueue(queue, agents, currentHour, extParams) {
  const availableAgents = agents.filter(a => !a.sick && !a.training);
  let processed = 0;
  let slaBreach = 0;
  let revenue = 0;
  
  const updatedQueue = queue.map(job => {
    if (job.status !== 'pending') return job;
    
    // Check SLA breach
    if (currentHour > job.slaDeadline && !job.slaBreach) {
      return { ...job, slaBreach: true };
    }
    
    // Try to assign
    const availableAgent = availableAgents.find(a => 
      agents.indexOf(a) === -1 || !queue.some(j => j.assignedTo === a.id && j.status === 'in_progress')
    );
    
    if (availableAgent) {
      processed++;
      if (currentHour > job.slaDeadline) slaBreach++;
      const jobRevenue = job.duration * 480 * (1 - extParams.materialsCostPct);
      revenue += jobRevenue;
      
      return {
        ...job,
        status: 'completed',
        assignedTo: availableAgent.id,
        completedAt: currentHour,
        slaBreach: currentHour > job.slaDeadline,
      };
    }
    
    return job;
  });
  
  return {
    queue: updatedQueue,
    processed,
    slaBreach,
    revenue,
    pending: updatedQueue.filter(j => j.status === 'pending').length,
    slaBreachPenalty: slaBreach * extParams.slaBreachPenalty,
  };
}

/* ─── HOLT-WINTERS FORECASTING ───────────────────────────────────────── */
function holtWinters(data, seasonLength = 12, alpha = 0.3, beta = 0.1, gamma = 0.2, horizon = 12) {
  if (data.length < seasonLength * 2) {
    // Not enough data, return simple trend
    const avg = data.reduce((s, v) => s + v, 0) / data.length;
    const trend = data.length > 1 ? (data[data.length - 1] - data[0]) / data.length : 0;
    return Array.from({ length: horizon }, (_, i) => avg + trend * (i + 1));
  }
  
  // Initialize level, trend, and seasonal components
  let level = data.slice(0, seasonLength).reduce((s, v) => s + v, 0) / seasonLength;
  let trend = (data.slice(seasonLength, seasonLength * 2).reduce((s, v) => s + v, 0) - 
               data.slice(0, seasonLength).reduce((s, v) => s + v, 0)) / (seasonLength * seasonLength);
  
  const seasonal = data.slice(0, seasonLength).map(v => v / level);
  
  // Apply Holt-Winters updates
  const smoothed = [];
  for (let t = 0; t < data.length; t++) {
    const seasonIdx = t % seasonLength;
    const prevLevel = level;
    
    level = alpha * (data[t] / seasonal[seasonIdx]) + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    seasonal[seasonIdx] = gamma * (data[t] / level) + (1 - gamma) * seasonal[seasonIdx];
    
    smoothed.push(level);
  }
  
  // Forecast
  const forecast = [];
  for (let h = 1; h <= horizon; h++) {
    const seasonIdx = (data.length + h - 1) % seasonLength;
    forecast.push((level + h * trend) * seasonal[seasonIdx]);
  }
  
  return forecast;
}

function calculateForecastMetrics(historical, forecast) {
  const lastValue = historical[historical.length - 1];
  const forecastEnd = forecast[forecast.length - 1];
  const trend = forecastEnd > lastValue ? 'up' : 'down';
  const changePercent = ((forecastEnd - lastValue) / lastValue * 100).toFixed(1);
  
  // Calculate confidence interval (simplified)
  const stdDev = Math.sqrt(
    historical.reduce((sum, v) => sum + Math.pow(v - lastValue, 2), 0) / historical.length
  );
  
  return {
    forecast,
    trend,
    changePercent,
    confidenceLow: forecast.map(v => v - stdDev * 1.96),
    confidenceHigh: forecast.map(v => v + stdDev * 1.96),
    nextMonth: forecast[0],
    next3Months: forecast.slice(0, 3).reduce((s, v) => s + v, 0),
    next12Months: forecast.reduce((s, v) => s + v, 0),
  };
}

/* ─── ENHANCED MONTE CARLO ENGINE ────────────────────────────────────── */
function runMC(cfg, N = 300, T = 36, toggles = DEFAULT_TOGGLES, extParams = EXTENDED_PARAMS_DEFAULTS) {
  const {
    startHeads, hireThreshold, billingRate, hoursPerDay,
    salaryPerHead, overheadFactor, dso, winRate,
    newLeadsMonth, churnRate, startCash, startPipeline, 
    qualityDecayPct, seasonalityEnabled, overtimeMultiplier
  } = cfg;

  const trials = {
    revenue: Array.from({ length: T }, () => []),
    cash: Array.from({ length: T }, () => []),
    headcount: Array.from({ length: T }, () => []),
    utilization: Array.from({ length: T }, () => []),
    runway: Array.from({ length: T }, () => []),
    ar: Array.from({ length: T }, () => []),
    pipeline: Array.from({ length: T }, () => []),
    bookToBill: Array.from({ length: T }, () => []),
    burnRate: Array.from({ length: T }, () => []),
    overtime: Array.from({ length: T }, () => []),
    regime: Array.from({ length: T }, () => []),
    npv: [],
  };

  const discountRate = 0.08 / 12;
  const regimeStates = Object.keys(REGIMES);

  // Extended parameters costs
  const extCostPerHead = toggles.extendedParamsEnabled 
    ? extParams.vehicleCostMonth + extParams.toolsCostMonth
    : 0;
  const materialsCostPct = toggles.extendedParamsEnabled ? extParams.materialsCostPct : 0;
  const subconPct = toggles.extendedParamsEnabled ? extParams.subcontractorPct : 0;
  const subconMarkup = toggles.extendedParamsEnabled ? extParams.subcontractorMarkup : 0;
  const sicknessRate = toggles.extendedParamsEnabled ? extParams.sicknessRate : 0;
  const adminOverhead = toggles.extendedParamsEnabled ? extParams.adminOverheadPct : 0;
  const insurancePct = toggles.extendedParamsEnabled ? extParams.insurancePct : 0;
  const slaBreachPenalty = toggles.extendedParamsEnabled ? extParams.slaBreachPenalty : 0;

  for (let trial = 0; trial < N; trial++) {
    let heads = startHeads;
    let cash = startCash;
    let AR = startHeads * billingRate * hoursPerDay * 22 * 0.8;
    let pipeline = startPipeline;
    let hiringQueue = [];
    let qualityPenalty = 0;
    let trialNPV = 0;
    let regimeIdx = 1; // Start in STABLE
    let prevUtil = 0.72;
    let prevPipeline = pipeline;
    
    // ABM agents for this trial (if enabled)
    let agents = toggles.abmEnabled ? initializeAgents(startHeads, extParams) : null;

    for (let t = 0; t < T; t++) {
      // Regime switching (conditional)
      if (toggles.regimeSwitchingEnabled) {
        regimeIdx = nextRegime(regimeIdx);
      } else {
        regimeIdx = 1; // Stay in STABLE
      }
      const regime = REGIMES[regimeStates[regimeIdx]];
      
      const monthIndex = t % 12;
      const seasonFactor = toggles.seasonalityEnabled ? SEASONALITY[monthIndex] : 1.0;

      // Correlated shocks (conditional)
      let utilShock = 0, pipelineShock = 0, churnShock = 0, dsoShock = 0;
      if (toggles.correlatedShocksEnabled) {
        const shocks = correlatedShocks(SHOCK_CORRELATION);
        utilShock = shocks[0] * 0.08;
        pipelineShock = shocks[1] * 0.15;
        churnShock = shocks[2] * 0.03;
        dsoShock = shocks[3] * 5;
      }

      // AR(1) for utilization (autocorrelation)
      const baseUtil = ar1(prevUtil, 0.72, 0.5, 0.06);
      const util = clamp(
        (baseUtil + utilShock - qualityPenalty * 0.05) * seasonFactor,
        0.35, 0.99
      );
      prevUtil = util;

      // DSO with optional fat tails
      let dsoSample;
      if (toggles.fatTailsEnabled) {
        dsoSample = clamp(
          fatTailRandom(dso * regime.dsoMult, dso * 0.15) + dsoShock,
          15, 120
        );
      } else {
        const u = Math.random();
        const v = Math.random();
        const normalRand = Math.sqrt(-2 * Math.log(Math.max(1e-10, u))) * Math.cos(2 * Math.PI * v);
        dsoSample = clamp(dso * regime.dsoMult + normalRand * dso * 0.1 + dsoShock, 15, 120);
      }

      // Win rate with optional fat tails
      let winRateSample;
      if (toggles.fatTailsEnabled) {
        winRateSample = clamp(
          fatTailRandom(winRate * regime.pipelineMult, winRate * 0.12) * seasonFactor,
          0.05, 0.85
        );
      } else {
        const u = Math.random();
        const v = Math.random();
        const normalRand = Math.sqrt(-2 * Math.log(Math.max(1e-10, u))) * Math.cos(2 * Math.PI * v);
        winRateSample = clamp(winRate * regime.pipelineMult + normalRand * winRate * 0.08, 0.05, 0.85);
      }

      // Churn with optional fat tails
      let churnSample;
      if (toggles.fatTailsEnabled) {
        churnSample = clamp(
          fatTailRandom(churnRate * regime.churnMult, churnRate * 0.2) + churnShock,
          0, 0.30
        );
      } else {
        const u = Math.random();
        const v = Math.random();
        const normalRand = Math.sqrt(-2 * Math.log(Math.max(1e-10, u))) * Math.cos(2 * Math.PI * v);
        churnSample = clamp(churnRate * regime.churnMult + normalRand * churnRate * 0.1 + churnShock, 0, 0.30);
      }
      
      // ABM simulation (if enabled)
      let abmCapacity = null;
      if (toggles.abmEnabled && agents) {
        agents = simulateAgentMonth(agents, extParams, t);
        abmCapacity = calculateABMCapacity(agents, hoursPerDay);
      }

      // Learning curve for productivity (conditional)
      let effectiveHeads = 0;
      const activeHeads = heads;
      
      if (toggles.abmEnabled && abmCapacity) {
        // Use ABM-based capacity calculation
        effectiveHeads = abmCapacity.effectiveHours / (hoursPerDay * 22);
      } else if (toggles.learningCurveEnabled) {
        // Established heads (full productivity)
        const establishedHeads = Math.max(0, heads - hiringQueue.length);
        effectiveHeads += establishedHeads;
        
        // New hires with learning curve
        hiringQueue = hiringQueue.map(h => ({ ...h, months: h.months + 1 }));
        hiringQueue.forEach(h => {
          effectiveHeads += learningCurve(h.months);
        });
      } else {
        // Simple: all heads at full productivity
        effectiveHeads = heads;
        hiringQueue = hiringQueue.map(h => ({ ...h, months: h.months + 1 }));
      }
      
      // Apply sickness rate reduction (if extended params enabled but not ABM)
      if (toggles.extendedParamsEnabled && !toggles.abmEnabled) {
        effectiveHeads *= (1 - sicknessRate);
      }

      // Overtime
      const overtimeHours = util > 0.85 ? (util - 0.85) * hoursPerDay * 22 * effectiveHeads : 0;
      const overtimeCost = overtimeHours * billingRate * (overtimeMultiplier - 1) * 0.6;

      // Base revenue calculation
      let monthRevenue = effectiveHeads * util * billingRate * hoursPerDay * 22;
      
      // Extended params: subtract materials cost, add subcontractor margin
      if (toggles.extendedParamsEnabled) {
        monthRevenue *= (1 - materialsCostPct);
        const subconRevenue = monthRevenue * subconPct;
        monthRevenue = monthRevenue * (1 - subconPct) + subconRevenue * (1 + subconMarkup);
      }

      // Pipeline with regime and correlation
      const newWins = pipeline * winRateSample;
      const bookToBill = newWins / Math.max(1, monthRevenue);
      pipeline = ar1(prevPipeline, startPipeline, 0.3, startPipeline * 0.1);
      pipeline = Math.max(0, pipeline * (1 - winRateSample) + pipelineShock * startPipeline) 
                 + newLeadsMonth * fatTailRandom(1, 0.2) * seasonFactor * regime.pipelineMult;
      prevPipeline = pipeline;

      const collectionRate = 30 / dsoSample;
      const collected = AR * collectionRate;
      AR = Math.max(0, AR + monthRevenue - collected);

      const salary = heads * salaryPerHead;
      const overhead = salary * overheadFactor;
      
      // Extended costs (if enabled)
      let extendedCosts = 0;
      if (toggles.extendedParamsEnabled) {
        extendedCosts = heads * extCostPerHead  // Vehicle + tools
          + monthRevenue * adminOverhead        // Admin overhead
          + monthRevenue * insurancePct;        // Insurance
      }
      
      const expenses = salary + overhead + overtimeCost + extendedCosts;
      cash = cash + collected - expenses;

      trialNPV += (collected - expenses) / Math.pow(1 + discountRate, t + 1);

      // Hiring with 2-month onboarding queue
      if (util > hireThreshold / 100 && cash > salaryPerHead * 6) {
        if (Math.random() > 0.4) {
          hiringQueue.push({ months: 0 });
        }
      }
      
      // Graduate from hiring queue after 2 months
      const graduated = hiringQueue.filter(h => h.months >= 2);
      heads += graduated.length;
      hiringQueue = hiringQueue.filter(h => h.months < 2);

      // Quality decay
      qualityPenalty = util > 0.92 
        ? qualityPenalty + 0.05 
        : Math.max(0, qualityPenalty - 0.02);
      
      const effectiveChurn = churnSample * (1 + qualityPenalty * qualityDecayPct);
      heads = Math.max(1, Math.round(heads * (1 - effectiveChurn / 12)));

      // Cash constraint
      if (cash < salaryPerHead * 3) hiringQueue = [];

      // Reputation loop
      if (effectiveChurn > churnRate * 1.5) {
        pipeline *= 0.97;
      }

      const avgBurn = expenses - (monthRevenue * 0.8);
      const runway = avgBurn > 0 ? cash / avgBurn : 999;

      trials.revenue[t].push(monthRevenue);
      trials.cash[t].push(cash);
      trials.headcount[t].push(heads);
      trials.utilization[t].push(util * 100);
      trials.runway[t].push(Math.min(runway, 60));
      trials.ar[t].push(AR);
      trials.pipeline[t].push(pipeline);
      trials.bookToBill[t].push(bookToBill);
      trials.burnRate[t].push(Math.max(0, expenses - collected));
      trials.overtime[t].push(overtimeCost);
      trials.regime[t].push(regimeIdx);
    }
    trials.npv.push(trialNPV);
  }

  // Compute percentiles
  const out = {};
  for (const key of Object.keys(trials)) {
    if (key === 'npv') {
      out.npv = {
        p05: pct(trials.npv, 5),
        p10: pct(trials.npv, 10),
        p50: pct(trials.npv, 50),
        p90: pct(trials.npv, 90),
        p95: pct(trials.npv, 95),
      };
    } else if (key === 'regime') {
      // Mode of regime at each time
      out.regime = trials.regime.map(monthArr => {
        const counts = [0, 0, 0];
        monthArr.forEach(r => counts[r]++);
        return counts.indexOf(Math.max(...counts));
      });
    } else {
      out[key] = trials[key].map(monthArr => ({
        p05: pct(monthArr, 5),
        p10: pct(monthArr, 10),
        p50: pct(monthArr, 50),
        p90: pct(monthArr, 90),
        p95: pct(monthArr, 95),
        raw: monthArr,
      }));
    }
  }

  const totalRevY1 = out.revenue.slice(0, 12).reduce((a, b) => a + b.p50, 0);
  const totalRevY3 = out.revenue.reduce((a, b) => a + b.p50, 0);
  
  // Risk metrics
  const bankruptcyRisk = out.cash[T - 1].raw.filter(c => c < 0).length / N * 100;
  const severeStressRisk = out.runway[T - 1].raw.filter(r => r < 2).length / N * 100;
  
  const alarms = [];
  const finalRunway = out.runway[T - 1].p10;
  const finalUtil = out.utilization[T - 1].p90;
  const finalBtB = out.bookToBill[T - 1].p50;
  if (finalRunway < 3) alarms.push({ msg: `Runway P10 = ${finalRunway.toFixed(1)} mdr — kritisk!`, lvl: 'crit' });
  if (finalUtil > 94) alarms.push({ msg: `Udnyttelse P90 = ${finalUtil.toFixed(0)}% — kvalitetsrisiko`, lvl: 'warn' });
  if (finalBtB < 0.8) alarms.push({ msg: `Book-to-bill = ${finalBtB.toFixed(2)} < 1 — pipeline krymper`, lvl: 'warn' });
  if (out.npv.p10 < 0) alarms.push({ msg: `NPV P10 = ${fmtDKK(out.npv.p10)} — negativ værdi`, lvl: 'warn' });
  if (bankruptcyRisk > 5) alarms.push({ msg: `Konkursrisiko = ${bankruptcyRisk.toFixed(0)}% — uacceptabelt`, lvl: 'crit' });

  return { 
    series: out, 
    totalRevY1, 
    totalRevY3, 
    alarms, 
    T, 
    N,
    bankruptcyRisk,
    severeStressRisk,
    dominantRegime: out.regime[T - 1],
  };
}

/* ─── AI PRESCRIPTIVE ENGINE ─────────────────────────────────────────── */
function generateRecommendations(cfg, result) {
  if (!result?.series) return [];
  
  const s = result.series;
  const recommendations = [];
  
  const utilP50 = s.utilization[17]?.p50 || 0;
  const utilP90 = s.utilization[17]?.p90 || 0;
  const runwayP10 = s.runway[35]?.p10 || 0;
  const cashP10 = s.cash[35]?.p10 || 0;
  const btb = s.bookToBill[11]?.p50 || 0;
  const npvP10 = result.series.npv?.p10 || 0;
  const npvP50 = result.series.npv?.p50 || 0;
  const headcount = s.headcount[35]?.p50 || cfg.startHeads;
  
  // 1. Hiring recommendation
  if (utilP50 > 85) {
    const additionalHeads = Math.ceil((utilP50 - 75) / 10);
    const costImpact = additionalHeads * cfg.salaryPerHead * 12;
    const revenueGain = additionalHeads * cfg.billingRate * cfg.hoursPerDay * 22 * 0.75 * 12;
    
    recommendations.push({
      priority: utilP90 > 92 ? 'high' : 'medium',
      action: `Ansæt ${additionalHeads} tekniker${additionalHeads > 1 ? 'e' : ''} nu`,
      impact: `Reducer udnyttelse fra ${utilP50.toFixed(0)}% til ~${(utilP50 - additionalHeads * 8).toFixed(0)}%. Eliminerer kvalitetsrisiko og reducerer churn.`,
      metrics: [
        { label: 'Udnyttelse', value: `${utilP50.toFixed(0)}% → ${Math.max(70, utilP50 - additionalHeads * 8).toFixed(0)}%`, positive: true },
        { label: 'Årlig omkostning', value: fmtDKK(costImpact), positive: false },
        { label: 'Potentiel revenue', value: `+${fmtDKK(revenueGain)}`, positive: true },
      ]
    });
  }
  
  // 2. Cash buffer recommendation
  if (runwayP10 < 6 || result.bankruptcyRisk > 3) {
    const targetBuffer = cfg.salaryPerHead * cfg.startHeads * 4;
    const currentBuffer = cashP10;
    const needed = Math.max(0, targetBuffer - currentBuffer);
    
    recommendations.push({
      priority: runwayP10 < 3 ? 'high' : 'medium',
      action: `Byg kassebuffer til ${Math.ceil(targetBuffer / 1000000)} mio. kr`,
      impact: `Nuværende P10 runway er ${runwayP10.toFixed(1)} mdr. En buffer på 4 mdr lønninger giver sikkerhed i ${100 - result.bankruptcyRisk.toFixed(0)}% af scenarier.`,
      metrics: [
        { label: 'Nuværende buffer', value: fmtDKK(currentBuffer), positive: currentBuffer > 0 },
        { label: 'Mål', value: fmtDKK(targetBuffer), positive: true },
        { label: 'Konkursrisiko', value: `${result.bankruptcyRisk.toFixed(1)}%`, positive: result.bankruptcyRisk < 5 },
      ]
    });
  }
  
  // 3. Pricing recommendation
  const currentMargin = (cfg.billingRate * cfg.hoursPerDay * 22 - cfg.salaryPerHead) / (cfg.billingRate * cfg.hoursPerDay * 22);
  if (currentMargin < 0.35 || npvP10 < 0) {
    const suggestedRate = Math.ceil(cfg.billingRate * 1.08 / 10) * 10;
    const rateIncrease = suggestedRate - cfg.billingRate;
    const annualImpact = rateIncrease * cfg.hoursPerDay * 22 * 12 * headcount * 0.72;
    
    recommendations.push({
      priority: npvP10 < 0 ? 'high' : 'medium',
      action: `Hæv faktureringstakst med ${((rateIncrease / cfg.billingRate) * 100).toFixed(0)}% til ${suggestedRate} kr/t`,
      impact: `Din margin er ${(currentMargin * 100).toFixed(0)}%, under branchestandard på 40%. En moderat takststigning påvirker sjældent pipeline.`,
      metrics: [
        { label: 'Takst nu', value: `${cfg.billingRate} kr/t`, positive: false },
        { label: 'Ny takst', value: `${suggestedRate} kr/t`, positive: true },
        { label: 'NPV impact', value: `+${fmtDKK(annualImpact * 2.5)}`, positive: true },
      ]
    });
  }
  
  // 4. DSO recommendation
  if (cfg.dso > 40) {
    const dsoReduction = Math.min(cfg.dso - 30, 15);
    const cashImprovement = s.revenue[11]?.p50 * (dsoReduction / 30) * 2;
    
    recommendations.push({
      priority: cfg.dso > 55 ? 'high' : 'low',
      action: `Reducer DSO med ${dsoReduction} dage til ${cfg.dso - dsoReduction} dage`,
      impact: `Hurtigere betaling frigør arbejdskapital og reducerer likviditetsrisiko. Overvej fakturering ved afslutning, ikke månedlig.`,
      metrics: [
        { label: 'DSO nu', value: `${cfg.dso} dage`, positive: false },
        { label: 'Mål DSO', value: `${cfg.dso - dsoReduction} dage`, positive: true },
        { label: 'Frigjort kapital', value: fmtDKK(cashImprovement), positive: true },
      ]
    });
  }
  
  // 5. Pipeline recommendation
  if (btb < 1.0) {
    recommendations.push({
      priority: btb < 0.8 ? 'high' : 'medium',
      action: `Øg pipeline med ${Math.round((1.2 / btb - 1) * 100)}%`,
      impact: `Book-to-bill på ${btb.toFixed(2)} betyder at I bruger mere kapacitet end I vinder. Pipeline skal vokse for at undgå fremtidig overkapacitet.`,
      metrics: [
        { label: 'Book-to-bill', value: btb.toFixed(2), positive: btb >= 1 },
        { label: 'Pipeline mål', value: fmtDKK(cfg.newLeadsMonth * 1.3), positive: true },
        { label: 'Win rate mål', value: `${Math.min(40, cfg.winRate * 100 + 5).toFixed(0)}%`, positive: true },
      ]
    });
  }
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return recommendations.slice(0, 4); // Top 4 recommendations
}

/* ─── GENERATE OPTIMAL CONFIG ────────────────────────────────────────── */
function generateOptimalConfig(cfg, result) {
  if (!result?.series) return cfg;
  
  const s = result.series;
  const newCfg = { ...cfg };
  
  const utilP50 = s.utilization[17]?.p50 || 0;
  const runwayP10 = s.runway[35]?.p10 || 0;
  const btb = s.bookToBill[11]?.p50 || 0;
  const npvP10 = result.series.npv?.p10 || 0;
  
  // 1. Add heads if overutilized
  if (utilP50 > 85) {
    const additionalHeads = Math.ceil((utilP50 - 75) / 10);
    newCfg.startHeads = cfg.startHeads + additionalHeads;
  }
  
  // 2. Increase cash buffer if runway is low
  if (runwayP10 < 6 || result.bankruptcyRisk > 3) {
    const targetBuffer = cfg.salaryPerHead * newCfg.startHeads * 4;
    newCfg.startCash = Math.max(cfg.startCash, targetBuffer);
  }
  
  // 3. Increase billing rate if margins are low
  const currentMargin = (cfg.billingRate * cfg.hoursPerDay * 22 - cfg.salaryPerHead) / (cfg.billingRate * cfg.hoursPerDay * 22);
  if (currentMargin < 0.35 || npvP10 < 0) {
    newCfg.billingRate = Math.ceil(cfg.billingRate * 1.08 / 10) * 10;
  }
  
  // 4. Reduce DSO if too high
  if (cfg.dso > 40) {
    newCfg.dso = Math.max(25, cfg.dso - Math.min(cfg.dso - 30, 15));
  }
  
  // 5. Increase pipeline if book-to-bill is low
  if (btb < 1.0) {
    newCfg.newLeadsMonth = Math.round(cfg.newLeadsMonth * 1.25);
    newCfg.winRate = Math.min(0.45, cfg.winRate + 0.05);
  }
  
  return newCfg;
}

/* ─── CALCULATE ADVANCED METRICS ─────────────────────────────────────── */
function calculateAdvancedMetrics(cfg, result) {
  if (!result?.series) return null;
  
  const s = result.series;
  
  // ═══ ERLANG-C: SERVICE LEVEL ═══
  // Estimate arrival rate and service rate
  const avgJobsPerDay = cfg.startHeads * cfg.hoursPerDay / 4; // ~4 hours per job
  const lambda = avgJobsPerDay / cfg.hoursPerDay; // Jobs per hour
  const mu = 1 / 4; // Service rate: 1 job per 4 hours per technician
  const currentC = cfg.startHeads;
  
  const erlangResult = erlangC(lambda, mu, currentC);
  const optimalStaffing = calculateOptimalStaffing(lambda, mu, 0.95, 2);
  
  const serviceLevel = {
    current: erlangResult,
    optimal: optimalStaffing,
    avgWaitHours: erlangResult.avgWait,
    serviceLevelPct: erlangResult.serviceLevel * 100,
    utilization: erlangResult.rho * 100,
    additionalNeeded: Math.max(0, optimalStaffing.optimalC - currentC),
  };
  
  // ═══ BG/NBD: CUSTOMER LIFETIME VALUE ═══
  // Simulate customer base
  const numCustomers = Math.round(cfg.startPipeline / (cfg.billingRate * cfg.hoursPerDay * 22 * 3));
  const avgDealSize = cfg.billingRate * cfg.hoursPerDay * 22 * 6; // 6 months avg project
  
  // Generate synthetic customer data
  const customers = [];
  for (let i = 0; i < Math.max(20, numCustomers); i++) {
    customers.push({
      id: i,
      recency: Math.random() * 12, // Months since last transaction
      frequency: Math.floor(Math.random() * 5) + 1, // Number of transactions
      T: Math.random() * 24 + 6, // Customer tenure in months
    });
  }
  
  // BG/NBD parameters (estimated from industry benchmarks)
  const bgParams = { r: 0.5, alpha: 10, a: 0.8, b: 2.5 };
  const customersWithCLV = bgNBD(bgParams, customers);
  const clvSegmentation = segmentCustomers(customersWithCLV, avgDealSize, 0.35);
  
  const clv = {
    totalCLV: clvSegmentation.totalCLV,
    avgCLV: clvSegmentation.avgCLV,
    highValueCount: clvSegmentation.highValueCount,
    atRiskRevenue: clvSegmentation.atRiskRevenue,
    segments: {
      high: clvSegmentation.segments.high.length,
      medium: clvSegmentation.segments.medium.length,
      low: clvSegmentation.segments.low.length,
    },
    highRiskCustomers: customersWithCLV.filter(c => c.churnRisk > 0.4).length,
  };
  
  // ═══ SURVIVAL ANALYSIS: HAZARD RATES ═══
  const hazardRates = calculateHazardRates(cfg.churnRate / 12); // Monthly rate
  const medianSurvival = medianSurvivalTime(hazardRates);
  
  // Survival probabilities at key points
  const survival = {
    hazardRates: hazardRates.map((h, i) => ({
      month: i + 1,
      rate: h,
      level: h > cfg.churnRate / 12 * 1.5 ? 'high' : h < cfg.churnRate / 12 * 0.7 ? 'low' : 'med',
    })),
    medianSurvival,
    p12Month: survivalProbability(hazardRates, 12) * 100,
    p24Month: survivalProbability(hazardRates, 24) * 100,
    p36Month: survivalProbability(hazardRates, 36) * 100,
    renewalRiskMonths: [12, 24, 36], // Key renewal risk points
  };
  
  // ═══ JUMP DIFFUSION: EXTREME EVENTS ═══
  const jumpRisk = calculateJumpRisk(cfg, 500);
  
  const extremeEvents = {
    catastropheRisk: jumpRisk.catastropheRisk,
    worstDropP95: jumpRisk.worstDropP95,
    expectedJumps: jumpRisk.expectedJumps,
    finalRevenueP05: jumpRisk.finalP05,
    finalRevenueP50: jumpRisk.finalP50,
    finalRevenueP95: jumpRisk.finalP95,
    bufferNeeded: jumpRisk.worstDropP95 / 100 * cfg.startCash * 2,
  };
  
  // ═══ LIQUIDITY METRICS ═══
  const finalCash = s.cash[s.cash.length - 1]?.p50 || cfg.startCash;
  const firstCash = s.cash[0]?.p50 || cfg.startCash;
  const avgMonthlyRevenue = s.revenue.reduce((sum, r) => sum + r.p50, 0) / s.revenue.length;
  const avgMonthlyExpenses = cfg.startHeads * cfg.avgSalary * 1.35 + cfg.fixedCosts;
  const monthlyBurn = Math.max(0, avgMonthlyExpenses - avgMonthlyRevenue * 0.7);
  
  // DSO (Days Sales Outstanding) - how fast we collect payments
  const dso = cfg.dso || 35;
  
  // Runway = Cash / Monthly Burn Rate
  const runway = monthlyBurn > 0 ? cfg.startCash / monthlyBurn : 99;
  
  // Find break-even month
  let breakEvenMonth = 0;
  for (let i = 0; i < s.cash.length; i++) {
    if (s.cash[i].p50 > firstCash) {
      breakEvenMonth = i + 1;
      break;
    }
  }
  if (breakEvenMonth === 0) breakEvenMonth = 36; // Not reached
  
  const liquidity = {
    runway: Math.min(99, runway),
    dso,
    monthlyBurn,
    breakEvenMonth,
    cashChange: ((finalCash - firstCash) / firstCash) * 100,
    burnTrend: monthlyBurn > avgMonthlyExpenses * 0.8 ? 'increasing' : 'stable',
  };
  
  // ═══ PIPELINE METRICS ═══
  const salesCycle = 3; // Months average
  const avgDeal = cfg.billingRate * cfg.hoursPerDay * 22 * 2; // 2 months project
  const pipelineVelocity = (cfg.newLeadsMonth * cfg.winRate * avgDeal) / salesCycle;
  const bookToBill = pipelineVelocity / avgMonthlyRevenue;
  
  const pipeline = {
    velocity: pipelineVelocity,
    bookToBill,
    weightedPipeline: cfg.startPipeline * cfg.winRate,
    salesCycle,
    leadConversion: cfg.winRate * 100,
    healthStatus: bookToBill >= 1.1 ? 'growing' : bookToBill >= 0.9 ? 'stable' : 'shrinking',
  };
  
  // ═══ UTILIZATION HEATMAP DATA ═══
  const utilHeatmap = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  for (let year = 0; year < 3; year++) {
    const row = [];
    for (let month = 0; month < 12; month++) {
      const idx = year * 12 + month;
      if (idx < s.utilization.length) {
        const util = s.utilization[idx].p50;
        row.push({
          value: util,
          level: util >= 95 ? 'critical' : util >= 85 ? 'high' : util >= 70 ? 'med' : 'low',
        });
      }
    }
    if (row.length > 0) {
      utilHeatmap.push({ year: 2024 + year, data: row });
    }
  }
  
  // ═══ INVESTOR METRICS ═══
  // Calculate monthly profit from revenue and estimated expenses
  const monthlyExpenseRate = cfg.startHeads * cfg.avgSalary * 1.35 + cfg.fixedCosts;
  const profitData = s.revenue.map((rev, i) => {
    const heads = s.headcount?.[i]?.p50 || cfg.startHeads;
    const expenses = heads * cfg.avgSalary * 1.35 + cfg.fixedCosts;
    return { p50: rev.p50 - expenses };
  });
  
  // IRR approximation (simplified)
  const totalInvestment = cfg.startCash;
  const yearlyReturns = [0, 1, 2].map(y => {
    const startIdx = y * 12;
    const endIdx = Math.min((y + 1) * 12, profitData.length);
    return profitData.slice(startIdx, endIdx).reduce((sum, p) => sum + p.p50, 0);
  });
  
  // Simple IRR estimation using Newton-Raphson approximation
  let irr = 0.1; // Start guess
  for (let iter = 0; iter < 20; iter++) {
    let npv = -totalInvestment;
    let dnpv = 0;
    yearlyReturns.forEach((ret, y) => {
      npv += ret / Math.pow(1 + irr, y + 1);
      dnpv -= (y + 1) * ret / Math.pow(1 + irr, y + 2);
    });
    if (Math.abs(dnpv) > 0.001) {
      irr = irr - npv / dnpv;
    }
  }
  irr = Math.max(-0.99, Math.min(2, irr));
  
  // ROE = Net Income / Equity
  const totalProfit = profitData.reduce((sum, p) => sum + p.p50, 0);
  const roe = (totalProfit / totalInvestment) * 100;
  
  // Payback period
  let paybackMonths = 0;
  let cumProfit = 0;
  for (let i = 0; i < profitData.length; i++) {
    cumProfit += profitData[i].p50;
    if (cumProfit >= 0 && paybackMonths === 0) {
      paybackMonths = i + 1;
      break;
    }
  }
  if (paybackMonths === 0) paybackMonths = 36;
  
  // LTV:CAC ratio
  const customerAcquisitionCost = (cfg.newLeadsMonth * 500) / (cfg.newLeadsMonth * cfg.winRate);
  const ltvCacRatio = clvSegmentation.avgCLV / Math.max(1, customerAcquisitionCost);
  
  // NRR (Net Revenue Retention)
  const startRevenue = s.revenue[0]?.p50 || 1;
  const endRevenue = s.revenue[s.revenue.length - 1]?.p50 || startRevenue;
  const expansionRate = 0.05; // 5% expansion
  const nrr = ((endRevenue + startRevenue * expansionRate - startRevenue * (cfg.churnRate / 12)) / startRevenue) * 100;
  
  const investor = {
    irr: irr * 100,
    roe,
    paybackMonths,
    ltvCacRatio,
    nrr: Math.min(150, Math.max(50, nrr)),
    totalProfit,
    yearlyReturns,
  };
  
  // ═══ CASH FLOW WATERFALL ═══
  const waterfall = [
    { label: 'Start Cash', value: cfg.startCash, type: 'total' },
    { label: '+ Revenue', value: avgMonthlyRevenue * 12, type: 'positive' },
    { label: '- Lønninger', value: -cfg.startHeads * cfg.avgSalary * 12, type: 'negative' },
    { label: '- Overhead', value: -cfg.fixedCosts * 12 * 0.35, type: 'negative' },
    { label: '- DSO Effect', value: -(avgMonthlyRevenue * dso / 30), type: 'negative' },
    { label: '= Slut Cash', value: finalCash, type: 'total' },
  ];
  
  return {
    serviceLevel,
    clv,
    survival,
    extremeEvents,
    liquidity,
    pipeline,
    utilHeatmap,
    investor,
    waterfall,
  };
}

/* ─── SVG BAND CHART ─────────────────────────────────────────────────── */
function BandChart({ series, metricKey, color, fmt, h = 90, onHover }) {
  if (!series || !series[metricKey]) return null;
  const data = series[metricKey];
  const allVals = data.flatMap(d => [d.p10, d.p90]);
  const minV = Math.min(...allVals) * 0.92;
  const maxV = Math.max(...allVals) * 1.06;
  const W = 600, H = h;
  const PAD = { l: 36, r: 8, t: 4, b: 20 };
  const w = W - PAD.l - PAD.r;
  const hh = H - PAD.t - PAD.b;
  const xOf = i => PAD.l + (i / (data.length - 1)) * w;
  const yOf = v => PAD.t + hh - ((v - minV) / Math.max(1, maxV - minV)) * hh;

  const bandPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(d.p90).toFixed(1)}`).join(' ')
    + ' ' + [...data].reverse().map((d, i) => `${i === 0 ? 'L' : 'L'}${xOf(data.length - 1 - i).toFixed(1)},${yOf(d.p10).toFixed(1)}`).join(' ')
    + 'Z';

  const linePath = (key) => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(d[key]).toFixed(1)}`).join(' ');

  const tickMonths = [0, 6, 12, 18, 24, 30, 35];
  const yTicks = [0, 0.5, 1].map(t => ({ v: minV + t * (maxV - minV), y: yOf(minV + t * (maxV - minV)) }));

  const handleMouseMove = (e) => {
    if (!onHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relX = (x - PAD.l) / w;
    const monthIndex = Math.round(relX * (data.length - 1));
    if (monthIndex >= 0 && monthIndex < data.length) {
      const d = data[monthIndex];
      onHover({
        month: monthIndex + 1,
        p10: d.p10,
        p50: d.p50,
        p90: d.p90,
        x: xOf(monthIndex) * (rect.width / W),
        y: yOf(d.p50) * (rect.height / H),
      });
    }
  };

  return (
    <svg 
      viewBox={`0 0 ${W} ${H}`} 
      preserveAspectRatio="none" 
      className="chart-svg" 
      style={{ height: h }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHover && onHover(null)}
    >
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.l} y1={t.y} x2={PAD.l + w} y2={t.y} stroke="rgba(0,0,0,0.1)" strokeDasharray="3,5" />
          <text x={PAD.l - 3} y={t.y + 3} fill="#333333" fontSize="9" textAnchor="end" fontFamily="'IBM Plex Mono',monospace">
            {fmt(t.v)}
          </text>
        </g>
      ))}
      {tickMonths.map(i => i < data.length && (
        <text key={i} x={xOf(i)} y={H - 4} fill="#333333" fontSize="8" textAnchor="middle" fontFamily="'IBM Plex Mono',monospace">
          {`M${i + 1}`}
        </text>
      ))}
      <path d={bandPath} fill={color} opacity="0.1" />
      <path d={linePath('p10')} fill="none" stroke={color} strokeWidth="0.6" opacity="0.35" strokeDasharray="2,3" />
      <path d={linePath('p90')} fill="none" stroke={color} strokeWidth="0.6" opacity="0.35" strokeDasharray="2,3" />
      <path d={linePath('p50')} fill="none" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

/* ─── HISTOGRAM ──────────────────────────────────────────────────────── */
function Histogram({ data, bins = 20 }) {
  if (!data || !data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const binWidth = range / bins;
  const counts = Array(bins).fill(0);
  data.forEach(v => {
    const idx = Math.min(bins - 1, Math.floor((v - min) / binWidth));
    counts[idx]++;
  });
  const maxCount = Math.max(...counts);

  return (
    <div className="histogram-wrap">
      {counts.map((c, i) => (
        <div 
          key={i} 
          className="histogram-bar" 
          style={{ height: `${(c / maxCount) * 100}%` }}
          title={`${fmtK(min + i * binWidth)} - ${fmtK(min + (i + 1) * binWidth)}: ${c} trials`}
        />
      ))}
    </div>
  );
}

/* ─── SPEEDOMETER GAUGE ─────────────────────────────────────────────── */
function Speedometer({ value, min = 0, max = 100, label, unit, target, format, status, tooltip }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const rotation = -45 + (pct / 100) * 180; // -45 to 135 degrees
  
  const getStatus = () => {
    if (status) return status;
    if (pct >= 80) return 'good';
    if (pct >= 50) return 'warn';
    return 'danger';
  };
  
  const formatValue = (v) => {
    if (format === 'pct') return `${v.toFixed(0)}%`;
    if (format === 'months') return v.toFixed(1);
    if (format === 'ratio') return v.toFixed(1);
    if (format === 'days') return v.toFixed(0);
    if (format === 'currency') return fmtK(v);
    return v.toFixed(1);
  };
  
  return (
    <div className="speedometer" title={tooltip?.content}>
      <div className="speedometer-title">
        {label}
        {tooltip && <HelpIcon {...tooltip} position="left" />}
      </div>
      <div className="speedometer-arc">
        <div className="speedometer-bg"></div>
        <div 
          className={`speedometer-fill ${getStatus()}`}
          style={{ 
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation - 90) * Math.PI / 180)}%, 50% 50%)`
          }}
        ></div>
      </div>
      <div className="speedometer-value">{formatValue(value)}</div>
      <div className="speedometer-unit">{unit}</div>
      <div className="speedometer-range">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
      {target && (
        <div className="speedometer-target">Target: {formatValue(target)}</div>
      )}
    </div>
  );
}

/* ─── WATERFALL CHART ───────────────────────────────────────────────── */
function WaterfallChart({ data, title, tooltip }) {
  if (!data || !data.length) return null;
  
  const maxAbs = Math.max(...data.map(d => Math.abs(d.value)));
  
  const getTooltipForLabel = (label) => {
    if (label.includes('Revenue')) return 'Forventet årlig omsætning baseret på teknikere × udnyttelse × takst.';
    if (label.includes('Løn')) return 'Årlige lønomkostninger inkl. pension, feriepenge og forsikringer.';
    if (label.includes('Overhead')) return 'Indirekte omkostninger: kontor, IT, ledelse, administration.';
    if (label.includes('DSO')) return 'Likviditetseffekt af forsinkede betalinger.';
    if (label.includes('Start')) return 'Kassebeholdning ved periodens start.';
    if (label.includes('Slut')) return 'Forventet kassebeholdning ved periodens slut.';
    return '';
  };
  
  return (
    <div className="waterfall-chart">
      <div className="waterfall-title">
        <span>📊</span> {title}
        <HelpIcon 
          title="Cash Flow Waterfall" 
          content="Visualisering af hvordan cash flow opdeles i komponenter: indtægter, lønninger, overhead, og DSO-effekt." 
          position="left" 
        />
      </div>
      {data.map((item, i) => (
        <div className="waterfall-row" key={i} title={getTooltipForLabel(item.label)}>
          <div className="waterfall-label">{item.label}</div>
          <div className="waterfall-bar-wrap">
            <div className="waterfall-center"></div>
            {item.type === 'total' ? (
              <div 
                className="waterfall-bar total"
                style={{ width: `${(Math.abs(item.value) / maxAbs) * 50}%` }}
              >
                {fmtK(item.value)}
              </div>
            ) : (
              <div 
                className={`waterfall-bar ${item.value >= 0 ? 'positive' : 'negative'}`}
                style={{ width: `${(Math.abs(item.value) / maxAbs) * 50}%` }}
              >
                {item.value >= 0 ? '+' : ''}{fmtK(item.value)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── UTILIZATION HEATMAP ───────────────────────────────────────────── */
function UtilizationHeatmap({ data, title }) {
  if (!data || !data.length) return null;
  
  const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const fullMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'];
  
  const getLevelTooltip = (level, value) => {
    if (level === 'low') return `${value.toFixed(0)}% — Lav udnyttelse. Kapacitet til flere opgaver.`;
    if (level === 'med') return `${value.toFixed(0)}% — Optimal balance mellem kapacitet og fleksibilitet.`;
    if (level === 'high') return `${value.toFixed(0)}% — Høj udnyttelse. Lille buffer til akutte opgaver.`;
    if (level === 'critical') return `${value.toFixed(0)}% — KRITISK! Overbelastet. Risiko for kvalitetsproblemer.`;
    return `${value.toFixed(0)}%`;
  };
  
  return (
    <div className="heatmap">
      <div className="heatmap-title">
        {title}
        <HelpIcon 
          title="Kapacitets-Heatmap" 
          content="Visuelt overblik over kapacitetsudnyttelse måned for måned over 3 år. Grøn = lav, Gul = optimal, Orange = høj, Rød = kritisk." 
          position="left" 
        />
      </div>
      <div className="heatmap-row" style={{ marginBottom: '4px' }}>
        <div className="heatmap-label"></div>
        {monthNames.map((m, i) => (
          <div key={i} className="heatmap-cell" style={{ background: 'transparent', color: 'var(--text3)', fontSize: '7px' }}>
            {m}
          </div>
        ))}
      </div>
      {data.map((row, i) => (
        <div className="heatmap-row" key={i}>
          <div className="heatmap-label">{row.year}</div>
          {row.data.map((cell, j) => (
            <div 
              key={j} 
              className={`heatmap-cell ${cell.level}`}
              title={`${fullMonthNames[j]} ${row.year}: ${getLevelTooltip(cell.level, cell.value)}`}
            >
              {cell.value.toFixed(0)}
            </div>
          ))}
        </div>
      ))}
      <div className="heatmap-legend">
        <div className="heatmap-legend-item" title="Lav udnyttelse — Kapacitet til flere opgaver">
          <div className="heatmap-legend-box" style={{ background: 'rgba(5,150,105,0.6)' }}></div>
          <span>&lt;70%</span>
        </div>
        <div className="heatmap-legend-item" title="Optimal balance — God kapacitetsudnyttelse">
          <div className="heatmap-legend-box" style={{ background: 'rgba(217,119,6,0.6)' }}></div>
          <span>70-85%</span>
        </div>
        <div className="heatmap-legend-item" title="Høj udnyttelse — Ved grænsen, lille buffer">
          <div className="heatmap-legend-box" style={{ background: 'rgba(220,38,38,0.6)' }}></div>
          <span>85-95%</span>
        </div>
        <div className="heatmap-legend-item" title="KRITISK — Overbelastet, ansæt nu!">
          <div className="heatmap-legend-box" style={{ background: 'rgba(127,29,29,0.9)' }}></div>
          <span>&gt;95%</span>
        </div>
      </div>
    </div>
  );
}

/* ─── INVESTOR KPI PANEL ────────────────────────────────────────────── */
function InvestorPanel({ metrics, tooltips }) {
  if (!metrics) return null;
  
  const getStatus = (metric, value) => {
    if (metric === 'irr') return value >= 15 ? 'good' : value >= 7 ? 'warn' : 'bad';
    if (metric === 'roe') return value >= 20 ? 'good' : value >= 10 ? 'warn' : 'bad';
    if (metric === 'payback') return value <= 18 ? 'good' : value <= 30 ? 'warn' : 'bad';
    if (metric === 'ltvcac') return value >= 3 ? 'good' : value >= 2 ? 'warn' : 'bad';
    if (metric === 'nrr') return value >= 110 ? 'good' : value >= 100 ? 'warn' : 'bad';
    return '';
  };
  
  return (
    <div className="investor-panel">
      <div className="investor-title">
        <span>💰</span> INVESTOR KPIs
        <HelpIcon 
          title="Investor Metrics" 
          content="Nøgletal for investorer: IRR (intern rente), ROE (egenkapitalforrentning), Payback (tilbagebetalingstid), LTV:CAC (kundeværdi vs. anskaffelse)." 
          position="left" 
        />
      </div>
      <div className="investor-grid">
        <div className={`investor-metric ${getStatus('irr', metrics.irr)}`} title={tooltips?.irrMetric?.content}>
          <div className="investor-metric-label">
            IRR
            <HelpIcon {...(tooltips?.irrMetric || { title: 'IRR', content: 'Internal Rate of Return' })} position="left" />
          </div>
          <div className="investor-metric-value">{metrics.irr.toFixed(1)}%</div>
          <div className="investor-metric-sub">3-årig</div>
        </div>
        <div className={`investor-metric ${getStatus('roe', metrics.roe)}`} title={tooltips?.roeMetric?.content}>
          <div className="investor-metric-label">
            ROE
            <HelpIcon {...(tooltips?.roeMetric || { title: 'ROE', content: 'Return on Equity' })} position="left" />
          </div>
          <div className="investor-metric-value">{metrics.roe.toFixed(1)}%</div>
          <div className="investor-metric-sub">Return on Equity</div>
        </div>
        <div className={`investor-metric ${getStatus('payback', metrics.paybackMonths)}`} title={tooltips?.paybackMetric?.content}>
          <div className="investor-metric-label">
            Payback
            <HelpIcon {...(tooltips?.paybackMetric || { title: 'Payback', content: 'Tilbagebetalingstid' })} position="left" />
          </div>
          <div className="investor-metric-value">{metrics.paybackMonths}</div>
          <div className="investor-metric-sub">måneder</div>
        </div>
        <div className={`investor-metric ${getStatus('ltvcac', metrics.ltvCacRatio)}`} title={tooltips?.ltvCacGauge?.content}>
          <div className="investor-metric-label">
            LTV:CAC
            <HelpIcon {...(tooltips?.ltvCacGauge || { title: 'LTV:CAC', content: 'Customer Lifetime Value to Acquisition Cost' })} position="left" />
          </div>
          <div className="investor-metric-value">{metrics.ltvCacRatio.toFixed(1)}x</div>
          <div className="investor-metric-sub">ratio</div>
        </div>
      </div>
    </div>
  );
}

/* ─── MINI KPI ROW ──────────────────────────────────────────────────── */
function MiniKPIRow({ metrics, tooltips }) {
  if (!metrics) return null;
  
  const { liquidity, pipeline, investor } = metrics;
  
  return (
    <div className="kpi-row">
      <div className="kpi-mini" title="Hvor mange måneder virksomheden kan overleve med nuværende burn rate. Grøn ≥12, Gul ≥6, Rød <6.">
        <div className="kpi-mini-label">
          Runway
          <span className="help-icon" style={{ marginLeft: '4px', fontSize: '8px' }}>?</span>
        </div>
        <div className={`kpi-mini-value ${liquidity.runway >= 12 ? 'good' : liquidity.runway >= 6 ? 'warn' : 'bad'}`}>
          {liquidity.runway.toFixed(1)}
        </div>
        <div className="kpi-mini-delta">måneder</div>
      </div>
      <div className="kpi-mini" title="Days Sales Outstanding — gennemsnitligt antal dage fra fakturering til betaling. Lavere = bedre.">
        <div className="kpi-mini-label">
          DSO
          <span className="help-icon" style={{ marginLeft: '4px', fontSize: '8px' }}>?</span>
        </div>
        <div className={`kpi-mini-value ${liquidity.dso <= 30 ? 'good' : liquidity.dso <= 45 ? 'warn' : 'bad'}`}>
          {liquidity.dso}
        </div>
        <div className="kpi-mini-delta">dage</div>
      </div>
      <div className="kpi-mini" title="Forholdet mellem nye ordrer og omsætning. Over 1.0 = voksende ordrebog, under 1.0 = krympende.">
        <div className="kpi-mini-label">
          Book-to-Bill
          <span className="help-icon" style={{ marginLeft: '4px', fontSize: '8px' }}>?</span>
        </div>
        <div className={`kpi-mini-value ${pipeline.bookToBill >= 1.1 ? 'good' : pipeline.bookToBill >= 0.9 ? 'warn' : 'bad'}`}>
          {pipeline.bookToBill.toFixed(2)}
        </div>
        <div className={`kpi-mini-delta ${pipeline.bookToBill >= 1 ? 'up' : 'down'}`}>
          {pipeline.healthStatus}
        </div>
      </div>
      <div className="kpi-mini" title="Pipeline Velocity — hvor hurtigt pipeline konverteres til omsætning. (Leads × Win Rate × Deal) / Salgscyklus.">
        <div className="kpi-mini-label">
          Pipeline V.
          <span className="help-icon" style={{ marginLeft: '4px', fontSize: '8px' }}>?</span>
        </div>
        <div className="kpi-mini-value">{fmtK(pipeline.velocity)}</div>
        <div className="kpi-mini-delta">/måned</div>
      </div>
      <div className="kpi-mini" title="Net Revenue Retention — omsætning fra eksisterende kunder inkl. expansion minus churn. Over 100% = vækst uden nye kunder.">
        <div className="kpi-mini-label">
          NRR
          <span className="help-icon" style={{ marginLeft: '4px', fontSize: '8px' }}>?</span>
        </div>
        <div className={`kpi-mini-value ${investor.nrr >= 110 ? 'good' : investor.nrr >= 100 ? 'warn' : 'bad'}`}>
          {investor.nrr.toFixed(0)}%
        </div>
        <div className="kpi-mini-delta">retention</div>
      </div>
      <div className="kpi-mini" title="Den måned hvor kassebeholdningen igen overstiger startbeløbet. Tidligere = bedre.">
        <div className="kpi-mini-label">
          Break-even
          <span className="help-icon" style={{ marginLeft: '4px', fontSize: '8px' }}>?</span>
        </div>
        <div className={`kpi-mini-value ${liquidity.breakEvenMonth <= 18 ? 'good' : liquidity.breakEvenMonth <= 30 ? 'warn' : 'bad'}`}>
          M{liquidity.breakEvenMonth}
        </div>
        <div className="kpi-mini-delta">måned</div>
      </div>
    </div>
  );
}

/* ─── ONBOARDING DELAY PANEL ───────────────────────────────────────── */
function OnboardingDelayPanel({ cfg, months = 6 }) {
  const onboardingMonths = cfg.onboardingMonths || 3;
  
  const productivityCurve = Array.from({ length: months }, (_, i) => {
    const monthsInRole = i + 1;
    if (monthsInRole <= onboardingMonths) {
      const progress = monthsInRole / onboardingMonths;
      return 0.3 + 0.65 * (1 / (1 + Math.exp(-4 * (progress - 0.5))));
    }
    return 0.95;
  });
  
  const avgProductivity = productivityCurve.reduce((a, b) => a + b, 0) / productivityCurve.length;
  const fullProductivityMonth = onboardingMonths + 1;
  const lostCapacity = onboardingMonths * (1 - avgProductivity) * 100;
  
  return (
    <div className="onboarding-panel">
      <div className="onboarding-title">
        <span>📈</span> Onboarding Læringskurve (Nye Ansættelser)
      </div>
      
      <div className="onboarding-timeline">
        {productivityCurve.map((prod, i) => (
          <div 
            key={i} 
            className="onboarding-bar" 
            title={`Måned ${i + 1}: ${(prod * 100).toFixed(0)}% produktivitet`}
          >
            <div 
              className="onboarding-bar-fill" 
              style={{ 
                height: `${prod * 100}%`,
                background: prod >= 0.9 ? 'var(--green)' : 
                           prod >= 0.6 ? 'var(--amber)' : 
                           'var(--red)'
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="onboarding-labels">
        <span>M1</span>
        <span>M{Math.ceil(months / 2)}</span>
        <span>M{months}</span>
      </div>
      
      <div className="onboarding-legend">
        <div className="onboarding-legend-item">
          <div className="onboarding-legend-dot ramp" />
          <span>Ramp-up periode</span>
        </div>
        <div className="onboarding-legend-item">
          <div className="onboarding-legend-dot full" />
          <span>Fuld produktivitet</span>
        </div>
      </div>
      
      <div className="onboarding-stats">
        <div className="onboarding-stat">
          <div className="onboarding-stat-value">{onboardingMonths}</div>
          <div className="onboarding-stat-label">Mdr til fuld prod.</div>
        </div>
        <div className="onboarding-stat">
          <div className="onboarding-stat-value">{(avgProductivity * 100).toFixed(0)}%</div>
          <div className="onboarding-stat-label">Gns. produktivitet</div>
        </div>
        <div className="onboarding-stat">
          <div className="onboarding-stat-value">{lostCapacity.toFixed(0)}%</div>
          <div className="onboarding-stat-label">Tabt kapacitet</div>
        </div>
      </div>
    </div>
  );
}

/* ─── BULLWHIP EFFECT INDICATOR ────────────────────────────────────── */
function BullwhipIndicator({ result, cfg }) {
  if (!result?.series) return null;
  
  const s = result.series;
  
  const demandVariance = calculateVariance(s.revenue.map(r => r.p50));
  const capacityVariance = calculateVariance(s.headcount.map(h => h.p50));
  const pipelineVariance = calculateVariance([cfg.startPipeline, ...s.revenue.map(r => r.p50 * 3)]);
  
  const bullwhipRatio = capacityVariance > 0 && demandVariance > 0 
    ? Math.sqrt(capacityVariance / demandVariance) 
    : 1;
  
  const clampedRatio = Math.min(3, Math.max(0.5, bullwhipRatio));
  const needlePosition = ((clampedRatio - 0.5) / 2.5) * 100;
  
  const severity = bullwhipRatio < 1.2 ? 'low' : bullwhipRatio < 2 ? 'med' : 'high';
  const explanation = severity === 'low' 
    ? 'Lav amplifikation — kapacitet følger efterspørgsel stabilt.'
    : severity === 'med'
    ? 'Moderat amplifikation — overvej glattere ansættelsespolitik.'
    : 'Høj amplifikation — risiko for over/under-kapacitet. Reducer reaktionstid.';
  
  return (
    <div className="bullwhip-panel">
      <div className="bullwhip-title">
        <span>🌊</span> Bullwhip Effekt
        <HelpIcon 
          title="Bullwhip Effekt"
          content="Måler hvor meget kapacitetsudsving forstærkes i forhold til efterspørgselsudsving. Ratio > 1 = amplifikation."
          formula="σ(kapacitet) / σ(efterspørgsel)"
          position="left"
        />
      </div>
      
      <div className="bullwhip-meter">
        <div 
          className="bullwhip-needle" 
          style={{ left: `${Math.min(100, Math.max(0, needlePosition))}%` }}
        />
      </div>
      
      <div className="bullwhip-scale">
        <span>0.5× (stabil)</span>
        <span>1.5× (normal)</span>
        <span>3.0× (volatil)</span>
      </div>
      
      <div className="bullwhip-value">
        <div className={`bullwhip-value-num ${severity}`}>
          {bullwhipRatio.toFixed(2)}×
        </div>
        <div className="bullwhip-value-label">Amplifikationsratio</div>
      </div>
      
      <div className="bullwhip-explanation">
        {explanation}
      </div>
    </div>
  );
}

function calculateVariance(arr) {
  if (!arr || arr.length === 0) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
}

/* ─── EXPORT FUNCTIONS ───────────────────────────────────────────────── */
function exportCSV(result, cfg) {
  if (!result?.series) return;
  const s = result.series;
  const headers = ['Month', 'Revenue_P50', 'Cash_P50', 'Utilization_P50', 'Headcount_P50', 'Runway_P10'];
  const rows = s.revenue.map((r, i) => [
    i + 1,
    Math.round(s.revenue[i].p50),
    Math.round(s.cash[i].p50),
    s.utilization[i].p50.toFixed(1),
    Math.round(s.headcount[i].p50),
    s.runway[i].p10.toFixed(1),
  ]);
  
  const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `fieldservice-sim-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

function copyShareURL(cfg) {
  const params = new URLSearchParams();
  Object.entries(cfg).forEach(([k, v]) => params.set(k, v));
  const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  navigator.clipboard.writeText(url);
  alert('URL kopieret til udklipsholder!');
}

/* ─── TOOLTIP COMPONENT ─────────────────────────────────────────────── */
function Tip({ children, content, title, formula, position = 'center' }) {
  return (
    <span className="tooltip-wrapper">
      <span className="tooltip-trigger">
        {children}
        <span className="tooltip-icon">ⓘ</span>
      </span>
      <span className={`tooltip-content ${position}`}>
        {title && <div className="tooltip-title">{title}</div>}
        <div>{content}</div>
        {formula && <div className="tooltip-formula">{formula}</div>}
      </span>
    </span>
  );
}

function HelpIcon({ content, title, formula, position = 'center' }) {
  return (
    <span className="tooltip-wrapper">
      <span className="help-icon">?</span>
      <span className={`tooltip-content ${position}`}>
        {title && <div className="tooltip-title">{title}</div>}
        <div>{content}</div>
        {formula && <div className="tooltip-formula">{formula}</div>}
      </span>
    </span>
  );
}

/* ─── TOOLTIP DEFINITIONS ───────────────────────────────────────────── */
const TOOLTIPS = {
  // KPI tooltips
  npv: {
    title: 'NPV — Net Present Value',
    content: 'Nutidsværdien af alle fremtidige pengestrømme diskonteret med 8% p.a. P50 = median, P10 = worst case.',
    formula: 'NPV = Σ (CFₜ / (1 + r)ᵗ)',
  },
  runway: {
    title: 'Runway P10',
    content: 'Antal måneder virksomheden kan overleve med nuværende burn rate. P10 = 10. percentil (worst case af 1000 simuleringer).',
    formula: 'Runway = Kasse / Burn Rate',
  },
  bankruptcyRisk: {
    title: 'Konkursrisiko',
    content: 'Sandsynlighed for at kassen går i minus inden for 36 måneder baseret på 300 Monte Carlo simuleringer.',
    formula: '% af simuleringer med kasse < 0',
  },
  utilization: {
    title: 'Udnyttelsesgrad',
    content: 'Andel af tekniker-kapacitet der faktureres. Over 85% = overbelastet, under 65% = underudnyttet.',
    formula: 'Fakturerede timer / Tilgængelige timer',
  },
  bookToBill: {
    title: 'Book-to-Bill Ratio',
    content: 'Forholdet mellem nye ordrer og omsætning. Over 1.0 = voksende, under 1.0 = krympende.',
    formula: 'Nye ordrer / Månedlig omsætning',
  },
  
  // Input parameter tooltips
  startHeads: {
    title: 'Startantal teknikere',
    content: 'Antal fuldtidsansatte serviceteknikere ved simuleringsstart.',
  },
  hireThreshold: {
    title: 'Ansættelsesgrænse',
    content: 'Når udnyttelsen overstiger denne grænse, begynder virksomheden at ansætte flere teknikere.',
  },
  billingRate: {
    title: 'Faktureringstakst',
    content: 'Gennemsnitlig timeløn der faktureres til kunder. Inkluderer ikke materialer.',
  },
  hoursPerDay: {
    title: 'Fakturerbare timer/dag',
    content: 'Antal timer pr. dag der realistisk kan faktureres. Typisk 6-8 timer af en 8-timers arbejdsdag.',
  },
  salaryPerHead: {
    title: 'Lønomkostning pr. tekniker',
    content: 'Total lønomkostning inkl. pension, feriepenge, forsikringer etc.',
  },
  overheadFactor: {
    title: 'Overhead-faktor',
    content: 'Indirekte omkostninger som % af lønomkostninger. Inkluderer kontor, IT, ledelse, administration.',
  },
  dso: {
    title: 'DSO — Days Sales Outstanding',
    content: 'Gennemsnitligt antal dage fra fakturering til betaling modtages.',
    formula: '(Tilgodehavender / Omsætning) × 30',
  },
  startCash: {
    title: 'Startkasse',
    content: 'Likvid beholdning ved simuleringsstart. Buffer til at håndtere udsving og vækst.',
  },
  winRate: {
    title: 'Win Rate',
    content: 'Andel af pipeline der konverteres til ordrer. Påvirkes af konkurrence, prissætning og salgsproces.',
  },
  newLeadsMonth: {
    title: 'Ny pipeline pr. måned',
    content: 'Værdi af nye leads/tilbud der kommer ind hver måned.',
  },
  startPipeline: {
    title: 'Start-pipeline',
    content: 'Samlet værdi af aktive tilbud og leads ved simuleringsstart.',
  },
  churnRate: {
    title: 'Medarbejder-churn',
    content: 'Årlig rate for frivillig afgang. Høj churn = tabte kompetencer + rekrutteringsomkostninger.',
  },
  
  // Model toggles
  abmEnabled: {
    title: 'Agent-Based Modeling',
    content: 'Simulerer individuelle teknikere med skills, sygdom og turnover. Giver mere realistisk kapacitetsberegning.',
  },
  discreteQueueEnabled: {
    title: 'Diskret Event-kø',
    content: 'Simulerer opgavekø med prioriteter, SLA-deadlines og eskalering. Viser flaskehalse.',
  },
  extendedParamsEnabled: {
    title: 'Udvidede parametre',
    content: 'Aktiverer detaljerede omkostninger: rejsetid, materialer, underentreprenører, bilomkostninger.',
  },
  mlForecastEnabled: {
    title: 'ML-forecast (Holt-Winters)',
    content: 'Statistisk prognose baseret på historiske data. Inkluderer niveau, trend og sæsonkomponenter.',
    formula: 'Yₜ₊ₕ = (Lₜ + h·Tₜ) × Sₜ₊ₕ₋ₘ',
  },
  regimeSwitchingEnabled: {
    title: 'Regime Switching',
    content: 'Markovkæde der skifter mellem VÆKST, STABIL og RECESSION regimer med forskellige sandsynligheder.',
  },
  jumpDiffusionEnabled: {
    title: 'Jump Diffusion (Merton)',
    content: 'Modellerer pludselige store ændringer (fx tab af stor kunde). Kombinerer GBM med Poisson-hop.',
    formula: 'dS = μSdt + σSdW + S(eᴶ-1)dN',
  },
  correlatedShocksEnabled: {
    title: 'Korrelerede Shocks',
    content: 'Shocks til forskellige variabler er korrelerede via Cholesky-dekomponering. Fx: når pipeline falder, stiger churn.',
  },
  fatTailsEnabled: {
    title: 'Fat Tails (Student-t)',
    content: 'Bruger Student-t fordeling i stedet for normalfordeling. Giver flere ekstreme hændelser.',
  },
  seasonalityEnabled: {
    title: 'Sæsonudsving',
    content: 'Månedlige faktorer der påvirker efterspørgsel. Typisk høj i efterår, lav i januar/februar.',
  },
  learningCurveEnabled: {
    title: 'Læringskurve',
    content: 'Nye ansatte starter med 30% produktivitet og når 95% efter 6 måneder via S-kurve.',
    formula: 'P(t) = 0.3 + 0.7 × σ(0.8 × (t - 3))',
  },
  
  // Extended params
  travelTimeHours: {
    title: 'Rejsetid pr. opgave',
    content: 'Gennemsnitlig transporttid til/fra kundelokation. Reducerer fakturerbar tid.',
  },
  materialsCostPct: {
    title: 'Materialeomkostninger',
    content: 'Materialer, reservedele og forbrugsvarer som % af faktureret beløb.',
  },
  subcontractorPct: {
    title: 'Underentreprenør-andel',
    content: 'Andel af opgaver der udføres af underentreprenører (fx specialopgaver).',
  },
  sicknessRate: {
    title: 'Sygefraværsrate',
    content: 'Gennemsnitlig månedlig sygefraværsprocent. Reducerer tilgængelig kapacitet.',
  },
  vehicleCostMonth: {
    title: 'Bilomkostning pr. måned',
    content: 'Leasing, brændstof, forsikring, vedligeholdelse pr. tekniker.',
  },
  urgentJobPct: {
    title: 'Akutte opgaver',
    content: 'Andel af opgaver med kritisk prioritet. Kræver hurtig respons, øger ressourcepres.',
  },
  slaBreachPenalty: {
    title: 'SLA-brud straf',
    content: 'Økonomisk straf eller kompensation ved overskridelse af SLA-deadline.',
  },
  
  // Charts
  cashChart: {
    title: 'Kassebeholdning',
    content: 'Udvikling i likvid beholdning over 36 måneder. P50 = median, P10-P90 = usikkerhedsbånd.',
  },
  utilizationChart: {
    title: 'Kapacitetsudnyttelse',
    content: 'Andel af teknikerkapacitet der faktureres. Hold mellem 70-85% for optimal balance.',
  },
  revenueChart: {
    title: 'Månedlig omsætning',
    content: 'Faktureret omsætning pr. måned baseret på teknikere × timer × takst × udnyttelse.',
  },
  pipelineChart: {
    title: 'Pipeline-værdi',
    content: 'Samlet værdi af aktive tilbud og leads. Driver fremtidig omsætning.',
  },
  
  // Advanced metrics
  erlangC: {
    title: 'Erlang-C Køteori',
    content: 'Beregner ventetid og service level baseret på ankomstrate, servicetid og antal teknikere.',
    formula: 'P(wait) = (A^c × P₀) / (c! × (1 - ρ))',
  },
  bgNBD: {
    title: 'BG/NBD Customer Lifetime Value',
    content: 'Bayesiansk model der estimerer kunders fremtidige værdi baseret på købshistorik.',
  },
  survivalAnalysis: {
    title: 'Survival Analysis',
    content: 'Piecewise eksponentiel hazard-model for kundeafgang. Forskellige hazard rates for tenure.',
  },
  jumpRisk: {
    title: 'Jump Risk (Katastrofe)',
    content: 'Sandsynlighed for >30% fald i omsætning på én måned. Modelleret via Merton jump diffusion.',
  },
  
  // ═══ NEW GAUGES & METRICS ═══
  
  // Speedometer Gauges
  runwayGauge: {
    title: 'Runway (Måneder)',
    content: 'Hvor mange måneder virksomheden kan overleve med nuværende cash og burn rate. Grøn ≥12, Gul ≥6, Rød <6.',
    formula: 'Runway = Kassebeholdning / Månedlig Burn Rate',
  },
  dsoGauge: {
    title: 'DSO — Days Sales Outstanding',
    content: 'Gennemsnitligt antal dage fra fakturering til betaling modtages. Lavere = bedre likviditet. Grøn ≤30, Gul ≤45, Rød >45.',
    formula: 'DSO = (Tilgodehavender / Månedlig Omsætning) × 30',
  },
  utilizationGauge: {
    title: 'Kapacitetsudnyttelse',
    content: 'Andel af teknikertid der faktureres. 70-85% = optimal. Over 85% = overbelastet, under 70% = underudnyttet.',
    formula: 'Utilization = Fakturerbare Timer / Tilgængelige Timer',
  },
  bookToBillGauge: {
    title: 'Book-to-Bill Ratio',
    content: 'Forholdet mellem nye ordrer og leveret omsætning. Over 1.0 = voksende ordrebog, under 1.0 = krympende.',
    formula: 'Book-to-Bill = Pipeline Velocity / Månedlig Omsætning',
  },
  ltvCacGauge: {
    title: 'LTV:CAC Ratio',
    content: 'Forholdet mellem kundelivsværdi og anskaffelsesomkostning. Benchmark: ≥3x er godt, ≥5x er fremragende.',
    formula: 'LTV:CAC = Customer Lifetime Value / Customer Acquisition Cost',
  },
  nrrGauge: {
    title: 'NRR — Net Revenue Retention',
    content: 'Omsætning fra eksisterende kunder inkl. expansion minus churn. Over 100% = vækst uden nye kunder.',
    formula: 'NRR = (Start + Expansion - Churn) / Start × 100%',
  },
  
  // Investor KPIs
  irrMetric: {
    title: 'IRR — Internal Rate of Return',
    content: '3-årig intern rente på investering. Den diskonteringsrate der giver NPV = 0. Benchmark: >15% er godt.',
    formula: 'NPV = Σ CFₜ/(1+IRR)ᵗ = 0',
  },
  roeMetric: {
    title: 'ROE — Return on Equity',
    content: 'Afkast på egenkapital over perioden. Hvor meget profit genereres pr. investeret krone.',
    formula: 'ROE = Total Profit / Initial Investment × 100%',
  },
  paybackMetric: {
    title: 'Payback Period',
    content: 'Antal måneder før den kumulative profit er positiv. Kortere = hurtigere tilbagebetaling af investering.',
    formula: 'Første måned hvor Σ Profit > 0',
  },
  
  // Mini KPI Row
  pipelineVelocity: {
    title: 'Pipeline Velocity',
    content: 'Hvor hurtigt pipeline konverteres til omsætning. Kombination af leads, win rate og salgscyklus.',
    formula: '(Leads × Win Rate × Gennemsnitsdeal) / Salgscyklus',
  },
  breakEvenMonth: {
    title: 'Break-even Måned',
    content: 'Den måned hvor kassebeholdningen igen overstiger startbeløbet. Før = bedre.',
  },
  
  // Waterfall Chart
  waterfallChart: {
    title: 'Cash Flow Waterfall',
    content: 'Visualisering af hvordan cash flow opdeles i komponenter: indtægter, lønninger, overhead, og DSO-effekt.',
  },
  waterfallRevenue: {
    title: '+ Revenue',
    content: 'Forventet årlig omsætning baseret på teknikere, udnyttelse og takst.',
  },
  waterfallSalaries: {
    title: '- Lønninger',
    content: 'Årlige lønomkostninger for alle teknikere inkl. feriepenge og pension.',
  },
  waterfallOverhead: {
    title: '- Overhead',
    content: 'Indirekte omkostninger: kontor, IT, ledelse, administration, forsikringer.',
  },
  waterfallDSO: {
    title: '- DSO Effect',
    content: 'Likviditetseffekt af forsinkede betalinger. Jo længere DSO, jo mere cash er bundet i tilgodehavender.',
    formula: 'DSO Effect = Omsætning × (DSO / 30)',
  },
  
  // Utilization Heatmap
  utilizationHeatmap: {
    title: 'Kapacitets-Heatmap',
    content: 'Visuelt overblik over kapacitetsudnyttelse måned for måned over 3 år. Identificér sæsonmønstre og flaskehalse.',
  },
  heatmapLow: {
    title: 'Lav udnyttelse (<70%)',
    content: 'Grøn zone. Kapacitet til at tage flere opgaver. Overvej: færre ansatte eller mere salg.',
  },
  heatmapMedium: {
    title: 'Medium udnyttelse (70-85%)',
    content: 'Gul zone. Optimal balance mellem kapacitet og fleksibilitet.',
  },
  heatmapHigh: {
    title: 'Høj udnyttelse (85-95%)',
    content: 'Orange zone. Ved grænsen. Lille buffer til akutte opgaver. Overvej ansættelse.',
  },
  heatmapCritical: {
    title: 'Kritisk udnyttelse (>95%)',
    content: 'Rød zone. Overbelastet. Risiko for kvalitetsproblemer, stress og churn. Ansæt nu.',
  },
};

/* ─── LOCAL STORAGE ─────────────────────────────────────────────────── */
const STORAGE_KEY = 'fieldservice_simulator_config';

function saveToLocalStorage(data) {
  try {
    const toSave = {
      ...data,
      savedAt: new Date().toISOString(),
      version: '2.0',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
    return false;
  }
}

function loadFromLocalStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return data;
    }
  } catch (e) {
    console.warn('Could not load from localStorage:', e);
  }
  return null;
}

function clearLocalStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

/* ─── WIZARD STEPS ──────────────────────────────────────────────────── */
const WIZARD_STEPS = [
  { id: 1, label: 'Virksomhed', icon: '🏢' },
  { id: 2, label: 'Ressourcer', icon: '👷' },
  { id: 3, label: 'Økonomi', icon: '💰' },
  { id: 4, label: 'Pipeline', icon: '📊' },
  { id: 5, label: 'Moduler', icon: '⚙️' },
  { id: 6, label: 'Bekræft', icon: '✓' },
];

const INDUSTRY_PRESETS = {
  field_service: {
    name: 'Field Service',
    icon: '🔧',
    desc: 'Tekniker-service, installation, vedligeholdelse',
    defaults: {
      billingRate: 480, hoursPerDay: 7.4, salaryPerHead: 42000,
      overheadFactor: 0.38, dso: 38, winRate: 0.28,
    }
  },
  consulting: {
    name: 'Konsulent',
    icon: '💼',
    desc: 'Rådgivning, projekter, timefakturering',
    defaults: {
      billingRate: 850, hoursPerDay: 7.0, salaryPerHead: 55000,
      overheadFactor: 0.45, dso: 45, winRate: 0.25,
    }
  },
  it_services: {
    name: 'IT Services',
    icon: '💻',
    desc: 'Support, udvikling, managed services',
    defaults: {
      billingRate: 650, hoursPerDay: 7.5, salaryPerHead: 48000,
      overheadFactor: 0.40, dso: 35, winRate: 0.30,
    }
  },
};

/* ─── WIZARD MODAL COMPONENT ────────────────────────────────────────── */
function WizardModal({ isOpen, onClose, onComplete, initialCfg }) {
  const [step, setStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    // Step 1: Company info
    companyName: '',
    industry: 'field_service',
    companySize: 'small', // small, medium, large
    
    // Step 2: Resources
    startHeads: initialCfg?.startHeads || 18,
    avgSalary: initialCfg?.salaryPerHead || 42000,
    hireThreshold: initialCfg?.hireThreshold || 82,
    onboardingMonths: 3,
    
    // Step 3: Financials
    billingRate: initialCfg?.billingRate || 480,
    hoursPerDay: initialCfg?.hoursPerDay || 7.4,
    overheadFactor: (initialCfg?.overheadFactor || 0.38) * 100,
    dso: initialCfg?.dso || 38,
    startCash: initialCfg?.startCash || 2800000,
    fixedCosts: initialCfg?.fixedCosts || 150000,
    
    // Step 4: Pipeline
    startPipeline: initialCfg?.startPipeline || 8500000,
    newLeadsMonth: initialCfg?.newLeadsMonth || 1800000,
    winRate: (initialCfg?.winRate || 0.28) * 100,
    churnRate: (initialCfg?.churnRate || 0.04) * 100,
    salesCycle: 3,
    
    // Step 5: Modules
    enableABM: false,
    enableDiscreteQueue: false,
    enableExtendedParams: false,
    enableMLForecast: false,
    enableRegimeSwitching: true,
    enableJumpDiffusion: true,
    enableCorrelatedShocks: true,
    enableFatTails: true,
    enableSeasonality: true,
    enableLearningCurve: true,
  });
  
  if (!isOpen) return null;
  
  const updateField = (field, value) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };
  
  const applyPreset = (presetKey) => {
    const preset = INDUSTRY_PRESETS[presetKey];
    if (preset) {
      setWizardData(prev => ({
        ...prev,
        industry: presetKey,
        billingRate: preset.defaults.billingRate,
        hoursPerDay: preset.defaults.hoursPerDay,
        avgSalary: preset.defaults.salaryPerHead,
        overheadFactor: preset.defaults.overheadFactor * 100,
        dso: preset.defaults.dso,
        winRate: preset.defaults.winRate * 100,
      }));
    }
  };
  
  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };
  
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const handleFinish = () => {
    // Convert wizard data to config format
    const newCfg = {
      startHeads: parseInt(wizardData.startHeads) || 18,
      hireThreshold: parseInt(wizardData.hireThreshold) || 82,
      billingRate: parseInt(wizardData.billingRate) || 480,
      hoursPerDay: parseFloat(wizardData.hoursPerDay) || 7.4,
      avgSalary: parseInt(wizardData.avgSalary) || 42000,
      salaryPerHead: parseInt(wizardData.avgSalary) || 42000,
      overheadFactor: parseFloat(wizardData.overheadFactor) / 100 || 0.38,
      dso: parseInt(wizardData.dso) || 38,
      startCash: parseInt(wizardData.startCash) || 2800000,
      fixedCosts: parseInt(wizardData.fixedCosts) || 150000,
      startPipeline: parseInt(wizardData.startPipeline) || 8500000,
      newLeadsMonth: parseInt(wizardData.newLeadsMonth) || 1800000,
      winRate: parseFloat(wizardData.winRate) / 100 || 0.28,
      churnRate: parseFloat(wizardData.churnRate) / 100 || 0.04,
      qualityDecayPct: 0.6,
      seasonalityEnabled: wizardData.enableSeasonality,
      overtimeMultiplier: 1.5,
    };
    
    const toggles = {
      abmEnabled: wizardData.enableABM,
      discreteQueueEnabled: wizardData.enableDiscreteQueue,
      extendedParamsEnabled: wizardData.enableExtendedParams,
      mlForecastEnabled: wizardData.enableMLForecast,
      regimeSwitchingEnabled: wizardData.enableRegimeSwitching,
      jumpDiffusionEnabled: wizardData.enableJumpDiffusion,
      correlatedShocksEnabled: wizardData.enableCorrelatedShocks,
      fatTailsEnabled: wizardData.enableFatTails,
      seasonalityEnabled: wizardData.enableSeasonality,
      learningCurveEnabled: wizardData.enableLearningCurve,
      erlangCEnabled: true,
      bgNbdEnabled: true,
      survivalEnabled: true,
    };
    
    // Save to localStorage
    saveToLocalStorage({
      cfg: newCfg,
      toggles,
      wizardData,
      companyName: wizardData.companyName,
    });
    
    onComplete(newCfg, toggles, wizardData);
    onClose();
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="wizard-content">
            <div className="wizard-section">
              <div className="wizard-section-title">
                <span>🏢</span> Virksomhedsinfo
              </div>
              <div className="wizard-grid">
                <div className="wizard-field full">
                  <label className="wizard-label">Virksomhedsnavn (valgfrit)</label>
                  <input 
                    type="text" 
                    className="wizard-input" 
                    placeholder="F.eks. FieldService Danmark A/S"
                    value={wizardData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    title="Dit firmanavn vises i topbaren. Kan være tomt — så bruges 'FieldService'. Eksempel: 'Teknisk Service ApS'"
                  />
                </div>
              </div>
            </div>
            
            <div className="wizard-section">
              <div className="wizard-section-title">
                <span>📋</span> Vælg branche (hurtig start)
              </div>
              <div className="wizard-quick-start">
                {Object.entries(INDUSTRY_PRESETS).map(([key, preset]) => (
                  <div 
                    key={key}
                    className={`wizard-preset ${wizardData.industry === key ? 'selected' : ''}`}
                    onClick={() => applyPreset(key)}
                    title={`Klik for at bruge typiske tal for ${preset.name.toLowerCase()}-branchen. Du kan altid tilpasse bagefter.`}
                  >
                    <div className="wizard-preset-icon">{preset.icon}</div>
                    <div className="wizard-preset-title">{preset.name}</div>
                    <div className="wizard-preset-desc">{preset.desc}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="wizard-info">
              <div className="wizard-info-title">💡 Tip</div>
              Vælg en branche for at få forudfyldte værdier baseret på typiske tal for din industri. 
              Du kan tilpasse alle værdier i de næste trin.
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="wizard-content">
            <div className="wizard-section">
              <div className="wizard-section-title">
                <span>👷</span> Ressourcer & Kapacitet
              </div>
              <div className="wizard-grid">
                <div className="wizard-field">
                  <label className="wizard-label">Antal teknikere</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.startHeads}
                    onChange={(e) => updateField('startHeads', e.target.value)}
                    min="1" max="500"
                    title="Hvor mange fuldtidsansatte teknikere/konsulenter har I i dag? Typisk 5-50 for mindre firmaer, 50-200 for mellemstore. Indtast et heltal mellem 1 og 500."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Gns. løn pr. måned (DKK)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.avgSalary}
                    onChange={(e) => updateField('avgSalary', e.target.value)}
                    min="20000" max="150000"
                    title="Gennemsnitlig bruttoløn pr. medarbejder pr. måned. Inkluder ikke pension/feriepenge — det håndteres i overhead. Typisk 35.000-55.000 for teknikere, 45.000-75.000 for konsulenter."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Ansættelsesgrænse (%)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.hireThreshold}
                    onChange={(e) => updateField('hireThreshold', e.target.value)}
                    min="50" max="100"
                    title="Hvornår begynder I at ansætte nye folk? Når kapacitetsudnyttelsen når denne grænse, starter ansættelsesprocessen. Typisk 80-85%. Under 75% = tidlig ansættelse, over 90% = risiko for overbelastning."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Onboarding tid (måneder)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.onboardingMonths}
                    onChange={(e) => updateField('onboardingMonths', e.target.value)}
                    min="1" max="12"
                    title="Hvor lang tid går der før en ny medarbejder er fuldt produktiv? Nye folk starter typisk på 30% og når 95% over denne periode. Typisk 2-4 mdr for simple roller, 4-6 mdr for komplekse."
                  />
                </div>
              </div>
            </div>
            
            <div className="wizard-info">
              <div className="wizard-info-title">📊 Ansættelsesgrænse</div>
              Når kapacitetsudnyttelsen overstiger denne grænse, begynder virksomheden at ansætte.
              Typisk 80-85% for de fleste virksomheder.
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="wizard-content">
            <div className="wizard-section">
              <div className="wizard-section-title">
                <span>💰</span> Økonomi & Fakturering
              </div>
              <div className="wizard-grid">
                <div className="wizard-field">
                  <label className="wizard-label">Timepris (DKK)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.billingRate}
                    onChange={(e) => updateField('billingRate', e.target.value)}
                    min="100" max="2000"
                    title="Hvad fakturerer I pr. time til kunden? Dette er jeres eksterne timepris ekskl. moms. Typisk 400-600 for tekniker-service, 700-1200 for konsulenter, 1000-2000 for specialister."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Fakturerbare timer/dag</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.hoursPerDay}
                    onChange={(e) => updateField('hoursPerDay', e.target.value)}
                    min="4" max="10" step="0.1"
                    title="Hvor mange timer pr. dag kan faktureres til kunder i gennemsnit? Resten går til kørsel, admin, pauser. Typisk 5-6 timer for field service (pga. kørsel), 6-7.5 for konsulenter."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Overhead (%)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.overheadFactor}
                    onChange={(e) => updateField('overheadFactor', e.target.value)}
                    min="10" max="100"
                    title="Tillæg til lønomkostninger for pension, feriepenge, forsikring, bil, udstyr, kontor, IT osv. 35-45% er normalt. Beregning: Total omkostning = Løn × (1 + overhead%)."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">DSO (dage)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.dso}
                    onChange={(e) => updateField('dso', e.target.value)}
                    min="0" max="90"
                    title="Days Sales Outstanding — gennemsnitligt antal dage fra I sender faktura til kunden betaler. Påvirker likviditet. Typisk 30-45 dage for B2B. Under 30 = god betalingsdisciplin, over 60 = likviditetsrisiko."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Startkasse (DKK)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.startCash}
                    onChange={(e) => updateField('startCash', e.target.value)}
                    min="0"
                    title="Hvor meget har I på kontoen i dag? Bruges til at beregne runway (hvor længe I kan overleve). Anbefalet: Mindst 3-6 måneders driftsomkostninger. Eksempel: 2.000.000 for lille firma, 10.000.000 for mellemstort."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Faste omkostninger/md (DKK)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.fixedCosts}
                    onChange={(e) => updateField('fixedCosts', e.target.value)}
                    min="0"
                    title="Månedlige faste udgifter udover løn: husleje, forsikringer, abonnementer, leasingydelser, revisor, IT osv. Typisk 50.000-200.000 for SMV. Ekskluder variable omkostninger som materialer."
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="wizard-content">
            <div className="wizard-section">
              <div className="wizard-section-title">
                <span>📊</span> Pipeline & Salg
              </div>
              <div className="wizard-grid">
                <div className="wizard-field">
                  <label className="wizard-label">Start-pipeline (DKK)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.startPipeline}
                    onChange={(e) => updateField('startPipeline', e.target.value)}
                    min="0"
                    title="Total værdi af alle aktive salgsmuligheder i jeres CRM/pipeline lige nu. Altså summen af tilbud I har ude + leads I arbejder på. Typisk 2-6× jeres årsomsætning for vækstfirmaer."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Ny pipeline/md (DKK)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.newLeadsMonth}
                    onChange={(e) => updateField('newLeadsMonth', e.target.value)}
                    min="0"
                    title="Hvor meget nyt salgsarbejde kommer ind pr. måned? Summen af nye leads/tilbudsanmodninger. Typisk 10-30% af pipeline pr. måned. Eksempel: Med 8 mio. pipeline → 800.000-2.400.000/md."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Win Rate (%)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.winRate}
                    onChange={(e) => updateField('winRate', e.target.value)}
                    min="1" max="100"
                    title="Hvor stor del af jeres tilbud vinder I? Beregn: Vundne ordrer ÷ Total tilbud afgivet. Typisk 20-35% for B2B service. Under 15% = svag konvertering, over 40% = stærk position eller for lave priser."
                  />
                </div>
                <div className="wizard-field">
                  <label className="wizard-label">Churn Rate (% årlig)</label>
                  <input 
                    type="number" 
                    className="wizard-input" 
                    value={wizardData.churnRate}
                    onChange={(e) => updateField('churnRate', e.target.value)}
                    min="0" max="50"
                    title="Hvor mange procent af kunderne mister I på et år? Beregn: Tabte kunder ÷ Total kunder × 100. Typisk 5-15% for B2B service. Under 5% = loyal kundebase, over 20% = alarmerende kundetab."
                  />
                </div>
              </div>
            </div>
            
            <div className="wizard-info">
              <div className="wizard-info-title">📈 Book-to-Bill</div>
              Din pipeline velocity / omsætning = Book-to-Bill. Over 1.0 = voksende ordrebog.
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="wizard-content">
            <div className="wizard-section">
              <div className="wizard-section-title">
                <span>🆕</span> Nye Features (valgfrit)
              </div>
              <div className="wizard-checkbox-group">
                <div 
                  className={`wizard-checkbox ${wizardData.enableABM ? 'checked' : ''}`}
                  onClick={() => updateField('enableABM', !wizardData.enableABM)}
                  title="Agent-Based Modeling: Simulerer hver tekniker som individuel agent med egne skills, sygdom og turnover. Giver mere realistisk kapacitet end gennemsnitsberegning. Anbefales for detaljeret ressourceanalyse."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableABM ? '✓' : ''}</div>
                  <span>👷 ABM Tekniker-agenter</span>
                </div>
                <div 
                  className={`wizard-checkbox ${wizardData.enableDiscreteQueue ? 'checked' : ''}`}
                  onClick={() => updateField('enableDiscreteQueue', !wizardData.enableDiscreteQueue)}
                  title="Diskret Event Simulation: Simulerer en opgavekø med prioriteter, SLA-deadlines og eskalering. Viser hvor flaskehalse opstår. Anbefales hvis I har mange samtidige opgaver."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableDiscreteQueue ? '✓' : ''}</div>
                  <span>📋 Diskret Event-kø</span>
                </div>
                <div 
                  className={`wizard-checkbox ${wizardData.enableExtendedParams ? 'checked' : ''}`}
                  onClick={() => updateField('enableExtendedParams', !wizardData.enableExtendedParams)}
                  title="Aktiverer ekstra parametre: rejsetid, materialeomkostninger, underentreprenører, bilomkostninger. Giver mere præcis omkostningsberegning. Anbefales for field service med høje transportomkostninger."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableExtendedParams ? '✓' : ''}</div>
                  <span>🔧 Udvidede parametre</span>
                </div>
                <div 
                  className={`wizard-checkbox ${wizardData.enableMLForecast ? 'checked' : ''}`}
                  onClick={() => updateField('enableMLForecast', !wizardData.enableMLForecast)}
                  title="Holt-Winters ML-prognose: Statistisk forecasting med niveau, trend og sæsonkomponenter. Viser forventet udvikling baseret på mønstre i data. Anbefales for langsigtet planlægning."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableMLForecast ? '✓' : ''}</div>
                  <span>📈 ML-forecast</span>
                </div>
              </div>
            </div>
            
            <div className="wizard-section">
              <div className="wizard-section-title">
                <span>📊</span> Matematiske Modeller
              </div>
              <div className="wizard-checkbox-group">
                <div 
                  className={`wizard-checkbox ${wizardData.enableRegimeSwitching ? 'checked' : ''}`}
                  onClick={() => updateField('enableRegimeSwitching', !wizardData.enableRegimeSwitching)}
                  title="Markov-kæde der skifter mellem VÆKST, STABIL og RECESSION. Simulerer at markedsforhold ændrer sig over tid. Anbefalet TIL — giver realistiske konjunkturudsving."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableRegimeSwitching ? '✓' : ''}</div>
                  <span>Regime Switching</span>
                </div>
                <div 
                  className={`wizard-checkbox ${wizardData.enableJumpDiffusion ? 'checked' : ''}`}
                  onClick={() => updateField('enableJumpDiffusion', !wizardData.enableJumpDiffusion)}
                  title="Merton-model: Simulerer pludselige store hændelser som tab af storkunde eller stor ny kontrakt. Anbefalet TIL — viser worst-case scenarier mere realistisk."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableJumpDiffusion ? '✓' : ''}</div>
                  <span>Jump Diffusion</span>
                </div>
                <div 
                  className={`wizard-checkbox ${wizardData.enableCorrelatedShocks ? 'checked' : ''}`}
                  onClick={() => updateField('enableCorrelatedShocks', !wizardData.enableCorrelatedShocks)}
                  title="Cholesky-korrelation: Når pipeline falder, stiger churn typisk også. Dette kobler variablerne realistisk. Anbefalet TIL — giver mere sammenhængende simuleringer."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableCorrelatedShocks ? '✓' : ''}</div>
                  <span>Korrelerede Shocks</span>
                </div>
                <div 
                  className={`wizard-checkbox ${wizardData.enableFatTails ? 'checked' : ''}`}
                  onClick={() => updateField('enableFatTails', !wizardData.enableFatTails)}
                  title="Student-t fordeling i stedet for normalfordeling. Giver flere ekstreme hændelser (sorte svaner). Anbefalet TIL — virkeligheden har flere ekstremer end normalfordelingen."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableFatTails ? '✓' : ''}</div>
                  <span>Fat Tails</span>
                </div>
                <div 
                  className={`wizard-checkbox ${wizardData.enableSeasonality ? 'checked' : ''}`}
                  onClick={() => updateField('enableSeasonality', !wizardData.enableSeasonality)}
                  title="Månedlige sæsonfaktorer: Høj aktivitet sept-nov, lav jan-feb. Anbefalet TIL hvis jeres branche har sæsonudsving. FRA hvis I har jævn efterspørgsel hele året."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableSeasonality ? '✓' : ''}</div>
                  <span>Sæsonudsving</span>
                </div>
                <div 
                  className={`wizard-checkbox ${wizardData.enableLearningCurve ? 'checked' : ''}`}
                  onClick={() => updateField('enableLearningCurve', !wizardData.enableLearningCurve)}
                  title="Nye medarbejdere starter på 30% produktivitet og når 95% over onboarding-perioden via S-kurve. Anbefalet TIL — vigtig for realistisk kapacitetsplanlægning ved vækst."
                >
                  <div className="wizard-checkbox-icon">{wizardData.enableLearningCurve ? '✓' : ''}</div>
                  <span>Læringskurve</span>
                </div>
              </div>
            </div>
            
            <div className="wizard-info">
              <div className="wizard-info-title">💡 Anbefaling</div>
              Hold de 6 matematiske modeller TIL for mest realistiske resultater. 
              De nye features (ABM, kø, ML) er valgfrie og kræver mere regnekraft.
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="wizard-content">
            <div className="wizard-section">
              <div className="wizard-section-title">
                <span>✓</span> Bekræft dine indstillinger
              </div>
              <div className="wizard-summary">
                <div className="wizard-summary-row" title="Dit firmanavn vises i topbaren. Kan ændres senere.">
                  <span className="wizard-summary-label">Virksomhed</span>
                  <span className="wizard-summary-value">{wizardData.companyName || 'Ikke angivet'}</span>
                </div>
                <div className="wizard-summary-row" title="Den valgte branche bestemmer standardværdier for timepris, løn og overhead.">
                  <span className="wizard-summary-label">Branche</span>
                  <span className="wizard-summary-value">{INDUSTRY_PRESETS[wizardData.industry]?.name}</span>
                </div>
                <div className="wizard-summary-row" title="Antal fuldtidsansatte teknikere/konsulenter ved simuleringsstart.">
                  <span className="wizard-summary-label">Teknikere</span>
                  <span className="wizard-summary-value">{wizardData.startHeads} medarbejdere</span>
                </div>
                <div className="wizard-summary-row" title="Ekstern timepris til kunder ekskl. moms. Bruges til beregning af omsætning.">
                  <span className="wizard-summary-label">Timepris</span>
                  <span className="wizard-summary-value">{wizardData.billingRate} DKK/time</span>
                </div>
                <div className="wizard-summary-row" title="Likviditet ved start. Bruges til at beregne runway og risiko.">
                  <span className="wizard-summary-label">Startkasse</span>
                  <span className="wizard-summary-value">{(wizardData.startCash / 1000000).toFixed(1)} mio. DKK</span>
                </div>
                <div className="wizard-summary-row" title="Total værdi af salgsmuligheder i pipeline. Ganges med win rate for at estimere ordreindgang.">
                  <span className="wizard-summary-label">Pipeline</span>
                  <span className="wizard-summary-value">{(wizardData.startPipeline / 1000000).toFixed(1)} mio. DKK</span>
                </div>
                <div className="wizard-summary-row" title="Andel af tilbud der konverteres til ordrer. Påvirker direkte omsætningsprognosen.">
                  <span className="wizard-summary-label">Win Rate</span>
                  <span className="wizard-summary-value">{wizardData.winRate}%</span>
                </div>
                <div className="wizard-summary-row" title="Andel af kunder der churner (forlader jer) årligt. Påvirker langsigtet omsætning.">
                  <span className="wizard-summary-label">Churn Rate</span>
                  <span className="wizard-summary-value">{wizardData.churnRate}% årlig</span>
                </div>
                <div className="wizard-summary-row" title="Antal aktive matematiske modeller der påvirker simuleringen.">
                  <span className="wizard-summary-label">Aktive modeller</span>
                  <span className="wizard-summary-value">
                    {[
                      wizardData.enableRegimeSwitching,
                      wizardData.enableJumpDiffusion,
                      wizardData.enableCorrelatedShocks,
                      wizardData.enableFatTails,
                      wizardData.enableSeasonality,
                      wizardData.enableLearningCurve,
                      wizardData.enableABM,
                      wizardData.enableDiscreteQueue,
                      wizardData.enableMLForecast,
                    ].filter(Boolean).length} af 9
                  </span>
                </div>
              </div>
            </div>
            
            <div className="wizard-info">
              <div className="wizard-info-title">💾 Data gemmes lokalt</div>
              Dine indstillinger gemmes i browseren, så de huskes næste gang du besøger simulatoren.
              Du kan altid genstarte guiden fra ⚙️ Guide knappen i topmenuen.
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="wizard-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="wizard-modal">
        <div className="wizard-header">
          <div>
            <div className="wizard-header-title">🚀 Kom godt i gang</div>
            <div className="wizard-header-sub">Konfigurer din simulator på 2 minutter</div>
          </div>
          <button className="wizard-close" onClick={onClose}>×</button>
        </div>
        
        <div className="wizard-progress">
          {WIZARD_STEPS.map((s) => (
            <div 
              key={s.id} 
              className={`wizard-step ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}
            >
              <div className="wizard-step-dot">
                {step > s.id ? '✓' : s.id}
              </div>
              <div className="wizard-step-label">{s.label}</div>
            </div>
          ))}
        </div>
        
        {renderStep()}
        
        <div className="wizard-footer">
          <button className="wizard-btn wizard-btn-skip" onClick={onClose}>
            Spring over
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            {step > 1 && (
              <button className="wizard-btn wizard-btn-back" onClick={handleBack}>
                ← Tilbage
              </button>
            )}
            {step < 6 ? (
              <button className="wizard-btn wizard-btn-next" onClick={handleNext}>
                Næste →
              </button>
            ) : (
              <button className="wizard-btn wizard-btn-finish" onClick={handleFinish}>
                ✓ Anvend & Start
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SCENARIOS ──────────────────────────────────────────────────────── */
const SCENARIOS = {
  pessimistic: {
    name: 'PESSIMISTISK',
    cfg: {
      startHeads: 18, hireThreshold: 82, billingRate: 420, hoursPerDay: 7.0,
      salaryPerHead: 46000, overheadFactor: 0.42, dso: 55, winRate: 0.18,
      newLeadsMonth: 1200000, churnRate: 0.08, startCash: 2000000, startPipeline: 6000000,
      qualityDecayPct: 0.8, seasonalityEnabled: true, overtimeMultiplier: 1.5,
    }
  },
  base: {
    name: 'BASIS',
    cfg: {
      startHeads: 18, hireThreshold: 82, billingRate: 480, hoursPerDay: 7.4,
      salaryPerHead: 42000, overheadFactor: 0.38, dso: 38, winRate: 0.28,
      newLeadsMonth: 1800000, churnRate: 0.04, startCash: 2800000, startPipeline: 8500000,
      qualityDecayPct: 0.6, seasonalityEnabled: true, overtimeMultiplier: 1.5,
    }
  },
  optimistic: {
    name: 'OPTIMISTISK',
    cfg: {
      startHeads: 18, hireThreshold: 82, billingRate: 540, hoursPerDay: 7.8,
      salaryPerHead: 40000, overheadFactor: 0.35, dso: 28, winRate: 0.38,
      newLeadsMonth: 2500000, churnRate: 0.02, startCash: 4000000, startPipeline: 12000000,
      qualityDecayPct: 0.4, seasonalityEnabled: true, overtimeMultiplier: 1.5,
    }
  },
};

/* ─── URL STATE ──────────────────────────────────────────────────────── */
function parseURLConfig() {
  const params = new URLSearchParams(window.location.search);
  const cfg = { ...SCENARIOS.base.cfg };
  params.forEach((v, k) => {
    if (k in cfg) {
      cfg[k] = k === 'seasonalityEnabled' ? v === 'true' : +v;
    }
  });
  return cfg;
}

/* ─── DEFAULT MODEL TOGGLES ───────────────────────────────────────────── */
const DEFAULT_TOGGLES = {
  // New features
  abmEnabled: false,           // Agent-Based Modeling
  discreteQueueEnabled: false, // Discrete Event Queue
  extendedParamsEnabled: false,// Extended Parameters
  mlForecastEnabled: false,    // ML Forecast (Holt-Winters)
  // Existing models
  regimeSwitchingEnabled: true,
  jumpDiffusionEnabled: true,
  correlatedShocksEnabled: true,
  fatTailsEnabled: true,
  seasonalityEnabled: true,
  learningCurveEnabled: true,
  erlangCEnabled: true,
  bgNBDEnabled: true,
  survivalAnalysisEnabled: true,
};

/* ─── EXTENDED PARAMETERS DEFAULTS ─────────────────────────────────────── */
const EXTENDED_PARAMS_DEFAULTS = {
  travelTimeHours: 1.5,        // Gennemsnit rejsetid pr opgave
  materialsCostPct: 0.12,      // Materialer som % af fakturering
  subcontractorPct: 0.08,      // Andel opgaver til underentreprenør
  subcontractorMarkup: 0.15,   // Markup på underentreprenør
  sicknessRate: 0.03,          // Sygefravær rate
  trainingDaysYear: 5,         // Uddannelsesdage pr år
  vehicleCostMonth: 4500,      // Bilomkostning pr tekniker/mdr
  toolsCostMonth: 800,         // Værktøj/udstyr pr tekniker/mdr
  insurancePct: 0.02,          // Forsikring som % af omsætning
  adminOverheadPct: 0.05,      // Administration overhead
  firstTimeFixRate: 0.82,      // First-time-fix rate
  avgJobDuration: 2.5,         // Gennemsnit opgavevarighed timer
  urgentJobPct: 0.15,          // % akutte opgaver (højere prioritet)
  slaBreachPenalty: 5000,      // Straf for SLA-brud i kr
  customerSatisfaction: 4.2,   // Baseline kundetilfredshed (1-5)
};

/* ─── MAIN APP ────────────────────────────────────────────────────────── */
export default function App() {
  // Check for saved config on initial load
  const savedData = loadFromLocalStorage();
  const hasSeenWizard = savedData !== null;
  
  const [cfg, setCfg] = useState(() => {
    if (savedData?.cfg) {
      return { ...parseURLConfig(), ...savedData.cfg };
    }
    return parseURLConfig();
  });
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [now, setNow] = useState(new Date());
  const [activeScenario, setActiveScenario] = useState('base');
  const [tooltip, setTooltip] = useState(null);
  const [mode, setMode] = useState('executive'); // 'executive' or 'analyst'
  const [recommendations, setRecommendations] = useState([]);
  const [beforeResult, setBeforeResult] = useState(null);
  const [beforeCfg, setBeforeCfg] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [advancedMetrics, setAdvancedMetrics] = useState(null);
  
  // Wizard state
  const [showWizard, setShowWizard] = useState(!hasSeenWizard);
  const [companyName, setCompanyName] = useState(savedData?.companyName || '');
  
  // Model toggles
  const [toggles, setToggles] = useState(() => {
    if (savedData?.toggles) {
      return { ...DEFAULT_TOGGLES, ...savedData.toggles };
    }
    return DEFAULT_TOGGLES;
  });
  const toggle = useCallback((k) => setToggles(t => ({ ...t, [k]: !t[k] })), []);
  
  // Extended parameters
  const [extParams, setExtParams] = useState(EXTENDED_PARAMS_DEFAULTS);
  const setExt = useCallback((k, v) => setExtParams(p => ({ ...p, [k]: v })), []);
  
  // ABM state (simulated technicians)
  const [abmAgents, setAbmAgents] = useState([]);
  
  // Event queue state
  const [eventQueue, setEventQueue] = useState([]);
  
  // ML forecast state
  const [forecast, setForecast] = useState(null);
  
  const set = useCallback((k, v) => setCfg(c => ({ ...c, [k]: v })), []);

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => { handleRun(); }, []);

  const handleRun = useCallback(() => {
    setRunning(true);
    setProgress(0);
    const steps = [10, 25, 45, 65, 85, 100];
    let si = 0;
    const iv = setInterval(() => {
      setProgress(steps[si]);
      si++;
      if (si >= steps.length) clearInterval(iv);
    }, 120);
    
    const compute = () => {
      const r = runMC(cfg, 1000, 36, toggles, extParams);
      setResult(r);
      setRecommendations(generateRecommendations(cfg, r));
      setAdvancedMetrics(calculateAdvancedMetrics(cfg, r));
      
      // ABM agents snapshot (if enabled)
      if (toggles.abmEnabled) {
        setAbmAgents(initializeAgents(cfg.startHeads, extParams));
      }
      
      // ML Forecast (if enabled)
      if (toggles.mlForecastEnabled && r?.series?.revenue) {
        const revenueHistory = r.series.revenue.map(m => m.p50);
        const revForecast = holtWinters(revenueHistory, 12, 0.3, 0.1, 0.2, 12);
        setForecast(calculateForecastMetrics(revenueHistory, revForecast));
      } else {
        setForecast(null);
      }
      
      // Event queue snapshot (if enabled)
      if (toggles.discreteQueueEnabled) {
        const jobsPerMonth = Math.round((cfg.startHeads * cfg.hoursPerDay * 22) / extParams.avgJobDuration);
        setEventQueue(generateJobQueue(Math.min(jobsPerMonth, 20), extParams).slice(0, 8));
      }
      
      setRunning(false);
      setProgress(100);
    };
    
    if ('requestIdleCallback' in window) {
      requestIdleCallback(compute, { timeout: 1500 });
    } else {
      setTimeout(compute, 50);
    }
  }, [cfg, toggles, extParams]);

  const handleScenario = (key) => {
    setActiveScenario(key);
    setCfg(SCENARIOS[key].cfg);
    setShowComparison(false);
    setBeforeResult(null);
  };

  const handleApplyRecommendations = useCallback(() => {
    if (!result) return;
    
    // Store "before" state
    setBeforeCfg({ ...cfg });
    setBeforeResult(result);
    
    // Generate optimal config
    const optimalCfg = generateOptimalConfig(cfg, result);
    setCfg(optimalCfg);
    
    // Run simulation with new config
    setRunning(true);
    setProgress(0);
    const steps = [15, 35, 55, 75, 90, 100];
    let si = 0;
    const iv = setInterval(() => {
      setProgress(steps[si]);
      si++;
      if (si >= steps.length) clearInterval(iv);
    }, 100);
    
    setTimeout(() => {
      const newResult = runMC(optimalCfg, 300, 36, toggles, extParams);
      setResult(newResult);
      setRecommendations(generateRecommendations(optimalCfg, newResult));
      setAdvancedMetrics(calculateAdvancedMetrics(optimalCfg, newResult));
      setRunning(false);
      setProgress(100);
      setShowComparison(true);
    }, 100);
  }, [cfg, result, toggles, extParams]);

  const handleCloseComparison = () => {
    setShowComparison(false);
    setBeforeResult(null);
    setBeforeCfg(null);
  };

  const handleRevert = () => {
    if (beforeCfg && beforeResult) {
      setCfg(beforeCfg);
      setResult(beforeResult);
      setRecommendations(generateRecommendations(beforeCfg, beforeResult));
      setAdvancedMetrics(calculateAdvancedMetrics(beforeCfg, beforeResult));
      setShowComparison(false);
      setBeforeResult(null);
      setBeforeCfg(null);
    }
  };

  const s = result?.series;
  const regimeNames = ['VÆKST', 'STABIL', 'RECESSION'];
  const regimeColors = ['growth', 'stable', 'recession'];

  const p50Rev = s ? s.revenue[11].p50 : 0;
  const p50Cash = s ? s.cash[35].p50 : 0;
  const p10Cash = s ? s.cash[35].p10 : 0;
  const p50Runway = s ? s.runway[35].p10 : 0;
  const p50Util = s ? s.utilization[17].p50 : 0;
  const p50Heads = s ? s.headcount[35].p50 : 0;
  const p50BtB = s ? s.bookToBill[11].p50 : 0;
  const npv = s ? s.npv : { p10: 0, p50: 0, p90: 0 };

  const alarmRunway = p50Runway < 3;
  const warnUtil = p50Util > 90;
  const warnBtB = p50BtB < 0.9;
  const hiringActive = p50Util > cfg.hireThreshold;
  const cashConstraint = p10Cash < cfg.salaryPerHead * 3;
  const qualityRisk = p50Util > 92;

  const INPUTS = [
    {
      section: "PERSONALE", fields: [
        { k: 'startHeads', label: 'Teknikere (start)', min: 3, max: 150, step: 1, fmt: v => `${v} stk` },
        { k: 'hireThreshold', label: 'Ansæt ved udnyttelse >', min: 60, max: 95, step: 1, fmt: v => `${v}%` },
        { k: 'billingRate', label: 'Faktureringstakst', min: 200, max: 1200, step: 25, fmt: v => `${v} kr/t` },
        { k: 'hoursPerDay', label: 'Fakturerbare t/dag', min: 4, max: 9, step: 0.2, fmt: v => `${v.toFixed(1)}t` },
      ]
    },
    {
      section: "ØKONOMI", fields: [
        { k: 'salaryPerHead', label: 'Lønomkostning/mdr', min: 25000, max: 90000, step: 1000, fmt: v => fmtDKK(v) },
        { k: 'overheadFactor', label: 'Overhead-faktor', min: 0.15, max: 0.7, step: 0.01, fmt: v => `${(v * 100).toFixed(0)}%` },
        { k: 'dso', label: 'DSO (betalingsdage)', min: 14, max: 90, step: 1, fmt: v => `${v} dage` },
        { k: 'startCash', label: 'Startkasse', min: 500000, max: 20000000, step: 100000, fmt: v => fmtDKK(v) },
      ]
    },
    {
      section: "PIPELINE", fields: [
        { k: 'winRate', label: 'Win rate', min: 0.05, max: 0.7, step: 0.01, fmt: v => `${(v * 100).toFixed(0)}%` },
        { k: 'newLeadsMonth', label: 'Ny pipeline/mdr', min: 200000, max: 15000000, step: 100000, fmt: v => fmtDKK(v) },
        { k: 'startPipeline', label: 'Pipeline (start)', min: 500000, max: 50000000, step: 500000, fmt: v => fmtDKK(v) },
        { k: 'churnRate', label: 'Medarbejder-churn/år', min: 0.01, max: 0.3, step: 0.01, fmt: v => `${(v * 100).toFixed(0)}%` },
      ]
    },
  ];

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="root">

        {/* TOP BAR */}
        {/* WIZARD MODAL */}
        <WizardModal 
          isOpen={showWizard}
          onClose={() => setShowWizard(false)}
          onComplete={(newCfg, newToggles, wizData) => {
            setCfg(c => ({ ...c, ...newCfg }));
            setToggles(t => ({ ...t, ...newToggles }));
            setCompanyName(wizData.companyName || '');
            setTimeout(() => handleRun(), 100);
          }}
          initialCfg={cfg}
        />

        <div className="topbar">
          <div className="topbar-brand">
            {companyName ? `${companyName} · Sim v2` : 'FieldService · Enterprise Sim v2'}
          </div>
          <button 
            className="topbar-wizard-btn" 
            onClick={() => setShowWizard(true)}
            title="Åbn opsætningsguiden for at konfigurere simulatoren"
          >
            ⚙️ Guide
          </button>
          <div className="topbar-sep" />
          
          {/* MODE TOGGLE */}
          <div className="mode-toggle" title="Skift mellem visningsmode">
            <button 
              className={`mode-btn ${mode === 'executive' ? 'active' : ''}`}
              onClick={() => setMode('executive')}
              title="Forenklet visning med KPI'er, grafer og AI-anbefalinger"
            >
              EXECUTIVE
            </button>
            <button 
              className={`mode-btn ${mode === 'analyst' ? 'active' : ''}`}
              onClick={() => setMode('analyst')}
              title="Fuld adgang til alle parametre, toggles, histogrammer og detaljer"
            >
              ANALYST
            </button>
          </div>
          
          <div className="topbar-sep" />
          <div className="ticker">
            {s && [
              { label: 'NPV P50', val: fmtDKK(npv.p50), up: npv.p50 > 0, tip: 'Nutidsværdi af 36 mdr cashflow (8% diskontering)' },
              { label: 'RUNWAY P10', val: `${p50Runway.toFixed(1)} mdr`, up: !alarmRunway, tip: 'Antal måneder kassen rækker (worst case)' },
              { label: 'RISIKO', val: `${(result?.bankruptcyRisk || 0).toFixed(1)}%`, up: (result?.bankruptcyRisk || 0) < 5, tip: 'Konkursrisiko baseret på 1000 simuleringer' },
            ].map((t, i) => (
              <div key={i} className="tick-item" title={t.tip}>
                {t.label}: <span className={`tick-val ${t.up ? 'tick-up' : 'tick-dn'}`}>{t.val}</span>
              </div>
            ))}
          </div>
          <div className="topbar-right">
            <div className="scenario-btns">
              {Object.entries(SCENARIOS).map(([key, sc]) => (
                <button 
                  key={key} 
                  className={`scenario-btn ${activeScenario === key ? 'active' : ''}`}
                  onClick={() => handleScenario(key)}
                  title={
                    key === 'pessimistic' ? 'Worst-case scenario: Lav win rate, høj churn, lav takst' :
                    key === 'base' ? 'Baseline scenario: Realistiske gennemsnitsværdier' :
                    'Best-case scenario: Høj win rate, lav churn, høj takst'
                  }
                >
                  {sc.name}
                </button>
              ))}
            </div>
            <div className="topbar-sep" />
            <span>N=1000 · {now.toLocaleTimeString('da-DK')}</span>
          </div>
        </div>

        {/* STATUS BAR */}
        <div className="statusbar">
          <div className={`status-chip ${alarmRunway ? 'alarm' : 'ok'}`} title="Runway = antal måneder kassen rækker ved nuværende burn rate">
            <div className="status-dot" />RUNWAY {alarmRunway ? 'KRITISK' : 'OK'}
          </div>
          <div className={`status-chip ${warnUtil ? 'warn' : 'ok'}`} title="Kapacitetsudnyttelse — over 85% = overbelastet">
            <div className="status-dot" />KAPACITET {warnUtil ? 'PRESSET' : 'SUND'}
          </div>
          <div className={`status-chip purple`} title="Dominerende markedsregime i simuleringen (Markov-kæde)">
            <div className="status-dot" />REGIME: {result ? regimeNames[result.dominantRegime] : 'STABIL'}
          </div>
          <div className={`status-chip ${(result?.bankruptcyRisk || 0) > 5 ? 'alarm' : 'ok'}`} title="Sandsynlighed for negativ kasse inden 36 måneder">
            <div className="status-dot" />KONKURSRISIKO {(result?.bankruptcyRisk || 0).toFixed(1)}%
          </div>
          {running && <div className="status-chip warn"><div className="status-dot" />BEREGNER... {Math.round(progress)}%</div>}
        </div>

        {/* LAYOUT */}
        <div className="layout">

          {/* SIDEBAR */}
          <div className="sidebar">
            {/* Model Quality Badge */}
            <div className="sb-section">
              <div className="model-badge">
                <div className="model-badge-title">
                  {Object.values(toggles).filter(Boolean).length + 4} MATEMATISKE MODELLER
                </div>
                <div className="model-features">
                  <div className="model-feature">Monte Carlo (N=1000)</div>
                  {toggles.erlangCEnabled && <div className="model-feature">Erlang-C (køteori)</div>}
                  {toggles.bgNBDEnabled && <div className="model-feature">BG/NBD (CLV)</div>}
                  {toggles.survivalAnalysisEnabled && <div className="model-feature">Survival Analysis</div>}
                  {toggles.jumpDiffusionEnabled && <div className="model-feature">Jump Diffusion</div>}
                  {toggles.regimeSwitchingEnabled && <div className="model-feature">Regime Switching</div>}
                  {toggles.correlatedShocksEnabled && <div className="model-feature">Korrelerede Shocks</div>}
                  {toggles.fatTailsEnabled && <div className="model-feature">AR(1) + Fat Tails</div>}
                  {toggles.abmEnabled && <div className="model-feature" style={{color:'var(--amber)'}}>ABM Agenter ✨</div>}
                  {toggles.discreteQueueEnabled && <div className="model-feature" style={{color:'var(--blue)'}}>Diskret Event-kø ✨</div>}
                  {toggles.mlForecastEnabled && <div className="model-feature" style={{color:'var(--cyan)'}}>Holt-Winters ML ✨</div>}
                </div>
                <div className="model-note">Institutionel kvalitet · Operations Research</div>
              </div>
            </div>

            {mode === 'analyst' && INPUTS.map(section => (
              <div key={section.section} className="sb-section">
                <div className="sb-title">{section.section}</div>
                {section.fields.map(f => (
                  <div key={f.k} className="input-row">
                    <div className="input-label">
                      {f.label}
                      {TOOLTIPS[f.k] && <HelpIcon {...TOOLTIPS[f.k]} position="right" />}
                      <span className="input-val">{f.fmt(cfg[f.k])}</span>
                    </div>
                    <input type="range" className="slider"
                      min={f.min} max={f.max} step={f.step}
                      value={cfg[f.k]}
                      onChange={e => set(f.k, +e.target.value)}
                      title={TOOLTIPS[f.k]?.content || ''}
                    />
                  </div>
                ))}
              </div>
            ))}

            {mode === 'analyst' && (
              <div className="sb-section">
                <div className="sb-title">
                  FEEDBACK LOOPS (6)
                  <HelpIcon 
                    title="Feedback Loops" 
                    content="Systemdynamiske tilbagekoblingsloops der forstærker eller modvirker hinanden. Fyldt diamant = aktivt loop." 
                    position="right" 
                  />
                </div>
                <div className="loop-grid">
                  {[
                    { label: 'Ansættelses-loop', active: hiringActive, danger: false, tip: 'Høj udnyttelse → ansættelse → lavere udnyttelse. Balancerende loop.' },
                    { label: 'Læringskurve', active: true, danger: false, tip: 'Nye ansatte starter med 30% produktivitet, når 95% efter 6 mdr.' },
                    { label: 'Kvalitetsdegenerering', active: qualityRisk, danger: true, tip: 'Over 90% udnyttelse → flere fejl → utilfredse kunder → churn.' },
                    { label: 'Kasse-begrænsning', active: cashConstraint, danger: true, tip: 'Lav kasse → kan ikke ansætte → overbelastning → tab af kunder.' },
                    { label: 'Rygte-effekt', active: qualityRisk, danger: true, tip: 'Dårlig kvalitet → negative anmeldelser → færre nye kunder.' },
                    { label: 'Regime-kobling', active: true, danger: false, tip: 'Markovrégimer (vækst/stabil/recession) påvirker alle variabler.' },
                  ].map((l, i) => (
                    <div key={i} className={`loop-item ${l.active ? (l.danger ? 'danger' : 'triggered') : ''}`} title={l.tip}>
                      <span className="loop-arrow">{l.active ? '◆' : '◇'}</span>
                      <div>{l.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Toggles */}
            <div className="sb-section">
              <div className="sb-title">⚙️ MODEL-KONFIGURATION</div>
              <div className="toggle-grid">
                <div className="toggle-category">NYE FEATURES</div>
                {[
                  { k: 'abmEnabled', label: 'ABM Tekniker-agenter', icon: '👷' },
                  { k: 'discreteQueueEnabled', label: 'Diskret Event-kø', icon: '📋' },
                  { k: 'extendedParamsEnabled', label: 'Udvidede parametre', icon: '🔧' },
                  { k: 'mlForecastEnabled', label: 'ML-forecast (Holt-Winters)', icon: '📈' },
                ].map(t => (
                  <div key={t.k} className="toggle-row">
                    <div className="toggle-label">
                      <span className="toggle-icon">{t.icon}</span>
                      {t.label}
                      {TOOLTIPS[t.k] && <HelpIcon {...TOOLTIPS[t.k]} position="left" />}
                    </div>
                    <div 
                      className={`toggle-switch ${toggles[t.k] ? 'on' : ''}`}
                      onClick={() => toggle(t.k)}
                      title={TOOLTIPS[t.k]?.content || ''}
                    />
                  </div>
                ))}
                
                <div className="toggle-category">EKSISTERENDE MODELLER</div>
                {[
                  { k: 'regimeSwitchingEnabled', label: 'Regime Switching', icon: '📊' },
                  { k: 'jumpDiffusionEnabled', label: 'Jump Diffusion', icon: '⚡' },
                  { k: 'correlatedShocksEnabled', label: 'Korrelerede Shocks', icon: '🔗' },
                  { k: 'fatTailsEnabled', label: 'Fat Tails', icon: '📉' },
                  { k: 'seasonalityEnabled', label: 'Sæsonudsving', icon: '🗓️' },
                  { k: 'learningCurveEnabled', label: 'Læringskurve', icon: '📚' },
                ].map(t => (
                  <div key={t.k} className="toggle-row">
                    <div className="toggle-label">
                      <span className="toggle-icon">{t.icon}</span>
                      {t.label}
                      {TOOLTIPS[t.k] && <HelpIcon {...TOOLTIPS[t.k]} position="left" />}
                    </div>
                    <div 
                      className={`toggle-switch ${toggles[t.k] ? 'on' : ''}`}
                      onClick={() => toggle(t.k)}
                      title={TOOLTIPS[t.k]?.content || ''}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Extended Parameters (shown when enabled) */}
            {toggles.extendedParamsEnabled && (
              <div className="sb-section">
                <div className="sb-title">🔧 UDVIDEDE PARAMETRE</div>
                {[
                  { k: 'travelTimeHours', label: 'Rejsetid pr opgave', min: 0.5, max: 4, step: 0.1, fmt: v => `${v.toFixed(1)}t` },
                  { k: 'materialsCostPct', label: 'Materialer %', min: 0, max: 0.3, step: 0.01, fmt: v => `${(v*100).toFixed(0)}%` },
                  { k: 'subcontractorPct', label: 'Underentreprenør %', min: 0, max: 0.3, step: 0.01, fmt: v => `${(v*100).toFixed(0)}%` },
                  { k: 'sicknessRate', label: 'Sygefravær', min: 0, max: 0.1, step: 0.005, fmt: v => `${(v*100).toFixed(1)}%` },
                  { k: 'vehicleCostMonth', label: 'Bilomkostning/mdr', min: 2000, max: 8000, step: 500, fmt: fmtDKK },
                  { k: 'urgentJobPct', label: 'Akutte opgaver %', min: 0.05, max: 0.4, step: 0.01, fmt: v => `${(v*100).toFixed(0)}%` },
                  { k: 'slaBreachPenalty', label: 'SLA-brud straf', min: 1000, max: 20000, step: 1000, fmt: fmtDKK },
                ].map(f => (
                  <div key={f.k} className="input-row">
                    <div className="input-label">
                      {f.label}
                      {TOOLTIPS[f.k] && <HelpIcon {...TOOLTIPS[f.k]} position="right" />}
                      <span className="input-val">{f.fmt(extParams[f.k])}</span>
                    </div>
                    <input type="range" className="slider"
                      min={f.min} max={f.max} step={f.step}
                      value={extParams[f.k]}
                      onChange={e => setExt(f.k, +e.target.value)}
                      title={TOOLTIPS[f.k]?.content || ''}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Run Button */}
            <div style={{ padding: '0.75rem' }}>
              <div className="progress-wrap" style={{ marginBottom: '0.5rem' }}>
                <div className="progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <button className="run-btn" onClick={handleRun} disabled={running}>
                {running ? '⬛ BEREGNER...' : '▶ KØR SIMULERING'}
              </button>
              <div className="export-row">
                <button className="export-btn" onClick={() => exportCSV(result, cfg)} disabled={!result}>CSV</button>
                <button className="export-btn" onClick={() => copyShareURL(cfg)}>DEL URL</button>
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="main">

            {/* COMPARISON PANEL - Shows before/after */}
            {showComparison && beforeResult && (
              <div className="comparison-panel animated">
                <div className="comparison-header">
                  <div className="comparison-title">
                    <span>✓</span> FORSLAG ANVENDT — SE FORBEDRINGEN
                    <HelpIcon 
                      title="Før/efter sammenligning" 
                      content="Viser effekten af AI-anbefalingerne ved at sammenligne KPI'er før og efter ændringerne er anvendt." 
                      position="left" 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="comparison-close" onClick={handleRevert} title="Gå tilbage til de oprindelige indstillinger">↩ FORTRYD</button>
                    <button className="comparison-close" onClick={handleCloseComparison} title="Luk sammenligning og behold de nye indstillinger">✕ LUK</button>
                  </div>
                </div>
                <div className="comparison-grid">
                  <div className="comparison-col before">
                    <div className="comparison-col-title">⚠ FØR</div>
                    <div className="comparison-metric" title="Nutidsværdi før optimering">
                      <span className="comparison-metric-label">NPV P50</span>
                      <span className={`comparison-metric-val ${beforeResult.series.npv.p50 > 0 ? 'neutral' : 'bad'}`}>
                        {fmtDKK(beforeResult.series.npv.p50)}
                      </span>
                    </div>
                    <div className="comparison-metric" title="Runway i måneder før optimering">
                      <span className="comparison-metric-label">Runway P10</span>
                      <span className={`comparison-metric-val ${beforeResult.series.runway[35].p10 < 6 ? 'bad' : 'neutral'}`}>
                        {beforeResult.series.runway[35].p10.toFixed(1)} mdr
                      </span>
                    </div>
                    <div className="comparison-metric" title="Konkursrisiko før optimering">
                      <span className="comparison-metric-label">Konkursrisiko</span>
                      <span className={`comparison-metric-val ${beforeResult.bankruptcyRisk > 5 ? 'bad' : 'neutral'}`}>
                        {beforeResult.bankruptcyRisk.toFixed(1)}%
                      </span>
                    </div>
                    <div className="comparison-metric" title="Kapacitetsudnyttelse før optimering">
                      <span className="comparison-metric-label">Udnyttelse</span>
                      <span className={`comparison-metric-val ${beforeResult.series.utilization[17].p50 > 90 ? 'bad' : 'neutral'}`}>
                        {beforeResult.series.utilization[17].p50.toFixed(0)}%
                      </span>
                    </div>
                    <div className="comparison-metric" title="Antal teknikere før optimering">
                      <span className="comparison-metric-label">Teknikere</span>
                      <span className="comparison-metric-val neutral">{beforeCfg?.startHeads}</span>
                    </div>
                  </div>
                  
                  <div className="comparison-arrow">
                    <span>→</span>
                    <span className="comparison-arrow-text">OPTIMERET</span>
                  </div>
                  
                  <div className="comparison-col after">
                    <div className="comparison-col-title">✓ EFTER</div>
                    <div className="comparison-metric">
                      <span className="comparison-metric-label">NPV P50</span>
                      <span className={`comparison-metric-val ${result.series.npv.p50 > beforeResult.series.npv.p50 ? 'good' : 'neutral'}`}>
                        {fmtDKK(result.series.npv.p50)}
                        {result.series.npv.p50 > beforeResult.series.npv.p50 && 
                          <span style={{ fontSize: '9px', marginLeft: '4px' }}>
                            (+{fmtDKK(result.series.npv.p50 - beforeResult.series.npv.p50)})
                          </span>
                        }
                      </span>
                    </div>
                    <div className="comparison-metric">
                      <span className="comparison-metric-label">Runway P10</span>
                      <span className={`comparison-metric-val ${result.series.runway[35].p10 > beforeResult.series.runway[35].p10 ? 'good' : 'neutral'}`}>
                        {result.series.runway[35].p10.toFixed(1)} mdr
                        {result.series.runway[35].p10 > beforeResult.series.runway[35].p10 && 
                          <span style={{ fontSize: '9px', marginLeft: '4px' }}>
                            (+{(result.series.runway[35].p10 - beforeResult.series.runway[35].p10).toFixed(1)})
                          </span>
                        }
                      </span>
                    </div>
                    <div className="comparison-metric">
                      <span className="comparison-metric-label">Konkursrisiko</span>
                      <span className={`comparison-metric-val ${result.bankruptcyRisk < beforeResult.bankruptcyRisk ? 'good' : 'neutral'}`}>
                        {result.bankruptcyRisk.toFixed(1)}%
                        {result.bankruptcyRisk < beforeResult.bankruptcyRisk && 
                          <span style={{ fontSize: '9px', marginLeft: '4px' }}>
                            ({(result.bankruptcyRisk - beforeResult.bankruptcyRisk).toFixed(1)}%)
                          </span>
                        }
                      </span>
                    </div>
                    <div className="comparison-metric">
                      <span className="comparison-metric-label">Udnyttelse</span>
                      <span className={`comparison-metric-val ${result.series.utilization[17].p50 < beforeResult.series.utilization[17].p50 ? 'good' : 'neutral'}`}>
                        {result.series.utilization[17].p50.toFixed(0)}%
                      </span>
                    </div>
                    <div className="comparison-metric">
                      <span className="comparison-metric-label">Teknikere</span>
                      <span className={`comparison-metric-val ${cfg.startHeads > beforeCfg?.startHeads ? 'good' : 'neutral'}`}>
                        {cfg.startHeads}
                        {cfg.startHeads > beforeCfg?.startHeads && 
                          <span style={{ fontSize: '9px', marginLeft: '4px' }}>
                            (+{cfg.startHeads - beforeCfg.startHeads})
                          </span>
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="comparison-summary">
                  <div className="comparison-summary-title">🎯 RESULTAT AF OPTIMERING</div>
                  <div className="comparison-summary-text">
                    NPV forbedret med {fmtDKK(result.series.npv.p50 - beforeResult.series.npv.p50)} · 
                    Konkursrisiko reduceret med {(beforeResult.bankruptcyRisk - result.bankruptcyRisk).toFixed(1)} procentpoint · 
                    {cfg.startHeads - beforeCfg?.startHeads > 0 ? `${cfg.startHeads - beforeCfg.startHeads} nye teknikere` : 'Samme bemanding'}
                  </div>
                </div>
              </div>
            )}

            {/* AI RECOMMENDATIONS */}
            {recommendations.length > 0 && !showComparison && (
              <div className="ai-panel animated">
                <div className="ai-header">
                  <span className="ai-icon">🤖</span>
                  <span className="ai-title">
                    AI Anbefalinger
                    <HelpIcon 
                      title="AI-drevne anbefalinger" 
                      content="Automatisk genererede forslag baseret på Monte Carlo resultater. Analyserer kasse, udnyttelse, pipeline og risiko for at identificere optimeringsmuligheder." 
                      position="left" 
                    />
                  </span>
                  <span className="ai-subtitle">Baseret på {result?.N || 300} Monte Carlo simuleringer</span>
                </div>
                <div className="ai-grid">
                  {recommendations.map((rec, i) => (
                    <div key={i} className="ai-rec" title={rec.impact}>
                      <div className={`ai-rec-priority ${rec.priority}`} title={
                        rec.priority === 'high' ? 'Høj prioritet — kritisk for virksomhedens overlevelse' :
                        rec.priority === 'medium' ? 'Medium prioritet — væsentlig forbedring' :
                        'Lav prioritet — nice-to-have optimering'
                      }>
                        {rec.priority.toUpperCase()}
                      </div>
                      <div className="ai-rec-action">{rec.action}</div>
                      <div className="ai-rec-impact">{rec.impact}</div>
                      <div className="ai-rec-metrics">
                        {rec.metrics.map((m, j) => (
                          <div key={j} className="ai-metric" title={`Forventet ${m.positive ? 'forbedring' : 'påvirkning'}: ${m.value}`}>
                            <span className="ai-metric-label">{m.label}</span>
                            <span className={`ai-metric-val ${m.positive ? 'up' : 'dn'}`}>{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* GREEN APPLY BUTTON */}
                <button 
                  className="apply-btn" 
                  onClick={handleApplyRecommendations}
                  disabled={running || recommendations.length === 0}
                  title="Anvend alle AI-anbefalinger og kør ny simulering for at se forbedringen"
                >
                  <span style={{ fontSize: '16px' }}>✓</span>
                  ANVEND AI FORSLAG — SE FORBEDRING
                </button>
                
                {result?.bankruptcyRisk > 5 && (
                  <div className="ai-risk" style={{ marginTop: '0.75rem' }}>
                    <div className="ai-risk-title">⚠ KRITISK RISIKO IDENTIFICERET</div>
                    <div className="ai-risk-text">
                      Din konkursrisiko er {result.bankruptcyRisk.toFixed(1)}%. 
                      Tryk på knappen ovenfor for at se hvordan AI-anbefalingerne forbedrer situationen.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ABM AGENTS PANEL */}
            {toggles.abmEnabled && abmAgents.length > 0 && (
              <div className="abm-panel animated">
                <div className="ai-header">
                  <span className="ai-icon">👷</span>
                  <span className="ai-title" style={{ color: 'var(--amber)' }}>
                    ABM Tekniker-agenter
                    <HelpIcon 
                      title="Agent-Based Modeling" 
                      content="Hver tekniker simuleres som individuel agent med skills, tenure, sygdom og træning. Giver mere realistisk kapacitetsberegning end simple gennemsnit." 
                      position="left" 
                    />
                  </span>
                  <span className="ai-subtitle">{abmAgents.length} agenter simuleret</span>
                </div>
                <div className="abm-grid" style={{ marginTop: '0.5rem' }}>
                  {abmAgents.slice(0, 12).map((agent, i) => (
                    <div 
                      key={i} 
                      className={`abm-agent ${agent.sick ? 'sick' : agent.training ? 'training' : agent.skill === 'senior' || agent.skill === 'expert' ? 'senior' : ''}`}
                      title={`${agent.name}: ${agent.skill} med ${(agent.productivity * 100).toFixed(0)}% produktivitet, ${agent.tenure} mdr. anciennitet${agent.sick ? ' — SYGEMELDT' : agent.training ? ' — PÅ TRÆNING' : ''}`}
                    >
                      <div className="abm-agent-icon">
                        {agent.sick ? '🤒' : agent.training ? '📚' : agent.skill === 'expert' ? '⭐' : agent.skill === 'senior' ? '🔧' : '👷'}
                      </div>
                      <div className="abm-agent-name">{agent.name}</div>
                      <div className="abm-agent-status">
                        {agent.sick ? 'Syg' : agent.training ? 'Træning' : `${agent.skill} · ${(agent.productivity * 100).toFixed(0)}%`}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '9px', color: 'var(--text3)', display: 'flex', gap: '1rem' }}>
                  <span title="Nye teknikere med lav erfaring — kræver oplæring">👷 Junior/Mid: {abmAgents.filter(a => a.skill === 'junior' || a.skill === 'mid').length}</span>
                  <span title="Erfarne teknikere med høj produktivitet">🔧 Senior: {abmAgents.filter(a => a.skill === 'senior').length}</span>
                  <span title="Eksperter der kan håndtere komplekse opgaver">⭐ Expert: {abmAgents.filter(a => a.skill === 'expert').length}</span>
                  <span title="Midlertidigt utilgængelige pga. sygdom">🤒 Syge: {abmAgents.filter(a => a.sick).length}</span>
                </div>
              </div>
            )}

            {/* DISCRETE EVENT QUEUE PANEL */}
            {toggles.discreteQueueEnabled && eventQueue.length > 0 && (
              <div className="queue-panel animated">
                <div className="ai-header">
                  <span className="ai-icon">📋</span>
                  <span className="ai-title" style={{ color: 'var(--blue)' }}>
                    Opgavekø — Diskret Event Simulation
                    <HelpIcon 
                      title="Discrete Event Queue" 
                      content="Simulerer en kø af opgaver med prioriteter (kritisk, høj, normal), SLA-deadlines og eskaleringsregler. Viser flaskehalse og SLA-brud." 
                      position="left" 
                    />
                  </span>
                  <span className="ai-subtitle">{eventQueue.length} opgaver i kø</span>
                </div>
                <div className="queue-list" style={{ marginTop: '0.5rem' }}>
                  {eventQueue.map((job, i) => (
                    <div key={i} className={`queue-item ${job.priority}`} title={`${job.type}: ${job.duration.toFixed(1)} timer, SLA ${job.slaHours}t${job.slaBreach ? ' — OVERSKREDET!' : ''}`}>
                      <span className={`queue-priority ${job.priority}`} title={
                        job.priority === 'critical' ? 'Kritisk prioritet — kræver øjeblikkelig handling' :
                        job.priority === 'high' ? 'Høj prioritet — skal løses hurtigst muligt' :
                        'Normal prioritet — standard SLA'
                      }>
                        {job.priority === 'critical' ? '🔴' : job.priority === 'high' ? '🟠' : '🟢'}
                      </span>
                      <span style={{ fontWeight: 600 }}>{job.type.toUpperCase()}</span>
                      <span style={{ color: 'var(--text3)' }} title="Estimeret varighed">~{job.duration.toFixed(1)}t</span>
                      <span className={`queue-sla ${job.slaBreach ? 'breach' : ''}`} title={job.slaBreach ? 'SLA overskredet — risiko for straf/kompensation' : 'Inden for SLA'}>
                        SLA: {job.slaHours}t {job.slaBreach && '⚠'}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '9px', color: 'var(--text3)', display: 'flex', gap: '1rem' }}>
                  <span title="Opgaver der kræver øjeblikkelig handling">🔴 Kritisk: {eventQueue.filter(j => j.priority === 'critical').length}</span>
                  <span title="Opgaver med høj prioritet">🟠 Høj: {eventQueue.filter(j => j.priority === 'high').length}</span>
                  <span title="Standard opgaver">🟢 Normal: {eventQueue.filter(j => j.priority === 'normal').length}</span>
                  <span title="Opgaver der har overskredet SLA">⚠ SLA-brud: {eventQueue.filter(j => j.slaBreach).length}</span>
                </div>
              </div>
            )}

            {/* ML FORECAST PANEL */}
            {toggles.mlForecastEnabled && forecast && (
              <div className="forecast-panel animated">
                <div className="ai-header">
                  <span className="ai-icon">📈</span>
                  <span className="ai-title" style={{ color: 'var(--cyan)' }}>
                    ML Forecast — Holt-Winters
                    <HelpIcon 
                      title="Holt-Winters Triple Exponential Smoothing" 
                      content="Statistisk model der dekomponerer tidsserier i niveau, trend og sæson. Bruges til 12-måneders prognose baseret på Monte Carlo historik."
                      formula="Yₜ₊ₕ = (Lₜ + h·Tₜ) × Sₜ₊ₕ₋ₘ"
                      position="left" 
                    />
                  </span>
                  <span className="ai-subtitle">12 måneders prognose</span>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <div className="forecast-row" title="Samlet trendretning baseret på niveau + trend komponenter">
                    <span className="forecast-label">Trend</span>
                    <span className={`forecast-trend ${forecast.trend}`}>
                      {forecast.trend === 'up' ? '↑' : '↓'} {forecast.changePercent}%
                    </span>
                  </div>
                  <div className="forecast-row" title="Point forecast for næste måned inkl. sæsonkorrektion">
                    <span className="forecast-label">Næste måned</span>
                    <span className="forecast-val">{fmtDKK(forecast.nextMonth)}</span>
                  </div>
                  <div className="forecast-row" title="Kumuleret forecast for de næste 3 måneder">
                    <span className="forecast-label">Næste 3 måneder</span>
                    <span className="forecast-val">{fmtDKK(forecast.next3Months)}</span>
                  </div>
                  <div className="forecast-row" title="Kumuleret forecast for de næste 6 måneder">
                    <span className="forecast-label">Næste 12 måneder</span>
                    <span className="forecast-val">{fmtDKK(forecast.next12Months)}</span>
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '8px', color: 'var(--text3)', fontStyle: 'italic' }}>
                  Holt-Winters triple exponential smoothing med niveau, trend og sæsonkomponenter
                </div>
              </div>
            )}

            {/* ALARMS */}
            {result?.alarms?.length > 0 && (
              <div className="alarm-panel animated">
                <div className="alarm-title">⚠ AKTIVE ALARMER</div>
                <div className="alarm-items">
                  {result.alarms.map((a, i) => (
                    <div key={i} className="alarm-item">▶ {a.msg}</div>
                  ))}
                </div>
              </div>
            )}

            {/* KPI PANELS */}
            {s && (
              <div className="panel-grid animated" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                <div className={`kpi-panel ${npv.p10 < 0 ? 'red' : 'purple'}`} title={TOOLTIPS.npv?.content}>
                  <div className="kpi-label">
                    NPV (8% DISC.)
                    <HelpIcon {...TOOLTIPS.npv} position="left" />
                  </div>
                  <div className={`kpi-p50 ${npv.p50 > 0 ? 'purple' : 'red'}`}>{fmtDKK(npv.p50)}</div>
                  <div className="kpi-band">P10: <span>{fmtDKK(npv.p10)}</span></div>
                  <div className={`kpi-delta ${npv.p10 > 0 ? 'delta-up' : 'delta-dn'}`}>
                    {npv.p10 > 0 ? '✓ POSITIV' : '⚠ RISIKO'}
                  </div>
                </div>
                <div className={`kpi-panel ${alarmRunway ? 'red' : 'green'}`} title={TOOLTIPS.runway?.content}>
                  <div className="kpi-label">
                    RUNWAY P10
                    <HelpIcon {...TOOLTIPS.runway} position="left" />
                  </div>
                  <div className={`kpi-p50 ${!alarmRunway ? 'green' : 'red'}`}>{p50Runway.toFixed(1)}<span className="kpi-unit">mdr</span></div>
                  <div className="kpi-band">Kasse: <span>{fmtDKK(p50Cash)}</span></div>
                  <div className={`kpi-delta ${!alarmRunway ? 'delta-up' : 'delta-dn'}`}>
                    {!alarmRunway ? '✓ SOLVENT' : '⚠ KRITISK'}
                  </div>
                </div>
                <div className={`kpi-panel ${(result?.bankruptcyRisk || 0) > 10 ? 'red' : 'green'}`} title={TOOLTIPS.bankruptcyRisk?.content}>
                  <div className="kpi-label">
                    KONKURSRISIKO
                    <HelpIcon {...TOOLTIPS.bankruptcyRisk} position="left" />
                  </div>
                  <div className={`kpi-p50 ${(result?.bankruptcyRisk || 0) < 5 ? 'green' : 'red'}`}>
                    {(result?.bankruptcyRisk || 0).toFixed(1)}<span className="kpi-unit">%</span>
                  </div>
                  <div className="kpi-band">Stress: <span>{(result?.severeStressRisk || 0).toFixed(1)}%</span></div>
                  <div className={`kpi-delta ${(result?.bankruptcyRisk || 0) < 5 ? 'delta-up' : 'delta-dn'}`}>
                    {(result?.bankruptcyRisk || 0) < 5 ? '✓ LAV RISIKO' : '⚠ HØJ RISIKO'}
                  </div>
                </div>
                <div className={`kpi-panel ${warnUtil ? 'red' : 'amber'}`} title={TOOLTIPS.utilization?.content}>
                  <div className="kpi-label">
                    UDNYTTELSE M18
                    <HelpIcon {...TOOLTIPS.utilization} position="left" />
                  </div>
                  <div className={`kpi-p50 ${warnUtil ? 'red' : 'amber'}`}>{p50Util.toFixed(0)}<span className="kpi-unit">%</span></div>
                  <div className="kpi-band">Heads: <span>{Math.round(p50Heads)}</span></div>
                  <div className={`kpi-delta ${!warnUtil ? 'delta-up' : 'delta-dn'}`}>
                    {warnUtil ? '⚠ OVERBELASTET' : '✓ BÆREDYGTIG'}
                  </div>
                </div>
                <div className={`kpi-panel ${warnBtB ? 'red' : 'blue'}`} title={TOOLTIPS.bookToBill?.content}>
                  <div className="kpi-label">
                    BOOK-TO-BILL
                    <HelpIcon {...TOOLTIPS.bookToBill} position="left" />
                  </div>
                  <div className={`kpi-p50 ${warnBtB ? 'red' : 'blue'}`}>{p50BtB.toFixed(2)}</div>
                  <div className="kpi-band">Rev/mdr: <span>{fmtDKK(p50Rev)}</span></div>
                  <div className={`kpi-delta ${p50BtB > 1 ? 'delta-up' : 'delta-dn'}`}>
                    {p50BtB > 1 ? '↑ VOKSER' : '↓ KRYMPER'}
                  </div>
                </div>
              </div>
            )}

            {/* MINI KPI ROW - Liquidity & Pipeline */}
            {advancedMetrics?.liquidity && advancedMetrics?.pipeline && advancedMetrics?.investor && (
              <MiniKPIRow metrics={advancedMetrics} />
            )}

            {/* SPEEDOMETER GAUGES */}
            {advancedMetrics?.liquidity && advancedMetrics?.pipeline && advancedMetrics?.investor && (
              <div className="speedometer-grid animated">
                <Speedometer 
                  value={advancedMetrics.liquidity.runway} 
                  min={0} 
                  max={24} 
                  label="RUNWAY"
                  unit="måneder"
                  target={12}
                  format="months"
                  status={advancedMetrics.liquidity.runway >= 12 ? 'good' : advancedMetrics.liquidity.runway >= 6 ? 'warn' : 'danger'}
                  tooltip={TOOLTIPS.runwayGauge}
                />
                <Speedometer 
                  value={advancedMetrics.liquidity.dso} 
                  min={0} 
                  max={60} 
                  label="DSO"
                  unit="dage"
                  target={30}
                  format="days"
                  status={advancedMetrics.liquidity.dso <= 30 ? 'good' : advancedMetrics.liquidity.dso <= 45 ? 'warn' : 'danger'}
                  tooltip={TOOLTIPS.dsoGauge}
                />
                <Speedometer 
                  value={advancedMetrics.serviceLevel.utilization} 
                  min={0} 
                  max={100} 
                  label="UTILIZATION"
                  unit="kapacitet"
                  target={80}
                  format="pct"
                  status={advancedMetrics.serviceLevel.utilization <= 85 ? 'good' : advancedMetrics.serviceLevel.utilization <= 95 ? 'warn' : 'danger'}
                  tooltip={TOOLTIPS.utilizationGauge}
                />
                <Speedometer 
                  value={advancedMetrics.pipeline.bookToBill} 
                  min={0} 
                  max={2} 
                  label="BOOK-TO-BILL"
                  unit="ratio"
                  target={1.1}
                  format="ratio"
                  status={advancedMetrics.pipeline.bookToBill >= 1.1 ? 'good' : advancedMetrics.pipeline.bookToBill >= 0.9 ? 'warn' : 'danger'}
                  tooltip={TOOLTIPS.bookToBillGauge}
                />
                <Speedometer 
                  value={advancedMetrics.investor.ltvCacRatio} 
                  min={0} 
                  max={6} 
                  label="LTV:CAC"
                  unit="ratio"
                  target={3}
                  format="ratio"
                  status={advancedMetrics.investor.ltvCacRatio >= 3 ? 'good' : advancedMetrics.investor.ltvCacRatio >= 2 ? 'warn' : 'danger'}
                  tooltip={TOOLTIPS.ltvCacGauge}
                />
                <Speedometer 
                  value={advancedMetrics.investor.nrr} 
                  min={50} 
                  max={150} 
                  label="NRR"
                  unit="retention"
                  target={110}
                  format="pct"
                  status={advancedMetrics.investor.nrr >= 110 ? 'good' : advancedMetrics.investor.nrr >= 100 ? 'warn' : 'danger'}
                  tooltip={TOOLTIPS.nrrGauge}
                />
              </div>
            )}

            {/* INVESTOR KPIs & WATERFALL */}
            {advancedMetrics?.investor && advancedMetrics?.waterfall && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <InvestorPanel metrics={advancedMetrics.investor} tooltips={TOOLTIPS} />
                <WaterfallChart data={advancedMetrics.waterfall} title="Cash Flow Waterfall (År 1)" />
              </div>
            )}

            {/* UTILIZATION HEATMAP */}
            {advancedMetrics?.utilHeatmap && advancedMetrics.utilHeatmap.length > 0 && (
              <UtilizationHeatmap data={advancedMetrics.utilHeatmap} title="📅 Kapacitetsudnyttelse pr. Måned" />
            )}

            {/* ONBOARDING & BULLWHIP PANELS */}
            <div className="row-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
              <OnboardingDelayPanel cfg={cfg} months={6} />
              <BullwhipIndicator result={result} cfg={cfg} />
            </div>

            {/* ADVANCED MATHEMATICAL MODELS */}
            {advancedMetrics && (
              <div className="models-panel animated" style={{ position: 'relative' }}>
                <div className="models-header">
                  <span className="models-icon">📐</span>
                  <span className="models-title">
                    Avancerede Modeller — Erlang-C · BG/NBD · Survival · Jump Diffusion
                    <HelpIcon 
                      title="Matematiske modeller" 
                      content="Fire avancerede modeller fra køteori, CLV-analyse, survival-analyse og finansiel matematik. Giver dybere indsigt i kapacitet, kundeværdi, churn og ekstreme hændelser." 
                      position="left" 
                    />
                  </span>
                </div>
                <div className="models-grid">
                  
                  {/* ERLANG-C: SERVICE LEVEL */}
                  <div className="model-card" title={TOOLTIPS.erlangC?.content}>
                    <div className="model-card-header">
                      <span className="model-card-title">
                        SERVICE LEVEL
                        <HelpIcon {...TOOLTIPS.erlangC} position="left" />
                      </span>
                      <span className="model-card-badge">ERLANG-C</span>
                    </div>
                    <div className={`model-card-value ${advancedMetrics.serviceLevel.serviceLevelPct >= 90 ? 'good' : advancedMetrics.serviceLevel.serviceLevelPct >= 70 ? 'warn' : 'danger'}`}>
                      {advancedMetrics.serviceLevel.serviceLevelPct.toFixed(0)}%
                    </div>
                    <div className="model-card-sub">af kunder betjenes inden 2 timer</div>
                    <div className="gauge-wrap">
                      <div 
                        className={`gauge-fill ${advancedMetrics.serviceLevel.serviceLevelPct >= 90 ? 'good' : 'warn'}`}
                        style={{ width: `${Math.min(100, advancedMetrics.serviceLevel.serviceLevelPct)}%` }}
                      />
                    </div>
                    <div className="model-card-detail">
                      <div className="model-card-row" title="Gennemsnitlig ventetid før en tekniker er tilgængelig">
                        <span>Gns. ventetid</span>
                        <span>{advancedMetrics.serviceLevel.avgWaitHours < 10 ? advancedMetrics.serviceLevel.avgWaitHours.toFixed(1) : '∞'} timer</span>
                      </div>
                      <div className="model-card-row" title="Hvor meget af kapaciteten der bruges (ρ i Erlang-C)">
                        <span>Kapacitetsudnyttelse</span>
                        <span>{advancedMetrics.serviceLevel.utilization.toFixed(0)}%</span>
                      </div>
                      {advancedMetrics.serviceLevel.additionalNeeded > 0 && (
                        <div className="model-card-row" style={{ color: 'var(--amber)' }} title="Antal ekstra teknikere for at nå 90% service level">
                          <span>Optimal bemanding</span>
                          <span>+{advancedMetrics.serviceLevel.additionalNeeded} teknikere</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* BG/NBD: CUSTOMER LIFETIME VALUE */}
                  <div className="model-card" title={TOOLTIPS.bgNBD?.content}>
                    <div className="model-card-header">
                      <span className="model-card-title">
                        KUNDEVÆRDI (CLV)
                        <HelpIcon {...TOOLTIPS.bgNBD} position="left" />
                      </span>
                      <span className="model-card-badge">BG/NBD</span>
                    </div>
                    <div className="model-card-value good">
                      {fmtDKK(advancedMetrics.clv.avgCLV)}
                    </div>
                    <div className="model-card-sub">gennemsnitlig 3-års kundeværdi</div>
                    <div className="clv-dist">
                      <div className="clv-segment high" title="Kunder med CLV over gennemsnit (top 20%)">
                        <div style={{ fontWeight: 700 }}>{advancedMetrics.clv.segments.high}</div>
                        <div>HØJ</div>
                      </div>
                      <div className="clv-segment med" title="Kunder med CLV omkring gennemsnit (60%)">
                        <div style={{ fontWeight: 700 }}>{advancedMetrics.clv.segments.medium}</div>
                        <div>MED</div>
                      </div>
                      <div className="clv-segment low" title="Kunder med lav CLV (bund 20%) — potentiel churn">
                        <div style={{ fontWeight: 700 }}>{advancedMetrics.clv.segments.low}</div>
                        <div>LAV</div>
                      </div>
                    </div>
                    <div className="model-card-detail">
                      <div className="model-card-row" title="Samlet forventet værdi fra alle kunder over 3 år">
                        <span>Total CLV (3 år)</span>
                        <span>{fmtDKK(advancedMetrics.clv.totalCLV)}</span>
                      </div>
                      <div className="model-card-row" style={{ color: 'var(--red)' }} title="Omsætning fra kunder med høj churn-sandsynlighed">
                        <span>Revenue i fare</span>
                        <span>{fmtDKK(advancedMetrics.clv.atRiskRevenue)}</span>
                      </div>
                      <div className="model-card-row" title="Antal kunder med over 60% sandsynlighed for churn">
                        <span>Høj-risiko kunder</span>
                        <span>{advancedMetrics.clv.highRiskCustomers} stk</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* SURVIVAL: HAZARD RATES */}
                  <div className="model-card" title={TOOLTIPS.survivalAnalysis?.content}>
                    <div className="model-card-header">
                      <span className="model-card-title">
                        CHURN TIMING
                        <HelpIcon {...TOOLTIPS.survivalAnalysis} position="left" />
                      </span>
                      <span className="model-card-badge">SURVIVAL</span>
                    </div>
                    <div className={`model-card-value ${advancedMetrics.survival.medianSurvival > 24 ? 'good' : advancedMetrics.survival.medianSurvival > 12 ? 'warn' : 'danger'}`}>
                      {advancedMetrics.survival.medianSurvival}
                      <span style={{ fontSize: '0.5em', marginLeft: '4px' }}>mdr</span>
                    </div>
                    <div className="model-card-sub">median kundelivstid</div>
                    <div className="hazard-curve">
                      {advancedMetrics.survival.hazardRates.map((h, i) => (
                        <div 
                          key={i}
                          className={`hazard-bar ${h.level}`}
                          style={{ height: `${Math.min(100, h.rate * 1000)}%` }}
                          title={`Måned ${h.month}: ${(h.rate * 100).toFixed(2)}% hazard`}
                        />
                      ))}
                    </div>
                    <div className="model-card-detail">
                      <div className="model-card-row">
                        <span>Overlever 12 mdr</span>
                        <span>{advancedMetrics.survival.p12Month.toFixed(0)}%</span>
                      </div>
                      <div className="model-card-row">
                        <span>Overlever 24 mdr</span>
                        <span>{advancedMetrics.survival.p24Month.toFixed(0)}%</span>
                      </div>
                      <div className="model-card-row" style={{ color: 'var(--red)' }}>
                        <span>Fornyelsesrisiko</span>
                        <span>Mdr 12, 24</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* JUMP DIFFUSION: EXTREME EVENTS */}
                  <div className="model-card" title={TOOLTIPS.jumpRisk?.content}>
                    <div className="model-card-header">
                      <span className="model-card-title">
                        EKSTREME EVENTS
                        <HelpIcon {...TOOLTIPS.jumpRisk} position="left" />
                      </span>
                      <span className="model-card-badge">MERTON</span>
                    </div>
                    <div className={`model-card-value ${advancedMetrics.extremeEvents.catastropheRisk < 10 ? 'good' : advancedMetrics.extremeEvents.catastropheRisk < 20 ? 'warn' : 'danger'}`}>
                      {advancedMetrics.extremeEvents.catastropheRisk.toFixed(0)}%
                    </div>
                    <div className="model-card-sub">risiko for &gt;30% revenue-drop</div>
                    <div className="gauge-wrap">
                      <div 
                        className={`gauge-fill ${advancedMetrics.extremeEvents.catastropheRisk < 10 ? 'good' : 'danger'}`}
                        style={{ width: `${Math.min(100, advancedMetrics.extremeEvents.catastropheRisk)}%` }}
                      />
                    </div>
                    <div className="model-card-detail">
                      <div className="model-card-row" title="5. percentil af værste månedlige fald i 1000 simuleringer">
                        <span>Worst-case P95</span>
                        <span>-{advancedMetrics.extremeEvents.worstDropP95.toFixed(0)}%</span>
                      </div>
                      <div className="model-card-row" title="Forventet antal Poisson-spring over 3 års periode">
                        <span>Forventede spring</span>
                        <span>{advancedMetrics.extremeEvents.expectedJumps.toFixed(1)}/3år</span>
                      </div>
                      <div className="model-card-row" title="Anbefalet kassebuffer for at overleve worst-case spring">
                        <span>Anbefalet buffer</span>
                        <span>{fmtDKK(advancedMetrics.extremeEvents.bufferNeeded)}</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            )}

            {/* CHARTS */}
            {s && (
              <>
                <div className="chart-row animated">
                  <div className="chart-panel" title={TOOLTIPS.cashChart?.content}>
                    <div className="chart-header">
                      <div className="chart-title">
                        KASSEBEHOLDNING — 36 MÅN
                        <HelpIcon {...TOOLTIPS.cashChart} position="left" />
                      </div>
                      <div className="chart-legend">
                        <div className="legend-item"><div className="legend-dot" style={{ background: '#059669' }} />P50 (median)</div>
                        <div className="legend-item"><div className="legend-dot" style={{ background: '#05966955' }} />P10-P90 (usikkerhed)</div>
                      </div>
                    </div>
                    <BandChart series={s} metricKey="cash" color={p50Cash > 0 ? '#059669' : '#dc2626'} fmt={fmtK} h={100} onHover={setTooltip} />
                    {tooltip && (
                      <div className="chart-tooltip" style={{ left: tooltip.x, top: tooltip.y - 60 }}>
                        <div className="tooltip-month">Måned {tooltip.month}</div>
                        <div className="tooltip-row"><span>P10 (worst):</span> <span className="tooltip-val">{fmtDKK(tooltip.p10)}</span></div>
                        <div className="tooltip-row"><span>P50 (median):</span> <span className="tooltip-val">{fmtDKK(tooltip.p50)}</span></div>
                        <div className="tooltip-row"><span>P90 (best):</span> <span className="tooltip-val">{fmtDKK(tooltip.p90)}</span></div>
                      </div>
                    )}
                  </div>
                  <div className="chart-panel" title={TOOLTIPS.utilizationChart?.content}>
                    <div className="chart-header">
                      <div className="chart-title">
                        UDNYTTELSE % — 36 MÅN
                        <HelpIcon {...TOOLTIPS.utilizationChart} position="left" />
                      </div>
                    </div>
                    <BandChart series={s} metricKey="utilization" color={warnUtil ? '#dc2626' : '#d97706'} fmt={v => `${v.toFixed(0)}%`} h={100} />
                  </div>
                </div>

                {mode === 'analyst' && (
                  <>
                    <div className="chart-row animated">
                      <div className="chart-panel" title={TOOLTIPS.revenueChart?.content}>
                        <div className="chart-header">
                          <div className="chart-title">
                            OMSÆTNING — 36 MÅN
                            <HelpIcon {...TOOLTIPS.revenueChart} position="left" />
                          </div>
                        </div>
                        <BandChart series={s} metricKey="revenue" color="#d97706" fmt={fmtK} h={100} />
                      </div>
                      <div className="chart-panel" title={TOOLTIPS.pipelineChart?.content}>
                        <div className="chart-header">
                          <div className="chart-title">
                            PIPELINE — 36 MÅN
                            <HelpIcon {...TOOLTIPS.pipelineChart} position="left" />
                          </div>
                        </div>
                        <BandChart series={s} metricKey="pipeline" color="#2563eb" fmt={fmtK} h={100} />
                      </div>
                    </div>

                    <div className="chart-row animated">
                      <div className="chart-panel" title="Histogram over slutkasse i måned 36. Viser fordelingen af alle 1000 simuleringer.">
                        <div className="chart-header">
                          <div className="chart-title">
                            KASSE M36 — FORDELING
                            <HelpIcon 
                              title="Histogram" 
                              content="Viser fordelingen af slutkasse i måned 36 på tværs af alle 300 Monte Carlo simuleringer. Bredere fordeling = mere usikkerhed." 
                              position="left" 
                            />
                          </div>
                        </div>
                        <Histogram data={s.cash[35].raw} bins={25} />
                      </div>
                      <div className="chart-panel" title="Histogram over runway i måned 36. Viser hvor mange måneder virksomheden kan overleve.">
                        <div className="chart-header">
                          <div className="chart-title">
                            RUNWAY M36 — FORDELING
                            <HelpIcon 
                              title="Runway fordeling" 
                              content="Fordeling af estimeret runway (måneder) ved måned 36. Viser sandsynligheden for forskellige overlevelsesscenarier." 
                              position="left" 
                            />
                          </div>
                        </div>
                        <Histogram data={s.runway[35].raw} bins={25} />
                      </div>
                    </div>
                  </>
                )}

                {/* Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border2)', marginBottom: 1 }}>
                  <div style={{ background: 'var(--bg2)', padding: '0.75rem' }} title="Samlet omsætning over 36 måneder baseret på P50 (median) af Monte Carlo simuleringerne">
                    <div className="chart-title" style={{ marginBottom: '0.6rem' }}>
                      3-ÅRS PROJEKTION
                      <HelpIcon 
                        title="3-års projektion" 
                        content="Kumuleret omsætning over 36 måneder baseret på P50 (median) af alle Monte Carlo simuleringer. NPV er nutidsværdi diskonteret med 8% p.a." 
                        position="left" 
                      />
                    </div>
                    <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--amber)', letterSpacing: '-0.04em' }}>
                      {fmtDKK(result.totalRevY3)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '0.3rem' }}>
                      Kumuleret omsætning P50 · NPV: {fmtDKK(npv.p50)}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg2)', padding: '0.75rem' }}>
                    <div className="chart-title" style={{ marginBottom: '0.6rem' }}>BOOK DEMO</div>
                    <div style={{ fontSize: '11px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '0.5rem' }}>
                      FieldService.dk · 4-8 ugers go-live · Fastpris<br />
                      NIS2-klar · 100% dansk ejet
                    </div>
                    <a href="https://fieldservice.dk" style={{ display: 'block', textAlign: 'center', padding: '0.6rem', background: 'var(--amber)', color: '#fff', fontWeight: 700, fontSize: '10px', letterSpacing: '0.15em', textDecoration: 'none', textTransform: 'uppercase' }} title="Kontakt FieldService.dk for en gratis arkitekturgennemgang">
                      ▶ BOOK ARKITEKTURMØDE
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="bottombar">
          <div className="bb-item">MODELLER: <span className="bb-val">MC + ERLANG-C + BG/NBD + SURVIVAL + MERTON</span></div>
          <div className="bb-item">N: <span className="bb-val">{result?.N || 300}</span></div>
          <div className="bb-item">MODE: <span className="bb-val">{mode.toUpperCase()}</span></div>
          <div className="bb-item" style={{ marginLeft: 'auto' }}>FIELDSERVICE.DK © 2026</div>
        </div>
      </div>
    </>
  );
}
