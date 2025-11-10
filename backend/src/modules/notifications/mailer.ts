import nodemailer from 'nodemailer';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

type MailOptions = {
  to: string;
  subject: string;
  text: string;
};

let transporter: nodemailer.Transporter | null = null;

const createTransport = () => {
  try {
    transporter = nodemailer.createTransport({
      host: env.mailhogHost,
      port: env.mailhogPort,
      secure: false
    });
    return transporter;
  } catch (error) {
    logger.warn('Falling back to console mailer', { error });
    transporter = null;
    return null;
  }
};

export const sendMail = async (options: MailOptions) => {
  const mailer = transporter ?? createTransport();
  if (!mailer) {
    logger.info('[MAIL] (simulado)', options);
    return;
  }

  try {
    await mailer.sendMail({
      from: 'AngelShop <no-reply@local>',
      ...options
    });
    logger.info('Correo enviado', { to: options.to, subject: options.subject });
  } catch (error) {
    logger.warn('No se pudo enviar correo, usando simulación', { error });
    logger.info('[MAIL] (simulado)', options);
  }
};
