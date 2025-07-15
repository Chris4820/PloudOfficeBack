"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStatsStoreController = GetStatsStoreController;
const statistic_service_1 = require("./statistic.service");
async function GetStatsStoreController(req, res, next) {
    try {
        const { start, end } = req.query;
        console.log(start);
        const from = start ? new Date(start) : undefined;
        const to = end ? new Date(end) : undefined;
        console.log(from);
        const statistic = await (0, statistic_service_1.getStatisticStore)(req.storeId, { start: from, end: to });
        const top = await (0, statistic_service_1.getTopServices)(req.storeId, { start: from, end: to });
        const employed = await (0, statistic_service_1.getTopEmployees)(req.storeId, { start: from, end: to });
        return res.status(200).json({
            statistic: {
                statistic,
                top,
                employed
            }
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=statistic.controller.js.map