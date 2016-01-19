### Login scenarios via StormPath

Currently normal registration (user must pick a username) & Facebook social login are supported.

1. Login via FB (no accounts exist for this email anywhere) -> Creates account under Stormpath Directory & FB Directory.  Saves FB access token / href in customData in the stormpath user.  Generates username. Subsequent Logins do not change the username.  Both accounts linked.

1. Create account normal registration then login via FB-> Initial normal registration create creates account under Stormpath Directory & generates username.   (same email), it will detect that an account exists.  Won't change username, will just log you in as the normal Stormpath user, and save the FB access token / href in the Stormpath user.  Both accounts linked.

1. Create account normal registration (no FB).  Creates account under Stormpath Directory & generates username.  Subsequent logins do not change username.
