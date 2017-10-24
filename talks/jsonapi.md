footer: Better APIs with JSON:API - @speaktochris - chris-guzman.com/jsonapi
[.hide-footer]

# {json:api}
##@speaktochris
### chris-guzman.com/jsonapi

---


#➡️
![original left fit](https://i.pinimg.com/originals/46/b0/4f/46b04f48d259e544e7b159a50db8c6f2.jpg)

![original right fit](https://media.istockphoto.com/vectors/linear-new-orleans-city-silhouette-with-typographic-design-vector-id495473046?s=2048x2048)


---

![fit](https://developer.nexmo.com/assets/images/nexmo-developer-card.png)

---

#[fit] Ruby 💎 & Android 🤖
# 😍

---

# {json:api}

## A specification for building APIs in JSON

---

# {json:api}

## A specification for building APIs in JSON

### (duh)

---

#[fit] {json:api}

---

#[fit] ~~{json:api}~~

---

#[fit] {"json":"api"}

---

![fit original](/Users/chrisguzman/Desktop/Screen Shot 2017-10-23 at 4.33.11 PM.png)

---

# Why?

---


![fit](https://www.tuin.co.uk/images/D/bike-store-shed-01.jpg)

---
[.hide-footer]

#[fit] 🚫
![fit](https://www.tuin.co.uk/images/D/bike-store-shed-01.jpg)


---

![original fit](https://imgs.xkcd.com/comics/standards.png)

---

### - Minimize requests & data between clients & servers
### - Consistency, popular among consultancies
### - Always backwards compatible
### - Stable 1.0, *not dead*

---

#No, really

![fit](/Users/chrisguzman/Desktop/Screen Shot 2017-08-15 at 5.11.17 PM.png)

---

# History

---
#[fit] 🙀+👨🏻‍🎤+💎🛤+🐹=

---

![fit](https://i0.wp.com/wp.laravel-news.com/media/2014/07/json-api-1024x389.png?resize=640%2C243&ssl=1)

---

# Spec

---

### - meta: a meta object that contains non-standard meta-information.
### - errors: an array of error objects
### - _OR_ -
### - data: the document’s “primary data”

---

# Meta

---

```json
{
  "meta": {
    "count": "42",
    "copyright": "Copyright 2015 Example Corp.",
    "authors": [
      "Yehuda Katz",
      "Steve Klabnik",
      "Dan Gebhardt",
      "Tyler Kellen"
    ]
  }
}
```

---

# Errors

---

```json
{
  "errors": [
    "id": "UUID",
    "status": "418",
    "code": "42",
    "title": "You're a teapot",
    "detail": "The object is not short nor stout",
    "links": {
       "about": "https://httpstatuses.com/418"
    },
    "meta": {
      "email": "nobody@example.com"
    }
  ]
}
```

---

# Data

---


```bash
GET /articles
Accept: application/vnd.api+json

GET /articles/1
Accept: application/vnd.api+json

GET /articles/1/author
Accept: application/vnd.api+json
```

---

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
    	"title": "Rails is Omakase"
    },
    "relationships": {},
    "links": {
      "self": "http://example.com/articles/1"
    },
  }
}
```

---

# Links

---


```json
{"links": {
    "self": "/articles/1",
    "href": "http://example.com/articles/1"
  },
}
```

---

```

```



## Relationships

---

```json 
{
  "relationships": {
    "author": {
      "links": {
        "self": "/articles/1/relationships/author",
        "related": "/articles/1/author"
      },
      "data": { 
      	"type": "people",
      	"id": "9" 
      }
    }
  }
}
```





---

```bash
#Request comments with an article
GET /articles/1?include=comments

#Request comments & photos with an article
GET /articles/1?include=comments,photos

#Request comments as well as the author of each of those comments
GET /articles/1?include=comments.author

```

---


```bash
#Request authors with id of 1 or 2
GET /authors/?filter[id]=1,2

#Request authors who are alive
GET /authors?filter[alive]=true

#Request comments published after a date
GET /comments?filter[published_after]=1990-01-01
```
_Note: JSON API is agnostic about how the filter query parameter can be used._

---

```bash
#Request only the title, body, & author fields
#for an article 
GET /articles?fields[articles]=title,body,author

#Request only the title, body, & author fields
#for an article and the name of the article's author
GET /articles?&fields[articles]=title,body,author\
    include=author&fields[people]=name 
```

---

```bash
#Sort articles alphabetically by title
GET /articles/?sort=title

#Sort authors by name, then life
GET /authors?sort=name,alive

#Sort authors by reverse alphabetical order, then life
GET /authors?sort=-name,alive
```

_Note: JSON API is agnostic about how the sort query parameter can be used._

---

```bash
#Get the third of 13 pages, one article at a time
GET /articles?page[number]=3&page[size]=1 HTTP/1.1

"links": {
  "self": "http://example.com/articles?page[number]=3&page[size]=1",
  "first": "http://example.com/articles?page[number]=1&page[size]=1",
  "prev": "http://example.com/articles?page[number]=2&page[size]=1",
  "next": "http://example.com/articles?page[number]=4&page[size]=1",
  "last": "http://example.com/articles?page[number]=13&page[size]=1"
}
```

_Note: JSON API is agnostic about how the page query parameter can be used._

---

```bash
GET /articles?include=comments,author 
	&fields[people]=first_name,last_name
	&sort=-date
```

- fetch all articles with their associated comments and authors
- Only be return the first and last names
- Sorted by date, most recent first

---

```bash
POST /photos

{"data": {
    "type": "photos",
    "attributes": {
      "title": "Ember Hamster",
      "src": "http://example.com/images/productivity.png"
    },
    "relationships": {
      "photographer": {
        "data": { "type": "people", "id": "9" }
      }
    }
  }
}
```

---

```bash
PATCH /articles/1

{"data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "To TDD or Not",
      "text": "TLDR; It's complicated..."
    }
  }
}
```

---


```bash
PATCH /articles/1/relationships/author

{
  "data": {
    "type": "people", "id": "12"
  }
}

PATCH /articles/1/relationships/tags
{
  "data": [
    { "type": "tags", "id": "2" },
    { "type": "tags", "id": "3" }
  ]
}
```

---

```bash
PATCH /articles/1/relationships/author
{"data": null}

PATCH /articles/1/relationships/tags
{"data": []}

DELETE /photos/1 HTTP/1.1
```

---

#JSON:API
- Can take advantage of caching
- built on top of REST

#vs GraphQL
- Backed by heavier players
- GraphiQL UI

---

![fit original](/Users/chrisguzman/Desktop/Screen Shot 2017-10-23 at 4.23.01 PM.png)


---

#Ok, maybe not the best analogy
![fit](https://tctechcrunch2011.files.wordpress.com/2017/10/mo_101917_hires-5.jpg?w=686&zoom=2)


---

![fit original](/Users/chrisguzman/Desktop/Screen Shot 2017-08-15 at 6.48.33 PM.png)

---

![fit original](/Users/chrisguzman/Desktop/Screen Shot 2017-10-23 at 11.45.54 PM.png)

---

![fit original](/Users/chrisguzman/Desktop/Screen Shot 2017-10-24 at 12.02.57 AM.png)

---


# {json:api}
##@speaktochris
### chris-guzman.com/jsonapi