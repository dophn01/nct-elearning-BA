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
exports.LessonsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lesson_entity_1 = require("./entities/lesson.entity");
let LessonsService = class LessonsService {
    lessonsRepository;
    constructor(lessonsRepository) {
        this.lessonsRepository = lessonsRepository;
    }
    async create(createLessonDto) {
        const lesson = this.lessonsRepository.create(createLessonDto);
        return this.lessonsRepository.save(lesson);
    }
    async findAll() {
        return this.lessonsRepository.find({
            relations: ['course', 'videos', 'quizzes', 'essayExercises'],
            order: { orderIndex: 'ASC' },
        });
    }
    async findById(id) {
        return this.lessonsRepository.findOne({
            where: { id },
            relations: ['course', 'videos', 'quizzes', 'essayExercises'],
        });
    }
    async findByCourse(courseId) {
        return this.lessonsRepository.find({
            where: { courseId, isPublished: true },
            relations: ['course', 'videos', 'quizzes', 'essayExercises'],
            order: { orderIndex: 'ASC' },
        });
    }
    async update(id, updateLessonDto) {
        const lesson = await this.findById(id);
        if (!lesson) {
            throw new common_1.NotFoundException('Không tìm thấy bài học');
        }
        Object.assign(lesson, updateLessonDto);
        return this.lessonsRepository.save(lesson);
    }
    async remove(id) {
        const result = await this.lessonsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Không tìm thấy bài học');
        }
    }
};
exports.LessonsService = LessonsService;
exports.LessonsService = LessonsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lesson_entity_1.Lesson)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LessonsService);
//# sourceMappingURL=lessons.service.js.map