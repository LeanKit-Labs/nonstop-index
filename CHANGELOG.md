## 0.2.*

### 0.2.1
Removed default configuration for alternate storage

### 0.2.0
 * Improved configuration approach
 * Updated to latest package and registry resources
 * Support for alternate storage mechanisms
 * Now with actual README action!

## 0.1.*

### 0.1.14
Update autohost dependency minimum version

### 0.1.13
Update registry resource version

### 0.1.12
Bug fix - host.register wasn't allowing clients to make the call.

### 0.1.11
 * Adding client role to hook and registry actions.
 * Remove session (in memory session provider caused serious memory leak)

### 0.1.10
Improvement - extract web hook behavior into shared module.

### 0.1.9
Bug fix - hook self action should return a 404 if hook doesn't exist.

### 0.1.8
Allow web hooks to specify a property to put the payload under.

### 0.1.7
Fix resource path for running globally.

### 0.1.6
Add missing request dependency to package.json.

### 0.1.5
 * Update dependencies.
 * Add test coverage for web hooks.

### 0.1.4
Add webhook support.

### 0.1.3
Correct issues causing the registry and package resources to get excluded from the hypermedia engine.

### 0.1.2
Add host registry resource.

### 0.1.1
Update dependencies to use latest autohost, hyped and package resource.

### 0.1.0
Initial release.
