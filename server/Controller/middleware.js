const jwt = require('jsonwebtoken')

const middlewreController = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
          const token = authHeader.split("Bearer ")[1]; // Loại bỏ "Bearer " để lấy mã token
          if (token) {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
              if (err) {
                res.status(403).json("Chưa đăng nhập 1 ");
              } else {
                req.user = user;
                next();
              }
            });
          } else {
            res.status(401).json('Chưa Đăng Nhập 2');
          }
        } else {
          res.status(401).json('Chưa Đăng Nhập 3');
        }
    },
    verifyAdmin: (req, res, next) => {
        if (req.user.role ==='admin') {
            next()
        } else {
            res.status(403).json("Bạn không được cấp quyền admin")
        }
    },
    verifyPro: (req, res, next) => {
        if (req.user.role ==='pro') {
            next()
        } else {
            res.status(403).json("Bạn không được cấp quyền pro")
        }
    },
    verifyTokenAndAdmin: (req, res, next) => {
        middlewreController.verifyToken(req, res, () => {
            middlewreController.verifyAdmin(req, res, next)
        })
    },
    verifyTokenAndPro: (req, res, next) => {
        middlewreController.verifyToken(req, res, () => {
            middlewreController.verifyPro(req, res, next)
        })
    }
}

module.exports = middlewreController
