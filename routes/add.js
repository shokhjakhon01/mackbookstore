const { Router } = require("express");
const Notebook = require("../models/notebook");
const router = Router();
const auth = require("../middleware/auth");
const { notebookValidators } = require("../utils/validators");
const { validationResult } = require("express-validator");

router.get("/", auth, (req, res) => {
  res.render("add", { title: "Add Notebook", isAdd: true });
});

router.post("/", auth, notebookValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("add", {
      title: "Add Notebook",
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
        descr: req.body.decsr
      }
    });
  }
  const notebook = new Notebook({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    descr: req.body.descr,
    userId: req.user,
  });
  try {
    await notebook.save();
    res.redirect("/notebooks");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
