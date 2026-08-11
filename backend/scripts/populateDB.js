import "dotenv/config";
import mongoose from "mongoose";
import cloudinary from "../src/config/cloudinary.js";
import {connectDB} from "../src/config/db.js"; // adjust path/name if your connection file differs
import User from "../src/models/User.js";
import Book from "../src/models/Book.js";

// Public domain / freely usable book cover images (Open Library covers)
const SEED_BOOKS = [
  {
    title: "The Great Gatsby",
    caption: "A timeless classic about ambition, love, and the American Dream.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg",
  },
  {
    title: "1984",
    caption:
      "A chilling vision of a totalitarian future that still resonates today.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
  },
  {
    title: "To Kill a Mockingbird",
    caption: "A powerful story of justice and moral growth in the Deep South.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg",
  },
  {
    title: "Pride and Prejudice",
    caption: "Witty, sharp, and endlessly quotable — a romance classic.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
  },
  {
    title: "The Hobbit",
    caption:
      "A cozy yet epic adventure that started it all for fantasy lovers.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
  },
  {
    title: "Brave New World",
    caption: "A haunting look at a future built on comfort and control.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780060850524-L.jpg",
  },
  {
    title: "The Catcher in the Rye",
    caption: "Raw, funny, and painfully honest coming-of-age narration.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg",
  },
  {
    title: "Fahrenheit 451",
    caption: "A short, urgent warning about censorship and losing curiosity.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781451673319-L.jpg",
  },
  {
    title: "The Lord of the Rings",
    caption: "An epic journey of friendship, courage, and sacrifice.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg",
  },
  {
    title: "Animal Farm",
    caption: "A sharp, satirical fable about power and corruption.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg",
  },
  {
    title: "Jane Eyre",
    caption: "A fierce, independent heroine ahead of her time.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg",
  },
  {
    title: "Wuthering Heights",
    caption: "A stormy, obsessive love story set on the moors.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg",
  },
  {
    title: "The Chronicles of Narnia",
    caption: "A magical wardrobe leads to an unforgettable world.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780066238500-L.jpg",
  },
  {
    title: "Moby-Dick",
    caption: "A sprawling, obsessive hunt across the high seas.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781503280786-L.jpg",
  },
  {
    title: "War and Peace",
    caption: "A sweeping epic of love, war, and Russian society.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781400079988-L.jpg",
  },
  {
    title: "Crime and Punishment",
    caption: "A gripping psychological descent into guilt and redemption.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780143107637-L.jpg",
  },
  {
    title: "The Odyssey",
    caption:
      "The original epic adventure — gods, monsters, and a long way home.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780140268867-L.jpg",
  },
  {
    title: "Frankenstein",
    caption: "A groundbreaking, tragic tale of creation and consequence.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439471-L.jpg",
  },
  {
    title: "Dracula",
    caption: "The gothic horror classic that defined the vampire genre.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg",
  },
  {
    title: "The Picture of Dorian Gray",
    caption: "A beautiful, unsettling meditation on vanity and vice.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439570-L.jpg",
  },
  {
    title: "Little Women",
    caption: "A warm, enduring story of sisterhood and growing up.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780147514011-L.jpg",
  },
  {
    title: "Anna Karenina",
    caption: "A tragic portrait of love and society's expectations.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780143035008-L.jpg",
  },
  {
    title: "The Adventures of Huckleberry Finn",
    caption: "A sharp, funny journey down the Mississippi.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780142437179-L.jpg",
  },
  {
    title: "Great Expectations",
    caption: "A rich coming-of-age tale full of Dickensian twists.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780141439563-L.jpg",
  },
  {
    title: "Don Quixote",
    caption: "The original tale of chivalry, delusion, and heart.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg",
  },
  {
    title: "The Brothers Karamazov",
    caption: "A profound exploration of faith, doubt, and family.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780374528379-L.jpg",
  },
  {
    title: "Slaughterhouse-Five",
    caption: "A darkly funny, genre-bending anti-war novel.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780385333849-L.jpg",
  },
  {
    title: "One Hundred Years of Solitude",
    caption: "A dazzling, magical realist family saga.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg",
  },
  {
    title: "The Kite Runner",
    caption:
      "A gripping story of friendship, guilt, and redemption in Afghanistan.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg",
  },
  {
    title: "Life of Pi",
    caption: "A surreal survival story that blurs faith and fiction.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780156027328-L.jpg",
  },
  {
    title: "The Book Thief",
    caption: "A tender, devastating story narrated by Death itself.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg",
  },
  {
    title: "The Alchemist",
    caption: "A simple, inspiring fable about following your dreams.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
  },
  {
    title: "The Road",
    caption: "A stark, haunting journey through a post-apocalyptic world.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780307387899-L.jpg",
  },
  {
    title: "Beloved",
    caption: "A haunting, powerful reckoning with slavery's legacy.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg",
  },
  {
    title: "The Handmaid's Tale",
    caption: "A chilling dystopia that feels more relevant every year.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780385490818-L.jpg",
  },
  {
    title: "Gone with the Wind",
    caption: "A sweeping Civil War-era saga of survival and love.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781451635621-L.jpg",
  },
  {
    title: "The Grapes of Wrath",
    caption: "A powerful portrait of resilience during the Dust Bowl.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780143039433-L.jpg",
  },
  {
    title: "Of Mice and Men",
    caption: "A short, heartbreaking story of friendship and dreams.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780140177398-L.jpg",
  },
  {
    title: "The Sun Also Rises",
    caption: "A moody, atmospheric portrait of the Lost Generation.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780743297332-L.jpg",
  },
  {
    title: "East of Eden",
    caption: "A multigenerational epic about good, evil, and free will.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780142004234-L.jpg",
  },
  {
    title: "Rebecca",
    caption: "A gothic, suspenseful tale of a new bride's haunted past.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780380730407-L.jpg",
  },
  {
    title: "The Great Alone",
    caption: "A gripping story of survival and family in remote Alaska.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9781250170810-L.jpg",
  },
  {
    title: "Where the Crawdads Sing",
    caption: "A lyrical mystery set in the marshes of North Carolina.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780735219090-L.jpg",
  },
  {
    title: "The Nightingale",
    caption: "A moving story of two sisters' courage in WWII France.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780312577223-L.jpg",
  },
  {
    title: "Circe",
    caption: "A stunning reimagining of a mythological witch's story.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780316556347-L.jpg",
  },
  {
    title: "The Song of Achilles",
    caption: "A beautiful, tragic retelling of the Iliad's central love.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg",
  },
  {
    title: "Educated",
    caption: "A remarkable memoir of self-invention against all odds.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg",
  },
  {
    title: "Sapiens",
    caption: "A sweeping, thought-provoking look at human history.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
  },
  {
    title: "Atomic Habits",
    caption: "A practical, clear-eyed guide to building better routines.",
    imageUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
  },
];

