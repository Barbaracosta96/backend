import API_CONFIG from '../Config/api.config';
import logger from '../utils/logger';

class CacheService {
    constructor() {
        this.cache = new Map();
        this.timeouts = new Map();
    }

    generateKey(endpoint, params = {}) {
        return `${endpoint}:${JSON.stringify(params)}`;
    }

    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() > cached.expiry) {
            this.delete(key);
            return null;
        }

        logger.debug(`Cache hit for key: ${key}`);
        return cached.data;
    }

    set(key, data, duration = API_CONFIG.cacheDuration) {
        const expiry = Date.now() + duration;
        
        this.cache.set(key, {
            data,
            expiry
        });

        // Configurar limpeza automática
        this.timeouts.set(key, setTimeout(() => {
            this.delete(key);
        }, duration));

        logger.debug(`Cache set for key: ${key}`);
    }

    delete(key) {
        this.cache.delete(key);
        
        const timeout = this.timeouts.get(key);
        if (timeout) {
            clearTimeout(timeout);
            this.timeouts.delete(key);
        }

        logger.debug(`Cache deleted for key: ${key}`);
    }

    clear() {
        this.cache.clear();
        
        // Limpar todos os timeouts
        this.timeouts.forEach(timeout => clearTimeout(timeout));
        this.timeouts.clear();

        logger.info('Cache cleared');
    }

    async getOrFetch(key, fetchFn) {
        const cached = this.get(key);
        if (cached) return cached;

        try {
            const data = await fetchFn();
            this.set(key, data);
            return data;
        } catch (error) {
            logger.error(`Error fetching data for key ${key}:`, error);
            throw error;
        }
    }
}

export default new CacheService(); 