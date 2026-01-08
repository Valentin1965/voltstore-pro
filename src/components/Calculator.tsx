
import React, { useState } from 'react';
import { getSystemRecommendation } from '../services/api.ts';

export const Calculator: React.FC = () => {
  const [consumption, setConsumption] = useState(5);
  const [hours, setHours] = useState(8);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);

  const handleCalculate = async () => {
    setLoading(true);
    const result = await getSystemRecommendation({ dailyConsumption: consumption, backupHours: hours });
    setRecommendation(result);
    setLoading(false);
  };

  return (
    <section className="py-12 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-4xl mx-auto px-8">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight">AI Конфігуратор</h2>
          <div>
            <label className="text-xs font-black uppercase text-slate-400 block mb-2">Споживання: {consumption} кВтг/добу</label>
            <input type="range" min="1" max="40" value={consumption} onChange={(e) => setConsumption(Number(e.target.value))} className="w-full accent-yellow-500" />
          </div>
          <div>
            <label className="text-xs font-black uppercase text-slate-400 block mb-2">Автономність: {hours} год</label>
            <input type="range" min="1" max="72" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full accent-yellow-500" />
          </div>
          <button onClick={handleCalculate} disabled={loading} className="w-full bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest disabled:opacity-50 transition">
            {loading ? "Аналіз..." : "Розрахувати"}
          </button>
        </div>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-h-[200px] flex flex-col justify-center text-center">
          {recommendation ? (
            <div className="animate-fade-in space-y-4">
              <div className="flex justify-around gap-4">
                <div>
                  <div className="text-2xl font-black text-slate-900">{recommendation.recommendedInverterKw} кВт</div>
                  <div className="text-[10px] uppercase font-black text-slate-400">Інвертор</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{recommendation.recommendedBatteryKwh} кВтг</div>
                  <div className="text-[10px] uppercase font-black text-slate-400">Батарея</div>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic leading-relaxed">"{recommendation.explanation}"</p>
            </div>
          ) : (
            <p className="text-slate-400 text-sm font-medium">Оберіть параметри для розрахунку</p>
          )}
        </div>
      </div>
    </section>
  );
};
