const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const mimeTypes = {
	"image/png": "png",
	"image/jpeg": "jpeg",
	"image/jpg": "jpg",
	"image/webp": "webp",
};

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
	},
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (!mimeTypes[file.mimetype]) return cb(null, false, new Error("wrong format"));
		if (file.size > 5000000) return cb(null, false, new Error("too big"));
		cb(null, true);
	},
});

const app = express();
const jsonParser = bodyParser.json();
// const cors = require("cors");
// app.use(cors());
app.use("/api/images", express.static("uploads"));

const port = 3000;
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI);
const User = mongoose.model("User", { email: { type: String, unique: true }, password: String, categories: Array, history: Array, public: { name: String, avatar: String, social: { ig: String, tw: String, em: String, sc: String }, visibility: Boolean, following: Array } });

app.use(express.static("public"));

app.post("/api/auth", jsonParser, async (req, res) => {
	if (!req.body.email || !req.body.password) return res.status(422).json({ error: "Please enter your email and password" });
	const foundboi = await User.find({ email: req.body.email });
	if (!foundboi.length) return res.status(404).json({ error: "no user" });
	else if (bcrypt.compareSync(req.body.password, foundboi[0].password)) return res.json(foundboi[0]);
	else return res.status(401).json({ error: "You've entered the wrong password" });
});

app.post("/api/newuser", jsonParser, async (req, res) => {
	if (!req.body.email || !req.body.name || typeof req.body.visibility === "undefined" || !req.body.password) return res.status(422).json({ error: "missing data" });
	const foundboi = await User.find({ email: req.body.email });
	if (foundboi.length) return res.status(409).json({ error: "A user with that email already exists." });
	const salt = bcrypt.genSaltSync(10);
	const boiman = new User({
		email: req.body.email,
		password: bcrypt.hashSync(req.body.password, salt),
		categories: [
			{
				categoryName: "Inbox",
				tasks: [
					{ id: 1, title: "Welcome to Good to Go!" },
					{ id: 2, title: "You can add and remove tasks and categories from this dashboard." },
				],
			},
		],
		public: { name: req.body.name, avatar: "default.jpg", history: [], social: { ig: "", tw: "", em: "", sc: "" }, visibility: req.body.visibility, following: [] },
	});
	boiman
		.save()
		.then(() => res.json(boiman))
		.catch((err) => res.json({ error: "error saving user" }));
});

app.post("/api/update", jsonParser, async (req, res) => {
	if (!req.body._id || !req.body.password) return res.status(422).json({ error: "insufficient data" });
	if (!mongoose.Types.ObjectId.isValid(req.body._id)) return res.json({ error: "invalid id" });
	const foundboi = await User.findById(req.body._id);
	if (!foundboi) return res.status(404).json({ error: "User was not found" });
	if (req.body.password !== foundboi.password) return res.status(401).json({ error: "invalid password" });
	foundboi.overwrite(req.body);
	foundboi.save();
});

app.get("/api/profile/:profileID", jsonParser, async (req, res) => {
	if (!req.params.profileID.length) return res.status(422).json({ error: "insufficient data" });
	if (!mongoose.Types.ObjectId.isValid(req.params.profileID)) return res.json({ error: "invalid id" });
	const foundboi = await User.findById(req.params.profileID);
	if (!foundboi) return res.status(404).json({ error: "User was not found" });
	if (foundboi.public.visibility)
		return res.json({
			...foundboi.public,
			id: foundboi.id,
			history: foundboi.history.map((a) => {
				return {
					date: a.date,
					month: a.month,
					year: a.year,
				};
			}),
		});
	else return res.json({ error: "user is private" });
});
app.get("/api/profilesearch/:query", jsonParser, async (req, res) => {
	if (!req.params.query.length) return [];
	const foundbois = await User.find({ "public.visibility": true, "public.name": new RegExp("^" + req.params.query, "i") });
	return res.json(
		foundbois.map((boi) => {
			return { ...boi.public, id: boi.id };
		})
	);
});

app.post("/api/upload", upload.single("image"), function (req, res) {
	if (!req.file) {
		return res.json({ error: "bad file" });
	}
	res.json({ filename: req.file.filename });
	// res.redirect("back");
});

app.get("*", function (request, response) {
	response.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
