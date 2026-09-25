/* ==========================================================
   DELTAS TABLE — measurable before/after, rendered from data
   ========================================================== */
const DELTAS = [
  { buying:"Lakehouse stood up to first production platform", typical:"12 weeks", ours:"6 weeks",
    mech:[{ t:"LakehouseIgnite™", id:"data-to-insight" }], detail:"pre-built landing zone, ingestion patterns, governance-as-code" },
  { buying:"A new governed data product, live", typical:"8 weeks", ours:"4 weeks",
    mech:[{ t:"MeshForge™", id:"data-to-insight" }], detail:"domain data product templates and lifecycle workflows" },
  { buying:"Enterprise KPI and analytics enablement", typical:"10 weeks", ours:"5 weeks",
    mech:[{ t:"MetricStreamAI™", id:"data-to-insight" }], detail:"semantic layer with pre-built KPI contracts" },
  { buying:"Unreliable pipelines stabilized", typical:"6 weeks", ours:"3 weeks",
    mech:[{ t:"DataPulse™", id:"data-to-insight" }], detail:"observability, automated DQ checks, alerting playbooks" },
  { buying:"An answer out of your own document estate", typical:"2 hours", ours:"8 seconds",
    mech:[{ t:"SearchCore™", id:"applied-ai" }, { t:"DocuIntel™", id:"applied-ai" }], detail:"citation-grounded retrieval over enterprise content" },
  { buying:"A GenAI pilot reaching live production", typical:"Often never", ours:"6 weeks",
    mech:[{ t:"InsightForge™", id:"applied-ai" }, { t:"AI-OS™ 4A", id:"applied-ai" }], detail:"a production path designed in from day one" },
  { buying:"A standard P&C claim, end to end", typical:"14 days", ours:"4 hours",
    mech:[{ t:"AgentWeave™", id:"applied-ai" }], detail:"five coordinated agents, humans on complex losses only" },
  { buying:"Physician time lost to documentation", typical:"3.2 hrs/day", ours:"0.7 hrs/day",
    mech:[{ t:"Clinical copilot", id:"applied-ai" }, { t:"ModelGuard™", id:"applied-ai" }], detail:"ambient scribe, HIPAA-auditable output" },
  { buying:"Regression cycle time", typical:"Baseline", ours:"5× faster",
    mech:[{ t:"autom8IQ", id:"quality-engineering" }, { t:"qeForge", id:"quality-engineering" }], detail:"self-healing automation, elastic execution" },
  { buying:"Defect leakage at release", typical:">10%", ours:"<1%",
    mech:[{ t:"pulseQE", id:"quality-engineering" }, { t:"qualiCore", id:"quality-engineering" }], detail:"risk-based coverage, predictive defect detection" }
];

function renderDeltas(){
  const host = document.getElementById("deltaRows");
  if (!host) return;
  const tone = (id) => {
    const acc = ACCELERATORS.find(a => a.id === id);
    return acc ? acc.color.deep : "var(--navy)";
  };
  host.innerHTML = DELTAS.map(row=>{
    const mech = row.mech.map(m=>`<b style="color:${tone(m.id)}">${m.t}</b>`).join(" + ");
    return `
      <tr>
        <th scope="row">${row.buying}</th>
        <td data-label="Typical"><s>${row.typical}</s></td>
        <td data-label="With Compunnel"><span class="delta-ours">${row.ours}</span></td>
        <td data-label="The mechanism"><span class="delta-mech">${mech}</span> <span class="delta-detail">— ${row.detail}</span></td>
      </tr>`;
  }).join("");
}
