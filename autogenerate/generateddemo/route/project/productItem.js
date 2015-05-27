//产品个体管理Ctrl
var productItemCtrl = require('../app/controllers/project/productItem');


//产品个体管理
app.get("/project/productItem/toSearchList", productItemCtrl.toSearchList);
app.post("/project/productItem/searchList", productItemCtrl.searchList);
app.post("/project/productItem/save", productItemCtrl.add);
app.post("/project/productItem/remove", productItemCtrl.remove);
app.post("/project/productItem/update", productItemCtrl.updateById);
