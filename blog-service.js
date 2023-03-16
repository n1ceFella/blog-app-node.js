
const Sequelize = require('sequelize');
var sequelize = new Sequelize("wemdoank", "wemdoank", "EzQLHA5h_e6smUgWRWC3WrfsfW5GoiiS", {
    host: 'isilo.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

var Post = sequelize.define('Post', {
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});
var Category = sequelize.define('Category', {
    category: Sequelize.STRING
});

//will set Post.category = null if deleted
Post.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        //resolve only if DB tables syncronized
        sequelize.sync().then(function(){
            resolve()
        }).catch(function(error){
            reject("unable to sync the database : " + error)
        });
    });
}

module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {

        Post.findAll().then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
});
};
module.exports.getPublishedPosts = function() {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });
};
module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        Category.findAll().then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });
}

module.exports.addPost = (postData) => {
    return new Promise((resolve, reject) => {
        //format data before insert
        postData.published = (postData.published) ? true : false;
        for (prop in postData) {
            if(postData[prop] == ""){
                postData[prop] = null;
            }
        }
        postData.postDate = new Date();
        Post.create({
            body: postData.body,
            title: postData.title,
            postDate: postData.postDate,
            featureImage: postData.featureImage,
            published: postData.published,
            category: postData.category
        }).then(function (post) {
            resolve(post)
        }).catch(function(){
            reject("unable to create post");
        });
    });
}

module.exports.getPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category : categoryID
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });
}

module.exports.getPublishedPostsByCategory = (category) => {
    return new Promise((resolve, reject) => {
        Post.findAll({
            where: {
                published: true,
                category : categoryID
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });
}

module.exports.getPostsByMinDate = (minDateStr) => {

    return new Promise((resolve, reject) => {
        // >= analogue
        const { gte } = Sequelize.Op;
        Post.findAll({
            where: {
                postDate:{[gte]: new Date(minDateStr)}
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
});
}

module.exports.getPostById = (id) => {
    return new Promise((resolve, reject) => {
        Post.findOne({
            where: {
                id: postID
            }
        }).then(function(data){
            resolve(data);
        }).catch(function(){
            reject("no results returned");
        });
    });
}