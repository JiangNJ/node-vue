/*网上别人写好的针对mongodb@3.0.8版本的增删改查的封装，后面有改成mongoose,后面会提到 */


var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var assert = require('assert');
var url = require('url');
var host = "localhost";
var port = "27017";
var Urls = 'mongodb://localhost:27017/moon'; // moon  ===> 是自己要连接的这个项目的数据库名



//add一条数据 
var add = function(db, collections, selector, fn) {
        var collection = db.collection(collections);
        collection.insertMany([selector], function(err, result) {
            try {
                assert.equal(err, null)
            } catch (e) {
                console.log(e);
                result = [];
            };

            fn(result);
            db.close();
        });
    }
    //delete
var deletes = function(db, collections, selector, fn) {
    var collection = db.collection(collections);
    collection.deleteOne(selector, function(err, result) {
        try {
            assert.equal(err, null);
            assert.notStrictEqual(0, result.result.n);
        } catch (e) {
            console.log(e);
            result.result = "";
        };

        fn(result.result ? [result.result] : []); //如果没报错且返回数据不是0，那么表示操作成功。
        db.close;
    });
};
//find
var find = function(db, collections, selector, fn) {
    //collections="hashtable";
    var collection = db.collection(collections);

    collection.find(selector).toArray(function(err, result) {
        //console.log(docs);
        try {
            assert.equal(err, null);
        } catch (e) {
            console.log(e);
            result = [];
        }

        fn(result);
        db.close();
    });

}

//page
var page = function(db, collections, selector, fn) {

    var collection = db.collection(collections);
    var count = 0;
    collection.count({}, function(err1, count1) {
        try {
            assert.equal(err1, null);
        } catch (e) {
            console.log(e);
        }
        count = count1;
    });
    collection.find(selector[0], selector[1]).toArray(function(err, result) {
        try {
            assert.equal(err, null);
        } catch (e) {
            console.log(e);
            result = [];
        }

        fn(result, count); //回掉函数可接收两个参数，查询的数据 和 总数据条数
        db.close();
    });


}

//update
var updates = function(db, collections, selector, fn) {
    var collection = db.collection(collections);

    collection.updateOne(selector[0], selector[1], function(err, result) {
        try {
            assert.equal(err, null);
            assert.notStrictEqual(0, result.result.n);
        } catch (e) {
            console.log("update错啦:" + e);
            result.result = "";
        };

        fn(result.result ? [result.result] : []); //如果没报错且返回数据不是0，那么表示操作成功。
        db.close();
    });

}

/*自己修改的向外暴露的增删改的接口*/
var methodType = {
    login: find,
    show: find, //后台部分
    add: add,
    find: find,
    courseList: updates,
    update: updates,
    delete: deletes,
    updatePwd: updates,
    showCourse: find,
    register: add,
    page: page //分页
};

module.exports = function(req, res, i, collections, selector, fn) { //i是要执行的操作，例如find，delete和上面的methodType对应  //collections 要操作的表名  //selector要传的参数  //fn回调函数
    MongoClient.connect(Urls, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        // 根据 请求的地址来确定是什么操作  （为了安全，避免前端直接通过请求url操作数据库）
        methodType[i](db, collections, selector, fn);

        db.close();
    });

};