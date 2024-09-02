# API Documentation for Knowledge Base

Abstract:

This API documentation aims to provide a comprehensive guide for accessing publicly available data of all Mirats Group companies through a single platform. The purpose is to facilitate easy access for company employees to relevant information.

## Base Path

- The base path for accessing the API is: http://localhost:1234/api  ( {{baseUrl}} )

Endpoints
===



## Authorization

<h3>Register User(Method : Post)</h3>

 ```
  {{baseUrl}}/auth/register
```

 Input:
```
    {
        "email":"user@gmail.com",
        "password":"1234",
    }
```

Output:
```
  {
    "message": "User registered successfully",
    "user": {
        "email": "user@gmail.com",
        "password": "$2b$10$L0c33z4vyMbMF0m1gpwvjeTECw3V9KqKya/jfOeJIrzd//oYg6yKW",
        "_id": "66d18d7d6e3b0fee26b4e85b",
        "__v": 0
     }
  }
```

<Hr color="grey">
<h3>Login User(Method : Post)</h3>

 ```
  {{baseUrl}}/auth/login
```

 Input:
 ```
    {
      "email": "pnp@example.com",
      "password": "1234"
    }
  ```

  Output:
```
  {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQxOGQ3ZDZlM2IwZmVlMjZiNGU4NWIiLCJpYXQiOjE3MjUwMTMxODcsImV4cCI6MTcyNTAxNjc4N30.g4NMRCvvou0knfUqvZV3t18v30RFORJWmZREhSbEJoM"
  }
```


<Hr color="grey">
<h3>Get User(Method : Get)</h3>

```
  {{baseUrl}}/auth/profile
```

Output:Gets the current logged in users data
```
  {
    "user": {
        "_id": "66d18d7d6e3b0fee26b4e85b",
        "email": "pnp@example.com",
        "__v": 0
    }
 }
```

<Hr color="Beige">


## Url

<h3>Redirect to Website(Method : Get)</h3>

```
http://localhost:1234/:shortCode
```

Outputs:
```
Redirect to the Original website
```
else
```
Redirect to /password-protection/:shortcode
```
<Hr color="grey">
<h3>Create ShortUrl for logged in user(Method : Post)</h3>

```
  {{baseUrl}}/url/createShortUrl
```

  Input:
```
  {
    "originalUrl": "https://pratham.com",
    "userId":"66cd759ff875979cb6883d54",
    "advanceOptions":{
      "passwordProtection":false,
      "password":"1234",
      "expiresIn":1
    }
  }

```

Output:

```
  {
    "message": "Short URL created successfully",
    "data": {
        "originalUrl": "https://pratham.com",
        "shortUrl": "3809bb",
        "userId": "66cd759ff875979cb6883d54",
        "advanceOptions": {
            "passwordProtection": false,
            "expiresIn": "2024-08-30T11:21:38.402Z"
        },
        "_id": "66d19d3267424925c2e3d8e0",
        "createdAt": "2024-08-30T10:21:38.409Z",
        "updatedAt": "2024-08-30T10:21:38.409Z",
        "__v": 0
    }
}
```

<Hr color="grey">

<h3>Create ShortUrl without login(Method : Post)</h3>

```
  {{baseUrl}}/url/createShortUrlNoLogin
```

Input:
```
  {
    "originalUrl": "https://www.example.com/"
  }
```

Output:
```
  {
    "message": "Short URL created successfully",
    "data": {
        "originalUrl": "https://www.example.com/",
        "shortUrl": "2a64e8",
        "advanceOptions": {
            "passwordProtection": false
        },
        "_id": "66d19a3c56bcc0bf9b53aa68",
        "createdAt": "2024-08-30T10:09:00.381Z",
        "updatedAt": "2024-08-30T10:09:00.381Z",
        "__v": 0
    }
 }
```



<Hr color="grey">

<h3>Get Short Url(Method : Get)</h3>

```
 {{baseUrl}}/url/getUrl/:id(shortUrl)
```

Output:
```
Redirected to the Original Url
```
<h3>Get ShortUrl(password Protected)  (Method : Post)</h3>

```
{{baseUrl}}/url/getShortUrlWithPassword/:id(shortUrl)
```
Input:
```
 {
    "password":"1234"
 }
```
Output:On sucessful password verification

```
 Redirected to the Website
```

<h3>Delete ShortUrl(Method:Delete)</h3>

```
{{baseUrl}}/url/deleteShortUrl/:id(_id)
```

Output:
```
  {
      "message": "Short URL deleted successfully"
  }
```

<h3>Update ShortUrl(Method : Put)</h3>

  ```
   {{baseUrl}}/url/updateUrl/:id(_id)
  ```

Input:
```
  {
    "originalUrl": "https://www.example.com/",
    "userId":"66cd759ff875979cb6883d54",
    "advanceOptions":{
      // "passwordProtection":true,
      // "password":"1234"
      "expiresIn":3  //updated field
    }
  }
```
Output:
```
  {
      "message": "Short URL updated successfully",
      "data": {
          "advanceOptions": {
              "passwordProtection": false,
              "expiresIn": "2024-08-30T12:40:32.994Z"
          },
          "_id": "66d19362e78da326fc9fe626",
          "originalUrl": "https://www.example.com/",
          "shortUrl": "94a50c",
          "userId": "66cd759ff875979cb6883d54",
          "createdAt": "2024-08-30T09:39:46.358Z",
          "updatedAt": "2024-08-30T09:40:32.995Z",
          "__v": 0
      }
  }
```
  <Hr color="Beige">

## Sessions

