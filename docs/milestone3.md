# Describing data implementation

As for the functionality of our app data, we created a database from a JSON file containing a list of objects that contain the useful data we need. For the regions, we stored data including the region name, a link towards the regions official website, and the official image of the given region. For the champions, we stored data including the champions name, a link towards the champions official website, the official image of the given champion and the region the given champion is from.

The site is able to load reviews from the database, and these can be seen on the region page Demacia and the champion page Fizz (from the Bilgewater region). Posting reviews worked locally with a username defined directly in the code, but we were unable to do that once deployed on Heroku. We have a video of this in the docs folder titles postReview.mov.

# Describing our database

The database has two tables. One is for login information with username and password columns, with the username as a primary key. We have another table for reviews (comments would be a more accurate name), with columns for username, lore (the page reviewed), review (the text of the review), likes, and time posted.


# Division of labor

Steve - implemented the data for region.JSON and champion.JSON, also contributed to rendering pages in the server.js file
Will - contributed to rendering pages in the server.js file using data retrieved with SQL, set up postgreSQL server on heroku and created tables
Josh - contributed to rendering pages in the server.js file and also adding further functionality to the buttons. Also tried to clean up codebase especially server.js file. 
