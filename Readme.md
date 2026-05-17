software patterns:
# MVC pattern
# Modular pattern

Rules and Principal 
# DRY - Don't repeat yourself
# Fat Model and Thin Controller

# authentication 2 type:
# session based - 
server stores user data on its side,
client gets a session id in a cookie
on each request a cookie sends and server checks it and identify the user
# disadvantages
storage problem for large scale applications

# jwt based - 
here after login server gives a JWT token 
the token is stored on the client side(application/browser)
on every request we sent this token to server side through req header and server will verify it and identify the user
it is stateless (server do not stores anything)
faster, more scalable  

# Authorization types(3):
role based access control(Admin, user, agent),
permission based access control(user1 can read + write, user2 can read only),
# attribute based access control -
access only for a specific role,
location should in be in specific region,
time should a specific time,
policy based access control

# JWT - (JSON WEB TOKEN)

when user login to a website, a payload is sent from client to server, then server authenticate the user and with the payload data it creates a JWT token and send the token with response to the client