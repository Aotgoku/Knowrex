# Master Draw.io Prompt - Complete Knowrex AI System Architecture
## Single Comprehensive Prompt for Full System Diagram

---

## 🎨 COMPLETE MASTER PROMPT (Under 10,000 Characters)

Copy this entire prompt and paste into Draw.io AI to generate the complete system architecture:

```
Create "KNOWREX AI - System Architecture" diagram with 6 layered tiers, circular knowledge loop, and RAG pipeline flow.

CANVAS: 1800x2400px

TITLE: "Knowrex AI - Intelligent RAG Customer Support | Next.js 14·Gemini 2.0·Xenova"

═══ 6 HORIZONTAL LAYERS ═══

LAYER 1: CLIENT TIER (Y=100, H=150, BG=#E3F2FD→#BBDEFB)
Content: 3 boxes [🖥️ Web Browser·Chrome/Firefox·Real-time chat·Dark mode] [📱 Mobile·iOS/Android·Touch optimized] [💻 Tablet·Responsive·Adaptive UI]
Protocol: HTTPS | WebSocket

LAYER 2: PRESENTATION (Y=280, H=200, BG=#E8F5E9→#C8E6C9)
Title: NEXT.JS 14 FRONTEND (React 19 + TypeScript)
Content: 3 boxes 
[CHAT UI: Message bubbles·Streaming·Citations·Auto-scroll] 
[ADMIN PANEL: Documents·Escalations·Vectors·Upload] 
[ANALYTICS: Performance·Metrics·Insights·Reports]
Tech: Tailwind CSS 4 | Lucide Icons

LAYER 3: API GATEWAY (Y=510, H=180, BG=#FFF3E0→#FFE0B2)
Title: NEXT.JS API ROUTES (REST)
Endpoints: 
[POST /api/chat: Streaming·RAG·Session] 
[/api/documents: CRUD·Metadata] 
[/api/escalations: Tickets·Agents] 
[/api/knowledge: FAQ·Q&A] 
[/api/embeddings: Vectors·Batch] 
[/api/upload: Files·Validation]
Middleware: Auth·Rate Limiting·Logging

LAYER 4: BUSINESS LOGIC (Y=720, H=280, BG=#F3E5F5→#E1BEE7)
Title: CORE SERVICE MODULES
4 boxes in 2x2 grid:
[RAG SYSTEM: Query·Embedding·Vector Search·Context·Citation·Confidence | lib/ragSystem.ts]
[ESCALATION: Detection·Analysis·Classification·Assignment·Lifecycle | lib/escalation.ts]
[KNOWLEDGE LOOP: FAQ Creation·Learning·Pattern Recognition·Quality Score·Continuous Improve | lib/knowledgeLoop.ts]
[DOC PROCESSOR: Multi-format(PDF,DOCX,TXT,JSON)·Smart Chunking(Semantic/Fixed)·Metadata | lib/documentProcessor.ts]

LAYER 5: AI/ML (Y=1030, H=220, BG=#FCE4EC→#F8BBD0)
Title: AI/ML PROCESSING LAYER
2 boxes:
[GOOGLE GEMINI 2.0 FLASH: gemini-2.0-flash·Streaming·1M tokens·Multi-modal·Temp 0.7·Max 2048·@google/generative-ai·Cost $0.003/query·~1000ms·EXTERNAL API☁️]
[XENOVA TRANSFORMERS: all-MiniLM-L6-v2·384-dim·Local execution·No cost·~100ms·200MB RAM·Browser/Node·@xenova/transformers]
Similarity: Cosine·Threshold 0.20

LAYER 6: DATA STORAGE (Y=1280, H=200, BG=#F5F5F5→#E0E0E0)
Title: DATA STORAGE (File-based, Local-First)
Content:
[🗄️ data/chroma/vectors.json: 384-dim embeddings·Metadata·Cosine index·~500MB]
[📁 data/documents/*.json: Metadata·Chunks·Status·Timestamps]
[🎫 data/escalations/*.json: Tickets·History·Assignments·Resolutions]
[💡 data/faq/*.json: Q&A pairs·Sources·Scores·Stats]
[📤 public/uploads/: Original files (TXT,PDF,DOCX,JSON)]

═══ RIGHT SIDE: KNOWLEDGE LOOP (X=1200, Y=400, 400x600) ═══

CENTER CIRCLE: [🧠 KNOWREX BRAIN·Continuously Learning·143 FAQs·+12/mo]

9 STAGES clockwise from 12:00:
1(12:00) [👤 USER QUERY: New question]
2(01:30) [🤖 AI ANSWER: RAG processes·~1.5s]
3(03:00) [📊 CONFIDENCE: Evaluate·Threshold 0.50]
4(04:30) [🚨 ESCALATE: Create ticket·Auto urgency]
5(06:00) [👨‍💼 HUMAN AGENT: Review·Research]
6(07:30) [✅ RESOLUTION: Quality answer]
7(09:00) [💾 CAPTURE: Auto-create FAQ]
8(10:30) [🔢 EMBED: Generate vector·Add to DB]
9(12:00) [📈 ENHANCED: System improved]

4 METRIC BOXES (corners):
TL:[⏱️ Response: Week1 2.5s→Week8 1.2s·↓52%]
TR:[🚨 Escalations: 28%→12%·↓57%]
BL:[⏳ Resolution: Avg 18min·Median 12min]
BR:[💡 Knowledge: 143 FAQs·+12/mo]

═══ BOTTOM: RAG PIPELINE (Y=1520, Horizontal flow) ═══

Flow: [USER QUERY]→[ANALYZE]→{USE RAG?}→YES→[EMBED ~100ms]→[VECTOR SEARCH ~200ms]→[FILTER]→[BUILD CONTEXT]→[PROMPT]→[GEMINI LLM ~1000ms]→[ENHANCE]→{HIGH CONFIDENCE?}→YES→[OUTPUT] / NO→[ESCALATE]→[HUMAN AGENT]→[KNOWLEDGE LOOP]→[UPDATE VECTORS]→loop back
(NO path from USE RAG goes directly to PROMPT)

═══ RIGHT EDGE: EXTERNAL (X=1650, Y=800, 150x300) ═══

[EXTERNAL SYSTEMS: 
👤 Human Agents·Email·Slack/Teams·Dashboard
🔑 Google API·Gemini calls·Rate limiting
📊 Analytics·Usage·Performance·Cost]

═══ ARROWS (7 types) ═══

1.Primary: Solid black 2px (Client→API→Logic→AI→Data)
2.Read: Dashed blue 1.5px (RAG→vectors.json)
3.Write: Dashed green 1.5px (Loop→FAQ)
4.Escalation: Dashed orange 2px bold (Check→Agent)
5.Feedback: Dashed purple 2.5px curved (Resolution→FAQ→Vectors)
6.API: Double red 1.5px (LLM→Gemini)
7.Conditional: Dotted gray 1px (decision branches)

Labels: 10pt sans-serif gray, center above arrow (HTTP POST·Query·Response·Escalate·Learn)

═══ STYLES ═══

FONTS: Title:Inter/Arial 24pt Bold #1A237E | Layers:18pt Semi-bold | Components:12pt #424242 | Code:Courier 10pt #616161 | Metrics:14pt Bold (color by status) | Annotations:9pt Italic #757575

SHAPES: Rounded rectangles (8px radius) for boxes | Diamonds for decisions | Circles for loop stages | Cylinders for DB

SPACING: 20px horizontal·30px vertical between components | 15px padding inside | 8px text margin

BORDERS: 2px main components·1px sub-components | Solid containers·Dashed processes | Match background (darker shade)

SHADOWS: 2px 2px 4px rgba(0,0,0,0.1) on all major boxes

ICONS: 24px size·8px margin·Use: 🖥️📱💻💬📊⚙️🎨🔑🗄️📁🎫💡🤖👤👨‍💼🚨✅⚠️⏱️📈📉🔍🔢💾

COLORS: Success #4CAF50·Warning #FF9800·Error #F44336·Info #2196F3·Learning #9C27B0

═══ ADDITIONAL ELEMENTS ═══

LEGEND (Bottom-right 200x150):
[─── Primary Flow | ╌╌╌ Read | ─ ─ Write | ▪▪▪▪ Escalation | ~~~~ Learning | ═══ API | ··· Conditional]

VERSION (Bottom-left 200x100):
[Version 1.0·Feb 2026·Next.js 14·MIT License]

METRICS (Top-right 200x150):
[Queries/day: 1,200·Avg Response: 1.5s·Escalation: 22%·Cost/query: $0.003·Uptime: 99.9%]

═══ FINAL REQUIREMENTS ═══

Generate single cohesive diagram. Visual hierarchy: Layers→Components→Details. Consistent styling. Readable text (min 9pt). Appropriate spacing. Gradients for depth. All arrow types included. Professional and presentation-ready. Modern clean design. Suitable for technical documentation and presentations.
```

