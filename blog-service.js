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