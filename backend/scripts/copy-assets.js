import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const targets = [
  {
    from: path.join(projectRoot, 'src', 'db', 'migrations'),
    to: path.join(projectRoot, 'dist', 'db', 'migrations')
  },
  {
    from: path.join(projectRoot, 'src', 'db', 'seed'),
    to: path.join(projectRoot, 'dist', 'db', 'seed')
  }
];

const copyDirectory = async (from, to) => {
  await fs.promises.mkdir(to, { recursive: true });
  await fs.promises.cp(from, to, { recursive: true });
};

const run = async () => {
  for (const { from, to } of targets) {
    const exists = fs.existsSync(from);
    if (!exists) {
      throw new Error(`Ruta de origen no encontrada: ${from}`);
    }
    await copyDirectory(from, to);
  }
};

run().catch((error) => {
  console.error('Error copiando archivos estáticos de base de datos', error);
  process.exitCode = 1;
});
