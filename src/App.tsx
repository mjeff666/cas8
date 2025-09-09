import React, { useMemo, useState } from "react";

type Casino = {
  id: string; rank: number; name: string; logo: string; domain: string; rating: number; bonus: string;
  payoutSpeed: string; games: number; minDeposit: string; support: string; license: string;
  pros: string[]; cons: string[]; tags: string[];
};

const casinos: Casino[] = [
  { id: "casino777", rank: 1, name: "Casino777.lv", logo: "/logos/casino777.png", domain: "https://casino777.lv", rating: 5.0, bonus: "До 200% и до 150 фриспинов", payoutSpeed: "Моментально", games: 5000, minDeposit: "€10", support: "24/7 Live Chat", license: "IAUI (Latvia)", pros: ["Моментальная верификация","Щедрые акции","Удобная мобильная версия"], cons: ["Не все провайдеры доступны из EU без VPN"], tags: ["Latvia","Top Pick","Fast Payouts"] },
  { id: "luckybet", rank: 2, name: "LuckyBet.lv", logo: "/logos/luckybet.png", domain: "https://luckybet.lv", rating: 5.0, bonus: "150% до €300", payoutSpeed: "До 3 часов", games: 2700, minDeposit: "€10", support: "24/7 Live Chat", license: "IAUI (Latvia)", pros: ["Топ-2 в Латвии","Стабильные выплаты","Удобные лимиты"], cons: ["Высокая нагрузка по вечерам"], tags: ["Latvia","Editor’s Choice"] },
  { id: "optibet", rank: 3, name: "Optibet.lv", logo: "/logos/optibet.png", domain: "https://www.optibet.lv", rating: 3.4, bonus: "До €100", payoutSpeed: "1–2 дня", games: 1800, minDeposit: "€20", support: "10:00–22:00", license: "IAUI (Latvia)", pros: ["Известный бренд"], cons: ["Средние бонусы"], tags: ["Latvia"] },
  { id: "11lv", rank: 4, name: "11.lv", logo: "/logos/11lv.png", domain: "https://www.11.lv", rating: 3.2, bonus: "Фриспины на старте", payoutSpeed: "1–3 дня", games: 1500, minDeposit: "€10", support: "10:00–22:00", license: "IAUI (Latvia)", pros: ["Простой интерфейс"], cons: ["Небольшой выбор игр"], tags: ["Latvia"] },
  { id: "betsafe", rank: 5, name: "Betsafe.lv", logo: "/logos/betsafe.png", domain: "https://www.betsafe.lv", rating: 3.0, bonus: "€50 на депозит", payoutSpeed: "1–3 дня", games: 1700, minDeposit: "€10", support: "Ежедневно", license: "IAUI (Latvia)", pros: ["Надёжный оператор"], cons: ["Обычные условия"], tags: ["Latvia"] },
  { id: "pafbet", rank: 6, name: "Pafbet.lv", logo: "/logos/pafbet.png", domain: "https://www.pafbet.lv", rating: 2.9, bonus: "До €50", payoutSpeed: "2–3 дня", games: 1200, minDeposit: "€10", support: "9:00-20:00", license: "IAUI (Latvia)", pros: ["Социальная ответственность"], cons: ["Мало провайдеров"], tags: ["Latvia"] },
  { id: "fenikss", rank: 7, name: "FenikssCasino.lv", logo: "/logos/fenikss.png", domain: "https://feniksscasino.lv", rating: 2.8, bonus: "Стартовый пакет", payoutSpeed: "2–4 дня", games: 900, minDeposit: "€10", support: "9:00-20:00", license: "IAUI (Latvia)", pros: ["Известная сеть залов"], cons: ["Слабый онлайн-фокус"], tags: ["Latvia"] },
  { id: "olybet", rank: 8, name: "OlyBet.lv", logo: "/logos/olybet.png", domain: "https://www.olybet.lv", rating: 3.1, bonus: "€100 на спорт/казино", payoutSpeed: "1–3 дня", games: 1600, minDeposit: "€10", support: "Ежедневно", license: "IAUI (Latvia)", pros: ["Хороший спортбук"], cons: ["Среднее казино"], tags: ["Latvia"] },
  { id: "klondaika", rank: 9, name: "Klondaika.lv", logo: "/logos/klondaika.png", domain: "https://www.klondaika.lv", rating: 2.7, bonus: "До €30", payoutSpeed: "2–4 дня", games: 800, minDeposit: "€10", support: "8:00-22:00", license: "IAUI (Latvia)", pros: ["Простая навигация"], cons: ["Мало игр"], tags: ["Latvia"] },
  { id: "tonybet", rank: 10, name: "TonyBet.lv", logo: "/logos/tonybet.png", domain: "https://tonybet.lv", rating: 2.5, bonus: "Фриспины", payoutSpeed: "2–4 дня", games: 1000, minDeposit: "€10", support: "Ежедневно", license: "IAUI (Latvia)", pros: ["Широкие лимиты на спорт"], cons: ["Бонусы скромные"], tags: ["Latvia"] },
];

