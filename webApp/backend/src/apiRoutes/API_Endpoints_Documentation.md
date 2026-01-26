# API Endpoints Documentation

## Admin Routes (`/api/admin`)

========================================================================================================================

### Bus Management

#### Endpoint: `GET /api/admin/buses/fetch`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: Fetch all buses in the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Query parameters: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "string",
          "busNumber": "string",
          "plateNumber": "string",
          "capacity": "number",
          "model": "string",
          "status": "string",
          "routeId": "string",
          "driverId": "string",
          "createdAt": "datetime",
          "updatedAt": "datetime"
        }
      ]
    }
    ```
  - Error: 401 Unauthorized, 403 Forbidden

#### Endpoint: `POST /api/admin/bus/add`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Add a new bus to the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "busNumber": "string",
      "plateNumber": "string",
      "capacity": "number",
      "model": "string"
    }
    ```
- **Output**: 
  - Success (201): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "busNumber": "string",
        "plateNumber": "string",
        "capacity": "number",
        "model": "string",
        "status": "active",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/bus/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a bus from the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "busId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Bus removed successfully"
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/bus/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update existing bus information
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "busId": "string",
      "busNumber": "string",
      "plateNumber": "string",
      "capacity": "number",
      "model": "string",
      "status": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "busNumber": "string",
        "plateNumber": "string",
        "capacity": "number",
        "model": "string",
        "status": "string",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

========================================================================================================================

### Driver Management

#### Endpoint: `GET /api/admin/drivers/fetch`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: Fetch all drivers in the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Query parameters: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "string",
          "name": "string",
          "email": "string",
          "licenseNumber": "string",
          "phone": "string",
          "status": "string",
          "busId": "string",
          "routeId": "string",
          "createdAt": "datetime",
          "updatedAt": "datetime"
        }
      ]
    }
    ```
  - Error: 401 Unauthorized, 403 Forbidden

#### Endpoint: `POST /api/admin/driver/add`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Add a new driver to the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "name": "string",
      "email": "string",
      "licenseNumber": "string",
      "phone": "string"
    }
    ```
- **Output**: 
  - Success (201): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "name": "string",
        "email": "string",
        "licenseNumber": "string",
        "phone": "string",
        "status": "pending",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/driver/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a driver from the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "driverId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Driver removed successfully"
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/driver/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update existing driver information
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "driverId": "string",
      "name": "string",
      "email": "string",
      "licenseNumber": "string",
      "phone": "string",
      "status": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "name": "string",
        "email": "string",
        "licenseNumber": "string",
        "phone": "string",
        "status": "string",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

========================================================================================================================

### Station Management

#### Endpoint: `GET /api/admin/stations/fetch`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: Fetch all stations in the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Query parameters: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "string",
          "name": "string",
          "latitude": "number",
          "longitude": "number",
          "address": "string",
          "isActive": "boolean",
          "createdAt": "datetime",
          "updatedAt": "datetime"
        }
      ]
    }
    ```
  - Error: 401 Unauthorized, 403 Forbidden

#### Endpoint: `POST /api/admin/station/add`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Add a new station to the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "name": "string",
      "latitude": "number",
      "longitude": "number",
      "address": "string"
    }
    ```
- **Output**: 
  - Success (201): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "name": "string",
        "latitude": "number",
        "longitude": "number",
        "address": "string",
        "isActive": "boolean",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/station/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a station from the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "stationId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Station removed successfully"
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/station/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update existing station information
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "stationId": "string",
      "name": "string",
      "latitude": "number",
      "longitude": "number",
      "address": "string",
      "isActive": "boolean"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "name": "string",
        "latitude": "number",
        "longitude": "number",
        "address": "string",
        "isActive": "boolean",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

========================================================================================================================

### Route Management

#### Endpoint: `POST /api/admin/route/add`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Add a new route to the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "title": "string",
      "color": "string",
      "stations": [
        {
          "stationId": "string",
          "order": "number"
        }
      ]
    }
    ```
- **Output**: 
  - Success (201): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "title": "string",
        "color": "string",
        "length": "number",
        "duration": "number",
        "stations": [
          {
            "id": "string",
            "name": "string",
            "latitude": "number",
            "longitude": "number",
            "order": "number"
          }
        ],
        "isActive": "boolean",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/route/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a route from the system
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "routeId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Route removed successfully"
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/route/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update existing route information
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "routeId": "string",
      "title": "string",
      "color": "string",
      "stations": [
        {
          "stationId": "string",
          "order": "number"
        }
      ],
      "isActive": "boolean"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "title": "string",
        "color": "string",
        "length": "number",
        "duration": "number",
        "stations": [
          {
            "id": "string",
            "name": "string",
            "latitude": "number",
            "longitude": "number",
            "order": "number"
          }
        ],
        "isActive": "boolean",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

========================================================================================================================

### Service Pattern Management

#### Endpoint: `GET /api/admin/service-pattern/fetch`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: Fetch all service patterns
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Query parameters: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "string",
          "name": "string",
          "description": "string",
          "daysOfWeek": ["string"],
          "startTime": "string",
          "endTime": "string",
          "frequency": "number",
          "isActive": "boolean",
          "createdAt": "datetime",
          "updatedAt": "datetime"
        }
      ]
    }
    ```
  - Error: 401 Unauthorized, 403 Forbidden

