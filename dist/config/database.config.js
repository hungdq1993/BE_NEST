"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const config_1 = require("@nestjs/config");
exports.databaseConfig = {
    useFactory: (configService) => ({
        uri: configService.get('MONGODB_URI'),
        retryWrites: true,
        w: 'majority',
    }),
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=database.config.js.map