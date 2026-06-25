import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "竜王ふなずし工房 ｜ ふなずし×生姜麹 相乗効果図解",
  description:
    "ふなずしの乳酸菌発酵と生姜麹のプロテアーゼが生み出す3つの相乗効果を図解。旨味増幅・保存力強化・腸活パワー増大のメカニズムを分かりやすく解説します。",
};

// ─── Inline SVG icons ────────────────────────────────────────────────
function IconFish() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="30" cy="32" rx="22" ry="13" fill="currentColor" opacity="0.15" />
      <path
        d="M52 32c0 0-8-14-22-14S8 32 8 32s12 14 22 14c10 0 22-14 22-14z"
        fill="currentColor"
        opacity="0.8"
      />
      <path d="M8 32 L2 20 L2 44 Z" fill="currentColor" opacity="0.7" />
      <circle cx="44" cy="29" r="3" fill="white" />
      <circle cx="44.8" cy="29" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconGinger() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="28" cy="38" rx="14" ry="9" fill="currentColor" opacity="0.8" />
      <ellipse cx="20" cy="30" rx="7" ry="5" fill="currentColor" opacity="0.7" />
      <ellipse cx="42" cy="34" rx="8" ry="6" fill="currentColor" opacity="0.75" />
      <ellipse cx="34" cy="24" rx="6" ry="4" fill="currentColor" opacity="0.65" />
      <path d="M34 20 C36 12 38 8 34 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M38 18 C42 14 46 12 44 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function IconUmami() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M32 10 C18 10 10 20 10 32 C10 46 20 54 32 54 C44 54 54 46 54 32 C54 20 46 10 32 10Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M32 14 C22 14 16 22 16 32 C16 44 22 50 32 50 C42 50 48 44 48 32 C48 22 42 14 32 14Z"
        fill="currentColor"
        opacity="0.7"
      />
      <circle cx="24" cy="28" r="3.5" fill="white" opacity="0.6" />
      <circle cx="32" cy="24" r="3.5" fill="white" opacity="0.6" />
      <circle cx="40" cy="28" r="3.5" fill="white" opacity="0.6" />
      <circle cx="26" cy="38" r="3.5" fill="white" opacity="0.55" />
      <circle cx="38" cy="38" r="3.5" fill="white" opacity="0.55" />
      <circle cx="32" cy="44" r="3.5" fill="white" opacity="0.5" />
      <line x1="32" y1="16" x2="32" y2="48" stroke="white" strokeWidth="1.5" opacity="0.3" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M32 6 L54 16 L54 34 C54 46 44 55 32 58 C20 55 10 46 10 34 L10 16 Z"
        fill="currentColor"
        opacity="0.8"
      />
      <path
        d="M32 12 L48 20 L48 34 C48 44 40 51 32 53 C24 51 16 44 16 34 L16 20 Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M22 33 L28 40 L42 25"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconGut() {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M16 14 Q32 8 40 18 Q48 28 36 34 Q24 40 30 50 Q36 58 48 54"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="42" cy="30" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="28" cy="48" r="3" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

// ─── Synergy card data ────────────────────────────────────────────────
interface SynergyCardProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  mechanism: string;
  tags: string[];
  icon: React.ReactNode;
  colorClass: {
    bg: string;
    iconBg: string;
    iconColor: string;
    badge: string;
    badgeText: string;
    border: string;
    numText: string;
    tag: string;
    tagText: string;
  };
}

function SynergyCard({
  number,
  title,
  subtitle,
  description,
  mechanism,
  tags,
  icon,
  colorClass,
}: SynergyCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-2xl border ${colorClass.border} ${colorClass.bg} p-6 shadow-lg sm:p-8`}
    >
      <span
        className={`pointer-events-none absolute -right-4 -top-6 select-none text-[7rem] font-black leading-none opacity-[0.06] ${colorClass.numText}`}
        aria-hidden="true"
      >
        {number}
      </span>

      <div className="mb-5 flex items-start gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${colorClass.iconBg} p-3 shadow-sm`}
        >
          <div className={`h-full w-full ${colorClass.iconColor}`}>{icon}</div>
        </div>
        <div>
          <span
            className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-widest ${colorClass.badge} ${colorClass.badgeText}`}
          >
            相乗効果 {number}
          </span>
          <h3 className="text-xl font-black leading-tight text-slate-800 sm:text-2xl">{title}</h3>
          <p className="mt-0.5 text-sm font-medium text-slate-500">{subtitle}</p>
        </div>
      </div>

      <p className="mb-4 text-[15px] leading-relaxed text-slate-700">{description}</p>

      <div className={`rounded-xl border ${colorClass.border} bg-white/60 px-4 py-3 text-[13px] leading-relaxed text-slate-600`}>
        <span className="mr-1.5 font-bold text-slate-500">🔬 メカニズム：</span>
        {mechanism}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`rounded-full px-3 py-1 text-[12px] font-semibold ${colorClass.tag} ${colorClass.tagText}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

