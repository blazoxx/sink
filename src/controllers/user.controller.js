import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user details from req.body or url
  // validation - not empty, valid email, password strength, etc.
  // check if user already exists - username, email
  // check for images/files - check for avatar(as req)
  // upload to cloudinary if any
  // create user object - create entry in db
  // remove password and refresh token from response
  // check for user creation success/failure
  // return res

  // console.log(req.body)

  const { username, email, password, fullName } = req.body;
  // console.log("email: ", email);

  // Basic validation using multiplle if else statements
  // if (!username || !email || !password || !fullName) {
  //   throw new ApiError(400, "All fields are required");
  // }
  // if(fullName===""){
  //   throw new ApiError(400, "Full name is required");
  // }

  if (
    [email, username, password, fullName].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Fields cannot be empty strings");
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  // console.log(existingUser)

  if(existingUser) {
    throw new ApiError(409, "User with given email or username already exists");
  }

  console.log(req.files)

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
  }

  if(!avatarLocalPath){
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadToCloudinary(avatarLocalPath)
  const coverImage = await uploadToCloudinary(coverImageLocalPath)

  if(!avatar){
    throw new ApiError(400, "Avatar image is required");
  }

  const user = await User.create({
    username: username,
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || ""
  })

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if(!createdUser){
    throw new ApiError(500, "User registration failed");
  }

  res.status(201).json(
    new ApiResponse(200, "User registered successfully", createdUser)
  )

});

export { registerUser };
