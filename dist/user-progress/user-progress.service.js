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
exports.UserProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_progress_entity_1 = require("./entities/user-progress.entity");
let UserProgressService = class UserProgressService {
    progressRepository;
    constructor(progressRepository) {
        this.progressRepository = progressRepository;
    }
    async create(createProgressDto) {
        const progress = this.progressRepository.create(createProgressDto);
        return this.progressRepository.save(progress);
    }
    async findByUser(userId) {
        return this.progressRepository.find({
            where: { userId },
            relations: ['lesson', 'lesson.course'],
            order: { completedAt: 'DESC' },
        });
    }
    async findByLesson(lessonId) {
        return this.progressRepository.find({
            where: { lessonId },
            relations: ['user'],
            order: { completedAt: 'DESC' },
        });
    }
    async hasCompleted(userId, lessonId) {
        const progress = await this.progressRepository.findOne({
            where: { userId, lessonId },
        });
        return !!progress;
    }
    async getCompletionStats(userId) {
        const completed = await this.progressRepository.count({
            where: { userId },
        });
        return { completed, total: 0 };
    }
};
exports.UserProgressService = UserProgressService;
exports.UserProgressService = UserProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_progress_entity_1.UserProgress)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserProgressService);
//# sourceMappingURL=user-progress.service.js.map