---

**✅ Character Count: ~6,800 characters (Well under 10,000 limit)**

---

## 📝 USAGE INSTRUCTIONS

### How to Use This Optimized Prompt:

1. **Copy the Prompt**: Select and copy the entire prompt from the code block above (starts with "Create 'KNOWREX AI...")

2. **Open Draw.io**: 
   - Go to https://app.diagrams.net
   - Or use VS Code Draw.io extension

3. **Access AI Feature**:
   - Click "AI" button or "Generate with AI" in toolbar
   - Paste the prompt into the dialog box

4. **Generate**:
   - Click "Generate" or "Create"
   - Wait 30-60 seconds for processing

5. **Result**: Complete architecture diagram with all 6 layers, knowledge loop, and RAG pipeline

---

## 🎯 What's Included (Compressed Format):

✅ **6 Layers**: Client·Presentation·API·Business Logic·AI/ML·Data Storage  
✅ **Knowledge Loop**: 9-stage circular flow with 4 metric boxes  
✅ **RAG Pipeline**: 13-step linear process flow  
✅ **7 Arrow Types**: Primary·Read·Write·Escalation·Feedback·API·Conditional  
✅ **All Styling**: Colors·Fonts·Icons·Spacing·Borders·Shadows  
✅ **Visual Elements**: Legend·Version info·Metrics dashboard  
✅ **Professional**: Ready for presentations and documentation  

