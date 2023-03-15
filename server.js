//create express app
const express = require("express");
const _server = express();

//add modules
const _path = require("path");
const _blogService = require("./blog-service");
const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier');
const upload = multer(); // no { storage: storage } since we are not using disk storage

cloudinary.config({
    cloud_name: 'ditgfy779',
    api_key: '491122215765764',
    api_secret: 'Bj-gmH3D9nxJ7c-68oJ80GwtC6U',
    secure: true
});


const HTTP_PORT = process.env.PORT || 8080;
_server.use(express.static('public')); //use of css

function onHttpStart() {
    console.log("Express http server listening on port: " + HTTP_PORT);
}

//home page
_server.get("/", (req, res) => {
    res.redirect('/about');
});

//about author
_server.get("/about", (req, res) => {
    res.sendFile(_path.join(__dirname, './views/about.html'));
});

//get published posts
_server.get("/blog", (req, res) => {
    _blogService.getPublishedPosts().then((data) => {
        res.json(data);
    }).catch((err) => {
        return {"Error message": err.message};
    })
});

//get all posts
_server.get("/posts", (req, res) => {
    if(req.query.category){
        _blogService.getPostsByCategory(req.query.category).then((data) => {
            res.json(data);
        }).catch((err) => {
            return {"Error message": err.message};
        })
    } else if(req.query.minDate) {
        _blogService.getPostsByMinDate(req.query.minDate).then((data) => {
            res.json({data});
        }).catch((err) => {
            return {"Error message": err.message};
        })
    } else {
        _blogService.getAllPosts().then((data) => {
            res.json(data);
        }).catch((err) => {
            return {"Error message": err.message};
        })
    }
});

//add post
_server.get("/posts/add", (req, res) => {
    res.sendFile(_path.join(__dirname, './views/addPost.html'));
});

//get all categories
_server.get("/categories", (req, res) => {
    _blogService.getCategories().then((data) => {
        res.json(data);
    }).catch((err) => {
        return {"Error message": err.message};
    })
});

//get post by id
_server.get("/posts/:id", (req, res) => {
    _blogService.getPostsById(req.params.id).then((data) => {
        res.json(data);
    }).catch((err) => {
        return {"Error message": err.message};
    })
});

//add post and image and save it to cloudinary
_server.post("/post/add", (req, res) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }   
    upload(req).then((uploaded)=>{
        req.body.featureImage = uploaded.url;
    
    });
    _blogService.addPost(req.body).then(() => {
        res.redirect('/posts')
    }).catch((error) => {
        res.status(500).send(error)
    });
});

//init app
_blogService.initialize().then(() => {
    _server.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log(err);
    res.status(404).send("File couldn't be read");
})
