const express = require('express')
const router = express.Router();
const userController = require("../controller/user");
const adminController = require("../controller/admin")
const { checkToken } = require('../middlewares/auth');
const uploadMedia = require('../middlewares/uploadMedia')
const excelController=require("../controller/excel");
// const { paginatedResults } = require('../middlewares/pagination');



/**
 * @swagger
 *  /superAdminSeed:
 *      post:
 *          tags:
 *              -   Seed
 *          description: Seed super admin                
 *          responses:
 *              200 :
 *                  description: seeded successfull
 *
 *
 */
router.post('/superAdminSeed', adminController.createSuperAdmin)

 /**
  * @swagger
  *  /listPermissions:
  *      get:
  *          security:
  *              - Bearer: []
  *          tags:
  *              -   SuperAdmin
  *          description: permisions                            
  *          responses:
  *              200 :
  *                  description: permissions listed
  *
  *
  */
  router.get('/listPermissions', checkToken, adminController.listPermissions)

/**
 * @swagger
 *  /createRole:
 *      post:
 *          security:
 *              - Bearer: []
 *          tags:
 *              -   SuperAdmin
 *          description: list custom brands
 *          parameters:
 *              -   in: body
 *                  name : request body
 *                  description: create new role.
 *                  type: object
 *                  schema:
 *                      properties:
 *                          roleId:
 *                              type: string
 *                              required: true,
 *                              example: "3"
 *                          roleName:
 *                              type: string
 *                              required: true,
 *                              example: "customer"
 *                          permissionIds:
 *                              type: array,
 *                              required: true,
 *                              example: "[3,4]" 
 *          responses:
 *              200 :
 *                  description: role created successfully
 *
 *
 */
 router.post('/createRole', checkToken, adminController.createRole)

/**
 * @swagger
 *  /sign-up:
 *      post:
 *          tags:
 *              -   Auth
 *          description: Signup
 *          parameters:
 *              -   in: body
 *                  name : request body
 *                  description: All fields are required.
 *                  type: object
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                              required: true,
 *                              example: "jaz"
 *                          email:
 *                              type: string
 *                              required: true,
 *                              example: "test@mailinator.com"
 *                          password:
 *                              type: string,
 *                              required: true,
 *                              example: "123456"                   
 *                          isAdmin:
 *                              type: boolean,
 *                              required: true,
 *                              example: "false"  
 *                                         
 *          responses:
 *              200 :
 *                  description: login successfull
 *
 *
 */
router.post('/sign-up', userController.signUp);

/**
 * @swagger
 *  /login:
 *      post:
 *          tags:
 *              -   Auth
 *          description: Login
 *          parameters:
 *              -   in: body
 *                  name : request body
 *                  description: All fields are required.
 *                  type: object
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              required: true,
 *                              example: "test@mailinator.com"
 *                          password:
 *                              type: string,
 *                              required: true,
 *                              example: "123456"                   
 *          responses:
 *              200 :
 *                  description: login successfull
 *
 *
 */
router.post('/login', userController.login)

 /**
  * @swagger
  *  /all-users:
  *      get:
  *          security:
  *              - Bearer: []
  *          tags:
  *              -   All users
  *          description: list all users                            
  *          responses:
  *              200 :
  *                  description: users listed
  *
  *
  */
router.get('/all-users', checkToken, userController.allUsers)

 /**
  * @swagger
  *  /profile:
  *      get:
  *          security:
  *              - Bearer: []
  *          tags:
  *              -   Profile
  *          description: get profile details                            
  *          responses:
  *              200 :
  *                  description: get profile successfully
  *
  *
  */
router.get('/profile', checkToken, userController.getProfile)

/**
 * @swagger
 *  /forgot-password:
 *      post:
 *          tags:
 *              -   Forgot Password
 *          description: forgot password
 *          parameters:
 *              -   in: body
 *                  name : request body
 *                  description: Email is required.
 *                  type: object
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              required: true,
 *                              example: "test@mailinator.com"                 
 *          responses:
 *              200 :
 *                  description: mail sent successfully
 *
 *
 */
router.post('/forgot-password', userController.pforgot)

/**
 * @swagger
 *  /reset-password:
 *      post:
 *          tags:
 *              -   Reset Password
 *          description: reset password
 *          parameters:
 *              -   in: body
 *                  name : request body
 *                  description: all fields are required.
 *                  type: object
 *                  schema:
 *                      properties:
 *                          password:
 *                              type: string
 *                              required: true,
 *                              example: "123456"                 
 *                          token:
 *                              type: string
 *                              required: true,
 *                              example: ""                 
 *          responses:
 *              200 :
 *                  description: mail sent successfully
 *
 *
 */
router.post('/reset-password', userController.pReset)

router.get('/set-password', userController.setPassword)
/**
 * @swagger
 *  /file-upload:
 *      post:
 *          security:
 *              - Bearer: []
 *          tags:
 *              -   File Upload
 *          description: file upload
 *          consumes:
 *              -   multipart/form-data
 *          parameters:
 *              -   in: formData
 *                  name : file
 *                  description: the file to upload.
 *                  type: file               
 *          responses:
 *              200 :
 *                  description: mail sent successfully
 *
 *
 */
router.post('/file-upload', checkToken, uploadMedia, userController.fileUpload)
router.get("/excelDownload",excelController.download)



// router.post()
module.exports = router;
