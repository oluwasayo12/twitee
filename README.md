# Getting Started with TWITEE

 TWITEE is a mini and substandard runoff of Twitter. 
 Users register and login and can put up anything that crosses their mind. The whole world can view their twits and comment on their twits. 

### Available endpoints
    -- POST v1/register
    -- POST v1/login
    -- GET v1/posts [Gets existing posts]
    -- POST v1/posts [Creates new posts]
    -- DELETE v1/posts/{id} [Deletes existing posts - Available only to post owner]
    -- POST v1/post_comment/{id} [Comment under a post]
    -- GET v1/comments/{id} [Get comments for post]