const payoutHours = (label: string) => {
  const d = label.toLowerCase();
  const m = d.match(/до\s*(\d+)\s*час/);
  if (m) return parseInt(m[1]);
  if (d.includes("1–2 дня")) return 36;
  if (d.includes("1–3 дня")) return 54;
  if (d.includes("2–3 дня")) return 60;
  if (d.includes("2–4 дня")) return 78;
  return 48;
};

const StarIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-4 w-4 ${filled ? "fill-yellow-400" : "fill-transparent"}`} stroke="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
);

const RatingStars = ({ value }: { value: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < full || (i === full && half)} />
      ))}
      <span className="ml-2 text-sm font-medium">{value.toFixed(1)}</span>
    </div>
  );
};

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90">{children}</span>
);

const SimpleBarChart: React.FC<{ data: { label: string; value: number }[]; max?: number; caption?: string; reverseBetter?: boolean; unit?: string }> = ({ data, max, caption, reverseBetter = false, unit }) => {
  const m = max ?? Math.max(1, ...data.map(d => d.value));
  return (
    <div>
      {caption && <div className="mb-2 text-xs text-white/60">{caption}</div>}
      <div className="h-48 w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
        <div className="flex h-full items-end gap-2">
          {data.map((d, i) => {
            const h = Math.max(4, Math.round((d.value / m) * 100));
            return (
              <div key={i} className="flex flex-1 flex-col items-center justify-end">
                <div className={`w-full rounded-t-md ${reverseBetter ? "bg-emerald-400/80" : "bg-amber-400/80"}`} style={{ height: `${h}%` }} title={`${d.label}: ${d.value}${unit || ""}`} />
                <div className="mt-1 w-full truncate text-center text-[10px] text-white/70" title={d.label}>{d.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RingChart: React.FC<{ percent: number; label?: string }> = ({ percent, label }) => {
  const p = Math.max(0, Math.min(100, percent));
  const r = 44; const c = 2 * Math.PI * r; const dash = (p / 100) * c;
  return (
    <div className="flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#334155" strokeWidth="12" />
        <circle cx="60" cy="60" r={r} fill="none" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round" strokeDasharray={`${dash} ${c}`} transform="rotate(-90 60 60)" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fill="#fff">{Math.round(p)}%</text>
      </svg>
      {label && <div className="ml-3 text-sm text-white/80">{label}</div>}
    </div>
  );
};

export default function App() {
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<"rank" | "rating" | "payout">("rank");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = casinos.filter(c => (!q || c.name.toLowerCase().includes(q)) && c.rating >= minRating);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "payout") list = [...list].sort((a, b) => payoutHours(a.payoutSpeed) - payoutHours(b.payoutSpeed));
    if (sort === "rank") list = [...list].sort((a, b) => a.rank - b.rank);
    return list;
  }, [query, minRating, sort]);

  const payoutData = casinos.map(c => ({ label: c.name.replace(".lv", ""), value: payoutHours(c.payoutSpeed) }));
  const ratingData = casinos.map(c => ({ label: c.name.replace(".lv", ""), value: c.rating }));
  const top2Sum = casinos.filter(c=>c.rank<=2).reduce((s,c)=>s+c.rating,0);
  const restSum = casinos.filter(c=>c.rank>2).reduce((s,c)=>s+c.rating,0);
  const top2Pct = (top2Sum/(top2Sum+restSum))*100;

  const onDetails = (c: Casino) => {
    // Без вложенных кавычек: формируем части отдельно
    const pros = "- " + c.pros.join("\n- ");
    const cons = "- " + c.cons.join("\n- ");
    const msg = `${c.name}:\n\nПлюсы:\n${pros}\n\nМинусы:\n${cons}`;
    alert(msg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-30 border-b border-white/10 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold tracking-wide">TOP 10 Казино Латвии</div>
          <div className="hidden items-center gap-2 md:flex text-sm text-white/80">
            <Tag>Лицензия IAUI</Tag>
            <Tag>Быстрые выплаты</Tag>
            <Tag>Карты & Крипто</Tag>
          </div>
          <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">Связаться</button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/80">
              Обновлено {new Date().toLocaleDateString()} • Ручная модерация
            </div>
            <h1 className="text-3xl font-bold leading-tight md:text-5xl">Лучшие онлайн‑казино Латвии <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">2025</span></h1>
            <p className="mt-4 text-white/80 md:text-lg">Топ‑2 закреплены за <span className="font-semibold">Casino777</span> и <span className="font-semibold">LuckyBet</span> — фавориты по стабильности и выплатам.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#list" className="rounded-full bg-amber-400 px-5 py-2 text-center text-slate-900">Смотреть рейтинг</a>
              <a href="#charts" className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-center">Графики</a>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-sm text-white/70">
              <Tag>Безопасные выплаты</Tag><Tag>Ответственная игра</Tag><Tag>Проверенные бонусы</Tag>
            </div>
          </div>
          {/* LOGOS STRIP */}
          <div className="relative">
            <div className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 blur-2xl" />
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3">
                {casinos.slice(0,6).map(c => (
                  <div key={c.id} className="flex items-center justify-center rounded-xl bg-slate-800/40 p-2"><img src={c.logo} alt={c.name} className="max-h-10 object-contain" /></div>
                ))}
              </div>
              <div className="mt-2 text-center text-xs text-white/60">+ ещё {casinos.length - 6} брендов</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="mx-auto max-w-7xl px-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input placeholder="Поиск по названию…" value={query} onChange={(e)=>setQuery(e.target.value)} className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-white/50" />
            <div className="flex items-center gap-3">
              <label className="text-sm text-white/70">Мин. рейтинг:</label>
              <input type="range" min={0} max={5} step={0.1} value={minRating} onChange={(e)=>setMinRating(parseFloat(e.target.value))} className="w-full" />
              <span className="w-10 text-right text-sm">{minRating.toFixed(1)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>setSort("rank")} className={`rounded-full px-4 py-2 text-sm ${sort==="rank"?"bg-amber-400 text-slate-900":"border border-white/20 bg-white/10"}`}>По рангу</button>
              <button onClick={()=>setSort("rating")} className={`rounded-full px-4 py-2 text-sm ${sort==="rating"?"bg-amber-400 text-slate-900":"border border-white/20 bg-white/10"}`}>По рейтингу</button>
              <button onClick={()=>setSort("payout")} className={`rounded-full px-4 py-2 text-sm ${sort==="payout"?"bg-amber-400 text-slate-900":"border border-white/20 bg-white/10"}`}>По выплатам</button>
            </div>
          </div>
        </div>
      </section>

      {/* LIST */}
      <main id="list" className="mx-auto mt-6 max-w-7xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {filtered.map((c) => (
            <div key={c.id} className={`rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10 ${c.rank <= 2 ? "ring-2 ring-amber-400/60" : ""}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-800"><img src={c.logo} alt={c.name} className="max-h-12 object-contain" /></div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs">#{c.rank}</span>
                      {c.rank===1 && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs text-slate-900">Top 1</span>}
                      {c.rank===2 && <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs text-slate-900">Top 2</span>}
                      <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-xs">{c.license}</span>
                    </div>
                    <div className="text-xl font-semibold">{c.name}</div>
                    <div className="text-sm text-white/80">Бонус: {c.bonus}</div>
                  </div>
                </div>
                <RatingStars value={c.rating} />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div><div className="text-sm text-white/60">Скорость выплат</div><div className="text-base">{c.payoutSpeed}</div></div>
                <div><div className="text-sm text-white/60">Игры</div><div className="text-base">~{c.games.toLocaleString()}</div></div>
                <div><div className="text-sm text-white/60">Мин. депозит</div><div className="text-base">{c.minDeposit}</div></div>
                <div><div className="text-sm text-white/60">Поддержка</div><div className="text-base">{c.support}</div></div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">{c.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={c.domain} target="_blank" className="rounded-full bg-amber-400 px-4 py-2 text-slate-900">Играть</a>
                <button className="rounded-full border border-white/20 bg-white/10 px-4 py-2" onClick={() => onDetails(c)}>Подробнее</button>
              </div>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <section id="charts" className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="mb-1 text-base font-semibold">Время выплат (чем меньше — лучше)</div><SimpleBarChart data={payoutData} caption="Часы до вывода" reverseBetter unit="ч" /></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="mb-1 text-base font-semibold">Рейтинг по казино</div><SimpleBarChart data={ratingData} caption="Оценка 1–5" /></div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><div className="mb-1 text-base font-semibold">Доля рейтинга топ-2</div><RingChart percent={top2Pct} label="Сумма рейтингов Top-2 vs остальные" /></div>
        </section>

        {/* PAYOUT TABLE */}
        <section className="mt-12 grid grid-cols-1">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="border-b border-white/10 p-4">
              <div className="text-base font-semibold">Скорость выплат</div>
              <div className="text-sm text-white/60">Сравнение по ключевым метрикам</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w[600px] text-sm">
                <thead className="bg-white/5 text-white/70">
                  <tr>
                    <th className="px-3 py-2 text-left">Казино</th>
                    <th className="px-3 py-2 text-left">Скорость выплат</th>
                    <th className="px-3 py-2 text-left">Поддержка</th>
                    <th className="px-3 py-2 text-left">Оценка</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filtered.map(c => (
                    <tr key={`p-${c.id}`} className="hover:bg-white/5">
                      <td className="px-3 py-2">{c.name}</td>
                      <td className="px-3 py-2">{c.payoutSpeed}</td>
                      <td className="px-3 py-2">{c.support}</td>
                      <td className="px-3 py-2">{c.rating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* METHODOLOGY */}
        <section id="methodology" className="mt-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-2 text-xl font-semibold">Методология рейтинга</div>
            <ul className="list-disc space-y-2 pl-5 text-white/80">
              <li>Лицензия и комплаенс (IAUI), репутация, прозрачность условий.</li>
              <li>Скорость и доля успешных выплат, удобство депозитов и KYC.</li>
              <li>Бонусная программа, вейджер, честность ограничений.</li>
              <li>Ассортимент провайдеров, слоты/лайв, мобильный UX и стабильность.</li>
            </ul>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              Баллы 1–5. <strong>Casino777</strong> и <strong>LuckyBet</strong> закреплены в топ‑2 по стабильности выплат и UX.
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-white/70">
        <div className="mx-auto max-w-7xl space-y-2">
          <div>© {new Date().getFullYear()} Latvia Casino Review • Ответственная игра 18+</div>
          <div className="text-white/50">Дисклеймер: информация носит информационный характер и не является рекламой или офертой. Проверяйте правила на сайтах операторов.</div>
        </div>
      </footer>
    </div>
  );
}