#### Endpoint: `POST /api/admin/service-pattern/add`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Add a new service pattern
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "name": "string",
      "description": "string",
      "daysOfWeek": ["string"],
      "startTime": "string",
      "endTime": "string",
      "frequency": "number"
    }
    ```
- **Output**: 
  - Success (201): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "name": "string",
        "description": "string",
        "daysOfWeek": ["string"],
        "startTime": "string",
        "endTime": "string",
        "frequency": "number",
        "isActive": "boolean",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/service-pattern/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a service pattern
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "patternId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Service pattern removed successfully"
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/service-pattern/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update existing service pattern
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "patternId": "string",
      "name": "string",
      "description": "string",
      "daysOfWeek": ["string"],
      "startTime": "string",
      "endTime": "string",
      "frequency": "number",
      "isActive": "boolean"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "name": "string",
        "description": "string",
        "daysOfWeek": ["string"],
        "startTime": "string",
        "endTime": "string",
        "frequency": "number",
        "isActive": "boolean",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

========================================================================================================================

### Schedule Management

#### Endpoint: `GET /api/admin/schedule/fetch`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: Fetch all schedules
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Query parameters: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "string",
          "routeId": "string",
          "servicePatternId": "string",
          "startDate": "date",
          "endDate": "date",
          "isActive": "boolean",
          "trips": [
            {
              "id": "string",
              "departureTime": "string",
              "arrivalTime": "string",
              "busId": "string",
              "driverId": "string"
            }
          ],
          "createdAt": "datetime",
          "updatedAt": "datetime"
        }
      ]
    }
    ```
  - Error: 401 Unauthorized, 403 Forbidden

#### Endpoint: `POST /api/admin/schedule/add`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Add a new schedule
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "routeId": "string",
      "servicePatternId": "string",
      "startDate": "date",
      "endDate": "date"
    }
    ```
- **Output**: 
  - Success (201): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "routeId": "string",
        "servicePatternId": "string",
        "startDate": "date",
        "endDate": "date",
        "isActive": "boolean",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/schedule/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a schedule
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "scheduleId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Schedule removed successfully"
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/schedule/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update existing schedule
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "scheduleId": "string",
      "routeId": "string",
      "servicePatternId": "string",
      "startDate": "date",
      "endDate": "date",
      "isActive": "boolean"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "routeId": "string",
        "servicePatternId": "string",
        "startDate": "date",
        "endDate": "date",
        "isActive": "boolean",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

========================================================================================================================

### Scheduled Trip Management

#### Endpoint: `POST /api/admin/schedule/trip/add`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Add a new scheduled trip
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "scheduleId": "string",
      "departureTime": "string",
      "arrivalTime": "string",
      "busId": "string",
      "driverId": "string"
    }
    ```
- **Output**: 
  - Success (201): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "scheduleId": "string",
        "departureTime": "string",
        "arrivalTime": "string",
        "busId": "string",
        "driverId": "string",
        "status": "scheduled",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/schedule/trip/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a scheduled trip
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "tripId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Scheduled trip removed successfully"
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

---

## Authentication Routes (`/api/auth`)

========================================================================================================================

### Login/Logout/User Info

#### Endpoint: `POST /api/auth/login`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Authenticate user and return access token
- **Input**: 
  - Body: 
    ```json
    {
      "email": "string",
      "password": "string",
      "role": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "id": "string",
          "name": "string",
          "email": "string",
          "role": "string"
        },
        "token": "string",
        "expiresIn": "number"
      }
    }
    ```
  - Error: 401 Unauthorized, 400 Bad Request

#### Endpoint: `POST /api/auth/logout`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Logout user and invalidate token
- **Input**: 
  - Body: 
    ```json
    {
      "token": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```
  - Error: 400 Bad Request

