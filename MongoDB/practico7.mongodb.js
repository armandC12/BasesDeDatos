use("mflix");
db.comments.findOne()

// Insertar 5 nuevos usuarios en la colección users. Para cada nuevo usuario creado,
// insertar al menos un comentario realizado por el usuario en la colección comments.
use("mflix");
db.users.findOne();

use("mflix");
db.users.insertMany([
    {
      "name": "Chuky Le",
      "email": "chuky_le@fakegamil.com",
      "password": "jsnfdhbrjhbjsdankjfn"
    },
    {
      "name": "Sony_Son",
      "email": "Sony_son@fakegmail.com",
      "password": "jhsbdchvbfsviubiseolhihjcskd"
    },
    {
      "name": "Tobi Uchiha",
      "email": "tobi_uchiha@fakegmail.com",
      "password": "jscdbhj$kcjbhshbjckhncjkads"
    },
    {
      "name": "Hacker Yu",
      "email": "hacker yu@fakegmail.com",
      "password" : "jsbcvjneasfcjnirsncjkbscskjfv"
    },
    {
      "name": "Asus Vivobook",
      "email": "asus_vivobook@fakegmail.com",
      "password": "shbcjknsehcbkcvsrnjbckjnlecnhbrcbasdjhbjk"
    }
  ]);

  use("mflix");
  db.users.find({name:/Chuky Le/});

  use("mflix");
  db.comments.find()

  use("mflix");
  db.comments.insertMany([

  ]);

// -------------------------------------------------------------------
// 2. Listar el título, año, actores (cast), directores y rating 
//    de las 10 películas con mayor rating (“imdb.rating”) de la década del 90. 
//   ¿Cuál es el valor del rating de la película que tiene mayor rating? 
//   (Hint: Chequear que el valor de “imdb.rating” sea de tipo “double”).

use("mflix");
db.movies.findOne();

use("mflix");
db.movies.find({
  "year": {"$gte": 1990, "$lte": 1999}
});

// Consulta para obtener las 10 películas con el mayor rating de la década de los 90
use("mflix");
db.movies.find({
  "year": { "$gte": 1990, "$lte": 1999 },
  "imdb.rating": { "$type": "double" }
  },
  {
    title:1, year:1, cast:1, directors:1, "imdb.rating": 1
  }
).sort(
  {"imdb.rating": -1 }
).limit(10);

// Consulta para ver la pelicula que tiene el mayor rating
use("mflix");
db.movies.find({
  "year": { "$gte": 1990, "$lte": 1999 },
  "imdb.rating": { "$type": "double" }
  },
  {
    title:1, year:1, cast:1, directors:1, "imdb.rating": 1
  }
).sort(
  {"imdb.rating": -1 }
).limit(1);

// ------------------------------------------------------------------------
// 3. Listar el nombre, email, texto y fecha de los comentarios que la película 
//    con id (movie_id) ObjectId("573a1399f29313caabcee886") recibió entre 
//    los años 2014 y 2016 inclusive. Listar ordenados por fecha. 
//    Escribir una nueva consulta (modificando la anterior) para responder 
//    ¿Cuántos comentarios recibió?


use("mflix");
db.comments.find();

// Primera parte
use("mflix");
db.comments.find({
  "movie_id": ObjectId("573a1399f29313caabcee886"),
  "date": {
    "$gte": ISODate("2014-01-01T00:00:00Z"),
    "$lte": ISODate("2016-12-31T23:59:59Z")
  }
  },
  {
    name:1, email:1, texto:1, date:1
  }
).sort(
  {"date": 1}
);

// Segunda parte, Los comentarios que recibio
use("mflix");
db.comments.find({
  "movie_id": ObjectId("573a1399f29313caabcee886"),
  "date": {
    "$gte": ISODate("2014-01-01T00:00:00Z"),
    "$lte": ISODate("2016-12-31T23:59:59Z")
  }
}).sort(
  {"date": 1}
).count();

// ------------------------------------------------------------------------
// 4. Listar el nombre, id de la película, texto y fecha de los 3 comentarios 
//    más recientes realizados por el usuario con email patricia_good@fakegmail.com.

use("mflix");
db.comments.find();

use("mflix");
db.comments.find(
  {
    "email": "patricia_good@fakegmail.com"
  },
  {
    name:1, movie_id:1, text:1, date:1
  }
  ).limit(3);
  
// ------------------------------------------------------------------------
// 5. Listar el título, idiomas (languages), géneros, fecha de lanzamiento (released) 
//    y número de votos (“imdb.votes”) de las películas de géneros Drama y 
//    Action (la película puede tener otros géneros adicionales), que solo están 
//    disponibles en un único idioma y por último tengan un rating (“imdb.rating”) 
//    mayor a 9 o bien tengan una duración (runtime) de al menos 180 minutos. 
//    Listar ordenados por fecha de lanzamiento y número de votos
use("mflix");
db.movies.find({"imdb.rating":""});


