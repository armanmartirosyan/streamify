# User Service Architecture

## Overview

The User Service is responsible for:

- Authentication
- User management
- Session management
- Role management
- Permission management
- Stream key management
- Email verification

The service should be split into multiple modules and services to keep responsibilities isolated.

---

# Auth Module

## AuthService

Responsible for authentication flows.

### Responsibilities

- Register user
- Login user
- Refresh access token
- Logout
- Logout all sessions

### Dependencies

- UsersService
- SessionsService
- UserRolesService
- MailService
- JwtService

### Example Flow

Register:

1. Create user
2. Assign default role
3. Send verification email

Login:

1. Validate credentials
2. Create session
3. Generate JWT tokens

---

# Users Module

## UsersService

Responsible for user data management.

### Responsibilities

- Create user
- Find user by id
- Find user by email
- Update profile
- Get profile

### Dependencies

- UserRepository

### Example Methods

```ts
create()
findById()
findByEmail()
updateProfile()
```

---

# Sessions Module

## SessionsService

Responsible for user sessions and refresh tokens.

### Responsibilities

- Create session
- Revoke session
- Revoke all sessions
- Rotate refresh token
- Enforce max active sessions

### Dependencies

- SessionRepository
- RedisService

### Example Methods

```ts
create()
revoke()
revokeAll()
rotate()
```

---

# Roles Module

## RolesService

Responsible for role management.

### Responsibilities

- Create role
- Delete role
- Update role
- Get role
- List roles

### Dependencies

- RoleRepository

### Example Methods

```ts
create()
update()
delete()
findById()
```

---

# User Roles Module

## UserRolesService

Responsible for assigning roles to users.

### Responsibilities

- Assign role to user
- Remove role from user
- List user roles

### Dependencies

- UserRoleRepository
- UsersService
- RolesService

### Example Methods

```ts
assignRole()
removeRole()
getUserRoles()
```

---

# Permissions Module

## PermissionsService

Responsible for permission resolution.

### Responsibilities

- Create permission
- Assign permission to role
- Remove permission from role
- Resolve user permissions

### Dependencies

- PermissionRepository
- RolePermissionRepository

### Example Methods

```ts
createPermission()
assignPermission()
removePermission()
resolveUserPermissions()
```

---

# Stream Keys Module

## StreamKeysService

Responsible for RTMP stream keys.

### Responsibilities

- Generate stream key
- Rotate stream key
- Validate stream key
- Revoke stream key

### Dependencies

- StreamKeyRepository
- RedisService

### Example Methods

```ts
generate()
rotate()
validate()
revoke()
```

---

# Mail Module

## MailService

Responsible for email delivery.

### Responsibilities

- Send verification email
- Send password reset email
- Send notifications

### Dependencies

- SMTP Provider

### Example Methods

```ts
sendVerificationEmail()
sendPasswordResetEmail()
sendNotification()
```

---

# Module Communication

Example Registration Flow

AuthService
    ↓
UsersService.create()
    ↓
UserRolesService.assignDefaultRole()
    ↓
MailService.sendVerificationEmail()

---

Example Login Flow

AuthService
    ↓
UsersService.findByEmail()
    ↓
SessionsService.create()
    ↓
PermissionsService.resolveUserPermissions()
    ↓
JwtService.sign()

---

# Ownership

users                -> UsersModule

sessions             -> SessionsModule

roles                -> RolesModule

user_roles           -> UserRolesModule

permissions          -> PermissionsModule

role_permissions     -> PermissionsModule

stream_keys          -> StreamKeysModule