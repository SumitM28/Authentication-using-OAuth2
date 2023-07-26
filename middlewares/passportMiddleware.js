import googleOAuth from "passport-google-oauth20";
import facebookOAuth from "passport-facebook";
const GoogleStrategy = googleOAuth.Strategy;
const FacebookStrategy = facebookOAuth.Strategy;
import dotenv from "dotenv";

// configure env
dotenv.config();

export const googleMiddlware = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      // If the user doesn't exist, create a new user entry
      if (!user) {
        user = new User({
          email,
          loginMethod: "google",
        });
        await user.save();
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);

export const facebookMiddleware = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["id", "emails"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await User.findOne({ email });

      // If the user doesn't exist, create a new user entry
      if (!user) {
        user = new User({
          email,
          loginMethod: "facebook",
        });
        await user.save();
      }

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);
