/* ==========================================================
   1. DATA — replace content / urls here without touching UI logic
   ========================================================== */
const ACCELERATORS = [
  {
    id:"applied-ai", category:"Applied AI", title:"AI Accelerators", shortName:"Applied AI",
    leafLine:"Turn AI potential into real-world impact.",
    description:"Ready-to-deploy AI solutions to automate workflows, unlock insights, and enhance customer and employee experiences.",
    color:{ base:"#7C4DFF", mid:"#B9A0FF", soft:"#F2EDFF", deep:"#5B2EE0" },
    icon:"brain", url:"https://digital.compunnel.com/accelerators/ai-cognitive-accelerators", ctaLabel:"Explore all AI Accelerators",
    subAccelerators:[
      { name:"InsightForge", tm:true, description:"Turn unstructured data into actionable insights.", icon:"insight",
        url:"https://digital.compunnel.com/accelerators/ai-cognitive-accelerators#accelerator-insightforge",
        media:{ src:"media/accelerators/insightforge.gif", alt:"InsightForge diagram: AI opportunities flow through discover, score, assess and prioritize into a 90-day action roadmap." } },
      { name:"SearchCore", tm:true, description:"AI-powered search for better discovery.", icon:"search",
        url:"https://digital.compunnel.com/accelerators/ai-cognitive-accelerators#accelerator-searchcore",
        media:{ src:"media/accelerators/searchcore.gif", alt:"SearchCore diagram: a user query searches documents, databases, knowledge and systems, then ranks and cites a source-linked answer." } },
      { name:"AgentWeave", tm:true, description:"Build and orchestrate AI agents.", icon:"agents",
        url:"https://digital.compunnel.com/accelerators/ai-cognitive-accelerators#accelerator-agentweave",
        media:{ src:"media/accelerators/agentweave.gif", alt:"AgentWeave diagram: business input moves through understand, reason, execute and optimize into faster, smarter action." } },
      { name:"DocuIntel", tm:true, description:"Intelligent document processing.", icon:"doc",
        url:"https://digital.compunnel.com/accelerators/ai-cognitive-accelerators#accelerator-docuintel",
        media:{ src:"media/accelerators/docuintel.gif", alt:"DocuIntel diagram: document input is extracted, understood, structured and indexed into searchable, AI-ready knowledge." } },
      { name:"ModelGuard", tm:true, description:"Responsible and safe AI adoption.", icon:"shield",
        url:"https://digital.compunnel.com/accelerators/ai-cognitive-accelerators#accelerator-modelguard",
        media:{ src:"media/accelerators/modelguard.gif", alt:"ModelGuard diagram: AI systems pass through monitor, validate, audit and govern into safe, compliant, auditable AI." } }
    ]
  },
  {
    id:"data-to-insight", category:"Data-to-Insight", title:"Data Accelerators", shortName:"Data-to-Insight",
    leafLine:"Modernize data. Unlock intelligence.",
    description:"Accelerators to modernize your data foundation and turn data into real-time, actionable intelligence.",
    color:{ base:"#2F7BF6", mid:"#98C0FF", soft:"#EAF2FF", deep:"#1D5CCF" },
    icon:"database", url:"https://digital.compunnel.com/accelerators/data-platform-accelerators", ctaLabel:"Explore all Data Accelerators",
    subAccelerators:[
      { name:"LakehouseIgnite", description:"Accelerate modern data platform setup.", icon:"layers", url:"#lakehouseignite", media:null },
      { name:"MeshForge",       description:"Enable distributed data mesh architectures.", icon:"mesh", url:"#meshforge", media:null },
      { name:"MetricStreamAI",  description:"Real-time analytics and predictive insights.", icon:"stream", url:"#metricstreamai", media:null },
      { name:"DataPulse",       description:"Data observability and quality at scale.", icon:"pulse", url:"#datapulse", media:null }
    ]
  },
  {
    id:"cloud-platform", category:"Cloud & Platform Engineering", title:"Cloud Accelerators", shortName:"Cloud & Platform",
    leafLine:"Secure, scalable platforms, faster.",
    description:"Accelerators to build secure, scalable and high-performing cloud-native platforms, faster.",
    color:{ base:"#16A36A", mid:"#8ADBB5", soft:"#E6F8EF", deep:"#0C7D50" },
    icon:"cloud", url:"https://digital.compunnel.com/accelerators/cloud-native-accelerators", ctaLabel:"Explore all Cloud Accelerators",
    subAccelerators:[
      { name:"CloudForge",    description:"Accelerate cloud landing zones and migration.", icon:"cloudUp", url:"#cloudforge", media:null },
      { name:"PlatformX",     description:"Pre-built platform engineering toolkit.", icon:"platform", url:"#platformx", media:null },
      { name:"ShieldCI",      description:"Secure CI/CD pipelines by design.", icon:"branch", url:"#shieldci", media:null },
      { name:"SecureLanding", description:"Compliance-ready cloud environments.", icon:"lock", url:"#securelanding", media:null },
      { name:"FinOpsVision",  description:"Optimize cloud costs with intelligence.", icon:"coin", url:"#finopsvision", media:null }
    ]
  },
  {
    id:"quality-engineering", category:"Quality Engineering", title:"Quality Accelerators", shortName:"Quality Eng.",
    leafLine:"Higher quality. Faster releases.",
    description:"AI-powered accelerators to automate testing, improve software quality, and accelerate release cycles.",
    color:{ base:"#F0891E", mid:"#FFC48A", soft:"#FFF2E4", deep:"#C2610A" },
    icon:"shieldCheck", url:"https://digital.compunnel.com/accelerators/quality-engineering-accelerators", ctaLabel:"Explore all Quality Accelerators",
    subAccelerators:[
      { name:"qualiCore",  description:"AI-driven test automation framework.", icon:"qcore", url:"#qualicore", media:null },
      { name:"qeForge",    description:"Accelerate QE setup and test lifecycle.", icon:"sliders", url:"#qeforge", media:null },
      { name:"pulseQE",    description:"Continuous quality insights and reporting.", icon:"bars", url:"#pulseqe", media:null },
      { name:"ModelGuard", description:"Validate and monitor AI/ML models.", icon:"shieldCheck", url:"#modelguard-qe", media:null }
    ]
  },
  {
    id:"customer-experience", category:"Customer Experience", title:"CX Accelerators", shortName:"Customer Exp.",
    leafLine:"Data-powered design decisions.",
    description:"Accelerators that turn research, analytics and testing into data-powered design decisions across every customer touchpoint.",
    color:{ base:"#E8615C", mid:"#F7B3AE", soft:"#FDEDEC", deep:"#BC372F" },
    icon:"cx", url:"https://digital.compunnel.com/solutions/total-experience", ctaLabel:"Explore all CX Accelerators",
    subAccelerators:[
      { name:"InstDiagnose", tm:true, description:"Identify experience gaps, usability issues, and opportunities for improvement.", icon:"diagnose",
        url:"https://digital.compunnel.com/solutions/total-experience", media:null },
      { name:"HeatWave", tm:true, description:"Reveal user attention patterns, engagement areas, and potential friction points.", icon:"heat",
        url:"https://digital.compunnel.com/solutions/total-experience", media:null },
      { name:"BestFit", tm:true, description:"Validate experience options to discover what performs better with your users.", icon:"split",
        url:"https://digital.compunnel.com/solutions/total-experience", media:null },
      { name:"HumanEye", tm:true, description:"Uncover design and usability opportunities through expert human evaluation.", icon:"eye",
        url:"https://digital.compunnel.com/solutions/total-experience", media:null }
    ]
  }
];

const VALUES = [
  { icon:"bolt",   label:"Faster|Time to Value" },
  { icon:"ring",   label:"Built on|Proven Expertise" },
  { icon:"upRight",label:"Scalable|Across Industries" },
  { icon:"target", label:"Measurable|Business Impact" }
];
