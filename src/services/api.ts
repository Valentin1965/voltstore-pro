// services/api.ts

export interface RecommendationInput {
  dailyConsumption: number;  // кВт·год на добу
  backupHours: number;       // годин автономності
}

export interface RecommendationResult {
  recommendedInverterKw: number;
  recommendedBatteryKwh: number;
  explanation: string;
}

/**
 * Локальний розрахунок рекомендацій без використання зовнішнього ШІ
 * Використовує перевірені інженерні правила:
 * - Інвертор: +30–50% запасу до середньодобового споживання
 * - Акумулятори: ємність = (споживання × години × 1.2) / 24 + DoD корекція
 */
export const getSystemRecommendation = async (
  input: RecommendationInput
): Promise<RecommendationResult> => {
  const { dailyConsumption, backupHours } = input;

  // Рекомендація інвертора (з запасом)
  let recommendedInverterKw = 3;
  if (dailyConsumption <= 4) recommendedInverterKw = 3;
  else if (dailyConsumption <= 8) recommendedInverterKw = 5;
  else if (dailyConsumption <= 12) recommendedInverterKw = 8;
  else recommendedInverterKw = 10;

  // Розрахунок необхідної ємності АКБ (з урахуванням DoD ≈ 80% для LiFePO4)
  const requiredEnergyKwh = (dailyConsumption * backupHours) / 24;
  const recommendedBatteryKwh = Math.round(requiredEnergyKwh * 1.25 * 10) / 10; // +25% запас

  return {
    recommendedInverterKw,
    recommendedBatteryKwh,
    explanation: `Для вашого споживання ${dailyConsumption} кВт·год/добу та автономності ${backupHours} годин рекомендуємо інвертор ${recommendedInverterKw} кВт та акумулятори загальною ємністю ≈ ${recommendedBatteryKwh} кВт·год (з урахуванням запасу та глибини розряду).`
  };
};