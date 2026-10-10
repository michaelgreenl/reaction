const settingsRanges = {
    circleSize: [25, 125],
    spawnInterval: [0.25, 2],
    shrinkTime: [0.25, 2],
};
const sortFields = new Set(['createdAt', 'score', 'time']);
const sortOrders = new Set(['ASC', 'DESC']);

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const inRange = (value, [min, max]) =>
    typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;

const settings = ({ body }) => {
    for (const [field, range] of Object.entries(settingsRanges)) {
        if (!inRange(body?.[field], range) || (field === 'circleSize' && !Number.isInteger(body[field]))) {
            return `Invalid ${field}`;
        }

        if (field !== 'circleSize' && !Number.isInteger(body[field] * 4)) return `Invalid ${field}`;
    }

    return null;
};

const credentials = ({ body }) => {
    if (typeof body?.username !== 'string' || body.username.trim().length < 3 || body.username.trim().length > 30) {
        return 'Username must contain 3 to 30 characters';
    }

    if (
        typeof body?.password !== 'string' ||
        Buffer.byteLength(body.password) < 8 ||
        Buffer.byteLength(body.password) > 72
    ) {
        return 'Password must contain 8 to 72 bytes';
    }

    return null;
};

const loginCredentials = ({ body }) => {
    if (typeof body?.username !== 'string' || body.username.length === 0) return 'Username is required';
    if (typeof body?.password !== 'string' || body.password.length === 0) return 'Password is required';
    return null;
};

const game = (req) => {
    const { score, time, settings: gameSettings } = req.body || {};
    if (!Number.isInteger(score) || score < 0 || score > 2_147_483_647) return 'Invalid score';
    if (typeof time !== 'number' || !Number.isFinite(time) || time < 0) return 'Invalid time';
    if (!isObject(gameSettings)) return 'Invalid settings';

    return settings({ body: gameSettings });
};

const gamesQuery = (req) => {
    const { query } = req;
    const limit = query.limit === undefined ? 10 : Number(query.limit);
    const offset = query.offset === undefined ? 0 : Number(query.offset);
    const sortedBy = query.sortedBy || 'createdAt';
    const sortedOrder = query.sortedOrder || 'DESC';

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) return 'Invalid limit';
    if (!Number.isInteger(offset) || offset < 0) return 'Invalid offset';
    if (!sortFields.has(sortedBy)) return 'Invalid sort field';
    if (!sortOrders.has(sortedOrder)) return 'Invalid sort order';

    req.validatedQuery = { limit, offset, sortedBy, sortedOrder };
    return null;
};

const gameFilters = (req) => {
    const queryError = gamesQuery(req);
    if (queryError) return queryError;

    try {
        req.validatedFilters = JSON.parse(req.query.filters);
    } catch {
        return 'Invalid filters';
    }

    if (!Array.isArray(req.validatedFilters) || req.validatedFilters.length < 1 || req.validatedFilters.length > 3) {
        return 'Invalid filters';
    }

    const fields = new Set();
    for (const filter of req.validatedFilters) {
        if (!isObject(filter) || fields.has(filter.filter) || !Object.hasOwn(settingsRanges, filter.filter)) {
            return 'Invalid filters';
        }
        if (!inRange(filter.value, settingsRanges[filter.filter])) return `Invalid ${filter.filter}`;
        if (filter.filter === 'circleSize' && !Number.isInteger(filter.value)) return 'Invalid circleSize';
        if (filter.filter !== 'circleSize' && !Number.isInteger(filter.value * 4)) return `Invalid ${filter.filter}`;
        fields.add(filter.filter);
    }

    return null;
};

module.exports = { credentials, game, gameFilters, gamesQuery, loginCredentials, settings };
