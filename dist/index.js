"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_middleware_1 = require("./middleware/auth.middleware");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const store_middleware_1 = require("./middleware/store.middleware");
const store_external_router_1 = __importDefault(require("./routes/store-external.router"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const path_1 = __importDefault(require("path"));
const prisma_1 = __importDefault(require("./libs/prisma"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Ok' });
});
function ConfigureNjkLocalDevelopment() {
    app.set('views', path_1.default.join(__dirname, '/views'));
    nunjucks_1.default.configure('views', {
        autoescape: true,
        express: app,
        noCache: true,
    });
    app.set('view engine', 'njk');
}
ConfigureNjkLocalDevelopment();
app.get('/teste', async (req, res) => {
    try {
        const count = await prisma_1.default.client.count();
        res.json({ totalClientes: count });
    }
    catch (error) {
        console.error('Erro ao contar clientes:', error);
        res.status(500).json({ erro: 'Erro ao contar clientes' });
    }
});
app.use('/api', authRoutes_1.default);
app.use('/api', store_external_router_1.default);
app.use('/api', auth_middleware_1.AuthMiddleware, userRoutes_1.default);
app.use('/api', auth_middleware_1.AuthMiddleware, store_middleware_1.StoreMiddleware, storeRoutes_1.default);
// middleware de erro deve estar sempre **por último**
app.use(error_middleware_1.errorMiddleware);
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map