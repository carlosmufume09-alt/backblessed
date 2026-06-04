const { query } = require('../config/db');

// Buscar configurações da loja
exports.getStore = async (req, res) => {
  try {
    const stores = await query('SELECT * FROM store LIMIT 1');
    
    if (stores.length === 0) {
      return res.json({
        success: true,
        data: {
          name: 'Shells Fashion Elegance',
          description: 'Loja de moda elegante - Moçambique',
          whatsapp: '+258879992762',
          phone: '847052762',
          email: 'shells@fashion.com',
          address: 'Khongolote, Maputo, Moçambique'
        }
      });
    }
    
    res.json({
      success: true,
      data: stores[0]
    });
  } catch (error) {
    console.error('Erro ao buscar loja:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar configurações'
    });
  }
};

// Atualizar configurações da loja
exports.updateStore = async (req, res) => {
  try {
    const { name, description, whatsapp, phone, email, address, logo, instagram, facebook } = req.body;

    // Verificar se existe
    const stores = await query('SELECT id FROM store LIMIT 1');
    
    if (stores.length === 0) {
      // Criar
      await query(
        `INSERT INTO store (name, description, whatsapp, phone, email, address, logo, instagram, facebook) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, description, whatsapp, phone, email, address, logo, instagram, facebook]
      );
    } else {
      // Atualizar
      await query(
        `UPDATE store SET 
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          whatsapp = COALESCE(?, whatsapp),
          phone = COALESCE(?, phone),
          email = COALESCE(?, email),
          address = COALESCE(?, address),
          logo = COALESCE(?, logo),
          instagram = COALESCE(?, instagram),
          facebook = COALESCE(?, facebook),
          updated_at = NOW()
         WHERE id = ?`,
        [name, description, whatsapp, phone, email, address, logo, instagram, facebook, stores[0].id]
      );
    }

    res.json({
      success: true,
      message: 'Configurações atualizadas com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar loja:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar configurações'
    });
  }
};
