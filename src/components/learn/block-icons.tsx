import { createElement } from "react";
import {
  Activity, AlarmClock, Anchor, ArrowDown, ArrowLeftRight, ArrowRight, ArrowUp, ArrowUpDown, Ban, BarChart3, Bell, Blocks,
  BookOpen, Bot, Boxes, Brain, Briefcase, Bug, Building2, Calculator, Calendar, Camera, CheckCircle2, CheckSquare,
  ChefHat, Circle, CircleAlert, CircleDot, CircleHelp, Clipboard, Clock, Cloud, Code2, Cog, Compass, Container, Cpu,
  CreditCard, Database, DollarSign, DoorOpen, Drama, Droplets, Eye, Factory, FileText, Filter, Fingerprint,
  Flag, FlaskConical, Folder, FolderOpen, Gauge, GitBranch, Gift, Globe, GraduationCap, Hammer, Hand, HardDrive,
  Hash, Headphones, Heart, History, Hourglass, IdCard, Image, Inbox, KeyRound, Keyboard, Landmark, Layers, Layout,
  Leaf, Library, Lightbulb, Link2, Lock, LockOpen, LucideIcon, Mail, Map, MapPin, Megaphone,
  MessageSquare, Mic, Minus, Monitor, Moon, Mountain, Network, NotebookPen, Package, Paintbrush, Paperclip, PenLine,
  Phone, PiggyBank, Pin, Plane, Play, Plug, Plus, Puzzle, Radio, Receipt, Recycle, Repeat, Rocket, Route, Ruler,
  Scale, Scissors, ScrollText, Search, Send, Server, Settings, Shield, ShieldCheck, ShoppingCart, Shuffle, SlidersHorizontal,
  Smartphone, Snowflake, Sparkles, Sprout, Siren, Split, SquareStack, Star, Store, Tag, Target, Terminal, Ticket,
  Timer, TrafficCone, Train, TreePine, TrendingDown, TrendingUp, Trash2, Trophy, Truck, Type, Undo2, Upload, User,
  UserCheck, Users, Utensils, Wallet, Waves, Wifi, Wrench, X, Zap, Sun, Moon as Night, Feather, Construction, Telescope,
  Microscope, Dice5, Bird, Turtle, Rabbit, Dog, Cat, Fish, Snail, Car, Bus, Ship, Wind, Flame, Sigma, Brush, Volume2,
  Satellite, Siren as Alarm, MousePointer2, Printer, Film, Music, Coffee, Accessibility, Sparkle, Link, PackageOpen, Egg, Swords, Medal, Crosshair, Check, Square, List, Pause, Redo2,
} from "lucide-react";

