const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const options = require('../helpers/options');
const data = require('../helpers/data');
const db = require('../models');
const user = require('./user');
const PDFparser = require("pdf2json")
// const filePath = path.join(__dirname, '../public/training.pdf')
// const extract = require("pdf-text-extract")


const homeview = (req, res, next) => {
    res.render('home');
}

const generatePdf = async (req, res, next) => {
    console.log("jaz");
    const html = fs.readFileSync(path.join(__dirname, '../views/template.html'), 'utf-8');
    const filename = Math.random() + '_doc' + '.pdf';
    let array = [];

    data.forEach(d => {
        const prod = {
            name: d.name,
            description: d.description,
            quantity: d.quantity,
            price: d.price,
            total: d.quantity * d.price,
            imgurl: d.imgurl
        }
        array.push(prod);
    });

    let subtotal = 0;
    array.forEach(i => {
        subtotal += i.total
    });
    const tax = (subtotal * 20) / 100;
    const grandtotal = subtotal - tax;
    const obj = {
        prodlist: array,
        subtotal: subtotal,
        tax: tax,
        gtotal: grandtotal
    }
    const document = {
        html: html,
        data: {
            products: obj
        },
        path: './docs/' + filename
    }
    pdf.create(document, options)
        .then(res => {
            console.log(res);
        }).catch(error => {
            console.log(error);
        });
    const filepath = 'http://localhost:3000/docs/' + filename;

    res.render('download', {
        path: filepath
    });
}

const viewLogin = (req, res) => {
    res.render('login', { title: 'Login Page', message: 'loginMessage' })
}

const viewDashboard = async (req, res) => {
    try {
        console.log();
        const { isPermission } = await checkPermission({
            userId: req.user.user_id,
            permission: "LIST_USER",
        });
        if (!isPermission) {
            return res.status(404).json({
                success: false,
                message: "you have no permission to list users",
            });
        }
        // const page = ({ limit = 10, currentPage = 1 } = req.query);
        // const pagination = LimitOffset(Paginate(page));

        // const count = await db.user.count();

        // let usersList = await db.user.findAll({
        //   limit: pagination.limit,
        //   offset: pagination.offset,
        // });

        // usersList = {
        //   userList: usersList ? usersList.map((i) => i.dataValues) : [],
        //   pagination: { ...Paginate(page), totalCount: count },
        // };
        //         var perPage = 10

        //         var page = req.params.id ||5
        //       console.log(page)
        //    await db.user.find({})
        //             .skip((perPage * page) - perPage)
        //             .limit(perPage)
        //             .exec(function(err, usersList) {
        //                  console.log(products)
        //                 user.count().exec(function(err, count) {
        //                     if (err) return next(err)
        //                     res.render('dashboard', {
        //                         usersList: usersList,
        //                         current: page,
        //                         pages: Math.ceil(count / perPage)


        //                     })
        //                 })})
        const usersList = await db.user.findAll();
        res.render(
            'dashboard', { usersList }
        );
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error",
        });
    }

}
const pdfjson = (req, res) => {
    let pdfParser = new PDFparser(this, 1)
    pdfParser.on("pdfParser_dataError", errData => console.log(errData.parserError))
    
    pdfParser.on("pdfParser_dataReady", pdfData => {
        // fs.readfile(path.join(__dirname, "sample.json"), pdfParser.getRawTextContent());
        console.log(pdfData);
        res.json({ "extractedData": pdfParser.getRawTextContent() })
    })
    pdfParser.loadPDF(path.join(__dirname, "../public/training.pdf"))
}
const pdfExtract =(req,res)=>{


    var path = require('path')
    var filePath = path.join(__dirname, '../public/training.pdf')
    var extract = require("pdf-text-extract")
    var options = {
        crop:true,
        raw:true
      }
  
    extract(filePath,options, function (err, pages) {
      if (err) {
        console.dir(err)
        return
      }
      
    
      // console.log(JSON.stringify(pages[0]));
    
    let X=pages[0]
    let Y="Quotation number";
    let Z=X.slice(X.indexOf(Y)+Y.length);
    let r1=Z.substring(0, 10)
    console.log("Quotation number",Z.substring(0, 10));
    let Q="Period of cover"
    let F=X.slice(X.indexOf(Q)+Q.length)
    console.log("Period of cover",F.substring(0, 10));
    //console.log(F)
    let G =" Quotation date"
    let S=X.slice(X.indexOf(G)+G.length)
    console.log(" Quotation date",S.substring(0, 10));
    let H="Maximum entitlement per one claim"
    let L=X.slice(X.indexOf(H)+H.length)
    console.log("Maximum entitlement per one claim",L.substring(0, 10));
    let K="Accommodation & return home travel"
    let J=X.slice(X.indexOf(K)+K.length)
    console.log("Accommodation & return home travel",J.substring(0, 23));
    
    let obj={
        "Quotation number":Z.substring(0,10),
        "Period of cover":F.substring(0, 10),
        "Quotation date":S.substring(0, 10),
        "Maximum entitlement per one claim":L.substring(0, 10),
        "Accommodation & return home travel":J.substring(0, 23)



    }
    console.log(JSON.stringify(obj));
    
    fs.writeFileSync("patients.json", JSON.stringify(r1))
    })
      

    res.end()
}
const pdfPars=(req,res)=>{
    const fs = require('fs');
const pdf = require('pdf-parse');
let render_options = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: true,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: true
}
 
let dataBuffer = fs.readFileSync(path.join(__dirname, '../public/training.pdf'));
 
pdf(dataBuffer,render_options).then(function(data) {
 
    // number of pages
    // console.log(data.numpages);
    // number of rendered pages
    // console.log(data.numrender);
    // PDF info
    // console.log(data.info);
    // PDF metadata
    // console.log(data.metadata); 
    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    // console.log(data.version);
    // PDF text
    console.log(JSON.stringify(data.text)); 
        
});
}
module.exports = {
    homeview,
    generatePdf,
    viewLogin,
    viewDashboard,
    pdfjson,
    pdfExtract,
    pdfPars
}