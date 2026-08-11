import "dotenv/config";
import mongoose from "mongoose";
import cloudinary from "../src/config/cloudinary.js";
import connectDB from "../src/config/db.js"; // adjust path/name if your connection file differs
import Book from "../src/models/Book.js";

async function resetDB() {
  const userId = process.argv[2];
  const confirmed = process.argv.includes("--confirm");

  if (!userId) {
    console.log("❌ No userId provided.");
    console.log("Usage: node resetDB.js <userId> [--confirm]");
    process.exit(1);
  }

  try {
    await connectDB();
    console.log("✅ Connected to database");

    const books = await Book.find({ user: userId });

    if (books.length === 0) {
      console.log(`No books found for user ${userId}. Nothing to do.`);
      process.exit(0);
    }

    if (!confirmed) {
      console.log(
        `⚠️  Dry run — the following ${books.length} book(s) would be deleted:`,
      );
      books.forEach((book) => console.log(`  - ${book.title} (${book._id})`));
      console.log("\nRe-run with --confirm to actually delete these books:");
      console.log(`  node resetDB.js ${userId} --confirm`);
      process.exit(0);
    }

    let deletedCount = 0;

    for (const book of books) {
      try {
        // same logic as deleteABook in books.controllers.js
        if (book.image && book.image.includes("cloudinary")) {
          try {
            const publicId = book.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
          } catch (deleteError) {
            console.log(
              `⚠️  Error deleting Cloudinary image for "${book.title}":`,
              deleteError.message,
            );
            // continue anyway, matching deleteABook's behavior
          }
        }

        await book.deleteOne();
        console.log(`✅ Deleted: ${book.title}`);
        deletedCount++;
      } catch (bookError) {
        console.log(`❌ Failed to delete "${book.title}":`, bookError.message);
      }
    }

    console.log(`\n${deletedCount} book(s) deleted for user ${userId}`);
    process.exit(0);
  } catch (error) {
    console.log("❌ Fatal error while resetting database:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

resetDB();
