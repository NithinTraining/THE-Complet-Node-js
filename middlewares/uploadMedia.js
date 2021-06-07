const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './resources/static/assets/uploads/')
    },
    filename: (req, file, cb) => {
        const fileType = file.mimetype.split('/');
        if (fileType[0] === 'image' && file.fieldname === 'file') {
            cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
        }
    }
});

const upload = multer({ storage }).fields([
    {
        name: 'file',
        maxCount: 5
    },
]);

module.exports = async (req, res, next) => {
    try {
        upload(req, res, (err) => {
            if (req.files) {
                let validationError = err || '';
                const { file } = req.files;
                if (validationError) {
                    return res.json({
                        success: false,
                        message: validationError,
                        data: {},
                    });
                }
            }
            next();
        })
    } catch (error) {
        console.log("err",error);
        return res.status(201).json({
            success: false,
            message: "upload error"
        })
    }
}