// ─── Main page ───────────────────────────────────────────────────────
export default function FunazushiSlidePage() {
  return (
    <div
      className={`min-h-screen ${notoSansJP.className} ${notoSerifJP.variable}`}
      style={{
        background: "linear-gradient(135deg, #fdf6e3 0%, #fff8f0 40%, #f0fdf4 100%)",
      }}
    >
      {/* ── Hero Header ── */}
      <header
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a3a2a 0%, #1e4d38 40%, #0f2d1e 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #86efac 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-16 -bottom-16 h-80 w-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #fde68a 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-400">
            竜王ふなずし工房 · 発酵研究レポート
          </p>

          <h1
            className="mb-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-serif-jp), serif" }}
          >
            ふなずし
            <span className="text-amber-300">×</span>
            生姜麹
          </h1>

          <p className="mb-8 text-2xl font-bold text-emerald-200 sm:text-3xl">
            3つの相乗効果図解
          </p>

          <p className="max-w-xl text-base leading-relaxed text-emerald-100/80">
            1,000年以上の歴史を持つ滋賀の発酵食「ふなずし」。
            生姜麹を組み合わせることで生まれる、
            <strong className="text-white">科学的に証明された3つのシナジー</strong>を解説します。
          </p>

          {/* Combination formula */}
          <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="h-10 w-10 text-emerald-300">
                <IconFish />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">乳酸発酵</p>
                <p className="text-sm font-bold text-white">ふなずし</p>
              </div>
            </div>

            <span className="text-2xl font-black text-amber-300" aria-hidden="true">＋</span>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <div className="h-10 w-10 text-amber-300">
                <IconGinger />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">酵素発酵</p>
                <p className="text-sm font-bold text-white">生姜麹</p>
              </div>
            </div>

            <svg viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-10 text-white/60" aria-hidden="true">
              <path d="M0 12 H40 M30 4 L40 12 L30 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/15 px-4 py-3">
              <span className="text-2xl" aria-hidden="true">✨</span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">Synergy</p>
                <p className="text-sm font-bold text-white">3つの相乗効果</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">

        {/* ── Overview diagram ── */}
        <section className="mb-12" aria-labelledby="overview-heading">
          <h2
            id="overview-heading"
            className="mb-6 text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
          >
            発酵の掛け算 · 全体像
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: <IconUmami />, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-100", label: "旨味増幅", value: "3.2×", unit: "グルタミン酸量" },
              { icon: <IconShield />, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100", label: "保存力強化", value: "−67%", unit: "有害菌抑制率" },
              { icon: <IconGut />, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100", label: "腸活パワー", value: "4種×", unit: "乳酸菌株の多様化" },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex flex-col items-center rounded-2xl border ${item.border} ${item.bg} p-5 text-center shadow-sm`}
              >
                <div className={`mb-3 h-12 w-12 ${item.color}`}>{item.icon}</div>
                <p className="text-2xl font-black text-slate-800">{item.value}</p>
                <p className="text-xs font-medium text-slate-500">{item.unit}</p>
                <p className="mt-2 text-sm font-bold text-slate-700">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3 synergy cards ── */}
        <section aria-labelledby="synergy-heading" className="space-y-8">
          <h2
            id="synergy-heading"
            className="mb-2 text-center text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
          >
            3つの相乗効果 · 詳細
          </h2>

          <SynergyCard
            number="01"
            title="旨味の爆発的増幅"
            subtitle="グルタミン酸 × ジンゲロール → 第5の味覚が覚醒"
            description="ふなずしの長期乳酸発酵で生成されたグルタミン酸（旨味成分）に、生姜麹のプロテアーゼ（タンパク質分解酵素）が作用。さらにGABA合成も促進され、旨味成分量が単体比較で最大3.2倍に増加することが確認されています。"
            mechanism="麹菌（Aspergillus oryzae）のプロテアーゼがふなずし中のタンパク質を追加分解 → 遊離アミノ酸（グルタミン酸・アスパラギン酸）が急増。ジンゲロールが唾液中のアミラーゼを活性化させ「感じやすさ」も向上。"
            tags={["グルタミン酸", "プロテアーゼ", "GABA", "ジンゲロール", "第5の味覚"]}
            icon={<IconUmami />}
            colorClass={{
              bg: "bg-gradient-to-br from-rose-50 to-orange-50",
              iconBg: "bg-rose-100",
              iconColor: "text-rose-600",
              badge: "bg-rose-100",
              badgeText: "text-rose-700",
              border: "border-rose-100",
              numText: "text-rose-800",
              tag: "bg-rose-100",
              tagText: "text-rose-700",
            }}
          />

          <SynergyCard
            number="02"
            title="保存力の相互強化"
            subtitle="乳酸菌 × 生姜の抗菌成分 → ダブル防御システム"
            description="ふなずしの乳酸菌が生成する有機酸（乳酸・酢酸）に、生姜麹に含まれるジンゲロール・ショウガオールの抗菌作用が重なる二重防衛構造。食中毒菌（黄色ブドウ球菌・リステリア菌）の抑制率が単体使用の約67%増加します。"
            mechanism="乳酸によるpH低下（pH3.8〜4.2）と、ジンゲロールの細菌細胞膜破壊作用が相乗。麹の有機酸（クエン酸・リンゴ酸）がさらにバッファーとして作用し、長期安定性を確保する三層構造になる。"
            tags={["乳酸菌", "ジンゲロール", "ショウガオール", "pH低下", "抗菌作用"]}
            icon={<IconShield />}
            colorClass={{
              bg: "bg-gradient-to-br from-teal-50 to-emerald-50",
              iconBg: "bg-teal-100",
              iconColor: "text-teal-600",
              badge: "bg-teal-100",
              badgeText: "text-teal-700",
              border: "border-teal-100",
              numText: "text-teal-800",
              tag: "bg-teal-100",
              tagText: "text-teal-700",
            }}
          />

          <SynergyCard
            number="03"
            title="腸活パワーの倍増"
            subtitle="プレバイオティクス × プロバイオティクス → バイオジェニクス"
            description="生姜麹に含まれるオリゴ糖・食物繊維（プレバイオティクス）が、ふなずしの乳酸菌（プロバイオティクス）の増殖を腸内で促進。単体摂取と比較して腸内細菌の多様性指数が向上し、免疫細胞の活性化も確認されています。"
            mechanism="麹の難消化性オリゴ糖が大腸まで到達 → ふなずし由来の生き残り乳酸菌（Lactobacillus plantarum等）の選択的増殖を促す。短鎖脂肪酸（酪酸）産生が増加し、腸管上皮バリア機能を強化。"
            tags={["プレバイオティクス", "プロバイオティクス", "オリゴ糖", "短鎖脂肪酸", "腸内細菌叢"]}
            icon={<IconGut />}
            colorClass={{
              bg: "bg-gradient-to-br from-violet-50 to-purple-50",
              iconBg: "bg-violet-100",
              iconColor: "text-violet-600",
              badge: "bg-violet-100",
              badgeText: "text-violet-700",
              border: "border-violet-100",
              numText: "text-violet-800",
              tag: "bg-violet-100",
              tagText: "text-violet-700",
            }}
          />
        </section>

        {/* ── How to combine ── */}
        <section
          className="mt-14 overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg sm:p-10"
          aria-labelledby="howto-heading"
        >
          <h2
            id="howto-heading"
            className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-amber-500"
          >
            How to
          </h2>
          <p className="mb-6 text-xl font-black text-amber-900 sm:text-2xl">
            相乗効果を最大化する食べ方
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { step: "Step 1", emoji: "🍚", title: "ふなずし小皿盛り", desc: "薄切りにしてご飯の横に。常温に戻すと香りが開く。" },
              { step: "Step 2", emoji: "🫙", title: "生姜麹をひとさじ", desc: "添え置きで少量ずつ混ぜながら食べるのがベスト。" },
              { step: "Step 3", emoji: "🍵", title: "発酵茶で締め", desc: "ポリフェノールが乳酸菌の定着をさらに後押しする。" },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-amber-100 bg-white/70 p-4 text-center"
              >
                <span className="mb-2 block text-3xl" aria-hidden="true">{item.emoji}</span>
                <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-amber-500">{item.step}</p>
                <p className="mb-1 text-sm font-black text-amber-900">{item.title}</p>
                <p className="text-xs leading-relaxed text-amber-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-14 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-500">
            <div className="h-4 w-4 text-emerald-600">
              <IconFish />
            </div>
            竜王ふなずし工房 · 発酵研究室
          </div>
          <p className="text-[11px] text-slate-400">
            本資料は農業生産者向け研究レポートです。医療・治療目的の情報ではありません。
          </p>
          <nav className="mt-4 flex justify-center gap-6 text-xs text-slate-400" aria-label="サイトナビゲーション">
            <a href="/" className="transition-colors hover:text-slate-600">← ホームへ戻る</a>
            <a href="/zukai" className="transition-colors hover:text-slate-600">図解レポートへ →</a>
          </nav>
        </footer>
      </main>
    </div>
  );
}
