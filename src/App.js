import { useState, useEffect } from "react";

const PRESET_CATEGORIES = [
  { id: "mains",    label: "Mains",           emoji: "🍖", items: ["BBQ Meat", "Roast Chicken", "Pasta Bake", "Veggie Burgers"] },
  { id: "salads",   label: "Salads & Sides",  emoji: "🥗", items: ["Green Salad", "Caesar Salad", "Coleslaw", "Pasta Salad", "Roast Veggies"] },
  { id: "bread",    label: "Bread",           emoji: "🍞", items: ["Bread Rolls", "Garlic Bread", "Focaccia"] },
  { id: "desserts", label: "Desserts",        emoji: "🍰", items: ["Cake", "Pavlova", "Brownies", "Fruit Platter", "Ice Cream"] },
  { id: "drinks",   label: "Drinks",          emoji: "🥤", items: ["Beer", "Wine", "Soft Drinks", "Juice"] },
  { id: "snacks",   label: "Snacks",          emoji: "🧀", items: ["Cheese & Crackers", "Chips & Dips", "Antipasto"] },
];

const THEME_PRESETS = [
  { id: "rose",    name: "Rose",    primary: "#e11d48", light: "#fff1f2", mid: "#fecdd3", text: "#9f1239" },
  { id: "violet",  name: "Violet",  primary: "#7c3aed", light: "#f5f3ff", mid: "#ddd6fe", text: "#5b21b6" },
  { id: "teal",    name: "Teal",    primary: "#0d9488", light: "#f0fdfa", mid: "#ccfbf1", text: "#0f766e" },
  { id: "amber",   name: "Amber",   primary: "#d97706", light: "#fffbeb", mid: "#fde68a", text: "#92400e" },
  { id: "sky",     name: "Sky",     primary: "#0284c7", light: "#f0f9ff", mid: "#bae6fd", text: "#075985" },
  { id: "emerald", name: "Emerald", primary: "#059669", light: "#ecfdf5", mid: "#a7f3d0", text: "#065f46" },
];

const DEMO_EVENT = {
  id: "demo-bbq",
  name: "The Wilsons' Summer BBQ",
  date: "2026-06-14",
  time: "17:00",
  location: "42 Jacaranda Place, Toowoomba QLD 4350",
  description: "Join us for a relaxed summer BBQ! Bring a plate to share and your best company. Kids and dogs welcome 🐕",
  hostName: "Sarah & Tom Wilson",
  hostPassword: "wilson2026",
  themeId: "rose",
  welcomeMessage: "Thanks for registering for our event via Bringly! Make sure you check out who is coming along and what they're bringing. Check the categories to make sure we don't end up with all mains and no dessert — and try to bring a speciality so we all get to know you a little better 🙌",
  eventImage: "",
  flyerImage: "",
  categories: [
    { id: "salads",   label: "Salads & Sides", emoji: "🥗", items: ["Green Salad", "Caesar Salad", "Coleslaw", "Pasta Salad"], includeOther: true },
    { id: "bread",    label: "Bread",          emoji: "🍞", items: ["Bread Rolls", "Garlic Bread"], includeOther: true },
    { id: "desserts", label: "Desserts",       emoji: "🍰", items: ["Cake", "Pavlova", "Brownies", "Fruit Platter"], includeOther: true },
    { id: "drinks",   label: "Drinks",         emoji: "🥤", items: ["Beer", "Wine", "Soft Drinks", "Juice"], includeOther: true },
    { id: "snacks",   label: "Snacks",         emoji: "🧀", items: ["Cheese & Crackers", "Chips & Dips"], includeOther: true },
  ],
  customQuestions: [
    { id: "q1", label: "Any dietary requirements?", type: "text", placeholder: "e.g. vegetarian, gluten-free, nut allergy" },
  ],
  furtherInfo: [
    { id: "fi1", label: "What time will you arrive?", type: "choice", options: ["Early (to help set up)", "Afternoon (2–4pm)", "At the start (5pm)", "Later in the evening"] },
    { id: "fi2", label: "Any notes for the hosts?", type: "text", placeholder: "Anything we should know!" },
  ],
  updates: [
    { id: 1, text: "We'll be setting up some yard games — bring your competitive spirit! 🏆", sentAt: "2026-06-10T08:00:00Z" },
  ],
};

const SEED_GUESTS = [
  { id: 1, familyName: "The Nguyens",  emoji: "🌸", email: "nguyens@email.com",  phone: "+61412345678", adults: 2, kids: 2, reminder: true,  editToken: "tok-1", answers: { q1: "One nut allergy" }, furtherInfoAnswers: { fi1: "At the start (5pm)", fi2: "" }, items: [{ cat: "salads", item: "Caesar Salad", servings: 8 }, { cat: "drinks", item: "Soft Drinks", servings: 8 }] },
  { id: 2, familyName: "Dave & Priya", emoji: "🔥", email: "dave@email.com",     phone: "+61423456789", adults: 2, kids: 0, reminder: false, editToken: "tok-2", answers: { q1: "" },                  furtherInfoAnswers: { fi1: "Early (to help set up)", fi2: "Bringing extra chairs!" }, items: [{ cat: "desserts", item: "Pavlova", servings: 10 }, { cat: "snacks", item: "Chips & Dips", servings: 10 }] },
  { id: 3, familyName: "The Garcias",  emoji: "🌿", email: "garcias@email.com",  phone: "+61434567890", adults: 2, kids: 3, reminder: true,  editToken: "tok-3", answers: { q1: "Vegetarian x2" },   furtherInfoAnswers: { fi1: "Afternoon (2–4pm)", fi2: "" }, items: [{ cat: "salads", item: "Green Salad", servings: 10 }, { cat: "bread", item: "Garlic Bread", servings: 12 }] },
];

const DEMO_GUESTS_KEY = "bringly-demo-guests-v1";
const EVENT_KEY = (id) => `bringly-event-${id}`;

async function loadData(eventId) {
  try {
    if (!eventId || eventId === "demo-bbq") {
      const r = localStorage.getItem(DEMO_GUESTS_KEY);
      return { event: DEMO_EVENT, guests: r ? JSON.parse(r) : SEED_GUESTS };
    }
    const r = localStorage.getItem(EVENT_KEY(eventId));
    return r ? JSON.parse(r) : null;
  } catch { return null; }
}

async function saveData(data) {
  try {
    if (!data?.event?.id || data.event.id === "demo-bbq") {
      localStorage.setItem(DEMO_GUESTS_KEY, JSON.stringify(data.guests));
    } else {
      localStorage.setItem(EVENT_KEY(data.event.id), JSON.stringify(data));
      // Also remember which event was last created
      localStorage.setItem("bringly-last-event", data.event.id);
    }
  } catch {}
}

function getTheme(id) { return THEME_PRESETS.find(t => t.id === id) || THEME_PRESETS[0]; }

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m}${hr >= 12 ? "pm" : "am"}`;
}

function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function genToken() { return "tok-" + Math.random().toString(36).slice(2, 10); }

function ServingBar({ covered, total, label, primary }) {
  const pct = total > 0 ? Math.min(100, Math.round((covered / total) * 100)) : 0;
  const color = pct >= 100 ? "#10b981" : pct >= 60 ? primary : "#f59e0b";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#94a3b8" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: pct >= 100 ? "#10b981" : "#94a3b8" }}>{covered}/{total} {pct >= 100 ? "✓" : "ppl"}</span>
      </div>
      <div style={{ height: 3, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

// Simulated email preview modal
function EmailPreview({ guest, event, theme, onClose, mode }) {
  const t = getTheme(event.themeId);
  const editUrl = `https://bringly.com/rsvp/${event.id}/edit/${guest.editToken}`;
  const isConfirm = mode === "confirm";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Email chrome */}
        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "14px 20px", borderRadius: "16px 16px 0 0" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>📧 Email preview — in the real app this sends automatically</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{isConfirm ? `Your RSVP for ${event.name} is confirmed!` : `Reminder: ${event.name} is tomorrow!`}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>To: {guest.email}</div>
        </div>
        {/* Email body */}
        <div style={{ padding: "24px 24px 20px" }}>
          <div style={{ background: t.light, borderRadius: 10, padding: "14px 16px", marginBottom: 16, borderLeft: `3px solid ${t.primary}` }}>
            <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 15, marginBottom: 2 }}>{event.name}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>📅 {formatDate(event.date)}{event.time ? ` at ${formatTime(event.time)}` : ""}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>📍 {event.location}</div>
          </div>

          {isConfirm && (
            <>
              <p style={{ fontSize: 14, color: "#475569", margin: "0 0 12px" }}>Hi <strong>{guest.familyName}</strong> 👋 You're all set! Here's what you're bringing:</p>
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                {guest.items.map(i => (
                  <div key={i.item} style={{ fontSize: 13, color: "#475569", padding: "3px 0", display: "flex", justifyContent: "space-between" }}>
                    <span>• {i.item}</span><span style={{ color: "#94a3b8" }}>for {i.servings} people</span>
                  </div>
                ))}
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, borderTop: "1px solid #e2e8f0", paddingTop: 6 }}>
                  {guest.adults} adult{guest.adults !== 1 ? "s" : ""}{guest.kids > 0 ? ` + ${guest.kids} kid${guest.kids !== 1 ? "s" : ""}` : ""}
                </div>
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px" }}>Need to change something? Use your personal edit link:</p>
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px", marginBottom: 16, wordBreak: "break-all" }}>
                <span style={{ fontSize: 12, color: t.primary, fontFamily: "monospace" }}>{editUrl}</span>
              </div>
              {guest.reminder && <div style={{ fontSize: 12, color: "#10b981", background: "#ecfdf5", borderRadius: 8, padding: "8px 12px" }}>✓ You'll get a reminder email the day before the event.</div>}
            </>
          )}

          {!isConfirm && (
            <>
              <p style={{ fontSize: 14, color: "#475569", margin: "0 0 12px" }}>Hi <strong>{guest.familyName}</strong>! Just a reminder that <strong>{event.name}</strong> is <strong>tomorrow</strong>.</p>
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>You're bringing:</div>
                {guest.items.map(i => (
                  <div key={i.item} style={{ fontSize: 13, color: "#475569", padding: "2px 0" }}>• {i.item} (for {i.servings} people)</div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 12px" }}>Need to make a last-minute change? <span style={{ color: t.primary }}>Edit your RSVP →</span></p>
            </>
          )}
        </div>
        <div style={{ padding: "0 24px 20px" }}>
          <button onClick={onClose} style={{ width: "100%", padding: "10px", borderRadius: 8, background: t.primary, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>Close preview</button>
        </div>
      </div>
    </div>
  );
}

// Simulated SMS bubble preview
function SmsPreview({ messages, title, note, onClose, theme }) {
  const t = getTheme(theme);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, maxWidth: 400, width: "100%", maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "14px 20px", borderRadius: "16px 16px 0 0" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 2 }}>💬 SMS preview — {note}</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{title}</div>
        </div>
        <div style={{ padding: "20px" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              {msg.label && <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 600 }}>To: {msg.label}</div>}
              <div style={{ background: "#e9f5ff", borderRadius: "16px 16px 4px 16px", padding: "12px 14px", fontSize: 13, color: "#1e293b", lineHeight: 1.5, whiteSpace: "pre-wrap", maxWidth: "85%" }}>
                {msg.text}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 4 }}>from Bringly · {msg.to}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 20px 20px" }}>
          <button onClick={onClose} style={{ width: "100%", padding: "10px", borderRadius: 8, background: t.primary, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>Close preview</button>
        </div>
      </div>
    </div>
  );
}

