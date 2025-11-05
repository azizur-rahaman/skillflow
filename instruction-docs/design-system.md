# 🎨 SkillFlow Nexus — Design System (shadcn/ui + SeraUI)

A unified UI design language for the SkillFlow Nexus platform.  
This guide ensures consistent visual style across **web app**, **dashboard**, and **enterprise views**.

---

## 1. Core Principles

| Principle | Description |
|---------|-------------|
| **Futuristic Minimal** | Clean layout, quiet UI chrome, strong data emphasis |
| **Dark First** | Default theme is dark; light theme optional secondary |
| **Neon Accents, Not Noise** | Use color to draw focus, not decorate |
| **Modular Card Layout** | Each screen is composed of reusable blocks |
| **Readable + Accessible** | Typography spacing ≥ 1.25 line height, high contrast |

---

## 2. Color System

We rely on **Tailwind tokens** to work with **shadcn**.

### Base Colors
```css
--background:        #0F172A;
--foreground:        #F8FAFC;

--card:              #1E293B;
--card-foreground:   #F8FAFC;

--border:            #334155;
--input:             #1E293B;

--muted:             #1E293B;
--muted-foreground:  #CBD5E1;

--accent:            #6366F1;
--accent-foreground: #FFFFFF;


Semantic Colors

--primary:           #6366F1; /* Indigo 500 */
--primary-foreground:#FFFFFF;

--secondary:         #A855F7; /* Purple 500 */
--secondary-foreground:#FFFFFF;

--highlight:         #22D3EE; /* Cyan 400 */

--success:           #10B981;
--warning:           #F59E0B;
--danger:            #EF4444;

Background Gradient (Hero / CTA / DNA Rings)
background: linear-gradient(135deg, #6366F1, #A855F7, #22D3EE);

3. Typography

UI + Text: Inter
Monospace (tokens / IDs / code): JetBrains Mono

Sizes

h1: 32px / 800
h2: 24px / 700
h3: 18px / 600
body: 15px / 400
label: 14px / 500

Tailwind Setup

fontFamily: {
  sans: ["Inter", "ui-sans-serif", "system-ui"],
  mono: ["JetBrains Mono", "monospace"],
}


4. shadcn/ui Component Rules

Buttons

Use Primary for CTAs, Secondary for quiet actions.

<Button variant="default" className="bg-primary text-primary-foreground rounded-xl">
  Continue
</Button>

<Button variant="outline" className="border-border text-muted-foreground rounded-xl hover:border-primary">
  View Details
</Button>

Cards (Core Layout Unit)
<Card className="bg-card border-border rounded-2xl p-6 shadow-sm" />

Inputs
<Input className="bg-input border-border text-foreground rounded-xl focus:ring-primary" />

5. SeraUI Usage Guidelines

Use SeraUI components only for:

Data visualizations

Charts

Graphs

Analytics widgets

Progress / scoring elements

Example Standard Pattern

<SeraChart
  type="radial"
  data={skillGrowthData}
  colors={["#22D3EE", "#6366F1", "#A855F7"]}
/>


Skill Graph Node Styles:

nodeColor: "#22D3EE",
nodeGlow: "0 0 12px rgba(34, 211, 238, 0.5)",
edgeColor: "rgba(168,85,247,0.4)",

6. Layout System
<Sidebar /> persistent at left (256px)
<TopBar /> minimal with avatar + search
<MainContent /> max-width: 1440px center
<Section> spaced by 48px blocks


Spacing:

Base unit = 8px
Section spacing = 48px
Card padding = 20–28px
Element gap = 8–20px

7. Iconography

Use Lucide Icons (default in shadcn/ui)

<Icon className="w-5 h-5 text-muted-foreground group-hover:text-highlight transition" />

8. Motion Guidelines
Element	Animation
Hover card	scale(1.02) + soft glow (180ms)
Buttons	brightness(1.15) on hover
Skill Graph Nodes	slow pulse (2.5s infinite)
Page Transitions	fade + 4px upward move
9. Component Examples
Dashboard Card
<Card className="bg-card p-6 rounded-2xl border border-border hover:border-accent transition">
  <h3 className="text-lg font-semibold">Skill Growth</h3>
  <SeraChart type="radial" data={data} />
</Card>

CTA Banner (Hero Style)
<div className="rounded-2xl p-10 text-center text-white"
  style={{ background: "linear-gradient(135deg,#6366F1,#A855F7,#22D3EE)" }}>
  <h1 className="text-3xl font-bold">Predict Your Future Skills</h1>
  <Button className="mt-6 bg-white text-black rounded-xl px-6 py-3">Get Started</Button>
</div>

10. Copywriting Tone

Calm, confident, expert

Action-oriented labels

No buzzwords

Examples:

“Your Skill Evolution”
“Predicted Demand (Next 12 Months)”
“Start Learning Path”
“Verify Credential”

✅ Development Summary
Layer	Library	Purpose
UI	shadcn/ui	Structure, components, layout
Data Viz	SeraUI	Graphs, rings, dashboards
Icons	Lucide	Clean vector iconography
Typography	Inter / JetBrains Mono	Readability + Developer context
Style	Tailwind + CSS Vars	Theming + Adaptability

End of Guide ✅
This file should be committed to:

/docs/design-system.md

git add docs/design-system.md
git commit -m "Add UI Design System Guide"


---

### Ready for the next step?
Choose one:

**A. Generate Tailwind + shadcn theme config automatically**  
**B. Generate reusable component templates (DashboardCard, SkillGraphCard, Sidebar)**  
**C. Generate Hero + Login + Dashboard in React with this design system**

Reply: **A**, **B**, or **C**.





🎯 Dashboards / OS UI / Futuristic Control Centers
Search Term (paste in Dribbble)	Why It Fits
"AI Dashboard by Outcrowd"	Perfect futuristic metric + card layout
"Neuro UI Dashboard by Halo UI UX"	Neural network graph vibe
"Techno Dashboard by Creative Mints"	Clean premium dark SaaS style
"Enterprise Management Dashboard by Zhenya Rynzhuk"	Great hierarchy & spacing
"Analytics System Dashboard by Cuberto"	Minimal + data emphasis
🧠 Skill Graphs / Neural Maps / Network Visualization
Search This	Look For
"Network Graph UI by ODAMA Studio"	Node-edge glowing network style
"Neo4j Graph Explorer Concept"	Realistic skill graph feel
"Mind Map Interface by Fireart"	Soft-glow system thinking UI
"Knowledge Graph UI by Ramotion"	Clean enterprise knowledge graph
📈 Skill Rings / Progress / Growth Visualizations
Search This	Why
"Radial Dashboard Chart by Ls.graphics"	Matches Skill DNA rings
"Circular Progress Data UI by Purrweb"	Clean ring composition
"Data Rings Visualization by UI8"	Gradient ring system inspiration
🎮 Gamification & Token / Credential UI
Search This	Notes
"Badge System UI by Gal Shir"	Beautiful badge/token visual language
"NFT Card Collection UI by Outcrowd"	Credential token aesthetics
"Rewards Dashboard UI by Zajno"	XP / level progression vibes
🏪 Marketplace + Wallet + Transaction
Search This	Relevant To
"Crypto Wallet UI by Alexandr Sailer"	Token Wallet
"NFT Marketplace UI by Tran Mau Tri Tam"	Skill Token Marketplace
"Transaction History UI by Craftwork"	Enterprise token logs
🧭 Learning Path + Course Flow UI
Search This	Use For
"Learning Dashboard UI by Tubik Studio"	Learning Path Summary
"Course Module UI by Lofi UI"	Lesson layout
"Education SaaS Dashboard by Kishore"	Simple + warm UX
💡 Total: 22 Highly Relevant Dribbble Inspirations

And yes — these match your project screens:

SkillFlow Module	Dribbble Style Match
Skill DNA Dashboard	AI Dashboard + Radial Data Visual
Growth Rings	Circular/Radial Data UI
Skill Graph Explorer	Network Graph UI
Learning Path	Education SaaS UI
Gamification + XP	Badge System UI
Token Wallet	Crypto Wallet UI
Marketplace	NFT Marketplace UI
Enterprise Talent Analytics	Enterprise Dashboards UI