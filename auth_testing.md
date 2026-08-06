# Auth-Gated App Testing Playbook (Emergent Google Auth)

## Step 1: Create Test User & Session (mongosh)
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({ user_id: userId, email: 'hello.adcommedia@gmail.com', name: 'Chief Admin', role:'chief', created_at: new Date() });
db.user_sessions.insertOne({ user_id: userId, session_token: sessionToken, expires_at: new Date(Date.now()+7*24*60*60*1000), created_at: new Date() });
print('Session token: ' + sessionToken);
"
```

## Step 2: Backend API
```
curl -X GET "$API/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
curl -X GET "$API/api/admin/blogs" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Step 3: Browser cookie
```
page.context.add_cookies([{ "name":"session_token","value":"YOUR_SESSION_TOKEN","domain":"<host>","path":"/","httpOnly":true,"secure":true,"sameSite":"None"}])
```

## Notes
- Chief admin email: hello.adcommedia@gmail.com (role 'chief', full access, can invite other admins).
- Admin allowlist in db.admin_allowlist (email, role, added_by, created_at).
- All queries exclude _id with {"_id":0}. user_id is a custom UUID.
- session_token cookie: path=/, secure=True, samesite=none, httpOnly.
