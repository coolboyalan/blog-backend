# THIS IS NOT THE FINAL BRANCH, PLEASE DO TESTING ON FINAL BRANCH "project/blog"

# Project Details

    # Name
    Mini Blog Management

    #Description
    Mini Blog Management is a one stop solution for the backend of a blog website. There are many APIs that gives multiple functionalities 
    and features to our blog so that it is easy for both user and the admin.

    # APIs

    1.GET : A get api that is accessible to only logged in user that will return all the published blogs that ain't deleted. If used with
            query it'll apply those filters

    2.POST : There are three post APIs, one api is for login one is for sign up(create author) and the last one is to create a blog which is
             a protected api that means only logged in user can have access to it and they can only create blogs using their own ID.
    
    3.PUT : A put api that allows logged in user to update blogs that belongs to them(same Author Id) and ain't deleted. If the blog isn't 
            published it changes the status to published and also add a date to it. Point to note is that it'll need the blogId as input in 
            path params.

    4.DELETE : It works only for logged in user and allows them to delete their blog by marking the isDeleted key to true. There are two delete
               APIs, the first one will delete the blog by taking the blogId in path params and it will only that document. Whereas the second
               API will delete multiple blogs that matches the filter given in the queries. 