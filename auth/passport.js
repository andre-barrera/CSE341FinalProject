const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const { ObjectId } = require("mongodb");
const mongodb = require("../data/database");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = mongodb.getDatabase().db();
        const usersCollection = db.collection("users");

        // Check if user already exists
        let existingUser = await usersCollection.findOne({
          githubId: profile.id
        });

        if (!existingUser) {
          // Create new user
          const newUser = {
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            createdAt: new Date()
          };

          const result = await usersCollection.insertOne(newUser);
          existingUser = { ...newUser, _id: result.insertedId };
        }

        return done(null, existingUser);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Store ONLY MongoDB _id in session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Retrieve user from DB using stored id
passport.deserializeUser(async (id, done) => {
  try {
    const db = mongodb.getDatabase().db();
    const user = await db.collection("users").findOne({
      _id: new ObjectId(id)
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
