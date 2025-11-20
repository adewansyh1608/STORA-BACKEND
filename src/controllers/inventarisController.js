const { Inventaris, FotoInventaris, User, sequelize } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class InventarisController {
  // Get all inventaris
  async getAllInventaris(req, res) {
    try {
      const { page = 1, limit = 10, search = '', kategori = '', kondisi = '' } = req.query;
      const offset = (page - 1) * limit;

      let whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { Nama_Barang: { [Op.like]: `%${search}%` } },
          { Kode_Barang: { [Op.like]: `%${search}%` } }
        ];
      }
      if (kategori) {
        whereClause.Kategori = kategori;
      }
      if (kondisi) {
        whereClause.Kondisi = kondisi;
      }

      const { count, rows } = await Inventaris.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']],
        include: [
          {
            association: 'user',
            attributes: ['ID_User', 'Nama_User']
          },
          {
            association: 'foto',
            attributes: ['ID_Foto_Inventaris', 'Foto']
          }
        ]
      });

      res.status(200).json({
        success: true,
        data: rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get inventaris by ID
  async getInventarisById(req, res) {
    try {
      const { id } = req.params;
      const inventaris = await Inventaris.findByPk(id, {
        include: [
          {
            association: 'user',
            attributes: ['ID_User', 'Nama_User', 'Email']
          },
          {
            association: 'foto',
            attributes: ['ID_Foto_Inventaris', 'Foto']
          }
        ]
      });
      
      if (!inventaris) {
        return res.status(404).json({
          success: false,
          message: 'Inventaris not found'
        });
      }

      res.status(200).json({
        success: true,
        data: inventaris
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create new inventaris
  async createInventaris(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const inventarisData = req.body;
      const newInventaris = await Inventaris.create(inventarisData);
      
      res.status(201).json({
        success: true,
        message: 'Inventaris created successfully',
        data: newInventaris
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update inventaris
  async updateInventaris(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const [updatedRowsCount] = await Inventaris.update(updateData, {
        where: { ID_Inventaris: id }
      });
      
      if (updatedRowsCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Inventaris not found'
        });
      }

      const updatedInventaris = await Inventaris.findByPk(id, {
        include: [
          {
            association: 'user',
            attributes: ['ID_User', 'Nama_User']
          },
          {
            association: 'foto',
            attributes: ['ID_Foto_Inventaris', 'Foto']
          }
        ]
      });

      res.status(200).json({
        success: true,
        message: 'Inventaris updated successfully',
        data: updatedInventaris
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete inventaris
  async deleteInventaris(req, res) {
    try {
      const { id } = req.params;
      const deletedRowsCount = await Inventaris.destroy({
        where: { ID_Inventaris: id }
      });
      
      if (deletedRowsCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Inventaris not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Inventaris deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get inventaris statistics
  async getInventarisStats(req, res) {
    try {
      const totalItems = await Inventaris.count();
      const itemsByKondisi = await Inventaris.findAll({
        attributes: [
          'Kondisi',
          [sequelize.fn('COUNT', sequelize.col('ID_Inventaris')), 'count']
        ],
        group: ['Kondisi']
      });
      
      const itemsByKategori = await Inventaris.findAll({
        attributes: [
          'Kategori',
          [sequelize.fn('COUNT', sequelize.col('ID_Inventaris')), 'count']
        ],
        group: ['Kategori']
      });

      res.status(200).json({
        success: true,
        data: {
          totalItems,
          itemsByKondisi,
          itemsByKategori
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new InventarisController();
