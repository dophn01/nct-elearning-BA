"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizzesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_1 = require("./entities/quiz.entity");
const quiz_question_entity_1 = require("./entities/quiz-question.entity");
const quiz_question_option_entity_1 = require("./entities/quiz-question-option.entity");
const quiz_attempt_entity_1 = require("./entities/quiz-attempt.entity");
const quiz_attempt_answer_entity_1 = require("./entities/quiz-attempt-answer.entity");
const lesson_entity_1 = require("../lessons/entities/lesson.entity");
let QuizzesService = class QuizzesService {
    quizzesRepository;
    questionsRepository;
    optionsRepository;
    attemptsRepository;
    answersRepository;
    lessonsRepository;
    constructor(quizzesRepository, questionsRepository, optionsRepository, attemptsRepository, answersRepository, lessonsRepository) {
        this.quizzesRepository = quizzesRepository;
        this.questionsRepository = questionsRepository;
        this.optionsRepository = optionsRepository;
        this.attemptsRepository = attemptsRepository;
        this.answersRepository = answersRepository;
        this.lessonsRepository = lessonsRepository;
    }
    async createQuiz(createQuizDto) {
        if (createQuizDto.lessonId) {
            const lesson = await this.lessonsRepository.findOne({ where: { id: createQuizDto.lessonId }, relations: ['course'] });
            if (!lesson) {
                throw new common_1.BadRequestException('Lesson không tồn tại');
            }
        }
        const quiz = this.quizzesRepository.create({
            ...createQuizDto,
            maxAttempts: createQuizDto.maxAttempts ?? 3,
        });
        return this.quizzesRepository.save(quiz);
    }
    async createQuestion(createQuestionDto) {
        const question = this.questionsRepository.create({
            ...createQuestionDto,
            questionType: createQuestionDto.questionType,
        });
        return this.questionsRepository.save(question);
    }
    async createOption(createOptionDto) {
        const option = this.optionsRepository.create(createOptionDto);
        return this.optionsRepository.save(option);
    }
    async findAllQuizzes(gradeLevel) {
        const qb = this.quizzesRepository.createQueryBuilder('quiz')
            .leftJoinAndSelect('quiz.lesson', 'lesson')
            .leftJoinAndSelect('lesson.course', 'course')
            .leftJoinAndSelect('quiz.questions', 'questions')
            .leftJoinAndSelect('questions.options', 'options')
            .orderBy('quiz.createdAt', 'DESC');
        if (gradeLevel) {
            qb.andWhere('(quiz.gradeLevel = :gradeLevel OR course.gradeLevel = :gradeLevel)', { gradeLevel });
        }
        return qb.getMany();
    }
    async findQuizById(id) {
        return this.quizzesRepository.findOne({
            where: { id },
            relations: ['lesson', 'lesson.course', 'questions', 'questions.options'],
        });
    }
    async findByLesson(lessonId) {
        return this.quizzesRepository.find({
            where: { lessonId, isPublished: true },
            relations: ['lesson', 'questions', 'questions.options'],
            order: { createdAt: 'ASC' },
        });
    }
    async startAttempt(quizId, userId) {
        const attempt = this.attemptsRepository.create({
            quizId,
            userId,
            startedAt: new Date(),
        });
        return this.attemptsRepository.save(attempt);
    }
    async submitAnswer(attemptId, questionId, selectedOptionId, answerText) {
        const answer = this.answersRepository.create({
            attemptId,
            questionId,
            selectedOptionId,
            answerText,
        });
        return this.answersRepository.save(answer);
    }
    async completeAttempt(attemptId) {
        const attempt = await this.attemptsRepository.findOne({
            where: { id: attemptId },
            relations: ['answers', 'quiz', 'quiz.questions'],
        });
        if (!attempt) {
            throw new common_1.NotFoundException('Không tìm thấy bài làm');
        }
        let score = 0;
        for (const answer of attempt.answers) {
            if (answer.isCorrect) {
                score += answer.pointsEarned;
            }
        }
        attempt.completedAt = new Date();
        attempt.score = score;
        attempt.totalPoints = attempt.quiz.questions.reduce((sum, q) => sum + q.points, 0);
        return this.attemptsRepository.save(attempt);
    }
    async listAttemptsForQuiz(quizId, status) {
        const where = { quizId };
        if (status === 'in_progress') {
            where.completedAt = null;
        }
        else if (status === 'completed') {
            where.completedAt = (0, typeorm_2.Not)(null);
        }
        return this.attemptsRepository.find({
            where,
            relations: ['user'],
            order: { startedAt: 'DESC' },
        });
    }
    async getAttemptWithAnswers(attemptId) {
        return this.attemptsRepository.findOne({
            where: { id: attemptId },
            relations: [
                'answers',
                'answers.question',
                'answers.selectedOption',
                'quiz',
                'quiz.questions',
                'quiz.questions.options',
                'user',
            ],
        });
    }
    async gradeAnswer(answerId, pointsEarned, isCorrect) {
        const answer = await this.answersRepository.findOne({ where: { id: answerId } });
        if (!answer) {
            throw new common_1.NotFoundException('Không tìm thấy câu trả lời');
        }
        if (typeof pointsEarned === 'number') {
            answer.pointsEarned = pointsEarned;
        }
        if (typeof isCorrect === 'boolean') {
            answer.isCorrect = isCorrect;
        }
        return this.answersRepository.save(answer);
    }
    async deleteQuiz(id) {
        await this.quizzesRepository.delete(id);
    }
};
exports.QuizzesService = QuizzesService;
exports.QuizzesService = QuizzesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(quiz_question_entity_1.QuizQuestion)),
    __param(2, (0, typeorm_1.InjectRepository)(quiz_question_option_entity_1.QuizQuestionOption)),
    __param(3, (0, typeorm_1.InjectRepository)(quiz_attempt_entity_1.QuizAttempt)),
    __param(4, (0, typeorm_1.InjectRepository)(quiz_attempt_answer_entity_1.QuizAttemptAnswer)),
    __param(5, (0, typeorm_1.InjectRepository)(lesson_entity_1.Lesson)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuizzesService);
//# sourceMappingURL=quizzes.service.js.map