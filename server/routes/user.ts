import express from "express"
import User from "../models/user"
import sharp from "sharp"
import multer from "multer"
import passport from "passport"
import bcrypt from "bcrypt"
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post("/login", (req: any, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
        const userInfo = await User.findOne({email: req.body.email})
        user = userInfo
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send(user);
        });
      }
    })(req, res, next);
  });

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }, async (err: any, doc: any) => {
    if (err) res.send(err)
    if (doc) res.send("User Already Exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      await newUser.save();
      console.log(newUser)
      req.logIn(newUser, (err) => {
          if(err) throw err
          res.send(newUser)
      })
    }
  });
});

router.get("/user", async (req: any, res) => {
    try {
        const user = await User.findOne({email: req.user.email})

        if(!user) {
            return console.log("Did not find any user")
        }
    
        req.user = user
        res.send(user)
    } catch(e) {
        res.status(204).send(e)
    }
})

router.post("/logout", async (req: any, res) => {
    req.logout()
    res.status(204).send()
})

router.post("/logoutAll", auth, async (req: any, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.patch("/me", auth, async (req: any, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) {
        return res.status(400).send({error: "Invalid updates"})
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete("/me", auth, async (req: any, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch(e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return cb(new Error("Please upload a image"))
        }

        cb(undefined, true)
    }
})

router.post("/me/avatar", auth, upload.single("avatar"), async (req: any, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete("/me/avatar", auth, async (req: any, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get("/:id/avatar", async (req: any, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-type", "image/png")
        res.send(user.avatar)

    } catch(e) {
        res.status(404).send()
    }
}) 

const userRoutes = router
export default userRoutes
