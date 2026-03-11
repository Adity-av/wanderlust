const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
const allListings = await Listing.find({});
res.render("listings/index",{allListings});
};

module.exports.renderNewForm = (req,res)=>{
res.render("listings/new");
};

module.exports.showListings = async (req,res)=>{
const {id}=req.params;
const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
if(!listing){
req.flash("error","Listing you requested does not exist");
return res.redirect("/listings");
}
res.render("listings/show",{listing});
};

module.exports.createListing = async (req,res)=>{
let newListing=new Listing(req.body.listing);
newListing.owner=req.user._id;

if(req.files){
newListing.images=req.files.map(f=>({url:f.path,filename:f.filename}));
newListing.image=newListing.images[0];
}

await newListing.save();
req.flash("success","New Listing Created!");
res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res)=>{
const {id}=req.params;
const listing=await Listing.findById(id);
if(!listing){
req.flash("error","Listing you requested does not exist");
return res.redirect("/listings");
}
res.render("listings/edit",{listing});
};

module.exports.updateListing = async (req,res)=>{
const {id}=req.params;
let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

if(req.files&&req.files.length>0){
let imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
listing.images.push(...imgs);
await listing.save();
}

req.flash("success","Listing Updated!");
res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
const {id}=req.params;
await Listing.findByIdAndDelete(id);
req.flash("success","Listing Deleted!");
res.redirect("/listings");
};
