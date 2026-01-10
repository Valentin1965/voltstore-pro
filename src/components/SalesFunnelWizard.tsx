// src/components/SalesFunnelWizard.tsx
import React, { useState } from 'react';
import { Product } from '../types.ts';

interface SalesFunnelWizardProps {
  initialConsumption: number;
  initialHours: number;
  recommendation: any;
  onAddToCart: (kit: Product) => void; // Пропс для додавання комплекту в кошик
  onClose: () => void;
}

export const SalesFunnelWizard: React.FC<SalesFunnelWizardProps> = ({
  initialConsumption,
  initialHours,
  recommendation,
  onAddToCart,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    houseType: 'apartment' as 'apartment' | 'house' | 'commercial',
    budget: 0,
    solarPanels: false,
    batteryType: 'lifepo4' as 'lifepo4' | 'gel' | 'agm',
  });

  const generateKit = () => {
    const kit: Product = {
      id: `kit_${Date.now()}`,
      name: `Персональний комплект для ${formData.houseType === 'apartment' ? 'квартири' : formData.houseType === 'house' ? 'будинку' : 'комерції'}`,
      category: 'kit',
      price: Math.round(recommendation.recommendedInverterKw * 10000 + recommendation.recommendedBatteryKwh * 8000 + (formData.solarPanels ? 5000 : 0)),
      description: `Комплект на основі ваших даних: споживання ${initialConsumption} кВтг/добу, автономність ${initialHours} год. Тип: ${formData.houseType}. Бюджет: ${formData.budget} грн. Сонячні панелі: ${formData.solarPanels ? 'Так' : 'Ні'}. Тип батареї: ${formData.batteryType.toUpperCase()}.`,
      image: 'https://via.placeholder.com/400?text=Комплект',
      specs: `Інвертор: ${recommendation.recommendedInverterKw} кВт, Батарея: ${recommendation.recommendedBatteryKwh} кВтг`,
      detailedTechSpecs: recommendation.explanation,
      datasheet: '',
      stock: 1,
      bundleItems: [
        { name: 'Інвертор', quantity: 1 },
        { name: 'Батарея', quantity: 1 },
        { name: 'Сонячні панелі', quantity: formData.solarPanels ? 1 : 0 },
      ],
    };

    onAddToCart(kit);
    alert('Комплект додано в кошик!');
    onClose();
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black">Крок {step}: {step === 1 ? 'Тип приміщення' : step === 2 ? 'Бюджет та опції' : 'Ваш комплект'}</h3>

      {step === 1 && (
        <div className="space-y-6">
          <select
            value={formData.houseType}
            onChange={e => setFormData(prev => ({ ...prev, houseType: e.target.value as 'apartment' | 'house' | 'commercial' }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200"
          >
            <option value="apartment">Квартира</option>
            <option value="house">Будинок</option>
            <option value="commercial">Комерція</option>
          </select>
          <div className="flex gap-4 mt-6">
            <button onClick={onClose} className="flex-1 bg-white border py-4 rounded-2xl font-black uppercase">Скасувати</button>
            <button onClick={handleNext} className="flex-1 bg-yellow-500 text-slate-900 py-4 rounded-2xl font-black uppercase">Далі</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <input
            type="number"
            value={formData.budget}
            onChange={e => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200"
            placeholder="Бюджет (грн)"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.solarPanels}
              onChange={e => setFormData(prev => ({ ...prev, solarPanels: e.target.checked }))}
            />
            Додати сонячні панелі
          </label>
          <select
            value={formData.batteryType}
            onChange={e => setFormData(prev => ({ ...prev, batteryType: e.target.value as 'lifepo4' | 'gel' | 'agm' }))}
            className="w-full px-4 py-3 rounded-xl border border-slate-200"
          >
            <option value="lifepo4">LiFePO4</option>
            <option value="gel">Gel</option>
            <option value="agm">AGM</option>
          </select>
          <div className="flex gap-4 mt-6">
            <button onClick={handleBack} className="flex-1 bg-white border py-4 rounded-2xl font-black uppercase">Назад</button>
            <button onClick={handleNext} className="flex-1 bg-yellow-500 text-slate-900 py-4 rounded-2xl font-black uppercase">Далі</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl">
            <p>Інвертор: {recommendation.recommendedInverterKw} кВт</p>
            <p>Батарея: {recommendation.recommendedBatteryKwh} кВтг ({formData.batteryType.toUpperCase()})</p>
            <p>Сонячні панелі: {formData.solarPanels ? 'Так' : 'Ні'}</p>
            <p className="font-black mt-4">Орієнтовна ціна: {generateKit().price.toLocaleString()} ₴</p>
            <p className="text-sm text-slate-500 italic">{recommendation.explanation}</p>
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={handleBack} className="flex-1 bg-white border py-4 rounded-2xl font-black uppercase">Назад</button>
            <button onClick={generateKit} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black uppercase hover:bg-green-600 transition">Додати в кошик</button>
          </div>
        </div>
      )}
    </div>
  );
};