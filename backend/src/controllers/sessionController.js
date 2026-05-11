const prisma = require('../lib/prisma');

const createSession = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    const userId = req.user.id;

    const newSession = await prisma.session.create({
      data: {
        userId,
        topic,
        difficulty,
      },
    });

    return res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;

    const sessions = await prisma.session.findMany({
      where: { userId },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    return res.status(200).json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSessionById = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { questions: true },
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const completeSession = async (req, res) => {
  try {
    const sessionId = req.params.id;

    const questions = await prisma.question.findMany({
      where: { sessionId },
    });

    let totalScore = 0;
    let scoredQuestionsCount = 0;

    questions.forEach((q) => {
      if (q.score !== null && q.score !== undefined) {
        totalScore += q.score;
        scoredQuestionsCount++;
      }
    });

    const averageScore = scoredQuestionsCount > 0 ? Math.round(totalScore / scoredQuestionsCount) : 0;

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        totalScore: averageScore,
      },
    });

    return res.status(200).json(updatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  completeSession,
};
