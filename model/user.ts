import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dvlbv6l2k/image/upload/v1686559267/samples/people/boy-snow-hoodie.jpg",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", schema);
