const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'shells_fashion_secret_2024';

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
    }

    const user = users[0];

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao fazer login'
    });
  }
};

// Verificar token
exports.verify = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token não fornecido'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      success: true,
      user: decoded
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
};

// Registrar novo usuário (admin)
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios'
      });
    }

    // Verificar se já existe
    const existing = await query('SELECT id FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email já cadastrado'
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserir usuário
    const result = await query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao registrar usuário'
    });
  }
};