/** Lesson visuals store decorative icons as emoji. They render through this map as Lucide icons instead. */
const MAP: Record<string, LucideIcon> = {
  "📦": Package, "⚡": Zap, "🎯": Target, "🗄️": Database, "🧪": FlaskConical, "🔗": Link2, "🔁": Repeat, "✅": CheckCircle2,
  "🧱": Blocks, "🔢": Hash, "🖥️": Server, "🧠": Brain, "🔒": Lock, "⚖️": Scale, "🌐": Globe, "🧭": Compass, "📝": NotebookPen,
  "🏷️": Tag, "🧾": Receipt, "🧮": Calculator, "🤖": Bot, "🔍": Search, "🧩": Puzzle, "🔑": KeyRound, "📈": TrendingUp,
  "🚀": Rocket, "✍️": PenLine, "🪣": Container, "🔘": CircleDot, "🔐": Lock, "⚙️": Settings, "🛡️": Shield, "🚪": DoorOpen,
  "🔎": Search, "📏": Ruler, "☑️": CheckSquare, "📜": ScrollText, "📚": Library, "📋": Clipboard, "📄": FileText,
  "🌍": Globe, "🌊": Waves, "🙋": User, "🙋‍♀️": User, "🏢": Building2, "🔌": Plug, "📊": BarChart3, "🐞": Bug, "🐛": Bug,
  "⏳": Hourglass, "⌛": Hourglass, "🔀": Shuffle, "📥": Inbox, "🧑‍💻": Code2, "👩‍💻": Code2, "🏗️": Construction,
  "⏱️": Timer, "⏲️": Timer, "🧊": Snowflake, "❄️": Snowflake, "🗂️": Folder, "☁️": Cloud, "🏛️": Landmark, "🎲": Dice5,
  "🎭": Drama, "🎤": Mic, "🎙️": Mic, "📱": Smartphone, "💻": Monitor, "✂️": Scissors, "🪪": IdCard, "🧹": Trash2,
  "📬": Mail, "📮": Mail, "📐": Ruler, "💬": MessageSquare, "🗣️": Megaphone, "🏁": Flag, "🚩": Flag, "❓": CircleHelp,
  "🛠️": Wrench, "🔧": Wrench, "🚫": Ban, "⛔": Ban, "🛑": Ban, "🚚": Truck, "📨": Send, "📤": Upload, "🧵": GitBranch,
  "🧰": Briefcase, "📸": Camera, "📅": Calendar, "🗓️": Calendar, "💾": HardDrive, "💽": HardDrive, "💵": DollarSign,
  "💰": PiggyBank, "💸": Wallet, "💳": CreditCard, "🐳": Container, "🐢": Turtle, "🌿": Leaf, "🍃": Leaf, "🤝": Users,
  "🛒": ShoppingCart, "🛍️": ShoppingCart, "🚦": TrafficCone, "🗝️": KeyRound, "🔤": Type, "📣": Megaphone, "📢": Megaphone,
  "🎨": Paintbrush, "🖌️": Brush, "🌱": Sprout, "🧯": Flame, "🔥": Flame, "🧬": Network, "🚨": Siren, "🖼️": Image,
  "🕳️": Circle, "🔨": Hammer, "💥": Zap, "💡": Lightbulb, "👥": Users, "👤": User, "🏭": Factory, "🎛️": SlidersHorizontal,
  "🎚️": SlidersHorizontal, "✨": Sparkles, "🪞": Layers, "🩺": Activity, "🗃️": Boxes, "🏔️": Mountain, "⛰️": Mountain,
  "🌳": TreePine, "🌲": TreePine, "🌀": Wind, "🛟": Shield, "🗺️": Map, "📡": Satellite, "🛰️": Satellite, "📒": BookOpen,
  "📖": BookOpen, "📓": BookOpen, "📗": BookOpen, "📁": Folder, "📂": FolderOpen, "👩‍🍳": ChefHat, "🧑‍🍳": ChefHat,
  "🐍": Code2, "🎟️": Ticket, "🎫": Ticket, "🍽️": Utensils, "✏️": PenLine, "✋": Hand, "👋": Hand, "⌨️": Keyboard,
  "🟢": Circle, "🕸️": Network, "🔔": Bell, "🔓": LockOpen, "🔄": Repeat, "♻️": Recycle, "📎": Paperclip, "📌": Pin,
  "📍": MapPin, "💤": Moon, "👀": Eye, "👁️": Eye, "🏋️": Activity, "🎁": Gift, "➕": Plus, "➖": Minus, "↩️": Undo2,
  "↔️": ArrowLeftRight, "↕️": ArrowUpDown, "🪶": Feather, "🪟": Layout, "🧺": Boxes, "🧳": Briefcase, "💼": Briefcase,
  "🚧": Construction, "🚌": Bus, "🗑️": Trash2, "🕵️": Search, "🔮": Sparkle, "🔭": Telescope, "🔬": Microscope,
  "🐘": Database, "🏦": Landmark, "🏠": Building2, "🌗": Night, "🌙": Night, "⬇️": ArrowDown, "⬆️": ArrowUp,
  "➡️": ArrowRight, "☸️": Cog, "⎈": Cog, "▶️": Play, "🛣️": Route, "🚢": Ship, "🔊": Volume2, "📞": Phone, "☎️": Phone,
  "🐕": Dog, "🐶": Dog, "🎮": Play, "🎞️": Film, "🎬": Film, "🌉": Route, "⚛️": Cpu, "🖱️": MousePointer2, "📑": FileText,
  "📉": TrendingDown, "🏆": Trophy, "🎼": Music, "🍳": ChefHat, "☕": Coffee, "♿": Accessibility, "⏰": AlarmClock,
  "🕐": Clock, "🕰️": Clock, "🖨️": Printer, "🚗": Car, "🚇": Train, "🚂": Train, "🐇": Rabbit, "🐌": Snail, "🐈": Cat,
  "🐬": Fish, "🐦": Bird, "🐤": Bird, "🦆": Bird, "⚠️": CircleAlert, "❗": CircleAlert, "❌": X, "❤️": Heart, "💧": Droplets,
  "📰": FileText, "🗒️": NotebookPen, "🧑‍⚖️": Scale, "🛂": UserCheck, "🌡️": Gauge, "📶": Wifi, "⚓": Anchor, "🔏": Fingerprint,
  "🧑‍🏫": GraduationCap, "🎧": Headphones, "⛓️": Link, "🪢": Link, "🔚": Flag, "🔖": Tag, "🃏": SquareStack, "♾️": Repeat,
  "🌈": Sparkles, "🆕": Sparkle, "📺": Monitor, "📹": Camera, "⏪": History, "🧲": Filter, "🪜": ArrowUp, "🧷": Paperclip,
  "🗜️": Minus, "🏬": Store, "🏪": Store, "☠️": CircleAlert, "🪂": Plane, "🚶": User, "🛎️": Bell, "💎": Star,
  "🐣": Egg, "🐉": Swords, "⚔️": Swords, "🗡️": Swords, "🎓": GraduationCap, "🏅": Medal, "🥇": Medal, "🎖️": Medal, "⭐": Star, "🌟": Star,
  "🎳": Crosshair, "✓": Check, "✔": Check, "✗": X, "✕": X, "✖": X, "○": Circle, "☐": Square, "☑": CheckSquare, "☰": List, "⏸": Pause, "▶": Play, "🖤": Heart, "★": Star, "✂": Scissors, "↷": Redo2, "🧗": Mountain, "🪐": Globe, "🌌": Sparkles, "🏃": Activity, "🕹️": Play, "🎰": Dice5,
};

