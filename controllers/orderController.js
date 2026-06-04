const { query } = require('../config/db');

// Listar todos os pedidos
exports.getAll = async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar pedidos'
    });
  }
};

// Buscar pedido por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await query('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: orders[0]
    });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar pedido'
    });
  }
};

// Criar pedido
exports.create = async (req, res) => {
  try {
    const { customer, phone, items, total } = req.body;

    if (!customer || !phone || !items || !total) {
      return res.status(400).json({
        success: false,
        error: 'Dados incompletos'
      });
    }

    const result = await query(
      `INSERT INTO orders (customer, phone, items, total, status) 
       VALUES (?, ?, ?, ?, 'pendente')`,
      [customer, phone, JSON.stringify(items), total]
    );

    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar pedido'
    });
  }
};

// Atualizar status do pedido
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatus = ['pendente', 'confirmado', 'enviado', 'entregue', 'cancelado'];
    
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status inválido'
      });
    }

    await query(
      'UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Status atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar status'
    });
  }
};

// Deletar pedido
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    await query('DELETE FROM orders WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Pedido removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar pedido'
    });
  }
};

// Estatísticas
exports.getStats = async (req, res) => {
  try {
    const [totalProducts] = await query('SELECT COUNT(*) as count FROM products WHERE active = 1');
    const [totalOrders] = await query('SELECT COUNT(*) as count FROM orders');
    const [pendingOrders] = await query("SELECT COUNT(*) as count FROM orders WHERE status = 'pendente'");
    const [revenue] = await query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status = 'entregue'");

    res.json({
      success: true,
      data: {
        totalProducts: totalProducts.count,
        totalOrders: totalOrders.count,
        pendingOrders: pendingOrders.count,
        totalRevenue: parseFloat(revenue.total) || 0
      }
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
};
