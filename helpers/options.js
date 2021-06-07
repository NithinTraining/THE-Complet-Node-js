module.exports = {
    formate: 'A3',
     orientation: 'portrait',
     border: '',
     height: "11.25in",
     width: "18in",
     header: {
         height: "20mm",
         width: "3in",
         contents: '<h4 style=" color: red;font-size:20;font-weight:800;text-align:center;">CUSTOMER INVOICE</h4>'
     },
     footer: {
         height: '20mm',
         contents: {
             first: 'Cover page',
             2: 'Second page',
             default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', 
             last: 'Last Page'
         }
     }
 }