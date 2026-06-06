const Listing = require("../model/listing")

const geocode = require("../utils/geocode");


module.exports.index = async (req, res) => {
    let Listings = await Listing.find({});
    res.render("index.ejs", { Listings });
};


module.exports.newListings = async (req, res, next) => {


    let { title, description, image, price, location, country } = req.body.listings;
    let newList = new Listing({ title, description, price, location, country, });
    newList.owner = req.user._id

    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;

        newList.image = { url, filename };


    };
    const coordinates = await geocode(location);


    if (coordinates) {
        newList.geometry = {
            type: "Point",
            coordinates: [
                coordinates.lng,
                coordinates.lat
            ]
        };
    };

    let re = await newList.save();

    req.flash("success", " new Listing is created !");
    res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

        console.log(list.reviews)
        
    if (!list) {

        req.flash("error", "Listing You are trying to accese is not exist...")
        return res.redirect("/listings");
    }
    // console.log(list);
    res.render("place.ejs", { list });
};


module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)

    if (!list) {
        req.flash("error", "Listing You are trying to accese is not exist...")
        return res.redirect("/listings");
    }
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250")
    res.render("edit.ejs", { list, originalImageUrl });
}


module.exports.postEdit = async (req, res) => {
    console.log(req.file)
    let { id } = req.params;
    let { title, description, price, location, country } = req.body.listings;



    let list = await Listing.findByIdAndUpdate(
        id,
        { title, description, price, location, country },
        { runValidators: true }
    );
console.log(list)
    if (typeof req.file != "undefined") {
       
        let url = req.file.path;
        let filename = req.file.filename;
        list.image = { url, filename };
    };

const coordinates = await geocode(location);
    if (coordinates) {
        list.geometry = {
            type: "Point",
            coordinates: [
                coordinates.lng,
                coordinates.lat
            ]
        };
    }



    let re = await list.save();
    console.log(re)

    req.flash("success", "Listing successfully edited..")

    res.redirect(`/listings/${id}`);
};


module.exports.destroyList = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing successfully deleted..")

    res.redirect("/listings")
}