<h3>Create Session(Method : Post)</h3>

  ```
  {{baseUrl}}/session/createSession/:id(shortUrl)
  ```

  Input:
```
  {
    "ipv4": "106.222.206.172",
    "ipv6": "::ffff:127.0.0.1",
    "user_ip_address": "106.222.206.172",
    "long_lat": "19.075984,72.877656",
    "user_country": "India",
    "user_city": "Mumbai",
    "user_region": "MH",
    "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "platform": "\"macOS\"",
    "device_type": "Desktop",
    "user_geolocation": {
      "error": "Unable to geocode"
    },
    "country_details": {
      "alpha2": "IN",
      "alpha3": "IND",
      "countryCallingCodes": [
        "+91"
      ],
      "currency": "INR",
      "languages": [
        "eng",
        "hin"
      ],
      "flag": "🇮🇳"
    },
    "country_time_details": {
      "timezone": "Asia/Kolkata",
      "localTime": "2024-08-27T11:01:38+05:30",
      "timezoneData": {
        "name": "Asia/Kolkata",
        "countries": [
          "IN"
        ],
        "utcOffset": 330,
        "utcOffsetStr": "+05:30",
        "dstOffset": 330,
        "dstOffsetStr": "+05:30",
        "aliasOf": null
      }
    }
  }
```

  Output:
```
  {
      "message": "Session created successfully",
      "sessionId": "66d1949de78da326fc9fe631"
  }
```

<Hr color="grey">
<h3>Validate password and redirect(Method : Post)</h3>

  ```
   {{baseUrl}}/session/validatePassword/:id(_id)
  ```

Input:
```
  {
      "password": "1234"
  }
```

Output:If the password is correct
```
Redirected to the OriginalUrl
```

<Hr color="grey">
<h3>Delete Session(Method : Delete)</h3>

```
{{baseUrl}}/api/document/delete/:id(_id)
```

  Output:

  ```
    Session deleted successfully
  ```
<Hr color="Beige">

## Analytics


<h3>Get single Url Count(Method : Get)</h3>

  ```
  {{baseUrl}}/analytics/clicks/:id(shortUrl)
  ```

Output:

```
  {
      "originalUrl": "https://www.google.com/",
      "shortUrl": "230bea",
      "clicks": 2
  }
```
 





<Hr color="grey">
<h3>Get all Url Count(Method : Get)</h3>


```
{{baseUrl}}/analytics/clicks
```

Output:
```
  {
    "message": "All URLs and their click counts",
    "data": [
        {
            "_id": "66d04f2753c14aa43cebb132",
            "originalUrl": "https://www.google.com/",
            "shortUrl": "d85e74",
            "clicks": 1
        },
        {
            "_id": "66d04f3353c14aa43cebb135",
            "originalUrl": "https://www.google.com/",
            "shortUrl": "230bea",
            "clicks": 2
        },
        {
            "_id": "66d161aa5c4984be25c0096d",
            "originalUrl": "https://www.example.com/",
            "shortUrl": "c0c696",
            "clicks": 0
        },
        {
            "_id": "66d161cf5c4984be25c00971",
            "originalUrl": "https://www.example.com/",
            "shortUrl": "d1dc4f",
            "clicks": 0
        },
    ]
  }
```

<Hr color="grey">
<h3>Get GeoData(Method : Get)</h3>

```
{{baseUrl}}/analytics/geoInfo/:id(shortUrl)
```

Output:

```
  {
      "originalUrl": "https://www.google.com/",
      "shortUrl": "230bea",
      "geoData": [
          {
              "country": "India",
              "total": 2,
              "details": [
                  {
                      "state": "RJ",
                      "city": "jaipur",
                      "count": 1
                  },
                  {
                      "state": "Maharashtra",
                      "city": "Mumbai",
                      "count": 1
                  }
              ]
          }
      ]
  }
```

<Hr color="grey">

<h3>Get Device Data(Method : Get)</h3>

```
{{baseUrl}}/analytics/deviceInfo/:id
```

Output:

```
{
      "originalUrl": "https://www.google.com/",
      "shortUrl": "230bea",
      "deviceData": [
          {
              "country": "India",
              "details": [
                  {
                      "state": "Maharashtra",
                      "city": "Mumbai",
                      "total": 1,
                      "devices": [
                          {
                              "platform": "Desktop",
                              "os": "\"macOS\"",
                              "browser": "Safari/537.36",
                              "count": 1
                          }
                      ]
                  },
                  {
                      "state": "RJ",
                      "city": "jaipur",
                      "total": 1,
                      "devices": [
                          {
                              "platform": "Desktop",
                              "os": "\"macOS\"",
                              "browser": "Safari/537.36",
                              "count": 1
                          }
                      ]
                  }
              ]
          }
      ]
  }
```

<Hr color="grey">
<h3>Get redirected to the promotional website(Method : Get)</h3>

```
{{baseUrl}}/analytics/redirectToPromotionalWeb
```

Output:

```
  {
    "message": "All URLs and their click counts",
    "data": [
        {
            "_id": "66d04f2753c14aa43cebb132",
            "originalUrl": "https://www.google.com/",
            "shortUrl": "d85e74",
            "clicks": 0
        },
        {
            "_id": "66d04f3353c14aa43cebb135",
            "originalUrl": "https://www.google.com/",
            "shortUrl": "230bea",
            "clicks": 1
        },
        {
            "_id": "66d161aa5c4984be25c0096d",
            "originalUrl": "https://www.example.com/",
            "shortUrl": "c0c696",
            "clicks": 0
        },
    ]
  }
```