function randomRating() {
  return Math.random() < 0.5 ? 4 : 5;
}

async function getSeedUser() {
  const user = await User.findOne({ email: "laracroft@gmail.com" });
  if (!user) {
    throw new Error(
      "User laracroft@gmail.com not found in the database. Make sure the account exists before running this script.",
    );
  }
  return user;
}

async function populateDB() {
  try {
    await connectDB();
    console.log("✅ Connected to database");

    const user = await getSeedUser();
    console.log(`✅ Seeding books for user: ${user.email ?? user._id}`);

    let successCount = 0;

    for (const seed of SEED_BOOKS) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(seed.imageUrl, {
          folder: `bookworm/${user._id}/covers`,
        });
        console.log(`✅ Uploaded: ${seed.title}`);

        const newBook = new Book({
          title: seed.title,
          caption: seed.caption,
          rating: randomRating(),
          image: uploadResponse.secure_url,
          user: user._id,
        });

        await newBook.save();
        console.log(`✅ Saved: ${seed.title}`);
        successCount++;
      } catch (bookError) {
        console.log(`❌ Failed to seed "${seed.title}":`, bookError.message);
        // continue to next book
      }
    }

    console.log(
      `\n${successCount}/${SEED_BOOKS.length} books seeded successfully`,
    );
    process.exit(0);
  } catch (error) {
    console.log("❌ Fatal error while seeding database:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

populateDB();



// how to use

// node backend/scripts/populateDB.js
// node backend/scripts/resetDB.js <userId>          # dry run, shows what would be deleted
// node backend/scripts/resetDB.js <userId> --confirm # actually deletes