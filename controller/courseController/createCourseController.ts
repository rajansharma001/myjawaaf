import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Course } from "../../model/courseSchema.ts";
import path from "path";
export const createCourseController = async (req: Request, res: Response) => {
  try {
    const {
      title,
      slug,
      description,
      categoryId,
      isFree,
      price,
      discount,
      level,
      language,
      isPublished,
    } = req.body;

    const file = req.file;

    console.log("is file receiving: ", req.file);
    const thumbnailPath = file ? path.posix.join("uploads", file.filename) : "";

    const currentUser = req.user;
    console.log("current user: ", currentUser);

    if (currentUser.role === "admin" || currentUser.role === "teacher") {
      const newCourse = {
        title,
        slug,
        description,
        thumbnail: thumbnailPath,
        categoryId,
        isFree,
        price,
        discount,
        level,
        language,
        isPublished,
        createdBy: currentUser._id,
      };
      const course = await Course.create(newCourse);
      return res.status(201).json({ msg: "Course Created Success!", course });
    } else {
      return res
        .status(405)
        .json({ msg: "You are not allowed to manage this task." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Bad Request while creating a new course!" });
  }
};
