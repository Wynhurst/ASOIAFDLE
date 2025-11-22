const ANSWERS = ["CRANE", "PLANT", "BRAVE", "SHARD"];

function pickIndex(dateStr) {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++)
    h = (h * 31 + dateStr.charCodeAt(i)) | 0;
  return Math.abs(h) % ANSWERS.length;
}

export default function handler(req, res) {
  const body = req.body ? JSON.parse(req.body) : {};
  const { guess, date } = body;

  const answer = ANSWERS[pickIndex(date)];
  const ansArr = answer.split("");
  const fb = Array(answer.length).fill("gray");

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === ansArr[i]) {
      fb[i] = "green";
      ansArr[i] = null;
    }
  }

  for (let i = 0; i < answer.length; i++) {
    if (fb[i] === "green") continue;
    const pos = ansArr.indexOf(guess[i]);
    if (pos >= 0) {
      fb[i] = "yellow";
      ansArr[pos] = null;
    }
  }

  res.status(200).json({
    correct: guess === answer,
    feedback: fb
  });
}