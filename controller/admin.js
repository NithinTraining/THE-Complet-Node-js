const db = require("../models");
const jwt = require("jsonwebtoken");
const permission = require("../databaseFeed/permission.json");
const bcryptjs = require("bcryptjs");
const { checkPermission } = require("../helpers");

const defaultPassword = "SuperAdmin";

const adminSeed = {
  name: "admin",
  email: "superAdmin@mail.com",
  mobile:996969696,
  password: "",
};
// const roleSeed=[
//     {
//         name: 'SUPER_ADMIN'
//     }
// ]

module.exports = {
  createSuperAdmin: async (req, res) => {
    try {
      const salt = await bcryptjs.genSalt(10);
      const hash = await bcryptjs.hash(defaultPassword, salt);
      adminSeed.password = hash;
      permission[0].permissions.map(async (item) => {
        await db.permission.create(item);
      });

      const adminRole = await db.role.create({ name: "SUPER_ADMIN" });

      const superAdmin = await db.user.create(adminSeed);

      const permissionList = await db.permission.findAll();

      permissionList.map(async (permission) => {
        await db.rolesPermission.create({
          permission_id: permission.permission_id,
          role_id: adminRole.role_id,
        });
      });

      await db.rolesUser.create({
        user_id: superAdmin.user_id,
        role_id: adminRole.role_id,
      });
      return res.status(200).json({
        success: true,
        message: "admin seeded successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },

  createRole: async (req, res) => {
    try {
      const { isPermission } = await checkPermission({
        userId: req.user.user_id,
        permission: "ROLE_MANAGEMENT",
      });
      if (!isPermission) {
        return res.status().json({
          success: false,
          message: "you have no permission to create a role",
        });
      }
      const newRole = await db.role.create({role_id:req.body.roleId, name: req.body.roleName });

      for (const id of req.body.permissionIds) {
        await db.rolesPermission.create({
          permission_id: id,
          role_id: newRole.role_id,
        });
      }
      return res.status(200).json({
        success: true,
        message: "role create successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },

  listPermissions: async (req, res) => {
    try {
      console.log(req.user);
      const { isPermission } = await checkPermission({
        
        userId: req.user.user_id,
        permission: "ROLE_MANAGEMENT",
      });
      console.log({ isPermission });
      if (!isPermission) {
        return res.status(404).json({
          success: false,
          message: "you have no permission to list permissions",
        });
      }

      const permissions = await db.permission.findAll();

      return res.status(200).json({
        success: true,
        Data: permissions,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "something went wrong",
      });
    }
  },
};
