import { QuizzesService, CreateQuizDto, CreateQuizQuestionDto, CreateQuizOptionDto } from './quizzes.service';
export declare class QuizzesController {
    private readonly quizzesService;
    constructor(quizzesService: QuizzesService);
    createQuiz(createQuizDto: CreateQuizDto): Promise<import("./entities/quiz.entity").Quiz>;
    createQuestion(createQuestionDto: CreateQuizQuestionDto): Promise<import("./entities/quiz-question.entity").QuizQuestion>;
    createOption(createOptionDto: CreateQuizOptionDto): Promise<import("./entities/quiz-question-option.entity").QuizQuestionOption>;
    findAll(lessonId?: string, gradeLevel?: '10' | '11' | '12'): Promise<import("./entities/quiz.entity").Quiz[]>;
    findOne(id: string): Promise<import("./entities/quiz.entity").Quiz | null>;
    startAttempt(quizId: string, body: {
        userId: string;
    }): Promise<import("./entities/quiz-attempt.entity").QuizAttempt>;
    submitAnswer(attemptId: string, body: {
        questionId: string;
        selectedOptionId?: string;
        answerText?: string;
    }): Promise<import("./entities/quiz-attempt-answer.entity").QuizAttemptAnswer>;
    completeAttempt(attemptId: string): Promise<import("./entities/quiz-attempt.entity").QuizAttempt>;
    listAttempts(quizId: string, status?: 'in_progress' | 'completed'): Promise<import("./entities/quiz-attempt.entity").QuizAttempt[]>;
    getAttempt(attemptId: string): Promise<import("./entities/quiz-attempt.entity").QuizAttempt | null>;
    gradeAnswer(answerId: string, body: {
        pointsEarned?: number;
        isCorrect?: boolean;
    }): Promise<import("./entities/quiz-attempt-answer.entity").QuizAttemptAnswer>;
    remove(id: string): Promise<void>;
}
