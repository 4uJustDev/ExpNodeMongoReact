import PostModel from "../models/Post.js"

export const getAll = async (req, res) => {
    try{
        
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статьи",
        });
    }
};
export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const data = await PostModel.findOneAndUpdate(
            {
                _id: postId,
            },
            {
                $inc: {viewsCount: 1},
            },
            {
                returnDocument: 'after'
            },
        );

        if(!data){
            console.log(err);
            return res.status(500).json({
                message: "Не удалось вернуть статью",
            });
        }
        
        res.json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить статью",
        });
    }
};
export const create = async (req, res) => {
    try{
        const doc  = new PostModel({
            tittle: req.body.tittle,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl:req.body.imageUrl,
            user:req.userId,
        });

        const post = await doc.save();

        res.json(post);
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать статью",
        });
    }
};