import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const q = "SELECT p.id, `username`, `description`, p.img, u.img AS userImg,`date` FROM users u JOIN posts p ON u.id = p.uid order by p.date desc";
  db.query(q,[], (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};



export const getPost = (req, res) => {
  const q ="SELECT p.id, u.username, p.description, p.img, u.img AS userImg, p.date FROM posts p JOIN users u ON u.id = p.uid WHERE u.username=?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addPost = (req, res) => {
  console.log(req.body.desc);
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q ="INSERT INTO posts(`description`, `img`, `date`,`uid`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      req.body.date,
      userInfo.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";

    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });
  });
};