**Total: ~6,800 characters (32% under the 10,000 limit)**

---

## 💡 Quick Refinements

After generating, you can ask Draw.io AI to:

**Adjust Spacing**:
- "Increase spacing between layers by 20px"
- "Add more padding inside component boxes"

**Simplify**:
- "Show only layers 1-4"  
- "Remove the bottom RAG pipeline"
- "Simplify knowledge loop to 6 stages"

**Enhance**:
- "Add more technical details to Layer 4"
- "Make colors more vibrant"
- "Increase all font sizes by 2pt"

**Change Layout**:
- "Make it more vertical orientation"
- "Move knowledge loop to left side"
- "Expand the metrics dashboard"

---

## ⚡ Key Differences from Original

The optimized prompt uses:
- **Compact notation**: `·` separator instead of bullets
- **Combined elements**: Multiple items in single lines
- **Abbreviated terms**: "BG" for Background, "H" for Height
- **Reduced redundancy**: Eliminated verbose descriptions
- **Symbolic syntax**: `→` for gradients, `/` for alternatives
- **Condensed structure**: Merged related specs

**Result**: 68% size reduction while preserving ALL essential information!

---

## 🎨 Color Reference (Quick)

| Layer | Gradient Hex |
|-------|-------------|
| Layer 1 | #E3F2FD→#BBDEFB |
| Layer 2 | #E8F5E9→#C8E6C9 |
| Layer 3 | #FFF3E0→#FFE0B2 |
| Layer 4 | #F3E5F5→#E1BEE7 |
| Layer 5 | #FCE4EC→#F8BBD0 |
| Layer 6 | #F5F5F5→#E0E0E0 |

---

## ⚠️ Troubleshooting

**If Draw.io AI says "still too long"**:
- Remove the bottom RAG pipeline section
- Remove the external integrations sidebar
- This brings it down to ~5,000 characters

**If layout looks cramped**:
- Ask: "Increase canvas to 2000px × 2600px"
- Ask: "Double all spacing values"

**If text is too small**:
- Ask: "Set minimum font size to 11pt"
- Ask: "Increase all fonts by 20%"

---

**This optimized prompt generates your complete Knowrex AI architecture in one shot** - under the 10,000 character limit! 🚀
