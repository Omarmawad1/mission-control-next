'use client';

import { useMemo, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const TABS = ['OVERVIEW', 'TASKS', 'TEAM', 'PROJECTS', 'DOCS', 'BUSINESS DEVELOPMENT', 'CALENDAR', 'MEMORY', 'SETTINGS'];
const STATUSES = ['BACKLOG', 'IN PROGRESS', 'REVIEW', 'DONE'];

const seedTasks = [
  { id: 't1', title: 'Apply to Catalant', owner: 'OMAR', status: 'BACKLOG', due: '2026-03-03', priority: 'HIGH', project: 'CATALANT', notes: 'Final profile-aligned submission.' },
  { id: 't2', title: 'Training Buyer List', owner: 'MALCOLM', status: 'IN PROGRESS', due: '2026-03-04', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'L&D / People Dev leads.' },
  { id: 't3', title: 'Negotiations Copy v1', owner: 'FAITH', status: 'REVIEW', due: '2026-03-05', priority: 'MEDIUM', project: 'NEGOTIATIONS OFFERING', notes: 'CEO + HR/L&D sequence.' },
  { id: 't4', title: 'Gov Positioning Refresh', owner: 'MAJID', status: 'BACKLOG', due: '2026-03-06', priority: 'MEDIUM', project: 'AMAL BD ENGINE', notes: 'Procurement-safe messaging.' },
  { id: 't5', title: 'LinkedIn post performance review (weekly)', owner: 'YUSR', status: 'BACKLOG', due: '2026-03-06', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Weekly analytics + actions for impressions, saves, comments, CTR.' },
  { id: 't6', title: 'Case capture system setup', owner: 'MALCOLM', status: 'IN PROGRESS', due: '2026-03-07', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Collect prior client cases into structured repository for case studies/blog/LinkedIn.' },
  { id: 't7', title: 'Build service vs vertical matrix', owner: 'MAJID', status: 'BACKLOG', due: '2026-04-10', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Map every Amal service against target verticals with strongest fit, proof points, and positioning angles.' },
  { id: 't8', title: 'Build marketing packages for each service', owner: 'FAITH', status: 'BACKLOG', due: '2026-04-12', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Create packaged marketing assets for each core service: messaging, offer framing, collateral needs, and CTA.' },
  { id: 't9', title: 'Proposal for Portland Masjid', owner: 'OMAR', status: 'BACKLOG', due: '2026-04-09', priority: 'HIGH', project: 'PORTLAND MASJID', notes: 'Build proposal package and next-step path for Portland Masjid opportunity.' },
  { id: 't10', title: 'Follow up with Ahmad Sakr', owner: 'OMAR', status: 'BACKLOG', due: '2026-04-08', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Send follow-up and move conversation toward concrete next step.' },
  { id: 't11', title: 'Build affiliate model for Amal & Company', owner: 'MALCOLM', status: 'BACKLOG', due: '2026-04-14', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Design referral/affiliate structure, incentives, partner types, and operating rules.' },
  { id: 't12', title: 'Set April 2026 goal', owner: 'OMAR', status: 'BACKLOG', due: '2026-04-07', priority: 'HIGH', project: 'OMAR OS', notes: 'Define April target across revenue, pipeline, outreach, and execution cadence.' },
  { id: 't13', title: 'Build financial projections model by service', owner: 'YUSR', status: 'BACKLOG', due: '2026-04-15', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Model revenue, margin, sales cycle, and delivery assumptions for each service line.' },
  { id: 't14', title: 'Revisit outreach agent by Claude', owner: 'MALCOLM', status: 'BACKLOG', due: '2026-04-11', priority: 'MEDIUM', project: 'MISSION CONTROL', notes: 'Review prior Claude outreach agent, evaluate usefulness, and decide whether to revive or replace.' },
  { id: 't15', title: 'Apply for credit cards', owner: 'OMAR', status: 'BACKLOG', due: '2026-04-18', priority: 'MEDIUM', project: 'OMAR OS', notes: 'Identify best card options and complete application flow.' },
  { id: 't16', title: 'Reach out on LinkedIn', owner: 'OMAR', status: 'BACKLOG', due: '2026-04-08', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Execute LinkedIn outreach follow-up and new conversation starts.' },
  { id: 't17', title: 'Follow up with Shahram with retreat package', owner: 'OMAR', status: 'BACKLOG', due: '2026-04-07', priority: 'HIGH', project: 'LEADERSHIP RETREATS', notes: 'Send retreat package follow-up to Shahram and push toward review/conversation.' },
  { id: 't18', title: 'Follow up with Shahram regarding Kasper', owner: 'OMAR', status: 'BACKLOG', due: '2026-04-07', priority: 'HIGH', project: 'KASPER', notes: 'Reconnect with Shahram on Kasper-related thread and define the next step.' }
];

const reactivationTasks = [
  { title: 'P0: Fix non-clickable pages + core interaction reliability', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'HIGH', project: 'MISSION CONTROL', notes: 'Stabilize all page interactions and remove dead-click behavior before feature work.' },
  { title: 'P0: Verify full responsiveness + Telegram/webchat delivery', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'HIGH', project: 'MISSION CONTROL', notes: 'Confirm gateway/auth stability and end-to-end message delivery.' },
  { title: 'P0: Finalize TASKS kanban redesign QA (owner filter/clickable tiles/metadata)', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'HIGH', project: 'MISSION CONTROL', notes: 'Validate and close UX requirements for TASKS view.' },
  { title: 'P0: Omar OS recurring calendar dedup + overlap cleanup', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'HIGH', project: 'OMAR OS', notes: 'Clean duplicate recurring series and confirm non-overlapping target state.' },
  { title: 'P1: TEAM/DOCS/BD architecture parity check against requested IA', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'MEDIUM', project: 'MISSION CONTROL', notes: 'Audit implemented IA vs requested structure and close gaps.' },
  { title: 'P1: Final UI refinement pass (fonts, CAPS tabs, team modals, workload)', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'MEDIUM', project: 'MISSION CONTROL', notes: 'Complete visual/UX polish list and consistency pass.' },
  { title: 'P1: Project tiles and metrics accuracy validation', owner: 'YUSR', status: 'BACKLOG', due: '', priority: 'MEDIUM', project: 'MISSION CONTROL', notes: 'Confirm project progress/docs/task metrics match current data state.' },
  { title: 'P1: BD module reactivation (LinkedIn review + Case Capture)', owner: 'YUSR', status: 'BACKLOG', due: '', priority: 'HIGH', project: 'AMAL BD ENGINE', notes: 'Ensure recurring LinkedIn review and case-capture workflow are active and usable.' },
  { title: 'P1: Restore phone/tunnel remote access path for Mission Control', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'MEDIUM', project: 'MISSION CONTROL', notes: 'Reconfirm external access path from phone and document status.' },
  { title: 'P2: Stand up persistence + deeper drag/drop + calendar sync', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'MEDIUM', project: 'MISSION CONTROL', notes: 'Promote from prototype to durable operating system.' },
  { title: 'Queue: Attachment triage workflow (open + identify + summarize on receipt)', owner: 'MALCOLM', status: 'BACKLOG', due: '', priority: 'MEDIUM', project: 'FACILITIES SERVICES PROPOSAL', notes: 'When Omar sends attachment, process immediately and return exact content summary.' }
];

const team = [
  { name: 'MALCOLM', emoji: '🤝', role: 'CHIEF ORCHESTRATOR', skills: ['SYSTEM DESIGN', 'BID STRATEGY', 'AUTOMATION'], work: ['MULTI-AGENT EXECUTION', 'FINAL QA', 'DELIVERY'], tech: ['WEB RESEARCH', 'DOC/SLIDE GEN', 'EMAIL + CALENDAR'] },
  { name: 'RIZQ', emoji: '🌿', role: 'OPS STRATEGIST', skills: ['PROCESS DESIGN', 'CADENCE BUILD'], work: ['WORKFLOWS', 'SOPS'], tech: ['RESEARCH', 'STRUCTURED WRITING'] },
  { name: 'FAITH', emoji: '✨', role: 'MESSAGING ARCHITECT', skills: ['POSITIONING', 'COPY SYSTEMS'], work: ['SEQUENCES', 'LANDING COPY'], tech: ['COPY GEN', 'A/B DRAFTING'] },
  { name: 'YUSR', emoji: '📈', role: 'PIPELINE INTEL', skills: ['PIPELINE STRATEGY', 'FORECASTING'], work: ['DEAL REVIEWS', 'QUALIFICATION'], tech: ['ANALYTICS', 'REPORTS'] },
  { name: 'MAJID', emoji: '🛡️', role: 'GOVERNANCE LEAD', skills: ['COMPLIANCE', 'RISK CONTROL'], work: ['BIDS', 'QUALITY GATES'], tech: ['DEEP RESEARCH', 'MATRICES'] },
  { name: 'TAWAKOL', emoji: '🌍', role: 'MARKET INTEL', skills: ['COMPETITOR MAPPING', 'LOCALIZATION'], work: ['TARGET LISTS', 'REGIONAL BRIEFS'], tech: ['SOURCE VALIDATION', 'RESEARCH BRIEFS'] }
];

const modelRoutesSeed = [
  { taskType: 'DEEP RESEARCH', primary: 'CLAUDE OPUS', fallback: 'GEMINI 2.5 PRO' },
  { taskType: 'DRAFTING / COPY', primary: 'CLAUDE SONNET', fallback: 'GPT-5' },
  { taskType: 'TOOL AUTOMATION', primary: 'GPT-5', fallback: 'CLAUDE SONNET' },
  { taskType: 'FAST WEB DISCOVERY', primary: 'PERPLEXITY/BRAVE', fallback: 'GEMINI FLASH' }
];

const docsSeed = [
  { id: 'd1', title: 'Catalant Submission Package', project: 'CATALANT', io: 'OUTPUT', type: 'DOC', date: '2026-03-03', preview: 'Requirement matrix, pricing, paste-ready answers.', confidence: 0.98, suggested: 'CATALANT', link: '' },
  { id: 'd2', title: 'Negotiation + Adaptive Playbook', project: 'NEGOTIATIONS OFFERING', io: 'OUTPUT', type: 'DOC', date: '2026-03-03', preview: 'Offer stack + outreach + landing sections.', confidence: 0.96, suggested: 'NEGOTIATIONS OFFERING', link: '' }
];

const memorySeed = [
  { id: 'm1', date: '2026-02-24', summary: 'Identity + vertical context established.' },
  { id: 'm2', date: '2026-02-26', summary: 'Vertical team plans and command center launched.' },
  { id: 'm3', date: '2026-03-03', summary: 'Mission Control expanded: Team/Docs/BD/Calendar/Memory.' }
];

const projectsSeed = [
  { id: 'p1', name: 'AMAL BD ENGINE', details: 'Cross-vertical operating system for growth.', docs: 0 },
  { id: 'p2', name: 'CATALANT', details: 'Bid package, profile alignment, work-samples.', docs: 0 },
  { id: 'p3', name: 'NEGOTIATIONS OFFERING', details: 'Flagship positioning + GTM package.', docs: 0 },
  { id: 'p4', name: 'MISSION CONTROL', details: 'Internal platform + operating brain.', docs: 0 },
  { id: 'p5', name: 'OMAR OS', details: 'Weekly operating-system cadence and calendar architecture.', docs: 0 },
  { id: 'p6', name: 'FACILITIES SERVICES PROPOSAL', details: 'Judicial Council proposal strategy, prep, and support assets.', docs: 0 },
  { id: 'p7', name: 'PORTLAND MASJID', details: 'Proposal development and positioning for Portland Masjid opportunity.', docs: 0 },
  { id: 'p8', name: 'LEADERSHIP RETREATS', details: 'High-ticket retreat packaging, outreach, and follow-up pipeline.', docs: 0 },
  { id: 'p9', name: 'KASPER', details: 'Kasper-specific follow-up, relationship development, and opportunity tracking.', docs: 0 }
];

const calendarBlocks = [
  { day: 'TUE', time: '09:00–10:30', owner: 'OMAR', item: 'APPLY TO CATALANT' },
  { day: 'TUE', time: '10:45–11:15', owner: 'OMAR', item: 'BALANCE TRANSFER' },
  { day: 'TUE', time: '11:00–12:00', owner: 'OMAR', item: 'AGENTS SETUP' },
  { day: 'THU', time: '09:45–10:45', owner: 'FAITH', item: 'MARKETING PLAN REVIEW' },
  { day: 'MON', time: '09:00–10:30', owner: 'MALCOLM', item: 'NEGOTIATIONS OUTREACH' },
  { day: 'FRI', time: '02:00–02:45', owner: 'YUSR', item: 'LINKEDIN PERFORMANCE REVIEW (RECURRING)' }
];

function classifyDoc(name) {
  const n = name.toLowerCase();
  if (n.includes('catalant')) return { project: 'CATALANT', confidence: 0.95 };
  if (n.includes('negotiat')) return { project: 'NEGOTIATIONS OFFERING', confidence: 0.9 };
  if (n.includes('proposal') || n.includes('pipeline')) return { project: 'AMAL BD ENGINE', confidence: 0.78 };
  return { project: 'MISSION CONTROL', confidence: 0.61 };
}

function Modal({ title, children, onClose }) {
  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal-head'><h3>{title}</h3><button onClick={onClose}>✕</button></div>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState('OVERVIEW');
  const [bdSub, setBdSub] = useState('LEADS');
  const [calView, setCalView] = useState('TODAY');
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('omar@amalandcompany.com');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);

  const [tasks, setTasks] = useState(seedTasks);
  const [docs, setDocs] = useState(docsSeed);
  const [memory, setMemory] = useState(memorySeed);
  const [modelRoutes, setModelRoutes] = useState(modelRoutesSeed);
  const [feed, setFeed] = useState(['SYSTEM READY.']);

  const [ownerFilter, setOwnerFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [docIOFilter, setDocIOFilter] = useState('ALL');
  const [docProjectFilter, setDocProjectFilter] = useState('ALL');

  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedMemory, setSelectedMemory] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', owner: 'OMAR', status: 'BACKLOG', due: '', priority: 'MEDIUM', project: 'AMAL BD ENGINE', notes: '' });

  useEffect(() => {
    let mounted = true;

    const ensureReactivationTasks = (baseTasks) => {
      const existingTitles = new Set((baseTasks || []).map(x => x.title));
      const missing = reactivationTasks
        .filter(x => !existingTitles.has(x.title))
        .map((x, idx) => ({ id: `rx_${Date.now()}_${idx}`, ...x }));
      return [...missing, ...(baseTasks || [])];
    };

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setAuthLoading(false);

      const t = localStorage.getItem('mc_tasks_v4');
      const d = localStorage.getItem('mc_docs_v4');
      const m = localStorage.getItem('mc_memory_v4');
      const r = localStorage.getItem('mc_routes_v4');
      const f = localStorage.getItem('mc_feed_v4');

      if (t) {
        const parsed = JSON.parse(t);
        setTasks(ensureReactivationTasks(parsed));
      } else {
        setTasks(prev => ensureReactivationTasks(prev));
      }
      if (d) setDocs(JSON.parse(d));
      if (m) setMemory(JSON.parse(m));
      if (r) setModelRoutes(JSON.parse(r));
      if (f) setFeed(JSON.parse(f));
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => localStorage.setItem('mc_tasks_v4', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('mc_docs_v4', JSON.stringify(docs)), [docs]);
  useEffect(() => localStorage.setItem('mc_memory_v4', JSON.stringify(memory)), [memory]);
  useEffect(() => localStorage.setItem('mc_routes_v4', JSON.stringify(modelRoutes)), [modelRoutes]);
  useEffect(() => localStorage.setItem('mc_feed_v4', JSON.stringify(feed.slice(0, 120))), [feed]);

  const owners = ['ALL', 'OMAR', ...team.map(t => t.name)];
  const projects = ['ALL', ...new Set(tasks.map(t => t.project).concat(projectsSeed.map(p => p.name)))];

  const filteredTasks = useMemo(() => tasks.filter(t => (ownerFilter === 'ALL' || t.owner === ownerFilter) && (projectFilter === 'ALL' || t.project === projectFilter)), [tasks, ownerFilter, projectFilter]);
  const grouped = useMemo(() => {
    const g = Object.fromEntries(STATUSES.map(s => [s, []]));
    filteredTasks.forEach(t => g[t.status].push(t));
    return g;
  }, [filteredTasks]);

  const activeByAgent = useMemo(() => {
    const map = Object.fromEntries(team.map(a => [a.name, 0]));
    tasks.forEach(t => { if (map[t.owner] !== undefined && t.status !== 'DONE') map[t.owner] += 1; });
    return map;
  }, [tasks]);

  const projectMetrics = useMemo(() => {
    const all = [...new Set(projectsSeed.map(p => p.name).concat(tasks.map(t => t.project)))];
    return all.map(name => {
      const list = tasks.filter(t => t.project === name);
      const done = list.filter(t => t.status === 'DONE').length;
      const progress = list.length ? Math.round((done / list.length) * 100) : 0;
      const linkedDocs = docs.filter(d => d.project === name).length;
      const seed = projectsSeed.find(p => p.name === name);
      return { id: name, name, tasks: list.length, done, progress, docs: linkedDocs, details: seed?.details || 'PROJECT CONTEXT TO BE DEFINED.' };
    });
  }, [tasks, docs]);

  const filteredDocs = useMemo(() => docs.filter(d => (docIOFilter === 'ALL' || d.io === docIOFilter) && (docProjectFilter === 'ALL' || d.project === docProjectFilter)), [docs, docIOFilter, docProjectFilter]);

  const stats = {
    open: filteredTasks.length,
    inProgress: grouped['IN PROGRESS'].length,
    done: grouped.DONE.length,
    completion: filteredTasks.length ? Math.round((grouped.DONE.length / filteredTasks.length) * 100) : 0
  };

  const pushFeed = (line) => setFeed(prev => [line, ...prev].slice(0, 120));

  const createTask = () => {
    if (!newTask.title.trim()) return;
    const t = { id: `t_${Date.now()}`, ...newTask };
    setTasks(prev => [t, ...prev]);
    pushFeed(`TASK CREATED: ${t.title} (${t.owner})`);
    setShowCreate(false);
    setNewTask({ title: '', owner: 'OMAR', status: 'BACKLOG', due: '', priority: 'MEDIUM', project: 'AMAL BD ENGINE', notes: '' });
  };

  const updateTaskStatus = (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    const task = tasks.find(t => t.id === id);
    if (task) pushFeed(`TASK MOVED: ${task.title} → ${status}`);
  };

  const onDragStart = (e, id) => e.dataTransfer.setData('text/plain', id);
  const onDrop = (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) updateTaskStatus(id, status);
  };

  const uploadDocs = async (e) => {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    const created = await Promise.all(files.map(async (f) => {
      const c = classifyDoc(f.name);
      const textLike = f.type.includes('text') || /\.(md|txt|json|csv)$/i.test(f.name);
      let preview = `${f.name} • ${(f.size / 1024).toFixed(1)} KB`;
      if (textLike) {
        try { preview = (await f.text()).slice(0, 280).replace(/\n/g, ' '); } catch {}
      }
      return {
        id: `d_${Date.now()}_${Math.random().toString(16).slice(2, 6)}`,
        title: f.name,
        project: c.project,
        io: 'INPUT',
        type: (f.name.split('.').pop() || 'FILE').toUpperCase(),
        date: new Date().toISOString().slice(0, 10),
        preview,
        confidence: c.confidence,
        suggested: c.project,
        link: ''
      };
    }));
    setDocs(prev => [...created, ...prev]);
    pushFeed(`DOCS INGESTED: ${created.length} FILES (AUTO-CLASSIFIED)`);
    e.target.value = '';
  };

  const addMemory = () => {
    const summary = prompt('ENTER MEMORY HIGHLIGHT:');
    if (!summary) return;
    setMemory(prev => [{ id: `m_${Date.now()}`, date: new Date().toISOString().slice(0, 10), summary }, ...prev]);
    pushFeed('MEMORY LOG UPDATED');
  };

  const updateRoute = (idx, field, value) => {
    setModelRoutes(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthBusy(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setAuthBusy(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const renderOverview = () => (
    <>
      <div className='stats glow'>
        <article><span>OPEN TASKS</span><strong>{stats.open}</strong></article>
        <article><span>IN PROGRESS</span><strong>{stats.inProgress}</strong></article>
        <article><span>DOCS INDEXED</span><strong>{docs.length}</strong></article>
        <article><span>COMPLETION</span><strong>{stats.completion}%</strong></article>
      </div>
      <div className='overview-card'>
        <h3>LIVE FEED</h3>
        {feed.slice(0, 8).map((x, i) => <div className='activity-item' key={i}>{x}</div>)}
      </div>
    </>
  );

  const renderTasks = () => (
    <>
      <div className='tasks-toolbar'>
        <button className='new-task' onClick={() => setShowCreate(true)}>+ NEW TASK</button>
        <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>{owners.map(o => <option key={o}>{o}</option>)}</select>
        <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>{projects.map(p => <option key={p}>{p}</option>)}</select>
      </div>

      <div className='kanban-grid'>
        {STATUSES.map(s => (
          <section key={s} className='column' onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, s)}>
            <header><h4>{s}</h4><span>{grouped[s].length}</span></header>
            <div className='cards'>
              {grouped[s].map(t => (
                <button key={t.id} className='task-tile' draggable onDragStart={(e) => onDragStart(e, t.id)} onClick={() => setSelectedTask(t)}>
                  <div className='task-top'><strong>{t.title}</strong><span className={`priority ${t.priority.toLowerCase()}`}>{t.priority}</span></div>
                  <p>{t.notes}</p>
                  <div className='task-meta'><span>{t.owner}</span><span>{t.project}</span></div>
                  <div className='task-meta'><span>DUE: {t.due || 'N/A'}</span><span>{t.doc ? 'DOC' : 'NO DOC'}</span></div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );

  const renderTeam = () => (
    <>
      <div className='overview-card'>
        <h3>MISSION STATEMENT</h3>
        <p className='muted'>A SPECIALIZED AI OPERATING TEAM THAT COMPOUNDS EXECUTION THROUGH RESEARCH, SYSTEMS, AND RAPID DELIVERY.</p>
      </div>

      <div className='org-chart'>
        <div className='org-node leader'>OMAR (DECISION OWNER)</div>
        <div className='org-node chief'>MALCOLM (ORCHESTRATOR)</div>
        <div className='org-row'>
          {team.filter(a => a.name !== 'MALCOLM').map(a => <div key={a.name} className='org-node'>{a.name}</div>)}
        </div>
      </div>

      <div className='project-grid'>
        {team.map(a => (
          <button key={a.name} className='project-tile' onClick={() => setSelectedAgent(a)}>
            <div className='task-top'><strong>{a.emoji} {a.name}</strong><span className='priority medium'>{activeByAgent[a.name] || 0} ACTIVE</span></div>
            <p><strong>{a.role}</strong></p>
            <p className='muted'>MODELS: {(a.models || ['CLAUDE SONNET']).join(', ')}</p>
          </button>
        ))}
      </div>
    </>
  );

  const renderProjects = () => (
    <div className='project-grid'>
      {projectMetrics.map(p => (
        <button key={p.id} className='project-tile' onClick={() => setSelectedProject(p)}>
          <div className='task-top'><strong>{p.name}</strong><span className='priority medium'>{p.progress}%</span></div>
          <p>{p.details}</p>
          <div className='task-meta'><span># TASKS: {p.tasks}</span><span># DOCS: {p.docs}</span></div>
        </button>
      ))}
    </div>
  );

  const renderDocs = () => (
    <>
      <div className='tasks-toolbar'>
        <label className='new-task' style={{ cursor: 'pointer' }}>+ UPLOAD DOCUMENT<input type='file' multiple style={{ display: 'none' }} onChange={uploadDocs} /></label>
        <select value={docIOFilter} onChange={(e) => setDocIOFilter(e.target.value)}>{['ALL', 'INPUT', 'OUTPUT'].map(x => <option key={x}>{x}</option>)}</select>
        <select value={docProjectFilter} onChange={(e) => setDocProjectFilter(e.target.value)}>{['ALL', ...new Set(docs.map(d => d.project))].map(x => <option key={x}>{x}</option>)}</select>
      </div>

      <div className='project-grid'>
        {filteredDocs.map(d => (
          <button key={d.id} className='project-tile' onClick={() => setSelectedDoc(d)}>
            <div className='task-top'><strong>{d.title}</strong><span className='priority low'>{d.io}</span></div>
            <p>{d.preview}</p>
            <div className='task-meta'><span>{d.project}</span><span>{d.date}</span></div>
            <div className='task-meta'><span>CONF: {Math.round((d.confidence || 0.5) * 100)}%</span><span>SUGGESTED: {d.suggested || d.project}</span></div>
          </button>
        ))}
      </div>

      <div className='overview-card' style={{ marginTop: 10 }}>
        <h3>SUGGESTIONS</h3>
        {[
          'ADD CASE STUDY LIBRARY BY VERTICAL',
          'ADD RATE CARD WITH VERSION HISTORY',
          'ADD OBJECTION/REBUTTAL KNOWLEDGE BASE',
          'ADD COMPETITOR BATTLECARDS WITH CITATIONS'
        ].map(s => <div key={s} className='activity-item'>{s}</div>)}
      </div>
    </>
  );

  const renderBD = () => (
    <>
      <div className='tasks-toolbar'>
        {['LEADS', 'PIPELINE', 'OUTREACH'].map(s => <button key={s} className={bdSub === s ? 'new-task' : 'bd-tab'} onClick={() => setBdSub(s)}>{s}</button>)}
      </div>

      <div className='stats' style={{marginBottom:10}}>
        <article><span>LINKEDIN IMPRESSIONS (7D)</span><strong>12.4K</strong></article>
        <article><span>ENGAGEMENT RATE</span><strong>4.8%</strong></article>
        <article><span>LEADS FROM LINKEDIN</span><strong>17</strong></article>
        <article><span>WEEKLY REVIEW OWNER</span><strong>YUSR</strong></article>
      </div>

      <div className='overview-card'>
        {bdSub === 'LEADS' && <><h3>LEADS CONTROLS</h3><div className='activity-item'>+ ADD LEAD</div><div className='activity-item'>IMPORT CSV</div><div className='activity-item'>AUTO-SCORE</div></>}
        {bdSub === 'PIPELINE' && <><h3>PIPELINE CONTROLS</h3><div className='activity-item'>+ ADD OPPORTUNITY</div><div className='activity-item'>MOVE STAGE</div><div className='activity-item'>FORECAST</div></>}
        {bdSub === 'OUTREACH' && <><h3>OUTREACH CONTROLS</h3><div className='activity-item'>+ NEW SEQUENCE</div><div className='activity-item'>GENERATE DRAFT</div><div className='activity-item'>FOLLOW-UP BATCH</div></>}
      </div>

      <div className='overview-card' style={{marginTop:10}}>
        <h3>CASE CAPTURE SYSTEM (FOUNDATION FOR CASE STUDIES / BLOGS / LINKEDIN)</h3>
        <div className='activity-item'>+ ADD CLIENT CASE SNAPSHOT (PROBLEM → ACTION → RESULT)</div>
        <div className='activity-item'>TAG BY PROJECT, INDUSTRY, OFFER, OUTCOME METRIC</div>
        <div className='activity-item'>GENERATE CASE STUDY DRAFT / BLOG DRAFT / LINKEDIN DRAFT</div>
      </div>
    </>
  );

  const renderCalendar = () => {
    const days = calView === 'TODAY' ? ['TUE'] : ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    return (
      <>
        <div className='tasks-toolbar'>
          {['TODAY', 'WEEK'].map(v => <button key={v} className={calView === v ? 'new-task' : 'bd-tab'} onClick={() => setCalView(v)}>{v}</button>)}
        </div>
        <div className='calendar-grid'>
          {days.map(day => (
            <div className='calendar-col' key={day}>
              <h4>{day}</h4>
              {calendarBlocks.filter(b => b.day === day).map((b, i) => <div key={i} className='activity-item'><strong>{b.time}</strong><br />{b.owner}: {b.item}</div>)}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderMemory = () => (
    <>
      <div className='tasks-toolbar'><button className='new-task' onClick={addMemory}>+ ADD MEMORY</button></div>
      <div className='project-grid'>
        {memory.map(m => (
          <button key={m.id} className='project-tile' onClick={() => setSelectedMemory(m)}>
            <div className='task-top'><strong>{m.date}</strong><span className='priority low'>HIGHLIGHT</span></div>
            <p>{m.summary}</p>
          </button>
        ))}
      </div>
    </>
  );

  const renderSettings = () => (
    <div className='overview-card'>
      <h3>MODEL ROUTING RULES</h3>
      {modelRoutes.map((r, i) => (
        <div key={i} className='activity-item'>
          <strong>{r.taskType}</strong><br />
          PRIMARY: <input value={r.primary} onChange={(e) => updateRoute(i, 'primary', e.target.value)} />
          {' '}FALLBACK: <input value={r.fallback} onChange={(e) => updateRoute(i, 'fallback', e.target.value)} />
        </div>
      ))}
      <div className='activity-item'>SUGGESTED: SET HARD CONFLICT CALENDAR MODE + REQUIRE OUTCOME DOC BEFORE DONE.</div>
    </div>
  );

  if (authLoading) {
    return (
      <main className='auth-shell'>
        <div className='auth-card'>
          <h1>MISSION CONTROL</h1>
          <p className='muted'>Checking secure access…</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className='auth-shell'>
        <form className='auth-card' onSubmit={handleLogin}>
          <h1>MISSION CONTROL</h1>
          <p className='muted'>Private access for Omar only.</p>
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
          {authError ? <div className='auth-error'>{authError}</div> : null}
          <button className='new-task' type='submit' disabled={authBusy}>{authBusy ? 'SIGNING IN…' : 'SIGN IN'}</button>
        </form>
      </main>
    );
  }

  return (
    <main className='shell'>
      <aside className='sidebar'>
        <h1>MISSION CONTROL</h1>
        <p className='muted'>BUSINESS DEVELOPMENT BRAIN</p>
        <nav>{TABS.map(t => <a key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t}</a>)}</nav>
      </aside>
      <section className='content'>
        <header className='topbar'><div><h2>{tab}</h2><p className='muted'>AMAL & COMPANY WORKSPACE</p></div><button className='bd-tab' onClick={handleLogout}>SIGN OUT</button></header>
        {tab === 'OVERVIEW' && renderOverview()}
        {tab === 'TASKS' && renderTasks()}
        {tab === 'TEAM' && renderTeam()}
        {tab === 'PROJECTS' && renderProjects()}
        {tab === 'DOCS' && renderDocs()}
        {tab === 'BUSINESS DEVELOPMENT' && renderBD()}
        {tab === 'CALENDAR' && renderCalendar()}
        {tab === 'MEMORY' && renderMemory()}
        {tab === 'SETTINGS' && renderSettings()}
      </section>

      {showCreate && (
        <Modal title='CREATE TASK' onClose={() => setShowCreate(false)}>
          <div className='meta-grid'>
            <input placeholder='TITLE' value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
            <select value={newTask.owner} onChange={e => setNewTask({ ...newTask, owner: e.target.value })}>{owners.filter(o => o !== 'ALL').map(o => <option key={o}>{o}</option>)}</select>
            <select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
            <input type='date' value={newTask.due} onChange={e => setNewTask({ ...newTask, due: e.target.value })} />
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>{['LOW', 'MEDIUM', 'HIGH'].map(p => <option key={p}>{p}</option>)}</select>
            <select value={newTask.project} onChange={e => setNewTask({ ...newTask, project: e.target.value })}>{projects.filter(p => p !== 'ALL').map(p => <option key={p}>{p}</option>)}</select>
          </div>
          <textarea style={{ width: '100%', marginTop: 10 }} rows={3} placeholder='NOTES' value={newTask.notes} onChange={e => setNewTask({ ...newTask, notes: e.target.value })} />
          <div style={{ marginTop: 10 }}><button className='new-task' onClick={createTask}>SAVE TASK</button></div>
        </Modal>
      )}

      {selectedTask && <Modal title={selectedTask.title} onClose={() => setSelectedTask(null)}><p>{selectedTask.notes}</p><div className='meta-grid'><div><strong>OWNER:</strong> {selectedTask.owner}</div><div><strong>STATUS:</strong> {selectedTask.status}</div><div><strong>DUE:</strong> {selectedTask.due}</div><div><strong>PROJECT:</strong> {selectedTask.project}</div></div></Modal>}
      {selectedAgent && <Modal title={`${selectedAgent.emoji} ${selectedAgent.name}`} onClose={() => setSelectedAgent(null)}><p><strong>{selectedAgent.role}</strong></p><p><strong>SKILLS:</strong> {selectedAgent.skills.join(' • ')}</p><p><strong>WORK TYPES:</strong> {selectedAgent.work.join(' • ')}</p><p><strong>TECHNICAL:</strong> {selectedAgent.tech.join(' • ')}</p></Modal>}
      {selectedProject && <Modal title={selectedProject.name} onClose={() => setSelectedProject(null)}><p>{selectedProject.details}</p><div className='meta-grid'><div><strong>TASKS:</strong> {selectedProject.tasks}</div><div><strong>DONE:</strong> {selectedProject.done}</div><div><strong>DOCS:</strong> {selectedProject.docs}</div><div><strong>PROGRESS:</strong> {selectedProject.progress}%</div></div></Modal>}
      {selectedDoc && <Modal title={selectedDoc.title} onClose={() => setSelectedDoc(null)}><p>{selectedDoc.preview}</p><div className='meta-grid'><div><strong>PROJECT:</strong> {selectedDoc.project}</div><div><strong>I/O:</strong> {selectedDoc.io}</div><div><strong>CONFIDENCE:</strong> {Math.round((selectedDoc.confidence || 0.5) * 100)}%</div><div><strong>SUGGESTED:</strong> {selectedDoc.suggested || selectedDoc.project}</div></div></Modal>}
      {selectedMemory && <Modal title={selectedMemory.date} onClose={() => setSelectedMemory(null)}><p>{selectedMemory.summary}</p></Modal>}
    </main>
  );
}
