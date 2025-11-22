const ANSWERS = ["CRANE", "PLANT", "BRAVE", "SHARD"];

function pickIndex(dateStr) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++)
    h = (h * 31 + dateStr.charCodeAt(i)) | 0;
  return Math.abs(h) % ANSWERS.length;
}

export default function handler(req, res) {
  const today = new Date().toISOString().slice(0, 10);
  const index = pickIndex(today);

  res.status(200).json({
    date: today,
    wordLength: ANSWERS[index].length,
    maxAttempts: 6
  });
}