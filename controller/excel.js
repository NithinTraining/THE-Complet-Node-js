const db = require("../models");
const path =require("path")
// const Tutorial = db.tutorial;

const excel = require("exceljs");

const download = async(req, res) => {
    // console.log(db);
   const objs= await db.tutorial.findAll() 
        let tutorials = [];

        objs.forEach((obj) => {
            tutorials.push({
                id: obj.id,
                title: obj.title,
                description: obj.description,
                published: obj.published,
            });
        });
    


    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Tutorials");

    worksheet.columns = [
        { header: "Id", key: "id", width: 5 },
        { header: "Title", key: "title", width: 25 },
        { header: "Description", key: "description", width: 25 },
        { header: "Published", key: "published", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(tutorials);
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=tutorial.xlsx");

    workbook.xlsx.writeFile("./tutorial.xlsx").then(
        (response) => {
            console.log("File is created"); // I'm able to see this in my console
            console.log(path.join(__dirname, "../tutorial.xlsx"));
            res.sendFile(path.join(__dirname, "../tutorial.xlsx"));
        },
        (err) => {
            console.log("ERROR: ", err);
        }
    );

    




  
};

module.exports = {
    download,
};