#### Endpoint: `GET /api/auth/user-info`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: Get current user information
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "id": "string",
        "name": "string",
        "email": "string",
        "role": "string",
        "preferences": {
          "language": "string",
          "appearance": "string"
        }
      }
    }
    ```
  - Error: 401 Unauthorized

========================================================================================================================

### Password Reset

#### Endpoint: `POST /api/auth/admin/forgot-password`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Send password reset email for admin
- **Input**: 
  - Body: 
    ```json
    {
      "email": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Password reset email sent"
    }
    ```
  - Error: 404 Not Found, 400 Bad Request

#### Endpoint: `POST /api/auth/driver/forgot-password`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Send password reset email for driver
- **Input**: 
  - Body: 
    ```json
    {
      "email": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Password reset email sent"
    }
    ```
  - Error: 404 Not Found, 400 Bad Request

#### Endpoint: `HEAD /api/auth/reset-password/:token`
========================================================================================================================
- **HTTP**: `HEAD`
- **Usage**: Verify reset password token validity
- **Input**: 
  - Params: `token` (reset password token)
- **Output**: 
  - Success (200): Token is valid
  - Error: 404 Not Found (token invalid/expired)

#### Endpoint: `PATCH /api/auth/reset-password/:token`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Reset password using valid token
- **Input**: 
  - Params: `token` (reset password token)
  - Body: 
    ```json
    {
      "newPassword": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Password reset successfully"
    }
    ```
  - Error: 404 Not Found, 400 Bad Request

========================================================================================================================

### Password Setup (New Drivers)

#### Endpoint: `HEAD /api/auth/set-password/:token`
========================================================================================================================
- **HTTP**: `HEAD`
- **Usage**: Verify set password token validity
- **Input**: 
  - Params: `token` (set password token)
- **Output**: 
  - Success (200): Token is valid
  - Error: 404 Not Found (token invalid/expired)

#### Endpoint: `PATCH /api/auth/set-password/:token`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Set initial password for new driver
- **Input**: 
  - Params: `token` (set password token)
  - Body: 
    ```json
    {
      "newPassword": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "message": "Password set successfully"
    }
    ```
  - Error: 404 Not Found, 400 Bad Request

---

## User Routes (`/api/user`)

========================================================================================================================

### Route Information

#### Endpoint: `GET /api/user/routes/all`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: View all routes that buses are covering
- **Input**: 
  - Query parameters: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "string",
          "title": "string",
          "color": "string",
          "length": "number",
          "duration": "number",
          "stations": [
            {
              "id": "string",
              "name": "string",
              "latitude": "number",
              "longitude": "number",
              "order": "number"
            }
          ],
          "isActive": "boolean"
        }
      ]
    }
    ```
  - Error: 500 Internal Server Error

#### Endpoint: `GET /api/user/routes/operating`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: View routes of currently operating buses
- **Input**: 
  - Query parameters: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "string",
          "title": "string",
          "color": "string",
          "length": "number",
          "duration": "number",
          "stations": [
            {
              "id": "string",
              "name": "string",
              "latitude": "number",
              "longitude": "number",
              "order": "number"
            }
          ],
          "isActive": "boolean",
          "currentBuses": [
            {
              "busId": "string",
              "busNumber": "string",
              "driverName": "string",
              "lastLocation": {
                "latitude": "number",
                "longitude": "number",
                "timestamp": "datetime"
              }
            }
          ]
        }
      ]
    }
    ```
  - Error: 500 Internal Server Error

========================================================================================================================

### User Preferences

#### Endpoint: `PATCH /api/user/language`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Change user language preference
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "language": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "language": "string",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 401 Unauthorized, 400 Bad Request

#### Endpoint: `PATCH /api/user/appearance`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Change user appearance/theme preference
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "theme": "string",
      "fontSize": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "theme": "string",
        "fontSize": "string",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 401 Unauthorized, 400 Bad Request

========================================================================================================================

### Driver Operations

#### Endpoint: `PATCH /api/user/change-route`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Change the route assigned to a driver (admin operation)
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "driverId": "string",
      "routeId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "driverId": "string",
        "routeId": "string",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 401 Unauthorized, 403 Forbidden, 400 Bad Request

#### Endpoint: `PATCH /api/user/tracking`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Start or stop real-time tracking for a bus
- **Input**: 
  - Headers: `Authorization: Bearer <loginToken>`
  - Body: 
    ```json
    {
      "status": "string",
      "location": {
        "latitude": "number",
        "longitude": "number"
      }
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "success": true,
      "data": {
        "status": "string",
        "location": {
          "latitude": "number",
          "longitude": "number",
          "timestamp": "datetime"
        },
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 401 Unauthorized, 400 Bad Request

---

## Authentication & Authorization Notes

========================================================================================================================

### Required Tokens:
- **loginToken**: Used for most authenticated endpoints
- **resetPasswordToken**: Used for password reset operations
- **setPasswordToken**: Used for initial password setup

### Role-Based Access:
- **admin**: Full access to all admin endpoints
- **driver**: Limited access to specific user endpoints

### Common Error Codes:
- **400**: Bad Request (invalid input data)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

### Security Headers:
Most endpoints require `Authorization: Bearer <token>` header for authentication.
