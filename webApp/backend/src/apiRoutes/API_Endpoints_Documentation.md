# API Endpoints Documentation

## Admin Routes (`/api/admin`)

========================================================================================================================

### Bus Management

#### Endpoint: `GET /api/admin/buses/fetch`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: Fetch all buses in the system
- **Input**: 
  - Cookies: `loginToken=<jwt>`
  - Query parameters: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "string | null",
      "data": [
        {
          "id": "string",
          "plate": "string",
          "brand": "string",
          "status": "string",
          "assignedRoute": "string | null",
          "assignedDriver": "string | null",
          "driver": {
            "id": "string",
            "name": "string",
            "email": "string"
          },
          "route": {
            "id": "string",
            "title": "string"
          }
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
  - Cookies: `loginToken=<jwt>`
  - Body: 
    ```json
    {
      "plate": "string",
      "brand": "string",
      "status": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "string",
      "data": null
    }
    ```
  - Error: 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/bus/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a bus from the system
- **Input**: 
  - Cookies: `loginToken=<jwt>`
  - Body: 
    ```json
    {
      "id": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "string",
      "data": null
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/bus/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update existing bus information
- **Input**: 
  - Cookies: `loginToken=<jwt>`
  - Body: 
    ```json
    {
      "id": "string",
      "plate": "string",
      "brand": "string",
      "status": "string",
      "assignedRoute": "string | null",
      "assignedDriver": "string | null"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "string",
      "data": null
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
  - Query parameters (all optional): 
    - `date`: `YYYY-MM-DD`
    - `servicePatternId`: `string`
    - `fromDate`: `YYYY-MM-DD`
    - `toDate`: `YYYY-MM-DD`
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "string | null",
      "data": [
        {
          "scheduleId": "string",
          "date": "date",
          "day": "string",
          "servicePatternId": "string",
          "servicePattern": {
            "servicePatternId": "string",
            "title": "string",
            "operatingHours": [
              {
                "operatingHourId": "string",
                "hour": "HH:mm:ss"
              }
            ]
          },
          "timeline": [
            {
              "time": "HH:mm:ss",
          "trips": [
            {
                  "detailedScheduleId": "string",
                  "scheduleId": "string",
                  "time": "HH:mm:ss",
                  "routeId": "string",
                  "driverId": "string",
              "busId": "string",
                  "route": {
                    "id": "string",
                    "title": "string",
                    "color": "string"
                  },
                  "driver": {
                    "id": "string",
                    "name": "string"
                  },
                  "bus": {
                    "id": "string",
                    "plate": "string",
                    "brand": "string",
                    "status": "string"
                  }
                }
              ]
            }
          ],
          "otherTrips": []
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
  - Cookies: `loginToken=<jwt>`
  - Body: 
    ```json
    {
      "date": "YYYY-MM-DD",
      "servicePatternId": "string",
      "day": "string (calculated server-side)"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "common.crud.added",
      "data": null
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/schedule/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a schedule
- **Input**: 
  - Cookies: `loginToken=<jwt>`
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
      "message": "common.crud.removed",
      "data": null
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/schedule/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update existing schedule
- **Input**: 
  - Cookies: `loginToken=<jwt>`
  - Body: 
    ```json
    {
      "scheduleId": "string",
      "servicePatternId": "string",
      "date": "YYYY-MM-DD"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "common.crud.updated | common.crud.noChanges",
      "data": null
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
  - Cookies: `loginToken=<jwt>`
  - Body: 
    ```json
    {
      "scheduleId": "string",
      "time": "HH:mm:ss",
      "routeId": "string",
      "busId": "string",
      "driverId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "tripForm.success.added | common.crud.added",
      "data": null
    }
    ```
  - Error: 400 Bad Request, 401 Unauthorized, 403 Forbidden

#### Endpoint: `DELETE /api/admin/schedule/trip/remove`
========================================================================================================================
- **HTTP**: `DELETE`
- **Usage**: Remove a scheduled trip
- **Input**: 
  - Cookies: `loginToken=<jwt>`
  - Body: 
    ```json
    {
      "detailedScheduleId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "tripForm.success.removed",
      "data": null
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

#### Endpoint: `PATCH /api/admin/schedule/trip/update`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Update an existing scheduled trip (change driver/bus)
- **Input**: 
  - Cookies: `loginToken=<jwt>`
  - Body: 
    ```json
    {
      "detailedScheduleId": "string",
      "driverId": "string",
      "busId": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "tripForm.success.updated | common.crud.updated",
      "data": null
    }
    ```
  - Error: 404 Not Found, 401 Unauthorized, 403 Forbidden

---
========================================================================================================================

### Authentication Routes (`/api/auth`)

========================================================================================================================

### Login/Logout/User Info

#### Endpoint: `POST /api/auth/login`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Authenticate user and create login session cookie
- **Input**: 
  - Body: 
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "auth.login.success",
      "data": null
    }
    ```
  - Error: 401 Unauthorized, 400 Bad Request

#### Endpoint: `POST /api/auth/logout`
========================================================================================================================
- **HTTP**: `POST`
- **Usage**: Logout user and clear login session cookie
- **Input**: 
  - Body: None
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "auth.logout.success",
      "data": null
    }
    ```
  - Error: 400 Bad Request

#### Endpoint: `GET /api/auth/user-info`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: Get current user information
- **Input**: 
  - Cookies: `loginToken=<jwt>`
- **Output**: 
  - Success (200): 
    ```json
    {
      "data": {
        "userID": "string",
        "userName": "string",
        "userRole": "string"
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
      "message": "auth.passwordReset.success.emailSent",
      "data": null
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
      "message": "auth.passwordReset.success.emailSent",
      "data": null
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
  - Error: 401 Unauthorized (token invalid/expired)

#### Endpoint: `PATCH /api/auth/reset-password/:token`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Reset password using valid token
- **Input**: 
  - Params: `token` (reset password token)
  - Body: 
    ```json
    {
      "newPassword": "string",
      "confirmPassword": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "auth.passwordReset.success.updated",
      "data": null
    }
    ```
  - Error: 401 Unauthorized, 400 Bad Request

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
  - Error: 401 Unauthorized (token invalid/expired)

#### Endpoint: `PATCH /api/auth/set-password/:token`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Set initial password for new driver
- **Input**: 
  - Params: `token` (set password token)
  - Body: 
    ```json
    {
      "newPassword": "string",
      "confirmPassword": "string"
    }
    ```
- **Output**: 
  - Success (200): 
    ```json
    {
      "message": "auth.setPassword.success.updated",
      "data": null
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

#### Endpoint: `GET /api/user/routes/map`
========================================================================================================================
- **HTTP**: `GET`
- **Usage**: View all routes map points (ordered station coordinates for drawing a polyline)
- **Input**:
  - Query parameters: None
- **Output**:
  - Success (200):
    ```json
    {
      "message": "common.crud.fetched",
      "data": [
        {
          "id": "R001",
          "title": "route 1",
          "color": "#00ff00",
          "colorInt": 4278255360,
          "points": [
            {
              "stationId": "S001",
              "stationName": "NEU Campus Main Station (8th Dormitory)",
              "latitude": 35.2297,
              "longitude": 33.3247,
              "orderIndex": 0
            }
          ]
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
  - Cookies: `loginToken=<jwt>`
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
  - Cookies: `loginToken=<jwt>`
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

#### Endpoint: `PATCH /api/driver/change-route`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Change the route assigned to a driver (driver operation)
- **Input**: 
  - Cookies: `loginToken=<jwt>`
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
      "data": {
        "driverId": "string",
        "routeId": "string",
        "updatedAt": "datetime"
      }
    }
    ```
  - Error: 401 Unauthorized, 403 Forbidden, 400 Bad Request

#### Endpoint: `PATCH /api/driver/tracking`
========================================================================================================================
- **HTTP**: `PATCH`
- **Usage**: Start or stop real-time tracking for a bus
- **Input**: 
  - Cookies: `loginToken=<jwt>`
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

## GET /api/driver/schedule/fetch

- Description: Retrieve user bus schedules. Supports optional date or date-range filters and servicePatternId for filtering specific services. The endpoint returns an array of "day" objects containing a timeline of trip slots; each trip contains a time and route info.

- Method: GET
- URL: `/api/driver/schedule/fetch`
- Headers:
  - auhtnticaiton required (drivers can get data directly, admins can use this endpoint but they have to provide the chosen driverId )
  - `Accept: application/json`

- Query Parameters:
  - `date` (string, YYYY-MM-DD) — optional. Request schedules for a single date.
  - `fromDate` (string, YYYY-MM-DD) — optional. Start of date range.
  - `toDate` (string, YYYY-MM-DD) — optional. End of date range.
  - `servicePatternId` (string) — optional. Filter results to a specific service pattern ID.

- Example request (GET):

```
GET /api/user/schedule/fetch?date=2026-01-27&servicePatternId=SP123
Accept: application/json
```

- Successful response (200):

```json
{
  "success": true,
  "data": [
    {
      "day": "monday",
      "date": "2026-01-27T00:00:00.000Z",
      "timeline": [
        {
          "trips": [
            {
              "time": "08:30:00",
              "route": {
                "title": "Route A",
                "color": "#FF0000"
              }
            },
            {
              "time": "09:15:00",
              "route": {
                "title": "Route B",
                "color": "#00FF00"
              }
            }
          ]
        }
      ]
    }
    // ... more day objects ...
  ]
}
```

- Notes:
  - The client maps this API response into UI models: day keys are normalized to weekday names, `date` is formatted for display, and routes are aggregated with a list of departure times (see mobile_app service mapping logic).

- Error responses:
  - `400 Bad Request` — invalid query parameter values (e.g., malformed date)
  - `500 Internal Server Error` — server failure

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
Most authenticated endpoints require a `loginToken` cookie (JWT) for authentication.
