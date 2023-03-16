const fs = require("fs"); 

var posts = [];
var categories = [];

module.exports.initialize = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err) throw err;
            else {
                posts = JSON.parse(data,posts);
                fs.readFile('./data/categories.json', 'utf8', (err, data) => {  
                    if (err) throw err;
                    else {
                        categories = JSON.parse(data,categories);
                        console.log("data retrieved");
                        resolve("File has been read");
                    }
                })
            }                                                                                     
        })
    });
}

module.exports.getAllPosts = function() {
    return new Promise((resolve, reject) => {
        posts.length == 0 ? reject('No results returned') : resolve(posts)
    })
};
module.exports.getPublishedPosts = function() {
    var temp = [];
    for (i = 0; i < posts.length; i++) {
        if (posts[i].published) {
            temp.push(posts[i]);
        }
    }
    return new Promise((resolve, reject) => {
        temp.length == 0 ? reject('No results returned') : resolve(temp); 
    })
};
module.exports.getCategories = function() {
    return new Promise((resolve, reject) => {
        categories.length == 0 ? reject('No results returned') : resolve(categories) ; 
    })
}

module.exports.addPost = (postData) => {
    postData.id = posts.length + 1;
    postData.published == null ? 
    postData.published = false : postData.published = true;

    postData.postDate = new Date();
    
    posts.push(postData);
    return new Promise((resolve, reject) => {
        resolve();
    });
}

module.exports.getPostsByCategory = (category) => {
    var categoryList = posts.filter(element => element.category == category);
    return new Promise((resolve, reject) => {
        categoryList.length == 0 ? reject('No results returned') : resolve(categoryList); 
    });
}

module.exports.getPublishedPostsByCategory = (category) => {
    var publishedPosts = [];
    return new Promise((resolve, reject) => {
    for (i = 0; i < posts.length; i++) {
        if (posts[i].published && posts[i].category == category) {
            publishedPosts.push(posts[i]);
        }
    }
        publishedPosts && publishedPosts.length > 0 ? resolve(publishedPosts) : reject('No results returned'); 
    })
}

module.exports.getPostsByMinDate = (minDateStr) => {

    var dateList = posts.filter(element => new Date(element.postDate) >= new Date(minDateStr));
    return new Promise((resolve, reject) => {
        dateList.length == 0 ? reject('No results returned') : resolve(dateList);
    });
}

module.exports.getPostById = (id) => {
    var post = posts.filter(element => element.id == id);
    return new Promise((resolve, reject) => {
        post == null ? reject('No results returned') : resolve(post);
    });
}