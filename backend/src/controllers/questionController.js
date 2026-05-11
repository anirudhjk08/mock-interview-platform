const prisma = require('../lib/prisma');

const generateQuestion = async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const previousQuestions = await prisma.question.findMany({
      where: { sessionId },
      select: { questionText: true },
    });

    const previousQuestionsList = previousQuestions.map(q => q.questionText).join(' | ');

    const prompt = `You are a technical interviewer. Topic: ${session.topic}. Difficulty: ${session.difficulty}. 
        Previous questions asked: ${previousQuestionsList}. 
        Generate only the next interview question, no explanation, no numbering.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      })
    });
    const data = await response.json();
    console.log("Groq response:", JSON.stringify(data, null, 2));
    const text = data.choices[0].message.content;

    const newQuestion = await prisma.question.create({
      data: {
        sessionId,
        questionText: text,
      },
    });

    return res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const questionId = req.params.id;

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const prompt = `You are a technical interviewer evaluating an answer.
        Question: ${question.questionText}
        Candidate Answer: ${answer}
        Respond ONLY in this JSON format with no extra text:
        {
          "score": number between 0 and 10,
          "good": "what was good about the answer",
          "missing": "what was missing or incorrect",
          "ideal_answer": "a brief ideal answer"
        }`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500
      })
    });
    const data = await response.json();
    console.log("Groq response:", JSON.stringify(data, null, 2));
    const text = data.choices[0].message.content;

    const feedbackData = JSON.parse(text);

    const updatedQuestion = await prisma.question.update({
      where: { id: questionId },
      data: {
        userAnswer: answer,
        aiFeedback: JSON.stringify(feedbackData),
        score: feedbackData.score,
      },
    });

    return res.status(200).json(feedbackData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  generateQuestion,
  submitAnswer,
};
