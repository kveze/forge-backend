import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const OPENROUTER_KEY = "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";

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());

const ask = async (prompt) => {
  return `Понедельник
Грудь, Трицепс
1. Отжимания — 4 × 12 (отдых 90с)
2. Отжимания на брусьях — 4 × 10 (отдых 90с)
3. Планка — 3 × 60с

Среда
Спина, Бицепс
1. Подтягивания — 4 × 8 (отдых 90с)
2. Австралийские подтягивания — 3 × 12 (отдых 60с)

Пятница
Ноги
1. Приседания — 4 × 15 (отдых 90с)
2. Выпады — 3 × 12 (отдых 60с)`;
};

// Тренировки
app.post("/generate", async (req, res) => {
  const { height, weight, age, goal, level, equipment, gender, days, freeText } = req.body;

const prompt = `Ты элитный персональный тренер с 15 годами опыта. Ты знаешь принципы периодизации, прогрессивной перегрузки и восстановления. Ты составляешь планы как профессионал, а не как интернет-калькулятор.

ДАННЫЕ КЛИЕНТА:
Пол: ${gender}
Возраст: ${age} лет
Рост: ${height} см
Вес: ${weight} кг
Цель: ${goal}
Уровень: ${level}
Оборудование: ${equipment}
Дней в неделю: ${days}
${freeText ? `Особенности: ${freeText}` : ''}

ПРАВИЛА СОСТАВЛЕНИЯ ПЛАНА:
- Чередуй группы мышц — никогда не нагружай одну группу два дня подряд
- Начинай с базовых многосуставных упражнений, заканчивай изолированными
- Для новичка: 3 подхода, 12-15 повторений, акцент на технику
- Для среднего: 4 подхода, 8-12 повторений, прогрессивная перегрузка
- Для продвинутого: 4-5 подходов, 5-10 повторений, периодизация нагрузки
- Цель "сила": упор на базу (приседания, жим, тяга), низкие повторения
- Цель "масса": гипертрофийный диапазон 8-12, объём важнее интенсивности
- Цель "рельеф/похудение": суперсеты, меньше отдыха, кардио в конце
- Цель "выносливость": круговые тренировки, высокие повторения, минимум отдыха
- Указывай отдых между подходами: сила — 2-3 мин, масса — 60-90 сек, рельеф — 30-45 сек
- Используй ТОЛЬКО доступное оборудование: ${equipment}

ФОРМАТ ОТВЕТА — строго так, без отступлений:
[День недели]
[Группа мышц через запятую]
1. Упражнение — подходы × повторения (отдых Xс)
2. ...

Никакого вступления. Никаких советов после плана. Только сам план.`

  try {
    const text = await ask(prompt);
    res.json({ plan: text });
  } catch (err) {
    console.error("ERR:", err.response?.data || err.message);
    res.status(500).json({ plan: "Ошибка: " + JSON.stringify(err.response?.data || err.message) });
  }
});

// Советы по питанию
app.post("/tips", async (req, res) => {
  const { gender, age, weight, goal, level, plan } = req.body;

  const prompt = `Ты нутрициолог. Дай 6 конкретных коротких советов по питанию для этого человека, учитывая его план тренировок.
Каждый совет — 1-2 предложения, конкретный и применимый прямо сейчас.
Формат: пронумерованный список. Никакого вступления. НА РУССКОМ.

Пол: ${gender}, Возраст: ${age}, Вес: ${weight}, Цель: ${goal}, Уровень: ${level}

План тренировок:
${plan}`;

  try {
    const text = await ask(prompt);
    res.json({ tips: text });
  } catch (err) {
    console.error("ERR:", err.response?.data || err.message);
    res.status(500).json({ tips: "Ошибка: " + JSON.stringify(err.response?.data || err.message) });
  }
});

// Восстановление
app.post("/recovery", async (req, res) => {
  const { age, goal, level } = req.body;

  const prompt = `Дай 5 конкретных советов по сну и восстановлению для спортсмена.
Каждый совет — 1-2 предложения, конкретный. Формат: пронумерованный список. Никакого вступления. НА РУССКОМ.

Возраст: ${age}, Цель: ${goal}, Уровень: ${level}`;

  try {
    const text = await ask(prompt);
    res.json({ plan: text });
  } catch (err) {
    console.error("ERR:", err.response?.data || err.message);
    res.status(500).json({ plan: "Ошибка: " + JSON.stringify(err.response?.data || err.message) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер: http://localhost:${PORT}`);
});
