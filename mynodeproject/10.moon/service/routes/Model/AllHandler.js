var assert = require('assert'); //断言包
//这个页面来封装基本的增删改查的方法


//增
var add = function(Mod, selector, fn) { //参数1是实例化的Model,参数2是需要新增的内容
    var model = new Mod(selector[0]);
    try {
        model.save(function(err, res) {
            assert.equal(err, null);
            fn(res)
        })
    } catch (ex) {
        console.log("AllHandler报错：" + ex);
        fn([]);
    }

}

//查
//查所有根据条件
var find = function(Mod, selector, fn) {
    try {
        Mod.find(selector[0], selector[1] ? selector[1] : "", function(err, res) {
            assert.equal(err, null);
            fn(res)
        })
    } catch (ex) {
        console.log("AllHandler报错：" + ex);
        fn([]);
    }


}


//通过ID更新某条数据
var updateById = function(Mod, selector, fn) {
    var id = selector[0].id;
    var updatestr = selector[1];
    try {
        Mod.findByIdAndUpdate(id, updatestr, function(err, res) {
            if (err) {
                assert.equal(err, null);
            } else {
                fn(res);
            }
        })
    } catch (ex) {
        console.log("AllHandler报错：" + ex);
        fn(null);
    }

};

//通过ID来删除一条数据
var deleteById = function(Mod, selector, fn) {
    var id = selector[0].id;
    try {
        Mod.findByIdAndRemove(id, function(err, res) {
            if (err) {
                assert.equal(err, null);
            } else {
                fn(res);
            }
        })

    } catch (ex) {
        console.log("AllHandler报错：" + ex);
        fn(null);
    }

};

//通过条件来删除所有符合条件的
var deleteByStr = function(Mod, selector, fn) {
    var conditions = selector[0];
    try {
        Mod.remove(conditions, function(err, res) {
            if (err) {
                assert.equal(err, null);
            } else {
                fn(res);
            }
        })
    } catch (ex) {
        console.log("AllHandler报错：" + ex);
        fn(null);
    }

}



//分页
var page = function(Mod, selector, fn) {
    var pageSize = selector[1].pageSize || 5; //一页多少条
    var currentPage = selector[1].currentPage || 1; //当前第几页
    var skipnum = (currentPage - 1) * pageSize; //跳过数
    try {
        var results;
        var count;
        Mod.count(selector[0], function(err, result2) {
            assert.equal(err, null);
            count = result2;
        });
        /* Mod.find({}, function(err, res) { //在mongoose中第一个参数查询条件必须是一个json集合对象，如果是空写成{}，而不能是“”；
                 assert.equal(err, null);
                 console.log(res)
                 fn(res)
             })*/
        Mod.find(selector[0]).skip(skipnum).limit(pageSize).exec(function(err, res) {
            //console.log("hahaha")
            assert.equal(err, null);
            if (res) {
                results = res;
                //console.log(count, results)
                fn(results, count);
            }

        });

    } catch (ex) {
        console.log("AllHandler报错：" + ex);

    }
}




var OperateType = {
    add: add,
    find: find,
    findSome: find,
    page: page,
    deleteByStr: deleteByStr,
    deleteById: deleteById,
    updateById: updateById

};


module.exports = function(Mod, i, selector, fn) { //model ; 参数 ； 回调函数
    OperateType[i](Mod, selector, fn);
}