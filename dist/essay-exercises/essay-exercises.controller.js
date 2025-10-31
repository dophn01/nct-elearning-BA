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
exports.EssayExercisesController = void 0;
const common_1 = require("@nestjs/common");
const essay_exercises_service_1 = require("./essay-exercises.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
let EssayExercisesController = class EssayExercisesController {
    essayExercisesService;
    constructor(essayExercisesService) {
        this.essayExercisesService = essayExercisesService;
    }
    createExercise(createExerciseDto) {
        return this.essayExercisesService.createExercise(createExerciseDto);
    }
    createSubmission(createSubmissionDto, req) {
        const userId = req.user?.id;
        return this.essayExercisesService.createSubmission({ ...createSubmissionDto, userId });
    }
    findAll(lessonId, gradeLevel, practiceType, topic) {
        if (lessonId) {
            return this.essayExercisesService.findByLesson(lessonId);
        }
        return this.essayExercisesService.findAllExercises(gradeLevel, practiceType, topic);
    }
    findSubmissions(userId) {
        return this.essayExercisesService.findByUser(userId);
    }
    findOne(id) {
        return this.essayExercisesService.findExerciseById(id);
    }
    gradeSubmission(id, body) {
        return this.essayExercisesService.gradeSubmission(id, body.grade, body.feedback);
    }
    remove(id) {
        return this.essayExercisesService.deleteExercise(id);
    }
};
exports.EssayExercisesController = EssayExercisesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EssayExercisesController.prototype, "createExercise", null);
__decorate([
    (0, common_1.Post)('submissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EssayExercisesController.prototype, "createSubmission", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('lessonId')),
    __param(1, (0, common_1.Query)('gradeLevel')),
    __param(2, (0, common_1.Query)('practiceType')),
    __param(3, (0, common_1.Query)('topic')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], EssayExercisesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('submissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EssayExercisesController.prototype, "findSubmissions", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EssayExercisesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('submissions/:id/grade'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EssayExercisesController.prototype, "gradeSubmission", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EssayExercisesController.prototype, "remove", null);
exports.EssayExercisesController = EssayExercisesController = __decorate([
    (0, common_1.Controller)('essay-exercises'),
    __metadata("design:paramtypes", [essay_exercises_service_1.EssayExercisesService])
], EssayExercisesController);
//# sourceMappingURL=essay-exercises.controller.js.map