const MARK_LABEL: Record<string, string> = { "✓": "correct", "✔": "correct", "✅": "correct", "✗": "incorrect", "✕": "incorrect", "✖": "incorrect", "✘": "incorrect", "❌": "incorrect" };

/** Pictographs, keycaps and regional-indicator pairs (flag emoji). */
const EMOJI = /\p{Extended_Pictographic}|\u20e3|\p{Regional_Indicator}/u;
const KEYCAP = /^([0-9#])\ufe0f?\u20e3$/u;

/** A Lucide icon for an emoji, or null when the string is plain text (λ, ▲, $) that should render as is. */
export function iconFor(icon: string): LucideIcon | "keycap" | null {
  if (KEYCAP.test(icon)) return "keycap";
  if (MAP[icon]) return MAP[icon];
  if (!EMOJI.test(icon)) return null;
  return MAP[icon] ?? MAP[icon.replace(/\ufe0f/g, "")] ?? MAP[`${icon.replace(/\ufe0f/g, "")}\ufe0f`] ?? CircleDot;
}

/** Decorative icon for a lesson picture card: Lucide for emoji, the glyph itself for plain text symbols. */
export function BlockIcon({ icon, className = "size-6" }: { icon: string; className?: string }) {
  const I = iconFor(icon);
  if (I === "keycap")
    return <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-md border border-border font-mono text-base font-semibold">{icon.match(KEYCAP)![1]}</span>;
  if (!I) return <span aria-hidden="true" className="font-mono text-xl font-semibold">{icon}</span>;
  // Right/wrong marks carry meaning, so they keep a text alternative; every other icon is decorative.
  const label = MARK_LABEL[icon];
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };
  return createElement(I, { ...a11y, className: `${className} text-primary`, strokeWidth: 1.75 });
}

export { EMOJI as EMOJI_PATTERN };

const LEADING = new RegExp(`^(?:(?:${EMOJI.source})[\\uFE0F\\u200D]*\\s*)+`, "u");

/** Text that may start with an emoji ("🔑 Who gets a key"): the emoji becomes its Lucide icon. */
export function IconText({ text }: { text: string }) {
  const m = text.match(LEADING);
  if (!m) return <>{text}</>;
  const lead = m[0].match(EMOJI)![0];
  return (
    <>
      <BlockIcon icon={lead} className="mr-1 inline-block size-[1.1em] align-[-0.15em]" />
      {text.slice(m[0].length)}
    </>
  );
}
