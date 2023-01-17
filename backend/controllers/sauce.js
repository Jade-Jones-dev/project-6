const Sauce = require('../models/sauce');
const fs = require('fs');

// getAllSauces

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
	.then((sauces) => {res.status(200).json(sauces);
	})
    .catch((error) => {res.status(400).json({error: error,});
    });
}

// getOneSauce

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({_id: req.params.id})
	.then((sauce) => {res.status(200).json(sauce);
	})
	.catch((error) => {res.status(404).json({ error: error });
	});
};

// createSauce

exports.createSauce = (req, res, next) => {
	req.body.sauce = JSON.parse(req.body.sauce);
	const url = req.protocol + "://" + req.get("host");
	const sauce = new Sauce({
		userId: req.body.sauce.userId,
		name: req.body.sauce.name,
		manufacturer: req.body.sauce.manufacturer,
		description: req.body.sauce.description,
		mainPepper: req.body.sauce.mainPepper,
		imageUrl: url + "/images/" + req.file.filename,
		heat: req.body.sauce.heat,	
	});
	sauce.save()
	.then(() => {res.status(201).json({ message: "Sauce saved successfully"});
	})
	.catch((error) => {res.status(400).json({ error: error,})
	})
}

// delete a sauce

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
	.then((sauce) => {
		const filename = sauce.imageUrl.split("/images/")[1];
		fs.unlink("images/" + filename, () => {
			Sauce.deleteOne({ _id: req.params.id })
			.then(() => {
				res.status(200).json({ message: "Deleted!"});
				})
				.catch((error) => {
					res.status(400).json({ error: error,});
				});
		});
	});
};

// like a sauce

exports.likeSauce = (req, res, next) => {
	let user = req.body.userId

	Sauce.findOne({ _id: req.params.id })
	  .then((sauce) => {
		//If user has not yet liked 
		if (!sauce.usersLiked.includes(user)) {
			sauce.usersLiked.push(user);
			sauce.likes+1;
		}
		// if user has not yet disliked
		if (!sauce.usersDisliked.includes(user)) {
			sauce.usersDisliked.push(user);
			sauce.dislikes+1;
		}
		//If user has liked sauce
		if (sauce.usersLiked.includes(user)) {
		  	sauce.usersLiked.splice(sauce.usersLiked.indexOf(user), 1);
		  	sauce.likes-1;
		}
		// if user has disliked sauce
		if (sauce.usersDisliked.includes(user)) {
		  	sauce.usersDisliked.splice(
			sauce.usersDisliked.indexOf(user), 1);
		  	sauce.dislikes-1;
		}
		sauce.save()
		.then((sauce) => res.status(200).json({sauce}))
		.catch((error) => res.status(400).json({ error: error }));
	  })
  };

// modify sauce
exports.modifySauce = (req, res, next) => {

	let sauceObject = {};
	req.file ? (
		Sauce.findOne({_id: req.params.id})
		.then((sauce) => {
		const filename = sauce.imageUrl.split("/images/")[1];
		fs.unlink("images/" + filename)}),
	  sauceObject = {
		...JSON.parse(req.body.sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
	  }
	) : ( sauceObject = {...req.body}  )
	Sauce.updateOne({_id: req.params.id},{...sauceObject,_id: req.params.id})
	  .then(() => res.status(200).json({message: 'Sauce has been updated'}))
	  .catch((error) => res.status(400).json({error}))
  }

// exports.modifySauce = (req, res, next) => {
// 	let sauce = new Sauce({ _id: req.params._id });
// 	if (req.file) {
// 		// unlink the image file to the sauce
// 		Sauce.findOne({ _id: req.params.id }).then((sauce) => {
// 			const filename = sauce.imageUrl.split("/images/")[1];
// 			fs.unlink("images/" + filename)
// 		});
// 		// delete the image
// 		// add new image
// 		const url = req.protocol + "://" + req.get("host");
// 		req.body.sauce = JSON.parse(req.body.sauce);
// 		sauce = {
// 		_id: req.params.id,
// 		name: req.body.sauce.name,
//         manufacturer: req.body.sauce.manufacturer,
// 		description: req.body.sauce.description,
// 		mainPepper: req.body.sauce.mainPepper,
// 		imageUrl: url + "/images/" + req.file.filename,
// 		heat: req.body.sauce.heat,
// 		userId: req.body.sauce.userId,
// 		};
// 	} else if(!req.file){
// 		sauce = {
//         _id: req.params.id,
// 		name: req.body.name,
//         manufacturer: req.body.manufacturer,
// 		description: req.body.description,
// 		mainPepper: req.body.mainPepper,
// 		imageUrl: req.body.imageUrl,
// 		heat: req.body.heat,
// 		userId: req.body.userId,
// 		};
// 	}
// 	Sauce.updateOne({ _id: req.params.id }, sauce)
// 		.then(() => {
// 			res.status(201).json({
// 				message: "Sauce updated successfully!",
// 			});
// 		})
// 		.catch((error) => {
// 			res.status(400).json({
// 				error: error,
// 			});
// 		});
// };




