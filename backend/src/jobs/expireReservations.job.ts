import cron from 'node-cron';
import { expireReservations } from '../modules/reservations/reservations.service.js';
import { logger } from '../utils/logger.js';

export const startExpirationJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const count = await expireReservations();
      if (count > 0) {
        logger.info(`Reservas expiradas: ${count}`);
      }
    } catch (error) {
      logger.error('Error en job de expiración', { error });
    }
  });
};