use("mflix");
db.movies.find(
  {
    $and: [{genres: "Drama"}, { genres: "Action"}],
    $or: [{"imdb.rating": { "$gte": 9 }}, {runtime: {"$lte": 180}} ]
  },
  {
    title:1, languages:1, genres:1, released:1, "imdb.votes": 1
  }
).sort(
  {released:-1, "imdb.votes": -1}
);

// ------------------------------------------------------------------------
// 6. Listar el id del teatro (theaterId), estado (“location.address.state”), 
//    ciudad (“location.address.city”), y coordenadas (“location.geo.coordinates”) 
//    de los teatros que se encuentran en algunos de los estados "CA", "NY", "TX" 
//    y el nombre de la ciudades comienza con una ‘F’. Listar ordenados por estado 
//    y ciudad.

use("mflix");
db.theaters.findOne();

use("mflix");
db.theaters.find(
  {
    "location.address.state": { $in: ["CA", "NY", "TX"]},
    "location.address.city": { $regex: /^F/i }
  },
  {
    thearterID:1, "location.address.state":1, 
    "location.address.city":1, 
    "location.geo.coordinates":1
  }
).sort(
  { 
    "location.address.state": -1, 
    "location.address.city": -1 
  }
);

// ------------------------------------------------------------------------
// 7. Actualizar los valores de los campos texto (text) y fecha (date) del comentario 
//   cuyo id es ObjectId("5b72236520a3277c015b3b73") a "mi mejor comentario" y 
//   fecha actual respectivamente.

use("mflix");
db.comments.find();

use("mflix");
db.comments.find({"_id": ObjectId("5b72236520a3277c015b3b73")});

use("mflix");
db.comments.updateOne(
  {
    "_id": ObjectId("5b72236520a3277c015b3b73"),
  },
  {
    $set: {
      text: "mi mejor comentario", 
      date: "2023-10-27T19:30:00Z" 
    }
  }
);

// ------------------------------------------------------------------------
// 8. Actualizar el valor de la contraseña del usuario cuyo email es
//    joel.macdonel@fakegmail.com a "some password". La misma consulta debe poder
//    insertar un nuevo usuario en caso que el usuario no exista. Ejecute la consulta dos
//    veces. ¿Qué operación se realiza en cada caso? (Hint: usar upserts).

use("mflix");
db.users.findOne({email: /joel.macdonel@fakegmail.coISODate("2014-01-01T00:00:00Z")m/});

use("mflix");
db.users.updateOne(
  {
    email: "joel.macdonel@fakegmail.com"
  },
  {
    $set: {password: "some password"}
  },
  { upsert: true }
);
// La opción { upsert: true } le indica a MongoDB que, 
// en caso de que no encuentre un usuario con el email "joel.macdonel@fakegmail.com", 
// debe insertar un nuevo documento con los campos especificados en la actualización. 
// En este caso, el nuevo documento contendrá el campo "email" con el valor 
// "joel.macdonel@fakegmail.com" y el campo "password" con el valor "some password".


// ------------------------------------------------------------------------
// 9. Remover todos los comentarios realizados por el usuario cuyo email es
//    victor_patel@fakegmail.com durante el año 1980.


use("mflix");
db.comments.find({email: "victor_patel@fakegmail.com"}); 

// Teniamos 799 comentarios en 1980, haciendo el deleteMany se eliminaron 21 comentario

use("mflix");
db.comments.deleteMany(
  {
    email: "victor_patel@fakegmail.com", 
    "date": {
      $gte: new Date("1980-01-01"),
      $lte: new Date("1980-12-31")
    }
  }
);

// ------------------------------------------------------------------------
// 10. Listar el id del restaurante (restaurant_id) y las calificaciones de los restaurantes donde
//     al menos una de sus calificaciones haya sido realizada entre 2014 y 2015 inclusive, 
//     que tenga una puntuación (score) mayor a 70 y menor o igual a 90

use("restaurantdb");
db.restaurants.findOne(); 

use("restaurantdb");
db.restaurants.find(
  {
    "grades": {
      $elemMatch: {
        "date": {
            "$gte": ISODate("2014-01-01T00:00:00Z"), 
            "$lte": ISODate("2015-12-31T23:59:59Z")
          }
        , 
        "score": {
            "$gt": 70,
            "$lte": 90
          }
      },
    },
  }, 
  {
    id_restaurant:1, "grades.score":1
  }
);

// ------------------------------------------------------------------------
// 11. Agregar dos nuevas calificaciones al restaurante cuyo id es "50018608". 
// A continuación se especifican las calificaciones a agregar en una sola consulta.

use("restaurantdb");
db.restaurants.findOne();

use("restaurantdb");
db.restaurants.find({ restaurant_id: "50018608" });

use("restaurantdb");
db.restaurants.updateOne(
  { 
    "restaurant_id": "50018608" 
  },
  {
    $push: {
      grades: {
        $each: [
          {
            "date": ISODate("2019-10-10T00:00:00Z"),
            "grade": "A",
            "score": 18
          },
          {
            "date": ISODate("2020-02-25T00:00:00Z"),
            "grade": "A",
            "score": 21
          }
        ]
      }
    }
  }
);