// Host invite blast panel
function InviteBlast({ event, theme, onClose }) {
  const t = getTheme(theme);
  const eventUrl = `https://bringly.com/e/${event.id}`;
  const [numbers, setNumbers] = useState("");
  const [sent, setSent] = useState(false);
  const [preview, setPreview] = useState(false);

  const parsed = numbers.split(/[\n,]+/).map(n => n.trim()).filter(n => n.length > 6);
  const msgText = `You're invited to ${event.name}${event.date ? ` on ${formatDate(event.date)}` : ""}! RSVP and let us know what you'll bring:\n${eventUrl}`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, maxWidth: 460, width: "100%", maxHeight: "85vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "14px 20px", borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>💬 Send invite texts</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>Blast the event link to your guest list</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "20px" }}>
          {!sent ? (
            <>
              <div style={{ background: t.light, border: `1px solid ${t.mid}`, borderRadius: 10, padding: "10px 12px", marginBottom: 16, fontSize: 12, color: t.text, lineHeight: 1.5 }}>
                <strong>Message that will be sent:</strong><br />
                <span style={{ color: "#475569" }}>{msgText}</span>
              </div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>
                Phone numbers — one per line or comma separated
              </label>
              <textarea
                value={numbers}
                onChange={e => setNumbers(e.target.value)}
                placeholder={"+61412345678\n+61423456789\n+61434567890"}
                rows={5}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontFamily: "monospace", fontSize: 13, color: "#1e293b", boxSizing: "border-box", resize: "vertical", outline: "none" }}
              />
              {parsed.length > 0 && (
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6, marginBottom: 14 }}>
                  {parsed.length} number{parsed.length !== 1 ? "s" : ""} detected
                </div>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setPreview(true)} disabled={parsed.length === 0}
                  style={{ flex: 1, padding: "9px", borderRadius: 8, background: "transparent", border: `1.5px solid ${t.mid}`, color: t.text, cursor: parsed.length === 0 ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 500, opacity: parsed.length === 0 ? 0.4 : 1 }}>
                  Preview SMS
                </button>
                <button onClick={() => parsed.length > 0 && setSent(true)} disabled={parsed.length === 0}
                  style={{ flex: 2, padding: "9px", borderRadius: 8, background: parsed.length === 0 ? "#e2e8f0" : t.primary, color: "#fff", border: "none", cursor: parsed.length === 0 ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>
                  Send {parsed.length > 0 ? `to ${parsed.length}` : ""} →
                </button>
              </div>

              {preview && parsed.length > 0 && (
                <SmsPreview
                  title="Invite blast preview"
                  note="in the real app, Twilio sends these automatically"
                  theme={theme}
                  messages={parsed.slice(0, 3).map(n => ({ label: n, to: n, text: msgText }))}
                  onClose={() => setPreview(false)}
                />
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
              <h3 style={{ fontFamily: "'Palatino Linotype',Georgia,serif", margin: "0 0 6px", color: "#1e293b" }}>Invites sent!</h3>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px" }}>{parsed.length} text message{parsed.length !== 1 ? "s" : ""} queued via Twilio.</p>
              <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#94a3b8", textAlign: "left" }}>
                {parsed.map(n => <div key={n} style={{ padding: "2px 0" }}>✓ {n}</div>)}
              </div>
              <button onClick={onClose} style={{ width: "100%", padding: "10px", borderRadius: 8, background: t.primary, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600 }}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);

  // create wizard
  const [createStep, setCreateStep] = useState(1);
  const [newCatDraft, setNewCatDraft] = useState({ label: "", emoji: "🍽️", itemInput: "", items: [] });
  const [showNewCat, setShowNewCat] = useState(false);
  const [recentSignupIdx, setRecentSignupIdx] = useState(0);
  const [popupVisible, setPopupVisible] = useState(true);
  const [draft, setDraft] = useState({
    name: "", date: "", time: "", location: "", description: "", hostName: "",
    hostPassword: "", themeId: "rose", eventImage: "", flyerImage: "",
    welcomeMessage: "Thanks for coming along! Check out who else is joining and what they're bringing — try to fill the gaps so we end up with a great spread. Bonus points for bringing a speciality so we all get to know you a little better 🙌",
    categories: PRESET_CATEGORIES.slice(1).map(c => ({ ...c, items: [...c.items].filter(i => i !== "Water" && i !== "Sparkling Water"), includeOther: true })),
    customQuestions: [],
    furtherInfo: [
      { id: "fi-arrival", label: "What time will you arrive?", type: "choice", options: ["Early (to help set up)", "On time", "A little later"] },
    ],
  });

  // guest signup
  const [guestStep, setGuestStep] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmoji, setGuestEmoji] = useState("😊");
  const [guestAdults, setGuestAdults] = useState(2);
  const [guestTeens,  setGuestTeens]  = useState(0);
  const [guestKids,   setGuestKids]   = useState(0);
  const [guestAnswers, setGuestAnswers] = useState({});
  const [gFurtherInfo, setGFurtherInfo] = useState({});
  const [guestItems, setGuestItems] = useState([]);
  const [guestOtherLabels, setGuestOtherLabels] = useState({}); // { catId: "what they're bringing" }
  const [guestReminder, setGuestReminder] = useState(true);
  const [guestSubmitted, setGuestSubmitted] = useState(false);
  const [guestError, setGuestError] = useState("");
  const [newGuest, setNewGuest] = useState(null);
  const [emailPreview, setEmailPreview] = useState(null); // { guest, mode }
  const [smsPreview, setSmsPreview] = useState(null);     // { guest, mode }
  const [showInviteBlast, setShowInviteBlast] = useState(false);

  // edit RSVP
  const [editToken, setEditToken] = useState("");
  const [editingRsvp, setEditingRsvp] = useState(null);
  const [editScreen, setEditScreen] = useState(false);
  const [editError, setEditError] = useState("");

  // host
  const [hostPw, setHostPw] = useState("");
  const [hostUnlocked, setHostUnlocked] = useState(false);
  const [hostPwError, setHostPwError] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [guestsExpanded, setGuestsExpanded] = useState(false);

  const [isDemoMode, setIsDemoMode] = useState(false);

  // address autocomplete
  const [addrSuggestions, setAddrSuggestions] = useState([]);
  const [addrTimer, setAddrTimer] = useState(null);

  // share / invite others
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [shareEmailInput, setShareEmailInput] = useState("");
  const [shareEmailSent, setShareEmailSent] = useState(false);

  // host broadcast + noticeboard
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);

  useEffect(() => {
    const lastId = localStorage.getItem("bringly-last-event");
    loadData(lastId || "demo-bbq").then(d => {
      if (lastId && d) {
        setAppData(d);
      } else {
        setAppData({ event: DEMO_EVENT, guests: SEED_GUESTS });
        setIsDemoMode(true);
      }
      setLoading(false);
    });
  }, []);

  async function persist(data) {
    setAppData(data);
    await saveData(data);
  }

  function viewDemo() {
    loadData("demo-bbq").then(d => {
      setAppData(d || { event: DEMO_EVENT, guests: SEED_GUESTS });
      setIsDemoMode(true);
      setScreen("event");
    });
  }

  const event = appData?.event || DEMO_EVENT;
  const guests = appData?.guests || [];
  const theme = getTheme(event.themeId);
  const totalGuests = guests.reduce((s, g) => s + g.adults + (g.teens || 0) + g.kids, 0);
  const totalAdults = guests.reduce((s, g) => s + g.adults, 0);
  const totalTeens  = guests.reduce((s, g) => s + (g.teens || 0), 0);
  const totalKids   = guests.reduce((s, g) => s + g.kids, 0);
  const myGuests    = guestAdults + guestTeens + guestKids;

  function getCatCovered(catId) {
    return guests.reduce((s, g) => s + g.items.filter(i => i.cat === catId).reduce((a, i) => a + i.servings, 0), 0);
  }
  function getLiveItems(catId) {
    const map = {};
    guests.forEach(g => g.items.filter(i => i.cat === catId).forEach(i => {
      if (!map[i.item]) map[i.item] = { servings: 0, families: [] };
      map[i.item].servings += i.servings;
      map[i.item].families.push(g.familyName);
    }));
    return map;
  }

  function toggleItem(catId, itemName) {
    setGuestItems(prev => {
      const has = prev.find(i => i.cat === catId && i.item === itemName);
      if (has) return prev.filter(i => !(i.cat === catId && i.item === itemName));
      return [...prev, { cat: catId, item: itemName, servings: myGuests || 4 }];
    });
  }
  function setItemServings(catId, itemName, val) {
    setGuestItems(prev => prev.map(i => i.cat === catId && i.item === itemName ? { ...i, servings: Math.max(1, val) } : i));
  }

  function submitGuest() {
    if (!guestName.trim()) { setGuestError("Please enter your name."); return; }
    if (!guestEmail.trim() || !guestEmail.includes("@")) { setGuestError("Please enter a valid email address."); return; }
    if (guestItems.length === 0) { setGuestError("Please choose at least one item to bring."); return; }
    const missingOther = guestItems.find(i => i.item === "Other" && !guestOtherLabels[i.cat]?.trim());
    if (missingOther) { setGuestError("Please describe what you'll bring in the 'Other' field."); return; }
    const resolvedItems = guestItems.map(i =>
      i.item === "Other" ? { ...i, item: guestOtherLabels[i.cat]?.trim() || "Other" } : i
    );
    const token = genToken();
    const entry = { id: Date.now(), familyName: guestName.trim(), emoji: guestEmoji, email: guestEmail.trim(), phone: guestPhone.trim(), adults: guestAdults, teens: guestTeens, kids: guestKids, reminder: guestReminder, editToken: token, answers: guestAnswers, furtherInfoAnswers: gFurtherInfo, items: resolvedItems };
    const updated = { ...appData, guests: [...guests, entry] };
    persist(updated);
    setNewGuest(entry);
    setGuestSubmitted(true);
    setGuestError("");
  }

  function resetGuest() {
    setGuestName(""); setGuestEmail(""); setGuestPhone(""); setGuestEmoji("😊");
    setGuestAdults(2); setGuestTeens(0); setGuestKids(0);
    setGuestAnswers({}); setGFurtherInfo({}); setGuestItems([]); setGuestOtherLabels({}); setGuestReminder(true);
    setGuestSubmitted(false); setGuestError(""); setGuestStep(1); setNewGuest(null);
  }

  function lookupEditToken(token) {
    const g = guests.find(x => x.editToken === token);
    if (!g) { setEditError("No RSVP found with that token. Check your confirmation email."); return; }
    setEditingRsvp({ ...g, items: [...g.items.map(i => ({ ...i })) ] });
    setEditError("");
  }

  function saveEditedRsvp() {
    const updated = { ...appData, guests: guests.map(g => g.id === editingRsvp.id ? editingRsvp : g) };
    persist(updated);
    setEditScreen(false);
    setEditingRsvp(null);
    setEditToken("");
  }

  function createEvent() {
    const newEvent = { ...draft, id: `event-${Date.now()}`, updates: [] };
    const data = { event: newEvent, guests: [] };
    persist(data);
    setIsDemoMode(false);
    setScreen("event");
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "inherit" }}>
      <div style={{ textAlign: "center", color: "#94a3b8" }}><div style={{ fontSize: 32, marginBottom: 8 }}>🍽️</div><p style={{ fontSize: 14 }}>Loading Bringly…</p></div>
    </div>
  );

  const F  = "'Palatino Linotype','Book Antiqua',Georgia,serif";
  const FS = "'Helvetica Neue',Arial,sans-serif";

  // ── Shared "Look who's coming" popup (event + host screens) ──
  const recentGuests = [...guests].reverse();
  const currentGuest = recentGuests[recentSignupIdx % Math.max(recentGuests.length, 1)];
  const WhosComing = recentGuests.length > 0 && popupVisible ? (
    <div style={{
      position: "fixed", bottom: 24, left: 24, zIndex: 100,
      background: "#fff", borderRadius: 16, padding: "14px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: `1px solid ${theme.mid}`,
      maxWidth: 272, animation: "slideUp 0.3s ease",
    }}>
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity:0 } to { transform: translateY(0); opacity:1 } }`}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: `1.5px solid ${theme.mid}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
            {currentGuest.emoji || "😊"}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>👀 Look who's coming!</div>
            <div style={{ fontSize: 11, color: "#64748b" }}>{currentGuest.familyName} just signed up</div>
          </div>
        </div>
        <button onClick={() => setPopupVisible(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#cbd5e1", fontSize: 16, lineHeight: 1, flexShrink: 0, padding: 0 }}>✕</button>
      </div>
      <div style={{ background: theme.light, borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: theme.text, marginBottom: 4 }}>Bringing</div>
        {(currentGuest.items || []).map(i => (
          <div key={i.item} style={{ fontSize: 12, color: theme.text }}>• {i.item} <span style={{ color: "#94a3b8" }}>for {i.servings}</span></div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setRecentSignupIdx(p => Math.max(0, p - 1))} disabled={recentSignupIdx === 0}
            style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${theme.mid}`, background: "transparent", color: theme.primary, cursor: recentSignupIdx === 0 ? "not-allowed" : "pointer", fontSize: 12, opacity: recentSignupIdx === 0 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={() => setRecentSignupIdx(p => Math.min(recentGuests.length - 1, p + 1))} disabled={recentSignupIdx >= recentGuests.length - 1}
            style={{ width: 24, height: 24, borderRadius: "50%", border: `1px solid ${theme.mid}`, background: "transparent", color: theme.primary, cursor: recentSignupIdx >= recentGuests.length - 1 ? "not-allowed" : "pointer", fontSize: 12, opacity: recentSignupIdx >= recentGuests.length - 1 ? 0.3 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </div>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>{recentSignupIdx + 1} of {recentGuests.length}</span>
        <button onClick={() => setScreen("event")} style={{ fontSize: 11, fontWeight: 600, color: theme.primary, background: "none", border: "none", cursor: "pointer", fontFamily: FS }}>See all →</button>
      </div>
    </div>
  ) : null;

  const primaryBtn = { padding: "11px 24px", borderRadius: 10, background: theme.primary, color: "#fff", border: "none", cursor: "pointer", fontFamily: FS, fontSize: 14, fontWeight: 600 };
  const ghostBtn   = { padding: "9px 18px", borderRadius: 10, background: "transparent", color: theme.text, border: `1.5px solid ${theme.mid}`, cursor: "pointer", fontFamily: FS, fontSize: 13, fontWeight: 500 };
  const inp        = { width: "100%", padding: "10px 12px", borderRadius: 8, boxSizing: "border-box", border: "1.5px solid #e2e8f0", fontFamily: FS, fontSize: 14, color: "#1e293b", background: "#fff", outline: "none" };
  const card       = { background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9", padding: "20px 18px", marginBottom: 14, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" };
  const lbl        = { display: "block", fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 };
  const cBtn       = { width: 28, height: 28, borderRadius: "50%", border: `1.5px solid ${theme.mid}`, background: "transparent", color: theme.primary, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 };

  // ── LANDING ──
  if (screen === "landing") {
    return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: FS }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 58 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🍽️</span>
          <span style={{ fontFamily: F, fontSize: 22, fontWeight: 700, color: "#1e293b", letterSpacing: -0.5 }}>bringly</span>
          <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 2, marginTop: 2 }}>.com</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => viewDemo()} style={ghostBtn}>View demo event</button>
          <button onClick={() => setScreen("create")} style={primaryBtn}>Create event</button>
        </div>
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "72px 24px 56px", textAlign: "center" }}>
        <div style={{ display: "inline-block", background: theme.light, color: theme.text, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", padding: "5px 14px", borderRadius: 999, marginBottom: 22 }}>Stress-free party hosting</div>
        <h1 style={{ fontFamily: F, fontSize: "clamp(2.2rem,6vw,3.4rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 18px", lineHeight: 1.1, letterSpacing: -1 }}>Your party,<br />beautifully coordinated</h1>
        <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 460, marginLeft: "auto", marginRight: "auto" }}>Create an event page, share it with guests, and watch everyone coordinate who's bringing what — in real time. No spreadsheets. No group chats.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setScreen("create")} style={{ ...primaryBtn, fontSize: 15, padding: "13px 32px" }}>Create your event →</button>
          <button onClick={() => viewDemo()} style={{ ...ghostBtn, fontSize: 15, padding: "13px 32px" }}>See a demo</button>
        </div>
      </div>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 72px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
        {[["🎯","Zero stress","Guests self-coordinate. You just show up."],["📊","Live tallies","See food coverage as RSVPs come in."],["📧","Auto emails","Confirmation + reminder emails, automatically."],["✏️","Guest edits","Guests can update their RSVP any time."]].map(([e,t,d]) => (
          <div key={t} style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", padding: "18px 16px" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>{e}</div>
            <div style={{ fontWeight: 700, color: "#1e293b", marginBottom: 4, fontSize: 13 }}>{t}</div>
            <div style={{ color: "#94a3b8", fontSize: 12, lineHeight: 1.5 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    );
  }

  // ── CREATE EVENT ──
  if (screen === "create") {
    const stepLabels = ["Basics", "Food", "Further Info", "Theme"];
    const activeDraftTheme = getTheme(draft.themeId);
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: FS }}>
        <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "0 20px", display: "flex", alignItems: "center", gap: 12, height: 54 }}>
          <button onClick={() => setScreen("landing")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>←</button>
          <span style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: "#1e293b" }}>Create your event</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {stepLabels.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: createStep > i+1 ? "#10b981" : createStep === i+1 ? activeDraftTheme.primary : "#e2e8f0", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>
                  {createStep > i+1 ? "✓" : i+1}
                </div>
                <span style={{ fontSize: 11, color: createStep === i+1 ? activeDraftTheme.text : "#94a3b8", fontWeight: createStep === i+1 ? 700 : 400 }}>{s}</span>
                {i < stepLabels.length-1 && <span style={{ color: "#e2e8f0", margin: "0 2px" }}>›</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 540, margin: "0 auto", padding: "24px 18px 80px" }}>

          {/* STEP 1 */}
          {createStep === 1 && (
            <div style={card}>
              <h3 style={{ fontFamily: F, color: "#1e293b", marginTop: 0, marginBottom: 18, fontSize: 19 }}>Event details</h3>
              {[["Event name","name","e.g. The Smiths' Summer BBQ"],["Host name(s)","hostName","e.g. Sarah & Tom"]].map(([l,k,p]) => (
                <div key={k} style={{ marginBottom: 12 }}>
                  <label style={lbl}>{l}</label>
                  <input value={draft[k]} onChange={e => setDraft(p2 => ({...p2,[k]:e.target.value}))} placeholder={p} style={inp} />
                </div>
              ))}
              {/* Address with autocomplete */}
              <div style={{ marginBottom: 12, position: "relative" }}>
                <label style={lbl}>Location</label>
                <input value={draft.location}
                  onChange={e => {
                    const val = e.target.value;
                    setDraft(p => ({...p, location: val}));
                    if (addrTimer) clearTimeout(addrTimer);
                    if (val.length < 4) { setAddrSuggestions([]); return; }
                    const t = setTimeout(async () => {
                      try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=1&q=${encodeURIComponent(val)}&countrycodes=au`);
                        const data = await res.json();
                        setAddrSuggestions(data.map(d => d.display_name));
                      } catch { setAddrSuggestions([]); }
                    }, 500);
                    setAddrTimer(t);
                  }}
                  placeholder="Start typing your address…"
                  style={inp}
                  autoComplete="off"
                />
                {addrSuggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 8, zIndex: 50, boxShadow: "0 4px 16px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                    {addrSuggestions.map((s, i) => (
                      <div key={i} onClick={() => { setDraft(p => ({...p, location: s})); setAddrSuggestions([]); }}
                        style={{ padding: "9px 12px", fontSize: 12, color: "#1e293b", cursor: "pointer", borderBottom: i < addrSuggestions.length-1 ? "1px solid #f1f5f9" : "none", background: "#fff" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                        📍 {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                <div><label style={lbl}>Date</label><input type="date" value={draft.date} onChange={e => setDraft(p => ({...p,date:e.target.value}))} style={inp} /></div>
                <div><label style={lbl}>Time</label><input type="time" value={draft.time} onChange={e => setDraft(p => ({...p,time:e.target.value}))} style={inp} /></div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={lbl}>Description <span style={{ color: "#cbd5e1", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(shown under the event title)</span></label>
                <textarea value={draft.description} onChange={e => setDraft(p => ({...p,description:e.target.value}))} placeholder="Tell guests what to expect…" rows={3} style={{...inp,resize:"vertical"}} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Welcome message <span style={{ color: "#cbd5e1", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(instruction card guests see on the sign-up page)</span></label>
                <textarea value={draft.welcomeMessage} onChange={e => setDraft(p => ({...p,welcomeMessage:e.target.value}))} rows={4} style={{...inp,resize:"vertical"}} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Host password</label>
                <input type="password" value={draft.hostPassword} onChange={e => setDraft(p => ({...p,hostPassword:e.target.value}))} placeholder="For your host dashboard" style={inp} />
              </div>

              {/* Event photo */}
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Event photo <span style={{ color:"#cbd5e1",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(optional — shown as a hero image on your event page)</span></label>
                {draft.eventImage ? (
                  <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
                    <img src={draft.eventImage} alt="Event" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                    <button onClick={() => setDraft(p => ({...p,eventImage:""}))}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: 999, color: "#fff", cursor: "pointer", padding: "4px 10px", fontSize: 12, fontFamily: FS }}>
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ border: "2px dashed #e2e8f0", borderRadius: 10, padding: "20px 16px", textAlign: "center", background: "#fafafa" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px" }}>Upload a photo or paste an image URL</p>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                      <label style={{ ...primaryBtn, cursor: "pointer", padding: "8px 16px", fontSize: 12 }}>
                        Upload photo
                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = ev => setDraft(p => ({...p, eventImage: ev.target.result}));
                          reader.readAsDataURL(file);
                        }} />
                      </label>
                      <input
                        placeholder="…or paste an image URL"
                        style={{ ...inp, flex: 1, minWidth: 160, fontSize: 12, padding: "8px 10px" }}
                        onBlur={e => { if(e.target.value.trim()) setDraft(p => ({...p,eventImage:e.target.value.trim()})); }}
                        onKeyDown={e => { if(e.key==="Enter"&&e.target.value.trim()) setDraft(p => ({...p,eventImage:e.target.value.trim()})); }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Flyer / printable invite */}
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Printable invite / flyer <span style={{ color:"#cbd5e1",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(optional — sent as a download in confirmation emails)</span></label>
                {draft.flyerImage ? (
                  <div style={{ position: "relative", borderRadius: 10, overflow: "hidden", marginBottom: 8 }}>
                    <img src={draft.flyerImage} alt="Flyer" style={{ width: "100%", maxHeight: 200, objectFit: "contain", display: "block", background: "#f8fafc" }} />
                    <button onClick={() => setDraft(p => ({...p,flyerImage:""}))}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.55)", border: "none", borderRadius: 999, color: "#fff", cursor: "pointer", padding: "4px 10px", fontSize: 12, fontFamily: FS }}>
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ border: "2px dashed #e2e8f0", borderRadius: 10, padding: "16px", textAlign: "center", background: "#fafafa" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>🖼️</div>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px" }}>Upload your Canva flyer or any invite image</p>
                    <label style={{ ...primaryBtn, cursor: "pointer", padding: "8px 16px", fontSize: 12 }}>
                      Upload flyer
                      <input type="file" accept="image/*,application/pdf" style={{ display: "none" }} onChange={e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => setDraft(p => ({...p, flyerImage: ev.target.result}));
                        reader.readAsDataURL(file);
                      }} />
                    </label>
                  </div>
                )}
              </div>

              <button onClick={() => setCreateStep(2)} style={{...primaryBtn,width:"100%"}}>Next → Food categories</button>
            </div>
          )}

          {/* STEP 2 — Food with deletable items */}
          {createStep === 2 && (
            <div style={card}>
              <h3 style={{ fontFamily: F, color: "#1e293b", marginTop: 0, marginBottom: 6, fontSize: 19 }}>Food categories</h3>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 0, marginBottom: 18 }}>Toggle categories on/off, and remove any individual items you don't want (e.g. remove Beer for a kids' party).</p>
              {PRESET_CATEGORIES.map(cat => {
                const active = draft.categories.find(c => c.id === cat.id);
                return (
                  <div key={cat.id} style={{ marginBottom: 12, borderRadius: 10, border: `1.5px solid ${active ? activeDraftTheme.mid : "#f1f5f9"}`, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: active ? activeDraftTheme.light : "#fafafa", cursor: "pointer" }}
                      onClick={() => setDraft(p => ({ ...p, categories: active ? p.categories.filter(c => c.id !== cat.id) : [...p.categories, { ...cat, items: [...cat.items], includeOther: true }] }))}>
                      <span style={{ fontSize: 17 }}>{cat.emoji}</span>
                      <span style={{ fontWeight: 600, fontSize: 13, color: active ? activeDraftTheme.text : "#64748b", flex: 1 }}>{cat.label}</span>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: active ? activeDraftTheme.primary : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#fff", flexShrink: 0 }}>
                        {active ? "✓" : ""}
                      </div>
                    </div>
                    {active && (
                      <div style={{ padding: "10px 14px", borderTop: `1px solid ${activeDraftTheme.mid}` }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                          {active.items.map(item => (
                            <div key={item} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 8px 5px 11px", borderRadius: 999, background: activeDraftTheme.mid, color: activeDraftTheme.text }}>
                              <span style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>{item}</span>
                              <button onClick={e => { e.stopPropagation(); setDraft(p => ({ ...p, categories: p.categories.map(c => c.id === cat.id ? { ...c, items: c.items.filter(i => i !== item) } : c) })); }}
                                style={{ background: "none", border: "none", cursor: "pointer", color: activeDraftTheme.text, fontSize: 12, lineHeight: 1, padding: "0 2px", opacity: 0.6, flexShrink: 0 }}>✕</button>
                            </div>
                          ))}
                          <span style={{ padding: "5px 11px", borderRadius: 999, background: "#f1f5f9", color: "#94a3b8", fontSize: 11, fontStyle: "italic" }}>+ Other</span>
                        </div>
                        {/* add custom item */}
                        <div style={{ display: "flex", gap: 6 }}>
                          <input placeholder="Add item…" id={`add-${cat.id}`} style={{ ...inp, fontSize: 12, padding: "5px 9px", flex: 1 }}
                            onKeyDown={e => { if (e.key === "Enter" && e.target.value.trim()) { setDraft(p => ({ ...p, categories: p.categories.map(c => c.id === cat.id ? { ...c, items: [...c.items, e.target.value.trim()] } : c) })); e.target.value = ""; }}} />
                          <button onClick={() => { const el = document.getElementById(`add-${cat.id}`); if (el?.value.trim()) { setDraft(p => ({ ...p, categories: p.categories.map(c => c.id === cat.id ? { ...c, items: [...c.items, el.value.trim()] } : c) })); el.value = ""; }}}
                            style={{ ...primaryBtn, padding: "5px 12px", fontSize: 12 }}>+ Add</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Custom categories added by host */}
              {draft.categories.filter(c => c.isCustom).map(cat => (
                <div key={cat.id} style={{ marginBottom: 12, borderRadius: 10, border: `1.5px solid ${activeDraftTheme.mid}`, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: activeDraftTheme.light }}>
                    <span style={{ fontSize: 17 }}>{cat.emoji}</span>
                    <span style={{ fontWeight: 600, fontSize: 13, color: activeDraftTheme.text, flex: 1 }}>{cat.label} <span style={{ fontWeight: 400, fontSize: 11, color: "#94a3b8" }}>(custom)</span></span>
                    <button onClick={() => setDraft(p => ({ ...p, categories: p.categories.filter(c2 => c2.id !== cat.id) }))}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#e05030", fontSize: 13, padding: "0 2px" }}>✕ Remove</button>
                  </div>
                  <div style={{ padding: "10px 14px", borderTop: `1px solid ${activeDraftTheme.mid}` }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}>
                      {cat.items.map(item => (
                        <div key={item} style={{ display: "flex", alignItems: "center", gap: 3, padding: "5px 8px 5px 11px", borderRadius: 999, background: activeDraftTheme.mid, color: activeDraftTheme.text }}>
                          <span style={{ fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>{item}</span>
                          <button onClick={() => setDraft(p => ({ ...p, categories: p.categories.map(c2 => c2.id === cat.id ? { ...c2, items: c2.items.filter(i => i !== item) } : c2) }))}
                            style={{ background: "none", border: "none", cursor: "pointer", color: activeDraftTheme.text, fontSize: 12, lineHeight: 1, padding: "0 1px", opacity: 0.6, flexShrink: 0 }}>✕</button>
                        </div>
                      ))}
                      <span style={{ padding: "5px 11px", borderRadius: 999, background: "#f1f5f9", color: "#94a3b8", fontSize: 11, fontStyle: "italic" }}>+ Other</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input id={`add-${cat.id}`} placeholder="Add item…" style={{...inp,fontSize:12,padding:"5px 9px",flex:1}}
                        onKeyDown={e => { if (e.key==="Enter" && e.target.value.trim()) { setDraft(p => ({...p,categories:p.categories.map(c2=>c2.id===cat.id?{...c2,items:[...c2.items,e.target.value.trim()]}:c2)})); e.target.value=""; }}} />
                      <button onClick={() => { const el=document.getElementById(`add-${cat.id}`); if(el?.value.trim()){setDraft(p=>({...p,categories:p.categories.map(c2=>c2.id===cat.id?{...c2,items:[...c2.items,el.value.trim()]}:c2)}));el.value="";} }}
                        style={{...primaryBtn,padding:"5px 12px",fontSize:12}}>+ Add</button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add new custom category */}
              {!showNewCat ? (
                <button onClick={() => setShowNewCat(true)}
                  style={{ ...ghostBtn, width: "100%", textAlign: "center", marginBottom: 12, borderStyle: "dashed" }}>
                  + Add custom category (e.g. Smoked Meats)
                </button>
              ) : (
                <div style={{ marginBottom: 12, borderRadius: 10, border: `1.5px solid ${activeDraftTheme.mid}`, padding: "14px", background: activeDraftTheme.light }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: activeDraftTheme.text, marginBottom: 12 }}>New custom category</div>
                  <div style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 8, marginBottom: 10 }}>
                    <div>
                      <label style={lbl}>Emoji</label>
                      <select value={newCatDraft.emoji} onChange={e => setNewCatDraft(p => ({...p,emoji:e.target.value}))}
                        style={{ ...inp, padding: "9px 8px", fontSize: 16, cursor: "pointer" }}>
                        {["🍖","🥩","🍗","🌭","🥓","🍔","🌮","🌯","🍝","🥘","🍲","🫕",
                          "🥗","🥙","🥬","🥦","🫑","🥕","🌽","🍅","🧄","🧅",
                          "🍞","🥖","🥐","🫓","🧁","🎂","🍰","🍮","🍩","🍪","🍫","🍬",
                          "🍺","🍻","🍷","🥂","🍾","🍸","🥤","🧃","☕","🫖","💧",
                          "🧀","🫙","🥚","🧆","🍱","🫔","✨","🍽️","🫙","🧁"].map(e => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Category name</label>
                      <input value={newCatDraft.label} onChange={e => setNewCatDraft(p => ({...p,label:e.target.value}))} placeholder="e.g. Smoked Meats" style={inp} />
                    </div>
                  </div>
                  <label style={lbl}>Items <span style={{ color:"#cbd5e1",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(press Enter or + to add each one)</span></label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}>
                    {newCatDraft.items.map(item => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: 3, padding: "5px 8px 5px 11px", borderRadius: 999, background: activeDraftTheme.mid, color: activeDraftTheme.text }}>
                        <span style={{ fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>{item}</span>
                        <button onClick={() => setNewCatDraft(p => ({...p,items:p.items.filter(i=>i!==item)}))}
                          style={{ background:"none",border:"none",cursor:"pointer",color:activeDraftTheme.text,fontSize:12,lineHeight:1,padding:"0 1px",opacity:0.6,flexShrink:0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <input value={newCatDraft.itemInput} onChange={e => setNewCatDraft(p => ({...p,itemInput:e.target.value}))}
                      placeholder="e.g. Brisket" style={{...inp,fontSize:12,padding:"6px 9px",flex:1}}
                      onKeyDown={e => { if(e.key==="Enter"&&newCatDraft.itemInput.trim()){setNewCatDraft(p=>({...p,items:[...p.items,p.itemInput.trim()],itemInput:""}));} }} />
                    <button onClick={() => { if(newCatDraft.itemInput.trim()) setNewCatDraft(p=>({...p,items:[...p.items,p.itemInput.trim()],itemInput:""})); }}
                      style={{...primaryBtn,padding:"6px 12px",fontSize:12}}>+ Add</button>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setShowNewCat(false); setNewCatDraft({label:"",emoji:"🍽️",itemInput:"",items:[]}); }}
                      style={{...ghostBtn,flex:1,fontSize:12}}>Cancel</button>
                    <button onClick={() => {
                      if (!newCatDraft.label.trim()) return;
                      const newCat = { id: `custom-${Date.now()}`, label: newCatDraft.label.trim(), emoji: newCatDraft.emoji, items: newCatDraft.items, includeOther: true, isCustom: true };
                      setDraft(p => ({ ...p, categories: [...p.categories, newCat] }));
                      setNewCatDraft({ label: "", emoji: "🍽️", itemInput: "", items: [] });
                      setShowNewCat(false);
                    }} style={{...primaryBtn,flex:2,fontSize:12}}>Add category ✓</button>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button onClick={() => setCreateStep(1)} style={{...ghostBtn,flex:1}}>← Back</button>
                <button onClick={() => setCreateStep(3)} style={{...primaryBtn,flex:2}}>Next → Further Info</button>
              </div>
            </div>
          )}

          {/* STEP 3 — Further Info */}
          {createStep === 3 && (
            <div style={card}>
              <h3 style={{ fontFamily: F, color: "#1e293b", marginTop: 0, marginBottom: 10, fontSize: 19 }}>Further Info</h3>
              {/* Inspirational quote */}
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
                <p style={{ fontSize: 12, color: "#0369a1", margin: 0, lineHeight: 1.65, fontStyle: "italic" }}>
                  💡 Now that you've set up your food options, have a think about what other things you need to know to make this a great party. For example — if you're doing setup early, could you ask if people are available to help? If it's a smoked meat party, could you ask if people want to bring a smoker? Do guests need oven space to keep food warm, or freezer space for ice cream? The more you ask upfront, the less you'll need to chase later!
                </p>
              </div>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 0, marginBottom: 20 }}>Add questions and structured info fields for your guests to fill in.</p>

              {/* Section 1: Questions */}
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ background: activeDraftTheme.primary, color: "#fff", borderRadius: 999, width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>1</span>
                  Questions
                  <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 11 }}>— free text or multiple choice</span>
                </div>
                {draft.customQuestions.map((q, i) => (
                  <div key={q.id} style={{ marginBottom: 10, padding: "12px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Question {i+1}</span>
                      <button onClick={() => setDraft(p => ({...p,customQuestions:p.customQuestions.filter((_,j)=>j!==i)}))} style={{ background:"none",border:"none",color:"#e05030",cursor:"pointer",fontSize:12 }}>Remove</button>
                    </div>
                    <input value={q.label} onChange={e => setDraft(p => ({...p,customQuestions:p.customQuestions.map((x,j)=>j===i?{...x,label:e.target.value}:x)}))} placeholder="Question text" style={{...inp,marginBottom:6}} />
                    <div style={{ display: "flex", gap: 6 }}>
                      {["text","choice"].map(t => (
                        <button key={t} onClick={() => setDraft(p => ({...p,customQuestions:p.customQuestions.map((x,j)=>j===i?{...x,type:t}:x)}))}
                          style={{...ghostBtn,padding:"4px 10px",fontSize:11,background:q.type===t?activeDraftTheme.light:"transparent",borderColor:q.type===t?activeDraftTheme.primary:"#e2e8f0",color:q.type===t?activeDraftTheme.text:"#94a3b8"}}>
                          {t==="text"?"Free text":"Multiple choice"}
                        </button>
                      ))}
                    </div>
                    {q.type === "choice" && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                          {(q.options||[]).map(opt => (
                            <div key={opt} style={{ display: "flex", alignItems: "center", gap: 3, padding: "5px 8px 5px 11px", borderRadius: 999, background: activeDraftTheme.mid, color: activeDraftTheme.text }}>
                              <span style={{ fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>{opt}</span>
                              <button onClick={() => setDraft(p => ({...p,customQuestions:p.customQuestions.map((x,j)=>j===i?{...x,options:(x.options||[]).filter(o=>o!==opt)}:x)}))}
                                style={{ background:"none",border:"none",cursor:"pointer",color:activeDraftTheme.text,fontSize:12,lineHeight:1,padding:"0 1px",opacity:0.6,flexShrink:0 }}>✕</button>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <input id={`qopt-${q.id}`} placeholder="Add option…" style={{...inp,fontSize:11,padding:"5px 8px",flex:1}}
                            onKeyDown={e => { if(e.key==="Enter"&&e.target.value.trim()){setDraft(p=>({...p,customQuestions:p.customQuestions.map((x,j)=>j===i?{...x,options:[...(x.options||[]),e.target.value.trim()]}:x)}));e.target.value="";} }} />
                          <button onClick={() => { const el=document.getElementById(`qopt-${q.id}`); if(el?.value.trim()){setDraft(p=>({...p,customQuestions:p.customQuestions.map((x,j)=>j===i?{...x,options:[...(x.options||[]),el.value.trim()]}:x)}));el.value="";} }}
                            style={{...primaryBtn,padding:"5px 10px",fontSize:11}}>+ Add</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={() => setDraft(p => ({...p,customQuestions:[...p.customQuestions,{id:`q${Date.now()}`,label:"",type:"text",options:[]}]}))}
                  style={{...ghostBtn,width:"100%",textAlign:"center",fontSize:12}}>+ Add question</button>
              </div>

              {/* Section 2: Further Info */}
              <div style={{ marginBottom: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ background: activeDraftTheme.primary, color: "#fff", borderRadius: 999, width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>2</span>
                  Further Info
                  <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 11 }}>— structured fields e.g. arrival time</span>
                </div>
                <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 12px" }}>Use these for logistics where you want a structured response — arrival time, transport, meal preferences, etc.</p>
                {draft.furtherInfo.map((fi, i) => (
                  <div key={fi.id} style={{ marginBottom: 10, padding: "12px 14px", borderRadius: 10, background: "#f0f9ff", border: "1px solid #bae6fd" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Field {i+1}</span>
                      <button onClick={() => setDraft(p => ({...p,furtherInfo:p.furtherInfo.filter((_,j)=>j!==i)}))} style={{ background:"none",border:"none",color:"#e05030",cursor:"pointer",fontSize:12 }}>Remove</button>
                    </div>
                    <input value={fi.label} onChange={e => setDraft(p => ({...p,furtherInfo:p.furtherInfo.map((x,j)=>j===i?{...x,label:e.target.value}:x)}))} placeholder="e.g. What time will you arrive?" style={{...inp,marginBottom:6}} />
                    <div style={{ display: "flex", gap: 6, marginBottom: fi.type==="choice"?8:0 }}>
                      {["text","choice"].map(t => (
                        <button key={t} onClick={() => setDraft(p => ({...p,furtherInfo:p.furtherInfo.map((x,j)=>j===i?{...x,type:t}:x)}))}
                          style={{...ghostBtn,padding:"4px 10px",fontSize:11,background:fi.type===t?"#e0f2fe":"transparent",borderColor:fi.type===t?"#0284c7":"#e2e8f0",color:fi.type===t?"#0369a1":"#94a3b8"}}>
                          {t==="text"?"Free text":"Multiple choice"}
                        </button>
                      ))}
                    </div>
                    {fi.type === "choice" && (
                      <div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                          {(fi.options||[]).map(opt => (
                            <div key={opt} style={{ display: "flex", alignItems: "center", gap: 3, padding: "5px 8px 5px 11px", borderRadius: 999, background: "#bae6fd", color: "#0369a1" }}>
                              <span style={{ fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>{opt}</span>
                              <button onClick={() => setDraft(p => ({...p,furtherInfo:p.furtherInfo.map((x,j)=>j===i?{...x,options:(x.options||[]).filter(o=>o!==opt)}:x)}))}
                                style={{ background:"none",border:"none",cursor:"pointer",color:"#0369a1",fontSize:12,lineHeight:1,padding:"0 1px",opacity:0.6,flexShrink:0 }}>✕</button>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <input id={`fiopt-${fi.id}`} placeholder="Add option…" style={{...inp,fontSize:11,padding:"5px 8px",flex:1}}
                            onKeyDown={e => { if(e.key==="Enter"&&e.target.value.trim()){setDraft(p=>({...p,furtherInfo:p.furtherInfo.map((x,j)=>j===i?{...x,options:[...(x.options||[]),e.target.value.trim()]}:x)}));e.target.value="";} }} />
                          <button onClick={() => { const el=document.getElementById(`fiopt-${fi.id}`); if(el?.value.trim()){setDraft(p=>({...p,furtherInfo:p.furtherInfo.map((x,j)=>j===i?{...x,options:[...(x.options||[]),el.value.trim()]}:x)}));el.value="";} }}
                            style={{...primaryBtn,padding:"5px 10px",fontSize:11}}>+ Add</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={() => setDraft(p => ({...p,furtherInfo:[...p.furtherInfo,{id:`fi${Date.now()}`,label:"",type:"choice",options:[]}]}))}
                  style={{...ghostBtn,width:"100%",textAlign:"center",fontSize:12}}>+ Add further info field</button>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setCreateStep(2)} style={{...ghostBtn,flex:1}}>← Back</button>
                <button onClick={() => setCreateStep(4)} style={{...primaryBtn,flex:2}}>Next → Theme</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {createStep === 4 && (
            <div style={card}>
              <h3 style={{ fontFamily: F, color: "#1e293b", marginTop: 0, marginBottom: 6, fontSize: 19 }}>Pick a theme</h3>
              <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 0, marginBottom: 18 }}>Your guests will see this colour throughout their sign-up page.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 20 }}>
                {THEME_PRESETS.map(t => (
                  <div key={t.id} onClick={() => setDraft(p => ({...p,themeId:t.id}))}
                    style={{ borderRadius: 10, padding: "12px 8px", textAlign: "center", cursor: "pointer", border: `2px solid ${draft.themeId===t.id?t.primary:"#f1f5f9"}`, background: draft.themeId===t.id?t.light:"#fafafa" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: t.primary, margin: "0 auto 6px" }} />
                    <div style={{ fontSize: 11, fontWeight: 600, color: draft.themeId===t.id?t.text:"#94a3b8" }}>{t.name}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: activeDraftTheme.light, borderRadius: 12, padding: 14, marginBottom: 18, border: `1px solid ${activeDraftTheme.mid}` }}>
                <div style={{ fontFamily: F, fontSize: 17, fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>{draft.name || "Your Event"}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{draft.date ? formatDate(draft.date) : "Date TBD"} · {draft.location || "Location TBD"}</div>
                <div style={{ marginTop: 10, display: "inline-block", background: activeDraftTheme.primary, color: "#fff", padding: "5px 12px", borderRadius: 7, fontSize: 12, fontWeight: 600 }}>RSVP now</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setCreateStep(3)} style={{...ghostBtn,flex:1}}>← Back</button>
                <button onClick={createEvent} style={{...primaryBtn,flex:2}}>🎉 Create event!</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── EVENT PAGE ──
  if (screen === "event") {
    const cats = event.categories || [];
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: FS }}>
        {WhosComing}
        {emailPreview && <EmailPreview guest={emailPreview.guest} event={event} theme={theme} mode={emailPreview.mode} onClose={() => setEmailPreview(null)} />}
        {smsPreview && (
          <SmsPreview
            title={smsPreview.mode === "confirm" ? "Confirmation SMS" : "Reminder SMS"}
            note="in the real app, Twilio sends this automatically"
            theme={event.themeId}
            messages={[{
              to: smsPreview.guest.phone || "+61400000000",
              text: smsPreview.mode === "confirm"
                ? `Hi ${smsPreview.guest.familyName}! You're confirmed for ${event.name}${event.date ? ` on ${formatDate(event.date)}` : ""}. You're bringing: ${smsPreview.guest.items.map(i => i.item).join(", ")}. Edit your RSVP: https://bringly.com/rsvp/${event.id}/edit/${smsPreview.guest.editToken}`
                : `Reminder: ${event.name} is TOMORROW${event.time ? ` at ${formatTime(event.time)}` : ""}! You're bringing: ${smsPreview.guest.items.map(i => i.item).join(", ")}. Any changes? https://bringly.com/rsvp/${event.id}/edit/${smsPreview.guest.editToken}`
            }]}
            onClose={() => setSmsPreview(null)}
          />
        )}

        {/* Banner */}
        <div style={{ background: `linear-gradient(135deg,${theme.light} 0%,#fff 100%)`, borderBottom: `1px solid ${theme.mid}` }}>
          {/* Hero image */}
          {event.eventImage && (
            <div style={{ width: "100%", maxHeight: 260, overflow: "hidden", position: "relative" }}>
              <img src={event.eventImage} alt={event.name}
                style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, transparent 40%, ${theme.light}ee 100%)` }} />
            </div>
          )}
          <div style={{ padding: event.eventImage ? "16px 20px 22px" : "28px 20px 22px" }}>
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: theme.text, marginBottom: 5 }}>You're invited</div>
                <h1 style={{ fontFamily: F, fontSize: "clamp(1.5rem,5vw,2.2rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.1 }}>{event.name}</h1>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>
                  {event.date && <span>📅 {formatDate(event.date)}{event.time ? ` at ${formatTime(event.time)}` : ""} &nbsp;</span>}
                  {event.location && <span>📍 {event.location}</span>}
                </div>
                {event.description && <p style={{ fontSize: 13, color: "#475569", margin: "8px 0 0", lineHeight: 1.6, maxWidth: 460 }}>{event.description}</p>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {[["RSVPs", guests.length], ["Guests", totalGuests]].map(([l, v]) => (
                  <div key={l} style={{ background: "#fff", border: `1px solid ${theme.mid}`, borderRadius: 10, padding: "8px 12px", textAlign: "center", minWidth: 56 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: theme.primary }}>{v}</div>
                    <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
              {isDemoMode && (
                <button onClick={() => { setScreen("create"); setCreateStep(1); }} style={{ ...primaryBtn, fontSize: 12, padding: "7px 14px" }}>
                  🎉 Create your own event
                </button>
              )}
              {!isDemoMode && <button onClick={() => setScreen("create")} style={{...ghostBtn,fontSize:12,padding:"7px 14px"}}>← Edit setup</button>}
              <button onClick={() => setScreen("host")} style={{...ghostBtn,fontSize:12,padding:"7px 14px"}}>Host dashboard</button>
              <button onClick={() => setEditScreen(true)} style={{...ghostBtn,fontSize:12,padding:"7px 14px"}}>Edit my RSVP</button>
              <button onClick={() => setScreen("landing")} style={{...ghostBtn,fontSize:12,padding:"7px 14px"}}>← Bringly</button>
            </div>
            {/* Google Maps embed */}
            {event.location && (
              <div style={{ marginTop: 14, borderRadius: 10, overflow: "hidden", border: `1px solid ${theme.mid}` }}>
                <iframe
                  title="map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                  width="100%" height="180" style={{ border: 0, display: "block" }}
                  loading="lazy"
                />
              </div>
            )}
          </div>
          </div>
        </div>

        <div style={{ maxWidth: 620, margin: "0 auto", padding: "20px 18px 80px" }}>

          {/* Welcome message */}
          {event.welcomeMessage && (
            <div style={{ ...card, background: theme.light, border: `1px solid ${theme.mid}`, marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>👋</span>
                <p style={{ fontSize: 14, color: theme.text, margin: 0, lineHeight: 1.65, fontStyle: "italic" }}>{event.welcomeMessage}</p>
              </div>
            </div>
          )}
          {editScreen && (
            <div style={{ ...card, background: theme.light, border: `1px solid ${theme.mid}` }}>
              {!editingRsvp ? (
                <div>
                  <h3 style={{ fontFamily: F, margin: "0 0 6px", color: "#1e293b", fontSize: 17 }}>Edit your RSVP</h3>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px" }}>Enter the token from your confirmation email, or use one of the demo tokens: <code style={{ color: theme.text }}>tok-1</code>, <code style={{ color: theme.text }}>tok-2</code>, <code style={{ color: theme.text }}>tok-3</code></p>
                  <input value={editToken} onChange={e => { setEditToken(e.target.value); setEditError(""); }} placeholder="Your edit token" style={{...inp,marginBottom:8}} />
                  {editError && <p style={{ color: "#e05030", fontSize: 12, margin: "0 0 8px" }}>{editError}</p>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setEditScreen(false); setEditToken(""); setEditError(""); }} style={{...ghostBtn,flex:1}}>Cancel</button>
                    <button onClick={() => lookupEditToken(editToken.trim())} style={{...primaryBtn,flex:2}}>Find my RSVP →</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontFamily: F, margin: "0 0 14px", color: "#1e293b", fontSize: 17 }}>Editing RSVP — {editingRsvp.familyName}</h3>
                  <label style={lbl}>Name</label>
                  <input value={editingRsvp.familyName} onChange={e => setEditingRsvp(p => ({...p,familyName:e.target.value}))} style={{...inp,marginBottom:12}} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    {[["Adults","adults",1],["Kids","kids",0]].map(([l,f,min]) => (
                      <div key={f}>
                        <label style={lbl}>{l}</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => setEditingRsvp(p => ({...p,[f]:Math.max(min,p[f]-1)}))} style={{...cBtn,width:24,height:24,fontSize:13}}>−</button>
                          <span style={{ fontWeight: 700, color: "#1e293b", minWidth: 18, textAlign: "center" }}>{editingRsvp[f]}</span>
                          <button onClick={() => setEditingRsvp(p => ({...p,[f]:p[f]+1}))} style={{...cBtn,width:24,height:24,fontSize:13}}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <label style={lbl}>What you're bringing</label>
                  {cats.map(cat => (
                    <div key={cat.id} style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>{cat.emoji} {cat.label}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {cat.items.map(item => {
                          const on = editingRsvp.items.find(i => i.cat === cat.id && i.item === item);
                          return (
                            <button key={item} onClick={() => setEditingRsvp(p => ({ ...p, items: on ? p.items.filter(i => !(i.cat===cat.id&&i.item===item)) : [...p.items,{cat:cat.id,item,servings:4}] }))}
                              style={{ padding: "5px 11px", borderRadius: 999, border: `1.5px solid ${on?theme.primary:"#e2e8f0"}`, background: on?theme.light:"#fff", color: on?theme.text:"#64748b", cursor: "pointer", fontFamily: FS, fontSize: 12, fontWeight: on?700:400 }}>
                              {item}
                            </button>
                          );
                        })}
                      </div>
                      {editingRsvp.items.filter(i => i.cat === cat.id).map(i => (
                        <div key={i.item} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, paddingLeft: 4 }}>
                          <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{i.item}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>feeds</span>
                          <button onClick={() => setEditingRsvp(p => ({...p,items:p.items.map(x=>x.cat===cat.id&&x.item===i.item?{...x,servings:Math.max(1,x.servings-1)}:x)}))} style={{...cBtn,width:22,height:22,fontSize:12}}>−</button>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", minWidth: 16, textAlign: "center" }}>{i.servings}</span>
                          <button onClick={() => setEditingRsvp(p => ({...p,items:p.items.map(x=>x.cat===cat.id&&x.item===i.item?{...x,servings:x.servings+1}:x)}))} style={{...cBtn,width:22,height:22,fontSize:12}}>+</button>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>ppl</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button onClick={() => { setEditingRsvp(null); setEditToken(""); }} style={{...ghostBtn,flex:1}}>Cancel</button>
                    <button onClick={saveEditedRsvp} style={{...primaryBtn,flex:2}}>Save changes ✓</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Who's signed up — cards */}
          {guests.length > 0 && (
            <div style={{ ...card, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                  {guests.length} {guests.length === 1 ? "family" : "families"} signed up
                </div>
                <button onClick={() => setGuestsExpanded(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 12, fontFamily: FS }}>
                  {guestsExpanded ? "Show less ↑" : "Show all ↓"}
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 10 }}>
                {(guestsExpanded ? guests : guests.slice(0, 4)).map(g => (
                  <div key={g.id} style={{ background: theme.light, borderRadius: 12, padding: "12px 14px", border: `1px solid ${theme.mid}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", border: `1.5px solid ${theme.mid}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                        {g.emoji || "😊"}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", lineHeight: 1.2 }}>{g.familyName}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>{g.adults}A{g.teens > 0 ? `+${g.teens}T` : ""}{g.kids > 0 ? `+${g.kids}K` : ""}</div>
                      </div>
                    </div>
                    <div>
                      {g.items.map(i => (
                        <div key={i.item} style={{ fontSize: 11, color: theme.text, marginBottom: 2 }}>• {i.item} <span style={{ color: "#94a3b8" }}>×{i.servings}</span></div>
                      ))}
                    </div>
                  </div>
                ))}
                {!guestsExpanded && guests.length > 4 && (
                  <div style={{ background: "#f8fafc", borderRadius: 12, padding: "12px 14px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>+{guests.length - 4} more</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live coverage bars */}
          {guests.length > 0 && (
            <div style={{ ...card, marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 12 }}>What's covered so far</div>
              {cats.map(cat => {
                const covered = getCatCovered(cat.id);
                const liveMap = getLiveItems(cat.id);
                if (!Object.keys(liveMap).length) return null;
                return (
                  <div key={cat.id} style={{ marginBottom: 12 }}>
                    <ServingBar covered={covered} total={totalGuests} label={`${cat.emoji} ${cat.label}`} primary={theme.primary} />
                    {Object.entries(liveMap).map(([item, data]) => (
                      <div key={item} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", paddingLeft: 6, marginBottom: 2 }}>
                        <span>{item}</span><span>{data.families.join(", ")} · for {data.servings}</span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* RSVP Form */}
          {guestSubmitted ? (
            <div>
              <div style={{ ...card, background: theme.light, border: `1px solid ${theme.mid}`, textAlign: "center" }}>
                <div style={{ fontSize: 42, marginBottom: 8 }}>🎉</div>
                <h3 style={{ fontFamily: F, color: "#1e293b", margin: "0 0 6px" }}>You're on the list!</h3>
                <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 4px" }}>Thanks <strong>{guestName}</strong>! Confirmation sent to <strong>{guestEmail}</strong>.</p>
                {newGuest?.reminder && <p style={{ color: "#10b981", fontSize: 12, margin: "0 0 10px" }}>✓ You'll get a reminder the day before.</p>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", margin: "8px 0 14px" }}>
                  {guestItems.map(i => <span key={i.item} style={{ padding: "3px 10px", borderRadius: 999, background: "#fff", border: `1px solid ${theme.mid}`, color: theme.text, fontSize: 11 }}>{i.item} · for {i.servings}</span>)}
                </div>
                {/* Flyer download */}
                {event.flyerImage && (
                  <div style={{ margin: "0 0 12px" }}>
                    <a href={event.flyerImage} download="invite.png"
                      style={{ ...primaryBtn, display: "inline-block", textDecoration: "none", padding: "8px 18px", fontSize: 12 }}>
                      🖼️ Download your printable invite
                    </a>
                  </div>
                )}
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => newGuest && setEmailPreview({ guest: newGuest, mode: "confirm" })} style={{ ...ghostBtn, fontSize: 12, padding: "7px 14px" }}>📧 Preview confirmation email</button>
                  {newGuest?.phone && <button onClick={() => newGuest && setSmsPreview({ guest: newGuest, mode: "confirm" })} style={{ ...ghostBtn, fontSize: 12, padding: "7px 14px" }}>💬 Preview SMS</button>}
                  <button onClick={resetGuest} style={{ ...ghostBtn, fontSize: 12, padding: "7px 14px" }}>Add another guest</button>
                </div>
              </div>

              {/* Invite others */}
              <div style={{ ...card, border: `1px solid ${theme.mid}` }}>
                <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14, marginBottom: 4 }}>👋 Know someone who should come?</div>
                <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px" }}>Share the event link with them so they can sign up and let everyone know what they'll bring.</p>
                {/* Shareable link */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <div style={{ flex: 1, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {window.location.href.split("?")[0]}
                  </div>
                  <button onClick={() => { navigator.clipboard?.writeText(window.location.href.split("?")[0]); }}
                    style={{ ...primaryBtn, padding: "9px 14px", fontSize: 12 }}>Copy link</button>
                </div>
                {/* Send email invite */}
                {!shareEmailSent ? (
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#94a3b8", marginBottom: 6 }}>Or send them an invite by email</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input type="email" value={shareEmailInput} onChange={e => setShareEmailInput(e.target.value)}
                        placeholder="friend@email.com"
                        style={{ ...inp, flex: 1, fontSize: 12, padding: "8px 10px" }} />
                      <button onClick={() => { if (shareEmailInput.includes("@")) { setShareEmailSent(true); setTimeout(() => { setShareEmailSent(false); setShareEmailInput(""); }, 3000); } }}
                        style={{ ...ghostBtn, fontSize: 12, padding: "8px 14px" }}>Send →</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "#ecfdf5", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#10b981", textAlign: "center" }}>
                    ✓ Invite sent to {shareEmailInput}!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 18 }}>
                {[1,2,3].map(n => (
                  <div key={n} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: guestStep >= n ? theme.primary : "#f1f5f9", color: guestStep >= n ? "#fff" : "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{n}</div>
                    {n < 3 && <div style={{ width: 18, height: 1.5, background: guestStep > n ? theme.primary : "#f1f5f9" }} />}
                  </div>
                ))}
                <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 5 }}>{guestStep === 1 ? "Your details" : guestStep === 2 ? "Further info" : "What to bring"}</span>
              </div>

              {guestStep === 1 && (
                <div>
                  <label style={lbl}>Name / family name</label>
                  <input value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="e.g. The Smiths" style={{...inp,marginBottom:12}} />
                  <label style={lbl}>Email address</label>
                  <input type="email" value={guestEmail} onChange={e => setGuestEmail(e.target.value)} placeholder="for confirmation & reminders" style={{...inp,marginBottom:12}} />
                  <label style={lbl}>Mobile number <span style={{ color: "#cbd5e1", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional — for SMS confirmation & reminder)</span></label>
                  <input type="tel" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="+61 4xx xxx xxx" style={{...inp,marginBottom:12}} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
                    {[["Adults 🧑",guestAdults,setGuestAdults,1],["Teens 🧒\u200d♂\ufe0f (12–18)",guestTeens,setGuestTeens,0],["Kids 👶 (under 12)",guestKids,setGuestKids,0]].map(([l,v,set,min]) => (
                      <div key={l}>
                        <label style={{ ...lbl, fontSize: 10 }}>{l}</label>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button onClick={() => set(Math.max(min,v-1))} style={cBtn}>−</button>
                          <span style={{ fontSize: 17, fontWeight: 700, color: "#1e293b", minWidth: 16, textAlign: "center" }}>{v}</span>
                          <button onClick={() => set(v+1)} style={cBtn}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {event.customQuestions?.map(q => (
                    <div key={q.id} style={{ display: "none" }} />
                  ))}
                  {/* Emoji picker */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={lbl}>Family emoji <span style={{ color:"#cbd5e1",fontWeight:400,textTransform:"none",letterSpacing:0 }}>(shows on your guest card)</span></label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {["😊","🎉","🔥","🌸","🌿","🦋","⭐","🎈","🍕","🌈","🐶","🏡","🎵","🌻","🍀","🦄","🎸","🏄","🌊","🧡","💚","💜","🍉","🧁","🎯"].map(e => (
                        <button key={e} onClick={() => setGuestEmoji(e)}
                          style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${guestEmoji===e?theme.primary:"#e2e8f0"}`, background: guestEmoji===e?theme.light:"#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Reminder opt-in */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: guestReminder ? theme.light : "#f8fafc", border: `1px solid ${guestReminder ? theme.mid : "#f1f5f9"}`, marginBottom: 16, cursor: "pointer" }}
                    onClick={() => setGuestReminder(p => !p)}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${guestReminder ? theme.primary : "#e2e8f0"}`, background: guestReminder ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {guestReminder && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>Send me a reminder</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Email the day before the event with what you're bringing</div>
                    </div>
                  </div>
                  {guestError && <p style={{ color: "#e05030", fontSize: 12, marginBottom: 6 }}>{guestError}</p>}
                  <button onClick={() => {
                    if (!guestName.trim()) { setGuestError("Please enter your name."); return; }
                    if (!guestEmail.trim() || !guestEmail.includes("@")) { setGuestError("Please enter a valid email."); return; }
                    setGuestError(""); setGuestStep(2);
                  }} style={{...primaryBtn,width:"100%"}}>Next → Further info</button>
                </div>
              )}

              {/* STEP 2 — Further Info */}
              {guestStep === 2 && (
                <div>
                  <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>Just a few more details for {event.hostName}.</p>

                  {/* Custom questions */}
                  {(event.customQuestions || []).length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      {event.customQuestions.map(q => (
                        <div key={q.id} style={{ marginBottom: 14 }}>
                          <label style={lbl}>{q.label}</label>
                          {q.type === "text"
                            ? <input value={guestAnswers[q.id]||""} onChange={e => setGuestAnswers(p=>({...p,[q.id]:e.target.value}))} placeholder={q.placeholder||""} style={inp} />
                            : <div style={{ display:"flex",gap:7,flexWrap:"wrap" }}>{(q.options||[]).map(opt=>(
                                <button key={opt} onClick={()=>setGuestAnswers(p=>({...p,[q.id]:opt}))}
                                  style={{...ghostBtn,padding:"6px 12px",fontSize:12,background:guestAnswers[q.id]===opt?theme.light:"transparent",borderColor:guestAnswers[q.id]===opt?theme.primary:"#e2e8f0",color:guestAnswers[q.id]===opt?theme.text:"#64748b"}}>{opt}</button>
                              ))}</div>
                          }
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Further info fields */}
                  {(event.furtherInfo || []).length > 0 && (
                    <div>
                      {(event.furtherInfo || []).map(fi => (
                        <div key={fi.id} style={{ marginBottom: 14 }}>
                          <label style={lbl}>{fi.label}</label>
                          {fi.type === "text"
                            ? <input value={gFurtherInfo[fi.id]||""} onChange={e => setGFurtherInfo(p=>({...p,[fi.id]:e.target.value}))} placeholder={fi.placeholder||""} style={inp} />
                            : <div style={{ display:"flex",flexDirection:"column",gap:6 }}>{(fi.options||[]).map(opt=>(
                                <button key={opt} onClick={()=>setGFurtherInfo(p=>({...p,[fi.id]:opt}))}
                                  style={{...ghostBtn,textAlign:"left",padding:"9px 13px",borderRadius:10,width:"100%",fontSize:13,background:gFurtherInfo[fi.id]===opt?theme.light:"transparent",borderColor:gFurtherInfo[fi.id]===opt?theme.primary:"#e2e8f0",color:gFurtherInfo[fi.id]===opt?theme.text:"#64748b"}}>{opt}</button>
                              ))}</div>
                          }
                        </div>
                      ))}
                    </div>
                  )}

                  {guestError && <p style={{ color: "#e05030", fontSize: 12, marginBottom: 6 }}>{guestError}</p>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setGuestStep(1); setGuestError(""); }} style={{...ghostBtn,flex:1}}>← Back</button>
                    <button onClick={() => { setGuestError(""); setGuestStep(3); }} style={{...primaryBtn,flex:2}}>Next → What to bring</button>
                  </div>
                </div>
              )}

              {guestStep === 3 && (
                <div>
                  <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>Hosted by {event.hostName} — pick what you'll bring to balance things out!</p>
                  {cats.map(cat => {
                    const catCovered = getCatCovered(cat.id);
                    const gap = totalGuests > 0 ? Math.max(0, totalGuests - catCovered) : null;
                    const isCovered = totalGuests > 0 && catCovered >= totalGuests;
                    const alreadySelected = guestItems.some(i => i.cat === cat.id);
                    const locked = isCovered && !alreadySelected;
                    return (
                      <div key={cat.id} style={{ marginBottom: 18, opacity: locked ? 0.5 : 1, transition: "opacity 0.2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: locked ? "#cbd5e1" : "#94a3b8" }}>{cat.emoji} {cat.label}</span>
                          {gap !== null && <span style={{ fontSize: 10, color: gap === 0 ? "#10b981" : "#f59e0b", fontWeight: 700 }}>{gap === 0 ? "✓ covered" : `${gap} more to cover`}</span>}
                        </div>
                        {locked ? (
                          <div style={{ background: "#f8fafc", border: "1px dashed #e2e8f0", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>🙌</span>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>We're all covered here!</div>
                              <div style={{ fontSize: 11, color: "#cbd5e1" }}>This category is sorted — check the others for gaps</div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 7 }}>
                              {cat.items.map(item => {
                                const on = guestItems.find(i => i.cat === cat.id && i.item === item);
                                return (
                                  <button key={item} onClick={() => toggleItem(cat.id, item)}
                                    style={{ padding: "5px 11px", borderRadius: 999, border: `1.5px solid ${on?theme.primary:"#e2e8f0"}`, background: on?theme.light:"#fff", color: on?theme.text:"#64748b", cursor: "pointer", fontFamily: FS, fontSize: 12, fontWeight: on?700:400 }}>
                                    {item}
                                  </button>
                                );
                              })}
                              {cat.includeOther && (() => { const on = guestItems.find(i => i.cat === cat.id && i.item === "Other"); return (
                                <button onClick={() => toggleItem(cat.id, "Other")}
                                  style={{ padding: "5px 11px", borderRadius: 999, border: `1.5px solid ${on?theme.primary:"#e2e8f0"}`, background: on?theme.light:"#fff", color: on?theme.text:"#94a3b8", cursor: "pointer", fontFamily: FS, fontSize: 12, fontStyle: "italic" }}>
                                  + Other
                                </button>
                              ); })()}
                            </div>
                            {/* Other text input */}
                            {guestItems.find(i => i.cat === cat.id && i.item === "Other") && (
                              <div style={{ marginBottom: 7, paddingLeft: 4 }}>
                                <input
                                  value={guestOtherLabels[cat.id] || ""}
                                  onChange={e => setGuestOtherLabels(p => ({ ...p, [cat.id]: e.target.value }))}
                                  placeholder={`What ${cat.label.toLowerCase()} will you bring?`}
                                  style={{ ...inp, fontSize: 12, padding: "7px 10px", background: theme.light, borderColor: theme.mid }}
                                />
                              </div>
                            )}
                            {guestItems.filter(i => i.cat === cat.id).map(i => (
                              <div key={i.item} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, paddingLeft: 4 }}>
                                <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>{i.item}</span>
                                <span style={{ fontSize: 11, color: "#94a3b8" }}>feeds</span>
                                <button onClick={() => setItemServings(cat.id, i.item, i.servings-1)} style={{...cBtn,width:22,height:22,fontSize:12}}>−</button>
                                <span style={{ fontWeight: 700, color: "#1e293b", minWidth: 16, textAlign: "center", fontSize: 13 }}>{i.servings}</span>
                                <button onClick={() => setItemServings(cat.id, i.item, i.servings+1)} style={{...cBtn,width:22,height:22,fontSize:12}}>+</button>
                                <span style={{ fontSize: 11, color: "#94a3b8" }}>ppl</span>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}
                  {guestError && <p style={{ color: "#e05030", fontSize: 12, marginBottom: 6 }}>{guestError}</p>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setGuestStep(2); setGuestError(""); }} style={{...ghostBtn,flex:1}}>← Back</button>
                    <button onClick={submitGuest} style={{...primaryBtn,flex:2}}>🎉 I'm in!</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Noticeboard */}
          {(event.updates || []).length > 0 && (
            <div style={{ ...card, marginTop: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 12 }}>📌 Noticeboard — updates from {event.hostName}</div>
              {[...(event.updates || [])].reverse().map(u => (
                <div key={u.id} style={{ borderBottom: "1px solid #f8fafc", paddingBottom: 10, marginBottom: 10 }}>
                  <p style={{ fontSize: 13, color: "#1e293b", margin: "0 0 4px", lineHeight: 1.5 }}>{u.text}</p>
                  <span style={{ fontSize: 10, color: "#94a3b8" }}>
                    {u.sentAt ? new Date(u.sentAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── HOST DASHBOARD ──
  if (screen === "host") {
    return (
      <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: FS }}>
        {WhosComing}
        <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "0 20px", display: "flex", alignItems: "center", gap: 10, height: 54 }}>
          <button onClick={() => setScreen("event")} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>←</button>
          <span style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>{event.name} · Host Dashboard</span>
        </div>
        {!hostUnlocked ? (
          <div style={{ maxWidth: 340, margin: "70px auto", ...card, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
            <h3 style={{ fontFamily: F, margin: "0 0 5px", color: "#1e293b" }}>Host access</h3>
            <p style={{ color: "#94a3b8", fontSize: 12, margin: "0 0 14px" }}>Demo password: <code style={{ color: theme.text }}>{event.hostPassword}</code></p>
            <input type="password" value={hostPw} onChange={e => { setHostPw(e.target.value); setHostPwError(false); }}
              onKeyDown={e => { if (e.key==="Enter") { if(hostPw===event.hostPassword)setHostUnlocked(true); else setHostPwError(true); }}}
              placeholder="Password" style={{...inp,marginBottom:8,textAlign:"center"}} />
            {hostPwError && <p style={{ color: "#e05030", fontSize: 12, margin: "0 0 8px" }}>Incorrect password</p>}
            <button onClick={() => { if(hostPw===event.hostPassword)setHostUnlocked(true); else setHostPwError(true); }} style={{...primaryBtn,width:"100%"}}>Unlock</button>
          </div>
        ) : (
          <div style={{ maxWidth: 640, margin: "0 auto", padding: "20px 18px 80px" }}>
            {showInviteBlast && <InviteBlast event={event} theme={event.themeId} onClose={() => setShowInviteBlast(false)} />}

            {/* Invite blast CTA */}
            <div style={{ ...card, background: theme.light, border: `1px solid ${theme.mid}`, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 2 }}>💬 Send invite texts</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>Blast the event link to your guest list via SMS before anyone signs up</div>
              </div>
              <button onClick={() => setShowInviteBlast(true)} style={{ ...primaryBtn, fontSize: 13, padding: "9px 18px", flexShrink: 0 }}>Send invites →</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 14 }}>
              {[["RSVPs",guests.length],["Adults",totalAdults],["Teens",totalTeens],["Kids",totalKids],["Reminders",guests.filter(g=>g.reminder).length]].map(([l,v]) => (
                <div key={l} style={{ background: "#fff", borderRadius: 12, border: "1px solid #f1f5f9", padding: "12px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: theme.primary }}>{v}</div>
                  <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase" }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Food tally */}
            <div style={{...card,marginBottom:14}}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 12 }}>Food & drink · ~{totalGuests} people</div>
              {event.categories.map(cat => {
                const covered = getCatCovered(cat.id);
                const liveMap = getLiveItems(cat.id);
                return (
                  <div key={cat.id} style={{ marginBottom: 14 }}>
                    <ServingBar covered={covered} total={totalGuests} label={`${cat.emoji} ${cat.label}`} primary={theme.primary} />
                    {Object.keys(liveMap).length > 0 ? Object.entries(liveMap).map(([item,data]) => (
                      <div key={item} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", paddingLeft: 6, marginBottom: 2 }}>
                        <span>{item}</span><span>{data.families.join(", ")} · for {data.servings}</span>
                      </div>
                    )) : <div style={{ fontSize: 11, color: "#cbd5e1", paddingLeft: 6, fontStyle: "italic" }}>Nothing yet</div>}
                  </div>
                );
              })}
            </div>

            {/* Custom Q answers */}
            {event.customQuestions?.length > 0 && (
              <div style={{...card,marginBottom:14}}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 12 }}>💬 Questions — guest responses</div>
                {event.customQuestions.map(q => (
                  <div key={q.id} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 5 }}>{q.label}</div>
                    {guests.filter(g => g.answers?.[q.id]).map(g => (
                      <div key={g.id} style={{ display: "flex", gap: 8, marginBottom: 3, paddingLeft: 6, alignItems: "center" }}>
                        <span style={{ fontSize: 14 }}>{g.emoji || "😊"}</span>
                        <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 80 }}>{g.familyName}</span>
                        <span style={{ fontSize: 11, color: "#475569" }}>{g.answers[q.id]}</span>
                      </div>
                    ))}
                    {guests.filter(g => g.answers?.[q.id]).length === 0 && <div style={{ fontSize: 11, color: "#cbd5e1", paddingLeft: 6, fontStyle: "italic" }}>No responses yet</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Further Info responses */}
            {event.furtherInfo?.length > 0 && (
              <div style={{...card,marginBottom:14}}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 12 }}>📋 Further Info — overview</div>
                {event.furtherInfo.map(fi => {
                  const responses = guests.filter(g => g.furtherInfoAnswers?.[fi.id]);
                  // For choice fields, show a tally
                  const isTally = fi.type === "choice";
                  const tally = {};
                  if (isTally) {
                    responses.forEach(g => {
                      const ans = g.furtherInfoAnswers[fi.id];
                      tally[ans] = (tally[ans] || 0) + 1;
                    });
                  }
                  return (
                    <div key={fi.id} style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 8 }}>{fi.label}</div>
                      {isTally ? (
                        <div>
                          {(fi.options || []).map(opt => {
                            const count = tally[opt] || 0;
                            const pct = responses.length > 0 ? Math.round((count / responses.length) * 100) : 0;
                            const whoHas = guests.filter(g => g.furtherInfoAnswers?.[fi.id] === opt);
                            return (
                              <div key={opt} style={{ marginBottom: 8 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                  <span style={{ fontSize: 12, color: "#475569" }}>{opt}</span>
                                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{count} {count === 1 ? "person" : "people"}</span>
                                </div>
                                {count > 0 && (
                                  <>
                                    <div style={{ height: 3, background: "#f1f5f9", borderRadius: 99, marginBottom: 4 }}>
                                      <div style={{ height: "100%", width: `${pct}%`, background: theme.primary, borderRadius: 99 }} />
                                    </div>
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingLeft: 4 }}>
                                      {whoHas.map(g => (
                                        <span key={g.id} style={{ fontSize: 11, color: "#94a3b8" }}>{g.emoji || "😊"} {g.familyName}</span>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                          {responses.length === 0 && <div style={{ fontSize: 11, color: "#cbd5e1", fontStyle: "italic" }}>No responses yet</div>}
                        </div>
                      ) : (
                        <div>
                          {responses.map(g => (
                            <div key={g.id} style={{ display: "flex", gap: 8, marginBottom: 3, paddingLeft: 6, alignItems: "center" }}>
                              <span style={{ fontSize: 14 }}>{g.emoji || "😊"}</span>
                              <span style={{ fontSize: 11, color: "#94a3b8", minWidth: 80 }}>{g.familyName}</span>
                              <span style={{ fontSize: 11, color: "#475569" }}>{g.furtherInfoAnswers[fi.id]}</span>
                            </div>
                          ))}
                          {responses.length === 0 && <div style={{ fontSize: 11, color: "#cbd5e1", fontStyle: "italic" }}>No responses yet</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Guest list */}
            <div style={card}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 12 }}>All guests ({guests.length})</div>
              {guests.length === 0 && <p style={{ color: "#cbd5e1", fontStyle: "italic", fontSize: 13 }}>No RSVPs yet.</p>}
              {guests.map((g, i) => (
                <div key={g.id} style={{ borderBottom: i<guests.length-1?"1px solid #f8fafc":"none", paddingBottom: 11, marginBottom: 11 }}>
                  {editingGuest?.id !== g.id ? (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 16 }}>{g.emoji || "😊"}</span>
                          {g.familyName}
                          <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: 11 }}>
                            {g.adults}A{g.teens > 0 ? `+${g.teens}T` : ""}{g.kids > 0 ? `+${g.kids}K` : ""}
                          </span>
                          {g.reminder && <span style={{ color: "#10b981", fontSize: 10 }}>⏰</span>}
                        </div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 1 }}>{g.email}{g.phone ? ` · ${g.phone}` : ""}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{g.items.map(i=>`${i.item} (×${i.servings})`).join(" · ")}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                        <button onClick={() => setEditingGuest({...g})} style={{ padding: "3px 9px", borderRadius: 999, border: `1px solid ${theme.mid}`, background: "transparent", color: theme.text, cursor: "pointer", fontFamily: FS, fontSize: 10 }}>Edit</button>
                        <button onClick={async () => { if(window.confirm(`Remove ${g.familyName}?`)) await persist({...appData,guests:guests.filter(x=>x.id!==g.id)}); }}
                          style={{ padding: "3px 9px", borderRadius: 999, border: "1px solid #fecaca", background: "transparent", color: "#e05030", cursor: "pointer", fontFamily: FS, fontSize: 10 }}>Remove</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12 }}>
                      <label style={lbl}>Name</label>
                      <input value={editingGuest.familyName} onChange={e => setEditingGuest(p=>({...p,familyName:e.target.value}))} style={{...inp,marginBottom:8,fontSize:13}} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
                        {[["Adults","adults",1],["Teens (12-18)","teens",0],["Kids","kids",0]].map(([l,f,min]) => (
                          <div key={f}>
                            <label style={{ ...lbl, fontSize: 9 }}>{l}</label>
                            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                              <button onClick={() => setEditingGuest(p=>({...p,[f]:Math.max(min,(p[f]||0)-1)}))} style={{...cBtn,width:22,height:22,fontSize:12}}>−</button>
                              <span style={{ fontWeight: 700, color: "#1e293b", minWidth: 16, textAlign: "center", fontSize: 13 }}>{editingGuest[f] || 0}</span>
                              <button onClick={() => setEditingGuest(p=>({...p,[f]:(p[f]||0)+1}))} style={{...cBtn,width:22,height:22,fontSize:12}}>+</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: 7 }}>
                        <button onClick={() => setEditingGuest(null)} style={{...ghostBtn,flex:1,fontSize:12}}>Cancel</button>
                        <button onClick={async () => { await persist({...appData,guests:guests.map(x=>x.id===editingGuest.id?editingGuest:x)}); setEditingGuest(null); }} style={{...primaryBtn,flex:2,fontSize:12}}>Save</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {guests.length > 0 && (
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <button onClick={() => {
                    const rows = [
                      ["Name","Email","Phone","Adults","Teens","Kids","Reminder","Items","Dietary","Arrival"],
                      ...guests.map(g => [
                        g.familyName, g.email||"", g.phone||"",
                        g.adults, g.teens||0, g.kids,
                        g.reminder?"Yes":"No",
                        (g.items||[]).map(i=>`${i.item}(×${i.servings})`).join("; "),
                        g.answers?.q1||"",
                        g.furtherInfoAnswers?.fi1||""
                      ])
                    ];
                    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
                    const blob = new Blob([csv], {type:"text/csv"});
                    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
                    a.download = `${event.name.replace(/\s+/g,"-")}-guests.csv`; a.click();
                  }} style={{...ghostBtn,fontSize:11,padding:"6px 12px"}}>📥 Export CSV</button>
                  <button onClick={async () => { if(window.confirm("Clear all guest data?")) await persist({...appData,guests:[]}); }}
                    style={{...ghostBtn,color:"#e05030",borderColor:"#fecaca",fontSize:11,padding:"6px 12px"}}>🗑 Clear all</button>
                </div>
              )}
            </div>

            {/* Broadcast email + noticeboard */}
            <div style={{...card}}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 12 }}>📌 Noticeboard &amp; Broadcast</div>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px" }}>Post an update — it'll appear on the event noticeboard and be emailed to all guests who provided an email.</p>
              {(event.updates||[]).length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  {[...(event.updates||[])].reverse().map(u => (
                    <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, padding: "8px 0", borderBottom: "1px solid #f8fafc" }}>
                      <div>
                        <p style={{ fontSize: 12, color: "#1e293b", margin: "0 0 2px" }}>{u.text}</p>
                        <span style={{ fontSize: 10, color: "#94a3b8" }}>{u.sentAt ? new Date(u.sentAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}</span>
                      </div>
                      <button onClick={() => persist({...appData, event: {...event, updates: (event.updates||[]).filter(x=>x.id!==u.id)}})}
                        style={{ background:"none",border:"none",cursor:"pointer",color:"#e05030",fontSize:12,flexShrink:0 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              {!broadcastSent ? (
                <div>
                  <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)}
                    placeholder="e.g. We'll be opening the pool — don't forget your swimmers! 🏊"
                    rows={3} style={{...inp, resize:"vertical", marginBottom:8, fontSize:13}} />
                  <button onClick={() => {
                    if (!broadcastMsg.trim()) return;
                    const update = { id: Date.now(), text: broadcastMsg.trim(), sentAt: new Date().toISOString() };
                    persist({...appData, event: {...event, updates: [...(event.updates||[]), update]}});
                    setBroadcastMsg("");
                    setBroadcastSent(true);
                    setTimeout(() => setBroadcastSent(false), 3000);
                  }} style={{...primaryBtn, fontSize:13}}>📣 Post update &amp; send to guests</button>
                </div>
              ) : (
                <div style={{ background: "#ecfdf5", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#10b981", textAlign: "center" }}>
                  ✓ Update posted to noticeboard and emailed to {guests.filter(g=>g.email).length} guests!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
}
