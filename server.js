const app = require('./app');
const  connectDB  = require('./config/db');

const PORT = process.env.PORT || 5000;

// função bootstrap segura
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 SHELLS FASHION ELEGANCE - Backend                     ║
║                                                            ║
║   Servidor: http://localhost:${PORT}                        ║
║   Local: Maputo, Moçambique                                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Porta ${PORT} já está em uso. Pare outro processo ou use uma porta diferente via PORT.`);
        process.exit(1);
      }
      console.error('❌ Erro ao iniciar servidor:', error.message || error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error.message || error);
    process.exit(1);
  }
};

startServer();
